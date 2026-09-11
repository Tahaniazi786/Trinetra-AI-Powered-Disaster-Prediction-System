from sqlalchemy import Column, Integer, Float
from .db import Base

class Prediction(Base):

    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    rainfall = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    river_level = Column(Float)
    soil_moisture = Column(Float)

    risk_level = Column(Integer)