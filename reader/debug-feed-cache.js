var fs = require('fs');

var dir = './cache';
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

function readJSON(filename) {
  return JSON.parse(fs.readFileSync(filename, 'utf8'))
}

var cachedResponses = readJSON("./cache/requestDebugCache")

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function cacheFeeds(feeds) {
  console.log("Creating feed response cache")
  let responses = {}
  console.log(feeds)
  for (let i in feeds) {
    let feed = feeds[i]
    let response = await fetch(feed.url).then(response => response.text());
    responses[feed.url] = response;
    await sleep(2000);
  }

  fs.writeFile("./cache/requestDebugCache", JSON.stringify(responses),
    function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("Wrote requests to cache");
  })
}

function getCachedResponse(url) {
  console.log("Returning cached response for " + url)
  return cachedResponses[url]
}

export { cacheFeeds, getCachedResponse }
