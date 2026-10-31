(function() {
    window.SpaceGrimoire = window.SpaceGrimoire || {};
    var NS = window.SpaceGrimoire;

    // ---------- HELPER RENDER ----------
    function el(tag, className, text) {
        var e = document.createElement(tag);
        if (className) e.className = className;
        if (text !== undefined) e.textContent = text;
        return e;
    }

    function cardEffects(card) {
        var parts = [];
        if (card.damage) parts.push('⚔️' + card.damage);
        if (card.shield) parts.push('🛡️' + card.shield);
        if (card.movement !== undefined && card.movement !== null) parts.push('👟' + card.movement);
        if (card.draw) parts.push('🃏' + card.draw);
        return parts.join(' ');
    }

    function cardTypeClass(card, deckType) {
        if (deckType === 'movement') return 'movement';
        if (card.damage) return 'attack';
        if (card.shield) return 'defense';
        return 'utility';
    }

    function makeCard(card, deckType, onClick, disabled) {
        var c = el('div', 'card ' + cardTypeClass(card, deckType));
        if (disabled) c.classList.add('disabled');
        
        var name = el('div', 'card-name', card.name);
        var eff = el('div', 'card-effects', cardEffects(card));
        
        c.appendChild(name);
        c.appendChild(eff);
        c.title = card.name + ' [' + (card.slot || '') + ']';
        
        if (!disabled && onClick) c.addEventListener('click', onClick);
        return c;
    }

    // ---------- COMPONENTI ----------
    function renderHUD(s) {
        var hud = el('div', 'hud');
        hud.appendChild(el('div', 'hud-item', '❤️ ' + s.hearts));
        hud.appendChild(el('div', 'hud-item', '💳 ' + s.credits));
        if (s.dungeon) {
            hud.appendChild(el('div', 'hud-item', '⭐ ' + s.dungeon.starLevel + '★'));
            hud.appendChild(el('div', 'hud-item', 'Combattimento ' + (s.combatIndex + 1) + '/' + s.dungeon.combats));
        }
        return hud;
    }

    // ---------- SCHERMATE ----------
    function renderShip(s) {
        var wrap = el('div', 'screen ship');
        
        var header = el('div', 'ship-header');
        header.appendChild(el('h1', null, '🚀 Nave Spaziale'));
        
        var btnEquip = el('button', 'secondary-btn', '🎒 Equipaggiamento');
        btnEquip.addEventListener('click', function() {
            NS.Game.openEquipment();
            render();
        });
        header.appendChild(btnEquip);
        
        wrap.appendChild(header);
        wrap.appendChild(el('p', 'subtitle', 'Scegli la tua prossima destinazione.'));

        var dungeons = el('div', 'dungeon-list');
        [1, 2].forEach(function(star) {
            var d = NS.DUNGEONS[star];
            var cardEl = el('div', 'dungeon-card');
            cardEl.appendChild(el('div', 'dungeon-title', 'Dungeon ' + '⭐'.repeat(star)));
            cardEl.appendChild(el('div', 'dungeon-info', d.combats + ' combattimenti'));
            cardEl.appendChild(el('div', 'dungeon-info', 'Soglia movimento: ' + d.threshold));
            cardEl.appendChild(el('div', 'dungeon-reward', 'Ricompensa: 💳 ' + d.credits));
            
            cardEl.addEventListener('click', function() {
                NS.Game.enterDungeon(star);
                render();
            });
            dungeons.appendChild(cardEl);
        });
        wrap.appendChild(dungeons);
        return wrap;
    }

    function renderEquipment(s) {
        var wrap = el('div', 'screen equipment');
        wrap.appendChild(el('h1', null, '🎒 Equipaggiamento'));

        var grid = el('div', 'equipment-grid');

        NS.EQUIPMENT_SLOTS.forEach(function(slot) {
            var slotBox = el('div', 'equipment-slot');
            
            slotBox.appendChild(el('div', 'slot-name', slot.name));
            
            var info = el('div', 'slot-info');
            info.textContent = slot.combatCount + ' Combattimento / ' + slot.dungeonCount + ' Dungeon';
            slotBox.appendChild(info);

            var cardList = el('div', 'slot-cards');
            slot.cards.forEach(function(cardId) {
                // Trova la carta nel mazzo Combat
                var cCard = NS.COMBAT_CARDS.find(function(c) { return c.id === cardId; });
                if (cCard) {
                    var type = cCard.damage ? 'attack' : (cCard.shield ? 'defense' : 'utility');
                    var miniCard = el('div', 'mini-card ' + type);
                    miniCard.innerHTML = '<strong>' + cCard.name + '</strong><div class="mini-effects">' + cardEffects(cCard) + '</div>';
                    cardList.appendChild(miniCard);
                }

                // Trova la carta nel mazzo Dungeon
                var dCard = NS.DUNGEON_CARDS.find(function(c) { return c.id === cardId; });
                if (dCard) {
                    var miniCard = el('div', 'mini-card movement');
                    miniCard.innerHTML = '<strong>' + dCard.name + '</strong><div class="mini-effects">' + cardEffects(dCard) + '</div>';
                    cardList.appendChild(miniCard);
                }
            });
            slotBox.appendChild(cardList);

            grid.appendChild(slotBox);
        });

        wrap.appendChild(grid);

        var btnBack = el('button', 'primary-btn', 'Torna alla nave');
        btnBack.addEventListener('click', function() {
            NS.Game.closeEquipment();
            render();
        });
        wrap.appendChild(btnBack);

        return wrap;
    }

    function renderMovement(s) {
        var wrap = el('div', 'screen movement');
        wrap.appendChild(el('h2', null, '🗺️ Settore ' + (s.combatIndex + 1) + '/' + s.dungeon.combats));
        wrap.appendChild(el('p', 'subtitle', 'Serve ' + s.dungeon.threshold + ' movimento — totale: ' + s.mSum + ' / ' + s.dungeon.threshold));

        var handWrap = el('div', 'hand');
        if (s.mHand.length === 0) {
            handWrap.appendChild(el('div', 'empty', '(mano vuota)'));
        }
        s.mHand.forEach(function(card, idx) {
            handWrap.appendChild(makeCard(card, 'movement', function() {
                NS.Game.playMovementCard(idx);
                render();
            }, false));
        });
        wrap.appendChild(handWrap);

        var btn = el('button', 'primary-btn', 'Avanzа al combattimento');
        btn.disabled = !NS.Game.canAdvanceMovement();
        btn.addEventListener('click', function() {
            if (!NS.Game.canAdvanceMovement()) return;
            NS.Game.advanceToCombat();
            render();
        });
        wrap.appendChild(btn);
        return wrap;
    }

    function renderCombat(s) {
        var wrap = el('div', 'screen combat');

        var enemyBox = el('div', 'enemy-box');
        enemyBox.appendChild(el('div', 'enemy-name', '👾 ' + s.enemy.name));
        enemyBox.appendChild(el('div', 'enemy-hp', 'PV: ' + s.enemy.hp + ' / ' + s.enemy.maxHp + ' — Danno: ' + s.enemy.damage));
        wrap.appendChild(enemyBox);

        var stats = el('div', 'combat-stats');
        stats.appendChild(el('div', 'stat', '❤️ PV: ' + s.playerHP + ' / ' + NS.CONSTANTS.PLAYER_MAX_HP));
        stats.appendChild(el('div', 'stat', '🛡️ Scudo: ' + s.playerShield));
        stats.appendChild(el('div', 'stat', '🔄 Turno: ' + (s.turn + 1)));
        stats.appendChild(el('div', 'stat', '🎴 Giocate: ' + s.playedThisTurn + ' / ' + s.playLimit));
        wrap.appendChild(stats);

        var handWrap = el('div', 'hand');
        if (s.cHand.length === 0) {
            handWrap.appendChild(el('div', 'empty', '(mano vuota)'));
        }
        var canPlay = NS.Game.canPlayCard();
        s.cHand.forEach(function(card, idx) {
            handWrap.appendChild(makeCard(card, 'combat', function() {
                NS.Game.playCombatCard(idx);
                render();
            }, !canPlay));
        });
        wrap.appendChild(handWrap);

        var btn = el('button', 'primary-btn', 'Termina turno');
        btn.addEventListener('click', function() {
            NS.Game.endTurn();
            render();
        });
        wrap.appendChild(btn);
        return wrap;
    }

    function renderGameOver(s) {
        var wrap = el('div', 'screen gameover');
        wrap.appendChild(el('h1', null, '💀 Run terminata'));
        wrap.appendChild(el('p', null, 'Hai esaurito i cuori. I crediti raccolti sono persi nel vuoto.'));
        var btn = el('button', 'primary-btn', 'Ricomincia da capo');
        btn.addEventListener('click', function() {
            NS.Game.startGame(); 
        });
        wrap.appendChild(btn);
        return wrap;
    }

    function renderVictory(s) {
        var wrap = el('div', 'screen victory');
        wrap.appendChild(el('h1', null, '✨ Dungeon completato'));
        wrap.appendChild(el('p', null, 'Crediti guadagnati: 💳 ' + s.dungeon.credits));
        wrap.appendChild(el('p', null, 'Crediti totali: 💳 ' + s.credits));
        var btn = el('button', 'primary-btn', 'Torna alla nave');
        btn.addEventListener('click', function() {
            NS.Game.leaveVictoryScreen();
            render();
        });
        wrap.appendChild(btn);
        return wrap;
    }

    // ---------- RENDER PRINCIPALE ----------
    function render() {
        var s = NS.Game.state;
        var app = document.getElementById('app');
        app.innerHTML = '';

        var container = el('div', 'container');
        container.appendChild(renderHUD(s));

        var screen;
        switch (s.screen) {
            case 'ship':      screen = renderShip(s); break;
            case 'equipment': screen = renderEquipment(s); break;
            case 'movement':  screen = renderMovement(s); break;
            case 'combat':    screen = renderCombat(s); break;
            case 'gameover':  screen = renderGameOver(s); break;
            case 'victory':   screen = renderVictory(s); break;
            default:          screen = el('div', null, 'Schermata sconosciuta: ' + s.screen);
        }
        container.appendChild(screen);

        app.appendChild(container);
    }

    NS.UI = {
        render: render
    };
})();
