from flask import Blueprint, request, jsonify
from models.Wishlist import Wishlist
from models.Item import Item
from middleware.authenticate import authenticate
from utils.helpers import format_wishlist, format_item

wishlist_bp = Blueprint('wishlists', __name__)

@wishlist_bp.route('/', methods=['POST'])
@authenticate
def create_wishlist():
    """Create a new wishlist"""
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    
    try:
        wishlist = Wishlist.create(
            user_id=request.user_id,
            name=data['name'],
            description=data.get('description'),
            is_public=data.get('is_public', False),
            follower_only=data.get('follower_only', False)
        )
        
        return jsonify(format_wishlist(wishlist)), 201
    except Exception as e:
        print(f"Create wishlist error: {e}")
        return jsonify({'error': 'Failed to create wishlist'}), 500

@wishlist_bp.route('/mine', methods=['GET'])
@authenticate
def get_user_wishlists():
    """Get user's wishlists"""
    try:
        wishlists = Wishlist.get_by_user(request.user_id)
        return jsonify([format_wishlist(w) for w in wishlists]), 200
    except Exception as e:
        print(f"Get user wishlists error: {e}")
        return jsonify({'error': 'Failed to fetch wishlists'}), 500

@wishlist_bp.route('/public', methods=['GET'])
def get_public_wishlists():
    """Get all public wishlists"""
    try:
        wishlists = Wishlist.get_public()
        return jsonify([format_wishlist(w) for w in wishlists]), 200
    except Exception as e:
        print(f"Get public wishlists error: {e}")
        return jsonify({'error': 'Failed to fetch wishlists'}), 500

@wishlist_bp.route('/<wishlist_id>', methods=['GET'])
def get_wishlist(wishlist_id):
    """Get wishlist with items"""
    try:
        wishlist = Wishlist.get_by_id(wishlist_id)
        
        if not wishlist:
            return jsonify({'error': 'Wishlist not found'}), 404
        
        # Check if user has access
        if not wishlist['is_public']:
            from flask import request as flask_request
            auth_header = flask_request.headers.get('Authorization')
            if not auth_header:
                return jsonify({'error': 'Unauthorized'}), 401
            
            # Verify token and user ownership
            import jwt
            from config.config import config
            try:
                token = auth_header.split(' ')[1]
                payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.JWT_ALGORITHM])
                user_id = payload.get('user_id')
                
                if str(user_id) != str(wishlist['user_id']):
                    return jsonify({'error': 'Unauthorized'}), 401
            except:
                return jsonify({'error': 'Unauthorized'}), 401
        
        # Get items
        items = Item.get_by_wishlist(wishlist_id)
        
        result = format_wishlist(wishlist)
        result['items'] = [format_item(i) for i in items]
        
        return jsonify(result), 200
    except Exception as e:
        print(f"Get wishlist error: {e}")
        return jsonify({'error': 'Failed to fetch wishlist'}), 500

@wishlist_bp.route('/<wishlist_id>', methods=['PUT'])
@authenticate
def update_wishlist(wishlist_id):
    """Update wishlist"""
    wishlist = Wishlist.get_by_id(wishlist_id)
    
    if not wishlist:
        return jsonify({'error': 'Wishlist not found'}), 404
    
    # Check ownership
    if str(wishlist['user_id']) != str(request.user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        updated = Wishlist.update(wishlist_id, **data)
        
        if not updated:
            return jsonify({'error': 'Failed to update wishlist'}), 500
        
        return jsonify(format_wishlist(updated)), 200
    except Exception as e:
        print(f"Update wishlist error: {e}")
        return jsonify({'error': 'Failed to update wishlist'}), 500

@wishlist_bp.route('/<wishlist_id>', methods=['DELETE'])
@authenticate
def delete_wishlist(wishlist_id):
    """Delete wishlist"""
    wishlist = Wishlist.get_by_id(wishlist_id)
    
    if not wishlist:
        return jsonify({'error': 'Wishlist not found'}), 404
    
    # Check ownership
    if str(wishlist['user_id']) != str(request.user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        Wishlist.delete(wishlist_id)
        return jsonify({'message': 'Wishlist deleted'}), 200
    except Exception as e:
        print(f"Delete wishlist error: {e}")
        return jsonify({'error': 'Failed to delete wishlist'}), 500
