# Book Read

A mobile-first book discovery catalogue. Readers can browse titles, search by title or subject, inspect recorded editions, and open retailer listings or format-specific store searches.

## Features

- Responsive catalogue with title search and category browsing.
- Book detail pages show recorded direct retailer listings where available.
- Format-specific shopping: eBook, paperback, hardcover, or all formats.
- Every catalogue title has retailer-search destinations, including Amazon, AbeBooks, Bookshop.org, Barnes & Noble, Walmart, bol, Kobo, Google Play Books, Apple Books, Google Books, Thalia, Foyles, Readings, Kinokuniya and World of Books.
- Direct edition links are kept separate from retailer search links.
- Search links are discovery links only; they do not guarantee that a retailer currently stocks a title or a particular format. The retailer's own page is the source of truth for availability, price, shipping and edition.
- No payment details are collected by Book Read. Purchases happen on the retailer's website.
- The app does not display the catalogue owner's personal name.

## Run locally

Serve this folder with any static web server. For example:

```sh
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

This is a static site and can be deployed from the repository root using GitHub Pages or another static hosting provider. No server secrets or database are required for the catalogue.

## Android packaging

The website can be packaged using Capacitor. The Android wrapper should bundle the website locally rather than merely opening a remote URL.

## Catalogue maintenance

Edit `books.json`. For each title, add only verified direct retailer URLs and edition details. Use the `editions` array for confirmed listing destinations; do not label a retailer search as a direct listing. Include ISBN-13 identifiers when available so print editions can be matched accurately.

## Publishing and ebook exclusivity

Before publishing direct digital sales links, check the relevant ebook's distribution and exclusivity terms. A title enrolled in KDP Select must not be offered as a digital ebook through competing stores during its enrolment. Print editions may be listed separately where the publisher permits it.
