/* The level intro state
 */
 
var CleverCat = CleverCat || {};

CleverCat.LevelIntro = function(){};

CleverCat.LevelIntro.prototype = {

  create: function() {
    this.add.sprite(0, 0, 'sky');
    
    // Adding "Level X" text, not a button
    var levelX = this.add.text(50, 50, 'Level X', { font: "65px Arial", fill: "#ff0044", align: "center" });
    
    // Creating the "Play Game" text button that switches to the LevelIntro state
    var playlevel = this.add.text(50, 200, 'Play Level', { font: "65px Arial", fill: "#ff0044", align: "center" });
    playlevel.events.onInputDown.add(this.startLevelPlay, this);
    
    
    // enable input for all the "text buttons"
    playlevel.inputEnabled = true;
    
  },
  
  startLevelPlay: function() {
    this.state.start('LevelPlay');
  },

  
  
};