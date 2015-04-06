var CleverCat = CleverCat || {};

// loading the game assets
CleverCat.MainMenu = function(){};

CleverCat.MainMenu.prototype = {

  create: function() {
    this.add.sprite(0, 0, 'sky');
    
    
    // Creating the "Play Game" text button that switches to the LevelIntro state
    var play = this.add.text(50, 50, 'Play Game!', { font: "65px Arial", fill: "#ff0044", align: "center" });
    play.events.onInputDown.add(this.startLevelIntro, this);
    
    // Creating the "Tutorial" text button that switches to the story_intro state first, then the tutorial state
    var tutorial = this.add.text(50, 200, 'Tutorial!', { font: "65px Arial", fill: "#ff0044", align: "center" });
    tutorial.events.onInputDown.add(this.startStoryIntro, this);
    
    
    // enable input for all the "text buttons"
    play.inputEnabled = true;
    tutorial.inputEnabled = true;
    
  },
  
  startLevelIntro: function() {
    this.state.start('LevelIntro');
  },

  startStoryIntro: function() {
    this.state.start('StoryIntro')
  }
  
  
};