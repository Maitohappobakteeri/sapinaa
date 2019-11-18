import { parseXML } from "../xml-query.js"
import { FeedItem } from "./feed-item.js"

import { getCachedResponse } from "../debug-feed-cache.js"

function processRSSResponse(xmlString) {
  let items = parseXML(xmlString)
    .firstWithName("rss")
    .firstWithName("channel")
    .elementsWithName("item")
    .map(e => e
      .firstWithName("title")
      .firstWithType("text")
      .text)
  return items;
}

class Feed {
    constructor(title, url) {
      this.title = title
      this.url = url
      this.items = []
    }

    async activate() {
      if (this.items.length !== 0) {
        console.log("Items already fetched")
        return;
      }

      // console.log("Fetching rss feed from " + this.url)
      // let text = await fetch(this.url).then(response => response.text())
      let text = getCachedResponse(this.url)
      processRSSResponse(text)
        .forEach(title => this.items.push(new FeedItem(title)))
    }

    setAsCurrent() {
      console.error("Unbinded")
    }
}

export { Feed, FeedItem }
