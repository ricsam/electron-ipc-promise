import { ipcRenderer } from 'electron';

export default class ipc {
  constructor(proxy) {

    this.proxy = proxy;

    this.id = 0;
    this.timeout = 1500;
    this.instance_id = Math.random().toString(36).substring(7);
    this.callbacks = [];

  }

  generateKey() {
    this.id++;
    return `${this.instance_id}#${this.id}`;
  }

  listenFor(channel, cb) {

    if (!this.callbacks.hasOwnProperty(channel)) {
      this.proxy.on(channel, (event, cb_key, ...args) => {
        this.callbacks[channel][cb_key](...args);

        this.proxy.removeListener(channel, this.callbacks[channel][cb_key]);
        delete this.callbacks[channel][cb_key];

        if (Object.keys(this.callbacks[channel]).length === 0) {
          delete this.callbacks[channel];
        }
      });
      this.callbacks[channel] = {};
    }

    let cb_key = this.generateKey();
    this.callbacks[channel][cb_key] = cb;
    return cb_key;
  }

  send(listener, ...args) { return new Promise((resolve, reject) => {

    let cb_key = this.listenFor(listener, (...args) => {
      resolve(...args);
    });


    this.proxy.send(listener, {id: cb_key, channel: listener}, ...args);

  })}

  respond(where, ...args) {
    this.proxy.send(where.channel, where.id, ...args);
  }

  once(channel) {
    return this.normalListen('once', channel);
  }

  on(channel) {
    return this.normalListen('on', channel);
  }

  normalListen(ononce, channel) { return new Promise((resolve, reject) => {
    this.proxy[ononce](channel, (event, data) => {
      resolve(data);
    });
  })}

};
