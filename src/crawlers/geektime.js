const BaseCrawler = require('./base-crawler');

class GeekTimeCrawler extends BaseCrawler {
  constructor() {
    super('GeekTime', 'https://www.geektime.co.il');
  }

  async crawl() {
    const $ = await this.fetchPage();
    const articles = [];

    // Process main articles from the homepage
    $('.card.card-big-col4').each((i, element) => {
      const $article = $(element);
      const title = $article.attr('data-title');
      const link = $article.find('a').first().attr('href');
      const description = '';  // Description is not readily available in the card
      const imageUrl = $article.find('img').first().attr('src');
      const isSponsored = $article.attr('data-financed') === 'yes';

      if (title && link && !this.shouldFilterTitle(title) && !isSponsored) {
        articles.push({
          title,
          link: this.normalizeLink(link),
          description,
          image: imageUrl,
          source: this.name,
          company: this.extractCompany(title)
        });
      }
    });

    // Process sponsored articles (but mark them as sponsored)
    $('.card.card-sponsor').each((i, element) => {
      const $article = $(element);
      const title = $article.attr('data-title');
      const link = $article.find('a').first().attr('href');
      const description = '';  // Description is not readily available in the card
      const imageUrl = $article.find('img').first().attr('src');

      if (title && link && !this.shouldFilterTitle(title)) {
        articles.push({
          title,
          link: this.normalizeLink(link),
          description,
          image: imageUrl,
          source: this.name,
          company: this.extractCompany(title),
          sponsored: true
        });
      }
    });

    return this.filterDuplicates(articles);
  }

  normalizeLink(link) {
    if (link.startsWith('/')) {
      return `${this.baseUrl}${link}`;
    }
    return link;
  }

  extractCompany(title) {
    const companies = [
      // International companies
      'Apple', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Facebook',
      'Twitter', 'X', 'Tesla', 'SpaceX', 'Samsung', 'Sony', 'Nintendo',
      'Netflix', 'Disney', 'OpenAI', 'Anthropic', 'Discord', 'TikTok',
      'Nvidia', 'AMD', 'Intel', 'Qualcomm', 'Uber', 'Lyft', 'Airbnb',
      'Spotify', 'Reddit', 'LinkedIn', 'Zoom', 'Slack', 'GitHub',
      // Israeli companies
      'Wix', 'Monday', 'Fiverr', 'Taboola', 'Outbrain', 'Mobileye',
      'SimilarWeb', 'Gett', 'Playtika', 'IronSource', 'Payoneer',
      'Waze', 'Gong', 'Rapyd', 'Riskified', 'Lemonade', 'eToro',
      'Check Point', 'CyberArk', 'Imperva', 'Cellebrite', 'JFrog',
      'Kaltura', 'Sisense', 'Walkme', 'Innoviz', 'Armis', 'Snyk'
    ];

    const found = companies.find(company => 
      title.toLowerCase().includes(company.toLowerCase())
    );

    return found || this.name;
  }

  shouldFilterTitle(title) {
    const filters = [
      'ספונסר',  // Hebrew for "Sponsor"
      'פרסומי',  // Hebrew for "Promotional"
      'מומלץ',   // Hebrew for "Recommended"
      'שיתוף פעולה', // Hebrew for "Collaboration"
      'מדריך',   // Hebrew for "Guide"
      'איך',     // Hebrew for "How"
      'סקירה',   // Hebrew for "Review"
      'מקודם'    // Hebrew for "Promoted"
    ];

    return filters.some(filter => 
      title.toLowerCase().includes(filter.toLowerCase())
    );
  }
}

module.exports = GeekTimeCrawler; 