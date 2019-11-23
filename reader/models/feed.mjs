import { FeedSource } from "./feed-source.mjs";
import { createSourceArray } from "./derived-array.mjs";

class Feed {
    constructor(uid, url, title) {
      this.uid = uid;
      this.title = "New Feed";
      this.customTitle = title;
      this.url = url;
      this.items = createSourceArray();
      this.source = new FeedSource(url);
    }

    async refresh() {
      if (this.items.length !== 0) {
        console.log("Items already fetched");
        return;
      }

      let newItems = await this.source.fetch(20);
      newItems.forEach(i => this.items.push(i));
      this.title = this.source.title;
    }
}

export { Feed };
