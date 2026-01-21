import sqlite3

DB_PATH = "rlhf.db"

def init_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS rlhf_feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prompt TEXT NOT NULL,
        response_1 TEXT NOT NULL,
        response_2 TEXT NOT NULL,
        response_3 TEXT NOT NULL,
        ranking TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()

def get_db():
    return sqlite3.connect(DB_PATH, check_same_thread=False)
