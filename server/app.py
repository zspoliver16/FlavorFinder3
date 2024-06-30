from flask import request, make_response, session, jsonify
from config import app, db, bcrypt
from models import User
from flask_restful import Resource, Api
from flask_cors import CORS



CORS(app, origins=["http://localhost:3000"], supports_credentials=True) 
api = Api(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')

    # Specifically handle OPTIONS requests
    if request.method == 'OPTIONS':
        response.status_code = 200  # Ensure the preflight gets an OK status

    return response

class SignUp(Resource):
    def post(self):
        params = request.json
        try:
            user = User(username=params.get('username'))
            user.password_hash = params.get('password')
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            return make_response(user.to_dict(), 201)
        except Exception as e:
            app.logger.error(f"Error during signup: {e}")  # Log the error
            return make_response(jsonify({'error': str(e)}), 500) 

api.add_resource(SignUp, '/signup')

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = db.session.get(User, user_id)
            if user:
                return make_response(user.to_dict(), 200)
        return make_response({'error': 'Unauthorized: Must login'}, 401)

api.add_resource(CheckSession, '/check_session')

     #create /logout route
     #remove user_id from session
class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({}, 204)

api.add_resource(Logout, '/logout')

   #create /login route
class Login(Resource):
    def post(self):
        data = request.get_json()  # Get JSON data directly
        user = User.query.filter_by(username=data.get('username')).first()

        if not user or not bcrypt.check_password_hash(user.password_hash, data.get('password')):
            return make_response(jsonify({'error': 'Invalid username or password'}), 401)  # Use jsonify for JSON

        session['user_id'] = user.id  # Use Flask's session
        return make_response(jsonify(user.to_dict()), 200)

api.add_resource(Login, '/login')

@app.route('/check_session', methods=['GET', 'OPTIONS'])
def check_session():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        if user:
            return jsonify(user.to_dict()), 200
    return jsonify({"error": "Unauthorized: Must login"}), 401

@app.before_request
def check_authorized():
    endpoints = ['check_session', 'projectbyid', 'projects']
    if request.endpoint in endpoints and request.method in ['GET', 'POST', 'DELETE'] and not session.get('user_id'):
        return jsonify({'error': 'Unauthorized: Must login'}), 401  

# @app.route('/flavors', methods=['GET'])
# def get_flavors():
#     flavors = Flavor.query.all()
#     return jsonify([flavor.to_dict() for flavor in flavors])