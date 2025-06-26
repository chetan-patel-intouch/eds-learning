export default async function decorate(block) {
  const res = await fetch('/sitemap.xml');
  const xmlText = await res.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

  const urls = [...xmlDoc.querySelectorAll('url > loc')]
    .map(loc => loc.textContent)
    .filter(url => url.startsWith('https://main--eds-learning--chetan-patel-intouch.aem.page/'));

  // Group URLs by top-level path segment
  const groups = {};

  urls.forEach((url) => {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const topLevel = pathParts.length > 1 ? pathParts[0] : 'root';
    const page = pathParts[pathParts.length - 1] || 'home';

    if (!groups[topLevel]) groups[topLevel] = [];
    groups[topLevel].push({
      title: page === 'home' ? 'Home' : page.replace(/-/g, ' ').replace(/\.[^/.]+$/, ''),
      url: url,
    });
  });

  const ul = document.createElement('ul');

  Object.entries(groups).forEach(([groupName, pages]) => {
    const li = document.createElement('li');
    const groupTitle = document.createTextNode(groupName === 'root' ? ' ' : capitalize(groupName));
    li.appendChild(groupTitle);

    if (pages.length > 0) {
      const subUl = document.createElement('ul');
      pages.forEach(({ title, url }) => {
        const subLi = document.createElement('li');
        const a = document.createElement('a');
        a.href = url;
        a.textContent = capitalize(title);
        subLi.appendChild(a);
        subUl.appendChild(subLi);
      });
      li.appendChild(subUl);
    }

    ul.appendChild(li);
  });

  block.textContent = '';
  block.appendChild(ul);
}

// Utility to capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}