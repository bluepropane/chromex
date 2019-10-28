const WebSocket = require('ws');

const defaultOpts = {
  port: 8005,
};

class CCEHotReloadPlugin {
  constructor(opts = {}) {
    opts = Object.assign({}, defaultOpts, opts);

    this.server = new WebSocket.Server({ port: opts.port });
    console.log('Started CCE hot reload server on port', opts.port);
    this.targetBundles = ['reloaderBg', 'reloaderContent'];
    this.chunkHashes = {};
  }

  broadcastReload() {
    this.server.clients.forEach(function(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send({ type: 'RELOAD' });
      }
    });
  }

  log(compilation, ...args) {
    let logger = compilation.getLogger
      ? compilation.getLogger('CCEHotReloadPlugin')
      : console.log;

    if (typeof logger !== 'function') logger = console.log;

    logger(...args);
  }

  hasChanges(chunks) {
    return (
      chunks.filter(({ name, hash }) => {
        const prevHash = this.chunkHashes[name];
        this.chunkHashes[name] = hash;
        return hash !== prevHash;
      }).length > 0
    );
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise(
      'CCEHotReloadPlugin',
      async compilation => {
        if (this.hasChanges(compilation.chunks)) {
          this.log(
            compilation,
            'Changes detected, reloading extension components'
          );
          await this.broadcastReload();
        }
      }
    );
  }
}

module.exports = CCEHotReloadPlugin;
