import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

class WebScraper:
    """Web scraping utility for fetching item details from URLs"""
    
    HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    TIMEOUT = 10
    
    @staticmethod
    def scrape_url(url):
        """
        Scrape a URL and extract item details
        Returns dict with title, price, image, description
        """
        try:
            response = requests.get(url, headers=WebScraper.HEADERS, timeout=WebScraper.TIMEOUT)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract title (try multiple selectors)
            title = WebScraper._extract_title(soup)
            
            # Extract price (try multiple selectors)
            price = WebScraper._extract_price(soup)
            
            # Extract image URL
            image_url = WebScraper._extract_image(soup, url)
            
            # Extract description/meta description
            description = WebScraper._extract_description(soup)
            
            return {
                'success': True,
                'data': {
                    'name': title,
                    'price': price,
                    'image_url': image_url,
                    'description': description,
                    'source_url': url
                }
            }
        except requests.RequestException as e:
            return {
                'success': False,
                'error': f'Failed to fetch URL: {str(e)}'
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Error scraping URL: {str(e)}'
            }
    
    @staticmethod
    def _extract_title(soup):
        """Extract title from soup"""
        # Try OG title
        og_title = soup.find('meta', property='og:title')
        if og_title and og_title.get('content'):
            return og_title['content']
        
        # Try regular title tag
        title_tag = soup.find('title')
        if title_tag:
            return title_tag.string
        
        # Try h1
        h1 = soup.find('h1')
        if h1:
            return h1.get_text(strip=True)
        
        return 'Untitled'
    
    @staticmethod
    def _extract_price(soup):
        """Extract price from soup"""
        # Try common price selectors
        price_selectors = [
            soup.find('meta', property='product:price:amount'),
            soup.find('span', class_='price'),
            soup.find('span', class_='product-price'),
            soup.find('div', class_='price'),
        ]
        
        for selector in price_selectors:
            if selector:
                content = selector.get('content') or selector.get_text(strip=True)
                if content:
                    # Try to extract just the number
                    import re
                    match = re.search(r'\d+\.?\d*', content)
                    if match:
                        return float(match.group())
        
        return None
    
    @staticmethod
    def _extract_image(soup, url):
        """Extract image URL from soup"""
        # Try OG image
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            return og_image['content']
        
        # Try product image
        img = soup.find('img', class_='product-image') or soup.find('img', class_='thumbnail')
        if img and img.get('src'):
            return WebScraper._resolve_url(img['src'], url)
        
        # Try any img with alt text
        img = soup.find('img', alt=True)
        if img and img.get('src'):
            return WebScraper._resolve_url(img['src'], url)
        
        return None
    
    @staticmethod
    def _extract_description(soup):
        """Extract description from soup"""
        # Try meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc and meta_desc.get('content'):
            return meta_desc['content']
        
        # Try OG description
        og_desc = soup.find('meta', property='og:description')
        if og_desc and og_desc.get('content'):
            return og_desc['content']
        
        return None
    
    @staticmethod
    def _resolve_url(relative_url, base_url):
        """Resolve relative URL to absolute"""
        if relative_url.startswith(('http://', 'https://')):
            return relative_url
        
        parsed_base = urlparse(base_url)
        base_domain = f"{parsed_base.scheme}://{parsed_base.netloc}"
        
        if relative_url.startswith('/'):
            return base_domain + relative_url
        else:
            return base_domain + '/' + relative_url
    
    @staticmethod
    def scrape_multiple(urls):
        """Scrape multiple URLs and return results"""
        results = []
        for url in urls:
            result = WebScraper.scrape_url(url)
            results.append(result)
        return results
