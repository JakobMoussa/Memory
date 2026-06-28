import type { GameSettings } from '../types/index';
import { themeImages } from '../components/cardImages';
import backCard1 from '../assets/Themes/Theme-1/back-card.svg';
import backCard2 from '../assets/Themes/Theme-2/back-card.svg';
import backCard3 from '../assets/Themes/Theme-3/back-card.svg';
import orangeLabel from '../assets/Themes/Theme-1/label-orange.svg';
import blueLabel from '../assets/Themes/Theme-1/label-blue.svg';
import exitIconDarkMood from '../assets/Themes/Theme-1/theme-1-btn.svg';
import exitIconBlueMood from '../assets/Themes/Theme-2/theme-2-btn.svg';
import exitIconOrangeMood from '../assets/Themes/Theme-3/theme-3-btn.svg';
import exitHoverIconDarkMood from '../assets/Themes/Theme-1/theme-1-hover-btn.svg';
import exitHoverIconBlueMood from '../assets/Themes/Theme-2/theme-2-hover-btn.svg';
import exitHoverIconOrangeMood from '../assets/Themes/Theme-3/theme-3-hover-btn.svg';

const themeBackCards: Record<string, string> = {
    dark: backCard1,
    blue: backCard2,
    orange: backCard3,
};

const themeExitButtons: Record<string, string> = {
    dark: exitIconDarkMood,
    blue: exitIconBlueMood,
    orange: exitIconOrangeMood,
};

const themeExitHoverButtons: Record<string, string> = {
    dark: exitHoverIconDarkMood,
    blue: exitHoverIconBlueMood,
    orange: exitHoverIconOrangeMood,
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
    onExit: () => void
): void {

    const columns = settings.boardSize === 16 ? 4 : 6;
    const backCardSrc = themeBackCards[settings.theme]!;
    const exitButtonSrc = themeExitButtons[settings.theme]!;
    const exitButtonHoverSrc = themeExitHoverButtons[settings.theme]!;
    const cards = generateCards(settings.boardSize, settings.theme);

    appEL.innerHTML = `
        <div class="game-board theme--${settings.theme}">
            <header class="game-header">
                <div class="game-header__scores">
                    <span class="score score--blue"><img class="score__icon" src="${blueLabel}" alt="blue">Blue <strong id="score-blue">0</strong></span>
                    <span class="score score--orange"><img class="score__icon" src="${orangeLabel}" alt="orange">Orange <strong id="score-orange">0</strong></span>
                </div>
                <div class="game-header__current">
                    Current player: 
                    <span id="current-player">
                        <img class="current-player-icon" src="${settings.player === 'Blue' ? blueLabel : orangeLabel}" alt="${settings.player}">
                    </span>
                </div>
                <button class="btn btn--exit" id="exit-btn">
                    <img class="exit-btn-normal" src="${exitButtonSrc}" alt="Exit">
                    <img class="exit-btn-hover" src="${exitButtonHoverSrc}" alt="Exit Hover">
                </button>
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

            <div class="exit-modal-overlay" id="exit-modal">
                <div class="exit-modal-card">
                    <p class="exit-modal-text">Are you sure you want to quit the game?</p>
                    <div class="exit-modal-buttons">
                        <button class="exit-modal-btn exit-modal-btn--cancel" id="btn-cancel-exit">NO BACK TO GAME</button>
                        <button class="exit-modal-btn exit-modal-btn--confirm" id="btn-confirm-exit">EXIT GAME</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const cardElements = appEL.querySelectorAll('.card');
    cardElements.forEach((card) => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    const exitBtn = appEL.querySelector('#exit-btn');
    const exitModal = appEL.querySelector('#exit-modal');
    const btnCancelExit = appEL.querySelector('#btn-cancel-exit');
    const btnConfirmExit = appEL.querySelector('#btn-confirm-exit');

    exitBtn?.addEventListener('click', () => {
        exitModal?.classList.add('active');
    });

    btnCancelExit?.addEventListener('click', () => {
        exitModal?.classList.remove('active');
    });

    exitModal?.addEventListener('click', (e) => {
        if (e.target === exitModal) {
            exitModal.classList.remove('active');
        }
    });

    btnConfirmExit?.addEventListener('click', () => {
        exitModal?.classList.remove('active');
        onExit();
    });
}

