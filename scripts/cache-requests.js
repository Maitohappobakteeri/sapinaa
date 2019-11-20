var fs = require('fs');
var fetch = require("node-fetch");
var colors = require('colors');

function readJSON(filename) {
  return JSON.parse(fs.readFileSync(filename, 'utf8'));
}

var urls = readJSON("./test/testfeeds.json")
  .map(o => o.url);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function cacheFeeds(urls) {
  console.log("Creating feed response cache");
  let responses = {};

  console.log("Found following URLs");
  console.log(urls);
  for (let i in urls) {
    let url = urls[i];
    console.log(
      "Fetching " + (parseInt(i) + 1) + "/" + urls.length
      + " " + url.blue
    );
    let response = await fetch(url).then(response => response.text());
    responses[url] = response;
    await sleep(2000);
  }

  fs.writeFile("./test/testfeedsdata.json", JSON.stringify(responses),
    function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("Wrote requests to cache");
  });
}

function getCachedResponse(url) {
  console.log("Returning cached response for " + url);
  return cachedResponses[url];
}

cacheFeeds(urls);
