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
    let diff = Date.now() - this.item.pubDate.getTime();
    let hours = Math.floor(diff / (1000 * 60 * 60));
    let minutes = Math.floor(diff / (1000 * 60)) % 60;

    if (hours !== 0) {
      return hours + "h";
    } else {
      return minutes + "min";
    }
  }

  openWebPage() {
    console.log("Opening feed item in browser", this.item.link);
    Actions.openUrl(this.item.link);
  }
}
