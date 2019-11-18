import  { Feed } from "./model/feed.js";

import { ComponentStrings } from "./components/generated/components.js";

var Vue = require('vue/dist/vue.js')

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
  current: undefined
}

feeds.forEach(f => {
  f.setAsCurrent = function() {
    viewmodel.current = f
    f.activate()
  }
})

var vapp = new Vue({
  el: '#main',
  data: {
    thing: "Moikka!",
    viewmodel: viewmodel
  }
})

feeds[0].setAsCurrent()
