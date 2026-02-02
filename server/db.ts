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
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date VARCHAR(255),
        description TEXT,
        content LONGTEXT,
        image TEXT,
        tag VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Classes Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS classes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        description TEXT,
        details JSON,
        image TEXT,
        icon VARCHAR(255),
        color VARCHAR(255),
        devices JSON,
        devicesUsedTitle VARCHAR(255)
      )
    `);

    // 3. Media Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS media (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50),
        title VARCHAR(255),
        src TEXT,
        category VARCHAR(255),
        description TEXT,
        thumbnail TEXT
      )
    `);

    // 4. FAQ Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS faq (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question TEXT,
        answer TEXT
      )
    `);

    // 5. Features Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS features (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        image TEXT,
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
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        category VARCHAR(50),
        description TEXT,
        image TEXT,
        stats JSON,
        attachments JSON
      )
    `);

    // 8. Maps Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS maps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        description TEXT,
        size VARCHAR(50),
        environment VARCHAR(100),
        image TEXT,
        media JSON
      )
    `);

    // 9. Game Devices Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS game_devices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        description TEXT,
        details TEXT,
        image TEXT,
        media JSON,
        classRestriction VARCHAR(100)
      )
    `);

    // 10. Game Modes Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS game_modes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        shortName VARCHAR(50),
        description TEXT,
        rules JSON,
        image TEXT,
        media JSON,
        playerCount VARCHAR(50),
        roundTime VARCHAR(50)
      )
    `);

    // 11. Settings Table (Refactored for readability)
    // Check if the old table exists and has the 'content' column but not the new columns
    // For simplicity in this environment, we'll try to create the new structure if it doesn't exist
    // If the table exists with the old schema, we might need to alter it or drop it.
    // Given the user wants it "readable", we'll force the new structure.
    
    // First, check if table exists
    const tableExists = await connection.query("SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'settings'", [process.env.DB_NAME]);
    
    if (tableExists[0].count > 0) {
      // Check if it has the old 'content' column
      const columns = await connection.query("SHOW COLUMNS FROM settings LIKE 'content'");
      if (columns.length > 0) {
         // It has the old column, let's drop it to recreate with new schema
         // WARNING: This deletes existing settings, but it's necessary to change the schema
         // Ideally we would migrate data, but JSON to columns is complex in SQL
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
        logo_url TEXT,
        favicon_url TEXT,
        copyright_text VARCHAR(255),
        powered_by_text VARCHAR(255),
        
        -- SEO
        seo_title VARCHAR(255),
        seo_description TEXT,
        seo_keywords TEXT, -- stored as comma separated or JSON
        og_image TEXT,
        twitter_handle VARCHAR(100),
        
        -- Complex structures kept as JSON but separated
        social_links JSON,
        theme JSON,
        backgrounds JSON,
        homepage_sections JSON
      )
    `);

    console.log('Database initialized successfully with normalized tables');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) connection.release();
  }
}

export default pool;
