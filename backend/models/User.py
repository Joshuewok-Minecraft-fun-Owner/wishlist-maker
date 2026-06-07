from config.database import Database
from utils.helpers import hash_password

class User:
    """User model for database operations"""
    
    @staticmethod
    def create(email, username, password, bio=None, avatar_url=None):
        """Create a new user"""
        hashed_password = hash_password(password)
        sql = '''
            INSERT INTO users (email, username, password, bio, avatar_url)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, email, username, bio, avatar_url, created_at
        '''
        return Database.execute_and_fetch(sql, (email, username, hashed_password, bio, avatar_url))
    
    @staticmethod
    def get_by_id(user_id):
        """Get user by ID"""
        sql = 'SELECT * FROM users WHERE id = %s'
        return Database.query_one(sql, (user_id,))
    
    @staticmethod
    def get_by_email(email):
        """Get user by email"""
        sql = 'SELECT * FROM users WHERE email = %s'
        return Database.query_one(sql, (email,))
    
    @staticmethod
    def get_by_username(username):
        """Get user by username"""
        sql = 'SELECT * FROM users WHERE username = %s'
        return Database.query_one(sql, (username,))
    
    @staticmethod
    def update(user_id, **kwargs):
        """Update user fields"""
        allowed_fields = ['email', 'username', 'bio', 'avatar_url']
        updates = {k: v for k, v in kwargs.items() if k in allowed_fields}
        
        if not updates:
            return None
        
        set_clause = ', '.join([f'{k} = %s' for k in updates.keys()])
        values = list(updates.values()) + [user_id]
        
        sql = f'UPDATE users SET {set_clause} WHERE id = %s RETURNING *'
        return Database.execute_and_fetch(sql, values)
    
    @staticmethod
    def delete(user_id):
        """Delete user"""
        sql = 'DELETE FROM users WHERE id = %s'
        return Database.execute(sql, (user_id,))
