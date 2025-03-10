(() => {
  const canParse = (x) => {
    try {
      JSON.parse(x);
      return true;
    } catch {
      return false;
    }
  };
  const decoder = new TextDecoder();
  const decode = (x) => decoder.decode(x);
  function logData(data) {
    if (data instanceof Uint8Array) {
      console.warn(decode(data));
    } else if (data instanceof ArrayBuffer) {
      console.warn(decode(new Uint8Array(data)));
    } else if (canParse(data)) {
      console.warn(JSON.parse(data));
    }
  }
  const $events = Symbol("*events");

  function init($this) {
    if (!$this[$events]) {
      $this.addEventListener("message", function message(event) {
        console.warn("WebSocket Message Event:", this, ...arguments);
        logData(event.data);
      });
      $this.addEventListener("close", function close() {
        console.warn("WebSocket Close Event:", this, ...arguments);
      });
      $this.addEventListener("error", function error() {
        console.warn("WebSocket Error Event:", this, ...arguments);
      });
      $this.addEventListener("open", function open() {
        console.warn("WebSocket Open Event:", this, ...arguments);
      });
      $this[$events] = true;
    }
  }
  (() => {
    const _send = WebSocket.prototype.send;
    WebSocket.prototype.send = function send(data) {
      init(this);
      console.warn("WebSocket Send:", this, ...arguments);
      logData(data);
      return _send.apply(this, arguments);
    };
  })();
  (() => {
    const _close = WebSocket.prototype.close;
    WebSocket.prototype.close = function close() {
      init(this);
      console.warn("WebSocket Close:", this, ...arguments);
      return _close.apply(this, arguments);
    };
  })();
  (() => {
    const _constructor = WebSocket.prototype.constructor;
    WebSocket.prototype.constructor = function constructor() {
      init(this);
      console.warn("WebSocket Constructor:", this, ...arguments);
      return Reflect.construct(_constructor, arguments, this);
    };
  })();
  (() => {
    const WebSocketLog = class WebSocket extends WebSocket {
      constructor() {
        super(...arguments);
        console.warn("WebSocket New:", this, ...arguments);
      }
    };
    globalThis.WebSocket = WebSocketLog;
  })();
})();
