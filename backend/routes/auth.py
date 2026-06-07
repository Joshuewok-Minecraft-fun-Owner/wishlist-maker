from flask import Blueprint, request, jsonify
from models.User import User
from utils.helpers import generate_token, verify_password, format_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Email, username, and password are required'}), 400
    
    # Check if user exists
    if User.get_by_email(data['email']):
        return jsonify({'error': 'Email already registered'}), 409
    
    if User.get_by_username(data['username']):
        return jsonify({'error': 'Username already taken'}), 409
    
    # Create user
    try:
        user = User.create(
            email=data['email'],
            username=data['username'],
            password=data['password']
        )
        
        if not user:
            return jsonify({'error': 'Failed to create user'}), 500
        
        # Generate token
        token = generate_token(user['id'], user['email'], user['username'])
        
        return jsonify({
            'token': token,
            'user': format_user(user)
        }), 201
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'error': 'Failed to register user'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Get user
    user = User.get_by_email(data['email'])
    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Verify password
    if not verify_password(data['password'], user['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Generate token
    token = generate_token(user['id'], user['email'], user['username'])
    
    return jsonify({
        'token': token,
        'user': format_user(user)
    }), 200
