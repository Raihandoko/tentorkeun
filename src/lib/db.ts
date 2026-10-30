import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "tentorkeun.db");
const db = new Database(dbPath);

export { db };
