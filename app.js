const grid=document.getElementById("book-grid");
const search=document.getElementById("search-input");
const count=document.getElementById("book-count");
const empty=document.getElementById("empty-state");
const dialog=document.getElementById("book-dialog");
const dialogContent=document.getElementById("dialog-content");
let books=[];
let activeFilter="all";
let selectedFormat="all";

// Retailer search destinations are fallbacks, not claims that a specific edition is in stock.
const retailers=[
 {name:"Amazon US",formats:["ebook","paperback","hardcover"],search:q=>"https://www.amazon.com/s?k="+q},
 {name:"Amazon UK",formats:["ebook","paperback","hardcover"],search:q=>"https://www.amazon.co.uk/s?k="+q},
 {name:"Amazon Canada",formats:["ebook","paperback","hardcover"],search:q=>"https://www.amazon.ca/s?k="+q},
 {name:"Amazon Australia",formats:["ebook","paperback","hardcover"],search:q=>"https://www.amazon.com.au/s?k="+q},
 {name:"AbeBooks",formats:["paperback","hardcover"],search:q=>"https://www.abebooks.com/servlet/SearchResults?kn="+q},
 {name:"Bookshop.org",formats:["paperback","hardcover","ebook"],search:q=>"https://bookshop.org/search?keywords="+q},
 {name:"Barnes & Noble",formats:["ebook","paperback","hardcover"],search:q=>"https://www.barnesandnoble.com/s/"+q},
 {name:"Walmart Books",formats:["paperback","hardcover"],search:q=>"https://www.walmart.com/search?q="+q},
 {name:"bol",formats:["ebook","paperback","hardcover"],search:q=>"https://www.bol.com/be/nl/s/?searchtext="+q},
 {name:"Kobo",formats:["ebook"],search:q=>"https://www.kobo.com/search?query="+q},
 {name:"Google Play Books",formats:["ebook"],search:q=>"https://play.google.com/store/search?q="+q+"&c=books"},
 {name:"Apple Books",formats:["ebook"],search:q=>"https://books.apple.com/us/search?term="+q},
 {name:"Google Books",formats:["ebook","paperback","hardcover"],search:q=>"https://books.google.com/books?q="+q},
 {name:"Thalia",formats:["ebook","paperback","hardcover"],search:q=>"https://www.thalia.de/suche?sq="+q},
 {name:"Foyles",formats:["paperback","hardcover"],search:q=>"https://www.foyles.co.uk/search?term="+q},
 {name:"Readings",formats:["paperback","hardcover"],search:q=>"https://www.readings.com.au/search/results?query="+q},
 {name:"Kinokuniya",formats:["paperback","hardcover"],search:q=>"https://www.kinokuniya.com/search?q="+q},
 {name:"World of Books",formats:["paperback","hardcover"],search:q=>"https://www.wob.com/en-gb/search?query="+q},
 {name:"The Nile",formats:["paperback","hardcover"],search:q=>"https://www.thenile.com.au/search/?q="+q},
 {name:"Dymocks",formats:["paperback","hardcover"],home:"https://www.dymocks.com.au/"},
 {name:"Hatchards",formats:["paperback","hardcover"],home:"https://www.hatchards.co.uk/"},
 {name:"Tertulia",formats:["paperback","hardcover","ebook"],home:"https://tertulia.com/"},
 {name:"Takealot",formats:["paperback","hardcover"],home:"https://www.takealot.com/"},
 {name:"Indigo",formats:["ebook","paperback","hardcover"],home:"https://www.indigo.ca/"},
 {name:"Waterstones",formats:["paperback","hardcover"],home:"https://www.waterstones.com/"},
 {name:"Blackwell's",formats:["paperback","hardcover"],home:"https://blackwells.co.uk/"},
 {name:"Booktopia",formats:["paperback","hardcover"],home:"https://www.booktopia.com.au/"},
 {name:"Text Book Centre (Kenya)",formats:["ebook","paperback","hardcover"],home:"https://textbookcentre.com/shop/"},
 {name:"Bookstop (Kenya)",formats:["paperback","hardcover"],home:"https://bookstop.co.ke/"},
 {name:"Exclusive Books",formats:["paperback","hardcover"],home:"https://exclusivebooks.co.za/"},
 {name:"Prestige Bookshop (Kenya)",formats:["paperback","hardcover"],home:"https://prestigebookshop.com/"},
 {name:"Books-A-Million",formats:["paperback","hardcover"],home:"https://www.booksamillion.com/"}
];
const formatNames={all:"All formats",ebook:"eBook",paperback:"Paperback",hardcover:"Hardcover"};
const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
function render(){
 const term=search.value.trim().toLowerCase();
 const visible=books.filter(book=>{
  const matches=(book.title+" "+(book.category||"")).toLowerCase().includes(term);
  const ready=book.status==="available";
  return matches&&(activeFilter==="all"||(activeFilter==="available"&&ready)||(activeFilter==="coming"&&!ready));
 });
 count.textContent=visible.length+" "+(visible.length===1?"book":"books");
 grid.innerHTML=visible.map(book=>`<article class="book-card" tabindex="0" role="button" aria-label="View ${esc(book.title)}" data-id="${esc(book.id)}"><div class="cover ${esc(book.cover||"blue")}"><span class="cover-title">${esc(book.title)}</span><span class="cover-label">BOOK READ COLLECTION</span></div><div class="book-info"><h3>${esc(book.title)}</h3><div class="book-meta">${esc(book.category||"Book")}</div><span class="book-status ${book.status==="available"?"ready":""}">${book.status==="available"?"STORE OPTIONS":"STORE LINKS BEING VERIFIED"}</span></div></article>`).join("");
 empty.hidden=visible.length>0;
}
function formatForEdition(edition){
 const value=(edition.format||"").toLowerCase();
 if(value.includes("kindle")||value.includes("ebook")||value.includes("e-book")||value.includes("digital"))return "ebook";
 if(value.includes("hardcover")||value.includes("hardback"))return "hardcover";
 if(value.includes("paperback")||value.includes("print"))return "paperback";
 return "other";
}
function openBook(id){
 const book=books.find(item=>item.id===id);if(!book)return;
 selectedFormat="all";
 const editions=book.editions||[];
 const isSelectExclusive=book.id==="architecture-human-nature";
 const directHtml=`<h3 class="store-search-heading">Direct retailer listings</h3><div class="edition-list" id="direct-editions"></div>`;
 dialogContent.innerHTML=`<p class="eyebrow">${esc(book.category||"BOOK DETAILS")}</p><h2 class="dialog-title">${esc(book.title)}</h2><p class="dialog-description">${esc(book.description||"Explore available editions and check each retailer for current price, format and delivery options.")}</p>${directHtml}<h3 class="store-search-heading">Shop this title by format</h3><div class="format-tabs" role="group" aria-label="Choose book format">${Object.entries(formatNames).map(([key,label])=>`<button type="button" class="format-button ${key==="all"?"active":""}" data-format="${key}">${label}</button>`).join("")}</div><p class="store-search-note" id="format-note">Choose a retailer to check its current listing. Search links do not guarantee stock or availability.</p><div class="edition-list" id="retailer-results"></div>${isSelectExclusive?'<p class="select-note">This eBook is enrolled in Kindle Select. Digital-store searches are limited to Amazon while that exclusivity applies; print editions can still be searched at other retailers.</p>':""}`;
 dialogContent.querySelectorAll(".format-button").forEach(button=>button.addEventListener("click",()=>{dialogContent.querySelector(".format-button.active")?.classList.remove("active");button.classList.add("active");selectedFormat=button.dataset.format;renderRetailers(book)}));
 renderRetailers(book);
 dialog.showModal();
}
function renderRetailers(book){
 const results=dialogContent.querySelector("#retailer-results");
 const directResults=dialogContent.querySelector("#direct-editions");
 if(!results||!directResults)return;
 const direct=(book.editions||[]).filter(e=>selectedFormat==="all"||formatForEdition(e)===selectedFormat);
 directResults.innerHTML=direct.length?direct.map(e=>`<div class="edition"><div><strong>${esc(e.format)}</strong><small>${esc(e.retailer)} · ${esc(e.price||"See store")}</small></div><a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">Open listing ↗</a></div>`).join(""):`<p class="pending-note">No direct listing for this format is recorded yet. Use the retailer searches below to check current availability.</p>`;
 const formats=selectedFormat==="all"?["ebook","paperback","hardcover"]:[selectedFormat];
 const entries=[];
 for(const format of formats){
  const available=retailers.filter(store=>store.formats.includes(format)&&(!((book.id==="architecture-human-nature")&&format==="ebook")||store.name==="Amazon"));
  for(const store of available){
   const query=encodeURIComponent(book.title+" "+(book.author||""));
   entries.push({name:store.name,format,url:store.search?store.search(query):store.home,searchable:!!store.search});
  }
 }
 // Keep each store visible once per format, so users can compare edition-specific results.
 results.innerHTML=entries.map(item=>`<div class="edition retailer-result"><div><strong>${esc(item.name)}</strong><small>${esc(formatNames[item.format])} · ${item.searchable?"title search":"official store homepage; search title there"}</small></div><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${item.searchable?"Search title":"Visit store"} ↗</a></div>`).join("");
}
grid.addEventListener("click",event=>{const card=event.target.closest("[data-id]");if(card)openBook(card.dataset.id)});
grid.addEventListener("keydown",event=>{if((event.key==="Enter"||event.key===" ")&&event.target.matches("[data-id]")){event.preventDefault();openBook(event.target.dataset.id)}});
search.addEventListener("input",render);
document.querySelectorAll(".filter-button").forEach(button=>button.addEventListener("click",()=>{document.querySelector(".filter-button.active")?.classList.remove("active");button.classList.add("active");activeFilter=button.dataset.filter;render()}));
document.getElementById("dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
document.getElementById("year").textContent=new Date().getFullYear();
fetch("./books.json").then(response=>{if(!response.ok)throw new Error("Catalogue unavailable");return response.json()}).then(data=>{books=data;render()}).catch(()=>{count.textContent="Catalogue unavailable";empty.hidden=false;empty.textContent="The book catalogue could not be loaded. Please refresh the page."});
