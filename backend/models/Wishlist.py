from config.database import Database

class Wishlist:
    """Wishlist model for database operations"""
    
    @staticmethod
    def create(user_id, name, description=None, is_public=False, follower_only=False):
        """Create a new wishlist"""
        sql = '''
            INSERT INTO wishlists (user_id, name, description, is_public, follower_only)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING *
        '''
        return Database.execute_and_fetch(sql, (user_id, name, description, is_public, follower_only))
    
    @staticmethod
    def get_by_id(wishlist_id):
        """Get wishlist by ID"""
        sql = 'SELECT * FROM wishlists WHERE id = %s'
        return Database.query_one(sql, (wishlist_id,))
    
    @staticmethod
    def get_by_user(user_id):
        """Get all wishlists for a user"""
        sql = 'SELECT * FROM wishlists WHERE user_id = %s ORDER BY created_at DESC'
        return Database.query(sql, (user_id,))
    
    @staticmethod
    def get_public():
        """Get all public wishlists with pagination"""
        sql = '''
            SELECT w.*, u.username, u.avatar_url
            FROM wishlists w
            JOIN users u ON w.user_id = u.id
            WHERE w.is_public = TRUE
            ORDER BY w.created_at DESC
            LIMIT 20
        '''
        return Database.query(sql)
    
    @staticmethod
    def update(wishlist_id, **kwargs):
        """Update wishlist fields"""
        allowed_fields = ['name', 'description', 'is_public', 'follower_only']
        updates = {k: v for k, v in kwargs.items() if k in allowed_fields}
        
        if not updates:
            return None
        
        set_clause = ', '.join([f'{k} = %s' for k in updates.keys()])
        values = list(updates.values()) + [wishlist_id]
        
        sql = f'UPDATE wishlists SET {set_clause} WHERE id = %s RETURNING *'
        return Database.execute_and_fetch(sql, values)
    
    @staticmethod
    def delete(wishlist_id):
        """Delete wishlist"""
        sql = 'DELETE FROM wishlists WHERE id = %s'
        return Database.execute(sql, (wishlist_id,))
