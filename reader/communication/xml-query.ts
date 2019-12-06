var convert = require("xml-js");

// Parse XML to JSON and wrap it in query functions
function parseXML(xml) {
  let data = JSON.parse(convert.xml2json(xml));
  return wrapXML(data);
}

function wrapXML(xmlObj) {
  if (xmlObj === undefined) {
    xmlObj = {};
  }

  xmlObj.firstWithName = function(name) {
    if (xmlObj.elements === undefined) {
      return wrapXML(undefined);
    }

    return wrapXML(xmlObj.elements.filter(e => e.name == name)[0]);
  };

  xmlObj.firstWithType = function(type) {
    if (xmlObj.elements === undefined) {
      return wrapXML(undefined);
    }

    return wrapXML(xmlObj.elements.filter(e => e.type == type)[0]);
  };

  xmlObj.elementsWithName = function(name) {
    if (xmlObj.elements === undefined) {
      return wrapXML([]);
    }

    return xmlObj.elements.filter(e => e.name == name).map(e => wrapXML(e));
  };

  return xmlObj;
}

export { parseXML };
