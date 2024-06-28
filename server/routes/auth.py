from flask import Blueprint, request, jsonify
from ..models import User
from ..app import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, decode_token

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
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
    
    access_token = create_access_token(identify=user.id)
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