((chrome) => {
    document.addEventListener('DOMContentLoaded', restoreOptions);
    document.getElementById('save').addEventListener('click', saveOptions);

    function restoreOptions() {
        chrome.storage.sync.get({
            host: 'localhost',
            port: '35729'
        }, (storage) => {
            document.getElementById('host').value = storage.host || 'localhost';
            document.getElementById('port').value = storage.port || 35729;
        });
    }

    function saveOptions() {
        chrome.storage.sync.set({
            host: document.getElementById('host').value,
            port: document.getElementById('port').value
        }, () => {
            window.close();
        });
    }
})(chrome);
