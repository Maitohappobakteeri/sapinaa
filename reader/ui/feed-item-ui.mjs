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

  openWebPage() {
    console.log("Opening feed item in browser", this.item.link);
    Actions.openUrl(this.item.link);
  }
};
