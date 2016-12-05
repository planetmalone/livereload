class ContentScript {
    constructor() {
        chrome.runtime.onMessage.addListener((message, sender, response) => {
            chrome.storage.sync.get({
                host: location.host,
                port: 35729
            }, (storage) => {
                switch (message) {
                    case 'enabled':
                        this.enable(storage);
                        break;
                    case 'disabled':
                        this.disable(storage);
                        break;
                    case 'options-saved':
                        this.showSavedDialog();
                        break;
                    default:
                        console.error('No message body defined.');
                }
            });
        });
    }

    enable(storage) {
        let DEFAULT_HOST = 'localhost';
        let DEFAULT_PORT = 1234;
        let livereload = document.createElement('script');
        livereload.type = 'text/javascript';
        livereload.src = 'http://' + (storage.host || DEFAULT_HOST).split(':')[0] + ':' + (storage.port || DEFAULT_PORT) + '/livereload.js?snipver=1';
        document.body.appendChild(livereload);
    }

    disable(storage) {
        // Remove script
        let script = document.querySelector('script[src*="livereload.js"]');
        if (script) {
            document.body.removeChild(script);
        }
        // Shutdown LiveReload
        let event = document.createEvent('HTMLEvents');
        event.initEvent('LiveReloadShutDown', true, true);
        document.dispatchEvent(event);
    }

    showSavedDialog() {
        // Close options
        document.querySelector('#extension-options-overlay .close-button').click();

        let dialog = document.createElement('div');
        div.textContent = 'Options saved.';
        div.className = 'saved-dialog';

        document.body.appendChild(dialog);
    }
}

new ContentScript();
