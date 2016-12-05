'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventPage = function () {
    function EventPage() {
        _classCallCheck(this, EventPage);

        this.status = {
            DISABLED: {
                key: 'disabled',
                buttonEnabled: true,
                title: 'Enable LiveReload',
                icon: 'icon-inactive.png'
            },
            ENABLED: {
                key: 'enabled',
                buttonEnabled: false,
                title: 'Connected! Click to disable',
                icon: 'icon-active.png'
            }
        };

        this.addOnCompletedListener();
        this.addOnClickedListener();
    }

    _createClass(EventPage, [{
        key: 'addOnCompletedListener',
        value: function addOnCompletedListener() {
            var _this = this;

            chrome.webNavigation.onCompleted.addListener(function (details) {
                var tabName = 'tab' + details.tabId;

                chrome.storage.sync.get(_defineProperty({}, tabName, null), function (storage) {
                    if (storage[tabName]) {
                        _this.updateStatus(storage[tabName]);
                    }
                });
            });
        }
    }, {
        key: 'addOnClickedListener',
        value: function addOnClickedListener() {
            var _this2 = this;

            chrome.browserAction.onClicked.addListener(function (tab) {
                var tabName = 'tab' + tab.id;

                chrome.storage.sync.get(_defineProperty({}, tabName, null), function (storage) {
                    tab = storage[tabName] || tab;

                    if (_typeof(tab.status) !== 'object') {
                        tab.status = _this2.status.ENABLED;
                    } else {
                        tab.status = tab.status.key === _this2.status.DISABLED.key ? _this2.status.ENABLED : _this2.status.DISABLED;
                    }

                    _this2.updateStatus(tab);

                    chrome.storage.sync.set(_defineProperty({}, tabName, tab));

                    _this2.clearZombieTabs();
                });
            });
        }
    }, {
        key: 'updateStatus',
        value: function updateStatus(tab) {
            chrome.tabs.sendMessage(tab.id, tab.status.key);

            chrome.browserAction.setTitle({
                title: tab.status.title,
                tabId: tab.id
            });

            chrome.browserAction.setIcon({
                path: 'images/' + tab.status.icon,
                tabId: tab.id
            });
        }
    }, {
        key: 'clearZombieTabs',
        value: function clearZombieTabs() {
            chrome.storage.sync.get(null, function (storage) {
                var _loop = function _loop(key) {
                    if (storage.hasOwnProperty(key) && key.indexOf('tab') >= 0) {
                        (function () {
                            var tab = storage[key];
                            var found = false;

                            chrome.tabs.query({}, function (activeTabs) {
                                for (var at = 0; at < activeTabs.length; at++) {
                                    var activeTab = activeTabs[at];

                                    if (activeTab.id === tab.id) {
                                        found = true;
                                    }
                                }

                                if (!found) {
                                    chrome.storage.sync.remove(key);
                                }
                            });
                        })();
                    }
                };

                for (var key in storage) {
                    _loop(key);
                }
            });
        }
    }]);

    return EventPage;
}();

new EventPage();