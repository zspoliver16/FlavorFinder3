from app import db, app, bcrypt
from models import User, Flavor, Favorite  # Import both models

def seed_users():
    User.query.delete()

    # Create a test user (or multiple users)
    password = 'password123'
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    test_user = User(username='testuser', password_hash=hashed_password)
    db.session.add(test_user)
    db.session.commit()

def seed_flavors():
    Flavor.query.delete()  # Start with a clean flavors table

    # Create and add your Flavor instances here
    flavors = [
        Flavor(name="Vanilla", description="A classic, versatile flavor", image_url="/images/vanilla.jpg"),
        Flavor(name="Chocolate", description="Rich and decadent", image_url="/images/chocolate.jpg"),
        # ... more flavors ...
    ]
    db.session.add_all(flavors)
    db.session.commit()

def seed_favorites():
    with app.app_context():
        Favorite.query.delete()  

        user = User.query.filter_by(username='testuser').first()
        vanilla = Flavor.query.filter_by(name="Vanilla").first()
        chocolate = Flavor.query.filter_by(name="Chocolate").first()

        if user and vanilla and chocolate:  
            favorites = [
                Favorite(user_id=user.id, recipe_id=vanilla.id),
                Favorite(user_id=user.id, recipe_id=chocolate.id),
            ]
            db.session.add_all(favorites)
            db.session.commit()
            print("Database seeded with favorites")

if __name__ == '__main__':
    with app.app_context():
        seed_users()  # Seed users
        seed_flavors()  # Seed flavors
        seed_favorites()