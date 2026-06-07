from flask import Blueprint, request, jsonify
from models.Streamer import Streamer
from middleware.authenticate import authenticate
from utils.helpers import format_user

streamer_bp = Blueprint('streamers', __name__)

@streamer_bp.route('/profile', methods=['POST'])
@authenticate
def create_streamer_profile():
    """Create streamer profile"""
    data = request.get_json()
    
    if not data or not data.get('streamer_name') or not data.get('channel_url') or not data.get('platform'):
        return jsonify({'error': 'Streamer name, channel URL, and platform are required'}), 400
    
    try:
        profile = Streamer.create_profile(
            user_id=request.user_id,
            streamer_name=data['streamer_name'],
            channel_url=data['channel_url'],
            platform=data['platform']
        )
        
        return jsonify({
            'id': str(profile['id']),
            'user_id': str(profile['user_id']),
            'streamer_name': profile['streamer_name'],
            'channel_url': profile['channel_url'],
            'platform': profile['platform'],
            'created_at': profile['created_at'].isoformat() if profile['created_at'] else None
        }), 201
    except Exception as e:
        print(f"Create streamer profile error: {e}")
        return jsonify({'error': 'Failed to create profile'}), 500

@streamer_bp.route('/profile/user/<user_id>', methods=['GET'])
def get_streamer_profile(user_id):
    """Get streamer profile"""
    try:
        profile = Streamer.get_profile_by_user(user_id)
        
        if not profile:
            return jsonify({'error': 'Streamer profile not found'}), 404
        
        return jsonify({
            'id': str(profile['id']),
            'user_id': str(profile['user_id']),
            'streamer_name': profile['streamer_name'],
            'channel_url': profile['channel_url'],
            'platform': profile['platform'],
            'created_at': profile['created_at'].isoformat() if profile['created_at'] else None
        }), 200
    except Exception as e:
        print(f"Get streamer profile error: {e}")
        return jsonify({'error': 'Failed to fetch profile'}), 500

@streamer_bp.route('/profile', methods=['PUT'])
@authenticate
def update_streamer_profile():
    """Update streamer profile"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        profile = Streamer.update_profile(request.user_id, **data)
        
        if not profile:
            return jsonify({'error': 'Streamer profile not found'}), 404
        
        return jsonify({
            'id': str(profile['id']),
            'user_id': str(profile['user_id']),
            'streamer_name': profile['streamer_name'],
            'channel_url': profile['channel_url'],
            'platform': profile['platform'],
            'created_at': profile['created_at'].isoformat() if profile['created_at'] else None
        }), 200
    except Exception as e:
        print(f"Update streamer profile error: {e}")
        return jsonify({'error': 'Failed to update profile'}), 500

@streamer_bp.route('/donation-link', methods=['POST'])
@authenticate
def add_donation_link():
    """Add donation link"""
    data = request.get_json()
    
    if not data or not data.get('donation_url') or not data.get('platform'):
        return jsonify({'error': 'Donation URL and platform are required'}), 400
    
    try:
        link = Streamer.add_donation_link(
            user_id=request.user_id,
            donation_url=data['donation_url'],
            platform=data['platform']
        )
        
        return jsonify({
            'id': str(link['id']),
            'user_id': str(link['user_id']),
            'donation_url': link['donation_url'],
            'platform': link['platform'],
            'created_at': link['created_at'].isoformat() if link['created_at'] else None
        }), 201
    except Exception as e:
        print(f"Add donation link error: {e}")
        return jsonify({'error': 'Failed to add donation link'}), 500

@streamer_bp.route('/donation-links', methods=['GET'])
@authenticate
def get_donation_links():
    """Get user's donation links"""
    try:
        links = Streamer.get_donation_links(request.user_id)
        
        return jsonify([{
            'id': str(link['id']),
            'user_id': str(link['user_id']),
            'donation_url': link['donation_url'],
            'platform': link['platform'],
            'created_at': link['created_at'].isoformat() if link['created_at'] else None
        } for link in links]), 200
    except Exception as e:
        print(f"Get donation links error: {e}")
        return jsonify({'error': 'Failed to fetch donation links'}), 500
