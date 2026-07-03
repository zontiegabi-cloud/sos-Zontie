import express from 'express';
import pool, { initDB } from '../db';
import {
  CreateFeaturedContent,
  CreateHeroBanner,
  FeaturedContentItem,
  HomepageHeroBanner,
  AnyObject
} from '../lib/featured-content';

const router = express.Router();

// ===================================================================
// FEATURED CONTENT API ROUTES
// ===================================================================
/**
 * GET /api/featured/content - Get all active featured content
 * GET /api/featured/content/all - Get all featured content (including inactive) for admin
 */
router.get('/content', async (req, res) => {
  try {
    const conn = await pool.getConnection();

    try {
      // Get all active featured content with source data
      const results: any[] = await conn.query(
        `SELECT fc.*,
               nc.title as news_title, nc.description as news_description,
               w.name as weapon_name, w.category as weapon_category, w.description as weapon_description,
               c.name as class_name, c.role as class_role, c.description as class_description,
               m.name as map_name, m.description as map_description,
               gd.name as game_device_name, gd.description as game_device_description,
               gm.name as game_mode_name, gm.description as game_mode_description
         FROM featured_content fc
         LEFT JOIN news nc ON (fc.content_source = 'news' AND fc.source_id = nc.id)
         LEFT JOIN weapons w ON (fc.content_source = 'weapons' AND fc.source_id = w.id)
         LEFT JOIN classes c ON (fc.content_source = 'classes' AND fc.source_id = c.id)
         LEFT JOIN maps m ON (fc.content_source = 'maps' AND fc.source_id = m.id)
         LEFT JOIN game_devices gd ON (fc.content_source = 'game_devices' AND fc.source_id = gd.id)
         LEFT JOIN game_modes gm ON (fc.content_source = 'game_modes' AND fc.source_id = gm.id)
         WHERE fc.is_active = 1
         ORDER BY fc.category_group, fc.sort_order`,
        []
      );

      // Transform to include source data
      const featured: any[] = results.map(row => {
      let sourceData: AnyObject = {};
        let displayName = `featured_${row.content_source}`;

        if (row.source_id) {
          if (row.news_title) { sourceData.title = row.news_title; sourceData.description = row.news_description; }
          else if (row.weapon_name) { sourceData.name = row.weapon_name; sourceData.category = row.weapon_category; sourceData.description = row.weapon_description; }
          else if (row.class_name) { sourceData.name = row.class_name; sourceData.role = row.class_role; sourceData.description = row.class_description; }
          else if (row.map_name) { sourceData.name = row.map_name; sourceData.description = row.map_description; }
          else if (row.game_device_name) { sourceData.name = row.game_device_name; sourceData.description = row.game_device_description; }
          else if (row.game_mode_name) { sourceData.name = row.game_mode_name; sourceData.description = row.game_mode_description; }
        }

        return {
          id: row.id,
          contentSource: row.content_source,
          sourceId: row.source_id,
          title: row.title || displayName,
          description: row.description,
          thumbnail: row.thumbnail || undefined,
          sortOrder: row.sort_order,
          categoryGroup: row.category_group,
          isActive: row.is_active
        };
      });

      res.json(featured);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error fetching featured content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/content/all', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const results: any[] = await conn.query(
        `SELECT * FROM featured_content ORDER BY category_group, sort_order`,
        []
      );

      const featured = results.map(row => ({
        id: row.id,
        contentSource: row.content_source,
        sourceId: row.source_id,
        title: row.title,
        description: row.description,
        thumbnail: row.thumbnail,
        sortOrder: row.sort_order,
        categoryGroup: row.category_group,
        isActive: row.is_active
      }));

      res.json(featured);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error fetching all featured content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/featured/content - Create new featured content entry
 */
router.post('/content', async (req, res) => {
  try {
    const data: CreateFeaturedContent = req.body;
    
    if (!data.contentSource || !data.sourceId || data.sortOrder === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();
      
      const insertData = [
        data.contentSource,
        data.sourceId,
        data.title || undefined,
        data.description || null,
        data.thumbnail || null,
        data.sortOrder,
        data.categoryGroup || 'grid-featured',
        typeof data.isActive !== 'undefined' ? (data.isActive ? 1 : 0) : 1
      ];
      
      await conn.query(
        `INSERT INTO featured_content 
         (content_source, source_id, title, description, thumbnail, sort_order, category_group, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        insertData
      );
      
      await conn.commit();
      
      res.status(201).json({ message: 'Featured content created' });
    } catch (error) {
      if (conn) await conn.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error creating featured content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/featured/content/:id - Update featured content
 */
router.put('/content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data: Partial<CreateFeaturedContent> = req.body;
    
    if (!data.contentSource || !data.sourceId) {
      return res.status(400).json({ error: 'Missing contentSource and sourceId' });
    }
    
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();
      
      const updates: string[] = [];
      const values: unknown[] = [];
      
      // Always update contentSource and sourceId
      updates.push('content_source = ?');
      values.push(data.contentSource);
      
      updates.push('source_id = ?');
      values.push(data.sourceId);
      
      if (typeof data.title !== 'undefined') {
        updates.push('title = ?');
        values.push(data.title);
      }
      if (typeof data.description !== 'undefined') {
        updates.push('description = ?');
        values.push(data.description || null);
      }
      if (typeof data.thumbnail !== 'undefined') {
        updates.push('thumbnail = ?');
        values.push(data.thumbnail || null);
      }
      if (typeof data.sortOrder !== 'undefined') {
        updates.push('sort_order = ?');
        values.push(data.sortOrder);
      }
      if (typeof data.categoryGroup !== 'undefined') {
        updates.push('category_group = ?');
        values.push(data.categoryGroup);
      }
      
      if (typeof data.isActive !== 'undefined') {
        updates.push('is_active = ?');
        values.push(data.isActive ? 1 : 0);
      }
      
      // Add id to end of values array
      values.push(id);
      
      if (updates.length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }
      
      await conn.query(
        `UPDATE featured_content
         SET ${updates.join(', ')}
         WHERE id = ?`,
        values
      );
      
      await conn.commit();
      res.json({ message: 'Featured content updated successfully' });
    } catch (error) {
      if (conn) await conn.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating featured content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/featured/content/:id - Remove featured status from content
 */
router.delete('/content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();
      
      await conn.query('UPDATE featured_content SET is_active = 0 WHERE id = ?', [id]);
      await conn.commit();
      
      res.json({ message: 'Featured status removed' });
    } catch (error) {
      if (conn) await conn.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error removing featured content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/featured/homepage - Get active homepage hero banners
 * GET /api/featured/homepage/all - Get all hero banners (including inactive) for admin
 */
router.get('/homepage', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    
    try {
      const bannersFromDb: any[] = await conn.query(
        `SELECT * FROM homepage_hero_banners
         WHERE is_active = 1
         ORDER BY sort_order`,
        []
      );

      // Transform snake_case to camelCase
      const banners = bannersFromDb.map(banner => ({
        id: banner.id,
        bannerUrl: banner.banner_url,
        thumbnailUrl: banner.thumbnail_url,
        title: banner.title,
        description: banner.description,
        callToAction: banner.call_to_action,
        ctaLink: banner.cta_link,
        sortOrder: banner.sort_order,
        isActive: banner.is_active
      }));
      
      res.json(banners);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error fetching hero banners:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/homepage/all', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const bannersFromDb: any[] = await conn.query(
        `SELECT * FROM homepage_hero_banners ORDER BY sort_order`,
        []
      );

      const banners = bannersFromDb.map(banner => ({
        id: banner.id,
        bannerUrl: banner.banner_url,
        thumbnailUrl: banner.thumbnail_url,
        title: banner.title,
        description: banner.description,
        callToAction: banner.call_to_action,
        ctaLink: banner.cta_link,
        sortOrder: banner.sort_order,
        isActive: banner.is_active
      }));

      res.json(banners);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error fetching all hero banners:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/featured/homepage - Create hero banner
 */
router.post('/homepage', async (req, res) => {
  try {
    const data: CreateHeroBanner = req.body;
    
    if (!data.bannerUrl || typeof data.sortOrder === 'undefined') {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();
      
      const insertData = [
        data.bannerUrl,
        data.thumbnailUrl || null,
        data.title || null,
        data.description || null,
        data.callToAction || null,
        data.ctaLink || null,
        data.sortOrder,
        typeof data.isActive !== 'undefined' ? (data.isActive ? 1 : 0) : 1
      ];
      
      await conn.query(
        `INSERT INTO homepage_hero_banners 
         (banner_url, thumbnail_url, title, description, call_to_action, cta_link, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        insertData
      );
      
      await conn.commit();
      
      res.status(201).json({ message: 'Hero banner created' });
    } catch (error) {
      if (conn) await conn.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error creating hero banner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/featured/homepage/:id - Update hero banner
 */
router.put('/homepage/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data: Partial<CreateHeroBanner> = req.body;
    
    if (!data.bannerUrl) {
      return res.status(400).json({ error: 'bannerUrl is required' });
    }
    
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();
      
      const updates: string[] = [];
      const values: unknown[] = [];
      
      if (typeof data.bannerUrl !== 'undefined') {
        updates.push('banner_url = ?');
        values.push(data.bannerUrl);
      }
      if (typeof data.thumbnailUrl !== 'undefined') {
        updates.push('thumbnail_url = ?');
        values.push(data.thumbnailUrl || null);
      }
      if (typeof data.title !== 'undefined') {
        updates.push('title = ?');
        values.push(data.title || null);
      }
      if (typeof data.description !== 'undefined') {
        updates.push('description = ?');
        values.push(data.description || null);
      }
      if (typeof data.callToAction !== 'undefined') {
        updates.push('call_to_action = ?');
        values.push(data.callToAction || null);
      }
      if (typeof data.ctaLink !== 'undefined') {
        updates.push('cta_link = ?');
        values.push(data.ctaLink || null);
      }
      if (typeof data.sortOrder !== 'undefined') {
        updates.push('sort_order = ?');
        values.push(data.sortOrder);
      }
      
      if (typeof data.isActive !== 'undefined') {
        updates.push('is_active = ?');
        values.push(data.isActive ? 1 : 0);
      }
      
      // Add id to end of values array
      values.push(id);
      
      if (updates.length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }
      
      await conn.query(
        `UPDATE homepage_hero_banners
         SET ${updates.join(', ')}
         WHERE id = ?`,
        values
      );
      
      await conn.commit();
      res.json({ message: 'Hero banner updated successfully' });
    } catch (error) {
      if (conn) await conn.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating hero banner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/featured/homepage/:id - Remove hero banner
 */
router.delete('/homepage/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();
      
      await conn.query('UPDATE homepage_hero_banners SET is_active = 0 WHERE id = ?', [id]);
      await conn.commit();
      
      res.json({ message: 'Hero banner deactivated' });
    } catch (error) {
      if (conn) await conn.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deactivating hero banner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
