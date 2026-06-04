def check_service_status(service_name: str):

    mock_services = {
        "payment-api": "DEGRADED",
        "database": "HEALTHY",
        "notification-service": "HEALTHY",
        "auth-service": "DEGRADED"
    }

    return {
        "service": service_name,
        "status": mock_services.get(
            service_name,
            "UNKNOWN"
        )
    }