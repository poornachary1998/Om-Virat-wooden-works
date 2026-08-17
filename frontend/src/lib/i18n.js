'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const LangContext = createContext({ lang: 'en', setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('omsri-lang');
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('omsri-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Pick the right field off a CMS entry: pick(product, 'name') -> name_en or name_te */
export function pick(entry, field, lang) {
  if (!entry) return '';
  return (lang === 'te' ? entry[field + '_te'] : entry[field + '_en']) || entry[field + '_en'] || '';
}

export const UI = {
  en: {
    phone: 'Call us', hours: 'Mon–Sat, 9am–8pm', logoSub: 'Wooden & Building Works',
    navWork: 'Our Work', navCatalog: 'Catalog', navTeak: 'Why Teak', navGallery: 'Gallery',
    navReviews: 'Reviews', navCall: 'Call Now', navHome: 'Home', navVisit: 'Visit Us',
    all: 'All', enquire: 'Enquire about this →', viewCatalog: 'View full catalog →',
    heroKicker: 'Karimnagar · Teak wood work & building works',
    heroTitle: 'Teak wood work in Karimnagar — furniture and doors, built by hand and delivered on time.',
    heroBody: 'Om Sri Virat Wooden Furniture, Building Works & Aluminium Works does teak wood work in Karimnagar — beds, main doors, pooja doors and windows in seasoned teak — and takes on building and aluminium work alongside it. Our own carpenters handle every job from measurement to fitting.',
    heroCta1: 'See the catalog', heroCta2: 'Visit the workshop',
    catTitle: 'Teak furniture & doors',
    catBody: 'Everything made to your measurements. Standard designs or your own drawing.',
    catalogTitle: 'Catalog',
    catalogIntro: 'Work we have completed and deliver regularly. Every piece is made to your measurements in seasoned teak.',
    contactTitle: 'Come see the wood',
    contactBody: 'Walk in to check the timber, the joints and the finish before you order. Call ahead and we will keep samples ready.',
    lblPhone: 'Phone', lblWorkshop: 'Workshop', lblHours: 'Hours', lblProprietor: 'Proprietor',
    hoursVal: 'Monday–Saturday, 9am–8pm', btnCall: 'Call 98495 23572', mapTitle: 'Open in Google Maps',
    skip: 'Skip to main content',
    waEnquireMsg: "Hi, I'm interested in {name}. Please share details."
  },
  te: {
    phone: 'కాల్ చేయండి', hours: 'సోమ–శని, ఉ.9 – రా.8', logoSub: 'వుడెన్ & బిల్డింగ్ వర్క్స్',
    navWork: 'మా పని', navCatalog: 'కేటలాగ్', navTeak: 'టేకు ఎందుకు', navGallery: 'గ్యాలరీ',
    navReviews: 'రివ్యూలు', navCall: 'కాల్ చేయండి', navHome: 'హోమ్', navVisit: 'మమ్మల్ని కలవండి',
    all: 'అన్నీ', enquire: 'దీని గురించి అడగండి →', viewCatalog: 'పూర్తి కేటలాగ్ →',
    heroKicker: 'కరీంనగర్ · టేకు వర్క్ & బిల్డింగ్ వర్క్స్',
    heroTitle: 'కరీంనగర్‌లో టేకు వర్క్ — చేతితో తయారు చేసిన ఫర్నిచర్, తలుపులు — సమయానికి డెలివరీ.',
    heroBody: 'ఓం శ్రీ విరాట్ వుడెన్ ఫర్నిచర్, బిల్డింగ్ వర్క్స్ & అల్యూమినియం వర్క్స్ కరీంనగర్‌లో టేకు వర్క్ చేస్తుంది — సీజన్డ్ టేకుతో మంచాలు, మెయిన్ డోర్లు, పూజ తలుపులు, కిటికీలు తయారు చేస్తుంది. కొలత నుంచి ఫిట్టింగ్ వరకు మా సొంత వడ్రంగులే చూసుకుంటారు.',
    heroCta1: 'కేటలాగ్ చూడండి', heroCta2: 'వర్క్‌షాప్‌కు రండి',
    catTitle: 'టేకు ఫర్నిచర్ & తలుపులు',
    catBody: 'అన్నీ మీ కొలతల ప్రకారం. మా డిజైన్లు లేదా మీ డ్రాయింగ్.',
    catalogTitle: 'కేటలాగ్',
    catalogIntro: 'మేము పూర్తి చేసిన పనులు. ప్రతి వస్తువు మీ కొలతల ప్రకారం సీజన్డ్ టేకుతో తయారు చేస్తాం.',
    contactTitle: 'కలపను స్వయంగా చూడండి',
    contactBody: 'ఆర్డర్ ఇచ్చే ముందు కలప, జాయింట్లు, ఫినిషింగ్ చూసి నిర్ణయించుకోండి.',
    lblPhone: 'ఫోన్', lblWorkshop: 'వర్క్‌షాప్', lblHours: 'సమయాలు', lblProprietor: 'యజమాని',
    hoursVal: 'సోమవారం–శనివారం, ఉ.9 – రా.8', btnCall: '98495 23572 కు కాల్', mapTitle: 'గూగుల్ మ్యాప్స్‌లో చూడండి',
    skip: 'ప్రధాన కంటెంట్‌కు వెళ్లండి',
    waEnquireMsg: '{name} గురించి తెలుసుకోవాలనుకుంటున్నాను. దయచేసి వివరాలు పంపండి.'
  }
};
