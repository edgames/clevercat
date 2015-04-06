function Milk(game) {
    this.game = game;
    // Add a sprite to the game
    this.sprite = game.add.sprite(game.world.width - 50, 1*game.world.height/3, Milk.assetKey);
    this.sprite.enableBody = true;
    
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.gravity.y = 100;
    this.sprite.body.bounce.y = 0.05;
    this.sprite.body.collideWorldBounds = true;

}

Milk.prototype = {

}

Milk.assetKey = 'milk';

/* Load cat-related assets into the game.
 *
 */
Milk.preload = function(game) {
    game.load.spritesheet(Milk.assetKey, 'assets/milkbowl.png', 400, 200); 
    
}