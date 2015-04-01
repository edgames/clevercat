function Cat(game) {
    // Add a sprite to the game
    this.sprite = game.add.sprite(32, game.world.height - 150, Cat.assetKey);
    
    // Set the size of the sprite
    this.sprite.scale.setTo(0.1, 0.1);
    
    // Set the animation properties
    // The parameters are (name, frames, frameRate, loop, useNumericIndex)
    this.sprite.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, true);
    this.sprite.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, true);
    
    // Enable Arcade Physics
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.bounce.y = 0.05;
    this.sprite.body.gravity.y = 800;
    this.sprite.body.collideWorldBounds = true;
}

Cat.prototype = {
    
    handleArrowKeys: function(cursors) {
        if (cursors.left.isDown) {
            //  Move to the left
            this.sprite.body.velocity.x = -150;
            this.sprite.animations.play('left');
            this.sprite.anchor.setTo(.5, 1); //so it flips around its middle
            this.sprite.scale.x = 0.1; //facing default direction
        } else if (cursors.right.isDown) {
            //  Move to the right
            this.sprite.body.velocity.x = 150;
            this.sprite.animations.play('right');
            this.sprite.anchor.setTo(.5, 1); //so it flips around its middle
            this.sprite.scale.x = -0.1; //facing opposite direction
        } else {
            //  Stand still
            this.sprite.body.velocity.x = 0;
            this.sprite.animations.stop();
            this.sprite.frame = 0;
        }
        
        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && this.sprite.body.touching.down) {
            this.sprite.body.velocity.y = -350;
        }
    }
    
}

Cat.assetKey = 'cat';

/* Load cat-related assets into the game.
 *
 */
Cat.preload = function(game) {
    game.load.spritesheet(Cat.assetKey, 'assets/catwalk.png', 400, 200);
}