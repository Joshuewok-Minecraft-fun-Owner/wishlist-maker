import jwt
from datetime import datetime, timedelta
from config.config import config
import bcrypt

def generate_token(user_id, email, username, expires_in=24):
    """Generate JWT token"""
    payload = {
        'user_id': str(user_id),
        'email': email,
        'username': username,
        'exp': datetime.utcnow() + timedelta(hours=expires_in),
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, config.SECRET_KEY, algorithm=config.JWT_ALGORITHM)
    return token

def hash_password(password):
    """Hash a password"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password, hashed):
    """Verify a password against a hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def format_user(user):
    """Format user object for response"""
    return {
        'id': str(user['id']) if isinstance(user.get('id'), type(None)) is False else user.get('id'),
        'email': user.get('email'),
        'username': user.get('username'),
        'bio': user.get('bio'),
        'avatar_url': user.get('avatar_url'),
        'created_at': user.get('created_at').isoformat() if user.get('created_at') else None
    }

def format_wishlist(wishlist):
    """Format wishlist object for response"""
    return {
        'id': str(wishlist['id']),
        'user_id': str(wishlist['user_id']),
        'name': wishlist.get('name'),
        'description': wishlist.get('description'),
        'is_public': wishlist.get('is_public'),
        'follower_only': wishlist.get('follower_only'),
        'created_at': wishlist.get('created_at').isoformat() if wishlist.get('created_at') else None
    }

def format_item(item):
    """Format item object for response"""
    return {
        'id': str(item['id']),
        'wishlist_id': str(item['wishlist_id']),
        'name': item.get('name'),
        'description': item.get('description'),
        'price': float(item['price']) if item.get('price') else None,
        'image_url': item.get('image_url'),
        'source_url': item.get('source_url'),
        'completed': item.get('completed'),
        'completed_at': item.get('completed_at').isoformat() if item.get('completed_at') else None,
        'created_at': item.get('created_at').isoformat() if item.get('created_at') else None
    }
