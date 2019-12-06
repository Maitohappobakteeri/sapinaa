const fs = require("fs");
const path = require("path");
const { app } = require("electron");

let dir = app.getPath("userData");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

var cacheDir = path.join(dir, "feedCache");
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

function readJSON(filename) {
  return JSON.parse(fs.readFileSync(filename, "utf8"));
}

function load(name) {
  let filePath = path.join(dir, name);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  return readJSON(path.join(dir, name));
}

function save(name, data) {
  let filePath = path.join(dir, name);
  fs.writeFile(filePath, JSON.stringify(data), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("Wrote file", name);
  });
}

exports.load = load;
exports.save = save;
