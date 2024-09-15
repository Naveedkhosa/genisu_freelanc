import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes/route';
import global_en from './translations/en/global.json';
import global_ar from './translations/ar/global.json';
import global_de from './translations/de/global.json';
import global_fr from './translations/fr/global.json';
import global_bg from './translations/bg/global.json';
import global_cs from './translations/cs/global.json';
import global_da from './translations/da/global.json';
import global_el from './translations/el/global.json';
import global_es from './translations/es/global.json';
import global_et from './translations/et/global.json';
import global_ga from './translations/ga/global.json';
import global_hr from './translations/hr/global.json';
import global_hu from './translations/hu/global.json';
import global_it from './translations/it/global.json';
import global_lt from './translations/lt/global.json';
import global_lv from './translations/lv/global.json';
import global_mt from './translations/mt/global.json';
import global_nl from './translations/nl/global.json';
import global_pl from './translations/pl/global.json';
import global_pt from './translations/pt/global.json';
import global_ro from './translations/ro/global.json';
import global_ru from './translations/ru/global.json';
import global_sk from './translations/sk/global.json';
import global_sl from './translations/sl/global.json';
import global_sv from './translations/sv/global.json';
import global_tr from './translations/tr/global.json';
import global_ur from './translations/ur/global.json';

import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';


i18next.init({
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    en: { global: global_en },
    ar: { global: global_ar },
    de: { global: global_de },
    fr: { global: global_fr },
    bg: { global: global_bg },
    cs: { global: global_cs },
    da: { global: global_da },
    el: { global: global_el },
    es: { global: global_es },
    et: { global: global_et },
    ga: { global: global_ga },
    hr: { global: global_hr },
    hu: { global: global_hu },
    it: { global: global_it },
    lt: { global: global_lt },
    lv: { global: global_lv },
    mt: { global: global_mt },
    nl: { global: global_nl },
    pl: { global: global_pl },
    pt: { global: global_pt },
    ro: { global: global_ro },
    ru: { global: global_ru },
    sk: { global: global_sk },
    sl: { global: global_sl },
    sv: { global: global_sv },
    tr: { global: global_tr },
    ur: { global: global_ur }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <I18nextProvider i18n={i18next}>
    <RouterProvider router={router} />
  </I18nextProvider>
);