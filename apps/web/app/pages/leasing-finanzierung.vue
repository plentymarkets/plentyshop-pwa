<script setup>
/* ============================================================
   KONFIGURATION — HIER ANPASSEN
============================================================ */
const KK_CONFIG = {
  mailto: 'info@komplett-konzept.de',
  firma: 'Komplett Konzept Verwertungs GmbH',
  // Effektive Jahreszinsen (branchenüblich für Industriefinanzierung 2026)
  zinsen: { leasing: 5.5, finanzierung: 6.5, mietkauf: 6.0 }
};

const MODULE = {
  leasing: {
    title: 'Leasing-Rechner',
    sub: 'Ratenmiete — steuerlich voll absetzbar.',
    label: 'Monatliche Leasingrate',
    sumLabel: 'Ihre Kalkulation · Leasing',
    zins: KK_CONFIG.zinsen.leasing,
    showAnzahlung: false,
    showRestwert: false,
    fixRestwert: 10,
    vorteile: [
      'Raten 100 % als Betriebsausgabe absetzbar',
      'Bilanzneutral — keine Auswirkung auf Eigenkapitalquote',
      'Volle Planungssicherheit durch feste Raten',
      'Flexibles Vertragsende: kaufen, verlängern, zurückgeben'
    ]
  },
  finanzierung: {
    title: 'Finanzierungs-Rechner',
    sub: 'Investitionskredit für sofortigen Eigentumserwerb.',
    label: 'Monatliche Kreditrate',
    sumLabel: 'Ihre Kalkulation · Finanzierung',
    zins: KK_CONFIG.zinsen.finanzierung,
    showAnzahlung: true,
    showRestwert: false,
    vorteile: [
      'Sofortiges Eigentum mit voller Verfügungsgewalt',
      'Sofortiger Vorsteuerabzug auf Kaufpreis',
      'AfA über Nutzungsdauer steuermindernd',
      'Keine Restwertverpflichtungen'
    ]
  },
  mietkauf: {
    title: 'Mietkauf-Rechner',
    sub: 'Wirtschaftliches Eigentum ab Tag 1 — Eigentum nach letzter Rate.',
    label: 'Monatliche Mietkaufrate',
    sumLabel: 'Ihre Kalkulation · Mietkauf',
    zins: KK_CONFIG.zinsen.mietkauf,
    showAnzahlung: true,
    showRestwert: false,
    vorteile: [
      'Sofortiger Vorsteuerabzug auf Gesamtkaufpreis',
      'AfA ab Vertragsbeginn möglich',
      'Eigentum automatisch mit letzter Rate',
      'Keine Bonitätsanforderungen wie bei Bankkredit'
    ]
  }
};

const LAUFZEITEN = [24, 36, 48, 60, 72, 84];

const TAB_LABELS = {
  leasing: { name: 'Leasing' },
  finanzierung: { name: 'Finanzierung' },
  mietkauf: { name: 'Mietkauf' }
};

/* ============================================================
   STATE
============================================================ */
const state = reactive({
  modul: 'leasing',
  wert: 25000,
  laufzeit: 48,
  anzahlung: 0,
  restwert: 10
});

const form = reactive({
  // Firmendaten
  firma: '',
  zusatz: '',
  strasse: '',
  plz: '',
  ort: '',
  telefon: '',
  email: '',
  website: '',
  ustId: '',
  stNr: '',
  // Ansprechpartner
  anrede: '',
  vorname: '',
  nachname: '',
  apEmail: '',
  mobil: '',
  // Zur Finanzierung
  artikelId: '',
  objekt: '',
  anmerkungen: ''
});

/* ============================================================
   COMPUTED — Modul + Berechnung
============================================================ */
const m = computed(() => MODULE[state.modul]);

const calc = computed(() => {
  const mod = m.value;
  const i = mod.zins / 100 / 12;
  const n = state.laufzeit;
  const anzahlungAbs = mod.showAnzahlung ? state.wert * state.anzahlung / 100 : 0;
  const restwertPct = mod.showRestwert ? state.restwert : (mod.fixRestwert || 0);
  const restwertAbs = state.wert * restwertPct / 100;
  const finanzVol = state.wert - anzahlungAbs;
  const rate = (finanzVol - restwertAbs / Math.pow(1 + i, n)) * i / (1 - Math.pow(1 + i, -n));
  const gesamt = rate * n + anzahlungAbs + restwertAbs;
  return { rate, gesamt, anzahlungAbs, restwertAbs };
});

/* ============================================================
   FORMATIERUNG
============================================================ */
function fmt(n) {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtInt(n) {
  return Math.round(n).toLocaleString('de-DE');
}
function fill(val, min, max) {
  return ((val - min) / (max - min)) * 100;
}

function onWertInput(e) {
  const digits = e.target.value.replace(/[^\d]/g, '');
  let n = parseInt(digits || '0', 10);
  if (n > 500000) n = 500000;
  state.wert = n;
}
function onWertBlur() {
  if (state.wert < 2500) state.wert = 2500;
}

function onLaufzeitInput(e) {
  const digits = e.target.value.replace(/[^\d]/g, '');
  let n = parseInt(digits || '0', 10);
  if (n > 120) n = 120;
  state.laufzeit = n;
}
function onLaufzeitBlur() {
  if (state.laufzeit < 6) state.laufzeit = 6;
}

const rateParts = computed(() => {
  const [whole, cent] = fmt(calc.value.rate).split(',');
  return { whole, cent };
});

const sumDetails = computed(() => {
  let d = `${fmtInt(state.wert)} € · ${state.laufzeit} Monate`;
  if (m.value.showAnzahlung) d += ` · ${state.anzahlung} % Anzahlung`;
  if (m.value.showRestwert) d += ` · ${state.restwert} % Restwert`;
  return d;
});

/* ============================================================
   FORM → MAILTO
============================================================ */
function submitForm(e) {
  e.preventDefault();
  const mod = m.value;
  const r = calc.value;
  const modulLabel = state.modul.charAt(0).toUpperCase() + state.modul.slice(1);

  const lines = [
    'Anfrage über den Online-Rechner',
    '—'.repeat(40),
    '',
    'FIRMENDATEN',
    'Firma:           ' + form.firma,
    'Adresszusatz:    ' + (form.zusatz || '—'),
    'Straße:          ' + form.strasse,
    'PLZ / Ort:       ' + form.plz + ' ' + form.ort,
    'Telefon:         ' + form.telefon,
    'E-Mail:          ' + form.email,
    'Website:         ' + form.website,
    'USt-IdNr.:       ' + (form.ustId || '—'),
    'Steuernummer:    ' + (form.stNr || '—'),
    '',
    'ANSPRECHPARTNER',
    'Anrede:          ' + form.anrede,
    'Name:            ' + form.vorname + ' ' + form.nachname,
    'E-Mail:          ' + form.apEmail,
    'Mobil:           ' + form.mobil,
    '',
    'ZUR FINANZIERUNG',
    'Artikel-ID:      ' + form.artikelId,
    'Objekt:          ' + (form.objekt || '—'),
    'Anmerkungen:     ' + (form.anmerkungen || '—'),
    '',
    '—'.repeat(40),
    'KALKULATION',
    '—'.repeat(40),
    'Modell:          ' + modulLabel,
    'Objektwert:      ' + fmt(state.wert) + ' €',
    'Laufzeit:        ' + state.laufzeit + ' Monate',
    mod.showAnzahlung ? 'Anzahlung:       ' + state.anzahlung + ' % (' + fmt(r.anzahlungAbs) + ' €)' : null,
    '',
    'Monatliche Rate: ' + fmt(r.rate) + ' €',
    'Gesamtaufwand:   ' + fmt(r.gesamt) + ' €',
    '',
    '(Unverbindliche Beispielkalkulation)'
  ].filter(Boolean).join('\r\n');

  const subject = `Anfrage ${modulLabel} – ${fmt(r.rate)} €/Monat`;
  window.location.href = `mailto:${KK_CONFIG.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
}

/* ============================================================
   SEO / HEAD
============================================================ */
useHead({
  title: 'Leasing · Finanzierung · Mietkauf | Komplett Konzept',
  meta: [
    { name: 'description', content: 'Maschinen und Industriekomponenten flexibel finanzieren. Leasing, Finanzierung oder Mietkauf — konfigurieren Sie Ihre Wunschrate in unter einer Minute.' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap' }
  ]
});
</script>

<template>
  <div class="lf-page">

    <!-- ==================== HERO ==================== -->
    <section class="hero">
      <div class="container">
        <div class="eyebrow">Finanzierungslösungen</div>
        <h1>Investieren ohne <em>Liquidität zu binden.</em></h1>
        <p class="lead">Über unseren europaweiten Finanzierungspartner realisieren wir auch, was am Standardrechner scheitert. <strong>Leasing, Finanzierung oder Mietkauf — länderübergreifend, aus einer Hand.</strong></p>
        <ul class="hero-list">
          <li><strong>Europaweit</strong> leasen, finanzieren oder mieten — länderübergreifend abgewickelt</li>
          <li>Individuelle Leasinglösungen jenseits jeder Standardkalkulation</li>
          <li>Finanzierung gebrauchter Maschinen, Geräte &amp; technischer Anlagen</li>
          <li>Flexible Laufzeiten, individuelle An- und Schlusszahlungen</li>
          <li>Saisonale &amp; atmende Ratenmodelle — angepasst an Ihren Cashflow</li>
          <li>Lösungen auch bei anspruchsvollen Bonitäts- und Unternehmenskonstellationen</li>
          <li>Großvolumige Investitionen und projektbezogene Finanzierungen</li>
          <li>Branchenspezifische Sonderlösungen — auch für Anfragen, die kein Rechner kennt</li>
        </ul>
      </div>
    </section>

    <!-- ==================== CALCULATOR ==================== -->
    <div class="calc-wrap">
      <div class="calc-card">
        <div class="tabs" role="tablist">
          <button
            v-for="(label, key) in TAB_LABELS"
            :key="key"
            type="button"
            class="tab"
            :class="{ active: state.modul === key }"
            @click="state.modul = key"
            role="tab"
          >
            <span>{{ label.name }}</span>
          </button>
        </div>

        <div class="calc-body">
          <!-- Inputs -->
          <div class="inputs">
            <div class="modul-title">{{ m.title }}</div>
            <div class="modul-sub">{{ m.sub }}</div>

            <div class="field">
              <div class="field-row">
                <span class="field-label">Objektwert (brutto)</span>
                <span class="field-value wert-box">
                  <span class="wert-pen">✎</span>
                  <input
                    type="text"
                    inputmode="numeric"
                    class="wert-input"
                    :value="fmtInt(state.wert)"
                    @input="onWertInput"
                    @blur="onWertBlur"
                  ><span class="unit">€</span>
                </span>
              </div>
              <input
                type="range"
                v-model.number="state.wert"
                min="2500" max="500000" step="500"
                :style="{ '--p': fill(state.wert, 2500, 500000) + '%' }"
              >
              <div class="range-info"><span>2.500 €</span><span>500.000 €</span></div>
            </div>

            <div class="field" v-if="m.showAnzahlung">
              <div class="field-row">
                <span class="field-label">Anzahlung</span>
                <span class="field-value">{{ state.anzahlung }}<span class="unit">%</span></span>
              </div>
              <input
                type="range"
                v-model.number="state.anzahlung"
                min="0" max="30" step="1"
                :style="{ '--p': fill(state.anzahlung, 0, 30) + '%' }"
              >
              <div class="range-info"><span>0 %</span><span>30 %</span></div>
            </div>

            <div class="field" v-if="m.showRestwert">
              <div class="field-row">
                <span class="field-label">Restwert</span>
                <span class="field-value">{{ state.restwert }}<span class="unit">%</span></span>
              </div>
              <input
                type="range"
                v-model.number="state.restwert"
                min="1" max="30" step="1"
                :style="{ '--p': fill(state.restwert, 1, 30) + '%' }"
              >
              <div class="range-info"><span>1 %</span><span>30 %</span></div>
            </div>

            <div class="field">
              <div class="field-row">
                <span class="field-label">Laufzeit</span>
                <span class="field-value">{{ state.laufzeit }}<span class="unit">Monate</span></span>
              </div>
              <div class="laufzeit-pills">
                <button
                  v-for="lz in LAUFZEITEN"
                  :key="lz"
                  type="button"
                  class="pill"
                  :class="{ active: state.laufzeit === lz }"
                  @click="state.laufzeit = lz"
                >{{ lz }}</button>
                <span class="laufzeit-custom">
                  <input
                    type="text"
                    inputmode="numeric"
                    class="lz-input"
                    :value="state.laufzeit"
                    @input="onLaufzeitInput"
                    @blur="onLaufzeitBlur"
                  ><span class="lz-unit">Mon.</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Result -->
          <div class="result">
            <div class="result-eyebrow">{{ m.label }}</div>
            <div class="result-rate">
              {{ rateParts.whole }}<span class="cents">,{{ rateParts.cent }} €</span>
              <span class="per">pro Monat</span>
            </div>

            <div class="result-list">
              <div class="row"><span class="k">Objektwert</span><span class="v">{{ fmt(state.wert) }} €</span></div>
              <div class="row" v-if="m.showAnzahlung"><span class="k">Anzahlung</span><span class="v">{{ fmt(calc.anzahlungAbs) }} €</span></div>
              <div class="row" v-if="m.showRestwert"><span class="k">Restwert</span><span class="v">{{ fmt(calc.restwertAbs) }} €</span></div>
              <div class="row"><span class="k">Laufzeit</span><span class="v">{{ state.laufzeit }} Monate</span></div>
              <div class="row total"><span class="k">Gesamtaufwand</span><span class="v">{{ fmt(calc.gesamt) }} €</span></div>
            </div>

            <div class="vorteile">
              <div class="vorteile-title">Ihre Vorteile</div>
              <ul>
                <li v-for="v in m.vorteile" :key="v">{{ v }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== ANFRAGE ==================== -->
    <section class="anfrage" id="anfrage">
      <div class="anfrage-inner">
        <div class="section-eyebrow">Unverbindlich anfragen</div>
        <h2>Konkretes Angebot in 48 Stunden.</h2>
        <p class="sub">Senden Sie uns die Eckdaten — wir prüfen Konditionen mit unseren Finanzierungspartnern und melden uns mit einem maßgeschneiderten Angebot.</p>

        <div class="summary">
          <div>
            <div class="summary-meta">{{ m.sumLabel }}</div>
            <div class="summary-details">{{ sumDetails }}</div>
          </div>
          <div class="summary-rate">{{ fmt(calc.rate) }} €<small>/ Monat</small></div>
        </div>

        <form @submit="submitForm" autocomplete="on">

          <div class="form-section-label">Firmendaten</div>
          <div class="form-grid">
            <div class="input-group full">
              <label>Firma <span class="req">*</span></label>
              <input type="text" v-model="form.firma" required>
            </div>
            <div class="input-group full">
              <label>Adresszusatz</label>
              <input type="text" v-model="form.zusatz">
            </div>
            <div class="input-group full">
              <label>Straße &amp; Hausnummer <span class="req">*</span></label>
              <input type="text" v-model="form.strasse" required>
            </div>
            <div class="input-group">
              <label>PLZ <span class="req">*</span></label>
              <input type="text" v-model="form.plz" required>
            </div>
            <div class="input-group">
              <label>Ort <span class="req">*</span></label>
              <input type="text" v-model="form.ort" required>
            </div>
            <div class="input-group">
              <label>Telefon <span class="req">*</span></label>
              <input type="tel" v-model="form.telefon" required>
            </div>
            <div class="input-group">
              <label>E-Mail (Firma) <span class="req">*</span></label>
              <input type="email" v-model="form.email" required>
            </div>
            <div class="input-group">
              <label>Website <span class="req">*</span></label>
              <input type="text" v-model="form.website" required>
            </div>
            <div class="input-group">
              <label>USt-IdNr.</label>
              <input type="text" v-model="form.ustId">
            </div>
            <div class="input-group">
              <label>Steuernummer</label>
              <input type="text" v-model="form.stNr">
            </div>
          </div>

          <div class="form-section-label">Ansprechpartner</div>
          <div class="form-grid">
            <div class="input-group">
              <label>Anrede <span class="req">*</span></label>
              <select v-model="form.anrede" required>
                <option value="">Bitte wählen</option>
                <option value="Herr">Herr</option>
                <option value="Frau">Frau</option>
                <option value="Divers">Divers</option>
              </select>
            </div>
            <div class="input-group">
              <label>Mobil <span class="req">*</span></label>
              <input type="tel" v-model="form.mobil" required>
            </div>
            <div class="input-group">
              <label>Vorname <span class="req">*</span></label>
              <input type="text" v-model="form.vorname" required>
            </div>
            <div class="input-group">
              <label>Nachname <span class="req">*</span></label>
              <input type="text" v-model="form.nachname" required>
            </div>
            <div class="input-group full">
              <label>E-Mail (Ansprechpartner) <span class="req">*</span></label>
              <input type="email" v-model="form.apEmail" required>
            </div>
          </div>

          <div class="form-section-label">Zur Finanzierung</div>
          <div class="form-grid">
            <div class="input-group">
              <label>Artikel-ID <span class="req">*</span></label>
              <input type="text" v-model="form.artikelId" required placeholder="z. B. 14616">
            </div>
            <div class="input-group">
              <label>Was möchten Sie finanzieren?</label>
              <input type="text" v-model="form.objekt" placeholder="z. B. Palettenregalanlage, CNC-Fräse …">
            </div>
            <div class="input-group full">
              <label>Anmerkungen</label>
              <textarea v-model="form.anmerkungen"></textarea>
            </div>
          </div>

          <div class="submit-row">
            <button type="submit" class="btn">
              Anfrage senden
              <span class="arrow">→</span>
            </button>
            <p class="privacy">Mit dem Senden öffnet sich Ihr E-Mail-Programm mit einer vorausgefüllten Anfrage. Wir antworten innerhalb von 48 Std.</p>
          </div>
        </form>
      </div>
    </section>

    <!-- ==================== DISCLAIMER ==================== -->
    <div class="disclaimer-note">
      <p>Alle Berechnungen sind unverbindliche Beispielkalkulationen. Die tatsächlichen Konditionen richten sich nach Bonität und Objekt. Keine Finanzierungszusage.</p>
    </div>

  </div>
</template>

<style scoped>
.lf-page {
  --navy: #152440;
  --navy-2: #0e1a30;
  --gold: #F5C00A;
  --gold-dark: #d9a900;
  --ink: #0a1428;
  --paper: #f7f6f1;
  --line: rgba(21, 36, 64, 0.12);
  --muted: #5a6478;

  font-family: 'Inter', sans-serif;
  color: var(--ink);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  background: var(--paper);
}

.lf-page h1, .lf-page h2, .lf-page h3, .lf-page h4 {
  font-family: 'Inter Tight', sans-serif;
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin: 0;
}
.lf-page p { margin: 0; }

/* ==================== HERO ==================== */
.hero {
  background:
    radial-gradient(ellipse at 80% 0%, rgba(245, 192, 10, 0.08) 0%, transparent 50%),
    linear-gradient(180deg, var(--navy) 0%, var(--navy-2) 100%);
  color: #fff;
  padding: 5rem 1.5rem 7rem;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 64px 64px;
  pointer-events: none;
}
.container { max-width: 1180px; margin: 0 auto; position: relative; }
.eyebrow {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--gold); font-weight: 600; margin-bottom: 1.5rem;
}
.eyebrow::before { content: ""; width: 24px; height: 1px; background: var(--gold); }
.hero h1 {
  font-size: clamp(2.5rem, 5.5vw, 4.75rem);
  font-weight: 700; max-width: 900px; margin-bottom: 1.5rem;
}
.hero h1 em { font-style: normal; color: var(--gold); }
.hero .lead {
  font-size: clamp(1.05rem, 1.4vw, 1.25rem);
  max-width: 680px; color: rgba(255, 255, 255, 0.78); font-weight: 400;
}
.hero .lead strong { color: #fff; font-weight: 600; }
.hero-list {
  list-style: none; padding: 0;
  margin: 2.75rem 0 0;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 0 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 1.5rem;
}
@media (max-width: 760px) { .hero-list { grid-template-columns: 1fr; gap: 0; } }
.hero-list li {
  font-size: 0.95rem; color: rgba(255, 255, 255, 0.85);
  padding: 0.8rem 0 0.8rem 1.6rem; position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}
.hero-list li::before {
  content: ""; position: absolute; left: 0; top: 1.3em;
  width: 10px; height: 2px; background: var(--gold);
}
.hero-list li strong { color: var(--gold); font-weight: 700; }

/* ==================== CALCULATOR ==================== */
.calc-wrap {
  max-width: 1180px; margin: -4.5rem auto 0; padding: 0 1.5rem;
  position: relative; z-index: 2;
}
.calc-card {
  background: #fff; border-radius: 8px;
  box-shadow: 0 30px 80px -20px rgba(21, 36, 64, 0.25), 0 10px 25px -10px rgba(21, 36, 64, 0.1);
  overflow: hidden;
}

.tabs {
  display: grid; grid-template-columns: repeat(3, 1fr);
  background: var(--navy);
}
.tab {
  background: transparent; border: 0; cursor: pointer;
  padding: 1.35rem 1rem; color: rgba(255, 255, 255, 0.55);
  font-family: 'Inter Tight', sans-serif; font-size: 1.05rem; font-weight: 600;
  border-bottom: 3px solid transparent;
  transition: all 0.25s ease;
  display: flex; align-items: center; justify-content: center;
}
.tab:hover { color: rgba(255, 255, 255, 0.85); }
.tab.active {
  color: #fff; border-bottom-color: var(--gold);
  background: linear-gradient(180deg, rgba(245, 192, 10, 0.05) 0%, transparent 100%);
}

.calc-body { display: grid; grid-template-columns: 1.15fr 1fr; gap: 0; }
@media (max-width: 900px) { .calc-body { grid-template-columns: 1fr; } }

.inputs { padding: 2.5rem 2.5rem 3rem; }
@media (max-width: 600px) { .inputs { padding: 1.75rem 1.25rem 2rem; } }

.modul-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.35rem; font-family: 'Inter Tight', sans-serif; }
.modul-sub { color: var(--muted); font-size: 0.92rem; margin-bottom: 2rem; }

.field { margin-bottom: 1.75rem; }
.field-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.6rem; }
.field-label { font-size: 0.85rem; font-weight: 600; color: var(--ink); }
.field-value {
  font-family: 'Inter Tight', sans-serif; font-size: 1.15rem; font-weight: 700; color: var(--navy);
  font-variant-numeric: tabular-nums;
}
.field-value .unit { font-size: 0.75rem; font-weight: 500; color: var(--muted); margin-left: 0.25rem; }
.wert-box {
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.4rem 0.9rem;
  border: 2px solid var(--gold);
  background: rgba(245, 192, 10, 0.08);
  border-radius: 8px;
  transition: all 0.15s ease;
}
.wert-box:focus-within {
  background: rgba(245, 192, 10, 0.16);
  box-shadow: 0 0 0 3px rgba(245, 192, 10, 0.2);
}
.wert-pen { color: var(--gold-dark); font-size: 0.85rem; }
.wert-input {
  font-family: 'Inter Tight', sans-serif;
  font-size: 1.15rem; font-weight: 700; color: var(--navy);
  font-variant-numeric: tabular-nums;
  text-align: right;
  width: 6.5ch;
  border: none;
  background: transparent;
  padding: 0;
  outline: none;
}

/* Range slider */
.lf-page input[type=range] {
  -webkit-appearance: none; appearance: none; width: 100%; height: 6px;
  background: linear-gradient(to right, var(--navy) 0%, var(--navy) var(--p, 50%), #e5e7eb var(--p, 50%), #e5e7eb 100%);
  border-radius: 3px; outline: none;
}
.lf-page input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 22px; height: 22px; border-radius: 50%;
  background: #fff; border: 3px solid var(--gold);
  cursor: grab; box-shadow: 0 2px 8px rgba(21, 36, 64, 0.2);
  transition: transform 0.15s ease;
}
.lf-page input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.1); }
.lf-page input[type=range]::-moz-range-thumb {
  width: 22px; height: 22px; border-radius: 50%;
  background: #fff; border: 3px solid var(--gold);
  cursor: grab; box-shadow: 0 2px 8px rgba(21, 36, 64, 0.2);
}

.range-info { display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--muted); margin-top: 0.45rem; }

.laufzeit-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.6rem; }
.pill {
  padding: 0.55rem 1rem; border: 1px solid var(--line); background: #fff;
  border-radius: 999px; cursor: pointer;
  font-family: 'Inter Tight', sans-serif; font-size: 0.85rem; font-weight: 600; color: var(--ink);
  transition: all 0.15s ease;
}
.pill:hover { border-color: var(--navy); background: #fafaf6; }
.pill.active { background: var(--navy); color: #fff; border-color: var(--navy); }
.laufzeit-custom {
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.5rem 1rem;
  border: 2px solid var(--gold);
  background: rgba(245, 192, 10, 0.08);
  border-radius: 999px; transition: all 0.15s ease;
}
.laufzeit-custom::before {
  content: "✎"; color: var(--gold-dark);
  font-size: 0.8rem; margin-right: 0.1rem;
}
.laufzeit-custom:focus-within {
  background: rgba(245, 192, 10, 0.16);
  box-shadow: 0 0 0 3px rgba(245, 192, 10, 0.2);
}
.lz-input {
  width: 3ch; border: none; background: transparent; outline: none;
  font-family: 'Inter Tight', sans-serif; font-size: 0.9rem; font-weight: 700;
  color: var(--navy); text-align: center; font-variant-numeric: tabular-nums;
}
.lz-input::placeholder { color: var(--gold-dark); }
.lz-unit { font-size: 0.72rem; color: var(--gold-dark); font-weight: 600; }

/* ==================== RESULT ==================== */
.result {
  background: var(--navy); color: #fff; padding: 2.5rem;
  position: relative; overflow: hidden;
  display: flex; flex-direction: column;
}
.result::before {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(circle at 100% 0%, rgba(245, 192, 10, 0.12) 0%, transparent 50%);
  pointer-events: none;
}
.result-eyebrow {
  font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--gold); font-weight: 600; margin-bottom: 0.75rem;
  position: relative;
}
.result-rate {
  font-family: 'Inter Tight', sans-serif; font-weight: 700;
  font-size: clamp(3rem, 6vw, 4.5rem); line-height: 1; letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  position: relative;
}
.result-rate .cents { font-size: 0.55em; color: rgba(255, 255, 255, 0.6); font-weight: 500; }
.result-rate .per { font-size: 0.35em; color: rgba(255, 255, 255, 0.6); font-weight: 500; display: block; margin-top: 0.5rem; }

.result-list {
  margin-top: 2.5rem; padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  display: flex; flex-direction: column; gap: 0.9rem;
  position: relative;
}
.result-list .row { display: flex; justify-content: space-between; align-items: baseline; font-size: 0.92rem; }
.result-list .row .k { color: rgba(255, 255, 255, 0.65); }
.result-list .row .v { font-family: 'Inter Tight', sans-serif; font-weight: 600; color: #fff; font-variant-numeric: tabular-nums; }
.result-list .row.total { padding-top: 0.9rem; border-top: 1px solid rgba(255, 255, 255, 0.1); margin-top: 0.4rem; }
.result-list .row.total .k { color: #fff; font-weight: 600; }
.result-list .row.total .v { color: var(--gold); font-size: 1.1rem; }

.vorteile { margin-top: auto; padding-top: 2rem; position: relative; }
.vorteile-title { font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255, 255, 255, 0.55); margin-bottom: 0.85rem; font-weight: 600; }
.vorteile ul { list-style: none; padding: 0; margin: 0; }
.vorteile li {
  font-size: 0.88rem; color: rgba(255, 255, 255, 0.85);
  padding-left: 1.25rem; position: relative; margin-bottom: 0.45rem;
}
.vorteile li::before {
  content: ""; position: absolute; left: 0; top: 0.55em;
  width: 8px; height: 1px; background: var(--gold);
}

/* ==================== VERGLEICH ==================== */
.vergleich { padding: 6rem 1.5rem 4rem; max-width: 1180px; margin: 0 auto; }
.section-head { margin-bottom: 3rem; }
.section-eyebrow {
  font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--navy); font-weight: 700; margin-bottom: 1rem;
}
.section-eyebrow::before { content: "— "; color: var(--gold); }
.section-head h2 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; max-width: 720px; }
.vergleich-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
@media (max-width: 800px) { .vergleich-grid { grid-template-columns: 1fr; } }
.v-card {
  background: #fff; border: 1px solid var(--line); border-radius: 6px;
  padding: 2rem; transition: all 0.2s ease;
}
.v-card:hover { border-color: var(--navy); transform: translateY(-2px); box-shadow: 0 12px 30px -10px rgba(21, 36, 64, 0.15); }
.v-card h3 { font-size: 1.4rem; margin-bottom: 0.4rem; font-weight: 700; }
.v-card .v-num { font-family: 'Inter Tight', sans-serif; font-size: 0.85rem; font-weight: 600; color: var(--gold); letter-spacing: 0.1em; margin-bottom: 1.25rem; }
.v-card p { color: var(--muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
.v-card dl { font-size: 0.85rem; margin: 0; }
.v-card dt { color: var(--navy); font-weight: 600; margin-bottom: 0.15rem; margin-top: 0.85rem; }
.v-card dt:first-child { margin-top: 0; }
.v-card dd { color: var(--muted); margin: 0; }

/* ==================== FORM ==================== */
.anfrage {
  background: linear-gradient(160deg, var(--navy) 0%, var(--navy-2) 100%);
  padding: 5rem 1.5rem;
  position: relative;
  overflow: hidden;
}
.anfrage::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 90% 10%, rgba(245,192,10,0.10) 0%, transparent 55%);
  pointer-events: none;
}
.anfrage-inner {
  max-width: 880px; margin: 0 auto;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 8px;
  padding: 3rem 3rem 3.5rem;
  position: relative;
  backdrop-filter: blur(8px);
}
@media (max-width: 600px) { .anfrage-inner { padding: 2rem 1.5rem 2.5rem; } }
.anfrage .section-eyebrow {
  font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--gold); font-weight: 700; margin-bottom: 1rem;
}
.anfrage .section-eyebrow::before { content: "— "; }
.anfrage h2 {
  font-size: clamp(1.6rem, 2.8vw, 2.2rem); margin-bottom: 0.6rem; font-weight: 700;
  color: #fff;
}
.anfrage p.sub { color: rgba(255, 255, 255, 0.7); margin-bottom: 2.25rem; max-width: 560px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
.form-grid .full { grid-column: 1 / -1; }
.form-grid + .form-section-label { margin-top: 2rem; }

.form-section-label {
  font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: #fff; font-weight: 700;
  padding-bottom: 0.6rem; margin-bottom: 1.1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.form-section-label::before { content: "— "; color: var(--gold); }

.input-group { display: flex; flex-direction: column; gap: 0.4rem; }
.input-group label { font-size: 0.78rem; font-weight: 600; color: rgba(255, 255, 255, 0.85); }
.input-group label .req { color: var(--gold); }
.input-group input, .input-group textarea, .input-group select {
  font-family: 'Inter', sans-serif; font-size: 0.95rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  transition: all 0.15s ease;
}
.input-group input::placeholder, .input-group textarea::placeholder { color: rgba(255, 255, 255, 0.35); }
.input-group select { cursor: pointer; }
.input-group select option { background: var(--navy-2); color: #fff; }
.input-group input:focus, .input-group textarea:focus, .input-group select:focus {
  outline: none; border-color: var(--gold);
  background: rgba(255, 255, 255, 0.10);
  box-shadow: 0 0 0 3px rgba(245, 192, 10, 0.15);
}
.input-group textarea { resize: vertical; min-height: 90px; }

.submit-row { margin-top: 2rem; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.btn {
  display: inline-flex; align-items: center; gap: 0.65rem;
  background: var(--gold); color: var(--navy); border: 0; cursor: pointer;
  font-family: 'Inter Tight', sans-serif; font-size: 1rem; font-weight: 700;
  padding: 1rem 2rem; border-radius: 4px;
  transition: all 0.2s ease;
}
.btn:hover { background: #fff; transform: translateY(-1px); }
.btn .arrow { transition: transform 0.2s ease; }
.btn:hover .arrow { transform: translateX(3px); }

.privacy { font-size: 0.78rem; color: rgba(255, 255, 255, 0.55); max-width: 340px; }

.summary {
  background: rgba(0, 0, 0, 0.25);
  border: 1px dashed var(--gold);
  border-radius: 6px;
  padding: 1.25rem 1.5rem; margin-bottom: 2rem;
  display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; align-items: center;
}
.summary-meta { font-size: 0.72rem; color: var(--gold); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700; }
.summary-details { font-size: 0.9rem; margin-top: 0.25rem; color: rgba(255, 255, 255, 0.78); }
.summary-rate { font-family: 'Inter Tight', sans-serif; font-size: 1.6rem; font-weight: 700; color: #fff; font-variant-numeric: tabular-nums; }
.summary-rate small { font-size: 0.7rem; color: rgba(255, 255, 255, 0.55); font-weight: 500; margin-left: 0.25rem; }

/* ==================== DISCLAIMER ==================== */
.disclaimer-note {
  background: var(--paper);
  padding: 1.5rem 1.5rem 2.5rem;
}
.disclaimer-note p {
  max-width: 1180px; margin: 0 auto;
  font-size: 0.75rem; line-height: 1.6;
  color: var(--muted); text-align: center;
}

/* ==================== LEASINGPARTNER ==================== */
.partner {
  background: linear-gradient(160deg, var(--navy) 0%, var(--navy-2) 100%);
  color: #fff;
  padding: 5.5rem 1.5rem;
  position: relative;
  overflow: hidden;
}
.partner::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 90% 10%, rgba(245,192,10,0.10) 0%, transparent 55%);
  pointer-events: none;
}
.partner-inner {
  max-width: 1180px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1fr; gap: 4rem;
  align-items: center; position: relative;
}
@media (max-width: 880px) { .partner-inner { grid-template-columns: 1fr; gap: 2.5rem; } }
.partner-text .section-eyebrow {
  font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--gold); font-weight: 700; margin-bottom: 1.25rem;
}
.partner-text .section-eyebrow::before { content: "— "; }
.partner-text h2 {
  font-size: clamp(1.9rem, 3.4vw, 2.9rem); font-weight: 700;
  line-height: 1.08; margin-bottom: 1.25rem;
}
.partner-text h2 em { font-style: normal; color: var(--gold); }
.partner-text p { color: rgba(255,255,255,0.8); font-size: 1.02rem; margin-bottom: 2rem; }
.partner-text p strong { color: #fff; font-weight: 600; }
.partner-cta {
  display: inline-flex; align-items: center; gap: 0.6rem;
  background: var(--gold); color: var(--navy);
  font-family: 'Inter Tight', sans-serif; font-weight: 700; font-size: 1rem;
  padding: 0.95rem 1.9rem; border-radius: 4px;
  text-decoration: none; transition: all 0.2s ease;
}
.partner-cta:hover { background: #fff; transform: translateY(-1px); }
.partner-cta .arrow { transition: transform 0.2s ease; }
.partner-cta:hover .arrow { transform: translateX(3px); }
.partner-list { list-style: none; padding: 0; margin: 0; }
.partner-list li {
  font-size: 0.98rem; color: rgba(255,255,255,0.88);
  padding: 0.85rem 0 0.85rem 1.75rem; position: relative;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.partner-list li:last-child { border-bottom: 0; }
.partner-list li::before {
  content: ""; position: absolute; left: 0; top: 1.35em;
  width: 10px; height: 2px; background: var(--gold);
}
.partner-list li strong { color: var(--gold); font-weight: 700; }

/* ==================== MOBILE-OPTIMIERUNG ==================== */
@media (max-width: 640px) {
  .hero { padding: 3rem 1.25rem 6rem; }
  .hero-stats { gap: 1.5rem 2rem; margin-top: 2.5rem; padding-top: 2rem; }
  .stat .v { font-size: 1.6rem; }

  .calc-wrap { padding: 0 1rem; margin-top: -3.5rem; }

  /* Tabs untereinander statt 3-spaltig gequetscht */
  .tabs { grid-template-columns: 1fr; }
  .tab {
    justify-content: center;
    padding: 1rem 1.25rem; font-size: 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    border-left: 3px solid transparent;
  }
  .tab.active { border-bottom-color: rgba(255,255,255,0.08); border-left-color: var(--gold); }

  .inputs { padding: 1.5rem 1.25rem 2rem; }
  .result { padding: 1.75rem 1.25rem; }
  .result-rate { font-size: 2.75rem; }

  .anfrage { padding: 3rem 1rem; }
  .anfrage-inner { padding: 1.75rem 1.25rem 2rem; }
  .summary { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  .submit-row { flex-direction: column; align-items: stretch; gap: 1rem; }
  .btn { justify-content: center; }
  .privacy { max-width: 100%; }

  .partner { padding: 3.5rem 1.25rem; }
  .partner-cta { width: 100%; justify-content: center; }
}
</style>
