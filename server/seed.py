from app import db, app, bcrypt
from models import Recipe  

# def seed_users():
#     User.query.delete()

#     # Create a test user (or multiple users)
#     password = 'password123'
#     hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
#     test_user = User(username='testuser', password_hash=hashed_password)
#     db.session.add(test_user)
#     db.session.commit()

# def seed_flavors():
#     Flavor.query.delete()  # Start with a clean flavors table

#     # Create and add your Flavor instances here
#     flavors = [
#         Flavor(name="Vanilla", description="A classic, versatile flavor", image_url="/images/vanilla.jpg"),
#         Flavor(name="Chocolate", description="Rich and decadent", image_url="/images/chocolate.jpg"),
#         # ... more flavors ...
#     ]
#     db.session.add_all(flavors)
#     db.session.commit()

# def seed_favorites():
#     with app.app_context():
#         Favorite.query.delete()  

#         user = User.query.filter_by(username='testuser').first()
#         vanilla = Flavor.query.filter_by(name="Vanilla").first()
#         chocolate = Flavor.query.filter_by(name="Chocolate").first()

#         if user and vanilla and chocolate:  
#             favorites = [
#                 Favorite(user_id=user.id, recipe_id=vanilla.id),
#                 Favorite(user_id=user.id, recipe_id=chocolate.id),
#             ]
#             db.session.add_all(favorites)
#             db.session.commit()
#             print("Database seeded with favorites")

def seed_recipes():
    Recipe.query.delete()  # Start with a clean recipes table

    recipes = [
        {
            'name': 'Spaghetti Carbonara',
            'ingredients': 'Spaghetti, eggs, pancetta, black pepper, Parmesan cheese',
            'instructions': 'Cook spaghetti. Fry pancetta until crispy. Beat eggs, mix with cheese. Combine with hot spaghetti. Serve with black pepper.',
            'image_url': 'https://keyassets-p2.timeincuk.net/wp/prod/wp-content/uploads/sites/53/2018/07/Spaghetti-carbonara-recipe.jpg',
            'category': 'Pasta'
        },
        {
            'name': 'Chicken Tikka Masala',
            'ingredients': 'Chicken breast, yogurt, tomatoes, cream, spices',
            'instructions': 'Marinate chicken in yogurt and spices. Grill until charred. Simmer in tomato cream sauce. Serve with rice.',
            'image_url': 'https://www.seriouseats.com/thmb/fMfwR6_SOluWtgc7zHdzg3NQ3Ck=/1500x1125/filters:fill(auto,1)/chicken-tikka-masala-for-the-grill-recipe-hero-2_1-cb493f49e30140efbffec162d5f2d1d7.JPG',
            'category': 'Curry'
        },
        # ... add more recipe data here ...
    ]

    for recipe_data in recipes:
        new_recipe = Recipe(**recipe_data)
        db.session.add(new_recipe)
    db.session.commit()


if __name__ == '__main__':
    with app.app_context():
       seed_recipes()