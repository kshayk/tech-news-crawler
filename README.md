# Tech News Crawler

A Node.js-based web crawler that aggregates tech news from popular technology news websites and normalizes the content into a structured JSON format.

## Supported News Sources

- TechRadar (techradar.com)
- CNET (cnet.com)
- TechCrunch (techcrunch.com)
- Wired (wired.com)
- The Verge (theverge.com)
- GeekTime (geektime.co.il)

## Output Format

Each article is normalized to the following JSON structure:

```json
{
  "source": "Website name",
  "company": "Company mentioned in the article (if detected)",
  "title": "Article title",
  "description": "Short description or summary",
  "image": "URL to the article's main image",
  "link": "URL to the full article"
}
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Run the crawler:

```bash
npm start
```

The crawler will output the aggregated news articles in JSON format to the console. You can redirect the output to a file:

```bash
npm start > news.json
```

## Error Handling

- All errors are logged to `error.log`
- Full execution logs are available in `combined.log`
- The crawler will continue running even if one source fails

## Dependencies

- axios: HTTP client for making requests
- cheerio: jQuery-like HTML parsing
- winston: Logging
- dotenv: Environment variable management

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 