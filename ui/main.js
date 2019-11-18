import  { Feed, FeedItem } from "./feed.js";

import { ComponentStrings } from "./components/generated/components.js";

var Vue = require('vue/dist/vue.js')
var convert = require('xml-js');

ComponentStrings.forEach(c => {
  Vue.component(c.name, {
    props: c.props,
    template: c.template
  })
});

var fs = require('fs');
var feeds = JSON.parse(fs.readFileSync('test/testfeeds.json', 'utf8'))
  .map(f => new Feed(f.title, f.url));

let viewmodel = {
  feeds: feeds,
  current: feeds[0]
}

var vapp = new Vue({
  el: '#main',
  data: {
    thing: "Moikka!",
    viewmodel: viewmodel
  }
})

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
  items.forEach(i => viewmodel.current.items.push(new FeedItem(i)))
}

fetch(viewmodel.current.url)
  .then(response => response.text()
    .then(txt => processRSSResponse(txt)))
