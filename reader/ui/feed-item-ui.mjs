import { Actions } from "./actions.mjs";

export class FeedItemUI {
  constructor(feedItem) {
    this.item = feedItem;
  }

  get headline() {
    return this.item.headline;
  }

  get description() {
    return this.item.description;
  }

  get timeSincePublish() {
    return Math.floor((new Date(Date.now()) - this.item.pubDate) / (1000 * 60 * 60)) + "h";
  }

  openWebPage() {
    console.log("Opening feed item in browser", this.item.link);
    Actions.openUrl(this.item.link);
  }
};
