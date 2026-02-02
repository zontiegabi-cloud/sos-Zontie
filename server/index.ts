import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { initDB } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for large content

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


// Helper to fetch all data
async function fetchAllData(conn: any) {
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
    settings
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
    conn.query('SELECT content FROM settings WHERE id = ?', ['main_settings'])
  ]);

  return {
    news: news.map((i: any) => ({...i, id: i.id.toString(), created_at: undefined})), // Convert ID to string for frontend compatibility
    classes: classes.map((i: any) => ({...i, id: i.id.toString(), details: i.details, devices: i.devices})),
    media: media.map((i: any) => ({...i, id: i.id.toString()})),
    faq: faq.map((i: any) => ({...i, id: i.id.toString()})),
    features: features.map((i: any) => ({...i, id: i.id.toString(), devices: i.devices})),
    privacy: pages.find((p: any) => p.id === 'privacy') || { title: '', lastUpdated: '', sections: [] },
    terms: pages.find((p: any) => p.id === 'terms') || { title: '', lastUpdated: '', sections: [] },
    weapons: weapons.map((i: any) => ({...i, id: i.id.toString(), stats: i.stats, attachments: i.attachments})),
    maps: maps.map((i: any) => ({...i, id: i.id.toString(), media: i.media})),
    gameDevices: gameDevices.map((i: any) => ({...i, id: i.id.toString(), media: i.media})),
    gameModes: gameModes.map((i: any) => ({...i, id: i.id.toString(), rules: i.rules, media: i.media})),
    settings: settings.length > 0 ? settings[0].content : undefined
  };
}

// GET /data - Retrieve site content from normalized tables
app.get('/api/data', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const content = await fetchAllData(conn);
    
    if (!content.settings && content.news.length === 0) {
       return res.status(404).json({ message: 'No data found' });
    }

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
      const batch = content.news.map((item: any) => [
        item.title, item.date, item.description, item.content, item.image, item.tag
      ]);
      await conn.batch('INSERT INTO news (title, date, description, content, image, tag) VALUES (?, ?, ?, ?, ?, ?)', batch);
    }

    // 2. Classes
    await conn.query('TRUNCATE TABLE classes');
    if (content.classes?.length) {
      const batch = content.classes.map((item: any) => [
        item.name, item.role, item.description, JSON.stringify(item.details), item.image, item.icon, item.color, JSON.stringify(item.devices), item.devicesUsedTitle
      ]);
      await conn.batch('INSERT INTO classes (name, role, description, details, image, icon, color, devices, devicesUsedTitle) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', batch);
    }

    // 3. Media
    await conn.query('TRUNCATE TABLE media');
    if (content.media?.length) {
      const batch = content.media.map((item: any) => [
        item.type, item.title, item.src, item.category, item.description, item.thumbnail
      ]);
      await conn.batch('INSERT INTO media (type, title, src, category, description, thumbnail) VALUES (?, ?, ?, ?, ?, ?)', batch);
    }

    // 4. FAQ
    await conn.query('TRUNCATE TABLE faq');
    if (content.faq?.length) {
      const batch = content.faq.map((item: any) => [item.question, item.answer]);
      await conn.batch('INSERT INTO faq (question, answer) VALUES (?, ?)', batch);
    }

    // 5. Features
    await conn.query('TRUNCATE TABLE features');
    if (content.features?.length) {
      const batch = content.features.map((item: any) => [
        item.title, item.description, item.image, item.icon, JSON.stringify(item.devices), item.devicesSectionTitle
      ]);
      await conn.batch('INSERT INTO features (title, description, image, icon, devices, devicesSectionTitle) VALUES (?, ?, ?, ?, ?, ?)', batch);
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
      const batch = content.weapons.map((item: any) => [
        item.name, item.category, item.description, item.image, JSON.stringify(item.stats), JSON.stringify(item.attachments)
      ]);
      await conn.batch('INSERT INTO weapons (name, category, description, image, stats, attachments) VALUES (?, ?, ?, ?, ?, ?)', batch);
    }

    // 8. Maps
    await conn.query('TRUNCATE TABLE maps');
    if (content.maps?.length) {
      const batch = content.maps.map((item: any) => [
        item.name, item.description, item.size, item.environment, item.image, JSON.stringify(item.media)
      ]);
      await conn.batch('INSERT INTO maps (name, description, size, environment, image, media) VALUES (?, ?, ?, ?, ?, ?)', batch);
    }

    // 9. Game Devices
    await conn.query('TRUNCATE TABLE game_devices');
    if (content.gameDevices?.length) {
      const batch = content.gameDevices.map((item: any) => [
        item.name, item.description, item.details, item.image, JSON.stringify(item.media), item.classRestriction
      ]);
      await conn.batch('INSERT INTO game_devices (name, description, details, image, media, classRestriction) VALUES (?, ?, ?, ?, ?, ?)', batch);
    }

    // 10. Game Modes
    await conn.query('TRUNCATE TABLE game_modes');
    if (content.gameModes?.length) {
      const batch = content.gameModes.map((item: any) => [
        item.name, item.shortName, item.description, JSON.stringify(item.rules), item.image, JSON.stringify(item.media), item.playerCount, item.roundTime
      ]);
      await conn.batch('INSERT INTO game_modes (name, shortName, description, rules, image, media, playerCount, roundTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', batch);
    }

    // 11. Settings
    await conn.query('INSERT INTO settings (id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = ?', 
      ['main_settings', JSON.stringify(content.settings), JSON.stringify(content.settings)]
    );

    await conn.commit();
    
    // Fetch the updated data with new IDs
    const updatedContent = await fetchAllData(conn);
    
    res.json({ success: true, message: 'Data saved successfully', data: updatedContent });

  } catch (error) {
    if (conn) await conn.rollback();
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Internal server error' });
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
