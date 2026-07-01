/// <reference types="vite/client" />
import type { GameSettings } from '../types/index.ts';
import controllerIcon from '../assets/icons/controller-icon.svg';
import arrowIcon from '../assets/icons/Arrow-icon.svg';
import stadiaController from '../assets/icons/stadia_controller.svg';

/**
 * Renders the start screen of the application.
 *
 * Displays the title and a Play button. Clicking the button calls
 * `onPlay` with default settings (theme `'dark'`, player `'Blue'`, board size `16`).
 *
 * @param appEL - The root HTML element into which the start screen is rendered.
 * @param onPlay - Callback invoked with the default {@link GameSettings}
 *   when the player clicks "Play".
 */
export function renderStartScreen(
  appEL: HTMLElement,
  onPlay: (settings: GameSettings) => void
): void {
  appEL.innerHTML = `
    <div class="start-screen">
        <div class="start-screen__header">
            <p class="start-screen__eyebrow"> It´s play time.</p>
            <h1 class="start-screen__title"> Ready to Play?</h1>
        </div>
        <button class="btn btn--primary" id="play-btn">
            <img class="btn__icon" src="${controllerIcon}" alt="Controller">
            Play
            <img class="btn__arrow" src="${arrowIcon}" alt="Play Arrow">
        </button>
        <img class="start-screen__controller" src="${stadiaController}" alt="Stadia Controller">
    </div>
        `;

  const playBtn = document.getElementById('play-btn');
  playBtn?.addEventListener('click', () => {
    const defaultSettings: GameSettings = {
      theme: 'dark',
      player: 'Blue',
      boardSize: 16,
    };
    onPlay(defaultSettings);
  });
}