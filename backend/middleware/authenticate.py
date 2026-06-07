from flask import request, jsonify
from functools import wraps
import jwt
from config.config import config

def authenticate(f):
    """Decorator to check JWT token and set user context"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({'error': 'Invalid authorization header'}), 401
        
        if not token:
            return jsonify({'error': 'Missing authorization token'}), 401
        
        try:
            payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.JWT_ALGORITHM])
            request.user_id = payload.get('user_id')
            request.user = {
                'user_id': payload.get('user_id'),
                'email': payload.get('email'),
                'username': payload.get('username')
            }
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    
    return decorated_function
