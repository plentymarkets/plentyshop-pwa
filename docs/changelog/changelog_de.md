# Changelog plentyshopPWA

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

### Behoben

- Nach dem Login wurde der Benutzer fälschlicherweise auf die Startseite weitergeleitet. Der Benutzer bleibt nun auf der aktuellen Seite.
- Bewertungen und AggregateRating zu SEO-strukturierten Daten hinzugefügt
- Filterung: Nicht mehr vorhandene Filteroptionen werden aus der URL entfernt

## v1.0.0 (28.09.2023) Erster Release
