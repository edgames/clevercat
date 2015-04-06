function BlockManager(game) {
    this.game = game;
    
    /* Blocks displayed at the top of the screen, pre-drag */
    this.storeBlocks = game.add.group();
    
    /* Blocks currently being dragged */
    this.draggingBlocks = game.add.group();
    this.draggingBlocks.enableBody = true;
    this.draggingSprite = null;
    
    /* Blocks in the game world */
    this.activeBlocks = game.add.group();
    this.activeBlocks.enableBody = true;
    
    this.replenishStoreBlocks();
    
}

BlockManager.prototype = {
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
        this.storeBlocks.remove(sprite);
        this.draggingBlocks.add(sprite);
        this.draggingSprite = sprite;
        var manager = this;
    },
  
    onDragStop: function(sprite, pointer) {
        sprite.input.disableDrag();
        sprite.enableBody = true;
        this.considerPlacingBlock(this.draggingSprite);
        this.draggingSprite = null;
        this.draggingBlocks.remove(sprite);
        this.replenishStoreBlocks();
    },
    
    /* If the block has a valid placement, prompt the user with a question.
     * Otherwise, inform the user the placement is invalid.
     */
    considerPlacingBlock: function(block) {
        var manager = this;
        if (this.isValidPlacement(block)) {
            this.promptForQuestion(function() {
                manager.addActiveBlock(block);   
            });
        } else {
            // anything
        }
    },
    
    /* Prompt the user for a question. If the user answers correctly,
     * call onCorrect when done.
     */
    promptForQuestion: function(onCorrect) {
        // TODO
        onCorrect();
    },
    
    addActiveBlock: function(block) {
        //By default Sprites won't add themselves to any physics system and their physics body will be `null`.
        // To enable them for physics you need to call `game.physics.enable(sprite, system)` where `sprite` is this object
        //and `system` is the Physics system you want to use to manage this body. Once enabled you can access all physics related properties via `Sprite.body`.
        this.game.physics.enable(block, Phaser.Physics.ARCADE);
        block.body.gravity.y = 200; 
        this.activeBlocks.add(block);
    },

    
    /* Return true if this.draggingSprite can be released where it
     * currently is and false otherwise
     */
    isValidPlacement: function(block) {
        block.enableBody = true;
        var overlapsWithPlatforms = this.game.physics.arcade.overlap(block, this.game.platforms);
        var overlapsWithActive = this.game.physics.arcade.overlap(block, this.activeBlocks);
        var overlapsWithPlayer = this.game.physics.arcade.overlap(block, this.game.cat.sprite);
        return !(overlapsWithPlatforms || overlapsWithActive || overlapsWithPlayer);
    }
}