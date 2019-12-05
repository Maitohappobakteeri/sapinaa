import { Actions } from "./actions";
import { FeedItem } from "../data/feed-item";

export class FeedItemUI {
  item: FeedItem;

  constructor(item: FeedItem) {
    this.item = item;
  }

  get headline() {
    return this.item.headline;
  }

  get description() {
    return this.item.description;
  }

  get timeSincePublish() {
    return Math.floor((Date.now() - this.item.pubDate.getTime()) / (1000 * 60 * 60)) + "h";
  }

  openWebPage() {
    console.log("Opening feed item in browser", this.item.link);
    Actions.openUrl(this.item.link);
  }
};
