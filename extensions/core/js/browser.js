var CxBrowser = function() {
  this.name = 'unknown';
  if (typeof window !== 'undefined') {
    var notChrome = _.isUndefined(window.chrome);
    if (!notChrome) {
      this.name = 'chrome';
    } else {
      if (typeof safari !== 'undefined') {
        this.name = 'safari';
      } else {
        this.name = 'chrome';
      }
    }
  } else {
    this.name = 'chrome';
  }
};

CxBrowser.prototype.chrome = function() {
  return this.name === 'chrome';
};

CxBrowser.prototype.safari = function() {
  return this.name === 'safari';
};