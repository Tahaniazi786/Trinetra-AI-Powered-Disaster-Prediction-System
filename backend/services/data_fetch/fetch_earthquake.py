import requests

def get_earthquake_data():
    try:
        url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
        response = requests.get(url)
        data = response.json()

        if data["features"]:
            quake = data["features"][0]
            magnitude = quake["properties"]["mag"]
            coords = quake["geometry"]["coordinates"]

            return {
                "magnitude": magnitude,
                "lat": coords[1],
                "lon": coords[0]
            }

        return {"magnitude": 0, "lat": 28.6, "lon": 77.2}

    except:
        return {"magnitude": 0, "lat": 28.6, "lon": 77.2}