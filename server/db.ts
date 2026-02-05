import mariadb from 'mariadb';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  connectionLimit: 5
});

export async function initDB() {
  // 1. Initialize Database (Create if not exists)
  // Use a separate connection for DB creation to avoid type conflicts with pool connection
  try {
    const initConnection = await mariadb.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '3306')
    });
    
    // Use string concatenation to avoid template literal escaping issues
    await initConnection.query('CREATE DATABASE IF NOT EXISTS `' + process.env.DB_NAME + '`');
    await initConnection.end();
  } catch (error) {
    console.error('Error creating database:', error);
    // If we can't ensure the DB exists, the next steps will likely fail, but we proceed to try.
  }

  // 2. Initialize Tables
  let connection;
  try {
    // Now connect to the specific database using the pool
    connection = await pool.getConnection();

    // 0. Users Table (for Admin Auth)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if admin user exists, if not create one
    const users = await connection.query('SELECT * FROM users WHERE username = ?', ['admin']);
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await connection.query(
        'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        ['admin', hashedPassword]
      );
      console.log('Default admin user created');
    }

    // 1. News Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS news (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date VARCHAR(255),
        description TEXT,
        content LONGTEXT,
        image LONGTEXT,
        thumbnail LONGTEXT,
        bgImage LONGTEXT,
        tag VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure new columns exist (migration)
    try {
      await connection.query('ALTER TABLE news ADD COLUMN IF NOT EXISTS thumbnail TEXT');
      await connection.query('ALTER TABLE news ADD COLUMN IF NOT EXISTS bgImage TEXT');
      await connection.query('ALTER TABLE news ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      
      await connection.query('ALTER TABLE classes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      await connection.query('ALTER TABLE media ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      
      await connection.query('ALTER TABLE faq ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      await connection.query('ALTER TABLE features ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      await connection.query('ALTER TABLE weapons ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      await connection.query('ALTER TABLE maps ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      await connection.query('ALTER TABLE game_devices ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      await connection.query('ALTER TABLE game_modes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');

      // Migrate TEXT columns to LONGTEXT to support Base64 images
      await connection.query('ALTER TABLE news MODIFY image LONGTEXT');
      await connection.query('ALTER TABLE news MODIFY thumbnail LONGTEXT');
      await connection.query('ALTER TABLE news MODIFY bgImage LONGTEXT');
      await connection.query('ALTER TABLE news MODIFY content LONGTEXT');

      await connection.query('ALTER TABLE classes MODIFY image LONGTEXT');
      await connection.query('ALTER TABLE media MODIFY src LONGTEXT');
      await connection.query('ALTER TABLE media MODIFY thumbnail LONGTEXT');
      await connection.query('ALTER TABLE features MODIFY image LONGTEXT');
      await connection.query('ALTER TABLE weapons MODIFY image LONGTEXT');
      await connection.query('ALTER TABLE maps MODIFY image LONGTEXT');
      await connection.query('ALTER TABLE game_devices MODIFY image LONGTEXT');
      await connection.query('ALTER TABLE game_modes MODIFY image LONGTEXT');
      
      // Check if settings table exists before trying to modify it
      const settingsExists = await connection.query("SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'settings'", [process.env.DB_NAME]);
      if (settingsExists[0].count > 0) {
        await connection.query('ALTER TABLE settings MODIFY logo_url LONGTEXT');
        await connection.query('ALTER TABLE settings MODIFY favicon_url LONGTEXT');
        await connection.query('ALTER TABLE settings MODIFY og_image LONGTEXT');
      }
      
      console.log('Schema migration completed successfully');
    } catch (e) {
      console.log('Error during schema migration:', e);
    }

    // 2. Classes Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS classes (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        description TEXT,
        details JSON,
        image LONGTEXT,
        icon VARCHAR(255),
        color VARCHAR(255),
        devices JSON,
        devicesUsedTitle VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Media Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS media (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        type VARCHAR(50),
        title VARCHAR(255),
        src LONGTEXT,
        category VARCHAR(255),
        description TEXT,
        thumbnail LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. FAQ Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS faq (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        question TEXT,
        answer TEXT
      )
    `);

    // 5. Features Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS features (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        image LONGTEXT,
        icon VARCHAR(100),
        devices JSON,
        devicesSectionTitle VARCHAR(255)
      )
    `);

    // 6. Pages Table (Privacy, Terms, etc.) - KEEP VARCHAR ID
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id VARCHAR(50) PRIMARY KEY, -- e.g., 'privacy', 'terms'
        title VARCHAR(255),
        lastUpdated VARCHAR(100),
        sections JSON
      )
    `);

    // 7. Weapons Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS weapons (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        name VARCHAR(100),
        category VARCHAR(50),
        description TEXT,
        image LONGTEXT,
        stats JSON,
        attachments JSON
      )
    `);

    // 8. Maps Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS maps (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        name VARCHAR(100),
        description TEXT,
        size VARCHAR(50),
        environment VARCHAR(100),
        image LONGTEXT,
        media JSON
      )
    `);

    // 9. Game Devices Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS game_devices (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        name VARCHAR(100),
        description TEXT,
        details TEXT,
        image LONGTEXT,
        media JSON,
        classRestriction VARCHAR(100)
      )
    `);

    // 10. Game Modes Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS game_modes (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        name VARCHAR(100),
        shortName VARCHAR(50),
        description TEXT,
        rules JSON,
        image LONGTEXT,
        media JSON,
        playerCount VARCHAR(50),
        roundTime VARCHAR(50)
      )
    `);

    // 11. Settings Table
    // Check if table exists
    const tableExists = await connection.query("SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'settings'", [process.env.DB_NAME]);
    
    if (tableExists[0].count > 0) {
      const columns = await connection.query("SHOW COLUMNS FROM settings LIKE 'content'");
      if (columns.length > 0) {
         await connection.query("DROP TABLE settings");
         console.log("Dropped old settings table to migrate to new schema");
      }
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id VARCHAR(50) PRIMARY KEY, -- usually 'main_settings'
        
        -- Branding
        site_name VARCHAR(255),
        site_tagline VARCHAR(255),
        logo_url LONGTEXT,
        favicon_url LONGTEXT,
        copyright_text VARCHAR(255),
        powered_by_text VARCHAR(255),
        
        -- SEO
        seo_title VARCHAR(255),
        seo_description TEXT,
        seo_keywords TEXT, 
        og_image LONGTEXT,
        twitter_handle VARCHAR(100),
        
        -- Complex structures kept as JSON but separated
        social_links JSON,
        theme JSON,
        backgrounds JSON,
        homepage_sections JSON,
        hero JSON,
        cta JSON,
        news_section JSON,
        custom_sections JSON
      )
    `);

    // ID MIGRATION LOGIC (Convert INT to VARCHAR)
    const tablesToMigrate = [
      'news', 'classes', 'media', 'faq', 'features', 
      'weapons', 'maps', 'game_devices', 'game_modes'
    ];

    for (const table of tablesToMigrate) {
      try {
        const columns = await connection.query(`SHOW COLUMNS FROM ${table} LIKE 'id'`);
        if (columns.length > 0) {
          const type = columns[0].Type.toLowerCase();
          // If type contains 'int', we need to migrate
          if (type.includes('int')) {
            console.log(`Migrating ${table} ID from INT to VARCHAR...`);
            // 1. Remove AUTO_INCREMENT (by modifying column to INT NOT NULL)
            await connection.query(`ALTER TABLE ${table} MODIFY id INT NOT NULL`);
            // 2. Change to VARCHAR
            await connection.query(`ALTER TABLE ${table} MODIFY id VARCHAR(36) NOT NULL`);
            console.log(`Migrated ${table} ID successfully.`);
          }
        }
      } catch (e) {
        console.error(`Error migrating ID for table ${table}:`, e);
      }
    }

    console.log('Database initialized successfully with normalized tables');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) connection.release();
  }
}

export default pool;
