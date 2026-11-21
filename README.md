# Book Read

A mobile-first book discovery catalogue. Readers can browse books, search by title or subject, read verified short descriptions, view retailer jacket images where available, compare recorded editions, and open the bookstore they choose.

## Features

- Responsive catalogue with text search across titles, subjects, descriptions, ISBNs and listed retailers.
- Real cover images sourced from the associated publisher/retailer product pages where verified; typographic fallbacks are used when no reliable jacket image is available.
- Book details include the verified title description, any matched Books2Read Universal Book Links, and recorded retailer product pages.
- Format-specific shopping for eBooks, paperbacks and hardcovers.
- Direct product destinations are visually separated from retailer search fallbacks.
- Retailer search links are discovery links only; they do not prove that a specific edition is in stock.
- Book Read does not collect payment details. Readers complete purchases on the chosen retailer's website.
- Catalogue ISBN-13 values are checked for valid check digits by the catalogue test.

## Run locally

Serve this folder with any static web server. For example:

```sh
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Validate catalogue

Run:

```sh
npm test
```

This checks catalogue JSON, unique book IDs, retailer URLs, ISBN-13 check digits, Kindle Select link restrictions and the matched Books2Read links.

## Android packaging

The website can be packaged using Capacitor. The `build:web` step copies the HTML, JavaScript, CSS, catalogue and icon into the local `www/` bundle before Android sync.

```sh
npm run build:web
npm run android:sync
```

## Catalogue maintenance

Edit `books.json`. Add only source-backed book descriptions, official jacket image URLs, valid ISBN-13 identifiers and exact product pages. Add a Books2Read URL only to its matching book's `universalUrls` array. Keep retailer search links as search destinations, not product listings.

## Availability and exclusivity

Retailer pages control their own prices, stock, edition details and shipping; Book Read does not guarantee retailer availability. The eBook for *The Architecture of Human Nature* is treated as Kindle Select exclusive and is not linked to competing digital stores while that exclusivity applies. Print editions are handled separately.
