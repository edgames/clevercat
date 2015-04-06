var CleverCat = CleverCat || {};

CleverCat.LevelPlay = function(){
  this.cat = null;
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


CleverCat.LevelPlay.prototype = {
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
    var ground = this.platforms.create(0, this.game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2); //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.body.immovable = true;
    var cliff = this.platforms.create(this.game.world.width/2, 1*this.game.world.height/3, 'cliff');
    cliff.scale.setTo(3.3, 2);
    cliff.body.setSize(cliff.body.width, cliff.body.height-25, 0, 25);
    cliff.body.immovable = true;

    this.cat = new Cat(this);

    // the bar at the top of the game
    this.topbar = this.add.sprite(0, -13, 'topbar');
    this.topbar.scale.setTo(10, 0.3);
    
    this.blockManager = new BlockManager(this);
    
    this.milk = new Milk(this);
    //this.star = this.add.sprite(game.world.width - 50, 1*game.world.height/3, 'star');
  
    // Example text:
    // this.scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    
    this.timer = this.game.time.create();
    // this.startTimer = this.timer.add(this.Phaser.Timer.MINUTE * 2 + this.Phaser.Timer.SECOND * 30, this.endTimer, this);
    // this.timer.start();
    
    this.cursors = this.input.keyboard.createCursorKeys();

  },
  
  /* Test whether the group being dragged overlaps with platforms,
   * active blocks, or the player
   */
  overlapsWithActiveObjects: function(group) {

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
    if (this.spritesOverlap(this.draggingSpriteShadow, this.cat.sprite)) {
        return false;
    } else {
        return true;
    }
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
    this.game.physics.arcade.collide(this.cat.sprite, this.platforms);
    this.game.physics.arcade.collide(this.cat.sprite, this.blockManager.activeBlocks);
    this.game.physics.arcade.collide(this.platforms, this.blockManager.activeBlocks);
    this.game.physics.arcade.collide(this.blockManager.activeBlocks, this.blockManager.activeBlocks);
    this.game.physics.arcade.collide(this.milk, this.platforms);
    this.game.physics.arcade.collide(this.milk, this.blockManager.activeBlocks);
    this.game.physics.arcade.overlap(this.cat.sprite, this.milk, this.milk.drinkMilk, null);
    this.game.physics.arcade.collide(this.draggingBlocks, this.blockManager.activeBlocks);
    
    // Handle overlaps of sprites
    if (this.draggingSprite !== null) {
        if (this.draggingSpriteOverlaps()) {
            this.displayDraggingShadow();
        } else {
            this.hideDraggingShadow();
        }
    }


    this.cat.handleArrowKeys(this.cursors);
  }
};