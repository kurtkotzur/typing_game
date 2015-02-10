var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

var Game = function(ctx) {
  this.ctx = ctx;
  this.letters = [];
  this.score = 0;
  this.letterCount = 0;
  this.newLetterInterval = 10;
  this.frameCount = 0;
  this.over = false;
};

Game.DIM_X = 1000;
Game.DIM_Y = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 20;
Game.FPS = 10;
Game.FONT = '20px sans-serif';

Game.prototype.addLetter = function() {
  this.letters.push(new Letter({
    game: this,
    str: ALPHABET[Math.floor(26 * Math.random())],
    pos: this.randomPosition(),
    vel: 10
  }));
}

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  var game = this;
  this.letters.forEach(function(letter) {
    letter.draw(ctx);
  });
  this.showScore(ctx);
};

Game.prototype.isOutOfBounds = function(pos) {
  return pos[0] > Game.DIM_X;
};

Game.prototype.randomPosition = function() {
  var y = Math.random() * Game.DIM_Y,
      fontSize = Number(Game.FONT.match(/(\d+)px.*/)[1]);
  if (y < fontSize) y = fontSize;
  if (y > Game.DIM_Y - fontSize) y = Game.DIM_Y - fontSize;
  return [0, y];
}

Game.prototype.removeOldestInstance = function(str) {
  var oldestIndex = false, delta = -1;
  this.letters.some(function(letter, i) {
    if (letter.str === str) {
      oldestIndex = i;
      delta = 1;
      return true;
    }
  });
  if (oldestIndex !== false) this.letters.splice(oldestIndex, 1);
  this.updateScore(delta);
};

Game.prototype.showScore = function(ctx) {
  ctx.fillText('Score:' + this.score.toString(), Game.DIM_X - 100, 20);
};

Game.prototype.step = function() {
  this.frameCount++;
  this.letters.forEach(function(letter) {
    letter.move();
  });
  if (this.frameCount >= this.newLetterInterval) {
    this.addLetter();
    this.frameCount = 0;
  }
};

Game.prototype.updateScore = function(delta) {
  this.score += delta;
  if (delta === 1) {
    this.letterCount++;
  }
  if (this.letterCount % 20 === 0) {
    this.newLetterInterval--;
  }
};

var GameView = function(game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.timerId = null;
};


GameView.prototype.bindKeyHandlers = function() {
  document.addEventListener('keyup', this.keyHandler.bind(this));
};

GameView.prototype.checkGameState = function() {
  if (this.game.over) this.stop();
}

GameView.prototype.handleLetterKeyPress = function(keyCode) {
  var str = ALPHABET[keyCode - 65];
  this.game.removeOldestInstance(str);
};

GameView.prototype.keyHandler = function(event) {
  var keyCode = event.keyCode;
  if (65 <= keyCode && keyCode <= 90) {
    this.handleLetterKeyPress(keyCode);
  } else if (keyCode === 27) {
    this.stop();
  }
};

GameView.prototype.start = function() {
  var gameView = this;
  this.timerId = setInterval(function() {
    gameView.game.step();
    gameView.checkGameState();
    gameView.game.draw(gameView.ctx);
  }, 1000 / Game.FPS);
  this.bindKeyHandlers();
};

GameView.prototype.stop = function() {
  clearInterval(this.timerId);
  alert('Game over.');
};

var Letter = function(options) {
  this.game = options.game;
  this.str = options.str;
  this.pos = options.pos;
  this.vel = options.vel;
};

Letter.prototype.draw = function(ctx) {
  ctx.fillText(this.str, this.pos[0], this.pos[1]);
};

Letter.prototype.move = function() {
  this.pos[0] += this.vel;
  if (this.game.isOutOfBounds(this.pos)) {
    this.game.over = true;
  }
};