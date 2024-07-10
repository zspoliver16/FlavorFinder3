from flask import Blueprint, jsonify, request, make_response
from flask_restful import Resource, Api
from flask_login import login_required, current_user
from models import User, Flavor, Favorite
from config import db, bcrypt
import requests

main_bp = Blueprint('main', __name__)
api = Api(main_bp)

class Flavors(Resource):
    def get(self):
        flavors = Flavor.query.all()
        return jsonify([flavor.to_dict() for flavor in flavors])

    def post(self):
        data = request.get_json()
        try:
            new_flavor = Flavor(name=data['name'], description=data['description'], image_url=data['image_url'])
            db.session.add(new_flavor)
            db.session.commit()
            return jsonify(new_flavor.to_dict()), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500

class FlavorDetail(Resource):
    def get(self, id):
        flavor = Flavor.query.get(id)
        if flavor:
            return jsonify(flavor.to_dict()), 200
        else:
            return jsonify({"error": "Flavor not found"}), 404

    def put(self, id):
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

    def delete(self, id):
        flavor = Flavor.query.get(id)
        if flavor:
            db.session.delete(flavor)
            db.session.commit()
            return jsonify({"message": "Flavor deleted"}), 200
        else:
            return jsonify({"error": "Flavor not found"}), 404

class Favorites(Resource):
    @login_required
    def post(self):
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
        
class Recipes(Resource):
    def get(self):
        first_letter = request.args.get('first_letter')
        url = f'https://www.themealdb.com/api/json/v1/1/search.php?f={first_letter}'
        response = requests.get(url)
        return jsonify(response.json())

# Register resources with Flask-Restful API
api.add_resource(Flavors, '/flavors')
api.add_resource(FlavorDetail, '/flavors/<int:id>')
api.add_resource(Favorites, '/favorites')
api.add_resource(Recipes, '/api/recipes')