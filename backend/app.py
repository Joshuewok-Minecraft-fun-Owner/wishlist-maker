from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from datetime import datetime

# Load environment variables
load_dotenv()

from config.database import init_db
from middleware.error_handler import register_error_handlers
from routes.auth import auth_bp
from routes.user import user_bp
from routes.wishlist import wishlist_bp
from routes.item import item_bp
from routes.scraper import scraper_bp
from routes.streamer import streamer_bp

app = Flask(__name__)

# Configure CORS
CORS(app, origins=os.getenv('CORS_ORIGIN', 'http://localhost:3000'))

# Register error handlers
register_error_handlers(app)

# Initialize database
init_db()

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(wishlist_bp, url_prefix='/api/wishlists')
app.register_blueprint(item_bp, url_prefix='/api/items')
app.register_blueprint(scraper_bp, url_prefix='/api/scraper')
app.register_blueprint(streamer_bp, url_prefix='/api/streamers')

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

# 404 handler
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return jsonify({'error': 'Not Found'}), 404

if __name__ == '__main__':
    debug_mode = os.getenv('NODE_ENV', 'development') != 'production'
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5000)),
        debug=debug_mode
    )
