from flask import Flask, request, make_response, session, jsonify
from config import app, db, bcrypt
from models import User, Flavor, Favorite, Recipe
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from flask_login import LoginManager, login_required, current_user


CORS(app, origins=["http://localhost:3000"], supports_credentials=True) 
api = Api(app)

login_manager = LoginManager()
login_manager.init_app(app)


def load_user(user_id):
    return User.query.get(int(user_id))


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
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def check_session():
    if current_user.is_authenticated:
        return jsonify(current_user.to_dict()), 200
    return jsonify({"error": "Unauthorized: Must login"}), 401

@app.before_request
def check_authorized():
    endpoints = ['check_session', 'projectbyid', 'projects']
    if request.endpoint in endpoints and request.method in ['GET', 'POST', 'DELETE'] and not session.get('user_id'):
        return jsonify({'error': 'Unauthorized: Must login'}), 401  

@app.route('/flavors', methods=['GET'])
def get_flavors():
    flavors = Flavor.query.all()
    return jsonify([flavor.to_dict() for flavor in flavors])

@app.route('/flavors/<int:id>', methods=['GET'])
def get_flavor(id):
    flavor = Flavor.query.get(id)
    if flavor:
        return jsonify(flavor.to_dict()), 200
    else:
        return jsonify({"error": "Flavor not found"}), 404

@app.route('/flavors/<int:id>', methods=['PUT'])
def update_flavor(id):
    flavor = Flavor.query.get(id)
    if flavor:
        data = request.get_json()
        flavor.name = data['name']
        flavor.description = data['description']
        flavor.image_url = data['image_url']
        db.session.commit()
        return jsonify(flavor.to_dict()), 200
    else:
        return jsonify({"error": "Flavor not found"}), 404


@app.route('/flavors', methods=['POST'])
def create_flavor():
    data = request.get_json()
    try:
        new_flavor = Flavor(name=data['name'], description=data['description'], image_url=data['image_url'])
        db.session.add(new_flavor)
        db.session.commit()
        return jsonify(new_flavor.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/flavors/<int:id>', methods=['DELETE'])
def delete_flavor(id):
    flavor = Flavor.query.get(id)
    if flavor:
        db.session.delete(flavor)
        db.session.commit()
        return jsonify({"message": "Flavor deleted"}), 200
    else:
        return jsonify({"error": "Flavor not found"}), 404

@app.before_request
def check_authorized():
    endpoints = ['check_session', 'projectbyid', 'projects']
    if request.endpoint in endpoints and request.method in ['GET', 'POST', 'DELETE'] and not session.get('user_id'):
        return jsonify({'error': 'Unauthorized: Must login'}), 401
    


@app.route('/recipes', methods=['GET'])
def get_recipes():
    recipes = Recipe.query.all()
    return jsonify([recipe.to_dict() for recipe in recipes])

@app.route('/recipes/<int:id>', methods=['GET'])
def get_recipe(id):
    recipe = Recipe.query.get(id)
    if recipe:
        return jsonify(recipe.to_dict()), 200
    else:
        return jsonify({"error": "Recipe not found"}), 404

@app.route('/recipes', methods=['POST'])
def create_recipe():
    data = request.get_json()
    try:
        new_recipe = Recipe(
            name=data['name'], 
            ingredients=data['ingredients'],
            instructions=data['instructions'],
            image_url=data['image_url'],
            category=data.get('category', '')  # Make category optional
        )
        db.session.add(new_recipe)
        db.session.commit()
        return jsonify(new_recipe.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recipes/<int:id>', methods=['PUT'])
def update_recipe(id):
    recipe = Recipe.query.get(id)
    if recipe:
        data = request.get_json()
        recipe.name = data['name']
        recipe.ingredients = data['ingredients']
        recipe.instructions = data['instructions']
        recipe.image_url = data['image_url']
        recipe.category = data.get('category', '')  # Make category optional
        db.session.commit()
        return jsonify(recipe.to_dict()), 200
    else:
        return jsonify({"error": "Recipe not found"}), 404

@app.route('/recipes/<int:id>', methods=['DELETE'])
def delete_recipe(id):
    recipe = Recipe.query.get(id)
    if recipe:
        db.session.delete(recipe)
        db.session.commit()
        return jsonify({"message": "Recipe deleted"}), 200
    else:
        return jsonify({"error": "Recipe not found"}), 404


@app.route('/favorites', methods=['POST'])
@login_required
def add_favorite():
    data = request.get_json()
    recipe_id = data.get('recipe_id')

    if not recipe_id:
        return jsonify({"error": "Recipe ID is required"}), 400

    try:
        existing_favorite = Favorite.query.filter_by(user_id=current_user.id, recipe_id=recipe_id).first()
        if existing_favorite:
            return jsonify({"error": "Recipe already in favorites"}), 400

        favorite = Favorite(user_id=current_user.id, recipe_id=recipe_id)
        db.session.add(favorite)
        db.session.commit()

        return jsonify({"message": "Recipe added to favorites", 'favorite': favorite.to_dict()}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

if __name__ == '__main__':
    app.run(port=5555, debug=True)