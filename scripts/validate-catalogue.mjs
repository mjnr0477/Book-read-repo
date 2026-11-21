import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const books = JSON.parse(await readFile(new URL("../books.json", import.meta.url), "utf8"));
const universal = JSON.parse(await readFile(new URL("../universal-links.json", import.meta.url), "utf8"));

function validIsbn13(value) {
  if (typeof value !== "string" || value.length !== 13) return false;
  if ([...value].some(character => character < "0" || character > "9")) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(value[i]) * (i % 2 === 0 ? 1 : 3);
  return (10 - (sum % 10)) % 10 === Number(value[12]);
}

assert.ok(Array.isArray(books) && books.length > 0, "Catalogue must contain books");
const ids = new Set();
const isbnOwners = new Map();
const attachedUniversal = new Set();
let editionCount = 0;

for (const book of books) {
  assert.ok(book.id && typeof book.id === "string", "Every book needs an id");
  assert.ok(!ids.has(book.id), "Duplicate book id: " + book.id);
  ids.add(book.id);
  assert.ok(book.title && book.title.trim(), "Book " + book.id + " needs a title");
  assert.ok(Array.isArray(book.editions), "Book " + book.title + " needs an editions array");

  if (book.isbn) {
    assert.ok(validIsbn13(book.isbn), "Invalid ISBN-13 on " + book.title + ": " + book.isbn);
    if (isbnOwners.has(book.isbn)) assert.equal(isbnOwners.get(book.isbn), book.id, "ISBN reused by another title: " + book.isbn);
    isbnOwners.set(book.isbn, book.id);
  }

  if (book.coverUrl) assert.ok(book.coverUrl.startsWith("https://"), "Cover URL must use HTTPS: " + book.title);

  const urls = new Set();
  for (const edition of book.editions) {
    editionCount++;
    assert.ok(edition.format && edition.retailer, "Edition needs format and retailer: " + book.title);
    assert.ok((edition.url || "").startsWith("https://"), "Edition URL must use HTTPS: " + book.title);
    assert.ok(!urls.has(edition.url), "Duplicate edition URL on " + book.title + ": " + edition.url);
    urls.add(edition.url);
    if (edition.isbn) {
      assert.ok(validIsbn13(edition.isbn), "Invalid edition ISBN-13: " + book.title + " / " + edition.isbn);
      if (isbnOwners.has(edition.isbn)) assert.equal(isbnOwners.get(edition.isbn), book.id, "ISBN reused by another title: " + edition.isbn);
      isbnOwners.set(edition.isbn, book.id);
    }
  }

  const universalUrls = Array.isArray(book.universalUrls) ? book.universalUrls : (book.universalUrl ? [book.universalUrl] : []);
  for (const url of universalUrls) {
    assert.ok(url.startsWith("https://books2read.com/u/"), "Invalid Books2Read UBL URL: " + url);
    assert.ok(!attachedUniversal.has(url), "Books2Read link attached more than once: " + url);
    attachedUniversal.add(url);
  }
}

assert.ok(books.every(book => book.editions.length > 0), "Every published catalogue entry should have at least one edition destination");
assert.ok(Array.isArray(universal.links), "Universal link index must be present");
assert.equal(new Set(universal.links).size, universal.links.length, "Universal link index contains duplicates");
assert.equal(attachedUniversal.size, universal.links.length, "Every saved UBL must be attached to exactly one catalogue title");
for (const url of universal.links) assert.ok(attachedUniversal.has(url), "UBL is not attached to a book: " + url);

const selectBook = books.find(book => book.id === "architecture-human-nature");
assert.ok(selectBook, "KDP Select title must exist");
for (const edition of selectBook.editions) {
  const isEbook = /ebook|kindle|digital/i.test(edition.format);
  if (isEbook) assert.match(edition.retailer, /^Amazon$/i, "KDP Select eBook must remain Amazon-only");
}

console.log("Catalogue validation passed: " + books.length + " books, " + editionCount + " edition destinations, " + attachedUniversal.size + " matched Books2Read links, " + isbnOwners.size + " unique ISBNs.");
