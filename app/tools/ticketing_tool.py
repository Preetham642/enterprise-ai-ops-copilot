def create_incident_ticket(summary: str, severity: str):

    return {
        "ticket_id": "INC-2026-1001",
        "summary": summary,
        "severity": severity,
        "status": "CREATED",
        "assigned_team": "Payments Engineering"
    }