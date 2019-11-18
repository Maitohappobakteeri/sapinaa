import { ComponentStrings } from "./components/generated/components.js";

var Vue = require('vue/dist/vue.js')

function newFeed(name) {
  let feed = {}
  feed.name = name
  feed.onClick = function() { feed.name = ":)" }
  return feed
}

ComponentStrings.forEach(c => {
  Vue.component(c.name, {
    props: c.props,
    template: c.template
  })
});

var vapp = new Vue({
  el: '#main',
  data: {
    thing: "Moikka!",
    feeds: ["Local", "World", "Tech"].map(newFeed)
  }
})
