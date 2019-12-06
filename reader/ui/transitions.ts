import { EventEmitter } from "events";
import { FeedUI } from "./feed-ui";

export const TransitionEmitter = new EventEmitter();

export const Transitions = {
  transitionToFeedView: function(feed: FeedUI) {
    setImmediate(() =>
      TransitionEmitter.emit("transition", "feed", { feed: feed })
    );
  }
};
