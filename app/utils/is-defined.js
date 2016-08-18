/**
 * This is the exposed module.
 * This method determines if an object is undefined.
 *
 * @param {Object} value
 * @access public
 */
module.exports = function(value) {
   return typeof value != 'undefined' && typeof value != null;
};
