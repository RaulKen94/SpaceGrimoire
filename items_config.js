(function() {
    window.SpaceGrimoire = window.SpaceGrimoire || {};
    var NS = window.SpaceGrimoire;

    // ============ SLOT EQUIPAGGIAMENTO ============
    NS.EQUIPMENT_SLOTS = [
        { id: 'casco',     name: 'Casco Spaziale',  combatCount: 1, dungeonCount: 2, cards: ['mira_assistita', 'ricognizione', 'scanner'] },
        { id: 'tuta',      name: 'Tuta Spaziale',   combatCount: 2, dungeonCount: 1, cards: ['parata', 'scudo_energetico', 'marcia'] },
        { id: 'fucile',    name: 'Fucile',          combatCount: 4, dungeonCount: 0, cards: ['colpo_perforante', 'raffica', 'precisione', 'colpo_potente'] },
        { id: 'pistola',   name: 'Pistola',         combatCount: 2, dungeonCount: 2, cards: ['colpo_rapido', 'colpo_doppio', 'segnalatore', 'raffica_copertura'] },
        { id: 'stivali',   name: 'Stivali Spaziali',combatCount: 0, dungeonCount: 4, cards: ['passo', 'corsa', 'sprint', 'passo_furtivo'] },
        { id: 'trinket_a', name: 'Trinket A',       combatCount: 1, dungeonCount: 1, cards: ['surriscaldamento', 'condotto'] },
        { id: 'trinket_b', name: 'Trinket B',       combatCount: 1, dungeonCount: 1, cards: ['ricarica', 'deviazione'] },
        { id: 'trinket_c', name: 'Trinket C',       combatCount: 1, dungeonCount: 0, cards: ['overclock'] },
        { id: 'trinket_d', name: 'Trinket D',       combatCount: 0, dungeonCount: 1, cards: ['salto'] }
    ];

    // Funzione per estrarre le carte di default in base agli slot vuoti
    // In futuro, questa funzione leggerà gli oggetti effettivamente equipaggiati
    function getDefaultDecks() {
        var combatDeck = [];
        var dungeonDeck = [];

        NS.EQUIPMENT_SLOTS.forEach(function(slot) {
            slot.cards.forEach(function(cardId) {
                // Cerca la carta nel mazzo combat
                var cCard = NS.COMBAT_CARDS.find(function(c) { return c.id === cardId; });
                if (cCard) combatDeck.push(cCard);

                // Cerca la carta nel mazzo dungeon
                var dCard = NS.DUNGEON_CARDS.find(function(c) { return c.id === cardId; });
                if (dCard) dungeonDeck.push(dCard);
            });
        });

        return {
            combat: combatDeck,
            dungeon: dungeonDeck
        };
    }

    NS.Items = {
        getDefaultDecks: getDefaultDecks
    };
})();
