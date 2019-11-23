import { TransitionEmitter } from "./transitions.mjs";
import { ActionEmitter } from "./actions.mjs";

export class AppUI {
  constructor(feedList) {
    this.current = undefined;
    this.feeds = feedList;
  }

  addFeed(feed) {
    this.feeds.addFeed(feed);

    if (!this.current) {
      this.activateFeed(this.feeds.defaultFeed);
    }
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

    ActionEmitter.on("action", (target, options) => {
      if (target ==  "save") {
        this.feeds.saveFeeds();
      }
    });

    ActionEmitter.on("action", (target, options) => {
      if (target ==  "delete") {
        this.feeds.deleteFeed(options.feed);
        this.activateFeed(this.feeds.defaultFeed);
      }
    });
  }
}
