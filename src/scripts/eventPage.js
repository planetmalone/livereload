class EventPage {
    constructor() {
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

    addOnCompletedListener() {
        chrome.webNavigation.onCompleted.addListener((details) => {
            let tabName = `tab${details.tabId}`;

            chrome.storage.sync.get({
                [tabName]: null
            }, (storage) => {
                if (storage[tabName]) {
                    this.updateStatus(storage[tabName]);
                }
            });
        });
    }

    addOnClickedListener() {
        chrome.browserAction.onClicked.addListener((tab) => {
            let tabName = `tab${tab.id}`;

            chrome.storage.sync.get({
                [tabName]: null
            }, (storage) => {
                tab = storage[tabName] || tab;

                if (typeof tab.status !== 'object') {
                    tab.status = this.status.ENABLED;
                } else {
                    tab.status = tab.status.key === this.status.DISABLED.key ? this.status.ENABLED : this.status.DISABLED;
                }

                this.updateStatus(tab);

                chrome.storage.sync.set({
                    [tabName]: tab
                });

                this.clearZombieTabs();
            });
        });
    }

    updateStatus(tab) {
        chrome.tabs.sendMessage(tab.id, tab.status.key);

        chrome.browserAction.setTitle({
            title: tab.status.title,
            tabId: tab.id
        });

        chrome.browserAction.setIcon({
            path: `images/${tab.status.icon}`,
            tabId: tab.id
        });
    }

    clearZombieTabs() {
        chrome.storage.sync.get(null, (storage) => {
            for (let key in storage) {
                if (storage.hasOwnProperty(key) && key.indexOf('tab') >= 0) {
                    let tab = storage[key];
                    let found = false;

                    chrome.tabs.query({}, (activeTabs) => {
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
                }
            }
        });
    }
}

new EventPage();
