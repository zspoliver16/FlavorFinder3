from flask import Flask 
from flask_sqlalchemy import SQLAlchemy 
from flask_migrate import Migrate
from sqlalchemy import MetaData
from flask_restful import Api
from flask_bcrypt import Bcrypt
import os
import secrets
from flask_cors import CORS

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s"
})

app = Flask(__name__)


THE_MEAL_DB_API_KEY = '1'
THE_MEAL_DB_BASE_URL = 'https://www.themealdb.com/api/json/v1/'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['SECRET_KEY'] = secrets.token_hex(16)

db = SQLAlchemy(metadata=metadata)

Migrate(app, db)

db.init_app(app)

api = Api(app)

# CORS(app)

bcrypt = Bcrypt(app)

app.secret_key = os.urandom(16) 