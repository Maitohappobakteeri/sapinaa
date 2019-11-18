
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
}

export { Feed, FeedItem }
