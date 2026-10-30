(function() {
    window.SpaceGrimoire = window.SpaceGrimoire || {};
    var NS = window.SpaceGrimoire;

    // ============ NEMICI ============
    NS.ENEMIES = {
        star1: [
            { name: 'Drone Ostile',    hp: 6, damage: 1 },
            { name: 'Razr Alieno',     hp: 6, damage: 1 }
        ],
        star2: [
            { name: 'Guardiano Corazzato', hp: 8, damage: 2 },
            { name: 'Predatore Sintetico', hp: 8, damage: 2 }
        ]
    };

    // ============ DUNGEON ============
    NS.DUNGEONS = {
        1: { stars: 1, combats: 2, threshold: 3, credits: 10 },
        2: { stars: 2, combats: 3, threshold: 4, credits: 20 }
    };
})();
