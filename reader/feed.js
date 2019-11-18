
var convert = require('xml-js');

function wrapXML(parsedXML) {
  parsedXML.firstWithName = function(name) {
    return wrapXML(parsedXML.elements.filter(e => e.name == name)[0])
  }

  parsedXML.firstWithType = function(type) {
    return wrapXML(parsedXML.elements.filter(e => e.type == type)[0])
  }

  parsedXML.elementsWithName = function(name) {
    return parsedXML.elements
      .filter(e => e.name == name)
      .map(e => wrapXML(e))
  }

  return parsedXML
}

function parseXML(xml) {
  let data = JSON.parse(convert.xml2json(xml))
  return wrapXML(data)
}

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

class FeedItem {
  constructor(headline) {
    this.headline = headline
  }
}

class Feed {
    constructor(title, url) {
      this.title = title
      this.url = url
      this.items = []
    }

    activate() {
      if (this.items.length !== 0) {
        console.log("Items already fetched")
        return;
      }

      fetch(this.url)
        .then(response => response.text()
          .then(txt => processRSSResponse(txt)
            .forEach(title => this.items.push(new FeedItem(title)))))
    }

    setAsCurrent() {
      console.error("Unbinded")
    }
}

export { Feed, FeedItem }
