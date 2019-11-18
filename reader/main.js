import  { loadTestFeeds } from "./models/feeds.js";
import { FeedListPresenter } from "./presenters/feed-list-presenter.js";
import { AppPresenter } from "./presenters/app-presenter.js";
import { cacheFeeds } from "./debug-feed-cache.js";
import { TransitionEmitter, transitionToFeedView } from "./transitions.js";

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
      get transitionToFeedView() {
        return transitionToFeedView;
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
    thing: "Moikka!",
    presenter: presenter
  }
});

TransitionEmitter.on("transition", (target, options) => {
  if (target ==  "feed") {
    presenter.activateFeed(options.feed);
  }
});
