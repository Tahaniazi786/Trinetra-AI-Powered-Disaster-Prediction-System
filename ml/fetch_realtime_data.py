import requests
import pandas as pd
import time
import os

API_KEY = "de8915f7eed9255fa74d3670726302f8"

# 50 major cities globally + disaster prone areas
CITIES = [
    {"name": "Delhi", "lat": 28.6139, "lon": 77.2090},
    {"name": "Mumbai", "lat": 19.0760, "lon": 72.8777},
    {"name": "Chennai", "lat": 13.0827, "lon": 80.2707},
    {"name": "Kolkata", "lat": 22.5726, "lon": 88.3639},
    {"name": "Bangalore", "lat": 12.9716, "lon": 77.5946},
    {"name": "Hyderabad", "lat": 17.3850, "lon": 78.4867},
    {"name": "Guwahati", "lat": 26.1445, "lon": 91.7362},
    {"name": "Jaipur", "lat": 26.9124, "lon": 75.7873},
    {"name": "Dhaka", "lat": 23.8103, "lon": 90.4125},
    {"name": "Manila", "lat": 14.5995, "lon": 120.9842},
    {"name": "Tokyo", "lat": 35.6762, "lon": 139.6503},
    {"name": "Jakarta", "lat": -6.2088, "lon": 106.8456},
    {"name": "Lima", "lat": -12.0464, "lon": -77.0428},
    {"name": "San Francisco", "lat": 37.7749, "lon": -122.4194},
    {"name": "Mexico City", "lat": 19.4326, "lon": -99.1332},
    {"name": "Taipei", "lat": 25.0330, "lon": 121.5654},
    {"name": "Hanoi", "lat": 21.0285, "lon": 105.8542},
    {"name": "Karachi", "lat": 24.8607, "lon": 67.0011},
    {"name": "Bangkok", "lat": 13.7563, "lon": 100.5018},
    {"name": "Cairo", "lat": 30.0444, "lon": 31.2357},
]

def fetch_realtime_weather():
    realtime_data = []
    print("Fetching real-time data from OpenWeatherMap...")
    for city in CITIES:
        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={city['lat']}&lon={city['lon']}&appid={API_KEY}&units=metric"
            res = requests.get(url, timeout=5)
            data = res.json()
            
            temp = data.get("main", {}).get("temp", 25)
            humidity = data.get("main", {}).get("humidity", 50)
            pressure = data.get("main", {}).get("pressure", 1013)
            wind_speed = data.get("wind", {}).get("speed", 5)
            rainfall = data.get("rain", {}).get("1h", 0)
            
            # Simulated magnitude (since weather API doesn't have it, keep it 0 or random very low)
            import random
            magnitude = round(random.uniform(0, 1.5), 2)
            time_val = random.randint(0, 23)
            
            # Simple heuristic labeling to map it to our training model
            if rainfall > 100 and humidity > 80:
                dtype, risk = 1, 1 # Flood
            elif wind_speed > 60 and pressure < 995:
                dtype, risk = 2, 1 # Cyclone
            elif rainfall > 120 and temp < 30:
                dtype, risk = 3, 1 # Landslide (approximated)
            elif pressure < 1000 and wind_speed > 30:
                dtype, risk = 2, 1 # Storm/Cyclone
            elif temp > 40 and humidity < 30 and rainfall == 0:
                dtype, risk = 5, 1 # Drought
            else:
                dtype, risk = 0, 0 # Normal
                
            realtime_data.append([
                rainfall, humidity, temp, pressure, wind_speed, magnitude, time_val, risk, dtype
            ])
            
        except Exception as e:
            print(f"Error fetching data for {city['name']}: {e}")
            
    df = pd.DataFrame(realtime_data, columns=["rainfall", "humidity", "temperature", "pressure", "wind_speed", "magnitude", "time", "risk", "disaster_type"])
    
    # Save to CSV
    file_path = os.path.join(os.path.dirname(__file__), "realtime_dataset.csv")
    df.to_csv(file_path, index=False)
    print(f"Successfully saved {len(realtime_data)} real-time records to {file_path}")

if __name__ == "__main__":
    fetch_realtime_weather()
