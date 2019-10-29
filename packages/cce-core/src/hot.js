console.log('Include reloader');

function getBrowserContext() {
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof document !== 'undefined') {
    return document;
  }
  throw new Error('Not in browser context, aborting script');
}

(async function() {
  const window = await getBrowserContext();
  const currentTab = await getCurrentTab();
  const socket = new window.WebSocket('ws://localhost:8005');

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
    console.log('Reloading extension');
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
    console.log('connection with reloading server established');
    socket.send(
      JSON.stringify({ type: 'HELLO', id: currentTab && currentTab.id })
    );
  });

  socket.addEventListener('message', function(event) {
    const msg = JSON.parse(event.data);
    console.log('Message from server ', msg);
    switch (msg.type) {
      case 'RELOAD':
        reloadExtension();
    }
  });
})();
