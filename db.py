from flask_sqlalchemy import SQLAlchemy
from flask_mongoengine import MongoEngine


db = SQLAlchemy(session_options={"autoflush": False})
dbMongo = MongoEngine()
