# Uptain-PWA-Beta: Installer für npm-Publish

Diese Dateien ins **Modul-Quellrepo** (z. B. `plentyPWA/uptain-pwa-beta`) kopieren, dann Version hochziehen und publishen.

---

## Checkliste

1. **Skript übernehmen**
   - `scripts/plentyshop-pwa-settings-patch.js` → im Paket-Repo nach `scripts/plentyshop-pwa-settings-patch.js` kopieren.

2. **package.json anpassen**
   - In `files` den Eintrag `"scripts"` hinzufügen.
   - Einen `scripts`-Block mit `postinstall` hinzufügen.

   Siehe unten: **package.json – Änderungen**.

3. **README (optional)**
   - Im Paket-README einen kurzen Hinweis einbauen, dass beim Install die Settings-Anpassung automatisch läuft (siehe **README-Snippet** unten).

4. **Version erhöhen**
   - z. B. `1.0.0-beta.6` → `1.0.0-beta.7`.

5. **Publishen**
   ```bash
   cd /pfad/zu/uptain-pwa-beta
   npm publish --tag beta --access public
   ```

---

## package.json – Änderungen

Im bestehenden `package.json` des Moduls:

**1. `files`-Array erweitern** – `"scripts"` aufnehmen:

```json
"files": [
  "module.ts",
  "runtime",
  "scripts",
  "README.md"
],
```

**2. Neuen Block `scripts` einfügen** (z. B. nach `files`):

```json
"scripts": {
  "postinstall": "node scripts/plentyshop-pwa-settings-patch.js"
},
```

Falls schon ein `scripts`-Block existiert, nur die Zeile `"postinstall": "node scripts/plentyshop-pwa-settings-patch.js"` ergänzen.

---

## README-Snippet (optional)

Unter „Setup“ / nach Punkt 2 z. B. einfügen:

```markdown
2. **Settings im Editor:** Beim Installieren führt das Modul ein Postinstall-Skript aus und passt die PWA-Dateien für die Settings-Discovery an (damit unter **SEO → Tracking & analytics** die Uptain-Konfiguration erscheint). Der Vorgang ist idempotent und überschreibt keine manuellen Anpassungen.

3. Configure Uptain in your shop …
```

---

## Ordnerstruktur im Paket-Repo (nach dem Kopieren)

```
uptain-pwa-beta/
├── module.ts
├── package.json      ← mit postinstall + "scripts" in files
├── README.md
├── runtime/
│   └── …
└── scripts/
    └── plentyshop-pwa-settings-patch.js   ← neu
```
