import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { site, categories, posts, reviews, whatsapp } from '../site.config.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const arrow = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const icons = {
  arrow,
  whatsapp: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.5-4.7a8.5 8.5 0 1 1 16-4.2Z"/><path d="m8 7 2 3-1.2 1.2a9 9 0 0 0 4 4L14 14l3 2c-.8 2.4-3.4 1.4-5.5.2a12 12 0 0 1-4.7-4.7C5.6 9.4 5.6 7.6 8 7Z"/></svg>',
  pin: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  phone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="m6 3 4 5-2 3a16 16 0 0 0 5 5l3-2 5 4c-1 5-6 3-10 0S1 8 3 4Z"/></svg>',
  play: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4Z" fill="currentColor" stroke="none"/></svg>',
  close: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>',
};
const ext = 'target="_blank" rel="noopener noreferrer"';
function categoryCard(item, index, featured) {
  const url = whatsapp(`Hello Lalpotu Collection, I would like to see your ${item.name}. Please share current designs, prices and availability.`);
  return `<a class="${featured ? `collection-card ${item.tone}` : 'category-card'} reveal" data-category="${escape(item.name)}" href="${escape(url)}" ${ext}><span class="card-number">${String(index + 1).padStart(2, '0')}</span>${featured ? '<span class="woven-art" aria-hidden="true"></span>' : ''}<div><span class="card-group">${escape(item.group)}</span><h3>${escape(item.name)}</h3>${featured ? `<p>${escape(item.note)}</p>` : ''}</div><span class="card-link">${featured ? 'Explore on WhatsApp ' : ''}${arrow}</span></a>`;
}
function stars(rating) {
  return `<span class="stars" role="img" aria-label="${rating} out of 5 stars"><span aria-hidden="true">☆☆☆☆☆</span><span class="star-fill" style="width:${rating / 5 * 100}%" aria-hidden="true">★★★★★</span></span>`;
}

// Never advertise a guessed/localhost canonical URL.
const configuredUrl = process.env.SITE_URL || site.url;
let base = '';
if (configuredUrl) {
  const url = new URL(configuredUrl);
  if (url.protocol !== 'https:' || /^(localhost|127\.|\[::1\])/.test(url.hostname) || url.username || url.password || url.search || url.hash) throw new Error('Use the confirmed public HTTPS URL without credentials, query or hash.');
  base = url.href.replace(/\/?$/, '/');
}
const absolute = (resource) => new URL(resource, base).href;
const schema = {
  '@context': 'https://schema.org', '@type': 'ClothingStore', name: site.name,
  telephone: site.phone, address: { '@type': 'PostalAddress', streetAddress: site.street, addressLocality: site.city, addressRegion: site.region, postalCode: site.postcode, addressCountry: 'IN' },
  geo: { '@type': 'GeoCoordinates', latitude: site.latitude, longitude: site.longitude },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: site.hours.opens, closes: site.hours.closes }],
  sameAs: [site.instagram], hasMap: site.maps,
  ...(base ? { url: base, image: absolute('public/assets/social-share.jpg'), logo: absolute('public/assets/logo.webp') } : {}),
};
const replacements = {
  ...Object.fromEntries(Object.entries(site).filter(([, v]) => typeof v !== 'object').map(([k, v]) => [k, escape(v)])),
  ...Object.fromEntries(Object.entries(icons).map(([key, value]) => [`icon.${key}`, value])),
  whatsapp: escape(whatsapp()), hoursLabel: escape(site.hours.label), year: new Date().getFullYear(),
  productionMeta: base ? `<link rel="canonical" href="${escape(base)}" />\n    <meta property="og:url" content="${escape(base)}" />\n    <meta property="og:image" content="${escape(absolute('public/assets/social-share.jpg'))}" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta property="og:image:alt" content="Lalpotu Collection — sarees and ethnic wear, Nanded" />\n    <meta name="twitter:image" content="${escape(absolute('public/assets/social-share.jpg'))}" />` : '<!-- Canonical and absolute sharing URLs are added when SITE_URL is configured. -->',
  structuredData: JSON.stringify(schema).replace(/</g, '\\u003c'),
  featuredCards: categories.slice(0, 4).map((c, i) => categoryCard(c, i, true)).join('\n'),
  categoryCards: categories.slice(4).map((c, i) => categoryCard(c, i + 4, false)).join('\n'),
  postCards: posts.map((p) => `<a class="post-card reveal" href="${site.instagram}reel/${p.code}/" ${ext}><div class="post-image"><img src="public/assets/${p.image}-360.webp" srcset="public/assets/${p.image}-180.webp 180w, public/assets/${p.image}-360.webp 360w" sizes="(max-width: 700px) 44vw, 23vw" width="360" height="640" loading="lazy" decoding="async" alt="${escape(p.alt)}" /><span class="post-play">${icons.play}<span class="sr-only">Watch reel on Instagram</span></span></div><div class="post-caption"><span>${escape(p.date)} · Instagram reel</span><h3>${escape(p.title)}</h3><span class="post-link">Watch on Instagram ${arrow}</span></div></a>`).join('\n'),
  ratingStars: stars(site.rating),
  reviewCards: reviews.map((r) => `<figure class="review-card reveal">${stars(r.rating)}<blockquote cite="${escape(site.maps)}"><p>“${escape(r.quote)}”</p></blockquote><figcaption><strong>${escape(r.author)}</strong><span>${escape(r.age)}</span><a href="${escape(site.maps)}" ${ext}>Google Maps review ${arrow}</a></figcaption></figure>`).join('\n'),
};
const template = await readFile(path.join(root, 'site.template.html'), 'utf8');
const html = template.replace(/\{\{([\w.]+)\}\}/g, (_, key) => {
  if (!(key in replacements)) throw new Error(`Missing template value: ${key}`);
  return replacements[key];
});
await writeFile(path.join(root, 'index.html'), html);
const out = process.env.BUILD_DIR ? path.resolve(root, process.env.BUILD_DIR) : path.join(root, 'dist');
await mkdir(path.join(out, 'public/assets'), { recursive: true });
for (const name of ['index.html', 'styles.css', 'script.js']) await cp(path.join(root, name), path.join(out, name));
// Source PDFs and extraction intermediates are never shipped.
const usedAssets = [...new Set([...html.matchAll(/public\/assets\/([\w.-]+)/g)].map((m) => m[1]))];
usedAssets.push('social-share.jpg');
for (const name of new Set(usedAssets)) await cp(path.join(root, 'public/assets', name), path.join(out, 'public/assets', name));
await writeFile(path.join(out, 'robots.txt'), base ? `User-agent: *\nAllow: /\nSitemap: ${absolute('sitemap.xml')}\n` : 'User-agent: *\nDisallow: /\n');
await writeFile(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${base ? `<url><loc>${escape(base)}</loc></url>` : ''}</urlset>\n`);
await writeFile(path.join(out, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n');
console.log(`Built ${categories.length} collections, ${posts.length} real posts and ${reviews.length} verified review quotes.`);
console.log(base ? `Production URL: ${base}` : 'Preview build: set SITE_URL to the confirmed domain before publishing.');
