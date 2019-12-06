import * as Project from "../project";
import { FeedItem } from "./feed-item";
import { parseXML } from "../communication/xml-query";
import { Storage } from "../storage";
import { createSourceArray } from "./derived-array";

class Feed {
  uid: number;
  customTitle: string | undefined;
  url: string;

  items = createSourceArray();
  title = "New Feed";
  lastFetched: Date | null = null;

  lastCached = new Date(Date.now());
  cacheCounter = 0;

  constructor(config) {
    this.uid = config.uid;
    this.customTitle = config.customTitle;
    this.url = config.url;

    this.items = createSourceArray();
    this.title = "New Feed";
    this.lastFetched = null;

    this.lastCached = new Date(Date.now());
    this.cacheCounter = 0;
  }

  async load() {
    let cachedInfo = await Storage.load(this.feedInfoCacheName);
    if (cachedInfo !== undefined) {
      this.title = cachedInfo.title;
      this.lastFetched =
        (cachedInfo.lastFetched && new Date(cachedInfo.lastFetched)) || null;
      this.lastCached =
        (cachedInfo.lastCached && new Date(cachedInfo.lastCached)) || null;
      this.cacheCounter = cachedInfo.cacheCounter;
    }

    let cachedItems = await this.readCache();
    cachedItems.forEach(i => this.addItem(i));
  }

  addItem(newItem) {
    // Skip duplicates
    if (this.items.some(i => i.guid === newItem.guid)) {
      return;
    }

    if (newItem.cacheCounter === null) {
      newItem.cacheCounter = this.cacheCounter;
    }

    // Sort by descending date
    let i = this.items.findIndex(item => newItem.pubDate >= item.pubDate);
    if (i === -1) {
      i = this.items.length;
    }
    this.items.insert(i, newItem);
  }

  async refresh() {
    let response = await this.fetch();
    this.lastFetched = new Date(Date.now());

    response.items.forEach(i => this.addItem(i));
    this.title = response.title;

    this.writeCache();
  }

  async fetch() {
    if (!Project.useCacheOnly) {
      console.log("Fetching rss feed from " + this.url);
      let text = await fetch(this.url).then(response => response.text());
      let rssResponse = parseRSSResponse(text);
      return rssResponse;
    } else {
      let emptyResponse = {
        title: this.title,
        items: []
      };
      return emptyResponse;
    }
  }

  async readCache() {
    // TODO: Clean this
    let data = [];
    let cCounter = this.cacheCounter;
    for (; cCounter >= 0; cCounter--) {
      let cache = await Storage.load(this.feedItemCacheNameFor(cCounter));
      if (cache !== undefined) {
        data = data.concat(cache);
      }
    }

    data.forEach(i => (i.pubDate = new Date(i.pubDate)));

    return data;
  }

  writeCache() {
    Storage.save(this.feedInfoCacheName, {
      title: this.title,
      lastFetched: this.lastFetched,
      lastCached: this.lastCached,
      cacheCounter: this.cacheCounter
    });

    let newItems = this.items.filter(i => i.cacheCounter === this.cacheCounter);

    Storage.save(this.feedItemCacheNameFor(this.cacheCounter), newItems);

    if (Date.now() - this.lastCached.getTime() > 6 * 60 * 60 * 1000) {
      this.cacheCounter += 1;
      this.lastCached = new Date(Date.now());
    }
  }

  get feedInfoCacheName() {
    return "feedCache/" + this.uid + "-cached-info.json";
  }

  feedItemCacheNameFor(cacheCounter) {
    return "feedCache/" + this.uid + "-" + cacheCounter + "-feed-cache.json";
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
    .firstWithType("text").text;

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

  item.content = e
    .firstWithName("content:encoded")
    .firstWithType("cdata").cdata;
  if (item.content !== undefined) {
    item.content = item.content.replace(/src=\"\/\//g, 'src="http://');
  } else {
    item.content = "";
  }

  let enclosure = e.firstWithName("enclosure");
  item.imageURL = enclosure && enclosure.attributes && enclosure.attributes.url;

  item.pubDate = new Date(
    e.firstWithName("pubDate").firstWithType("text").text
  );

  item.guid = e.firstWithName("guid").firstWithType("text").text;

  return item;
}

export { Feed };
