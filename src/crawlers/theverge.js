const BaseCrawler = require('./base-crawler');

class TheVergeCrawler extends BaseCrawler {
  constructor() {
    super('theverge');
  }

  async crawl() {
    const $ = await this.fetchPage('https://www.theverge.com');
    const articles = [];

    // Find all script tags containing article data
    $('script').each((i, elem) => {
      const scriptContent = $(elem).html();
      if (scriptContent && scriptContent.includes('__typename":"PostResourceType"')) {
        // Extract article data from the script content
        const matches = scriptContent.match(/"title":"([^"]+).*?"permalink":"([^"]+).*?"dek":{"html":"([^"]+)/g);
        if (matches) {
          matches.forEach(match => {
            const titleMatch = match.match(/"title":"([^"]+)/);
            const linkMatch = match.match(/"permalink":"([^"]+)/);
            const descMatch = match.match(/"dek":{"html":"([^"]+)/);

            if (titleMatch && linkMatch) {
              const title = titleMatch[1];
              const link = linkMatch[1];
              const description = descMatch ? descMatch[1] : '';

              if (!this.shouldFilterTitle(title)) {
                articles.push({
                  title,
                  link: this.normalizeLink(link),
                  description,
                  company: this.extractCompany(title)
                });
              }
            }
          });
        }
      }
    });

    return articles;
  }

  normalizeLink(link) {
    if (link.startsWith('https://')) {
      return link;
    }
    return `https://www.theverge.com${link}`;
  }

  shouldFilterTitle(title) {
    const filterPhrases = [
      'Sponsored',
      'Advertorial',
      'Advertisement',
      'How to',
      'Newsletter'
    ];
    return filterPhrases.some(phrase => title.toLowerCase().includes(phrase.toLowerCase()));
  }

  extractCompany(title) {
    const companies = [
      'Apple',
      'Google',
      'Microsoft',
      'Amazon',
      'Meta',
      'Facebook',
      'Twitter',
      'X',
      'TikTok',
      'Samsung',
      'Sony',
      'Netflix',
      'Disney',
      'Tesla',
      'SpaceX',
      'OpenAI',
      'Anthropic',
      'NVIDIA',
      'AMD',
      'Intel'
    ];

    for (const company of companies) {
      if (title.includes(company)) {
        return company;
      }
    }
    return null;
  }
}

module.exports = TheVergeCrawler; 