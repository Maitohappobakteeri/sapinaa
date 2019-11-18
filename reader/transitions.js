const EventEmitter = require('events');

const TransitionEmitter = new EventEmitter();

function transitionToFeedView(feed) {
  TransitionEmitter.emit("transition", "feed", {feed: feed});
}

export { TransitionEmitter, transitionToFeedView };
