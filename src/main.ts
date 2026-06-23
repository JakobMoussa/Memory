import './styles/style.scss';
import { renderStartScreen } from './components/StartScreen';
import { renderSettingsScreen } from './components/SettingsScreen';
import type { GameSettings } from './types/index';

const app = document.getElementById('app');

if (!app) throw new Error('No #app element found');

renderStartScreen(app, (settings: GameSettings) => {
  console.log('Game starts with settings:', settings);
  renderSettingsScreen(app, (finalSettings: GameSettings) => {
    console.log('Game starts with:', finalSettings);
  });
});

