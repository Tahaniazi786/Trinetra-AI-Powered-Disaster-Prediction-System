"""
Enhanced Humanitarian Response System
Provides disaster-specific and risk-level-specific recommendations.
"""


def humanitarian_response(risk_level: str, disaster_type: str = "Normal") -> dict:
    """
    Generate comprehensive humanitarian response based on risk level and disaster type.
    Returns alert info, aid actions, and safety recommendations.
    """

    base_response = {
        "alert": "",
        "alert_level": risk_level,
        "aid_actions": [],
        "safety_tips": [],
        "emergency_contacts": [
            "National Disaster Management: 1078",
            "Police: 100",
            "Ambulance: 108",
            "Fire: 101",
        ],
    }

    # ========================
    # RISK-LEVEL BASED ACTIONS
    # ========================
    if risk_level == "critical":
        base_response["alert"] = "🚨 CRITICAL DISASTER ALERT - IMMEDIATE ACTION REQUIRED"
        base_response["aid_actions"] = [
            "IMMEDIATE evacuation to designated shelters",
            "Deploy all rescue and relief teams",
            "Activate emergency communication systems",
            "Send emergency food, water, and medical supplies",
            "Establish temporary shelters and relief camps",
            "Deploy medical teams and field hospitals",
            "Coordinate with military for rescue operations",
            "Issue public broadcast warnings",
        ]
        base_response["safety_tips"] = [
            "Follow official evacuation orders immediately",
            "Take emergency supplies (water, food, medicine, documents)",
            "Stay away from damaged buildings and structures",
            "Do not attempt to cross flooded areas",
            "Keep mobile phones charged for emergency contact",
            "Help elderly, disabled, and children to safety",
        ]

    elif risk_level == "high":
        base_response["alert"] = "⚠️ HIGH DISASTER RISK - PREPARE FOR EMERGENCY"
        base_response["aid_actions"] = [
            "Prepare evacuation shelters and routes",
            "Pre-position rescue teams and equipment",
            "Stock emergency food, water, and medicine",
            "Alert hospitals and medical facilities",
            "Prepare emergency communication channels",
            "Deploy early warning systems",
        ]
        base_response["safety_tips"] = [
            "Prepare emergency kit (water, food, first aid, flashlight)",
            "Identify nearest shelter and evacuation route",
            "Avoid unnecessary travel",
            "Stay indoors away from windows",
            "Keep important documents in waterproof bag",
            "Monitor official news and weather updates continuously",
        ]

    elif risk_level == "moderate":
        base_response["alert"] = "⚡ MODERATE RISK - STAY ALERT AND PREPARED"
        base_response["aid_actions"] = [
            "Issue pre-warning to local authorities",
            "Prepare emergency shelters on standby",
            "Stock basic supplies at distribution centers",
            "Alert local medical facilities",
        ]
        base_response["safety_tips"] = [
            "Prepare emergency supplies (food, water, medicine)",
            "Check drainage systems and clear blockages",
            "Secure loose outdoor objects",
            "Stay informed through weather updates",
            "Have evacuation plan ready",
            "Keep emergency contacts accessible",
        ]

    elif risk_level == "low":
        base_response["alert"] = "ℹ️ LOW RISK - CONTINUE NORMAL ACTIVITIES WITH AWARENESS"
        base_response["aid_actions"] = [
            "Continue routine monitoring",
            "Alert local authorities of developing situation",
            "Ensure emergency systems are functional",
        ]
        base_response["safety_tips"] = [
            "Monitor weather updates regularly",
            "Keep emergency contact numbers ready",
            "Be aware of your surroundings",
            "Know your nearest emergency shelter location",
        ]

    else:
        base_response["alert"] = "✅ NO SIGNIFICANT RISK - NORMAL CONDITIONS"
        base_response["aid_actions"] = [
            "Continue routine weather monitoring",
            "Maintain emergency preparedness",
        ]
        base_response["safety_tips"] = [
            "Stay informed about weather conditions",
            "Keep emergency kit updated periodically",
        ]

    # ========================
    # DISASTER-SPECIFIC TIPS
    # ========================
    disaster_tips = _get_disaster_specific_tips(disaster_type)
    base_response["safety_tips"].extend(disaster_tips)

    return base_response


def _get_disaster_specific_tips(disaster_type: str) -> list:
    """Return disaster-specific safety tips"""

    tips = {
        "Flood": [
            "🌊 Move to higher ground immediately if flooding begins",
            "🌊 Avoid walking or driving through floodwater",
            "🌊 Disconnect electrical appliances when water approaches",
            "🌊 Do not touch electrical equipment if wet or standing in water",
            "🌊 Be cautious of snakes and other animals displaced by flooding",
        ],
        "Cyclone": [
            "🌀 Secure all doors, windows, and shutters",
            "🌀 Stay in the strongest part of the building (interior rooms)",
            "🌀 Move away from coastal areas immediately",
            "🌀 Avoid being near glass windows or doors",
            "🌀 If caught outside, lie flat in a ditch or low area",
        ],
        "Landslide": [
            "⛰️ Evacuate hilly and steep slope areas immediately",
            "⛰️ Listen for unusual sounds (trees cracking, rocks falling)",
            "⛰️ Move to stable, flat ground away from slopes",
            "⛰️ Avoid river valleys and low-lying areas near hills",
            "⛰️ Watch for changes in water flow patterns (turning muddy)",
        ],
        "Earthquake": [
            "🏚️ DROP, COVER, and HOLD ON during shaking",
            "🏚️ Stay away from windows, heavy furniture, and exterior walls",
            "🏚️ If outdoors, move to an open area away from buildings",
            "🏚️ Be prepared for aftershocks - they can be strong",
            "🏚️ Check for gas leaks and structural damage after shaking stops",
        ],
        "Drought": [
            "🏜️ Conserve water - reduce non-essential water usage",
            "🏜️ Stay well hydrated, drink water regularly",
            "🏜️ Avoid outdoor activities during peak heat hours (11am-4pm)",
            "🏜️ Check on elderly, children, and vulnerable individuals",
            "🏜️ Keep rooms cool with proper ventilation",
        ],
    }

    return tips.get(disaster_type, [])


def get_recommendations(risk_level: str, disaster_type: str) -> list:
    """
    Generate a flat list of safety recommendations.
    Used by the frontend prediction page.
    """
    response = humanitarian_response(risk_level, disaster_type)
    recommendations = response["safety_tips"]

    # Add top aid actions as recommendations for high/critical
    if risk_level in ("high", "critical"):
        recommendations = response["aid_actions"][:3] + recommendations

    return recommendations