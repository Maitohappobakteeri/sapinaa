import { TransitionEmitter } from "./transitions.mjs";

export class AppUI {
  constructor(feedList) {
    this.feeds = feedList;
  }

  activateFeed(feed) {
    this.current = feed;
    this.feeds.activateFeed(feed);
  }

  registerEvents() {
    TransitionEmitter.on("transition", (target, options) => {
      if (target ==  "feed") {
        this.activateFeed(options.feed);
      }
    });
  }
}
