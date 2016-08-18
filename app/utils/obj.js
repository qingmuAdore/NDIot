/**
 * combine obj we purpose: retain the o'sfield and combine the n'filed,if
 * the old/new object has the same field,use the new object field
 * 
 * @o old object
 * @n new object
 */
exports.combine = function(o, n) {
  var obj = o || {};
  if (typeof n === 'object') {
    for (var f in n) {
      obj[f] = n[f];
    }
  }
  return obj;
}

/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *
 *     merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api public
 */
exports.merge = function(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};


/**
 * compare:lObj is equal rObj?
 */
exports.compare = function(l, r) {
  // If both x and y are null or undefined and exactly the same 
  if (l === r) {
    return true;
  }

  // If they are not strictly equal, they both need to be Objects 
  if (!(l instanceof Object) || !(r instanceof Object)) {
    return false;
  }

  //They must have the exact same prototype chain,the closest we can do is
  //test the constructor. 
  if (l.constructor !== r.constructor) {
    return false;
  }

  for (var p in l) {
    //Inherited properties were tested using x.constructor === y.constructor
    if (l.hasOwnProperty(p)) {
      // Allows comparing x[ p ] and y[ p ] when set to undefined 
      if (!r.hasOwnProperty(p)) {
        return false;
      }

      // If they have the same strict value or identity then they are equal 
      if (l[p] === r[p]) {
        continue;
      }

      // Numbers, Strings, Functions, Booleans must be strictly equal 
      if (typeof (l[p]) !== "object") {
        return false;
      }

      // Objects and Arrays must be tested recursively 
      if (!Object.equals(l[p], r[p])) {
        return false;
      }
    }
  }

  for (p in r) {
    // allows x[ p ] to be set to undefined 
    if (r.hasOwnProperty(p) && !l.hasOwnProperty(p)) {
      return false;
    }
  }
  return true;
};












