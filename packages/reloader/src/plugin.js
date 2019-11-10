const WebSocket = require('ws');

const defaultOpts = {
  port: 8005,
};

class ChromexReloaderPlugin {
  constructor(opts = {}) {
    opts = Object.assign({}, defaultOpts, opts);
    this.chunkHashes = {};

    this.server = new WebSocket.Server({ port: opts.port });
    console.log('Started chromex reloader-server on port', opts.port);
    this.server.on('connection', this.initSocketConnection);
  }

  initSocketConnection(socket) {
    let identity = null;
    socket.on('message', data => {
      const msg = JSON.parse(data);
      switch (msg.type) {
        case 'HELLO':
          identity = msg.id;
      }
      console.log('Received', msg);
    });

    socket.on('close', (...args) => {
      console.log('Socket closed:', identity);
    });
  }

  broadcastReload() {
    this.server.clients.forEach(function(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'RELOAD' }));
      }
    });
  }

  log(compilation, ...args) {
    let logger = compilation.getLogger
      ? compilation.getLogger('ChromexReloaderPlugin')
      : console.log;

    if (typeof logger !== 'function') logger = console.log;

    logger(...args);
  }

  getChanges(chunks) {
    return chunks.filter(({ name, hash }) => {
      const prevHash = this.chunkHashes[name];
      this.chunkHashes[name] = hash;
      return hash !== prevHash;
    });
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise(
      'ChromexReloaderPlugin',
      async compilation => {
        const changes = this.getChanges(compilation.chunks);
        if (changes.length > 0) {
          this.log(
            compilation,
            'Changes detected in',
            changes.map(({ id }) => id),
            'reloading extension components'
          );
          await this.broadcastReload();
        }
      }
    );
  }
}

module.exports = ChromexReloaderPlugin;
