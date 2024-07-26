# Changelog plentyshopPWA

## v1.6.0

### 🚀 Hinzugefügt

- Metadaten wie Meta-Beschreibung und -Schlüsselwörter werden jetzt aus den Umgebungsvariablen gelesen.
- Die "Erneut kaufen"-Funktionalität unterstützt Artikeleigenschaften.

### 🩹 Behoben

- Ein Fehler beim REST-Aufruf zur Abfrage der Systemkonfiguration wurde behoben.
- Die Schaltflächen bei den Adressen in der Kasse wurden in der mobilen Ansicht angepasst.

## v1.5.0 (2024-07-19) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.4.1...v1.5.0" target="_blank" rel="noopener"><b>Übersicht aller Änderungen</b></a>

### TODO 📙 Migrationsanleitung

- Das Paket `@plentymarkets/shop-sdk` wurde auf die neue `@vue-storefront/nuxt` Middleware-Modulstruktur migriert.
- Das Paket `@plentymarkets/shop-sdk` wurde entfernt und seine gesamte Funktionalität wurde in `@plentymarkets/shop-api` verschoben.
- Alle `@plentymarkets/shop-sdk`-Importe müssen in `@plentymarkets/shop-api` umbenannt werden
- useSdk() wird jetzt automatisch importiert und kann nicht mehr importiert werden. Entfernen Sie alle `import { useSdk } from '~/sdk';` Importe.

[Vollständiges Änderungsprotokoll der SDK-Migration](https://github.com/plentymarkets/plentyshop-pwa/pull/452/files)

### 🚀 Hinzugefügt

- Variationseigenschaften können im Shop angezeigt werden
- Demo zum Anpassen von Einstellungen zur Laufzeit
- Hochgeladene Dateien als Produktattribut können jetzt wieder heruntergeladen werden
- Hook, um Systemkonfigurationen zu laden
- Dialog "Erneut kaufen" bei der Bestellübersicht und auf der Bestellbestätigungsseite

### 🩹 Behoben

- Rekursive Aufrufe gefunden in „Kategorie/Produkt“-Routen
- Mehrere Hydratationsfehler
- Ein Problem mit dem Laden von Bildern auf Kategorieseiten
- Webmanifest 404-Fehler
- Konsolenfehler im Checkout
- Leere Liste der Produktattributen wurde angezeigt
- Kanonische Links werden jetzt korrekt gesetzt
- Fehlende Übersetzung in der Länderauswahl
- Fehlende Artikelkurzbeschreibung
- Falscher Link auf der Bestellbestätigungsseite
- Artikelpaket-Links mit fehlendem Bild
- Rendering von Badges
- Aria-Beschriftung der Schaltfläche „Wishlist
- Platz für PayPal im Express Checkout reservieren, wenn Paypal nicht konfiguriert ist
- Größe des Artikelbildes in Artikel-Listen
- Layout-Verschiebung bei der Schaltfläche „In den Warenkorb"
- Wishlist-Schaltfläche schaltet nicht zwischen ausgefülltem/leerem Herzsymbol um
- Adressen werden nach der Erstellung nicht im Checkout angezeigt
- Kein Redirect bei Verwendung des Logins im Header, wenn man sich auf der Gast-Login-Seite befindet
- Streichpreise auf kleinen Bildschirmgrößen
- Sprachauswahl auf kleinen Bildschirmgrößen
- Das Scrollen zu Bewertungen auf kleinen Bildschirmgrößen
- Skript zum Abrufen der Systemkonfiguration verwendet nicht das FETCH_REMOTE_CONFIG aus .env
- Design der Rezensionsübersicht
- Wunschlisten-Funktionalität für Gäste
- Ein Fehler beim REST-Aufruf zur Abfrage der Systemkonfiguration wurde behoben.

### 👷 Geändert

- shortDescription gibt nun einen leeren String zurück
- Verbesserte Anzeige des Bewertungsdurchschnitts bei Bewertungen
- Unnötiger Hover-Status von Warenkorbartikeln wurde entfernt
- Die Navigationsleiste auf mobilen Geräten am unteren Rand des Bildschirms und die Navigations-/Einstellungsschaltflächen im Checkout wurden entfernt
- Platzhaltertext für fehlende Adressen hinzugefügt
- Custom Header im myAccount entfernt
- Tooltip für Bildkomponente für Artikelattribute hinzugefügt
- Das Token im Release-Workflow verwendet nun ein supplier secret
- Die Registrierung ohne Cloudflare-Turnstile-Konfiguration ist nun möglich

### 🏡 Aufräumen

- Nuxt und Paketabhängigkeiten aktualisiert
- Lighthouse Test in eine eigene GitHub-Aktion verschoben
- Paypal-Kreditkartentest in den Quarantäne-Ordner verschoben

## v1.4.1 (2024-06-05) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.4.0...v1.4.1" target="_blank" rel="noopener"><b>Übersicht aller Änderungen</b></a>

### Hinzugefügt

- Benutzerdefinierte SVG-Symbole werden jetzt unterstützt.
- Bilder außerhalb des sichtbaren Bereichs werden jetzt mit Lazy Loading geladen.
- Ein Anmelde-Dialog vor dem Checkout wurde hinzugefügt.
- Die Auswahl der gespeicherten Adressen im Checkout wurde hinzugefügt.
- Bilder in der Kategorie- und Artikelansicht erhalten jetzt Breiten- und Höhenattribute.
- Artikelseiten können jetzt Produktbewertungen darstellen.
- "Artikel zum Warenkorb hinzugefügt"-Dialog wurde hinzugefügt.

### Behoben

- Die Gutscheindarstellung auf der Bestellbestätigung war fehlerhaft. Dies wurde behoben.
- Probleme im Zusammenhang mit der Darstellung von Produktbewertungen wurden behoben.
- Fehlende Details auf der Bestellbestätigung wurden hinzugefügt.
- Ein Fehler bei der Interaktion mit der Wunschliste wurde behoben.
- Ein "DefineExpose"-Compiler-Fehler wurde behoben.
- Ein "Nuxt-Instanz nicht verfügbar" Fehler wurde behoben.
- Hydration- und intlify-Warnungen wurden behoben.
- Es wird nun sichergestellt, dass sich kein Slash am Ende der API_URL befindet.
- Die Bilderqualität in der Kategorieansicht wurde verbessert.
- Die Facettenfilterung auf der Kategorieseite wurde korrigiert.
- Ein zufälliger Fehler bei der Anmeldung wurde behoben.
- Beim Hinzufügen eines bereits im Warenkorb befindlichen Artikels wird jetzt die Anzahl des Artikels erhöht, anstatt den selben Artikel erneut zum Warenkorb hinzuzufügen.
- Bestandteile von Artikelpaketen ohne Artikel-URL führen jetzt nicht mehr zu einer 404 Seite.
- Bestandteile von Artikelpaketen, für die kein Name hinterlegt ist, zeigen jetzt den Platzhalter "Product Information Missing" an der Stelle des Namens an.
- Durch Filter in der Kategorieansicht kam es zu einem Server-Side-Rendering-Fehler. Dies wurde behoben.
- Die Login-Schaltfläche ist jetzt barrierefrei.
- Die Middleware unterstützt jetzt IPv6-Adressen.
- Der PayPal-Express-Button auf der Artikelseite verarbeitet das Klickereignis jetzt korrekt.
- Die Größe der "Zur Wunschliste hinzufügen"-Schaltfläche wurde angepasst.
- Das Rückgabebild wurde entfernt.
- Die mobile Ansicht der Cookiebar wurde verbessert.
- Die Ränder der Schaltflächen zum Schließen der Wunschliste wurden korrigiert.
- Ein Layout-Shift-Problem beim Laden des Warenkorbs wurde behoben.
- Das leere Wunschlistenbild wurde entfernt.
- Bilder von Attributen in der Artikelansicht werden jetzt korrekt angezeigt.
- Ein Fehler beim Laden externer Cookie-Skripte wurde behoben.
- Fehlende Übersetzungen für die Cookiebar wurden hinzugefügt.

### Geändert

- Demo-Bilder der Homepage wurden in das Format AVIF konvertiert.
- Das Styling der Benachrichtigungsanzeige wurde angepasst.
- Das Formular für die Kundenregistrierung wurde verbessert.
- Die Barrierefreiheit der Bewertungen auf der Kategorie- und Artikelseite wurde verbessert.
- Demo-Bilder haben jetzt verschiedene Größen, basierend auf dem Ansichtsfenster.
- Das Design der Sitemap wurde angepasst.
- Es wird jetzt gekennzeichnet, ob ein Eingabefeld optional oder ein Pflichtfeld ist.

## v1.4.0 (2024-04-15) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.3.0...v1.4.0" target="_blank" rel="noopener"><b>Übersicht aller Änderungen</b></a>

### Migrationsanleitung

- Die Upload-Aktion wurde geändert [.github/workflows/upload.yml](https://github.com/plentymarkets/plentyshop-pwa/compare/v1.3.0...v1.4.0#diff-8cf0b5fae548aab9bd49f5020da9c0e35d281984b82b8a5358ffb1c1ae5bec13L5) Aktualisiere die Datei, um die [config-Funktion](https://pwa-docs.plentymarkets.com/guide/setup/deployment#config) zu nutzen.
- Wir benötigen nun ein API Security Token, um Anfragen an die plentysystems API zu stellen. [Guide](https://pwa-docs.plentymarkets.com/guide/how-to/middleware#api-security-token)
- Das Kategorie-Routing wurde aktualisiert und das Präfix /c wurde entfernt. Überprüft, dass keine statischen URLs in deiner Anwendung noch /c enthalten.
  - Um die /c-Routing-Änderung möglich zu machen, wurde die [Kategorieseite](https://github.com/plentymarkets/plentyshop-pwa/compare/v1.3.0...v1.4.0#diff-2f61484eb978aa090fc50dcba90bc44813b45081f25dbff295434cdf6bf219a4) von apps/web/pages/category/[slug].vue nach apps/web/pages/[...slug].vue verschoben.

### Hinzugefügt

- Ein ‘Zurück’-Knopf für die Retouren Form, um die Navigation zu erleichtern.
- Tags auf Artikel- und Kategorieansichten.
- Eine Box-Komponente zum Auswählen von Artikelattributen, um die Nutzerinteraktion zu erhöhen.
- Eine Bilder-Komponente zum Auswählen von Artikelattributen, um die Nutzerinteraktion zu erhöhen.
- Möglichkeit, die Hauptadresse zu markieren, um die Adressenverwaltung zu verbessern
- Eine Artikelverfügbarkeitsanzeige.
- Eine Sitemap-Generierungsfunktion für statischen Inhalt.
- Eine Ansicht für Bundle-Items für die Artikel-, Warenkorb-, Kasse- und Bestellübersicht.
- Leistungsoptimierung bei Aufrufen von Wunschlisten.
- Eine ‘config’ Repository Variable zur Upload Action.
- Eine einheitliche Komponente für Adressverwaltung.
- Unterstützung für das moderne Bildformat (AVIF).
- Eine Option für die Suche nach Tags.
- Eine Bestätigungsseite für Retouren.

### Geändert

- Überflüssige HTML Elemente wurden entfernt, um die DOM-Größe zu reduzieren.
- Dateinamen der Rechtsseiten.
- Verbesserung der i18n imports.
- Ein Nuxt-Upgrade wurde durchgeführt auf Version 3.11.1.
- Vereinheitlichung der 'entfernen' Schaltflächen.
- Änderung der Retouren-Ansicht von einem Popup zu einer eigenständigen Seite.
- In der Kategorie URL wurde das '../c/..' entfernt.
- Die Reihenfolge des Addressinputs wurde geändert.
- Das Design der Bestellbestätigungs Seite wurde überarbeitet.
- Unterschiedliche Bildergrößen-URLs für unterschiedliche Bildschirmgrößen.
- Die Schaltfläche "Von der Wunschliste löschen" wurde nach oben rechts verschoben.
- Die Upload-Aktion wurde aktualisiert.

### Behoben

- Bildqualität auf der Wunschliste verbessert.
- Rückgabemenge und -grund von Retouren wird validiert.
- Bestellmenge nach einer Rücksendung aktualisiert.
- Styling des Auswahlpfeils für Attribute korrigiert.
- Styling des Preisbutton-Filters korrigiert.
- Retourenerstellung auf kleinen Displaygrößen erleichtert.
- Verhalten und Name der Schaltfläche "Zurück zum Einkaufen" korrigiert.
- Eine E-Mail-Adresse wurde fälschlicherweise automatisch im Suchfeld eingefügt
- Styling der Eingabefelder vereinheitlicht.
- Styling der Bestelleigenschaften vereinheitlicht.
- Styling-Probleme bei Radio-Buttons behoben und Abstand bei Checkboxen und Coupons angepasst.
- Styling und Formulierung im neuen Retourenprozess korrigiert.
- Bestimmte Seiten aus der Sitemap ausgeschlossen.
- Funktion der Schaltfläche "Produkt" in der Navigationsleiste für die Mobile Ansicht.
- Canonical Pfad berücksichtigt die ausgewählte Sprache.
- Formatierung der Rechtstexte für kleine Displaygrößen optimiert.
- Kopfzeilenfarbe auf Mobilgeräten korrigiert, um ein einheitliches Erscheinungsbild zu gewährleisten.
- Behoben, dass der Warenkorb nach einem fehlgeschlagenen Bestellvorgang nicht mehr geleert wird.
- Layoutverschiebungen auf der Startseite behoben und feste Bildgrößen bereitgestellt.
- Fehlende Übersetzungen auf der Startseite hinzugefügt.
- Problem behoben, dass eine harte Aktualisierung ohne Browsercache nach dem Sprachwechsel zu einem 404-Fehler führt.
- Fehlender Wunschlisten-Navigationsbutton auf Mobilgeräten hinzugefügt.
- Link zu den Beitragsrichtlinien in der Dokumentation behoben.

## v1.3.0 (2024-02-06) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.2.0...v1.3.0" target="_blank" rel="noopener"><b>Übersicht aller Änderungen</b></a>

### Hinzugefügt

- Bestelleigenschaften zu Produktseiten, dem Warenkorb und der Bestellübersicht hinzugefügt
- Möglichkeit zum Einlösen von Gutscheinen und Rabatten hinzugefügt
- Zahlungsoption **Später Zahlen** von PayPal hinzugefügt
- Retouren hinzugefügt, inklusive der Möglichkeit, einen Grund für die Retoure anzugeben
- Wunschliste hinzugefügt, inklusive der Möglichkeit, Produkte von der Wunschliste direkt zum Warenkorb hinzuzufügen
- Produktbewertungen zu Kategorieseiten hinzugefügt
- Konfiguration hinzugefügt, um zu bestimmen welche Skripte geladen werden, wenn ein Nutzer der Nutzung eines Cookies zustimmt (`cookie-scripts.config.ts`).
- Cloudflare Turnstile hinzugefügt, um Formulare gegen Bots zu schützen. Weitere Information zum Einrichten von Turnstile findest du [in der Dokumentation](https://pwa-docs.plentymarkets.com/guide/how-to/bot-protection).
- Validieren von Formularen mit vee-validate hinzugefügt. Validierung bei folgenden Formularen hinzugefügt:
  - Neues Konto erstellen
  - Newsletter abonnieren
  - Produkt mit Bestelleigenschaften zum Warenkorb hinzufügen
  - Teile des Checkouts, Validierung für den Rest des Checkouts wird in einer zukünftigen Version ergänzt
- Möglichkeit zum Schließen der Vorschau auf Live-Domains hinzugefügt

### Geändert

- Zum Hochladen der App auf plentysystems wird ab jetzt ein einziger Endpunkt für alle Systeme verwendet. Somit wird das Secret `URL_ENDPOINT` nicht mehr benötigt.

### Behoben

- Im Checkout werden Adressen jetzt richtig aktualisiert.
- Auf den Schaltflächen von PayPal werden jetzt der Seite entsprechend die richtigen Beschriftung verwendet.
- Im Megamenü werden Kategorien ohne Beschriftung nicht mehr angezeigt.
- Die Cookiebar wird jetzt je nach Sprachauswahl auf Englisch oder Deutsch angezeigt.
- Die Laufzeit des Cookies `vsf-locale` wurde angepasst und beträgt jetzt 100 Tage.
- Das Öffnen der Sprachauswahl verursacht keinen Cumulative Layout Shift mehr.
- Fehlende Aria-Label wurden zur Paginierung von Kategorieseiten hinzugefügt.
- Fehlende Aria-Label wurden zur Cookiebar hinzugefügt.
- Der klickbare Bereich rund um das Logo wurde erweitert, um die Barrierefreiheit auf Mobile zu verbessern.
- Beim zurück navigieren vom Anmeldeformular auf Mobile wird jetzt das Modal geschlossen statt auf die vorherigen URL zu navigieren.

## v1.2.0 (28.11.2023) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.1.0...v1.2.0" target="_blank" rel="noopener"><b>Übersicht aller Änderungen</b></a>

### Hinzugefügt

- Getter hinzugefügt, um Variationseigenschaften anzuzeigen.
- Es wurde ein Toggle hinzugefügt, um im Frontend den PWA-Vorschaumodus zu deaktivieren.
- Strukturierte Daten für Bewertungen (Rezensionen) hinzugefügt.
- Artikelbilder werden jetzt auf der Bestellbestätigungsseite angezeigt.
- Die App ist nun gegen CSRF-Attacken geschützt.

### Geändert

- Die Cookiebar Logik wurde überarbeitet.
- Die ARIA-Labels von Schaltflächen der Cookiebar wurden übersetzt.
- Die Sprachauswahl wurde überarbeitet und zeigt jetzt Länderflaggen an.
- Die Checkout-Seite wurde überarbeitet, um weniger Daten zu laden.

### Behoben

- Die Seite Widerrufsformular wurde nicht korrekt geladen.
- Beim Unterschreiten der Mindestkaufpreisanforderung wurde beim Bezahlvorgang kein Fehler ausgegeben.
- UI Benachrichtigungen führten zu einer Layoutverschiebung für den Benutzer.
- Kategorien wurden in der falschen Sprache geladen, wenn die Website zum ersten Mal mit SSR gerendert wurde.
  – Die Variationsauswahl hat die Variation nicht aus der URL entfernt, wenn die Basisvariation ausgewählt wurde.
- Produkte auf der Bestellbestätigungsseite haben nicht auf das korrekte Produkt verlinkt.

## v1.1.0 (03.11.2023) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.0.0...v1.1.0" target="_blank" rel="noopener"><b>Übersicht aller Änderungen</b></a>

### TODO

- [Middleware](./docs/config/middleware.md) `API_ENDPOINT` muss nun über eine `.env`-Datei unter `apps/server` gepflegt werden.

### Hinzugefügt

- PayPal Express Checkout hinzugefügt
- PayPal-Kreditkarten-Zahlungsoption hinzugefügt
- PayPal: Die Datei `integration.config` wird nicht mehr benötigt
- Mein Konto: Die Erstellung und Bearbeitung von Versand- und Rechnungsadressen ist jetzt möglich
- Mein Konto: Die Auftragshistorie zeigt die letzten Bestellungen von eingeloggten Kund:innen an
- Mein Konto: Die Retourenhistorie zeigt die letzten Retouren von eingeloggten Kund:innen an
- Die Bestellbestätigung zeigt jetzt alle relevanten Daten der Bestellung an
- Die Bestellbestätigung zeigt jetzt Schaltflächen zum Download von Auftragsdokumenten an
- Die Bestellbestätigung kann nach der Authentifizierung über einen Link aufgerufen werden
- Die Bestellbestätigung ist jetzt auch über die Auftragshistorie erreichbar
- Nicht verkäufliche Produkte werden als solche gekennzeichnet
- Die Anzeige von Mengen-/Staffelpreisen auf Produktseiten wurde hinzugefügt
- Anzeige von Netto-/Bruttopreisen je nach Konfiguration
- Menü im Header hinzugefügt, um zwischen verschiedenen Sprachversionen der PWA zu wechseln
- Mehrsprachige URLs werden nun für verschiedene Sprachversionen der PWA verwendet
- Strukturierte Daten für Breadcrumbs, Logo, Kategorien und Produkte hinzugefügt
- Composable hinzugefügt, das kanonische URL-Metadaten für statische Seiten setzt.
- Weitere Standardbenachrichtigungen für eine Vielzahl von Interaktionen in der PWA hinzugefügt
- Ladeanimationen hinzugefügt

### Geändert

- Überarbeitete Logik für Produkte mit mehreren Attributen
- Aktueller Staffelpreis wird jetzt auf Produktseite markiert
- Bei Produkten mit unterschiedlichen Preisen wird auf der Kategorieseite der niedrigste Preis als "ab Preis" angezeigt
- Die URL-Struktur wurde aktualisiert und ähnelt nun mehr der von plentyShop LTS
- Die Position der Benachrichtungen wurde geändert
- Neues Checkout-Layout – gleiche Funktionalität des Adress-Kontrollkästchens

### Behoben

- Nach dem Login wurde der Benutzer fälschlicherweise auf die Startseite weitergeleitet. Der Benutzer bleibt nun auf der aktuellen Seite.
- Bewertungen und AggregateRating zu SEO-strukturierten Daten hinzugefügt
- Filterung: Nicht mehr vorhandene Filteroptionen werden aus der URL entfernt

## v1.0.0 (28.09.2023) Erster Release
