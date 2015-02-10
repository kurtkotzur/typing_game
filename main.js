var Game = function(ctx) {
  this.ctx = ctx;
  this.letters = [];
  this.score = 0;
  this.letterCount = 0;
  this.newLetterInterval = 10;
  this.frameCount = 0;
};

Game.DIM_X = 1000;
Game.DIM_Y = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 20;
Game.FPS = 10;
Game.FONT = '20px sans-serif';
Game.ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

Game.prototype.addLetter = function() {
  this.letters.push(new Letter({
    game: this,
    str: Game.ALPHABET[Math.floor(26 * Math.random())],
    pos: [0, Math.random() * Game.DIM_Y],
    vel: 10
  }));
}

Game.prototype.bindKeyHandlers = function() {
  var game = this;
  document.addEventListener('keyup', this.keyHandler.bind(this));
};

Game.prototype.handleLetterKeyPress = function(keyCode) {
  var str = Game.ALPHABET[keyCode - 65],
      delta = this.removeOldestInstance(str) ? 1 : -1;
  this.updateScore(delta);
};

Game.prototype.draw = function() {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  var game = this;
  this.letters.forEach(function(letter) {
    letter.draw(game.ctx);
  });
  this.showScore();
};

Game.prototype.isOutOfBounds = function(pos) {
  return pos[0] > Game.DIM_X;
};

Game.prototype.keyHandler = function(event) {
  debugger
  var keyCode = event.keyCode;
  if (65 <= keyCode && keyCode <= 90) {
    this.handleLetterKeyPress(keyCode);
  } else if (keyCode === 27) {
    this.stop();
  }
};

Game.prototype.removeOldestInstance = function(str) {
  var oldestIndex = false;
  this.letters.some(function(letter, i) {
    if (letter.str === str) {
      oldestIndex = i;
      return true;
    }
  });
  if (oldestIndex !== false) {
    this.letters.splice(oldestIndex, 1);
    return true;
  } else {
    return false;
  }
};

Game.prototype.showScore = function() {
  this.ctx.fillText('Score:' + this.score.toString(), Game.DIM_X - 100, 20);
};

Game.prototype.start = function() {
  var game = this;
  this.timerId = setInterval(function() {
    game.step();
    game.draw();
  }, 1000 / Game.FPS);
  this.bindKeyHandlers();
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

Game.prototype.stop = function() {
  clearInterval(this.timerId);
  alert('Game over.');
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
    this.game.stop();
  }
};