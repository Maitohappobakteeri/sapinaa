
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
};
