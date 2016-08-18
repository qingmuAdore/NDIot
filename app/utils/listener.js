/**
 * listener
 * @count the upper limit
 */
function listener(count) {
  this._count = count || 0;
  this._time = 0;
  this._finish = false;
}

listener.prototype.setCount = function (count) {
  this._count = count || 0;
}

listener.prototype.add = function () {
  ++this._count;
}

listener.prototype.run = function (cb) {
  if (!this._finish && ++this._time >= this._count) {
    this._finish = true;
    cb();
  }
}

listener.prototype.isFinish = function () {
  return this._finish;
}

listener.prototype.stop = function () {
  this._finish = true;
}

module.exports = listener;