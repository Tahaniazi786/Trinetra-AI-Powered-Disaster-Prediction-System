"""
Enhanced Risk Classification System
Provides granular risk levels with detailed descriptions.
"""

DISASTER_TYPES = {
    0: "Normal",
    1: "Flood",
    2: "Cyclone",
    3: "Landslide",
    4: "Earthquake",
    5: "Drought",
}


def classify_risk(probability: float) -> str:
    """
    Classify risk level based on probability (0.0 to 1.0).
    Returns: 'critical', 'high', 'moderate', 'low', 'no risk'
    """
    if probability >= 0.85:
        return "critical"
    elif probability >= 0.60:
        return "high"
    elif probability >= 0.30:
        return "moderate"
    elif probability >= 0.10:
        return "low"
    else:
        return "no risk"


def get_risk_color(risk_level: str) -> str:
    """Return color hex for the risk level"""
    colors = {
        "critical": "#ef4444",
        "high": "#f97316",
        "moderate": "#eab308",
        "low": "#22c55e",
        "no risk": "#6b7280",
    }
    return colors.get(risk_level, "#6b7280")


def get_risk_description(risk_level: str) -> str:
    """Return human-readable risk description"""
    descriptions = {
        "critical": "IMMEDIATE ACTION REQUIRED - Extremely high disaster probability",
        "high": "WARNING - High disaster probability, prepare for emergency",
        "moderate": "CAUTION - Moderate risk detected, stay alert and monitor",
        "low": "ADVISORY - Low risk, continue normal activities with awareness",
        "no risk": "SAFE - No significant disaster risk detected",
    }
    return descriptions.get(risk_level, "Unknown risk level")


def get_disaster_type_name(type_id: int) -> str:
    """Convert disaster type ID to readable name"""
    return DISASTER_TYPES.get(type_id, "Unknown")