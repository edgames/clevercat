/* The tutorial state
 */
 
var CleverCat = CleverCat || {};

CleverCat.Tutorial = function(){};

CleverCat.Tutorial.prototype = {

  create: function() {
    this.add.sprite(0, 0, 'sky');
    
    
    // Simple informative text
    var title = this.add.text(50, 50, 'This is the tutorial state', { font: "30px Arial", fill: "#ff0044", align: "center" });
    
    // Creating the "Play Game" text button that switches to the LevelIntro state
    var playnow = this.add.text(50, 200, 'Play Now!', { font: "65px Arial", fill: "#ff0044", align: "center" });
    playnow.events.onInputDown.add(this.startLevelPlay, this);
    
    
    // enable input for all the "text buttons"
    playnow.inputEnabled = true;
    
  },
  
  startLevelPlay: function() {
    this.state.start('LevelIntro');
  },

  
  
};