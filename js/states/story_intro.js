/* The state where we explain that the boss was sleeping
 * and his milk was stolen.
 */
 
var CleverCat = CleverCat || {};

CleverCat.StoryIntro = function(){};

CleverCat.StoryIntro.prototype = {
  
  
  create: function() {
    this.add.sprite(0, 0, 'sky');
    
    // Simple informative text
    var title = this.add.text(50, 50, 'This is the story intro state', { font: "30px Arial", fill: "#ff0044", align: "center" });
    
    // Creating the "Tutorial" text button that switches to the LevelIntro state
    var tutorial = this.add.text(50, 200, 'Tutorial', { font: "65px Arial", fill: "#ff0044", align: "center" });
    tutorial.events.onInputDown.add(this.startTutorial, this);
    
    
    // enable input for all the "text buttons"
    tutorial.inputEnabled = true;
    
  },
  
  startTutorial: function() {
    this.state.start('Tutorial');
  }
};
