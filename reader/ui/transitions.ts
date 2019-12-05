import { EventEmitter } from 'events';

export const TransitionEmitter = new EventEmitter();

export const Transitions = {
  transitionToFeedView: function(feed) {
    setImmediate(() =>
      TransitionEmitter.emit("transition", "feed", {feed: feed}));
  }
};
