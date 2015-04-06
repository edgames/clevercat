var CleverCat = CleverCat || {};

function Game() {}
 
Game.prototype = {
  start: function() {
    var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');
 
    game.state.add('Boot', CleverCat.Boot);
    game.state.add('GameComplete', CleverCat.GameComplete);
    game.state.add('LevelIntro', CleverCat.LevelIntro);    
    game.state.add('LevelPlay', CleverCat.LevelPlay);
    game.state.add('Login', CleverCat.Login);
    game.state.add('MainMenu', CleverCat.MainMenu);
    game.state.add('Preload', CleverCat.Preload);
    game.state.add('StoryIntro', CleverCat.StoryIntro);
    game.state.add('Tutorial', CleverCat.Tutorial);
    
    game.state.start('Boot');
  }
};
