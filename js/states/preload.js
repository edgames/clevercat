var CleverCat = CleverCat || {};

// loading the game assets
CleverCat.Preload = function(){};

CleverCat.Preload.prototype = {

  preload: function() {
    this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');

    // load all game assets
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    Cat.preload(this);
    this.load.image('topbar', 'assets/Plain Block.png');
    this.load.image('cliff', 'assets/Grass Block.png');
    this.load.image('crate', 'assets/Wood Block.png');
    this.load.image('star', 'assets/star.png');
  },

  create: function() {
    this.state.start('MainMenu');
  }

};