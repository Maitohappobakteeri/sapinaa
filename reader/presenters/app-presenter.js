
class AppPresenter {
  constructor(feedList, current) {
    this.feeds = feedList;
    this.activateFeed(current);
  }

  activateFeed(feed) {
    this.current = feed;
    feed.refresh();
  }
}

export { AppPresenter };
