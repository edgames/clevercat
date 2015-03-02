var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game');

var PhaserGame = function (game) {

	this.player = null;
	this.platforms = null;
	this.cursors = null;
	this.stars = null;
	this.score = 0;
	this.scoreText = null;
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
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    },

    create: function () {

        //  We're going to be using physics, so enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        this.add.sprite(0, 0, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.add.group();

        //  We will enable physics for any object that is created in this group
        this.platforms.enableBody = true;

        // Here we create the ground.
        var ground = this.platforms.create(0, game.world.height - 64, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //  Now let's create two ledges
        var ledge = this.platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;

        ledge = this.platforms.create(-150, 250, 'ground');
        ledge.body.bounce.y = 0.2;
        ledge.body.gravity.y = 10;
        ledge.body.immovable = true;

        // The player and its settings
        this.player = game.add.sprite(32, game.world.height - 150, 'dude');

        //  We need to enable physics on the player
        this.physics.arcade.enable(this.player);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0.05;
        this.player.body.gravity.y = 800;
        this.player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);

        //  Finally some stars to collect
        this.stars = game.add.group();

        //  We will enable physics for any star that is created in this group
        this.stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++)
        {
            //  Create a star inside of the 'stars' group
            var star = this.stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            star.body.gravity.y = 300;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        //  The score
        this.scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //  Our controls.
        this.cursors = game.input.keyboard.createCursorKeys();

    },

    collectStar: function (player, star) {
    
        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;
    },

    /**
     * Core update loop. Handles collision checks and player input.
     *
     * @method update
     */
    update: function () {
        //  Collide the player and the stars with the platforms
        this.game.physics.arcade.collide(this.player, this.platforms);
        this.game.physics.arcade.collide(this.stars, this.platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            //  Move to the left
            this.player.body.velocity.x = -150;
            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            //  Move to the right
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');
        }
        else
        {
            //  Stand still
            this.player.animations.stop();

            this.player.frame = 4;
        }
    
        //  Allow the player to jump if they are touching the ground.
        if (this.cursors.up.isDown && this.player.body.touching.down) {
        	this.player.body.velocity.y = -350;
        }
    }
};

game.state.add('Game', PhaserGame, true);
