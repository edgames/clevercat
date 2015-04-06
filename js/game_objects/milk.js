function Milk(game) {
    this.game = game;
    // Add a sprite to the game
    this.sprite = game.add.sprite(32, game.world.height - 150, "milk");
    // var star = this.stars.create(this.game.world.width - 50, 1*this.game.world.height/3, 'star');
    // Set the size of the sprite
    this.sprite.scale.setTo(0.1, 0.1);
    
    this.sprite.enableBody = true;
   
    game.physics.arcade.enable(this.sprite);
    
    this.sprite.body.collideWorldBounds = true; //in an attempt to save the star!
}

Milk.prototype = {
    tip: function() {
        //do something over here
    },
    
    drinkMilk: function () {
        // game.levelComplete();
        this.sprite.kill();
  },
    
}

/* Load cat-related assets into the game.
 *
 */
Milk.preload = function(game) {
    game.load.spritesheet("milk", 'assets/milkbowl.png', 400, 200); 
    
}