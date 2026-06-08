import sqlite3
from pathlib import Path

DB_PATH = "tickets.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_id TEXT,
            summary TEXT,
            severity TEXT,
            status TEXT,
            assigned_team TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()


def create_ticket_record(ticket_id, summary, severity, status, assigned_team):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO tickets (
            ticket_id,
            summary,
            severity,
            status,
            assigned_team
        )
        VALUES (?, ?, ?, ?, ?)
    """, (ticket_id, summary, severity, status, assigned_team))

    conn.commit()
    conn.close()


def get_all_tickets():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT ticket_id, summary, severity, status, assigned_team, created_at
        FROM tickets
        ORDER BY created_at DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "ticket_id": row[0],
            "summary": row[1],
            "severity": row[2],
            "status": row[3],
            "assigned_team": row[4],
            "created_at": row[5]
        }
        for row in rows
    ]

def get_ticket_metrics():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM tickets")
    total_tickets = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM tickets WHERE status = 'CREATED'")
    open_tickets = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM tickets WHERE severity = 'SEV-1'")
    critical_alerts = cursor.fetchone()[0]

    conn.close()

    return {
        "incidents_today": total_tickets,
        "open_tickets": open_tickets,
        "critical_alerts": critical_alerts,
        "system_health": "98%"
    }