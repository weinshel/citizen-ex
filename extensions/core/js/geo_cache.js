// Set up geo-cache

var GeoCache = function() {
  this.reset();
  this.addOwnLocation();
};

GeoCache.prototype.addOwnLocation = function(entry) {
  // skip if we are already fetching the data
  if (this.fetching) {
    return;
  }

  var timestamp = new Date();
  var ownGeoData = {
    ownGeoData: true,
    timestamp: timestamp.getTime()
  };

  var entry = entry;
  var url = 'https://freegeoip.net/json'

  this.fetching = true;
  utils.get(url, _.bind(function(response) {
    if (response) {
      var json = JSON.parse(response);
      ownGeoData.ownIp = json.ip;
      ownGeoData.ownCountryCode = json.country_code;
      ownGeoData.ownCountryName = json.country_name;
      ownGeoData.ownRegionCode = json.region_code;
      ownGeoData.ownRegionName = json.region_name;
      ownGeoData.ownTimezone = json.time_zone;
      ownGeoData.ownZipcode = json.zip_code;
      ownGeoData.ownCity = json.city;
      ownGeoData.ownLat = json.latitude;
      ownGeoData.ownLng = json.longitude;

      console.log('Got own geo, caching it');
      geoCache.addOwnLocationEntry(ownGeoData);

      // now update the log entry
      if (entry) {
        entry.getOwnGeo();
      }

    } else {
      console.log('Can’t get own geo data');
    }
    this.fetching = null;
  }, this));
};

GeoCache.prototype.getOwnLocation = function() {
  return this.hasEntry('ownGeoData', true);
};

GeoCache.prototype.addOwnLocationEntry = function(ownGeoData) {
  if (!ownGeoData) {
    return;
  }
  this.removeOwnLocation();
  this.addEntry(ownGeoData);
  storage.set('ownGeoData', ownGeoData);
};

GeoCache.prototype.removeOwnLocation = function() {
  var ownLocation = this.getOwnLocation();
  if (ownLocation) {
    console.log('Removing old own location entry');
    this.removeEntry(ownLocation);
  }
};

GeoCache.prototype.hasEntry = function(property, value) {
  var cacheEntry = _.find(this.entries, function(entry) {
    if (entry) {
      return entry[property] === value;
    } else {
      return false;
    }
  });
  return cacheEntry;
};

GeoCache.prototype.addEntry = function(object) {
  console.log('Caching a new entry');
  this.entries.push(object);
  this.updateStorage();
};

GeoCache.prototype.removeEntry = function(object) {
  console.log('Removing an entry from cache');
  var index = this.entries.indexOf(object);
  if (index > -1) {
    this.entries.splice(index, 1);
  }
  this.updateStorage();
};

GeoCache.prototype.reset = function() {
  console.log('Resetting geo cache');
  this.entries = [];
  this.recoverFromStorage();
};

GeoCache.prototype.recoverFromStorage = function() {
  storage.get('geoCache', _.bind(function(geoCache) {
    if (_.isEmpty(geoCache) || geoCache === undefined || !geoCache) {
      return;
    }
    // handle how differently chrome works
    if (geoCache.geoCache) {
      this.entries = geoCache.geoCache;
    } else {
      this.entries = geoCache;
    }
    console.log('Got geo cache from storage');
  }, this));
};

GeoCache.prototype.updateStorage = function() {
  storage.set('geoCache', this.entries);
};
