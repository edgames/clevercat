var CleverCat = CleverCat || {};

// loading the game assets
CleverCat.MainMenu = function(){};

CleverCat.MainMenu.prototype = {

  create: function() {
    this.add.sprite(0, 0, 'sky');
    
    button = this.add.button(50, 50, 'star', this.switchstate, this);
  
  },
  
  switchstate: function() {
     this.state.start('LevelPlay');
  }
  
  
};