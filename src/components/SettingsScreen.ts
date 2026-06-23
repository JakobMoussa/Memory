import type { GameSettings } from '../types/index';
import darkPreview from '../assets/images/Property 1=IT logos.png';
import bluePreview from '../assets/images/Property 2=DA projects.png';
import orangePreview from '../assets/images/Property 3=foods.png';
import paletteIcon from '../assets/icons/palette.svg';
import lineCheckIcon from '../assets/icons/Line 3 (1).svg';
import controllerIcon from '../assets/icons/smart_display.svg';

const themePreviews = {
    dark: darkPreview,
    blue: bluePreview,
    orange: orangePreview,
};

export function renderSettingsScreen(
    appEL: HTMLElement,
    onStart: (settings: GameSettings) => void
): void {
    let currentSettings: GameSettings = {
        theme: 'dark',
        player: 'Blue',
        boardSize: 16,
    };

    appEL.innerHTML = `
        <div class="settings-screen">

            <div class="settings-screen__left">
            <div class="settings-screen__header">
                <h2 class="settings-screen__title">Settings</h2>
                <img class="line-icon" src="src/assets/icons/Line 3.svg" alt="line-icon">
            </div>

            <section class="settings-group">
                <div class="settings-group__header">
                    <img class="settings-group__icon" src="src/assets/icons/palette.svg" alt="palette icon">
                    <h3 class="settings-group__title">Game themes</h3>
                </div>
                <div class="settings-options" data-group="theme">
                <button class="option-btn active" data-value="dark">Code vibes theme<img class="option-btn__arrow" src="${lineCheckIcon}" alt=""></button>
                <button class="option-btn" data-value="blue">DA project theme<img class="option-btn__arrow" src="${lineCheckIcon}" alt=""></button>
                <button class="option-btn" data-value="orange">Foods theme<img class="option-btn__arrow" src="${lineCheckIcon}" alt=""></button>
                </div>
            </section>

            <section class="settings-group">
                <div class="settings-group__header">
                    <img class="settings-group__icon" src="src/assets/icons/chess_pawn.svg" alt="chess pawn icon">
                    <h3 class="settings-group__title">Choose player</h3>
                </div>
                <div class="settings-options" data-group="player">
                <button class="option-btn" data-value="Blue">Blue<img class="option-btn__arrow" src="${lineCheckIcon}" alt=""></button>
                <button class="option-btn" data-value="Orange">Orange<img class="option-btn__arrow" src="${lineCheckIcon}" alt=""></button>
                </div>
            </section>

            <section class="settings-group">
                <div class="settings-group__header">
                    <img class="settings-group__icon" src="src/assets/icons/style.svg" alt="cards icon">
                    <h3 class="settings-group__title">Board size</h3>
                </div>
                <div class="settings-options" data-group="boardSize">
                <button class="option-btn" data-value="16">16 cards<img class="option-btn__arrow" src="${lineCheckIcon}" alt=""></button>
                <button class="option-btn" data-value="24">24 cards<img class="option-btn__arrow" src="${lineCheckIcon}" alt=""></button>
                <button class="option-btn" data-value="36">36 cards<img class="option-btn__arrow" src="${lineCheckIcon}" alt=""></button>
                </div>
            </section>
            </div>

            <div class="settings-screen__right-wrapper">
                <div class="settings-screen__right">
                    <img 
                        class="settings-screen__preview" 
                        id="theme-preview" 
                        src="${darkPreview}" 
                        alt="Theme preview"
                    >
                </div>

                <div class="settings-screen__bar">
                    <span id="bar-theme">Games themes</span>
                    <img class="settings-screen__bar-divider" src="${lineCheckIcon}" alt="">
                    <span id="bar-player">Blue Player</span>
                    <img class="settings-screen__bar-divider" src="${lineCheckIcon}" alt="">
                    <span id="bar-size">Board-16 Cards</span>
                    <button class="btn btn--primary" id="start-btn">Start<img class="controller-icon" src="${controllerIcon}" alt="controller-icon"></button>
                </div>
            </div>

        </div>
    `;

    const optionButtons = document.querySelectorAll<HTMLButtonElement>('.option-btn');

    optionButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const group = btn.parentElement?.dataset.group;
            const value = btn.dataset.value;

            if (!group || !value) return;

            const siblingButtons = btn.parentElement?.querySelectorAll('.option-btn');
            siblingButtons?.forEach((sibling) => sibling.classList.remove('active'));

            btn.classList.add('active');

            if (group === 'theme') {
                currentSettings.theme = value as GameSettings['theme'];
            } else if (group === 'player') {
                currentSettings.player = value as GameSettings['player'];
            } else if (group === 'boardSize') {
                currentSettings.boardSize = Number(value) as GameSettings['boardSize'];
            }

            const previewImg = document.getElementById('theme-preview') as HTMLImageElement;
            if (previewImg) {
                previewImg.src = themePreviews[currentSettings.theme];
            }

            const barTheme = document.getElementById('bar-theme');
            const barPlayer = document.getElementById('bar-player');
            const barSize = document.getElementById('bar-size');

            if (group === 'theme' && barTheme) barTheme.textContent = btn.textContent;
            if (group === 'player' && barPlayer) barPlayer.textContent = btn.textContent;
            if (group === 'boardSize' && barSize) barSize.textContent = btn.textContent;
        });
    });

    const startBtn = document.getElementById('start-btn');
    startBtn?.addEventListener('click', () => {
        onStart(currentSettings);
    });
}



