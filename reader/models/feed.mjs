import * as Project from "~/project.mjs";
import { FeedItem } from "./feed-item.mjs";
import { parseXML } from "../communication/xml-query.mjs";

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

      let text = undefined;
      if (!Project.isDebug) {
        console.log("Fetching rss feed from " + this.url);
        text = await fetch(this.url).then(response => response.text());
      }
      else {
        text = getCachedResponse(this.url);
      }

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

  return item;
}

import cachedResponses from "~/../test/testfeedsdata.json";
function getCachedResponse(url) {
  console.log("Returning cached response for " + url);
  return cachedResponses[url];
}

export { Feed, FeedItem };
