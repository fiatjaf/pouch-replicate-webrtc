#  pouch-replicate-webrtc

Replicate a PouchDB over a WebRTC DataChannel, for NodeJS and the Browser.

## About

By using a WebRTC DataChannel, we can share data between browsers without storing
the data on a centralized server.

Uses [pouchdb-replication-stream](https://github.com/nolanlawson/pouchdb-replication-stream)
for replicating PouchDB data.

## Install

This library can be used both on Serverside and on Clientside.

### On Serverside, using NodeJS

```
$ npm install --save fiatjaf/pouch-replicate-webrtc
```

### On Clientside

You can import the pouch-replicate-webrtc.min.js from the dist folder and have `PouchReplicator` as a global variable, or you can use browserify.

## Usage

You'll need to setup a valid [RTCDataChannel](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel). This library doesn't care how. Here's a [dirty-hands as-simple-as-possible example](https://gist.github.com/fiatjaf/229a5db2f431ab707e3fb909240dcdf2) of how to do so, but there are also a lot of libraries that claim to make that job easier out there.

Example:

```javascript
var PouchDB = require('pouchdb')  // not included
var PouchReplicator = require('pouch-replicate-webrtc')

var db = new PouchDB('webrtc-replicated-pouch')
var replicator = new PouchReplicator('replicator', PouchDB, db, {batch_size: 50})

replicator.on('endpeerreplicate', function () {
  console.log('received data from replication')
})

db.post({description: 'a document to be replicated via webrtc', value: Math.random()})

getSomehowAValidRTCDataChannel(function (remotePeerId, datachannel) {
  replicator.addPeer(remotePeerId, datachannel)
  replicator.replicate()
})

```

## Build

### Clientside

To build the Clientside version, you will need to run:

```
npm install
npm run browserify
```

## License

MIT © [Scott Dietrich](http://minutestopost.com)
