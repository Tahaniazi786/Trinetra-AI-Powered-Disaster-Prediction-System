import requests

def get_fire_data():
    try:
        url = "https://firms.modaps.eosdis.nasa.gov/api/area/csv/1/VIIRS_SNPP_NRT/20,70,30,90/1"
        response = requests.get(url)

        if response.status_code != 200:
            return {"fire_risk": 0, "lat": 28.6, "lon": 77.2}

        lines = response.text.split("\n")

        if len(lines) <= 1:
            return {"fire_risk": 0, "lat": 28.6, "lon": 77.2}

        fire_count = len(lines) - 1

        fire_risk = min(fire_count * 5, 100)

        # ✅ Approx India center (or improve later)
        return {
            "fire_risk": fire_risk,
            "lat": 28.6,
            "lon": 77.2
        }

    except:
        return {"fire_risk": 0, "lat": 28.6, "lon": 77.2}