<template>
  <div class="widerruf-page">

    <!-- ===== HERO ===== -->
    <section class="hero">
      <div class="hero-inner">
        <div class="eyebrow">Verbraucherrecht · Widerrufsbelehrung</div>
        <h1>Vertrag widerrufen.</h1>
        <p class="lead">
          Sie haben Ihre Bestellung erhalten und möchten den Kaufvertrag widerrufen?
          Hier können Sie Ihren Widerruf einfach und rechtssicher online erklären.
        </p>

        <div class="info-grid">
          <div class="info-card">
            <div class="info-num">14</div>
            <div class="info-label">Tage Widerrufsfrist</div>
            <div class="info-sub">ab Erhalt der Ware</div>
          </div>
          <div class="info-card">
            <div class="info-num">0 €</div>
            <div class="info-label">Bearbeitungsgebühr</div>
            <div class="info-sub">kein Grund nötig</div>
          </div>
          <div class="info-card">
            <div class="info-num">24h</div>
            <div class="info-label">Bestätigung per Mail</div>
            <div class="info-sub">automatisch nach Absenden</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FORM ===== -->
    <section class="form-section">
      <div class="form-wrap">

        <!-- ===== SUCCESS ===== -->
        <div v-if="submitStatus === 'success'" class="submit-success">
          <div class="success-icon">✓</div>
          <h2>Ihr Widerruf wurde übermittelt.</h2>
          <p>
            Wir haben Ihren Widerruf empfangen und bestätigen den Eingang in den nächsten Minuten per E-Mail
            an die von Ihnen angegebene Adresse.
          </p>
          <p>
            Bitte senden Sie die Ware – sofern noch nicht geschehen – innerhalb von 14 Tagen
            an folgende Adresse:
          </p>
          <div class="return-address">
            <strong>Komplett Konzept Verwertungs GmbH</strong><br>
            Hauptlager<br>
            Karl-Leisner-Str. 6<br>
            46325 Borken<br>
            Deutschland
          </div>
          <button type="button" class="btn" @click="resetForm">
            Neuen Widerruf erklären <span>→</span>
          </button>
        </div>

        <!-- ===== FORM ===== -->
        <template v-else>
          <h2>Widerruf erklären</h2>
          <p class="form-intro">
            Bitte füllen Sie die folgenden Felder aus. Pflichtfelder sind mit <span class="req">*</span> gekennzeichnet.
            Sie erhalten eine automatische Bestätigung per E-Mail.
          </p>

          <form @submit="submitForm" autocomplete="on">

            <div class="form-section-label">Angaben zur Person</div>
            <div class="form-grid">
              <div class="input-group">
                <label>Anrede</label>
                <select v-model="form.anrede">
                  <option value="">Bitte wählen</option>
                  <option value="Herr">Herr</option>
                  <option value="Frau">Frau</option>
                  <option value="Divers">Divers</option>
                </select>
              </div>
              <div class="input-group">
                <label>E-Mail <span class="req">*</span></label>
                <input type="email" v-model="form.email" required>
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
                <label>Straße & Hausnummer <span class="req">*</span></label>
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
              <div class="input-group full">
                <label>Telefon</label>
                <input type="tel" v-model="form.telefon">
              </div>
            </div>

            <div class="form-section-label">Angaben zur Bestellung</div>
            <div class="form-grid">
              <div class="input-group">
                <label>Bestellnummer <span class="req">*</span></label>
                <input type="text" v-model="form.bestellnummer" required placeholder="z. B. 100123456">
              </div>
              <div class="input-group">
                <label>Bestelldatum <span class="req">*</span></label>
                <input type="date" v-model="form.bestelldatum" required>
              </div>
              <div class="input-group">
                <label>Lieferdatum (sofern bekannt)</label>
                <input type="date" v-model="form.lieferdatum">
              </div>
              <div class="input-group">
                <label>Zahlungsart</label>
                <select v-model="form.zahlungsart">
                  <option value="">Bitte wählen</option>
                  <option value="Vorkasse / Überweisung">Vorkasse / Überweisung</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Kreditkarte">Kreditkarte</option>
                  <option value="Klarna / Rechnung">Klarna / Rechnung</option>
                  <option value="Sonstige">Sonstige</option>
                </select>
              </div>
              <div class="input-group full">
                <label>Bestellte Ware (welche Artikel werden widerrufen) <span class="req">*</span></label>
                <textarea
                  v-model="form.artikel"
                  required
                  rows="3"
                  placeholder="z. B. Artikel-Nr. 14616 – Kühlturm BAC S1500E, 1 Stück"
                ></textarea>
              </div>
              <div class="input-group full">
                <label>Grund des Widerrufs (optional)</label>
                <textarea
                  v-model="form.grund"
                  rows="3"
                  placeholder="Eine Angabe des Grundes ist gesetzlich nicht erforderlich, hilft uns aber bei der Verbesserung unseres Angebots."
                ></textarea>
              </div>
            </div>

            <div class="form-section-label">Bestätigung</div>
            <div class="checkbox-row">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.confirm" required>
                <span>
                  Ich erkläre hiermit den Widerruf des oben bezeichneten Kaufvertrags
                  gemäß § 355 BGB. Mir ist bewusst, dass ich die Ware innerhalb von 14 Tagen
                  nach Erklärung des Widerrufs zurückzusenden habe. <span class="req">*</span>
                </span>
              </label>
            </div>

            <!-- Fehlermeldung -->
            <div v-if="submitStatus === 'error'" class="submit-error">
              Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder
              kontaktieren Sie uns direkt unter info@komplett-konzept.de bzw. +49 2862 58795 0.
            </div>

            <div class="form-actions">
              <button type="submit" class="btn" :disabled="submitStatus === 'loading' || !form.confirm">
                <span v-if="submitStatus === 'loading'">Wird gesendet …</span>
                <template v-else>
                  Widerruf jetzt absenden <span>→</span>
                </template>
              </button>
            </div>

            <p class="privacy-note">
              Ihre Angaben werden ausschließlich zur Bearbeitung Ihres Widerrufs verwendet.
              Weitere Informationen in unserer
              <NuxtLink to="/datenschutz" class="underline">Datenschutzerklärung</NuxtLink>.
            </p>
          </form>
        </template>
      </div>
    </section>

    <!-- ===== RECHTLICHE INFO ===== -->
    <section class="legal-section">
      <div class="legal-wrap">

        <h2>Widerrufsbelehrung</h2>
        <p class="legal-intro">
          <strong>Widerrufsrecht für Verbraucher</strong><br>
          (Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt,
          die überwiegend weder ihrer gewerblichen noch ihrer selbstständigen beruflichen Tätigkeit
          zugerechnet werden kann.)
        </p>

        <h3>Widerrufsrecht</h3>
        <p>
          Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
        </p>
        <p>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag,</p>
        <ul class="legal-list">
          <li>an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat, sofern Sie eine oder mehrere Waren im Rahmen einer einheitlichen Bestellung bestellt haben und diese einheitlich geliefert wird bzw. werden;</li>
          <li>an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die letzte Ware in Besitz genommen haben bzw. hat, sofern Sie mehrere Waren im Rahmen einer einheitlichen Bestellung bestellt haben und diese getrennt geliefert werden;</li>
          <li>an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die letzte Teilsendung oder das letzte Stück in Besitz genommen haben bzw. hat, sofern Sie eine Ware bestellt haben, die in mehreren Teilsendungen oder Stücken geliefert wird.</li>
        </ul>
        <p>
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Komplett-Konzept Verwertungs GmbH,
          Dunkerstr. 29, 46325 Borken, Telefonnummer: 02862587950, Telefaxnummer: 028625879529,
          E-Mail-Adresse: info@komplett-konzept.de) mittels einer eindeutigen Erklärung
          (z.B. ein mit der Post versandter Brief, Telefax oder E-Mail) über Ihren Entschluss,
          diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte
          Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
        </p>
        <p>
          Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung
          des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
        </p>

        <h3>Folgen des Widerrufs</h3>
        <p>
          Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen
          erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten,
          die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene,
          günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen
          ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns
          eingegangen ist.
        </p>
        <p>
          Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen
          Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart;
          in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
        </p>
        <p>
          Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis
          Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches
          der frühere Zeitpunkt ist.
        </p>
        <p>
          Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag,
          an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu
          übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.
        </p>
        <p>Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.</p>
        <p>
          Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust
          auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht
          notwendigen Umgang mit ihnen zurückzuführen ist.
        </p>

        <h3>Ausschluss- bzw. Erlöschensgründe</h3>
        <p>Das Widerrufsrecht besteht nicht bei Verträgen</p>
        <ul class="legal-list">
          <li>zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind;</li>
          <li>zur Lieferung von Waren, die schnell verderben können oder deren Verfallsdatum schnell überschritten würde;</li>
          <li>zur Lieferung alkoholischer Getränke, deren Preis bei Vertragsschluss vereinbart wurde, die aber frühestens 30 Tage nach Vertragsschluss geliefert werden können und deren aktueller Wert von Schwankungen auf dem Markt abhängt, auf die der Unternehmer keinen Einfluss hat;</li>
          <li>zur Lieferung von Zeitungen, Zeitschriften oder Illustrierten mit Ausnahme von Abonnement-Verträgen.</li>
        </ul>
        <p>Das Widerrufsrecht erlischt vorzeitig bei Verträgen</p>
        <ul class="legal-list">
          <li>zur Lieferung versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde;</li>
          <li>zur Lieferung von Waren, wenn diese nach der Lieferung aufgrund ihrer Beschaffenheit untrennbar mit anderen Gütern vermischt wurden;</li>
          <li>zur Lieferung von Ton- oder Videoaufnahmen oder Computersoftware in einer versiegelten Packung, wenn die Versiegelung nach der Lieferung entfernt wurde.</li>
        </ul>

        <h3>Rechtliche Hinweise für Unternehmer</h3>
        <p>Grundsätzlich bieten wir kein Widerrufsrecht für Unternehmen an.</p>

      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

definePageMeta({
  layout: 'default'
});

useHead({
  title: 'Vertrag widerrufen · Komplett Konzept',
  meta: [
    { name: 'description', content: 'Online-Widerruf Ihres Kaufvertrags bei Komplett Konzept. Rechtskonformer Widerrufsbutton gemäß EU-Richtlinie 2023/2673.' }
  ]
});

/* ============================================================
   KONFIGURATION
============================================================ */
const KK_CONFIG = {
  // Web3Forms: gleicher Access Key wie bei der Leasing-Seite verwenden
  web3formsAccessKey: '93879b65-7bdc-4a1e-a1c3-39a52f6dfebb',
  mailTo: 'info@komplett-konzept.de'
};

/* ============================================================
   FORM STATE
============================================================ */
const form = reactive({
  anrede: '',
  vorname: '',
  nachname: '',
  email: '',
  telefon: '',
  strasse: '',
  plz: '',
  ort: '',
  bestellnummer: '',
  bestelldatum: '',
  lieferdatum: '',
  zahlungsart: '',
  artikel: '',
  grund: '',
  confirm: false
});

const submitStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle');

/* ============================================================
   SUBMIT
============================================================ */
async function submitForm(e: Event) {
  e.preventDefault();
  submitStatus.value = 'loading';

  const payload = {
    access_key: KK_CONFIG.web3formsAccessKey,
    subject: `WIDERRUF · Bestellung ${form.bestellnummer} · ${form.vorname} ${form.nachname}`,
    from_name: `${form.vorname} ${form.nachname}`,
    replyto: form.email,

    // Angaben zur Person
    'Anrede': form.anrede || '-',
    'Vorname': form.vorname,
    'Nachname': form.nachname,
    'E-Mail': form.email,
    'Telefon': form.telefon || '-',
    'Straße & Hausnummer': form.strasse,
    'PLZ': form.plz,
    'Ort': form.ort,

    // Angaben zur Bestellung
    'Bestellnummer': form.bestellnummer,
    'Bestelldatum': form.bestelldatum,
    'Lieferdatum': form.lieferdatum || '-',
    'Zahlungsart': form.zahlungsart || '-',
    'Widerrufene Ware': form.artikel,
    'Grund (optional)': form.grund || '-',

    // Rechtliche Bestätigung
    'Widerrufserklärung bestätigt': form.confirm ? 'JA' : 'NEIN',
    'Eingangsdatum': new Date().toLocaleString('de-DE')
  };

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    submitStatus.value = 'success';
  } catch (err) {
    submitStatus.value = 'error';
  }
}

function resetForm() {
  Object.keys(form).forEach((k) => {
    // @ts-expect-error - dynamic reset
    form[k] = typeof form[k] === 'boolean' ? false : '';
  });
  submitStatus.value = 'idle';
}
</script>

<style scoped>
:root {
  --navy: #152440;
  --navy-2: #1d3055;
  --gold: #F5C00A;
  --gold-dark: #d9a800;
  --text: #1a1a1a;
}

.widerruf-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1a1a1a;
}

/* ===== HERO ===== */
.hero {
  background: linear-gradient(135deg, #152440 0%, #1d3055 100%);
  color: #fff;
  padding: 4rem 1.5rem 3rem;
}
.hero-inner {
  max-width: 960px;
  margin: 0 auto;
}
.eyebrow {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #F5C00A;
  font-weight: 700;
  margin-bottom: 1rem;
}
.hero h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 1rem;
  color: #fff;
}
.lead {
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  max-width: 640px;
  margin-bottom: 2.5rem;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  max-width: 720px;
}
.info-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(245, 192, 10, 0.25);
  border-radius: 8px;
  padding: 1.2rem 1.4rem;
}
.info-num {
  font-size: 1.8rem;
  font-weight: 800;
  color: #F5C00A;
  line-height: 1;
}
.info-label {
  font-size: 0.95rem;
  font-weight: 600;
  margin-top: 0.4rem;
  color: #fff;
}
.info-sub {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.2rem;
}

/* ===== FORM SECTION ===== */
.form-section {
  background: #f5f5f7;
  padding: 3rem 1.5rem;
}
.form-wrap {
  max-width: 720px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(21, 36, 64, 0.08);
}
.form-wrap h2 {
  font-size: 1.6rem;
  margin: 0 0 0.6rem;
  color: #152440;
}
.form-intro {
  font-size: 0.92rem;
  color: #555;
  margin-bottom: 1.8rem;
}
.req { color: #d11; }

.form-section-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  color: #F5C00A;
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #F5C00A;
}
.form-section-label:first-of-type {
  margin-top: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.2rem;
}
.input-group { display: flex; flex-direction: column; }
.input-group.full { grid-column: 1 / -1; }
.input-group label {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
  color: #333;
}
.input-group input,
.input-group select,
.input-group textarea {
  padding: 0.7rem 0.85rem;
  border: 1px solid #d4d4d8;
  border-radius: 4px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #fff;
  color: #1a1a1a;
  transition: border-color 0.15s;
}
.input-group input:focus,
.input-group select:focus,
.input-group textarea:focus {
  outline: none;
  border-color: #F5C00A;
  box-shadow: 0 0 0 3px rgba(245, 192, 10, 0.2);
}
.input-group textarea { resize: vertical; min-height: 80px; }

@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
  .form-wrap { padding: 1.5rem; }
}

.checkbox-row { margin: 1.5rem 0; }
.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  font-size: 0.88rem;
  line-height: 1.5;
  color: #333;
  cursor: pointer;
}
.checkbox-label input[type='checkbox'] {
  margin-top: 0.2rem;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  accent-color: #F5C00A;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.8rem;
  background: #F5C00A;
  color: #152440;
  border: none;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}
.btn:hover { opacity: 0.9; }
.btn:active { transform: scale(0.98); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.privacy-note {
  font-size: 0.78rem;
  color: #777;
  margin-top: 1.2rem;
  text-align: center;
}
.privacy-note .underline { text-decoration: underline; }

/* ===== SUCCESS ===== */
.submit-success { text-align: center; padding: 1rem 0; }
.success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #F5C00A;
  color: #152440;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 0 8px rgba(245, 192, 10, 0.15);
}
.submit-success h2 { color: #152440; }
.submit-success p { color: #444; line-height: 1.6; }
.return-address {
  background: #f5f5f7;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  padding: 1.2rem;
  margin: 1.5rem auto;
  max-width: 400px;
  text-align: left;
  font-size: 0.92rem;
  line-height: 1.6;
  color: #333;
}

.submit-error {
  margin-top: 1.5rem;
  padding: 0.9rem 1.1rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c00;
  font-size: 0.88rem;
}

/* ===== LEGAL SECTION ===== */
.legal-section {
  background: #fff;
  padding: 3rem 1.5rem;
  border-top: 1px solid #e4e4e7;
}
.legal-wrap {
  max-width: 800px;
  margin: 0 auto;
}
.legal-wrap h2 {
  font-size: 1.6rem;
  color: #152440;
  margin: 0 0 1.5rem;
  padding-bottom: 0.6rem;
  border-bottom: 2px solid #F5C00A;
}
.legal-wrap h3 {
  font-size: 1.1rem;
  color: #152440;
  margin: 1.5rem 0 0.5rem;
  font-weight: 700;
}
.legal-wrap p {
  font-size: 0.92rem;
  line-height: 1.65;
  color: #444;
  margin: 0 0 1rem;
}
.contact-block {
  background: #f5f5f7;
  border-left: 3px solid #F5C00A;
  padding: 1rem 1.2rem;
  margin: 1rem 0;
  font-size: 0.92rem;
  line-height: 1.7;
}
.legal-intro {
  background: #f5f5f7;
  border-left: 3px solid #F5C00A;
  padding: 1rem 1.2rem;
  margin-bottom: 1.5rem;
  font-size: 0.88rem;
  line-height: 1.6;
  color: #555;
}
.legal-list {
  margin: 0.5rem 0 1rem 1.2rem;
  padding: 0;
  font-size: 0.92rem;
  line-height: 1.65;
  color: #444;
}
.legal-list li {
  margin-bottom: 0.5rem;
  list-style: disc;
}
</style>
