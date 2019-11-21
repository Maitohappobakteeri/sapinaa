import { TransitionEmitter } from "./transitions.mjs";

export class AppUI {
  constructor(feedList) {
    this.feeds = feedList;
    this.activateFeed(this.feeds.defaultFeed);
  }

  activateFeed(feed) {
    this.current = feed;
    console.log(feed);
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
