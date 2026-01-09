# Coda-Tabellenstruktur für Organigramm

Dieses Dokument beschreibt die Tabellenstruktur in Coda.io, die als Datenquelle für das interaktive Organigramm dient.

## 📊 Tabellenübersicht

### Tabelle: "Kreise"

Enthält alle soziokratischen Kreise der Organisation.

| Spalte | Typ | Beschreibung | Pflicht | Beispiel |
|--------|-----|--------------|---------|----------|
| `Name` | Text | Voller Name des Kreises | Ja | "Administration" |
| `Zweck` | Text | Beschreibung der Verantwortung | Ja | "Verwaltung, Finanzen und operative Prozesse" |
| `Übergeordneter Kreis` | Relation zu "Kreise" | Parent-Kreis (leer = Root-Ebene) | Nein | Leer oder Link zu Parent |
| `Kurzname` | Text | Kurze Bezeichnung für Diagramm | Optional | "ADMIN" |

**Hinweise:**
- **Root-Kreise:** Feld "Übergeordneter Kreis" leer lassen
- **Sub-Kreise:** Relation zum übergeordneten Kreis setzen
- **Hierarchie:** Beliebig viele Ebenen möglich (werden automatisch dargestellt)

**Beispiel-Daten:**

```
Name: "Administration"
Zweck: "Verwaltung, Finanzen und operative Prozesse der Organisation"
Übergeordneter Kreis: [leer - ist Root-Kreis]
Kurzname: "ADMINISTRATION"

Name: "Digitalisierung"
Zweck: "Entwicklung digitaler Lösungen und Tools"
Übergeordneter Kreis: "Administration" [Relation]
Kurzname: "DIGITALISIERUNG"
```

---

### Tabelle: "Rollen"

Enthält alle Rollen innerhalb der Kreise.

| Spalte | Typ | Beschreibung | Pflicht | Beispiel |
|--------|-----|--------------|---------|----------|
| `Name` | Text | Name der Rolle | Ja | "Geschäftsführung" |
| `Kreis` | Relation zu "Kreise" | Zuordnung zum Kreis | Ja | Link zu "Administration" |
| `Beschreibung` | Text | Optionale Rollenbeschreibung | Nein | "Verantwortlich für..." |

**Hinweise:**
- Jede Rolle muss genau einem Kreis zugeordnet sein
- Mehrere Rollen pro Kreis möglich
- Rollen werden innerhalb des Kreises angeordnet

**Beispiel-Daten:**

```
Name: "Geschäftsführung"
Kreis: "Administration" [Relation]
Beschreibung: "Strategische Führung und Gesamtverantwortung"

Name: "IT"
Kreis: "Administration" [Relation]
```

---

### Tabelle: "Link-Indikatoren" (Optional)

Enthält die doppelten Verlinkungen zwischen Kreisen (soziokratisches Prinzip).

| Spalte | Typ | Beschreibung | Pflicht | Beispiel |
|--------|-----|--------------|---------|----------|
| `Name` | Text | Name des Link-Indikators | Ja | "Projektschafferin" |
| `Typ` | Text | Art der Verlinkung | Optional | "link" |

**Beispiel-Daten:**

```
Name: "Projektschafferin"
Typ: "link"

Name: "Kompliz:in"
Typ: "link"
```

---

## 🔄 Automatischer Sync-Prozess

### Workflow

```
Coda.io (Tabellen)
    ↓
n8n Workflow (täglich 6:00 Uhr)
    ↓ Transformation
docs/data/organigramm.json
    ↓ Git Commit
GitHub Actions
    ↓ Deployment
GitHub Pages (Live-Seite)
```

### n8n Workflow

**Datei:** `n8n/workflows/vaOS_CodaToGitHub_OrganigrammSync.json`

**Schritte:**
1. Lese Tabelle "Kreise" aus Coda
2. Lese Tabelle "Rollen" aus Coda
3. Lese Tabelle "Link-Indikatoren" aus Coda
4. Transformiere Daten in JSON-Format
5. Vergleiche mit aktueller JSON-Datei
6. Bei Änderungen: Commit zu GitHub
7. Trigger GitHub Pages Deployment

### JSON-Output-Format

```json
{
  "organisation": {
    "name": "Vitale Arbeitskultur",
    "links": [
      { "name": "Projektschafferin" },
      { "name": "Kompliz:in" }
    ]
  },
  "kreise": [
    {
      "id": "administration",
      "name": "Administration",
      "zweck": "Verwaltung, Finanzen und operative Prozesse",
      "parent": null,
      "rollen": [
        { "id": "admin-gf", "name": "Geschäftsführung" },
        { "id": "admin-it", "name": "IT" }
      ]
    },
    {
      "id": "digitalisierung",
      "name": "Digitalisierung",
      "zweck": "Entwicklung digitaler Lösungen",
      "parent": "administration",
      "rollen": [
        { "id": "digi-dev", "name": "Entwickelnd" }
      ]
    }
  ]
}
```

---

## ✏️ Anleitung: Daten in Coda bearbeiten

### Neuen Kreis hinzufügen

1. Öffne Tabelle "Kreise"
2. Neue Zeile hinzufügen
3. Ausfüllen:
   - **Name:** Voller Kreisname
   - **Zweck:** Beschreibung
   - **Übergeordneter Kreis:** Leer (für Root) oder Relation zum Parent
   - **Kurzname:** Optional, für kompakte Darstellung
4. Speichern
5. Nächster Sync: Automatisch um 6:00 Uhr (oder manuell triggern)

### Neue Rolle hinzufügen

1. Öffne Tabelle "Rollen"
2. Neue Zeile hinzufügen
3. Ausfüllen:
   - **Name:** Rollenname
   - **Kreis:** Relation zum gewünschten Kreis
4. Speichern
5. Nächster Sync: Automatisch um 6:00 Uhr

### Hierarchie ändern

Um einen Kreis einem anderen Kreis unterzuordnen:
1. Öffne Tabelle "Kreise"
2. Finde den Kreis
3. Ändere "Übergeordneter Kreis" Relation
4. Speichern
5. Layout wird beim nächsten Sync automatisch angepasst

---

## 🎨 Layout-Berechnung

### Automatisches Layout

Das Layout wird **nicht** in Coda definiert, sondern automatisch vom Frontend berechnet:

- **Algorithmus:** Concentric (konzentrische Kreise)
- **Ebene 1:** Alle Root-Kreise (ohne Parent)
- **Ebene 2:** Alle Sub-Kreise (mit Parent)
- **Weitere Ebenen:** Bei tieferer Hierarchie automatisch

### Vorteile

✅ Keine manuelle Positionierung nötig
✅ Layout passt sich automatisch an neue Kreise an
✅ Konsistente Darstellung
✅ Einfache Pflege in Coda

---

## 🔍 Troubleshooting

### Änderungen werden nicht angezeigt

1. **Prüfen:** Wurde der Sync ausgeführt?
   - Nächster automatischer Sync: Täglich 6:00 Uhr
   - Manuell triggern: n8n Workflow starten

2. **Prüfen:** GitHub Actions erfolgreich?
   - https://github.com/vitale-arbeitskultur/va-os/actions

3. **Prüfen:** JSON-Datei aktualisiert?
   - https://github.com/vitale-arbeitskultur/va-os/blob/main/docs/data/organigramm.json

4. **Browser-Cache:** Strg+Shift+R (Windows) / Cmd+Shift+R (Mac)

### Kreis wird nicht angezeigt

- **Prüfen:** Feld "Name" ausgefüllt?
- **Prüfen:** Kreis-Relation korrekt?
- **Prüfen:** Keine Zirkelbezüge in Hierarchie?

### Rolle wird nicht angezeigt

- **Prüfen:** "Kreis" Relation gesetzt?
- **Prüfen:** Kreis existiert und ist sichtbar?

---

## 📞 Kontakt & Support

Bei Fragen oder Problemen:
- **E-Mail:** kontakt@vitale-arbeitskultur.de
- **GitHub Issues:** https://github.com/vitale-arbeitskultur/va-os/issues

---

**Letzte Aktualisierung:** 2025-10-14
