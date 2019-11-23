import * as Project from "~/project.mjs";
import { FeedItem } from "./feed-item.mjs";
import { parseXML } from "../communication/xml-query.mjs";
import { Storage } from "../storage.mjs";
import { createSourceArray } from "./derived-array.mjs";

class Feed {
    constructor(uid, lastFetched, url, title) {
      this.uid = uid;
      this.title = "New Feed";
      this.customTitle = title;
      this.url = url;
      this.items = createSourceArray();

      this.lastFetched = lastFetched;
    }

    async load() {
      let cachedItems = await this.readCache();
      cachedItems.forEach(i => this.addItem(i));
    }

    addItem(feedItem) {
      if (this.items.some(i => i.guid === feedItem.guid)) {
        // console.log("Skipping duplicate feed item:", feedItem.guid);
        return;
      }

      let i = 0;
      // TODO: Replace with findFirst
      while(i < this.items.length) {
        if (feedItem.pubDate >= this.items[i]) {
          break;
        }
        i += 1;
      }

      this.items.insert(i, feedItem);
    }

    async refresh() {
      let response = await this.fetch();
      response.items.forEach(i => this.addItem(i));
      this.title = response.title;

      this.writeCache();
      this.lastFetched = Date.now();
    }

    async fetch() {
      let text = undefined;

      // TODO: Option to disable fetch on debug
      if (!Project.isDebug || true) {
        console.log("Fetching rss feed from " + this.url);
        text = await fetch(this.url).then(response => response.text());
      }

      let rssResponse = parseRSSResponse(text);
      return rssResponse;
    }

    async readCache() {
      let data = await Storage.load(this.uid + "-feed-cache.json");
      if (data !== undefined) {
        return data;
      }
      return [];
    }

    writeCache() {
      Storage.save(this.uid + "-feed-cache.json", this.items);
    }
}

function parseRSSResponse(xmlString) {
  let xml = parseXML(xmlString);

  let items = xml
    .firstWithName("rss")
    .firstWithName("channel")
    .elementsWithName("item")
    .map(e => parseFeedItem(e));

  let title = xml
    .firstWithName("rss")
    .firstWithName("channel")
    .firstWithName("title")
    .firstWithType("text")
    .text;

  return {
    title: title,
    items: items
  };
}

function parseFeedItem(e) {
  let item = new FeedItem();
  item.headline = e.firstWithName("title").firstWithType("text").text;
  item.description = e.firstWithName("description").firstWithType("text").text;
  item.link = e.firstWithName("link").firstWithType("text").text;

  item.content = e.firstWithName("content:encoded")
                  .firstWithType("cdata").cdata;
  if (item.content !== undefined) {
    item.content = item.content.replace(/src=\"\/\//g, "src=\"http://");
  }
  else {
    item.content = "";
  }

  let enclosure = e.firstWithName("enclosure");
  item.imageURL = enclosure
    && enclosure.attributes
    && enclosure.attributes.url;

  item.pubDate = new Date(
    e.firstWithName("pubDate").firstWithType("text").text
  );

  item.guid = e.firstWithName("guid").firstWithType("text").text;

  return item;
}

export { Feed };
