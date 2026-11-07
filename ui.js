(function() {
    window.SpaceGrimoire = window.SpaceGrimoire || {};
    var NS = window.SpaceGrimoire;

    // ---------- SET ICONE SVG VETTORIALI ----------
    var ICONS = {
        heart: '<svg class="sg-icon icon-heart" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        credit: '<svg class="sg-icon icon-credit" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="12 6 15 12 12 18 9 12" fill="currentColor"/></svg>',
        shield: '<svg class="sg-icon icon-shield" viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>',
        sword: '<svg class="sg-icon icon-sword" viewBox="0 0 24 24"><path d="M6.92 5L5 6.92l4.89 4.89-3.8 3.8L4.5 14.03l-2.12 2.12 3.54 3.54 2.12-2.12-1.58-1.59 3.8-3.8 4.89 4.89 1.92-1.92L6.92 5zM19.07 4.93a1 1 0 0 0-1.41 0l-5.66 5.66 1.41 1.41 5.66-5.66a1 1 0 0 0 0-1.41z"/></svg>',
        movement: '<svg class="sg-icon icon-movement" viewBox="0 0 24 24"><path d="M13.5 2l-6 11h5l-2 9 8-12h-5.5l2.5-8z"/></svg>',
        draw: '<svg class="sg-icon icon-draw" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        backpack: '<svg class="sg-icon icon-backpack" viewBox="0 0 24 24"><path d="M17 6h-2V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3zm-6-2h2v2h-2V4z"/></svg>',
        star: '<svg class="sg-icon icon-star" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        enemy: '<svg class="sg-icon icon-enemy" viewBox="0 0 24 24"><path d="M12 2a9 9 0 0 0-9 9c0 3.57 2.08 6.66 5.1 8.13V21a1 1 0 0 0 1 1h5.8a1 1 0 0 0 1-1v-1.87A9.004 9.004 0 0 0 21 11a9 9 0 0 0-9-9zm-3.5 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/></svg>',
        ship: '<svg class="sg-icon icon-ship" viewBox="0 0 24 24"><path d="M12 2L9 8h6l-3-6zm-1 7H7l-3 6 3 1 2-2v4l3 3 3-3v-4l2 2 3-1-3-6h-4V9z"/></svg>',
        shop: '<svg class="sg-icon icon-shop" viewBox="0 0 24 24"><path d="M4 4h16l-2 9H6L4 4zm2 11h12v2H6v-2zm2 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm8 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/></svg>'
    };

    function icon(name) {
        return ICONS[name] || '';
    }

    // ---------- HELPER RENDER ----------
    function el(tag, className, text) {
        var e = document.createElement(tag);
        if (className) e.className = className;
        if (text !== undefined && text !== null) e.textContent = text;
        return e;
    }

    function cardEffectsHTML(card) {
        var parts = [];
        if (card.damage) parts.push('<span class="effect-badge effect-damage">' + icon('sword') + ' ' + card.damage + ' Danno</span>');
        if (card.shield) parts.push('<span class="effect-badge effect-shield">' + icon('shield') + ' ' + card.shield + ' Scudo</span>');
        if (card.movement !== undefined && card.movement !== null) parts.push('<span class="effect-badge effect-movement">' + icon('movement') + ' ' + card.movement + ' Mov</span>');
        if (card.draw) parts.push('<span class="effect-badge effect-draw">' + icon('draw') + ' +' + card.draw + ' Pesca</span>');
        return parts.join(' ');
    }

    function cardTypeClass(card, deckType) {
        if (deckType === 'movement') return 'movement';
        if (card.damage) return 'attack';
        if (card.shield) return 'defense';
        return 'utility';
    }

    function makeCard(card, deckType, onClick, disabled, index) {
        var c = el('div', 'card ' + cardTypeClass(card, deckType));
        if (disabled) c.classList.add('disabled');

        // Animazione di Pescata (Card Draw)
        c.classList.add('card-enter');
        if (typeof index === 'number') {
            c.style.animationDelay = (index * 0.06) + 's';
        }

        var typeIcon = card.damage ? icon('sword') : (card.shield ? icon('shield') : (card.movement ? icon('movement') : icon('draw')));
        
        c.innerHTML = 
            '<div class="card-inner-frame">' +
                '<div class="card-header">' +
                    '<span class="card-type-icon">' + typeIcon + '</span>' +
                    '<span class="card-name">' + card.name + '</span>' +
                '</div>' +
                '<div class="card-art">' +
                    '<div class="card-art-glyph">' + typeIcon + '</div>' +
                '</div>' +
                '<div class="card-effects">' + cardEffectsHTML(card) + '</div>' +
                '<div class="card-footer">' + (card.slot ? '<span class="slot-badge">' + card.slot + '</span>' : '') + '</div>' +
            '</div>';
        
        c.title = card.name + ' [' + (card.slot || '') + ']';
        if (!disabled && onClick) {
            c.addEventListener('click', function() {
                // Animazione di Giocata (Card Play)
                c.classList.add('card-play-anim');
                setTimeout(function() {
                    onClick();
                }, 160);
            });
        }
        return c;
    }

    // ---------- COMPONENTI ----------
    function renderHUD(s) {
        var hud = el('div', 'hud');
        var maxH = NS.CONSTANTS.MAX_HEARTS || NS.CONSTANTS.STARTING_HEARTS;
        
        var heartsEl = el('div', 'hud-item hud-hearts');
        heartsEl.innerHTML = icon('heart') + ' <span>' + s.hearts + ' / ' + maxH + '</span>';
        hud.appendChild(heartsEl);

        var creditsEl = el('div', 'hud-item hud-credits');
        creditsEl.innerHTML = icon('credit') + ' <span>' + s.credits + '</span>';
        hud.appendChild(creditsEl);

        // Info Zaino
        var backpackItemsText = s.backpack.map(function(b) { return b.name; }).join(', ') || 'Vuoto';
        var bpEl = el('div', 'hud-item hud-backpack');
        bpEl.innerHTML = icon('backpack') + ' <span>' + s.backpack.length + '/' + s.backpackCapacity + '</span>';
        bpEl.title = 'Zaino: ' + backpackItemsText;
        hud.appendChild(bpEl);
        
        if (s.dungeon) {
            var dungEl = el('div', 'hud-item hud-dungeon-star');
            dungEl.innerHTML = icon('star') + ' <span>Settore ' + s.dungeon.starLevel + '★</span>';
            hud.appendChild(dungEl);

            var combEl = el('div', 'hud-item hud-combat-counter');
            combEl.textContent = 'Incontro ' + (s.combatIndex + 1) + '/' + s.dungeon.combats;
            hud.appendChild(combEl);
            
            // Contatori Mazzo e Scarti con icone
            var mCountEl = el('div', 'hud-item hud-deck-counter');
            mCountEl.innerHTML = icon('movement') + ' M: ' + s.mDeck.length + ' | S: ' + s.mDiscard.length;
            hud.appendChild(mCountEl);

            var cCountEl = el('div', 'hud-item hud-deck-counter');
            cCountEl.innerHTML = icon('sword') + ' M: ' + s.cDeck.length + ' | S: ' + s.cDiscard.length;
            hud.appendChild(cCountEl);
        }
        return hud;
    }

    // ---------- SCHERMATE ----------
    function renderShip(s) {
        var wrap = el('div', 'screen ship');
        
        var header = el('div', 'screen-header');
        header.innerHTML = '<h1>' + icon('ship') + ' Grimorio Stellare - Plancia</h1><p class="subtitle">Canalizza l\'energia della nave ed esplora i settori dimensionali ostili.</p>';
        wrap.appendChild(header);
        
        var navBar = el('div', 'ship-actions');
        
        var btnEquip = el('button', 'secondary-btn');
        btnEquip.innerHTML = icon('backpack') + ' Equipaggiamento Componenti';
        btnEquip.addEventListener('click', function() {
            NS.Game.openEquipment();
            render();
        });
        navBar.appendChild(btnEquip);

        var btnShop = el('button', 'secondary-btn shop-nav-btn');
        btnShop.innerHTML = icon('shop') + ' Hangar & Reparto Medico';
        btnShop.addEventListener('click', function() {
            NS.Game.openShop();
            render();
        });
        navBar.appendChild(btnShop);

        wrap.appendChild(navBar);

        // Se hai oggetti nello zaino, mostra un riepilogo
        if (s.backpack.length > 0) {
            var activePassives = el('div', 'ship-passives-banner');
            activePassives.innerHTML = '<strong>Reliquie Attive:</strong> ' + s.backpack.map(function(it) {
                return '<span class="passive-tag" title="' + it.description + '">' + it.icon + ' ' + it.name + '</span>';
            }).join(' ');
            wrap.appendChild(activePassives);
        }

        var dungeons = el('div', 'dungeon-list');
        [1, 2].forEach(function(star) {
            var d = NS.DUNGEONS[star];
            var cardEl = el('div', 'dungeon-card');
            
            var starsHTML = '';
            for (var i = 0; i < star; i++) starsHTML += icon('star');

            cardEl.innerHTML = 
                '<div class="dungeon-header">' +
                    '<div class="dungeon-title">Portale Settore ' + starsHTML + '</div>' +
                '</div>' +
                '<div class="dungeon-info">' + d.combats + ' Guardiani Ostili</div>' +
                '<div class="dungeon-info">Soglia Movimento Richiesta: ' + d.threshold + '</div>' +
                '<div class="dungeon-reward">' + icon('credit') + ' Ricompensa: ' + d.credits + (NS.Game.hasItem('scanner_minerario') ? ' (+5 Bonus Scanner)' : '') + '</div>';
            
            cardEl.addEventListener('click', function() {
                NS.Game.enterDungeon(star);
                render();
            });
            dungeons.appendChild(cardEl);
        });
        wrap.appendChild(dungeons);
        return wrap;
    }

    function renderShop(s) {
        var wrap = el('div', 'screen shop');
        
        var header = el('div', 'screen-header');
        header.innerHTML = '<h1>' + icon('shop') + ' Hangar di Rifornimento</h1><p class="subtitle">Ripristina l\'essenza vitale della nave e installa moduli passivi runici.</p>';
        wrap.appendChild(header);

        // Sezione Infermeria
        var infirmary = el('div', 'shop-section');
        infirmary.innerHTML = '<h3 class="shop-section-title">' + icon('heart') + ' Reparto Medico e Rigenerazione</h3>';
        
        var maxH = NS.CONSTANTS.MAX_HEARTS || NS.CONSTANTS.STARTING_HEARTS;
        var healBox = el('div', 'heal-box');
        healBox.innerHTML = '<div class="heal-status">Integrità Vitale: <strong>' + s.hearts + ' / ' + maxH + '</strong> ' + icon('heart') + '<div class="heal-sub">Tributo per cuore: ' + NS.CONSTANTS.HEART_HEAL_COST + ' ' + icon('credit') + '</div></div>';

        var healBtn = el('button', 'primary-btn heal-btn');
        if (s.hearts >= maxH) {
            healBtn.textContent = 'Integrità al Massimo';
            healBtn.disabled = true;
            healBtn.classList.add('disabled');
        } else if (s.credits < NS.CONSTANTS.HEART_HEAL_COST) {
            healBtn.textContent = 'Crediti Insufficienti';
            healBtn.disabled = true;
            healBtn.classList.add('disabled');
        } else {
            healBtn.innerHTML = 'Rigenera 1 Cuore (' + NS.CONSTANTS.HEART_HEAL_COST + ' ' + icon('credit') + ')';
            healBtn.addEventListener('click', function() {
                if (NS.Game.buyHeart()) render();
            });
        }
        healBox.appendChild(healBtn);
        infirmary.appendChild(healBox);
        wrap.appendChild(infirmary);

        // Sezione Zaino Attuale
        var backpackSection = el('div', 'shop-section');
        backpackSection.innerHTML = '<h3 class="shop-section-title">' + icon('backpack') + ' Reliquie Incise nello Zaino (' + s.backpack.length + '/' + s.backpackCapacity + ')</h3>';
        
        var backpackGrid = el('div', 'backpack-slots-grid');
        for (var i = 0; i < s.backpackCapacity; i++) {
            var item = s.backpack[i];
            var slotEl = el('div', 'backpack-slot-card ' + (item ? 'filled' : 'empty'));
            if (item) {
                slotEl.innerHTML = 
                    '<div class="item-icon">' + item.icon + '</div>' +
                    '<div class="item-name">' + item.name + '</div>' +
                    '<div class="item-desc">' + item.description + '</div>';
            } else {
                slotEl.innerHTML = '<div class="empty-slot-text">Alloggiamento Libero</div>';
            }
            backpackGrid.appendChild(slotEl);
        }
        backpackSection.appendChild(backpackGrid);
        wrap.appendChild(backpackSection);

        // Sezione Oggetti Passivi in Vendita
        var itemsSection = el('div', 'shop-section');
        itemsSection.innerHTML = 
            '<h3 class="shop-section-title">Moduli Arcani Disponibili</h3>' +
            '<p class="shop-desc">I moduli passivi rimangono incastonati nello zaino e attivano benedizioni automatiche durante i viaggi.</p>';

        var itemsGrid = el('div', 'shop-items-grid');
        (NS.PASSIVE_ITEMS || []).forEach(function(item) {
            var owned = NS.Game.hasItem(item.id);
            var itemCard = el('div', 'shop-item-card ' + (owned ? 'owned' : ''));

            var headerEl = el('div', 'shop-item-header');
            headerEl.innerHTML = '<span class="item-icon">' + item.icon + '</span><span class="item-name">' + item.name + '</span>';
            itemCard.appendChild(headerEl);

            itemCard.appendChild(el('div', 'item-desc', item.description));

            var footerEl = el('div', 'shop-item-footer');
            footerEl.innerHTML = '<div class="item-price">' + icon('credit') + ' ' + item.cost + '</div>';

            var buyBtn = el('button', 'secondary-btn shop-buy-btn');
            if (owned) {
                buyBtn.textContent = 'Incastonato ✓';
                buyBtn.disabled = true;
                buyBtn.classList.add('disabled');
            } else if (s.backpack.length >= s.backpackCapacity) {
                buyBtn.textContent = 'Zaino Colmo';
                buyBtn.disabled = true;
                buyBtn.classList.add('disabled');
            } else if (s.credits < item.cost) {
                buyBtn.textContent = 'Fondi Insufficienti';
                buyBtn.disabled = true;
                buyBtn.classList.add('disabled');
            } else {
                buyBtn.innerHTML = 'Acquista (' + item.cost + ' ' + icon('credit') + ')';
                buyBtn.addEventListener('click', function() {
                    if (NS.Game.buyItem(item.id)) render();
                });
            }
            footerEl.appendChild(buyBtn);
            itemCard.appendChild(footerEl);

            itemsGrid.appendChild(itemCard);
        });
        itemsSection.appendChild(itemsGrid);
        wrap.appendChild(itemsSection);

        // Pulsante Torna alla Nave
        var btnBack = el('button', 'primary-btn back-ship-btn', '← Ritorna alla Plancia');
        btnBack.addEventListener('click', function() {
            NS.Game.closeShop();
            render();
        });
        wrap.appendChild(btnBack);

        return wrap;
    }

    function renderEquipment(s) {
        var wrap = el('div', 'screen equipment');
        
        var header = el('div', 'screen-header');
        header.innerHTML = '<h1>' + icon('backpack') + ' Componenti del Grimorio</h1><p class="subtitle">Ogni reliquia equipaggiata modella la sequenza delle tue carte.</p>';
        wrap.appendChild(header);

        var grid = el('div', 'equipment-grid');

        NS.EQUIPMENT_SLOTS.forEach(function(slot) {
            var slotBox = el('div', 'equipment-slot');
            
            slotBox.appendChild(el('div', 'slot-name', slot.name));
            
            var info = el('div', 'slot-info');
            info.innerHTML = 'Combattimento: ' + slot.combatCount + ' | Movimento: ' + slot.dungeonCount;
            slotBox.appendChild(info);

            var cardList = el('div', 'slot-cards');
            slot.cards.forEach(function(cardId) {
                var cCard = NS.COMBAT_CARDS.find(function(c) { return c.id === cardId; });
                if (cCard) {
                    var type = cCard.damage ? 'attack' : (cCard.shield ? 'defense' : 'utility');
                    var miniCard = el('div', 'mini-card ' + type);
                    miniCard.innerHTML = '<div class="mini-title">' + cCard.name + '</div><div class="mini-effects">' + cardEffectsHTML(cCard) + '</div>';
                    cardList.appendChild(miniCard);
                }

                var dCard = NS.DUNGEON_CARDS.find(function(c) { return c.id === cardId; });
                if (dCard) {
                    var miniCard = el('div', 'mini-card movement');
                    miniCard.innerHTML = '<div class="mini-title">' + dCard.name + '</div><div class="mini-effects">' + cardEffectsHTML(dCard) + '</div>';
                    cardList.appendChild(miniCard);
                }
            });
            slotBox.appendChild(cardList);

            grid.appendChild(slotBox);
        });

        wrap.appendChild(grid);

        var btnBack = el('button', 'primary-btn back-ship-btn', '← Ritorna alla Plancia');
        btnBack.addEventListener('click', function() {
            NS.Game.closeEquipment();
            render();
        });
        wrap.appendChild(btnBack);

        return wrap;
    }

    function renderMovement(s) {
        var wrap = el('div', 'screen movement');
        
        var header = el('div', 'screen-header');
        header.innerHTML = 
            '<h2>Traversata Settore ' + (s.combatIndex + 1) + ' / ' + s.dungeon.combats + '</h2>' +
            '<p class="subtitle">Soglia runica per raggiungere l\'ostile: ' + s.dungeon.threshold + ' Movimento</p>';
        wrap.appendChild(header);

        // Barra di avanzamento movimento
        var progWrap = el('div', 'movement-progress-wrap');
        var pct = Math.min(100, Math.round((s.mSum / s.dungeon.threshold) * 100));
        progWrap.innerHTML = 
            '<div class="progress-labels"><span>Potenza Cinetica Accumulata</span><span><strong>' + s.mSum + '</strong> / ' + s.dungeon.threshold + '</span></div>' +
            '<div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ' + pct + '%;"></div></div>';
        wrap.appendChild(progWrap);

        var handWrap = el('div', 'hand');
        if (s.mHand.length === 0) {
            handWrap.appendChild(el('div', 'empty', '(Nessuna carta movimento incanalata)'));
        }
        s.mHand.forEach(function(card, idx) {
            handWrap.appendChild(makeCard(card, 'movement', function() {
                NS.Game.playMovementCard(idx);
                render();
            }, false, idx));
        });
        wrap.appendChild(handWrap);

        var btn = el('button', 'primary-btn', 'Ingaggia Battaglia Astrale ⮞');
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

        // Scatola Nemico con RemixIcon
        var enemyBox = el('div', 'enemy-box');
        var enemyPct = Math.max(0, Math.min(100, Math.round((s.enemy.hp / s.enemy.maxHp) * 100)));
        var enemyIconHtml = s.enemy.icon ? '<i class="' + s.enemy.icon + '"></i>' : icon('enemy');

        enemyBox.innerHTML = 
            '<div class="enemy-header">' +
                '<span class="enemy-avatar enemy-avatar-anim ' + (s.enemy.id || '') + '">' + enemyIconHtml + '</span>' +
                '<div class="enemy-info-col">' +
                    '<div class="enemy-name">' + s.enemy.name + '</div>' +
                    '<div class="enemy-type">' + (s.enemy.type || 'Entità Ostile') + '</div>' +
                    '<div class="enemy-threat">Minaccia Imminente: <strong>' + s.enemy.damage + ' Danni</strong> ' + icon('sword') + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="enemy-hp-bar">' +
                '<div class="enemy-hp-fill" style="width: ' + enemyPct + '%;"></div>' +
                '<span class="hp-text">' + s.enemy.hp + ' / ' + s.enemy.maxHp + ' PV</span>' +
            '</div>';
        wrap.appendChild(enemyBox);

        // Barra Stato Giocatore nel Combattimento
        var stats = el('div', 'combat-stats');
        var playerPct = Math.max(0, Math.min(100, Math.round((s.playerHP / NS.CONSTANTS.PLAYER_MAX_HP) * 100)));
        stats.innerHTML = 
            '<div class="stat-player-hp">' +
                '<div class="stat-label">' + icon('heart') + ' Integrità Scafo: <strong>' + s.playerHP + ' / ' + NS.CONSTANTS.PLAYER_MAX_HP + ' PV</strong></div>' +
                '<div class="player-hp-bar"><div class="player-hp-fill" style="width: ' + playerPct + '%;"></div></div>' +
            '</div>' +
            '<div class="stat-badge stat-shield">' + icon('shield') + ' Scudo Barriera: <strong>' + s.playerShield + '</strong></div>' +
            '<div class="stat-badge stat-turn">Fase Astrale: <strong>' + (s.turn + 1) + '</strong></div>' +
            '<div class="stat-badge stat-plays">Incanalamenti: <strong>' + (s.playLimit - s.playedThisTurn) + '</strong> rimasti</div>';
        wrap.appendChild(stats);

        var handWrap = el('div', 'hand');
        if (s.cHand.length === 0) {
            handWrap.appendChild(el('div', 'empty', '(Nessuna runa di combattimento pronta)'));
        }
        var canPlay = NS.Game.canPlayCard();
        s.cHand.forEach(function(card, idx) {
            handWrap.appendChild(makeCard(card, 'combat', function() {
                NS.Game.playCombatCard(idx);
                render();
            }, !canPlay, idx));
        });
        wrap.appendChild(handWrap);

        var btn = el('button', 'primary-btn end-turn-btn', 'Compi Turno ⮞');
        btn.addEventListener('click', function() {
            var cardsInHand = wrap.querySelectorAll('.card');
            cardsInHand.forEach(function(cEl) {
                cEl.classList.add('card-discard-anim');
            });
            setTimeout(function() {
                NS.Game.endTurn();
                render();
            }, 180);
        });
        wrap.appendChild(btn);
        return wrap;
    }

    function renderGameOver(s) {
        var wrap = el('div', 'screen gameover');
        wrap.innerHTML = 
            '<div class="result-icon"><i class="ri-skull-2-line"></i></div>' +
            '<h1>Il Sigillo Si È Spezzato</h1>' +
            '<p class="subtitle">Ogni battito vitale è cessato. Il vascello e i suoi manufatti sono stati risucchiati nell\'abisso stellare.</p>';
        var btn = el('button', 'primary-btn', 'Incanala Nuovo Viaggio');
        btn.addEventListener('click', function() {
            NS.Game.startGame(); 
        });
        wrap.appendChild(btn);
        return wrap;
    }

    function renderVictory(s) {
        var wrap = el('div', 'screen victory');
        var bonusText = NS.Game.hasItem('scanner_minerario') ? ' (+5 Bonus da Scanner Minerario)' : '';
        wrap.innerHTML = 
            '<div class="result-icon">' + icon('star') + '</div>' +
            '<h1>Settore Purificato!</h1>' +
            '<p class="subtitle">I guardiani dell\'abisso sono stati dissolti. L\'energia stellare è stata immagazzinata.</p>' +
            '<div class="victory-rewards">' +
                '<div class="reward-line">Ricompensa Tributo: <strong>+' + s.dungeon.credits + bonusText + ' ' + icon('credit') + '</strong></div>' +
                '<div class="reward-line">Risorse Complessive: <strong>' + s.credits + ' ' + icon('credit') + '</strong></div>' +
            '</div>';
        var btn = el('button', 'primary-btn', 'Ritorna alla Plancia');
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
            case 'shop':      screen = renderShop(s); break;
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