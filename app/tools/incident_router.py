def detect_incident_context(message: str):
    text = message.lower()

    if any(word in text for word in ["login", "auth", "authentication", "password", "signin", "sign in"]):
        return {
            "service": "auth-api",
            "severity": "SEV-1",
            "assigned_team": "Identity Engineering",
            "summary": "Authentication issues impacting user login"
        }

    if any(word in text for word in ["database", "db", "latency", "query", "slow"]):
        return {
            "service": "postgres-db",
            "severity": "SEV-2",
            "assigned_team": "Database Engineering",
            "summary": "Database latency or performance degradation detected"
        }

    if any(word in text for word in ["payment", "checkout", "transaction", "card", "billing"]):
        return {
            "service": "payment-api",
            "severity": "SEV-2",
            "assigned_team": "Payments Engineering",
            "summary": "Payment or checkout failures detected"
        }

    if any(word in text for word in ["inventory", "sync", "stock", "warehouse"]):
        return {
            "service": "inventory-api",
            "severity": "SEV-2",
            "assigned_team": "Inventory Engineering",
            "summary": "Inventory synchronization issue detected"
        }

    if any(word in text for word in ["security", "api key", "secret", "token", "breach"]):
        return {
            "service": "security-service",
            "severity": "SEV-1",
            "assigned_team": "Security Engineering",
            "summary": "Security-related incident detected"
        }

    return {
        "service": "unknown-service",
        "severity": "SEV-3",
        "assigned_team": "Operations Team",
        "summary": "General operational issue detected"
    }