from sqlalchemy import Column, Integer, Float, String, DateTime, Text
from database import Base
import datetime


class DisasterRecord(Base):
    __tablename__ = "disaster_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # Weather & Environmental Data
    rainfall = Column(Float, default=0)
    temperature = Column(Float, default=0)
    humidity = Column(Float, default=0)
    wind_speed = Column(Float, default=0)
    pressure = Column(Float, default=1013)

    # Disaster Inputs
    fire_risk = Column(Float, default=0)
    earthquake_mag = Column(Float, default=0)

    # ML Output
    prediction = Column(Integer, default=0)
    probability = Column(Float, default=0)
    risk_level = Column(String, default="no risk")
    risk_score = Column(Integer, default=0)
    disaster_type = Column(String, default="Normal")
    confidence = Column(Float, default=0)

    # Location Data
    lat = Column(Float, default=20.5937)
    lng = Column(Float, default=78.9629)
    location_name = Column(String, default="Unknown")
    state = Column(String, default="India")

    # Recommendations (stored as JSON string)
    recommendations = Column(Text, default="[]")
    humanitarian_aid = Column(Text, default="{}")

    # Source: 'manual' (user prediction), 'auto' (scheduler), 'api' (live fetch)
    source = Column(String, default="manual")

    # Timestamp
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class MonitoringLog(Base):
    """Stores auto-monitoring results from the scheduler"""
    __tablename__ = "monitoring_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    city_name = Column(String)
    state = Column(String, default="India")
    lat = Column(Float)
    lng = Column(Float)

    # Weather data at time of monitoring
    rainfall = Column(Float, default=0)
    temperature = Column(Float, default=0)
    humidity = Column(Float, default=0)
    wind_speed = Column(Float, default=0)
    pressure = Column(Float, default=1013)
    earthquake_mag = Column(Float, default=0)

    # ML results
    risk_score = Column(Integer, default=0)
    risk_level = Column(String, default="no risk")
    disaster_type = Column(String, default="Normal")
    probability = Column(Float, default=0)

    timestamp = Column(DateTime, default=datetime.datetime.utcnow)