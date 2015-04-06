/* The login state
 */
 
var CleverCat = CleverCat || {};

CleverCat.Login = function(){};

CleverCat.Login.prototype = {

  create: function() {
    // TODO
    this.state.start('MainMenu');
  },
};