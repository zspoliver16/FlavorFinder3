from flask import Blueprint, request, jsonify, Response
from ..models import User
from ..app import db, Favorite
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, decode_token
import requests

auth = Blueprint('auth', __name__)
recipes = Blueprint('recipes', __name__)

@auth.route('/signup', methods=['POST'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify(msg="Missing Input data"), 400
    
    user_exists = User.query.filter_by(email=email).first() is not None
    if user_exists:
        return jsonify(msg="User already exists"), 400
    
    new_user = User(email=email, usename=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id)
    return jsonify(msg="User Created", access_token=access_token)

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify(msg="Incorrect username or password"), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify(msg="Login Successful", access_token=access_token), 200

@auth.route('/check', method=['POST'])
@jwt_required()
def check_token():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = decode_token(token)
        if decoded_token:
            return jsonify(msg="Token is valid"), 200
        else:
            return jsonify(msg="Token is invalid"), 401
    except Exception as e:
        print(f"Error checking token: {e}")
        return jsonify(msg="Error checking token"), 500

@app.route('/api/recipes', methods=['GET'])
def proxy_recipes():
    query = request.args.get('query', '')
    url = f"{THE_MEAL_DB_BASE_URL}{THE_MEAL_DB_API_KEY}/search.php?s={query}"

    try:
        response = requests.get(url)
        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for (name, value) in response.raw.headers.items()
                   if name.lower() not in excluded_headers]

        return Response(response.content, response.status_code, headers)
    except requests.RequestException as e:
        print(f"Error proxying request to TheMealDB: {e}")
        return jsonify({"error": "Failed to fetch recipes"}), 500
    
@recipes.route('/favorites', methods=['POST'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def add_favorite():
    data = request.get_json()
    recipe_id = data.get('recipe_id')

    if not recipe_id:
        return jsonify({"error": "Recipe ID is required"}), 400

    try:
        favorite = Favorite(recipe_id=recipe_id)
        db.session.add(favorite)
        db.session.commit()

        return jsonify({"message": "Recipe added to favorites", 'favorite_id': favorite.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500