import './styles/style.scss';
import { renderStartScreen } from './components/StartScreen';
import { renderSettingsScreen } from './components/SettingsScreen';
import { renderGameBoard } from './components/GameBoard';
import type { GameSettings } from './types/index';

const app = document.getElementById('app');
if (!app) throw new Error('No #app element found');

renderStartScreen(app, () => {
  const showSettings = () => {
    renderSettingsScreen(app, (settings: GameSettings) => {
      renderGameBoard(app, settings, showSettings);
    });
  };
  showSettings();
});

