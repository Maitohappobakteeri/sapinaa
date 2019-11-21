
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

export function createSourceArray(arr) {
  arr = arr && arr.slice(0) || [];
  arr.derivedArrays = [];
  arr.push = function(item) {
    this.derivedArrays.forEach(d => d.push(d.mapFun(item)));
    Array.prototype.push.call(this, item);
  };
  arr.deriveArray = function(mapFun) {
    let derArr = this.map(mapFun);
    derArr.mapFun = mapFun;
    this.derivedArrays.push(derArr);
    return derArr;
  };
  return arr;
}
