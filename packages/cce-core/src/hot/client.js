function getBrowserContext() {
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof document !== 'undefined') {
    return document;
  }
  throw new Error('Not in browser context, aborting script');
}

function log(...args) {
  console.log('[Hot Reload]', ...args);
}

(async function() {
  const window = await getBrowserContext();
  const currentTab = await getCurrentTab();
  log('Initializing hot reload...');
  const socket = new window.WebSocket('ws://localhost:8005');
  log(`Hot reload active. self id: ${currentTab.id}`);

  function getCurrentTab() {
    return new Promise((res, rej) => {
      chrome.tabs.query({ currentWindow: true, active: true }, function(
        tabArray
      ) {
        res(tabArray[0]);
      });
    });
  }

  async function reloadExtension() {
    log('Reloading extension');
    const extInfo = new Promise(res => chrome.management.getSelf(res));

    if (extInfo.installType === 'development' && extInfo.enabled === true) {
      await new Promise(res =>
        chrome.management.setEnabled(extInfo.id, false, res)
      );
      await new Promise(res =>
        chrome.management.setEnabled(extInfo.id, true, res)
      );
    }

    window.location.reload();
  }

  socket.addEventListener('open', function(event) {
    log('connection with reloading server established');
    socket.send(
      JSON.stringify({ type: 'HELLO', id: currentTab && currentTab.id })
    );
  });

  socket.addEventListener('message', function(event) {
    const msg = JSON.parse(event.data);
    log('Message from server ', msg);
    switch (msg.type) {
      case 'RELOAD':
        reloadExtension();
    }
  });
})();
