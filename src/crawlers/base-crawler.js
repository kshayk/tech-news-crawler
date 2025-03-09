const cheerio = require('cheerio');
const axios = require('axios');
const logger = require('../utils/logger');

class BaseCrawler {
    constructor(name, baseUrl) {
        this.name = name;
        this.baseUrl = baseUrl;
    }

    async fetchPage(url = this.baseUrl) {
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            return $;
        } catch (error) {
            logger.error(`Error fetching page from ${url}: ${error.message}`);
            return null;
        }
    }

    extractImage($article) {
        // Try various common image selectors
        const selectors = [
            'img[src*="article"]',
            'img[data-src*="article"]',
            'img[srcset*="article"]',
            'source[srcset*="article"]',
            'img.article-image',
            'img.featured-image',
            'img.hero-image',
            'img[src*="wp-content"]',
            'img[data-src*="wp-content"]',
            'img',
            'source'
        ];

        let imageUrl = null;

        for (const selector of selectors) {
            const $img = $article.find(selector).first();
            
            if ($img.length) {
                // Try different attribute combinations
                imageUrl = $img.attr('src') || 
                          $img.attr('data-src') || 
                          $img.attr('data-lazy-src') ||
                          this.extractSrcsetUrl($img.attr('srcset'));
                
                if (imageUrl) {
                    break;
                }
            }
        }

        return imageUrl;
    }

    extractSrcsetUrl(srcset) {
        if (!srcset) return null;
        
        // Split srcset into array of "url size" pairs
        const sources = srcset.split(',').map(src => src.trim().split(' ')[0]);
        
        // Return the first URL
        return sources[0] || null;
    }

    filterDuplicates(articles) {
        return articles.filter((article, index, self) => 
            index === self.findIndex((t) => t.title === article.title)
        );
    }
}

module.exports = BaseCrawler;