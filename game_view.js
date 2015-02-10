(function() {
  if (typeof Typing === "undefined") {
    window.Typing = {};
  }  
  var GameView = Typing.GameView = function(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.timerId = null;
  };

  GameView.prototype.bindKeyHandlers = function() {
    document.addEventListener('keyup', this.keyHandler.bind(this));
  };

  GameView.prototype.checkGameState = function() {
    if (this.game.over) {
      this.stop();
      return true;
    }
    return false;
  };

  GameView.prototype.keyHandler = function(event) {
    var keyCode = event.keyCode;
    if (65 <= keyCode && keyCode <= 90) {
      this.game.removeOldestInstance(keyCode);
    } else if (keyCode === 27) {
      this.stop();
    }
  };

  GameView.prototype.start = function() {
    var gameView = this;
    this.timerId = setInterval(function() {
      gameView.game.step();
      if (gameView.checkGameState()) return;
      gameView.game.draw(gameView.ctx);
    }, 1000 / Typing.Game.FPS);
    this.bindKeyHandlers();
  };

  GameView.prototype.stop = function() {
    clearInterval(this.timerId);
    alert('Game over.');
  };
})();