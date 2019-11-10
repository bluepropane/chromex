function getBrowserContext() {
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof document !== 'undefined') {
    return document;
  }
  throw new Error('Not in browser context, aborting script');
}

const log = ['log', 'error', 'warn'].reduce(
  (logger, level) => ({
    ...logger,
    [level]: console[level].bind(null, '[Reloader]'),
  }),
  {}
);

(async function() {
  log.log('Initializing reloader...');
  const window = await getBrowserContext();
  const currentTab = await getCurrentTab();
  const extInfo = await new Promise(res => chrome.management.getSelf(res));

  console.log(currentTab, extInfo);

  function getCurrentTab() {
    return new Promise((res, rej) => {
      chrome.tabs.query({ currentWindow: true, active: true }, function(
        tabArray
      ) {
        res(tabArray[0]);
      });
    });
  }

  function removeAllListeners(socket) {
    ['onopen', 'onmessage', 'onerror', 'onclose'].forEach(l => {
      socket[l] = null;
    });
  }

  async function reloadExtension() {
    log.log('Reloading extension');
    // if (extInfo.installType === 'development' && extInfo.enabled === true) {
    //   await new Promise(res =>
    //     chrome.management.setEnabled(extInfo.id, false, res)
    //   );
    //   await new Promise(res =>
    //     chrome.management.setEnabled(extInfo.id, true, res)
    //   );
    // }

    // await new Promise(res => {
    //   chrome.tabs.reload(currentTab.id, {}, res);
    // });
    window.location.reload();
  }

  function connect() {
    let socket = new window.WebSocket('ws://localhost:8005');

    socket.onopen = function(event) {
      log.log(`Live reload active. self id: ${currentTab.id}`);
      socket.send(
        JSON.stringify({ type: 'HELLO', id: currentTab && currentTab.id })
      );
    };

    socket.onmessage = function(event) {
      const msg = JSON.parse(event.data);
      log.log('Message from server ', msg);
      switch (msg.type) {
        case 'RELOAD':
          reloadExtension();
      }
    };

    socket.onerror = function(err) {
      log.error('Error connecting to server:', err);
    };

    socket.onclose = function() {
      removeAllListeners(socket);
      socket = undefined;
      connect();
    };
  }
  connect();
})();
