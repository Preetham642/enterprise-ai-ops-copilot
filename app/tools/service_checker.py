SERVICE_HEALTH = {
    "payment-api": {
        "service": "payment-api",
        "status": "DEGRADED",
        "availability": "98%"
    },
    "auth-api": {
        "service": "auth-api",
        "status": "DOWN",
        "availability": "72%"
    },
    "postgres-db": {
        "service": "postgres-db",
        "status": "DEGRADED",
        "availability": "85%"
    },
    "inventory-api": {
        "service": "inventory-api",
        "status": "HEALTHY",
        "availability": "99%"
    },
    "security-service": {
        "service": "security-service",
        "status": "DEGRADED",
        "availability": "91%"
    },
    "unknown-service": {
        "service": "unknown-service",
        "status": "UNKNOWN",
        "availability": "N/A"
    }
}


def check_service_status(service_name: str):
    return SERVICE_HEALTH.get(
        service_name,
        SERVICE_HEALTH["unknown-service"]
    )