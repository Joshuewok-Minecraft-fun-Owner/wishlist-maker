from flask import Blueprint, request, jsonify
from models.User import User
from middleware.authenticate import authenticate
from utils.helpers import format_user

user_bp = Blueprint('users', __name__)

@user_bp.route('/profile', methods=['GET'])
@authenticate
def get_profile():
    """Get current user profile"""
    user = User.get_by_id(request.user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(format_user(user)), 200

@user_bp.route('/<username>', methods=['GET'])
def get_user_by_username(username):
    """Get public user profile"""
    user = User.get_by_username(username)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(format_user(user)), 200

@user_bp.route('/profile', methods=['PUT'])
@authenticate
def update_profile():
    """Update user profile"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Check if username is being changed and if it's already taken
    if data.get('username') and data['username'] != request.user['username']:
        existing = User.get_by_username(data['username'])
        if existing:
            return jsonify({'error': 'Username already taken'}), 409
    
    # Update user
    try:
        user = User.update(request.user_id, **data)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(format_user(user)), 200
    except Exception as e:
        print(f"Update profile error: {e}")
        return jsonify({'error': 'Failed to update profile'}), 500
