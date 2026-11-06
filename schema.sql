CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY,value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY,username TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,salt TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY,expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS participants (token_hash TEXT PRIMARY KEY,last_submission INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS submissions (id TEXT PRIMARY KEY,participant_hash TEXT NOT NULL,object_key TEXT UNIQUE NOT NULL,status TEXT NOT NULL,created_at INTEGER NOT NULL,expires_at INTEGER NOT NULL,mime TEXT NOT NULL,size INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS idx_submissions_expiry ON submissions(expires_at,status);
INSERT OR IGNORE INTO settings(key,value) VALUES ('event', '{"name":"Video Booth","open":true,"duration":5,"countdown":3,"cooldown":5,"retention":2,"portraitOverlay":"","landscapeOverlay":""}');