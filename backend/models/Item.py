from config.database import Database

class Item:
    """Item model for database operations"""
    
    @staticmethod
    def create(wishlist_id, name, description=None, price=None, image_url=None, source_url=None):
        """Create a new item"""
        sql = '''
            INSERT INTO items (wishlist_id, name, description, price, image_url, source_url)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING *
        '''
        return Database.execute_and_fetch(sql, (wishlist_id, name, description, price, image_url, source_url))
    
    @staticmethod
    def get_by_id(item_id):
        """Get item by ID"""
        sql = 'SELECT * FROM items WHERE id = %s'
        return Database.query_one(sql, (item_id,))
    
    @staticmethod
    def get_by_wishlist(wishlist_id):
        """Get all items in a wishlist"""
        sql = 'SELECT * FROM items WHERE wishlist_id = %s ORDER BY created_at DESC'
        return Database.query(sql, (wishlist_id,))
    
    @staticmethod
    def update(item_id, **kwargs):
        """Update item fields"""
        allowed_fields = ['name', 'description', 'price', 'image_url', 'source_url', 'completed', 'completed_at']
        updates = {k: v for k, v in kwargs.items() if k in allowed_fields}
        
        if not updates:
            return None
        
        set_clause = ', '.join([f'{k} = %s' for k in updates.keys()])
        values = list(updates.values()) + [item_id]
        
        sql = f'UPDATE items SET {set_clause} WHERE id = %s RETURNING *'
        return Database.execute_and_fetch(sql, values)
    
    @staticmethod
    def toggle_completion(item_id):
        """Toggle item completion status"""
        sql = '''
            UPDATE items 
            SET completed = NOT completed,
                completed_at = CASE 
                    WHEN completed = FALSE THEN CURRENT_TIMESTAMP
                    ELSE NULL
                END
            WHERE id = %s
            RETURNING *
        '''
        return Database.execute_and_fetch(sql, (item_id,))
    
    @staticmethod
    def delete(item_id):
        """Delete item"""
        sql = 'DELETE FROM items WHERE id = %s'
        return Database.execute(sql, (item_id,))
