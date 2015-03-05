var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game');

var PhaserGame = function (game) {

	this.player = null;
	this.platforms = null;
	this.cursors = null;
	this.score = 0;
	this.scoreText = null;
	this.blocks = null;
	this.storeBlocks = null;
};

PhaserGame.prototype = {

    init: function () {
        this.game.world.setBounds(0, 0, 640, 480);
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 200;
    },

    preload: function () {

        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.spritesheet('cat', 'assets/catwalk.png', 400, 200);
        this.load.image('topbar', 'assets/Plain Block.png');
        this.load.image('cliff', 'assets/Grass Block.png');
        this.load.image('crate', 'assets/Wood Block.png');

    },

    create: function () {

        //  We're going to be using physics, so enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);

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
        cliff.body.immovable = true;

        // The player and its settings
        this.player = game.add.sprite(32, game.world.height - 150, 'cat');
        this.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.05;
        this.player.body.gravity.y = 800;
        this.player.body.collideWorldBounds = true;
        this.player.scale.setTo(0.1, 0.1); // The cat sprite is far too large...
        this.player.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, true);
        this.player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, true);
  
        // the bar at the top of the game
        var topbar = this.add.sprite(0, -13, 'topbar');
        topbar.scale.setTo(10, 0.3);
        
        this.activeBlocks = this.add.group();
        this.storeBlocks = this.add.group();
        var topbarBlock = this.storeBlocks.create(0, 0, 'crate');
        topbarBlock.scale.setTo(0.3, 0.3);
        //  Enable input and allow for dragging for the blocks sprite
        topbarBlock.inputEnabled = true;
        topbarBlock.input.enableDrag();
        topbarBlock.events.onDragStart.add(this.onDragStart, this);
        topbarBlock.events.onDragStop.add(this.onDragStop, this);

        // Example text:
        // this.scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        


        this.cursors = game.input.keyboard.createCursorKeys();

    },
    
    onDragStart: function(sprite, pointer) {
        console.log("drag starting");
        
    },
    
    onDragStop: function(sprite, pointer) {
        console.log("drag stopping");
        
    },


    /**
     * Core update loop. Handles collision checks and player input.
     *
     * @method update
     */
    update: function () {
        //  Collide the player the platforms
        this.game.physics.arcade.collide(this.player, this.platforms);

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
        if (this.cursors.up.isDown && this.player.body.touching.down) {
        	this.player.body.velocity.y = -350;
        }
    }
};

game.state.add('Game', PhaserGame, true);
