// The single source for business details. Rebuild after editing this file.
export const site = {
  name: 'Lalpotu Collection',
  // Set only after the real HTTPS production domain is confirmed.
  url: '',
  phone: '+919146146699',
  phoneDisplay: '+91 91461 46699',
  instagram: 'https://www.instagram.com/lalpotucollection_nanded/',
  maps: 'https://maps.app.goo.gl/vFUSCapiayruCtEE8?g_st=iw',
  mapEmbed: 'https://www.google.com/maps?q=Lalpotu%20collection%2C%20Old%20Monda%2C%20Mahatma%20Gandhi%20Road%2C%20Nanded%2C%20Maharashtra%20431604&z=16&output=embed',
  street: 'Old Monda, Mahatma Gandhi Road',
  city: 'Nanded',
  region: 'Maharashtra',
  postcode: '431604',
  latitude: 19.1478621,
  longitude: 77.3211195,
  hours: { opens: '10:30', closes: '21:00', label: 'Every day · 10:30 am–9 pm' },
  verifiedOn: '2026-09-17',
  verifiedLabel: '17 September 2026',
  rating: 3.9,
  reviewCount: 36,
};

export const categories = [
  { name: 'Pure Silk Paithani Sarees', group: 'Signature silks', note: 'For your celebration wardrobe', tone: 'wine' },
  { name: 'Pure Silk Kanjivaram Sarees', group: 'Signature silks', note: 'An occasion to dress beautifully', tone: 'olive' },
  { name: 'Pure Chanderi Silk Sarees', group: 'Signature silks', note: 'Discover your favourite drape', tone: 'rose' },
  { name: 'Fancy Designer Sarees', group: 'Festive & designer', note: 'A fresh perspective on festive style', tone: 'copper' },
  { name: 'Synthetic Sarees', group: 'Everyday & gifting' },
  { name: 'Pure Silk Sarees', group: 'Signature silks' },
  { name: 'Pure Maheshwari Sarees', group: 'Signature silks' },
  { name: 'Pure Soft Silk', group: 'Signature silks' },
  { name: 'Semi Silk Paithani Sarees', group: 'Festive & designer' },
  { name: 'Fancy Cotton Sarees', group: 'Everyday & gifting' },
  { name: 'Fancy Designer Lehenga', group: 'Festive & designer' },
  { name: 'Suiting & Shirting', group: 'Ethnic & occasion wear' },
  { name: 'Navari Saree', group: 'Ethnic & occasion wear' },
  { name: 'Dhoti', group: 'Ethnic & occasion wear' },
  { name: 'Gifting Sarees', group: 'Everyday & gifting' },
];

// Actual public post covers; no stock photographs are labelled as shop inventory.
export const posts = [
  { image: 'organza', title: 'Organza, in the details', date: '7 Sep 2026', code: 'DdA8Z6nT6hh', alt: 'Red and gold organza saree shown in a Lalpotu Collection reel' },
  { image: 'maheshwari', title: 'The Maheshwari edit', date: '14 Sep 2026', code: 'DdS2t-MRuOQ', alt: 'Blue and green Maheshwari saree displayed inside Lalpotu Collection' },
  { image: 'viscose', title: 'A closer look at viscose silk', date: '13 Sep 2026', code: 'DdQMncuBNiW', alt: 'Viscose silk saree from Lalpotu Collection’s published reel' },
  { image: 'rajmata', title: 'Inside Lalpotu Collection', date: '15 Sep 2026', code: 'DdVTJYKM34_', alt: 'A presenter among saree displays inside Lalpotu Collection' },
];

// Verbatim selected public reviews. Relative dates preserved as shown at verification.
export const reviews = [
  { author: 'Yogesh Dantulwad', rating: 4, quote: 'Nice collection of cloths', age: '6 years ago at verification' },
  { author: 'Maroti', rating: 5, quote: 'Very good.', age: '2 years ago at verification' },
];

export function whatsapp(message = 'Hello Lalpotu Collection, I would like to explore your collection.') {
  return `https://wa.me/${site.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
