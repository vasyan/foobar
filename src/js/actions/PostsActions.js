var Reflux = require('reflux');

// module.exports = {

// 	addItem: function(text) {
// 		AppDispatcher.handleViewAction({
// 			type: Constants.ActionTypes.ADD_TASK,
// 			text: text
// 		});
// 	},

// 	clearList: function() {
// 		console.warn('clearList action not yet implemented...');
// 	},

// 	getPosts(url) {

// 	}


// };


  // Each action is like an event channel for one specific event. Actions are called by components.
  // The store is listening to all actions, and the components in turn are listening to the store.
  // Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

  var PostsActions = Reflux.createActions([
    // "clearCompleted", // called by button in TodoFooter
    "getPosts"
  ]);

module.exports = PostsActions;
