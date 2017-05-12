var stream = require('stream')
var replicationStream = require('pouchdb-replication-stream')
var concat = require('concat-stream')
var util = require('util')
var extend = require('pouchdb-extend')
var ReplicatorCommon = require('replicate-common')

var PouchReplicator = function (name, PouchDB, db, replicationOptions) {
  ReplicatorCommon.call(this, name)

  // PouchReplicator
  this.db = db
  this.replicationOptions = replicationOptions
  this.marker = '__end__'
  this.replData = []

  PouchDB.plugin(replicationStream.plugin)
  PouchDB.adapter('writableStream', replicationStream.adapters.writableStream)
}

util.inherits(PouchReplicator, ReplicatorCommon)

module.exports = PouchReplicator

PouchReplicator.prototype._createStream = function (data) {
  var s = new stream.Readable()
  s._read = function () {}
  s.push(data)
  s.push(null)

  return s
}

PouchReplicator.prototype._getAndClearData = function () {
  var self = this

  var data = self.replData.join('')
  self.replData = []

  var s = self._createStream(data)
  self.db.load(s)
  .then(function (res) {
    self.emit('endpeerreplicate')
  })
  .catch(console.log.bind(console, 'LOAD ERROR'))
}

PouchReplicator.prototype.receiveData = function (chunk) {
  var self = this

  // note double-equals to coerce arraybuffer to string
  if (chunk == self.marker) {
    self._getAndClearData()
  } else {
    self.replData.push(chunk)
  }
}

/**
 * Start PouchDB replication
 @ @return  {Promise}
 */
PouchReplicator.prototype.replicate = function (options) {
  var self = this

  var database = ''
  var concatStream = concat({encoding: 'string'}, function (line) {
    database += line
  })

  return self.db.dump(concatStream, extend(this.replicationOptions, options))
  .then(function () {
    self.streams.forEach(function (s) {
      s.write(database)
      s.write(self.marker)
    })
  })
}
