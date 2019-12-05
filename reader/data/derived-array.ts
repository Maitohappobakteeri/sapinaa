
// var arrayChangeHandler = {
//   get: function(target, property) {
//     return target[property];
//   },
//   set: function(target, property, value, receiver) {
//     if (isNum(property)) {
//       // notify
//     }
//     target[property] = value;
//     return true;
//   }
// };

//
// TODO: This whole file is just confusing!!!
//

export function createSourceArray(arr=undefined) {
  arr = arr && arr.slice(0) || [];
  arr.derivedArrays = [];
  arr.push = function(item) {
    this.derivedArrays.forEach(d => d.derPush(item));
    Array.prototype.push.call(this, item);
  };
  arr.insert = function(i, item) {
    this.derivedArrays.forEach(d => d.derInsert(i, item));
    this.splice(i, 0, item);
  };
  arr.deriveArray = function(mapFun) {
    let derArr = this.map(mapFun);
    derArr.mapFun = mapFun;
    derArr.derPush = function(item) { this.push(this.mapFun(item)); };
    derArr.derInsert = function(i, item) { this.splice(i, 0, this.mapFun(item)); };
    this.derivedArrays.push(derArr);
    return derArr;
  };
  arr.registerSortedArray = function(derArr) {
    this.derivedArrays.push(derArr);
    for (let obj of this) {
      derArr.derPush(obj);
    }
  };
  return arr;
}

export function createSortedDerivedArray(mapFun, isBeforeSortFun, filterFun) {
  let sortedArr = [];
  sortedArr.mapFun = mapFun;
  sortedArr.isBeforeSortFun = isBeforeSortFun;
  sortedArr.filterFun = filterFun;
  sortedArr.derPush = function(item) {
    if (!filterFun(this, item)) { return; }
    let mapped = this.mapFun(item);
    let i = this.findIndex((function(i) { return this.isBeforeSortFun(mapped, i); }).bind(this));
    if (i === -1) { i = this.length; }
    this.splice(i, 0, mapped);
  };
  sortedArr.derInsert = function(_, item) {
    if (!filterFun(this, item)) { return; }
    let mapped = this.mapFun(item);
    let i = this.findIndex((function(i) { return this.isBeforeSortFun(mapped, i); }).bind(this));
    if (i === -1) { i = this.length; }
    this.splice(i, 0, mapped);
  };
  return sortedArr;
}
