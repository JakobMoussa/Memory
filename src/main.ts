import './styles/style.scss';
import { renderStartScreen } from './components/StartScreen';
import type { GameSettings } from './types/index';

const app = document.getElementById('app');

if (!app) throw new Error('No #app element found');

renderStartScreen(app, (settings: GameSettings) => {
  console.log('Game starts with settings:', settings);
});