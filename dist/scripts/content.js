'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContentScript = function () {
    function ContentScript() {
        var _this = this;

        _classCallCheck(this, ContentScript);

        chrome.runtime.onMessage.addListener(function (message, sender, response) {
            chrome.storage.sync.get({
                host: location.host,
                port: 35729
            }, function (storage) {
                switch (message) {
                    case 'enabled':
                        _this.enable(storage);
                        break;
                    case 'disabled':
                        _this.disable(storage);
                        break;
                    case 'options-saved':
                        _this.showSavedDialog();
                        break;
                    default:
                        console.error('No message body defined.');
                }
            });
        });
    }

    _createClass(ContentScript, [{
        key: 'enable',
        value: function enable(storage) {
            var DEFAULT_HOST = 'localhost';
            var DEFAULT_PORT = 1234;
            var livereload = document.createElement('script');
            livereload.type = 'text/javascript';
            livereload.src = 'http://' + (storage.host || DEFAULT_HOST).split(':')[0] + ':' + (storage.port || DEFAULT_PORT) + '/livereload.js?snipver=1';
            document.body.appendChild(livereload);
        }
    }, {
        key: 'disable',
        value: function disable(storage) {
            // Remove script
            var script = document.querySelector('script[src*="livereload.js"]');
            if (script) {
                document.body.removeChild(script);
            }
            // Shutdown LiveReload
            var event = document.createEvent('HTMLEvents');
            event.initEvent('LiveReloadShutDown', true, true);
            document.dispatchEvent(event);
        }
    }, {
        key: 'showSavedDialog',
        value: function showSavedDialog() {
            // Close options
            document.querySelector('#extension-options-overlay .close-button').click();

            var dialog = document.createElement('div');
            div.textContent = 'Options saved.';
            div.className = 'saved-dialog';

            document.body.appendChild(dialog);
        }
    }]);

    return ContentScript;
}();

new ContentScript();