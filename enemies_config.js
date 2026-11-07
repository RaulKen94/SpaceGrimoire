(function() {
    window.SpaceGrimoire = window.SpaceGrimoire || {};
    var NS = window.SpaceGrimoire;

    // ============ NEMICI ============
    NS.ENEMIES = {
        star1: [
            { id: 'drone_ostile',        name: 'Drone Ostile',        hp: 6, damage: 1, icon: 'ri-radar-line',    type: 'Sonda Ricognitrice' },
            { id: 'razr_alieno',         name: 'Razr Alieno',         hp: 6, damage: 1, icon: 'ri-aliens-fill',   type: 'Forma Astrale Ostile' }
        ],
        star2: [
            { id: 'guardiano_corazzato', name: 'Guardiano Corazzato', hp: 8, damage: 2, icon: 'ri-robot-2-fill',  type: 'Costrutto Difensivo Pesante' },
            { id: 'predatore_sintetico', name: 'Predatore Sintetico', hp: 8, damage: 2, icon: 'ri-bug-2-line',   type: 'Droide Cacciatore Rapido' }
        ]
    };

    // ============ DUNGEON ============
    NS.DUNGEONS = {
        1: { stars: 1, combats: 2, threshold: 3, credits: 10 },
        2: { stars: 2, combats: 3, threshold: 4, credits: 20 }
    };
})();