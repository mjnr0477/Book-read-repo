# Book Read

A mobile-first book discovery catalogue. Readers can browse titles, search by title or subject, inspect available editions, and continue to a retailer's own checkout.

## Current state

- Responsive website foundation.
- Search and catalogue filters.
- Book detail dialog with external retailer links.
- Initial catalogue of 23 title records.
- The first title has three Amazon edition links supplied in the project brief.
- Other titles are intentionally marked for retailer-link verification; no purchase links have been guessed.
- No author personal name is displayed in the app.

## Run locally

Serve this folder with any static web server. For example:

```sh
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

This is a static site and can be deployed from the repository root using GitHub Pages or another static hosting provider. No server secrets or database are required for the first release.

## Android packaging

The website can later be packaged using Capacitor. The Android wrapper should bundle the built website locally rather than merely opening a remote URL.

## Catalogue maintenance

Edit `books.json`. For each title, add only verified retailer URLs and edition details. The app does not process payments; retailers handle their own checkout.

## Important publishing note

Before publishing direct digital sales links, check the relevant ebook's distribution and exclusivity terms. In particular, a title enrolled in KDP Select must not be offered as a digital ebook through competing stores during its enrolment.
