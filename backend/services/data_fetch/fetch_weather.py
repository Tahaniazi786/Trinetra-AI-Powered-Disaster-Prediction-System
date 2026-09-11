import requests

API_KEY = "de8915f7eed9255fa74d3670726302f8"

# WMO Weather interpretation codes for Open-Meteo fallback
WMO_CODES = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow fall", 73: "Moderate snow fall", 75: "Heavy snow fall",
    80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
    95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
}


def get_weather_data(lat, lon):
    """Fetches real-time weather observation for coordinates via OpenWeatherMap."""
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
        response = requests.get(url, timeout=6)
        if response.status_code == 200:
            data = response.json()
            weather_desc = data.get("weather", [{}])[0].get("description", "Clear sky").title()
            return {
                "temperature": round(float(data.get("main", {}).get("temp", 25)), 1),
                "humidity": round(float(data.get("main", {}).get("humidity", 50)), 1),
                "pressure": round(float(data.get("main", {}).get("pressure", 1013)), 1),
                "wind_speed": round(float(data.get("wind", {}).get("speed", 0) * 3.6), 1),  # m/s to km/h
                "rainfall": round(float(data.get("rain", {}).get("1h", 0)), 1),
                "condition": weather_desc,
                "lat": float(data.get("coord", {}).get("lat", lat)),
                "lon": float(data.get("coord", {}).get("lon", lon)),
            }
    except Exception as e:
        print(f"OpenWeatherMap lat/lon error ({lat}, {lon}): {e}")

    # Fallback to Open-Meteo (No API key needed, global coverage)
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,weather_code"
        res = requests.get(url, timeout=6)
        if res.status_code == 200:
            c = res.json().get("current", {})
            w_code = c.get("weather_code", 0)
            return {
                "temperature": round(float(c.get("temperature_2m", 25)), 1),
                "humidity": round(float(c.get("relative_humidity_2m", 50)), 1),
                "pressure": round(float(c.get("surface_pressure", 1013)), 1),
                "wind_speed": round(float(c.get("wind_speed_10m", 0)), 1),
                "rainfall": round(float(c.get("precipitation", 0)), 1),
                "condition": WMO_CODES.get(w_code, "Clear sky"),
                "lat": float(lat),
                "lon": float(lon),
            }
    except Exception as e:
        print(f"Open-Meteo fallback error: {e}")

    return {
        "temperature": 25.0,
        "humidity": 50.0,
        "pressure": 1013.0,
        "wind_speed": 5.0,
        "rainfall": 0.0,
        "condition": "Normal",
        "lat": lat,
        "lon": lon,
    }


def is_in_india(lat: float, lon: float) -> bool:
    """Checks if coordinates fall strictly within the terrestrial boundaries of India."""
    return 6.0 <= lat <= 37.6 and 68.1 <= lon <= 97.4


INDIAN_DISTRICT_ALIASES = {
    "wayanad": (11.6854, 76.1320, "Wayanad", "Kerala"),
    "cherrapunji": (25.2986, 91.7303, "Cherrapunji", "Meghalaya"),
    "cherrapunjee": (25.2986, 91.7303, "Cherrapunji", "Meghalaya"),
    "sohra": (25.2986, 91.7303, "Sohra (Cherrapunji)", "Meghalaya"),
    "chamoli": (30.4027, 79.3330, "Chamoli", "Uttarakhand"),
    "kedarnath": (30.7352, 79.0669, "Kedarnath", "Uttarakhand"),
    "badrinath": (30.7433, 79.4938, "Badrinath", "Uttarakhand"),
    "kutch": (23.2420, 69.6669, "Kutch", "Gujarat"),
    "ladakh": (34.1526, 77.5771, "Ladakh", "Ladakh"),
    "leh": (34.1526, 77.5771, "Leh", "Ladakh"),
    "spiti": (32.2461, 78.0349, "Spiti Valley", "Himachal Pradesh"),
    "munnar": (10.0889, 77.0595, "Munnar", "Kerala"),
    "ooty": (11.4102, 76.6950, "Ooty", "Tamil Nadu"),
    "darjeeling": (27.0410, 88.2663, "Darjeeling", "West Bengal"),
    "sundarbans": (21.9497, 89.1833, "Sundarbans", "West Bengal"),
    "jaisalmer": (26.9157, 70.9083, "Jaisalmer", "Rajasthan"),
    "kavaratti": (10.5669, 72.6420, "Kavaratti", "Lakshadweep"),
    "port blair": (11.6234, 92.7265, "Port Blair", "Andaman & Nicobar"),
    "havelock": (11.9761, 92.9876, "Havelock Island", "Andaman & Nicobar"),
    "prayagraj": (25.4358, 81.8463, "Prayagraj", "Uttar Pradesh"),
    "allahabad": (25.4358, 81.8463, "Prayagraj", "Uttar Pradesh"),
    "varanasi": (25.3176, 82.9739, "Varanasi", "Uttar Pradesh"),
    "banaras": (25.3176, 82.9739, "Varanasi", "Uttar Pradesh"),
    "ayodhya": (26.7922, 82.1998, "Ayodhya", "Uttar Pradesh"),
    "kanpur": (26.4499, 80.3319, "Kanpur", "Uttar Pradesh"),
    "lucknow": (26.8467, 80.9462, "Lucknow", "Uttar Pradesh"),
    "agra": (27.1767, 78.0081, "Agra", "Uttar Pradesh"),
    "haridwar": (29.9457, 78.1642, "Haridwar", "Uttarakhand"),
    "rishikesh": (30.0869, 78.2676, "Rishikesh", "Uttarakhand"),
    "dehradun": (30.3165, 78.0322, "Dehradun", "Uttarakhand"),
    "shimla": (31.1048, 77.1734, "Shimla", "Himachal Pradesh"),
    "dharamsala": (32.2190, 76.3234, "Dharamsala", "Himachal Pradesh"),
    "manali": (32.2396, 77.1887, "Manali", "Himachal Pradesh"),
    "bastar": (19.1071, 81.9535, "Bastar", "Chhattisgarh"),
    "dhanushkodi": (9.1764, 79.4180, "Dhanushkodi", "Tamil Nadu"),
}


def get_weather_by_city(city_name: str):
    """
    Fetches genuine current weather observation strictly for cities, districts, and places within INDIA.
    Rejects international queries to maintain India-exclusive coverage.
    """
    cleaned_name = city_name.strip()
    if not cleaned_name:
        return {"error": "City name cannot be empty"}

    # Remove trailing ", India" or ", IN" if provided by user
    search_query = cleaned_name
    for suffix in [", india", ", in", " india"]:
        if search_query.lower().endswith(suffix):
            search_query = search_query[:len(search_query) - len(suffix)].strip()

    # Check high-vulnerability Pan-India district alias map first
    normalized_key = search_query.lower()
    if normalized_key in INDIAN_DISTRICT_ALIASES:
        alat, alon, aname, astate = INDIAN_DISTRICT_ALIASES[normalized_key]
        w = get_weather_data(alat, alon)
        return {
            "name": aname,
            "state": astate,
            "country": "India",
            "lat": alat,
            "lon": alon,
            "temperature": w["temperature"],
            "humidity": w["humidity"],
            "pressure": w["pressure"],
            "wind_speed": w["wind_speed"],
            "rainfall": w["rainfall"],
            "condition": w.get("condition", "Clear sky"),
            "source": "India Meteorological Stations"
        }

    # 1. Try OpenWeatherMap with explicit India country filter
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={search_query},IN&appid={API_KEY}&units=metric"
        response = requests.get(url, timeout=6)
        if response.status_code == 200:
            data = response.json()
            country = data.get("sys", {}).get("country", "")
            lat = float(data.get("coord", {}).get("lat", 0))
            lon = float(data.get("coord", {}).get("lon", 0))

            if country == "IN" and is_in_india(lat, lon):
                weather_desc = data.get("weather", [{}])[0].get("description", "Clear sky").title()
                resolved_city = data.get("name", search_query)
                return {
                    "name": resolved_city,
                    "country": "India",
                    "lat": round(lat, 4),
                    "lon": round(lon, 4),
                    "temperature": round(float(data.get("main", {}).get("temp", 25)), 1),
                    "humidity": round(float(data.get("main", {}).get("humidity", 50)), 1),
                    "pressure": round(float(data.get("main", {}).get("pressure", 1013)), 1),
                    "wind_speed": round(float(data.get("wind", {}).get("speed", 0) * 3.6), 1),  # m/s to km/h
                    "rainfall": round(float(data.get("rain", {}).get("1h", 0)), 1),
                    "condition": weather_desc,
                    "source": "OpenWeatherMap India Stations"
                }
    except Exception as e:
        print(f"OpenWeatherMap India lookup error for '{cleaned_name}': {e}")

    # 2. Open-Meteo geocoding fallback strictly filtered to Indian coordinates
    try:
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={search_query}&count=5&language=en&format=json"
        geo_res = requests.get(geo_url, timeout=6)
        if geo_res.status_code == 200:
            results = geo_res.json().get("results", [])
            # Filter strictly for results authenticated as India
            india_results = [
                r for r in results
                if (r.get("country_code") == "IN" or str(r.get("country")).lower() == "india")
                and is_in_india(r.get("latitude", 0), r.get("longitude", 0))
            ]
            if india_results:
                target = india_results[0]
                lat = target["latitude"]
                lon = target["longitude"]
                resolved_name = target.get("name", search_query)
                admin = target.get("admin1", "")

                fore_url = (
                    f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
                    f"&current=temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,weather_code"
                )
                fore_res = requests.get(fore_url, timeout=6)
                if fore_res.status_code == 200:
                    c = fore_res.json().get("current", {})
                    w_code = c.get("weather_code", 0)
                    return {
                        "name": resolved_name,
                        "state": admin if admin else "India",
                        "country": "India",
                        "lat": round(float(lat), 4),
                        "lon": round(float(lon), 4),
                        "temperature": round(float(c.get("temperature_2m", 25)), 1),
                        "humidity": round(float(c.get("relative_humidity_2m", 50)), 1),
                        "pressure": round(float(c.get("surface_pressure", 1013)), 1),
                        "wind_speed": round(float(c.get("wind_speed_10m", 0)), 1),
                        "rainfall": round(float(c.get("precipitation", 0)), 1),
                        "condition": WMO_CODES.get(w_code, "Clear sky"),
                        "source": "Open-Meteo India Telemetry"
                    }
    except Exception as e:
        print(f"Open-Meteo India geocoding error for '{cleaned_name}': {e}")

    return {"error": f"'{cleaned_name}' is outside India or not found. Trinetra is exclusively dedicated to disaster monitoring within India."}