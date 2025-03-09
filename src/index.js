const TechRadarCrawler = require('./crawlers/techradar');
const CNETCrawler = require('./crawlers/cnet');
const TechCrunchCrawler = require('./crawlers/techcrunch');
const WiredCrawler = require('./crawlers/wired');
const TheVergeCrawler = require('./crawlers/theverge');
const GeekTimeCrawler = require('./crawlers/geektime');
const logger = require('./utils/logger');
const fs = require('fs').promises;
const path = require('path');
const os = require("os");
require('dotenv').config();

async function main() {
    const crawlers = [
        new TechRadarCrawler(),
        new CNETCrawler(),
        new TechCrunchCrawler(),
        new WiredCrawler(),
        new TheVergeCrawler(),
        new GeekTimeCrawler()
    ];

    const allArticles = [];

    for (const crawler of crawlers) {
        try {
            const articles = await crawler.crawl();
            allArticles.push(...articles);
        } catch (error) {
            logger.error(`Error crawling ${crawler.name}: ${error.message}`);
        }
    }

    // Create data directory if it doesn't exist
    const dataDir = process.env.DATA_DIRECTORY ? path.join(__dirname, process.env.DATA_DIRECTORY) : `${os.homedir()}/shared/tech-news`;
    await fs.mkdir(dataDir, { recursive: true });

    // Save articles to JSON file
    const outputPath = path.join(dataDir, 'news.json');
    await fs.writeFile(outputPath, JSON.stringify(allArticles, null, 2));
}

main().catch(error => {
    logger.error(`Fatal error: ${error.message}`);
    process.exit(1);
}); 