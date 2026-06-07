from flask import Blueprint, request, jsonify
from models.Item import Item
from models.Wishlist import Wishlist
from middleware.authenticate import authenticate
from utils.helpers import format_item
from datetime import datetime

item_bp = Blueprint('items', __name__)

@item_bp.route('/', methods=['POST'])
@authenticate
def create_item():
    """Add item to wishlist"""
    data = request.get_json()
    
    if not data or not data.get('wishlist_id') or not data.get('name'):
        return jsonify({'error': 'Wishlist ID and name are required'}), 400
    
    # Check ownership
    wishlist = Wishlist.get_by_id(data['wishlist_id'])
    if not wishlist:
        return jsonify({'error': 'Wishlist not found'}), 404
    
    if str(wishlist['user_id']) != str(request.user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        item = Item.create(
            wishlist_id=data['wishlist_id'],
            name=data['name'],
            description=data.get('description'),
            price=data.get('price'),
            image_url=data.get('image_url'),
            source_url=data.get('source_url')
        )
        
        return jsonify(format_item(item)), 201
    except Exception as e:
        print(f"Create item error: {e}")
        return jsonify({'error': 'Failed to create item'}), 500

@item_bp.route('/<item_id>', methods=['GET'])
def get_item(item_id):
    """Get single item"""
    try:
        item = Item.get_by_id(item_id)
        
        if not item:
            return jsonify({'error': 'Item not found'}), 404
        
        return jsonify(format_item(item)), 200
    except Exception as e:
        print(f"Get item error: {e}")
        return jsonify({'error': 'Failed to fetch item'}), 500

@item_bp.route('/<item_id>', methods=['PUT'])
@authenticate
def update_item(item_id):
    """Update item"""
    item = Item.get_by_id(item_id)
    
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    # Check ownership
    wishlist = Wishlist.get_by_id(item['wishlist_id'])
    if str(wishlist['user_id']) != str(request.user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        updated = Item.update(item_id, **data)
        
        if not updated:
            return jsonify({'error': 'Failed to update item'}), 500
        
        return jsonify(format_item(updated)), 200
    except Exception as e:
        print(f"Update item error: {e}")
        return jsonify({'error': 'Failed to update item'}), 500

@item_bp.route('/<item_id>/toggle', methods=['PATCH'])
@authenticate
def toggle_item_completion(item_id):
    """Mark item as completed/incomplete"""
    item = Item.get_by_id(item_id)
    
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    # Check ownership
    wishlist = Wishlist.get_by_id(item['wishlist_id'])
    if str(wishlist['user_id']) != str(request.user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        updated = Item.toggle_completion(item_id)
        
        if not updated:
            return jsonify({'error': 'Failed to toggle completion'}), 500
        
        return jsonify(format_item(updated)), 200
    except Exception as e:
        print(f"Toggle completion error: {e}")
        return jsonify({'error': 'Failed to toggle completion'}), 500

@item_bp.route('/<item_id>', methods=['DELETE'])
@authenticate
def delete_item(item_id):
    """Delete item"""
    item = Item.get_by_id(item_id)
    
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    # Check ownership
    wishlist = Wishlist.get_by_id(item['wishlist_id'])
    if str(wishlist['user_id']) != str(request.user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        Item.delete(item_id)
        return jsonify({'message': 'Item deleted'}), 200
    except Exception as e:
        print(f"Delete item error: {e}")
        return jsonify({'error': 'Failed to delete item'}), 500
