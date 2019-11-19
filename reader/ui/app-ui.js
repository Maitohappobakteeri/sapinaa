import { TransitionEmitter } from "../transitions.js";

export class AppUI {
  constructor(feedList, current) {
    this.feeds = feedList;
    this.activateFeed(current);
  }

  activateFeed(feed) {
    this.current = feed;
    feed.refresh();
  }

  registerEvents() {
    TransitionEmitter.on("transition", (target, options) => {
      if (target ==  "feed") {
        this.activateFeed(options.feed);
      }
    });
  }
}
