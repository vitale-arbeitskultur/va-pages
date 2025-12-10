# VA Organisationsdiagramme – GitHub Pages

Dieses Verzeichnis enthält statische HTML-Seiten zur Visualisierung der **Organisationsstruktur** und **Systemarchitektur** von Vitale Arbeitskultur.

## 🚀 URL der veröffentlichten Seiten

Nach dem Deployment sind die Seiten verfügbar unter:
```
https://vitale-arbeitskultur.github.io/va-pages/
```

**Hinweis:** Die Seiten werden automatisch aus diesem privaten Repository in ein öffentliches Repository (`vitale-arbeitskultur/va-pages`) exportiert und dort über GitHub Pages veröffentlicht.

## 📁 Projektstruktur

```
docs/
├── css/
│   ├── va-tokens.css      # Auto-generierte Design Tokens
│   └── va-styles.css      # Gemeinsames Stylesheet mit VA-Branding
├── js/                    # JavaScript-Dateien (optional)
├── assets/                # Bilder, Fonts, etc.
├── _templates/
│   └── base.html          # Base-Template für neue Seiten
├── index.html             # Startseite mit Übersicht
├── organigramm.html       # Soziokratisches Organigramm
├── systemarchitektur.html # System-Integrationsdiagramm
├── README.md              # Diese Datei
└── SETUP.md               # Setup-Anleitung für Deployment
```

## 📊 Enthaltene Diagramme

### 1. Organigramm (organigramm.html)
Visualisierung der **soziokratischen Kreisorganisation**:
- **Kernkreis:** Strategische Führung mit 8 Kernkomplizen
- **Themenkreise:** Seminare & Trainings, Beratung & Coaching, Organisation, Marketing
- **Doppelte Verlinkung:** Verbindungen zwischen den Kreisen nach soziokratischen Prinzipien
- Interaktiv mit Hover-Effekten
- Responsive Design

### 2. Systemarchitektur (systemarchitektur.html)
Visualisierung der **technischen System-Integration**:
- **Zentrale Datenquelle:** Coda als "Single Source of Truth"
- **Externe Systeme:** SevDesk, Brevo, WordPress, Clockify
- **Workflow-Automatisierung:** n8n als Orchestrierungs-Engine
- **Aktive Workflows:**
  - Mailinglisten-Synchronisation (Coda → Brevo)
  - Country IDs Sync (SevDesk → Coda)
  - Newsletter Subscription (WordPress → Brevo)
  - Produkte Export (Coda → SevDesk)
  - Client Upsert (Coda → Clockify)
  - Organisation Update (n8n → Coda)

## 🎨 Design-System

Die Seiten nutzen das bestehende Design-System von Vitale Arbeitskultur:

### Farben
- **Primär (Gelb):** `#EFB708` – `var(--color-brand-primary)`
- **Sekundär (Grün):** `#21474D` – `var(--color-brand-secondary)`
- **Akzent (Rot):** `#A63634` – `var(--color-brand-accent)`
- **Grau:** `#606060` – `var(--color-neutral-gray)`

### Typografie
- **Schriftart:** Trenda
- **Basis-Schriftgröße:** 18px
- **Verfügbare Größen:** xs (12px), sm (14px), base (18px), lg (40px), xl (60px), 2xl (100px)

### CSS-Variablen
Alle Design-Tokens sind als CSS-Variablen verfügbar (siehe [va-tokens.css](css/va-tokens.css)).

## ✏️ Diagramme bearbeiten

### Organigramm anpassen

Die Kreise im Organigramm können in [organigramm.html](organigramm.html) angepasst werden:

```html
<!-- Kreis hinzufügen -->
<div class="circle circle-sub circle-neuerthemenkreis">
    <div class="circle-title">Neuer Themenkreis</div>
    <div class="circle-subtitle">Beschreibung</div>
    <div class="circle-members">X Personen</div>
</div>
```

Positionierung über CSS anpassen:
```css
.circle-neuerthemenkreis {
    left: 50%;
    top: 5%;
}
```

### Systemarchitektur anpassen

Neue Systeme in [systemarchitektur.html](systemarchitektur.html) hinzufügen:

```html
<!-- System-Node hinzufügen -->
<div class="system-node node-external node-neuesystem">
    <div class="system-title">Neues System</div>
    <div class="system-subtitle">Beschreibung</div>
</div>
```

Datenfluss (Pfeil) hinzufügen:
```html
<path d="M x1 y1 Q cx cy x2 y2" class="flow-arrow"/>
<text x="cx" y="cy" class="flow-label">Label</text>
```

### Workflow hinzufügen

Neuen Workflow in der Workflow-Grid ergänzen:
```html
<div class="workflow-card">
    <h3>Workflow Name</h3>
    <p>Beschreibung des Workflows</p>
    <div class="workflow-path">
        <span>System A</span>
        <span class="workflow-arrow">→</span>
        <span>n8n</span>
        <span class="workflow-arrow">→</span>
        <span>System B</span>
    </div>
</div>
```

## 🔄 Deployment

### Automatisches Deployment

Die Seiten werden automatisch deployt, wenn:
- Änderungen im `docs/` Verzeichnis auf `main` gepusht werden
- Änderungen im `assets/tokens/` Verzeichnis gepusht werden

Der Workflow:
1. ✅ Design-Tokens aus `assets/tokens/` werden gebaut
2. ✅ `docs/` Verzeichnis wird ins öffentliche Repo exportiert
3. ✅ GitHub Pages aktualisiert die Live-Seiten

### Manuelles Deployment

Du kannst das Deployment auch manuell über GitHub Actions starten:
1. Gehe zu "Actions" im GitHub Repository
2. Wähle "Export Static Pages to Public Repository"
3. Klicke auf "Run workflow"

### Setup

Für das initiale Setup siehe [SETUP.md](SETUP.md) – dort findest du die Anleitung zum:
- Erstellen des öffentlichen Repositories
- Generieren des GitHub Personal Access Tokens
- Konfigurieren von GitHub Pages

## 🔒 Sicherheit

**Was wird exportiert:**
- ✅ Nur der Inhalt von `docs/` (HTML, CSS, SVG)
- ✅ Generierte Design-Tokens (CSS-Variablen)

**Was bleibt privat:**
- ❌ n8n Workflows (JSON-Konfigurationen)
- ❌ SevDesk Konfigurationen
- ❌ Coda Packs & API-Keys
- ❌ WordPress Theme Code
- ❌ Alle anderen Verzeichnisse

Die Diagramme zeigen nur die **Struktur** und **Verbindungen**, keine sensiblen Daten, API-Keys oder Credentials.

## 🛠️ Lokale Entwicklung

### Design-Tokens neu generieren

Wenn du Änderungen an den Design-Tokens vornimmst:

```bash
cd assets/tokens
npm install              # Nur beim ersten Mal
npm run build:tokens     # Generiert CSS-Variablen
```

Die generierten Dateien werden automatisch nach `docs/css/va-tokens.css` kopiert.

### Lokalen Server starten

Um die Seiten lokal zu testen:

```bash
# Mit Python 3
cd docs
python3 -m http.server 8000

# Mit Node.js (npx)
cd docs
npx serve

# Mit PHP
cd docs
php -S localhost:8000
```

Öffne dann http://localhost:8000 im Browser.

## 📝 Best Practices

1. **Visuelle Konsistenz:** Nutze die vordefinierten CSS-Variablen und Farben
2. **Semantisches HTML:** Verwende HTML5-Tags für bessere Struktur
3. **Responsive Design:** Teste Diagramme auf verschiedenen Bildschirmgrößen
4. **Performance:** SVG für Diagramme (klein & skalierbar)
5. **Accessibility:** Nutze `title` und `aria-label` für SVG-Elemente

## 🐛 Troubleshooting

### Seiten werden nicht aktualisiert
- Prüfe den GitHub Actions Status (Tab "Actions" im Repo)
- GitHub Pages kann bis zu 10 Minuten für Updates brauchen
- Leere den Browser-Cache (Strg+Shift+R / Cmd+Shift+R)

### Diagramme werden nicht korrekt angezeigt
- Prüfe Browser-Konsole auf Fehler
- Stelle sicher, dass CSS korrekt geladen wird
- Teste mit verschiedenen Browsern

### Design-Tokens fehlen
```bash
cd assets/tokens
npm install
npm run build:tokens
```

## 📚 Weitere Ressourcen

- [Soziokratie Prinzipien](https://www.sociocracyforall.org/)
- [GitHub Pages Dokumentation](https://docs.github.com/en/pages)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
- [VA Hauptwebseite](https://vitalearbeits-kultur.de)

---

**Bei Fragen:** [info@vitalearbeits-kultur.de](mailto:info@vitalearbeits-kultur.de)
