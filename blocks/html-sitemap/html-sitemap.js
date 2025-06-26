import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const res = await fetch('/sitemap.xml');
  const xmlText = await res.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

  const urls = [...xmlDoc.querySelectorAll('url > loc')]
    .map(loc => loc.textContent)
    .filter(url => url.startsWith('https://main--eds-learning--chetan-patel-intouch.aem.page/'));

  const ul = document.createElement('ul');
  urls.forEach((url) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = url;
    a.textContent = url.replace(/^https:\/\/main--eds-learning--chetan-patel-intouch\.aem\.page/, '');
    li.append(a);
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
