# Setup-Anleitung: GitHub Pages für Private Repository

Da dieses Repository privat bleiben muss, werden die statischen Seiten automatisch in ein öffentliches Repository exportiert.

## 🔧 Einmalige Einrichtung

### 1. Öffentliches Repository erstellen

Erstelle ein neues **öffentliches** Repository:
- Name: `va-pages`
- Organisation: `vitale-arbeitskultur`
- URL: `https://github.com/vitale-arbeitskultur/va-pages`
- Beschreibung: "Static pages for Vitale Arbeitskultur organization"
- ✅ Public
- ✅ Initialize with README

### 2. Personal Access Token erstellen

1. Gehe zu: https://github.com/settings/tokens/new
2. Token name: `VA Pages Deploy Token`
3. Expiration: No expiration (oder nach Bedarf)
4. Scopes auswählen:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Klicke "Generate token"
6. **Kopiere den Token** (wird nur einmal angezeigt!)

### 3. Token als Secret hinzufügen

1. Gehe zu diesem privaten Repository: https://github.com/vitale-arbeitskultur/va-os/settings/secrets/actions
2. Klicke "New repository secret"
3. Name: `PAGES_DEPLOY_TOKEN`
4. Value: (füge den kopierten Token ein)
5. Klicke "Add secret"

### 4. GitHub Pages im öffentlichen Repo aktivieren

1. Gehe zu: https://github.com/vitale-arbeitskultur/va-pages/settings/pages
2. Source: **Deploy from a branch**
3. Branch: `main` / Root: `/ (root)`
4. Speichern

### 5. Ersten Export durchführen

1. Gehe zu: https://github.com/vitale-arbeitskultur/va-os/actions
2. Wähle den Workflow "Export Static Pages to Public Repository"
3. Klicke "Run workflow" → "Run workflow"
4. Warte auf Completion (~1-2 Minuten)

### 6. Überprüfung

Nach erfolgreichem Export:
- Öffentliches Repo: https://github.com/vitale-arbeitskultur/va-pages
- Live-Seiten: https://vitale-arbeitskultur.github.io/va-pages/

## 🚀 Automatischer Workflow

Nach dem Setup wird bei jedem Push auf `main` automatisch:

1. ✅ Design-Tokens aus `assets/tokens/` gebaut
2. ✅ `docs/` Verzeichnis ins öffentliche Repo kopiert
3. ✅ Commit & Push zum öffentlichen Repo
4. ✅ GitHub Pages updated die Live-Seiten

## 🔒 Sicherheit

**Was wird exportiert:**
- ✅ Nur der Inhalt von `docs/` (HTML, CSS, JS, Assets)
- ✅ Generierte Design-Tokens (CSS-Variablen)

**Was bleibt privat:**
- ❌ n8n Workflows
- ❌ SevDesk Konfigurationen
- ❌ Coda Packs
- ❌ WordPress Theme Code
- ❌ Alle anderen Verzeichnisse

## 🛠️ Troubleshooting

### Workflow schlägt fehl: "Repository not found"
→ Stelle sicher, dass `va-pages` Repository existiert und öffentlich ist

### Workflow schlägt fehl: "Permission denied"
→ Überprüfe, dass das `PAGES_DEPLOY_TOKEN` Secret korrekt gesetzt ist

### Seiten werden nicht aktualisiert
→ Prüfe GitHub Pages Settings im öffentlichen Repo (muss auf `main` branch zeigen)

### Token abgelaufen
→ Erstelle einen neuen Token und update das `PAGES_DEPLOY_TOKEN` Secret

## 📝 Alternative: Netlify oder Vercel

Falls du kein öffentliches GitHub-Repository möchtest, kannst du auch:
- **Netlify**: Unterstützt private GitHub Repos (kostenlos)
- **Vercel**: Unterstützt private GitHub Repos (kostenlos)
- **Cloudflare Pages**: Unterstützt private GitHub Repos (kostenlos)

Diese Services können direkt aus diesem privaten Repository deployen ohne Export.

## 💡 Repository-Struktur

```
vitale-arbeitskultur/va-os (PRIVAT)
├── docs/               → Wird exportiert
├── n8n/                → Bleibt privat
├── sevdesk/            → Bleibt privat
├── coda/               → Bleibt privat
└── .github/workflows/
    └── export-pages.yml  → Export-Workflow

vitale-arbeitskultur/va-pages (ÖFFENTLICH)
├── index.html
├── about.html
├── stats.html
├── contact.html
├── css/
│   ├── va-tokens.css
│   └── va-styles.css
└── (nur statische Dateien)
```

---

**Bei Fragen:** info@vitalearbeits-kultur.de
