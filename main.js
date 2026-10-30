(function() {
    window.SpaceGrimoire = window.SpaceGrimoire || {};
    var NS = window.SpaceGrimoire;

    // ---------- AVVIO ----------
    document.addEventListener('DOMContentLoaded', function() {
        // Inizializza lo stato del gioco
        NS.Game.startGame();
        
        // Disegna la prima schermata
        NS.UI.render();
    });
})();
