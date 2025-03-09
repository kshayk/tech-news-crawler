const BaseCrawler = require('./base-crawler');

class TechCrunchCrawler extends BaseCrawler {
    constructor() {
        super('techcrunch');
    }

    async crawl() {
        const $ = await this.fetchPage('https://techcrunch.com');
        const articles = [];

        // Process main articles
        $('.loop-card').each((i, element) => {
            const title = $(element).find('.loop-card__title-link').text().trim();
            const link = $(element).find('.loop-card__title-link').attr('href');
            const description = $(element).find('.loop-card__content').text().trim();
            const imageUrl = $(element).find('img').attr('src');

            if (title && link && !this.shouldFilterTitle(title)) {
                articles.push({
                    title,
                    link,
                    description,
                    imageUrl,
                    source: 'techcrunch',
                    company: this.extractCompany(title)
                });
            }
        });

        return articles;
    }

    shouldFilterTitle(title) {
        const filterPhrases = [
            'Sponsored',
            'Advertorial',
            'Partner Content',
            'How to',
            'Guide:',
            'Deal:',
            'Deals:'
        ];
        return filterPhrases.some(phrase => title.includes(phrase));
    }

    extractCompany(title) {
        const companies = [
            'Apple', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Facebook',
            'Twitter', 'X', 'Tesla', 'SpaceX', 'OpenAI', 'Anthropic',
            'Discord', 'Zoom', 'Slack', 'GitHub', 'GitLab', 'LinkedIn',
            'Netflix', 'Uber', 'Lyft', 'Airbnb', 'DoorDash', 'Instacart',
            'Robinhood', 'Coinbase', 'Binance', 'Stripe', 'Square', 'PayPal',
            'Adobe', 'Salesforce', 'Oracle', 'IBM', 'Intel', 'AMD', 'Nvidia',
            'Samsung', 'Sony', 'LG', 'Huawei', 'Xiaomi', 'OnePlus', 'OPPO',
            'Spotify', 'TikTok', 'Snap', 'Pinterest', 'Reddit'
        ];

        for (const company of companies) {
            if (title.includes(company)) {
                return company;
            }
        }
        return null;
    }
}

module.exports = TechCrunchCrawler; 