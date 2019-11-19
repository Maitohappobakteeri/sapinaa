const EventEmitter = require('events');

export const TransitionEmitter = new EventEmitter();

export const Transitions = {
  transitionToFeedView: (feed) => {
    TransitionEmitter.emit("transition", "feed", {feed: feed});
  }
};
