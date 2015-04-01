var CleverCat = CleverCat || {};

CleverCat.LevelPlay = function(){
  this.player = null;
  this.platforms = null;
  this.topbar = null;
  this.cursors = null;
  this.score = 0;
  this.scoreText = null;
  this.blocks = null;
  this.storeBlocks = null;
  this.draggingBlocks = null;
  this.dragShadowBlocks = null;
  
  // Refers to the sprite currently being dragged, if any
  this.draggingSprite = null;
  // The "shadow" of that block for snapping to a valid placement position
  this.draggingSpriteShadow = null;
  this.dragOffset = null; // Pointer-Sprite when dragging starts
};


CleverCat.Boot.prototype = {
  init: function () {
    this.game.world.setBounds(0, 0, 640, 480);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 200;
  },

  create: function () {

    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    this.add.sprite(0, 0, 'sky');
    
    //  The platforms group contains the ground and the cliff
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    var ground = this.platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2); //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.body.immovable = true;
    var cliff = this.platforms.create(game.world.width/2, 1*game.world.height/3, 'cliff');
    cliff.scale.setTo(3.3, 2);
    cliff.body.setSize(cliff.body.width, cliff.body.height-25, 0, 25);
    cliff.body.immovable = true;

    // The player and its settings
    this.player = game.add.sprite(32, game.world.height - 150, 'cat');
    this.physics.arcade.enable(this.player);
    this.player.body.bounce.y = 0.05;
    this.player.body.gravity.y = 800;
    this.player.body.collideWorldBounds = true;
    this.player.scale.setTo(0.1, 0.1); // The cat sprite is far too large...
    //the parameters are (name, frames, frameRate, loop, useNumericIndex)
    this.player.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, true);
    this.player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, true);

    // the bar at the top of the game
    this.topbar = this.add.sprite(0, -13, 'topbar');
    this.topbar.scale.setTo(10, 0.3);
    
    this.draggingBlocks = this.add.group();
    this.draggingBlocks.enableBody = true;
    this.dragShadowBlocks = this.add.group(); // appears when dragging to an un-draggable location
    this.dragShadowBlocks.enableBody = true;
    
    this.activeBlocks = this.add.group();
    this.activeBlocks.enableBody = true;
    
    
    this.storeBlocks = this.add.group();
    this.replenishStoreBlocks();
    
    this.stars = this.add.group();
    this.stars.enableBody = true;
    var star = this.stars.create(game.world.width - 50, 1*game.world.height/3, 'star');
    star.body.gravity.y = 100;
    star.body.bounce.y = 0.05;
    star.body.collideWorldBounds = true; //in an attempt to save the star!
    //this.star = this.add.sprite(game.world.width - 50, 1*game.world.height/3, 'star');
  
    // Example text:
    // this.scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    
    this.timer = this.game.time.create();
    this.startTimer = this.timer.add(Phaser.Timer.MINUTE * 2 + Phaser.Timer.SECOND * 30, this.endTimer, this);
    this.timer.start();
    
    this.cursors = this.input.keyboard.createCursorKeys();

  },
  
  replenishStoreBlocks: function() {
      // Delete all existing store blocks and create new ones
      this.storeBlocks.removeAll(true);
      var topbarBlock = this.storeBlocks.create(0, 0, 'crate');
      topbarBlock.scale.setTo(0.5, 0.5);
      //  Enable input and allow for dragging for the blocks sprite
      topbarBlock.inputEnabled = true;
      topbarBlock.input.enableDrag();
      topbarBlock.events.onDragStart.add(this.onDragStart, this);
      topbarBlock.events.onDragStop.add(this.onDragStop, this);  
  },
    
  onDragStart: function(sprite, pointer) {
      
      this.draggingSpriteShadow = this.dragShadowBlocks.create(
          -sprite.width, -sprite.height, sprite.generateTexture());
      this.draggingSpriteShadow.alpha = 0.3;
      this.draggingSpriteShadow.scale = sprite.scale;
      
      this.storeBlocks.remove(sprite);
      this.draggingBlocks.add(sprite);
      this.draggingSprite = sprite;
      this.dragOffset = Phaser.Point.subtract(pointer.position, sprite.position);
      var game = this;
      setTimeout(function() {
          game.replenishStoreBlocks();
      }, 100);
  },
  
  onDragStop: function(sprite, pointer) {
      sprite.input.disableDrag();
      sprite.enableBody = true;
      this.draggingSprite = null;
      this.draggingBlocks.remove(sprite);
      
      this.dragShadowBlocks.remove(this.draggingSpriteShadow);
      this.draggingSpriteShadow = null;
      
      //By default Sprites won't add themselves to any physics system and their physics body will be `null`.
      // To enable them for physics you need to call `game.physics.enable(sprite, system)` where `sprite` is this object
      //and `system` is the Physics system you want to use to manage this body. Once enabled you can access all physics related properties via `Sprite.body`.
      game.physics.enable(sprite, Phaser.Physics.ARCADE);
      sprite.body.gravity.y = 200; 
      this.activeBlocks.add(sprite);
  },

  /* Display a the dragging sprite's shadow at a valid placement location */
  displayDraggingShadow: function() {
      
    var pointer = game.input.mousePointer;
    var origin = Phaser.Point.subtract(pointer.position, this.dragOffset);
    var distance = 0.5;
    var testPosition;
    
    var foundVacancy = false;
    var offsets = [null, null, null, null];
    var vacancyOffset;
    var triesRemaining = 1000;
    do {
        distance += 10;
        offsets[0] = new Phaser.Point(distance, 0);
        offsets[1] = new Phaser.Point(-distance, 0);
        offsets[2] = new Phaser.Point(0, distance);
        offsets[3] = new Phaser.Point(0, -distance);
        for (var i = 0; i < 4; i++) {
            vacancyOffset = offsets[i];
            this.draggingSpriteShadow.position = Phaser.Point.add(origin, vacancyOffset);
            if (!this.draggingSpriteShadowOverlaps()) {
                foundVacancy = true;
                break;
            }
        }
        triesRemaining--;
    } while (!foundVacancy && triesRemaining > 0);
    
    if (!foundVacancy) {
        console.log("Could not find valid position.");
    }   
  },
  
  hideDraggingShadow: function() {
    this.draggingSpriteShadow.position = new Phaser.Point(
            -this.draggingSpriteShadow.width,
            -this.draggingSpriteShadow.height
        );  
  },
  
  /* Test whether the group being dragged overlaps with platforms,
   * active blocks, or the player
   */
  overlapsWithActiveObjects: function(group) {
    group.enableBody = true;
    var overlapsWithPlatforms = this.game.physics.arcade.overlap(group, this.platforms);
    var overlapsWithActive = this.game.physics.arcade.overlap(group, this.activeBlocks);
    var overlapsWithPlayer = this.game.physics.arcade.overlap(group, this.player);
    return (overlapsWithPlatforms || overlapsWithActive || overlapsWithPlayer);
  },

  spritesOverlap: function(sprite1, sprite2) {
    // Checks if the bounding boxes of two sprites overlap
    var left1 = sprite1.x, 
      left2 = sprite2.x,
      right1 = sprite1.x + sprite1.width,
      right2 = sprite2.x + sprite2.width,
      top1 = sprite1.y,
      top2 = sprite2.y,
      bottom1 = sprite1.y + sprite1.height,
      bottom2 = sprite2.y + sprite2.height;
        
    var overlapHorizontally = ((left1 < left2 && right1 >= left2) ||
                               (left1 >= left2 && right2 > left1));
    var overlapVertically = ((top1 < top2 && bottom1 >= bottom2) ||
                             (top1 >= top2 && bottom2 > bottom1));
    return overlapHorizontally && overlapVertically;
  },

  draggingSpriteOverlaps: function() {
      return this.overlapsWithActiveObjects(this.dragShadowBlocks);
  },
    
  draggingSpriteShadowOverlaps: function() {
    // return this.overlapsWithActiveObjects(this.draggingBlocks);
    // Phaser doesn't respond to recent changes in position. That is,
    // if we change a sprite's position and then immediately check if it
    // overlaps, it still uses the old position. so let's do this manually.
    var opposingGroups = [this.platforms, this.activeBlocks];
    for (var i = 0; i < opposingGroups.length; i++) {
        for (var c = 0; c < opposingGroups[i].children.length; c++) {
            if (this.spritesOverlap(this.draggingSpriteShadow, opposingGroups[i].children[c])) {
                return false;
            }
        }
    }
    if (this.spritesOverlap(this.draggingSpriteShadow, this.player)) {
        return false;
    } else {
        return true;
    }
  },
    
  /* Get the star */
  collectStar: function (player,star) {
      star.kill();
  },
  /**
  endTimer : function() {
      this.timer.stop();  
  },
  */
  /**
   * Core update loop. Handles collision checks and player input.
   *
   * @method update
   */
  update: function () {
    //  Handle collisions
    this.game.physics.arcade.collide(this.player, this.platforms);
    this.game.physics.arcade.collide(this.player, this.activeBlocks);
    this.game.physics.arcade.collide(this.platforms, this.activeBlocks);
    this.game.physics.arcade.collide(this.activeBlocks, this.activeBlocks);
    this.game.physics.arcade.collide(this.stars, this.platforms);
    this.game.physics.arcade.collide(this.stars, this.activeBlocks);
    this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
    this.game.physics.arcade.collide(this.draggingBlocks, this.activeBlocks);
   
    
    // Handle overlaps of sprites
    if (this.draggingSprite !== null) {
        if (this.draggingSpriteOverlaps()) {
            this.displayDraggingShadow();
        } else {
            this.hideDraggingShadow();
        }
    }

    if (this.cursors.left.isDown) {
      //  Move to the left
      this.player.body.velocity.x = -150;
      this.player.animations.play('left');
      this.player.anchor.setTo(.5, 1); //so it flips around its middle
      this.player.scale.x = 0.1; //facing default direction

    } else if (this.cursors.right.isDown) {
      //  Move to the right
      this.player.body.velocity.x = 150;
      this.player.animations.play('right');
      this.player.anchor.setTo(.5, 1); //so it flips around its middle
      this.player.scale.x = -0.1; //facing opposite direction
    } else {
      //  Stand still
      this.player.body.velocity.x = 0;
      this.player.animations.stop();
      this.player.frame = 0;
    }

    //  Allow the player to jump if they are touching the ground.
    // Let's hack this whenever we're free and jump up infinitely
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -350;
    }
  }
};



