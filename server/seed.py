from models import User
from config import db, app, bcrypt

if __name__ == '__main__':
    with app.app_context():
        User.query.delete()  
        
        # Create a test user with password hashing
        password = 'password123'  # Choose a secure password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        test_user = User(username='testuser', password_hash=hashed_password)
        db.session.add(test_user) 
        db.session.commit()
        
        print("Database seeded with a test user.")