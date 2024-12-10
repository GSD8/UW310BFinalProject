class Game {
  constructor() {
    this.choices = ['rock', 'paper', 'scissors'];
    this.images = {
      rock: 'default-rock.jpg',
      paper: 'default-paper.jpg',
      scissors: 'default-scissors.jpg'
    };
    this.loadImages();
    this.addMouseOverEffects();
  }

  async loadImages() {
    const BASE_URL = 'https://api.unsplash.com/photos/random';
    const ROCK_URL = `${BASE_URL}?query=rock&client_id=${apiClientID}`;
    const PAPER_URL = `${BASE_URL}?query=paper&client_id=${apiClientID}`;
    const SCISSORS_URL = `${BASE_URL}?query=scissors&client_id=${apiClientID}`;

    try {
      const rockResponse = await fetch(ROCK_URL);
      const rockData = await rockResponse.json();
      console.log(rockData);
      this.images.rock = rockData.urls.small;

      const paperResponse = await fetch(PAPER_URL);
      const paperData = await paperResponse.json();
      this.images.paper = paperData.urls.small;

      const scissorsResponse = await fetch(SCISSORS_URL);
      const scissorsData = await scissorsResponse.json();
      this.images.scissors = scissorsData.urls.small;

      this.updateImages();
    } catch (error) {
      console.error('Error fetching images:', error);
      this.images.rock = 'default-rock.jpg';
      this.images.paper = 'default-paper.jpg';
      this.images.scissors = 'default-scissors.jpg';
      this.updateImages();
    }
  }

  updateImages() {
    document.getElementById('rock').src = this.images.rock;
    document.getElementById('paper').src = this.images.paper;
    document.getElementById('scissors').src = this.images.scissors;
  }

  addMouseOverEffects() {
    const rockImage = document.getElementById('rock');
    const paperImage = document.getElementById('paper');
    const scissorsImage = document.getElementById('scissors');

    rockImage.addEventListener('mouseover', () => {
      rockImage.src = 'default-rock.jpg'; 
    });
    rockImage.addEventListener('mouseout', () => {
      rockImage.src = this.images.rock;
    });

    paperImage.addEventListener('mouseover', () => {
      paperImage.src = 'default-paper.jpg'; 
    });
    paperImage.addEventListener('mouseout', () => {
      paperImage.src = this.images.paper;
    });

    scissorsImage.addEventListener('mouseover', () => {
      scissorsImage.src = 'default-scissors.jpg'; 
    });
    scissorsImage.addEventListener('mouseout', () => {
      scissorsImage.src = this.images.scissors;
    });
  }

  play(playerChoice) {
    const computerChoice = this.choices[Math.floor(Math.random() * this.choices.length)];
    let result;
    if (playerChoice === computerChoice) {
      result = 'tie';
    } else if (
      (playerChoice === 'rock' && computerChoice === 'scissors') ||
      (playerChoice === 'paper' && computerChoice === 'rock') ||
      (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
      result = 'win';
    } else {
      result = 'lose';
    }
    this.displayResult(playerChoice, computerChoice, result);
    this.updateLocalStorage(playerChoice, computerChoice, result);
    this.updateHistory();
    this.updateStats();
  }

  displayResult(playerChoice, computerChoice, result) {
    const resultDiv = document.getElementById('result');
    let yourColor;
    let opponentColor;
  
    if (result === 'win') {
      yourColor = 'green';
      opponentColor = 'red';
    } else if (result === 'lose') {
      yourColor = 'red';
      opponentColor = 'green';
    } else if (result === 'tie') {
      yourColor = 'orange';
      opponentColor = 'orange';
    }

  resultDiv.innerHTML = `
    You chose: <span style="color: ${yourColor};">${playerChoice}</span>
    Computer chose: <span sytle="color: ${opponentColor};">${computerChoice}</span>
    Result: You <span style="color: ${yourColor};">${result}</span>!
  `;
  }

  updateLocalStorage(playerChoice, computerChoice, result) {
    const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    gameHistory.push({ playerChoice, computerChoice, result });
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
  }

  updateHistory() {
    const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    gameHistory.reverse().forEach((game, index) => {
      const listItem = document.createElement('li');
      let icon;
      if (game.result === 'win') {
        icon = '✅'; // Win icon
      } else if (game.result === 'lose') {
        icon = '❌'; // Loss icon
      } else {
        icon = '🤝'; // Tie icon
      }
      listItem.innerHTML = `${icon} Game ${gameHistory.length - index}: You chose ${game.playerChoice}, Computer chose ${game.computerChoice}, Result: You ${game.result}`;
      historyList.appendChild(listItem);
    });
    document.getElementById('history').style.display = 'block';
  }

  updateStats() {
    const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    const totalGames = gameHistory.length;
    const wins = gameHistory.filter(game => game.result === 'win').length;
    const losses = gameHistory.filter(game => game.result === 'lose').length;
    const ties = gameHistory.filter(game => game.result === 'tie').length;
    const winPercentage = totalGames ? ((wins / totalGames) * 100).toFixed(2) : 0;

    document.getElementById('win-loss-totals').textContent = `Wins: ${wins}, Losses: ${losses}, Ties: ${ties}`;
    const winPercentageElement = document.getElementById('win-percentage');
    winPercentageElement.textContent = `Win Percentage: ${winPercentage}%`;
    if (totalGames === 0) {
      winPercentageElement.style.color = 'black';
    } else if (winPercentage > 50) {
      winPercentageElement.style.color = 'green';
    } else if (winPercentage < 50) {
      winPercentageElement.style.color = 'red';
    } else {
      winPercentageElement.style.color = 'black';
    }
    document.getElementById('stats').style.display = 'block';
  }

  resetHistory() {
    localStorage.removeItem('gameHistory');
    this.updateHistory();
    this.updateStats();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  document.getElementById('player-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const playerName = document.getElementById('player-name').value;
    if (playerName) {
      document.getElementById('game').style.display = 'block';
      document.getElementById('player-form').style.display = 'none';
    }
  });

  document.getElementById('choices').addEventListener('click', (event) => {
    if (event.target.tagName === 'IMG') {
      const playerChoice = event.target.id;
      game.play(playerChoice);
    }
  });

  document.getElementById('play-again').addEventListener('click', () => {
    document.getElementById('result').innerHTML = '';
  });

  document.getElementById('reset-history').addEventListener('click', () => {
    game.resetHistory();
  });
});