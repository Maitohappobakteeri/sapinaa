import { FeedItemUI } from "./feed-item-ui";
import { createSortedDerivedArray } from "../data/derived-array";
import { FeedItem } from "../data/feed-item";
import { FeedUI } from "./feed-ui";
import { Feed } from "../data/feed";

export class ComboFeedUI {
  title: string;
  items: FeedItemUI[];

  constructor(title: string) {
    this.title = title;

    this.items = createSortedDerivedArray(
      (item: FeedItem) => new FeedItemUI(item),
      (item: FeedItemUI, next: FeedItemUI) =>
        item.item.pubDate >= next.item.pubDate,
      (_arr: FeedItemUI[], _item: FeedItemUI) => true
    );
  }

  async activate() {
    //this.isActive = true;
  }

  onFeedAdded(feed: Feed) {
    feed.items.registerSortedArray(this.items);
  }

  onFeedDeleted(feed: FeedUI) {
    console.log("TODO: Unregister sorted array");
  }

  async refresh(feeds: FeedUI[]) {}

  deactivate() {
    //this.isActive = false;
  }

  needsRefresh() {
    return false;
  }
}
