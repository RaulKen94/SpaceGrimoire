(function() {
    window.SpaceGrimoire = window.SpaceGrimoire || {};
    var NS = window.SpaceGrimoire;

    // Avvia la partita al caricamento del DOM
    document.addEventListener('DOMContentLoaded', function() {
        NS.Game.startGame();
    });
})();
