(function usabilityTest() {
  if (!chrome.storage) {
    throw new Error(
      'chrome.storage object not found. Did you forget to include the "storage" permission in extension.config.js?'
    );
  }
})();

class SyncStore {
  constructor() {
    this.store = {};
    chrome.storage.onChanged.addListener(this.onUpdate);
  }

  get(key) {
    return this.store[key];
  }

  onUpdate(changes, areaName) {
    if (areaName !== 'local') return;
    for (let key in changes) {
      this.store[key] = changes.newValue;
    }
  }

  set(changes) {
    Object.assign(this.store, changes);
    chrome.storage.local.set(changes);
  }
}

module.exports = SyncStore;
