from flask import Blueprint, request, jsonify
from middleware.authenticate import authenticate
from utils.scraper import WebScraper

scraper_bp = Blueprint('scraper', __name__)

@scraper_bp.route('/scrape-url', methods=['POST'])
@authenticate
def scrape_url():
    """Scrape a single URL"""
    data = request.get_json()
    
    if not data or not data.get('url'):
        return jsonify({'error': 'URL is required'}), 400
    
    try:
        result = WebScraper.scrape_url(data['url'])
        
        if result['success']:
            return jsonify(result['data']), 200
        else:
            return jsonify({'error': result['error']}), 400
    except Exception as e:
        print(f"Scrape URL error: {e}")
        return jsonify({'error': 'Failed to scrape URL'}), 500

@scraper_bp.route('/scrape-multiple', methods=['POST'])
@authenticate
def scrape_multiple():
    """Scrape multiple URLs"""
    data = request.get_json()
    
    if not data or not data.get('urls'):
        return jsonify({'error': 'URLs array is required'}), 400
    
    if not isinstance(data['urls'], list):
        return jsonify({'error': 'URLs must be an array'}), 400
    
    try:
        results = WebScraper.scrape_multiple(data['urls'])
        
        return jsonify({
            'results': results,
            'count': len(results),
            'successful': sum(1 for r in results if r.get('success'))
        }), 200
    except Exception as e:
        print(f"Scrape multiple error: {e}")
        return jsonify({'error': 'Failed to scrape URLs'}), 500
