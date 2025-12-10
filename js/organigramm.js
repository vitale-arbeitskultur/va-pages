/**
 * Interaktives Organigramm für Vitale Arbeitskultur
 * Verwendet Cytoscape.js für die Visualisierung
 */

// Lade die Organigramm-Daten und initialisiere die Visualisierung
async function initOrganigramm() {
    try {
        // Lade JSON-Daten
        const response = await fetch('data/organigramm.json');
        const data = await response.json();

        // Erstelle Cytoscape-Elemente
        const elements = createCytoscapeElements(data);

        // Initialisiere Cytoscape
        const cy = cytoscape({
            container: document.getElementById('organigramm-container'),

            elements: elements,

            style: [
                // Stil für Kreise (soziokratische Kreise)
                {
                    selector: 'node.kreis',
                    style: {
                        'background-color': 'white',
                        'border-width': 8,
                        'border-color': '#EFB708', // var(--color-brand-primary)
                        'width': 300,
                        'height': 300,
                        'label': 'data(label)',
                        'text-valign': 'top',
                        'text-margin-y': -140,
                        'font-size': '16px',
                        'font-weight': '500',
                        'color': '#606060',
                        'text-wrap': 'wrap',
                        'text-max-width': 250
                    }
                },

                // Stil für Rollen (rote Kreise)
                {
                    selector: 'node.rolle',
                    style: {
                        'background-color': '#A63634', // var(--color-brand-accent)
                        'width': 60,
                        'height': 60,
                        'label': 'data(label)',
                        'text-valign': 'center',
                        'font-size': '11px',
                        'font-weight': '500',
                        'color': 'white',
                        'text-wrap': 'wrap',
                        'text-max-width': 55,
                        'transition-property': 'background-color, width, height',
                        'transition-duration': '0.3s'
                    }
                },

                // Hover-Effekt für Rollen
                {
                    selector: 'node.rolle:active',
                    style: {
                        'background-color': '#21474D', // var(--color-brand-secondary)
                        'width': 70,
                        'height': 70
                    }
                },

                // Stil für Link-Indikatoren
                {
                    selector: 'node.link-indicator',
                    style: {
                        'background-color': '#A63634',
                        'width': 40,
                        'height': 40,
                        'label': 'data(label)',
                        'text-valign': 'center',
                        'font-size': '10px',
                        'font-weight': '500',
                        'color': 'white',
                        'text-wrap': 'wrap',
                        'text-max-width': 38
                    }
                },

                // Stil für Kanten (Verbindungen)
                {
                    selector: 'edge',
                    style: {
                        'width': 0, // Keine sichtbaren Verbindungslinien
                        'opacity': 0
                    }
                },

                // Hauptkreis (äußerer Kreis)
                {
                    selector: 'node.hauptkreis',
                    style: {
                        'background-color': 'transparent',
                        'border-width': 8,
                        'border-color': '#EFB708',
                        'width': 900,
                        'height': 900,
                        'label': 'data(label)',
                        'text-valign': 'top',
                        'text-margin-y': -460,
                        'font-size': '18px',
                        'font-weight': '500',
                        'color': '#606060'
                    }
                }
            ],

            layout: {
                name: 'concentric', // Konzentrische Kreise
                concentric: function(node) {
                    // Link-Indikatoren ganz oben (Ebene 0)
                    if (node.hasClass('link-indicator')) return 0;
                    // Hauptkreis in der Mitte (Ebene 1)
                    if (node.hasClass('hauptkreis')) return 1;
                    // Kreise ohne Parent (Root-Ebene) → Ebene 2
                    if (node.hasClass('kreis') && !node.data('parent')) return 2;
                    // Kreise mit Parent (Sub-Ebene) → Ebene 3
                    if (node.hasClass('kreis') && node.data('parent')) return 3;
                    // Rollen → Ebene 4 (nah an ihrem Kreis)
                    return 4;
                },
                levelWidth: function(nodes) {
                    return 2;
                },
                minNodeSpacing: 120,
                animate: true,
                animationDuration: 500,
                avoidOverlap: true,
                spacingFactor: 1.5
            },

            // Interaktions-Einstellungen
            userZoomingEnabled: true,
            userPanningEnabled: true,
            boxSelectionEnabled: false,
            autounselectify: true,
            minZoom: 0.5,
            maxZoom: 2
        });

        // Füge Interaktivität hinzu
        addInteractivity(cy, data);

        // Info-Panel mit Daten füllen
        updateInfoPanel(data);

    } catch (error) {
        console.error('Fehler beim Laden des Organigramms:', error);
        document.getElementById('organigramm-container').innerHTML =
            '<p style="text-align: center; padding: 2rem; color: #A63634;">Fehler beim Laden des Organigramms. Bitte laden Sie die Seite neu.</p>';
    }
}

/**
 * Erstelle Cytoscape-Elemente aus JSON-Daten
 * Verwendet hierarchische Struktur ohne feste Positionen
 */
function createCytoscapeElements(data) {
    const elements = [];

    // Hauptkreis (äußerer Kreis)
    elements.push({
        data: {
            id: 'hauptkreis',
            label: data.organisation.name,
            type: 'hauptkreis'
        },
        classes: 'hauptkreis'
    });

    // Link-Indikatoren
    if (data.organisation.links) {
        data.organisation.links.forEach((link, index) => {
            elements.push({
                data: {
                    id: `link-${index}`,
                    label: link.name,
                    type: 'link'
                },
                classes: 'link-indicator'
            });
        });
    }

    // Kreise und ihre Rollen
    data.kreise.forEach((kreis) => {
        // Kreis-Node
        elements.push({
            data: {
                id: kreis.id,
                label: kreis.name,
                type: 'kreis',
                fullName: kreis.name,
                zweck: kreis.zweck,
                parent: kreis.parent || null // Hierarchie!
            },
            classes: 'kreis'
        });

        // Rollen innerhalb des Kreises
        kreis.rollen.forEach((rolle) => {
            elements.push({
                data: {
                    id: rolle.id,
                    label: rolle.name,
                    type: 'rolle',
                    kreisId: kreis.id // Zuordnung zum Kreis
                },
                classes: 'rolle'
            });

            // Kante: Rolle → Kreis (für Layout)
            elements.push({
                data: {
                    id: `edge-${rolle.id}-${kreis.id}`,
                    source: rolle.id,
                    target: kreis.id
                }
            });
        });
    });

    return elements;
}

/**
 * Füge Interaktivität hinzu
 */
function addInteractivity(cy, data) {
    // Rolle anklicken - zeige Details
    cy.on('tap', 'node.rolle', function(evt) {
        const node = evt.target;
        const rolleName = node.data('label');

        // Finde Kreis und Rolle
        let kreisName = '';
        let rolleBeschreibung = '';

        data.kreise.forEach(kreis => {
            const rolle = kreis.rollen.find(r => r.id === node.data('id'));
            if (rolle) {
                kreisName = kreis.name;
                // Hier könnte man Beschreibungen aus der JSON hinzufügen
            }
        });

        showRolleDetails(rolleName, kreisName);
    });

    // Kreis anklicken - zeige alle Rollen
    cy.on('tap', 'node.kreis', function(evt) {
        const node = evt.target;
        const kreisId = node.data('id');
        const kreisName = node.data('fullName');

        const kreis = data.kreise.find(k => k.id === kreisId);
        if (kreis) {
            showKreisDetails(kreis);
        }
    });

    // Tooltip bei Hover
    cy.on('mouseover', 'node', function(evt) {
        const node = evt.target;
        const type = node.data('type');

        if (type === 'rolle' || type === 'kreis') {
            document.body.style.cursor = 'pointer';
        }
    });

    cy.on('mouseout', 'node', function(evt) {
        document.body.style.cursor = 'default';
    });
}

/**
 * Zeige Details einer Rolle
 */
function showRolleDetails(rolleName, kreisName) {
    const detailsDiv = document.getElementById('rolle-details');
    detailsDiv.innerHTML = `
        <h3 style="color: var(--color-brand-accent); margin-bottom: 0.5rem;">${rolleName}</h3>
        <p style="color: var(--color-neutral-gray); font-size: var(--font-size-sm);">
            <strong>Kreis:</strong> ${kreisName}
        </p>
        <p style="margin-top: 1rem; font-size: var(--font-size-sm);">
            Klicken Sie auf einen Kreis, um alle Rollen zu sehen.
        </p>
    `;
    detailsDiv.style.display = 'block';
}

/**
 * Zeige Details eines Kreises
 */
function showKreisDetails(kreis) {
    const detailsDiv = document.getElementById('rolle-details');
    const rollenListe = kreis.rollen.map(r => `<li>${r.name}</li>`).join('');

    detailsDiv.innerHTML = `
        <h3 style="color: var(--color-brand-primary); margin-bottom: 0.5rem;">${kreis.name}</h3>
        ${kreis.zweck ? `<p style="font-size: var(--font-size-sm); color: var(--color-neutral-gray); margin-bottom: 1rem;"><strong>Zweck:</strong> ${kreis.zweck}</p>` : ''}
        <p style="font-size: var(--font-size-sm); margin-bottom: 0.5rem;">
            <strong>Rollen in diesem Kreis:</strong>
        </p>
        <ul style="font-size: var(--font-size-sm); list-style-position: inside;">
            ${rollenListe}
        </ul>
    `;
    detailsDiv.style.display = 'block';
}

/**
 * Update Info-Panel mit Statistiken
 */
function updateInfoPanel(data) {
    const totalKreise = data.kreise.length;
    const totalRollen = data.kreise.reduce((sum, kreis) => sum + kreis.rollen.length, 0);

    const statsDiv = document.getElementById('org-stats');
    if (statsDiv) {
        statsDiv.innerHTML = `
            <div style="display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
                <div style="text-align: center;">
                    <div style="font-size: var(--font-size-xl); font-weight: var(--font-weight-ultra-bold); color: var(--color-brand-primary);">
                        ${totalKreise}
                    </div>
                    <div style="font-size: var(--font-size-sm); color: var(--color-neutral-gray);">
                        Kreise
                    </div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: var(--font-size-xl); font-weight: var(--font-weight-ultra-bold); color: var(--color-brand-accent);">
                        ${totalRollen}
                    </div>
                    <div style="font-size: var(--font-size-sm); color: var(--color-neutral-gray);">
                        Rollen
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialisiere beim Laden der Seite
document.addEventListener('DOMContentLoaded', initOrganigramm);
