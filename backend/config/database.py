import psycopg2
from psycopg2.extras import RealDictCursor
from config.config import config
import os

class Database:
    """Database connection and query manager"""
    
    @staticmethod
    def get_connection():
        """Get a database connection"""
        try:
            conn = psycopg2.connect(
                host=config.DB_HOST,
                port=config.DB_PORT,
                database=config.DB_NAME,
                user=config.DB_USER,
                password=config.DB_PASSWORD
            )
            return conn
        except Exception as e:
            print(f"Database connection error: {e}")
            raise

    @staticmethod
    def query(sql, params=None):
        """Execute a SELECT query and return results"""
        conn = Database.get_connection()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(sql, params or ())
                return cur.fetchall()
        finally:
            conn.close()

    @staticmethod
    def query_one(sql, params=None):
        """Execute a SELECT query and return single result"""
        results = Database.query(sql, params)
        return results[0] if results else None

    @staticmethod
    def execute(sql, params=None):
        """Execute INSERT/UPDATE/DELETE query and return affected rows"""
        conn = Database.get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(sql, params or ())
                conn.commit()
                return cur.rowcount
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()

    @staticmethod
    def execute_and_fetch(sql, params=None):
        """Execute query and return inserted/updated record"""
        conn = Database.get_connection()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(sql, params or ())
                conn.commit()
                result = cur.fetchone()
                return result
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()

def init_db():
    """Initialize database tables"""
    conn = Database.get_connection()
    try:
        with conn.cursor() as cur:
            # Enable UUID extension
            cur.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
            
            # Users table
            cur.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    email VARCHAR(255) UNIQUE NOT NULL,
                    username VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    bio TEXT,
                    avatar_url VARCHAR(500),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Wishlists table
            cur.execute('''
                CREATE TABLE IF NOT EXISTS wishlists (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    is_public BOOLEAN DEFAULT FALSE,
                    follower_only BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Items table
            cur.execute('''
                CREATE TABLE IF NOT EXISTS items (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    price DECIMAL(10, 2),
                    image_url VARCHAR(500),
                    source_url VARCHAR(500),
                    completed BOOLEAN DEFAULT FALSE,
                    completed_at TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Streamer profiles table
            cur.execute('''
                CREATE TABLE IF NOT EXISTS streamer_profiles (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    streamer_name VARCHAR(255),
                    channel_url VARCHAR(500),
                    platform VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Streamer donations table
            cur.execute('''
                CREATE TABLE IF NOT EXISTS streamer_donations (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    donation_url VARCHAR(500),
                    platform VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            print("Database tables initialized successfully")
    except Exception as e:
        conn.rollback()
        print(f"Error initializing database: {e}")
    finally:
        conn.close()
