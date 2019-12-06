#! /usr/bin/env node
const fs = require('fs');

let pkg = JSON.parse(fs.readFileSync(process.argv[2]));
pkg.name = "sapinaa";

console.log(JSON.stringify(pkg));
