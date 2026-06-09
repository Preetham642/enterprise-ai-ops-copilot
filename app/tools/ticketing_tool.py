from app.database import create_ticket_record
from datetime import datetime


def create_incident_ticket(
    summary: str,
    severity: str,
    assigned_team: str
):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    ticket = {
        "ticket_id": f"INC-{timestamp}",
        "summary": summary,
        "severity": severity,
        "status": "CREATED",
        "assigned_team": assigned_team
    }

    create_ticket_record(
        ticket_id=ticket["ticket_id"],
        summary=ticket["summary"],
        severity=ticket["severity"],
        status=ticket["status"],
        assigned_team=ticket["assigned_team"]
    )

    return ticket