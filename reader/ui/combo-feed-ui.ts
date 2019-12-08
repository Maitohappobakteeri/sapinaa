import { FeedItemUI } from "./feed-item-ui";
import { SourceArray } from "../data/derived-array";
import { FeedUI } from "./feed-ui";
import { Feed } from "../data/feed";

export class ComboFeedUI {
  title: string;
  _items: SourceArray<FeedItemUI>;

  constructor(title: string) {
    this.title = title;

    this._items = new SourceArray<FeedItemUI>(
      (item, next) => item.item.pubDate >= next.item.pubDate
    );
  }

  get items() {
    return this._items.array;
  }

  async activate() {
    //this.isActive = true;
  }

  onFeedAdded(feed: Feed) {
    feed.items.subscribeWith(this._items, e => new FeedItemUI(e));
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
