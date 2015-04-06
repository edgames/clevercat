/* The game complete state
 */
 
var CleverCat = CleverCat || {};

CleverCat.GameComplete = function(){};

CleverCat.GameComplete.prototype = {

  create: function() {
    // TODO
    this.state.start('MainMenu');
  },
};