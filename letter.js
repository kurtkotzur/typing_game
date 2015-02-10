(function() {
  if (typeof Typing === "undefined") {
    window.Typing = {};
  }

  var Letter = Typing.Letter = function(options) {
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
})();