const BaseCrawler = require('./base-crawler');

class CNETCrawler extends BaseCrawler {
    constructor() {
        super('CNET', 'https://www.cnet.com');
    }

    async crawl() {
        const $ = await this.fetchPage();
        const articles = [];

        // Process main articles
        $('.c-storiesHighlight article, .c-storiesList article').each((i, element) => {
            const $article = $(element);
            const $title = $article.find('.c-storyCard_title');
            const $link = $title.find('a');
            const title = $title.text().trim();
            const link = $link.attr('href');

            if (title && link && !this.shouldFilterTitle(title)) {
                const imageUrl = this.extractImage($article);
                const description = $article.find('.c-storyCard_dek').text().trim();

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
        $('.c-featureCard').each((i, element) => {
            const $article = $(element);
            const $title = $article.find('.c-featureCard_title');
            const $link = $title.find('a');
            const title = $title.text().trim();
            const link = $link.attr('href');

            if (title && link && !this.shouldFilterTitle(title)) {
                const imageUrl = this.extractImage($article);
                const description = $article.find('.c-featureCard_dek').text().trim();

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
            'Spotify', 'Reddit', 'LinkedIn', 'Zoom', 'Slack', 'GitHub',
            'iPhone', 'iPad', 'MacBook', 'Galaxy', 'Surface', 'PlayStation',
            'Xbox', 'Switch', 'ChatGPT', 'Gemini', 'Claude'
        ];

        const found = companies.find(company => 
            title.toLowerCase().includes(company.toLowerCase())
        );

        return found || this.name;
    }

    shouldFilterTitle(title) {
        const filters = [
            'CNET',
            'More from',
            'Best',
            'vs.',
            'Review:',
            'Deal:',
            'Deals:',
            'How to',
            'Guide:'
        ];

        return filters.some(filter => 
            title.toLowerCase().includes(filter.toLowerCase())
        );
    }
}

module.exports = CNETCrawler; 