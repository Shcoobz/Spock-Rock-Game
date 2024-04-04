import { startConfetti, stopConfetti, removeConfetti } from './modules/confetti.js';

// Utility for obtaining elements by ID
const getElement = (id) => document.getElementById(id);

// Player and computer elements
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

// Rules of the game
const rules = {
  scissors: { paper: 'cuts', lizard: 'decapitates' },
  paper: { rock: 'covers', spock: 'disproves' },
  rock: { lizard: 'crushes', scissors: 'crushes' },
  lizard: { spock: 'poisons', paper: 'eats' },
  spock: { scissors: 'smashes', rock: 'vaporizes' },
};

// Choices and what they defeat
const choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

// Game scores
let scores = { player: 0, computer: 0 };

// Reset all 'selected' icons and stop confetti
function resetSelected() {
  allGameIcons.forEach((icon) => icon.classList.remove('selected'));
  stopConfetti();
  removeConfetti();
}

// Reset game to initial state
function resetAll() {
  scores = { player: 0, computer: 0 };
  playerElements.score.textContent = 0;
  computerElements.score.textContent = 0;
  resultText.textContent = '';
  resetSelected();
}

// Generate a random choice for the computer
function computerRandomChoice() {
  const choiceIndex = Math.floor(Math.random() * choices.length);
  return choices[choiceIndex];
}

// Display the computer's choice visually
function displayComputerChoice(choice) {
  computerElements[choice].classList.add('selected');
  computerElements.choice.textContent = choice.charAt(0).toUpperCase() + choice.slice(1);
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Update the display with the rule that determined the round outcome
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

// Update scores and display the result of a round
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

// Main function to process a player's choice
function select(playerChoice) {
  resetSelected();
  updateScore(playerChoice);
  playerElements[playerChoice].classList.add('selected');
  playerElements.choice.textContent =
    playerChoice.charAt(0).toUpperCase() + playerChoice.slice(1);
}

window.resetAll = resetAll;
window.select = select;

// On startup, set initial values
resetAll();
