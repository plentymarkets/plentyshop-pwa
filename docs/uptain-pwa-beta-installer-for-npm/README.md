# Uptain-PWA-Beta: Auto-Installer für npm-Publish

**Alles läuft über die Installation.** Beim `npm install uptain-pwa-beta` richtet das Postinstall-Skript die komplette Integration in der PWA ein – es sind danach keine manuellen Änderungen im PWA-Repo nötig (und in Deployment-Umgebungen kann später ohnehin nichts nachträglich reingepackt werden).

Diese Dateien ins **Modul-Quellrepo** (z. B. `plentyPWA/uptain-pwa-beta`) kopieren, dann Version hochziehen und publishen.

---

## Was der Postinstall macht (idempotent)

1. **Lokale UptainSettings.vue**  
   Legt `apps/web/app/components/settings/seo/tracking-and-analytics/uptain/UptainSettings.vue` aus dem mitgelieferten Template an. Diese Komponente liegt damit im App-Code und erhält Auto-Imports (`useSiteSettings`, `computed`, etc.).

2. **Settings-Discovery patchen**  
   - `settings-groups-imports.ts`: `customerWorkspaceRoot`-Glob + **settingsOverrides**-Glob für die lokale Uptain-Komponente (Overrides werden zuletzt gemerged).
   - `settings-translations-imports.ts`: `localeFilesCustomerWorkspaceRoot`.
   - `triggers-imports.ts`: `customerWorkspaceRootTriggers`.

3. **Provide-Plugin**  
   Legt `apps/web/app/plugins/00.provide-editor-composables.client.ts` an (stellt `useSiteSettings` und `getEditorTranslation` bereit), falls noch nicht vorhanden.

4. **nuxt.config.ts**  
   Ergänzt bei Bedarf:
   - `experimental.appManifest: false` (verhindert 404 beim App-Manifest in Deployment).
   - `vite.ssr.noExternal: ['uptain-pwa-beta']`.

---

## Checkliste

1. **Skript + Template ins Paket kopieren**
   - `scripts/plentyshop-pwa-settings-patch.js` → im Paket-Repo nach `scripts/plentyshop-pwa-settings-patch.js`.
   - **`scripts/templates/UptainSettings.vue`** → im Paket-Repo nach `scripts/templates/UptainSettings.vue` (Ordner `templates` anlegen).

2. **package.json anpassen**
   - In `files` den Eintrag `"scripts"` hinzufügen (damit `scripts/` inkl. `templates/` mitpublisht wird).
   - Einen `scripts`-Block mit `postinstall` hinzufügen.

   Siehe unten: **package.json – Änderungen**.

3. **README (optional)**  
   Im Paket-README einen kurzen Hinweis, dass beim Install die komplette Uptain-Integration automatisch eingerichtet wird (siehe **README-Snippet** unten).

4. **Version erhöhen**  
   z. B. `1.0.0-beta.11` → `1.0.0-beta.12`.

5. **Publishen**
   ```bash
   cd /pfad/zu/uptain-pwa-beta
   npm publish --tag beta --access public
   ```

---

## package.json – Änderungen

Im bestehenden `package.json` des Moduls:

**1. `files`-Array** – `"scripts"` aufnehmen (enthält auch `templates/`):

```json
"files": [
  "module.ts",
  "runtime",
  "scripts",
  "README.md"
],
```

**2. Block `scripts`** (z. B. nach `files`):

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
2. **Integration:** Beim Installieren führt das Modul ein Postinstall-Skript aus und richtet die Uptain-Integration in der PWA ein: lokale Settings-Komponente, Settings-Discovery-Patches, Editor-Plugin und nuxt.config-Anpassungen. Alles idempotent – keine manuellen Schritte nötig. Die Uptain-Konfiguration erscheint unter **SEO → Tracking & analytics**.

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
    ├── plentyshop-pwa-settings-patch.js   ← erweitertes Skript
    └── templates/
        └── UptainSettings.vue             ← Vorlage für lokale Komponente
```

Ohne `scripts/templates/UptainSettings.vue` wird die lokale Komponente beim Postinstall nicht angelegt; die übrigen Patches (Settings, Plugin, nuxt.config) laufen weiter.
