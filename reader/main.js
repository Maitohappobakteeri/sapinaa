import * as Project from "./project.js";
import  { loadTestFeeds } from "./models/feeds.js";
import { FeedListPresenter } from "./presenters/feed-list-presenter.js";
import { AppPresenter } from "./presenters/app-presenter.js";
import { cacheFeeds } from "./debug-feed-cache.js";
import { Transitions } from "./transitions.js";
import { ComponentStrings } from "./views/generated/components.js";

var Vue = require('vue/dist/vue.js');

ComponentStrings.forEach(c => {
  Vue.component(c.name, {
    props: c.props,
    template: c.template
  });
});

Vue.mixin({
  data: function() {
    return {
      get Transitions() {
        return Transitions;
      },
      get Project() {
        return Project;
      }
    };
  }
});

let feeds = loadTestFeeds("test/testfeeds.json");
let presenter = new AppPresenter(
  new FeedListPresenter(feeds),
  feeds.feeds[0]
);

var vapp = new Vue({
  el: '#main',
  data: {
    presenter: presenter
  }
});

presenter.registerEvents();
