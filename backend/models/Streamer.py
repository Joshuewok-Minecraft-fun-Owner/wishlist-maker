from config.database import Database

class Streamer:
    """Streamer model for database operations"""
    
    @staticmethod
    def create_profile(user_id, streamer_name, channel_url, platform):
        """Create a new streamer profile"""
        sql = '''
            INSERT INTO streamer_profiles (user_id, streamer_name, channel_url, platform)
            VALUES (%s, %s, %s, %s)
            RETURNING *
        '''
        return Database.execute_and_fetch(sql, (user_id, streamer_name, channel_url, platform))
    
    @staticmethod
    def get_profile_by_user(user_id):
        """Get streamer profile by user ID"""
        sql = 'SELECT * FROM streamer_profiles WHERE user_id = %s'
        return Database.query_one(sql, (user_id,))
    
    @staticmethod
    def update_profile(user_id, **kwargs):
        """Update streamer profile"""
        allowed_fields = ['streamer_name', 'channel_url', 'platform']
        updates = {k: v for k, v in kwargs.items() if k in allowed_fields}
        
        if not updates:
            return None
        
        set_clause = ', '.join([f'{k} = %s' for k in updates.keys()])
        values = list(updates.values()) + [user_id]
        
        sql = f'UPDATE streamer_profiles SET {set_clause} WHERE user_id = %s RETURNING *'
        return Database.execute_and_fetch(sql, values)
    
    @staticmethod
    def add_donation_link(user_id, donation_url, platform):
        """Add a donation link"""
        sql = '''
            INSERT INTO streamer_donations (user_id, donation_url, platform)
            VALUES (%s, %s, %s)
            RETURNING *
        '''
        return Database.execute_and_fetch(sql, (user_id, donation_url, platform))
    
    @staticmethod
    def get_donation_links(user_id):
        """Get all donation links for a user"""
        sql = 'SELECT * FROM streamer_donations WHERE user_id = %s ORDER BY created_at DESC'
        return Database.query(sql, (user_id,))
    
    @staticmethod
    def delete_donation_link(link_id, user_id):
        """Delete a donation link"""
        sql = 'DELETE FROM streamer_donations WHERE id = %s AND user_id = %s'
        return Database.execute(sql, (link_id, user_id))
