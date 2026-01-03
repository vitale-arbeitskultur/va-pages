# Extracted Coda Schema - Team-Hub (2kAt7SyScx)

**Extracted on**: 2025-12-09
**Source Document**: Team-Hub (copy of c3OGFF0UOX)
**Total Tables**: 36 base tables
**Total Rows**: 1,427

---

## Core Tables for Migration

### 1. Organisationen (Organizations) - `grid-b1FMvqdAFo`

| Column Name | Type | Array | Required | Notes |
|-------------|------|-------|----------|-------|
| Name | text | No | Yes | Primary identifier |
| Strasse | text | No | No | Street address |
| Hausnummer | text | No | No | House number |
| Postleitzahl | text | No | No | Postal code |
| Ort | text | No | No | City |
| Logo | image | Yes | No | Multiple images allowed |
| Status | select | No | Yes | Options: Aktiv, Inaktiv, Zu löschen, Invalidiert |
| Statusgrund | select | Yes | No | Options: Interessent, Kunde, Kundeskunde, Partner, Lieferant (multi-select) |
| Kundenummer | number | No | No | Customer number |
| Land | relation | Yes | No | → Länder table (multi) |
| Personen | relation | Yes | No | → Personen table (calculated/lookup) |
| Webseite | link | No | No | Website URL |
| Aufträge | relation | Yes | No | → Aufträge table (calculated/lookup) |
| Telefon | text | No | No | Phone number |
| E-Mail Adresse (Rechnungen) | email | No | No | Billing email |
| UST-ID | text | No | No | VAT ID |
| Letzte Abrechnung | date | No | No | Last invoice date (M/D/YYYY) |
| ClockifyID | text | No | No | Clockify client ID |
| SevDeskID | text | No | No | SevDesk organization ID |
| Notizen | canvas | No | No | Rich text notes |

**Key Relationships:**
- Organizations → Länder (Countries) - Many to Many
- Organizations ← Personen (Persons) - One to Many
- Organizations → Aufträge (Orders) - One to Many

---

### 2. Personen (Persons) - `grid-TjX0aeUBr4`

| Column Name | Type | Array | Required | Notes |
|-------------|------|-------|----------|-------|
| Vollständiger Name | canvas | No | No | Calculated/formula field |
| Vorname | text | No | Yes | First name |
| Nachname | text | No | Yes | Last name |
| Organisationen | relation | No | No | → Organisationen table (single) |
| Geschlecht | select | No | No | Options: weiblich, männlich, divers |
| Titel | text | No | No | Title (Dr., Prof., etc.) |
| E-Mail Adresse | email | No | No | Primary email |
| Telefon | text | No | No | Phone |
| Mobil | text | No | No | Mobile phone |
| Button Mobil | button | No | No | Action: Call mobile (calculated) |
| Button E-Mail | button | No | No | Action: Send email (calculated) |
| Status | select | No | No | Options: Aktiv, Inaktiv, Zu löschen |
| Position | text | No | No | Job title/position |
| Mailingliste-Personen | relation | Yes | No | → Mailingliste-Personen (calculated/lookup) |
| Termine | relation | Yes | No | → Termine table (calculated/lookup) |
| Seminare | relation | Yes | No | → Seminare table (calculated/lookup) |
| Notizen | canvas | No | No | Rich text notes |

**Key Relationships:**
- Personen → Organisationen (Organizations) - Many to One
- Personen ← Mailingliste-Personen (Mailing List Junction) - One to Many
- Personen → Termine (Appointments) - Many to Many
- Personen → Seminare (Seminars) - Many to Many

---

### 3. Produkte (Products) - `grid-NYIy_YtEFu`

| Column Name | Type | Array | Required | Notes |
|-------------|------|-------|----------|-------|
| Name | text | No | Yes | Product name |
| Preis | currency | No | Yes | Price (EUR, 2 decimals) |
| Einheit | select | No | No | Options: Stunde, Jahr (Hour, Year) |
| Steuersatz | select | No | Yes | Tax rate: 0%, 7%, 19% |
| Produktnummer | text | No | Yes | Product/SKU number |
| SevDeskID | text | No | No | SevDesk product ID |
| Interaktionschancen | relation | Yes | No | → Interaktionschancen table (calculated) |

**Key Relationships:**
- Produkte → Interaktionschancen (Interaction Opportunities) - One to Many

---

### 4. Mailinglisten (Mailing Lists) - `grid-WoNhzO_0e2`

| Column Name | Type | Array | Required | Notes |
|-------------|------|-------|----------|-------|
| Name | text | No | Yes | List name |
| BrevoID | number | No | Yes | Brevo list ID (22 digits precision) |
| Beschreibung | canvas | No | No | Description (rich text) |
| Mailingliste-Personen | relation | Yes | No | → Mailingliste-Personen (calculated/lookup) |
| Mailings | relation | Yes | No | → Mailings table (calculated/lookup) |

**Key Relationships:**
- Mailinglisten ← Mailingliste-Personen (Junction) - One to Many
- Mailinglisten → Mailings - One to Many

---

### 5. Mailingliste-Personen (Mailing List Persons - Junction) - `grid-QpZomkgipN`

| Column Name | Type | Array | Required | Notes |
|-------------|------|-------|----------|-------|
| Name | text | No | No | Auto-generated name |
| Mailingliste | relation | No | Yes | → Mailinglisten table |
| Person | relation | No | Yes | → Personen table |
| Status | select | No | No | Options: Aktiv, Inaktiv, Zu löschen |

**Purpose**: Junction table connecting Persons to Mailing Lists (many-to-many relationship)

**Key Relationships:**
- Mailingliste-Personen → Mailinglisten - Many to One
- Mailingliste-Personen → Personen - Many to One

---

### 6. Länder (Countries) - `grid--igkxW42mY`

| Column Name | Type | Array | Required | Notes |
|-------------|------|-------|----------|-------|
| Name | text | No | Yes | Country name |
| ISO 2 | text | No | Yes | ISO 3166-1 alpha-2 code |
| ISO 3 | text | No | No | ISO 3166-1 alpha-3 code |
| Top Level Domain | text | No | No | Country TLD (.de, .com, etc.) |
| SevDeskID | text | No | No | SevDesk country ID |

**Purpose**: Reference data for countries, synced FROM SevDesk

---

### 7. Kreise (Circles) - `grid-KuFhRbO9oO`

| Column Name | Type | Array | Required | Notes |
|-------------|------|-------|----------|-------|
| Name | text | No | Yes | Circle name |
| Zweck | text | No | Yes | Purpose/responsibility |
| Übergeordneter Kreis | relation | No | No | → Kreise (self-relation for hierarchy) |

**Purpose**: Sociocratic organizational circles with hierarchical structure

**Key Relationships:**
- Kreise → Kreise (self-referential) - Parent-child hierarchy

---

## Additional Tables Found

### 8. Teams - `grid-GKOvSxynsS`
Purpose: Team management

### 9. Objectives - `grid-vfxyjh-ggm`
Purpose: OKR management

### 10. Key Results - `grid-WFYbajWA02`
Purpose: OKR key results

### 11. Aufträge (Orders) - `grid-qvBCAkMmAn`
Purpose: Customer orders/contracts

### 12. Geschäftsbereiche (Business Areas) - `grid-kGmqSnGlvu`
Purpose: Business unit organization

### 13. Projekte (Projects) - `grid-AxcenRs3pl`
Purpose: Project management

### 14. Aufgaben-Board (Task Board) - `grid-kjOL_vjOv2`
Purpose: Task management board

### 15. Rollen (Roles) - `grid-mpn3IFvrBC`
Purpose: Role definitions (possibly linked to Kreise)

### 16. Interaktionschancen (Interaction Opportunities) - `grid-eMEYwmpV-J`
Purpose: Customer touchpoints/opportunities

### 17. Tasks - `grid-PhFNdmcbYy`
Purpose: Task management

### 18. Social Media Posts - `grid-0pHD-HolFl`
Purpose: Social media content planning

### 19. Seminare (Seminars) - `grid-P7eYdriepL`
Purpose: Seminar/workshop management

### 20. Termine (Appointments) - `grid-2h86rH64UR`
Purpose: Calendar/appointment management

### 21. Buchungen (Bookings) - `grid-1b5erUyuKm`
Purpose: Booking management

### 22. Networking & Veröffentlichungsplan (Publishing Plan) - `grid-JRkmqvYRni`
Purpose: Content and networking planning

### 23. Meetings - `grid-1yiB7iUUMj`
Purpose: Meeting management

### 24. Spannungen (Tensions) - `grid-fiV4sSK6yx`
Purpose: Sociocratic tension processing

### 25. Komplizen-Gallerie (Partners Gallery) - `grid-Vainusqs5s`
Purpose: Partner showcase

### 26. Mailings - `grid-IqetWMAmD1`
Purpose: Email campaign management

### 27. Curricula - `grid-1HRbCkwj8U`
Purpose: Training curricula

### 28. Reisetagebuch (Travel Diary) - `grid-7_M2vWbP9E`
Purpose: Travel log

### 29. Subscriptions - `grid-gotDg91BOK`
Purpose: Subscription management

### 30. Aufgaben (Tasks) - `grid-_W3PDGL2f4`
Purpose: General task management

### 31-36. Various unnamed tables (Table, Table 1-5)
Purpose: TBD

---

## Data Type Mapping: Coda → Grist

| Coda Type | Grist Type | Notes |
|-----------|------------|-------|
| text | Text | Direct mapping |
| number | Numeric | Preserve precision |
| email | Text with Email validation | Grist validates email format |
| select (single) | Choice | Map options to Grist choice list |
| select (multi) | Choice List | Multiple selections allowed |
| date | Date or DateTime | Preserve format |
| currency | Numeric | Store as decimal, format as currency |
| link | Text with URL validation | Grist validates URLs |
| image | Attachments | Grist supports file attachments |
| canvas (rich text) | Text | May lose some formatting |
| lookup/relation | Reference | Grist reference columns |
| button | Formula (trigger action) | Recreate as formula or webhook |
| calculated/formula | Formula | Rewrite in Python |

---

## Critical Migration Considerations

### 1. Multi-Select Fields
**Coda**: `Statusgrund` allows multiple selections
**Grist**: Use Choice List column type

### 2. Calculated Fields
**Coda**: `Vollständiger Name`, `Personen` (lookup), `Button` fields
**Grist**: Recreate as Python formulas

### 3. Relations/Lookups
**Coda**: Automatic bidirectional relations
**Grist**: Need to explicitly set up Reference columns in both directions

### 4. Rich Text (Canvas)
**Coda**: Full rich text with formatting
**Grist**: Basic text field - may lose formatting

### 5. Images
**Coda**: Multiple images per field
**Grist**: Attachment column (supports multiple files)

### 6. Buttons
**Coda**: Custom actions (OpenWindow, etc.)
**Grist**: Recreate as:
  - Formula columns (for display)
  - Webhooks (for actions)
  - Custom widgets (for complex UI)

### 7. Self-Referential Relations
**Coda**: `Kreise` → `Übergeordneter Kreis` (same table)
**Grist**: Supported via self-referencing Reference column

---

## Priority Tables for Prototype

### Phase 1 (Essential)
1. **Organisationen** - Critical for Clockify integration
2. **Personen** - Core CRM functionality
3. **Produkte** - Invoicing integration

### Phase 2 (Important)
4. **Mailinglisten** - Email marketing
5. **Mailingliste-Personen** - Junction table
6. **Länder** - Reference data

### Phase 3 (Secondary)
7. **Kreise** - Organizational structure
8. **Rollen** - Role management
9. **Aufträge** - Order management
10. **Projekte** - Project tracking

---

## Integration Points

### Real-Time (Webhooks)
- **Organisationen** → Clockify (via n8n)
  - Fields monitored: `Status`, `Statusgrund`, `ClockifyID`

### Scheduled Sync
- **Personen + Mailinglisten** → Brevo
  - Fields: `E-Mail Adresse`, `Vorname`, `Nachname`
- **Produkte** → SevDesk
  - Fields: `Name`, `Preis`, `Steuersatz`, `Produktnummer`, `SevDeskID`
- **Kreise** → GitHub Pages (organigramm.json)
  - Fields: `Name`, `Zweck`, `Übergeordneter Kreis`

### On-Demand Sync
- **SevDesk** → Länder
  - Fields: `ISO 2`, `SevDeskID`

---

## Next Steps

1. ✅ Schema extracted
2. ⏭️ Set up Grist locally (Docker)
3. ⏭️ Create core tables in Grist
4. ⏭️ Import sample data
5. ⏭️ Test n8n integration
6. ⏭️ Configure row-level permissions
7. ⏭️ User validation

---

**Total Fields Across Core Tables**: ~70 columns
**Estimated Migration Time**: 6-8 hours for core tables
**Data Volume**: ~1,400 rows across all tables

---

## Schema Alignment: Matrix Room Structure

The **Kreise** table structure is mirrored in Matrix/Element room organization:

| Coda Kreis | Matrix Room |
|------------|-------------|
| Organisationsentwicklung | #kreis-od |
| Administration | #kreis-admin |
| Coaching | #kreis-coaching |
| Digitalisierung | #kreis-digi |

When Kreise are updated in the SSOT, the corresponding Matrix space structure should also be updated.

See: `architecture/02-application-layer/collaboration-capabilities/communication.md`
