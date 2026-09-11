import os
import tempfile
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

if os.environ.get("VERCEL"):
    db_dir = tempfile.gettempdir()
    db_path = os.path.join(db_dir, "trinetra_v2.db")
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"
else:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, "trinetra_v2.db")
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()