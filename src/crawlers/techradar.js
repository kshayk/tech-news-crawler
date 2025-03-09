const BaseCrawler = require('./base-crawler');

class TechRadarCrawler extends BaseCrawler {
    constructor() {
        super('TechRadar', 'https://www.techradar.com');
    }

    async crawl() {
        const $ = await this.fetchPage();
        const articles = [];

        // Process main articles
        $('article').each((i, element) => {
            const $article = $(element);
            const $link = $article.find('a').first();
            const title = $article.find('h3').first().text().trim();
            const link = $link.attr('href');

            if (title && link && !this.shouldFilterTitle(title)) {
                const imageUrl = this.extractImage($article);
                const description = $article.find('p').text().trim();

                articles.push({
                    title,
                    link,
                    description,
                    image: imageUrl,
                    source: this.name,
                    company: this.extractCompany(title)
                });
            }
        });

        // Process featured articles
        $('.featured-article').each((i, element) => {
            const $article = $(element);
            const $link = $article.find('a').first();
            const title = $article.find('h2, h3').first().text().trim();
            const link = $link.attr('href');

            if (title && link && !this.shouldFilterTitle(title)) {
                const imageUrl = this.extractImage($article);
                const description = $article.find('p').text().trim();

                articles.push({
                    title,
                    link,
                    description,
                    image: imageUrl,
                    source: this.name,
                    company: this.extractCompany(title)
                });
            }
        });

        return this.filterDuplicates(articles);
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
            'TechRadar',
            'More from'
        ];

        return filters.some(filter => 
            title.toLowerCase().includes(filter.toLowerCase())
        );
    }
}

module.exports = TechRadarCrawler; 