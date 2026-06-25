import type { GameSettings } from '../types/index';
import { themeImages } from '../components/cardImages';

interface Card {
    value: string;
    theme: string;
}

function generateCards(boardSize: number, theme: string): Card[] {
    const pairs = boardSize / 2;

    const images = themeImages[theme]!.slice(0, pairs);

    const cards: Card[] = [];
    images.forEach((img) => {
        cards.push({ value: img, theme });
        cards.push({ value: img, theme });
    });

    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j]!, cards[i]!];
    }

    return cards;
}

export function renderGameBoard(
    appEL: HTMLElement,
    settings: GameSettings,
): void {

    const columns = settings.boardSize === 36 ? 6 : 4;

    const cards = generateCards(settings.boardSize, settings.theme);

    appEL.innerHTML = `
        <div class="game-board theme--${settings.theme}">
            <header class="game-header">
                <div class="game-header__scores">
                    <span class="score score--blue">Blue <strong id="score-blue">0</strong></span>
                    <span class="score score--orange">Orange <strong id="score-orange">0</strong></span>
                </div>
                <div class="game-header__current">
                    Current player: 
                    <span id="current-player">${settings.player}</span>
                </div>
                <button class="btn btn--exit" id="exit-btn">Exit game</button>
            </header>

            <main class="card-grid" 
                id="card-grid"
                style="--columns: ${columns}">
                    ${cards.map((card, index) => `
                    <div class="card" data-id="${index}" data-value="${card.value}">
                        <div class="card__inner">
                            <div class="card__back"></div>
                            <div class="card__front">
                                <img src="${card.value}" alt="card icon">
                            </div>
                        </div>
                    </div>
            
                    `).join('')}
            </main>
        </div>
    `;
}
