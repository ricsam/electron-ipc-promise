jest.mock('ipcRenderer');

describe('the mock', () => {
  let ipcRenderer = require('ipcRenderer');
  it('sendFromMain should work as expected', () => {
    ipcRenderer.on('something', (event, data) => {
      expect(data).toEqual('sentfrommain');
    });
    ipcRenderer.__main.send('something', 'sentfrommain');
  });
  it('listenFromMain should work as expected', () => {
    let called = false;
    ipcRenderer.__main.on('something', (event, data) => {
      expect(data).toEqual('sentfromrenderer');
      called = true;
    });
    ipcRenderer.send('something', 'sentfromrenderer');

    expect(called).toBeTruthy();
  });
});


describe('the api', () => {
  let ipcRenderer = require('ipcRenderer');
  let ipc = require('../../app/apis/ipc');

  const rendererTunnel = new ipc(ipcRenderer),
    mainTunnel = new ipc(ipcRenderer.__main);


  it('should work when listening', () => {
    rendererTunnel.on('some-channel').then((data) => {
      expect(data).toEqual('data');
    });
    ipcRenderer.__main.send('some-channel', 'data');
  });

  it('should work when sending data', () => {
    ipcRenderer.__main.on('somethingforthis', (event, id) => {
      ipcRenderer.__main.send('somethingforthis', id.id, 'sent-from-main');
    });

    rendererTunnel.send('somethingforthis').then((response) => {
      expect(response).toEqual('sent-from-main');
    });


  });

  it('should be a polymorfic api', () => {
    mainTunnel.on('getsomedata').then((id) => {
      mainTunnel.respond(id, 'the data from the computer');
    });

    rendererTunnel.send('getsomedata').then((resp) => {
      expect(resp).toEqual('the data from the computer');
    });


  });


});
