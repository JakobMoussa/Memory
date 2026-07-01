import type { GameSettings } from '../types/index';

// Theme 1
import confetti from '../assets/Themes/Theme-1/Confetti.png';
import playerBlue1 from '../assets/Themes/Theme-1/Player-blue.svg';
import playerOrange1 from '../assets/Themes/Theme-1/Player-orange.svg';
import scaleIcon1 from '../assets/Themes/Theme-1/Scale_Icon.svg';
import blueLabel from '../assets/Themes/Theme-1/label-blue.svg';
import orangeLabel from '../assets/Themes/Theme-1/label-orange.svg';

// Theme 2
import playerBlue2 from '../assets/Themes/Theme-2/Player-blue.svg';
import playerOrange2 from '../assets/Themes/Theme-2/Player-orange.svg';
import scaleIcon2 from '../assets/Themes/Theme-2/Scale_icon.svg';

// Theme 3
import playerBlue3 from '../assets/Themes/Theme-3/player-blue.svg';
import playerOrange3 from '../assets/Themes/Theme-3/player-orange.svg';
import scaleIcon3 from '../assets/Themes/Theme-3/scale_icon.svg';

type Player = 'Blue' | 'Orange';
type Winner = Player | 'Draw';

const themePlayerIcons: Record<string, Record<Player, string>> = {
    dark: { Blue: playerBlue1, Orange: playerOrange1 },
    blue: { Blue: playerBlue2, Orange: playerOrange2 },
    orange: { Blue: playerBlue3, Orange: playerOrange3 },
};

const themeScaleIcons: Record<string, string> = {
    dark: scaleIcon1,
    blue: scaleIcon2,
    orange: scaleIcon3,
};

const CELEBRATE_DELAY_MS = 2500;

interface GameOverParams {
    settings: GameSettings;
    scoreBlue: number;
    scoreOrange: number;
    onRestart: () => void;
}

function getWinner(scoreBlue: number, scoreOrange: number): Winner {
    if (scoreBlue > scoreOrange) return 'Blue';
    if (scoreOrange > scoreBlue) return 'Orange';
    return 'Draw';
}

function renderFinalScoreScreen(theme: string, scoreBlue: number, scoreOrange: number): string {
    return `
        <div class="game-over-screen game-over-screen--score" data-screen="score">
            <h2 class="game-over-screen__title">Game over</h2>
            <p class="game-over-screen__subtitle">Final score</p>
            <div class="game-over-screen__score-bar">
                <span class="score-bar-item score-bar-item--blue">
                    <img class="score-bar-item__icon" src="${blueLabel}" alt="blue">
                    Blue <strong class="score-bar-item__value">${scoreBlue}</strong>
                </span>
                <span class="score-bar-item score-bar-item--orange">
                    <img class="score-bar-item__icon" src="${orangeLabel}" alt="orange">
                    Orange <strong class="score-bar-item__value">${scoreOrange}</strong>
                </span>
            </div>
        </div>
    `;
}

function renderCelebrateScreen(theme: string, winner: Winner): string {
    const showConfetti = theme === 'dark' && winner !== 'Draw';
    const scaleIcon = themeScaleIcons[theme]!;
    const winnerIcon = winner !== 'Draw' ? themePlayerIcons[theme]![winner] : scaleIcon;

    let eyebrow = 'The Winner is';
    let heading = `${winner} Player`;

    if (winner === 'Draw') {
        eyebrow = "It's a";
        heading = 'DRAW';
    }

    return `
        <div class="game-over-screen game-over-screen--celebrate" data-screen="celebrate">
            ${showConfetti ? `<img class="game-over-screen__confetti" src="${confetti}" alt="">` : ''}
            <p class="game-over-screen__eyebrow">${eyebrow}</p>
            <h2 class="game-over-screen__winner-label ${winner === 'Draw' ? 'game-over-screen__winner-label--draw' : `game-over-screen__winner-label--${winner.toLowerCase()}`}">${heading}</h2>
            <img class="game-over-screen__winner-icon" src="${winnerIcon}" alt="${heading}">
            <button class="btn btn--primary" id="back-to-start-btn">Back to start</button>
        </div>
    `;
}

function attachCelebrateHandlers(appEL: HTMLElement, onRestart: () => void): void {
    const backBtn = appEL.querySelector<HTMLButtonElement>('#back-to-start-btn');
    backBtn?.addEventListener('click', () => {
        onRestart();
    });
}

function transitionToCelebrateScreen(
    wrapper: HTMLElement,
    theme: string,
    winner: Winner,
    appEL: HTMLElement,
    onRestart: () => void
): void {
    const celebrateContainer = document.createElement('div');
    celebrateContainer.innerHTML = renderCelebrateScreen(theme, winner).trim();
    const celebrateScreen = celebrateContainer.firstElementChild as HTMLElement;
    
    wrapper.appendChild(celebrateScreen);
    attachCelebrateHandlers(appEL, onRestart);

    setTimeout(() => {
        const scoreScreen = wrapper.querySelector<HTMLElement>('.game-over-screen--score');
        scoreScreen?.remove();
    }, 100);
}

export function renderGameOver(appEL: HTMLElement, params: GameOverParams): void {
    const { settings, scoreBlue, scoreOrange, onRestart } = params;
    const theme = settings.theme;
    const winner = getWinner(scoreBlue, scoreOrange);

    const wrapper = document.createElement('div');
    wrapper.className = `game-over theme--${theme}`;
    wrapper.innerHTML = renderFinalScoreScreen(theme, scoreBlue, scoreOrange);
    appEL.appendChild(wrapper);

    setTimeout(() => {
        transitionToCelebrateScreen(wrapper, theme, winner, appEL, onRestart);
    }, CELEBRATE_DELAY_MS);
}