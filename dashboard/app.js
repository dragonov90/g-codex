const statusText = document.getElementById("statusText");
const refreshButton = document.getElementById("refreshButton");
const sourceList = document.getElementById("sourceList");
const newsList = document.getElementById("newsList");

const proxyUrl = (rssUrl) =>
  `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;

async function loadSources() {
  const response = await fetch("news_sources.json");
  return response.json();
}

function renderSources(sources) {
  sourceList.innerHTML = "";
  sources.forEach((source) => {
    const li = document.createElement("li");
    li.textContent = `${source.name} (${source.rss})`;
    sourceList.appendChild(li);
  });
}

function parseRss(xmlText, sourceName) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  const items = Array.from(doc.querySelectorAll("item"));
  return items.map((item) => ({
    title: item.querySelector("title")?.textContent ?? "Başlık yok",
    link: item.querySelector("link")?.textContent ?? "#",
    pubDate: item.querySelector("pubDate")?.textContent ?? "",
    source: sourceName,
  }));
}

function renderNews(items) {
  newsList.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "news-card";
    card.innerHTML = `
      <h3><a href="${item.link}" target="_blank" rel="noopener">${item.title}</a></h3>
      <div class="meta">${item.source} · ${item.pubDate}</div>
    `;
    newsList.appendChild(card);
  });
}

async function loadNews() {
  statusText.textContent = "Yükleniyor...";
  try {
    const sources = await loadSources();
    renderSources(sources);

    const results = await Promise.all(
      sources.map(async (source) => {
        const response = await fetch(proxyUrl(source.rss));
        const xmlText = await response.text();
        return parseRss(xmlText, source.name);
      })
    );

    const items = results.flat();
    items.sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1));
    renderNews(items);
    statusText.textContent = `Son güncelleme: ${new Date().toLocaleString()}`;
  } catch (error) {
    statusText.textContent = "Haberler yüklenemedi.";
  }
}

refreshButton.addEventListener("click", loadNews);

loadNews();
