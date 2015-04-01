var CleverCat = CleverCat || {};

CleverCat.Boot = function(){};

CleverCat.Boot.prototype = {
  preload: function() {
    // this is the image for the loading screen of Preload
    this.load.image('logo', 'assets/phaser.png');
  },

  create: function() {
    this.game.stage.backgroundColor = "#000";
    this.state.start('Preload');
  }
};