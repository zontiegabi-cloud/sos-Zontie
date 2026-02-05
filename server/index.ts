import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { initDB } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PoolConnection } from 'mariadb';
import { 
  NewsItem, 
  ClassItem, 
  MediaItem, 
  FAQItem, 
  FeatureItem, 
  WeaponItem, 
  MapItem, 
  GameDeviceItem, 
  GameModeItem,
  DynamicContentSource 
} from '../src/lib/content-store';

dotenv.config();

// Helper to format ISO date to MySQL DATETIME (YYYY-MM-DD HH:MM:SS)
const formatDateForDb = (isoDate: string | undefined | null): string | null => {
  if (!isoDate) return null;
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 19).replace('T', ' ');
  } catch (e) {
    return null;
  }
};

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Configure Multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Sanitize filename and append timestamp to avoid collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for large content

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// File Upload Route
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Return the URL to access the file
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename, originalname: req.file.originalname });
});

// GET /api/uploads - List all files in uploads directory
app.get('/api/uploads', (req, res) => {
  try {
    if (!fs.existsSync(uploadDir)) {
      return res.json([]);
    }
    
    const files = fs.readdirSync(uploadDir).map(file => {
      return {
        filename: file,
        url: `${req.protocol}://${req.get('host')}/uploads/${file}`,
      };
    });
    
    res.json(files);
  } catch (error) {
    console.error('Error listing uploads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM users WHERE username = ?', [username || 'admin']); // Default to admin if no username provided for backward compatibility
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role: user.role, username: user.username });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Change Password Route
app.post('/api/change-password', async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  
  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await conn.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, user.id]);

    res.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// GET /users - List all users (Admin only - middleware should check this ideally)
app.get('/api/users', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    // Exclude password_hash from the result
    const users = await conn.query('SELECT id, username, role, created_at FROM users');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// POST /users - Create a new user
app.post('/api/users', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    
    // Check if user exists
    const existing = await conn.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await conn.query(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role]
    );

    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// DELETE /users/:id - Delete a user
app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbRow = Record<string, any>;

// Helper to fetch all data
async function fetchAllData(conn: PoolConnection) {
  const [
    news,
    classes,
    media,
    faq,
    features,
    pages,
    weapons,
    maps,
    gameDevices,
    gameModes,
    settingsRows
  ] = await Promise.all([
    conn.query('SELECT * FROM news'),
    conn.query('SELECT * FROM classes'),
    conn.query('SELECT * FROM media'),
    conn.query('SELECT * FROM faq'),
    conn.query('SELECT * FROM features'),
    conn.query('SELECT * FROM pages'),
    conn.query('SELECT * FROM weapons'),
    conn.query('SELECT * FROM maps'),
    conn.query('SELECT * FROM game_devices'),
    conn.query('SELECT * FROM game_modes'),
    conn.query('SELECT * FROM settings WHERE id = ?', ['main_settings'])
  ]);

  let settings;
  if (settingsRows.length > 0) {
    const row = settingsRows[0];
    
    // Parse JSON strings if they come back as strings (depends on MariaDB driver config, usually objects for JSON columns)
    // But since we might have defined some as TEXT (seo_keywords), handle that.
    
    // Helper to safely parse JSON if it's a string, or return as is if object
    const parse = (val: unknown) => {
        if (typeof val === 'string') {
            try { return JSON.parse(val); } catch (e) { return val; }
        }
        return val;
    };

    settings = {
        branding: {
          siteName: row.site_name,
          siteTagline: row.site_tagline,
          logoUrl: row.logo_url,
          faviconUrl: row.favicon_url,
          copyrightText: row.copyright_text,
          poweredByText: row.powered_by_text
        },
        seo: {
          defaultTitle: row.seo_title,
          defaultDescription: row.seo_description,
          defaultKeywords: typeof row.seo_keywords === 'string' && row.seo_keywords.startsWith('[') ? parse(row.seo_keywords) : (row.seo_keywords ? row.seo_keywords.split(',').map((s:string) => s.trim()) : []),
          ogImage: row.og_image,
          twitterHandle: row.twitter_handle
        },
        socialLinks: parse(row.social_links) || [],
        theme: parse(row.theme) || {},
        backgrounds: parse(row.backgrounds) || {},
        homepageSections: parse(row.homepage_sections) || [],
        hero: parse(row.hero) || {},
        cta: parse(row.cta) || {},
        newsSection: parse(row.news_section) || {},
        customSections: parse(row.custom_sections) || {}
      };
  }

  return {
    news: news.map((i: DbRow) => ({...i, id: i.id.toString(), createdAt: i.created_at})),
    classes: classes.map((i: DbRow) => ({...i, id: i.id.toString(), details: i.details, devices: i.devices, createdAt: i.created_at})),
    media: media.map((i: DbRow) => ({...i, id: i.id.toString(), createdAt: i.created_at})),
    faq: faq.map((i: DbRow) => ({...i, id: i.id.toString(), createdAt: i.created_at})),
    features: features.map((i: DbRow) => ({...i, id: i.id.toString(), devices: i.devices, createdAt: i.created_at})),
    privacy: pages.find((p: DbRow) => p.id === 'privacy') || { title: '', lastUpdated: '', sections: [] },
    terms: pages.find((p: DbRow) => p.id === 'terms') || { title: '', lastUpdated: '', sections: [] },
    weapons: weapons.map((i: DbRow) => ({...i, id: i.id.toString(), stats: i.stats, attachments: i.attachments, createdAt: i.created_at})),
    maps: maps.map((i: DbRow) => ({...i, id: i.id.toString(), media: i.media, createdAt: i.created_at})),
    gameDevices: gameDevices.map((i: DbRow) => ({...i, id: i.id.toString(), media: i.media, createdAt: i.created_at})),
    gameModes: gameModes.map((i: DbRow) => ({...i, id: i.id.toString(), rules: i.rules, media: i.media, createdAt: i.created_at})),
    settings: settings
  };
}

// GET /data - Retrieve site content from normalized tables
app.get('/api/data', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const content = await fetchAllData(conn);
    
    // Allow returning partial data, frontend handles missing settings
    res.json(content);

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// POST /data - Save site content to normalized tables
app.post('/api/data', async (req, res) => {
  let conn;
  try {
    const content = req.body;
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // 1. News
    await conn.query('TRUNCATE TABLE news');
    if (content.news?.length) {
      const batch = content.news.map((item: NewsItem) => [
        item.id, item.title, item.date, item.description, item.content, item.image, item.thumbnail || null, item.bgImage || null, item.tag, item.likes || 0, item.dislikes || 0, formatDateForDb(item.createdAt)
      ]);
      await conn.batch('INSERT INTO news (id, title, date, description, content, image, thumbnail, bgImage, tag, likes, dislikes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', batch);
    }

    // 2. Classes
    await conn.query('TRUNCATE TABLE classes');
    if (content.classes?.length) {
      const batch = content.classes.map((item: ClassItem) => [
        item.id, item.name, item.role, item.description, JSON.stringify(item.details || []), item.image, item.icon, item.color, JSON.stringify(item.devices || []), item.devicesUsedTitle, formatDateForDb(item.createdAt)
      ]);
      await conn.batch('INSERT INTO classes (id, name, role, description, details, image, icon, color, devices, devicesUsedTitle, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', batch);
    }

    // 3. Media
    await conn.query('TRUNCATE TABLE media');
    if (content.media?.length) {
      const batch = content.media.map((item: MediaItem) => [
        item.id, item.type, item.title, item.src, item.category, item.description, item.thumbnail, formatDateForDb(item.createdAt)
      ]);
      await conn.batch('INSERT INTO media (id, type, title, src, category, description, thumbnail, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', batch);
    }

    // 4. FAQ
    await conn.query('TRUNCATE TABLE faq');
    if (content.faq?.length) {
      const batch = content.faq.map((item: FAQItem) => [item.id, item.question, item.answer, formatDateForDb(item.createdAt)]);
      await conn.batch('INSERT INTO faq (id, question, answer, created_at) VALUES (?, ?, ?, ?)', batch);
    }

    // 5. Features
    await conn.query('TRUNCATE TABLE features');
    if (content.features?.length) {
      const batch = content.features.map((item: FeatureItem) => [
        item.id, item.title, item.description, item.image, item.icon, JSON.stringify(item.devices || []), item.devicesSectionTitle, formatDateForDb(item.createdAt)
      ]);
      await conn.batch('INSERT INTO features (id, title, description, image, icon, devices, devicesSectionTitle, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', batch);
    }

    // 6. Pages (Privacy, Terms) - KEEP using DELETE as ID is fixed
    await conn.query('DELETE FROM pages');
    const pagesBatch = [];
    if (content.privacy) pagesBatch.push(['privacy', content.privacy.title, content.privacy.lastUpdated, JSON.stringify(content.privacy.sections)]);
    if (content.terms) pagesBatch.push(['terms', content.terms.title, content.terms.lastUpdated, JSON.stringify(content.terms.sections)]);
    if (pagesBatch.length) {
        await conn.batch('INSERT INTO pages (id, title, lastUpdated, sections) VALUES (?, ?, ?, ?)', pagesBatch);
    }

    // 7. Weapons
    await conn.query('TRUNCATE TABLE weapons');
    if (content.weapons?.length) {
      const batch = content.weapons.map((item: WeaponItem) => [
        item.id, item.name, item.category, item.description, item.image, JSON.stringify(item.stats || {}), JSON.stringify(item.attachments || []), formatDateForDb(item.createdAt)
      ]);
      await conn.batch('INSERT INTO weapons (id, name, category, description, image, stats, attachments, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', batch);
    }

    // 8. Maps
    await conn.query('TRUNCATE TABLE maps');
    if (content.maps?.length) {
      const batch = content.maps.map((item: MapItem) => [
        item.id, item.name, item.description, item.size, item.environment, item.image, JSON.stringify(item.media || []), formatDateForDb(item.createdAt)
      ]);
      await conn.batch('INSERT INTO maps (id, name, description, size, environment, image, media, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', batch);
    }

    // 9. Game Devices
    await conn.query('TRUNCATE TABLE game_devices');
    if (content.gameDevices?.length) {
      const batch = content.gameDevices.map((item: GameDeviceItem) => [
        item.id, item.name, item.description, item.details, item.image, JSON.stringify(item.media || []), item.classRestriction, formatDateForDb(item.createdAt)
      ]);
      await conn.batch('INSERT INTO game_devices (id, name, description, details, image, media, classRestriction, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', batch);
    }

    // 10. Game Modes
    await conn.query('TRUNCATE TABLE game_modes');
    if (content.gameModes?.length) {
      const batch = content.gameModes.map((item: GameModeItem) => [
        item.id, item.name, item.shortName, item.description, JSON.stringify(item.rules || []), item.image, JSON.stringify(item.media || []), item.playerCount, item.roundTime, formatDateForDb(item.createdAt)
      ]);
      await conn.batch('INSERT INTO game_modes (id, name, shortName, description, rules, image, media, playerCount, roundTime, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', batch);
    }

    // 11. Settings (Flattened)
    if (content.settings) {
      const s = content.settings;
      const b = s.branding || {};
      const seo = s.seo || {};
      
      await conn.query(`
        INSERT INTO settings (
          id, 
          site_name, site_tagline, logo_url, favicon_url, copyright_text, powered_by_text,
          seo_title, seo_description, seo_keywords, og_image, twitter_handle,
          social_links, theme, backgrounds, homepage_sections,
          hero, cta, news_section, custom_sections
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          site_name = VALUES(site_name),
          site_tagline = VALUES(site_tagline),
          logo_url = VALUES(logo_url),
          favicon_url = VALUES(favicon_url),
          copyright_text = VALUES(copyright_text),
          powered_by_text = VALUES(powered_by_text),
          seo_title = VALUES(seo_title),
          seo_description = VALUES(seo_description),
          seo_keywords = VALUES(seo_keywords),
          og_image = VALUES(og_image),
          twitter_handle = VALUES(twitter_handle),
          social_links = VALUES(social_links),
          theme = VALUES(theme),
          backgrounds = VALUES(backgrounds),
          homepage_sections = VALUES(homepage_sections),
          hero = VALUES(hero),
          cta = VALUES(cta),
          news_section = VALUES(news_section),
          custom_sections = VALUES(custom_sections)
      `, [
        'main_settings',
        b.siteName || null, b.siteTagline || null, b.logoUrl || null, b.faviconUrl || null, b.copyrightText || null, b.poweredByText || null,
        seo.defaultTitle || null, seo.defaultDescription || null, JSON.stringify(seo.defaultKeywords || []), seo.ogImage || null, seo.twitterHandle || null,
        JSON.stringify(s.socialLinks || {}), JSON.stringify(s.theme || {}), JSON.stringify(s.backgrounds || {}), JSON.stringify(s.homepageSections || {}),
        JSON.stringify(s.hero || {}), JSON.stringify(s.cta || {}), JSON.stringify(s.newsSection || {}),
        JSON.stringify(s.customSections || {})
      ]);
    }

    await conn.commit();
    
    // Fetch the updated data with new IDs
    const updatedContent = await fetchAllData(conn);
    
    res.json({ success: true, message: 'Data saved successfully', data: updatedContent });

  } catch (error) {
    if (conn) await conn.rollback();
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (conn) conn.release();
  }
});

// Initialize DB and start server
initDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
