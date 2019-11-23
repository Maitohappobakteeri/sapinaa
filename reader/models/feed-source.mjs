import * as Project from "~/project.mjs";
import { FeedItem } from "./feed-item.mjs";
import { parseXML } from "../communication/xml-query.mjs";
import { Storage } from "../storage.mjs";

export class FeedSource {
  constructor(url) {
    this.url = url;
    this.title = undefined;
    // this.oldest = null;
  }

  async fetch(maxAmount) {
    let text = undefined;
    if (!Project.isDebug) {
      console.log("Fetching rss feed from " + this.url);
      text = await fetch(this.url).then(response => response.text());
    }
    else {
      text = getCachedResponse(this.url);
    }

    let rssResponse = parseRSSResponse(text);

    this.title = rssResponse.title;
    return rssResponse.items;
  }
};

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

  return item;
}

import cachedResponses from "~/../test/testfeedsdata.json";
function getCachedResponse(url) {
  console.log("Returning cached response for " + url);
  return cachedResponses[url];
}
