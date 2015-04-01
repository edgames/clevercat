var CleverCat = CleverCat || {};

function Game() {}
 
Game.prototype = {
  start: function() {
    var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');
 
    game.state.add('Boot', CleverCat.Boot);
    game.state.add('Preload', CleverCat.Preload);
    game.state.add('MainMenu', CleverCat.MainMenu)
    game.state.add('LevelPlay', CleverCat.LevelPlay);
    
    game.state.start('Boot');
  }
};
