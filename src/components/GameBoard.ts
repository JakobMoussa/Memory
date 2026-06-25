import type { GameSettings } from '../types/index';
import { themeImages } from '../components/cardImages';
import backCard1 from '../assets/Themes/Theme-1/back-card.svg';
import backCard2 from '../assets/Themes/Theme-2/back-card.svg';
import backCard3 from '../assets/Themes/Theme-3/back-card.svg';

const themeBackCards: Record<string, string> = {
    dark: backCard1,
    blue: backCard2,
    orange: backCard3,
};

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

    const columns = settings.boardSize === 16 ? 4 : 6;
    const backCardSrc = themeBackCards[settings.theme]!;
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
                data-size="${settings.boardSize}"
                style="--columns: ${columns}">
                    ${cards.map((card, index) => `
                    <div class="card" data-id="${index}" data-value="${card.value}">
                        <div class="card__inner">
                            <div class="card__back">
                                <img src="${backCardSrc}" alt="" class="card__back-img">
                            </div>
                            <div class="card__front">
                                <img src="${card.value}" alt="card icon">
                            </div>
                        </div>
                    </div>
            
                    `).join('')}
            </main>
        </div>
    `;

    const cardElements = appEL.querySelectorAll('.card');
    cardElements.forEach((card) => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
}

