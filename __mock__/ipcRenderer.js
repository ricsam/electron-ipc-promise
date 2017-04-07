
let listeners = [];
let eventObject = null;
let mainListeners = [];

let ipcRenderer = {
  on: (channel, listener) => {
    listeners.push({
      channel: channel,
      cb: listener
    });
  },
  once: (channel, listener) => {
    let index = listeners.length;
    listeners.push({
      channel: channel,
      cb: (...args) => {
        listener(...args);
        listeners[index].channel = null;
      }
    });
  },
  send: (channel, ...args) => {
    mainListeners.forEach((listener) => {
      if (listener.channel === channel) {
        listener.cb(eventObject, ...args);
      }
    });
  },
  removeListener: () => {}
};

ipcRenderer.__main = {
  removeListener: () => {}
};

ipcRenderer.__main.on = (channel, listener) => {
  mainListeners.push({
    channel: channel,
    cb: listener
  });
};

ipcRenderer.__main.once = (channel, listener) => {
    let index = mainListeners.length;
    mainListeners.push({
      channel: channel,
      cb: (...args) => {
        listener(...args);
        mainListeners[index].channel = null;
      }
    });
};

ipcRenderer.__main.send = (channel, ...args) => {
  listeners.forEach((listener) => {
    if (listener.channel === channel) {
      listener.cb(eventObject, ...args);
    }
  })
};


module.exports = ipcRenderer;
