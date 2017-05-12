#  pouch-replicate-webrtc

Replicate a PouchDB over a WebRTC DataChannel, for NodeJS and the Browser.

## about

By using a WebRTC DataChannel, we can share data between browsers without storing
the data on a centralized server.

Uses [pouchdb-replication-stream](https://github.com/nolanlawson/pouchdb-replication-stream) for replicating PouchDB data.

## demo

Visit https://rawgit.com/fiatjaf/pouch-replicate-webrtc/master/demo.html in two different browsers, or tell a friend to try the demo with you, then press "start" on only one of the pages, get the signaling string and pass to the other, the other will generate its own signaling string, pass it to the first.

After that everything will be synced, you can generate random documents in a local PouchDB and see them apppearing on the other database.

## install

This library can be used both on server and on client.

```
npm install --save fiatjaf/pouch-replicate-webrtc
```

On the browser you can import the pouch-replicate-webrtc.min.js from the dist folder and have `PouchReplicator` as a global variable, or you can use browserify.

## usage

You'll need to setup a valid [RTCDataChannel](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel). This library doesn't care how. Here's a [dirty-hands as-simple-as-possible example](https://gist.github.com/fiatjaf/229a5db2f431ab707e3fb909240dcdf2) of how to do so using a simple websocket server that only broadcasts events to every connected client, [our demo](demo.html) has a different approach, passing the signaling data manually as strings between peers through external means. There are also a lot of libraries that claim to make that job easier out there.

Example:

```javascript
var PouchDB = require('pouchdb') // not included
var PouchReplicator = require('pouch-replicate-webrtc')

var db = new PouchDB('a-name-for-the-database')
var replicator = new PouchReplicator('a-name-for-the-replicator', PouchDB, db, {batch_size: 50})

replicator.on('endpeerreplicate', function () {
  console.log('received data replicated from the peer')
})

db.post({description: 'a document to be replicated via webrtc', value: Math.random()})

getSomehowAValidRTCDataChannel(function (remotePeerId, datachannel) {
  replicator.addPeer(remotePeerId, datachannel)
  replicator.replicate() // will send data to that peer
    .then(() => console.log('sent data to the peer'))
    .catch(() => console.log('error sending data'))
})

```

## license

MIT © [Scott Dietrich](http://minutestopost.com)
MIT © [Giovanni Parra](http://fiatjaf.alhur.es)
