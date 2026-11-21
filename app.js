const grid=document.getElementById("book-grid");
const search=document.getElementById("search-input");
const count=document.getElementById("book-count");
const empty=document.getElementById("empty-state");
const dialog=document.getElementById("book-dialog");
const dialogContent=document.getElementById("dialog-content");
let books=[];
let activeFilter="all";
const storeSearches=[
 ["Amazon","https://www.amazon.com/s?k="],
 ["AbeBooks","https://www.abebooks.com/servlet/SearchResults?kn="],
 ["Bookshop.org","https://bookshop.org/search?keywords="],
 ["Barnes & Noble","https://www.barnesandnoble.com/s/"],
 ["Walmart","https://www.walmart.com/search?q="],
 ["bol","https://www.bol.com/be/nl/s/?searchtext="],
 ["Kobo","https://www.kobo.com/search?query="],
 ["Google Books","https://books.google.com/books?q="]
];
const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
function render(){
 const term=search.value.trim().toLowerCase();
 const visible=books.filter(book=>{
  const matches=(book.title+" "+(book.category||"")).toLowerCase().includes(term);
  const ready=book.status==="available";
  return matches&&(activeFilter==="all"||(activeFilter==="available"&&ready)||(activeFilter==="coming"&&!ready));
 });
 count.textContent=visible.length+" "+(visible.length===1?"book":"books");
 grid.innerHTML=visible.map(book=>`<article class="book-card" tabindex="0" role="button" aria-label="View ${esc(book.title)}" data-id="${esc(book.id)}"><div class="cover ${esc(book.cover||"blue")}"><span class="cover-title">${esc(book.title)}</span><span class="cover-label">BOOK READ COLLECTION</span></div><div class="book-info"><h3>${esc(book.title)}</h3><div class="book-meta">${esc(book.category||"Book")}</div><span class="book-status ${book.status==="available"?"ready":""}">${book.status==="available"?"EDITION LINKS AVAILABLE":"STORE LINKS BEING VERIFIED"}</span></div></article>`).join("");
 empty.hidden=visible.length>0;
}
function openBook(id){
 const book=books.find(item=>item.id===id);if(!book)return;
 const editions=book.editions||[];
 dialogContent.innerHTML=`<p class="eyebrow">${esc(book.category||"BOOK DETAILS")}</p><h2 class="dialog-title">${esc(book.title)}</h2><p class="dialog-description">${esc(book.description||"This title is part of the growing Book Read catalogue. Retailer listings are being checked before purchase links are published.")}</p>${editions.length?`<div class="edition-list">${editions.map(e=>`<div class="edition"><div><strong>${esc(e.format)}</strong><small>${esc(e.retailer)} · ${esc(e.price)}</small></div><a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">Visit store ↗</a></div>`).join("")}</div>`:`<p class="pending-note">Purchase links for this title are being verified. We will add store options once the correct listings are confirmed.</p>`}<h3 class="store-search-heading">Find this book at more stores</h3><p class="store-search-note">Search these retailers for this title. Availability and format depend on each store.</p><div class="edition-list">${storeSearches.filter(([name])=>book.id!=="architecture-human-nature"||!["Kobo","Google Books"].includes(name)).map(([name,base])=>`<div class="edition"><div><strong>${esc(name)}</strong><small>Search for ${esc(book.title)}</small></div><a href="${base+encodeURIComponent(book.title+" Mathias Simiyu")}" target="_blank" rel="noopener noreferrer">Search store ↗</a></div>`).join("")}</div>`;
 dialog.showModal();
}
grid.addEventListener("click",event=>{const card=event.target.closest("[data-id]");if(card)openBook(card.dataset.id)});
grid.addEventListener("keydown",event=>{if((event.key==="Enter"||event.key===" ")&&event.target.matches("[data-id]")){event.preventDefault();openBook(event.target.dataset.id)}});
search.addEventListener("input",render);
document.querySelectorAll(".filter-button").forEach(button=>button.addEventListener("click",()=>{document.querySelector(".filter-button.active")?.classList.remove("active");button.classList.add("active");activeFilter=button.dataset.filter;render()}));
document.getElementById("dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
document.getElementById("year").textContent=new Date().getFullYear();
fetch("./books.json").then(response=>{if(!response.ok)throw new Error("Catalogue unavailable");return response.json()}).then(data=>{books=data;render()}).catch(()=>{count.textContent="Catalogue unavailable";empty.hidden=false;empty.textContent="The book catalogue could not be loaded. Please refresh the page."});