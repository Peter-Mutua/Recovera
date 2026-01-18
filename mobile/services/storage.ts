import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';

// Simplified for demonstration - in production, use proper encryption
export class SecureStorage {
    static async saveAuthToken(token: string): Promise<void> {
        await SecureStore.setItemAsync('authToken', token);
    }

    static async getAuthToken(): Promise<string | null> {
        return await SecureStore.getItemAsync('authToken');
    }

    static async saveUserId(userId: string): Promise<void> {
        await SecureStore.setItemAsync('userId', userId);
    }

    static async getUserId(): Promise<string | null> {
        return await SecureStore.getItemAsync('userId');
    }

    static async clearAuth(): Promise<void> {
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('userId');
    }
}

// Local database for recovered messages
export class LocalDatabase {
    private db: SQLite.SQLiteDatabase;

    constructor() {
        this.db = SQLite.openDatabaseSync('recovera.db');
        this.initialize();
    }

    private initialize() {
        this.db.execSync(`
      CREATE TABLE IF NOT EXISTS recovered_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT NOT NULL,
        sender TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `);
    }

    addMessage(source: string, sender: string, content: string, timestamp: number) {
        this.db.runSync(
            'INSERT INTO recovered_messages (source, sender, content, timestamp) VALUES (?, ?, ?, ?)',
            [source, sender, content, timestamp]
        );
    }

    getAllMessages() {
        return this.db.getAllSync('SELECT * FROM recovered_messages ORDER BY timestamp DESC');
    }

    clearAll() {
        this.db.runSync('DELETE FROM recovered_messages');
    }
}
