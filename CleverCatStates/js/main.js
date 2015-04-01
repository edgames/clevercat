var CleverCat = CleverCat || {};

CleverCat.game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game');

CleverCat.game.state.add('Boot', CleverCat.Boot);
CleverCat.game.state.add('Preload', CleverCat.Preload);
CleverCat.game.state.add('LevelPlay', CleverCat.LevelPlay);

CleverCat.game.state.start('Boot');