import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "node:fs";
import Database from "better-sqlite3";
import { componentTagger } from "lovable-tagger";

const tables: Record<string, string> = {
  works: "title TEXT NOT NULL, composer TEXT DEFAULT '', lyricist TEXT DEFAULT '', publisher TEXT DEFAULT '', notes TEXT DEFAULT '', created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP",
  tracks: "work_id TEXT, title TEXT NOT NULL, version_name TEXT DEFAULT '', track_type TEXT DEFAULT 'Original', parent_track_id TEXT, remixer_artist TEXT DEFAULT '', artist TEXT NOT NULL, featured_artists TEXT DEFAULT '', genre TEXT DEFAULT '', subgenre TEXT DEFAULT '', bpm INTEGER DEFAULT 0, musical_key TEXT DEFAULT '', duration TEXT DEFAULT '', isrc TEXT DEFAULT '', language TEXT DEFAULT '', explicit_flag INTEGER DEFAULT 0, audio_file TEXT, cover_art TEXT, description TEXT DEFAULT '', lyrics TEXT DEFAULT '', status TEXT DEFAULT 'Draft', created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP, album_artist TEXT DEFAULT '', year INTEGER DEFAULT 0, track_number INTEGER DEFAULT 0, disc_number INTEGER DEFAULT 1, publisher TEXT DEFAULT '', composer TEXT DEFAULT '', conductor TEXT DEFAULT '', comment TEXT DEFAULT '', grouping TEXT DEFAULT '', audio_file_type TEXT DEFAULT '', file_size INTEGER DEFAULT 0, channels TEXT DEFAULT '', bitrate TEXT DEFAULT '', sample_rate TEXT DEFAULT '', loudness_level TEXT DEFAULT '', encoder TEXT DEFAULT '', play_count INTEGER DEFAULT 0, last_played_at TEXT, musicians TEXT DEFAULT '', additional_contributors TEXT DEFAULT '', upc TEXT DEFAULT '', release_type TEXT DEFAULT '', release_date TEXT DEFAULT '', id3_metadata TEXT DEFAULT '', riff_metadata TEXT DEFAULT '', track_notes TEXT DEFAULT '', catalog_tags TEXT DEFAULT '', waveform_peaks TEXT DEFAULT '[]'",
  albums: "title TEXT NOT NULL, artist TEXT NOT NULL, release_type TEXT DEFAULT 'Album', release_date TEXT DEFAULT '', label TEXT DEFAULT '', catalog_number TEXT DEFAULT '', upc TEXT DEFAULT '', cover_art TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP",
  album_tracks: "album_id TEXT NOT NULL, track_id TEXT NOT NULL, track_number INTEGER DEFAULT 1",
  releases: "title TEXT NOT NULL, type TEXT DEFAULT 'track', reference_id TEXT DEFAULT '', planned_release_date TEXT DEFAULT '', distributor_submission_date TEXT DEFAULT '', marketing_start_date TEXT DEFAULT '', status TEXT DEFAULT 'Draft', created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP",
  distributors: "name TEXT NOT NULL, contact_email TEXT DEFAULT '', submission_format TEXT DEFAULT '', delivery_method TEXT DEFAULT '', notes TEXT DEFAULT '', distribution_status TEXT DEFAULT 'Active', created_at TEXT DEFAULT CURRENT_TIMESTAMP",
  promotion_channels: "platform TEXT NOT NULL, contact_person TEXT DEFAULT '', email TEXT DEFAULT '', notes TEXT DEFAULT '', created_at TEXT DEFAULT CURRENT_TIMESTAMP",
  promo_tasks: "campaign_name TEXT NOT NULL, track_or_album TEXT DEFAULT '', platform TEXT DEFAULT '', scheduled_date TEXT DEFAULT '', content_type TEXT DEFAULT '', status TEXT DEFAULT 'Draft', created_at TEXT DEFAULT CURRENT_TIMESTAMP",
  production_tasks: "title TEXT NOT NULL, track_title TEXT DEFAULT '', release_id TEXT, phase TEXT DEFAULT 'writing', start_date TEXT DEFAULT '', end_date TEXT DEFAULT '', progress INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP",
  production_subtasks: "production_task_id TEXT NOT NULL, title TEXT NOT NULL, start_date TEXT DEFAULT '', end_date TEXT DEFAULT '', type TEXT DEFAULT 'production', completed INTEGER DEFAULT 0",
  track_relationships: "source_track_id TEXT NOT NULL, target_track_id TEXT NOT NULL, relationship_type TEXT NOT NULL, notes TEXT DEFAULT '', created_at TEXT DEFAULT CURRENT_TIMESTAMP",
  track_audio_files: "track_id TEXT NOT NULL, file_url TEXT NOT NULL, file_format TEXT NOT NULL, file_size INTEGER DEFAULT 0, is_primary INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP",
  track_distributors: "track_id TEXT NOT NULL, distributor_id TEXT NOT NULL",
  track_promotions: "track_id TEXT NOT NULL, promo_task_id TEXT NOT NULL",
  social_links: "platform TEXT NOT NULL, url TEXT DEFAULT '', created_at TEXT DEFAULT CURRENT_TIMESTAMP",
};

function localApi() {
  const databasePath = path.resolve(__dirname, "data/relizo.sqlite");
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const db = new Database(databasePath);
  for (const [table, columns] of Object.entries(tables)) db.exec(`CREATE TABLE IF NOT EXISTS ${table} (id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))), ${columns})`);
  const json = (res: any, status: number, body: any) => { res.statusCode = status; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(body)); };
  const readBody = (req: any) => new Promise<any>((resolve, reject) => { let raw = ""; req.on("data", (chunk: Buffer) => raw += chunk); req.on("end", () => resolve(raw ? JSON.parse(raw) : {})); req.on("error", reject); });
  const sqliteBind = (key: string, value: any) => {
    if (key === "waveform_peaks") return JSON.stringify(value ?? []);
    if (typeof value === "boolean") return value ? 1 : 0;
    if (typeof value === "number" && !Number.isFinite(value)) return null;
    if (value === undefined) return null;
    if (value !== null && typeof value === "object") return JSON.stringify(value);
    return value;
  };
  return { name: "local-sqlite-api", configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (!req.url?.startsWith("/api/")) return next();
      try {
        const url = new URL(req.url, "http://localhost");
        if (url.pathname === "/api/files" && req.method === "POST") {
          const body = await readBody(req); const target = path.resolve("data/uploads", body.path); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, Buffer.from(body.data)); return json(res, 200, { data: null });
        }
        if (url.pathname.startsWith("/api/files/")) { const target = path.resolve("data/uploads", decodeURIComponent(url.pathname.slice(11))); if (!fs.existsSync(target)) return json(res, 404, { error: "File not found" }); res.setHeader("Content-Type", "application/octet-stream"); return fs.createReadStream(target).pipe(res); }
        if (url.pathname === "/api/process-audio") return json(res, 200, { data: { peaks: [] } });
        const table = url.pathname.match(/^\/api\/db\/([a-z_]+)$/)?.[1]; if (!table || !tables[table]) return json(res, 404, { error: "Unknown local table" });
        const filters = Object.fromEntries(url.searchParams.entries()); delete filters.order; delete filters.ascending; delete filters.single;
        if (req.method === "GET") { let sql = `SELECT * FROM ${table}`; const values = Object.values(filters); const keys = Object.keys(filters); if (keys.length) sql += ` WHERE ${keys.map(key => `${key} = ?`).join(" AND ")}`; if (url.searchParams.get("order")) sql += ` ORDER BY ${url.searchParams.get("order")} ${url.searchParams.get("ascending") === "false" ? "DESC" : "ASC"}`; const rows = db.prepare(sql).all(...values).map((row: any) => ({ ...row, explicit_flag: !!row.explicit_flag, completed: !!row.completed, waveform_peaks: JSON.parse(row.waveform_peaks || "[]") })); return json(res, 200, { data: url.searchParams.get("single") === "true" ? (rows[0] || null) : rows }); }
        const body = await readBody(req); const operation = body.operation; const keys = Object.keys(body.payload || {}); const values = keys.map(key => sqliteBind(key, body.payload[key])); let result: any;
        if (operation === "insert") { const rows = Array.isArray(body.payload) ? body.payload : [body.payload]; result = rows.map((row: any) => { const cols = Object.keys(row); const vals = cols.map(key => sqliteBind(key, row[key])); const id = crypto.randomUUID().replaceAll("-", ""); db.prepare(`INSERT INTO ${table} (id, ${cols.join(",")}) VALUES (?, ${cols.map(() => "?").join(",")})`).run(id, ...vals); return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id); }); result = Array.isArray(body.payload) ? result : result[0]; }
        if (operation === "update") { const where = Object.keys(body.filters || {}); db.prepare(`UPDATE ${table} SET ${keys.map(key => `${key} = ?`).join(", ")} WHERE ${where.map(key => `${key} = ?`).join(" AND ")}`).run(...values, ...Object.values(body.filters || {})); result = db.prepare(`SELECT * FROM ${table} WHERE ${where.map(key => `${key} = ?`).join(" AND ")}`).get(...Object.values(body.filters || {})); }
        if (req.method === "DELETE") { const where = (body.filters && Object.keys(body.filters).length) ? body.filters : filters; db.prepare(`DELETE FROM ${table} WHERE ${Object.keys(where).map(key => `${key} = ?`).join(" AND ")}`).run(...Object.values(where)); result = null; }
        return json(res, 200, { data: result });
      } catch (error: any) { return json(res, 400, { error: error.message }); }
    });
  }};
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), localApi(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
