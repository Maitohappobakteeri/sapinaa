import { FeedItemUI } from "./feed-item-ui";
import { Actions } from "./actions";
import { createSortedDerivedArray } from "../data/derived-array";

export class ComboFeedUI {
  title: string;
  items: FeedItemUI[];

  constructor(title) {
    this.title = title;

    this.items = createSortedDerivedArray(
      item => new FeedItemUI(item),
      (item, next) => item.item.pubDate >= next.item.pubDate,
      (arr, item) => true
    );
  }

  async activate() {
    //this.isActive = true;
  }

  onFeedAdded(feed) {
    feed.items.registerSortedArray(this.items);
  }

  onFeedDeleted(feed) {
    console.log("TODO: Unregister sorted array");
  }

  async refresh(feeds) {}

  deactivate() {
    //this.isActive = false;
  }

  needsRefresh() {
    return false;
  }
}
