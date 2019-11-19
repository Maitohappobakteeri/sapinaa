import { FeedItem } from "./feed-item.js";
import { getCachedResponse } from "./debug-feed-cache.js";
import { parseXML } from "../communication/xml-query.js";

class Feed {
    constructor(title, url) {
      this.title = title;
      this.url = url;
      this.items = [];
    }

    async refresh() {
      if (this.items.length !== 0) {
        console.log("Items already fetched");
        return;
      }

      // console.log("Fetching rss feed from " + this.url)
      // let text = await fetch(this.url).then(response => response.text())
      let text = getCachedResponse(this.url);
      parseRSSResponse(text)
        .forEach(item => this.items.push(item));
    }
}

function parseRSSResponse(xmlString) {
  return parseXML(xmlString)
    .firstWithName("rss")
    .firstWithName("channel")
    .elementsWithName("item")
    .map(e => parseFeedItem(e));
}

function parseFeedItem(e) {
  let item = new FeedItem();
  item.headline = e.firstWithName("title").firstWithType("text").text;
  item.description = e.firstWithName("description").firstWithType("text").text;
  item.link = e.firstWithName("link").firstWithType("text").text;
  // item.content = e.firstWithName("content")
  //                 .firstWithType("cdata").cdata;
  return item;
}

export { Feed, FeedItem };
