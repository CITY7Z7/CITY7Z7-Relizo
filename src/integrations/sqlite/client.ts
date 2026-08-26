// SQLite клиент для локального использования
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к базе данных SQLite (в проекте)
const DB_PATH = path.join(__dirname, '..', '..', 'database.sqlite');

let db: Database.Database;

export function getDatabase(): Database.Database {
  if (!db) {
    // Создаем новую базу данных или открываем существующую
    db = new Database(DB_PATH);
    
    // Включаем foreign keys
    db.pragma('foreign_keys = ON');
    
    // Создаём таблицы при первом запуске
    createTables();
  }
  return db;
}

function createTables() {
  const db = getDatabase();
  
  // WORKS
  db.exec(`
    CREATE TABLE IF NOT EXISTS works (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      genre TEXT,
      year INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // TRACKS
  db.exec(`
    CREATE TABLE IF NOT EXISTS tracks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      duration INTEGER, -- в секундах
      file_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // ALBUMS
  db.exec(`
    CREATE TABLE IF NOT EXISTS albums (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      artist TEXT,
      year INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // ALBUM_TRACKS (связь)
  db.exec(`
    CREATE TABLE IF NOT EXISTS album_tracks (
      id TEXT PRIMARY KEY,
      album_id TEXT NOT NULL,
      track_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      FOREIGN KEY (album_id) REFERENCES albums(id),
      FOREIGN KEY (track_id) REFERENCES tracks(id)
    );
  `);
  
  // RELEASES
  db.exec(`
    CREATE TABLE IF NOT EXISTS releases (
      id TEXT PRIMARY KEY,
      work_id TEXT NOT NULL,
      release_date DATE,
      label TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (work_id) REFERENCES works(id)
    );
  `);
  
  // DISTRIBUTORS
  db.exec(`
    CREATE TABLE IF NOT EXISTS distributors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT,
      contact_email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // TRACK_DISTRIBUTORS (связь)
  db.exec(`
    CREATE TABLE IF NOT EXISTS track_distributors (
      id TEXT PRIMARY KEY,
      track_id TEXT NOT NULL,
      distributor_id TEXT NOT NULL,
      FOREIGN KEY (track_id) REFERENCES tracks(id),
      FOREIGN KEY (distributor_id) REFERENCES distributors(id)
    );
  `);
  
  // PROMOTION_CHANNELS
  db.exec(`
    CREATE TABLE IF NOT EXISTS promotion_channels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      platform TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // PROMO_TASKS
  db.exec(`
    CREATE TABLE IF NOT EXISTS promo_tasks (
      id TEXT PRIMARY KEY,
      channel_id TEXT NOT NULL,
      task_type TEXT,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (channel_id) REFERENCES promotion_channels(id)
    );
  `);
  
  // PRODUCTION_TASKS
  db.exec(`
    CREATE TABLE IF NOT EXISTS production_tasks (
      id TEXT PRIMARY KEY,
      work_id TEXT NOT NULL,
      task_type TEXT,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (work_id) REFERENCES works(id)
    );
  `);
  
  // PRODUCTION_SUBTASKS
  db.exec(`
    CREATE TABLE IF NOT EXISTS production_subtasks (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      completed_at DATETIME,
      FOREIGN KEY (task_id) REFERENCES production_tasks(id)
    );
  `);
  
  // TRACK_RELATIONSHIPS
  db.exec(`
    CREATE TABLE IF NOT EXISTS track_relationships (
      id TEXT PRIMARY KEY,
      track_a_id TEXT NOT NULL,
      track_b_id TEXT NOT NULL,
      relationship_type TEXT,
      notes TEXT,
      FOREIGN KEY (track_a_id) REFERENCES tracks(id),
      FOREIGN KEY (track_b_id) REFERENCES tracks(id)
    );
  `);
  
  // SOCIAL_LINKS
  db.exec(`
    CREATE TABLE IF NOT EXISTS social_links (
      id TEXT PRIMARY KEY,
      track_id TEXT,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      verified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (track_id) REFERENCES tracks(id)
    );
  `);
}

// Типы для TypeScript
export type DbWork = {
  id: string;
  title: string;
  description?: string;
  genre?: string;
  year?: number;
  created_at: string;
  updated_at: string;
};

export type DbTrack = {
  id: string;
  title: string;
  duration?: number;
  file_path?: string;
  created_at: string;
  updated_at: string;
};

export type DbAlbum = {
  id: string;
  title: string;
  artist?: string;
  year?: number;
  created_at: string;
  updated_at: string;
};

export type DbRelease = {
  id: string;
  work_id: string;
  release_date?: string;
  label?: string;
  created_at: string;
};

export type DbDistributor = {
  id: string;
  name: string;
  country?: string;
  contact_email?: string;
  created_at: string;
};