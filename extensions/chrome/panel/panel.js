/*
 * DO NOT EDIT THIS FILE
 *
 * It will be automatically generated from
 * templates defines in ./gulpfile.js
 * any time the templates are updated
 *
 */

var CxBrowser = function() {
  this.name = 'unknown';
  var notChrome = _.isUndefined(window.chrome);
  if (!notChrome) {
    this.name = 'chrome';
  } else {
    this.name = 'safari';
  }
};

CxBrowser.prototype.chrome = function() {
  return this.name === 'chrome';
};

CxBrowser.prototype.safari = function() {
  return this.name === 'safari';
};

var CxStorage = function(browser) {
  this.browser = browser;
};

CxStorage.prototype.set = function(property, value) {
  if (!property) {
    return;
  }

  var json = JSON.prune(value);
  if (this.browser.chrome()) {
    var obj = {};
    obj[property] = json;
    chrome.storage.local.set(obj);
  } else if (this.browser.safari()) {
    localStorage[property] = json;
  } else {
    throw 'Unknown browser';
  }
};

CxStorage.prototype.get = function(property, callback) {
  if (this.browser.chrome()) {
    chrome.storage.local.get(property, function(result) {
      var data = undefined;
      if (result[property]) {
        data = JSON.parse(result[property]);
        callback(data);
      }
    });
  } else if (this.browser.safari()) {
    var data = undefined;
    if (localStorage[property]) {
      var data = JSON.parse(localStorage[property]);
    }
    callback(data);
  } else {
    throw 'Unknown browser';
  }
};

CxStorage.prototype.clear = function() {
  if (this.browser.chrome()) {
    chrome.storage.local.clear();
  } else if (this.browser.safari()) {
    localStorage.clear();
  } else {
    throw 'Unknown browser';
  }
};

var CxMessage = function(browser) {
  this.browser = browser;
};

CxMessage.prototype.send = function(message) {
  if (this.browser.chrome()) {
    chrome.runtime.sendMessage(message);
  } else if (this.browser.safari()) {

    var key;

    _.each(message, function (v, k) {
      if (v) {
        key = k;
      }
    });
    safari.self.tab.dispatchMessage(key, message, false);
  } else {
    throw 'Unknown browser';
  }
};


// shared/js/log_entry.js

var LogEntry = function() {};

LogEntry.prototype.fromJSON = function(json) {
  var that = this;
  _.each(json, function(value, key) {
    that[key] = value;
  });
  return this;
};

LogEntry.prototype.latestTimestamp = function() {
  return _.max(this.timestamps, function(timestamp) {
    return Date.parse(timestamp).value;
  });
};

// shared/js/cx_extension.js

var CxExtension = Backbone.Model.extend({
  initialize: function(browser) {
    this.browser = browser;

    this.resetValues();
    this.requestOwnGeoData();
    this.requestLogEntries();
    this.requestCitizenship();
  },

  requestCitizenship: function() {
    message.send({ countryLog: true });
  },

  requestLogEntries: function() {
    message.send({ allLogEntries: true });
  },

  requestOwnGeoData: function() {
    message.send({ ownGeoData: true });
  },

  receiveCitizenship: function(countryLog) {
    var countryCodes = _.pick(countryLog.visits, _.identity);
    var citizenship = this.calculatePercentages(countryCodes);
    this.set({ citizenship: citizenship });
  },

  receiveAllLogEntries: function(entries) {
    var logEntries = _.map(entries, function(entry) {
      var logEntry = new LogEntry();
      return logEntry.fromJSON(entry);
    });

    if (!logEntries) {
      this.set({ logEntries: '' });
    } else {
      this.set({ logEntries: logEntries });
    }
  },

  receiveOwnGeoData: function(ownGeoData) {
    this.set({ ownGeoData: ownGeoData });
  },

  getLogEntryForUrl: function(url) {
    var logEntries = this.get('logEntries');

    if (!logEntries) {
      return null;
    }

    var entries = _.filter(logEntries, function(logEntry) {
      return logEntry.url === url;
    });
    latestEntry = _.max(entries, function(entry) {
      return _.max(entry.timestamps);
    });
    return latestEntry;
  },

  calculatePercentages: function(data) {
    var sum = _.reduce(data, function(memo, num) { return memo + num; }, 0);
    var result = [];
    _.each(data, function(value, key) {
      var percentage = (value / sum) * 100;
      percentage = percentage.toFixed(2);
      result.push({ code: key, percentage: percentage });
    });
    result = _.sortBy(result, 'percentage');

    return result.reverse();
  },

  getPropertiesFromEntries: function(entries, property) {
    var validEntries = _.reject(entries, function(entry) {
      return entry[property] === undefined || entry[property] === '';
    });
    var countryCodes = _.countBy(validEntries, function(entry) {
      return entry[property];
    });
    return countryCodes;
  },


  resetValues: function() {
    this.unset('logEntries');
    this.set({ citizenship: [] });
    this.set({ ownGeoData: '' });
  },

  eraseData: function() {
    this.resetValues();
    storage.clear();
  },

  convertCountryCode: function(countrycode) {
    if (countrycode == 'AF') { return 'Afghanistan'; }
    if (countrycode == 'AX') { return 'Aland Islands'; }
    if (countrycode == 'AL') { return 'Albania'; }
    if (countrycode == 'DZ') { return 'Algeria'; }
    if (countrycode == 'AS') { return 'American Samoa'; }
    if (countrycode == 'AD') { return 'Andorra'; }
    if (countrycode == 'AO') { return 'Angola'; }
    if (countrycode == 'AI') { return 'Anguilla'; }
    if (countrycode == 'AQ') { return 'Antarctica'; }
    if (countrycode == 'AG') { return 'Antigua and Barbuda'; }
    if (countrycode == 'AR') { return 'Argentina'; }
    if (countrycode == 'AM') { return 'Armenia'; }
    if (countrycode == 'AW') { return 'Aruba'; }
    if (countrycode == 'AU') { return 'Australia'; }
    if (countrycode == 'AT') { return 'Austria'; }
    if (countrycode == 'AZ') { return 'Azerbaijan'; }
    if (countrycode == 'BS') { return 'Bahamas'; }
    if (countrycode == 'BH') { return 'Bahrain'; }
    if (countrycode == 'BD') { return 'Bangladesh'; }
    if (countrycode == 'BB') { return 'Barbados'; }
    if (countrycode == 'BY') { return 'Belarus'; }
    if (countrycode == 'BE') { return 'Belgium'; }
    if (countrycode == 'BZ') { return 'Belize'; }
    if (countrycode == 'BJ') { return 'Benin'; }
    if (countrycode == 'BM') { return 'Bermuda'; }
    if (countrycode == 'BT') { return 'Bhutan'; }
    if (countrycode == 'BO') { return 'Bolivia'; }
    if (countrycode == 'BQ') { return 'Bonaire, Sint Eustatius and Saba'; }
    if (countrycode == 'BA') { return 'Bosnia and Herzegovina'; }
    if (countrycode == 'BW') { return 'Botswana'; }
    if (countrycode == 'BV') { return 'Bouvet Island'; }
    if (countrycode == 'BR') { return 'Brazil'; }
    if (countrycode == 'IO') { return 'British Indian Ocean Territory'; }
    if (countrycode == 'BN') { return 'Brunei Darussalam'; }
    if (countrycode == 'BG') { return 'Bulgaria'; }
    if (countrycode == 'BF') { return 'Burkina Faso'; }
    if (countrycode == 'BI') { return 'Burundi'; }
    if (countrycode == 'KH') { return 'Cambodia'; }
    if (countrycode == 'CM') { return 'Cameroon'; }
    if (countrycode == 'CA') { return 'Canada'; }
    if (countrycode == 'CV') { return 'Cabo Verde'; }
    if (countrycode == 'KY') { return 'Cayman Islands'; }
    if (countrycode == 'CF') { return 'Central African Republic'; }
    if (countrycode == 'TD') { return 'Chad'; }
    if (countrycode == 'CL') { return 'Chile'; }
    if (countrycode == 'CN') { return 'China'; }
    if (countrycode == 'CX') { return 'Christmas Island'; }
    if (countrycode == 'CC') { return 'Cocos (Keeling) Islands'; }
    if (countrycode == 'CO') { return 'Colombia'; }
    if (countrycode == 'KM') { return 'Comoros'; }
    if (countrycode == 'CG') { return 'Congo'; }
    if (countrycode == 'CD') { return 'Congo (Democratic Republic of the)'; }
    if (countrycode == 'CK') { return 'Cook Islands'; }
    if (countrycode == 'CR') { return 'Costa Rica'; }
    if (countrycode == 'CI') { return 'Cote d&apos;Ivoire'; }
    if (countrycode == 'HR') { return 'Croatia'; }
    if (countrycode == 'CU') { return 'Cuba'; }
    if (countrycode == 'CW') { return 'Curacao'; }
    if (countrycode == 'CY') { return 'Cyprus'; }
    if (countrycode == 'CZ') { return 'Czech Republic'; }
    if (countrycode == 'DK') { return 'Denmark'; }
    if (countrycode == 'DJ') { return 'Djibouti'; }
    if (countrycode == 'DM') { return 'Dominica'; }
    if (countrycode == 'DO') { return 'Dominican Republic'; }
    if (countrycode == 'EC') { return 'Ecuador'; }
    if (countrycode == 'EG') { return 'Egypt'; }
    if (countrycode == 'SV') { return 'El Salvador'; }
    if (countrycode == 'GQ') { return 'Equatorial Guinea'; }
    if (countrycode == 'ER') { return 'Eritrea'; }
    if (countrycode == 'EE') { return 'Estonia'; }
    if (countrycode == 'ET') { return 'Ethiopia'; }
    if (countrycode == 'FK') { return 'Falkland Islands (Malvinas)'; }
    if (countrycode == 'FO') { return 'Faroe Islands'; }
    if (countrycode == 'FJ') { return 'Fiji'; }
    if (countrycode == 'FI') { return 'Finland'; }
    if (countrycode == 'FR') { return 'France'; }
    if (countrycode == 'GF') { return 'French Guiana'; }
    if (countrycode == 'PF') { return 'French Polynesia'; }
    if (countrycode == 'TF') { return 'French Southern Territories'; }
    if (countrycode == 'GA') { return 'Gabon'; }
    if (countrycode == 'GM') { return 'Gambia'; }
    if (countrycode == 'GE') { return 'Georgia'; }
    if (countrycode == 'DE') { return 'Germany'; }
    if (countrycode == 'GH') { return 'Ghana'; }
    if (countrycode == 'GI') { return 'Gibraltar'; }
    if (countrycode == 'GR') { return 'Greece'; }
    if (countrycode == 'GL') { return 'Greenland'; }
    if (countrycode == 'GD') { return 'Grenada'; }
    if (countrycode == 'GP') { return 'Guadeloupe'; }
    if (countrycode == 'GU') { return 'Guam'; }
    if (countrycode == 'GT') { return 'Guatemala'; }
    if (countrycode == 'GG') { return 'Guernsey'; }
    if (countrycode == 'GN') { return 'Guinea'; }
    if (countrycode == 'GW') { return 'Guinea-Bissau'; }
    if (countrycode == 'GY') { return 'Guyana'; }
    if (countrycode == 'HT') { return 'Haiti'; }
    if (countrycode == 'HM') { return 'Heard Island and McDonald Islands'; }
    if (countrycode == 'VA') { return 'Holy See'; }
    if (countrycode == 'HN') { return 'Honduras'; }
    if (countrycode == 'HK') { return 'Hong Kong'; }
    if (countrycode == 'HU') { return 'Hungary'; }
    if (countrycode == 'IS') { return 'Iceland'; }
    if (countrycode == 'IN') { return 'India'; }
    if (countrycode == 'ID') { return 'Indonesia'; }
    if (countrycode == 'IR') { return 'Iran'; }
    if (countrycode == 'IQ') { return 'Iraq'; }
    if (countrycode == 'IE') { return 'Ireland'; }
    if (countrycode == 'IM') { return 'Isle of Man'; }
    if (countrycode == 'IL') { return 'Israel'; }
    if (countrycode == 'IT') { return 'Italy'; }
    if (countrycode == 'JM') { return 'Jamaica'; }
    if (countrycode == 'JP') { return 'Japan'; }
    if (countrycode == 'JE') { return 'Jersey'; }
    if (countrycode == 'JO') { return 'Jordan'; }
    if (countrycode == 'KZ') { return 'Kazakhstan'; }
    if (countrycode == 'KE') { return 'Kenya'; }
    if (countrycode == 'KI') { return 'Kiribati'; }
    if (countrycode == 'KP') { return 'Democratic People&apos;s Republic of Korea'; }
    if (countrycode == 'KR') { return 'Republic of Korea'; }
    if (countrycode == 'KW') { return 'Kuwait'; }
    if (countrycode == 'KG') { return 'Kyrgyzstan'; }
    if (countrycode == 'LA') { return 'Lao People&apos;s Democratic Republic'; }
    if (countrycode == 'LV') { return 'Latvia'; }
    if (countrycode == 'LB') { return 'Lebanon'; }
    if (countrycode == 'LS') { return 'Lesotho'; }
    if (countrycode == 'LR') { return 'Liberia'; }
    if (countrycode == 'LY') { return 'Libya'; }
    if (countrycode == 'LI') { return 'Liechtenstein'; }
    if (countrycode == 'LT') { return 'Lithuania'; }
    if (countrycode == 'LU') { return 'Luxembourg'; }
    if (countrycode == 'MO') { return 'Macao'; }
    if (countrycode == 'MK') { return 'Macedonia (Former Yugoslav Republic)'; }
    if (countrycode == 'MG') { return 'Madagascar'; }
    if (countrycode == 'MW') { return 'Malawi'; }
    if (countrycode == 'MY') { return 'Malaysia'; }
    if (countrycode == 'MV') { return 'Maldives'; }
    if (countrycode == 'ML') { return 'Mali'; }
    if (countrycode == 'MT') { return 'Malta'; }
    if (countrycode == 'MH') { return 'Marshall Islands'; }
    if (countrycode == 'MQ') { return 'Martinique'; }
    if (countrycode == 'MR') { return 'Mauritania'; }
    if (countrycode == 'MU') { return 'Mauritius'; }
    if (countrycode == 'YT') { return 'Mayotte'; }
    if (countrycode == 'MX') { return 'Mexico'; }
    if (countrycode == 'FM') { return 'Federated States of Micronesia'; }
    if (countrycode == 'MD') { return 'Moldova (Republic of)'; }
    if (countrycode == 'MC') { return 'Monaco'; }
    if (countrycode == 'MN') { return 'Mongolia'; }
    if (countrycode == 'ME') { return 'Montenegro'; }
    if (countrycode == 'MS') { return 'Montserrat'; }
    if (countrycode == 'MA') { return 'Morocco'; }
    if (countrycode == 'MZ') { return 'Mozambique'; }
    if (countrycode == 'MM') { return 'Myanmar'; }
    if (countrycode == 'NA') { return 'Namibia'; }
    if (countrycode == 'NR') { return 'Nauru'; }
    if (countrycode == 'NP') { return 'Nepal'; }
    if (countrycode == 'NL') { return 'Netherlands'; }
    if (countrycode == 'NC') { return 'New Caledonia'; }
    if (countrycode == 'NZ') { return 'New Zealand'; }
    if (countrycode == 'NI') { return 'Nicaragua'; }
    if (countrycode == 'NE') { return 'Niger'; }
    if (countrycode == 'NG') { return 'Nigeria'; }
    if (countrycode == 'NU') { return 'Niue'; }
    if (countrycode == 'NF') { return 'Norfolk Island'; }
    if (countrycode == 'MP') { return 'Northern Mariana Islands'; }
    if (countrycode == 'NO') { return 'Norway'; }
    if (countrycode == 'OM') { return 'Oman'; }
    if (countrycode == 'PK') { return 'Pakistan'; }
    if (countrycode == 'PW') { return 'Palau'; }
    if (countrycode == 'PS') { return 'Palestine'; }
    if (countrycode == 'PA') { return 'Panama'; }
    if (countrycode == 'PG') { return 'Papua New Guinea'; }
    if (countrycode == 'PY') { return 'Paraguay'; }
    if (countrycode == 'PE') { return 'Peru'; }
    if (countrycode == 'PH') { return 'Philippines'; }
    if (countrycode == 'PN') { return 'Pitcairn'; }
    if (countrycode == 'PL') { return 'Poland'; }
    if (countrycode == 'PT') { return 'Portugal'; }
    if (countrycode == 'PR') { return 'Puerto Rico'; }
    if (countrycode == 'QA') { return 'Qatar'; }
    if (countrycode == 'RE') { return 'Reunion'; }
    if (countrycode == 'RO') { return 'Romania'; }
    if (countrycode == 'RU') { return 'Russian Federation'; }
    if (countrycode == 'RW') { return 'Rwanda'; }
    if (countrycode == 'BL') { return 'Saint Barthelemy'; }
    if (countrycode == 'SH') { return 'Saint Helena, Ascension and Tristan da Cunha'; }
    if (countrycode == 'KN') { return 'Saint Kitts and Nevis'; }
    if (countrycode == 'LC') { return 'Saint Lucia'; }
    if (countrycode == 'MF') { return 'Saint Martin (French part)'; }
    if (countrycode == 'PM') { return 'Saint Pierre and Miquelon'; }
    if (countrycode == 'VC') { return 'Saint Vincent and the Grenadines'; }
    if (countrycode == 'WS') { return 'Samoa'; }
    if (countrycode == 'SM') { return 'San Marino'; }
    if (countrycode == 'ST') { return 'Sao Tome and Principe'; }
    if (countrycode == 'SA') { return 'Saudi Arabia'; }
    if (countrycode == 'SN') { return 'Senegal'; }
    if (countrycode == 'RS') { return 'Serbia'; }
    if (countrycode == 'SC') { return 'Seychelles'; }
    if (countrycode == 'SL') { return 'Sierra Leone'; }
    if (countrycode == 'SG') { return 'Singapore'; }
    if (countrycode == 'SX') { return 'Sint Maarten (Dutch part)'; }
    if (countrycode == 'SK') { return 'Slovakia'; }
    if (countrycode == 'SI') { return 'Slovenia'; }
    if (countrycode == 'SB') { return 'Solomon Islands'; }
    if (countrycode == 'SO') { return 'Somalia'; }
    if (countrycode == 'ZA') { return 'South Africa'; }
    if (countrycode == 'GS') { return 'South Georgia and the South Sandwich Islands'; }
    if (countrycode == 'SS') { return 'South Sudan'; }
    if (countrycode == 'ES') { return 'Spain'; }
    if (countrycode == 'LK') { return 'Sri Lanka'; }
    if (countrycode == 'SD') { return 'Sudan'; }
    if (countrycode == 'SR') { return 'Suriname'; }
    if (countrycode == 'SJ') { return 'Svalbard and Jan Mayen'; }
    if (countrycode == 'SZ') { return 'Swaziland'; }
    if (countrycode == 'SE') { return 'Sweden'; }
    if (countrycode == 'CH') { return 'Switzerland'; }
    if (countrycode == 'SY') { return 'Syrian Arab Republic'; }
    if (countrycode == 'TW') { return 'Taiwan'; }
    if (countrycode == 'TJ') { return 'Tajikistan'; }
    if (countrycode == 'TZ') { return 'Tanzania'; }
    if (countrycode == 'TH') { return 'Thailand'; }
    if (countrycode == 'TL') { return 'Timor-Leste'; }
    if (countrycode == 'TG') { return 'Togo'; }
    if (countrycode == 'TK') { return 'Tokelau'; }
    if (countrycode == 'TO') { return 'Tonga'; }
    if (countrycode == 'TT') { return 'Trinidad and Tobago'; }
    if (countrycode == 'TN') { return 'Tunisia'; }
    if (countrycode == 'TR') { return 'Turkey'; }
    if (countrycode == 'TM') { return 'Turkmenistan'; }
    if (countrycode == 'TC') { return 'Turks and Caicos Islands'; }
    if (countrycode == 'TV') { return 'Tuvalu'; }
    if (countrycode == 'UG') { return 'Uganda'; }
    if (countrycode == 'UA') { return 'Ukraine'; }
    if (countrycode == 'AE') { return 'United Arab Emirates'; }
    if (countrycode == 'GB') { return 'United Kingdom'; }
    if (countrycode == 'UK') { return 'United Kingdom'; }
    if (countrycode == 'US') { return 'USA'; }
    if (countrycode == 'UM') { return 'United States Minor Outlying Islands'; }
    if (countrycode == 'UY') { return 'Uruguay'; }
    if (countrycode == 'UZ') { return 'Uzbekistan'; }
    if (countrycode == 'VU') { return 'Vanuatu'; }
    if (countrycode == 'VE') { return 'Venezuela'; }
    if (countrycode == 'VN') { return 'Viet Nam'; }
    if (countrycode == 'VG') { return 'Virgin Islands (British)'; }
    if (countrycode == 'VI') { return 'Virgin Islands (U.S.)'; }
    if (countrycode == 'WF') { return 'Wallis and Futuna'; }
    if (countrycode == 'EH') { return 'Western Sahara'; }
    if (countrycode == 'YE') { return 'Yemen'; }
    if (countrycode == 'ZM') { return 'Zambia'; }
    if (countrycode == 'ZW') { return 'Zimbabwe'; }
    return 'Unknown';
  }

});

// panel/js/cx_panel.js

var CxPanel = CxExtension.extend({
  initialize: function(browser) {
    CxExtension.prototype.initialize.apply(this, browser);

    this.requestActiveTab();
    this.requestOpenTabs();
  },

  requestActiveTab: function() {
    message.send({ activeTab: true });
  },

  requestOpenTabs: function() {
    message.send({ allTabs: true });
  },

  receiveActiveTab: function(url) {
    var entry = this.getLogEntryForUrl(url);

    if (!entry) {
      this.set({ currentEntry: '' });
      return;
    } else {
      this.set({ currentEntry: entry });
    }
  },

  receiveOpenTabs: function(urls) {
    this.set({ openTabs: urls });
    this.getOpenTabEntries();
  },

  getOpenTabEntries: function() {
    var tabs = this.get('openTabs');

    if (!_.isEmpty(tabs)) {
      var entries = [];
      _.each(tabs, _.bind(function(tabUrl) {
        var logEntry = this.getLogEntryForUrl(tabUrl);
        if (logEntry && logEntry !== -Infinity) {
          entries.push(logEntry);
        }
      }, this));
      this.set({ openTabEntries: entries });
      this.setUpOpenTabsCitizenship();
    } else {
      this.set({ openTabEntries: [] });
    }
  },

  setUpOpenTabsCitizenship: function() {
    var tabEntries = this.get('openTabEntries');
    var validEntries = _.reject(tabEntries, function(entry) {
      return entry.countryCode === undefined || entry.countryCode === '';
    });
    var countryCodes = _.countBy(validEntries, function(entry) {
      return entry.countryCode;
    });
    var openTabsCitizenship = this.calculatePercentages(countryCodes);
    this.set({ openTabsCitizenship: openTabsCitizenship });
  },

  open: function() {
    this.set({ open: true });
  },

  close: function() {
    this.set({ open: false });
  },

  toggle: function() {
    if (this.get('open')) {
      this.close();
    } else {
      this.open();
    }
  },

  resetValues: function() {
    this.set({ open: false });

    this.set({ currentEntry: '' });
    this.set({ openTabEntries: [] });
    this.set({ openTabsCitizenship: [] });

    CxExtension.prototype.resetValues.apply(this);
  },

  eraseData: function() {
    this.resetValues();
  }

});



// panel/js/cx_panel_view.js

var CxPanelView = Backbone.View.extend({
  tagName: 'div',

  className: 'citizen-ex__pane',

  events: {
    'click .cex_erase': 'eraseData',
    'click .cex_close': 'close'
  },

  initialize: function(options) {
    this.template = _.template(options.template);

    this.listenTo(this.model, 'change:open', this.render);
    this.listenTo(this.model, 'change:currentEntry', this.render);
    this.listenTo(this.model, 'change:citizenship', this.render);
    this.listenTo(this.model, 'change:ownGeoData', this.render);
    this.listenTo(this.model, 'change:openTabsEntries', this.render);
    this.listenTo(this.model, 'change:openTabsCitizenship', this.render);

    this.appendToBody();
  },

  render: function() {
    if (this.model.get('open')) {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.slideDown();
    } else {
      this.$el.slideUp();
    }
  },

  appendToBody: function() {
    var body = $('body');
    this.$el.appendTo(body);
  },

  close: function(event) {
    event.preventDefault();
    this.model.close();
  },

  eraseData: function(event) {
    event.preventDefault();
    this.model.eraseData();
  }

});


// panel/js/init_shared.js

var panelTemplate = "<div id=\"cex_hud\">\n\t<div id=\"cex_header\">\n\t\t<img id=\"cex_logo\" src=\"\" width=\"107\" height=\"24\" />\n\t\t<a href=\"#\" class=\"cex_more\" target=\"_blank\">More Info</a>\n        <a href=\"#\" class=\"cex_close\"><img id=\"cex_close\" src=\"\" width=\"24\" height=\"24\" /></a>\n\t\t<script type=\"text/javascript\">\n            if (!_.isUndefined(window.chrome)) {\n              $('#cex_header #cex_logo').attr('src',chrome.extension.getURL('images/logo-small-white.svg'));\n              $('#cex_header #cex_close').attr('src',chrome.extension.getURL('images/close.png'));\n              $('.cex_more').attr('href',chrome.extension.getURL('page/page.html'));\n\n            } else if (safari) {\n              $('#cex_header #cex_logo').attr('src',safari.extension.baseURI + 'images/logo-small-white.png');\n              $('#cex_header #cex_close').attr('src',safari.extension.baseURI + 'images/close.png');\n              $('#cex_header .cex_close').attr('href',safari.extension.baseURI + 'more_info.html');\n              $('.cex_more').attr('href',safari.extension.baseURI + 'page/page.html');\n            }\n\t\t</script>\n\t</div>\n\n\t<div id=\"cex_main\">\n\n\t<% if (currentEntry) { %>\n\n\t  \t<div id=\"cex_badge\">\n\n\t  \t\t<div id=\"cex_badge_column\">\n\n\t\t\t\t<% if (citizenship.length > 0) { %>\n\n\t\t\t\t<h2>This is your Algorithmic Citizenship</h2>\n\n\t\t\t\t<canvas id=\"cex_badge_canvas\"></canvas>\n\n\t\t\t\t<p id=\"cex_whatmeans\"><a href=\"http://citizen-ex.com/citizenship/\" target=\"_blank\">What does this mean?</a></p>\n\t\t\t\t<ul id=\"cex_sharebuttons\">\n\t\t\t\t\t<li>Share:</li>\n\t\t\t\t\t<li><a href=\"#\" class=\"cex_share_facebook\">Facebook</a></li>\n\t\t\t\t\t<li><a href=\"#\" class=\"cex_share_twitter\">Twitter</a></li>\n\t\t\t\t\t<li><a href=\"#\" class=\"cex_share_email\">Email</a></li>\n\t\t\t\t</ul>\n\n\t\t\t</div><!-- cex_badge_column -->\n\n\t\t\t<div id=\"cex_data_column\">\n\n\t\t\t\t<table id=\"distribution_table\">\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class=\"thead cex_country\">Your distribution</td>\n\t\t\t\t\t\t<td class=\"thead cex_percentage\">%</td>\n\t\t\t\t\t</tr>\n\t\t\t\t<% _.each(citizenship, function(country) { %>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class=\"cex_country\"><%= cxPanel.convertCountryCode(country.code) %></td>\n\t\t\t\t\t\t<td class=\"cex_percentage\"><%= country.percentage %></td>\n\t\t\t\t\t</tr>\n\t\t\t\t<% }); %>\n\t\t\t\t</table>\n\n\t\t\t</div><!-- cex_data_column -->\n\n\t\t\t<script type=\"text/javascript\">\n\t\t\t\tvar percents = [\n\t\t\t\t<% _.each(citizenship, function(country) { %>\n\t\t\t\t  [\"<%= country.code %>\",<%= country.percentage %>],\n\t\t\t\t  <% }); %>];\n\t\t\t\t\t// set canvas to css heights\n\t\t\t\t$('#cex_badge_canvas').attr('width', parseInt($('#cex_badge_canvas').css('width')));\n\t\t\t\t$('#cex_badge_canvas').attr('height', parseInt($('#cex_badge_canvas').css('height')));\n\n\t\t\t\tvar badge = $(\"#cex_badge_canvas\").get(0).getContext(\"2d\");\n\n\t\t\t\t// circle centre and radius\n\t\t\t\tvar x0 = $('#cex_badge_canvas').attr('width')/2;\n\t\t\t\tvar y0 = $('#cex_badge_canvas').attr('height')/2;\n\t\t\t\tvar r = Math.min($('#cex_badge_canvas').attr('height')/2,$('#cex_badge_canvas').attr('width')/2);\n\n\t\t\t\tvar circlepointer = 0;\n\n\t\t\t\t$.each(percents, function() {\n\t\t\t\t\tvar country = this[0];\n\t\t\t\t\tvar value = this[1];\n\t\t\t\t\tvar degrees = 360*(value/100);\n\t\t\t\t\tdrawSegment(badge,x0,y0,r,circlepointer,country,degrees);\n\t\t\t\t\tcirclepointer = circlepointer + degrees;\n\t\t\t\t\t});\n\n\t\t\t\tfunction drawSegment(badge,x0,y0,r,circlepointer,country,degrees) {\n\t\t\t\t\tvar img = new Image();\n\t\t\t\t\timg.onload = function() {\n\t\t\t\t\t\tvar flagscaledheight = badge.canvas.clientHeight;\n\t\t\t\t\t\tvar flagscaledwidth = flagscaledheight*(img.width/img.height);\n\t\t\t\t\t\tvar flagmargin = (flagscaledwidth - badge.canvas.clientWidth) / 2;\n\t\t\t\t\t\tvar svgCanvas = document.createElement(\"canvas\");\n\t\t\t\t    \tsvgCanvas.height = flagscaledheight;\n\t\t\t\t    \tsvgCanvas.width = flagscaledwidth;\n\t\t\t\t    \tvar svgCtx = svgCanvas.getContext(\"2d\");\n\t\t\t\t    \tsvgCtx.drawImage(img, -flagmargin, 0, flagscaledwidth, flagscaledheight);\n\t\t\t\t    \tvar pattern = badge.createPattern(svgCanvas, 'repeat');\n\t\t\t\t    \tbadge.fillStyle = pattern;\n\t\t\t\t\t\tbadge.beginPath();\n\t\t\t\t\t\tbadge.moveTo(x0, y0);\n\t\t\t\t\t\tvar xy = circleCoords(x0,y0,r,circlepointer);\n\t\t\t\t\t\tbadge.lineTo(xy[0],xy[1]);\n\t\t\t\t\t\tfor (i = 0; i < degrees; i=i+20) {\n\t\t\t\t\t\t\txy = circleCoords(x0,y0,r,circlepointer+i);\n\t\t\t\t\t\t\tbadge.lineTo(xy[0],xy[1]);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\txy = circleCoords(x0,y0,r,circlepointer+degrees);\n\t\t\t\t\t\tbadge.lineTo(xy[0],xy[1]);\n\t\t\t\t\t\tbadge.closePath();\n\t\t\t\t\t\tbadge.lineWidth=1;\n\t\t\t\t\t\tbadge.strokeStyle=\"#888\";\n\t\t\t\t\t\tbadge.stroke();\n\t\t\t\t\t\tbadge.fill();\n\t\t\t\t      \t};\n                      if (!_.isUndefined(window.chrome)) {\n                        img.src = chrome.extension.getURL('flags/'+country+'.svg');\n                      } else if (safari) {\n                        img.src = safari.extension.baseURI + 'flags/'+country+'.png';\n                      }\n\t\t\t\t\t}\n\n\t\t\t\tfunction circleCoords(x0,y0,r,theta) {\n\t\t\t\t\tvar x = x0 + r * Math.cos(theta * Math.PI / 180);\n\t\t\t\t\tvar y = y0 + r * Math.sin(theta * Math.PI / 180);\n\t\t\t\t\treturn [x,y];\n\t\t\t\t\t}\n\n\t\t\t</script>\n\n\t\t</div><!-- cex_badge -->\n\n\t\t\t\t<% } else { %>\n\t\t\t\t  <h2>No Citizenship data available yet. Keep browsing!</h2>\n\t\t\t\t<% }; %>\n\n\t\t<div id=\"cex_map\">\n\n\t\t<div id=\"cex_map_window\" class=\"dark\">\n\t\t\t<img id=\"cex_map_loading\" src=\"\" alt=\"Loading\"/>\n\t\t\t<!-- Add mapbox watermark -->\n  \t\t\t<a href=\"http://mapbox.com/about/maps\" class='mapbox-maplogo' target=\"_blank\">MapBox</a>\n  \t\t</div>\n\n\t  \t<script type=\"text/javascript\">\n        if (!_.isUndefined(window.chrome)) {\n          $('img#cex_map_loading').attr('src',chrome.extension.getURL('images/loading.gif'));\n        } else if (safari) {\n          $('img#cex_map_loading').attr('src',safari.extension.baseURI + 'images/loading.gif');\n        }\n\t  \tsetTimeout(function(){ cex_drawMap(); }, 1000);\n\t  \tfunction cex_drawMap() {\n\t\t\tvar cexmap = L.map('cex_map_window', { zoomControl:false });\n\t\t\tvar cextilelayer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stml.l6086pbg/{z}/{x}/{y}.png', {\n\t\t\t\tattribution: '<a href=\"http://openstreetmap.org/copyright\">Map data: &copy; OpenStreetMap</a>'}).addTo(cexmap);\n\t\t\tcextilelayer.on('tileerror', function(error, tile) {\n\t\t\t    console.log(error);\n\t\t\t    console.log(tile);\n\t\t\t\t});\n\t\t\tcexmap.attributionControl.setPrefix(\"\");\n            var yellowMarker;\n            var cyanMarker;\n\n            if (!_.isUndefined(window.chrome)) {\n              cyanMarker = chrome.extension.getURL('images/map-marker-cyan.png');\n              yellowMarker = chrome.extension.getURL('images/map-marker-yellow.png');\n              tabMarker = chrome.extension.getURL('images/map-marker-tab.png');\n            } else if (safari) {\n              cyanMarker = safari.extension.baseURI + 'images/map-marker-cyan.png';\n              yellowMarker = safari.extension.baseURI + 'images/map-marker-yellow.png';\n              tabMarker = safari.extension.baseURI + 'images/map-marker-tab.png';\n            }\n\n\t\t\tvar destIcon = L.icon({\n\t\t\t\ticonUrl: yellowMarker,\n\t\t\t\ticonSize:     [41,41], // size of the icon\n\t\t\t\ticonAnchor:   [20,20], // point of the icon which will correspond to marker's location\n\t\t\t\t});\n\t\t\tvar origIcon = L.icon({\n\t\t\t\ticonUrl: cyanMarker,\n\t\t\t\ticonSize:     [41,41], // size of the icon\n\t\t\t\ticonAnchor:   [20,20], // point of the icon which will correspond to marker's location\n\t\t\t\t});\n\t\t\tvar tabIcon = L.icon({\n\t\t\t\ticonUrl: tabMarker,\n\t\t\t\ticonSize:     [9,9], // size of the icon\n\t\t\t\ticonAnchor:   [5,5], // point of the icon which will correspond to marker's location\n\t\t\t\t});\n\n/*\n            <% if (openTabEntries) { %>\n              <% _.each(openTabEntries, function(tabEntry) { %>\n                  <% if (tabEntry.url !== currentEntry.url) { %>\n                      var tabMarker = L.marker([<%= tabEntry.lat %>, <%= tabEntry.lng %>], {icon: tabIcon}).addTo(cexmap);\n                  <% } %>\n              <% }) %>\n            <% } %>\n*/\n\n\t\t\t<% if (ownGeoData && currentEntry.lat && currentEntry.lng) { %>\n\t\t\t\tvar cexmarkerline = L.polyline([[<%= ownGeoData.ownLat %>, <%= ownGeoData.ownLng %>],[<%= currentEntry.lat %>, <%= currentEntry.lng %>]], { color: '#fff', weight: 1, opacity: 1 }).addTo(cexmap);\n\t\t\t<% } %>\n\n\t\t\tvar cexmarkergroup = new L.featureGroup();\n\t\t\t<% if (ownGeoData && ownGeoData.ownIp) { %>\n\t\t\t\tvar origMarker = L.marker([<%= ownGeoData.ownLat %>, <%= ownGeoData.ownLng %>], {icon: origIcon}).addTo(cexmap);\n\t\t\t\tcexmarkergroup.addLayer(origMarker);\n\t\t\t<% } else { %>\n\t\t    <% }; %>\n\t\t\t<% if (currentEntry.ip) { %>\n\t\t\t\tvar destMarker = L.marker([<%= currentEntry.lat %>, <%= currentEntry.lng %>], {icon: destIcon}).addTo(cexmap);\n\t\t\t\tcexmarkergroup.addLayer(destMarker);\n\t\t    <% } else { %>\n\n\t\t    <% }; %>\n\t\t    cexmap.fitBounds(cexmarkergroup.getBounds(), {padding: [50,50]});\n\t\t    // kill loading circle\n\t\t    $('img#cex_map_loading').hide();\n\t\t    }\n\n\t  \t</script>\n\n\t    \t\t<div id=\"cex_mapdata\">\n\n\t    \t\t\t<div id=\"cex_dest_column\">\n\t    \t\t\t\t<h3>Current remote location</h3>\n\t\t\t\t\t    <% if (currentEntry.ip) { %>\n\t\t\t\t\t      <p><strong><% if (currentEntry.city.length > 0) { %><%= currentEntry.city %>, <% } %><%= cxPanel.convertCountryCode(currentEntry.countryCode) %></strong></p>\n\t\t\t\t\t      <p>IP Address: <%= currentEntry.ip %></p>\n\t\t\t\t\t      <p>Lat: <%= currentEntry.lat %> / Lon: <%= currentEntry.lng %></p>\n\t\t\t\t\t    <% } else { %>\n\t\t\t\t\t      <p><strong>Remote location is unknown</strong></p>\n\t\t\t\t\t      <p>&nbsp;</p>\n\t\t\t\t\t      <p>&nbsp;</p>\n\t\t\t\t\t    <% }; %>\n\t\t\t\t    </div><!-- cex_dest_column -->\n\t\t\t\t    <div id=\"cex_orig_column\">\n\t    \t\t\t\t<h3>Your tracked location</h3>\n\t\t\t\t\t    <% if (ownGeoData && ownGeoData.ownIp) { %>\n\t\t\t\t\t      <p><strong><% if (ownGeoData.ownCity.length > 0) { %><%= ownGeoData.ownCity %>, <% } %><%= cxPanel.convertCountryCode(ownGeoData.ownCountryCode) %></strong></p>\n\t\t\t\t\t      <p>IP Address: <%= ownGeoData.ownIp %></p>\n\t\t\t\t\t      <p>Lat: <%= ownGeoData.ownLat %> / Lon: <%= ownGeoData.ownLng %></p>\n\t\t\t\t\t    <% } else { %>\n\t\t\t\t\t      <p><strong>Your location is unknown</strong></p>\n\t\t\t\t\t      <p>&nbsp;</p>\n\t\t\t\t\t      <p>&nbsp;</p>\n\t\t\t\t\t    <% }; %>\n\t\t\t\t    </div><!-- cex_orig_column -->\n\t\t\t\t</div><!-- cex_mapdata -->\n\n\t    </div><!-- cex_map -->\n\n\t  <% } else { %>\n\n\t  \t\t<div id=\"cex_nodata\">\n\t\t\t\t<p>No data available yet.</p>\n\t\t\t</div>\n\t  <% }; %>\n\n\t</div><!-- #cex_main -->\n\n</div><!-- #cex_hud -->\n";

var browser = new CxBrowser();
var storage = new CxStorage(browser);
var message = new CxMessage(browser);

var cxPanel;
var cxPanelView;

// panel/js/init_chrome.js

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (_.has(request, 'tabs')) {
    cxPanel.receiveOpenTabs(request.tabs);
  } else if (_.has(request, 'activeTab'))  {
    cxPanel.receiveActiveTab(request.activeTab);
  } else if (request.allLogEntries) {
    cxPanel.receiveAllLogEntries(request.allLogEntries);
  } else if (request.countryLog) {
    cxPanel.receiveCitizenship(request.countryLog);
  } else if (_.has(request, 'ownGeoData')) {
    cxPanel.receiveOwnGeoData(request.ownGeoData);
  }
});

cxPanel = new CxPanel(browser);
cxPanelView = new CxPanelView({ model: cxPanel, template: panelTemplate });
