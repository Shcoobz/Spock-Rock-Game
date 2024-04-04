import { startConfetti, stopConfetti, removeConfetti } from './modules/confetti.js';

/**
 * Obtains a DOM element by its ID.
 * @param {string} id - The ID of the DOM element to retrieve.
 * @returns {Element} The DOM element associated with the provided ID.
 */
const getElement = (id) => document.getElementById(id);

/**
 * Stores references to player and computer score and choice elements.
 */
const playerElements = {
  score: getElement('playerScore'),
  choice: getElement('playerChoice'),
  rock: getElement('playerRock'),
  paper: getElement('playerPaper'),
  scissors: getElement('playerScissors'),
  lizard: getElement('playerLizard'),
  spock: getElement('playerSpock'),
};

const computerElements = {
  score: getElement('computerScore'),
  choice: getElement('computerChoice'),
  rock: getElement('computerRock'),
  paper: getElement('computerPaper'),
  scissors: getElement('computerScissors'),
  lizard: getElement('computerLizard'),
  spock: getElement('computerSpock'),
};

const resultRule = getElement('resultRuleText');
const resultText = getElement('resultText');
const allGameIcons = document.querySelectorAll('.far');

/**
 * The rules of the game, indicating which choices beat which.
 */
const rules = {
  scissors: { paper: 'cuts', lizard: 'decapitates' },
  paper: { rock: 'covers', spock: 'disproves' },
  rock: { lizard: 'crushes', scissors: 'crushes' },
  lizard: { spock: 'poisons', paper: 'eats' },
  spock: { scissors: 'smashes', rock: 'vaporizes' },
};

/**
 * An array of valid game choices.
 */
const choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

/**
 * Game scores for player and computer.
 */
let scores = { player: 0, computer: 0 };

/**
 * Resets all selected icons and stops confetti animation.
 */
function resetSelected() {
  allGameIcons.forEach((icon) => icon.classList.remove('selected'));
  stopConfetti();
  removeConfetti();
}

/**
 * Resets the game to its initial state, including scores and selections.
 */
function resetAll() {
  scores = { player: 0, computer: 0 };
  playerElements.score.textContent = 0;
  computerElements.score.textContent = 0;
  resultRule.textContent = '';
  resultText.textContent = '';
  resetSelected();
}

/**
 * Generates a random choice for the computer from the available choices.
 * @returns {string} The computer's choice.
 */
function computerRandomChoice() {
  const choiceIndex = Math.floor(Math.random() * choices.length);
  return choices[choiceIndex];
}

/**
 * Displays the computer's choice visually on the UI.
 * @param {string} choice - The computer's choice.
 */
function displayComputerChoice(choice) {
  computerElements[choice].classList.add('selected');
  computerElements.choice.textContent = choice.charAt(0).toUpperCase() + choice.slice(1);
}

/**
 * Capitalizes the first letter of a given string.
 * @param {string} string - The string to be modified.
 * @returns {string} The modified string with its first letter capitalized.
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Updates the rule text based on the player's and computer's choices.
 * @param {string} playerChoice - The player's choice.
 * @param {string} computerChoice - The computer's choice.
 */
function displayRule(playerChoice, computerChoice) {
  const playerWinningRule = rules[playerChoice]?.[computerChoice];
  const computerWinningRule = rules[computerChoice]?.[playerChoice];

  let ruleText = 'Nothing happens.';
  if (playerWinningRule) {
    ruleText = `<span style="color: var(--player-color);">${capitalizeFirstLetter(
      playerChoice
    )}</span> ${playerWinningRule} <span style="color: var(--computer-color);">${capitalizeFirstLetter(
      computerChoice
    )}</span>.`;
  } else if (computerWinningRule) {
    ruleText = `<span style="color: var(--computer-color);">${capitalizeFirstLetter(
      computerChoice
    )}</span> ${computerWinningRule} <span style="color: var(--player-color);">${capitalizeFirstLetter(
      playerChoice
    )}</span>.`;
  }
  resultRule.innerHTML = ruleText;
}

/**
 * Updates the score based on the round result and displays the outcome.
 * @param {string} playerChoice - The player's choice.
 */
function updateScore(playerChoice) {
  const computerChoice = computerRandomChoice();
  displayComputerChoice(computerChoice);
  displayRule(playerChoice, computerChoice);

  if (playerChoice === computerChoice) {
    resultText.textContent = "It's a tie.";
    return;
  }

  if (rules[playerChoice]?.[computerChoice]) {
    startConfetti();
    resultText.textContent = 'You Won!';
    scores.player++;
    playerElements.score.textContent = scores.player;
  } else {
    resultText.textContent = 'You Lost!';
    scores.computer++;
    computerElements.score.textContent = scores.computer;
  }
}

/**
 * Processes the player's choice, updates the UI and score accordingly.
 * @param {string} playerChoice - The player's choice.
 */
function select(playerChoice) {
  resetSelected();
  updateScore(playerChoice);
  playerElements[playerChoice].classList.add('selected');
  playerElements.choice.textContent =
    playerChoice.charAt(0).toUpperCase() + playerChoice.slice(1);
}

/**
 * Initializes the game by setting up global access to essential functions and resetting the game state.
 * It makes the `resetAll` and `select` functions globally accessible, allowing them to be called from the HTML document.
 * This function is called when the script loads to prepare the game for the user.
 */
function initGame() {
  window.resetAll = resetAll;
  window.select = select;

  resetAll();
}

/**
 * Initializes the game setup by calling `initGame`. This is the entry point of the application,
 * ensuring that the game's initial state is set and necessary functions are made globally available.
 * This call is placed at the end of the script to ensure all preceding definitions are loaded.
 */
initGame();
