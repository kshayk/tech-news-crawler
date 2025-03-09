const BaseCrawler = require('./base-crawler');

class WiredCrawler extends BaseCrawler {
    constructor() {
        super('Wired', 'https://www.wired.com');
    }

    async crawl() {
        const $ = await this.fetchPage();
        const articles = [];

        // Process summary cards
        $('.summary-item').each((i, element) => {
            const $article = $(element);
            const $link = $article.find('a').first();
            const title = $article.find('h3').first().text().trim();
            const link = $link.attr('href');

            if (title && link && !this.shouldFilterTitle(title)) {
                const imageUrl = this.extractImage($article);
                const description = $article.find('p').text().trim();

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

        // Process featured articles
        $('.card-component').each((i, element) => {
            const $article = $(element);
            const $link = $article.find('a').first();
            const title = $article.find('h2, h3').first().text().trim();
            const link = $link.attr('href');

            if (title && link && !this.shouldFilterTitle(title)) {
                const imageUrl = this.extractImage($article);
                const description = $article.find('p').text().trim();

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
            'Apple', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Facebook',
            'Twitter', 'X', 'Tesla', 'SpaceX', 'Samsung', 'Sony', 'Nintendo',
            'Netflix', 'Disney', 'OpenAI', 'Anthropic', 'Discord', 'TikTok',
            'Nvidia', 'AMD', 'Intel', 'Qualcomm', 'Uber', 'Lyft', 'Airbnb',
            'Spotify', 'Reddit', 'LinkedIn', 'Zoom', 'Slack', 'GitHub'
        ];

        const found = companies.find(company => 
            title.toLowerCase().includes(company.toLowerCase())
        );

        return found || this.name;
    }

    shouldFilterTitle(title) {
        const filters = [
            'Wired',
            'More from',
            'Best',
            'vs.',
            'Review:'
        ];

        return filters.some(filter => 
            title.toLowerCase().includes(filter.toLowerCase())
        );
    }
}

module.exports = WiredCrawler; 