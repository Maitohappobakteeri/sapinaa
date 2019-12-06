var convert = require("xml-js");

// Parse XML to JSON and wrap it in query functions
function parseXML(xml: string) {
  let data = JSON.parse(convert.xml2json(xml));
  return wrapXML(data);
}

function wrapXML(xmlObj: any) {
  if (xmlObj === undefined) {
    xmlObj = {};
  }

  xmlObj.firstWithName = function(name: string) {
    if (xmlObj.elements === undefined) {
      return wrapXML(undefined);
    }

    return wrapXML(xmlObj.elements.filter((e: any) => e.name == name)[0]);
  };

  xmlObj.firstWithType = function(type: string) {
    if (xmlObj.elements === undefined) {
      return wrapXML(undefined);
    }

    return wrapXML(xmlObj.elements.filter((e: any) => e.type == type)[0]);
  };

  xmlObj.elementsWithName = function(name: string) {
    if (xmlObj.elements === undefined) {
      return wrapXML([]);
    }

    return xmlObj.elements
      .filter((e: any) => e.name == name)
      .map((e: any) => wrapXML(e));
  };

  return xmlObj;
}

export { parseXML };
