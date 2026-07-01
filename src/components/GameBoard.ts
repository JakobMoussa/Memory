import type { GameSettings } from '../types/index';
import { themeImages } from '../components/cardImages';
import { renderGameOver } from './GameOver';
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

import playerBlue2 from '../assets/Themes/Theme-2/Player-blue.svg';
import playerOrange2 from '../assets/Themes/Theme-2/Player-orange.svg';
import playerBlue3 from '../assets/Themes/Theme-3/player-blue.svg';
import playerOrange3 from '../assets/Themes/Theme-3/player-orange.svg';

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

type Player = 'Blue' | 'Orange';

const WRONG_PAIR_DELAY_MS = 1000;

const themeSmallIcons: Record<string, Record<Player, string>> = {
    dark: { Blue: blueLabel, Orange: orangeLabel },
    blue: { Blue: playerBlue2, Orange: playerOrange2 },
    orange: { Blue: playerBlue3, Orange: playerOrange3 },
};

/**
 * Generates a shuffled array of card pairs for the game board.
 *
 * Picks as many images as needed (`boardSize / 2`) from the theme assets,
 * creates two cards per image, and shuffles the result using the
 * Fisher-Yates algorithm.
 *
 * @param boardSize - Total number of cards on the board (e.g. `16`, `24`, `36`).
 * @param theme - The active game theme that determines which images to use.
 * @returns Shuffled array of {@link Card} objects.
 */
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

/**
 * Renders the game board and attaches all related game-logic event handlers.
 *
 * Initialises cards, scores, player switching, and the exit dialog.
 * Once all cards have been matched, the game-over screen is shown
 * via {@link renderGameOver} after a short delay.
 *
 * @param appEL - The root HTML element into which the game board is rendered.
 * @param settings - The selected game settings ({@link GameSettings}).
 * @param onExit - Callback invoked when the player confirms an exit or the game ends.
 */
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

    const blueIcon = themeSmallIcons[settings.theme]!['Blue'];
    const orangeIcon = themeSmallIcons[settings.theme]!['Orange'];

    let currentPlayer: Player = settings.player;
    let scoreBlue = 0;
    let scoreOrange = 0;
    let matchedCount = 0;
    let isBoardLocked = false;
    let firstCard: HTMLElement | null = null;
    let secondCard: HTMLElement | null = null;

    appEL.innerHTML = `
        <div class="game-board theme--${settings.theme}">
            <header class="game-header">
                <div class="game-header__scores">
                    <span class="score score--blue"><img class="score__icon" src="${blueIcon}" alt="blue">Blue <strong id="score-blue">0</strong></span>
                    <span class="score score--orange"><img class="score__icon" src="${orangeIcon}" alt="orange">Orange <strong id="score-orange">0</strong></span>
                </div>
                <div class="game-header__current">
                    Current player: 
                    <span id="current-player">
                        <img class="current-player-icon" src="${settings.player === 'Blue' ? blueIcon : orangeIcon}" alt="${settings.player}">
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

    const currentPlayerEl = appEL.querySelector<HTMLElement>('#current-player');
    const scoreBlueEl = appEL.querySelector<HTMLElement>('#score-blue');
    const scoreOrangeEl = appEL.querySelector<HTMLElement>('#score-orange');

    /**
     * Updates the player icon in the header to reflect the current player.
     */
    function updateCurrentPlayerIcon(): void {
        if (!currentPlayerEl) return;
        const icon = currentPlayer === 'Blue' ? blueIcon : orangeIcon;
        currentPlayerEl.innerHTML = `<img class="current-player-icon" src="${icon}" alt="${currentPlayer}">`;
    }

    /**
     * Switches the active player and updates the header display.
     */
    function switchPlayer(): void {
        currentPlayer = currentPlayer === 'Blue' ? 'Orange' : 'Blue';
        updateCurrentPlayerIcon();
    }

    /**
     * Increments the current player's score by 1 and updates the display.
     */
    function addPoint(): void {
        if (currentPlayer === 'Blue') {
            scoreBlue++;
            if (scoreBlueEl) scoreBlueEl.textContent = String(scoreBlue);
        } else {
            scoreOrange++;
            if (scoreOrangeEl) scoreOrangeEl.textContent = String(scoreOrange);
        }
    }

    /**
     * Resets the currently selected cards and unlocks the board.
     */
    function resetSelection(): void {
        firstCard = null;
        secondCard = null;
        isBoardLocked = false;
    }

    /**
     * Handles a click on a card.
     *
     * - Ignores clicks when the board is locked or the card is already flipped/matched.
     * - Flips the card and stores it as the first or second selection.
     * - On a match, both cards are marked as `matched` and a point is awarded.
     * - If all cards are matched, the game-over flow starts after 5 seconds.
     * - On a mismatch, the cards are flipped back after {@link WRONG_PAIR_DELAY_MS}
     *   and the player is switched.
     *
     * @param card - The clicked card HTML element.
     */
    function handleCardClick(card: HTMLElement): void {
        if (isBoardLocked) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

        card.classList.add('flipped');

        if (!firstCard) {
            firstCard = card;
            return;
        }

        secondCard = card;
        isBoardLocked = true;

        const isMatch = firstCard.dataset.value === secondCard.dataset.value;

        if (isMatch) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matchedCount += 2;

            addPoint();
            resetSelection();

            if (matchedCount === cards.length) {
                isBoardLocked = true;
                setTimeout(() => {
                    renderGameOver(appEL, {
                        settings,
                        scoreBlue,
                        scoreOrange,
                        onRestart: onExit,
                    });
                }, 5000);
            }
        } else {
            setTimeout(() => {
                firstCard?.classList.remove('flipped');
                secondCard?.classList.remove('flipped');
                resetSelection();
                switchPlayer();
            }, WRONG_PAIR_DELAY_MS);
        }
    }

    const cardElements = appEL.querySelectorAll<HTMLElement>('.card');
    cardElements.forEach((card) => {
        card.addEventListener('click', () => handleCardClick(card));
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