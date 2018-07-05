const isString = require('lodash.isstring');
const isArray = require('lodash.isarray');
const isObject = require('lodash.isobject');

const BSON = require('bson');
const ObjectId = BSON.ObjectId;

const TIMESTAMP_RE = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d))$/;
const OBJECTID_RE = /^[0-9a-fA-F]{24}$/;

module.exports = jsonToBson;

// Convert json data (from a query) to BSON (for the mongo query)
// Dates must be specified by: http://dotat.at/tmp/ISO_8601-2004_E.pdf\
// Any 24 character HEX string will be interpreted as an object ID
function jsonToBson(jsonData) {
  var outObj;
  if (isArray(jsonData)) {
    outObj = [];
  } else {
    outObj = {};
  }

  for (let key of Object.keys(jsonData)) {
    let val = jsonData[key];
    let res = val;
    if (isString(val)) {
      // The value is a string - does it match any of our things we want to convert
      if (val.match(TIMESTAMP_RE)) {
        // We're a timestamp
        res = new Date(val);
      } else if (val.match(OBJECTID_RE)) {
        // We're an object id
        res = new ObjectId(val);
      }
    } else if (isArray(val) || isObject(val)) {
      res = jsonToBson(val);
    }

    outObj[key] = res;
  }

  return outObj;
}
