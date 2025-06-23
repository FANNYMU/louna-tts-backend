import Database from 'better-sqlite3';
import path from 'path';

import fs from 'fs';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'history.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS donation_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    message TEXT,
    amount REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    message TEXT,
    platform TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export const saveDonation = (name: string, message: string, amount: number) => {
  const stmt = db.prepare('INSERT INTO donation_history (name, message, amount) VALUES (?, ?, ?)');
  return stmt.run(name, message, amount);
};

export const saveChat = (username: string, message: string, platform: string) => {
  const stmt = db.prepare('INSERT INTO chat_history (username, message, platform) VALUES (?, ?, ?)');
  return stmt.run(username, message, platform);
};

export const getRecentDonations = (limit: number = 10) => {
  const stmt = db.prepare('SELECT * FROM donation_history ORDER BY timestamp DESC LIMIT ?');
  return stmt.all(limit);
};

export const getRecentChats = (limit: number = 10) => {
  const stmt = db.prepare('SELECT * FROM chat_history ORDER BY timestamp DESC LIMIT ?');
  return stmt.all(limit);
};

export const getDonationsByUser = (name: string, limit: number = 10) => {
  const stmt = db.prepare('SELECT * FROM donation_history WHERE name = ? ORDER BY timestamp DESC LIMIT ?');
  return stmt.all(name, limit);
};

export const getChatsByUser = (username: string, limit: number = 10) => {
  const stmt = db.prepare('SELECT * FROM chat_history WHERE username = ? ORDER BY timestamp DESC LIMIT ?');
  return stmt.all(username, limit);
};

export const getTotalDonationAmount = (name: string) => {
  const stmt = db.prepare('SELECT SUM(amount) as total FROM donation_history WHERE name = ?');
  return stmt.get(name);
};

export const getTopDonators = (limit: number = 10) => {
  const stmt = db.prepare('SELECT name, SUM(amount) as total FROM donation_history GROUP BY name ORDER BY total DESC LIMIT ?');
  return stmt.all(limit);
};

export const getMostActiveUsers = (platform: string, limit: number = 10) => {
  const stmt = db.prepare('SELECT username, COUNT(*) as message_count FROM chat_history WHERE platform = ? GROUP BY username ORDER BY message_count DESC LIMIT ?');
  return stmt.all(platform, limit);
};