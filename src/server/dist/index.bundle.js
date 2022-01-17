/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/server/node_modules/base64id/lib/base64id.js":
/*!**********************************************************!*\
  !*** ./src/server/node_modules/base64id/lib/base64id.js ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

/*!
 * base64id v0.1.0
 */

/**
 * Module dependencies
 */

var crypto = __webpack_require__(/*! crypto */ "crypto");

/**
 * Constructor
 */

var Base64Id = function() { };

/**
 * Get random bytes
 *
 * Uses a buffer if available, falls back to crypto.randomBytes
 */

Base64Id.prototype.getRandomBytes = function(bytes) {

  var BUFFER_SIZE = 4096
  var self = this;  
  
  bytes = bytes || 12;

  if (bytes > BUFFER_SIZE) {
    return crypto.randomBytes(bytes);
  }
  
  var bytesInBuffer = parseInt(BUFFER_SIZE/bytes);
  var threshold = parseInt(bytesInBuffer*0.85);

  if (!threshold) {
    return crypto.randomBytes(bytes);
  }

  if (this.bytesBufferIndex == null) {
     this.bytesBufferIndex = -1;
  }

  if (this.bytesBufferIndex == bytesInBuffer) {
    this.bytesBuffer = null;
    this.bytesBufferIndex = -1;
  }

  // No buffered bytes available or index above threshold
  if (this.bytesBufferIndex == -1 || this.bytesBufferIndex > threshold) {
     
    if (!this.isGeneratingBytes) {
      this.isGeneratingBytes = true;
      crypto.randomBytes(BUFFER_SIZE, function(err, bytes) {
        self.bytesBuffer = bytes;
        self.bytesBufferIndex = 0;
        self.isGeneratingBytes = false;
      }); 
    }
    
    // Fall back to sync call when no buffered bytes are available
    if (this.bytesBufferIndex == -1) {
      return crypto.randomBytes(bytes);
    }
  }
  
  var result = this.bytesBuffer.slice(bytes*this.bytesBufferIndex, bytes*(this.bytesBufferIndex+1)); 
  this.bytesBufferIndex++; 
  
  return result;
}

/**
 * Generates a base64 id
 *
 * (Original version from socket.io <http://socket.io>)
 */

Base64Id.prototype.generateId = function () {
  var rand = Buffer.alloc(15); // multiple of 3 for base64
  if (!rand.writeInt32BE) {
    return Math.abs(Math.random() * Math.random() * Date.now() | 0).toString()
      + Math.abs(Math.random() * Math.random() * Date.now() | 0).toString();
  }
  this.sequenceNumber = (this.sequenceNumber + 1) | 0;
  rand.writeInt32BE(this.sequenceNumber, 11);
  if (crypto.randomBytes) {
    this.getRandomBytes(12).copy(rand);
  } else {
    // not secure for node 0.4
    [0, 4, 8].forEach(function(i) {
      rand.writeInt32BE(Math.random() * Math.pow(2, 32) | 0, i);
    });
  }
  return rand.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
};

/**
 * Export
 */

exports = module.exports = new Base64Id();


/***/ }),

/***/ "./src/server/node_modules/component-emitter/index.js":
/*!************************************************************!*\
  !*** ./src/server/node_modules/component-emitter/index.js ***!
  \************************************************************/
/***/ ((module) => {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  // Remove event specific arrays for event types that no
  // one is subscribed for to avoid memory leak.
  if (callbacks.length === 0) {
    delete this._callbacks['$' + event];
  }

  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};

  var args = new Array(arguments.length - 1)
    , callbacks = this._callbacks['$' + event];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),

/***/ "./src/server/node_modules/cors/lib/index.js":
/*!***************************************************!*\
  !*** ./src/server/node_modules/cors/lib/index.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

(function () {

  'use strict';

  var assign = __webpack_require__(/*! object-assign */ "object-assign");
  var vary = __webpack_require__(/*! vary */ "vary");

  var defaults = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  };

  function isString(s) {
    return typeof s === 'string' || s instanceof String;
  }

  function isOriginAllowed(origin, allowedOrigin) {
    if (Array.isArray(allowedOrigin)) {
      for (var i = 0; i < allowedOrigin.length; ++i) {
        if (isOriginAllowed(origin, allowedOrigin[i])) {
          return true;
        }
      }
      return false;
    } else if (isString(allowedOrigin)) {
      return origin === allowedOrigin;
    } else if (allowedOrigin instanceof RegExp) {
      return allowedOrigin.test(origin);
    } else {
      return !!allowedOrigin;
    }
  }

  function configureOrigin(options, req) {
    var requestOrigin = req.headers.origin,
      headers = [],
      isAllowed;

    if (!options.origin || options.origin === '*') {
      // allow any origin
      headers.push([{
        key: 'Access-Control-Allow-Origin',
        value: '*'
      }]);
    } else if (isString(options.origin)) {
      // fixed origin
      headers.push([{
        key: 'Access-Control-Allow-Origin',
        value: options.origin
      }]);
      headers.push([{
        key: 'Vary',
        value: 'Origin'
      }]);
    } else {
      isAllowed = isOriginAllowed(requestOrigin, options.origin);
      // reflect origin
      headers.push([{
        key: 'Access-Control-Allow-Origin',
        value: isAllowed ? requestOrigin : false
      }]);
      headers.push([{
        key: 'Vary',
        value: 'Origin'
      }]);
    }

    return headers;
  }

  function configureMethods(options) {
    var methods = options.methods;
    if (methods.join) {
      methods = options.methods.join(','); // .methods is an array, so turn it into a string
    }
    return {
      key: 'Access-Control-Allow-Methods',
      value: methods
    };
  }

  function configureCredentials(options) {
    if (options.credentials === true) {
      return {
        key: 'Access-Control-Allow-Credentials',
        value: 'true'
      };
    }
    return null;
  }

  function configureAllowedHeaders(options, req) {
    var allowedHeaders = options.allowedHeaders || options.headers;
    var headers = [];

    if (!allowedHeaders) {
      allowedHeaders = req.headers['access-control-request-headers']; // .headers wasn't specified, so reflect the request headers
      headers.push([{
        key: 'Vary',
        value: 'Access-Control-Request-Headers'
      }]);
    } else if (allowedHeaders.join) {
      allowedHeaders = allowedHeaders.join(','); // .headers is an array, so turn it into a string
    }
    if (allowedHeaders && allowedHeaders.length) {
      headers.push([{
        key: 'Access-Control-Allow-Headers',
        value: allowedHeaders
      }]);
    }

    return headers;
  }

  function configureExposedHeaders(options) {
    var headers = options.exposedHeaders;
    if (!headers) {
      return null;
    } else if (headers.join) {
      headers = headers.join(','); // .headers is an array, so turn it into a string
    }
    if (headers && headers.length) {
      return {
        key: 'Access-Control-Expose-Headers',
        value: headers
      };
    }
    return null;
  }

  function configureMaxAge(options) {
    var maxAge = (typeof options.maxAge === 'number' || options.maxAge) && options.maxAge.toString()
    if (maxAge && maxAge.length) {
      return {
        key: 'Access-Control-Max-Age',
        value: maxAge
      };
    }
    return null;
  }

  function applyHeaders(headers, res) {
    for (var i = 0, n = headers.length; i < n; i++) {
      var header = headers[i];
      if (header) {
        if (Array.isArray(header)) {
          applyHeaders(header, res);
        } else if (header.key === 'Vary' && header.value) {
          vary(res, header.value);
        } else if (header.value) {
          res.setHeader(header.key, header.value);
        }
      }
    }
  }

  function cors(options, req, res, next) {
    var headers = [],
      method = req.method && req.method.toUpperCase && req.method.toUpperCase();

    if (method === 'OPTIONS') {
      // preflight
      headers.push(configureOrigin(options, req));
      headers.push(configureCredentials(options, req));
      headers.push(configureMethods(options, req));
      headers.push(configureAllowedHeaders(options, req));
      headers.push(configureMaxAge(options, req));
      headers.push(configureExposedHeaders(options, req));
      applyHeaders(headers, res);

      if (options.preflightContinue) {
        next();
      } else {
        // Safari (and potentially other browsers) need content-length 0,
        //   for 204 or they just hang waiting for a body
        res.statusCode = options.optionsSuccessStatus;
        res.setHeader('Content-Length', '0');
        res.end();
      }
    } else {
      // actual response
      headers.push(configureOrigin(options, req));
      headers.push(configureCredentials(options, req));
      headers.push(configureExposedHeaders(options, req));
      applyHeaders(headers, res);
      next();
    }
  }

  function middlewareWrapper(o) {
    // if options are static (either via defaults or custom options passed in), wrap in a function
    var optionsCallback = null;
    if (typeof o === 'function') {
      optionsCallback = o;
    } else {
      optionsCallback = function (req, cb) {
        cb(null, o);
      };
    }

    return function corsMiddleware(req, res, next) {
      optionsCallback(req, function (err, options) {
        if (err) {
          next(err);
        } else {
          var corsOptions = assign({}, defaults, options);
          var originCallback = null;
          if (corsOptions.origin && typeof corsOptions.origin === 'function') {
            originCallback = corsOptions.origin;
          } else if (corsOptions.origin) {
            originCallback = function (origin, cb) {
              cb(null, corsOptions.origin);
            };
          }

          if (originCallback) {
            originCallback(req.headers.origin, function (err2, origin) {
              if (err2 || !origin) {
                next(err2);
              } else {
                corsOptions.origin = origin;
                cors(corsOptions, req, res, next);
              }
            });
          } else {
            next();
          }
        }
      });
    };
  }

  // can pass either an options hash, an options delegate, or nothing
  module.exports = middlewareWrapper;

}());


/***/ }),

/***/ "./src/server/node_modules/socket.io-adapter/dist/index.js":
/*!*****************************************************************!*\
  !*** ./src/server/node_modules/socket.io-adapter/dist/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Adapter = void 0;
const events_1 = __webpack_require__(/*! events */ "events");
class Adapter extends events_1.EventEmitter {
    /**
     * In-memory adapter constructor.
     *
     * @param {Namespace} nsp
     */
    constructor(nsp) {
        super();
        this.nsp = nsp;
        this.rooms = new Map();
        this.sids = new Map();
        this.encoder = nsp.server.encoder;
    }
    /**
     * To be overridden
     */
    init() { }
    /**
     * To be overridden
     */
    close() { }
    /**
     * Adds a socket to a list of room.
     *
     * @param {SocketId}  id      the socket id
     * @param {Set<Room>} rooms   a set of rooms
     * @public
     */
    addAll(id, rooms) {
        if (!this.sids.has(id)) {
            this.sids.set(id, new Set());
        }
        for (const room of rooms) {
            this.sids.get(id).add(room);
            if (!this.rooms.has(room)) {
                this.rooms.set(room, new Set());
                this.emit("create-room", room);
            }
            if (!this.rooms.get(room).has(id)) {
                this.rooms.get(room).add(id);
                this.emit("join-room", room, id);
            }
        }
    }
    /**
     * Removes a socket from a room.
     *
     * @param {SocketId} id     the socket id
     * @param {Room}     room   the room name
     */
    del(id, room) {
        if (this.sids.has(id)) {
            this.sids.get(id).delete(room);
        }
        this._del(room, id);
    }
    _del(room, id) {
        const _room = this.rooms.get(room);
        if (_room != null) {
            const deleted = _room.delete(id);
            if (deleted) {
                this.emit("leave-room", room, id);
            }
            if (_room.size === 0 && this.rooms.delete(room)) {
                this.emit("delete-room", room);
            }
        }
    }
    /**
     * Removes a socket from all rooms it's joined.
     *
     * @param {SocketId} id   the socket id
     */
    delAll(id) {
        if (!this.sids.has(id)) {
            return;
        }
        for (const room of this.sids.get(id)) {
            this._del(room, id);
        }
        this.sids.delete(id);
    }
    /**
     * Broadcasts a packet.
     *
     * Options:
     *  - `flags` {Object} flags for this packet
     *  - `except` {Array} sids that should be excluded
     *  - `rooms` {Array} list of rooms to broadcast to
     *
     * @param {Object} packet   the packet object
     * @param {Object} opts     the options
     * @public
     */
    broadcast(packet, opts) {
        const flags = opts.flags || {};
        const packetOpts = {
            preEncoded: true,
            volatile: flags.volatile,
            compress: flags.compress
        };
        packet.nsp = this.nsp.name;
        const encodedPackets = this.encoder.encode(packet);
        this.apply(opts, socket => {
            socket.client.writeToEngine(encodedPackets, packetOpts);
        });
    }
    /**
     * Gets a list of sockets by sid.
     *
     * @param {Set<Room>} rooms   the explicit set of rooms to check.
     */
    sockets(rooms) {
        const sids = new Set();
        this.apply({ rooms }, socket => {
            sids.add(socket.id);
        });
        return Promise.resolve(sids);
    }
    /**
     * Gets the list of rooms a given socket has joined.
     *
     * @param {SocketId} id   the socket id
     */
    socketRooms(id) {
        return this.sids.get(id);
    }
    /**
     * Returns the matching socket instances
     *
     * @param opts - the filters to apply
     */
    fetchSockets(opts) {
        const sockets = [];
        this.apply(opts, socket => {
            sockets.push(socket);
        });
        return Promise.resolve(sockets);
    }
    /**
     * Makes the matching socket instances join the specified rooms
     *
     * @param opts - the filters to apply
     * @param rooms - the rooms to join
     */
    addSockets(opts, rooms) {
        this.apply(opts, socket => {
            socket.join(rooms);
        });
    }
    /**
     * Makes the matching socket instances leave the specified rooms
     *
     * @param opts - the filters to apply
     * @param rooms - the rooms to leave
     */
    delSockets(opts, rooms) {
        this.apply(opts, socket => {
            rooms.forEach(room => socket.leave(room));
        });
    }
    /**
     * Makes the matching socket instances disconnect
     *
     * @param opts - the filters to apply
     * @param close - whether to close the underlying connection
     */
    disconnectSockets(opts, close) {
        this.apply(opts, socket => {
            socket.disconnect(close);
        });
    }
    apply(opts, callback) {
        const rooms = opts.rooms;
        const except = this.computeExceptSids(opts.except);
        if (rooms.size) {
            const ids = new Set();
            for (const room of rooms) {
                if (!this.rooms.has(room))
                    continue;
                for (const id of this.rooms.get(room)) {
                    if (ids.has(id) || except.has(id))
                        continue;
                    const socket = this.nsp.sockets.get(id);
                    if (socket) {
                        callback(socket);
                        ids.add(id);
                    }
                }
            }
        }
        else {
            for (const [id] of this.sids) {
                if (except.has(id))
                    continue;
                const socket = this.nsp.sockets.get(id);
                if (socket)
                    callback(socket);
            }
        }
    }
    computeExceptSids(exceptRooms) {
        const exceptSids = new Set();
        if (exceptRooms && exceptRooms.size > 0) {
            for (const room of exceptRooms) {
                if (this.rooms.has(room)) {
                    this.rooms.get(room).forEach(sid => exceptSids.add(sid));
                }
            }
        }
        return exceptSids;
    }
    /**
     * Send a packet to the other Socket.IO servers in the cluster
     * @param packet - an array of arguments, which may include an acknowledgement callback at the end
     */
    serverSideEmit(packet) {
        throw new Error("this adapter does not support the serverSideEmit() functionality");
    }
}
exports.Adapter = Adapter;


/***/ }),

/***/ "./src/server/node_modules/socket.io-parser/dist/binary.js":
/*!*****************************************************************!*\
  !*** ./src/server/node_modules/socket.io-parser/dist/binary.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reconstructPacket = exports.deconstructPacket = void 0;
const is_binary_1 = __webpack_require__(/*! ./is-binary */ "./src/server/node_modules/socket.io-parser/dist/is-binary.js");
/**
 * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @public
 */
function deconstructPacket(packet) {
    const buffers = [];
    const packetData = packet.data;
    const pack = packet;
    pack.data = _deconstructPacket(packetData, buffers);
    pack.attachments = buffers.length; // number of binary 'attachments'
    return { packet: pack, buffers: buffers };
}
exports.deconstructPacket = deconstructPacket;
function _deconstructPacket(data, buffers) {
    if (!data)
        return data;
    if (is_binary_1.isBinary(data)) {
        const placeholder = { _placeholder: true, num: buffers.length };
        buffers.push(data);
        return placeholder;
    }
    else if (Array.isArray(data)) {
        const newData = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
            newData[i] = _deconstructPacket(data[i], buffers);
        }
        return newData;
    }
    else if (typeof data === "object" && !(data instanceof Date)) {
        const newData = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                newData[key] = _deconstructPacket(data[key], buffers);
            }
        }
        return newData;
    }
    return data;
}
/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @public
 */
function reconstructPacket(packet, buffers) {
    packet.data = _reconstructPacket(packet.data, buffers);
    packet.attachments = undefined; // no longer useful
    return packet;
}
exports.reconstructPacket = reconstructPacket;
function _reconstructPacket(data, buffers) {
    if (!data)
        return data;
    if (data && data._placeholder) {
        return buffers[data.num]; // appropriate buffer (should be natural order anyway)
    }
    else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            data[i] = _reconstructPacket(data[i], buffers);
        }
    }
    else if (typeof data === "object") {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                data[key] = _reconstructPacket(data[key], buffers);
            }
        }
    }
    return data;
}


/***/ }),

/***/ "./src/server/node_modules/socket.io-parser/dist/index.js":
/*!****************************************************************!*\
  !*** ./src/server/node_modules/socket.io-parser/dist/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Decoder = exports.Encoder = exports.PacketType = exports.protocol = void 0;
const Emitter = __webpack_require__(/*! component-emitter */ "./src/server/node_modules/component-emitter/index.js");
const binary_1 = __webpack_require__(/*! ./binary */ "./src/server/node_modules/socket.io-parser/dist/binary.js");
const is_binary_1 = __webpack_require__(/*! ./is-binary */ "./src/server/node_modules/socket.io-parser/dist/is-binary.js");
const debug = __webpack_require__(/*! debug */ "debug")("socket.io-parser");
/**
 * Protocol version.
 *
 * @public
 */
exports.protocol = 5;
var PacketType;
(function (PacketType) {
    PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
    PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
    PacketType[PacketType["EVENT"] = 2] = "EVENT";
    PacketType[PacketType["ACK"] = 3] = "ACK";
    PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
    PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
    PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
})(PacketType = exports.PacketType || (exports.PacketType = {}));
/**
 * A socket.io Encoder instance
 */
class Encoder {
    /**
     * Encode a packet as a single string if non-binary, or as a
     * buffer sequence, depending on packet type.
     *
     * @param {Object} obj - packet object
     */
    encode(obj) {
        debug("encoding packet %j", obj);
        if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
            if (is_binary_1.hasBinary(obj)) {
                obj.type =
                    obj.type === PacketType.EVENT
                        ? PacketType.BINARY_EVENT
                        : PacketType.BINARY_ACK;
                return this.encodeAsBinary(obj);
            }
        }
        return [this.encodeAsString(obj)];
    }
    /**
     * Encode packet as string.
     */
    encodeAsString(obj) {
        // first is type
        let str = "" + obj.type;
        // attachments if we have them
        if (obj.type === PacketType.BINARY_EVENT ||
            obj.type === PacketType.BINARY_ACK) {
            str += obj.attachments + "-";
        }
        // if we have a namespace other than `/`
        // we append it followed by a comma `,`
        if (obj.nsp && "/" !== obj.nsp) {
            str += obj.nsp + ",";
        }
        // immediately followed by the id
        if (null != obj.id) {
            str += obj.id;
        }
        // json data
        if (null != obj.data) {
            str += JSON.stringify(obj.data);
        }
        debug("encoded %j as %s", obj, str);
        return str;
    }
    /**
     * Encode packet as 'buffer sequence' by removing blobs, and
     * deconstructing packet into object with placeholders and
     * a list of buffers.
     */
    encodeAsBinary(obj) {
        const deconstruction = binary_1.deconstructPacket(obj);
        const pack = this.encodeAsString(deconstruction.packet);
        const buffers = deconstruction.buffers;
        buffers.unshift(pack); // add packet info to beginning of data list
        return buffers; // write all the buffers
    }
}
exports.Encoder = Encoder;
/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 */
class Decoder extends Emitter {
    constructor() {
        super();
    }
    /**
     * Decodes an encoded packet string into packet JSON.
     *
     * @param {String} obj - encoded packet
     */
    add(obj) {
        let packet;
        if (typeof obj === "string") {
            packet = this.decodeString(obj);
            if (packet.type === PacketType.BINARY_EVENT ||
                packet.type === PacketType.BINARY_ACK) {
                // binary packet's json
                this.reconstructor = new BinaryReconstructor(packet);
                // no attachments, labeled binary but no binary data to follow
                if (packet.attachments === 0) {
                    super.emit("decoded", packet);
                }
            }
            else {
                // non-binary full packet
                super.emit("decoded", packet);
            }
        }
        else if (is_binary_1.isBinary(obj) || obj.base64) {
            // raw binary data
            if (!this.reconstructor) {
                throw new Error("got binary data when not reconstructing a packet");
            }
            else {
                packet = this.reconstructor.takeBinaryData(obj);
                if (packet) {
                    // received final buffer
                    this.reconstructor = null;
                    super.emit("decoded", packet);
                }
            }
        }
        else {
            throw new Error("Unknown type: " + obj);
        }
    }
    /**
     * Decode a packet String (JSON data)
     *
     * @param {String} str
     * @return {Object} packet
     */
    decodeString(str) {
        let i = 0;
        // look up type
        const p = {
            type: Number(str.charAt(0)),
        };
        if (PacketType[p.type] === undefined) {
            throw new Error("unknown packet type " + p.type);
        }
        // look up attachments if type binary
        if (p.type === PacketType.BINARY_EVENT ||
            p.type === PacketType.BINARY_ACK) {
            const start = i + 1;
            while (str.charAt(++i) !== "-" && i != str.length) { }
            const buf = str.substring(start, i);
            if (buf != Number(buf) || str.charAt(i) !== "-") {
                throw new Error("Illegal attachments");
            }
            p.attachments = Number(buf);
        }
        // look up namespace (if any)
        if ("/" === str.charAt(i + 1)) {
            const start = i + 1;
            while (++i) {
                const c = str.charAt(i);
                if ("," === c)
                    break;
                if (i === str.length)
                    break;
            }
            p.nsp = str.substring(start, i);
        }
        else {
            p.nsp = "/";
        }
        // look up id
        const next = str.charAt(i + 1);
        if ("" !== next && Number(next) == next) {
            const start = i + 1;
            while (++i) {
                const c = str.charAt(i);
                if (null == c || Number(c) != c) {
                    --i;
                    break;
                }
                if (i === str.length)
                    break;
            }
            p.id = Number(str.substring(start, i + 1));
        }
        // look up json data
        if (str.charAt(++i)) {
            const payload = tryParse(str.substr(i));
            if (Decoder.isPayloadValid(p.type, payload)) {
                p.data = payload;
            }
            else {
                throw new Error("invalid payload");
            }
        }
        debug("decoded %s as %j", str, p);
        return p;
    }
    static isPayloadValid(type, payload) {
        switch (type) {
            case PacketType.CONNECT:
                return typeof payload === "object";
            case PacketType.DISCONNECT:
                return payload === undefined;
            case PacketType.CONNECT_ERROR:
                return typeof payload === "string" || typeof payload === "object";
            case PacketType.EVENT:
            case PacketType.BINARY_EVENT:
                return Array.isArray(payload) && payload.length > 0;
            case PacketType.ACK:
            case PacketType.BINARY_ACK:
                return Array.isArray(payload);
        }
    }
    /**
     * Deallocates a parser's resources
     */
    destroy() {
        if (this.reconstructor) {
            this.reconstructor.finishedReconstruction();
        }
    }
}
exports.Decoder = Decoder;
function tryParse(str) {
    try {
        return JSON.parse(str);
    }
    catch (e) {
        return false;
    }
}
/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 */
class BinaryReconstructor {
    constructor(packet) {
        this.packet = packet;
        this.buffers = [];
        this.reconPack = packet;
    }
    /**
     * Method to be called when binary data received from connection
     * after a BINARY_EVENT packet.
     *
     * @param {Buffer | ArrayBuffer} binData - the raw binary data received
     * @return {null | Object} returns null if more binary data is expected or
     *   a reconstructed packet object if all buffers have been received.
     */
    takeBinaryData(binData) {
        this.buffers.push(binData);
        if (this.buffers.length === this.reconPack.attachments) {
            // done with buffer list
            const packet = binary_1.reconstructPacket(this.reconPack, this.buffers);
            this.finishedReconstruction();
            return packet;
        }
        return null;
    }
    /**
     * Cleans up binary packet reconstruction variables.
     */
    finishedReconstruction() {
        this.reconPack = null;
        this.buffers = [];
    }
}


/***/ }),

/***/ "./src/server/node_modules/socket.io-parser/dist/is-binary.js":
/*!********************************************************************!*\
  !*** ./src/server/node_modules/socket.io-parser/dist/is-binary.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hasBinary = exports.isBinary = void 0;
const withNativeArrayBuffer = typeof ArrayBuffer === "function";
const isView = (obj) => {
    return typeof ArrayBuffer.isView === "function"
        ? ArrayBuffer.isView(obj)
        : obj.buffer instanceof ArrayBuffer;
};
const toString = Object.prototype.toString;
const withNativeBlob = typeof Blob === "function" ||
    (typeof Blob !== "undefined" &&
        toString.call(Blob) === "[object BlobConstructor]");
const withNativeFile = typeof File === "function" ||
    (typeof File !== "undefined" &&
        toString.call(File) === "[object FileConstructor]");
/**
 * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
 *
 * @private
 */
function isBinary(obj) {
    return ((withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj))) ||
        (withNativeBlob && obj instanceof Blob) ||
        (withNativeFile && obj instanceof File));
}
exports.isBinary = isBinary;
function hasBinary(obj, toJSON) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    if (Array.isArray(obj)) {
        for (let i = 0, l = obj.length; i < l; i++) {
            if (hasBinary(obj[i])) {
                return true;
            }
        }
        return false;
    }
    if (isBinary(obj)) {
        return true;
    }
    if (obj.toJSON &&
        typeof obj.toJSON === "function" &&
        arguments.length === 1) {
        return hasBinary(obj.toJSON(), true);
    }
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
            return true;
        }
    }
    return false;
}
exports.hasBinary = hasBinary;


/***/ }),

/***/ "accepts":
/*!**************************!*\
  !*** external "accepts" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("accepts");

/***/ }),

/***/ "cookie":
/*!*************************!*\
  !*** external "cookie" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("cookie");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("debug");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "object-assign":
/*!********************************!*\
  !*** external "object-assign" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("object-assign");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "vary":
/*!***********************!*\
  !*** external "vary" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("vary");

/***/ }),

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("ws");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ "./src/server/node_modules/engine.io-parser/build/cjs/commons.js":
/*!***********************************************************************!*\
  !*** ./src/server/node_modules/engine.io-parser/build/cjs/commons.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ERROR_PACKET = exports.PACKET_TYPES_REVERSE = exports.PACKET_TYPES = void 0;
const PACKET_TYPES = Object.create(null); // no Map = no polyfill
exports.PACKET_TYPES = PACKET_TYPES;
PACKET_TYPES["open"] = "0";
PACKET_TYPES["close"] = "1";
PACKET_TYPES["ping"] = "2";
PACKET_TYPES["pong"] = "3";
PACKET_TYPES["message"] = "4";
PACKET_TYPES["upgrade"] = "5";
PACKET_TYPES["noop"] = "6";
const PACKET_TYPES_REVERSE = Object.create(null);
exports.PACKET_TYPES_REVERSE = PACKET_TYPES_REVERSE;
Object.keys(PACKET_TYPES).forEach(key => {
    PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
});
const ERROR_PACKET = { type: "error", data: "parser error" };
exports.ERROR_PACKET = ERROR_PACKET;


/***/ }),

/***/ "./src/server/node_modules/engine.io-parser/build/cjs/decodePacket.js":
/*!****************************************************************************!*\
  !*** ./src/server/node_modules/engine.io-parser/build/cjs/decodePacket.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const commons_js_1 = __webpack_require__(/*! ./commons.js */ "./src/server/node_modules/engine.io-parser/build/cjs/commons.js");
const decodePacket = (encodedPacket, binaryType) => {
    if (typeof encodedPacket !== "string") {
        return {
            type: "message",
            data: mapBinary(encodedPacket, binaryType)
        };
    }
    const type = encodedPacket.charAt(0);
    if (type === "b") {
        const buffer = Buffer.from(encodedPacket.substring(1), "base64");
        return {
            type: "message",
            data: mapBinary(buffer, binaryType)
        };
    }
    if (!commons_js_1.PACKET_TYPES_REVERSE[type]) {
        return commons_js_1.ERROR_PACKET;
    }
    return encodedPacket.length > 1
        ? {
            type: commons_js_1.PACKET_TYPES_REVERSE[type],
            data: encodedPacket.substring(1)
        }
        : {
            type: commons_js_1.PACKET_TYPES_REVERSE[type]
        };
};
const mapBinary = (data, binaryType) => {
    const isBuffer = Buffer.isBuffer(data);
    switch (binaryType) {
        case "arraybuffer":
            return isBuffer ? toArrayBuffer(data) : data;
        case "nodebuffer":
        default:
            return data; // assuming the data is already a Buffer
    }
};
const toArrayBuffer = buffer => {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; i++) {
        view[i] = buffer[i];
    }
    return arrayBuffer;
};
exports["default"] = decodePacket;


/***/ }),

/***/ "./src/server/node_modules/engine.io-parser/build/cjs/encodePacket.js":
/*!****************************************************************************!*\
  !*** ./src/server/node_modules/engine.io-parser/build/cjs/encodePacket.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const commons_js_1 = __webpack_require__(/*! ./commons.js */ "./src/server/node_modules/engine.io-parser/build/cjs/commons.js");
const encodePacket = ({ type, data }, supportsBinary, callback) => {
    if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
        const buffer = toBuffer(data);
        return callback(encodeBuffer(buffer, supportsBinary));
    }
    // plain string
    return callback(commons_js_1.PACKET_TYPES[type] + (data || ""));
};
const toBuffer = data => {
    if (Buffer.isBuffer(data)) {
        return data;
    }
    else if (data instanceof ArrayBuffer) {
        return Buffer.from(data);
    }
    else {
        return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
    }
};
// only 'message' packets can contain binary, so the type prefix is not needed
const encodeBuffer = (data, supportsBinary) => {
    return supportsBinary ? data : "b" + data.toString("base64");
};
exports["default"] = encodePacket;


/***/ }),

/***/ "./src/server/node_modules/engine.io-parser/build/cjs/index.js":
/*!*********************************************************************!*\
  !*** ./src/server/node_modules/engine.io-parser/build/cjs/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decodePayload = exports.decodePacket = exports.encodePayload = exports.encodePacket = exports.protocol = void 0;
const encodePacket_js_1 = __webpack_require__(/*! ./encodePacket.js */ "./src/server/node_modules/engine.io-parser/build/cjs/encodePacket.js");
exports.encodePacket = encodePacket_js_1.default;
const decodePacket_js_1 = __webpack_require__(/*! ./decodePacket.js */ "./src/server/node_modules/engine.io-parser/build/cjs/decodePacket.js");
exports.decodePacket = decodePacket_js_1.default;
const SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
const encodePayload = (packets, callback) => {
    // some packets may be added to the array while encoding, so the initial length must be saved
    const length = packets.length;
    const encodedPackets = new Array(length);
    let count = 0;
    packets.forEach((packet, i) => {
        // force base64 encoding for binary packets
        (0, encodePacket_js_1.default)(packet, false, encodedPacket => {
            encodedPackets[i] = encodedPacket;
            if (++count === length) {
                callback(encodedPackets.join(SEPARATOR));
            }
        });
    });
};
exports.encodePayload = encodePayload;
const decodePayload = (encodedPayload, binaryType) => {
    const encodedPackets = encodedPayload.split(SEPARATOR);
    const packets = [];
    for (let i = 0; i < encodedPackets.length; i++) {
        const decodedPacket = (0, decodePacket_js_1.default)(encodedPackets[i], binaryType);
        packets.push(decodedPacket);
        if (decodedPacket.type === "error") {
            break;
        }
    }
    return packets;
};
exports.decodePayload = decodePayload;
exports.protocol = 4;


/***/ }),

/***/ "./src/server/node_modules/engine.io/build/engine.io.js":
/*!**************************************************************!*\
  !*** ./src/server/node_modules/engine.io/build/engine.io.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.protocol = exports.Transport = exports.Socket = exports.uServer = exports.parser = exports.attach = exports.listen = exports.transports = exports.Server = void 0;
const http_1 = __webpack_require__(/*! http */ "http");
const server_1 = __webpack_require__(/*! ./server */ "./src/server/node_modules/engine.io/build/server.js");
Object.defineProperty(exports, "Server", ({ enumerable: true, get: function () { return server_1.Server; } }));
const index_1 = __webpack_require__(/*! ./transports/index */ "./src/server/node_modules/engine.io/build/transports/index.js");
exports.transports = index_1.default;
const parser = __webpack_require__(/*! engine.io-parser */ "./src/server/node_modules/engine.io-parser/build/cjs/index.js");
exports.parser = parser;
var userver_1 = __webpack_require__(/*! ./userver */ "./src/server/node_modules/engine.io/build/userver.js");
Object.defineProperty(exports, "uServer", ({ enumerable: true, get: function () { return userver_1.uServer; } }));
var socket_1 = __webpack_require__(/*! ./socket */ "./src/server/node_modules/engine.io/build/socket.js");
Object.defineProperty(exports, "Socket", ({ enumerable: true, get: function () { return socket_1.Socket; } }));
var transport_1 = __webpack_require__(/*! ./transport */ "./src/server/node_modules/engine.io/build/transport.js");
Object.defineProperty(exports, "Transport", ({ enumerable: true, get: function () { return transport_1.Transport; } }));
exports.protocol = parser.protocol;
/**
 * Creates an http.Server exclusively used for WS upgrades.
 *
 * @param {Number} port
 * @param {Function} callback
 * @param {Object} options
 * @return {Server} websocket.io server
 * @api public
 */
function listen(port, options, fn) {
    if ("function" === typeof options) {
        fn = options;
        options = {};
    }
    const server = (0, http_1.createServer)(function (req, res) {
        res.writeHead(501);
        res.end("Not Implemented");
    });
    // create engine server
    const engine = attach(server, options);
    engine.httpServer = server;
    server.listen(port, fn);
    return engine;
}
exports.listen = listen;
/**
 * Captures upgrade requests for a http.Server.
 *
 * @param {http.Server} server
 * @param {Object} options
 * @return {Server} engine server
 * @api public
 */
function attach(server, options) {
    const engine = new server_1.Server(options);
    engine.attach(server, options);
    return engine;
}
exports.attach = attach;


/***/ }),

/***/ "./src/server/node_modules/engine.io/build/parser-v3/index.js":
/*!********************************************************************!*\
  !*** ./src/server/node_modules/engine.io/build/parser-v3/index.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// imported from https://github.com/socketio/engine.io-parser/tree/2.2.x
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decodePayloadAsBinary = exports.encodePayloadAsBinary = exports.decodePayload = exports.encodePayload = exports.decodeBase64Packet = exports.decodePacket = exports.encodeBase64Packet = exports.encodePacket = exports.packets = exports.protocol = void 0;
/**
 * Module dependencies.
 */
var utf8 = __webpack_require__(/*! ./utf8 */ "./src/server/node_modules/engine.io/build/parser-v3/utf8.js");
/**
 * Current protocol version.
 */
exports.protocol = 3;
const hasBinary = (packets) => {
    for (const packet of packets) {
        if (packet.data instanceof ArrayBuffer || ArrayBuffer.isView(packet.data)) {
            return true;
        }
    }
    return false;
};
/**
 * Packet types.
 */
exports.packets = {
    open: 0 // non-ws
    ,
    close: 1 // non-ws
    ,
    ping: 2,
    pong: 3,
    message: 4,
    upgrade: 5,
    noop: 6
};
var packetslist = Object.keys(exports.packets);
/**
 * Premade error packet.
 */
var err = { type: 'error', data: 'parser error' };
const EMPTY_BUFFER = Buffer.concat([]);
/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */
function encodePacket(packet, supportsBinary, utf8encode, callback) {
    if (typeof supportsBinary === 'function') {
        callback = supportsBinary;
        supportsBinary = null;
    }
    if (typeof utf8encode === 'function') {
        callback = utf8encode;
        utf8encode = null;
    }
    if (Buffer.isBuffer(packet.data)) {
        return encodeBuffer(packet, supportsBinary, callback);
    }
    else if (packet.data && (packet.data.buffer || packet.data) instanceof ArrayBuffer) {
        return encodeBuffer({ type: packet.type, data: arrayBufferToBuffer(packet.data) }, supportsBinary, callback);
    }
    // Sending data as a utf-8 string
    var encoded = exports.packets[packet.type];
    // data fragment is optional
    if (undefined !== packet.data) {
        encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
    }
    return callback('' + encoded);
}
exports.encodePacket = encodePacket;
;
/**
 * Encode Buffer data
 */
function encodeBuffer(packet, supportsBinary, callback) {
    if (!supportsBinary) {
        return encodeBase64Packet(packet, callback);
    }
    var data = packet.data;
    var typeBuffer = Buffer.allocUnsafe(1);
    typeBuffer[0] = exports.packets[packet.type];
    return callback(Buffer.concat([typeBuffer, data]));
}
/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */
function encodeBase64Packet(packet, callback) {
    var data = Buffer.isBuffer(packet.data) ? packet.data : arrayBufferToBuffer(packet.data);
    var message = 'b' + exports.packets[packet.type];
    message += data.toString('base64');
    return callback(message);
}
exports.encodeBase64Packet = encodeBase64Packet;
;
/**
 * Decodes a packet. Data also available as an ArrayBuffer if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */
function decodePacket(data, binaryType, utf8decode) {
    if (data === undefined) {
        return err;
    }
    var type;
    // String data
    if (typeof data === 'string') {
        type = data.charAt(0);
        if (type === 'b') {
            return decodeBase64Packet(data.substr(1), binaryType);
        }
        if (utf8decode) {
            data = tryDecode(data);
            if (data === false) {
                return err;
            }
        }
        if (Number(type) != type || !packetslist[type]) {
            return err;
        }
        if (data.length > 1) {
            return { type: packetslist[type], data: data.substring(1) };
        }
        else {
            return { type: packetslist[type] };
        }
    }
    // Binary data
    if (binaryType === 'arraybuffer') {
        // wrap Buffer/ArrayBuffer data into an Uint8Array
        var intArray = new Uint8Array(data);
        type = intArray[0];
        return { type: packetslist[type], data: intArray.buffer.slice(1) };
    }
    if (data instanceof ArrayBuffer) {
        data = arrayBufferToBuffer(data);
    }
    type = data[0];
    return { type: packetslist[type], data: data.slice(1) };
}
exports.decodePacket = decodePacket;
;
function tryDecode(data) {
    try {
        data = utf8.decode(data, { strict: false });
    }
    catch (e) {
        return false;
    }
    return data;
}
/**
 * Decodes a packet encoded in a base64 string.
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */
function decodeBase64Packet(msg, binaryType) {
    var type = packetslist[msg.charAt(0)];
    var data = Buffer.from(msg.substr(1), 'base64');
    if (binaryType === 'arraybuffer') {
        var abv = new Uint8Array(data.length);
        for (var i = 0; i < abv.length; i++) {
            abv[i] = data[i];
        }
        // @ts-ignore
        data = abv.buffer;
    }
    return { type: type, data: data };
}
exports.decodeBase64Packet = decodeBase64Packet;
;
/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */
function encodePayload(packets, supportsBinary, callback) {
    if (typeof supportsBinary === 'function') {
        callback = supportsBinary;
        supportsBinary = null;
    }
    if (supportsBinary && hasBinary(packets)) {
        return encodePayloadAsBinary(packets, callback);
    }
    if (!packets.length) {
        return callback('0:');
    }
    function encodeOne(packet, doneCallback) {
        encodePacket(packet, supportsBinary, false, function (message) {
            doneCallback(null, setLengthHeader(message));
        });
    }
    map(packets, encodeOne, function (err, results) {
        return callback(results.join(''));
    });
}
exports.encodePayload = encodePayload;
;
function setLengthHeader(message) {
    return message.length + ':' + message;
}
/**
 * Async array map using after
 */
function map(ary, each, done) {
    const results = new Array(ary.length);
    let count = 0;
    for (let i = 0; i < ary.length; i++) {
        each(ary[i], (error, msg) => {
            results[i] = msg;
            if (++count === ary.length) {
                done(null, results);
            }
        });
    }
}
/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */
function decodePayload(data, binaryType, callback) {
    if (typeof data !== 'string') {
        return decodePayloadAsBinary(data, binaryType, callback);
    }
    if (typeof binaryType === 'function') {
        callback = binaryType;
        binaryType = null;
    }
    if (data === '') {
        // parser error - ignoring payload
        return callback(err, 0, 1);
    }
    var length = '', n, msg, packet;
    for (var i = 0, l = data.length; i < l; i++) {
        var chr = data.charAt(i);
        if (chr !== ':') {
            length += chr;
            continue;
        }
        // @ts-ignore
        if (length === '' || (length != (n = Number(length)))) {
            // parser error - ignoring payload
            return callback(err, 0, 1);
        }
        msg = data.substr(i + 1, n);
        if (length != msg.length) {
            // parser error - ignoring payload
            return callback(err, 0, 1);
        }
        if (msg.length) {
            packet = decodePacket(msg, binaryType, false);
            if (err.type === packet.type && err.data === packet.data) {
                // parser error in individual packet - ignoring payload
                return callback(err, 0, 1);
            }
            var more = callback(packet, i + n, l);
            if (false === more)
                return;
        }
        // advance cursor
        i += n;
        length = '';
    }
    if (length !== '') {
        // parser error - ignoring payload
        return callback(err, 0, 1);
    }
}
exports.decodePayload = decodePayload;
;
/**
 *
 * Converts a buffer to a utf8.js encoded string
 *
 * @api private
 */
function bufferToString(buffer) {
    var str = '';
    for (var i = 0, l = buffer.length; i < l; i++) {
        str += String.fromCharCode(buffer[i]);
    }
    return str;
}
/**
 *
 * Converts a utf8.js encoded string to a buffer
 *
 * @api private
 */
function stringToBuffer(string) {
    var buf = Buffer.allocUnsafe(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        buf.writeUInt8(string.charCodeAt(i), i);
    }
    return buf;
}
/**
 *
 * Converts an ArrayBuffer to a Buffer
 *
 * @api private
 */
function arrayBufferToBuffer(data) {
    // data is either an ArrayBuffer or ArrayBufferView.
    var length = data.byteLength || data.length;
    var offset = data.byteOffset || 0;
    return Buffer.from(data.buffer || data, offset, length);
}
/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {Buffer} encoded payload
 * @api private
 */
function encodePayloadAsBinary(packets, callback) {
    if (!packets.length) {
        return callback(EMPTY_BUFFER);
    }
    map(packets, encodeOneBinaryPacket, function (err, results) {
        return callback(Buffer.concat(results));
    });
}
exports.encodePayloadAsBinary = encodePayloadAsBinary;
;
function encodeOneBinaryPacket(p, doneCallback) {
    function onBinaryPacketEncode(packet) {
        var encodingLength = '' + packet.length;
        var sizeBuffer;
        if (typeof packet === 'string') {
            sizeBuffer = Buffer.allocUnsafe(encodingLength.length + 2);
            sizeBuffer[0] = 0; // is a string (not true binary = 0)
            for (var i = 0; i < encodingLength.length; i++) {
                sizeBuffer[i + 1] = parseInt(encodingLength[i], 10);
            }
            sizeBuffer[sizeBuffer.length - 1] = 255;
            return doneCallback(null, Buffer.concat([sizeBuffer, stringToBuffer(packet)]));
        }
        sizeBuffer = Buffer.allocUnsafe(encodingLength.length + 2);
        sizeBuffer[0] = 1; // is binary (true binary = 1)
        for (var i = 0; i < encodingLength.length; i++) {
            sizeBuffer[i + 1] = parseInt(encodingLength[i], 10);
        }
        sizeBuffer[sizeBuffer.length - 1] = 255;
        doneCallback(null, Buffer.concat([sizeBuffer, packet]));
    }
    encodePacket(p, true, true, onBinaryPacketEncode);
}
/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary

 * @param {Buffer} data, callback method
 * @api public
 */
function decodePayloadAsBinary(data, binaryType, callback) {
    if (typeof binaryType === 'function') {
        callback = binaryType;
        binaryType = null;
    }
    var bufferTail = data;
    var buffers = [];
    var i;
    while (bufferTail.length > 0) {
        var strLen = '';
        var isString = bufferTail[0] === 0;
        for (i = 1;; i++) {
            if (bufferTail[i] === 255)
                break;
            // 310 = char length of Number.MAX_VALUE
            if (strLen.length > 310) {
                return callback(err, 0, 1);
            }
            strLen += '' + bufferTail[i];
        }
        bufferTail = bufferTail.slice(strLen.length + 1);
        var msgLength = parseInt(strLen, 10);
        var msg = bufferTail.slice(1, msgLength + 1);
        if (isString)
            msg = bufferToString(msg);
        buffers.push(msg);
        bufferTail = bufferTail.slice(msgLength + 1);
    }
    var total = buffers.length;
    for (i = 0; i < total; i++) {
        var buffer = buffers[i];
        callback(decodePacket(buffer, binaryType, true), i, total);
    }
}
exports.decodePayloadAsBinary = decodePayloadAsBinary;
;


/***/ }),

/***/ "./src/server/node_modules/engine.io/build/parser-v3/utf8.js":
/*!*******************************************************************!*\
  !*** ./src/server/node_modules/engine.io/build/parser-v3/utf8.js ***!
  \*******************************************************************/
/***/ ((module) => {

/*! https://mths.be/utf8js v2.1.2 by @mathias */
var stringFromCharCode = String.fromCharCode;
// Taken from https://mths.be/punycode
function ucs2decode(string) {
    var output = [];
    var counter = 0;
    var length = string.length;
    var value;
    var extra;
    while (counter < length) {
        value = string.charCodeAt(counter++);
        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
            // high surrogate, and there is a next character
            extra = string.charCodeAt(counter++);
            if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
            }
            else {
                // unmatched surrogate; only append this code unit, in case the next
                // code unit is the high surrogate of a surrogate pair
                output.push(value);
                counter--;
            }
        }
        else {
            output.push(value);
        }
    }
    return output;
}
// Taken from https://mths.be/punycode
function ucs2encode(array) {
    var length = array.length;
    var index = -1;
    var value;
    var output = '';
    while (++index < length) {
        value = array[index];
        if (value > 0xFFFF) {
            value -= 0x10000;
            output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
            value = 0xDC00 | value & 0x3FF;
        }
        output += stringFromCharCode(value);
    }
    return output;
}
function checkScalarValue(codePoint, strict) {
    if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
        if (strict) {
            throw Error('Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
                ' is not a scalar value');
        }
        return false;
    }
    return true;
}
/*--------------------------------------------------------------------------*/
function createByte(codePoint, shift) {
    return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
}
function encodeCodePoint(codePoint, strict) {
    if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
        return stringFromCharCode(codePoint);
    }
    var symbol = '';
    if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
        symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
    }
    else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
        if (!checkScalarValue(codePoint, strict)) {
            codePoint = 0xFFFD;
        }
        symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
        symbol += createByte(codePoint, 6);
    }
    else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
        symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
        symbol += createByte(codePoint, 12);
        symbol += createByte(codePoint, 6);
    }
    symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
    return symbol;
}
function utf8encode(string, opts) {
    opts = opts || {};
    var strict = false !== opts.strict;
    var codePoints = ucs2decode(string);
    var length = codePoints.length;
    var index = -1;
    var codePoint;
    var byteString = '';
    while (++index < length) {
        codePoint = codePoints[index];
        byteString += encodeCodePoint(codePoint, strict);
    }
    return byteString;
}
/*--------------------------------------------------------------------------*/
function readContinuationByte() {
    if (byteIndex >= byteCount) {
        throw Error('Invalid byte index');
    }
    var continuationByte = byteArray[byteIndex] & 0xFF;
    byteIndex++;
    if ((continuationByte & 0xC0) == 0x80) {
        return continuationByte & 0x3F;
    }
    // If we end up here, it’s not a continuation byte
    throw Error('Invalid continuation byte');
}
function decodeSymbol(strict) {
    var byte1;
    var byte2;
    var byte3;
    var byte4;
    var codePoint;
    if (byteIndex > byteCount) {
        throw Error('Invalid byte index');
    }
    if (byteIndex == byteCount) {
        return false;
    }
    // Read first byte
    byte1 = byteArray[byteIndex] & 0xFF;
    byteIndex++;
    // 1-byte sequence (no continuation bytes)
    if ((byte1 & 0x80) == 0) {
        return byte1;
    }
    // 2-byte sequence
    if ((byte1 & 0xE0) == 0xC0) {
        byte2 = readContinuationByte();
        codePoint = ((byte1 & 0x1F) << 6) | byte2;
        if (codePoint >= 0x80) {
            return codePoint;
        }
        else {
            throw Error('Invalid continuation byte');
        }
    }
    // 3-byte sequence (may include unpaired surrogates)
    if ((byte1 & 0xF0) == 0xE0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
        if (codePoint >= 0x0800) {
            return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
        }
        else {
            throw Error('Invalid continuation byte');
        }
    }
    // 4-byte sequence
    if ((byte1 & 0xF8) == 0xF0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        byte4 = readContinuationByte();
        codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
            (byte3 << 0x06) | byte4;
        if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
            return codePoint;
        }
    }
    throw Error('Invalid UTF-8 detected');
}
var byteArray;
var byteCount;
var byteIndex;
function utf8decode(byteString, opts) {
    opts = opts || {};
    var strict = false !== opts.strict;
    byteArray = ucs2decode(byteString);
    byteCount = byteArray.length;
    byteIndex = 0;
    var codePoints = [];
    var tmp;
    while ((tmp = decodeSymbol(strict)) !== false) {
        codePoints.push(tmp);
    }
    return ucs2encode(codePoints);
}
module.exports = {
    version: '2.1.2',
    encode: utf8encode,
    decode: utf8decode
};


/***/ }),

/***/ "./src/server/node_modules/engine.io/build/server.js":
/*!***********************************************************!*\
  !*** ./src/server/node_modules/engine.io/build/server.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Server = exports.BaseServer = void 0;
const qs = __webpack_require__(/*! querystring */ "querystring");
const url_1 = __webpack_require__(/*! url */ "url");
const base64id = __webpack_require__(/*! base64id */ "./src/server/node_modules/base64id/lib/base64id.js");
const transports_1 = __webpack_require__(/*! ./transports */ "./src/server/node_modules/engine.io/build/transports/index.js");
const events_1 = __webpack_require__(/*! events */ "events");
const socket_1 = __webpack_require__(/*! ./socket */ "./src/server/node_modules/engine.io/build/socket.js");
const debug_1 = __webpack_require__(/*! debug */ "debug");
const cookie_1 = __webpack_require__(/*! cookie */ "cookie");
const ws_1 = __webpack_require__(/*! ws */ "ws");
const debug = (0, debug_1.default)("engine");
class BaseServer extends events_1.EventEmitter {
    /**
     * Server constructor.
     *
     * @param {Object} opts - options
     * @api public
     */
    constructor(opts = {}) {
        super();
        this.clients = {};
        this.clientsCount = 0;
        this.opts = Object.assign({
            wsEngine: ws_1.Server,
            pingTimeout: 20000,
            pingInterval: 25000,
            upgradeTimeout: 10000,
            maxHttpBufferSize: 1e6,
            transports: Object.keys(transports_1.default),
            allowUpgrades: true,
            httpCompression: {
                threshold: 1024
            },
            cors: false,
            allowEIO3: false
        }, opts);
        if (opts.cookie) {
            this.opts.cookie = Object.assign({
                name: "io",
                path: "/",
                // @ts-ignore
                httpOnly: opts.cookie.path !== false,
                sameSite: "lax"
            }, opts.cookie);
        }
        if (this.opts.cors) {
            this.corsMiddleware = __webpack_require__(/*! cors */ "./src/server/node_modules/cors/lib/index.js")(this.opts.cors);
        }
        if (opts.perMessageDeflate) {
            this.opts.perMessageDeflate = Object.assign({
                threshold: 1024
            }, opts.perMessageDeflate);
        }
        this.init();
    }
    /**
     * Returns a list of available transports for upgrade given a certain transport.
     *
     * @return {Array}
     * @api public
     */
    upgrades(transport) {
        if (!this.opts.allowUpgrades)
            return [];
        return transports_1.default[transport].upgradesTo || [];
    }
    /**
     * Verifies a request.
     *
     * @param {http.IncomingMessage}
     * @return {Boolean} whether the request is valid
     * @api private
     */
    verify(req, upgrade, fn) {
        // transport check
        const transport = req._query.transport;
        if (!~this.opts.transports.indexOf(transport)) {
            debug('unknown transport "%s"', transport);
            return fn(Server.errors.UNKNOWN_TRANSPORT, { transport });
        }
        // 'Origin' header check
        const isOriginInvalid = checkInvalidHeaderChar(req.headers.origin);
        if (isOriginInvalid) {
            const origin = req.headers.origin;
            req.headers.origin = null;
            debug("origin header invalid");
            return fn(Server.errors.BAD_REQUEST, {
                name: "INVALID_ORIGIN",
                origin
            });
        }
        // sid check
        const sid = req._query.sid;
        if (sid) {
            if (!this.clients.hasOwnProperty(sid)) {
                debug('unknown sid "%s"', sid);
                return fn(Server.errors.UNKNOWN_SID, {
                    sid
                });
            }
            const previousTransport = this.clients[sid].transport.name;
            if (!upgrade && previousTransport !== transport) {
                debug("bad request: unexpected transport without upgrade");
                return fn(Server.errors.BAD_REQUEST, {
                    name: "TRANSPORT_MISMATCH",
                    transport,
                    previousTransport
                });
            }
        }
        else {
            // handshake is GET only
            if ("GET" !== req.method) {
                return fn(Server.errors.BAD_HANDSHAKE_METHOD, {
                    method: req.method
                });
            }
            if (!this.opts.allowRequest)
                return fn();
            return this.opts.allowRequest(req, (message, success) => {
                if (!success) {
                    return fn(Server.errors.FORBIDDEN, {
                        message
                    });
                }
                fn();
            });
        }
        fn();
    }
    /**
     * Closes all clients.
     *
     * @api public
     */
    close() {
        debug("closing all open clients");
        for (let i in this.clients) {
            if (this.clients.hasOwnProperty(i)) {
                this.clients[i].close(true);
            }
        }
        this.cleanup();
        return this;
    }
    /**
     * generate a socket id.
     * Overwrite this method to generate your custom socket id
     *
     * @param {Object} request object
     * @api public
     */
    generateId(req) {
        return base64id.generateId();
    }
    /**
     * Handshakes a new client.
     *
     * @param {String} transport name
     * @param {Object} request object
     * @param {Function} closeConnection
     *
     * @api protected
     */
    async handshake(transportName, req, closeConnection) {
        const protocol = req._query.EIO === "4" ? 4 : 3; // 3rd revision by default
        if (protocol === 3 && !this.opts.allowEIO3) {
            debug("unsupported protocol version");
            this.emit("connection_error", {
                req,
                code: Server.errors.UNSUPPORTED_PROTOCOL_VERSION,
                message: Server.errorMessages[Server.errors.UNSUPPORTED_PROTOCOL_VERSION],
                context: {
                    protocol
                }
            });
            closeConnection(Server.errors.UNSUPPORTED_PROTOCOL_VERSION);
            return;
        }
        let id;
        try {
            id = await this.generateId(req);
        }
        catch (e) {
            debug("error while generating an id");
            this.emit("connection_error", {
                req,
                code: Server.errors.BAD_REQUEST,
                message: Server.errorMessages[Server.errors.BAD_REQUEST],
                context: {
                    name: "ID_GENERATION_ERROR",
                    error: e
                }
            });
            closeConnection(Server.errors.BAD_REQUEST);
            return;
        }
        debug('handshaking client "%s"', id);
        try {
            var transport = this.createTransport(transportName, req);
            if ("polling" === transportName) {
                transport.maxHttpBufferSize = this.opts.maxHttpBufferSize;
                transport.httpCompression = this.opts.httpCompression;
            }
            else if ("websocket" === transportName) {
                transport.perMessageDeflate = this.opts.perMessageDeflate;
            }
            if (req._query && req._query.b64) {
                transport.supportsBinary = false;
            }
            else {
                transport.supportsBinary = true;
            }
        }
        catch (e) {
            debug('error handshaking to transport "%s"', transportName);
            this.emit("connection_error", {
                req,
                code: Server.errors.BAD_REQUEST,
                message: Server.errorMessages[Server.errors.BAD_REQUEST],
                context: {
                    name: "TRANSPORT_HANDSHAKE_ERROR",
                    error: e
                }
            });
            closeConnection(Server.errors.BAD_REQUEST);
            return;
        }
        const socket = new socket_1.Socket(id, this, transport, req, protocol);
        transport.on("headers", (headers, req) => {
            const isInitialRequest = !req._query.sid;
            if (isInitialRequest) {
                if (this.opts.cookie) {
                    headers["Set-Cookie"] = [
                        // @ts-ignore
                        (0, cookie_1.serialize)(this.opts.cookie.name, id, this.opts.cookie)
                    ];
                }
                this.emit("initial_headers", headers, req);
            }
            this.emit("headers", headers, req);
        });
        transport.onRequest(req);
        this.clients[id] = socket;
        this.clientsCount++;
        socket.once("close", () => {
            delete this.clients[id];
            this.clientsCount--;
        });
        this.emit("connection", socket);
        return transport;
    }
}
exports.BaseServer = BaseServer;
/**
 * Protocol errors mappings.
 */
BaseServer.errors = {
    UNKNOWN_TRANSPORT: 0,
    UNKNOWN_SID: 1,
    BAD_HANDSHAKE_METHOD: 2,
    BAD_REQUEST: 3,
    FORBIDDEN: 4,
    UNSUPPORTED_PROTOCOL_VERSION: 5
};
BaseServer.errorMessages = {
    0: "Transport unknown",
    1: "Session ID unknown",
    2: "Bad handshake method",
    3: "Bad request",
    4: "Forbidden",
    5: "Unsupported protocol version"
};
class Server extends BaseServer {
    /**
     * Initialize websocket server
     *
     * @api protected
     */
    init() {
        if (!~this.opts.transports.indexOf("websocket"))
            return;
        if (this.ws)
            this.ws.close();
        this.ws = new this.opts.wsEngine({
            noServer: true,
            clientTracking: false,
            perMessageDeflate: this.opts.perMessageDeflate,
            maxPayload: this.opts.maxHttpBufferSize
        });
        if (typeof this.ws.on === "function") {
            this.ws.on("headers", (headersArray, req) => {
                // note: 'ws' uses an array of headers, while Engine.IO uses an object (response.writeHead() accepts both formats)
                // we could also try to parse the array and then sync the values, but that will be error-prone
                const additionalHeaders = {};
                const isInitialRequest = !req._query.sid;
                if (isInitialRequest) {
                    this.emit("initial_headers", additionalHeaders, req);
                }
                this.emit("headers", additionalHeaders, req);
                Object.keys(additionalHeaders).forEach(key => {
                    headersArray.push(`${key}: ${additionalHeaders[key]}`);
                });
            });
        }
    }
    cleanup() {
        if (this.ws) {
            debug("closing webSocketServer");
            this.ws.close();
            // don't delete this.ws because it can be used again if the http server starts listening again
        }
    }
    /**
     * Prepares a request by processing the query string.
     *
     * @api private
     */
    prepare(req) {
        // try to leverage pre-existing `req._query` (e.g: from connect)
        if (!req._query) {
            req._query = ~req.url.indexOf("?") ? qs.parse((0, url_1.parse)(req.url).query) : {};
        }
    }
    createTransport(transportName, req) {
        return new transports_1.default[transportName](req);
    }
    /**
     * Handles an Engine.IO HTTP request.
     *
     * @param {http.IncomingMessage} request
     * @param {http.ServerResponse|http.OutgoingMessage} response
     * @api public
     */
    handleRequest(req, res) {
        debug('handling "%s" http request "%s"', req.method, req.url);
        this.prepare(req);
        req.res = res;
        const callback = (errorCode, errorContext) => {
            if (errorCode !== undefined) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: Server.errorMessages[errorCode],
                    context: errorContext
                });
                abortRequest(res, errorCode, errorContext);
                return;
            }
            if (req._query.sid) {
                debug("setting new request for existing client");
                this.clients[req._query.sid].transport.onRequest(req);
            }
            else {
                const closeConnection = (errorCode, errorContext) => abortRequest(res, errorCode, errorContext);
                this.handshake(req._query.transport, req, closeConnection);
            }
        };
        if (this.corsMiddleware) {
            this.corsMiddleware.call(null, req, res, () => {
                this.verify(req, false, callback);
            });
        }
        else {
            this.verify(req, false, callback);
        }
    }
    /**
     * Handles an Engine.IO HTTP Upgrade.
     *
     * @api public
     */
    handleUpgrade(req, socket, upgradeHead) {
        this.prepare(req);
        this.verify(req, true, (errorCode, errorContext) => {
            if (errorCode) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: Server.errorMessages[errorCode],
                    context: errorContext
                });
                abortUpgrade(socket, errorCode, errorContext);
                return;
            }
            const head = Buffer.from(upgradeHead); // eslint-disable-line node/no-deprecated-api
            upgradeHead = null;
            // delegate to ws
            this.ws.handleUpgrade(req, socket, head, websocket => {
                this.onWebSocket(req, socket, websocket);
            });
        });
    }
    /**
     * Called upon a ws.io connection.
     *
     * @param {ws.Socket} websocket
     * @api private
     */
    onWebSocket(req, socket, websocket) {
        websocket.on("error", onUpgradeError);
        if (transports_1.default[req._query.transport] !== undefined &&
            !transports_1.default[req._query.transport].prototype.handlesUpgrades) {
            debug("transport doesnt handle upgraded requests");
            websocket.close();
            return;
        }
        // get client id
        const id = req._query.sid;
        // keep a reference to the ws.Socket
        req.websocket = websocket;
        if (id) {
            const client = this.clients[id];
            if (!client) {
                debug("upgrade attempt for closed client");
                websocket.close();
            }
            else if (client.upgrading) {
                debug("transport has already been trying to upgrade");
                websocket.close();
            }
            else if (client.upgraded) {
                debug("transport had already been upgraded");
                websocket.close();
            }
            else {
                debug("upgrading existing transport");
                // transport error handling takes over
                websocket.removeListener("error", onUpgradeError);
                const transport = this.createTransport(req._query.transport, req);
                if (req._query && req._query.b64) {
                    transport.supportsBinary = false;
                }
                else {
                    transport.supportsBinary = true;
                }
                transport.perMessageDeflate = this.opts.perMessageDeflate;
                client.maybeUpgrade(transport);
            }
        }
        else {
            // transport error handling takes over
            websocket.removeListener("error", onUpgradeError);
            const closeConnection = (errorCode, errorContext) => abortUpgrade(socket, errorCode, errorContext);
            this.handshake(req._query.transport, req, closeConnection);
        }
        function onUpgradeError() {
            debug("websocket error before upgrade");
            // websocket.close() not needed
        }
    }
    /**
     * Captures upgrade requests for a http.Server.
     *
     * @param {http.Server} server
     * @param {Object} options
     * @api public
     */
    attach(server, options = {}) {
        let path = (options.path || "/engine.io").replace(/\/$/, "");
        const destroyUpgradeTimeout = options.destroyUpgradeTimeout || 1000;
        // normalize path
        path += "/";
        function check(req) {
            return path === req.url.substr(0, path.length);
        }
        // cache and clean up listeners
        const listeners = server.listeners("request").slice(0);
        server.removeAllListeners("request");
        server.on("close", this.close.bind(this));
        server.on("listening", this.init.bind(this));
        // add request handler
        server.on("request", (req, res) => {
            if (check(req)) {
                debug('intercepting request for path "%s"', path);
                this.handleRequest(req, res);
            }
            else {
                let i = 0;
                const l = listeners.length;
                for (; i < l; i++) {
                    listeners[i].call(server, req, res);
                }
            }
        });
        if (~this.opts.transports.indexOf("websocket")) {
            server.on("upgrade", (req, socket, head) => {
                if (check(req)) {
                    this.handleUpgrade(req, socket, head);
                }
                else if (false !== options.destroyUpgrade) {
                    // default node behavior is to disconnect when no handlers
                    // but by adding a handler, we prevent that
                    // and if no eio thing handles the upgrade
                    // then the socket needs to die!
                    setTimeout(function () {
                        // @ts-ignore
                        if (socket.writable && socket.bytesWritten <= 0) {
                            return socket.end();
                        }
                    }, destroyUpgradeTimeout);
                }
            });
        }
    }
}
exports.Server = Server;
/**
 * Close the HTTP long-polling request
 *
 * @param res - the response object
 * @param errorCode - the error code
 * @param errorContext - additional error context
 *
 * @api private
 */
function abortRequest(res, errorCode, errorContext) {
    const statusCode = errorCode === Server.errors.FORBIDDEN ? 403 : 400;
    const message = errorContext && errorContext.message
        ? errorContext.message
        : Server.errorMessages[errorCode];
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
        code: errorCode,
        message
    }));
}
/**
 * Close the WebSocket connection
 *
 * @param {net.Socket} socket
 * @param {string} errorCode - the error code
 * @param {object} errorContext - additional error context
 *
 * @api private
 */
function abortUpgrade(socket, errorCode, errorContext = {}) {
    socket.on("error", () => {
        debug("ignoring error from closed connection");
    });
    if (socket.writable) {
        const message = errorContext.message || Server.errorMessages[errorCode];
        const length = Buffer.byteLength(message);
        socket.write("HTTP/1.1 400 Bad Request\r\n" +
            "Connection: close\r\n" +
            "Content-type: text/html\r\n" +
            "Content-Length: " +
            length +
            "\r\n" +
            "\r\n" +
            message);
    }
    socket.destroy();
}
/* eslint-disable */
/**
 * From https://github.com/nodejs/node/blob/v8.4.0/lib/_http_common.js#L303-L354
 *
 * True if val contains an invalid field-vchar
 *  field-value    = *( field-content / obs-fold )
 *  field-content  = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 *  field-vchar    = VCHAR / obs-text
 *
 * checkInvalidHeaderChar() is currently designed to be inlinable by v8,
 * so take care when making changes to the implementation so that the source
 * code size does not exceed v8's default max_inlined_source_size setting.
 **/
// prettier-ignore
const validHdrChars = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 // ... 255
];
function checkInvalidHeaderChar(val) {
    val += "";
    if (val.length < 1)
        return false;
    if (!validHdrChars[val.charCodeAt(0)]) {
        debug('invalid header, index 0, char "%s"', val.charCodeAt(0));
        return true;
    }
    if (val.length < 2)
        return false;
    if (!validHdrChars[val.charCodeAt(1)]) {
        debug('invalid header, index 1, char "%s"', val.charCodeAt(1));
        return true;
    }
    if (val.length < 3)
        return false;
    if (!validHdrChars[val.charCodeAt(2)]) {
        debug('invalid header, index 2, char "%s"', val.charCodeAt(2));
        return true;
    }
    if (val.length < 4)
        return false;
    if (!validHdrChars[val.charCodeAt(3)]) {
        debug('invalid header, index 3, char "%s"', val.charCodeAt(3));
        return true;
    }
    for (let i = 4; i < val.length; ++i) {
        if (!validHdrChars[val.charCodeAt(i)]) {
            debug('invalid header, index "%i", char "%s"', i, val.charCodeAt(i));
            return true;
        }
    }
    return false;
}


/***/ }),

/***/ "./src/server/node_modules/engine.io/build/socket.js":
/*!***********************************************************!*\
  !*** ./src/server/node_modules/engine.io/build/socket.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Socket = void 0;
const events_1 = __webpack_require__(/*! events */ "events");
const debug_1 = __webpack_require__(/*! debug */ "debug");
const debug = (0, debug_1.default)("engine:socket");
class Socket extends events_1.EventEmitter {
    /**
     * Client class (abstract).
     *
     * @api private
     */
    constructor(id, server, transport, req, protocol) {
        super();
        this.id = id;
        this.server = server;
        this.upgrading = false;
        this.upgraded = false;
        this.readyState = "opening";
        this.writeBuffer = [];
        this.packetsFn = [];
        this.sentCallbackFn = [];
        this.cleanupFn = [];
        this.request = req;
        this.protocol = protocol;
        // Cache IP since it might not be in the req later
        if (req.websocket && req.websocket._socket) {
            this.remoteAddress = req.websocket._socket.remoteAddress;
        }
        else {
            this.remoteAddress = req.connection.remoteAddress;
        }
        this.checkIntervalTimer = null;
        this.upgradeTimeoutTimer = null;
        this.pingTimeoutTimer = null;
        this.pingIntervalTimer = null;
        this.setTransport(transport);
        this.onOpen();
    }
    get readyState() {
        return this._readyState;
    }
    set readyState(state) {
        debug("readyState updated from %s to %s", this._readyState, state);
        this._readyState = state;
    }
    /**
     * Called upon transport considered open.
     *
     * @api private
     */
    onOpen() {
        this.readyState = "open";
        // sends an `open` packet
        this.transport.sid = this.id;
        this.sendPacket("open", JSON.stringify({
            sid: this.id,
            upgrades: this.getAvailableUpgrades(),
            pingInterval: this.server.opts.pingInterval,
            pingTimeout: this.server.opts.pingTimeout
        }));
        if (this.server.opts.initialPacket) {
            this.sendPacket("message", this.server.opts.initialPacket);
        }
        this.emit("open");
        if (this.protocol === 3) {
            // in protocol v3, the client sends a ping, and the server answers with a pong
            this.resetPingTimeout(this.server.opts.pingInterval + this.server.opts.pingTimeout);
        }
        else {
            // in protocol v4, the server sends a ping, and the client answers with a pong
            this.schedulePing();
        }
    }
    /**
     * Called upon transport packet.
     *
     * @param {Object} packet
     * @api private
     */
    onPacket(packet) {
        if ("open" !== this.readyState) {
            return debug("packet received with closed socket");
        }
        // export packet event
        debug(`received packet ${packet.type}`);
        this.emit("packet", packet);
        // Reset ping timeout on any packet, incoming data is a good sign of
        // other side's liveness
        this.resetPingTimeout(this.server.opts.pingInterval + this.server.opts.pingTimeout);
        switch (packet.type) {
            case "ping":
                if (this.transport.protocol !== 3) {
                    this.onError("invalid heartbeat direction");
                    return;
                }
                debug("got ping");
                this.sendPacket("pong");
                this.emit("heartbeat");
                break;
            case "pong":
                if (this.transport.protocol === 3) {
                    this.onError("invalid heartbeat direction");
                    return;
                }
                debug("got pong");
                this.pingIntervalTimer.refresh();
                this.emit("heartbeat");
                break;
            case "error":
                this.onClose("parse error");
                break;
            case "message":
                this.emit("data", packet.data);
                this.emit("message", packet.data);
                break;
        }
    }
    /**
     * Called upon transport error.
     *
     * @param {Error} error object
     * @api private
     */
    onError(err) {
        debug("transport error");
        this.onClose("transport error", err);
    }
    /**
     * Pings client every `this.pingInterval` and expects response
     * within `this.pingTimeout` or closes connection.
     *
     * @api private
     */
    schedulePing() {
        this.pingIntervalTimer = setTimeout(() => {
            debug("writing ping packet - expecting pong within %sms", this.server.opts.pingTimeout);
            this.sendPacket("ping");
            this.resetPingTimeout(this.server.opts.pingTimeout);
        }, this.server.opts.pingInterval);
    }
    /**
     * Resets ping timeout.
     *
     * @api private
     */
    resetPingTimeout(timeout) {
        clearTimeout(this.pingTimeoutTimer);
        this.pingTimeoutTimer = setTimeout(() => {
            if (this.readyState === "closed")
                return;
            this.onClose("ping timeout");
        }, timeout);
    }
    /**
     * Attaches handlers for the given transport.
     *
     * @param {Transport} transport
     * @api private
     */
    setTransport(transport) {
        const onError = this.onError.bind(this);
        const onPacket = this.onPacket.bind(this);
        const flush = this.flush.bind(this);
        const onClose = this.onClose.bind(this, "transport close");
        this.transport = transport;
        this.transport.once("error", onError);
        this.transport.on("packet", onPacket);
        this.transport.on("drain", flush);
        this.transport.once("close", onClose);
        // this function will manage packet events (also message callbacks)
        this.setupSendCallback();
        this.cleanupFn.push(function () {
            transport.removeListener("error", onError);
            transport.removeListener("packet", onPacket);
            transport.removeListener("drain", flush);
            transport.removeListener("close", onClose);
        });
    }
    /**
     * Upgrades socket to the given transport
     *
     * @param {Transport} transport
     * @api private
     */
    maybeUpgrade(transport) {
        debug('might upgrade socket transport from "%s" to "%s"', this.transport.name, transport.name);
        this.upgrading = true;
        // set transport upgrade timer
        this.upgradeTimeoutTimer = setTimeout(() => {
            debug("client did not complete upgrade - closing transport");
            cleanup();
            if ("open" === transport.readyState) {
                transport.close();
            }
        }, this.server.opts.upgradeTimeout);
        const onPacket = packet => {
            if ("ping" === packet.type && "probe" === packet.data) {
                debug("got probe ping packet, sending pong");
                transport.send([{ type: "pong", data: "probe" }]);
                this.emit("upgrading", transport);
                clearInterval(this.checkIntervalTimer);
                this.checkIntervalTimer = setInterval(check, 100);
            }
            else if ("upgrade" === packet.type && this.readyState !== "closed") {
                debug("got upgrade packet - upgrading");
                cleanup();
                this.transport.discard();
                this.upgraded = true;
                this.clearTransport();
                this.setTransport(transport);
                this.emit("upgrade", transport);
                this.flush();
                if (this.readyState === "closing") {
                    transport.close(() => {
                        this.onClose("forced close");
                    });
                }
            }
            else {
                cleanup();
                transport.close();
            }
        };
        // we force a polling cycle to ensure a fast upgrade
        const check = () => {
            if ("polling" === this.transport.name && this.transport.writable) {
                debug("writing a noop packet to polling for fast upgrade");
                this.transport.send([{ type: "noop" }]);
            }
        };
        const cleanup = () => {
            this.upgrading = false;
            clearInterval(this.checkIntervalTimer);
            this.checkIntervalTimer = null;
            clearTimeout(this.upgradeTimeoutTimer);
            this.upgradeTimeoutTimer = null;
            transport.removeListener("packet", onPacket);
            transport.removeListener("close", onTransportClose);
            transport.removeListener("error", onError);
            this.removeListener("close", onClose);
        };
        const onError = err => {
            debug("client did not complete upgrade - %s", err);
            cleanup();
            transport.close();
            transport = null;
        };
        const onTransportClose = () => {
            onError("transport closed");
        };
        const onClose = () => {
            onError("socket closed");
        };
        transport.on("packet", onPacket);
        transport.once("close", onTransportClose);
        transport.once("error", onError);
        this.once("close", onClose);
    }
    /**
     * Clears listeners and timers associated with current transport.
     *
     * @api private
     */
    clearTransport() {
        let cleanup;
        const toCleanUp = this.cleanupFn.length;
        for (let i = 0; i < toCleanUp; i++) {
            cleanup = this.cleanupFn.shift();
            cleanup();
        }
        // silence further transport errors and prevent uncaught exceptions
        this.transport.on("error", function () {
            debug("error triggered by discarded transport");
        });
        // ensure transport won't stay open
        this.transport.close();
        clearTimeout(this.pingTimeoutTimer);
    }
    /**
     * Called upon transport considered closed.
     * Possible reasons: `ping timeout`, `client error`, `parse error`,
     * `transport error`, `server close`, `transport close`
     */
    onClose(reason, description) {
        if ("closed" !== this.readyState) {
            this.readyState = "closed";
            // clear timers
            clearTimeout(this.pingIntervalTimer);
            clearTimeout(this.pingTimeoutTimer);
            clearInterval(this.checkIntervalTimer);
            this.checkIntervalTimer = null;
            clearTimeout(this.upgradeTimeoutTimer);
            // clean writeBuffer in next tick, so developers can still
            // grab the writeBuffer on 'close' event
            process.nextTick(() => {
                this.writeBuffer = [];
            });
            this.packetsFn = [];
            this.sentCallbackFn = [];
            this.clearTransport();
            this.emit("close", reason, description);
        }
    }
    /**
     * Setup and manage send callback
     *
     * @api private
     */
    setupSendCallback() {
        // the message was sent successfully, execute the callback
        const onDrain = () => {
            if (this.sentCallbackFn.length > 0) {
                const seqFn = this.sentCallbackFn.splice(0, 1)[0];
                if ("function" === typeof seqFn) {
                    debug("executing send callback");
                    seqFn(this.transport);
                }
                else if (Array.isArray(seqFn)) {
                    debug("executing batch send callback");
                    const l = seqFn.length;
                    let i = 0;
                    for (; i < l; i++) {
                        if ("function" === typeof seqFn[i]) {
                            seqFn[i](this.transport);
                        }
                    }
                }
            }
        };
        this.transport.on("drain", onDrain);
        this.cleanupFn.push(() => {
            this.transport.removeListener("drain", onDrain);
        });
    }
    /**
     * Sends a message packet.
     *
     * @param {String} message
     * @param {Object} options
     * @param {Function} callback
     * @return {Socket} for chaining
     * @api public
     */
    send(data, options, callback) {
        this.sendPacket("message", data, options, callback);
        return this;
    }
    write(data, options, callback) {
        this.sendPacket("message", data, options, callback);
        return this;
    }
    /**
     * Sends a packet.
     *
     * @param {String} packet type
     * @param {String} optional, data
     * @param {Object} options
     * @api private
     */
    sendPacket(type, data, options, callback) {
        if ("function" === typeof options) {
            callback = options;
            options = null;
        }
        options = options || {};
        options.compress = false !== options.compress;
        if ("closing" !== this.readyState && "closed" !== this.readyState) {
            debug('sending packet "%s" (%s)', type, data);
            const packet = {
                type: type,
                options: options
            };
            if (data)
                packet.data = data;
            // exports packetCreate event
            this.emit("packetCreate", packet);
            this.writeBuffer.push(packet);
            // add send callback to object, if defined
            if (callback)
                this.packetsFn.push(callback);
            this.flush();
        }
    }
    /**
     * Attempts to flush the packets buffer.
     *
     * @api private
     */
    flush() {
        if ("closed" !== this.readyState &&
            this.transport.writable &&
            this.writeBuffer.length) {
            debug("flushing buffer to transport");
            this.emit("flush", this.writeBuffer);
            this.server.emit("flush", this, this.writeBuffer);
            const wbuf = this.writeBuffer;
            this.writeBuffer = [];
            if (!this.transport.supportsFraming) {
                this.sentCallbackFn.push(this.packetsFn);
            }
            else {
                this.sentCallbackFn.push.apply(this.sentCallbackFn, this.packetsFn);
            }
            this.packetsFn = [];
            this.transport.send(wbuf);
            this.emit("drain");
            this.server.emit("drain", this);
        }
    }
    /**
     * Get available upgrades for this socket.
     *
     * @api private
     */
    getAvailableUpgrades() {
        const availableUpgrades = [];
        const allUpgrades = this.server.upgrades(this.transport.name);
        let i = 0;
        const l = allUpgrades.length;
        for (; i < l; ++i) {
            const upg = allUpgrades[i];
            if (this.server.opts.transports.indexOf(upg) !== -1) {
                availableUpgrades.push(upg);
            }
        }
        return availableUpgrades;
    }
    /**
     * Closes the socket and underlying transport.
     *
     * @param {Boolean} discard - optional, discard the transport
     * @return {Socket} for chaining
     * @api public
     */
    close(discard) {
        if ("open" !== this.readyState)
            return;
        this.readyState = "closing";
        if (this.writeBuffer.length) {
            this.once("drain", this.closeTransport.bind(this, discard));
            return;
        }
        this.closeTransport(discard);
    }
    /**
     * Closes the underlying transport.
     *
     * @param {Boolean} discard
     * @api private
     */
    closeTransport(discard) {
        if (discard)
            this.transport.discard();
        this.transport.close(this.onClose.bind(this, "forced close"));
    }
}
exports.Socket = Socket;


/***/ }),

/***/ "./src/server/node_modules/engine.io/build/transport.js":
/*!**************************************************************!*\
  !*** ./src/server/node_modules/engine.io/build/transport.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Transport = void 0;
const events_1 = __webpack_require__(/*! events */ "events");
const parser_v4 = __webpack_require__(/*! engine.io-parser */ "./src/server/node_modules/engine.io-parser/build/cjs/index.js");
const parser_v3 = __webpack_require__(/*! ./parser-v3/index */ "./src/server/node_modules/engine.io/build/parser-v3/index.js");
const debug_1 = __webpack_require__(/*! debug */ "debug");
const debug = (0, debug_1.default)("engine:transport");
/**
 * Noop function.
 *
 * @api private
 */
function noop() { }
class Transport extends events_1.EventEmitter {
    /**
     * Transport constructor.
     *
     * @param {http.IncomingMessage} request
     * @api public
     */
    constructor(req) {
        super();
        this.readyState = "open";
        this.discarded = false;
        this.protocol = req._query.EIO === "4" ? 4 : 3; // 3rd revision by default
        this.parser = this.protocol === 4 ? parser_v4 : parser_v3;
    }
    get readyState() {
        return this._readyState;
    }
    set readyState(state) {
        debug("readyState updated from %s to %s (%s)", this._readyState, state, this.name);
        this._readyState = state;
    }
    /**
     * Flags the transport as discarded.
     *
     * @api private
     */
    discard() {
        this.discarded = true;
    }
    /**
     * Called with an incoming HTTP request.
     *
     * @param {http.IncomingMessage} request
     * @api protected
     */
    onRequest(req) {
        debug("setting request");
        this.req = req;
    }
    /**
     * Closes the transport.
     *
     * @api private
     */
    close(fn) {
        if ("closed" === this.readyState || "closing" === this.readyState)
            return;
        this.readyState = "closing";
        this.doClose(fn || noop);
    }
    /**
     * Called with a transport error.
     *
     * @param {String} message error
     * @param {Object} error description
     * @api protected
     */
    onError(msg, desc) {
        if (this.listeners("error").length) {
            const err = new Error(msg);
            // @ts-ignore
            err.type = "TransportError";
            // @ts-ignore
            err.description = desc;
            this.emit("error", err);
        }
        else {
            debug("ignored transport error %s (%s)", msg, desc);
        }
    }
    /**
     * Called with parsed out a packets from the data stream.
     *
     * @param {Object} packet
     * @api protected
     */
    onPacket(packet) {
        this.emit("packet", packet);
    }
    /**
     * Called with the encoded packet data.
     *
     * @param {String} data
     * @api protected
     */
    onData(data) {
        this.onPacket(this.parser.decodePacket(data));
    }
    /**
     * Called upon transport close.
     *
     * @api protected
     */
    onClose() {
        this.readyState = "closed";
        this.emit("close");
    }
}
exports.Transport = Transport;


/***/ }),

/***/ "./src/server/node_modules/engine.io/build/transports-uws/index.js":
/*!*************************************************************************!*\
  !*** ./src/server/node_modules/engine.io/build/transports-uws/index.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const polling_1 = __webpack_require__(/*! ./polling */ "./src/server/node_modules/engine.io/build/transports-uws/polling.js");
const websocket_1 = __webpack_require__(/*! ./websocket */ "./src/server/node_modules/engine.io/build/transports-uws/websocket.js");
exports["default"] = {
    polling: polling_1.Polling,
    websocket: websocket_1.WebSocket
};


/***/ }),

/***/ "./src/server/node_modules/engine.io/build/transports-uws/polling.js":
/*!***************************************************************************!*\
  !*** ./src/server/node_modules/engine.io/build/transports-uws/polling.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Polling = void 0;
const transport_1 = __webpack_require__(/*! ../transport */ "./src/server/node_modules/engine.io/build/transport.js");
const zlib_1 = __webpack_require__(/*! zlib */ "zlib");
const accepts = __webpack_require__(/*! accepts */ "accepts");
const debug_1 = __webpack_require__(/*! debug */ "debug");
const debug = (0, debug_1.default)("engine:polling");
const compressionMethods = {
    gzip: zlib_1.createGzip,
    deflate: zlib_1.createDeflate
};
class Polling extends transport_1.Transport {
    /**
     * HTTP polling constructor.
     *
     * @api public.
     */
    constructor(req) {
        super(req);
        this.closeTimeout = 30 * 1000;
    }
    /**
     * Transport name
     *
     * @api public
     */
    get name() {
        return "polling";
    }
    get supportsFraming() {
        return false;
    }
    /**
     * Overrides onRequest.
     *
     * @param req
     *
     * @api private
     */
    onRequest(req) {
        const res = req.res;
        if (req.getMethod() === "get") {
            this.onPollRequest(req, res);
        }
        else if (req.getMethod() === "post") {
            this.onDataRequest(req, res);
        }
        else {
            res.writeStatus("500 Internal Server Error");
            res.end();
        }
    }
    /**
     * The client sends a request awaiting for us to send data.
     *
     * @api private
     */
    onPollRequest(req, res) {
        if (this.req) {
            debug("request overlap");
            // assert: this.res, '.req and .res should be (un)set together'
            this.onError("overlap from client");
            res.writeStatus("500 Internal Server Error");
            res.end();
            return;
        }
        debug("setting request");
        this.req = req;
        this.res = res;
        const onClose = () => {
            this.writable = false;
            this.onError("poll connection closed prematurely");
        };
        const cleanup = () => {
            this.req = this.res = null;
        };
        req.cleanup = cleanup;
        res.onAborted(onClose);
        this.writable = true;
        this.emit("drain");
        // if we're still writable but had a pending close, trigger an empty send
        if (this.writable && this.shouldClose) {
            debug("triggering empty send to append close packet");
            this.send([{ type: "noop" }]);
        }
    }
    /**
     * The client sends a request with data.
     *
     * @api private
     */
    onDataRequest(req, res) {
        if (this.dataReq) {
            // assert: this.dataRes, '.dataReq and .dataRes should be (un)set together'
            this.onError("data request overlap from client");
            res.writeStatus("500 Internal Server Error");
            res.end();
            return;
        }
        const isBinary = "application/octet-stream" === req.headers["content-type"];
        if (isBinary && this.protocol === 4) {
            return this.onError("invalid content");
        }
        this.dataReq = req;
        this.dataRes = res;
        let chunks = [];
        let contentLength = 0;
        const cleanup = () => {
            this.dataReq = this.dataRes = chunks = null;
        };
        const onClose = () => {
            cleanup();
            this.onError("data request connection closed prematurely");
        };
        const headers = {
            // text/html is required instead of text/plain to avoid an
            // unwanted download dialog on certain user-agents (GH-43)
            "Content-Type": "text/html"
        };
        this.headers(req, headers);
        Object.keys(headers).forEach(key => {
            res.writeHeader(key, String(headers[key]));
        });
        const onEnd = () => {
            this.onData(Buffer.concat(chunks).toString());
            if (this.readyState !== "closing") {
                res.end("ok");
            }
            cleanup();
        };
        res.onAborted(onClose);
        res.onData((chunk, isLast) => {
            chunks.push(Buffer.from(chunk));
            contentLength += Buffer.byteLength(chunk);
            if (contentLength > this.maxHttpBufferSize) {
                this.onError("payload too large");
                res.writeStatus("413 Payload Too Large");
                res.end();
                return;
            }
            if (isLast) {
                onEnd();
            }
        });
    }
    /**
     * Processes the incoming data payload.
     *
     * @param {String} encoded payload
     * @api private
     */
    onData(data) {
        debug('received "%s"', data);
        const callback = packet => {
            if ("close" === packet.type) {
                debug("got xhr close packet");
                this.onClose();
                return false;
            }
            this.onPacket(packet);
        };
        if (this.protocol === 3) {
            this.parser.decodePayload(data, callback);
        }
        else {
            this.parser.decodePayload(data).forEach(callback);
        }
    }
    /**
     * Overrides onClose.
     *
     * @api private
     */
    onClose() {
        if (this.writable) {
            // close pending poll request
            this.send([{ type: "noop" }]);
        }
        super.onClose();
    }
    /**
     * Writes a packet payload.
     *
     * @param {Object} packet
     * @api private
     */
    send(packets) {
        this.writable = false;
        if (this.shouldClose) {
            debug("appending close packet to payload");
            packets.push({ type: "close" });
            this.shouldClose();
            this.shouldClose = null;
        }
        const doWrite = data => {
            const compress = packets.some(packet => {
                return packet.options && packet.options.compress;
            });
            this.write(data, { compress });
        };
        if (this.protocol === 3) {
            this.parser.encodePayload(packets, this.supportsBinary, doWrite);
        }
        else {
            this.parser.encodePayload(packets, doWrite);
        }
    }
    /**
     * Writes data as response to poll request.
     *
     * @param {String} data
     * @param {Object} options
     * @api private
     */
    write(data, options) {
        debug('writing "%s"', data);
        this.doWrite(data, options, () => {
            this.req.cleanup();
        });
    }
    /**
     * Performs the write.
     *
     * @api private
     */
    doWrite(data, options, callback) {
        // explicit UTF-8 is required for pages not served under utf
        const isString = typeof data === "string";
        const contentType = isString
            ? "text/plain; charset=UTF-8"
            : "application/octet-stream";
        const headers = {
            "Content-Type": contentType
        };
        const respond = data => {
            this.headers(this.req, headers);
            Object.keys(headers).forEach(key => {
                this.res.writeHeader(key, String(headers[key]));
            });
            this.res.end(data);
            callback();
        };
        if (!this.httpCompression || !options.compress) {
            respond(data);
            return;
        }
        const len = isString ? Buffer.byteLength(data) : data.length;
        if (len < this.httpCompression.threshold) {
            respond(data);
            return;
        }
        const encoding = accepts(this.req).encodings(["gzip", "deflate"]);
        if (!encoding) {
            respond(data);
            return;
        }
        this.compress(data, encoding, (err, data) => {
            if (err) {
                this.res.writeStatus("500 Internal Server Error");
                this.res.end();
                callback(err);
                return;
            }
            headers["Content-Encoding"] = encoding;
            respond(data);
        });
    }
    /**
     * Compresses data.
     *
     * @api private
     */
    compress(data, encoding, callback) {
        debug("compressing");
        const buffers = [];
        let nread = 0;
        compressionMethods[encoding](this.httpCompression)
            .on("error", callback)
            .on("data", function (chunk) {
            buffers.push(chunk);
            nread += chunk.length;
        })
            .on("end", function () {
            callback(null, Buffer.concat(buffers, nread));
        })
            .end(data);
    }
    /**
     * Closes the transport.
     *
     * @api private
     */
    doClose(fn) {
        debug("closing");
        let closeTimeoutTimer;
        const onClose = () => {
            clearTimeout(closeTimeoutTimer);
            fn();
            this.onClose();
        };
        if (this.writable) {
            debug("transport writable - closing right away");
            this.send([{ type: "close" }]);
            onClose();
        }
        else if (this.discarded) {
            debug("transport discarded - closing right away");
            onClose();
        }
        else {
            debug("transport not writable - buffering orderly close");
            this.shouldClose = onClose;
            closeTimeoutTimer = setTimeout(onClose, this.closeTimeout);
        }
    }
    /**
     * Returns headers for a response.
     *
     * @param req - request
     * @param {Object} extra headers
     * @api private
     */
    headers(req, headers) {
        headers = headers || {};
        // prevent XSS warnings on IE
        // https://github.com/LearnBoost/socket.io/pull/1333
        const ua = req.headers["user-agent"];
        if (ua && (~ua.indexOf(";MSIE") || ~ua.indexOf("Trident/"))) {
            headers["X-XSS-Protection"] = "0";
        }
        this.emit("headers", headers, req);
        return headers;
    }
}
exports.Polling = Polling;


/***/ }),

/***/ "./src/server/node_modules/engine.io/build/transports-uws/websocket.js":
/*!*****************************************************************************!*\
  !*** ./src/server/node_modules/engine.io/build/transports-uws/websocket.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSocket = void 0;
const transport_1 = __webpack_require__(/*! ../transport */ "./src/server/node_modules/engine.io/build/transport.js");
const debug_1 = __webpack_require__(/*! debug */ "debug");
const debug = (0, debug_1.default)("engine:ws");
class WebSocket extends transport_1.Transport {
    /**
     * WebSocket transport
     *
     * @param req
     * @api public
     */
    constructor(req) {
        super(req);
        this.writable = false;
        this.perMessageDeflate = null;
    }
    /**
     * Transport name
     *
     * @api public
     */
    get name() {
        return "websocket";
    }
    /**
     * Advertise upgrade support.
     *
     * @api public
     */
    get handlesUpgrades() {
        return true;
    }
    /**
     * Advertise framing support.
     *
     * @api public
     */
    get supportsFraming() {
        return true;
    }
    /**
     * Writes a packet payload.
     *
     * @param {Array} packets
     * @api private
     */
    send(packets) {
        const packet = packets.shift();
        if (typeof packet === "undefined") {
            this.writable = true;
            this.emit("drain");
            return;
        }
        // always creates a new object since ws modifies it
        const opts = {};
        if (packet.options) {
            opts.compress = packet.options.compress;
        }
        const send = data => {
            const isBinary = typeof data !== "string";
            const compress = this.perMessageDeflate &&
                Buffer.byteLength(data) > this.perMessageDeflate.threshold;
            debug('writing "%s"', data);
            this.writable = false;
            this.socket.send(data, isBinary, compress);
            this.send(packets);
        };
        if (packet.options && typeof packet.options.wsPreEncoded === "string") {
            send(packet.options.wsPreEncoded);
        }
        else {
            this.parser.encodePacket(packet, this.supportsBinary, send);
        }
    }
    /**
     * Closes the transport.
     *
     * @api private
     */
    doClose(fn) {
        debug("closing");
        fn && fn();
        // call fn first since socket.close() immediately emits a "close" event
        this.socket.close();
    }
}
exports.WebSocket = WebSocket;


/***/ }),

/***/ "./src/server/node_modules/engine.io/build/transports/index.js":
/*!*********************************************************************!*\
  !*** ./src/server/node_modules/engine.io/build/transports/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const polling_1 = __webpack_require__(/*! ./polling */ "./src/server/node_modules/engine.io/build/transports/polling.js");
const polling_jsonp_1 = __webpack_require__(/*! ./polling-jsonp */ "./src/server/node_modules/engine.io/build/transports/polling-jsonp.js");
const websocket_1 = __webpack_require__(/*! ./websocket */ "./src/server/node_modules/engine.io/build/transports/websocket.js");
exports["default"] = {
    polling: polling,
    websocket: websocket_1.WebSocket
};
/**
 * Polling polymorphic constructor.
 *
 * @api private
 */
function polling(req) {
    if ("string" === typeof req._query.j) {
        return new polling_jsonp_1.JSONP(req);
    }
    else {
        return new polling_1.Polling(req);
    }
}
polling.upgradesTo = ["websocket"];


/***/ }),

/***/ "./src/server/node_modules/engine.io/build/transports/polling-jsonp.js":
/*!*****************************************************************************!*\
  !*** ./src/server/node_modules/engine.io/build/transports/polling-jsonp.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JSONP = void 0;
const polling_1 = __webpack_require__(/*! ./polling */ "./src/server/node_modules/engine.io/build/transports/polling.js");
const qs = __webpack_require__(/*! querystring */ "querystring");
const rDoubleSlashes = /\\\\n/g;
const rSlashes = /(\\)?\\n/g;
class JSONP extends polling_1.Polling {
    /**
     * JSON-P polling transport.
     *
     * @api public
     */
    constructor(req) {
        super(req);
        this.head = "___eio[" + (req._query.j || "").replace(/[^0-9]/g, "") + "](";
        this.foot = ");";
    }
    /**
     * Handles incoming data.
     * Due to a bug in \n handling by browsers, we expect a escaped string.
     *
     * @api private
     */
    onData(data) {
        // we leverage the qs module so that we get built-in DoS protection
        // and the fast alternative to decodeURIComponent
        data = qs.parse(data).d;
        if ("string" === typeof data) {
            // client will send already escaped newlines as \\\\n and newlines as \\n
            // \\n must be replaced with \n and \\\\n with \\n
            data = data.replace(rSlashes, function (match, slashes) {
                return slashes ? match : "\n";
            });
            super.onData(data.replace(rDoubleSlashes, "\\n"));
        }
    }
    /**
     * Performs the write.
     *
     * @api private
     */
    doWrite(data, options, callback) {
        // we must output valid javascript, not valid json
        // see: http://timelessrepo.com/json-isnt-a-javascript-subset
        const js = JSON.stringify(data)
            .replace(/\u2028/g, "\\u2028")
            .replace(/\u2029/g, "\\u2029");
        // prepare response
        data = this.head + js + this.foot;
        super.doWrite(data, options, callback);
    }
}
exports.JSONP = JSONP;


/***/ }),

/***/ "./src/server/node_modules/engine.io/build/transports/polling.js":
/*!***********************************************************************!*\
  !*** ./src/server/node_modules/engine.io/build/transports/polling.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Polling = void 0;
const transport_1 = __webpack_require__(/*! ../transport */ "./src/server/node_modules/engine.io/build/transport.js");
const zlib_1 = __webpack_require__(/*! zlib */ "zlib");
const accepts = __webpack_require__(/*! accepts */ "accepts");
const debug_1 = __webpack_require__(/*! debug */ "debug");
const debug = (0, debug_1.default)("engine:polling");
const compressionMethods = {
    gzip: zlib_1.createGzip,
    deflate: zlib_1.createDeflate
};
class Polling extends transport_1.Transport {
    /**
     * HTTP polling constructor.
     *
     * @api public.
     */
    constructor(req) {
        super(req);
        this.closeTimeout = 30 * 1000;
    }
    /**
     * Transport name
     *
     * @api public
     */
    get name() {
        return "polling";
    }
    get supportsFraming() {
        return false;
    }
    /**
     * Overrides onRequest.
     *
     * @param {http.IncomingMessage}
     * @api private
     */
    onRequest(req) {
        const res = req.res;
        if ("GET" === req.method) {
            this.onPollRequest(req, res);
        }
        else if ("POST" === req.method) {
            this.onDataRequest(req, res);
        }
        else {
            res.writeHead(500);
            res.end();
        }
    }
    /**
     * The client sends a request awaiting for us to send data.
     *
     * @api private
     */
    onPollRequest(req, res) {
        if (this.req) {
            debug("request overlap");
            // assert: this.res, '.req and .res should be (un)set together'
            this.onError("overlap from client");
            res.writeHead(500);
            res.end();
            return;
        }
        debug("setting request");
        this.req = req;
        this.res = res;
        const onClose = () => {
            this.onError("poll connection closed prematurely");
        };
        const cleanup = () => {
            req.removeListener("close", onClose);
            this.req = this.res = null;
        };
        req.cleanup = cleanup;
        req.on("close", onClose);
        this.writable = true;
        this.emit("drain");
        // if we're still writable but had a pending close, trigger an empty send
        if (this.writable && this.shouldClose) {
            debug("triggering empty send to append close packet");
            this.send([{ type: "noop" }]);
        }
    }
    /**
     * The client sends a request with data.
     *
     * @api private
     */
    onDataRequest(req, res) {
        if (this.dataReq) {
            // assert: this.dataRes, '.dataReq and .dataRes should be (un)set together'
            this.onError("data request overlap from client");
            res.writeHead(500);
            res.end();
            return;
        }
        const isBinary = "application/octet-stream" === req.headers["content-type"];
        if (isBinary && this.protocol === 4) {
            return this.onError("invalid content");
        }
        this.dataReq = req;
        this.dataRes = res;
        let chunks = isBinary ? Buffer.concat([]) : "";
        const cleanup = () => {
            req.removeListener("data", onData);
            req.removeListener("end", onEnd);
            req.removeListener("close", onClose);
            this.dataReq = this.dataRes = chunks = null;
        };
        const onClose = () => {
            cleanup();
            this.onError("data request connection closed prematurely");
        };
        const onData = data => {
            let contentLength;
            if (isBinary) {
                chunks = Buffer.concat([chunks, data]);
                contentLength = chunks.length;
            }
            else {
                chunks += data;
                contentLength = Buffer.byteLength(chunks);
            }
            if (contentLength > this.maxHttpBufferSize) {
                chunks = isBinary ? Buffer.concat([]) : "";
                req.connection.destroy();
            }
        };
        const onEnd = () => {
            this.onData(chunks);
            const headers = {
                // text/html is required instead of text/plain to avoid an
                // unwanted download dialog on certain user-agents (GH-43)
                "Content-Type": "text/html",
                "Content-Length": 2
            };
            res.writeHead(200, this.headers(req, headers));
            res.end("ok");
            cleanup();
        };
        req.on("close", onClose);
        if (!isBinary)
            req.setEncoding("utf8");
        req.on("data", onData);
        req.on("end", onEnd);
    }
    /**
     * Processes the incoming data payload.
     *
     * @param {String} encoded payload
     * @api private
     */
    onData(data) {
        debug('received "%s"', data);
        const callback = packet => {
            if ("close" === packet.type) {
                debug("got xhr close packet");
                this.onClose();
                return false;
            }
            this.onPacket(packet);
        };
        if (this.protocol === 3) {
            this.parser.decodePayload(data, callback);
        }
        else {
            this.parser.decodePayload(data).forEach(callback);
        }
    }
    /**
     * Overrides onClose.
     *
     * @api private
     */
    onClose() {
        if (this.writable) {
            // close pending poll request
            this.send([{ type: "noop" }]);
        }
        super.onClose();
    }
    /**
     * Writes a packet payload.
     *
     * @param {Object} packet
     * @api private
     */
    send(packets) {
        this.writable = false;
        if (this.shouldClose) {
            debug("appending close packet to payload");
            packets.push({ type: "close" });
            this.shouldClose();
            this.shouldClose = null;
        }
        const doWrite = data => {
            const compress = packets.some(packet => {
                return packet.options && packet.options.compress;
            });
            this.write(data, { compress });
        };
        if (this.protocol === 3) {
            this.parser.encodePayload(packets, this.supportsBinary, doWrite);
        }
        else {
            this.parser.encodePayload(packets, doWrite);
        }
    }
    /**
     * Writes data as response to poll request.
     *
     * @param {String} data
     * @param {Object} options
     * @api private
     */
    write(data, options) {
        debug('writing "%s"', data);
        this.doWrite(data, options, () => {
            this.req.cleanup();
        });
    }
    /**
     * Performs the write.
     *
     * @api private
     */
    doWrite(data, options, callback) {
        // explicit UTF-8 is required for pages not served under utf
        const isString = typeof data === "string";
        const contentType = isString
            ? "text/plain; charset=UTF-8"
            : "application/octet-stream";
        const headers = {
            "Content-Type": contentType
        };
        const respond = data => {
            headers["Content-Length"] =
                "string" === typeof data ? Buffer.byteLength(data) : data.length;
            this.res.writeHead(200, this.headers(this.req, headers));
            this.res.end(data);
            callback();
        };
        if (!this.httpCompression || !options.compress) {
            respond(data);
            return;
        }
        const len = isString ? Buffer.byteLength(data) : data.length;
        if (len < this.httpCompression.threshold) {
            respond(data);
            return;
        }
        const encoding = accepts(this.req).encodings(["gzip", "deflate"]);
        if (!encoding) {
            respond(data);
            return;
        }
        this.compress(data, encoding, (err, data) => {
            if (err) {
                this.res.writeHead(500);
                this.res.end();
                callback(err);
                return;
            }
            headers["Content-Encoding"] = encoding;
            respond(data);
        });
    }
    /**
     * Compresses data.
     *
     * @api private
     */
    compress(data, encoding, callback) {
        debug("compressing");
        const buffers = [];
        let nread = 0;
        compressionMethods[encoding](this.httpCompression)
            .on("error", callback)
            .on("data", function (chunk) {
            buffers.push(chunk);
            nread += chunk.length;
        })
            .on("end", function () {
            callback(null, Buffer.concat(buffers, nread));
        })
            .end(data);
    }
    /**
     * Closes the transport.
     *
     * @api private
     */
    doClose(fn) {
        debug("closing");
        let closeTimeoutTimer;
        if (this.dataReq) {
            debug("aborting ongoing data request");
            this.dataReq.destroy();
        }
        const onClose = () => {
            clearTimeout(closeTimeoutTimer);
            fn();
            this.onClose();
        };
        if (this.writable) {
            debug("transport writable - closing right away");
            this.send([{ type: "close" }]);
            onClose();
        }
        else if (this.discarded) {
            debug("transport discarded - closing right away");
            onClose();
        }
        else {
            debug("transport not writable - buffering orderly close");
            this.shouldClose = onClose;
            closeTimeoutTimer = setTimeout(onClose, this.closeTimeout);
        }
    }
    /**
     * Returns headers for a response.
     *
     * @param {http.IncomingMessage} request
     * @param {Object} extra headers
     * @api private
     */
    headers(req, headers) {
        headers = headers || {};
        // prevent XSS warnings on IE
        // https://github.com/LearnBoost/socket.io/pull/1333
        const ua = req.headers["user-agent"];
        if (ua && (~ua.indexOf(";MSIE") || ~ua.indexOf("Trident/"))) {
            headers["X-XSS-Protection"] = "0";
        }
        this.emit("headers", headers, req);
        return headers;
    }
}
exports.Polling = Polling;


/***/ }),

/***/ "./src/server/node_modules/engine.io/build/transports/websocket.js":
/*!*************************************************************************!*\
  !*** ./src/server/node_modules/engine.io/build/transports/websocket.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSocket = void 0;
const transport_1 = __webpack_require__(/*! ../transport */ "./src/server/node_modules/engine.io/build/transport.js");
const debug_1 = __webpack_require__(/*! debug */ "debug");
const debug = (0, debug_1.default)("engine:ws");
class WebSocket extends transport_1.Transport {
    /**
     * WebSocket transport
     *
     * @param {http.IncomingMessage}
     * @api public
     */
    constructor(req) {
        super(req);
        this.socket = req.websocket;
        this.socket.on("message", (data, isBinary) => {
            const message = isBinary ? data : data.toString();
            debug('received "%s"', message);
            super.onData(message);
        });
        this.socket.once("close", this.onClose.bind(this));
        this.socket.on("error", this.onError.bind(this));
        this.writable = true;
        this.perMessageDeflate = null;
    }
    /**
     * Transport name
     *
     * @api public
     */
    get name() {
        return "websocket";
    }
    /**
     * Advertise upgrade support.
     *
     * @api public
     */
    get handlesUpgrades() {
        return true;
    }
    /**
     * Advertise framing support.
     *
     * @api public
     */
    get supportsFraming() {
        return true;
    }
    /**
     * Writes a packet payload.
     *
     * @param {Array} packets
     * @api private
     */
    send(packets) {
        const packet = packets.shift();
        if (typeof packet === "undefined") {
            this.writable = true;
            this.emit("drain");
            return;
        }
        // always creates a new object since ws modifies it
        const opts = {};
        if (packet.options) {
            opts.compress = packet.options.compress;
        }
        const send = data => {
            if (this.perMessageDeflate) {
                const len = "string" === typeof data ? Buffer.byteLength(data) : data.length;
                if (len < this.perMessageDeflate.threshold) {
                    opts.compress = false;
                }
            }
            debug('writing "%s"', data);
            this.writable = false;
            this.socket.send(data, opts, err => {
                if (err)
                    return this.onError("write error", err.stack);
                this.send(packets);
            });
        };
        if (packet.options && typeof packet.options.wsPreEncoded === "string") {
            send(packet.options.wsPreEncoded);
        }
        else {
            this.parser.encodePacket(packet, this.supportsBinary, send);
        }
    }
    /**
     * Closes the transport.
     *
     * @api private
     */
    doClose(fn) {
        debug("closing");
        this.socket.close();
        fn && fn();
    }
}
exports.WebSocket = WebSocket;


/***/ }),

/***/ "./src/server/node_modules/engine.io/build/userver.js":
/*!************************************************************!*\
  !*** ./src/server/node_modules/engine.io/build/userver.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uServer = void 0;
const debug_1 = __webpack_require__(/*! debug */ "debug");
const server_1 = __webpack_require__(/*! ./server */ "./src/server/node_modules/engine.io/build/server.js");
const transports_uws_1 = __webpack_require__(/*! ./transports-uws */ "./src/server/node_modules/engine.io/build/transports-uws/index.js");
const debug = (0, debug_1.default)("engine:uws");
class uServer extends server_1.BaseServer {
    init() { }
    cleanup() { }
    /**
     * Prepares a request by processing the query string.
     *
     * @api private
     */
    prepare(req, res) {
        req.method = req.getMethod().toUpperCase();
        const params = new URLSearchParams(req.getQuery());
        req._query = Object.fromEntries(params.entries());
        req.headers = {};
        req.forEach((key, value) => {
            req.headers[key] = value;
        });
        req.connection = {
            remoteAddress: Buffer.from(res.getRemoteAddressAsText()).toString()
        };
    }
    createTransport(transportName, req) {
        return new transports_uws_1.default[transportName](req);
    }
    /**
     * Attach the engine to a µWebSockets.js server
     * @param app
     * @param options
     */
    attach(app /* : TemplatedApp */, options = {}) {
        const path = (options.path || "/engine.io").replace(/\/$/, "") + "/";
        app
            .any(path, this.handleRequest.bind(this))
            //
            .ws(path, {
            maxPayloadLength: this.opts.maxHttpBufferSize,
            upgrade: this.handleUpgrade.bind(this),
            open: ws => {
                ws.transport.socket = ws;
                ws.transport.writable = true;
                ws.transport.emit("drain");
            },
            message: (ws, message, isBinary) => {
                ws.transport.onData(isBinary ? message : Buffer.from(message).toString());
            },
            close: (ws, code, message) => {
                ws.transport.onClose(code, message);
            }
        });
    }
    handleRequest(res, req) {
        debug('handling "%s" http request "%s"', req.getMethod(), req.getUrl());
        this.prepare(req, res);
        req.res = res;
        const callback = (errorCode, errorContext) => {
            if (errorCode !== undefined) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: server_1.Server.errorMessages[errorCode],
                    context: errorContext
                });
                this.abortRequest(req.res, errorCode, errorContext);
                return;
            }
            if (req._query.sid) {
                debug("setting new request for existing client");
                this.clients[req._query.sid].transport.onRequest(req);
            }
            else {
                const closeConnection = (errorCode, errorContext) => this.abortRequest(res, errorCode, errorContext);
                this.handshake(req._query.transport, req, closeConnection);
            }
        };
        if (this.corsMiddleware) {
            // needed to buffer headers until the status is computed
            req.res = new ResponseWrapper(res);
            this.corsMiddleware.call(null, req, req.res, () => {
                this.verify(req, false, callback);
            });
        }
        else {
            this.verify(req, false, callback);
        }
    }
    handleUpgrade(res, req, context) {
        debug("on upgrade");
        this.prepare(req, res);
        // @ts-ignore
        req.res = res;
        this.verify(req, true, async (errorCode, errorContext) => {
            if (errorCode) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: server_1.Server.errorMessages[errorCode],
                    context: errorContext
                });
                this.abortRequest(res, errorCode, errorContext);
                return;
            }
            const id = req._query.sid;
            let transport;
            if (id) {
                const client = this.clients[id];
                if (!client) {
                    debug("upgrade attempt for closed client");
                    res.close();
                }
                else if (client.upgrading) {
                    debug("transport has already been trying to upgrade");
                    res.close();
                }
                else if (client.upgraded) {
                    debug("transport had already been upgraded");
                    res.close();
                }
                else {
                    debug("upgrading existing transport");
                    transport = this.createTransport(req._query.transport, req);
                    client.maybeUpgrade(transport);
                }
            }
            else {
                transport = await this.handshake(req._query.transport, req, (errorCode, errorContext) => this.abortRequest(res, errorCode, errorContext));
                if (!transport) {
                    return;
                }
            }
            res.upgrade({
                transport
            }, req.getHeader("sec-websocket-key"), req.getHeader("sec-websocket-protocol"), req.getHeader("sec-websocket-extensions"), context);
        });
    }
    abortRequest(res, errorCode, errorContext) {
        const statusCode = errorCode === server_1.Server.errors.FORBIDDEN
            ? "403 Forbidden"
            : "400 Bad Request";
        const message = errorContext && errorContext.message
            ? errorContext.message
            : server_1.Server.errorMessages[errorCode];
        res.writeStatus(statusCode);
        res.writeHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
            code: errorCode,
            message
        }));
    }
}
exports.uServer = uServer;
class ResponseWrapper {
    constructor(res) {
        this.res = res;
        this.statusWritten = false;
        this.headers = [];
    }
    set statusCode(status) {
        this.writeStatus(status === 200 ? "200 OK" : "204 No Content");
    }
    setHeader(key, value) {
        this.writeHeader(key, value);
    }
    // needed by vary: https://github.com/jshttp/vary/blob/5d725d059b3871025cf753e9dfa08924d0bcfa8f/index.js#L134
    getHeader() { }
    writeStatus(status) {
        this.res.writeStatus(status);
        this.statusWritten = true;
        this.writeBufferedHeaders();
    }
    writeHeader(key, value) {
        if (key === "Content-Length") {
            // the content length is automatically added by uWebSockets.js
            return;
        }
        if (this.statusWritten) {
            this.res.writeHeader(key, value);
        }
        else {
            this.headers.push([key, value]);
        }
    }
    writeBufferedHeaders() {
        this.headers.forEach(([key, value]) => {
            this.res.writeHeader(key, value);
        });
    }
    end(data) {
        if (!this.statusWritten) {
            // status will be inferred as "200 OK"
            this.writeBufferedHeaders();
        }
        this.res.end(data);
    }
    onAborted(fn) {
        this.res.onAborted(fn);
    }
}


/***/ }),

/***/ "./src/server/node_modules/socket.io/dist/broadcast-operator.js":
/*!**********************************************************************!*\
  !*** ./src/server/node_modules/socket.io/dist/broadcast-operator.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RemoteSocket = exports.BroadcastOperator = void 0;
const socket_1 = __webpack_require__(/*! ./socket */ "./src/server/node_modules/socket.io/dist/socket.js");
const socket_io_parser_1 = __webpack_require__(/*! socket.io-parser */ "./src/server/node_modules/socket.io-parser/dist/index.js");
class BroadcastOperator {
    constructor(adapter, rooms = new Set(), exceptRooms = new Set(), flags = {}) {
        this.adapter = adapter;
        this.rooms = rooms;
        this.exceptRooms = exceptRooms;
        this.flags = flags;
    }
    /**
     * Targets a room when emitting.
     *
     * @param room
     * @return a new BroadcastOperator instance
     * @public
     */
    to(room) {
        const rooms = new Set(this.rooms);
        if (Array.isArray(room)) {
            room.forEach((r) => rooms.add(r));
        }
        else {
            rooms.add(room);
        }
        return new BroadcastOperator(this.adapter, rooms, this.exceptRooms, this.flags);
    }
    /**
     * Targets a room when emitting.
     *
     * @param room
     * @return a new BroadcastOperator instance
     * @public
     */
    in(room) {
        return this.to(room);
    }
    /**
     * Excludes a room when emitting.
     *
     * @param room
     * @return a new BroadcastOperator instance
     * @public
     */
    except(room) {
        const exceptRooms = new Set(this.exceptRooms);
        if (Array.isArray(room)) {
            room.forEach((r) => exceptRooms.add(r));
        }
        else {
            exceptRooms.add(room);
        }
        return new BroadcastOperator(this.adapter, this.rooms, exceptRooms, this.flags);
    }
    /**
     * Sets the compress flag.
     *
     * @param compress - if `true`, compresses the sending data
     * @return a new BroadcastOperator instance
     * @public
     */
    compress(compress) {
        const flags = Object.assign({}, this.flags, { compress });
        return new BroadcastOperator(this.adapter, this.rooms, this.exceptRooms, flags);
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
     * and is in the middle of a request-response cycle).
     *
     * @return a new BroadcastOperator instance
     * @public
     */
    get volatile() {
        const flags = Object.assign({}, this.flags, { volatile: true });
        return new BroadcastOperator(this.adapter, this.rooms, this.exceptRooms, flags);
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
     *
     * @return a new BroadcastOperator instance
     * @public
     */
    get local() {
        const flags = Object.assign({}, this.flags, { local: true });
        return new BroadcastOperator(this.adapter, this.rooms, this.exceptRooms, flags);
    }
    /**
     * Emits to all clients.
     *
     * @return Always true
     * @public
     */
    emit(ev, ...args) {
        if (socket_1.RESERVED_EVENTS.has(ev)) {
            throw new Error(`"${ev}" is a reserved event name`);
        }
        // set up packet object
        const data = [ev, ...args];
        const packet = {
            type: socket_io_parser_1.PacketType.EVENT,
            data: data,
        };
        if ("function" == typeof data[data.length - 1]) {
            throw new Error("Callbacks are not supported when broadcasting");
        }
        this.adapter.broadcast(packet, {
            rooms: this.rooms,
            except: this.exceptRooms,
            flags: this.flags,
        });
        return true;
    }
    /**
     * Gets a list of clients.
     *
     * @public
     */
    allSockets() {
        if (!this.adapter) {
            throw new Error("No adapter for this namespace, are you trying to get the list of clients of a dynamic namespace?");
        }
        return this.adapter.sockets(this.rooms);
    }
    /**
     * Returns the matching socket instances
     *
     * @public
     */
    fetchSockets() {
        return this.adapter
            .fetchSockets({
            rooms: this.rooms,
            except: this.exceptRooms,
        })
            .then((sockets) => {
            return sockets.map((socket) => {
                if (socket instanceof socket_1.Socket) {
                    // FIXME the TypeScript compiler complains about missing private properties
                    return socket;
                }
                else {
                    return new RemoteSocket(this.adapter, socket);
                }
            });
        });
    }
    /**
     * Makes the matching socket instances join the specified rooms
     *
     * @param room
     * @public
     */
    socketsJoin(room) {
        this.adapter.addSockets({
            rooms: this.rooms,
            except: this.exceptRooms,
        }, Array.isArray(room) ? room : [room]);
    }
    /**
     * Makes the matching socket instances leave the specified rooms
     *
     * @param room
     * @public
     */
    socketsLeave(room) {
        this.adapter.delSockets({
            rooms: this.rooms,
            except: this.exceptRooms,
        }, Array.isArray(room) ? room : [room]);
    }
    /**
     * Makes the matching socket instances disconnect
     *
     * @param close - whether to close the underlying connection
     * @public
     */
    disconnectSockets(close = false) {
        this.adapter.disconnectSockets({
            rooms: this.rooms,
            except: this.exceptRooms,
        }, close);
    }
}
exports.BroadcastOperator = BroadcastOperator;
/**
 * Expose of subset of the attributes and methods of the Socket class
 */
class RemoteSocket {
    constructor(adapter, details) {
        this.id = details.id;
        this.handshake = details.handshake;
        this.rooms = new Set(details.rooms);
        this.data = details.data;
        this.operator = new BroadcastOperator(adapter, new Set([this.id]));
    }
    emit(ev, ...args) {
        return this.operator.emit(ev, ...args);
    }
    /**
     * Joins a room.
     *
     * @param {String|Array} room - room or array of rooms
     * @public
     */
    join(room) {
        return this.operator.socketsJoin(room);
    }
    /**
     * Leaves a room.
     *
     * @param {String} room
     * @public
     */
    leave(room) {
        return this.operator.socketsLeave(room);
    }
    /**
     * Disconnects this client.
     *
     * @param {Boolean} close - if `true`, closes the underlying connection
     * @return {Socket} self
     *
     * @public
     */
    disconnect(close = false) {
        this.operator.disconnectSockets(close);
        return this;
    }
}
exports.RemoteSocket = RemoteSocket;


/***/ }),

/***/ "./src/server/node_modules/socket.io/dist/client.js":
/*!**********************************************************!*\
  !*** ./src/server/node_modules/socket.io/dist/client.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Client = void 0;
const socket_io_parser_1 = __webpack_require__(/*! socket.io-parser */ "./src/server/node_modules/socket.io-parser/dist/index.js");
const debugModule = __webpack_require__(/*! debug */ "debug");
const url = __webpack_require__(/*! url */ "url");
const debug = debugModule("socket.io:client");
class Client {
    /**
     * Client constructor.
     *
     * @param server instance
     * @param conn
     * @package
     */
    constructor(server, conn) {
        this.sockets = new Map();
        this.nsps = new Map();
        this.server = server;
        this.conn = conn;
        this.encoder = server.encoder;
        this.decoder = new server._parser.Decoder();
        this.id = conn.id;
        this.setup();
    }
    /**
     * @return the reference to the request that originated the Engine.IO connection
     *
     * @public
     */
    get request() {
        return this.conn.request;
    }
    /**
     * Sets up event listeners.
     *
     * @private
     */
    setup() {
        this.onclose = this.onclose.bind(this);
        this.ondata = this.ondata.bind(this);
        this.onerror = this.onerror.bind(this);
        this.ondecoded = this.ondecoded.bind(this);
        // @ts-ignore
        this.decoder.on("decoded", this.ondecoded);
        this.conn.on("data", this.ondata);
        this.conn.on("error", this.onerror);
        this.conn.on("close", this.onclose);
        this.connectTimeout = setTimeout(() => {
            if (this.nsps.size === 0) {
                debug("no namespace joined yet, close the client");
                this.close();
            }
            else {
                debug("the client has already joined a namespace, nothing to do");
            }
        }, this.server._connectTimeout);
    }
    /**
     * Connects a client to a namespace.
     *
     * @param {String} name - the namespace
     * @param {Object} auth - the auth parameters
     * @private
     */
    connect(name, auth = {}) {
        if (this.server._nsps.has(name)) {
            debug("connecting to namespace %s", name);
            return this.doConnect(name, auth);
        }
        this.server._checkNamespace(name, auth, (dynamicNspName) => {
            if (dynamicNspName) {
                this.doConnect(name, auth);
            }
            else {
                debug("creation of namespace %s was denied", name);
                this._packet({
                    type: socket_io_parser_1.PacketType.CONNECT_ERROR,
                    nsp: name,
                    data: {
                        message: "Invalid namespace",
                    },
                });
            }
        });
    }
    /**
     * Connects a client to a namespace.
     *
     * @param name - the namespace
     * @param {Object} auth - the auth parameters
     *
     * @private
     */
    doConnect(name, auth) {
        const nsp = this.server.of(name);
        const socket = nsp._add(this, auth, () => {
            this.sockets.set(socket.id, socket);
            this.nsps.set(nsp.name, socket);
            if (this.connectTimeout) {
                clearTimeout(this.connectTimeout);
                this.connectTimeout = undefined;
            }
        });
    }
    /**
     * Disconnects from all namespaces and closes transport.
     *
     * @private
     */
    _disconnect() {
        for (const socket of this.sockets.values()) {
            socket.disconnect();
        }
        this.sockets.clear();
        this.close();
    }
    /**
     * Removes a socket. Called by each `Socket`.
     *
     * @private
     */
    _remove(socket) {
        if (this.sockets.has(socket.id)) {
            const nsp = this.sockets.get(socket.id).nsp.name;
            this.sockets.delete(socket.id);
            this.nsps.delete(nsp);
        }
        else {
            debug("ignoring remove for %s", socket.id);
        }
    }
    /**
     * Closes the underlying connection.
     *
     * @private
     */
    close() {
        if ("open" === this.conn.readyState) {
            debug("forcing transport close");
            this.conn.close();
            this.onclose("forced server close");
        }
    }
    /**
     * Writes a packet to the transport.
     *
     * @param {Object} packet object
     * @param {Object} opts
     * @private
     */
    _packet(packet, opts = {}) {
        if (this.conn.readyState !== "open") {
            debug("ignoring packet write %j", packet);
            return;
        }
        const encodedPackets = opts.preEncoded
            ? packet // previous versions of the adapter incorrectly used socket.packet() instead of writeToEngine()
            : this.encoder.encode(packet);
        this.writeToEngine(encodedPackets, opts);
    }
    writeToEngine(encodedPackets, opts) {
        if (opts.volatile && !this.conn.transport.writable) {
            debug("volatile packet is discarded since the transport is not currently writable");
            return;
        }
        const packets = Array.isArray(encodedPackets)
            ? encodedPackets
            : [encodedPackets];
        for (const encodedPacket of packets) {
            this.conn.write(encodedPacket, opts);
        }
    }
    /**
     * Called with incoming transport data.
     *
     * @private
     */
    ondata(data) {
        // try/catch is needed for protocol violations (GH-1880)
        try {
            this.decoder.add(data);
        }
        catch (e) {
            this.onerror(e);
        }
    }
    /**
     * Called when parser fully decodes a packet.
     *
     * @private
     */
    ondecoded(packet) {
        if (socket_io_parser_1.PacketType.CONNECT === packet.type) {
            if (this.conn.protocol === 3) {
                const parsed = url.parse(packet.nsp, true);
                this.connect(parsed.pathname, parsed.query);
            }
            else {
                this.connect(packet.nsp, packet.data);
            }
        }
        else {
            const socket = this.nsps.get(packet.nsp);
            if (socket) {
                process.nextTick(function () {
                    socket._onpacket(packet);
                });
            }
            else {
                debug("no socket for namespace %s", packet.nsp);
            }
        }
    }
    /**
     * Handles an error.
     *
     * @param {Object} err object
     * @private
     */
    onerror(err) {
        for (const socket of this.sockets.values()) {
            socket._onerror(err);
        }
        this.conn.close();
    }
    /**
     * Called upon transport close.
     *
     * @param reason
     * @private
     */
    onclose(reason) {
        debug("client close with reason %s", reason);
        // ignore a potential subsequent `close` event
        this.destroy();
        // `nsps` and `sockets` are cleaned up seamlessly
        for (const socket of this.sockets.values()) {
            socket._onclose(reason);
        }
        this.sockets.clear();
        this.decoder.destroy(); // clean up decoder
    }
    /**
     * Cleans up event listeners.
     * @private
     */
    destroy() {
        this.conn.removeListener("data", this.ondata);
        this.conn.removeListener("error", this.onerror);
        this.conn.removeListener("close", this.onclose);
        // @ts-ignore
        this.decoder.removeListener("decoded", this.ondecoded);
        if (this.connectTimeout) {
            clearTimeout(this.connectTimeout);
            this.connectTimeout = undefined;
        }
    }
}
exports.Client = Client;


/***/ }),

/***/ "./src/server/node_modules/socket.io/dist/index.js":
/*!*********************************************************!*\
  !*** ./src/server/node_modules/socket.io/dist/index.js ***!
  \*********************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Namespace = exports.Socket = exports.Server = void 0;
const http = __webpack_require__(/*! http */ "http");
const fs_1 = __webpack_require__(/*! fs */ "fs");
const zlib_1 = __webpack_require__(/*! zlib */ "zlib");
const accepts = __webpack_require__(/*! accepts */ "accepts");
const stream_1 = __webpack_require__(/*! stream */ "stream");
const path = __webpack_require__(/*! path */ "path");
const engine_io_1 = __webpack_require__(/*! engine.io */ "./src/server/node_modules/engine.io/build/engine.io.js");
const client_1 = __webpack_require__(/*! ./client */ "./src/server/node_modules/socket.io/dist/client.js");
const events_1 = __webpack_require__(/*! events */ "events");
const namespace_1 = __webpack_require__(/*! ./namespace */ "./src/server/node_modules/socket.io/dist/namespace.js");
Object.defineProperty(exports, "Namespace", ({ enumerable: true, get: function () { return namespace_1.Namespace; } }));
const parent_namespace_1 = __webpack_require__(/*! ./parent-namespace */ "./src/server/node_modules/socket.io/dist/parent-namespace.js");
const socket_io_adapter_1 = __webpack_require__(/*! socket.io-adapter */ "./src/server/node_modules/socket.io-adapter/dist/index.js");
const parser = __importStar(__webpack_require__(/*! socket.io-parser */ "./src/server/node_modules/socket.io-parser/dist/index.js"));
const debug_1 = __importDefault(__webpack_require__(/*! debug */ "debug"));
const socket_1 = __webpack_require__(/*! ./socket */ "./src/server/node_modules/socket.io/dist/socket.js");
Object.defineProperty(exports, "Socket", ({ enumerable: true, get: function () { return socket_1.Socket; } }));
const typed_events_1 = __webpack_require__(/*! ./typed-events */ "./src/server/node_modules/socket.io/dist/typed-events.js");
const uws_js_1 = __webpack_require__(/*! ./uws.js */ "./src/server/node_modules/socket.io/dist/uws.js");
const debug = (0, debug_1.default)("socket.io:server");
const clientVersion = (__webpack_require__(/*! ../package.json */ "./src/server/node_modules/socket.io/package.json").version);
const dotMapRegex = /\.map/;
class Server extends typed_events_1.StrictEventEmitter {
    constructor(srv, opts = {}) {
        super();
        /**
         * @private
         */
        this._nsps = new Map();
        this.parentNsps = new Map();
        if ("object" === typeof srv &&
            srv instanceof Object &&
            !srv.listen) {
            opts = srv;
            srv = undefined;
        }
        this.path(opts.path || "/socket.io");
        this.connectTimeout(opts.connectTimeout || 45000);
        this.serveClient(false !== opts.serveClient);
        this._parser = opts.parser || parser;
        this.encoder = new this._parser.Encoder();
        this.adapter(opts.adapter || socket_io_adapter_1.Adapter);
        this.sockets = this.of("/");
        this.opts = opts;
        if (srv || typeof srv == "number")
            this.attach(srv);
    }
    serveClient(v) {
        if (!arguments.length)
            return this._serveClient;
        this._serveClient = v;
        return this;
    }
    /**
     * Executes the middleware for an incoming namespace not already created on the server.
     *
     * @param name - name of incoming namespace
     * @param auth - the auth parameters
     * @param fn - callback
     *
     * @private
     */
    _checkNamespace(name, auth, fn) {
        if (this.parentNsps.size === 0)
            return fn(false);
        const keysIterator = this.parentNsps.keys();
        const run = () => {
            const nextFn = keysIterator.next();
            if (nextFn.done) {
                return fn(false);
            }
            nextFn.value(name, auth, (err, allow) => {
                if (err || !allow) {
                    return run();
                }
                if (this._nsps.has(name)) {
                    // the namespace was created in the meantime
                    debug("dynamic namespace %s already exists", name);
                    return fn(this._nsps.get(name));
                }
                const namespace = this.parentNsps.get(nextFn.value).createChild(name);
                debug("dynamic namespace %s was created", name);
                // @ts-ignore
                this.sockets.emitReserved("new_namespace", namespace);
                fn(namespace);
            });
        };
        run();
    }
    path(v) {
        if (!arguments.length)
            return this._path;
        this._path = v.replace(/\/$/, "");
        const escapedPath = this._path.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        this.clientPathRegex = new RegExp("^" +
            escapedPath +
            "/socket\\.io(\\.msgpack|\\.esm)?(\\.min)?\\.js(\\.map)?(?:\\?|$)");
        return this;
    }
    connectTimeout(v) {
        if (v === undefined)
            return this._connectTimeout;
        this._connectTimeout = v;
        return this;
    }
    adapter(v) {
        if (!arguments.length)
            return this._adapter;
        this._adapter = v;
        for (const nsp of this._nsps.values()) {
            nsp._initAdapter();
        }
        return this;
    }
    /**
     * Attaches socket.io to a server or port.
     *
     * @param srv - server or port
     * @param opts - options passed to engine.io
     * @return self
     * @public
     */
    listen(srv, opts = {}) {
        return this.attach(srv, opts);
    }
    /**
     * Attaches socket.io to a server or port.
     *
     * @param srv - server or port
     * @param opts - options passed to engine.io
     * @return self
     * @public
     */
    attach(srv, opts = {}) {
        if ("function" == typeof srv) {
            const msg = "You are trying to attach socket.io to an express " +
                "request handler function. Please pass a http.Server instance.";
            throw new Error(msg);
        }
        // handle a port as a string
        if (Number(srv) == srv) {
            srv = Number(srv);
        }
        if ("number" == typeof srv) {
            debug("creating http server and binding to %d", srv);
            const port = srv;
            srv = http.createServer((req, res) => {
                res.writeHead(404);
                res.end();
            });
            srv.listen(port);
        }
        // merge the options passed to the Socket.IO server
        Object.assign(opts, this.opts);
        // set engine.io path to `/socket.io`
        opts.path = opts.path || this._path;
        this.initEngine(srv, opts);
        return this;
    }
    attachApp(app /*: TemplatedApp */, opts = {}) {
        // merge the options passed to the Socket.IO server
        Object.assign(opts, this.opts);
        // set engine.io path to `/socket.io`
        opts.path = opts.path || this._path;
        // initialize engine
        debug("creating uWebSockets.js-based engine with opts %j", opts);
        const engine = new engine_io_1.uServer(opts);
        engine.attach(app, opts);
        // bind to engine events
        this.bind(engine);
        if (this._serveClient) {
            // attach static file serving
            app.get(`${this._path}/*`, (res, req) => {
                if (!this.clientPathRegex.test(req.getUrl())) {
                    req.setYield(true);
                    return;
                }
                const filename = req
                    .getUrl()
                    .replace(this._path, "")
                    .replace(/\?.*$/, "")
                    .replace(/^\//, "");
                const isMap = dotMapRegex.test(filename);
                const type = isMap ? "map" : "source";
                // Per the standard, ETags must be quoted:
                // https://tools.ietf.org/html/rfc7232#section-2.3
                const expectedEtag = '"' + clientVersion + '"';
                const weakEtag = "W/" + expectedEtag;
                const etag = req.getHeader("if-none-match");
                if (etag) {
                    if (expectedEtag === etag || weakEtag === etag) {
                        debug("serve client %s 304", type);
                        res.writeStatus("304 Not Modified");
                        res.end();
                        return;
                    }
                }
                debug("serve client %s", type);
                res.writeHeader("cache-control", "public, max-age=0");
                res.writeHeader("content-type", "application/" + (isMap ? "json" : "javascript"));
                res.writeHeader("etag", expectedEtag);
                const filepath = path.join(__dirname, "../client-dist/", filename);
                (0, uws_js_1.serveFile)(res, filepath);
            });
        }
        (0, uws_js_1.patchAdapter)(app);
    }
    /**
     * Initialize engine
     *
     * @param srv - the server to attach to
     * @param opts - options passed to engine.io
     * @private
     */
    initEngine(srv, opts) {
        // initialize engine
        debug("creating engine.io instance with opts %j", opts);
        this.eio = (0, engine_io_1.attach)(srv, opts);
        // attach static file serving
        if (this._serveClient)
            this.attachServe(srv);
        // Export http server
        this.httpServer = srv;
        // bind to engine events
        this.bind(this.eio);
    }
    /**
     * Attaches the static file serving.
     *
     * @param srv http server
     * @private
     */
    attachServe(srv) {
        debug("attaching client serving req handler");
        const evs = srv.listeners("request").slice(0);
        srv.removeAllListeners("request");
        srv.on("request", (req, res) => {
            if (this.clientPathRegex.test(req.url)) {
                this.serve(req, res);
            }
            else {
                for (let i = 0; i < evs.length; i++) {
                    evs[i].call(srv, req, res);
                }
            }
        });
    }
    /**
     * Handles a request serving of client source and map
     *
     * @param req
     * @param res
     * @private
     */
    serve(req, res) {
        const filename = req.url.replace(this._path, "").replace(/\?.*$/, "");
        const isMap = dotMapRegex.test(filename);
        const type = isMap ? "map" : "source";
        // Per the standard, ETags must be quoted:
        // https://tools.ietf.org/html/rfc7232#section-2.3
        const expectedEtag = '"' + clientVersion + '"';
        const weakEtag = "W/" + expectedEtag;
        const etag = req.headers["if-none-match"];
        if (etag) {
            if (expectedEtag === etag || weakEtag === etag) {
                debug("serve client %s 304", type);
                res.writeHead(304);
                res.end();
                return;
            }
        }
        debug("serve client %s", type);
        res.setHeader("Cache-Control", "public, max-age=0");
        res.setHeader("Content-Type", "application/" + (isMap ? "json" : "javascript"));
        res.setHeader("ETag", expectedEtag);
        Server.sendFile(filename, req, res);
    }
    /**
     * @param filename
     * @param req
     * @param res
     * @private
     */
    static sendFile(filename, req, res) {
        const readStream = (0, fs_1.createReadStream)(path.join(__dirname, "../client-dist/", filename));
        const encoding = accepts(req).encodings(["br", "gzip", "deflate"]);
        const onError = (err) => {
            if (err) {
                res.end();
            }
        };
        switch (encoding) {
            case "br":
                res.writeHead(200, { "content-encoding": "br" });
                readStream.pipe((0, zlib_1.createBrotliCompress)()).pipe(res);
                (0, stream_1.pipeline)(readStream, (0, zlib_1.createBrotliCompress)(), res, onError);
                break;
            case "gzip":
                res.writeHead(200, { "content-encoding": "gzip" });
                (0, stream_1.pipeline)(readStream, (0, zlib_1.createGzip)(), res, onError);
                break;
            case "deflate":
                res.writeHead(200, { "content-encoding": "deflate" });
                (0, stream_1.pipeline)(readStream, (0, zlib_1.createDeflate)(), res, onError);
                break;
            default:
                res.writeHead(200);
                (0, stream_1.pipeline)(readStream, res, onError);
        }
    }
    /**
     * Binds socket.io to an engine.io instance.
     *
     * @param {engine.Server} engine engine.io (or compatible) server
     * @return self
     * @public
     */
    bind(engine) {
        this.engine = engine;
        this.engine.on("connection", this.onconnection.bind(this));
        return this;
    }
    /**
     * Called with each incoming transport connection.
     *
     * @param {engine.Socket} conn
     * @return self
     * @private
     */
    onconnection(conn) {
        debug("incoming connection with id %s", conn.id);
        const client = new client_1.Client(this, conn);
        if (conn.protocol === 3) {
            // @ts-ignore
            client.connect("/");
        }
        return this;
    }
    /**
     * Looks up a namespace.
     *
     * @param {String|RegExp|Function} name nsp name
     * @param fn optional, nsp `connection` ev handler
     * @public
     */
    of(name, fn) {
        if (typeof name === "function" || name instanceof RegExp) {
            const parentNsp = new parent_namespace_1.ParentNamespace(this);
            debug("initializing parent namespace %s", parentNsp.name);
            if (typeof name === "function") {
                this.parentNsps.set(name, parentNsp);
            }
            else {
                this.parentNsps.set((nsp, conn, next) => next(null, name.test(nsp)), parentNsp);
            }
            if (fn) {
                // @ts-ignore
                parentNsp.on("connect", fn);
            }
            return parentNsp;
        }
        if (String(name)[0] !== "/")
            name = "/" + name;
        let nsp = this._nsps.get(name);
        if (!nsp) {
            debug("initializing namespace %s", name);
            nsp = new namespace_1.Namespace(this, name);
            this._nsps.set(name, nsp);
            if (name !== "/") {
                // @ts-ignore
                this.sockets.emitReserved("new_namespace", nsp);
            }
        }
        if (fn)
            nsp.on("connect", fn);
        return nsp;
    }
    /**
     * Closes server connection
     *
     * @param [fn] optional, called as `fn([err])` on error OR all conns closed
     * @public
     */
    close(fn) {
        for (const socket of this.sockets.sockets.values()) {
            socket._onclose("server shutting down");
        }
        this.engine.close();
        // restore the Adapter prototype
        (0, uws_js_1.restoreAdapter)();
        if (this.httpServer) {
            this.httpServer.close(fn);
        }
        else {
            fn && fn();
        }
    }
    /**
     * Sets up namespace middleware.
     *
     * @return self
     * @public
     */
    use(fn) {
        this.sockets.use(fn);
        return this;
    }
    /**
     * Targets a room when emitting.
     *
     * @param room
     * @return self
     * @public
     */
    to(room) {
        return this.sockets.to(room);
    }
    /**
     * Targets a room when emitting.
     *
     * @param room
     * @return self
     * @public
     */
    in(room) {
        return this.sockets.in(room);
    }
    /**
     * Excludes a room when emitting.
     *
     * @param name
     * @return self
     * @public
     */
    except(name) {
        return this.sockets.except(name);
    }
    /**
     * Sends a `message` event to all clients.
     *
     * @return self
     * @public
     */
    send(...args) {
        this.sockets.emit("message", ...args);
        return this;
    }
    /**
     * Sends a `message` event to all clients.
     *
     * @return self
     * @public
     */
    write(...args) {
        this.sockets.emit("message", ...args);
        return this;
    }
    /**
     * Emit a packet to other Socket.IO servers
     *
     * @param ev - the event name
     * @param args - an array of arguments, which may include an acknowledgement callback at the end
     * @public
     */
    serverSideEmit(ev, ...args) {
        return this.sockets.serverSideEmit(ev, ...args);
    }
    /**
     * Gets a list of socket ids.
     *
     * @public
     */
    allSockets() {
        return this.sockets.allSockets();
    }
    /**
     * Sets the compress flag.
     *
     * @param compress - if `true`, compresses the sending data
     * @return self
     * @public
     */
    compress(compress) {
        return this.sockets.compress(compress);
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
     * and is in the middle of a request-response cycle).
     *
     * @return self
     * @public
     */
    get volatile() {
        return this.sockets.volatile;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
     *
     * @return self
     * @public
     */
    get local() {
        return this.sockets.local;
    }
    /**
     * Returns the matching socket instances
     *
     * @public
     */
    fetchSockets() {
        return this.sockets.fetchSockets();
    }
    /**
     * Makes the matching socket instances join the specified rooms
     *
     * @param room
     * @public
     */
    socketsJoin(room) {
        return this.sockets.socketsJoin(room);
    }
    /**
     * Makes the matching socket instances leave the specified rooms
     *
     * @param room
     * @public
     */
    socketsLeave(room) {
        return this.sockets.socketsLeave(room);
    }
    /**
     * Makes the matching socket instances disconnect
     *
     * @param close - whether to close the underlying connection
     * @public
     */
    disconnectSockets(close = false) {
        return this.sockets.disconnectSockets(close);
    }
}
exports.Server = Server;
/**
 * Expose main namespace (/).
 */
const emitterMethods = Object.keys(events_1.EventEmitter.prototype).filter(function (key) {
    return typeof events_1.EventEmitter.prototype[key] === "function";
});
emitterMethods.forEach(function (fn) {
    Server.prototype[fn] = function () {
        return this.sockets[fn].apply(this.sockets, arguments);
    };
});
module.exports = (srv, opts) => new Server(srv, opts);
module.exports.Server = Server;
module.exports.Namespace = namespace_1.Namespace;
module.exports.Socket = socket_1.Socket;


/***/ }),

/***/ "./src/server/node_modules/socket.io/dist/namespace.js":
/*!*************************************************************!*\
  !*** ./src/server/node_modules/socket.io/dist/namespace.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Namespace = exports.RESERVED_EVENTS = void 0;
const socket_1 = __webpack_require__(/*! ./socket */ "./src/server/node_modules/socket.io/dist/socket.js");
const typed_events_1 = __webpack_require__(/*! ./typed-events */ "./src/server/node_modules/socket.io/dist/typed-events.js");
const debug_1 = __importDefault(__webpack_require__(/*! debug */ "debug"));
const broadcast_operator_1 = __webpack_require__(/*! ./broadcast-operator */ "./src/server/node_modules/socket.io/dist/broadcast-operator.js");
const debug = (0, debug_1.default)("socket.io:namespace");
exports.RESERVED_EVENTS = new Set(["connect", "connection", "new_namespace"]);
class Namespace extends typed_events_1.StrictEventEmitter {
    /**
     * Namespace constructor.
     *
     * @param server instance
     * @param name
     */
    constructor(server, name) {
        super();
        this.sockets = new Map();
        /** @private */
        this._fns = [];
        /** @private */
        this._ids = 0;
        this.server = server;
        this.name = name;
        this._initAdapter();
    }
    /**
     * Initializes the `Adapter` for this nsp.
     * Run upon changing adapter by `Server#adapter`
     * in addition to the constructor.
     *
     * @private
     */
    _initAdapter() {
        // @ts-ignore
        this.adapter = new (this.server.adapter())(this);
    }
    /**
     * Sets up namespace middleware.
     *
     * @return self
     * @public
     */
    use(fn) {
        this._fns.push(fn);
        return this;
    }
    /**
     * Executes the middleware for an incoming client.
     *
     * @param socket - the socket that will get added
     * @param fn - last fn call in the middleware
     * @private
     */
    run(socket, fn) {
        const fns = this._fns.slice(0);
        if (!fns.length)
            return fn(null);
        function run(i) {
            fns[i](socket, function (err) {
                // upon error, short-circuit
                if (err)
                    return fn(err);
                // if no middleware left, summon callback
                if (!fns[i + 1])
                    return fn(null);
                // go on to next
                run(i + 1);
            });
        }
        run(0);
    }
    /**
     * Targets a room when emitting.
     *
     * @param room
     * @return self
     * @public
     */
    to(room) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).to(room);
    }
    /**
     * Targets a room when emitting.
     *
     * @param room
     * @return self
     * @public
     */
    in(room) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).in(room);
    }
    /**
     * Excludes a room when emitting.
     *
     * @param room
     * @return self
     * @public
     */
    except(room) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).except(room);
    }
    /**
     * Adds a new client.
     *
     * @return {Socket}
     * @private
     */
    _add(client, query, fn) {
        debug("adding socket to nsp %s", this.name);
        const socket = new socket_1.Socket(this, client, query);
        this.run(socket, (err) => {
            process.nextTick(() => {
                if ("open" == client.conn.readyState) {
                    if (err) {
                        if (client.conn.protocol === 3) {
                            return socket._error(err.data || err.message);
                        }
                        else {
                            return socket._error({
                                message: err.message,
                                data: err.data,
                            });
                        }
                    }
                    // track socket
                    this.sockets.set(socket.id, socket);
                    // it's paramount that the internal `onconnect` logic
                    // fires before user-set events to prevent state order
                    // violations (such as a disconnection before the connection
                    // logic is complete)
                    socket._onconnect();
                    if (fn)
                        fn();
                    // fire user-set events
                    this.emitReserved("connect", socket);
                    this.emitReserved("connection", socket);
                }
                else {
                    debug("next called after client was closed - ignoring socket");
                }
            });
        });
        return socket;
    }
    /**
     * Removes a client. Called by each `Socket`.
     *
     * @private
     */
    _remove(socket) {
        if (this.sockets.has(socket.id)) {
            this.sockets.delete(socket.id);
        }
        else {
            debug("ignoring remove for %s", socket.id);
        }
    }
    /**
     * Emits to all clients.
     *
     * @return Always true
     * @public
     */
    emit(ev, ...args) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).emit(ev, ...args);
    }
    /**
     * Sends a `message` event to all clients.
     *
     * @return self
     * @public
     */
    send(...args) {
        this.emit("message", ...args);
        return this;
    }
    /**
     * Sends a `message` event to all clients.
     *
     * @return self
     * @public
     */
    write(...args) {
        this.emit("message", ...args);
        return this;
    }
    /**
     * Emit a packet to other Socket.IO servers
     *
     * @param ev - the event name
     * @param args - an array of arguments, which may include an acknowledgement callback at the end
     * @public
     */
    serverSideEmit(ev, ...args) {
        if (exports.RESERVED_EVENTS.has(ev)) {
            throw new Error(`"${ev}" is a reserved event name`);
        }
        args.unshift(ev);
        this.adapter.serverSideEmit(args);
        return true;
    }
    /**
     * Called when a packet is received from another Socket.IO server
     *
     * @param args - an array of arguments, which may include an acknowledgement callback at the end
     *
     * @private
     */
    _onServerSideEmit(args) {
        super.emitUntyped.apply(this, args);
    }
    /**
     * Gets a list of clients.
     *
     * @return self
     * @public
     */
    allSockets() {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).allSockets();
    }
    /**
     * Sets the compress flag.
     *
     * @param compress - if `true`, compresses the sending data
     * @return self
     * @public
     */
    compress(compress) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).compress(compress);
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
     * and is in the middle of a request-response cycle).
     *
     * @return self
     * @public
     */
    get volatile() {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).volatile;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
     *
     * @return self
     * @public
     */
    get local() {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).local;
    }
    /**
     * Returns the matching socket instances
     *
     * @public
     */
    fetchSockets() {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).fetchSockets();
    }
    /**
     * Makes the matching socket instances join the specified rooms
     *
     * @param room
     * @public
     */
    socketsJoin(room) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).socketsJoin(room);
    }
    /**
     * Makes the matching socket instances leave the specified rooms
     *
     * @param room
     * @public
     */
    socketsLeave(room) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).socketsLeave(room);
    }
    /**
     * Makes the matching socket instances disconnect
     *
     * @param close - whether to close the underlying connection
     * @public
     */
    disconnectSockets(close = false) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).disconnectSockets(close);
    }
}
exports.Namespace = Namespace;


/***/ }),

/***/ "./src/server/node_modules/socket.io/dist/parent-namespace.js":
/*!********************************************************************!*\
  !*** ./src/server/node_modules/socket.io/dist/parent-namespace.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ParentNamespace = void 0;
const namespace_1 = __webpack_require__(/*! ./namespace */ "./src/server/node_modules/socket.io/dist/namespace.js");
class ParentNamespace extends namespace_1.Namespace {
    constructor(server) {
        super(server, "/_" + ParentNamespace.count++);
        this.children = new Set();
    }
    /**
     * @private
     */
    _initAdapter() {
        const broadcast = (packet, opts) => {
            this.children.forEach((nsp) => {
                nsp.adapter.broadcast(packet, opts);
            });
        };
        // @ts-ignore FIXME is there a way to declare an inner class in TypeScript?
        this.adapter = { broadcast };
    }
    emit(ev, ...args) {
        this.children.forEach((nsp) => {
            nsp.emit(ev, ...args);
        });
        return true;
    }
    createChild(name) {
        const namespace = new namespace_1.Namespace(this.server, name);
        namespace._fns = this._fns.slice(0);
        this.listeners("connect").forEach((listener) => namespace.on("connect", listener));
        this.listeners("connection").forEach((listener) => namespace.on("connection", listener));
        this.children.add(namespace);
        this.server._nsps.set(name, namespace);
        return namespace;
    }
}
exports.ParentNamespace = ParentNamespace;
ParentNamespace.count = 0;


/***/ }),

/***/ "./src/server/node_modules/socket.io/dist/socket.js":
/*!**********************************************************!*\
  !*** ./src/server/node_modules/socket.io/dist/socket.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Socket = exports.RESERVED_EVENTS = void 0;
const socket_io_parser_1 = __webpack_require__(/*! socket.io-parser */ "./src/server/node_modules/socket.io-parser/dist/index.js");
const debug_1 = __importDefault(__webpack_require__(/*! debug */ "debug"));
const typed_events_1 = __webpack_require__(/*! ./typed-events */ "./src/server/node_modules/socket.io/dist/typed-events.js");
const base64id_1 = __importDefault(__webpack_require__(/*! base64id */ "./src/server/node_modules/base64id/lib/base64id.js"));
const broadcast_operator_1 = __webpack_require__(/*! ./broadcast-operator */ "./src/server/node_modules/socket.io/dist/broadcast-operator.js");
const debug = (0, debug_1.default)("socket.io:socket");
exports.RESERVED_EVENTS = new Set([
    "connect",
    "connect_error",
    "disconnect",
    "disconnecting",
    "newListener",
    "removeListener",
]);
class Socket extends typed_events_1.StrictEventEmitter {
    /**
     * Interface to a `Client` for a given `Namespace`.
     *
     * @param {Namespace} nsp
     * @param {Client} client
     * @param {Object} auth
     * @package
     */
    constructor(nsp, client, auth) {
        super();
        this.nsp = nsp;
        this.client = client;
        /**
         * Additional information that can be attached to the Socket instance and which will be used in the fetchSockets method
         */
        this.data = {};
        this.connected = false;
        this.acks = new Map();
        this.fns = [];
        this.flags = {};
        this.server = nsp.server;
        this.adapter = this.nsp.adapter;
        if (client.conn.protocol === 3) {
            // @ts-ignore
            this.id = nsp.name !== "/" ? nsp.name + "#" + client.id : client.id;
        }
        else {
            this.id = base64id_1.default.generateId(); // don't reuse the Engine.IO id because it's sensitive information
        }
        this.handshake = this.buildHandshake(auth);
    }
    /**
     * Builds the `handshake` BC object
     *
     * @private
     */
    buildHandshake(auth) {
        return {
            headers: this.request.headers,
            time: new Date() + "",
            address: this.conn.remoteAddress,
            xdomain: !!this.request.headers.origin,
            // @ts-ignore
            secure: !!this.request.connection.encrypted,
            issued: +new Date(),
            url: this.request.url,
            // @ts-ignore
            query: this.request._query,
            auth,
        };
    }
    /**
     * Emits to this client.
     *
     * @return Always returns `true`.
     * @public
     */
    emit(ev, ...args) {
        if (exports.RESERVED_EVENTS.has(ev)) {
            throw new Error(`"${ev}" is a reserved event name`);
        }
        const data = [ev, ...args];
        const packet = {
            type: socket_io_parser_1.PacketType.EVENT,
            data: data,
        };
        // access last argument to see if it's an ACK callback
        if (typeof data[data.length - 1] === "function") {
            const id = this.nsp._ids++;
            debug("emitting packet with ack id %d", id);
            this.registerAckCallback(id, data.pop());
            packet.id = id;
        }
        const flags = Object.assign({}, this.flags);
        this.flags = {};
        this.packet(packet, flags);
        return true;
    }
    /**
     * @private
     */
    registerAckCallback(id, ack) {
        const timeout = this.flags.timeout;
        if (timeout === undefined) {
            this.acks.set(id, ack);
            return;
        }
        const timer = setTimeout(() => {
            debug("event with ack id %d has timed out after %d ms", id, timeout);
            this.acks.delete(id);
            ack.call(this, new Error("operation has timed out"));
        }, timeout);
        this.acks.set(id, (...args) => {
            clearTimeout(timer);
            ack.apply(this, [null, ...args]);
        });
    }
    /**
     * Targets a room when broadcasting.
     *
     * @param room
     * @return self
     * @public
     */
    to(room) {
        return this.newBroadcastOperator().to(room);
    }
    /**
     * Targets a room when broadcasting.
     *
     * @param room
     * @return self
     * @public
     */
    in(room) {
        return this.newBroadcastOperator().in(room);
    }
    /**
     * Excludes a room when broadcasting.
     *
     * @param room
     * @return self
     * @public
     */
    except(room) {
        return this.newBroadcastOperator().except(room);
    }
    /**
     * Sends a `message` event.
     *
     * @return self
     * @public
     */
    send(...args) {
        this.emit("message", ...args);
        return this;
    }
    /**
     * Sends a `message` event.
     *
     * @return self
     * @public
     */
    write(...args) {
        this.emit("message", ...args);
        return this;
    }
    /**
     * Writes a packet.
     *
     * @param {Object} packet - packet object
     * @param {Object} opts - options
     * @private
     */
    packet(packet, opts = {}) {
        packet.nsp = this.nsp.name;
        opts.compress = false !== opts.compress;
        this.client._packet(packet, opts);
    }
    /**
     * Joins a room.
     *
     * @param {String|Array} rooms - room or array of rooms
     * @return a Promise or nothing, depending on the adapter
     * @public
     */
    join(rooms) {
        debug("join room %s", rooms);
        return this.adapter.addAll(this.id, new Set(Array.isArray(rooms) ? rooms : [rooms]));
    }
    /**
     * Leaves a room.
     *
     * @param {String} room
     * @return a Promise or nothing, depending on the adapter
     * @public
     */
    leave(room) {
        debug("leave room %s", room);
        return this.adapter.del(this.id, room);
    }
    /**
     * Leave all rooms.
     *
     * @private
     */
    leaveAll() {
        this.adapter.delAll(this.id);
    }
    /**
     * Called by `Namespace` upon successful
     * middleware execution (ie: authorization).
     * Socket is added to namespace array before
     * call to join, so adapters can access it.
     *
     * @private
     */
    _onconnect() {
        debug("socket connected - writing packet");
        this.connected = true;
        this.join(this.id);
        if (this.conn.protocol === 3) {
            this.packet({ type: socket_io_parser_1.PacketType.CONNECT });
        }
        else {
            this.packet({ type: socket_io_parser_1.PacketType.CONNECT, data: { sid: this.id } });
        }
    }
    /**
     * Called with each packet. Called by `Client`.
     *
     * @param {Object} packet
     * @private
     */
    _onpacket(packet) {
        debug("got packet %j", packet);
        switch (packet.type) {
            case socket_io_parser_1.PacketType.EVENT:
                this.onevent(packet);
                break;
            case socket_io_parser_1.PacketType.BINARY_EVENT:
                this.onevent(packet);
                break;
            case socket_io_parser_1.PacketType.ACK:
                this.onack(packet);
                break;
            case socket_io_parser_1.PacketType.BINARY_ACK:
                this.onack(packet);
                break;
            case socket_io_parser_1.PacketType.DISCONNECT:
                this.ondisconnect();
                break;
            case socket_io_parser_1.PacketType.CONNECT_ERROR:
                this._onerror(new Error(packet.data));
        }
    }
    /**
     * Called upon event packet.
     *
     * @param {Packet} packet - packet object
     * @private
     */
    onevent(packet) {
        const args = packet.data || [];
        debug("emitting event %j", args);
        if (null != packet.id) {
            debug("attaching ack callback to event");
            args.push(this.ack(packet.id));
        }
        if (this._anyListeners && this._anyListeners.length) {
            const listeners = this._anyListeners.slice();
            for (const listener of listeners) {
                listener.apply(this, args);
            }
        }
        this.dispatch(args);
    }
    /**
     * Produces an ack callback to emit with an event.
     *
     * @param {Number} id - packet id
     * @private
     */
    ack(id) {
        const self = this;
        let sent = false;
        return function () {
            // prevent double callbacks
            if (sent)
                return;
            const args = Array.prototype.slice.call(arguments);
            debug("sending ack %j", args);
            self.packet({
                id: id,
                type: socket_io_parser_1.PacketType.ACK,
                data: args,
            });
            sent = true;
        };
    }
    /**
     * Called upon ack packet.
     *
     * @private
     */
    onack(packet) {
        const ack = this.acks.get(packet.id);
        if ("function" == typeof ack) {
            debug("calling ack %s with %j", packet.id, packet.data);
            ack.apply(this, packet.data);
            this.acks.delete(packet.id);
        }
        else {
            debug("bad ack %s", packet.id);
        }
    }
    /**
     * Called upon client disconnect packet.
     *
     * @private
     */
    ondisconnect() {
        debug("got disconnect packet");
        this._onclose("client namespace disconnect");
    }
    /**
     * Handles a client error.
     *
     * @private
     */
    _onerror(err) {
        if (this.listeners("error").length) {
            this.emitReserved("error", err);
        }
        else {
            console.error("Missing error handler on `socket`.");
            console.error(err.stack);
        }
    }
    /**
     * Called upon closing. Called by `Client`.
     *
     * @param {String} reason
     * @throw {Error} optional error object
     *
     * @private
     */
    _onclose(reason) {
        if (!this.connected)
            return this;
        debug("closing socket - reason %s", reason);
        this.emitReserved("disconnecting", reason);
        this.leaveAll();
        this.nsp._remove(this);
        this.client._remove(this);
        this.connected = false;
        this.emitReserved("disconnect", reason);
        return;
    }
    /**
     * Produces an `error` packet.
     *
     * @param {Object} err - error object
     *
     * @private
     */
    _error(err) {
        this.packet({ type: socket_io_parser_1.PacketType.CONNECT_ERROR, data: err });
    }
    /**
     * Disconnects this client.
     *
     * @param {Boolean} close - if `true`, closes the underlying connection
     * @return {Socket} self
     *
     * @public
     */
    disconnect(close = false) {
        if (!this.connected)
            return this;
        if (close) {
            this.client._disconnect();
        }
        else {
            this.packet({ type: socket_io_parser_1.PacketType.DISCONNECT });
            this._onclose("server namespace disconnect");
        }
        return this;
    }
    /**
     * Sets the compress flag.
     *
     * @param {Boolean} compress - if `true`, compresses the sending data
     * @return {Socket} self
     * @public
     */
    compress(compress) {
        this.flags.compress = compress;
        return this;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
     * and is in the middle of a request-response cycle).
     *
     * @return {Socket} self
     * @public
     */
    get volatile() {
        this.flags.volatile = true;
        return this;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to every sockets but the
     * sender.
     *
     * @return {Socket} self
     * @public
     */
    get broadcast() {
        return this.newBroadcastOperator();
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
     *
     * @return {Socket} self
     * @public
     */
    get local() {
        return this.newBroadcastOperator().local;
    }
    /**
     * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
     * given number of milliseconds have elapsed without an acknowledgement from the client:
     *
     * ```
     * socket.timeout(5000).emit("my-event", (err) => {
     *   if (err) {
     *     // the client did not acknowledge the event in the given delay
     *   }
     * });
     * ```
     *
     * @returns self
     * @public
     */
    timeout(timeout) {
        this.flags.timeout = timeout;
        return this;
    }
    /**
     * Dispatch incoming event to socket listeners.
     *
     * @param {Array} event - event that will get emitted
     * @private
     */
    dispatch(event) {
        debug("dispatching an event %j", event);
        this.run(event, (err) => {
            process.nextTick(() => {
                if (err) {
                    return this._onerror(err);
                }
                if (this.connected) {
                    super.emitUntyped.apply(this, event);
                }
                else {
                    debug("ignore packet received after disconnection");
                }
            });
        });
    }
    /**
     * Sets up socket middleware.
     *
     * @param {Function} fn - middleware function (event, next)
     * @return {Socket} self
     * @public
     */
    use(fn) {
        this.fns.push(fn);
        return this;
    }
    /**
     * Executes the middleware for an incoming event.
     *
     * @param {Array} event - event that will get emitted
     * @param {Function} fn - last fn call in the middleware
     * @private
     */
    run(event, fn) {
        const fns = this.fns.slice(0);
        if (!fns.length)
            return fn(null);
        function run(i) {
            fns[i](event, function (err) {
                // upon error, short-circuit
                if (err)
                    return fn(err);
                // if no middleware left, summon callback
                if (!fns[i + 1])
                    return fn(null);
                // go on to next
                run(i + 1);
            });
        }
        run(0);
    }
    /**
     * Whether the socket is currently disconnected
     */
    get disconnected() {
        return !this.connected;
    }
    /**
     * A reference to the request that originated the underlying Engine.IO Socket.
     *
     * @public
     */
    get request() {
        return this.client.request;
    }
    /**
     * A reference to the underlying Client transport connection (Engine.IO Socket object).
     *
     * @public
     */
    get conn() {
        return this.client.conn;
    }
    /**
     * @public
     */
    get rooms() {
        return this.adapter.socketRooms(this.id) || new Set();
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback.
     *
     * @param listener
     * @public
     */
    onAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.push(listener);
        return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback. The listener is added to the beginning of the listeners array.
     *
     * @param listener
     * @public
     */
    prependAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.unshift(listener);
        return this;
    }
    /**
     * Removes the listener that will be fired when any event is emitted.
     *
     * @param listener
     * @public
     */
    offAny(listener) {
        if (!this._anyListeners) {
            return this;
        }
        if (listener) {
            const listeners = this._anyListeners;
            for (let i = 0; i < listeners.length; i++) {
                if (listener === listeners[i]) {
                    listeners.splice(i, 1);
                    return this;
                }
            }
        }
        else {
            this._anyListeners = [];
        }
        return this;
    }
    /**
     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
     * e.g. to remove listeners.
     *
     * @public
     */
    listenersAny() {
        return this._anyListeners || [];
    }
    newBroadcastOperator() {
        const flags = Object.assign({}, this.flags);
        this.flags = {};
        return new broadcast_operator_1.BroadcastOperator(this.adapter, new Set(), new Set([this.id]), flags);
    }
}
exports.Socket = Socket;


/***/ }),

/***/ "./src/server/node_modules/socket.io/dist/typed-events.js":
/*!****************************************************************!*\
  !*** ./src/server/node_modules/socket.io/dist/typed-events.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StrictEventEmitter = void 0;
const events_1 = __webpack_require__(/*! events */ "events");
/**
 * Strictly typed version of an `EventEmitter`. A `TypedEventEmitter` takes type
 * parameters for mappings of event names to event data types, and strictly
 * types method calls to the `EventEmitter` according to these event maps.
 *
 * @typeParam ListenEvents - `EventsMap` of user-defined events that can be
 * listened to with `on` or `once`
 * @typeParam EmitEvents - `EventsMap` of user-defined events that can be
 * emitted with `emit`
 * @typeParam ReservedEvents - `EventsMap` of reserved events, that can be
 * emitted by socket.io with `emitReserved`, and can be listened to with
 * `listen`.
 */
class StrictEventEmitter extends events_1.EventEmitter {
    /**
     * Adds the `listener` function as an event listener for `ev`.
     *
     * @param ev Name of the event
     * @param listener Callback function
     */
    on(ev, listener) {
        return super.on(ev, listener);
    }
    /**
     * Adds a one-time `listener` function as an event listener for `ev`.
     *
     * @param ev Name of the event
     * @param listener Callback function
     */
    once(ev, listener) {
        return super.once(ev, listener);
    }
    /**
     * Emits an event.
     *
     * @param ev Name of the event
     * @param args Values to send to listeners of this event
     */
    emit(ev, ...args) {
        return super.emit(ev, ...args);
    }
    /**
     * Emits a reserved event.
     *
     * This method is `protected`, so that only a class extending
     * `StrictEventEmitter` can emit its own reserved events.
     *
     * @param ev Reserved event name
     * @param args Arguments to emit along with the event
     */
    emitReserved(ev, ...args) {
        return super.emit(ev, ...args);
    }
    /**
     * Emits an event.
     *
     * This method is `protected`, so that only a class extending
     * `StrictEventEmitter` can get around the strict typing. This is useful for
     * calling `emit.apply`, which can be called as `emitUntyped.apply`.
     *
     * @param ev Event name
     * @param args Arguments to emit along with the event
     */
    emitUntyped(ev, ...args) {
        return super.emit(ev, ...args);
    }
    /**
     * Returns the listeners listening to an event.
     *
     * @param event Event name
     * @returns Array of listeners subscribed to `event`
     */
    listeners(event) {
        return super.listeners(event);
    }
}
exports.StrictEventEmitter = StrictEventEmitter;


/***/ }),

/***/ "./src/server/node_modules/socket.io/dist/uws.js":
/*!*******************************************************!*\
  !*** ./src/server/node_modules/socket.io/dist/uws.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.serveFile = exports.restoreAdapter = exports.patchAdapter = void 0;
const socket_io_adapter_1 = __webpack_require__(/*! socket.io-adapter */ "./src/server/node_modules/socket.io-adapter/dist/index.js");
const fs_1 = __webpack_require__(/*! fs */ "fs");
const debug_1 = __importDefault(__webpack_require__(/*! debug */ "debug"));
const debug = (0, debug_1.default)("socket.io:adapter-uws");
const SEPARATOR = "\x1f"; // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
const { addAll, del, broadcast } = socket_io_adapter_1.Adapter.prototype;
function patchAdapter(app /* : TemplatedApp */) {
    socket_io_adapter_1.Adapter.prototype.addAll = function (id, rooms) {
        const isNew = !this.sids.has(id);
        addAll.call(this, id, rooms);
        const socket = this.nsp.sockets.get(id);
        if (!socket) {
            return;
        }
        if (socket.conn.transport.name === "websocket") {
            subscribe(this.nsp.name, socket, isNew, rooms);
            return;
        }
        if (isNew) {
            socket.conn.on("upgrade", () => {
                const rooms = this.sids.get(id);
                subscribe(this.nsp.name, socket, isNew, rooms);
            });
        }
    };
    socket_io_adapter_1.Adapter.prototype.del = function (id, room) {
        del.call(this, id, room);
        const socket = this.nsp.sockets.get(id);
        if (socket && socket.conn.transport.name === "websocket") {
            // @ts-ignore
            const sessionId = socket.conn.id;
            // @ts-ignore
            const websocket = socket.conn.transport.socket;
            const topic = `${this.nsp.name}${SEPARATOR}${room}`;
            debug("unsubscribe connection %s from topic %s", sessionId, topic);
            websocket.unsubscribe(topic);
        }
    };
    socket_io_adapter_1.Adapter.prototype.broadcast = function (packet, opts) {
        const useFastPublish = opts.rooms.size <= 1 && opts.except.size === 0;
        if (!useFastPublish) {
            broadcast.call(this, packet, opts);
            return;
        }
        const flags = opts.flags || {};
        const basePacketOpts = {
            preEncoded: true,
            volatile: flags.volatile,
            compress: flags.compress,
        };
        packet.nsp = this.nsp.name;
        const encodedPackets = this.encoder.encode(packet);
        const topic = opts.rooms.size === 0
            ? this.nsp.name
            : `${this.nsp.name}${SEPARATOR}${opts.rooms.keys().next().value}`;
        debug("fast publish to %s", topic);
        // fast publish for clients connected with WebSocket
        encodedPackets.forEach((encodedPacket) => {
            const isBinary = typeof encodedPacket !== "string";
            // "4" being the message type in the Engine.IO protocol, see https://github.com/socketio/engine.io-protocol
            app.publish(topic, isBinary ? encodedPacket : "4" + encodedPacket, isBinary);
        });
        this.apply(opts, (socket) => {
            if (socket.conn.transport.name !== "websocket") {
                // classic publish for clients connected with HTTP long-polling
                socket.client.writeToEngine(encodedPackets, basePacketOpts);
            }
        });
    };
}
exports.patchAdapter = patchAdapter;
function subscribe(namespaceName, socket, isNew, rooms) {
    // @ts-ignore
    const sessionId = socket.conn.id;
    // @ts-ignore
    const websocket = socket.conn.transport.socket;
    if (isNew) {
        debug("subscribe connection %s to topic %s", sessionId, namespaceName);
        websocket.subscribe(namespaceName);
    }
    rooms.forEach((room) => {
        const topic = `${namespaceName}${SEPARATOR}${room}`; // '#' can be used as wildcard
        debug("subscribe connection %s to topic %s", sessionId, topic);
        websocket.subscribe(topic);
    });
}
function restoreAdapter() {
    socket_io_adapter_1.Adapter.prototype.addAll = addAll;
    socket_io_adapter_1.Adapter.prototype.del = del;
    socket_io_adapter_1.Adapter.prototype.broadcast = broadcast;
}
exports.restoreAdapter = restoreAdapter;
const toArrayBuffer = (buffer) => {
    const { buffer: arrayBuffer, byteOffset, byteLength } = buffer;
    return arrayBuffer.slice(byteOffset, byteOffset + byteLength);
};
// imported from https://github.com/kolodziejczak-sz/uwebsocket-serve
function serveFile(res /* : HttpResponse */, filepath) {
    const { size } = (0, fs_1.statSync)(filepath);
    const readStream = (0, fs_1.createReadStream)(filepath);
    const destroyReadStream = () => !readStream.destroyed && readStream.destroy();
    const onError = (error) => {
        destroyReadStream();
        throw error;
    };
    const onDataChunk = (chunk) => {
        const arrayBufferChunk = toArrayBuffer(chunk);
        const lastOffset = res.getWriteOffset();
        const [ok, done] = res.tryEnd(arrayBufferChunk, size);
        if (!done && !ok) {
            readStream.pause();
            res.onWritable((offset) => {
                const [ok, done] = res.tryEnd(arrayBufferChunk.slice(offset - lastOffset), size);
                if (!done && ok) {
                    readStream.resume();
                }
                return ok;
            });
        }
    };
    res.onAborted(destroyReadStream);
    readStream
        .on("data", onDataChunk)
        .on("error", onError)
        .on("end", destroyReadStream);
}
exports.serveFile = serveFile;


/***/ }),

/***/ "./src/server/node_modules/socket.io/wrapper.mjs":
/*!*******************************************************!*\
  !*** ./src/server/node_modules/socket.io/wrapper.mjs ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Server": () => (/* binding */ Server),
/* harmony export */   "Namespace": () => (/* binding */ Namespace),
/* harmony export */   "Socket": () => (/* binding */ Socket)
/* harmony export */ });
/* harmony import */ var _dist_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dist/index.js */ "./src/server/node_modules/socket.io/dist/index.js");


const {Server, Namespace, Socket} = _dist_index_js__WEBPACK_IMPORTED_MODULE_0__;


/***/ }),

/***/ "./src/server/node_modules/socket.io/package.json":
/*!********************************************************!*\
  !*** ./src/server/node_modules/socket.io/package.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"socket.io","version":"4.4.0","description":"node.js realtime framework server","keywords":["realtime","framework","websocket","tcp","events","socket","io"],"files":["dist/","client-dist/","wrapper.mjs","!**/*.tsbuildinfo"],"directories":{"doc":"docs/","example":"example/","lib":"lib/","test":"test/"},"type":"commonjs","main":"./dist/index.js","exports":{"import":"./wrapper.mjs","require":"./dist/index.js"},"types":"./dist/index.d.ts","license":"MIT","repository":{"type":"git","url":"git://github.com/socketio/socket.io"},"scripts":{"compile":"rimraf ./dist && tsc","test":"npm run format:check && npm run compile && npm run test:types && npm run test:unit","test:types":"tsd","test:unit":"nyc mocha --require ts-node/register --reporter spec --slow 200 --bail --timeout 10000 test/socket.io.ts","format:check":"prettier --check \\"lib/**/*.ts\\" \\"test/**/*.ts\\"","format:fix":"prettier --write \\"lib/**/*.ts\\" \\"test/**/*.ts\\"","prepack":"npm run compile"},"dependencies":{"accepts":"~1.3.4","base64id":"~2.0.0","debug":"~4.3.2","engine.io":"~6.1.0","socket.io-adapter":"~2.3.3","socket.io-parser":"~4.0.4"},"devDependencies":{"@types/mocha":"^9.0.0","expect.js":"0.3.1","mocha":"^3.5.3","nyc":"^15.1.0","prettier":"^2.3.2","rimraf":"^3.0.2","socket.io-client":"4.4.0","socket.io-client-v2":"npm:socket.io-client@^2.4.0","superagent":"^6.1.0","supertest":"^6.1.6","ts-node":"^10.2.1","tsd":"^0.17.0","typescript":"^4.4.2","uWebSockets.js":"github:uNetworking/uWebSockets.js#v20.0.0"},"contributors":[{"name":"Guillermo Rauch","email":"rauchg@gmail.com"},{"name":"Arnout Kazemier","email":"info@3rd-eden.com"},{"name":"Vladimir Dronnikov","email":"dronnikov@gmail.com"},{"name":"Einar Otto Stangvik","email":"einaros@gmail.com"}],"engines":{"node":">=10.0.0"},"tsd":{"directory":"test"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************!*\
  !*** ./src/server/lib/server.ts ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! socket.io */ "./src/server/node_modules/socket.io/wrapper.mjs");


var _process$env = {"NODENV_SHELL":"zsh","TERM_PROGRAM":"iTerm.app","NODENV_DIR":"/usr/local/bin","NODE":"/Users/mobealey/.nodenv/versions/16.4.2/bin/node","ANDROID_HOME":"/Users/mobealey/.android-sdk","INIT_CWD":"/Users/mobealey/Projects/personal/dungeon_delvers","TERM":"xterm-256color","SHELL":"/bin/zsh","TMPDIR":"/var/folders/vh/0ys0f72x7dgdy85n1ryv8vvw0000gn/T/","npm_config_metrics_registry":"https://registry.npmjs.org/","_P9K_SSH":"0","TERM_PROGRAM_VERSION":"3.4.12","TERM_SESSION_ID":"w0t0p0:70CFFFDB-257C-49A8-822B-820CC6F89BB7","COLOR":"1","npm_config_noproxy":"","NODENV_ROOT":"/Users/mobealey/.nodenv","NODENV_HOOK_PATH":"/Users/mobealey/.nodenv/nodenv.d:/usr/local/Cellar/nodenv/1.4.0/nodenv.d:/usr/local/etc/nodenv.d:/etc/nodenv.d:/usr/lib/nodenv/hooks","USER":"mobealey","COMMAND_MODE":"unix2003","npm_config_globalconfig":"/Users/mobealey/.npm-global/etc/npmrc","SSH_AUTH_SOCK":"/private/tmp/com.apple.launchd.1EGzu7lpdH/Listeners","__CF_USER_TEXT_ENCODING":"0x1F5:0x0:0x0","npm_execpath":"/Users/mobealey/.nodenv/versions/16.4.2/lib/node_modules/npm/bin/npm-cli.js","PAGER":"less","LSCOLORS":"Gxfxcxdxbxegedabagacad","PATH":"/Users/mobealey/Projects/personal/dungeon_delvers/node_modules/.bin:/Users/mobealey/Projects/personal/node_modules/.bin:/Users/mobealey/Projects/node_modules/.bin:/Users/mobealey/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/mobealey/.nodenv/versions/16.4.2/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/Users/mobealey/Projects/personal/dungeon_delvers/node_modules/.bin:/Users/mobealey/Projects/personal/node_modules/.bin:/Users/mobealey/Projects/node_modules/.bin:/Users/mobealey/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/usr/local/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/Users/mobealey/.nodenv/versions/16.4.2/bin:/usr/local/Cellar/nodenv/1.4.0/libexec:/Users/mobealey/.nodenv/plugins/nodenv-update/bin:/Users/mobealey/.nodenv/plugins/nodenv-build/bin:/Users/mobealey/.jenv/shims:/Users/mobealey/.composer/vendor/bin:/Users/mobealey/.flutter/flutter/bin:/usr/local/bin:.jenv/bin:/Users/mobealey/.android-sdk/cmdline-tools/tools/bin:/usr/local/Cellar/nodenv/1.3.1/libexec/nodenv:/Users/mobealey/.nodenv/shims:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Apple/usr/bin:/Users/mobealey/Library/Android/sdk/platform-tools:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/heroku:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/pip:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/lein:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/command-not-found:/Users/mobealey/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/mobealey/.antigen/bundles/romkatv/powerlevel10k","npm_config_init.module":"/Users/mobealey/.npm-init.js","_":"./src/server/node_modules/.bin/webpack","LaunchInstanceID":"E1923E0C-916A-4FBA-AFCF-450FED3640E0","npm_package_json":"/Users/mobealey/Projects/personal/dungeon_delvers/package.json","__CFBundleIdentifier":"com.googlecode.iterm2","npm_config_init_module":"/Users/mobealey/.npm-init.js","npm_config_userconfig":"/Users/mobealey/.npmrc","JENV_LOADED":"1","PWD":"/Users/mobealey/Projects/personal/dungeon_delvers","npm_command":"run-script","EDITOR":"vi","npm_lifecycle_event":"watch:server","LANG":"en_US.UTF-8","npm_package_name":"dungeon_delvers","ITERM_PROFILE":"Default","XPC_FLAGS":"0x0","npm_config_node_gyp":"/Users/mobealey/.nodenv/versions/16.4.2/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js","XPC_SERVICE_NAME":"0","npm_package_version":"0.0.1","SHLVL":"3","HOME":"/Users/mobealey","COLORFGBG":"15;0","LC_TERMINAL_VERSION":"3.4.12","ITERM_SESSION_ID":"w0t0p0:70CFFFDB-257C-49A8-822B-820CC6F89BB7","LESS":"-R","LOGNAME":"mobealey","npm_config_cache":"/Users/mobealey/.npm","JENV_SHELL":"zsh","npm_lifecycle_script":"./src/server/node_modules/.bin/webpack --config ./src/server/webpack.config.js --mode=development -w","NODENV_VERSION":"16.4.2","LC_CTYPE":"en_US.UTF-8","npm_config_user_agent":"npm/7.6.3 node/v16.4.2 darwin x64","LC_TERMINAL":"iTerm2","SECURITYSESSIONID":"186ab","COLORTERM":"truecolor","npm_config_prefix":"/Users/mobealey/.npm-global","npm_node_execpath":"/Users/mobealey/.nodenv/versions/16.4.2/bin/node","APP_BASE_URL":"localhost","APP_CLIENT_PORT":"8080","APP_SERVER_PORT":"3000"},
    APP_BASE_URL = _process$env.APP_BASE_URL,
    APP_CLIENT_PORT = _process$env.APP_CLIENT_PORT,
    _process$env$APP_SERV = _process$env.APP_SERVER_PORT,
    APP_SERVER_PORT = _process$env$APP_SERV === void 0 ? '3000' : _process$env$APP_SERV;
var port = parseInt(APP_SERVER_PORT, 10);
var clientUrl = "http://".concat(APP_BASE_URL, ":").concat(APP_CLIENT_PORT);
var httpServer = http__WEBPACK_IMPORTED_MODULE_0___default().createServer().listen(port, '0.0.0.0');
console.log(clientUrl);
var io = new socket_io__WEBPACK_IMPORTED_MODULE_1__.Server(httpServer, {
  cors: {
    origin: clientUrl
  }
});
console.log("Running server on port:".concat(port));
io.on('connection', function (socket) {
  console.log('user connected');
  socket.emit('welcome', 'welcome man');
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCLGdCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxZQUFZO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFdBQVc7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFdBQVc7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixjQUFjO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsY0FBYztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxl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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFdBQVc7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLGdCQUFnQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQywwQkFBMEI7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsNEJBQTRCO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQywrQkFBK0I7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGVBQWU7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsZUFBZTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLHdCQUF3QjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EscUJBQXFCO0FBQ3JCLHdCQUF3QjtBQUN4QixxQkFBcUI7Ozs7Ozs7Ozs7OztBQ3JrQlI7QUFDYjtBQUNBLDZDQUE2QztBQUM3QztBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxpQkFBaUIsR0FBRyx1QkFBdUI7QUFDM0MsaUJBQWlCLG1CQUFPLENBQUMsb0VBQVU7QUFDbkMsdUJBQXVCLG1CQUFPLENBQUMsZ0ZBQWdCO0FBQy9DLGdDQUFnQyxtQkFBTyxDQUFDLG9CQUFPO0FBQy9DLDZCQUE2QixtQkFBTyxDQUFDLDRGQUFzQjtBQUMzRDtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxHQUFHO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjs7Ozs7Ozs7Ozs7O0FDblNKO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdE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QVM7QUFDeEIsZ0JBQWdCLFFBQVE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLFFBQVE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFVBQVU7QUFDekIsZ0JBQWdCLFFBQVE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsVUFBVTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LFlBQU4sRUFBb0IsVUFBQ0MsTUFBRCxFQUFZO0FBQzlCTixFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxnQkFBWjtBQUNBSyxFQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWSxTQUFaLEVBQXVCLGFBQXZCO0FBQ0QsQ0FIRCxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvYmFzZTY0aWQvbGliL2Jhc2U2NGlkLmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2NvbXBvbmVudC1lbWl0dGVyL2luZGV4LmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2NvcnMvbGliL2luZGV4LmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL3NvY2tldC5pby1hZGFwdGVyL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvc29ja2V0LmlvLXBhcnNlci9kaXN0L2JpbmFyeS5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9zb2NrZXQuaW8tcGFyc2VyL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvc29ja2V0LmlvLXBhcnNlci9kaXN0L2lzLWJpbmFyeS5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvZXh0ZXJuYWwgY29tbW9uanMgXCJhY2NlcHRzXCIiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzL2V4dGVybmFsIGNvbW1vbmpzIFwiY29va2llXCIiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzL2V4dGVybmFsIGNvbW1vbmpzIFwiZGVidWdcIiIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvZXh0ZXJuYWwgY29tbW9uanMgXCJldmVudHNcIiIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvZXh0ZXJuYWwgY29tbW9uanMgXCJvYmplY3QtYXNzaWduXCIiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzL2V4dGVybmFsIGNvbW1vbmpzIFwicXVlcnlzdHJpbmdcIiIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvZXh0ZXJuYWwgY29tbW9uanMgXCJ1cmxcIiIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvZXh0ZXJuYWwgY29tbW9uanMgXCJ2YXJ5XCIiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzL2V4dGVybmFsIGNvbW1vbmpzIFwid3NcIiIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImNyeXB0b1wiIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZnNcIiIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImh0dHBcIiIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInBhdGhcIiIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInN0cmVhbVwiIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiemxpYlwiIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2VuZ2luZS5pby1wYXJzZXIvYnVpbGQvY2pzL2NvbW1vbnMuanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvZW5naW5lLmlvLXBhcnNlci9idWlsZC9janMvZGVjb2RlUGFja2V0LmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2VuZ2luZS5pby1wYXJzZXIvYnVpbGQvY2pzL2VuY29kZVBhY2tldC5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8tcGFyc2VyL2J1aWxkL2Nqcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8vYnVpbGQvZW5naW5lLmlvLmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2VuZ2luZS5pby9idWlsZC9wYXJzZXItdjMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvZW5naW5lLmlvL2J1aWxkL3BhcnNlci12My91dGY4LmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2VuZ2luZS5pby9idWlsZC9zZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvZW5naW5lLmlvL2J1aWxkL3NvY2tldC5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8vYnVpbGQvdHJhbnNwb3J0LmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2VuZ2luZS5pby9idWlsZC90cmFuc3BvcnRzLXV3cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8vYnVpbGQvdHJhbnNwb3J0cy11d3MvcG9sbGluZy5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8vYnVpbGQvdHJhbnNwb3J0cy11d3Mvd2Vic29ja2V0LmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2VuZ2luZS5pby9idWlsZC90cmFuc3BvcnRzL2luZGV4LmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2VuZ2luZS5pby9idWlsZC90cmFuc3BvcnRzL3BvbGxpbmctanNvbnAuanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvZW5naW5lLmlvL2J1aWxkL3RyYW5zcG9ydHMvcG9sbGluZy5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8vYnVpbGQvdHJhbnNwb3J0cy93ZWJzb2NrZXQuanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvZW5naW5lLmlvL2J1aWxkL3VzZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvc29ja2V0LmlvL2Rpc3QvYnJvYWRjYXN0LW9wZXJhdG9yLmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL3NvY2tldC5pby9kaXN0L2NsaWVudC5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9zb2NrZXQuaW8vZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9zb2NrZXQuaW8vZGlzdC9uYW1lc3BhY2UuanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvc29ja2V0LmlvL2Rpc3QvcGFyZW50LW5hbWVzcGFjZS5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9zb2NrZXQuaW8vZGlzdC9zb2NrZXQuanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvc29ja2V0LmlvL2Rpc3QvdHlwZWQtZXZlbnRzLmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL3NvY2tldC5pby9kaXN0L3V3cy5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9zb2NrZXQuaW8vd3JhcHBlci5tanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbGliL3NlcnZlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIGJhc2U2NGlkIHYwLjEuMFxuICovXG5cbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llc1xuICovXG5cbnZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RvclxuICovXG5cbnZhciBCYXNlNjRJZCA9IGZ1bmN0aW9uKCkgeyB9O1xuXG4vKipcbiAqIEdldCByYW5kb20gYnl0ZXNcbiAqXG4gKiBVc2VzIGEgYnVmZmVyIGlmIGF2YWlsYWJsZSwgZmFsbHMgYmFjayB0byBjcnlwdG8ucmFuZG9tQnl0ZXNcbiAqL1xuXG5CYXNlNjRJZC5wcm90b3R5cGUuZ2V0UmFuZG9tQnl0ZXMgPSBmdW5jdGlvbihieXRlcykge1xuXG4gIHZhciBCVUZGRVJfU0laRSA9IDQwOTZcbiAgdmFyIHNlbGYgPSB0aGlzOyAgXG4gIFxuICBieXRlcyA9IGJ5dGVzIHx8IDEyO1xuXG4gIGlmIChieXRlcyA+IEJVRkZFUl9TSVpFKSB7XG4gICAgcmV0dXJuIGNyeXB0by5yYW5kb21CeXRlcyhieXRlcyk7XG4gIH1cbiAgXG4gIHZhciBieXRlc0luQnVmZmVyID0gcGFyc2VJbnQoQlVGRkVSX1NJWkUvYnl0ZXMpO1xuICB2YXIgdGhyZXNob2xkID0gcGFyc2VJbnQoYnl0ZXNJbkJ1ZmZlciowLjg1KTtcblxuICBpZiAoIXRocmVzaG9sZCkge1xuICAgIHJldHVybiBjcnlwdG8ucmFuZG9tQnl0ZXMoYnl0ZXMpO1xuICB9XG5cbiAgaWYgKHRoaXMuYnl0ZXNCdWZmZXJJbmRleCA9PSBudWxsKSB7XG4gICAgIHRoaXMuYnl0ZXNCdWZmZXJJbmRleCA9IC0xO1xuICB9XG5cbiAgaWYgKHRoaXMuYnl0ZXNCdWZmZXJJbmRleCA9PSBieXRlc0luQnVmZmVyKSB7XG4gICAgdGhpcy5ieXRlc0J1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5ieXRlc0J1ZmZlckluZGV4ID0gLTE7XG4gIH1cblxuICAvLyBObyBidWZmZXJlZCBieXRlcyBhdmFpbGFibGUgb3IgaW5kZXggYWJvdmUgdGhyZXNob2xkXG4gIGlmICh0aGlzLmJ5dGVzQnVmZmVySW5kZXggPT0gLTEgfHwgdGhpcy5ieXRlc0J1ZmZlckluZGV4ID4gdGhyZXNob2xkKSB7XG4gICAgIFxuICAgIGlmICghdGhpcy5pc0dlbmVyYXRpbmdCeXRlcykge1xuICAgICAgdGhpcy5pc0dlbmVyYXRpbmdCeXRlcyA9IHRydWU7XG4gICAgICBjcnlwdG8ucmFuZG9tQnl0ZXMoQlVGRkVSX1NJWkUsIGZ1bmN0aW9uKGVyciwgYnl0ZXMpIHtcbiAgICAgICAgc2VsZi5ieXRlc0J1ZmZlciA9IGJ5dGVzO1xuICAgICAgICBzZWxmLmJ5dGVzQnVmZmVySW5kZXggPSAwO1xuICAgICAgICBzZWxmLmlzR2VuZXJhdGluZ0J5dGVzID0gZmFsc2U7XG4gICAgICB9KTsgXG4gICAgfVxuICAgIFxuICAgIC8vIEZhbGwgYmFjayB0byBzeW5jIGNhbGwgd2hlbiBubyBidWZmZXJlZCBieXRlcyBhcmUgYXZhaWxhYmxlXG4gICAgaWYgKHRoaXMuYnl0ZXNCdWZmZXJJbmRleCA9PSAtMSkge1xuICAgICAgcmV0dXJuIGNyeXB0by5yYW5kb21CeXRlcyhieXRlcyk7XG4gICAgfVxuICB9XG4gIFxuICB2YXIgcmVzdWx0ID0gdGhpcy5ieXRlc0J1ZmZlci5zbGljZShieXRlcyp0aGlzLmJ5dGVzQnVmZmVySW5kZXgsIGJ5dGVzKih0aGlzLmJ5dGVzQnVmZmVySW5kZXgrMSkpOyBcbiAgdGhpcy5ieXRlc0J1ZmZlckluZGV4Kys7IFxuICBcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBiYXNlNjQgaWRcbiAqXG4gKiAoT3JpZ2luYWwgdmVyc2lvbiBmcm9tIHNvY2tldC5pbyA8aHR0cDovL3NvY2tldC5pbz4pXG4gKi9cblxuQmFzZTY0SWQucHJvdG90eXBlLmdlbmVyYXRlSWQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciByYW5kID0gQnVmZmVyLmFsbG9jKDE1KTsgLy8gbXVsdGlwbGUgb2YgMyBmb3IgYmFzZTY0XG4gIGlmICghcmFuZC53cml0ZUludDMyQkUpIHtcbiAgICByZXR1cm4gTWF0aC5hYnMoTWF0aC5yYW5kb20oKSAqIE1hdGgucmFuZG9tKCkgKiBEYXRlLm5vdygpIHwgMCkudG9TdHJpbmcoKVxuICAgICAgKyBNYXRoLmFicyhNYXRoLnJhbmRvbSgpICogTWF0aC5yYW5kb20oKSAqIERhdGUubm93KCkgfCAwKS50b1N0cmluZygpO1xuICB9XG4gIHRoaXMuc2VxdWVuY2VOdW1iZXIgPSAodGhpcy5zZXF1ZW5jZU51bWJlciArIDEpIHwgMDtcbiAgcmFuZC53cml0ZUludDMyQkUodGhpcy5zZXF1ZW5jZU51bWJlciwgMTEpO1xuICBpZiAoY3J5cHRvLnJhbmRvbUJ5dGVzKSB7XG4gICAgdGhpcy5nZXRSYW5kb21CeXRlcygxMikuY29weShyYW5kKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBub3Qgc2VjdXJlIGZvciBub2RlIDAuNFxuICAgIFswLCA0LCA4XS5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgIHJhbmQud3JpdGVJbnQzMkJFKE1hdGgucmFuZG9tKCkgKiBNYXRoLnBvdygyLCAzMikgfCAwLCBpKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gcmFuZC50b1N0cmluZygnYmFzZTY0JykucmVwbGFjZSgvXFwvL2csICdfJykucmVwbGFjZSgvXFwrL2csICctJyk7XG59O1xuXG4vKipcbiAqIEV4cG9ydFxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IG5ldyBCYXNlNjRJZCgpO1xuIiwiXHJcbi8qKlxyXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxyXG4gKi9cclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xyXG4gIG1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxyXG4gKlxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XHJcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XHJcbn07XHJcblxyXG4vKipcclxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxyXG4gKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAqIEBhcGkgcHJpdmF0ZVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1peGluKG9iaikge1xyXG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xyXG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xyXG4gIH1cclxuICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG4vKipcclxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUub24gPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgKHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdKVxyXG4gICAgLnB1c2goZm4pO1xyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxyXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICBmdW5jdGlvbiBvbigpIHtcclxuICAgIHRoaXMub2ZmKGV2ZW50LCBvbik7XHJcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gIH1cclxuXHJcbiAgb24uZm4gPSBmbjtcclxuICB0aGlzLm9uKGV2ZW50LCBvbik7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcclxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG5cclxuICAvLyBhbGxcclxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gc3BlY2lmaWMgZXZlbnRcclxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XHJcblxyXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcclxuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcclxuICB2YXIgY2I7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcclxuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgZXZlbnQgc3BlY2lmaWMgYXJyYXlzIGZvciBldmVudCB0eXBlcyB0aGF0IG5vXHJcbiAgLy8gb25lIGlzIHN1YnNjcmliZWQgZm9yIHRvIGF2b2lkIG1lbW9yeSBsZWFrLlxyXG4gIGlmIChjYWxsYmFja3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtNaXhlZH0gLi4uXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcblxyXG4gIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKVxyXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xyXG5cclxuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XHJcbiAgfVxyXG5cclxuICBpZiAoY2FsbGJhY2tzKSB7XHJcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcmV0dXJuIHtBcnJheX1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xyXG59O1xyXG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuICB2YXIgdmFyeSA9IHJlcXVpcmUoJ3ZhcnknKTtcblxuICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgb3JpZ2luOiAnKicsXG4gICAgbWV0aG9kczogJ0dFVCxIRUFELFBVVCxQQVRDSCxQT1NULERFTEVURScsXG4gICAgcHJlZmxpZ2h0Q29udGludWU6IGZhbHNlLFxuICAgIG9wdGlvbnNTdWNjZXNzU3RhdHVzOiAyMDRcbiAgfTtcblxuICBmdW5jdGlvbiBpc1N0cmluZyhzKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzID09PSAnc3RyaW5nJyB8fCBzIGluc3RhbmNlb2YgU3RyaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNPcmlnaW5BbGxvd2VkKG9yaWdpbiwgYWxsb3dlZE9yaWdpbikge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGFsbG93ZWRPcmlnaW4pKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbG93ZWRPcmlnaW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKGlzT3JpZ2luQWxsb3dlZChvcmlnaW4sIGFsbG93ZWRPcmlnaW5baV0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKGFsbG93ZWRPcmlnaW4pKSB7XG4gICAgICByZXR1cm4gb3JpZ2luID09PSBhbGxvd2VkT3JpZ2luO1xuICAgIH0gZWxzZSBpZiAoYWxsb3dlZE9yaWdpbiBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgcmV0dXJuIGFsbG93ZWRPcmlnaW4udGVzdChvcmlnaW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gISFhbGxvd2VkT3JpZ2luO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbmZpZ3VyZU9yaWdpbihvcHRpb25zLCByZXEpIHtcbiAgICB2YXIgcmVxdWVzdE9yaWdpbiA9IHJlcS5oZWFkZXJzLm9yaWdpbixcbiAgICAgIGhlYWRlcnMgPSBbXSxcbiAgICAgIGlzQWxsb3dlZDtcblxuICAgIGlmICghb3B0aW9ucy5vcmlnaW4gfHwgb3B0aW9ucy5vcmlnaW4gPT09ICcqJykge1xuICAgICAgLy8gYWxsb3cgYW55IG9yaWdpblxuICAgICAgaGVhZGVycy5wdXNoKFt7XG4gICAgICAgIGtleTogJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsXG4gICAgICAgIHZhbHVlOiAnKidcbiAgICAgIH1dKTtcbiAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKG9wdGlvbnMub3JpZ2luKSkge1xuICAgICAgLy8gZml4ZWQgb3JpZ2luXG4gICAgICBoZWFkZXJzLnB1c2goW3tcbiAgICAgICAga2V5OiAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJyxcbiAgICAgICAgdmFsdWU6IG9wdGlvbnMub3JpZ2luXG4gICAgICB9XSk7XG4gICAgICBoZWFkZXJzLnB1c2goW3tcbiAgICAgICAga2V5OiAnVmFyeScsXG4gICAgICAgIHZhbHVlOiAnT3JpZ2luJ1xuICAgICAgfV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpc0FsbG93ZWQgPSBpc09yaWdpbkFsbG93ZWQocmVxdWVzdE9yaWdpbiwgb3B0aW9ucy5vcmlnaW4pO1xuICAgICAgLy8gcmVmbGVjdCBvcmlnaW5cbiAgICAgIGhlYWRlcnMucHVzaChbe1xuICAgICAgICBrZXk6ICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLFxuICAgICAgICB2YWx1ZTogaXNBbGxvd2VkID8gcmVxdWVzdE9yaWdpbiA6IGZhbHNlXG4gICAgICB9XSk7XG4gICAgICBoZWFkZXJzLnB1c2goW3tcbiAgICAgICAga2V5OiAnVmFyeScsXG4gICAgICAgIHZhbHVlOiAnT3JpZ2luJ1xuICAgICAgfV0pO1xuICAgIH1cblxuICAgIHJldHVybiBoZWFkZXJzO1xuICB9XG5cbiAgZnVuY3Rpb24gY29uZmlndXJlTWV0aG9kcyhvcHRpb25zKSB7XG4gICAgdmFyIG1ldGhvZHMgPSBvcHRpb25zLm1ldGhvZHM7XG4gICAgaWYgKG1ldGhvZHMuam9pbikge1xuICAgICAgbWV0aG9kcyA9IG9wdGlvbnMubWV0aG9kcy5qb2luKCcsJyk7IC8vIC5tZXRob2RzIGlzIGFuIGFycmF5LCBzbyB0dXJuIGl0IGludG8gYSBzdHJpbmdcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGtleTogJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLFxuICAgICAgdmFsdWU6IG1ldGhvZHNcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gY29uZmlndXJlQ3JlZGVudGlhbHMob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmNyZWRlbnRpYWxzID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBrZXk6ICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscycsXG4gICAgICAgIHZhbHVlOiAndHJ1ZSdcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gY29uZmlndXJlQWxsb3dlZEhlYWRlcnMob3B0aW9ucywgcmVxKSB7XG4gICAgdmFyIGFsbG93ZWRIZWFkZXJzID0gb3B0aW9ucy5hbGxvd2VkSGVhZGVycyB8fCBvcHRpb25zLmhlYWRlcnM7XG4gICAgdmFyIGhlYWRlcnMgPSBbXTtcblxuICAgIGlmICghYWxsb3dlZEhlYWRlcnMpIHtcbiAgICAgIGFsbG93ZWRIZWFkZXJzID0gcmVxLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLXJlcXVlc3QtaGVhZGVycyddOyAvLyAuaGVhZGVycyB3YXNuJ3Qgc3BlY2lmaWVkLCBzbyByZWZsZWN0IHRoZSByZXF1ZXN0IGhlYWRlcnNcbiAgICAgIGhlYWRlcnMucHVzaChbe1xuICAgICAgICBrZXk6ICdWYXJ5JyxcbiAgICAgICAgdmFsdWU6ICdBY2Nlc3MtQ29udHJvbC1SZXF1ZXN0LUhlYWRlcnMnXG4gICAgICB9XSk7XG4gICAgfSBlbHNlIGlmIChhbGxvd2VkSGVhZGVycy5qb2luKSB7XG4gICAgICBhbGxvd2VkSGVhZGVycyA9IGFsbG93ZWRIZWFkZXJzLmpvaW4oJywnKTsgLy8gLmhlYWRlcnMgaXMgYW4gYXJyYXksIHNvIHR1cm4gaXQgaW50byBhIHN0cmluZ1xuICAgIH1cbiAgICBpZiAoYWxsb3dlZEhlYWRlcnMgJiYgYWxsb3dlZEhlYWRlcnMubGVuZ3RoKSB7XG4gICAgICBoZWFkZXJzLnB1c2goW3tcbiAgICAgICAga2V5OiAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycycsXG4gICAgICAgIHZhbHVlOiBhbGxvd2VkSGVhZGVyc1xuICAgICAgfV0pO1xuICAgIH1cblxuICAgIHJldHVybiBoZWFkZXJzO1xuICB9XG5cbiAgZnVuY3Rpb24gY29uZmlndXJlRXhwb3NlZEhlYWRlcnMob3B0aW9ucykge1xuICAgIHZhciBoZWFkZXJzID0gb3B0aW9ucy5leHBvc2VkSGVhZGVycztcbiAgICBpZiAoIWhlYWRlcnMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSBpZiAoaGVhZGVycy5qb2luKSB7XG4gICAgICBoZWFkZXJzID0gaGVhZGVycy5qb2luKCcsJyk7IC8vIC5oZWFkZXJzIGlzIGFuIGFycmF5LCBzbyB0dXJuIGl0IGludG8gYSBzdHJpbmdcbiAgICB9XG4gICAgaWYgKGhlYWRlcnMgJiYgaGVhZGVycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGtleTogJ0FjY2Vzcy1Db250cm9sLUV4cG9zZS1IZWFkZXJzJyxcbiAgICAgICAgdmFsdWU6IGhlYWRlcnNcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gY29uZmlndXJlTWF4QWdlKG9wdGlvbnMpIHtcbiAgICB2YXIgbWF4QWdlID0gKHR5cGVvZiBvcHRpb25zLm1heEFnZSA9PT0gJ251bWJlcicgfHwgb3B0aW9ucy5tYXhBZ2UpICYmIG9wdGlvbnMubWF4QWdlLnRvU3RyaW5nKClcbiAgICBpZiAobWF4QWdlICYmIG1heEFnZS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGtleTogJ0FjY2Vzcy1Db250cm9sLU1heC1BZ2UnLFxuICAgICAgICB2YWx1ZTogbWF4QWdlXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFwcGx5SGVhZGVycyhoZWFkZXJzLCByZXMpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGhlYWRlcnMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICB2YXIgaGVhZGVyID0gaGVhZGVyc1tpXTtcbiAgICAgIGlmIChoZWFkZXIpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaGVhZGVyKSkge1xuICAgICAgICAgIGFwcGx5SGVhZGVycyhoZWFkZXIsIHJlcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaGVhZGVyLmtleSA9PT0gJ1ZhcnknICYmIGhlYWRlci52YWx1ZSkge1xuICAgICAgICAgIHZhcnkocmVzLCBoZWFkZXIudmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGhlYWRlci52YWx1ZSkge1xuICAgICAgICAgIHJlcy5zZXRIZWFkZXIoaGVhZGVyLmtleSwgaGVhZGVyLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNvcnMob3B0aW9ucywgcmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgaGVhZGVycyA9IFtdLFxuICAgICAgbWV0aG9kID0gcmVxLm1ldGhvZCAmJiByZXEubWV0aG9kLnRvVXBwZXJDYXNlICYmIHJlcS5tZXRob2QudG9VcHBlckNhc2UoKTtcblxuICAgIGlmIChtZXRob2QgPT09ICdPUFRJT05TJykge1xuICAgICAgLy8gcHJlZmxpZ2h0XG4gICAgICBoZWFkZXJzLnB1c2goY29uZmlndXJlT3JpZ2luKG9wdGlvbnMsIHJlcSkpO1xuICAgICAgaGVhZGVycy5wdXNoKGNvbmZpZ3VyZUNyZWRlbnRpYWxzKG9wdGlvbnMsIHJlcSkpO1xuICAgICAgaGVhZGVycy5wdXNoKGNvbmZpZ3VyZU1ldGhvZHMob3B0aW9ucywgcmVxKSk7XG4gICAgICBoZWFkZXJzLnB1c2goY29uZmlndXJlQWxsb3dlZEhlYWRlcnMob3B0aW9ucywgcmVxKSk7XG4gICAgICBoZWFkZXJzLnB1c2goY29uZmlndXJlTWF4QWdlKG9wdGlvbnMsIHJlcSkpO1xuICAgICAgaGVhZGVycy5wdXNoKGNvbmZpZ3VyZUV4cG9zZWRIZWFkZXJzKG9wdGlvbnMsIHJlcSkpO1xuICAgICAgYXBwbHlIZWFkZXJzKGhlYWRlcnMsIHJlcyk7XG5cbiAgICAgIGlmIChvcHRpb25zLnByZWZsaWdodENvbnRpbnVlKSB7XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFNhZmFyaSAoYW5kIHBvdGVudGlhbGx5IG90aGVyIGJyb3dzZXJzKSBuZWVkIGNvbnRlbnQtbGVuZ3RoIDAsXG4gICAgICAgIC8vICAgZm9yIDIwNCBvciB0aGV5IGp1c3QgaGFuZyB3YWl0aW5nIGZvciBhIGJvZHlcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSBvcHRpb25zLm9wdGlvbnNTdWNjZXNzU3RhdHVzO1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsICcwJyk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYWN0dWFsIHJlc3BvbnNlXG4gICAgICBoZWFkZXJzLnB1c2goY29uZmlndXJlT3JpZ2luKG9wdGlvbnMsIHJlcSkpO1xuICAgICAgaGVhZGVycy5wdXNoKGNvbmZpZ3VyZUNyZWRlbnRpYWxzKG9wdGlvbnMsIHJlcSkpO1xuICAgICAgaGVhZGVycy5wdXNoKGNvbmZpZ3VyZUV4cG9zZWRIZWFkZXJzKG9wdGlvbnMsIHJlcSkpO1xuICAgICAgYXBwbHlIZWFkZXJzKGhlYWRlcnMsIHJlcyk7XG4gICAgICBuZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbWlkZGxld2FyZVdyYXBwZXIobykge1xuICAgIC8vIGlmIG9wdGlvbnMgYXJlIHN0YXRpYyAoZWl0aGVyIHZpYSBkZWZhdWx0cyBvciBjdXN0b20gb3B0aW9ucyBwYXNzZWQgaW4pLCB3cmFwIGluIGEgZnVuY3Rpb25cbiAgICB2YXIgb3B0aW9uc0NhbGxiYWNrID0gbnVsbDtcbiAgICBpZiAodHlwZW9mIG8gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG9wdGlvbnNDYWxsYmFjayA9IG87XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnNDYWxsYmFjayA9IGZ1bmN0aW9uIChyZXEsIGNiKSB7XG4gICAgICAgIGNiKG51bGwsIG8pO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gY29yc01pZGRsZXdhcmUocmVxLCByZXMsIG5leHQpIHtcbiAgICAgIG9wdGlvbnNDYWxsYmFjayhyZXEsIGZ1bmN0aW9uIChlcnIsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIG5leHQoZXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgY29yc09wdGlvbnMgPSBhc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgICB2YXIgb3JpZ2luQ2FsbGJhY2sgPSBudWxsO1xuICAgICAgICAgIGlmIChjb3JzT3B0aW9ucy5vcmlnaW4gJiYgdHlwZW9mIGNvcnNPcHRpb25zLm9yaWdpbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgb3JpZ2luQ2FsbGJhY2sgPSBjb3JzT3B0aW9ucy5vcmlnaW47XG4gICAgICAgICAgfSBlbHNlIGlmIChjb3JzT3B0aW9ucy5vcmlnaW4pIHtcbiAgICAgICAgICAgIG9yaWdpbkNhbGxiYWNrID0gZnVuY3Rpb24gKG9yaWdpbiwgY2IpIHtcbiAgICAgICAgICAgICAgY2IobnVsbCwgY29yc09wdGlvbnMub3JpZ2luKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG9yaWdpbkNhbGxiYWNrKSB7XG4gICAgICAgICAgICBvcmlnaW5DYWxsYmFjayhyZXEuaGVhZGVycy5vcmlnaW4sIGZ1bmN0aW9uIChlcnIyLCBvcmlnaW4pIHtcbiAgICAgICAgICAgICAgaWYgKGVycjIgfHwgIW9yaWdpbikge1xuICAgICAgICAgICAgICAgIG5leHQoZXJyMik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29yc09wdGlvbnMub3JpZ2luID0gb3JpZ2luO1xuICAgICAgICAgICAgICAgIGNvcnMoY29yc09wdGlvbnMsIHJlcSwgcmVzLCBuZXh0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICAvLyBjYW4gcGFzcyBlaXRoZXIgYW4gb3B0aW9ucyBoYXNoLCBhbiBvcHRpb25zIGRlbGVnYXRlLCBvciBub3RoaW5nXG4gIG1vZHVsZS5leHBvcnRzID0gbWlkZGxld2FyZVdyYXBwZXI7XG5cbn0oKSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQWRhcHRlciA9IHZvaWQgMDtcbmNvbnN0IGV2ZW50c18xID0gcmVxdWlyZShcImV2ZW50c1wiKTtcbmNsYXNzIEFkYXB0ZXIgZXh0ZW5kcyBldmVudHNfMS5FdmVudEVtaXR0ZXIge1xuICAgIC8qKlxuICAgICAqIEluLW1lbW9yeSBhZGFwdGVyIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOYW1lc3BhY2V9IG5zcFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG5zcCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5zcCA9IG5zcDtcbiAgICAgICAgdGhpcy5yb29tcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5zaWRzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmVuY29kZXIgPSBuc3Auc2VydmVyLmVuY29kZXI7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRvIGJlIG92ZXJyaWRkZW5cbiAgICAgKi9cbiAgICBpbml0KCkgeyB9XG4gICAgLyoqXG4gICAgICogVG8gYmUgb3ZlcnJpZGRlblxuICAgICAqL1xuICAgIGNsb3NlKCkgeyB9XG4gICAgLyoqXG4gICAgICogQWRkcyBhIHNvY2tldCB0byBhIGxpc3Qgb2Ygcm9vbS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U29ja2V0SWR9ICBpZCAgICAgIHRoZSBzb2NrZXQgaWRcbiAgICAgKiBAcGFyYW0ge1NldDxSb29tPn0gcm9vbXMgICBhIHNldCBvZiByb29tc1xuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBhZGRBbGwoaWQsIHJvb21zKSB7XG4gICAgICAgIGlmICghdGhpcy5zaWRzLmhhcyhpZCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2lkcy5zZXQoaWQsIG5ldyBTZXQoKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCByb29tIG9mIHJvb21zKSB7XG4gICAgICAgICAgICB0aGlzLnNpZHMuZ2V0KGlkKS5hZGQocm9vbSk7XG4gICAgICAgICAgICBpZiAoIXRoaXMucm9vbXMuaGFzKHJvb20pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb29tcy5zZXQocm9vbSwgbmV3IFNldCgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJjcmVhdGUtcm9vbVwiLCByb29tKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5yb29tcy5nZXQocm9vbSkuaGFzKGlkKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucm9vbXMuZ2V0KHJvb20pLmFkZChpZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwiam9pbi1yb29tXCIsIHJvb20sIGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgc29ja2V0IGZyb20gYSByb29tLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTb2NrZXRJZH0gaWQgICAgIHRoZSBzb2NrZXQgaWRcbiAgICAgKiBAcGFyYW0ge1Jvb219ICAgICByb29tICAgdGhlIHJvb20gbmFtZVxuICAgICAqL1xuICAgIGRlbChpZCwgcm9vbSkge1xuICAgICAgICBpZiAodGhpcy5zaWRzLmhhcyhpZCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2lkcy5nZXQoaWQpLmRlbGV0ZShyb29tKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9kZWwocm9vbSwgaWQpO1xuICAgIH1cbiAgICBfZGVsKHJvb20sIGlkKSB7XG4gICAgICAgIGNvbnN0IF9yb29tID0gdGhpcy5yb29tcy5nZXQocm9vbSk7XG4gICAgICAgIGlmIChfcm9vbSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBkZWxldGVkID0gX3Jvb20uZGVsZXRlKGlkKTtcbiAgICAgICAgICAgIGlmIChkZWxldGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwibGVhdmUtcm9vbVwiLCByb29tLCBpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX3Jvb20uc2l6ZSA9PT0gMCAmJiB0aGlzLnJvb21zLmRlbGV0ZShyb29tKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcImRlbGV0ZS1yb29tXCIsIHJvb20pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBzb2NrZXQgZnJvbSBhbGwgcm9vbXMgaXQncyBqb2luZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1NvY2tldElkfSBpZCAgIHRoZSBzb2NrZXQgaWRcbiAgICAgKi9cbiAgICBkZWxBbGwoaWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNpZHMuaGFzKGlkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qgcm9vbSBvZiB0aGlzLnNpZHMuZ2V0KGlkKSkge1xuICAgICAgICAgICAgdGhpcy5fZGVsKHJvb20sIGlkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNpZHMuZGVsZXRlKGlkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQnJvYWRjYXN0cyBhIHBhY2tldC5cbiAgICAgKlxuICAgICAqIE9wdGlvbnM6XG4gICAgICogIC0gYGZsYWdzYCB7T2JqZWN0fSBmbGFncyBmb3IgdGhpcyBwYWNrZXRcbiAgICAgKiAgLSBgZXhjZXB0YCB7QXJyYXl9IHNpZHMgdGhhdCBzaG91bGQgYmUgZXhjbHVkZWRcbiAgICAgKiAgLSBgcm9vbXNgIHtBcnJheX0gbGlzdCBvZiByb29tcyB0byBicm9hZGNhc3QgdG9cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYWNrZXQgICB0aGUgcGFja2V0IG9iamVjdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzICAgICB0aGUgb3B0aW9uc1xuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBicm9hZGNhc3QocGFja2V0LCBvcHRzKSB7XG4gICAgICAgIGNvbnN0IGZsYWdzID0gb3B0cy5mbGFncyB8fCB7fTtcbiAgICAgICAgY29uc3QgcGFja2V0T3B0cyA9IHtcbiAgICAgICAgICAgIHByZUVuY29kZWQ6IHRydWUsXG4gICAgICAgICAgICB2b2xhdGlsZTogZmxhZ3Mudm9sYXRpbGUsXG4gICAgICAgICAgICBjb21wcmVzczogZmxhZ3MuY29tcHJlc3NcbiAgICAgICAgfTtcbiAgICAgICAgcGFja2V0Lm5zcCA9IHRoaXMubnNwLm5hbWU7XG4gICAgICAgIGNvbnN0IGVuY29kZWRQYWNrZXRzID0gdGhpcy5lbmNvZGVyLmVuY29kZShwYWNrZXQpO1xuICAgICAgICB0aGlzLmFwcGx5KG9wdHMsIHNvY2tldCA9PiB7XG4gICAgICAgICAgICBzb2NrZXQuY2xpZW50LndyaXRlVG9FbmdpbmUoZW5jb2RlZFBhY2tldHMsIHBhY2tldE9wdHMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyBhIGxpc3Qgb2Ygc29ja2V0cyBieSBzaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1NldDxSb29tPn0gcm9vbXMgICB0aGUgZXhwbGljaXQgc2V0IG9mIHJvb21zIHRvIGNoZWNrLlxuICAgICAqL1xuICAgIHNvY2tldHMocm9vbXMpIHtcbiAgICAgICAgY29uc3Qgc2lkcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5hcHBseSh7IHJvb21zIH0sIHNvY2tldCA9PiB7XG4gICAgICAgICAgICBzaWRzLmFkZChzb2NrZXQuaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShzaWRzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgbGlzdCBvZiByb29tcyBhIGdpdmVuIHNvY2tldCBoYXMgam9pbmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTb2NrZXRJZH0gaWQgICB0aGUgc29ja2V0IGlkXG4gICAgICovXG4gICAgc29ja2V0Um9vbXMoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2lkcy5nZXQoaWQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXRjaGluZyBzb2NrZXQgaW5zdGFuY2VzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0cyAtIHRoZSBmaWx0ZXJzIHRvIGFwcGx5XG4gICAgICovXG4gICAgZmV0Y2hTb2NrZXRzKG9wdHMpIHtcbiAgICAgICAgY29uc3Qgc29ja2V0cyA9IFtdO1xuICAgICAgICB0aGlzLmFwcGx5KG9wdHMsIHNvY2tldCA9PiB7XG4gICAgICAgICAgICBzb2NrZXRzLnB1c2goc29ja2V0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoc29ja2V0cyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1ha2VzIHRoZSBtYXRjaGluZyBzb2NrZXQgaW5zdGFuY2VzIGpvaW4gdGhlIHNwZWNpZmllZCByb29tc1xuICAgICAqXG4gICAgICogQHBhcmFtIG9wdHMgLSB0aGUgZmlsdGVycyB0byBhcHBseVxuICAgICAqIEBwYXJhbSByb29tcyAtIHRoZSByb29tcyB0byBqb2luXG4gICAgICovXG4gICAgYWRkU29ja2V0cyhvcHRzLCByb29tcykge1xuICAgICAgICB0aGlzLmFwcGx5KG9wdHMsIHNvY2tldCA9PiB7XG4gICAgICAgICAgICBzb2NrZXQuam9pbihyb29tcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYWtlcyB0aGUgbWF0Y2hpbmcgc29ja2V0IGluc3RhbmNlcyBsZWF2ZSB0aGUgc3BlY2lmaWVkIHJvb21zXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0cyAtIHRoZSBmaWx0ZXJzIHRvIGFwcGx5XG4gICAgICogQHBhcmFtIHJvb21zIC0gdGhlIHJvb21zIHRvIGxlYXZlXG4gICAgICovXG4gICAgZGVsU29ja2V0cyhvcHRzLCByb29tcykge1xuICAgICAgICB0aGlzLmFwcGx5KG9wdHMsIHNvY2tldCA9PiB7XG4gICAgICAgICAgICByb29tcy5mb3JFYWNoKHJvb20gPT4gc29ja2V0LmxlYXZlKHJvb20pKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1ha2VzIHRoZSBtYXRjaGluZyBzb2NrZXQgaW5zdGFuY2VzIGRpc2Nvbm5lY3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRzIC0gdGhlIGZpbHRlcnMgdG8gYXBwbHlcbiAgICAgKiBAcGFyYW0gY2xvc2UgLSB3aGV0aGVyIHRvIGNsb3NlIHRoZSB1bmRlcmx5aW5nIGNvbm5lY3Rpb25cbiAgICAgKi9cbiAgICBkaXNjb25uZWN0U29ja2V0cyhvcHRzLCBjbG9zZSkge1xuICAgICAgICB0aGlzLmFwcGx5KG9wdHMsIHNvY2tldCA9PiB7XG4gICAgICAgICAgICBzb2NrZXQuZGlzY29ubmVjdChjbG9zZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhcHBseShvcHRzLCBjYWxsYmFjaykge1xuICAgICAgICBjb25zdCByb29tcyA9IG9wdHMucm9vbXM7XG4gICAgICAgIGNvbnN0IGV4Y2VwdCA9IHRoaXMuY29tcHV0ZUV4Y2VwdFNpZHMob3B0cy5leGNlcHQpO1xuICAgICAgICBpZiAocm9vbXMuc2l6ZSkge1xuICAgICAgICAgICAgY29uc3QgaWRzID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCByb29tIG9mIHJvb21zKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnJvb21zLmhhcyhyb29tKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpZCBvZiB0aGlzLnJvb21zLmdldChyb29tKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaWRzLmhhcyhpZCkgfHwgZXhjZXB0LmhhcyhpZCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc29ja2V0ID0gdGhpcy5uc3Auc29ja2V0cy5nZXQoaWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc29ja2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhzb2NrZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWRzLmFkZChpZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtpZF0gb2YgdGhpcy5zaWRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4Y2VwdC5oYXMoaWQpKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBzb2NrZXQgPSB0aGlzLm5zcC5zb2NrZXRzLmdldChpZCk7XG4gICAgICAgICAgICAgICAgaWYgKHNvY2tldClcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soc29ja2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb21wdXRlRXhjZXB0U2lkcyhleGNlcHRSb29tcykge1xuICAgICAgICBjb25zdCBleGNlcHRTaWRzID0gbmV3IFNldCgpO1xuICAgICAgICBpZiAoZXhjZXB0Um9vbXMgJiYgZXhjZXB0Um9vbXMuc2l6ZSA+IDApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgcm9vbSBvZiBleGNlcHRSb29tcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvb21zLmhhcyhyb29tKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb21zLmdldChyb29tKS5mb3JFYWNoKHNpZCA9PiBleGNlcHRTaWRzLmFkZChzaWQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGV4Y2VwdFNpZHM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNlbmQgYSBwYWNrZXQgdG8gdGhlIG90aGVyIFNvY2tldC5JTyBzZXJ2ZXJzIGluIHRoZSBjbHVzdGVyXG4gICAgICogQHBhcmFtIHBhY2tldCAtIGFuIGFycmF5IG9mIGFyZ3VtZW50cywgd2hpY2ggbWF5IGluY2x1ZGUgYW4gYWNrbm93bGVkZ2VtZW50IGNhbGxiYWNrIGF0IHRoZSBlbmRcbiAgICAgKi9cbiAgICBzZXJ2ZXJTaWRlRW1pdChwYWNrZXQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidGhpcyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlIHNlcnZlclNpZGVFbWl0KCkgZnVuY3Rpb25hbGl0eVwiKTtcbiAgICB9XG59XG5leHBvcnRzLkFkYXB0ZXIgPSBBZGFwdGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnJlY29uc3RydWN0UGFja2V0ID0gZXhwb3J0cy5kZWNvbnN0cnVjdFBhY2tldCA9IHZvaWQgMDtcbmNvbnN0IGlzX2JpbmFyeV8xID0gcmVxdWlyZShcIi4vaXMtYmluYXJ5XCIpO1xuLyoqXG4gKiBSZXBsYWNlcyBldmVyeSBCdWZmZXIgfCBBcnJheUJ1ZmZlciB8IEJsb2IgfCBGaWxlIGluIHBhY2tldCB3aXRoIGEgbnVtYmVyZWQgcGxhY2Vob2xkZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHBhY2tldCAtIHNvY2tldC5pbyBldmVudCBwYWNrZXRcbiAqIEByZXR1cm4ge09iamVjdH0gd2l0aCBkZWNvbnN0cnVjdGVkIHBhY2tldCBhbmQgbGlzdCBvZiBidWZmZXJzXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIGRlY29uc3RydWN0UGFja2V0KHBhY2tldCkge1xuICAgIGNvbnN0IGJ1ZmZlcnMgPSBbXTtcbiAgICBjb25zdCBwYWNrZXREYXRhID0gcGFja2V0LmRhdGE7XG4gICAgY29uc3QgcGFjayA9IHBhY2tldDtcbiAgICBwYWNrLmRhdGEgPSBfZGVjb25zdHJ1Y3RQYWNrZXQocGFja2V0RGF0YSwgYnVmZmVycyk7XG4gICAgcGFjay5hdHRhY2htZW50cyA9IGJ1ZmZlcnMubGVuZ3RoOyAvLyBudW1iZXIgb2YgYmluYXJ5ICdhdHRhY2htZW50cydcbiAgICByZXR1cm4geyBwYWNrZXQ6IHBhY2ssIGJ1ZmZlcnM6IGJ1ZmZlcnMgfTtcbn1cbmV4cG9ydHMuZGVjb25zdHJ1Y3RQYWNrZXQgPSBkZWNvbnN0cnVjdFBhY2tldDtcbmZ1bmN0aW9uIF9kZWNvbnN0cnVjdFBhY2tldChkYXRhLCBidWZmZXJzKSB7XG4gICAgaWYgKCFkYXRhKVxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICBpZiAoaXNfYmluYXJ5XzEuaXNCaW5hcnkoZGF0YSkpIHtcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSB7IF9wbGFjZWhvbGRlcjogdHJ1ZSwgbnVtOiBidWZmZXJzLmxlbmd0aCB9O1xuICAgICAgICBidWZmZXJzLnB1c2goZGF0YSk7XG4gICAgICAgIHJldHVybiBwbGFjZWhvbGRlcjtcbiAgICB9XG4gICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICBjb25zdCBuZXdEYXRhID0gbmV3IEFycmF5KGRhdGEubGVuZ3RoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBuZXdEYXRhW2ldID0gX2RlY29uc3RydWN0UGFja2V0KGRhdGFbaV0sIGJ1ZmZlcnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEYXRhO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIiAmJiAhKGRhdGEgaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgICBjb25zdCBuZXdEYXRhID0ge307XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBuZXdEYXRhW2tleV0gPSBfZGVjb25zdHJ1Y3RQYWNrZXQoZGF0YVtrZXldLCBidWZmZXJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RGF0YTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG59XG4vKipcbiAqIFJlY29uc3RydWN0cyBhIGJpbmFyeSBwYWNrZXQgZnJvbSBpdHMgcGxhY2Vob2xkZXIgcGFja2V0IGFuZCBidWZmZXJzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHBhY2tldCAtIGV2ZW50IHBhY2tldCB3aXRoIHBsYWNlaG9sZGVyc1xuICogQHBhcmFtIHtBcnJheX0gYnVmZmVycyAtIGJpbmFyeSBidWZmZXJzIHRvIHB1dCBpbiBwbGFjZWhvbGRlciBwb3NpdGlvbnNcbiAqIEByZXR1cm4ge09iamVjdH0gcmVjb25zdHJ1Y3RlZCBwYWNrZXRcbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gcmVjb25zdHJ1Y3RQYWNrZXQocGFja2V0LCBidWZmZXJzKSB7XG4gICAgcGFja2V0LmRhdGEgPSBfcmVjb25zdHJ1Y3RQYWNrZXQocGFja2V0LmRhdGEsIGJ1ZmZlcnMpO1xuICAgIHBhY2tldC5hdHRhY2htZW50cyA9IHVuZGVmaW5lZDsgLy8gbm8gbG9uZ2VyIHVzZWZ1bFxuICAgIHJldHVybiBwYWNrZXQ7XG59XG5leHBvcnRzLnJlY29uc3RydWN0UGFja2V0ID0gcmVjb25zdHJ1Y3RQYWNrZXQ7XG5mdW5jdGlvbiBfcmVjb25zdHJ1Y3RQYWNrZXQoZGF0YSwgYnVmZmVycykge1xuICAgIGlmICghZGF0YSlcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgaWYgKGRhdGEgJiYgZGF0YS5fcGxhY2Vob2xkZXIpIHtcbiAgICAgICAgcmV0dXJuIGJ1ZmZlcnNbZGF0YS5udW1dOyAvLyBhcHByb3ByaWF0ZSBidWZmZXIgKHNob3VsZCBiZSBuYXR1cmFsIG9yZGVyIGFueXdheSlcbiAgICB9XG4gICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGRhdGFbaV0gPSBfcmVjb25zdHJ1Y3RQYWNrZXQoZGF0YVtpXSwgYnVmZmVycyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZGF0YSkge1xuICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGRhdGFba2V5XSA9IF9yZWNvbnN0cnVjdFBhY2tldChkYXRhW2tleV0sIGJ1ZmZlcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkRlY29kZXIgPSBleHBvcnRzLkVuY29kZXIgPSBleHBvcnRzLlBhY2tldFR5cGUgPSBleHBvcnRzLnByb3RvY29sID0gdm9pZCAwO1xuY29uc3QgRW1pdHRlciA9IHJlcXVpcmUoXCJjb21wb25lbnQtZW1pdHRlclwiKTtcbmNvbnN0IGJpbmFyeV8xID0gcmVxdWlyZShcIi4vYmluYXJ5XCIpO1xuY29uc3QgaXNfYmluYXJ5XzEgPSByZXF1aXJlKFwiLi9pcy1iaW5hcnlcIik7XG5jb25zdCBkZWJ1ZyA9IHJlcXVpcmUoXCJkZWJ1Z1wiKShcInNvY2tldC5pby1wYXJzZXJcIik7XG4vKipcbiAqIFByb3RvY29sIHZlcnNpb24uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnRzLnByb3RvY29sID0gNTtcbnZhciBQYWNrZXRUeXBlO1xuKGZ1bmN0aW9uIChQYWNrZXRUeXBlKSB7XG4gICAgUGFja2V0VHlwZVtQYWNrZXRUeXBlW1wiQ09OTkVDVFwiXSA9IDBdID0gXCJDT05ORUNUXCI7XG4gICAgUGFja2V0VHlwZVtQYWNrZXRUeXBlW1wiRElTQ09OTkVDVFwiXSA9IDFdID0gXCJESVNDT05ORUNUXCI7XG4gICAgUGFja2V0VHlwZVtQYWNrZXRUeXBlW1wiRVZFTlRcIl0gPSAyXSA9IFwiRVZFTlRcIjtcbiAgICBQYWNrZXRUeXBlW1BhY2tldFR5cGVbXCJBQ0tcIl0gPSAzXSA9IFwiQUNLXCI7XG4gICAgUGFja2V0VHlwZVtQYWNrZXRUeXBlW1wiQ09OTkVDVF9FUlJPUlwiXSA9IDRdID0gXCJDT05ORUNUX0VSUk9SXCI7XG4gICAgUGFja2V0VHlwZVtQYWNrZXRUeXBlW1wiQklOQVJZX0VWRU5UXCJdID0gNV0gPSBcIkJJTkFSWV9FVkVOVFwiO1xuICAgIFBhY2tldFR5cGVbUGFja2V0VHlwZVtcIkJJTkFSWV9BQ0tcIl0gPSA2XSA9IFwiQklOQVJZX0FDS1wiO1xufSkoUGFja2V0VHlwZSA9IGV4cG9ydHMuUGFja2V0VHlwZSB8fCAoZXhwb3J0cy5QYWNrZXRUeXBlID0ge30pKTtcbi8qKlxuICogQSBzb2NrZXQuaW8gRW5jb2RlciBpbnN0YW5jZVxuICovXG5jbGFzcyBFbmNvZGVyIHtcbiAgICAvKipcbiAgICAgKiBFbmNvZGUgYSBwYWNrZXQgYXMgYSBzaW5nbGUgc3RyaW5nIGlmIG5vbi1iaW5hcnksIG9yIGFzIGFcbiAgICAgKiBidWZmZXIgc2VxdWVuY2UsIGRlcGVuZGluZyBvbiBwYWNrZXQgdHlwZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogLSBwYWNrZXQgb2JqZWN0XG4gICAgICovXG4gICAgZW5jb2RlKG9iaikge1xuICAgICAgICBkZWJ1ZyhcImVuY29kaW5nIHBhY2tldCAlalwiLCBvYmopO1xuICAgICAgICBpZiAob2JqLnR5cGUgPT09IFBhY2tldFR5cGUuRVZFTlQgfHwgb2JqLnR5cGUgPT09IFBhY2tldFR5cGUuQUNLKSB7XG4gICAgICAgICAgICBpZiAoaXNfYmluYXJ5XzEuaGFzQmluYXJ5KG9iaikpIHtcbiAgICAgICAgICAgICAgICBvYmoudHlwZSA9XG4gICAgICAgICAgICAgICAgICAgIG9iai50eXBlID09PSBQYWNrZXRUeXBlLkVWRU5UXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFBhY2tldFR5cGUuQklOQVJZX0VWRU5UXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFBhY2tldFR5cGUuQklOQVJZX0FDSztcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGVBc0JpbmFyeShvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbdGhpcy5lbmNvZGVBc1N0cmluZyhvYmopXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRW5jb2RlIHBhY2tldCBhcyBzdHJpbmcuXG4gICAgICovXG4gICAgZW5jb2RlQXNTdHJpbmcob2JqKSB7XG4gICAgICAgIC8vIGZpcnN0IGlzIHR5cGVcbiAgICAgICAgbGV0IHN0ciA9IFwiXCIgKyBvYmoudHlwZTtcbiAgICAgICAgLy8gYXR0YWNobWVudHMgaWYgd2UgaGF2ZSB0aGVtXG4gICAgICAgIGlmIChvYmoudHlwZSA9PT0gUGFja2V0VHlwZS5CSU5BUllfRVZFTlQgfHxcbiAgICAgICAgICAgIG9iai50eXBlID09PSBQYWNrZXRUeXBlLkJJTkFSWV9BQ0spIHtcbiAgICAgICAgICAgIHN0ciArPSBvYmouYXR0YWNobWVudHMgKyBcIi1cIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiB3ZSBoYXZlIGEgbmFtZXNwYWNlIG90aGVyIHRoYW4gYC9gXG4gICAgICAgIC8vIHdlIGFwcGVuZCBpdCBmb2xsb3dlZCBieSBhIGNvbW1hIGAsYFxuICAgICAgICBpZiAob2JqLm5zcCAmJiBcIi9cIiAhPT0gb2JqLm5zcCkge1xuICAgICAgICAgICAgc3RyICs9IG9iai5uc3AgKyBcIixcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBpbW1lZGlhdGVseSBmb2xsb3dlZCBieSB0aGUgaWRcbiAgICAgICAgaWYgKG51bGwgIT0gb2JqLmlkKSB7XG4gICAgICAgICAgICBzdHIgKz0gb2JqLmlkO1xuICAgICAgICB9XG4gICAgICAgIC8vIGpzb24gZGF0YVxuICAgICAgICBpZiAobnVsbCAhPSBvYmouZGF0YSkge1xuICAgICAgICAgICAgc3RyICs9IEpTT04uc3RyaW5naWZ5KG9iai5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBkZWJ1ZyhcImVuY29kZWQgJWogYXMgJXNcIiwgb2JqLCBzdHIpO1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFbmNvZGUgcGFja2V0IGFzICdidWZmZXIgc2VxdWVuY2UnIGJ5IHJlbW92aW5nIGJsb2JzLCBhbmRcbiAgICAgKiBkZWNvbnN0cnVjdGluZyBwYWNrZXQgaW50byBvYmplY3Qgd2l0aCBwbGFjZWhvbGRlcnMgYW5kXG4gICAgICogYSBsaXN0IG9mIGJ1ZmZlcnMuXG4gICAgICovXG4gICAgZW5jb2RlQXNCaW5hcnkob2JqKSB7XG4gICAgICAgIGNvbnN0IGRlY29uc3RydWN0aW9uID0gYmluYXJ5XzEuZGVjb25zdHJ1Y3RQYWNrZXQob2JqKTtcbiAgICAgICAgY29uc3QgcGFjayA9IHRoaXMuZW5jb2RlQXNTdHJpbmcoZGVjb25zdHJ1Y3Rpb24ucGFja2V0KTtcbiAgICAgICAgY29uc3QgYnVmZmVycyA9IGRlY29uc3RydWN0aW9uLmJ1ZmZlcnM7XG4gICAgICAgIGJ1ZmZlcnMudW5zaGlmdChwYWNrKTsgLy8gYWRkIHBhY2tldCBpbmZvIHRvIGJlZ2lubmluZyBvZiBkYXRhIGxpc3RcbiAgICAgICAgcmV0dXJuIGJ1ZmZlcnM7IC8vIHdyaXRlIGFsbCB0aGUgYnVmZmVyc1xuICAgIH1cbn1cbmV4cG9ydHMuRW5jb2RlciA9IEVuY29kZXI7XG4vKipcbiAqIEEgc29ja2V0LmlvIERlY29kZXIgaW5zdGFuY2VcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IGRlY29kZXJcbiAqL1xuY2xhc3MgRGVjb2RlciBleHRlbmRzIEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEZWNvZGVzIGFuIGVuY29kZWQgcGFja2V0IHN0cmluZyBpbnRvIHBhY2tldCBKU09OLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9iaiAtIGVuY29kZWQgcGFja2V0XG4gICAgICovXG4gICAgYWRkKG9iaikge1xuICAgICAgICBsZXQgcGFja2V0O1xuICAgICAgICBpZiAodHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcGFja2V0ID0gdGhpcy5kZWNvZGVTdHJpbmcob2JqKTtcbiAgICAgICAgICAgIGlmIChwYWNrZXQudHlwZSA9PT0gUGFja2V0VHlwZS5CSU5BUllfRVZFTlQgfHxcbiAgICAgICAgICAgICAgICBwYWNrZXQudHlwZSA9PT0gUGFja2V0VHlwZS5CSU5BUllfQUNLKSB7XG4gICAgICAgICAgICAgICAgLy8gYmluYXJ5IHBhY2tldCdzIGpzb25cbiAgICAgICAgICAgICAgICB0aGlzLnJlY29uc3RydWN0b3IgPSBuZXcgQmluYXJ5UmVjb25zdHJ1Y3RvcihwYWNrZXQpO1xuICAgICAgICAgICAgICAgIC8vIG5vIGF0dGFjaG1lbnRzLCBsYWJlbGVkIGJpbmFyeSBidXQgbm8gYmluYXJ5IGRhdGEgdG8gZm9sbG93XG4gICAgICAgICAgICAgICAgaWYgKHBhY2tldC5hdHRhY2htZW50cyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzdXBlci5lbWl0KFwiZGVjb2RlZFwiLCBwYWNrZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG5vbi1iaW5hcnkgZnVsbCBwYWNrZXRcbiAgICAgICAgICAgICAgICBzdXBlci5lbWl0KFwiZGVjb2RlZFwiLCBwYWNrZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzX2JpbmFyeV8xLmlzQmluYXJ5KG9iaikgfHwgb2JqLmJhc2U2NCkge1xuICAgICAgICAgICAgLy8gcmF3IGJpbmFyeSBkYXRhXG4gICAgICAgICAgICBpZiAoIXRoaXMucmVjb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImdvdCBiaW5hcnkgZGF0YSB3aGVuIG5vdCByZWNvbnN0cnVjdGluZyBhIHBhY2tldFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhY2tldCA9IHRoaXMucmVjb25zdHJ1Y3Rvci50YWtlQmluYXJ5RGF0YShvYmopO1xuICAgICAgICAgICAgICAgIGlmIChwYWNrZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVjZWl2ZWQgZmluYWwgYnVmZmVyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVjb25zdHJ1Y3RvciA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHN1cGVyLmVtaXQoXCJkZWNvZGVkXCIsIHBhY2tldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biB0eXBlOiBcIiArIG9iaik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogRGVjb2RlIGEgcGFja2V0IFN0cmluZyAoSlNPTiBkYXRhKVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICAqIEByZXR1cm4ge09iamVjdH0gcGFja2V0XG4gICAgICovXG4gICAgZGVjb2RlU3RyaW5nKHN0cikge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIC8vIGxvb2sgdXAgdHlwZVxuICAgICAgICBjb25zdCBwID0ge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyKHN0ci5jaGFyQXQoMCkpLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoUGFja2V0VHlwZVtwLnR5cGVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gcGFja2V0IHR5cGUgXCIgKyBwLnR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGxvb2sgdXAgYXR0YWNobWVudHMgaWYgdHlwZSBiaW5hcnlcbiAgICAgICAgaWYgKHAudHlwZSA9PT0gUGFja2V0VHlwZS5CSU5BUllfRVZFTlQgfHxcbiAgICAgICAgICAgIHAudHlwZSA9PT0gUGFja2V0VHlwZS5CSU5BUllfQUNLKSB7XG4gICAgICAgICAgICBjb25zdCBzdGFydCA9IGkgKyAxO1xuICAgICAgICAgICAgd2hpbGUgKHN0ci5jaGFyQXQoKytpKSAhPT0gXCItXCIgJiYgaSAhPSBzdHIubGVuZ3RoKSB7IH1cbiAgICAgICAgICAgIGNvbnN0IGJ1ZiA9IHN0ci5zdWJzdHJpbmcoc3RhcnQsIGkpO1xuICAgICAgICAgICAgaWYgKGJ1ZiAhPSBOdW1iZXIoYnVmKSB8fCBzdHIuY2hhckF0KGkpICE9PSBcIi1cIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIklsbGVnYWwgYXR0YWNobWVudHNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwLmF0dGFjaG1lbnRzID0gTnVtYmVyKGJ1Zik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbG9vayB1cCBuYW1lc3BhY2UgKGlmIGFueSlcbiAgICAgICAgaWYgKFwiL1wiID09PSBzdHIuY2hhckF0KGkgKyAxKSkge1xuICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgIHdoaWxlICgrK2kpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjID0gc3RyLmNoYXJBdChpKTtcbiAgICAgICAgICAgICAgICBpZiAoXCIsXCIgPT09IGMpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSBzdHIubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHAubnNwID0gc3RyLnN1YnN0cmluZyhzdGFydCwgaSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwLm5zcCA9IFwiL1wiO1xuICAgICAgICB9XG4gICAgICAgIC8vIGxvb2sgdXAgaWRcbiAgICAgICAgY29uc3QgbmV4dCA9IHN0ci5jaGFyQXQoaSArIDEpO1xuICAgICAgICBpZiAoXCJcIiAhPT0gbmV4dCAmJiBOdW1iZXIobmV4dCkgPT0gbmV4dCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgIHdoaWxlICgrK2kpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjID0gc3RyLmNoYXJBdChpKTtcbiAgICAgICAgICAgICAgICBpZiAobnVsbCA9PSBjIHx8IE51bWJlcihjKSAhPSBjKSB7XG4gICAgICAgICAgICAgICAgICAgIC0taTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpID09PSBzdHIubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHAuaWQgPSBOdW1iZXIoc3RyLnN1YnN0cmluZyhzdGFydCwgaSArIDEpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBsb29rIHVwIGpzb24gZGF0YVxuICAgICAgICBpZiAoc3RyLmNoYXJBdCgrK2kpKSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdHJ5UGFyc2Uoc3RyLnN1YnN0cihpKSk7XG4gICAgICAgICAgICBpZiAoRGVjb2Rlci5pc1BheWxvYWRWYWxpZChwLnR5cGUsIHBheWxvYWQpKSB7XG4gICAgICAgICAgICAgICAgcC5kYXRhID0gcGF5bG9hZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgcGF5bG9hZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkZWJ1ZyhcImRlY29kZWQgJXMgYXMgJWpcIiwgc3RyLCBwKTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICAgIHN0YXRpYyBpc1BheWxvYWRWYWxpZCh0eXBlLCBwYXlsb2FkKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBQYWNrZXRUeXBlLkNPTk5FQ1Q6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBwYXlsb2FkID09PSBcIm9iamVjdFwiO1xuICAgICAgICAgICAgY2FzZSBQYWNrZXRUeXBlLkRJU0NPTk5FQ1Q6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNhc2UgUGFja2V0VHlwZS5DT05ORUNUX0VSUk9SOlxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgcGF5bG9hZCA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgcGF5bG9hZCA9PT0gXCJvYmplY3RcIjtcbiAgICAgICAgICAgIGNhc2UgUGFja2V0VHlwZS5FVkVOVDpcbiAgICAgICAgICAgIGNhc2UgUGFja2V0VHlwZS5CSU5BUllfRVZFTlQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkocGF5bG9hZCkgJiYgcGF5bG9hZC5sZW5ndGggPiAwO1xuICAgICAgICAgICAgY2FzZSBQYWNrZXRUeXBlLkFDSzpcbiAgICAgICAgICAgIGNhc2UgUGFja2V0VHlwZS5CSU5BUllfQUNLOlxuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHBheWxvYWQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERlYWxsb2NhdGVzIGEgcGFyc2VyJ3MgcmVzb3VyY2VzXG4gICAgICovXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVjb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgdGhpcy5yZWNvbnN0cnVjdG9yLmZpbmlzaGVkUmVjb25zdHJ1Y3Rpb24oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuRGVjb2RlciA9IERlY29kZXI7XG5mdW5jdGlvbiB0cnlQYXJzZShzdHIpIHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShzdHIpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuLyoqXG4gKiBBIG1hbmFnZXIgb2YgYSBiaW5hcnkgZXZlbnQncyAnYnVmZmVyIHNlcXVlbmNlJy4gU2hvdWxkXG4gKiBiZSBjb25zdHJ1Y3RlZCB3aGVuZXZlciBhIHBhY2tldCBvZiB0eXBlIEJJTkFSWV9FVkVOVCBpc1xuICogZGVjb2RlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcGFja2V0XG4gKiBAcmV0dXJuIHtCaW5hcnlSZWNvbnN0cnVjdG9yfSBpbml0aWFsaXplZCByZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIEJpbmFyeVJlY29uc3RydWN0b3Ige1xuICAgIGNvbnN0cnVjdG9yKHBhY2tldCkge1xuICAgICAgICB0aGlzLnBhY2tldCA9IHBhY2tldDtcbiAgICAgICAgdGhpcy5idWZmZXJzID0gW107XG4gICAgICAgIHRoaXMucmVjb25QYWNrID0gcGFja2V0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNZXRob2QgdG8gYmUgY2FsbGVkIHdoZW4gYmluYXJ5IGRhdGEgcmVjZWl2ZWQgZnJvbSBjb25uZWN0aW9uXG4gICAgICogYWZ0ZXIgYSBCSU5BUllfRVZFTlQgcGFja2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCdWZmZXIgfCBBcnJheUJ1ZmZlcn0gYmluRGF0YSAtIHRoZSByYXcgYmluYXJ5IGRhdGEgcmVjZWl2ZWRcbiAgICAgKiBAcmV0dXJuIHtudWxsIHwgT2JqZWN0fSByZXR1cm5zIG51bGwgaWYgbW9yZSBiaW5hcnkgZGF0YSBpcyBleHBlY3RlZCBvclxuICAgICAqICAgYSByZWNvbnN0cnVjdGVkIHBhY2tldCBvYmplY3QgaWYgYWxsIGJ1ZmZlcnMgaGF2ZSBiZWVuIHJlY2VpdmVkLlxuICAgICAqL1xuICAgIHRha2VCaW5hcnlEYXRhKGJpbkRhdGEpIHtcbiAgICAgICAgdGhpcy5idWZmZXJzLnB1c2goYmluRGF0YSk7XG4gICAgICAgIGlmICh0aGlzLmJ1ZmZlcnMubGVuZ3RoID09PSB0aGlzLnJlY29uUGFjay5hdHRhY2htZW50cykge1xuICAgICAgICAgICAgLy8gZG9uZSB3aXRoIGJ1ZmZlciBsaXN0XG4gICAgICAgICAgICBjb25zdCBwYWNrZXQgPSBiaW5hcnlfMS5yZWNvbnN0cnVjdFBhY2tldCh0aGlzLnJlY29uUGFjaywgdGhpcy5idWZmZXJzKTtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoZWRSZWNvbnN0cnVjdGlvbigpO1xuICAgICAgICAgICAgcmV0dXJuIHBhY2tldDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xlYW5zIHVwIGJpbmFyeSBwYWNrZXQgcmVjb25zdHJ1Y3Rpb24gdmFyaWFibGVzLlxuICAgICAqL1xuICAgIGZpbmlzaGVkUmVjb25zdHJ1Y3Rpb24oKSB7XG4gICAgICAgIHRoaXMucmVjb25QYWNrID0gbnVsbDtcbiAgICAgICAgdGhpcy5idWZmZXJzID0gW107XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhc0JpbmFyeSA9IGV4cG9ydHMuaXNCaW5hcnkgPSB2b2lkIDA7XG5jb25zdCB3aXRoTmF0aXZlQXJyYXlCdWZmZXIgPSB0eXBlb2YgQXJyYXlCdWZmZXIgPT09IFwiZnVuY3Rpb25cIjtcbmNvbnN0IGlzVmlldyA9IChvYmopID0+IHtcbiAgICByZXR1cm4gdHlwZW9mIEFycmF5QnVmZmVyLmlzVmlldyA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgID8gQXJyYXlCdWZmZXIuaXNWaWV3KG9iailcbiAgICAgICAgOiBvYmouYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXI7XG59O1xuY29uc3QgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuY29uc3Qgd2l0aE5hdGl2ZUJsb2IgPSB0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiIHx8XG4gICAgKHR5cGVvZiBCbG9iICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgIHRvU3RyaW5nLmNhbGwoQmxvYikgPT09IFwiW29iamVjdCBCbG9iQ29uc3RydWN0b3JdXCIpO1xuY29uc3Qgd2l0aE5hdGl2ZUZpbGUgPSB0eXBlb2YgRmlsZSA9PT0gXCJmdW5jdGlvblwiIHx8XG4gICAgKHR5cGVvZiBGaWxlICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgIHRvU3RyaW5nLmNhbGwoRmlsZSkgPT09IFwiW29iamVjdCBGaWxlQ29uc3RydWN0b3JdXCIpO1xuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgb2JqIGlzIGEgQnVmZmVyLCBhbiBBcnJheUJ1ZmZlciwgYSBCbG9iIG9yIGEgRmlsZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBpc0JpbmFyeShvYmopIHtcbiAgICByZXR1cm4gKCh3aXRoTmF0aXZlQXJyYXlCdWZmZXIgJiYgKG9iaiBpbnN0YW5jZW9mIEFycmF5QnVmZmVyIHx8IGlzVmlldyhvYmopKSkgfHxcbiAgICAgICAgKHdpdGhOYXRpdmVCbG9iICYmIG9iaiBpbnN0YW5jZW9mIEJsb2IpIHx8XG4gICAgICAgICh3aXRoTmF0aXZlRmlsZSAmJiBvYmogaW5zdGFuY2VvZiBGaWxlKSk7XG59XG5leHBvcnRzLmlzQmluYXJ5ID0gaXNCaW5hcnk7XG5mdW5jdGlvbiBoYXNCaW5hcnkob2JqLCB0b0pTT04pIHtcbiAgICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChoYXNCaW5hcnkob2JqW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGlzQmluYXJ5KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChvYmoudG9KU09OICYmXG4gICAgICAgIHR5cGVvZiBvYmoudG9KU09OID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gaGFzQmluYXJ5KG9iai50b0pTT04oKSwgdHJ1ZSk7XG4gICAgfVxuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSAmJiBoYXNCaW5hcnkob2JqW2tleV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnRzLmhhc0JpbmFyeSA9IGhhc0JpbmFyeTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFjY2VwdHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29va2llXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImRlYnVnXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV2ZW50c1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvYmplY3QtYXNzaWduXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInF1ZXJ5c3RyaW5nXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInVybFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ2YXJ5XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIndzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic3RyZWFtXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInpsaWJcIik7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkVSUk9SX1BBQ0tFVCA9IGV4cG9ydHMuUEFDS0VUX1RZUEVTX1JFVkVSU0UgPSBleHBvcnRzLlBBQ0tFVF9UWVBFUyA9IHZvaWQgMDtcbmNvbnN0IFBBQ0tFVF9UWVBFUyA9IE9iamVjdC5jcmVhdGUobnVsbCk7IC8vIG5vIE1hcCA9IG5vIHBvbHlmaWxsXG5leHBvcnRzLlBBQ0tFVF9UWVBFUyA9IFBBQ0tFVF9UWVBFUztcblBBQ0tFVF9UWVBFU1tcIm9wZW5cIl0gPSBcIjBcIjtcblBBQ0tFVF9UWVBFU1tcImNsb3NlXCJdID0gXCIxXCI7XG5QQUNLRVRfVFlQRVNbXCJwaW5nXCJdID0gXCIyXCI7XG5QQUNLRVRfVFlQRVNbXCJwb25nXCJdID0gXCIzXCI7XG5QQUNLRVRfVFlQRVNbXCJtZXNzYWdlXCJdID0gXCI0XCI7XG5QQUNLRVRfVFlQRVNbXCJ1cGdyYWRlXCJdID0gXCI1XCI7XG5QQUNLRVRfVFlQRVNbXCJub29wXCJdID0gXCI2XCI7XG5jb25zdCBQQUNLRVRfVFlQRVNfUkVWRVJTRSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5leHBvcnRzLlBBQ0tFVF9UWVBFU19SRVZFUlNFID0gUEFDS0VUX1RZUEVTX1JFVkVSU0U7XG5PYmplY3Qua2V5cyhQQUNLRVRfVFlQRVMpLmZvckVhY2goa2V5ID0+IHtcbiAgICBQQUNLRVRfVFlQRVNfUkVWRVJTRVtQQUNLRVRfVFlQRVNba2V5XV0gPSBrZXk7XG59KTtcbmNvbnN0IEVSUk9SX1BBQ0tFVCA9IHsgdHlwZTogXCJlcnJvclwiLCBkYXRhOiBcInBhcnNlciBlcnJvclwiIH07XG5leHBvcnRzLkVSUk9SX1BBQ0tFVCA9IEVSUk9SX1BBQ0tFVDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY29tbW9uc19qc18xID0gcmVxdWlyZShcIi4vY29tbW9ucy5qc1wiKTtcbmNvbnN0IGRlY29kZVBhY2tldCA9IChlbmNvZGVkUGFja2V0LCBiaW5hcnlUeXBlKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBlbmNvZGVkUGFja2V0ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgICAgIGRhdGE6IG1hcEJpbmFyeShlbmNvZGVkUGFja2V0LCBiaW5hcnlUeXBlKVxuICAgICAgICB9O1xuICAgIH1cbiAgICBjb25zdCB0eXBlID0gZW5jb2RlZFBhY2tldC5jaGFyQXQoMCk7XG4gICAgaWYgKHR5cGUgPT09IFwiYlwiKSB7XG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGVuY29kZWRQYWNrZXQuc3Vic3RyaW5nKDEpLCBcImJhc2U2NFwiKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgZGF0YTogbWFwQmluYXJ5KGJ1ZmZlciwgYmluYXJ5VHlwZSlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKCFjb21tb25zX2pzXzEuUEFDS0VUX1RZUEVTX1JFVkVSU0VbdHlwZV0pIHtcbiAgICAgICAgcmV0dXJuIGNvbW1vbnNfanNfMS5FUlJPUl9QQUNLRVQ7XG4gICAgfVxuICAgIHJldHVybiBlbmNvZGVkUGFja2V0Lmxlbmd0aCA+IDFcbiAgICAgICAgPyB7XG4gICAgICAgICAgICB0eXBlOiBjb21tb25zX2pzXzEuUEFDS0VUX1RZUEVTX1JFVkVSU0VbdHlwZV0sXG4gICAgICAgICAgICBkYXRhOiBlbmNvZGVkUGFja2V0LnN1YnN0cmluZygxKVxuICAgICAgICB9XG4gICAgICAgIDoge1xuICAgICAgICAgICAgdHlwZTogY29tbW9uc19qc18xLlBBQ0tFVF9UWVBFU19SRVZFUlNFW3R5cGVdXG4gICAgICAgIH07XG59O1xuY29uc3QgbWFwQmluYXJ5ID0gKGRhdGEsIGJpbmFyeVR5cGUpID0+IHtcbiAgICBjb25zdCBpc0J1ZmZlciA9IEJ1ZmZlci5pc0J1ZmZlcihkYXRhKTtcbiAgICBzd2l0Y2ggKGJpbmFyeVR5cGUpIHtcbiAgICAgICAgY2FzZSBcImFycmF5YnVmZmVyXCI6XG4gICAgICAgICAgICByZXR1cm4gaXNCdWZmZXIgPyB0b0FycmF5QnVmZmVyKGRhdGEpIDogZGF0YTtcbiAgICAgICAgY2FzZSBcIm5vZGVidWZmZXJcIjpcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBkYXRhOyAvLyBhc3N1bWluZyB0aGUgZGF0YSBpcyBhbHJlYWR5IGEgQnVmZmVyXG4gICAgfVxufTtcbmNvbnN0IHRvQXJyYXlCdWZmZXIgPSBidWZmZXIgPT4ge1xuICAgIGNvbnN0IGFycmF5QnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGJ1ZmZlci5sZW5ndGgpO1xuICAgIGNvbnN0IHZpZXcgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWZmZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmlld1tpXSA9IGJ1ZmZlcltpXTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5QnVmZmVyO1xufTtcbmV4cG9ydHMuZGVmYXVsdCA9IGRlY29kZVBhY2tldDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY29tbW9uc19qc18xID0gcmVxdWlyZShcIi4vY29tbW9ucy5qc1wiKTtcbmNvbnN0IGVuY29kZVBhY2tldCA9ICh7IHR5cGUsIGRhdGEgfSwgc3VwcG9ydHNCaW5hcnksIGNhbGxiYWNrKSA9PiB7XG4gICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fCBBcnJheUJ1ZmZlci5pc1ZpZXcoZGF0YSkpIHtcbiAgICAgICAgY29uc3QgYnVmZmVyID0gdG9CdWZmZXIoZGF0YSk7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlbmNvZGVCdWZmZXIoYnVmZmVyLCBzdXBwb3J0c0JpbmFyeSkpO1xuICAgIH1cbiAgICAvLyBwbGFpbiBzdHJpbmdcbiAgICByZXR1cm4gY2FsbGJhY2soY29tbW9uc19qc18xLlBBQ0tFVF9UWVBFU1t0eXBlXSArIChkYXRhIHx8IFwiXCIpKTtcbn07XG5jb25zdCB0b0J1ZmZlciA9IGRhdGEgPT4ge1xuICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gQnVmZmVyLmZyb20oZGF0YSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gQnVmZmVyLmZyb20oZGF0YS5idWZmZXIsIGRhdGEuYnl0ZU9mZnNldCwgZGF0YS5ieXRlTGVuZ3RoKTtcbiAgICB9XG59O1xuLy8gb25seSAnbWVzc2FnZScgcGFja2V0cyBjYW4gY29udGFpbiBiaW5hcnksIHNvIHRoZSB0eXBlIHByZWZpeCBpcyBub3QgbmVlZGVkXG5jb25zdCBlbmNvZGVCdWZmZXIgPSAoZGF0YSwgc3VwcG9ydHNCaW5hcnkpID0+IHtcbiAgICByZXR1cm4gc3VwcG9ydHNCaW5hcnkgPyBkYXRhIDogXCJiXCIgKyBkYXRhLnRvU3RyaW5nKFwiYmFzZTY0XCIpO1xufTtcbmV4cG9ydHMuZGVmYXVsdCA9IGVuY29kZVBhY2tldDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWNvZGVQYXlsb2FkID0gZXhwb3J0cy5kZWNvZGVQYWNrZXQgPSBleHBvcnRzLmVuY29kZVBheWxvYWQgPSBleHBvcnRzLmVuY29kZVBhY2tldCA9IGV4cG9ydHMucHJvdG9jb2wgPSB2b2lkIDA7XG5jb25zdCBlbmNvZGVQYWNrZXRfanNfMSA9IHJlcXVpcmUoXCIuL2VuY29kZVBhY2tldC5qc1wiKTtcbmV4cG9ydHMuZW5jb2RlUGFja2V0ID0gZW5jb2RlUGFja2V0X2pzXzEuZGVmYXVsdDtcbmNvbnN0IGRlY29kZVBhY2tldF9qc18xID0gcmVxdWlyZShcIi4vZGVjb2RlUGFja2V0LmpzXCIpO1xuZXhwb3J0cy5kZWNvZGVQYWNrZXQgPSBkZWNvZGVQYWNrZXRfanNfMS5kZWZhdWx0O1xuY29uc3QgU0VQQVJBVE9SID0gU3RyaW5nLmZyb21DaGFyQ29kZSgzMCk7IC8vIHNlZSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9EZWxpbWl0ZXIjQVNDSUlfZGVsaW1pdGVkX3RleHRcbmNvbnN0IGVuY29kZVBheWxvYWQgPSAocGFja2V0cywgY2FsbGJhY2spID0+IHtcbiAgICAvLyBzb21lIHBhY2tldHMgbWF5IGJlIGFkZGVkIHRvIHRoZSBhcnJheSB3aGlsZSBlbmNvZGluZywgc28gdGhlIGluaXRpYWwgbGVuZ3RoIG11c3QgYmUgc2F2ZWRcbiAgICBjb25zdCBsZW5ndGggPSBwYWNrZXRzLmxlbmd0aDtcbiAgICBjb25zdCBlbmNvZGVkUGFja2V0cyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgcGFja2V0cy5mb3JFYWNoKChwYWNrZXQsIGkpID0+IHtcbiAgICAgICAgLy8gZm9yY2UgYmFzZTY0IGVuY29kaW5nIGZvciBiaW5hcnkgcGFja2V0c1xuICAgICAgICAoMCwgZW5jb2RlUGFja2V0X2pzXzEuZGVmYXVsdCkocGFja2V0LCBmYWxzZSwgZW5jb2RlZFBhY2tldCA9PiB7XG4gICAgICAgICAgICBlbmNvZGVkUGFja2V0c1tpXSA9IGVuY29kZWRQYWNrZXQ7XG4gICAgICAgICAgICBpZiAoKytjb3VudCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZW5jb2RlZFBhY2tldHMuam9pbihTRVBBUkFUT1IpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuZXhwb3J0cy5lbmNvZGVQYXlsb2FkID0gZW5jb2RlUGF5bG9hZDtcbmNvbnN0IGRlY29kZVBheWxvYWQgPSAoZW5jb2RlZFBheWxvYWQsIGJpbmFyeVR5cGUpID0+IHtcbiAgICBjb25zdCBlbmNvZGVkUGFja2V0cyA9IGVuY29kZWRQYXlsb2FkLnNwbGl0KFNFUEFSQVRPUik7XG4gICAgY29uc3QgcGFja2V0cyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW5jb2RlZFBhY2tldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGVjb2RlZFBhY2tldCA9ICgwLCBkZWNvZGVQYWNrZXRfanNfMS5kZWZhdWx0KShlbmNvZGVkUGFja2V0c1tpXSwgYmluYXJ5VHlwZSk7XG4gICAgICAgIHBhY2tldHMucHVzaChkZWNvZGVkUGFja2V0KTtcbiAgICAgICAgaWYgKGRlY29kZWRQYWNrZXQudHlwZSA9PT0gXCJlcnJvclwiKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFja2V0cztcbn07XG5leHBvcnRzLmRlY29kZVBheWxvYWQgPSBkZWNvZGVQYXlsb2FkO1xuZXhwb3J0cy5wcm90b2NvbCA9IDQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucHJvdG9jb2wgPSBleHBvcnRzLlRyYW5zcG9ydCA9IGV4cG9ydHMuU29ja2V0ID0gZXhwb3J0cy51U2VydmVyID0gZXhwb3J0cy5wYXJzZXIgPSBleHBvcnRzLmF0dGFjaCA9IGV4cG9ydHMubGlzdGVuID0gZXhwb3J0cy50cmFuc3BvcnRzID0gZXhwb3J0cy5TZXJ2ZXIgPSB2b2lkIDA7XG5jb25zdCBodHRwXzEgPSByZXF1aXJlKFwiaHR0cFwiKTtcbmNvbnN0IHNlcnZlcl8xID0gcmVxdWlyZShcIi4vc2VydmVyXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiU2VydmVyXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBzZXJ2ZXJfMS5TZXJ2ZXI7IH0gfSk7XG5jb25zdCBpbmRleF8xID0gcmVxdWlyZShcIi4vdHJhbnNwb3J0cy9pbmRleFwiKTtcbmV4cG9ydHMudHJhbnNwb3J0cyA9IGluZGV4XzEuZGVmYXVsdDtcbmNvbnN0IHBhcnNlciA9IHJlcXVpcmUoXCJlbmdpbmUuaW8tcGFyc2VyXCIpO1xuZXhwb3J0cy5wYXJzZXIgPSBwYXJzZXI7XG52YXIgdXNlcnZlcl8xID0gcmVxdWlyZShcIi4vdXNlcnZlclwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcInVTZXJ2ZXJcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVzZXJ2ZXJfMS51U2VydmVyOyB9IH0pO1xudmFyIHNvY2tldF8xID0gcmVxdWlyZShcIi4vc29ja2V0XCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiU29ja2V0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBzb2NrZXRfMS5Tb2NrZXQ7IH0gfSk7XG52YXIgdHJhbnNwb3J0XzEgPSByZXF1aXJlKFwiLi90cmFuc3BvcnRcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJUcmFuc3BvcnRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRyYW5zcG9ydF8xLlRyYW5zcG9ydDsgfSB9KTtcbmV4cG9ydHMucHJvdG9jb2wgPSBwYXJzZXIucHJvdG9jb2w7XG4vKipcbiAqIENyZWF0ZXMgYW4gaHR0cC5TZXJ2ZXIgZXhjbHVzaXZlbHkgdXNlZCBmb3IgV1MgdXBncmFkZXMuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHBvcnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7U2VydmVyfSB3ZWJzb2NrZXQuaW8gc2VydmVyXG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBsaXN0ZW4ocG9ydCwgb3B0aW9ucywgZm4pIHtcbiAgICBpZiAoXCJmdW5jdGlvblwiID09PSB0eXBlb2Ygb3B0aW9ucykge1xuICAgICAgICBmbiA9IG9wdGlvbnM7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgY29uc3Qgc2VydmVyID0gKDAsIGh0dHBfMS5jcmVhdGVTZXJ2ZXIpKGZ1bmN0aW9uIChyZXEsIHJlcykge1xuICAgICAgICByZXMud3JpdGVIZWFkKDUwMSk7XG4gICAgICAgIHJlcy5lbmQoXCJOb3QgSW1wbGVtZW50ZWRcIik7XG4gICAgfSk7XG4gICAgLy8gY3JlYXRlIGVuZ2luZSBzZXJ2ZXJcbiAgICBjb25zdCBlbmdpbmUgPSBhdHRhY2goc2VydmVyLCBvcHRpb25zKTtcbiAgICBlbmdpbmUuaHR0cFNlcnZlciA9IHNlcnZlcjtcbiAgICBzZXJ2ZXIubGlzdGVuKHBvcnQsIGZuKTtcbiAgICByZXR1cm4gZW5naW5lO1xufVxuZXhwb3J0cy5saXN0ZW4gPSBsaXN0ZW47XG4vKipcbiAqIENhcHR1cmVzIHVwZ3JhZGUgcmVxdWVzdHMgZm9yIGEgaHR0cC5TZXJ2ZXIuXG4gKlxuICogQHBhcmFtIHtodHRwLlNlcnZlcn0gc2VydmVyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7U2VydmVyfSBlbmdpbmUgc2VydmVyXG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBhdHRhY2goc2VydmVyLCBvcHRpb25zKSB7XG4gICAgY29uc3QgZW5naW5lID0gbmV3IHNlcnZlcl8xLlNlcnZlcihvcHRpb25zKTtcbiAgICBlbmdpbmUuYXR0YWNoKHNlcnZlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIGVuZ2luZTtcbn1cbmV4cG9ydHMuYXR0YWNoID0gYXR0YWNoO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBpbXBvcnRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zb2NrZXRpby9lbmdpbmUuaW8tcGFyc2VyL3RyZWUvMi4yLnhcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVjb2RlUGF5bG9hZEFzQmluYXJ5ID0gZXhwb3J0cy5lbmNvZGVQYXlsb2FkQXNCaW5hcnkgPSBleHBvcnRzLmRlY29kZVBheWxvYWQgPSBleHBvcnRzLmVuY29kZVBheWxvYWQgPSBleHBvcnRzLmRlY29kZUJhc2U2NFBhY2tldCA9IGV4cG9ydHMuZGVjb2RlUGFja2V0ID0gZXhwb3J0cy5lbmNvZGVCYXNlNjRQYWNrZXQgPSBleHBvcnRzLmVuY29kZVBhY2tldCA9IGV4cG9ydHMucGFja2V0cyA9IGV4cG9ydHMucHJvdG9jb2wgPSB2b2lkIDA7XG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cbnZhciB1dGY4ID0gcmVxdWlyZSgnLi91dGY4Jyk7XG4vKipcbiAqIEN1cnJlbnQgcHJvdG9jb2wgdmVyc2lvbi5cbiAqL1xuZXhwb3J0cy5wcm90b2NvbCA9IDM7XG5jb25zdCBoYXNCaW5hcnkgPSAocGFja2V0cykgPT4ge1xuICAgIGZvciAoY29uc3QgcGFja2V0IG9mIHBhY2tldHMpIHtcbiAgICAgICAgaWYgKHBhY2tldC5kYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgfHwgQXJyYXlCdWZmZXIuaXNWaWV3KHBhY2tldC5kYXRhKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcbi8qKlxuICogUGFja2V0IHR5cGVzLlxuICovXG5leHBvcnRzLnBhY2tldHMgPSB7XG4gICAgb3BlbjogMCAvLyBub24td3NcbiAgICAsXG4gICAgY2xvc2U6IDEgLy8gbm9uLXdzXG4gICAgLFxuICAgIHBpbmc6IDIsXG4gICAgcG9uZzogMyxcbiAgICBtZXNzYWdlOiA0LFxuICAgIHVwZ3JhZGU6IDUsXG4gICAgbm9vcDogNlxufTtcbnZhciBwYWNrZXRzbGlzdCA9IE9iamVjdC5rZXlzKGV4cG9ydHMucGFja2V0cyk7XG4vKipcbiAqIFByZW1hZGUgZXJyb3IgcGFja2V0LlxuICovXG52YXIgZXJyID0geyB0eXBlOiAnZXJyb3InLCBkYXRhOiAncGFyc2VyIGVycm9yJyB9O1xuY29uc3QgRU1QVFlfQlVGRkVSID0gQnVmZmVyLmNvbmNhdChbXSk7XG4vKipcbiAqIEVuY29kZXMgYSBwYWNrZXQuXG4gKlxuICogICAgIDxwYWNrZXQgdHlwZSBpZD4gWyA8ZGF0YT4gXVxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgIDVoZWxsbyB3b3JsZFxuICogICAgIDNcbiAqICAgICA0XG4gKlxuICogQmluYXJ5IGlzIGVuY29kZWQgaW4gYW4gaWRlbnRpY2FsIHByaW5jaXBsZVxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBlbmNvZGVQYWNrZXQocGFja2V0LCBzdXBwb3J0c0JpbmFyeSwgdXRmOGVuY29kZSwgY2FsbGJhY2spIHtcbiAgICBpZiAodHlwZW9mIHN1cHBvcnRzQmluYXJ5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrID0gc3VwcG9ydHNCaW5hcnk7XG4gICAgICAgIHN1cHBvcnRzQmluYXJ5ID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB1dGY4ZW5jb2RlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrID0gdXRmOGVuY29kZTtcbiAgICAgICAgdXRmOGVuY29kZSA9IG51bGw7XG4gICAgfVxuICAgIGlmIChCdWZmZXIuaXNCdWZmZXIocGFja2V0LmRhdGEpKSB7XG4gICAgICAgIHJldHVybiBlbmNvZGVCdWZmZXIocGFja2V0LCBzdXBwb3J0c0JpbmFyeSwgY2FsbGJhY2spO1xuICAgIH1cbiAgICBlbHNlIGlmIChwYWNrZXQuZGF0YSAmJiAocGFja2V0LmRhdGEuYnVmZmVyIHx8IHBhY2tldC5kYXRhKSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBlbmNvZGVCdWZmZXIoeyB0eXBlOiBwYWNrZXQudHlwZSwgZGF0YTogYXJyYXlCdWZmZXJUb0J1ZmZlcihwYWNrZXQuZGF0YSkgfSwgc3VwcG9ydHNCaW5hcnksIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgLy8gU2VuZGluZyBkYXRhIGFzIGEgdXRmLTggc3RyaW5nXG4gICAgdmFyIGVuY29kZWQgPSBleHBvcnRzLnBhY2tldHNbcGFja2V0LnR5cGVdO1xuICAgIC8vIGRhdGEgZnJhZ21lbnQgaXMgb3B0aW9uYWxcbiAgICBpZiAodW5kZWZpbmVkICE9PSBwYWNrZXQuZGF0YSkge1xuICAgICAgICBlbmNvZGVkICs9IHV0ZjhlbmNvZGUgPyB1dGY4LmVuY29kZShTdHJpbmcocGFja2V0LmRhdGEpLCB7IHN0cmljdDogZmFsc2UgfSkgOiBTdHJpbmcocGFja2V0LmRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gY2FsbGJhY2soJycgKyBlbmNvZGVkKTtcbn1cbmV4cG9ydHMuZW5jb2RlUGFja2V0ID0gZW5jb2RlUGFja2V0O1xuO1xuLyoqXG4gKiBFbmNvZGUgQnVmZmVyIGRhdGFcbiAqL1xuZnVuY3Rpb24gZW5jb2RlQnVmZmVyKHBhY2tldCwgc3VwcG9ydHNCaW5hcnksIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFzdXBwb3J0c0JpbmFyeSkge1xuICAgICAgICByZXR1cm4gZW5jb2RlQmFzZTY0UGFja2V0KHBhY2tldCwgY2FsbGJhY2spO1xuICAgIH1cbiAgICB2YXIgZGF0YSA9IHBhY2tldC5kYXRhO1xuICAgIHZhciB0eXBlQnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKDEpO1xuICAgIHR5cGVCdWZmZXJbMF0gPSBleHBvcnRzLnBhY2tldHNbcGFja2V0LnR5cGVdO1xuICAgIHJldHVybiBjYWxsYmFjayhCdWZmZXIuY29uY2F0KFt0eXBlQnVmZmVyLCBkYXRhXSkpO1xufVxuLyoqXG4gKiBFbmNvZGVzIGEgcGFja2V0IHdpdGggYmluYXJ5IGRhdGEgaW4gYSBiYXNlNjQgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHBhY2tldCwgaGFzIGB0eXBlYCBhbmQgYGRhdGFgXG4gKiBAcmV0dXJuIHtTdHJpbmd9IGJhc2U2NCBlbmNvZGVkIG1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gZW5jb2RlQmFzZTY0UGFja2V0KHBhY2tldCwgY2FsbGJhY2spIHtcbiAgICB2YXIgZGF0YSA9IEJ1ZmZlci5pc0J1ZmZlcihwYWNrZXQuZGF0YSkgPyBwYWNrZXQuZGF0YSA6IGFycmF5QnVmZmVyVG9CdWZmZXIocGFja2V0LmRhdGEpO1xuICAgIHZhciBtZXNzYWdlID0gJ2InICsgZXhwb3J0cy5wYWNrZXRzW3BhY2tldC50eXBlXTtcbiAgICBtZXNzYWdlICs9IGRhdGEudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgIHJldHVybiBjYWxsYmFjayhtZXNzYWdlKTtcbn1cbmV4cG9ydHMuZW5jb2RlQmFzZTY0UGFja2V0ID0gZW5jb2RlQmFzZTY0UGFja2V0O1xuO1xuLyoqXG4gKiBEZWNvZGVzIGEgcGFja2V0LiBEYXRhIGFsc28gYXZhaWxhYmxlIGFzIGFuIEFycmF5QnVmZmVyIGlmIHJlcXVlc3RlZC5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHdpdGggYHR5cGVgIGFuZCBgZGF0YWAgKGlmIGFueSlcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBkZWNvZGVQYWNrZXQoZGF0YSwgYmluYXJ5VHlwZSwgdXRmOGRlY29kZSkge1xuICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gICAgdmFyIHR5cGU7XG4gICAgLy8gU3RyaW5nIGRhdGFcbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHR5cGUgPSBkYXRhLmNoYXJBdCgwKTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdiJykge1xuICAgICAgICAgICAgcmV0dXJuIGRlY29kZUJhc2U2NFBhY2tldChkYXRhLnN1YnN0cigxKSwgYmluYXJ5VHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHV0ZjhkZWNvZGUpIHtcbiAgICAgICAgICAgIGRhdGEgPSB0cnlEZWNvZGUoZGF0YSk7XG4gICAgICAgICAgICBpZiAoZGF0YSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChOdW1iZXIodHlwZSkgIT0gdHlwZSB8fCAhcGFja2V0c2xpc3RbdHlwZV0pIHtcbiAgICAgICAgICAgIHJldHVybiBlcnI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgdHlwZTogcGFja2V0c2xpc3RbdHlwZV0sIGRhdGE6IGRhdGEuc3Vic3RyaW5nKDEpIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4geyB0eXBlOiBwYWNrZXRzbGlzdFt0eXBlXSB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEJpbmFyeSBkYXRhXG4gICAgaWYgKGJpbmFyeVR5cGUgPT09ICdhcnJheWJ1ZmZlcicpIHtcbiAgICAgICAgLy8gd3JhcCBCdWZmZXIvQXJyYXlCdWZmZXIgZGF0YSBpbnRvIGFuIFVpbnQ4QXJyYXlcbiAgICAgICAgdmFyIGludEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoZGF0YSk7XG4gICAgICAgIHR5cGUgPSBpbnRBcnJheVswXTtcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogcGFja2V0c2xpc3RbdHlwZV0sIGRhdGE6IGludEFycmF5LmJ1ZmZlci5zbGljZSgxKSB9O1xuICAgIH1cbiAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICAgIGRhdGEgPSBhcnJheUJ1ZmZlclRvQnVmZmVyKGRhdGEpO1xuICAgIH1cbiAgICB0eXBlID0gZGF0YVswXTtcbiAgICByZXR1cm4geyB0eXBlOiBwYWNrZXRzbGlzdFt0eXBlXSwgZGF0YTogZGF0YS5zbGljZSgxKSB9O1xufVxuZXhwb3J0cy5kZWNvZGVQYWNrZXQgPSBkZWNvZGVQYWNrZXQ7XG47XG5mdW5jdGlvbiB0cnlEZWNvZGUoZGF0YSkge1xuICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSB1dGY4LmRlY29kZShkYXRhLCB7IHN0cmljdDogZmFsc2UgfSk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG59XG4vKipcbiAqIERlY29kZXMgYSBwYWNrZXQgZW5jb2RlZCBpbiBhIGJhc2U2NCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGJhc2U2NCBlbmNvZGVkIG1lc3NhZ2VcbiAqIEByZXR1cm4ge09iamVjdH0gd2l0aCBgdHlwZWAgYW5kIGBkYXRhYCAoaWYgYW55KVxuICovXG5mdW5jdGlvbiBkZWNvZGVCYXNlNjRQYWNrZXQobXNnLCBiaW5hcnlUeXBlKSB7XG4gICAgdmFyIHR5cGUgPSBwYWNrZXRzbGlzdFttc2cuY2hhckF0KDApXTtcbiAgICB2YXIgZGF0YSA9IEJ1ZmZlci5mcm9tKG1zZy5zdWJzdHIoMSksICdiYXNlNjQnKTtcbiAgICBpZiAoYmluYXJ5VHlwZSA9PT0gJ2FycmF5YnVmZmVyJykge1xuICAgICAgICB2YXIgYWJ2ID0gbmV3IFVpbnQ4QXJyYXkoZGF0YS5sZW5ndGgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFidi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYWJ2W2ldID0gZGF0YVtpXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGRhdGEgPSBhYnYuYnVmZmVyO1xuICAgIH1cbiAgICByZXR1cm4geyB0eXBlOiB0eXBlLCBkYXRhOiBkYXRhIH07XG59XG5leHBvcnRzLmRlY29kZUJhc2U2NFBhY2tldCA9IGRlY29kZUJhc2U2NFBhY2tldDtcbjtcbi8qKlxuICogRW5jb2RlcyBtdWx0aXBsZSBtZXNzYWdlcyAocGF5bG9hZCkuXG4gKlxuICogICAgIDxsZW5ndGg+OmRhdGFcbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgICAxMTpoZWxsbyB3b3JsZDI6aGlcbiAqXG4gKiBJZiBhbnkgY29udGVudHMgYXJlIGJpbmFyeSwgdGhleSB3aWxsIGJlIGVuY29kZWQgYXMgYmFzZTY0IHN0cmluZ3MuIEJhc2U2NFxuICogZW5jb2RlZCBzdHJpbmdzIGFyZSBtYXJrZWQgd2l0aCBhIGIgYmVmb3JlIHRoZSBsZW5ndGggc3BlY2lmaWVyXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcGFja2V0c1xuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGVuY29kZVBheWxvYWQocGFja2V0cywgc3VwcG9ydHNCaW5hcnksIGNhbGxiYWNrKSB7XG4gICAgaWYgKHR5cGVvZiBzdXBwb3J0c0JpbmFyeSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYWxsYmFjayA9IHN1cHBvcnRzQmluYXJ5O1xuICAgICAgICBzdXBwb3J0c0JpbmFyeSA9IG51bGw7XG4gICAgfVxuICAgIGlmIChzdXBwb3J0c0JpbmFyeSAmJiBoYXNCaW5hcnkocGFja2V0cykpIHtcbiAgICAgICAgcmV0dXJuIGVuY29kZVBheWxvYWRBc0JpbmFyeShwYWNrZXRzLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIGlmICghcGFja2V0cy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCcwOicpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBlbmNvZGVPbmUocGFja2V0LCBkb25lQ2FsbGJhY2spIHtcbiAgICAgICAgZW5jb2RlUGFja2V0KHBhY2tldCwgc3VwcG9ydHNCaW5hcnksIGZhbHNlLCBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgZG9uZUNhbGxiYWNrKG51bGwsIHNldExlbmd0aEhlYWRlcihtZXNzYWdlKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBtYXAocGFja2V0cywgZW5jb2RlT25lLCBmdW5jdGlvbiAoZXJyLCByZXN1bHRzKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhyZXN1bHRzLmpvaW4oJycpKTtcbiAgICB9KTtcbn1cbmV4cG9ydHMuZW5jb2RlUGF5bG9hZCA9IGVuY29kZVBheWxvYWQ7XG47XG5mdW5jdGlvbiBzZXRMZW5ndGhIZWFkZXIobWVzc2FnZSkge1xuICAgIHJldHVybiBtZXNzYWdlLmxlbmd0aCArICc6JyArIG1lc3NhZ2U7XG59XG4vKipcbiAqIEFzeW5jIGFycmF5IG1hcCB1c2luZyBhZnRlclxuICovXG5mdW5jdGlvbiBtYXAoYXJ5LCBlYWNoLCBkb25lKSB7XG4gICAgY29uc3QgcmVzdWx0cyA9IG5ldyBBcnJheShhcnkubGVuZ3RoKTtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVhY2goYXJ5W2ldLCAoZXJyb3IsIG1zZykgPT4ge1xuICAgICAgICAgICAgcmVzdWx0c1tpXSA9IG1zZztcbiAgICAgICAgICAgIGlmICgrK2NvdW50ID09PSBhcnkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZG9uZShudWxsLCByZXN1bHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuLypcbiAqIERlY29kZXMgZGF0YSB3aGVuIGEgcGF5bG9hZCBpcyBtYXliZSBleHBlY3RlZC4gUG9zc2libGUgYmluYXJ5IGNvbnRlbnRzIGFyZVxuICogZGVjb2RlZCBmcm9tIHRoZWlyIGJhc2U2NCByZXByZXNlbnRhdGlvblxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhLCBjYWxsYmFjayBtZXRob2RcbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIGRlY29kZVBheWxvYWQoZGF0YSwgYmluYXJ5VHlwZSwgY2FsbGJhY2spIHtcbiAgICBpZiAodHlwZW9mIGRhdGEgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBkZWNvZGVQYXlsb2FkQXNCaW5hcnkoZGF0YSwgYmluYXJ5VHlwZSwgY2FsbGJhY2spO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGJpbmFyeVR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBiaW5hcnlUeXBlO1xuICAgICAgICBiaW5hcnlUeXBlID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKGRhdGEgPT09ICcnKSB7XG4gICAgICAgIC8vIHBhcnNlciBlcnJvciAtIGlnbm9yaW5nIHBheWxvYWRcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgMCwgMSk7XG4gICAgfVxuICAgIHZhciBsZW5ndGggPSAnJywgbiwgbXNnLCBwYWNrZXQ7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBkYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgY2hyID0gZGF0YS5jaGFyQXQoaSk7XG4gICAgICAgIGlmIChjaHIgIT09ICc6Jykge1xuICAgICAgICAgICAgbGVuZ3RoICs9IGNocjtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gJycgfHwgKGxlbmd0aCAhPSAobiA9IE51bWJlcihsZW5ndGgpKSkpIHtcbiAgICAgICAgICAgIC8vIHBhcnNlciBlcnJvciAtIGlnbm9yaW5nIHBheWxvYWRcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIDAsIDEpO1xuICAgICAgICB9XG4gICAgICAgIG1zZyA9IGRhdGEuc3Vic3RyKGkgKyAxLCBuKTtcbiAgICAgICAgaWYgKGxlbmd0aCAhPSBtc2cubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBwYXJzZXIgZXJyb3IgLSBpZ25vcmluZyBwYXlsb2FkXG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCAwLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobXNnLmxlbmd0aCkge1xuICAgICAgICAgICAgcGFja2V0ID0gZGVjb2RlUGFja2V0KG1zZywgYmluYXJ5VHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKGVyci50eXBlID09PSBwYWNrZXQudHlwZSAmJiBlcnIuZGF0YSA9PT0gcGFja2V0LmRhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBwYXJzZXIgZXJyb3IgaW4gaW5kaXZpZHVhbCBwYWNrZXQgLSBpZ25vcmluZyBwYXlsb2FkXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgMCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbW9yZSA9IGNhbGxiYWNrKHBhY2tldCwgaSArIG4sIGwpO1xuICAgICAgICAgICAgaWYgKGZhbHNlID09PSBtb3JlKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBhZHZhbmNlIGN1cnNvclxuICAgICAgICBpICs9IG47XG4gICAgICAgIGxlbmd0aCA9ICcnO1xuICAgIH1cbiAgICBpZiAobGVuZ3RoICE9PSAnJykge1xuICAgICAgICAvLyBwYXJzZXIgZXJyb3IgLSBpZ25vcmluZyBwYXlsb2FkXG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIDAsIDEpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVjb2RlUGF5bG9hZCA9IGRlY29kZVBheWxvYWQ7XG47XG4vKipcbiAqXG4gKiBDb252ZXJ0cyBhIGJ1ZmZlciB0byBhIHV0ZjguanMgZW5jb2RlZCBzdHJpbmdcbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gYnVmZmVyVG9TdHJpbmcoYnVmZmVyKSB7XG4gICAgdmFyIHN0ciA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYnVmZmVyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBzdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZmZXJbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuLyoqXG4gKlxuICogQ29udmVydHMgYSB1dGY4LmpzIGVuY29kZWQgc3RyaW5nIHRvIGEgYnVmZmVyXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHN0cmluZ1RvQnVmZmVyKHN0cmluZykge1xuICAgIHZhciBidWYgPSBCdWZmZXIuYWxsb2NVbnNhZmUoc3RyaW5nLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBzdHJpbmcubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGJ1Zi53cml0ZVVJbnQ4KHN0cmluZy5jaGFyQ29kZUF0KGkpLCBpKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1Zjtcbn1cbi8qKlxuICpcbiAqIENvbnZlcnRzIGFuIEFycmF5QnVmZmVyIHRvIGEgQnVmZmVyXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGFycmF5QnVmZmVyVG9CdWZmZXIoZGF0YSkge1xuICAgIC8vIGRhdGEgaXMgZWl0aGVyIGFuIEFycmF5QnVmZmVyIG9yIEFycmF5QnVmZmVyVmlldy5cbiAgICB2YXIgbGVuZ3RoID0gZGF0YS5ieXRlTGVuZ3RoIHx8IGRhdGEubGVuZ3RoO1xuICAgIHZhciBvZmZzZXQgPSBkYXRhLmJ5dGVPZmZzZXQgfHwgMDtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20oZGF0YS5idWZmZXIgfHwgZGF0YSwgb2Zmc2V0LCBsZW5ndGgpO1xufVxuLyoqXG4gKiBFbmNvZGVzIG11bHRpcGxlIG1lc3NhZ2VzIChwYXlsb2FkKSBhcyBiaW5hcnkuXG4gKlxuICogPDEgPSBiaW5hcnksIDAgPSBzdHJpbmc+PG51bWJlciBmcm9tIDAtOT48bnVtYmVyIGZyb20gMC05PlsuLi5dPG51bWJlclxuICogMjU1PjxkYXRhPlxuICpcbiAqIEV4YW1wbGU6XG4gKiAxIDMgMjU1IDEgMiAzLCBpZiB0aGUgYmluYXJ5IGNvbnRlbnRzIGFyZSBpbnRlcnByZXRlZCBhcyA4IGJpdCBpbnRlZ2Vyc1xuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHBhY2tldHNcbiAqIEByZXR1cm4ge0J1ZmZlcn0gZW5jb2RlZCBwYXlsb2FkXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZW5jb2RlUGF5bG9hZEFzQmluYXJ5KHBhY2tldHMsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFwYWNrZXRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soRU1QVFlfQlVGRkVSKTtcbiAgICB9XG4gICAgbWFwKHBhY2tldHMsIGVuY29kZU9uZUJpbmFyeVBhY2tldCwgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soQnVmZmVyLmNvbmNhdChyZXN1bHRzKSk7XG4gICAgfSk7XG59XG5leHBvcnRzLmVuY29kZVBheWxvYWRBc0JpbmFyeSA9IGVuY29kZVBheWxvYWRBc0JpbmFyeTtcbjtcbmZ1bmN0aW9uIGVuY29kZU9uZUJpbmFyeVBhY2tldChwLCBkb25lQ2FsbGJhY2spIHtcbiAgICBmdW5jdGlvbiBvbkJpbmFyeVBhY2tldEVuY29kZShwYWNrZXQpIHtcbiAgICAgICAgdmFyIGVuY29kaW5nTGVuZ3RoID0gJycgKyBwYWNrZXQubGVuZ3RoO1xuICAgICAgICB2YXIgc2l6ZUJ1ZmZlcjtcbiAgICAgICAgaWYgKHR5cGVvZiBwYWNrZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBzaXplQnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGVuY29kaW5nTGVuZ3RoLmxlbmd0aCArIDIpO1xuICAgICAgICAgICAgc2l6ZUJ1ZmZlclswXSA9IDA7IC8vIGlzIGEgc3RyaW5nIChub3QgdHJ1ZSBiaW5hcnkgPSAwKVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbmNvZGluZ0xlbmd0aC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHNpemVCdWZmZXJbaSArIDFdID0gcGFyc2VJbnQoZW5jb2RpbmdMZW5ndGhbaV0sIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNpemVCdWZmZXJbc2l6ZUJ1ZmZlci5sZW5ndGggLSAxXSA9IDI1NTtcbiAgICAgICAgICAgIHJldHVybiBkb25lQ2FsbGJhY2sobnVsbCwgQnVmZmVyLmNvbmNhdChbc2l6ZUJ1ZmZlciwgc3RyaW5nVG9CdWZmZXIocGFja2V0KV0pKTtcbiAgICAgICAgfVxuICAgICAgICBzaXplQnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGVuY29kaW5nTGVuZ3RoLmxlbmd0aCArIDIpO1xuICAgICAgICBzaXplQnVmZmVyWzBdID0gMTsgLy8gaXMgYmluYXJ5ICh0cnVlIGJpbmFyeSA9IDEpXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW5jb2RpbmdMZW5ndGgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHNpemVCdWZmZXJbaSArIDFdID0gcGFyc2VJbnQoZW5jb2RpbmdMZW5ndGhbaV0sIDEwKTtcbiAgICAgICAgfVxuICAgICAgICBzaXplQnVmZmVyW3NpemVCdWZmZXIubGVuZ3RoIC0gMV0gPSAyNTU7XG4gICAgICAgIGRvbmVDYWxsYmFjayhudWxsLCBCdWZmZXIuY29uY2F0KFtzaXplQnVmZmVyLCBwYWNrZXRdKSk7XG4gICAgfVxuICAgIGVuY29kZVBhY2tldChwLCB0cnVlLCB0cnVlLCBvbkJpbmFyeVBhY2tldEVuY29kZSk7XG59XG4vKlxuICogRGVjb2RlcyBkYXRhIHdoZW4gYSBwYXlsb2FkIGlzIG1heWJlIGV4cGVjdGVkLiBTdHJpbmdzIGFyZSBkZWNvZGVkIGJ5XG4gKiBpbnRlcnByZXRpbmcgZWFjaCBieXRlIGFzIGEga2V5IGNvZGUgZm9yIGVudHJpZXMgbWFya2VkIHRvIHN0YXJ0IHdpdGggMC4gU2VlXG4gKiBkZXNjcmlwdGlvbiBvZiBlbmNvZGVQYXlsb2FkQXNCaW5hcnlcblxuICogQHBhcmFtIHtCdWZmZXJ9IGRhdGEsIGNhbGxiYWNrIG1ldGhvZFxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gZGVjb2RlUGF5bG9hZEFzQmluYXJ5KGRhdGEsIGJpbmFyeVR5cGUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHR5cGVvZiBiaW5hcnlUeXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrID0gYmluYXJ5VHlwZTtcbiAgICAgICAgYmluYXJ5VHlwZSA9IG51bGw7XG4gICAgfVxuICAgIHZhciBidWZmZXJUYWlsID0gZGF0YTtcbiAgICB2YXIgYnVmZmVycyA9IFtdO1xuICAgIHZhciBpO1xuICAgIHdoaWxlIChidWZmZXJUYWlsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIHN0ckxlbiA9ICcnO1xuICAgICAgICB2YXIgaXNTdHJpbmcgPSBidWZmZXJUYWlsWzBdID09PSAwO1xuICAgICAgICBmb3IgKGkgPSAxOzsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYnVmZmVyVGFpbFtpXSA9PT0gMjU1KVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gMzEwID0gY2hhciBsZW5ndGggb2YgTnVtYmVyLk1BWF9WQUxVRVxuICAgICAgICAgICAgaWYgKHN0ckxlbi5sZW5ndGggPiAzMTApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCAwLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0ckxlbiArPSAnJyArIGJ1ZmZlclRhaWxbaV07XG4gICAgICAgIH1cbiAgICAgICAgYnVmZmVyVGFpbCA9IGJ1ZmZlclRhaWwuc2xpY2Uoc3RyTGVuLmxlbmd0aCArIDEpO1xuICAgICAgICB2YXIgbXNnTGVuZ3RoID0gcGFyc2VJbnQoc3RyTGVuLCAxMCk7XG4gICAgICAgIHZhciBtc2cgPSBidWZmZXJUYWlsLnNsaWNlKDEsIG1zZ0xlbmd0aCArIDEpO1xuICAgICAgICBpZiAoaXNTdHJpbmcpXG4gICAgICAgICAgICBtc2cgPSBidWZmZXJUb1N0cmluZyhtc2cpO1xuICAgICAgICBidWZmZXJzLnB1c2gobXNnKTtcbiAgICAgICAgYnVmZmVyVGFpbCA9IGJ1ZmZlclRhaWwuc2xpY2UobXNnTGVuZ3RoICsgMSk7XG4gICAgfVxuICAgIHZhciB0b3RhbCA9IGJ1ZmZlcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCB0b3RhbDsgaSsrKSB7XG4gICAgICAgIHZhciBidWZmZXIgPSBidWZmZXJzW2ldO1xuICAgICAgICBjYWxsYmFjayhkZWNvZGVQYWNrZXQoYnVmZmVyLCBiaW5hcnlUeXBlLCB0cnVlKSwgaSwgdG90YWwpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVjb2RlUGF5bG9hZEFzQmluYXJ5ID0gZGVjb2RlUGF5bG9hZEFzQmluYXJ5O1xuO1xuIiwiLyohIGh0dHBzOi8vbXRocy5iZS91dGY4anMgdjIuMS4yIGJ5IEBtYXRoaWFzICovXG52YXIgc3RyaW5nRnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcbi8vIFRha2VuIGZyb20gaHR0cHM6Ly9tdGhzLmJlL3B1bnljb2RlXG5mdW5jdGlvbiB1Y3MyZGVjb2RlKHN0cmluZykge1xuICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHZhbHVlO1xuICAgIHZhciBleHRyYTtcbiAgICB3aGlsZSAoY291bnRlciA8IGxlbmd0aCkge1xuICAgICAgICB2YWx1ZSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7XG4gICAgICAgIGlmICh2YWx1ZSA+PSAweEQ4MDAgJiYgdmFsdWUgPD0gMHhEQkZGICYmIGNvdW50ZXIgPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIGhpZ2ggc3Vycm9nYXRlLCBhbmQgdGhlcmUgaXMgYSBuZXh0IGNoYXJhY3RlclxuICAgICAgICAgICAgZXh0cmEgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuICAgICAgICAgICAgaWYgKChleHRyYSAmIDB4RkMwMCkgPT0gMHhEQzAwKSB7IC8vIGxvdyBzdXJyb2dhdGVcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCgoKHZhbHVlICYgMHgzRkYpIDw8IDEwKSArIChleHRyYSAmIDB4M0ZGKSArIDB4MTAwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdW5tYXRjaGVkIHN1cnJvZ2F0ZTsgb25seSBhcHBlbmQgdGhpcyBjb2RlIHVuaXQsIGluIGNhc2UgdGhlIG5leHRcbiAgICAgICAgICAgICAgICAvLyBjb2RlIHVuaXQgaXMgdGhlIGhpZ2ggc3Vycm9nYXRlIG9mIGEgc3Vycm9nYXRlIHBhaXJcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgY291bnRlci0tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3V0cHV0LnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG59XG4vLyBUYWtlbiBmcm9tIGh0dHBzOi8vbXRocy5iZS9wdW55Y29kZVxuZnVuY3Rpb24gdWNzMmVuY29kZShhcnJheSkge1xuICAgIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gICAgdmFyIGluZGV4ID0gLTE7XG4gICAgdmFyIHZhbHVlO1xuICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICAgICAgaWYgKHZhbHVlID4gMHhGRkZGKSB7XG4gICAgICAgICAgICB2YWx1ZSAtPSAweDEwMDAwO1xuICAgICAgICAgICAgb3V0cHV0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZSh2YWx1ZSA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMCk7XG4gICAgICAgICAgICB2YWx1ZSA9IDB4REMwMCB8IHZhbHVlICYgMHgzRkY7XG4gICAgICAgIH1cbiAgICAgICAgb3V0cHV0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZSh2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG59XG5mdW5jdGlvbiBjaGVja1NjYWxhclZhbHVlKGNvZGVQb2ludCwgc3RyaWN0KSB7XG4gICAgaWYgKGNvZGVQb2ludCA+PSAweEQ4MDAgJiYgY29kZVBvaW50IDw9IDB4REZGRikge1xuICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignTG9uZSBzdXJyb2dhdGUgVSsnICsgY29kZVBvaW50LnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpICtcbiAgICAgICAgICAgICAgICAnIGlzIG5vdCBhIHNjYWxhciB2YWx1ZScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmZ1bmN0aW9uIGNyZWF0ZUJ5dGUoY29kZVBvaW50LCBzaGlmdCkge1xuICAgIHJldHVybiBzdHJpbmdGcm9tQ2hhckNvZGUoKChjb2RlUG9pbnQgPj4gc2hpZnQpICYgMHgzRikgfCAweDgwKTtcbn1cbmZ1bmN0aW9uIGVuY29kZUNvZGVQb2ludChjb2RlUG9pbnQsIHN0cmljdCkge1xuICAgIGlmICgoY29kZVBvaW50ICYgMHhGRkZGRkY4MCkgPT0gMCkgeyAvLyAxLWJ5dGUgc2VxdWVuY2VcbiAgICAgICAgcmV0dXJuIHN0cmluZ0Zyb21DaGFyQ29kZShjb2RlUG9pbnQpO1xuICAgIH1cbiAgICB2YXIgc3ltYm9sID0gJyc7XG4gICAgaWYgKChjb2RlUG9pbnQgJiAweEZGRkZGODAwKSA9PSAwKSB7IC8vIDItYnl0ZSBzZXF1ZW5jZVxuICAgICAgICBzeW1ib2wgPSBzdHJpbmdGcm9tQ2hhckNvZGUoKChjb2RlUG9pbnQgPj4gNikgJiAweDFGKSB8IDB4QzApO1xuICAgIH1cbiAgICBlbHNlIGlmICgoY29kZVBvaW50ICYgMHhGRkZGMDAwMCkgPT0gMCkgeyAvLyAzLWJ5dGUgc2VxdWVuY2VcbiAgICAgICAgaWYgKCFjaGVja1NjYWxhclZhbHVlKGNvZGVQb2ludCwgc3RyaWN0KSkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gMHhGRkZEO1xuICAgICAgICB9XG4gICAgICAgIHN5bWJvbCA9IHN0cmluZ0Zyb21DaGFyQ29kZSgoKGNvZGVQb2ludCA+PiAxMikgJiAweDBGKSB8IDB4RTApO1xuICAgICAgICBzeW1ib2wgKz0gY3JlYXRlQnl0ZShjb2RlUG9pbnQsIDYpO1xuICAgIH1cbiAgICBlbHNlIGlmICgoY29kZVBvaW50ICYgMHhGRkUwMDAwMCkgPT0gMCkgeyAvLyA0LWJ5dGUgc2VxdWVuY2VcbiAgICAgICAgc3ltYm9sID0gc3RyaW5nRnJvbUNoYXJDb2RlKCgoY29kZVBvaW50ID4+IDE4KSAmIDB4MDcpIHwgMHhGMCk7XG4gICAgICAgIHN5bWJvbCArPSBjcmVhdGVCeXRlKGNvZGVQb2ludCwgMTIpO1xuICAgICAgICBzeW1ib2wgKz0gY3JlYXRlQnl0ZShjb2RlUG9pbnQsIDYpO1xuICAgIH1cbiAgICBzeW1ib2wgKz0gc3RyaW5nRnJvbUNoYXJDb2RlKChjb2RlUG9pbnQgJiAweDNGKSB8IDB4ODApO1xuICAgIHJldHVybiBzeW1ib2w7XG59XG5mdW5jdGlvbiB1dGY4ZW5jb2RlKHN0cmluZywgb3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuICAgIHZhciBzdHJpY3QgPSBmYWxzZSAhPT0gb3B0cy5zdHJpY3Q7XG4gICAgdmFyIGNvZGVQb2ludHMgPSB1Y3MyZGVjb2RlKHN0cmluZyk7XG4gICAgdmFyIGxlbmd0aCA9IGNvZGVQb2ludHMubGVuZ3RoO1xuICAgIHZhciBpbmRleCA9IC0xO1xuICAgIHZhciBjb2RlUG9pbnQ7XG4gICAgdmFyIGJ5dGVTdHJpbmcgPSAnJztcbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICBjb2RlUG9pbnQgPSBjb2RlUG9pbnRzW2luZGV4XTtcbiAgICAgICAgYnl0ZVN0cmluZyArPSBlbmNvZGVDb2RlUG9pbnQoY29kZVBvaW50LCBzdHJpY3QpO1xuICAgIH1cbiAgICByZXR1cm4gYnl0ZVN0cmluZztcbn1cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZnVuY3Rpb24gcmVhZENvbnRpbnVhdGlvbkJ5dGUoKSB7XG4gICAgaWYgKGJ5dGVJbmRleCA+PSBieXRlQ291bnQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0ludmFsaWQgYnl0ZSBpbmRleCcpO1xuICAgIH1cbiAgICB2YXIgY29udGludWF0aW9uQnl0ZSA9IGJ5dGVBcnJheVtieXRlSW5kZXhdICYgMHhGRjtcbiAgICBieXRlSW5kZXgrKztcbiAgICBpZiAoKGNvbnRpbnVhdGlvbkJ5dGUgJiAweEMwKSA9PSAweDgwKSB7XG4gICAgICAgIHJldHVybiBjb250aW51YXRpb25CeXRlICYgMHgzRjtcbiAgICB9XG4gICAgLy8gSWYgd2UgZW5kIHVwIGhlcmUsIGl04oCZcyBub3QgYSBjb250aW51YXRpb24gYnl0ZVxuICAgIHRocm93IEVycm9yKCdJbnZhbGlkIGNvbnRpbnVhdGlvbiBieXRlJyk7XG59XG5mdW5jdGlvbiBkZWNvZGVTeW1ib2woc3RyaWN0KSB7XG4gICAgdmFyIGJ5dGUxO1xuICAgIHZhciBieXRlMjtcbiAgICB2YXIgYnl0ZTM7XG4gICAgdmFyIGJ5dGU0O1xuICAgIHZhciBjb2RlUG9pbnQ7XG4gICAgaWYgKGJ5dGVJbmRleCA+IGJ5dGVDb3VudCkge1xuICAgICAgICB0aHJvdyBFcnJvcignSW52YWxpZCBieXRlIGluZGV4Jyk7XG4gICAgfVxuICAgIGlmIChieXRlSW5kZXggPT0gYnl0ZUNvdW50KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gUmVhZCBmaXJzdCBieXRlXG4gICAgYnl0ZTEgPSBieXRlQXJyYXlbYnl0ZUluZGV4XSAmIDB4RkY7XG4gICAgYnl0ZUluZGV4Kys7XG4gICAgLy8gMS1ieXRlIHNlcXVlbmNlIChubyBjb250aW51YXRpb24gYnl0ZXMpXG4gICAgaWYgKChieXRlMSAmIDB4ODApID09IDApIHtcbiAgICAgICAgcmV0dXJuIGJ5dGUxO1xuICAgIH1cbiAgICAvLyAyLWJ5dGUgc2VxdWVuY2VcbiAgICBpZiAoKGJ5dGUxICYgMHhFMCkgPT0gMHhDMCkge1xuICAgICAgICBieXRlMiA9IHJlYWRDb250aW51YXRpb25CeXRlKCk7XG4gICAgICAgIGNvZGVQb2ludCA9ICgoYnl0ZTEgJiAweDFGKSA8PCA2KSB8IGJ5dGUyO1xuICAgICAgICBpZiAoY29kZVBvaW50ID49IDB4ODApIHtcbiAgICAgICAgICAgIHJldHVybiBjb2RlUG9pbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignSW52YWxpZCBjb250aW51YXRpb24gYnl0ZScpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIDMtYnl0ZSBzZXF1ZW5jZSAobWF5IGluY2x1ZGUgdW5wYWlyZWQgc3Vycm9nYXRlcylcbiAgICBpZiAoKGJ5dGUxICYgMHhGMCkgPT0gMHhFMCkge1xuICAgICAgICBieXRlMiA9IHJlYWRDb250aW51YXRpb25CeXRlKCk7XG4gICAgICAgIGJ5dGUzID0gcmVhZENvbnRpbnVhdGlvbkJ5dGUoKTtcbiAgICAgICAgY29kZVBvaW50ID0gKChieXRlMSAmIDB4MEYpIDw8IDEyKSB8IChieXRlMiA8PCA2KSB8IGJ5dGUzO1xuICAgICAgICBpZiAoY29kZVBvaW50ID49IDB4MDgwMCkge1xuICAgICAgICAgICAgcmV0dXJuIGNoZWNrU2NhbGFyVmFsdWUoY29kZVBvaW50LCBzdHJpY3QpID8gY29kZVBvaW50IDogMHhGRkZEO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ0ludmFsaWQgY29udGludWF0aW9uIGJ5dGUnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyA0LWJ5dGUgc2VxdWVuY2VcbiAgICBpZiAoKGJ5dGUxICYgMHhGOCkgPT0gMHhGMCkge1xuICAgICAgICBieXRlMiA9IHJlYWRDb250aW51YXRpb25CeXRlKCk7XG4gICAgICAgIGJ5dGUzID0gcmVhZENvbnRpbnVhdGlvbkJ5dGUoKTtcbiAgICAgICAgYnl0ZTQgPSByZWFkQ29udGludWF0aW9uQnl0ZSgpO1xuICAgICAgICBjb2RlUG9pbnQgPSAoKGJ5dGUxICYgMHgwNykgPDwgMHgxMikgfCAoYnl0ZTIgPDwgMHgwQykgfFxuICAgICAgICAgICAgKGJ5dGUzIDw8IDB4MDYpIHwgYnl0ZTQ7XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPj0gMHgwMTAwMDAgJiYgY29kZVBvaW50IDw9IDB4MTBGRkZGKSB7XG4gICAgICAgICAgICByZXR1cm4gY29kZVBvaW50O1xuICAgICAgICB9XG4gICAgfVxuICAgIHRocm93IEVycm9yKCdJbnZhbGlkIFVURi04IGRldGVjdGVkJyk7XG59XG52YXIgYnl0ZUFycmF5O1xudmFyIGJ5dGVDb3VudDtcbnZhciBieXRlSW5kZXg7XG5mdW5jdGlvbiB1dGY4ZGVjb2RlKGJ5dGVTdHJpbmcsIG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICB2YXIgc3RyaWN0ID0gZmFsc2UgIT09IG9wdHMuc3RyaWN0O1xuICAgIGJ5dGVBcnJheSA9IHVjczJkZWNvZGUoYnl0ZVN0cmluZyk7XG4gICAgYnl0ZUNvdW50ID0gYnl0ZUFycmF5Lmxlbmd0aDtcbiAgICBieXRlSW5kZXggPSAwO1xuICAgIHZhciBjb2RlUG9pbnRzID0gW107XG4gICAgdmFyIHRtcDtcbiAgICB3aGlsZSAoKHRtcCA9IGRlY29kZVN5bWJvbChzdHJpY3QpKSAhPT0gZmFsc2UpIHtcbiAgICAgICAgY29kZVBvaW50cy5wdXNoKHRtcCk7XG4gICAgfVxuICAgIHJldHVybiB1Y3MyZW5jb2RlKGNvZGVQb2ludHMpO1xufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgdmVyc2lvbjogJzIuMS4yJyxcbiAgICBlbmNvZGU6IHV0ZjhlbmNvZGUsXG4gICAgZGVjb2RlOiB1dGY4ZGVjb2RlXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNlcnZlciA9IGV4cG9ydHMuQmFzZVNlcnZlciA9IHZvaWQgMDtcbmNvbnN0IHFzID0gcmVxdWlyZShcInF1ZXJ5c3RyaW5nXCIpO1xuY29uc3QgdXJsXzEgPSByZXF1aXJlKFwidXJsXCIpO1xuY29uc3QgYmFzZTY0aWQgPSByZXF1aXJlKFwiYmFzZTY0aWRcIik7XG5jb25zdCB0cmFuc3BvcnRzXzEgPSByZXF1aXJlKFwiLi90cmFuc3BvcnRzXCIpO1xuY29uc3QgZXZlbnRzXzEgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xuY29uc3Qgc29ja2V0XzEgPSByZXF1aXJlKFwiLi9zb2NrZXRcIik7XG5jb25zdCBkZWJ1Z18xID0gcmVxdWlyZShcImRlYnVnXCIpO1xuY29uc3QgY29va2llXzEgPSByZXF1aXJlKFwiY29va2llXCIpO1xuY29uc3Qgd3NfMSA9IHJlcXVpcmUoXCJ3c1wiKTtcbmNvbnN0IGRlYnVnID0gKDAsIGRlYnVnXzEuZGVmYXVsdCkoXCJlbmdpbmVcIik7XG5jbGFzcyBCYXNlU2VydmVyIGV4dGVuZHMgZXZlbnRzXzEuRXZlbnRFbWl0dGVyIHtcbiAgICAvKipcbiAgICAgKiBTZXJ2ZXIgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0cyAtIG9wdGlvbnNcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNsaWVudHMgPSB7fTtcbiAgICAgICAgdGhpcy5jbGllbnRzQ291bnQgPSAwO1xuICAgICAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIHdzRW5naW5lOiB3c18xLlNlcnZlcixcbiAgICAgICAgICAgIHBpbmdUaW1lb3V0OiAyMDAwMCxcbiAgICAgICAgICAgIHBpbmdJbnRlcnZhbDogMjUwMDAsXG4gICAgICAgICAgICB1cGdyYWRlVGltZW91dDogMTAwMDAsXG4gICAgICAgICAgICBtYXhIdHRwQnVmZmVyU2l6ZTogMWU2LFxuICAgICAgICAgICAgdHJhbnNwb3J0czogT2JqZWN0LmtleXModHJhbnNwb3J0c18xLmRlZmF1bHQpLFxuICAgICAgICAgICAgYWxsb3dVcGdyYWRlczogdHJ1ZSxcbiAgICAgICAgICAgIGh0dHBDb21wcmVzc2lvbjoge1xuICAgICAgICAgICAgICAgIHRocmVzaG9sZDogMTAyNFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvcnM6IGZhbHNlLFxuICAgICAgICAgICAgYWxsb3dFSU8zOiBmYWxzZVxuICAgICAgICB9LCBvcHRzKTtcbiAgICAgICAgaWYgKG9wdHMuY29va2llKSB7XG4gICAgICAgICAgICB0aGlzLm9wdHMuY29va2llID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJpb1wiLFxuICAgICAgICAgICAgICAgIHBhdGg6IFwiL1wiLFxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBodHRwT25seTogb3B0cy5jb29raWUucGF0aCAhPT0gZmFsc2UsXG4gICAgICAgICAgICAgICAgc2FtZVNpdGU6IFwibGF4XCJcbiAgICAgICAgICAgIH0sIG9wdHMuY29va2llKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRzLmNvcnMpIHtcbiAgICAgICAgICAgIHRoaXMuY29yc01pZGRsZXdhcmUgPSByZXF1aXJlKFwiY29yc1wiKSh0aGlzLm9wdHMuY29ycyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdHMucGVyTWVzc2FnZURlZmxhdGUpIHtcbiAgICAgICAgICAgIHRoaXMub3B0cy5wZXJNZXNzYWdlRGVmbGF0ZSA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgICAgIHRocmVzaG9sZDogMTAyNFxuICAgICAgICAgICAgfSwgb3B0cy5wZXJNZXNzYWdlRGVmbGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBsaXN0IG9mIGF2YWlsYWJsZSB0cmFuc3BvcnRzIGZvciB1cGdyYWRlIGdpdmVuIGEgY2VydGFpbiB0cmFuc3BvcnQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuICAgIHVwZ3JhZGVzKHRyYW5zcG9ydCkge1xuICAgICAgICBpZiAoIXRoaXMub3B0cy5hbGxvd1VwZ3JhZGVzKVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICByZXR1cm4gdHJhbnNwb3J0c18xLmRlZmF1bHRbdHJhbnNwb3J0XS51cGdyYWRlc1RvIHx8IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBWZXJpZmllcyBhIHJlcXVlc3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2h0dHAuSW5jb21pbmdNZXNzYWdlfVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgdGhlIHJlcXVlc3QgaXMgdmFsaWRcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICB2ZXJpZnkocmVxLCB1cGdyYWRlLCBmbikge1xuICAgICAgICAvLyB0cmFuc3BvcnQgY2hlY2tcbiAgICAgICAgY29uc3QgdHJhbnNwb3J0ID0gcmVxLl9xdWVyeS50cmFuc3BvcnQ7XG4gICAgICAgIGlmICghfnRoaXMub3B0cy50cmFuc3BvcnRzLmluZGV4T2YodHJhbnNwb3J0KSkge1xuICAgICAgICAgICAgZGVidWcoJ3Vua25vd24gdHJhbnNwb3J0IFwiJXNcIicsIHRyYW5zcG9ydCk7XG4gICAgICAgICAgICByZXR1cm4gZm4oU2VydmVyLmVycm9ycy5VTktOT1dOX1RSQU5TUE9SVCwgeyB0cmFuc3BvcnQgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gJ09yaWdpbicgaGVhZGVyIGNoZWNrXG4gICAgICAgIGNvbnN0IGlzT3JpZ2luSW52YWxpZCA9IGNoZWNrSW52YWxpZEhlYWRlckNoYXIocmVxLmhlYWRlcnMub3JpZ2luKTtcbiAgICAgICAgaWYgKGlzT3JpZ2luSW52YWxpZCkge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luID0gcmVxLmhlYWRlcnMub3JpZ2luO1xuICAgICAgICAgICAgcmVxLmhlYWRlcnMub3JpZ2luID0gbnVsbDtcbiAgICAgICAgICAgIGRlYnVnKFwib3JpZ2luIGhlYWRlciBpbnZhbGlkXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGZuKFNlcnZlci5lcnJvcnMuQkFEX1JFUVVFU1QsIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIklOVkFMSURfT1JJR0lOXCIsXG4gICAgICAgICAgICAgICAgb3JpZ2luXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzaWQgY2hlY2tcbiAgICAgICAgY29uc3Qgc2lkID0gcmVxLl9xdWVyeS5zaWQ7XG4gICAgICAgIGlmIChzaWQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5jbGllbnRzLmhhc093blByb3BlcnR5KHNpZCkpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygndW5rbm93biBzaWQgXCIlc1wiJywgc2lkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4oU2VydmVyLmVycm9ycy5VTktOT1dOX1NJRCwge1xuICAgICAgICAgICAgICAgICAgICBzaWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzVHJhbnNwb3J0ID0gdGhpcy5jbGllbnRzW3NpZF0udHJhbnNwb3J0Lm5hbWU7XG4gICAgICAgICAgICBpZiAoIXVwZ3JhZGUgJiYgcHJldmlvdXNUcmFuc3BvcnQgIT09IHRyYW5zcG9ydCkge1xuICAgICAgICAgICAgICAgIGRlYnVnKFwiYmFkIHJlcXVlc3Q6IHVuZXhwZWN0ZWQgdHJhbnNwb3J0IHdpdGhvdXQgdXBncmFkZVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4oU2VydmVyLmVycm9ycy5CQURfUkVRVUVTVCwge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlRSQU5TUE9SVF9NSVNNQVRDSFwiLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnQsXG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzVHJhbnNwb3J0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBoYW5kc2hha2UgaXMgR0VUIG9ubHlcbiAgICAgICAgICAgIGlmIChcIkdFVFwiICE9PSByZXEubWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuKFNlcnZlci5lcnJvcnMuQkFEX0hBTkRTSEFLRV9NRVRIT0QsIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiByZXEubWV0aG9kXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0cy5hbGxvd1JlcXVlc3QpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRzLmFsbG93UmVxdWVzdChyZXEsIChtZXNzYWdlLCBzdWNjZXNzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihTZXJ2ZXIuZXJyb3JzLkZPUkJJRERFTiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZuKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsb3NlcyBhbGwgY2xpZW50cy5cbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgY2xvc2UoKSB7XG4gICAgICAgIGRlYnVnKFwiY2xvc2luZyBhbGwgb3BlbiBjbGllbnRzXCIpO1xuICAgICAgICBmb3IgKGxldCBpIGluIHRoaXMuY2xpZW50cykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2xpZW50cy5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50c1tpXS5jbG9zZSh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsZWFudXAoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGdlbmVyYXRlIGEgc29ja2V0IGlkLlxuICAgICAqIE92ZXJ3cml0ZSB0aGlzIG1ldGhvZCB0byBnZW5lcmF0ZSB5b3VyIGN1c3RvbSBzb2NrZXQgaWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0IG9iamVjdFxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgZ2VuZXJhdGVJZChyZXEpIHtcbiAgICAgICAgcmV0dXJuIGJhc2U2NGlkLmdlbmVyYXRlSWQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSGFuZHNoYWtlcyBhIG5ldyBjbGllbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHJhbnNwb3J0IG5hbWVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdCBvYmplY3RcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjbG9zZUNvbm5lY3Rpb25cbiAgICAgKlxuICAgICAqIEBhcGkgcHJvdGVjdGVkXG4gICAgICovXG4gICAgYXN5bmMgaGFuZHNoYWtlKHRyYW5zcG9ydE5hbWUsIHJlcSwgY2xvc2VDb25uZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IHByb3RvY29sID0gcmVxLl9xdWVyeS5FSU8gPT09IFwiNFwiID8gNCA6IDM7IC8vIDNyZCByZXZpc2lvbiBieSBkZWZhdWx0XG4gICAgICAgIGlmIChwcm90b2NvbCA9PT0gMyAmJiAhdGhpcy5vcHRzLmFsbG93RUlPMykge1xuICAgICAgICAgICAgZGVidWcoXCJ1bnN1cHBvcnRlZCBwcm90b2NvbCB2ZXJzaW9uXCIpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KFwiY29ubmVjdGlvbl9lcnJvclwiLCB7XG4gICAgICAgICAgICAgICAgcmVxLFxuICAgICAgICAgICAgICAgIGNvZGU6IFNlcnZlci5lcnJvcnMuVU5TVVBQT1JURURfUFJPVE9DT0xfVkVSU0lPTixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBTZXJ2ZXIuZXJyb3JNZXNzYWdlc1tTZXJ2ZXIuZXJyb3JzLlVOU1VQUE9SVEVEX1BST1RPQ09MX1ZFUlNJT05dLFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgcHJvdG9jb2xcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNsb3NlQ29ubmVjdGlvbihTZXJ2ZXIuZXJyb3JzLlVOU1VQUE9SVEVEX1BST1RPQ09MX1ZFUlNJT04pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpZDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlkID0gYXdhaXQgdGhpcy5nZW5lcmF0ZUlkKHJlcSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGRlYnVnKFwiZXJyb3Igd2hpbGUgZ2VuZXJhdGluZyBhbiBpZFwiKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdChcImNvbm5lY3Rpb25fZXJyb3JcIiwge1xuICAgICAgICAgICAgICAgIHJlcSxcbiAgICAgICAgICAgICAgICBjb2RlOiBTZXJ2ZXIuZXJyb3JzLkJBRF9SRVFVRVNULFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFNlcnZlci5lcnJvck1lc3NhZ2VzW1NlcnZlci5lcnJvcnMuQkFEX1JFUVVFU1RdLFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJJRF9HRU5FUkFUSU9OX0VSUk9SXCIsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjbG9zZUNvbm5lY3Rpb24oU2VydmVyLmVycm9ycy5CQURfUkVRVUVTVCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGVidWcoJ2hhbmRzaGFraW5nIGNsaWVudCBcIiVzXCInLCBpZCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgdHJhbnNwb3J0ID0gdGhpcy5jcmVhdGVUcmFuc3BvcnQodHJhbnNwb3J0TmFtZSwgcmVxKTtcbiAgICAgICAgICAgIGlmIChcInBvbGxpbmdcIiA9PT0gdHJhbnNwb3J0TmFtZSkge1xuICAgICAgICAgICAgICAgIHRyYW5zcG9ydC5tYXhIdHRwQnVmZmVyU2l6ZSA9IHRoaXMub3B0cy5tYXhIdHRwQnVmZmVyU2l6ZTtcbiAgICAgICAgICAgICAgICB0cmFuc3BvcnQuaHR0cENvbXByZXNzaW9uID0gdGhpcy5vcHRzLmh0dHBDb21wcmVzc2lvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKFwid2Vic29ja2V0XCIgPT09IHRyYW5zcG9ydE5hbWUpIHtcbiAgICAgICAgICAgICAgICB0cmFuc3BvcnQucGVyTWVzc2FnZURlZmxhdGUgPSB0aGlzLm9wdHMucGVyTWVzc2FnZURlZmxhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVxLl9xdWVyeSAmJiByZXEuX3F1ZXJ5LmI2NCkge1xuICAgICAgICAgICAgICAgIHRyYW5zcG9ydC5zdXBwb3J0c0JpbmFyeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJhbnNwb3J0LnN1cHBvcnRzQmluYXJ5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgZGVidWcoJ2Vycm9yIGhhbmRzaGFraW5nIHRvIHRyYW5zcG9ydCBcIiVzXCInLCB0cmFuc3BvcnROYW1lKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdChcImNvbm5lY3Rpb25fZXJyb3JcIiwge1xuICAgICAgICAgICAgICAgIHJlcSxcbiAgICAgICAgICAgICAgICBjb2RlOiBTZXJ2ZXIuZXJyb3JzLkJBRF9SRVFVRVNULFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFNlcnZlci5lcnJvck1lc3NhZ2VzW1NlcnZlci5lcnJvcnMuQkFEX1JFUVVFU1RdLFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJUUkFOU1BPUlRfSEFORFNIQUtFX0VSUk9SXCIsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjbG9zZUNvbm5lY3Rpb24oU2VydmVyLmVycm9ycy5CQURfUkVRVUVTVCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc29ja2V0ID0gbmV3IHNvY2tldF8xLlNvY2tldChpZCwgdGhpcywgdHJhbnNwb3J0LCByZXEsIHByb3RvY29sKTtcbiAgICAgICAgdHJhbnNwb3J0Lm9uKFwiaGVhZGVyc1wiLCAoaGVhZGVycywgcmVxKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpc0luaXRpYWxSZXF1ZXN0ID0gIXJlcS5fcXVlcnkuc2lkO1xuICAgICAgICAgICAgaWYgKGlzSW5pdGlhbFJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRzLmNvb2tpZSkge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzW1wiU2V0LUNvb2tpZVwiXSA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICgwLCBjb29raWVfMS5zZXJpYWxpemUpKHRoaXMub3B0cy5jb29raWUubmFtZSwgaWQsIHRoaXMub3B0cy5jb29raWUpXG4gICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcImluaXRpYWxfaGVhZGVyc1wiLCBoZWFkZXJzLCByZXEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbWl0KFwiaGVhZGVyc1wiLCBoZWFkZXJzLCByZXEpO1xuICAgICAgICB9KTtcbiAgICAgICAgdHJhbnNwb3J0Lm9uUmVxdWVzdChyZXEpO1xuICAgICAgICB0aGlzLmNsaWVudHNbaWRdID0gc29ja2V0O1xuICAgICAgICB0aGlzLmNsaWVudHNDb3VudCsrO1xuICAgICAgICBzb2NrZXQub25jZShcImNsb3NlXCIsICgpID0+IHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNsaWVudHNbaWRdO1xuICAgICAgICAgICAgdGhpcy5jbGllbnRzQ291bnQtLTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZW1pdChcImNvbm5lY3Rpb25cIiwgc29ja2V0KTtcbiAgICAgICAgcmV0dXJuIHRyYW5zcG9ydDtcbiAgICB9XG59XG5leHBvcnRzLkJhc2VTZXJ2ZXIgPSBCYXNlU2VydmVyO1xuLyoqXG4gKiBQcm90b2NvbCBlcnJvcnMgbWFwcGluZ3MuXG4gKi9cbkJhc2VTZXJ2ZXIuZXJyb3JzID0ge1xuICAgIFVOS05PV05fVFJBTlNQT1JUOiAwLFxuICAgIFVOS05PV05fU0lEOiAxLFxuICAgIEJBRF9IQU5EU0hBS0VfTUVUSE9EOiAyLFxuICAgIEJBRF9SRVFVRVNUOiAzLFxuICAgIEZPUkJJRERFTjogNCxcbiAgICBVTlNVUFBPUlRFRF9QUk9UT0NPTF9WRVJTSU9OOiA1XG59O1xuQmFzZVNlcnZlci5lcnJvck1lc3NhZ2VzID0ge1xuICAgIDA6IFwiVHJhbnNwb3J0IHVua25vd25cIixcbiAgICAxOiBcIlNlc3Npb24gSUQgdW5rbm93blwiLFxuICAgIDI6IFwiQmFkIGhhbmRzaGFrZSBtZXRob2RcIixcbiAgICAzOiBcIkJhZCByZXF1ZXN0XCIsXG4gICAgNDogXCJGb3JiaWRkZW5cIixcbiAgICA1OiBcIlVuc3VwcG9ydGVkIHByb3RvY29sIHZlcnNpb25cIlxufTtcbmNsYXNzIFNlcnZlciBleHRlbmRzIEJhc2VTZXJ2ZXIge1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgd2Vic29ja2V0IHNlcnZlclxuICAgICAqXG4gICAgICogQGFwaSBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBpbml0KCkge1xuICAgICAgICBpZiAoIX50aGlzLm9wdHMudHJhbnNwb3J0cy5pbmRleE9mKFwid2Vic29ja2V0XCIpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy53cylcbiAgICAgICAgICAgIHRoaXMud3MuY2xvc2UoKTtcbiAgICAgICAgdGhpcy53cyA9IG5ldyB0aGlzLm9wdHMud3NFbmdpbmUoe1xuICAgICAgICAgICAgbm9TZXJ2ZXI6IHRydWUsXG4gICAgICAgICAgICBjbGllbnRUcmFja2luZzogZmFsc2UsXG4gICAgICAgICAgICBwZXJNZXNzYWdlRGVmbGF0ZTogdGhpcy5vcHRzLnBlck1lc3NhZ2VEZWZsYXRlLFxuICAgICAgICAgICAgbWF4UGF5bG9hZDogdGhpcy5vcHRzLm1heEh0dHBCdWZmZXJTaXplXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMud3Mub24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdGhpcy53cy5vbihcImhlYWRlcnNcIiwgKGhlYWRlcnNBcnJheSwgcmVxKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gbm90ZTogJ3dzJyB1c2VzIGFuIGFycmF5IG9mIGhlYWRlcnMsIHdoaWxlIEVuZ2luZS5JTyB1c2VzIGFuIG9iamVjdCAocmVzcG9uc2Uud3JpdGVIZWFkKCkgYWNjZXB0cyBib3RoIGZvcm1hdHMpXG4gICAgICAgICAgICAgICAgLy8gd2UgY291bGQgYWxzbyB0cnkgdG8gcGFyc2UgdGhlIGFycmF5IGFuZCB0aGVuIHN5bmMgdGhlIHZhbHVlcywgYnV0IHRoYXQgd2lsbCBiZSBlcnJvci1wcm9uZVxuICAgICAgICAgICAgICAgIGNvbnN0IGFkZGl0aW9uYWxIZWFkZXJzID0ge307XG4gICAgICAgICAgICAgICAgY29uc3QgaXNJbml0aWFsUmVxdWVzdCA9ICFyZXEuX3F1ZXJ5LnNpZDtcbiAgICAgICAgICAgICAgICBpZiAoaXNJbml0aWFsUmVxdWVzdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJpbml0aWFsX2hlYWRlcnNcIiwgYWRkaXRpb25hbEhlYWRlcnMsIHJlcSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcImhlYWRlcnNcIiwgYWRkaXRpb25hbEhlYWRlcnMsIHJlcSk7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoYWRkaXRpb25hbEhlYWRlcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyc0FycmF5LnB1c2goYCR7a2V5fTogJHthZGRpdGlvbmFsSGVhZGVyc1trZXldfWApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2xlYW51cCgpIHtcbiAgICAgICAgaWYgKHRoaXMud3MpIHtcbiAgICAgICAgICAgIGRlYnVnKFwiY2xvc2luZyB3ZWJTb2NrZXRTZXJ2ZXJcIik7XG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlKCk7XG4gICAgICAgICAgICAvLyBkb24ndCBkZWxldGUgdGhpcy53cyBiZWNhdXNlIGl0IGNhbiBiZSB1c2VkIGFnYWluIGlmIHRoZSBodHRwIHNlcnZlciBzdGFydHMgbGlzdGVuaW5nIGFnYWluXG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUHJlcGFyZXMgYSByZXF1ZXN0IGJ5IHByb2Nlc3NpbmcgdGhlIHF1ZXJ5IHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHByZXBhcmUocmVxKSB7XG4gICAgICAgIC8vIHRyeSB0byBsZXZlcmFnZSBwcmUtZXhpc3RpbmcgYHJlcS5fcXVlcnlgIChlLmc6IGZyb20gY29ubmVjdClcbiAgICAgICAgaWYgKCFyZXEuX3F1ZXJ5KSB7XG4gICAgICAgICAgICByZXEuX3F1ZXJ5ID0gfnJlcS51cmwuaW5kZXhPZihcIj9cIikgPyBxcy5wYXJzZSgoMCwgdXJsXzEucGFyc2UpKHJlcS51cmwpLnF1ZXJ5KSA6IHt9O1xuICAgICAgICB9XG4gICAgfVxuICAgIGNyZWF0ZVRyYW5zcG9ydCh0cmFuc3BvcnROYW1lLCByZXEpIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0cmFuc3BvcnRzXzEuZGVmYXVsdFt0cmFuc3BvcnROYW1lXShyZXEpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGFuIEVuZ2luZS5JTyBIVFRQIHJlcXVlc3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2h0dHAuSW5jb21pbmdNZXNzYWdlfSByZXF1ZXN0XG4gICAgICogQHBhcmFtIHtodHRwLlNlcnZlclJlc3BvbnNlfGh0dHAuT3V0Z29pbmdNZXNzYWdlfSByZXNwb25zZVxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgaGFuZGxlUmVxdWVzdChyZXEsIHJlcykge1xuICAgICAgICBkZWJ1ZygnaGFuZGxpbmcgXCIlc1wiIGh0dHAgcmVxdWVzdCBcIiVzXCInLCByZXEubWV0aG9kLCByZXEudXJsKTtcbiAgICAgICAgdGhpcy5wcmVwYXJlKHJlcSk7XG4gICAgICAgIHJlcS5yZXMgPSByZXM7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gKGVycm9yQ29kZSwgZXJyb3JDb250ZXh0KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyb3JDb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJjb25uZWN0aW9uX2Vycm9yXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxLFxuICAgICAgICAgICAgICAgICAgICBjb2RlOiBlcnJvckNvZGUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFNlcnZlci5lcnJvck1lc3NhZ2VzW2Vycm9yQ29kZV0sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IGVycm9yQ29udGV4dFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGFib3J0UmVxdWVzdChyZXMsIGVycm9yQ29kZSwgZXJyb3JDb250ZXh0KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVxLl9xdWVyeS5zaWQpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhcInNldHRpbmcgbmV3IHJlcXVlc3QgZm9yIGV4aXN0aW5nIGNsaWVudFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWVudHNbcmVxLl9xdWVyeS5zaWRdLnRyYW5zcG9ydC5vblJlcXVlc3QocmVxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsb3NlQ29ubmVjdGlvbiA9IChlcnJvckNvZGUsIGVycm9yQ29udGV4dCkgPT4gYWJvcnRSZXF1ZXN0KHJlcywgZXJyb3JDb2RlLCBlcnJvckNvbnRleHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZHNoYWtlKHJlcS5fcXVlcnkudHJhbnNwb3J0LCByZXEsIGNsb3NlQ29ubmVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLmNvcnNNaWRkbGV3YXJlKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnNNaWRkbGV3YXJlLmNhbGwobnVsbCwgcmVxLCByZXMsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnZlcmlmeShyZXEsIGZhbHNlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudmVyaWZ5KHJlcSwgZmFsc2UsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGFuIEVuZ2luZS5JTyBIVFRQIFVwZ3JhZGUuXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuICAgIGhhbmRsZVVwZ3JhZGUocmVxLCBzb2NrZXQsIHVwZ3JhZGVIZWFkKSB7XG4gICAgICAgIHRoaXMucHJlcGFyZShyZXEpO1xuICAgICAgICB0aGlzLnZlcmlmeShyZXEsIHRydWUsIChlcnJvckNvZGUsIGVycm9yQ29udGV4dCkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yQ29kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcImNvbm5lY3Rpb25fZXJyb3JcIiwge1xuICAgICAgICAgICAgICAgICAgICByZXEsXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IGVycm9yQ29kZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogU2VydmVyLmVycm9yTWVzc2FnZXNbZXJyb3JDb2RlXSxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dDogZXJyb3JDb250ZXh0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYWJvcnRVcGdyYWRlKHNvY2tldCwgZXJyb3JDb2RlLCBlcnJvckNvbnRleHQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGhlYWQgPSBCdWZmZXIuZnJvbSh1cGdyYWRlSGVhZCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm9kZS9uby1kZXByZWNhdGVkLWFwaVxuICAgICAgICAgICAgdXBncmFkZUhlYWQgPSBudWxsO1xuICAgICAgICAgICAgLy8gZGVsZWdhdGUgdG8gd3NcbiAgICAgICAgICAgIHRoaXMud3MuaGFuZGxlVXBncmFkZShyZXEsIHNvY2tldCwgaGVhZCwgd2Vic29ja2V0ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uV2ViU29ja2V0KHJlcSwgc29ja2V0LCB3ZWJzb2NrZXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgdXBvbiBhIHdzLmlvIGNvbm5lY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3dzLlNvY2tldH0gd2Vic29ja2V0XG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgb25XZWJTb2NrZXQocmVxLCBzb2NrZXQsIHdlYnNvY2tldCkge1xuICAgICAgICB3ZWJzb2NrZXQub24oXCJlcnJvclwiLCBvblVwZ3JhZGVFcnJvcik7XG4gICAgICAgIGlmICh0cmFuc3BvcnRzXzEuZGVmYXVsdFtyZXEuX3F1ZXJ5LnRyYW5zcG9ydF0gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgIXRyYW5zcG9ydHNfMS5kZWZhdWx0W3JlcS5fcXVlcnkudHJhbnNwb3J0XS5wcm90b3R5cGUuaGFuZGxlc1VwZ3JhZGVzKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcInRyYW5zcG9ydCBkb2VzbnQgaGFuZGxlIHVwZ3JhZGVkIHJlcXVlc3RzXCIpO1xuICAgICAgICAgICAgd2Vic29ja2V0LmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gZ2V0IGNsaWVudCBpZFxuICAgICAgICBjb25zdCBpZCA9IHJlcS5fcXVlcnkuc2lkO1xuICAgICAgICAvLyBrZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSB3cy5Tb2NrZXRcbiAgICAgICAgcmVxLndlYnNvY2tldCA9IHdlYnNvY2tldDtcbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICBjb25zdCBjbGllbnQgPSB0aGlzLmNsaWVudHNbaWRdO1xuICAgICAgICAgICAgaWYgKCFjbGllbnQpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhcInVwZ3JhZGUgYXR0ZW1wdCBmb3IgY2xvc2VkIGNsaWVudFwiKTtcbiAgICAgICAgICAgICAgICB3ZWJzb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNsaWVudC51cGdyYWRpbmcpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhcInRyYW5zcG9ydCBoYXMgYWxyZWFkeSBiZWVuIHRyeWluZyB0byB1cGdyYWRlXCIpO1xuICAgICAgICAgICAgICAgIHdlYnNvY2tldC5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2xpZW50LnVwZ3JhZGVkKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoXCJ0cmFuc3BvcnQgaGFkIGFscmVhZHkgYmVlbiB1cGdyYWRlZFwiKTtcbiAgICAgICAgICAgICAgICB3ZWJzb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlYnVnKFwidXBncmFkaW5nIGV4aXN0aW5nIHRyYW5zcG9ydFwiKTtcbiAgICAgICAgICAgICAgICAvLyB0cmFuc3BvcnQgZXJyb3IgaGFuZGxpbmcgdGFrZXMgb3ZlclxuICAgICAgICAgICAgICAgIHdlYnNvY2tldC5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIG9uVXBncmFkZUVycm9yKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0cmFuc3BvcnQgPSB0aGlzLmNyZWF0ZVRyYW5zcG9ydChyZXEuX3F1ZXJ5LnRyYW5zcG9ydCwgcmVxKTtcbiAgICAgICAgICAgICAgICBpZiAocmVxLl9xdWVyeSAmJiByZXEuX3F1ZXJ5LmI2NCkge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnQuc3VwcG9ydHNCaW5hcnkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zcG9ydC5zdXBwb3J0c0JpbmFyeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyYW5zcG9ydC5wZXJNZXNzYWdlRGVmbGF0ZSA9IHRoaXMub3B0cy5wZXJNZXNzYWdlRGVmbGF0ZTtcbiAgICAgICAgICAgICAgICBjbGllbnQubWF5YmVVcGdyYWRlKHRyYW5zcG9ydCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyB0cmFuc3BvcnQgZXJyb3IgaGFuZGxpbmcgdGFrZXMgb3ZlclxuICAgICAgICAgICAgd2Vic29ja2V0LnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgb25VcGdyYWRlRXJyb3IpO1xuICAgICAgICAgICAgY29uc3QgY2xvc2VDb25uZWN0aW9uID0gKGVycm9yQ29kZSwgZXJyb3JDb250ZXh0KSA9PiBhYm9ydFVwZ3JhZGUoc29ja2V0LCBlcnJvckNvZGUsIGVycm9yQ29udGV4dCk7XG4gICAgICAgICAgICB0aGlzLmhhbmRzaGFrZShyZXEuX3F1ZXJ5LnRyYW5zcG9ydCwgcmVxLCBjbG9zZUNvbm5lY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG9uVXBncmFkZUVycm9yKCkge1xuICAgICAgICAgICAgZGVidWcoXCJ3ZWJzb2NrZXQgZXJyb3IgYmVmb3JlIHVwZ3JhZGVcIik7XG4gICAgICAgICAgICAvLyB3ZWJzb2NrZXQuY2xvc2UoKSBub3QgbmVlZGVkXG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FwdHVyZXMgdXBncmFkZSByZXF1ZXN0cyBmb3IgYSBodHRwLlNlcnZlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7aHR0cC5TZXJ2ZXJ9IHNlcnZlclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cbiAgICBhdHRhY2goc2VydmVyLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgbGV0IHBhdGggPSAob3B0aW9ucy5wYXRoIHx8IFwiL2VuZ2luZS5pb1wiKS5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gICAgICAgIGNvbnN0IGRlc3Ryb3lVcGdyYWRlVGltZW91dCA9IG9wdGlvbnMuZGVzdHJveVVwZ3JhZGVUaW1lb3V0IHx8IDEwMDA7XG4gICAgICAgIC8vIG5vcm1hbGl6ZSBwYXRoXG4gICAgICAgIHBhdGggKz0gXCIvXCI7XG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrKHJlcSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGggPT09IHJlcS51cmwuc3Vic3RyKDAsIHBhdGgubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjYWNoZSBhbmQgY2xlYW4gdXAgbGlzdGVuZXJzXG4gICAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHNlcnZlci5saXN0ZW5lcnMoXCJyZXF1ZXN0XCIpLnNsaWNlKDApO1xuICAgICAgICBzZXJ2ZXIucmVtb3ZlQWxsTGlzdGVuZXJzKFwicmVxdWVzdFwiKTtcbiAgICAgICAgc2VydmVyLm9uKFwiY2xvc2VcIiwgdGhpcy5jbG9zZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgc2VydmVyLm9uKFwibGlzdGVuaW5nXCIsIHRoaXMuaW5pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgLy8gYWRkIHJlcXVlc3QgaGFuZGxlclxuICAgICAgICBzZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIChyZXEsIHJlcykgPT4ge1xuICAgICAgICAgICAgaWYgKGNoZWNrKHJlcSkpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnaW50ZXJjZXB0aW5nIHJlcXVlc3QgZm9yIHBhdGggXCIlc1wiJywgcGF0aCk7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVSZXF1ZXN0KHJlcSwgcmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgICAgICBjb25zdCBsID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnNbaV0uY2FsbChzZXJ2ZXIsIHJlcSwgcmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAofnRoaXMub3B0cy50cmFuc3BvcnRzLmluZGV4T2YoXCJ3ZWJzb2NrZXRcIikpIHtcbiAgICAgICAgICAgIHNlcnZlci5vbihcInVwZ3JhZGVcIiwgKHJlcSwgc29ja2V0LCBoZWFkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrKHJlcSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVVcGdyYWRlKHJlcSwgc29ja2V0LCBoZWFkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZmFsc2UgIT09IG9wdGlvbnMuZGVzdHJveVVwZ3JhZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVmYXVsdCBub2RlIGJlaGF2aW9yIGlzIHRvIGRpc2Nvbm5lY3Qgd2hlbiBubyBoYW5kbGVyc1xuICAgICAgICAgICAgICAgICAgICAvLyBidXQgYnkgYWRkaW5nIGEgaGFuZGxlciwgd2UgcHJldmVudCB0aGF0XG4gICAgICAgICAgICAgICAgICAgIC8vIGFuZCBpZiBubyBlaW8gdGhpbmcgaGFuZGxlcyB0aGUgdXBncmFkZVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIHRoZSBzb2NrZXQgbmVlZHMgdG8gZGllIVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb2NrZXQud3JpdGFibGUgJiYgc29ja2V0LmJ5dGVzV3JpdHRlbiA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvY2tldC5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgZGVzdHJveVVwZ3JhZGVUaW1lb3V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuU2VydmVyID0gU2VydmVyO1xuLyoqXG4gKiBDbG9zZSB0aGUgSFRUUCBsb25nLXBvbGxpbmcgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSByZXMgLSB0aGUgcmVzcG9uc2Ugb2JqZWN0XG4gKiBAcGFyYW0gZXJyb3JDb2RlIC0gdGhlIGVycm9yIGNvZGVcbiAqIEBwYXJhbSBlcnJvckNvbnRleHQgLSBhZGRpdGlvbmFsIGVycm9yIGNvbnRleHRcbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gYWJvcnRSZXF1ZXN0KHJlcywgZXJyb3JDb2RlLCBlcnJvckNvbnRleHQpIHtcbiAgICBjb25zdCBzdGF0dXNDb2RlID0gZXJyb3JDb2RlID09PSBTZXJ2ZXIuZXJyb3JzLkZPUkJJRERFTiA/IDQwMyA6IDQwMDtcbiAgICBjb25zdCBtZXNzYWdlID0gZXJyb3JDb250ZXh0ICYmIGVycm9yQ29udGV4dC5tZXNzYWdlXG4gICAgICAgID8gZXJyb3JDb250ZXh0Lm1lc3NhZ2VcbiAgICAgICAgOiBTZXJ2ZXIuZXJyb3JNZXNzYWdlc1tlcnJvckNvZGVdO1xuICAgIHJlcy53cml0ZUhlYWQoc3RhdHVzQ29kZSwgeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9KTtcbiAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgY29kZTogZXJyb3JDb2RlLFxuICAgICAgICBtZXNzYWdlXG4gICAgfSkpO1xufVxuLyoqXG4gKiBDbG9zZSB0aGUgV2ViU29ja2V0IGNvbm5lY3Rpb25cbiAqXG4gKiBAcGFyYW0ge25ldC5Tb2NrZXR9IHNvY2tldFxuICogQHBhcmFtIHtzdHJpbmd9IGVycm9yQ29kZSAtIHRoZSBlcnJvciBjb2RlXG4gKiBAcGFyYW0ge29iamVjdH0gZXJyb3JDb250ZXh0IC0gYWRkaXRpb25hbCBlcnJvciBjb250ZXh0XG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGFib3J0VXBncmFkZShzb2NrZXQsIGVycm9yQ29kZSwgZXJyb3JDb250ZXh0ID0ge30pIHtcbiAgICBzb2NrZXQub24oXCJlcnJvclwiLCAoKSA9PiB7XG4gICAgICAgIGRlYnVnKFwiaWdub3JpbmcgZXJyb3IgZnJvbSBjbG9zZWQgY29ubmVjdGlvblwiKTtcbiAgICB9KTtcbiAgICBpZiAoc29ja2V0LndyaXRhYmxlKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlcnJvckNvbnRleHQubWVzc2FnZSB8fCBTZXJ2ZXIuZXJyb3JNZXNzYWdlc1tlcnJvckNvZGVdO1xuICAgICAgICBjb25zdCBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChtZXNzYWdlKTtcbiAgICAgICAgc29ja2V0LndyaXRlKFwiSFRUUC8xLjEgNDAwIEJhZCBSZXF1ZXN0XFxyXFxuXCIgK1xuICAgICAgICAgICAgXCJDb25uZWN0aW9uOiBjbG9zZVxcclxcblwiICtcbiAgICAgICAgICAgIFwiQ29udGVudC10eXBlOiB0ZXh0L2h0bWxcXHJcXG5cIiArXG4gICAgICAgICAgICBcIkNvbnRlbnQtTGVuZ3RoOiBcIiArXG4gICAgICAgICAgICBsZW5ndGggK1xuICAgICAgICAgICAgXCJcXHJcXG5cIiArXG4gICAgICAgICAgICBcIlxcclxcblwiICtcbiAgICAgICAgICAgIG1lc3NhZ2UpO1xuICAgIH1cbiAgICBzb2NrZXQuZGVzdHJveSgpO1xufVxuLyogZXNsaW50LWRpc2FibGUgKi9cbi8qKlxuICogRnJvbSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvYmxvYi92OC40LjAvbGliL19odHRwX2NvbW1vbi5qcyNMMzAzLUwzNTRcbiAqXG4gKiBUcnVlIGlmIHZhbCBjb250YWlucyBhbiBpbnZhbGlkIGZpZWxkLXZjaGFyXG4gKiAgZmllbGQtdmFsdWUgICAgPSAqKCBmaWVsZC1jb250ZW50IC8gb2JzLWZvbGQgKVxuICogIGZpZWxkLWNvbnRlbnQgID0gZmllbGQtdmNoYXIgWyAxKiggU1AgLyBIVEFCICkgZmllbGQtdmNoYXIgXVxuICogIGZpZWxkLXZjaGFyICAgID0gVkNIQVIgLyBvYnMtdGV4dFxuICpcbiAqIGNoZWNrSW52YWxpZEhlYWRlckNoYXIoKSBpcyBjdXJyZW50bHkgZGVzaWduZWQgdG8gYmUgaW5saW5hYmxlIGJ5IHY4LFxuICogc28gdGFrZSBjYXJlIHdoZW4gbWFraW5nIGNoYW5nZXMgdG8gdGhlIGltcGxlbWVudGF0aW9uIHNvIHRoYXQgdGhlIHNvdXJjZVxuICogY29kZSBzaXplIGRvZXMgbm90IGV4Y2VlZCB2OCdzIGRlZmF1bHQgbWF4X2lubGluZWRfc291cmNlX3NpemUgc2V0dGluZy5cbiAqKi9cbi8vIHByZXR0aWVyLWlnbm9yZVxuY29uc3QgdmFsaWRIZHJDaGFycyA9IFtcbiAgICAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSxcbiAgICAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLFxuICAgIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsXG4gICAgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSxcbiAgICAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLFxuICAgIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsXG4gICAgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSxcbiAgICAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLFxuICAgIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsXG4gICAgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSxcbiAgICAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLFxuICAgIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsXG4gICAgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSxcbiAgICAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxIC8vIC4uLiAyNTVcbl07XG5mdW5jdGlvbiBjaGVja0ludmFsaWRIZWFkZXJDaGFyKHZhbCkge1xuICAgIHZhbCArPSBcIlwiO1xuICAgIGlmICh2YWwubGVuZ3RoIDwgMSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmICghdmFsaWRIZHJDaGFyc1t2YWwuY2hhckNvZGVBdCgwKV0pIHtcbiAgICAgICAgZGVidWcoJ2ludmFsaWQgaGVhZGVyLCBpbmRleCAwLCBjaGFyIFwiJXNcIicsIHZhbC5jaGFyQ29kZUF0KDApKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoIDwgMilcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmICghdmFsaWRIZHJDaGFyc1t2YWwuY2hhckNvZGVBdCgxKV0pIHtcbiAgICAgICAgZGVidWcoJ2ludmFsaWQgaGVhZGVyLCBpbmRleCAxLCBjaGFyIFwiJXNcIicsIHZhbC5jaGFyQ29kZUF0KDEpKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoIDwgMylcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmICghdmFsaWRIZHJDaGFyc1t2YWwuY2hhckNvZGVBdCgyKV0pIHtcbiAgICAgICAgZGVidWcoJ2ludmFsaWQgaGVhZGVyLCBpbmRleCAyLCBjaGFyIFwiJXNcIicsIHZhbC5jaGFyQ29kZUF0KDIpKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoIDwgNClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmICghdmFsaWRIZHJDaGFyc1t2YWwuY2hhckNvZGVBdCgzKV0pIHtcbiAgICAgICAgZGVidWcoJ2ludmFsaWQgaGVhZGVyLCBpbmRleCAzLCBjaGFyIFwiJXNcIicsIHZhbC5jaGFyQ29kZUF0KDMpKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSA0OyBpIDwgdmFsLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmICghdmFsaWRIZHJDaGFyc1t2YWwuY2hhckNvZGVBdChpKV0pIHtcbiAgICAgICAgICAgIGRlYnVnKCdpbnZhbGlkIGhlYWRlciwgaW5kZXggXCIlaVwiLCBjaGFyIFwiJXNcIicsIGksIHZhbC5jaGFyQ29kZUF0KGkpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Tb2NrZXQgPSB2b2lkIDA7XG5jb25zdCBldmVudHNfMSA9IHJlcXVpcmUoXCJldmVudHNcIik7XG5jb25zdCBkZWJ1Z18xID0gcmVxdWlyZShcImRlYnVnXCIpO1xuY29uc3QgZGVidWcgPSAoMCwgZGVidWdfMS5kZWZhdWx0KShcImVuZ2luZTpzb2NrZXRcIik7XG5jbGFzcyBTb2NrZXQgZXh0ZW5kcyBldmVudHNfMS5FdmVudEVtaXR0ZXIge1xuICAgIC8qKlxuICAgICAqIENsaWVudCBjbGFzcyAoYWJzdHJhY3QpLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoaWQsIHNlcnZlciwgdHJhbnNwb3J0LCByZXEsIHByb3RvY29sKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSBzZXJ2ZXI7XG4gICAgICAgIHRoaXMudXBncmFkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBncmFkZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yZWFkeVN0YXRlID0gXCJvcGVuaW5nXCI7XG4gICAgICAgIHRoaXMud3JpdGVCdWZmZXIgPSBbXTtcbiAgICAgICAgdGhpcy5wYWNrZXRzRm4gPSBbXTtcbiAgICAgICAgdGhpcy5zZW50Q2FsbGJhY2tGbiA9IFtdO1xuICAgICAgICB0aGlzLmNsZWFudXBGbiA9IFtdO1xuICAgICAgICB0aGlzLnJlcXVlc3QgPSByZXE7XG4gICAgICAgIHRoaXMucHJvdG9jb2wgPSBwcm90b2NvbDtcbiAgICAgICAgLy8gQ2FjaGUgSVAgc2luY2UgaXQgbWlnaHQgbm90IGJlIGluIHRoZSByZXEgbGF0ZXJcbiAgICAgICAgaWYgKHJlcS53ZWJzb2NrZXQgJiYgcmVxLndlYnNvY2tldC5fc29ja2V0KSB7XG4gICAgICAgICAgICB0aGlzLnJlbW90ZUFkZHJlc3MgPSByZXEud2Vic29ja2V0Ll9zb2NrZXQucmVtb3RlQWRkcmVzcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3RlQWRkcmVzcyA9IHJlcS5jb25uZWN0aW9uLnJlbW90ZUFkZHJlc3M7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGVja0ludGVydmFsVGltZXIgPSBudWxsO1xuICAgICAgICB0aGlzLnVwZ3JhZGVUaW1lb3V0VGltZXIgPSBudWxsO1xuICAgICAgICB0aGlzLnBpbmdUaW1lb3V0VGltZXIgPSBudWxsO1xuICAgICAgICB0aGlzLnBpbmdJbnRlcnZhbFRpbWVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZXRUcmFuc3BvcnQodHJhbnNwb3J0KTtcbiAgICAgICAgdGhpcy5vbk9wZW4oKTtcbiAgICB9XG4gICAgZ2V0IHJlYWR5U3RhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWFkeVN0YXRlO1xuICAgIH1cbiAgICBzZXQgcmVhZHlTdGF0ZShzdGF0ZSkge1xuICAgICAgICBkZWJ1ZyhcInJlYWR5U3RhdGUgdXBkYXRlZCBmcm9tICVzIHRvICVzXCIsIHRoaXMuX3JlYWR5U3RhdGUsIHN0YXRlKTtcbiAgICAgICAgdGhpcy5fcmVhZHlTdGF0ZSA9IHN0YXRlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgdXBvbiB0cmFuc3BvcnQgY29uc2lkZXJlZCBvcGVuLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgb25PcGVuKCkge1xuICAgICAgICB0aGlzLnJlYWR5U3RhdGUgPSBcIm9wZW5cIjtcbiAgICAgICAgLy8gc2VuZHMgYW4gYG9wZW5gIHBhY2tldFxuICAgICAgICB0aGlzLnRyYW5zcG9ydC5zaWQgPSB0aGlzLmlkO1xuICAgICAgICB0aGlzLnNlbmRQYWNrZXQoXCJvcGVuXCIsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHNpZDogdGhpcy5pZCxcbiAgICAgICAgICAgIHVwZ3JhZGVzOiB0aGlzLmdldEF2YWlsYWJsZVVwZ3JhZGVzKCksXG4gICAgICAgICAgICBwaW5nSW50ZXJ2YWw6IHRoaXMuc2VydmVyLm9wdHMucGluZ0ludGVydmFsLFxuICAgICAgICAgICAgcGluZ1RpbWVvdXQ6IHRoaXMuc2VydmVyLm9wdHMucGluZ1RpbWVvdXRcbiAgICAgICAgfSkpO1xuICAgICAgICBpZiAodGhpcy5zZXJ2ZXIub3B0cy5pbml0aWFsUGFja2V0KSB7XG4gICAgICAgICAgICB0aGlzLnNlbmRQYWNrZXQoXCJtZXNzYWdlXCIsIHRoaXMuc2VydmVyLm9wdHMuaW5pdGlhbFBhY2tldCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbWl0KFwib3BlblwiKTtcbiAgICAgICAgaWYgKHRoaXMucHJvdG9jb2wgPT09IDMpIHtcbiAgICAgICAgICAgIC8vIGluIHByb3RvY29sIHYzLCB0aGUgY2xpZW50IHNlbmRzIGEgcGluZywgYW5kIHRoZSBzZXJ2ZXIgYW5zd2VycyB3aXRoIGEgcG9uZ1xuICAgICAgICAgICAgdGhpcy5yZXNldFBpbmdUaW1lb3V0KHRoaXMuc2VydmVyLm9wdHMucGluZ0ludGVydmFsICsgdGhpcy5zZXJ2ZXIub3B0cy5waW5nVGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBpbiBwcm90b2NvbCB2NCwgdGhlIHNlcnZlciBzZW5kcyBhIHBpbmcsIGFuZCB0aGUgY2xpZW50IGFuc3dlcnMgd2l0aCBhIHBvbmdcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVQaW5nKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHVwb24gdHJhbnNwb3J0IHBhY2tldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYWNrZXRcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBvblBhY2tldChwYWNrZXQpIHtcbiAgICAgICAgaWYgKFwib3BlblwiICE9PSB0aGlzLnJlYWR5U3RhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWJ1ZyhcInBhY2tldCByZWNlaXZlZCB3aXRoIGNsb3NlZCBzb2NrZXRcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXhwb3J0IHBhY2tldCBldmVudFxuICAgICAgICBkZWJ1ZyhgcmVjZWl2ZWQgcGFja2V0ICR7cGFja2V0LnR5cGV9YCk7XG4gICAgICAgIHRoaXMuZW1pdChcInBhY2tldFwiLCBwYWNrZXQpO1xuICAgICAgICAvLyBSZXNldCBwaW5nIHRpbWVvdXQgb24gYW55IHBhY2tldCwgaW5jb21pbmcgZGF0YSBpcyBhIGdvb2Qgc2lnbiBvZlxuICAgICAgICAvLyBvdGhlciBzaWRlJ3MgbGl2ZW5lc3NcbiAgICAgICAgdGhpcy5yZXNldFBpbmdUaW1lb3V0KHRoaXMuc2VydmVyLm9wdHMucGluZ0ludGVydmFsICsgdGhpcy5zZXJ2ZXIub3B0cy5waW5nVGltZW91dCk7XG4gICAgICAgIHN3aXRjaCAocGFja2V0LnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJwaW5nXCI6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHJhbnNwb3J0LnByb3RvY29sICE9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25FcnJvcihcImludmFsaWQgaGVhcnRiZWF0IGRpcmVjdGlvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWJ1ZyhcImdvdCBwaW5nXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFBhY2tldChcInBvbmdcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwiaGVhcnRiZWF0XCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInBvbmdcIjpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmFuc3BvcnQucHJvdG9jb2wgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yKFwiaW52YWxpZCBoZWFydGJlYXQgZGlyZWN0aW9uXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlYnVnKFwiZ290IHBvbmdcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5waW5nSW50ZXJ2YWxUaW1lci5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwiaGVhcnRiZWF0XCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImVycm9yXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNsb3NlKFwicGFyc2UgZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibWVzc2FnZVwiOlxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcImRhdGFcIiwgcGFja2V0LmRhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcIm1lc3NhZ2VcIiwgcGFja2V0LmRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxlZCB1cG9uIHRyYW5zcG9ydCBlcnJvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIG9iamVjdFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uRXJyb3IoZXJyKSB7XG4gICAgICAgIGRlYnVnKFwidHJhbnNwb3J0IGVycm9yXCIpO1xuICAgICAgICB0aGlzLm9uQ2xvc2UoXCJ0cmFuc3BvcnQgZXJyb3JcIiwgZXJyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGluZ3MgY2xpZW50IGV2ZXJ5IGB0aGlzLnBpbmdJbnRlcnZhbGAgYW5kIGV4cGVjdHMgcmVzcG9uc2VcbiAgICAgKiB3aXRoaW4gYHRoaXMucGluZ1RpbWVvdXRgIG9yIGNsb3NlcyBjb25uZWN0aW9uLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgc2NoZWR1bGVQaW5nKCkge1xuICAgICAgICB0aGlzLnBpbmdJbnRlcnZhbFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBkZWJ1ZyhcIndyaXRpbmcgcGluZyBwYWNrZXQgLSBleHBlY3RpbmcgcG9uZyB3aXRoaW4gJXNtc1wiLCB0aGlzLnNlcnZlci5vcHRzLnBpbmdUaW1lb3V0KTtcbiAgICAgICAgICAgIHRoaXMuc2VuZFBhY2tldChcInBpbmdcIik7XG4gICAgICAgICAgICB0aGlzLnJlc2V0UGluZ1RpbWVvdXQodGhpcy5zZXJ2ZXIub3B0cy5waW5nVGltZW91dCk7XG4gICAgICAgIH0sIHRoaXMuc2VydmVyLm9wdHMucGluZ0ludGVydmFsKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVzZXRzIHBpbmcgdGltZW91dC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHJlc2V0UGluZ1RpbWVvdXQodGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5waW5nVGltZW91dFRpbWVyKTtcbiAgICAgICAgdGhpcy5waW5nVGltZW91dFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSBcImNsb3NlZFwiKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZShcInBpbmcgdGltZW91dFwiKTtcbiAgICAgICAgfSwgdGltZW91dCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEF0dGFjaGVzIGhhbmRsZXJzIGZvciB0aGUgZ2l2ZW4gdHJhbnNwb3J0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtUcmFuc3BvcnR9IHRyYW5zcG9ydFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHNldFRyYW5zcG9ydCh0cmFuc3BvcnQpIHtcbiAgICAgICAgY29uc3Qgb25FcnJvciA9IHRoaXMub25FcnJvci5iaW5kKHRoaXMpO1xuICAgICAgICBjb25zdCBvblBhY2tldCA9IHRoaXMub25QYWNrZXQuYmluZCh0aGlzKTtcbiAgICAgICAgY29uc3QgZmx1c2ggPSB0aGlzLmZsdXNoLmJpbmQodGhpcyk7XG4gICAgICAgIGNvbnN0IG9uQ2xvc2UgPSB0aGlzLm9uQ2xvc2UuYmluZCh0aGlzLCBcInRyYW5zcG9ydCBjbG9zZVwiKTtcbiAgICAgICAgdGhpcy50cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG4gICAgICAgIHRoaXMudHJhbnNwb3J0Lm9uY2UoXCJlcnJvclwiLCBvbkVycm9yKTtcbiAgICAgICAgdGhpcy50cmFuc3BvcnQub24oXCJwYWNrZXRcIiwgb25QYWNrZXQpO1xuICAgICAgICB0aGlzLnRyYW5zcG9ydC5vbihcImRyYWluXCIsIGZsdXNoKTtcbiAgICAgICAgdGhpcy50cmFuc3BvcnQub25jZShcImNsb3NlXCIsIG9uQ2xvc2UpO1xuICAgICAgICAvLyB0aGlzIGZ1bmN0aW9uIHdpbGwgbWFuYWdlIHBhY2tldCBldmVudHMgKGFsc28gbWVzc2FnZSBjYWxsYmFja3MpXG4gICAgICAgIHRoaXMuc2V0dXBTZW5kQ2FsbGJhY2soKTtcbiAgICAgICAgdGhpcy5jbGVhbnVwRm4ucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0cmFuc3BvcnQucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBvbkVycm9yKTtcbiAgICAgICAgICAgIHRyYW5zcG9ydC5yZW1vdmVMaXN0ZW5lcihcInBhY2tldFwiLCBvblBhY2tldCk7XG4gICAgICAgICAgICB0cmFuc3BvcnQucmVtb3ZlTGlzdGVuZXIoXCJkcmFpblwiLCBmbHVzaCk7XG4gICAgICAgICAgICB0cmFuc3BvcnQucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLCBvbkNsb3NlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVwZ3JhZGVzIHNvY2tldCB0byB0aGUgZ2l2ZW4gdHJhbnNwb3J0XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RyYW5zcG9ydH0gdHJhbnNwb3J0XG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgbWF5YmVVcGdyYWRlKHRyYW5zcG9ydCkge1xuICAgICAgICBkZWJ1ZygnbWlnaHQgdXBncmFkZSBzb2NrZXQgdHJhbnNwb3J0IGZyb20gXCIlc1wiIHRvIFwiJXNcIicsIHRoaXMudHJhbnNwb3J0Lm5hbWUsIHRyYW5zcG9ydC5uYW1lKTtcbiAgICAgICAgdGhpcy51cGdyYWRpbmcgPSB0cnVlO1xuICAgICAgICAvLyBzZXQgdHJhbnNwb3J0IHVwZ3JhZGUgdGltZXJcbiAgICAgICAgdGhpcy51cGdyYWRlVGltZW91dFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBkZWJ1ZyhcImNsaWVudCBkaWQgbm90IGNvbXBsZXRlIHVwZ3JhZGUgLSBjbG9zaW5nIHRyYW5zcG9ydFwiKTtcbiAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgIGlmIChcIm9wZW5cIiA9PT0gdHJhbnNwb3J0LnJlYWR5U3RhdGUpIHtcbiAgICAgICAgICAgICAgICB0cmFuc3BvcnQuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcy5zZXJ2ZXIub3B0cy51cGdyYWRlVGltZW91dCk7XG4gICAgICAgIGNvbnN0IG9uUGFja2V0ID0gcGFja2V0ID0+IHtcbiAgICAgICAgICAgIGlmIChcInBpbmdcIiA9PT0gcGFja2V0LnR5cGUgJiYgXCJwcm9iZVwiID09PSBwYWNrZXQuZGF0YSkge1xuICAgICAgICAgICAgICAgIGRlYnVnKFwiZ290IHByb2JlIHBpbmcgcGFja2V0LCBzZW5kaW5nIHBvbmdcIik7XG4gICAgICAgICAgICAgICAgdHJhbnNwb3J0LnNlbmQoW3sgdHlwZTogXCJwb25nXCIsIGRhdGE6IFwicHJvYmVcIiB9XSk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwidXBncmFkaW5nXCIsIHRyYW5zcG9ydCk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmNoZWNrSW50ZXJ2YWxUaW1lcik7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0ludGVydmFsVGltZXIgPSBzZXRJbnRlcnZhbChjaGVjaywgMTAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKFwidXBncmFkZVwiID09PSBwYWNrZXQudHlwZSAmJiB0aGlzLnJlYWR5U3RhdGUgIT09IFwiY2xvc2VkXCIpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhcImdvdCB1cGdyYWRlIHBhY2tldCAtIHVwZ3JhZGluZ1wiKTtcbiAgICAgICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQuZGlzY2FyZCgpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBncmFkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJUcmFuc3BvcnQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRyYW5zcG9ydCh0cmFuc3BvcnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcInVwZ3JhZGVcIiwgdHJhbnNwb3J0KTtcbiAgICAgICAgICAgICAgICB0aGlzLmZsdXNoKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gXCJjbG9zaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNwb3J0LmNsb3NlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25DbG9zZShcImZvcmNlZCBjbG9zZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgICAgIHRyYW5zcG9ydC5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvLyB3ZSBmb3JjZSBhIHBvbGxpbmcgY3ljbGUgdG8gZW5zdXJlIGEgZmFzdCB1cGdyYWRlXG4gICAgICAgIGNvbnN0IGNoZWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKFwicG9sbGluZ1wiID09PSB0aGlzLnRyYW5zcG9ydC5uYW1lICYmIHRoaXMudHJhbnNwb3J0LndyaXRhYmxlKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoXCJ3cml0aW5nIGEgbm9vcCBwYWNrZXQgdG8gcG9sbGluZyBmb3IgZmFzdCB1cGdyYWRlXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0LnNlbmQoW3sgdHlwZTogXCJub29wXCIgfV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGdyYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jaGVja0ludGVydmFsVGltZXIpO1xuICAgICAgICAgICAgdGhpcy5jaGVja0ludGVydmFsVGltZXIgPSBudWxsO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudXBncmFkZVRpbWVvdXRUaW1lcik7XG4gICAgICAgICAgICB0aGlzLnVwZ3JhZGVUaW1lb3V0VGltZXIgPSBudWxsO1xuICAgICAgICAgICAgdHJhbnNwb3J0LnJlbW92ZUxpc3RlbmVyKFwicGFja2V0XCIsIG9uUGFja2V0KTtcbiAgICAgICAgICAgIHRyYW5zcG9ydC5yZW1vdmVMaXN0ZW5lcihcImNsb3NlXCIsIG9uVHJhbnNwb3J0Q2xvc2UpO1xuICAgICAgICAgICAgdHJhbnNwb3J0LnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgb25FcnJvcik7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIiwgb25DbG9zZSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG9uRXJyb3IgPSBlcnIgPT4ge1xuICAgICAgICAgICAgZGVidWcoXCJjbGllbnQgZGlkIG5vdCBjb21wbGV0ZSB1cGdyYWRlIC0gJXNcIiwgZXJyKTtcbiAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgIHRyYW5zcG9ydC5jbG9zZSgpO1xuICAgICAgICAgICAgdHJhbnNwb3J0ID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgb25UcmFuc3BvcnRDbG9zZSA9ICgpID0+IHtcbiAgICAgICAgICAgIG9uRXJyb3IoXCJ0cmFuc3BvcnQgY2xvc2VkXCIpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBvbkNsb3NlID0gKCkgPT4ge1xuICAgICAgICAgICAgb25FcnJvcihcInNvY2tldCBjbG9zZWRcIik7XG4gICAgICAgIH07XG4gICAgICAgIHRyYW5zcG9ydC5vbihcInBhY2tldFwiLCBvblBhY2tldCk7XG4gICAgICAgIHRyYW5zcG9ydC5vbmNlKFwiY2xvc2VcIiwgb25UcmFuc3BvcnRDbG9zZSk7XG4gICAgICAgIHRyYW5zcG9ydC5vbmNlKFwiZXJyb3JcIiwgb25FcnJvcik7XG4gICAgICAgIHRoaXMub25jZShcImNsb3NlXCIsIG9uQ2xvc2UpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbGVhcnMgbGlzdGVuZXJzIGFuZCB0aW1lcnMgYXNzb2NpYXRlZCB3aXRoIGN1cnJlbnQgdHJhbnNwb3J0LlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgY2xlYXJUcmFuc3BvcnQoKSB7XG4gICAgICAgIGxldCBjbGVhbnVwO1xuICAgICAgICBjb25zdCB0b0NsZWFuVXAgPSB0aGlzLmNsZWFudXBGbi5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9DbGVhblVwOyBpKyspIHtcbiAgICAgICAgICAgIGNsZWFudXAgPSB0aGlzLmNsZWFudXBGbi5zaGlmdCgpO1xuICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNpbGVuY2UgZnVydGhlciB0cmFuc3BvcnQgZXJyb3JzIGFuZCBwcmV2ZW50IHVuY2F1Z2h0IGV4Y2VwdGlvbnNcbiAgICAgICAgdGhpcy50cmFuc3BvcnQub24oXCJlcnJvclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcImVycm9yIHRyaWdnZXJlZCBieSBkaXNjYXJkZWQgdHJhbnNwb3J0XCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gZW5zdXJlIHRyYW5zcG9ydCB3b24ndCBzdGF5IG9wZW5cbiAgICAgICAgdGhpcy50cmFuc3BvcnQuY2xvc2UoKTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucGluZ1RpbWVvdXRUaW1lcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxlZCB1cG9uIHRyYW5zcG9ydCBjb25zaWRlcmVkIGNsb3NlZC5cbiAgICAgKiBQb3NzaWJsZSByZWFzb25zOiBgcGluZyB0aW1lb3V0YCwgYGNsaWVudCBlcnJvcmAsIGBwYXJzZSBlcnJvcmAsXG4gICAgICogYHRyYW5zcG9ydCBlcnJvcmAsIGBzZXJ2ZXIgY2xvc2VgLCBgdHJhbnNwb3J0IGNsb3NlYFxuICAgICAqL1xuICAgIG9uQ2xvc2UocmVhc29uLCBkZXNjcmlwdGlvbikge1xuICAgICAgICBpZiAoXCJjbG9zZWRcIiAhPT0gdGhpcy5yZWFkeVN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5U3RhdGUgPSBcImNsb3NlZFwiO1xuICAgICAgICAgICAgLy8gY2xlYXIgdGltZXJzXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5waW5nSW50ZXJ2YWxUaW1lcik7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5waW5nVGltZW91dFRpbWVyKTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jaGVja0ludGVydmFsVGltZXIpO1xuICAgICAgICAgICAgdGhpcy5jaGVja0ludGVydmFsVGltZXIgPSBudWxsO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudXBncmFkZVRpbWVvdXRUaW1lcik7XG4gICAgICAgICAgICAvLyBjbGVhbiB3cml0ZUJ1ZmZlciBpbiBuZXh0IHRpY2ssIHNvIGRldmVsb3BlcnMgY2FuIHN0aWxsXG4gICAgICAgICAgICAvLyBncmFiIHRoZSB3cml0ZUJ1ZmZlciBvbiAnY2xvc2UnIGV2ZW50XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLndyaXRlQnVmZmVyID0gW107XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMucGFja2V0c0ZuID0gW107XG4gICAgICAgICAgICB0aGlzLnNlbnRDYWxsYmFja0ZuID0gW107XG4gICAgICAgICAgICB0aGlzLmNsZWFyVHJhbnNwb3J0KCk7XG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJjbG9zZVwiLCByZWFzb24sIGRlc2NyaXB0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXR1cCBhbmQgbWFuYWdlIHNlbmQgY2FsbGJhY2tcbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHNldHVwU2VuZENhbGxiYWNrKCkge1xuICAgICAgICAvLyB0aGUgbWVzc2FnZSB3YXMgc2VudCBzdWNjZXNzZnVsbHksIGV4ZWN1dGUgdGhlIGNhbGxiYWNrXG4gICAgICAgIGNvbnN0IG9uRHJhaW4gPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZW50Q2FsbGJhY2tGbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VxRm4gPSB0aGlzLnNlbnRDYWxsYmFja0ZuLnNwbGljZSgwLCAxKVswXTtcbiAgICAgICAgICAgICAgICBpZiAoXCJmdW5jdGlvblwiID09PSB0eXBlb2Ygc2VxRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoXCJleGVjdXRpbmcgc2VuZCBjYWxsYmFja1wiKTtcbiAgICAgICAgICAgICAgICAgICAgc2VxRm4odGhpcy50cmFuc3BvcnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNlcUZuKSkge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1ZyhcImV4ZWN1dGluZyBiYXRjaCBzZW5kIGNhbGxiYWNrXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsID0gc2VxRm4ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXCJmdW5jdGlvblwiID09PSB0eXBlb2Ygc2VxRm5baV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXFGbltpXSh0aGlzLnRyYW5zcG9ydCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudHJhbnNwb3J0Lm9uKFwiZHJhaW5cIiwgb25EcmFpbik7XG4gICAgICAgIHRoaXMuY2xlYW51cEZuLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQucmVtb3ZlTGlzdGVuZXIoXCJkcmFpblwiLCBvbkRyYWluKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNlbmRzIGEgbWVzc2FnZSBwYWNrZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJuIHtTb2NrZXR9IGZvciBjaGFpbmluZ1xuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgc2VuZChkYXRhLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgICAgICB0aGlzLnNlbmRQYWNrZXQoXCJtZXNzYWdlXCIsIGRhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHdyaXRlKGRhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuc2VuZFBhY2tldChcIm1lc3NhZ2VcIiwgZGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2VuZHMgYSBwYWNrZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFja2V0IHR5cGVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9uYWwsIGRhdGFcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHNlbmRQYWNrZXQodHlwZSwgZGF0YSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICAgICAgICAgIG9wdGlvbnMgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICBvcHRpb25zLmNvbXByZXNzID0gZmFsc2UgIT09IG9wdGlvbnMuY29tcHJlc3M7XG4gICAgICAgIGlmIChcImNsb3NpbmdcIiAhPT0gdGhpcy5yZWFkeVN0YXRlICYmIFwiY2xvc2VkXCIgIT09IHRoaXMucmVhZHlTdGF0ZSkge1xuICAgICAgICAgICAgZGVidWcoJ3NlbmRpbmcgcGFja2V0IFwiJXNcIiAoJXMpJywgdHlwZSwgZGF0YSk7XG4gICAgICAgICAgICBjb25zdCBwYWNrZXQgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGRhdGEpXG4gICAgICAgICAgICAgICAgcGFja2V0LmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgLy8gZXhwb3J0cyBwYWNrZXRDcmVhdGUgZXZlbnRcbiAgICAgICAgICAgIHRoaXMuZW1pdChcInBhY2tldENyZWF0ZVwiLCBwYWNrZXQpO1xuICAgICAgICAgICAgdGhpcy53cml0ZUJ1ZmZlci5wdXNoKHBhY2tldCk7XG4gICAgICAgICAgICAvLyBhZGQgc2VuZCBjYWxsYmFjayB0byBvYmplY3QsIGlmIGRlZmluZWRcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaylcbiAgICAgICAgICAgICAgICB0aGlzLnBhY2tldHNGbi5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHRoaXMuZmx1c2goKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdHRlbXB0cyB0byBmbHVzaCB0aGUgcGFja2V0cyBidWZmZXIuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBmbHVzaCgpIHtcbiAgICAgICAgaWYgKFwiY2xvc2VkXCIgIT09IHRoaXMucmVhZHlTdGF0ZSAmJlxuICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQud3JpdGFibGUgJiZcbiAgICAgICAgICAgIHRoaXMud3JpdGVCdWZmZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcImZsdXNoaW5nIGJ1ZmZlciB0byB0cmFuc3BvcnRcIik7XG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJmbHVzaFwiLCB0aGlzLndyaXRlQnVmZmVyKTtcbiAgICAgICAgICAgIHRoaXMuc2VydmVyLmVtaXQoXCJmbHVzaFwiLCB0aGlzLCB0aGlzLndyaXRlQnVmZmVyKTtcbiAgICAgICAgICAgIGNvbnN0IHdidWYgPSB0aGlzLndyaXRlQnVmZmVyO1xuICAgICAgICAgICAgdGhpcy53cml0ZUJ1ZmZlciA9IFtdO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnRyYW5zcG9ydC5zdXBwb3J0c0ZyYW1pbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbnRDYWxsYmFja0ZuLnB1c2godGhpcy5wYWNrZXRzRm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZW50Q2FsbGJhY2tGbi5wdXNoLmFwcGx5KHRoaXMuc2VudENhbGxiYWNrRm4sIHRoaXMucGFja2V0c0ZuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGFja2V0c0ZuID0gW107XG4gICAgICAgICAgICB0aGlzLnRyYW5zcG9ydC5zZW5kKHdidWYpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KFwiZHJhaW5cIik7XG4gICAgICAgICAgICB0aGlzLnNlcnZlci5lbWl0KFwiZHJhaW5cIiwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IGF2YWlsYWJsZSB1cGdyYWRlcyBmb3IgdGhpcyBzb2NrZXQuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXRBdmFpbGFibGVVcGdyYWRlcygpIHtcbiAgICAgICAgY29uc3QgYXZhaWxhYmxlVXBncmFkZXMgPSBbXTtcbiAgICAgICAgY29uc3QgYWxsVXBncmFkZXMgPSB0aGlzLnNlcnZlci51cGdyYWRlcyh0aGlzLnRyYW5zcG9ydC5uYW1lKTtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBjb25zdCBsID0gYWxsVXBncmFkZXMubGVuZ3RoO1xuICAgICAgICBmb3IgKDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdXBnID0gYWxsVXBncmFkZXNbaV07XG4gICAgICAgICAgICBpZiAodGhpcy5zZXJ2ZXIub3B0cy50cmFuc3BvcnRzLmluZGV4T2YodXBnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVVcGdyYWRlcy5wdXNoKHVwZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZVVwZ3JhZGVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgdGhlIHNvY2tldCBhbmQgdW5kZXJseWluZyB0cmFuc3BvcnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRpc2NhcmQgLSBvcHRpb25hbCwgZGlzY2FyZCB0aGUgdHJhbnNwb3J0XG4gICAgICogQHJldHVybiB7U29ja2V0fSBmb3IgY2hhaW5pbmdcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuICAgIGNsb3NlKGRpc2NhcmQpIHtcbiAgICAgICAgaWYgKFwib3BlblwiICE9PSB0aGlzLnJlYWR5U3RhdGUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMucmVhZHlTdGF0ZSA9IFwiY2xvc2luZ1wiO1xuICAgICAgICBpZiAodGhpcy53cml0ZUJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMub25jZShcImRyYWluXCIsIHRoaXMuY2xvc2VUcmFuc3BvcnQuYmluZCh0aGlzLCBkaXNjYXJkKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbG9zZVRyYW5zcG9ydChkaXNjYXJkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xvc2VzIHRoZSB1bmRlcmx5aW5nIHRyYW5zcG9ydC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZGlzY2FyZFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGNsb3NlVHJhbnNwb3J0KGRpc2NhcmQpIHtcbiAgICAgICAgaWYgKGRpc2NhcmQpXG4gICAgICAgICAgICB0aGlzLnRyYW5zcG9ydC5kaXNjYXJkKCk7XG4gICAgICAgIHRoaXMudHJhbnNwb3J0LmNsb3NlKHRoaXMub25DbG9zZS5iaW5kKHRoaXMsIFwiZm9yY2VkIGNsb3NlXCIpKTtcbiAgICB9XG59XG5leHBvcnRzLlNvY2tldCA9IFNvY2tldDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5UcmFuc3BvcnQgPSB2b2lkIDA7XG5jb25zdCBldmVudHNfMSA9IHJlcXVpcmUoXCJldmVudHNcIik7XG5jb25zdCBwYXJzZXJfdjQgPSByZXF1aXJlKFwiZW5naW5lLmlvLXBhcnNlclwiKTtcbmNvbnN0IHBhcnNlcl92MyA9IHJlcXVpcmUoXCIuL3BhcnNlci12My9pbmRleFwiKTtcbmNvbnN0IGRlYnVnXzEgPSByZXF1aXJlKFwiZGVidWdcIik7XG5jb25zdCBkZWJ1ZyA9ICgwLCBkZWJ1Z18xLmRlZmF1bHQpKFwiZW5naW5lOnRyYW5zcG9ydFwiKTtcbi8qKlxuICogTm9vcCBmdW5jdGlvbi5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gbm9vcCgpIHsgfVxuY2xhc3MgVHJhbnNwb3J0IGV4dGVuZHMgZXZlbnRzXzEuRXZlbnRFbWl0dGVyIHtcbiAgICAvKipcbiAgICAgKiBUcmFuc3BvcnQgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2h0dHAuSW5jb21pbmdNZXNzYWdlfSByZXF1ZXN0XG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihyZXEpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5yZWFkeVN0YXRlID0gXCJvcGVuXCI7XG4gICAgICAgIHRoaXMuZGlzY2FyZGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMucHJvdG9jb2wgPSByZXEuX3F1ZXJ5LkVJTyA9PT0gXCI0XCIgPyA0IDogMzsgLy8gM3JkIHJldmlzaW9uIGJ5IGRlZmF1bHRcbiAgICAgICAgdGhpcy5wYXJzZXIgPSB0aGlzLnByb3RvY29sID09PSA0ID8gcGFyc2VyX3Y0IDogcGFyc2VyX3YzO1xuICAgIH1cbiAgICBnZXQgcmVhZHlTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWR5U3RhdGU7XG4gICAgfVxuICAgIHNldCByZWFkeVN0YXRlKHN0YXRlKSB7XG4gICAgICAgIGRlYnVnKFwicmVhZHlTdGF0ZSB1cGRhdGVkIGZyb20gJXMgdG8gJXMgKCVzKVwiLCB0aGlzLl9yZWFkeVN0YXRlLCBzdGF0ZSwgdGhpcy5uYW1lKTtcbiAgICAgICAgdGhpcy5fcmVhZHlTdGF0ZSA9IHN0YXRlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGbGFncyB0aGUgdHJhbnNwb3J0IGFzIGRpc2NhcmRlZC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGRpc2NhcmQoKSB7XG4gICAgICAgIHRoaXMuZGlzY2FyZGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdpdGggYW4gaW5jb21pbmcgSFRUUCByZXF1ZXN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtodHRwLkluY29taW5nTWVzc2FnZX0gcmVxdWVzdFxuICAgICAqIEBhcGkgcHJvdGVjdGVkXG4gICAgICovXG4gICAgb25SZXF1ZXN0KHJlcSkge1xuICAgICAgICBkZWJ1ZyhcInNldHRpbmcgcmVxdWVzdFwiKTtcbiAgICAgICAgdGhpcy5yZXEgPSByZXE7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsb3NlcyB0aGUgdHJhbnNwb3J0LlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgY2xvc2UoZm4pIHtcbiAgICAgICAgaWYgKFwiY2xvc2VkXCIgPT09IHRoaXMucmVhZHlTdGF0ZSB8fCBcImNsb3NpbmdcIiA9PT0gdGhpcy5yZWFkeVN0YXRlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLnJlYWR5U3RhdGUgPSBcImNsb3NpbmdcIjtcbiAgICAgICAgdGhpcy5kb0Nsb3NlKGZuIHx8IG5vb3ApO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2l0aCBhIHRyYW5zcG9ydCBlcnJvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlIGVycm9yXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVycm9yIGRlc2NyaXB0aW9uXG4gICAgICogQGFwaSBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBvbkVycm9yKG1zZywgZGVzYykge1xuICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnMoXCJlcnJvclwiKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihtc2cpO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgZXJyLnR5cGUgPSBcIlRyYW5zcG9ydEVycm9yXCI7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBlcnIuZGVzY3JpcHRpb24gPSBkZXNjO1xuICAgICAgICAgICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlYnVnKFwiaWdub3JlZCB0cmFuc3BvcnQgZXJyb3IgJXMgKCVzKVwiLCBtc2csIGRlc2MpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aXRoIHBhcnNlZCBvdXQgYSBwYWNrZXRzIGZyb20gdGhlIGRhdGEgc3RyZWFtLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhY2tldFxuICAgICAqIEBhcGkgcHJvdGVjdGVkXG4gICAgICovXG4gICAgb25QYWNrZXQocGFja2V0KSB7XG4gICAgICAgIHRoaXMuZW1pdChcInBhY2tldFwiLCBwYWNrZXQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2l0aCB0aGUgZW5jb2RlZCBwYWNrZXQgZGF0YS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhXG4gICAgICogQGFwaSBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBvbkRhdGEoZGF0YSkge1xuICAgICAgICB0aGlzLm9uUGFja2V0KHRoaXMucGFyc2VyLmRlY29kZVBhY2tldChkYXRhKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxlZCB1cG9uIHRyYW5zcG9ydCBjbG9zZS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJvdGVjdGVkXG4gICAgICovXG4gICAgb25DbG9zZSgpIHtcbiAgICAgICAgdGhpcy5yZWFkeVN0YXRlID0gXCJjbG9zZWRcIjtcbiAgICAgICAgdGhpcy5lbWl0KFwiY2xvc2VcIik7XG4gICAgfVxufVxuZXhwb3J0cy5UcmFuc3BvcnQgPSBUcmFuc3BvcnQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHBvbGxpbmdfMSA9IHJlcXVpcmUoXCIuL3BvbGxpbmdcIik7XG5jb25zdCB3ZWJzb2NrZXRfMSA9IHJlcXVpcmUoXCIuL3dlYnNvY2tldFwiKTtcbmV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgICBwb2xsaW5nOiBwb2xsaW5nXzEuUG9sbGluZyxcbiAgICB3ZWJzb2NrZXQ6IHdlYnNvY2tldF8xLldlYlNvY2tldFxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Qb2xsaW5nID0gdm9pZCAwO1xuY29uc3QgdHJhbnNwb3J0XzEgPSByZXF1aXJlKFwiLi4vdHJhbnNwb3J0XCIpO1xuY29uc3QgemxpYl8xID0gcmVxdWlyZShcInpsaWJcIik7XG5jb25zdCBhY2NlcHRzID0gcmVxdWlyZShcImFjY2VwdHNcIik7XG5jb25zdCBkZWJ1Z18xID0gcmVxdWlyZShcImRlYnVnXCIpO1xuY29uc3QgZGVidWcgPSAoMCwgZGVidWdfMS5kZWZhdWx0KShcImVuZ2luZTpwb2xsaW5nXCIpO1xuY29uc3QgY29tcHJlc3Npb25NZXRob2RzID0ge1xuICAgIGd6aXA6IHpsaWJfMS5jcmVhdGVHemlwLFxuICAgIGRlZmxhdGU6IHpsaWJfMS5jcmVhdGVEZWZsYXRlXG59O1xuY2xhc3MgUG9sbGluZyBleHRlbmRzIHRyYW5zcG9ydF8xLlRyYW5zcG9ydCB7XG4gICAgLyoqXG4gICAgICogSFRUUCBwb2xsaW5nIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQGFwaSBwdWJsaWMuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocmVxKSB7XG4gICAgICAgIHN1cGVyKHJlcSk7XG4gICAgICAgIHRoaXMuY2xvc2VUaW1lb3V0ID0gMzAgKiAxMDAwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUcmFuc3BvcnQgbmFtZVxuICAgICAqXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIFwicG9sbGluZ1wiO1xuICAgIH1cbiAgICBnZXQgc3VwcG9ydHNGcmFtaW5nKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE92ZXJyaWRlcyBvblJlcXVlc3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVxXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBvblJlcXVlc3QocmVxKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IHJlcS5yZXM7XG4gICAgICAgIGlmIChyZXEuZ2V0TWV0aG9kKCkgPT09IFwiZ2V0XCIpIHtcbiAgICAgICAgICAgIHRoaXMub25Qb2xsUmVxdWVzdChyZXEsIHJlcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocmVxLmdldE1ldGhvZCgpID09PSBcInBvc3RcIikge1xuICAgICAgICAgICAgdGhpcy5vbkRhdGFSZXF1ZXN0KHJlcSwgcmVzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcy53cml0ZVN0YXR1cyhcIjUwMCBJbnRlcm5hbCBTZXJ2ZXIgRXJyb3JcIik7XG4gICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIGNsaWVudCBzZW5kcyBhIHJlcXVlc3QgYXdhaXRpbmcgZm9yIHVzIHRvIHNlbmQgZGF0YS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uUG9sbFJlcXVlc3QocmVxLCByZXMpIHtcbiAgICAgICAgaWYgKHRoaXMucmVxKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcInJlcXVlc3Qgb3ZlcmxhcFwiKTtcbiAgICAgICAgICAgIC8vIGFzc2VydDogdGhpcy5yZXMsICcucmVxIGFuZCAucmVzIHNob3VsZCBiZSAodW4pc2V0IHRvZ2V0aGVyJ1xuICAgICAgICAgICAgdGhpcy5vbkVycm9yKFwib3ZlcmxhcCBmcm9tIGNsaWVudFwiKTtcbiAgICAgICAgICAgIHJlcy53cml0ZVN0YXR1cyhcIjUwMCBJbnRlcm5hbCBTZXJ2ZXIgRXJyb3JcIik7XG4gICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGVidWcoXCJzZXR0aW5nIHJlcXVlc3RcIik7XG4gICAgICAgIHRoaXMucmVxID0gcmVxO1xuICAgICAgICB0aGlzLnJlcyA9IHJlcztcbiAgICAgICAgY29uc3Qgb25DbG9zZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMud3JpdGFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMub25FcnJvcihcInBvbGwgY29ubmVjdGlvbiBjbG9zZWQgcHJlbWF0dXJlbHlcIik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNsZWFudXAgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlcSA9IHRoaXMucmVzID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxLmNsZWFudXAgPSBjbGVhbnVwO1xuICAgICAgICByZXMub25BYm9ydGVkKG9uQ2xvc2UpO1xuICAgICAgICB0aGlzLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbWl0KFwiZHJhaW5cIik7XG4gICAgICAgIC8vIGlmIHdlJ3JlIHN0aWxsIHdyaXRhYmxlIGJ1dCBoYWQgYSBwZW5kaW5nIGNsb3NlLCB0cmlnZ2VyIGFuIGVtcHR5IHNlbmRcbiAgICAgICAgaWYgKHRoaXMud3JpdGFibGUgJiYgdGhpcy5zaG91bGRDbG9zZSkge1xuICAgICAgICAgICAgZGVidWcoXCJ0cmlnZ2VyaW5nIGVtcHR5IHNlbmQgdG8gYXBwZW5kIGNsb3NlIHBhY2tldFwiKTtcbiAgICAgICAgICAgIHRoaXMuc2VuZChbeyB0eXBlOiBcIm5vb3BcIiB9XSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIGNsaWVudCBzZW5kcyBhIHJlcXVlc3Qgd2l0aCBkYXRhLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgb25EYXRhUmVxdWVzdChyZXEsIHJlcykge1xuICAgICAgICBpZiAodGhpcy5kYXRhUmVxKSB7XG4gICAgICAgICAgICAvLyBhc3NlcnQ6IHRoaXMuZGF0YVJlcywgJy5kYXRhUmVxIGFuZCAuZGF0YVJlcyBzaG91bGQgYmUgKHVuKXNldCB0b2dldGhlcidcbiAgICAgICAgICAgIHRoaXMub25FcnJvcihcImRhdGEgcmVxdWVzdCBvdmVybGFwIGZyb20gY2xpZW50XCIpO1xuICAgICAgICAgICAgcmVzLndyaXRlU3RhdHVzKFwiNTAwIEludGVybmFsIFNlcnZlciBFcnJvclwiKTtcbiAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpc0JpbmFyeSA9IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIgPT09IHJlcS5oZWFkZXJzW1wiY29udGVudC10eXBlXCJdO1xuICAgICAgICBpZiAoaXNCaW5hcnkgJiYgdGhpcy5wcm90b2NvbCA9PT0gNCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub25FcnJvcihcImludmFsaWQgY29udGVudFwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGFSZXEgPSByZXE7XG4gICAgICAgIHRoaXMuZGF0YVJlcyA9IHJlcztcbiAgICAgICAgbGV0IGNodW5rcyA9IFtdO1xuICAgICAgICBsZXQgY29udGVudExlbmd0aCA9IDA7XG4gICAgICAgIGNvbnN0IGNsZWFudXAgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRhdGFSZXEgPSB0aGlzLmRhdGFSZXMgPSBjaHVua3MgPSBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBvbkNsb3NlID0gKCkgPT4ge1xuICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgdGhpcy5vbkVycm9yKFwiZGF0YSByZXF1ZXN0IGNvbm5lY3Rpb24gY2xvc2VkIHByZW1hdHVyZWx5XCIpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBoZWFkZXJzID0ge1xuICAgICAgICAgICAgLy8gdGV4dC9odG1sIGlzIHJlcXVpcmVkIGluc3RlYWQgb2YgdGV4dC9wbGFpbiB0byBhdm9pZCBhblxuICAgICAgICAgICAgLy8gdW53YW50ZWQgZG93bmxvYWQgZGlhbG9nIG9uIGNlcnRhaW4gdXNlci1hZ2VudHMgKEdILTQzKVxuICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJ0ZXh0L2h0bWxcIlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmhlYWRlcnMocmVxLCBoZWFkZXJzKTtcbiAgICAgICAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgcmVzLndyaXRlSGVhZGVyKGtleSwgU3RyaW5nKGhlYWRlcnNba2V5XSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgb25FbmQgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRGF0YShCdWZmZXIuY29uY2F0KGNodW5rcykudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlICE9PSBcImNsb3NpbmdcIikge1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoXCJva1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVzLm9uQWJvcnRlZChvbkNsb3NlKTtcbiAgICAgICAgcmVzLm9uRGF0YSgoY2h1bmssIGlzTGFzdCkgPT4ge1xuICAgICAgICAgICAgY2h1bmtzLnB1c2goQnVmZmVyLmZyb20oY2h1bmspKTtcbiAgICAgICAgICAgIGNvbnRlbnRMZW5ndGggKz0gQnVmZmVyLmJ5dGVMZW5ndGgoY2h1bmspO1xuICAgICAgICAgICAgaWYgKGNvbnRlbnRMZW5ndGggPiB0aGlzLm1heEh0dHBCdWZmZXJTaXplKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yKFwicGF5bG9hZCB0b28gbGFyZ2VcIik7XG4gICAgICAgICAgICAgICAgcmVzLndyaXRlU3RhdHVzKFwiNDEzIFBheWxvYWQgVG9vIExhcmdlXCIpO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNMYXN0KSB7XG4gICAgICAgICAgICAgICAgb25FbmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByb2Nlc3NlcyB0aGUgaW5jb21pbmcgZGF0YSBwYXlsb2FkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGVuY29kZWQgcGF5bG9hZFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uRGF0YShkYXRhKSB7XG4gICAgICAgIGRlYnVnKCdyZWNlaXZlZCBcIiVzXCInLCBkYXRhKTtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBwYWNrZXQgPT4ge1xuICAgICAgICAgICAgaWYgKFwiY2xvc2VcIiA9PT0gcGFja2V0LnR5cGUpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhcImdvdCB4aHIgY2xvc2UgcGFja2V0XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMub25DbG9zZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub25QYWNrZXQocGFja2V0KTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMucHJvdG9jb2wgPT09IDMpIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VyLmRlY29kZVBheWxvYWQoZGF0YSwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJzZXIuZGVjb2RlUGF5bG9hZChkYXRhKS5mb3JFYWNoKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBPdmVycmlkZXMgb25DbG9zZS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uQ2xvc2UoKSB7XG4gICAgICAgIGlmICh0aGlzLndyaXRhYmxlKSB7XG4gICAgICAgICAgICAvLyBjbG9zZSBwZW5kaW5nIHBvbGwgcmVxdWVzdFxuICAgICAgICAgICAgdGhpcy5zZW5kKFt7IHR5cGU6IFwibm9vcFwiIH1dKTtcbiAgICAgICAgfVxuICAgICAgICBzdXBlci5vbkNsb3NlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFdyaXRlcyBhIHBhY2tldCBwYXlsb2FkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhY2tldFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHNlbmQocGFja2V0cykge1xuICAgICAgICB0aGlzLndyaXRhYmxlID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLnNob3VsZENsb3NlKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcImFwcGVuZGluZyBjbG9zZSBwYWNrZXQgdG8gcGF5bG9hZFwiKTtcbiAgICAgICAgICAgIHBhY2tldHMucHVzaCh7IHR5cGU6IFwiY2xvc2VcIiB9KTtcbiAgICAgICAgICAgIHRoaXMuc2hvdWxkQ2xvc2UoKTtcbiAgICAgICAgICAgIHRoaXMuc2hvdWxkQ2xvc2UgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRvV3JpdGUgPSBkYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXByZXNzID0gcGFja2V0cy5zb21lKHBhY2tldCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhY2tldC5vcHRpb25zICYmIHBhY2tldC5vcHRpb25zLmNvbXByZXNzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLndyaXRlKGRhdGEsIHsgY29tcHJlc3MgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLnByb3RvY29sID09PSAzKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlci5lbmNvZGVQYXlsb2FkKHBhY2tldHMsIHRoaXMuc3VwcG9ydHNCaW5hcnksIGRvV3JpdGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJzZXIuZW5jb2RlUGF5bG9hZChwYWNrZXRzLCBkb1dyaXRlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBXcml0ZXMgZGF0YSBhcyByZXNwb25zZSB0byBwb2xsIHJlcXVlc3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgd3JpdGUoZGF0YSwgb3B0aW9ucykge1xuICAgICAgICBkZWJ1Zygnd3JpdGluZyBcIiVzXCInLCBkYXRhKTtcbiAgICAgICAgdGhpcy5kb1dyaXRlKGRhdGEsIG9wdGlvbnMsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVxLmNsZWFudXAoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIHRoZSB3cml0ZS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGRvV3JpdGUoZGF0YSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gZXhwbGljaXQgVVRGLTggaXMgcmVxdWlyZWQgZm9yIHBhZ2VzIG5vdCBzZXJ2ZWQgdW5kZXIgdXRmXG4gICAgICAgIGNvbnN0IGlzU3RyaW5nID0gdHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCI7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gaXNTdHJpbmdcbiAgICAgICAgICAgID8gXCJ0ZXh0L3BsYWluOyBjaGFyc2V0PVVURi04XCJcbiAgICAgICAgICAgIDogXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIjtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IHtcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IGNvbnRlbnRUeXBlXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJlc3BvbmQgPSBkYXRhID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGVhZGVycyh0aGlzLnJlcSwgaGVhZGVycyk7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXMud3JpdGVIZWFkZXIoa2V5LCBTdHJpbmcoaGVhZGVyc1trZXldKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMucmVzLmVuZChkYXRhKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICghdGhpcy5odHRwQ29tcHJlc3Npb24gfHwgIW9wdGlvbnMuY29tcHJlc3MpIHtcbiAgICAgICAgICAgIHJlc3BvbmQoZGF0YSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGVuID0gaXNTdHJpbmcgPyBCdWZmZXIuYnl0ZUxlbmd0aChkYXRhKSA6IGRhdGEubGVuZ3RoO1xuICAgICAgICBpZiAobGVuIDwgdGhpcy5odHRwQ29tcHJlc3Npb24udGhyZXNob2xkKSB7XG4gICAgICAgICAgICByZXNwb25kKGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVuY29kaW5nID0gYWNjZXB0cyh0aGlzLnJlcSkuZW5jb2RpbmdzKFtcImd6aXBcIiwgXCJkZWZsYXRlXCJdKTtcbiAgICAgICAgaWYgKCFlbmNvZGluZykge1xuICAgICAgICAgICAgcmVzcG9uZChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbXByZXNzKGRhdGEsIGVuY29kaW5nLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXMud3JpdGVTdGF0dXMoXCI1MDAgSW50ZXJuYWwgU2VydmVyIEVycm9yXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGVhZGVyc1tcIkNvbnRlbnQtRW5jb2RpbmdcIl0gPSBlbmNvZGluZztcbiAgICAgICAgICAgIHJlc3BvbmQoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wcmVzc2VzIGRhdGEuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBjb21wcmVzcyhkYXRhLCBlbmNvZGluZywgY2FsbGJhY2spIHtcbiAgICAgICAgZGVidWcoXCJjb21wcmVzc2luZ1wiKTtcbiAgICAgICAgY29uc3QgYnVmZmVycyA9IFtdO1xuICAgICAgICBsZXQgbnJlYWQgPSAwO1xuICAgICAgICBjb21wcmVzc2lvbk1ldGhvZHNbZW5jb2RpbmddKHRoaXMuaHR0cENvbXByZXNzaW9uKVxuICAgICAgICAgICAgLm9uKFwiZXJyb3JcIiwgY2FsbGJhY2spXG4gICAgICAgICAgICAub24oXCJkYXRhXCIsIGZ1bmN0aW9uIChjaHVuaykge1xuICAgICAgICAgICAgYnVmZmVycy5wdXNoKGNodW5rKTtcbiAgICAgICAgICAgIG5yZWFkICs9IGNodW5rLmxlbmd0aDtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5vbihcImVuZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMsIG5yZWFkKSk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZW5kKGRhdGEpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgdGhlIHRyYW5zcG9ydC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGRvQ2xvc2UoZm4pIHtcbiAgICAgICAgZGVidWcoXCJjbG9zaW5nXCIpO1xuICAgICAgICBsZXQgY2xvc2VUaW1lb3V0VGltZXI7XG4gICAgICAgIGNvbnN0IG9uQ2xvc2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoY2xvc2VUaW1lb3V0VGltZXIpO1xuICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZSgpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy53cml0YWJsZSkge1xuICAgICAgICAgICAgZGVidWcoXCJ0cmFuc3BvcnQgd3JpdGFibGUgLSBjbG9zaW5nIHJpZ2h0IGF3YXlcIik7XG4gICAgICAgICAgICB0aGlzLnNlbmQoW3sgdHlwZTogXCJjbG9zZVwiIH1dKTtcbiAgICAgICAgICAgIG9uQ2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmRpc2NhcmRlZCkge1xuICAgICAgICAgICAgZGVidWcoXCJ0cmFuc3BvcnQgZGlzY2FyZGVkIC0gY2xvc2luZyByaWdodCBhd2F5XCIpO1xuICAgICAgICAgICAgb25DbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGVidWcoXCJ0cmFuc3BvcnQgbm90IHdyaXRhYmxlIC0gYnVmZmVyaW5nIG9yZGVybHkgY2xvc2VcIik7XG4gICAgICAgICAgICB0aGlzLnNob3VsZENsb3NlID0gb25DbG9zZTtcbiAgICAgICAgICAgIGNsb3NlVGltZW91dFRpbWVyID0gc2V0VGltZW91dChvbkNsb3NlLCB0aGlzLmNsb3NlVGltZW91dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBoZWFkZXJzIGZvciBhIHJlc3BvbnNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJlcSAtIHJlcXVlc3RcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXh0cmEgaGVhZGVyc1xuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGhlYWRlcnMocmVxLCBoZWFkZXJzKSB7XG4gICAgICAgIGhlYWRlcnMgPSBoZWFkZXJzIHx8IHt9O1xuICAgICAgICAvLyBwcmV2ZW50IFhTUyB3YXJuaW5ncyBvbiBJRVxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTGVhcm5Cb29zdC9zb2NrZXQuaW8vcHVsbC8xMzMzXG4gICAgICAgIGNvbnN0IHVhID0gcmVxLmhlYWRlcnNbXCJ1c2VyLWFnZW50XCJdO1xuICAgICAgICBpZiAodWEgJiYgKH51YS5pbmRleE9mKFwiO01TSUVcIikgfHwgfnVhLmluZGV4T2YoXCJUcmlkZW50L1wiKSkpIHtcbiAgICAgICAgICAgIGhlYWRlcnNbXCJYLVhTUy1Qcm90ZWN0aW9uXCJdID0gXCIwXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbWl0KFwiaGVhZGVyc1wiLCBoZWFkZXJzLCByZXEpO1xuICAgICAgICByZXR1cm4gaGVhZGVycztcbiAgICB9XG59XG5leHBvcnRzLlBvbGxpbmcgPSBQb2xsaW5nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLldlYlNvY2tldCA9IHZvaWQgMDtcbmNvbnN0IHRyYW5zcG9ydF8xID0gcmVxdWlyZShcIi4uL3RyYW5zcG9ydFwiKTtcbmNvbnN0IGRlYnVnXzEgPSByZXF1aXJlKFwiZGVidWdcIik7XG5jb25zdCBkZWJ1ZyA9ICgwLCBkZWJ1Z18xLmRlZmF1bHQpKFwiZW5naW5lOndzXCIpO1xuY2xhc3MgV2ViU29ja2V0IGV4dGVuZHMgdHJhbnNwb3J0XzEuVHJhbnNwb3J0IHtcbiAgICAvKipcbiAgICAgKiBXZWJTb2NrZXQgdHJhbnNwb3J0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVxXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihyZXEpIHtcbiAgICAgICAgc3VwZXIocmVxKTtcbiAgICAgICAgdGhpcy53cml0YWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBlck1lc3NhZ2VEZWZsYXRlID0gbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJhbnNwb3J0IG5hbWVcbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiBcIndlYnNvY2tldFwiO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZHZlcnRpc2UgdXBncmFkZSBzdXBwb3J0LlxuICAgICAqXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cbiAgICBnZXQgaGFuZGxlc1VwZ3JhZGVzKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWR2ZXJ0aXNlIGZyYW1pbmcgc3VwcG9ydC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgZ2V0IHN1cHBvcnRzRnJhbWluZygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFdyaXRlcyBhIHBhY2tldCBwYXlsb2FkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gcGFja2V0c1xuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHNlbmQocGFja2V0cykge1xuICAgICAgICBjb25zdCBwYWNrZXQgPSBwYWNrZXRzLnNoaWZ0KCk7XG4gICAgICAgIGlmICh0eXBlb2YgcGFja2V0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZW1pdChcImRyYWluXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGFsd2F5cyBjcmVhdGVzIGEgbmV3IG9iamVjdCBzaW5jZSB3cyBtb2RpZmllcyBpdFxuICAgICAgICBjb25zdCBvcHRzID0ge307XG4gICAgICAgIGlmIChwYWNrZXQub3B0aW9ucykge1xuICAgICAgICAgICAgb3B0cy5jb21wcmVzcyA9IHBhY2tldC5vcHRpb25zLmNvbXByZXNzO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbmQgPSBkYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlzQmluYXJ5ID0gdHlwZW9mIGRhdGEgIT09IFwic3RyaW5nXCI7XG4gICAgICAgICAgICBjb25zdCBjb21wcmVzcyA9IHRoaXMucGVyTWVzc2FnZURlZmxhdGUgJiZcbiAgICAgICAgICAgICAgICBCdWZmZXIuYnl0ZUxlbmd0aChkYXRhKSA+IHRoaXMucGVyTWVzc2FnZURlZmxhdGUudGhyZXNob2xkO1xuICAgICAgICAgICAgZGVidWcoJ3dyaXRpbmcgXCIlc1wiJywgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLndyaXRhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKGRhdGEsIGlzQmluYXJ5LCBjb21wcmVzcyk7XG4gICAgICAgICAgICB0aGlzLnNlbmQocGFja2V0cyk7XG4gICAgICAgIH07XG4gICAgICAgIGlmIChwYWNrZXQub3B0aW9ucyAmJiB0eXBlb2YgcGFja2V0Lm9wdGlvbnMud3NQcmVFbmNvZGVkID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBzZW5kKHBhY2tldC5vcHRpb25zLndzUHJlRW5jb2RlZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlci5lbmNvZGVQYWNrZXQocGFja2V0LCB0aGlzLnN1cHBvcnRzQmluYXJ5LCBzZW5kKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgdGhlIHRyYW5zcG9ydC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGRvQ2xvc2UoZm4pIHtcbiAgICAgICAgZGVidWcoXCJjbG9zaW5nXCIpO1xuICAgICAgICBmbiAmJiBmbigpO1xuICAgICAgICAvLyBjYWxsIGZuIGZpcnN0IHNpbmNlIHNvY2tldC5jbG9zZSgpIGltbWVkaWF0ZWx5IGVtaXRzIGEgXCJjbG9zZVwiIGV2ZW50XG4gICAgICAgIHRoaXMuc29ja2V0LmNsb3NlKCk7XG4gICAgfVxufVxuZXhwb3J0cy5XZWJTb2NrZXQgPSBXZWJTb2NrZXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHBvbGxpbmdfMSA9IHJlcXVpcmUoXCIuL3BvbGxpbmdcIik7XG5jb25zdCBwb2xsaW5nX2pzb25wXzEgPSByZXF1aXJlKFwiLi9wb2xsaW5nLWpzb25wXCIpO1xuY29uc3Qgd2Vic29ja2V0XzEgPSByZXF1aXJlKFwiLi93ZWJzb2NrZXRcIik7XG5leHBvcnRzLmRlZmF1bHQgPSB7XG4gICAgcG9sbGluZzogcG9sbGluZyxcbiAgICB3ZWJzb2NrZXQ6IHdlYnNvY2tldF8xLldlYlNvY2tldFxufTtcbi8qKlxuICogUG9sbGluZyBwb2x5bW9ycGhpYyBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcG9sbGluZyhyZXEpIHtcbiAgICBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIHJlcS5fcXVlcnkuaikge1xuICAgICAgICByZXR1cm4gbmV3IHBvbGxpbmdfanNvbnBfMS5KU09OUChyZXEpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBwb2xsaW5nXzEuUG9sbGluZyhyZXEpO1xuICAgIH1cbn1cbnBvbGxpbmcudXBncmFkZXNUbyA9IFtcIndlYnNvY2tldFwiXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5KU09OUCA9IHZvaWQgMDtcbmNvbnN0IHBvbGxpbmdfMSA9IHJlcXVpcmUoXCIuL3BvbGxpbmdcIik7XG5jb25zdCBxcyA9IHJlcXVpcmUoXCJxdWVyeXN0cmluZ1wiKTtcbmNvbnN0IHJEb3VibGVTbGFzaGVzID0gL1xcXFxcXFxcbi9nO1xuY29uc3QgclNsYXNoZXMgPSAvKFxcXFwpP1xcXFxuL2c7XG5jbGFzcyBKU09OUCBleHRlbmRzIHBvbGxpbmdfMS5Qb2xsaW5nIHtcbiAgICAvKipcbiAgICAgKiBKU09OLVAgcG9sbGluZyB0cmFuc3BvcnQuXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHJlcSkge1xuICAgICAgICBzdXBlcihyZXEpO1xuICAgICAgICB0aGlzLmhlYWQgPSBcIl9fX2Vpb1tcIiArIChyZXEuX3F1ZXJ5LmogfHwgXCJcIikucmVwbGFjZSgvW14wLTldL2csIFwiXCIpICsgXCJdKFwiO1xuICAgICAgICB0aGlzLmZvb3QgPSBcIik7XCI7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgaW5jb21pbmcgZGF0YS5cbiAgICAgKiBEdWUgdG8gYSBidWcgaW4gXFxuIGhhbmRsaW5nIGJ5IGJyb3dzZXJzLCB3ZSBleHBlY3QgYSBlc2NhcGVkIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uRGF0YShkYXRhKSB7XG4gICAgICAgIC8vIHdlIGxldmVyYWdlIHRoZSBxcyBtb2R1bGUgc28gdGhhdCB3ZSBnZXQgYnVpbHQtaW4gRG9TIHByb3RlY3Rpb25cbiAgICAgICAgLy8gYW5kIHRoZSBmYXN0IGFsdGVybmF0aXZlIHRvIGRlY29kZVVSSUNvbXBvbmVudFxuICAgICAgICBkYXRhID0gcXMucGFyc2UoZGF0YSkuZDtcbiAgICAgICAgaWYgKFwic3RyaW5nXCIgPT09IHR5cGVvZiBkYXRhKSB7XG4gICAgICAgICAgICAvLyBjbGllbnQgd2lsbCBzZW5kIGFscmVhZHkgZXNjYXBlZCBuZXdsaW5lcyBhcyBcXFxcXFxcXG4gYW5kIG5ld2xpbmVzIGFzIFxcXFxuXG4gICAgICAgICAgICAvLyBcXFxcbiBtdXN0IGJlIHJlcGxhY2VkIHdpdGggXFxuIGFuZCBcXFxcXFxcXG4gd2l0aCBcXFxcblxuICAgICAgICAgICAgZGF0YSA9IGRhdGEucmVwbGFjZShyU2xhc2hlcywgZnVuY3Rpb24gKG1hdGNoLCBzbGFzaGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNsYXNoZXMgPyBtYXRjaCA6IFwiXFxuXCI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHN1cGVyLm9uRGF0YShkYXRhLnJlcGxhY2UockRvdWJsZVNsYXNoZXMsIFwiXFxcXG5cIikpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIHRoZSB3cml0ZS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGRvV3JpdGUoZGF0YSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gd2UgbXVzdCBvdXRwdXQgdmFsaWQgamF2YXNjcmlwdCwgbm90IHZhbGlkIGpzb25cbiAgICAgICAgLy8gc2VlOiBodHRwOi8vdGltZWxlc3NyZXBvLmNvbS9qc29uLWlzbnQtYS1qYXZhc2NyaXB0LXN1YnNldFxuICAgICAgICBjb25zdCBqcyA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFx1MjAyOC9nLCBcIlxcXFx1MjAyOFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcdTIwMjkvZywgXCJcXFxcdTIwMjlcIik7XG4gICAgICAgIC8vIHByZXBhcmUgcmVzcG9uc2VcbiAgICAgICAgZGF0YSA9IHRoaXMuaGVhZCArIGpzICsgdGhpcy5mb290O1xuICAgICAgICBzdXBlci5kb1dyaXRlKGRhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICB9XG59XG5leHBvcnRzLkpTT05QID0gSlNPTlA7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUG9sbGluZyA9IHZvaWQgMDtcbmNvbnN0IHRyYW5zcG9ydF8xID0gcmVxdWlyZShcIi4uL3RyYW5zcG9ydFwiKTtcbmNvbnN0IHpsaWJfMSA9IHJlcXVpcmUoXCJ6bGliXCIpO1xuY29uc3QgYWNjZXB0cyA9IHJlcXVpcmUoXCJhY2NlcHRzXCIpO1xuY29uc3QgZGVidWdfMSA9IHJlcXVpcmUoXCJkZWJ1Z1wiKTtcbmNvbnN0IGRlYnVnID0gKDAsIGRlYnVnXzEuZGVmYXVsdCkoXCJlbmdpbmU6cG9sbGluZ1wiKTtcbmNvbnN0IGNvbXByZXNzaW9uTWV0aG9kcyA9IHtcbiAgICBnemlwOiB6bGliXzEuY3JlYXRlR3ppcCxcbiAgICBkZWZsYXRlOiB6bGliXzEuY3JlYXRlRGVmbGF0ZVxufTtcbmNsYXNzIFBvbGxpbmcgZXh0ZW5kcyB0cmFuc3BvcnRfMS5UcmFuc3BvcnQge1xuICAgIC8qKlxuICAgICAqIEhUVFAgcG9sbGluZyBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHJlcSkge1xuICAgICAgICBzdXBlcihyZXEpO1xuICAgICAgICB0aGlzLmNsb3NlVGltZW91dCA9IDMwICogMTAwMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJhbnNwb3J0IG5hbWVcbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiBcInBvbGxpbmdcIjtcbiAgICB9XG4gICAgZ2V0IHN1cHBvcnRzRnJhbWluZygpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBPdmVycmlkZXMgb25SZXF1ZXN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtodHRwLkluY29taW5nTWVzc2FnZX1cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBvblJlcXVlc3QocmVxKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IHJlcS5yZXM7XG4gICAgICAgIGlmIChcIkdFVFwiID09PSByZXEubWV0aG9kKSB7XG4gICAgICAgICAgICB0aGlzLm9uUG9sbFJlcXVlc3QocmVxLCByZXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKFwiUE9TVFwiID09PSByZXEubWV0aG9kKSB7XG4gICAgICAgICAgICB0aGlzLm9uRGF0YVJlcXVlc3QocmVxLCByZXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg1MDApO1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBjbGllbnQgc2VuZHMgYSByZXF1ZXN0IGF3YWl0aW5nIGZvciB1cyB0byBzZW5kIGRhdGEuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBvblBvbGxSZXF1ZXN0KHJlcSwgcmVzKSB7XG4gICAgICAgIGlmICh0aGlzLnJlcSkge1xuICAgICAgICAgICAgZGVidWcoXCJyZXF1ZXN0IG92ZXJsYXBcIik7XG4gICAgICAgICAgICAvLyBhc3NlcnQ6IHRoaXMucmVzLCAnLnJlcSBhbmQgLnJlcyBzaG91bGQgYmUgKHVuKXNldCB0b2dldGhlcidcbiAgICAgICAgICAgIHRoaXMub25FcnJvcihcIm92ZXJsYXAgZnJvbSBjbGllbnRcIik7XG4gICAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMCk7XG4gICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGVidWcoXCJzZXR0aW5nIHJlcXVlc3RcIik7XG4gICAgICAgIHRoaXMucmVxID0gcmVxO1xuICAgICAgICB0aGlzLnJlcyA9IHJlcztcbiAgICAgICAgY29uc3Qgb25DbG9zZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25FcnJvcihcInBvbGwgY29ubmVjdGlvbiBjbG9zZWQgcHJlbWF0dXJlbHlcIik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNsZWFudXAgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXEucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLCBvbkNsb3NlKTtcbiAgICAgICAgICAgIHRoaXMucmVxID0gdGhpcy5yZXMgPSBudWxsO1xuICAgICAgICB9O1xuICAgICAgICByZXEuY2xlYW51cCA9IGNsZWFudXA7XG4gICAgICAgIHJlcS5vbihcImNsb3NlXCIsIG9uQ2xvc2UpO1xuICAgICAgICB0aGlzLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbWl0KFwiZHJhaW5cIik7XG4gICAgICAgIC8vIGlmIHdlJ3JlIHN0aWxsIHdyaXRhYmxlIGJ1dCBoYWQgYSBwZW5kaW5nIGNsb3NlLCB0cmlnZ2VyIGFuIGVtcHR5IHNlbmRcbiAgICAgICAgaWYgKHRoaXMud3JpdGFibGUgJiYgdGhpcy5zaG91bGRDbG9zZSkge1xuICAgICAgICAgICAgZGVidWcoXCJ0cmlnZ2VyaW5nIGVtcHR5IHNlbmQgdG8gYXBwZW5kIGNsb3NlIHBhY2tldFwiKTtcbiAgICAgICAgICAgIHRoaXMuc2VuZChbeyB0eXBlOiBcIm5vb3BcIiB9XSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIGNsaWVudCBzZW5kcyBhIHJlcXVlc3Qgd2l0aCBkYXRhLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgb25EYXRhUmVxdWVzdChyZXEsIHJlcykge1xuICAgICAgICBpZiAodGhpcy5kYXRhUmVxKSB7XG4gICAgICAgICAgICAvLyBhc3NlcnQ6IHRoaXMuZGF0YVJlcywgJy5kYXRhUmVxIGFuZCAuZGF0YVJlcyBzaG91bGQgYmUgKHVuKXNldCB0b2dldGhlcidcbiAgICAgICAgICAgIHRoaXMub25FcnJvcihcImRhdGEgcmVxdWVzdCBvdmVybGFwIGZyb20gY2xpZW50XCIpO1xuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg1MDApO1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGlzQmluYXJ5ID0gXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIiA9PT0gcmVxLmhlYWRlcnNbXCJjb250ZW50LXR5cGVcIl07XG4gICAgICAgIGlmIChpc0JpbmFyeSAmJiB0aGlzLnByb3RvY29sID09PSA0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vbkVycm9yKFwiaW52YWxpZCBjb250ZW50XCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0YVJlcSA9IHJlcTtcbiAgICAgICAgdGhpcy5kYXRhUmVzID0gcmVzO1xuICAgICAgICBsZXQgY2h1bmtzID0gaXNCaW5hcnkgPyBCdWZmZXIuY29uY2F0KFtdKSA6IFwiXCI7XG4gICAgICAgIGNvbnN0IGNsZWFudXAgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXEucmVtb3ZlTGlzdGVuZXIoXCJkYXRhXCIsIG9uRGF0YSk7XG4gICAgICAgICAgICByZXEucmVtb3ZlTGlzdGVuZXIoXCJlbmRcIiwgb25FbmQpO1xuICAgICAgICAgICAgcmVxLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIiwgb25DbG9zZSk7XG4gICAgICAgICAgICB0aGlzLmRhdGFSZXEgPSB0aGlzLmRhdGFSZXMgPSBjaHVua3MgPSBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBvbkNsb3NlID0gKCkgPT4ge1xuICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgdGhpcy5vbkVycm9yKFwiZGF0YSByZXF1ZXN0IGNvbm5lY3Rpb24gY2xvc2VkIHByZW1hdHVyZWx5XCIpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBvbkRhdGEgPSBkYXRhID0+IHtcbiAgICAgICAgICAgIGxldCBjb250ZW50TGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGlzQmluYXJ5KSB7XG4gICAgICAgICAgICAgICAgY2h1bmtzID0gQnVmZmVyLmNvbmNhdChbY2h1bmtzLCBkYXRhXSk7XG4gICAgICAgICAgICAgICAgY29udGVudExlbmd0aCA9IGNodW5rcy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjaHVua3MgKz0gZGF0YTtcbiAgICAgICAgICAgICAgICBjb250ZW50TGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoY2h1bmtzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb250ZW50TGVuZ3RoID4gdGhpcy5tYXhIdHRwQnVmZmVyU2l6ZSkge1xuICAgICAgICAgICAgICAgIGNodW5rcyA9IGlzQmluYXJ5ID8gQnVmZmVyLmNvbmNhdChbXSkgOiBcIlwiO1xuICAgICAgICAgICAgICAgIHJlcS5jb25uZWN0aW9uLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgb25FbmQgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRGF0YShjaHVua3MpO1xuICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IHtcbiAgICAgICAgICAgICAgICAvLyB0ZXh0L2h0bWwgaXMgcmVxdWlyZWQgaW5zdGVhZCBvZiB0ZXh0L3BsYWluIHRvIGF2b2lkIGFuXG4gICAgICAgICAgICAgICAgLy8gdW53YW50ZWQgZG93bmxvYWQgZGlhbG9nIG9uIGNlcnRhaW4gdXNlci1hZ2VudHMgKEdILTQzKVxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwidGV4dC9odG1sXCIsXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LUxlbmd0aFwiOiAyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHRoaXMuaGVhZGVycyhyZXEsIGhlYWRlcnMpKTtcbiAgICAgICAgICAgIHJlcy5lbmQoXCJva1wiKTtcbiAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxLm9uKFwiY2xvc2VcIiwgb25DbG9zZSk7XG4gICAgICAgIGlmICghaXNCaW5hcnkpXG4gICAgICAgICAgICByZXEuc2V0RW5jb2RpbmcoXCJ1dGY4XCIpO1xuICAgICAgICByZXEub24oXCJkYXRhXCIsIG9uRGF0YSk7XG4gICAgICAgIHJlcS5vbihcImVuZFwiLCBvbkVuZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByb2Nlc3NlcyB0aGUgaW5jb21pbmcgZGF0YSBwYXlsb2FkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGVuY29kZWQgcGF5bG9hZFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uRGF0YShkYXRhKSB7XG4gICAgICAgIGRlYnVnKCdyZWNlaXZlZCBcIiVzXCInLCBkYXRhKTtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBwYWNrZXQgPT4ge1xuICAgICAgICAgICAgaWYgKFwiY2xvc2VcIiA9PT0gcGFja2V0LnR5cGUpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhcImdvdCB4aHIgY2xvc2UgcGFja2V0XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMub25DbG9zZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub25QYWNrZXQocGFja2V0KTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMucHJvdG9jb2wgPT09IDMpIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VyLmRlY29kZVBheWxvYWQoZGF0YSwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJzZXIuZGVjb2RlUGF5bG9hZChkYXRhKS5mb3JFYWNoKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBPdmVycmlkZXMgb25DbG9zZS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uQ2xvc2UoKSB7XG4gICAgICAgIGlmICh0aGlzLndyaXRhYmxlKSB7XG4gICAgICAgICAgICAvLyBjbG9zZSBwZW5kaW5nIHBvbGwgcmVxdWVzdFxuICAgICAgICAgICAgdGhpcy5zZW5kKFt7IHR5cGU6IFwibm9vcFwiIH1dKTtcbiAgICAgICAgfVxuICAgICAgICBzdXBlci5vbkNsb3NlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFdyaXRlcyBhIHBhY2tldCBwYXlsb2FkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhY2tldFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHNlbmQocGFja2V0cykge1xuICAgICAgICB0aGlzLndyaXRhYmxlID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLnNob3VsZENsb3NlKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcImFwcGVuZGluZyBjbG9zZSBwYWNrZXQgdG8gcGF5bG9hZFwiKTtcbiAgICAgICAgICAgIHBhY2tldHMucHVzaCh7IHR5cGU6IFwiY2xvc2VcIiB9KTtcbiAgICAgICAgICAgIHRoaXMuc2hvdWxkQ2xvc2UoKTtcbiAgICAgICAgICAgIHRoaXMuc2hvdWxkQ2xvc2UgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRvV3JpdGUgPSBkYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXByZXNzID0gcGFja2V0cy5zb21lKHBhY2tldCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhY2tldC5vcHRpb25zICYmIHBhY2tldC5vcHRpb25zLmNvbXByZXNzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLndyaXRlKGRhdGEsIHsgY29tcHJlc3MgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLnByb3RvY29sID09PSAzKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlci5lbmNvZGVQYXlsb2FkKHBhY2tldHMsIHRoaXMuc3VwcG9ydHNCaW5hcnksIGRvV3JpdGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJzZXIuZW5jb2RlUGF5bG9hZChwYWNrZXRzLCBkb1dyaXRlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBXcml0ZXMgZGF0YSBhcyByZXNwb25zZSB0byBwb2xsIHJlcXVlc3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgd3JpdGUoZGF0YSwgb3B0aW9ucykge1xuICAgICAgICBkZWJ1Zygnd3JpdGluZyBcIiVzXCInLCBkYXRhKTtcbiAgICAgICAgdGhpcy5kb1dyaXRlKGRhdGEsIG9wdGlvbnMsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVxLmNsZWFudXAoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIHRoZSB3cml0ZS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGRvV3JpdGUoZGF0YSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gZXhwbGljaXQgVVRGLTggaXMgcmVxdWlyZWQgZm9yIHBhZ2VzIG5vdCBzZXJ2ZWQgdW5kZXIgdXRmXG4gICAgICAgIGNvbnN0IGlzU3RyaW5nID0gdHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCI7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gaXNTdHJpbmdcbiAgICAgICAgICAgID8gXCJ0ZXh0L3BsYWluOyBjaGFyc2V0PVVURi04XCJcbiAgICAgICAgICAgIDogXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIjtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IHtcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IGNvbnRlbnRUeXBlXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJlc3BvbmQgPSBkYXRhID0+IHtcbiAgICAgICAgICAgIGhlYWRlcnNbXCJDb250ZW50LUxlbmd0aFwiXSA9XG4gICAgICAgICAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGRhdGEgPyBCdWZmZXIuYnl0ZUxlbmd0aChkYXRhKSA6IGRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5yZXMud3JpdGVIZWFkKDIwMCwgdGhpcy5oZWFkZXJzKHRoaXMucmVxLCBoZWFkZXJzKSk7XG4gICAgICAgICAgICB0aGlzLnJlcy5lbmQoZGF0YSk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoIXRoaXMuaHR0cENvbXByZXNzaW9uIHx8ICFvcHRpb25zLmNvbXByZXNzKSB7XG4gICAgICAgICAgICByZXNwb25kKGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxlbiA9IGlzU3RyaW5nID8gQnVmZmVyLmJ5dGVMZW5ndGgoZGF0YSkgOiBkYXRhLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbiA8IHRoaXMuaHR0cENvbXByZXNzaW9uLnRocmVzaG9sZCkge1xuICAgICAgICAgICAgcmVzcG9uZChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlbmNvZGluZyA9IGFjY2VwdHModGhpcy5yZXEpLmVuY29kaW5ncyhbXCJnemlwXCIsIFwiZGVmbGF0ZVwiXSk7XG4gICAgICAgIGlmICghZW5jb2RpbmcpIHtcbiAgICAgICAgICAgIHJlc3BvbmQoZGF0YSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wcmVzcyhkYXRhLCBlbmNvZGluZywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzLndyaXRlSGVhZCg1MDApO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGVhZGVyc1tcIkNvbnRlbnQtRW5jb2RpbmdcIl0gPSBlbmNvZGluZztcbiAgICAgICAgICAgIHJlc3BvbmQoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wcmVzc2VzIGRhdGEuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBjb21wcmVzcyhkYXRhLCBlbmNvZGluZywgY2FsbGJhY2spIHtcbiAgICAgICAgZGVidWcoXCJjb21wcmVzc2luZ1wiKTtcbiAgICAgICAgY29uc3QgYnVmZmVycyA9IFtdO1xuICAgICAgICBsZXQgbnJlYWQgPSAwO1xuICAgICAgICBjb21wcmVzc2lvbk1ldGhvZHNbZW5jb2RpbmddKHRoaXMuaHR0cENvbXByZXNzaW9uKVxuICAgICAgICAgICAgLm9uKFwiZXJyb3JcIiwgY2FsbGJhY2spXG4gICAgICAgICAgICAub24oXCJkYXRhXCIsIGZ1bmN0aW9uIChjaHVuaykge1xuICAgICAgICAgICAgYnVmZmVycy5wdXNoKGNodW5rKTtcbiAgICAgICAgICAgIG5yZWFkICs9IGNodW5rLmxlbmd0aDtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5vbihcImVuZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMsIG5yZWFkKSk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZW5kKGRhdGEpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgdGhlIHRyYW5zcG9ydC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGRvQ2xvc2UoZm4pIHtcbiAgICAgICAgZGVidWcoXCJjbG9zaW5nXCIpO1xuICAgICAgICBsZXQgY2xvc2VUaW1lb3V0VGltZXI7XG4gICAgICAgIGlmICh0aGlzLmRhdGFSZXEpIHtcbiAgICAgICAgICAgIGRlYnVnKFwiYWJvcnRpbmcgb25nb2luZyBkYXRhIHJlcXVlc3RcIik7XG4gICAgICAgICAgICB0aGlzLmRhdGFSZXEuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9uQ2xvc2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoY2xvc2VUaW1lb3V0VGltZXIpO1xuICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZSgpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy53cml0YWJsZSkge1xuICAgICAgICAgICAgZGVidWcoXCJ0cmFuc3BvcnQgd3JpdGFibGUgLSBjbG9zaW5nIHJpZ2h0IGF3YXlcIik7XG4gICAgICAgICAgICB0aGlzLnNlbmQoW3sgdHlwZTogXCJjbG9zZVwiIH1dKTtcbiAgICAgICAgICAgIG9uQ2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmRpc2NhcmRlZCkge1xuICAgICAgICAgICAgZGVidWcoXCJ0cmFuc3BvcnQgZGlzY2FyZGVkIC0gY2xvc2luZyByaWdodCBhd2F5XCIpO1xuICAgICAgICAgICAgb25DbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGVidWcoXCJ0cmFuc3BvcnQgbm90IHdyaXRhYmxlIC0gYnVmZmVyaW5nIG9yZGVybHkgY2xvc2VcIik7XG4gICAgICAgICAgICB0aGlzLnNob3VsZENsb3NlID0gb25DbG9zZTtcbiAgICAgICAgICAgIGNsb3NlVGltZW91dFRpbWVyID0gc2V0VGltZW91dChvbkNsb3NlLCB0aGlzLmNsb3NlVGltZW91dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBoZWFkZXJzIGZvciBhIHJlc3BvbnNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtodHRwLkluY29taW5nTWVzc2FnZX0gcmVxdWVzdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBleHRyYSBoZWFkZXJzXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgaGVhZGVycyhyZXEsIGhlYWRlcnMpIHtcbiAgICAgICAgaGVhZGVycyA9IGhlYWRlcnMgfHwge307XG4gICAgICAgIC8vIHByZXZlbnQgWFNTIHdhcm5pbmdzIG9uIElFXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9MZWFybkJvb3N0L3NvY2tldC5pby9wdWxsLzEzMzNcbiAgICAgICAgY29uc3QgdWEgPSByZXEuaGVhZGVyc1tcInVzZXItYWdlbnRcIl07XG4gICAgICAgIGlmICh1YSAmJiAofnVhLmluZGV4T2YoXCI7TVNJRVwiKSB8fCB+dWEuaW5kZXhPZihcIlRyaWRlbnQvXCIpKSkge1xuICAgICAgICAgICAgaGVhZGVyc1tcIlgtWFNTLVByb3RlY3Rpb25cIl0gPSBcIjBcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXQoXCJoZWFkZXJzXCIsIGhlYWRlcnMsIHJlcSk7XG4gICAgICAgIHJldHVybiBoZWFkZXJzO1xuICAgIH1cbn1cbmV4cG9ydHMuUG9sbGluZyA9IFBvbGxpbmc7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuV2ViU29ja2V0ID0gdm9pZCAwO1xuY29uc3QgdHJhbnNwb3J0XzEgPSByZXF1aXJlKFwiLi4vdHJhbnNwb3J0XCIpO1xuY29uc3QgZGVidWdfMSA9IHJlcXVpcmUoXCJkZWJ1Z1wiKTtcbmNvbnN0IGRlYnVnID0gKDAsIGRlYnVnXzEuZGVmYXVsdCkoXCJlbmdpbmU6d3NcIik7XG5jbGFzcyBXZWJTb2NrZXQgZXh0ZW5kcyB0cmFuc3BvcnRfMS5UcmFuc3BvcnQge1xuICAgIC8qKlxuICAgICAqIFdlYlNvY2tldCB0cmFuc3BvcnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7aHR0cC5JbmNvbWluZ01lc3NhZ2V9XG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihyZXEpIHtcbiAgICAgICAgc3VwZXIocmVxKTtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSByZXEud2Vic29ja2V0O1xuICAgICAgICB0aGlzLnNvY2tldC5vbihcIm1lc3NhZ2VcIiwgKGRhdGEsIGlzQmluYXJ5KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gaXNCaW5hcnkgPyBkYXRhIDogZGF0YS50b1N0cmluZygpO1xuICAgICAgICAgICAgZGVidWcoJ3JlY2VpdmVkIFwiJXNcIicsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgc3VwZXIub25EYXRhKG1lc3NhZ2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zb2NrZXQub25jZShcImNsb3NlXCIsIHRoaXMub25DbG9zZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJlcnJvclwiLCB0aGlzLm9uRXJyb3IuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMud3JpdGFibGUgPSB0cnVlO1xuICAgICAgICB0aGlzLnBlck1lc3NhZ2VEZWZsYXRlID0gbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJhbnNwb3J0IG5hbWVcbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiBcIndlYnNvY2tldFwiO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZHZlcnRpc2UgdXBncmFkZSBzdXBwb3J0LlxuICAgICAqXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cbiAgICBnZXQgaGFuZGxlc1VwZ3JhZGVzKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWR2ZXJ0aXNlIGZyYW1pbmcgc3VwcG9ydC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgZ2V0IHN1cHBvcnRzRnJhbWluZygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFdyaXRlcyBhIHBhY2tldCBwYXlsb2FkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gcGFja2V0c1xuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHNlbmQocGFja2V0cykge1xuICAgICAgICBjb25zdCBwYWNrZXQgPSBwYWNrZXRzLnNoaWZ0KCk7XG4gICAgICAgIGlmICh0eXBlb2YgcGFja2V0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZW1pdChcImRyYWluXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGFsd2F5cyBjcmVhdGVzIGEgbmV3IG9iamVjdCBzaW5jZSB3cyBtb2RpZmllcyBpdFxuICAgICAgICBjb25zdCBvcHRzID0ge307XG4gICAgICAgIGlmIChwYWNrZXQub3B0aW9ucykge1xuICAgICAgICAgICAgb3B0cy5jb21wcmVzcyA9IHBhY2tldC5vcHRpb25zLmNvbXByZXNzO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbmQgPSBkYXRhID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBlck1lc3NhZ2VEZWZsYXRlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGVuID0gXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGRhdGEgPyBCdWZmZXIuYnl0ZUxlbmd0aChkYXRhKSA6IGRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGlmIChsZW4gPCB0aGlzLnBlck1lc3NhZ2VEZWZsYXRlLnRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRzLmNvbXByZXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVidWcoJ3dyaXRpbmcgXCIlc1wiJywgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLndyaXRhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKGRhdGEsIG9wdHMsIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub25FcnJvcihcIndyaXRlIGVycm9yXCIsIGVyci5zdGFjayk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kKHBhY2tldHMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmIChwYWNrZXQub3B0aW9ucyAmJiB0eXBlb2YgcGFja2V0Lm9wdGlvbnMud3NQcmVFbmNvZGVkID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBzZW5kKHBhY2tldC5vcHRpb25zLndzUHJlRW5jb2RlZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlci5lbmNvZGVQYWNrZXQocGFja2V0LCB0aGlzLnN1cHBvcnRzQmluYXJ5LCBzZW5kKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgdGhlIHRyYW5zcG9ydC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGRvQ2xvc2UoZm4pIHtcbiAgICAgICAgZGVidWcoXCJjbG9zaW5nXCIpO1xuICAgICAgICB0aGlzLnNvY2tldC5jbG9zZSgpO1xuICAgICAgICBmbiAmJiBmbigpO1xuICAgIH1cbn1cbmV4cG9ydHMuV2ViU29ja2V0ID0gV2ViU29ja2V0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnVTZXJ2ZXIgPSB2b2lkIDA7XG5jb25zdCBkZWJ1Z18xID0gcmVxdWlyZShcImRlYnVnXCIpO1xuY29uc3Qgc2VydmVyXzEgPSByZXF1aXJlKFwiLi9zZXJ2ZXJcIik7XG5jb25zdCB0cmFuc3BvcnRzX3V3c18xID0gcmVxdWlyZShcIi4vdHJhbnNwb3J0cy11d3NcIik7XG5jb25zdCBkZWJ1ZyA9ICgwLCBkZWJ1Z18xLmRlZmF1bHQpKFwiZW5naW5lOnV3c1wiKTtcbmNsYXNzIHVTZXJ2ZXIgZXh0ZW5kcyBzZXJ2ZXJfMS5CYXNlU2VydmVyIHtcbiAgICBpbml0KCkgeyB9XG4gICAgY2xlYW51cCgpIHsgfVxuICAgIC8qKlxuICAgICAqIFByZXBhcmVzIGEgcmVxdWVzdCBieSBwcm9jZXNzaW5nIHRoZSBxdWVyeSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBwcmVwYXJlKHJlcSwgcmVzKSB7XG4gICAgICAgIHJlcS5tZXRob2QgPSByZXEuZ2V0TWV0aG9kKCkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhyZXEuZ2V0UXVlcnkoKSk7XG4gICAgICAgIHJlcS5fcXVlcnkgPSBPYmplY3QuZnJvbUVudHJpZXMocGFyYW1zLmVudHJpZXMoKSk7XG4gICAgICAgIHJlcS5oZWFkZXJzID0ge307XG4gICAgICAgIHJlcS5mb3JFYWNoKChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICByZXEuaGVhZGVyc1trZXldID0gdmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXEuY29ubmVjdGlvbiA9IHtcbiAgICAgICAgICAgIHJlbW90ZUFkZHJlc3M6IEJ1ZmZlci5mcm9tKHJlcy5nZXRSZW1vdGVBZGRyZXNzQXNUZXh0KCkpLnRvU3RyaW5nKClcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY3JlYXRlVHJhbnNwb3J0KHRyYW5zcG9ydE5hbWUsIHJlcSkge1xuICAgICAgICByZXR1cm4gbmV3IHRyYW5zcG9ydHNfdXdzXzEuZGVmYXVsdFt0cmFuc3BvcnROYW1lXShyZXEpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggdGhlIGVuZ2luZSB0byBhIMK1V2ViU29ja2V0cy5qcyBzZXJ2ZXJcbiAgICAgKiBAcGFyYW0gYXBwXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBhdHRhY2goYXBwIC8qIDogVGVtcGxhdGVkQXBwICovLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IChvcHRpb25zLnBhdGggfHwgXCIvZW5naW5lLmlvXCIpLnJlcGxhY2UoL1xcLyQvLCBcIlwiKSArIFwiL1wiO1xuICAgICAgICBhcHBcbiAgICAgICAgICAgIC5hbnkocGF0aCwgdGhpcy5oYW5kbGVSZXF1ZXN0LmJpbmQodGhpcykpXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLndzKHBhdGgsIHtcbiAgICAgICAgICAgIG1heFBheWxvYWRMZW5ndGg6IHRoaXMub3B0cy5tYXhIdHRwQnVmZmVyU2l6ZSxcbiAgICAgICAgICAgIHVwZ3JhZGU6IHRoaXMuaGFuZGxlVXBncmFkZS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgb3Blbjogd3MgPT4ge1xuICAgICAgICAgICAgICAgIHdzLnRyYW5zcG9ydC5zb2NrZXQgPSB3cztcbiAgICAgICAgICAgICAgICB3cy50cmFuc3BvcnQud3JpdGFibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHdzLnRyYW5zcG9ydC5lbWl0KFwiZHJhaW5cIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWVzc2FnZTogKHdzLCBtZXNzYWdlLCBpc0JpbmFyeSkgPT4ge1xuICAgICAgICAgICAgICAgIHdzLnRyYW5zcG9ydC5vbkRhdGEoaXNCaW5hcnkgPyBtZXNzYWdlIDogQnVmZmVyLmZyb20obWVzc2FnZSkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xvc2U6ICh3cywgY29kZSwgbWVzc2FnZSkgPT4ge1xuICAgICAgICAgICAgICAgIHdzLnRyYW5zcG9ydC5vbkNsb3NlKGNvZGUsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlUmVxdWVzdChyZXMsIHJlcSkge1xuICAgICAgICBkZWJ1ZygnaGFuZGxpbmcgXCIlc1wiIGh0dHAgcmVxdWVzdCBcIiVzXCInLCByZXEuZ2V0TWV0aG9kKCksIHJlcS5nZXRVcmwoKSk7XG4gICAgICAgIHRoaXMucHJlcGFyZShyZXEsIHJlcyk7XG4gICAgICAgIHJlcS5yZXMgPSByZXM7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gKGVycm9yQ29kZSwgZXJyb3JDb250ZXh0KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyb3JDb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJjb25uZWN0aW9uX2Vycm9yXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxLFxuICAgICAgICAgICAgICAgICAgICBjb2RlOiBlcnJvckNvZGUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHNlcnZlcl8xLlNlcnZlci5lcnJvck1lc3NhZ2VzW2Vycm9yQ29kZV0sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IGVycm9yQ29udGV4dFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuYWJvcnRSZXF1ZXN0KHJlcS5yZXMsIGVycm9yQ29kZSwgZXJyb3JDb250ZXh0KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVxLl9xdWVyeS5zaWQpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhcInNldHRpbmcgbmV3IHJlcXVlc3QgZm9yIGV4aXN0aW5nIGNsaWVudFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWVudHNbcmVxLl9xdWVyeS5zaWRdLnRyYW5zcG9ydC5vblJlcXVlc3QocmVxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsb3NlQ29ubmVjdGlvbiA9IChlcnJvckNvZGUsIGVycm9yQ29udGV4dCkgPT4gdGhpcy5hYm9ydFJlcXVlc3QocmVzLCBlcnJvckNvZGUsIGVycm9yQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kc2hha2UocmVxLl9xdWVyeS50cmFuc3BvcnQsIHJlcSwgY2xvc2VDb25uZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMuY29yc01pZGRsZXdhcmUpIHtcbiAgICAgICAgICAgIC8vIG5lZWRlZCB0byBidWZmZXIgaGVhZGVycyB1bnRpbCB0aGUgc3RhdHVzIGlzIGNvbXB1dGVkXG4gICAgICAgICAgICByZXEucmVzID0gbmV3IFJlc3BvbnNlV3JhcHBlcihyZXMpO1xuICAgICAgICAgICAgdGhpcy5jb3JzTWlkZGxld2FyZS5jYWxsKG51bGwsIHJlcSwgcmVxLnJlcywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudmVyaWZ5KHJlcSwgZmFsc2UsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy52ZXJpZnkocmVxLCBmYWxzZSwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhhbmRsZVVwZ3JhZGUocmVzLCByZXEsIGNvbnRleHQpIHtcbiAgICAgICAgZGVidWcoXCJvbiB1cGdyYWRlXCIpO1xuICAgICAgICB0aGlzLnByZXBhcmUocmVxLCByZXMpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJlcS5yZXMgPSByZXM7XG4gICAgICAgIHRoaXMudmVyaWZ5KHJlcSwgdHJ1ZSwgYXN5bmMgKGVycm9yQ29kZSwgZXJyb3JDb250ZXh0KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyb3JDb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwiY29ubmVjdGlvbl9lcnJvclwiLCB7XG4gICAgICAgICAgICAgICAgICAgIHJlcSxcbiAgICAgICAgICAgICAgICAgICAgY29kZTogZXJyb3JDb2RlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBzZXJ2ZXJfMS5TZXJ2ZXIuZXJyb3JNZXNzYWdlc1tlcnJvckNvZGVdLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBlcnJvckNvbnRleHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmFib3J0UmVxdWVzdChyZXMsIGVycm9yQ29kZSwgZXJyb3JDb250ZXh0KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpZCA9IHJlcS5fcXVlcnkuc2lkO1xuICAgICAgICAgICAgbGV0IHRyYW5zcG9ydDtcbiAgICAgICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsaWVudCA9IHRoaXMuY2xpZW50c1tpZF07XG4gICAgICAgICAgICAgICAgaWYgKCFjbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoXCJ1cGdyYWRlIGF0dGVtcHQgZm9yIGNsb3NlZCBjbGllbnRcIik7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjbGllbnQudXBncmFkaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKFwidHJhbnNwb3J0IGhhcyBhbHJlYWR5IGJlZW4gdHJ5aW5nIHRvIHVwZ3JhZGVcIik7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjbGllbnQudXBncmFkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoXCJ0cmFuc3BvcnQgaGFkIGFscmVhZHkgYmVlbiB1cGdyYWRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1ZyhcInVwZ3JhZGluZyBleGlzdGluZyB0cmFuc3BvcnRcIik7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zcG9ydCA9IHRoaXMuY3JlYXRlVHJhbnNwb3J0KHJlcS5fcXVlcnkudHJhbnNwb3J0LCByZXEpO1xuICAgICAgICAgICAgICAgICAgICBjbGllbnQubWF5YmVVcGdyYWRlKHRyYW5zcG9ydCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJhbnNwb3J0ID0gYXdhaXQgdGhpcy5oYW5kc2hha2UocmVxLl9xdWVyeS50cmFuc3BvcnQsIHJlcSwgKGVycm9yQ29kZSwgZXJyb3JDb250ZXh0KSA9PiB0aGlzLmFib3J0UmVxdWVzdChyZXMsIGVycm9yQ29kZSwgZXJyb3JDb250ZXh0KSk7XG4gICAgICAgICAgICAgICAgaWYgKCF0cmFuc3BvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcy51cGdyYWRlKHtcbiAgICAgICAgICAgICAgICB0cmFuc3BvcnRcbiAgICAgICAgICAgIH0sIHJlcS5nZXRIZWFkZXIoXCJzZWMtd2Vic29ja2V0LWtleVwiKSwgcmVxLmdldEhlYWRlcihcInNlYy13ZWJzb2NrZXQtcHJvdG9jb2xcIiksIHJlcS5nZXRIZWFkZXIoXCJzZWMtd2Vic29ja2V0LWV4dGVuc2lvbnNcIiksIGNvbnRleHQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYWJvcnRSZXF1ZXN0KHJlcywgZXJyb3JDb2RlLCBlcnJvckNvbnRleHQpIHtcbiAgICAgICAgY29uc3Qgc3RhdHVzQ29kZSA9IGVycm9yQ29kZSA9PT0gc2VydmVyXzEuU2VydmVyLmVycm9ycy5GT1JCSURERU5cbiAgICAgICAgICAgID8gXCI0MDMgRm9yYmlkZGVuXCJcbiAgICAgICAgICAgIDogXCI0MDAgQmFkIFJlcXVlc3RcIjtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGVycm9yQ29udGV4dCAmJiBlcnJvckNvbnRleHQubWVzc2FnZVxuICAgICAgICAgICAgPyBlcnJvckNvbnRleHQubWVzc2FnZVxuICAgICAgICAgICAgOiBzZXJ2ZXJfMS5TZXJ2ZXIuZXJyb3JNZXNzYWdlc1tlcnJvckNvZGVdO1xuICAgICAgICByZXMud3JpdGVTdGF0dXMoc3RhdHVzQ29kZSk7XG4gICAgICAgIHJlcy53cml0ZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgY29kZTogZXJyb3JDb2RlLFxuICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICB9KSk7XG4gICAgfVxufVxuZXhwb3J0cy51U2VydmVyID0gdVNlcnZlcjtcbmNsYXNzIFJlc3BvbnNlV3JhcHBlciB7XG4gICAgY29uc3RydWN0b3IocmVzKSB7XG4gICAgICAgIHRoaXMucmVzID0gcmVzO1xuICAgICAgICB0aGlzLnN0YXR1c1dyaXR0ZW4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gW107XG4gICAgfVxuICAgIHNldCBzdGF0dXNDb2RlKHN0YXR1cykge1xuICAgICAgICB0aGlzLndyaXRlU3RhdHVzKHN0YXR1cyA9PT0gMjAwID8gXCIyMDAgT0tcIiA6IFwiMjA0IE5vIENvbnRlbnRcIik7XG4gICAgfVxuICAgIHNldEhlYWRlcihrZXksIHZhbHVlKSB7XG4gICAgICAgIHRoaXMud3JpdGVIZWFkZXIoa2V5LCB2YWx1ZSk7XG4gICAgfVxuICAgIC8vIG5lZWRlZCBieSB2YXJ5OiBodHRwczovL2dpdGh1Yi5jb20vanNodHRwL3ZhcnkvYmxvYi81ZDcyNWQwNTliMzg3MTAyNWNmNzUzZTlkZmEwODkyNGQwYmNmYThmL2luZGV4LmpzI0wxMzRcbiAgICBnZXRIZWFkZXIoKSB7IH1cbiAgICB3cml0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICAgICAgdGhpcy5yZXMud3JpdGVTdGF0dXMoc3RhdHVzKTtcbiAgICAgICAgdGhpcy5zdGF0dXNXcml0dGVuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy53cml0ZUJ1ZmZlcmVkSGVhZGVycygpO1xuICAgIH1cbiAgICB3cml0ZUhlYWRlcihrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmIChrZXkgPT09IFwiQ29udGVudC1MZW5ndGhcIikge1xuICAgICAgICAgICAgLy8gdGhlIGNvbnRlbnQgbGVuZ3RoIGlzIGF1dG9tYXRpY2FsbHkgYWRkZWQgYnkgdVdlYlNvY2tldHMuanNcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdGF0dXNXcml0dGVuKSB7XG4gICAgICAgICAgICB0aGlzLnJlcy53cml0ZUhlYWRlcihrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGVhZGVycy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgd3JpdGVCdWZmZXJlZEhlYWRlcnMoKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzLndyaXRlSGVhZGVyKGtleSwgdmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZW5kKGRhdGEpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXR1c1dyaXR0ZW4pIHtcbiAgICAgICAgICAgIC8vIHN0YXR1cyB3aWxsIGJlIGluZmVycmVkIGFzIFwiMjAwIE9LXCJcbiAgICAgICAgICAgIHRoaXMud3JpdGVCdWZmZXJlZEhlYWRlcnMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlcy5lbmQoZGF0YSk7XG4gICAgfVxuICAgIG9uQWJvcnRlZChmbikge1xuICAgICAgICB0aGlzLnJlcy5vbkFib3J0ZWQoZm4pO1xuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5SZW1vdGVTb2NrZXQgPSBleHBvcnRzLkJyb2FkY2FzdE9wZXJhdG9yID0gdm9pZCAwO1xuY29uc3Qgc29ja2V0XzEgPSByZXF1aXJlKFwiLi9zb2NrZXRcIik7XG5jb25zdCBzb2NrZXRfaW9fcGFyc2VyXzEgPSByZXF1aXJlKFwic29ja2V0LmlvLXBhcnNlclwiKTtcbmNsYXNzIEJyb2FkY2FzdE9wZXJhdG9yIHtcbiAgICBjb25zdHJ1Y3RvcihhZGFwdGVyLCByb29tcyA9IG5ldyBTZXQoKSwgZXhjZXB0Um9vbXMgPSBuZXcgU2V0KCksIGZsYWdzID0ge30pIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyID0gYWRhcHRlcjtcbiAgICAgICAgdGhpcy5yb29tcyA9IHJvb21zO1xuICAgICAgICB0aGlzLmV4Y2VwdFJvb21zID0gZXhjZXB0Um9vbXM7XG4gICAgICAgIHRoaXMuZmxhZ3MgPSBmbGFncztcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGFyZ2V0cyBhIHJvb20gd2hlbiBlbWl0dGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByb29tXG4gICAgICogQHJldHVybiBhIG5ldyBCcm9hZGNhc3RPcGVyYXRvciBpbnN0YW5jZVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICB0byhyb29tKSB7XG4gICAgICAgIGNvbnN0IHJvb21zID0gbmV3IFNldCh0aGlzLnJvb21zKTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocm9vbSkpIHtcbiAgICAgICAgICAgIHJvb20uZm9yRWFjaCgocikgPT4gcm9vbXMuYWRkKHIpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJvb21zLmFkZChyb29tKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEJyb2FkY2FzdE9wZXJhdG9yKHRoaXMuYWRhcHRlciwgcm9vbXMsIHRoaXMuZXhjZXB0Um9vbXMsIHRoaXMuZmxhZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUYXJnZXRzIGEgcm9vbSB3aGVuIGVtaXR0aW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJvb21cbiAgICAgKiBAcmV0dXJuIGEgbmV3IEJyb2FkY2FzdE9wZXJhdG9yIGluc3RhbmNlXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGluKHJvb20pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG8ocm9vbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEV4Y2x1ZGVzIGEgcm9vbSB3aGVuIGVtaXR0aW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJvb21cbiAgICAgKiBAcmV0dXJuIGEgbmV3IEJyb2FkY2FzdE9wZXJhdG9yIGluc3RhbmNlXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGV4Y2VwdChyb29tKSB7XG4gICAgICAgIGNvbnN0IGV4Y2VwdFJvb21zID0gbmV3IFNldCh0aGlzLmV4Y2VwdFJvb21zKTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocm9vbSkpIHtcbiAgICAgICAgICAgIHJvb20uZm9yRWFjaCgocikgPT4gZXhjZXB0Um9vbXMuYWRkKHIpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGV4Y2VwdFJvb21zLmFkZChyb29tKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEJyb2FkY2FzdE9wZXJhdG9yKHRoaXMuYWRhcHRlciwgdGhpcy5yb29tcywgZXhjZXB0Um9vbXMsIHRoaXMuZmxhZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBjb21wcmVzcyBmbGFnLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbXByZXNzIC0gaWYgYHRydWVgLCBjb21wcmVzc2VzIHRoZSBzZW5kaW5nIGRhdGFcbiAgICAgKiBAcmV0dXJuIGEgbmV3IEJyb2FkY2FzdE9wZXJhdG9yIGluc3RhbmNlXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGNvbXByZXNzKGNvbXByZXNzKSB7XG4gICAgICAgIGNvbnN0IGZsYWdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5mbGFncywgeyBjb21wcmVzcyB9KTtcbiAgICAgICAgcmV0dXJuIG5ldyBCcm9hZGNhc3RPcGVyYXRvcih0aGlzLmFkYXB0ZXIsIHRoaXMucm9vbXMsIHRoaXMuZXhjZXB0Um9vbXMsIGZsYWdzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBhIG1vZGlmaWVyIGZvciBhIHN1YnNlcXVlbnQgZXZlbnQgZW1pc3Npb24gdGhhdCB0aGUgZXZlbnQgZGF0YSBtYXkgYmUgbG9zdCBpZiB0aGUgY2xpZW50IGlzIG5vdCByZWFkeSB0b1xuICAgICAqIHJlY2VpdmUgbWVzc2FnZXMgKGJlY2F1c2Ugb2YgbmV0d29yayBzbG93bmVzcyBvciBvdGhlciBpc3N1ZXMsIG9yIGJlY2F1c2UgdGhleeKAmXJlIGNvbm5lY3RlZCB0aHJvdWdoIGxvbmcgcG9sbGluZ1xuICAgICAqIGFuZCBpcyBpbiB0aGUgbWlkZGxlIG9mIGEgcmVxdWVzdC1yZXNwb25zZSBjeWNsZSkuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGEgbmV3IEJyb2FkY2FzdE9wZXJhdG9yIGluc3RhbmNlXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGdldCB2b2xhdGlsZSgpIHtcbiAgICAgICAgY29uc3QgZmxhZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmZsYWdzLCB7IHZvbGF0aWxlOiB0cnVlIH0pO1xuICAgICAgICByZXR1cm4gbmV3IEJyb2FkY2FzdE9wZXJhdG9yKHRoaXMuYWRhcHRlciwgdGhpcy5yb29tcywgdGhpcy5leGNlcHRSb29tcywgZmxhZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgbW9kaWZpZXIgZm9yIGEgc3Vic2VxdWVudCBldmVudCBlbWlzc2lvbiB0aGF0IHRoZSBldmVudCBkYXRhIHdpbGwgb25seSBiZSBicm9hZGNhc3QgdG8gdGhlIGN1cnJlbnQgbm9kZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gYSBuZXcgQnJvYWRjYXN0T3BlcmF0b3IgaW5zdGFuY2VcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZ2V0IGxvY2FsKCkge1xuICAgICAgICBjb25zdCBmbGFncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZmxhZ3MsIHsgbG9jYWw6IHRydWUgfSk7XG4gICAgICAgIHJldHVybiBuZXcgQnJvYWRjYXN0T3BlcmF0b3IodGhpcy5hZGFwdGVyLCB0aGlzLnJvb21zLCB0aGlzLmV4Y2VwdFJvb21zLCBmbGFncyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVtaXRzIHRvIGFsbCBjbGllbnRzLlxuICAgICAqXG4gICAgICogQHJldHVybiBBbHdheXMgdHJ1ZVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBlbWl0KGV2LCAuLi5hcmdzKSB7XG4gICAgICAgIGlmIChzb2NrZXRfMS5SRVNFUlZFRF9FVkVOVFMuaGFzKGV2KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcIiR7ZXZ9XCIgaXMgYSByZXNlcnZlZCBldmVudCBuYW1lYCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2V0IHVwIHBhY2tldCBvYmplY3RcbiAgICAgICAgY29uc3QgZGF0YSA9IFtldiwgLi4uYXJnc107XG4gICAgICAgIGNvbnN0IHBhY2tldCA9IHtcbiAgICAgICAgICAgIHR5cGU6IHNvY2tldF9pb19wYXJzZXJfMS5QYWNrZXRUeXBlLkVWRU5ULFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgZGF0YVtkYXRhLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsYmFja3MgYXJlIG5vdCBzdXBwb3J0ZWQgd2hlbiBicm9hZGNhc3RpbmdcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGFwdGVyLmJyb2FkY2FzdChwYWNrZXQsIHtcbiAgICAgICAgICAgIHJvb21zOiB0aGlzLnJvb21zLFxuICAgICAgICAgICAgZXhjZXB0OiB0aGlzLmV4Y2VwdFJvb21zLFxuICAgICAgICAgICAgZmxhZ3M6IHRoaXMuZmxhZ3MsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyBhIGxpc3Qgb2YgY2xpZW50cy5cbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBhbGxTb2NrZXRzKCkge1xuICAgICAgICBpZiAoIXRoaXMuYWRhcHRlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gYWRhcHRlciBmb3IgdGhpcyBuYW1lc3BhY2UsIGFyZSB5b3UgdHJ5aW5nIHRvIGdldCB0aGUgbGlzdCBvZiBjbGllbnRzIG9mIGEgZHluYW1pYyBuYW1lc3BhY2U/XCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuc29ja2V0cyh0aGlzLnJvb21zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbWF0Y2hpbmcgc29ja2V0IGluc3RhbmNlc1xuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGZldGNoU29ja2V0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlclxuICAgICAgICAgICAgLmZldGNoU29ja2V0cyh7XG4gICAgICAgICAgICByb29tczogdGhpcy5yb29tcyxcbiAgICAgICAgICAgIGV4Y2VwdDogdGhpcy5leGNlcHRSb29tcyxcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKChzb2NrZXRzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gc29ja2V0cy5tYXAoKHNvY2tldCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzb2NrZXQgaW5zdGFuY2VvZiBzb2NrZXRfMS5Tb2NrZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRklYTUUgdGhlIFR5cGVTY3JpcHQgY29tcGlsZXIgY29tcGxhaW5zIGFib3V0IG1pc3NpbmcgcHJpdmF0ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzb2NrZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlbW90ZVNvY2tldCh0aGlzLmFkYXB0ZXIsIHNvY2tldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYWtlcyB0aGUgbWF0Y2hpbmcgc29ja2V0IGluc3RhbmNlcyBqb2luIHRoZSBzcGVjaWZpZWQgcm9vbXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSByb29tXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHNvY2tldHNKb2luKHJvb20pIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmFkZFNvY2tldHMoe1xuICAgICAgICAgICAgcm9vbXM6IHRoaXMucm9vbXMsXG4gICAgICAgICAgICBleGNlcHQ6IHRoaXMuZXhjZXB0Um9vbXMsXG4gICAgICAgIH0sIEFycmF5LmlzQXJyYXkocm9vbSkgPyByb29tIDogW3Jvb21dKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWFrZXMgdGhlIG1hdGNoaW5nIHNvY2tldCBpbnN0YW5jZXMgbGVhdmUgdGhlIHNwZWNpZmllZCByb29tc1xuICAgICAqXG4gICAgICogQHBhcmFtIHJvb21cbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgc29ja2V0c0xlYXZlKHJvb20pIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmRlbFNvY2tldHMoe1xuICAgICAgICAgICAgcm9vbXM6IHRoaXMucm9vbXMsXG4gICAgICAgICAgICBleGNlcHQ6IHRoaXMuZXhjZXB0Um9vbXMsXG4gICAgICAgIH0sIEFycmF5LmlzQXJyYXkocm9vbSkgPyByb29tIDogW3Jvb21dKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWFrZXMgdGhlIG1hdGNoaW5nIHNvY2tldCBpbnN0YW5jZXMgZGlzY29ubmVjdFxuICAgICAqXG4gICAgICogQHBhcmFtIGNsb3NlIC0gd2hldGhlciB0byBjbG9zZSB0aGUgdW5kZXJseWluZyBjb25uZWN0aW9uXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGRpc2Nvbm5lY3RTb2NrZXRzKGNsb3NlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmRpc2Nvbm5lY3RTb2NrZXRzKHtcbiAgICAgICAgICAgIHJvb21zOiB0aGlzLnJvb21zLFxuICAgICAgICAgICAgZXhjZXB0OiB0aGlzLmV4Y2VwdFJvb21zLFxuICAgICAgICB9LCBjbG9zZSk7XG4gICAgfVxufVxuZXhwb3J0cy5Ccm9hZGNhc3RPcGVyYXRvciA9IEJyb2FkY2FzdE9wZXJhdG9yO1xuLyoqXG4gKiBFeHBvc2Ugb2Ygc3Vic2V0IG9mIHRoZSBhdHRyaWJ1dGVzIGFuZCBtZXRob2RzIG9mIHRoZSBTb2NrZXQgY2xhc3NcbiAqL1xuY2xhc3MgUmVtb3RlU29ja2V0IHtcbiAgICBjb25zdHJ1Y3RvcihhZGFwdGVyLCBkZXRhaWxzKSB7XG4gICAgICAgIHRoaXMuaWQgPSBkZXRhaWxzLmlkO1xuICAgICAgICB0aGlzLmhhbmRzaGFrZSA9IGRldGFpbHMuaGFuZHNoYWtlO1xuICAgICAgICB0aGlzLnJvb21zID0gbmV3IFNldChkZXRhaWxzLnJvb21zKTtcbiAgICAgICAgdGhpcy5kYXRhID0gZGV0YWlscy5kYXRhO1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gbmV3IEJyb2FkY2FzdE9wZXJhdG9yKGFkYXB0ZXIsIG5ldyBTZXQoW3RoaXMuaWRdKSk7XG4gICAgfVxuICAgIGVtaXQoZXYsIC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlcmF0b3IuZW1pdChldiwgLi4uYXJncyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEpvaW5zIGEgcm9vbS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSByb29tIC0gcm9vbSBvciBhcnJheSBvZiByb29tc1xuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBqb2luKHJvb20pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlcmF0b3Iuc29ja2V0c0pvaW4ocm9vbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIExlYXZlcyBhIHJvb20uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcm9vbVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBsZWF2ZShyb29tKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZXJhdG9yLnNvY2tldHNMZWF2ZShyb29tKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGlzY29ubmVjdHMgdGhpcyBjbGllbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGNsb3NlIC0gaWYgYHRydWVgLCBjbG9zZXMgdGhlIHVuZGVybHlpbmcgY29ubmVjdGlvblxuICAgICAqIEByZXR1cm4ge1NvY2tldH0gc2VsZlxuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGRpc2Nvbm5lY3QoY2xvc2UgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLm9wZXJhdG9yLmRpc2Nvbm5lY3RTb2NrZXRzKGNsb3NlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuZXhwb3J0cy5SZW1vdGVTb2NrZXQgPSBSZW1vdGVTb2NrZXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQ2xpZW50ID0gdm9pZCAwO1xuY29uc3Qgc29ja2V0X2lvX3BhcnNlcl8xID0gcmVxdWlyZShcInNvY2tldC5pby1wYXJzZXJcIik7XG5jb25zdCBkZWJ1Z01vZHVsZSA9IHJlcXVpcmUoXCJkZWJ1Z1wiKTtcbmNvbnN0IHVybCA9IHJlcXVpcmUoXCJ1cmxcIik7XG5jb25zdCBkZWJ1ZyA9IGRlYnVnTW9kdWxlKFwic29ja2V0LmlvOmNsaWVudFwiKTtcbmNsYXNzIENsaWVudCB7XG4gICAgLyoqXG4gICAgICogQ2xpZW50IGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNlcnZlciBpbnN0YW5jZVxuICAgICAqIEBwYXJhbSBjb25uXG4gICAgICogQHBhY2thZ2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzZXJ2ZXIsIGNvbm4pIHtcbiAgICAgICAgdGhpcy5zb2NrZXRzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLm5zcHMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuc2VydmVyID0gc2VydmVyO1xuICAgICAgICB0aGlzLmNvbm4gPSBjb25uO1xuICAgICAgICB0aGlzLmVuY29kZXIgPSBzZXJ2ZXIuZW5jb2RlcjtcbiAgICAgICAgdGhpcy5kZWNvZGVyID0gbmV3IHNlcnZlci5fcGFyc2VyLkRlY29kZXIoKTtcbiAgICAgICAgdGhpcy5pZCA9IGNvbm4uaWQ7XG4gICAgICAgIHRoaXMuc2V0dXAoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiB0aGUgcmVmZXJlbmNlIHRvIHRoZSByZXF1ZXN0IHRoYXQgb3JpZ2luYXRlZCB0aGUgRW5naW5lLklPIGNvbm5lY3Rpb25cbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBnZXQgcmVxdWVzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubi5yZXF1ZXN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHVwIGV2ZW50IGxpc3RlbmVycy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgc2V0dXAoKSB7XG4gICAgICAgIHRoaXMub25jbG9zZSA9IHRoaXMub25jbG9zZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uZGF0YSA9IHRoaXMub25kYXRhLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25lcnJvciA9IHRoaXMub25lcnJvci5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uZGVjb2RlZCA9IHRoaXMub25kZWNvZGVkLmJpbmQodGhpcyk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5kZWNvZGVyLm9uKFwiZGVjb2RlZFwiLCB0aGlzLm9uZGVjb2RlZCk7XG4gICAgICAgIHRoaXMuY29ubi5vbihcImRhdGFcIiwgdGhpcy5vbmRhdGEpO1xuICAgICAgICB0aGlzLmNvbm4ub24oXCJlcnJvclwiLCB0aGlzLm9uZXJyb3IpO1xuICAgICAgICB0aGlzLmNvbm4ub24oXCJjbG9zZVwiLCB0aGlzLm9uY2xvc2UpO1xuICAgICAgICB0aGlzLmNvbm5lY3RUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5uc3BzLnNpemUgPT09IDApIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhcIm5vIG5hbWVzcGFjZSBqb2luZWQgeWV0LCBjbG9zZSB0aGUgY2xpZW50XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlYnVnKFwidGhlIGNsaWVudCBoYXMgYWxyZWFkeSBqb2luZWQgYSBuYW1lc3BhY2UsIG5vdGhpbmcgdG8gZG9cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMuc2VydmVyLl9jb25uZWN0VGltZW91dCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbm5lY3RzIGEgY2xpZW50IHRvIGEgbmFtZXNwYWNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSB0aGUgbmFtZXNwYWNlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF1dGggLSB0aGUgYXV0aCBwYXJhbWV0ZXJzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjb25uZWN0KG5hbWUsIGF1dGggPSB7fSkge1xuICAgICAgICBpZiAodGhpcy5zZXJ2ZXIuX25zcHMuaGFzKG5hbWUpKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcImNvbm5lY3RpbmcgdG8gbmFtZXNwYWNlICVzXCIsIG5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZG9Db25uZWN0KG5hbWUsIGF1dGgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VydmVyLl9jaGVja05hbWVzcGFjZShuYW1lLCBhdXRoLCAoZHluYW1pY05zcE5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChkeW5hbWljTnNwTmFtZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9Db25uZWN0KG5hbWUsIGF1dGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVidWcoXCJjcmVhdGlvbiBvZiBuYW1lc3BhY2UgJXMgd2FzIGRlbmllZFwiLCBuYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wYWNrZXQoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBzb2NrZXRfaW9fcGFyc2VyXzEuUGFja2V0VHlwZS5DT05ORUNUX0VSUk9SLFxuICAgICAgICAgICAgICAgICAgICBuc3A6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiSW52YWxpZCBuYW1lc3BhY2VcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbm5lY3RzIGEgY2xpZW50IHRvIGEgbmFtZXNwYWNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZXNwYWNlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF1dGggLSB0aGUgYXV0aCBwYXJhbWV0ZXJzXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGRvQ29ubmVjdChuYW1lLCBhdXRoKSB7XG4gICAgICAgIGNvbnN0IG5zcCA9IHRoaXMuc2VydmVyLm9mKG5hbWUpO1xuICAgICAgICBjb25zdCBzb2NrZXQgPSBuc3AuX2FkZCh0aGlzLCBhdXRoLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldHMuc2V0KHNvY2tldC5pZCwgc29ja2V0KTtcbiAgICAgICAgICAgIHRoaXMubnNwcy5zZXQobnNwLm5hbWUsIHNvY2tldCk7XG4gICAgICAgICAgICBpZiAodGhpcy5jb25uZWN0VGltZW91dCkge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNvbm5lY3RUaW1lb3V0KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3RUaW1lb3V0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGlzY29ubmVjdHMgZnJvbSBhbGwgbmFtZXNwYWNlcyBhbmQgY2xvc2VzIHRyYW5zcG9ydC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2Rpc2Nvbm5lY3QoKSB7XG4gICAgICAgIGZvciAoY29uc3Qgc29ja2V0IG9mIHRoaXMuc29ja2V0cy52YWx1ZXMoKSkge1xuICAgICAgICAgICAgc29ja2V0LmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNvY2tldHMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgc29ja2V0LiBDYWxsZWQgYnkgZWFjaCBgU29ja2V0YC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3JlbW92ZShzb2NrZXQpIHtcbiAgICAgICAgaWYgKHRoaXMuc29ja2V0cy5oYXMoc29ja2V0LmlkKSkge1xuICAgICAgICAgICAgY29uc3QgbnNwID0gdGhpcy5zb2NrZXRzLmdldChzb2NrZXQuaWQpLm5zcC5uYW1lO1xuICAgICAgICAgICAgdGhpcy5zb2NrZXRzLmRlbGV0ZShzb2NrZXQuaWQpO1xuICAgICAgICAgICAgdGhpcy5uc3BzLmRlbGV0ZShuc3ApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGVidWcoXCJpZ25vcmluZyByZW1vdmUgZm9yICVzXCIsIHNvY2tldC5pZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xvc2VzIHRoZSB1bmRlcmx5aW5nIGNvbm5lY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGNsb3NlKCkge1xuICAgICAgICBpZiAoXCJvcGVuXCIgPT09IHRoaXMuY29ubi5yZWFkeVN0YXRlKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcImZvcmNpbmcgdHJhbnNwb3J0IGNsb3NlXCIpO1xuICAgICAgICAgICAgdGhpcy5jb25uLmNsb3NlKCk7XG4gICAgICAgICAgICB0aGlzLm9uY2xvc2UoXCJmb3JjZWQgc2VydmVyIGNsb3NlXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFdyaXRlcyBhIHBhY2tldCB0byB0aGUgdHJhbnNwb3J0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhY2tldCBvYmplY3RcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3BhY2tldChwYWNrZXQsIG9wdHMgPSB7fSkge1xuICAgICAgICBpZiAodGhpcy5jb25uLnJlYWR5U3RhdGUgIT09IFwib3BlblwiKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcImlnbm9yaW5nIHBhY2tldCB3cml0ZSAlalwiLCBwYWNrZXQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVuY29kZWRQYWNrZXRzID0gb3B0cy5wcmVFbmNvZGVkXG4gICAgICAgICAgICA/IHBhY2tldCAvLyBwcmV2aW91cyB2ZXJzaW9ucyBvZiB0aGUgYWRhcHRlciBpbmNvcnJlY3RseSB1c2VkIHNvY2tldC5wYWNrZXQoKSBpbnN0ZWFkIG9mIHdyaXRlVG9FbmdpbmUoKVxuICAgICAgICAgICAgOiB0aGlzLmVuY29kZXIuZW5jb2RlKHBhY2tldCk7XG4gICAgICAgIHRoaXMud3JpdGVUb0VuZ2luZShlbmNvZGVkUGFja2V0cywgb3B0cyk7XG4gICAgfVxuICAgIHdyaXRlVG9FbmdpbmUoZW5jb2RlZFBhY2tldHMsIG9wdHMpIHtcbiAgICAgICAgaWYgKG9wdHMudm9sYXRpbGUgJiYgIXRoaXMuY29ubi50cmFuc3BvcnQud3JpdGFibGUpIHtcbiAgICAgICAgICAgIGRlYnVnKFwidm9sYXRpbGUgcGFja2V0IGlzIGRpc2NhcmRlZCBzaW5jZSB0aGUgdHJhbnNwb3J0IGlzIG5vdCBjdXJyZW50bHkgd3JpdGFibGVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFja2V0cyA9IEFycmF5LmlzQXJyYXkoZW5jb2RlZFBhY2tldHMpXG4gICAgICAgICAgICA/IGVuY29kZWRQYWNrZXRzXG4gICAgICAgICAgICA6IFtlbmNvZGVkUGFja2V0c107XG4gICAgICAgIGZvciAoY29uc3QgZW5jb2RlZFBhY2tldCBvZiBwYWNrZXRzKSB7XG4gICAgICAgICAgICB0aGlzLmNvbm4ud3JpdGUoZW5jb2RlZFBhY2tldCwgb3B0cyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdpdGggaW5jb21pbmcgdHJhbnNwb3J0IGRhdGEuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uZGF0YShkYXRhKSB7XG4gICAgICAgIC8vIHRyeS9jYXRjaCBpcyBuZWVkZWQgZm9yIHByb3RvY29sIHZpb2xhdGlvbnMgKEdILTE4ODApXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmRlY29kZXIuYWRkKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLm9uZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gcGFyc2VyIGZ1bGx5IGRlY29kZXMgYSBwYWNrZXQuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uZGVjb2RlZChwYWNrZXQpIHtcbiAgICAgICAgaWYgKHNvY2tldF9pb19wYXJzZXJfMS5QYWNrZXRUeXBlLkNPTk5FQ1QgPT09IHBhY2tldC50eXBlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb25uLnByb3RvY29sID09PSAzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkID0gdXJsLnBhcnNlKHBhY2tldC5uc3AsIHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdChwYXJzZWQucGF0aG5hbWUsIHBhcnNlZC5xdWVyeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3QocGFja2V0Lm5zcCwgcGFja2V0LmRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc29ja2V0ID0gdGhpcy5uc3BzLmdldChwYWNrZXQubnNwKTtcbiAgICAgICAgICAgIGlmIChzb2NrZXQpIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc29ja2V0Ll9vbnBhY2tldChwYWNrZXQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVidWcoXCJubyBzb2NrZXQgZm9yIG5hbWVzcGFjZSAlc1wiLCBwYWNrZXQubnNwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGFuIGVycm9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVyciBvYmplY3RcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uZXJyb3IoZXJyKSB7XG4gICAgICAgIGZvciAoY29uc3Qgc29ja2V0IG9mIHRoaXMuc29ja2V0cy52YWx1ZXMoKSkge1xuICAgICAgICAgICAgc29ja2V0Ll9vbmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb25uLmNsb3NlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxlZCB1cG9uIHRyYW5zcG9ydCBjbG9zZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByZWFzb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uY2xvc2UocmVhc29uKSB7XG4gICAgICAgIGRlYnVnKFwiY2xpZW50IGNsb3NlIHdpdGggcmVhc29uICVzXCIsIHJlYXNvbik7XG4gICAgICAgIC8vIGlnbm9yZSBhIHBvdGVudGlhbCBzdWJzZXF1ZW50IGBjbG9zZWAgZXZlbnRcbiAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICAgIC8vIGBuc3BzYCBhbmQgYHNvY2tldHNgIGFyZSBjbGVhbmVkIHVwIHNlYW1sZXNzbHlcbiAgICAgICAgZm9yIChjb25zdCBzb2NrZXQgb2YgdGhpcy5zb2NrZXRzLnZhbHVlcygpKSB7XG4gICAgICAgICAgICBzb2NrZXQuX29uY2xvc2UocmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNvY2tldHMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5kZWNvZGVyLmRlc3Ryb3koKTsgLy8gY2xlYW4gdXAgZGVjb2RlclxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbGVhbnMgdXAgZXZlbnQgbGlzdGVuZXJzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5jb25uLnJlbW92ZUxpc3RlbmVyKFwiZGF0YVwiLCB0aGlzLm9uZGF0YSk7XG4gICAgICAgIHRoaXMuY29ubi5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIHRoaXMub25lcnJvcik7XG4gICAgICAgIHRoaXMuY29ubi5yZW1vdmVMaXN0ZW5lcihcImNsb3NlXCIsIHRoaXMub25jbG9zZSk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5kZWNvZGVyLnJlbW92ZUxpc3RlbmVyKFwiZGVjb2RlZFwiLCB0aGlzLm9uZGVjb2RlZCk7XG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3RUaW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5jb25uZWN0VGltZW91dCk7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3RUaW1lb3V0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5DbGllbnQgPSBDbGllbnQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX3NldE1vZHVsZURlZmF1bHQpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XG59KTtcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5OYW1lc3BhY2UgPSBleHBvcnRzLlNvY2tldCA9IGV4cG9ydHMuU2VydmVyID0gdm9pZCAwO1xuY29uc3QgaHR0cCA9IHJlcXVpcmUoXCJodHRwXCIpO1xuY29uc3QgZnNfMSA9IHJlcXVpcmUoXCJmc1wiKTtcbmNvbnN0IHpsaWJfMSA9IHJlcXVpcmUoXCJ6bGliXCIpO1xuY29uc3QgYWNjZXB0cyA9IHJlcXVpcmUoXCJhY2NlcHRzXCIpO1xuY29uc3Qgc3RyZWFtXzEgPSByZXF1aXJlKFwic3RyZWFtXCIpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuY29uc3QgZW5naW5lX2lvXzEgPSByZXF1aXJlKFwiZW5naW5lLmlvXCIpO1xuY29uc3QgY2xpZW50XzEgPSByZXF1aXJlKFwiLi9jbGllbnRcIik7XG5jb25zdCBldmVudHNfMSA9IHJlcXVpcmUoXCJldmVudHNcIik7XG5jb25zdCBuYW1lc3BhY2VfMSA9IHJlcXVpcmUoXCIuL25hbWVzcGFjZVwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIk5hbWVzcGFjZVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gbmFtZXNwYWNlXzEuTmFtZXNwYWNlOyB9IH0pO1xuY29uc3QgcGFyZW50X25hbWVzcGFjZV8xID0gcmVxdWlyZShcIi4vcGFyZW50LW5hbWVzcGFjZVwiKTtcbmNvbnN0IHNvY2tldF9pb19hZGFwdGVyXzEgPSByZXF1aXJlKFwic29ja2V0LmlvLWFkYXB0ZXJcIik7XG5jb25zdCBwYXJzZXIgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcInNvY2tldC5pby1wYXJzZXJcIikpO1xuY29uc3QgZGVidWdfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZGVidWdcIikpO1xuY29uc3Qgc29ja2V0XzEgPSByZXF1aXJlKFwiLi9zb2NrZXRcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJTb2NrZXRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNvY2tldF8xLlNvY2tldDsgfSB9KTtcbmNvbnN0IHR5cGVkX2V2ZW50c18xID0gcmVxdWlyZShcIi4vdHlwZWQtZXZlbnRzXCIpO1xuY29uc3QgdXdzX2pzXzEgPSByZXF1aXJlKFwiLi91d3MuanNcIik7XG5jb25zdCBkZWJ1ZyA9ICgwLCBkZWJ1Z18xLmRlZmF1bHQpKFwic29ja2V0LmlvOnNlcnZlclwiKTtcbmNvbnN0IGNsaWVudFZlcnNpb24gPSByZXF1aXJlKFwiLi4vcGFja2FnZS5qc29uXCIpLnZlcnNpb247XG5jb25zdCBkb3RNYXBSZWdleCA9IC9cXC5tYXAvO1xuY2xhc3MgU2VydmVyIGV4dGVuZHMgdHlwZWRfZXZlbnRzXzEuU3RyaWN0RXZlbnRFbWl0dGVyIHtcbiAgICBjb25zdHJ1Y3RvcihzcnYsIG9wdHMgPSB7fSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX25zcHMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMucGFyZW50TnNwcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgaWYgKFwib2JqZWN0XCIgPT09IHR5cGVvZiBzcnYgJiZcbiAgICAgICAgICAgIHNydiBpbnN0YW5jZW9mIE9iamVjdCAmJlxuICAgICAgICAgICAgIXNydi5saXN0ZW4pIHtcbiAgICAgICAgICAgIG9wdHMgPSBzcnY7XG4gICAgICAgICAgICBzcnYgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXRoKG9wdHMucGF0aCB8fCBcIi9zb2NrZXQuaW9cIik7XG4gICAgICAgIHRoaXMuY29ubmVjdFRpbWVvdXQob3B0cy5jb25uZWN0VGltZW91dCB8fCA0NTAwMCk7XG4gICAgICAgIHRoaXMuc2VydmVDbGllbnQoZmFsc2UgIT09IG9wdHMuc2VydmVDbGllbnQpO1xuICAgICAgICB0aGlzLl9wYXJzZXIgPSBvcHRzLnBhcnNlciB8fCBwYXJzZXI7XG4gICAgICAgIHRoaXMuZW5jb2RlciA9IG5ldyB0aGlzLl9wYXJzZXIuRW5jb2RlcigpO1xuICAgICAgICB0aGlzLmFkYXB0ZXIob3B0cy5hZGFwdGVyIHx8IHNvY2tldF9pb19hZGFwdGVyXzEuQWRhcHRlcik7XG4gICAgICAgIHRoaXMuc29ja2V0cyA9IHRoaXMub2YoXCIvXCIpO1xuICAgICAgICB0aGlzLm9wdHMgPSBvcHRzO1xuICAgICAgICBpZiAoc3J2IHx8IHR5cGVvZiBzcnYgPT0gXCJudW1iZXJcIilcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoKHNydik7XG4gICAgfVxuICAgIHNlcnZlQ2xpZW50KHYpIHtcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlcnZlQ2xpZW50O1xuICAgICAgICB0aGlzLl9zZXJ2ZUNsaWVudCA9IHY7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyB0aGUgbWlkZGxld2FyZSBmb3IgYW4gaW5jb21pbmcgbmFtZXNwYWNlIG5vdCBhbHJlYWR5IGNyZWF0ZWQgb24gdGhlIHNlcnZlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBuYW1lIC0gbmFtZSBvZiBpbmNvbWluZyBuYW1lc3BhY2VcbiAgICAgKiBAcGFyYW0gYXV0aCAtIHRoZSBhdXRoIHBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0gZm4gLSBjYWxsYmFja1xuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfY2hlY2tOYW1lc3BhY2UobmFtZSwgYXV0aCwgZm4pIHtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50TnNwcy5zaXplID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIGZuKGZhbHNlKTtcbiAgICAgICAgY29uc3Qga2V5c0l0ZXJhdG9yID0gdGhpcy5wYXJlbnROc3BzLmtleXMoKTtcbiAgICAgICAgY29uc3QgcnVuID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV4dEZuID0ga2V5c0l0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgIGlmIChuZXh0Rm4uZG9uZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbihmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXh0Rm4udmFsdWUobmFtZSwgYXV0aCwgKGVyciwgYWxsb3cpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyIHx8ICFhbGxvdykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnVuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9uc3BzLmhhcyhuYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgbmFtZXNwYWNlIHdhcyBjcmVhdGVkIGluIHRoZSBtZWFudGltZVxuICAgICAgICAgICAgICAgICAgICBkZWJ1ZyhcImR5bmFtaWMgbmFtZXNwYWNlICVzIGFscmVhZHkgZXhpc3RzXCIsIG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4odGhpcy5fbnNwcy5nZXQobmFtZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lc3BhY2UgPSB0aGlzLnBhcmVudE5zcHMuZ2V0KG5leHRGbi52YWx1ZSkuY3JlYXRlQ2hpbGQobmFtZSk7XG4gICAgICAgICAgICAgICAgZGVidWcoXCJkeW5hbWljIG5hbWVzcGFjZSAlcyB3YXMgY3JlYXRlZFwiLCBuYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXRzLmVtaXRSZXNlcnZlZChcIm5ld19uYW1lc3BhY2VcIiwgbmFtZXNwYWNlKTtcbiAgICAgICAgICAgICAgICBmbihuYW1lc3BhY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHJ1bigpO1xuICAgIH1cbiAgICBwYXRoKHYpIHtcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdGg7XG4gICAgICAgIHRoaXMuX3BhdGggPSB2LnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcbiAgICAgICAgY29uc3QgZXNjYXBlZFBhdGggPSB0aGlzLl9wYXRoLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgXCJcXFxcJCZcIik7XG4gICAgICAgIHRoaXMuY2xpZW50UGF0aFJlZ2V4ID0gbmV3IFJlZ0V4cChcIl5cIiArXG4gICAgICAgICAgICBlc2NhcGVkUGF0aCArXG4gICAgICAgICAgICBcIi9zb2NrZXRcXFxcLmlvKFxcXFwubXNncGFja3xcXFxcLmVzbSk/KFxcXFwubWluKT9cXFxcLmpzKFxcXFwubWFwKT8oPzpcXFxcP3wkKVwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGNvbm5lY3RUaW1lb3V0KHYpIHtcbiAgICAgICAgaWYgKHYgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb25uZWN0VGltZW91dDtcbiAgICAgICAgdGhpcy5fY29ubmVjdFRpbWVvdXQgPSB2O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgYWRhcHRlcih2KSB7XG4gICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGFwdGVyO1xuICAgICAgICB0aGlzLl9hZGFwdGVyID0gdjtcbiAgICAgICAgZm9yIChjb25zdCBuc3Agb2YgdGhpcy5fbnNwcy52YWx1ZXMoKSkge1xuICAgICAgICAgICAgbnNwLl9pbml0QWRhcHRlcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdHRhY2hlcyBzb2NrZXQuaW8gdG8gYSBzZXJ2ZXIgb3IgcG9ydC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzcnYgLSBzZXJ2ZXIgb3IgcG9ydFxuICAgICAqIEBwYXJhbSBvcHRzIC0gb3B0aW9ucyBwYXNzZWQgdG8gZW5naW5lLmlvXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGxpc3RlbihzcnYsIG9wdHMgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdHRhY2goc3J2LCBvcHRzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXR0YWNoZXMgc29ja2V0LmlvIHRvIGEgc2VydmVyIG9yIHBvcnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3J2IC0gc2VydmVyIG9yIHBvcnRcbiAgICAgKiBAcGFyYW0gb3B0cyAtIG9wdGlvbnMgcGFzc2VkIHRvIGVuZ2luZS5pb1xuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBhdHRhY2goc3J2LCBvcHRzID0ge30pIHtcbiAgICAgICAgaWYgKFwiZnVuY3Rpb25cIiA9PSB0eXBlb2Ygc3J2KSB7XG4gICAgICAgICAgICBjb25zdCBtc2cgPSBcIllvdSBhcmUgdHJ5aW5nIHRvIGF0dGFjaCBzb2NrZXQuaW8gdG8gYW4gZXhwcmVzcyBcIiArXG4gICAgICAgICAgICAgICAgXCJyZXF1ZXN0IGhhbmRsZXIgZnVuY3Rpb24uIFBsZWFzZSBwYXNzIGEgaHR0cC5TZXJ2ZXIgaW5zdGFuY2UuXCI7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBoYW5kbGUgYSBwb3J0IGFzIGEgc3RyaW5nXG4gICAgICAgIGlmIChOdW1iZXIoc3J2KSA9PSBzcnYpIHtcbiAgICAgICAgICAgIHNydiA9IE51bWJlcihzcnYpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcIm51bWJlclwiID09IHR5cGVvZiBzcnYpIHtcbiAgICAgICAgICAgIGRlYnVnKFwiY3JlYXRpbmcgaHR0cCBzZXJ2ZXIgYW5kIGJpbmRpbmcgdG8gJWRcIiwgc3J2KTtcbiAgICAgICAgICAgIGNvbnN0IHBvcnQgPSBzcnY7XG4gICAgICAgICAgICBzcnYgPSBodHRwLmNyZWF0ZVNlcnZlcigocmVxLCByZXMpID0+IHtcbiAgICAgICAgICAgICAgICByZXMud3JpdGVIZWFkKDQwNCk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzcnYubGlzdGVuKHBvcnQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1lcmdlIHRoZSBvcHRpb25zIHBhc3NlZCB0byB0aGUgU29ja2V0LklPIHNlcnZlclxuICAgICAgICBPYmplY3QuYXNzaWduKG9wdHMsIHRoaXMub3B0cyk7XG4gICAgICAgIC8vIHNldCBlbmdpbmUuaW8gcGF0aCB0byBgL3NvY2tldC5pb2BcbiAgICAgICAgb3B0cy5wYXRoID0gb3B0cy5wYXRoIHx8IHRoaXMuX3BhdGg7XG4gICAgICAgIHRoaXMuaW5pdEVuZ2luZShzcnYsIG9wdHMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgYXR0YWNoQXBwKGFwcCAvKjogVGVtcGxhdGVkQXBwICovLCBvcHRzID0ge30pIHtcbiAgICAgICAgLy8gbWVyZ2UgdGhlIG9wdGlvbnMgcGFzc2VkIHRvIHRoZSBTb2NrZXQuSU8gc2VydmVyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ob3B0cywgdGhpcy5vcHRzKTtcbiAgICAgICAgLy8gc2V0IGVuZ2luZS5pbyBwYXRoIHRvIGAvc29ja2V0LmlvYFxuICAgICAgICBvcHRzLnBhdGggPSBvcHRzLnBhdGggfHwgdGhpcy5fcGF0aDtcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBlbmdpbmVcbiAgICAgICAgZGVidWcoXCJjcmVhdGluZyB1V2ViU29ja2V0cy5qcy1iYXNlZCBlbmdpbmUgd2l0aCBvcHRzICVqXCIsIG9wdHMpO1xuICAgICAgICBjb25zdCBlbmdpbmUgPSBuZXcgZW5naW5lX2lvXzEudVNlcnZlcihvcHRzKTtcbiAgICAgICAgZW5naW5lLmF0dGFjaChhcHAsIG9wdHMpO1xuICAgICAgICAvLyBiaW5kIHRvIGVuZ2luZSBldmVudHNcbiAgICAgICAgdGhpcy5iaW5kKGVuZ2luZSk7XG4gICAgICAgIGlmICh0aGlzLl9zZXJ2ZUNsaWVudCkge1xuICAgICAgICAgICAgLy8gYXR0YWNoIHN0YXRpYyBmaWxlIHNlcnZpbmdcbiAgICAgICAgICAgIGFwcC5nZXQoYCR7dGhpcy5fcGF0aH0vKmAsIChyZXMsIHJlcSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jbGllbnRQYXRoUmVnZXgudGVzdChyZXEuZ2V0VXJsKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcS5zZXRZaWVsZCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlbmFtZSA9IHJlcVxuICAgICAgICAgICAgICAgICAgICAuZ2V0VXJsKClcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UodGhpcy5fcGF0aCwgXCJcIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgXCJcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNNYXAgPSBkb3RNYXBSZWdleC50ZXN0KGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gaXNNYXAgPyBcIm1hcFwiIDogXCJzb3VyY2VcIjtcbiAgICAgICAgICAgICAgICAvLyBQZXIgdGhlIHN0YW5kYXJkLCBFVGFncyBtdXN0IGJlIHF1b3RlZDpcbiAgICAgICAgICAgICAgICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMiNzZWN0aW9uLTIuM1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkRXRhZyA9ICdcIicgKyBjbGllbnRWZXJzaW9uICsgJ1wiJztcbiAgICAgICAgICAgICAgICBjb25zdCB3ZWFrRXRhZyA9IFwiVy9cIiArIGV4cGVjdGVkRXRhZztcbiAgICAgICAgICAgICAgICBjb25zdCBldGFnID0gcmVxLmdldEhlYWRlcihcImlmLW5vbmUtbWF0Y2hcIik7XG4gICAgICAgICAgICAgICAgaWYgKGV0YWcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4cGVjdGVkRXRhZyA9PT0gZXRhZyB8fCB3ZWFrRXRhZyA9PT0gZXRhZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWcoXCJzZXJ2ZSBjbGllbnQgJXMgMzA0XCIsIHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLndyaXRlU3RhdHVzKFwiMzA0IE5vdCBNb2RpZmllZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWJ1ZyhcInNlcnZlIGNsaWVudCAlc1wiLCB0eXBlKTtcbiAgICAgICAgICAgICAgICByZXMud3JpdGVIZWFkZXIoXCJjYWNoZS1jb250cm9sXCIsIFwicHVibGljLCBtYXgtYWdlPTBcIik7XG4gICAgICAgICAgICAgICAgcmVzLndyaXRlSGVhZGVyKFwiY29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24vXCIgKyAoaXNNYXAgPyBcImpzb25cIiA6IFwiamF2YXNjcmlwdFwiKSk7XG4gICAgICAgICAgICAgICAgcmVzLndyaXRlSGVhZGVyKFwiZXRhZ1wiLCBleHBlY3RlZEV0YWcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVwYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi9jbGllbnQtZGlzdC9cIiwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgICgwLCB1d3NfanNfMS5zZXJ2ZUZpbGUpKHJlcywgZmlsZXBhdGgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgKDAsIHV3c19qc18xLnBhdGNoQWRhcHRlcikoYXBwKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSBlbmdpbmVcbiAgICAgKlxuICAgICAqIEBwYXJhbSBzcnYgLSB0aGUgc2VydmVyIHRvIGF0dGFjaCB0b1xuICAgICAqIEBwYXJhbSBvcHRzIC0gb3B0aW9ucyBwYXNzZWQgdG8gZW5naW5lLmlvXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBpbml0RW5naW5lKHNydiwgb3B0cykge1xuICAgICAgICAvLyBpbml0aWFsaXplIGVuZ2luZVxuICAgICAgICBkZWJ1ZyhcImNyZWF0aW5nIGVuZ2luZS5pbyBpbnN0YW5jZSB3aXRoIG9wdHMgJWpcIiwgb3B0cyk7XG4gICAgICAgIHRoaXMuZWlvID0gKDAsIGVuZ2luZV9pb18xLmF0dGFjaCkoc3J2LCBvcHRzKTtcbiAgICAgICAgLy8gYXR0YWNoIHN0YXRpYyBmaWxlIHNlcnZpbmdcbiAgICAgICAgaWYgKHRoaXMuX3NlcnZlQ2xpZW50KVxuICAgICAgICAgICAgdGhpcy5hdHRhY2hTZXJ2ZShzcnYpO1xuICAgICAgICAvLyBFeHBvcnQgaHR0cCBzZXJ2ZXJcbiAgICAgICAgdGhpcy5odHRwU2VydmVyID0gc3J2O1xuICAgICAgICAvLyBiaW5kIHRvIGVuZ2luZSBldmVudHNcbiAgICAgICAgdGhpcy5iaW5kKHRoaXMuZWlvKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXR0YWNoZXMgdGhlIHN0YXRpYyBmaWxlIHNlcnZpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3J2IGh0dHAgc2VydmVyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBhdHRhY2hTZXJ2ZShzcnYpIHtcbiAgICAgICAgZGVidWcoXCJhdHRhY2hpbmcgY2xpZW50IHNlcnZpbmcgcmVxIGhhbmRsZXJcIik7XG4gICAgICAgIGNvbnN0IGV2cyA9IHNydi5saXN0ZW5lcnMoXCJyZXF1ZXN0XCIpLnNsaWNlKDApO1xuICAgICAgICBzcnYucmVtb3ZlQWxsTGlzdGVuZXJzKFwicmVxdWVzdFwiKTtcbiAgICAgICAgc3J2Lm9uKFwicmVxdWVzdFwiLCAocmVxLCByZXMpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNsaWVudFBhdGhSZWdleC50ZXN0KHJlcS51cmwpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZShyZXEsIHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBldnNbaV0uY2FsbChzcnYsIHJlcSwgcmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGEgcmVxdWVzdCBzZXJ2aW5nIG9mIGNsaWVudCBzb3VyY2UgYW5kIG1hcFxuICAgICAqXG4gICAgICogQHBhcmFtIHJlcVxuICAgICAqIEBwYXJhbSByZXNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHNlcnZlKHJlcSwgcmVzKSB7XG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gcmVxLnVybC5yZXBsYWNlKHRoaXMuX3BhdGgsIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpO1xuICAgICAgICBjb25zdCBpc01hcCA9IGRvdE1hcFJlZ2V4LnRlc3QoZmlsZW5hbWUpO1xuICAgICAgICBjb25zdCB0eXBlID0gaXNNYXAgPyBcIm1hcFwiIDogXCJzb3VyY2VcIjtcbiAgICAgICAgLy8gUGVyIHRoZSBzdGFuZGFyZCwgRVRhZ3MgbXVzdCBiZSBxdW90ZWQ6XG4gICAgICAgIC8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMyI3NlY3Rpb24tMi4zXG4gICAgICAgIGNvbnN0IGV4cGVjdGVkRXRhZyA9ICdcIicgKyBjbGllbnRWZXJzaW9uICsgJ1wiJztcbiAgICAgICAgY29uc3Qgd2Vha0V0YWcgPSBcIlcvXCIgKyBleHBlY3RlZEV0YWc7XG4gICAgICAgIGNvbnN0IGV0YWcgPSByZXEuaGVhZGVyc1tcImlmLW5vbmUtbWF0Y2hcIl07XG4gICAgICAgIGlmIChldGFnKSB7XG4gICAgICAgICAgICBpZiAoZXhwZWN0ZWRFdGFnID09PSBldGFnIHx8IHdlYWtFdGFnID09PSBldGFnKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoXCJzZXJ2ZSBjbGllbnQgJXMgMzA0XCIsIHR5cGUpO1xuICAgICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoMzA0KTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRlYnVnKFwic2VydmUgY2xpZW50ICVzXCIsIHR5cGUpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ2FjaGUtQ29udHJvbFwiLCBcInB1YmxpYywgbWF4LWFnZT0wXCIpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vXCIgKyAoaXNNYXAgPyBcImpzb25cIiA6IFwiamF2YXNjcmlwdFwiKSk7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoXCJFVGFnXCIsIGV4cGVjdGVkRXRhZyk7XG4gICAgICAgIFNlcnZlci5zZW5kRmlsZShmaWxlbmFtZSwgcmVxLCByZXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZmlsZW5hbWVcbiAgICAgKiBAcGFyYW0gcmVxXG4gICAgICogQHBhcmFtIHJlc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgc3RhdGljIHNlbmRGaWxlKGZpbGVuYW1lLCByZXEsIHJlcykge1xuICAgICAgICBjb25zdCByZWFkU3RyZWFtID0gKDAsIGZzXzEuY3JlYXRlUmVhZFN0cmVhbSkocGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi9jbGllbnQtZGlzdC9cIiwgZmlsZW5hbWUpKTtcbiAgICAgICAgY29uc3QgZW5jb2RpbmcgPSBhY2NlcHRzKHJlcSkuZW5jb2RpbmdzKFtcImJyXCIsIFwiZ3ppcFwiLCBcImRlZmxhdGVcIl0pO1xuICAgICAgICBjb25zdCBvbkVycm9yID0gKGVycikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgICAgICAgY2FzZSBcImJyXCI6XG4gICAgICAgICAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHsgXCJjb250ZW50LWVuY29kaW5nXCI6IFwiYnJcIiB9KTtcbiAgICAgICAgICAgICAgICByZWFkU3RyZWFtLnBpcGUoKDAsIHpsaWJfMS5jcmVhdGVCcm90bGlDb21wcmVzcykoKSkucGlwZShyZXMpO1xuICAgICAgICAgICAgICAgICgwLCBzdHJlYW1fMS5waXBlbGluZSkocmVhZFN0cmVhbSwgKDAsIHpsaWJfMS5jcmVhdGVCcm90bGlDb21wcmVzcykoKSwgcmVzLCBvbkVycm9yKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJnemlwXCI6XG4gICAgICAgICAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHsgXCJjb250ZW50LWVuY29kaW5nXCI6IFwiZ3ppcFwiIH0pO1xuICAgICAgICAgICAgICAgICgwLCBzdHJlYW1fMS5waXBlbGluZSkocmVhZFN0cmVhbSwgKDAsIHpsaWJfMS5jcmVhdGVHemlwKSgpLCByZXMsIG9uRXJyb3IpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImRlZmxhdGVcIjpcbiAgICAgICAgICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwgeyBcImNvbnRlbnQtZW5jb2RpbmdcIjogXCJkZWZsYXRlXCIgfSk7XG4gICAgICAgICAgICAgICAgKDAsIHN0cmVhbV8xLnBpcGVsaW5lKShyZWFkU3RyZWFtLCAoMCwgemxpYl8xLmNyZWF0ZURlZmxhdGUpKCksIHJlcywgb25FcnJvcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoMjAwKTtcbiAgICAgICAgICAgICAgICAoMCwgc3RyZWFtXzEucGlwZWxpbmUpKHJlYWRTdHJlYW0sIHJlcywgb25FcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQmluZHMgc29ja2V0LmlvIHRvIGFuIGVuZ2luZS5pbyBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZW5naW5lLlNlcnZlcn0gZW5naW5lIGVuZ2luZS5pbyAob3IgY29tcGF0aWJsZSkgc2VydmVyXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGJpbmQoZW5naW5lKSB7XG4gICAgICAgIHRoaXMuZW5naW5lID0gZW5naW5lO1xuICAgICAgICB0aGlzLmVuZ2luZS5vbihcImNvbm5lY3Rpb25cIiwgdGhpcy5vbmNvbm5lY3Rpb24uYmluZCh0aGlzKSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2l0aCBlYWNoIGluY29taW5nIHRyYW5zcG9ydCBjb25uZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtlbmdpbmUuU29ja2V0fSBjb25uXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBvbmNvbm5lY3Rpb24oY29ubikge1xuICAgICAgICBkZWJ1ZyhcImluY29taW5nIGNvbm5lY3Rpb24gd2l0aCBpZCAlc1wiLCBjb25uLmlkKTtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gbmV3IGNsaWVudF8xLkNsaWVudCh0aGlzLCBjb25uKTtcbiAgICAgICAgaWYgKGNvbm4ucHJvdG9jb2wgPT09IDMpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGNsaWVudC5jb25uZWN0KFwiL1wiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogTG9va3MgdXAgYSBuYW1lc3BhY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB8RnVuY3Rpb259IG5hbWUgbnNwIG5hbWVcbiAgICAgKiBAcGFyYW0gZm4gb3B0aW9uYWwsIG5zcCBgY29ubmVjdGlvbmAgZXYgaGFuZGxlclxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBvZihuYW1lLCBmbikge1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT09IFwiZnVuY3Rpb25cIiB8fCBuYW1lIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnROc3AgPSBuZXcgcGFyZW50X25hbWVzcGFjZV8xLlBhcmVudE5hbWVzcGFjZSh0aGlzKTtcbiAgICAgICAgICAgIGRlYnVnKFwiaW5pdGlhbGl6aW5nIHBhcmVudCBuYW1lc3BhY2UgJXNcIiwgcGFyZW50TnNwLm5hbWUpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudE5zcHMuc2V0KG5hbWUsIHBhcmVudE5zcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudE5zcHMuc2V0KChuc3AsIGNvbm4sIG5leHQpID0+IG5leHQobnVsbCwgbmFtZS50ZXN0KG5zcCkpLCBwYXJlbnROc3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIHBhcmVudE5zcC5vbihcImNvbm5lY3RcIiwgZm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudE5zcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoU3RyaW5nKG5hbWUpWzBdICE9PSBcIi9cIilcbiAgICAgICAgICAgIG5hbWUgPSBcIi9cIiArIG5hbWU7XG4gICAgICAgIGxldCBuc3AgPSB0aGlzLl9uc3BzLmdldChuYW1lKTtcbiAgICAgICAgaWYgKCFuc3ApIHtcbiAgICAgICAgICAgIGRlYnVnKFwiaW5pdGlhbGl6aW5nIG5hbWVzcGFjZSAlc1wiLCBuYW1lKTtcbiAgICAgICAgICAgIG5zcCA9IG5ldyBuYW1lc3BhY2VfMS5OYW1lc3BhY2UodGhpcywgbmFtZSk7XG4gICAgICAgICAgICB0aGlzLl9uc3BzLnNldChuYW1lLCBuc3ApO1xuICAgICAgICAgICAgaWYgKG5hbWUgIT09IFwiL1wiKSB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0cy5lbWl0UmVzZXJ2ZWQoXCJuZXdfbmFtZXNwYWNlXCIsIG5zcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZuKVxuICAgICAgICAgICAgbnNwLm9uKFwiY29ubmVjdFwiLCBmbik7XG4gICAgICAgIHJldHVybiBuc3A7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsb3NlcyBzZXJ2ZXIgY29ubmVjdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIFtmbl0gb3B0aW9uYWwsIGNhbGxlZCBhcyBgZm4oW2Vycl0pYCBvbiBlcnJvciBPUiBhbGwgY29ubnMgY2xvc2VkXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGNsb3NlKGZuKSB7XG4gICAgICAgIGZvciAoY29uc3Qgc29ja2V0IG9mIHRoaXMuc29ja2V0cy5zb2NrZXRzLnZhbHVlcygpKSB7XG4gICAgICAgICAgICBzb2NrZXQuX29uY2xvc2UoXCJzZXJ2ZXIgc2h1dHRpbmcgZG93blwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVuZ2luZS5jbG9zZSgpO1xuICAgICAgICAvLyByZXN0b3JlIHRoZSBBZGFwdGVyIHByb3RvdHlwZVxuICAgICAgICAoMCwgdXdzX2pzXzEucmVzdG9yZUFkYXB0ZXIpKCk7XG4gICAgICAgIGlmICh0aGlzLmh0dHBTZXJ2ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuaHR0cFNlcnZlci5jbG9zZShmbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmbiAmJiBmbigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdXAgbmFtZXNwYWNlIG1pZGRsZXdhcmUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgdXNlKGZuKSB7XG4gICAgICAgIHRoaXMuc29ja2V0cy51c2UoZm4pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGFyZ2V0cyBhIHJvb20gd2hlbiBlbWl0dGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByb29tXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHRvKHJvb20pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ja2V0cy50byhyb29tKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGFyZ2V0cyBhIHJvb20gd2hlbiBlbWl0dGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByb29tXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGluKHJvb20pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ja2V0cy5pbihyb29tKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRXhjbHVkZXMgYSByb29tIHdoZW4gZW1pdHRpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBleGNlcHQobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb2NrZXRzLmV4Y2VwdChuYW1lKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2VuZHMgYSBgbWVzc2FnZWAgZXZlbnQgdG8gYWxsIGNsaWVudHMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgc2VuZCguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMuc29ja2V0cy5lbWl0KFwibWVzc2FnZVwiLCAuLi5hcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNlbmRzIGEgYG1lc3NhZ2VgIGV2ZW50IHRvIGFsbCBjbGllbnRzLlxuICAgICAqXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHdyaXRlKC4uLmFyZ3MpIHtcbiAgICAgICAgdGhpcy5zb2NrZXRzLmVtaXQoXCJtZXNzYWdlXCIsIC4uLmFyZ3MpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogRW1pdCBhIHBhY2tldCB0byBvdGhlciBTb2NrZXQuSU8gc2VydmVyc1xuICAgICAqXG4gICAgICogQHBhcmFtIGV2IC0gdGhlIGV2ZW50IG5hbWVcbiAgICAgKiBAcGFyYW0gYXJncyAtIGFuIGFycmF5IG9mIGFyZ3VtZW50cywgd2hpY2ggbWF5IGluY2x1ZGUgYW4gYWNrbm93bGVkZ2VtZW50IGNhbGxiYWNrIGF0IHRoZSBlbmRcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgc2VydmVyU2lkZUVtaXQoZXYsIC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ja2V0cy5zZXJ2ZXJTaWRlRW1pdChldiwgLi4uYXJncyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgYSBsaXN0IG9mIHNvY2tldCBpZHMuXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgYWxsU29ja2V0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ja2V0cy5hbGxTb2NrZXRzKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGNvbXByZXNzIGZsYWcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29tcHJlc3MgLSBpZiBgdHJ1ZWAsIGNvbXByZXNzZXMgdGhlIHNlbmRpbmcgZGF0YVxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBjb21wcmVzcyhjb21wcmVzcykge1xuICAgICAgICByZXR1cm4gdGhpcy5zb2NrZXRzLmNvbXByZXNzKGNvbXByZXNzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBhIG1vZGlmaWVyIGZvciBhIHN1YnNlcXVlbnQgZXZlbnQgZW1pc3Npb24gdGhhdCB0aGUgZXZlbnQgZGF0YSBtYXkgYmUgbG9zdCBpZiB0aGUgY2xpZW50IGlzIG5vdCByZWFkeSB0b1xuICAgICAqIHJlY2VpdmUgbWVzc2FnZXMgKGJlY2F1c2Ugb2YgbmV0d29yayBzbG93bmVzcyBvciBvdGhlciBpc3N1ZXMsIG9yIGJlY2F1c2UgdGhleeKAmXJlIGNvbm5lY3RlZCB0aHJvdWdoIGxvbmcgcG9sbGluZ1xuICAgICAqIGFuZCBpcyBpbiB0aGUgbWlkZGxlIG9mIGEgcmVxdWVzdC1yZXNwb25zZSBjeWNsZSkuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZ2V0IHZvbGF0aWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb2NrZXRzLnZvbGF0aWxlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgbW9kaWZpZXIgZm9yIGEgc3Vic2VxdWVudCBldmVudCBlbWlzc2lvbiB0aGF0IHRoZSBldmVudCBkYXRhIHdpbGwgb25seSBiZSBicm9hZGNhc3QgdG8gdGhlIGN1cnJlbnQgbm9kZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBnZXQgbG9jYWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvY2tldHMubG9jYWw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG1hdGNoaW5nIHNvY2tldCBpbnN0YW5jZXNcbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBmZXRjaFNvY2tldHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvY2tldHMuZmV0Y2hTb2NrZXRzKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1ha2VzIHRoZSBtYXRjaGluZyBzb2NrZXQgaW5zdGFuY2VzIGpvaW4gdGhlIHNwZWNpZmllZCByb29tc1xuICAgICAqXG4gICAgICogQHBhcmFtIHJvb21cbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgc29ja2V0c0pvaW4ocm9vbSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb2NrZXRzLnNvY2tldHNKb2luKHJvb20pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYWtlcyB0aGUgbWF0Y2hpbmcgc29ja2V0IGluc3RhbmNlcyBsZWF2ZSB0aGUgc3BlY2lmaWVkIHJvb21zXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9vbVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBzb2NrZXRzTGVhdmUocm9vbSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb2NrZXRzLnNvY2tldHNMZWF2ZShyb29tKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWFrZXMgdGhlIG1hdGNoaW5nIHNvY2tldCBpbnN0YW5jZXMgZGlzY29ubmVjdFxuICAgICAqXG4gICAgICogQHBhcmFtIGNsb3NlIC0gd2hldGhlciB0byBjbG9zZSB0aGUgdW5kZXJseWluZyBjb25uZWN0aW9uXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGRpc2Nvbm5lY3RTb2NrZXRzKGNsb3NlID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ja2V0cy5kaXNjb25uZWN0U29ja2V0cyhjbG9zZSk7XG4gICAgfVxufVxuZXhwb3J0cy5TZXJ2ZXIgPSBTZXJ2ZXI7XG4vKipcbiAqIEV4cG9zZSBtYWluIG5hbWVzcGFjZSAoLykuXG4gKi9cbmNvbnN0IGVtaXR0ZXJNZXRob2RzID0gT2JqZWN0LmtleXMoZXZlbnRzXzEuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSkuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gdHlwZW9mIGV2ZW50c18xLkV2ZW50RW1pdHRlci5wcm90b3R5cGVba2V5XSA9PT0gXCJmdW5jdGlvblwiO1xufSk7XG5lbWl0dGVyTWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgIFNlcnZlci5wcm90b3R5cGVbZm5dID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb2NrZXRzW2ZuXS5hcHBseSh0aGlzLnNvY2tldHMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn0pO1xubW9kdWxlLmV4cG9ydHMgPSAoc3J2LCBvcHRzKSA9PiBuZXcgU2VydmVyKHNydiwgb3B0cyk7XG5tb2R1bGUuZXhwb3J0cy5TZXJ2ZXIgPSBTZXJ2ZXI7XG5tb2R1bGUuZXhwb3J0cy5OYW1lc3BhY2UgPSBuYW1lc3BhY2VfMS5OYW1lc3BhY2U7XG5tb2R1bGUuZXhwb3J0cy5Tb2NrZXQgPSBzb2NrZXRfMS5Tb2NrZXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuTmFtZXNwYWNlID0gZXhwb3J0cy5SRVNFUlZFRF9FVkVOVFMgPSB2b2lkIDA7XG5jb25zdCBzb2NrZXRfMSA9IHJlcXVpcmUoXCIuL3NvY2tldFwiKTtcbmNvbnN0IHR5cGVkX2V2ZW50c18xID0gcmVxdWlyZShcIi4vdHlwZWQtZXZlbnRzXCIpO1xuY29uc3QgZGVidWdfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZGVidWdcIikpO1xuY29uc3QgYnJvYWRjYXN0X29wZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9icm9hZGNhc3Qtb3BlcmF0b3JcIik7XG5jb25zdCBkZWJ1ZyA9ICgwLCBkZWJ1Z18xLmRlZmF1bHQpKFwic29ja2V0LmlvOm5hbWVzcGFjZVwiKTtcbmV4cG9ydHMuUkVTRVJWRURfRVZFTlRTID0gbmV3IFNldChbXCJjb25uZWN0XCIsIFwiY29ubmVjdGlvblwiLCBcIm5ld19uYW1lc3BhY2VcIl0pO1xuY2xhc3MgTmFtZXNwYWNlIGV4dGVuZHMgdHlwZWRfZXZlbnRzXzEuU3RyaWN0RXZlbnRFbWl0dGVyIHtcbiAgICAvKipcbiAgICAgKiBOYW1lc3BhY2UgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2VydmVyIGluc3RhbmNlXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzZXJ2ZXIsIG5hbWUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zb2NrZXRzID0gbmV3IE1hcCgpO1xuICAgICAgICAvKiogQHByaXZhdGUgKi9cbiAgICAgICAgdGhpcy5fZm5zID0gW107XG4gICAgICAgIC8qKiBAcHJpdmF0ZSAqL1xuICAgICAgICB0aGlzLl9pZHMgPSAwO1xuICAgICAgICB0aGlzLnNlcnZlciA9IHNlcnZlcjtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5faW5pdEFkYXB0ZXIoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGBBZGFwdGVyYCBmb3IgdGhpcyBuc3AuXG4gICAgICogUnVuIHVwb24gY2hhbmdpbmcgYWRhcHRlciBieSBgU2VydmVyI2FkYXB0ZXJgXG4gICAgICogaW4gYWRkaXRpb24gdG8gdGhlIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdEFkYXB0ZXIoKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5hZGFwdGVyID0gbmV3ICh0aGlzLnNlcnZlci5hZGFwdGVyKCkpKHRoaXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHVwIG5hbWVzcGFjZSBtaWRkbGV3YXJlLlxuICAgICAqXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHVzZShmbikge1xuICAgICAgICB0aGlzLl9mbnMucHVzaChmbik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyB0aGUgbWlkZGxld2FyZSBmb3IgYW4gaW5jb21pbmcgY2xpZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHNvY2tldCAtIHRoZSBzb2NrZXQgdGhhdCB3aWxsIGdldCBhZGRlZFxuICAgICAqIEBwYXJhbSBmbiAtIGxhc3QgZm4gY2FsbCBpbiB0aGUgbWlkZGxld2FyZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcnVuKHNvY2tldCwgZm4pIHtcbiAgICAgICAgY29uc3QgZm5zID0gdGhpcy5fZm5zLnNsaWNlKDApO1xuICAgICAgICBpZiAoIWZucy5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm4gZm4obnVsbCk7XG4gICAgICAgIGZ1bmN0aW9uIHJ1bihpKSB7XG4gICAgICAgICAgICBmbnNbaV0oc29ja2V0LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgLy8gdXBvbiBlcnJvciwgc2hvcnQtY2lyY3VpdFxuICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihlcnIpO1xuICAgICAgICAgICAgICAgIC8vIGlmIG5vIG1pZGRsZXdhcmUgbGVmdCwgc3VtbW9uIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgaWYgKCFmbnNbaSArIDFdKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4obnVsbCk7XG4gICAgICAgICAgICAgICAgLy8gZ28gb24gdG8gbmV4dFxuICAgICAgICAgICAgICAgIHJ1bihpICsgMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBydW4oMCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRhcmdldHMgYSByb29tIHdoZW4gZW1pdHRpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9vbVxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICB0byhyb29tKSB7XG4gICAgICAgIHJldHVybiBuZXcgYnJvYWRjYXN0X29wZXJhdG9yXzEuQnJvYWRjYXN0T3BlcmF0b3IodGhpcy5hZGFwdGVyKS50byhyb29tKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGFyZ2V0cyBhIHJvb20gd2hlbiBlbWl0dGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByb29tXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGluKHJvb20pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBicm9hZGNhc3Rfb3BlcmF0b3JfMS5Ccm9hZGNhc3RPcGVyYXRvcih0aGlzLmFkYXB0ZXIpLmluKHJvb20pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFeGNsdWRlcyBhIHJvb20gd2hlbiBlbWl0dGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByb29tXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGV4Y2VwdChyb29tKSB7XG4gICAgICAgIHJldHVybiBuZXcgYnJvYWRjYXN0X29wZXJhdG9yXzEuQnJvYWRjYXN0T3BlcmF0b3IodGhpcy5hZGFwdGVyKS5leGNlcHQocm9vbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBuZXcgY2xpZW50LlxuICAgICAqXG4gICAgICogQHJldHVybiB7U29ja2V0fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2FkZChjbGllbnQsIHF1ZXJ5LCBmbikge1xuICAgICAgICBkZWJ1ZyhcImFkZGluZyBzb2NrZXQgdG8gbnNwICVzXCIsIHRoaXMubmFtZSk7XG4gICAgICAgIGNvbnN0IHNvY2tldCA9IG5ldyBzb2NrZXRfMS5Tb2NrZXQodGhpcywgY2xpZW50LCBxdWVyeSk7XG4gICAgICAgIHRoaXMucnVuKHNvY2tldCwgKGVycikgPT4ge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKFwib3BlblwiID09IGNsaWVudC5jb25uLnJlYWR5U3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNsaWVudC5jb25uLnByb3RvY29sID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvY2tldC5fZXJyb3IoZXJyLmRhdGEgfHwgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvY2tldC5fZXJyb3Ioe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZXJyLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gdHJhY2sgc29ja2V0XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0cy5zZXQoc29ja2V0LmlkLCBzb2NrZXQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBpdCdzIHBhcmFtb3VudCB0aGF0IHRoZSBpbnRlcm5hbCBgb25jb25uZWN0YCBsb2dpY1xuICAgICAgICAgICAgICAgICAgICAvLyBmaXJlcyBiZWZvcmUgdXNlci1zZXQgZXZlbnRzIHRvIHByZXZlbnQgc3RhdGUgb3JkZXJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmlvbGF0aW9ucyAoc3VjaCBhcyBhIGRpc2Nvbm5lY3Rpb24gYmVmb3JlIHRoZSBjb25uZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvZ2ljIGlzIGNvbXBsZXRlKVxuICAgICAgICAgICAgICAgICAgICBzb2NrZXQuX29uY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm4pXG4gICAgICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgICAgICAvLyBmaXJlIHVzZXItc2V0IGV2ZW50c1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXRSZXNlcnZlZChcImNvbm5lY3RcIiwgc29ja2V0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0UmVzZXJ2ZWQoXCJjb25uZWN0aW9uXCIsIHNvY2tldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1ZyhcIm5leHQgY2FsbGVkIGFmdGVyIGNsaWVudCB3YXMgY2xvc2VkIC0gaWdub3Jpbmcgc29ja2V0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHNvY2tldDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIGNsaWVudC4gQ2FsbGVkIGJ5IGVhY2ggYFNvY2tldGAuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9yZW1vdmUoc29ja2V0KSB7XG4gICAgICAgIGlmICh0aGlzLnNvY2tldHMuaGFzKHNvY2tldC5pZCkpIHtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0cy5kZWxldGUoc29ja2V0LmlkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlYnVnKFwiaWdub3JpbmcgcmVtb3ZlIGZvciAlc1wiLCBzb2NrZXQuaWQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVtaXRzIHRvIGFsbCBjbGllbnRzLlxuICAgICAqXG4gICAgICogQHJldHVybiBBbHdheXMgdHJ1ZVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBlbWl0KGV2LCAuLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBuZXcgYnJvYWRjYXN0X29wZXJhdG9yXzEuQnJvYWRjYXN0T3BlcmF0b3IodGhpcy5hZGFwdGVyKS5lbWl0KGV2LCAuLi5hcmdzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2VuZHMgYSBgbWVzc2FnZWAgZXZlbnQgdG8gYWxsIGNsaWVudHMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgc2VuZCguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMuZW1pdChcIm1lc3NhZ2VcIiwgLi4uYXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZW5kcyBhIGBtZXNzYWdlYCBldmVudCB0byBhbGwgY2xpZW50cy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICB3cml0ZSguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMuZW1pdChcIm1lc3NhZ2VcIiwgLi4uYXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFbWl0IGEgcGFja2V0IHRvIG90aGVyIFNvY2tldC5JTyBzZXJ2ZXJzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXYgLSB0aGUgZXZlbnQgbmFtZVxuICAgICAqIEBwYXJhbSBhcmdzIC0gYW4gYXJyYXkgb2YgYXJndW1lbnRzLCB3aGljaCBtYXkgaW5jbHVkZSBhbiBhY2tub3dsZWRnZW1lbnQgY2FsbGJhY2sgYXQgdGhlIGVuZFxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBzZXJ2ZXJTaWRlRW1pdChldiwgLi4uYXJncykge1xuICAgICAgICBpZiAoZXhwb3J0cy5SRVNFUlZFRF9FVkVOVFMuaGFzKGV2KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcIiR7ZXZ9XCIgaXMgYSByZXNlcnZlZCBldmVudCBuYW1lYCk7XG4gICAgICAgIH1cbiAgICAgICAgYXJncy51bnNoaWZ0KGV2KTtcbiAgICAgICAgdGhpcy5hZGFwdGVyLnNlcnZlclNpZGVFbWl0KGFyZ3MpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBwYWNrZXQgaXMgcmVjZWl2ZWQgZnJvbSBhbm90aGVyIFNvY2tldC5JTyBzZXJ2ZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmdzIC0gYW4gYXJyYXkgb2YgYXJndW1lbnRzLCB3aGljaCBtYXkgaW5jbHVkZSBhbiBhY2tub3dsZWRnZW1lbnQgY2FsbGJhY2sgYXQgdGhlIGVuZFxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfb25TZXJ2ZXJTaWRlRW1pdChhcmdzKSB7XG4gICAgICAgIHN1cGVyLmVtaXRVbnR5cGVkLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbGlzdCBvZiBjbGllbnRzLlxuICAgICAqXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGFsbFNvY2tldHMoKSB7XG4gICAgICAgIHJldHVybiBuZXcgYnJvYWRjYXN0X29wZXJhdG9yXzEuQnJvYWRjYXN0T3BlcmF0b3IodGhpcy5hZGFwdGVyKS5hbGxTb2NrZXRzKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGNvbXByZXNzIGZsYWcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29tcHJlc3MgLSBpZiBgdHJ1ZWAsIGNvbXByZXNzZXMgdGhlIHNlbmRpbmcgZGF0YVxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBjb21wcmVzcyhjb21wcmVzcykge1xuICAgICAgICByZXR1cm4gbmV3IGJyb2FkY2FzdF9vcGVyYXRvcl8xLkJyb2FkY2FzdE9wZXJhdG9yKHRoaXMuYWRhcHRlcikuY29tcHJlc3MoY29tcHJlc3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgbW9kaWZpZXIgZm9yIGEgc3Vic2VxdWVudCBldmVudCBlbWlzc2lvbiB0aGF0IHRoZSBldmVudCBkYXRhIG1heSBiZSBsb3N0IGlmIHRoZSBjbGllbnQgaXMgbm90IHJlYWR5IHRvXG4gICAgICogcmVjZWl2ZSBtZXNzYWdlcyAoYmVjYXVzZSBvZiBuZXR3b3JrIHNsb3duZXNzIG9yIG90aGVyIGlzc3Vlcywgb3IgYmVjYXVzZSB0aGV54oCZcmUgY29ubmVjdGVkIHRocm91Z2ggbG9uZyBwb2xsaW5nXG4gICAgICogYW5kIGlzIGluIHRoZSBtaWRkbGUgb2YgYSByZXF1ZXN0LXJlc3BvbnNlIGN5Y2xlKS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBnZXQgdm9sYXRpbGUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgYnJvYWRjYXN0X29wZXJhdG9yXzEuQnJvYWRjYXN0T3BlcmF0b3IodGhpcy5hZGFwdGVyKS52b2xhdGlsZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBhIG1vZGlmaWVyIGZvciBhIHN1YnNlcXVlbnQgZXZlbnQgZW1pc3Npb24gdGhhdCB0aGUgZXZlbnQgZGF0YSB3aWxsIG9ubHkgYmUgYnJvYWRjYXN0IHRvIHRoZSBjdXJyZW50IG5vZGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZ2V0IGxvY2FsKCkge1xuICAgICAgICByZXR1cm4gbmV3IGJyb2FkY2FzdF9vcGVyYXRvcl8xLkJyb2FkY2FzdE9wZXJhdG9yKHRoaXMuYWRhcHRlcikubG9jYWw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG1hdGNoaW5nIHNvY2tldCBpbnN0YW5jZXNcbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBmZXRjaFNvY2tldHMoKSB7XG4gICAgICAgIHJldHVybiBuZXcgYnJvYWRjYXN0X29wZXJhdG9yXzEuQnJvYWRjYXN0T3BlcmF0b3IodGhpcy5hZGFwdGVyKS5mZXRjaFNvY2tldHMoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWFrZXMgdGhlIG1hdGNoaW5nIHNvY2tldCBpbnN0YW5jZXMgam9pbiB0aGUgc3BlY2lmaWVkIHJvb21zXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9vbVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBzb2NrZXRzSm9pbihyb29tKSB7XG4gICAgICAgIHJldHVybiBuZXcgYnJvYWRjYXN0X29wZXJhdG9yXzEuQnJvYWRjYXN0T3BlcmF0b3IodGhpcy5hZGFwdGVyKS5zb2NrZXRzSm9pbihyb29tKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWFrZXMgdGhlIG1hdGNoaW5nIHNvY2tldCBpbnN0YW5jZXMgbGVhdmUgdGhlIHNwZWNpZmllZCByb29tc1xuICAgICAqXG4gICAgICogQHBhcmFtIHJvb21cbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgc29ja2V0c0xlYXZlKHJvb20pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBicm9hZGNhc3Rfb3BlcmF0b3JfMS5Ccm9hZGNhc3RPcGVyYXRvcih0aGlzLmFkYXB0ZXIpLnNvY2tldHNMZWF2ZShyb29tKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWFrZXMgdGhlIG1hdGNoaW5nIHNvY2tldCBpbnN0YW5jZXMgZGlzY29ubmVjdFxuICAgICAqXG4gICAgICogQHBhcmFtIGNsb3NlIC0gd2hldGhlciB0byBjbG9zZSB0aGUgdW5kZXJseWluZyBjb25uZWN0aW9uXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGRpc2Nvbm5lY3RTb2NrZXRzKGNsb3NlID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBicm9hZGNhc3Rfb3BlcmF0b3JfMS5Ccm9hZGNhc3RPcGVyYXRvcih0aGlzLmFkYXB0ZXIpLmRpc2Nvbm5lY3RTb2NrZXRzKGNsb3NlKTtcbiAgICB9XG59XG5leHBvcnRzLk5hbWVzcGFjZSA9IE5hbWVzcGFjZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5QYXJlbnROYW1lc3BhY2UgPSB2b2lkIDA7XG5jb25zdCBuYW1lc3BhY2VfMSA9IHJlcXVpcmUoXCIuL25hbWVzcGFjZVwiKTtcbmNsYXNzIFBhcmVudE5hbWVzcGFjZSBleHRlbmRzIG5hbWVzcGFjZV8xLk5hbWVzcGFjZSB7XG4gICAgY29uc3RydWN0b3Ioc2VydmVyKSB7XG4gICAgICAgIHN1cGVyKHNlcnZlciwgXCIvX1wiICsgUGFyZW50TmFtZXNwYWNlLmNvdW50KyspO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gbmV3IFNldCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pbml0QWRhcHRlcigpIHtcbiAgICAgICAgY29uc3QgYnJvYWRjYXN0ID0gKHBhY2tldCwgb3B0cykgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChuc3ApID0+IHtcbiAgICAgICAgICAgICAgICBuc3AuYWRhcHRlci5icm9hZGNhc3QocGFja2V0LCBvcHRzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICAvLyBAdHMtaWdub3JlIEZJWE1FIGlzIHRoZXJlIGEgd2F5IHRvIGRlY2xhcmUgYW4gaW5uZXIgY2xhc3MgaW4gVHlwZVNjcmlwdD9cbiAgICAgICAgdGhpcy5hZGFwdGVyID0geyBicm9hZGNhc3QgfTtcbiAgICB9XG4gICAgZW1pdChldiwgLi4uYXJncykge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKG5zcCkgPT4ge1xuICAgICAgICAgICAgbnNwLmVtaXQoZXYsIC4uLmFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNyZWF0ZUNoaWxkKG5hbWUpIHtcbiAgICAgICAgY29uc3QgbmFtZXNwYWNlID0gbmV3IG5hbWVzcGFjZV8xLk5hbWVzcGFjZSh0aGlzLnNlcnZlciwgbmFtZSk7XG4gICAgICAgIG5hbWVzcGFjZS5fZm5zID0gdGhpcy5fZm5zLnNsaWNlKDApO1xuICAgICAgICB0aGlzLmxpc3RlbmVycyhcImNvbm5lY3RcIikuZm9yRWFjaCgobGlzdGVuZXIpID0+IG5hbWVzcGFjZS5vbihcImNvbm5lY3RcIiwgbGlzdGVuZXIpKTtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMoXCJjb25uZWN0aW9uXCIpLmZvckVhY2goKGxpc3RlbmVyKSA9PiBuYW1lc3BhY2Uub24oXCJjb25uZWN0aW9uXCIsIGxpc3RlbmVyKSk7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uYWRkKG5hbWVzcGFjZSk7XG4gICAgICAgIHRoaXMuc2VydmVyLl9uc3BzLnNldChuYW1lLCBuYW1lc3BhY2UpO1xuICAgICAgICByZXR1cm4gbmFtZXNwYWNlO1xuICAgIH1cbn1cbmV4cG9ydHMuUGFyZW50TmFtZXNwYWNlID0gUGFyZW50TmFtZXNwYWNlO1xuUGFyZW50TmFtZXNwYWNlLmNvdW50ID0gMDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Tb2NrZXQgPSBleHBvcnRzLlJFU0VSVkVEX0VWRU5UUyA9IHZvaWQgMDtcbmNvbnN0IHNvY2tldF9pb19wYXJzZXJfMSA9IHJlcXVpcmUoXCJzb2NrZXQuaW8tcGFyc2VyXCIpO1xuY29uc3QgZGVidWdfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZGVidWdcIikpO1xuY29uc3QgdHlwZWRfZXZlbnRzXzEgPSByZXF1aXJlKFwiLi90eXBlZC1ldmVudHNcIik7XG5jb25zdCBiYXNlNjRpZF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJiYXNlNjRpZFwiKSk7XG5jb25zdCBicm9hZGNhc3Rfb3BlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2Jyb2FkY2FzdC1vcGVyYXRvclwiKTtcbmNvbnN0IGRlYnVnID0gKDAsIGRlYnVnXzEuZGVmYXVsdCkoXCJzb2NrZXQuaW86c29ja2V0XCIpO1xuZXhwb3J0cy5SRVNFUlZFRF9FVkVOVFMgPSBuZXcgU2V0KFtcbiAgICBcImNvbm5lY3RcIixcbiAgICBcImNvbm5lY3RfZXJyb3JcIixcbiAgICBcImRpc2Nvbm5lY3RcIixcbiAgICBcImRpc2Nvbm5lY3RpbmdcIixcbiAgICBcIm5ld0xpc3RlbmVyXCIsXG4gICAgXCJyZW1vdmVMaXN0ZW5lclwiLFxuXSk7XG5jbGFzcyBTb2NrZXQgZXh0ZW5kcyB0eXBlZF9ldmVudHNfMS5TdHJpY3RFdmVudEVtaXR0ZXIge1xuICAgIC8qKlxuICAgICAqIEludGVyZmFjZSB0byBhIGBDbGllbnRgIGZvciBhIGdpdmVuIGBOYW1lc3BhY2VgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOYW1lc3BhY2V9IG5zcFxuICAgICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXV0aFxuICAgICAqIEBwYWNrYWdlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobnNwLCBjbGllbnQsIGF1dGgpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uc3AgPSBuc3A7XG4gICAgICAgIHRoaXMuY2xpZW50ID0gY2xpZW50O1xuICAgICAgICAvKipcbiAgICAgICAgICogQWRkaXRpb25hbCBpbmZvcm1hdGlvbiB0aGF0IGNhbiBiZSBhdHRhY2hlZCB0byB0aGUgU29ja2V0IGluc3RhbmNlIGFuZCB3aGljaCB3aWxsIGJlIHVzZWQgaW4gdGhlIGZldGNoU29ja2V0cyBtZXRob2RcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xuICAgICAgICB0aGlzLmNvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFja3MgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuZm5zID0gW107XG4gICAgICAgIHRoaXMuZmxhZ3MgPSB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSBuc3Auc2VydmVyO1xuICAgICAgICB0aGlzLmFkYXB0ZXIgPSB0aGlzLm5zcC5hZGFwdGVyO1xuICAgICAgICBpZiAoY2xpZW50LmNvbm4ucHJvdG9jb2wgPT09IDMpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHRoaXMuaWQgPSBuc3AubmFtZSAhPT0gXCIvXCIgPyBuc3AubmFtZSArIFwiI1wiICsgY2xpZW50LmlkIDogY2xpZW50LmlkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pZCA9IGJhc2U2NGlkXzEuZGVmYXVsdC5nZW5lcmF0ZUlkKCk7IC8vIGRvbid0IHJldXNlIHRoZSBFbmdpbmUuSU8gaWQgYmVjYXVzZSBpdCdzIHNlbnNpdGl2ZSBpbmZvcm1hdGlvblxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGFuZHNoYWtlID0gdGhpcy5idWlsZEhhbmRzaGFrZShhdXRoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQnVpbGRzIHRoZSBgaGFuZHNoYWtlYCBCQyBvYmplY3RcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgYnVpbGRIYW5kc2hha2UoYXV0aCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGVhZGVyczogdGhpcy5yZXF1ZXN0LmhlYWRlcnMsXG4gICAgICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpICsgXCJcIixcbiAgICAgICAgICAgIGFkZHJlc3M6IHRoaXMuY29ubi5yZW1vdGVBZGRyZXNzLFxuICAgICAgICAgICAgeGRvbWFpbjogISF0aGlzLnJlcXVlc3QuaGVhZGVycy5vcmlnaW4sXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBzZWN1cmU6ICEhdGhpcy5yZXF1ZXN0LmNvbm5lY3Rpb24uZW5jcnlwdGVkLFxuICAgICAgICAgICAgaXNzdWVkOiArbmV3IERhdGUoKSxcbiAgICAgICAgICAgIHVybDogdGhpcy5yZXF1ZXN0LnVybCxcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHF1ZXJ5OiB0aGlzLnJlcXVlc3QuX3F1ZXJ5LFxuICAgICAgICAgICAgYXV0aCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRW1pdHMgdG8gdGhpcyBjbGllbnQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIEFsd2F5cyByZXR1cm5zIGB0cnVlYC5cbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZW1pdChldiwgLi4uYXJncykge1xuICAgICAgICBpZiAoZXhwb3J0cy5SRVNFUlZFRF9FVkVOVFMuaGFzKGV2KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcIiR7ZXZ9XCIgaXMgYSByZXNlcnZlZCBldmVudCBuYW1lYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IFtldiwgLi4uYXJnc107XG4gICAgICAgIGNvbnN0IHBhY2tldCA9IHtcbiAgICAgICAgICAgIHR5cGU6IHNvY2tldF9pb19wYXJzZXJfMS5QYWNrZXRUeXBlLkVWRU5ULFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gYWNjZXNzIGxhc3QgYXJndW1lbnQgdG8gc2VlIGlmIGl0J3MgYW4gQUNLIGNhbGxiYWNrXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YVtkYXRhLmxlbmd0aCAtIDFdID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5uc3AuX2lkcysrO1xuICAgICAgICAgICAgZGVidWcoXCJlbWl0dGluZyBwYWNrZXQgd2l0aCBhY2sgaWQgJWRcIiwgaWQpO1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckFja0NhbGxiYWNrKGlkLCBkYXRhLnBvcCgpKTtcbiAgICAgICAgICAgIHBhY2tldC5pZCA9IGlkO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZsYWdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5mbGFncyk7XG4gICAgICAgIHRoaXMuZmxhZ3MgPSB7fTtcbiAgICAgICAgdGhpcy5wYWNrZXQocGFja2V0LCBmbGFncyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHJlZ2lzdGVyQWNrQ2FsbGJhY2soaWQsIGFjaykge1xuICAgICAgICBjb25zdCB0aW1lb3V0ID0gdGhpcy5mbGFncy50aW1lb3V0O1xuICAgICAgICBpZiAodGltZW91dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFja3Muc2V0KGlkLCBhY2spO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBkZWJ1ZyhcImV2ZW50IHdpdGggYWNrIGlkICVkIGhhcyB0aW1lZCBvdXQgYWZ0ZXIgJWQgbXNcIiwgaWQsIHRpbWVvdXQpO1xuICAgICAgICAgICAgdGhpcy5hY2tzLmRlbGV0ZShpZCk7XG4gICAgICAgICAgICBhY2suY2FsbCh0aGlzLCBuZXcgRXJyb3IoXCJvcGVyYXRpb24gaGFzIHRpbWVkIG91dFwiKSk7XG4gICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICB0aGlzLmFja3Muc2V0KGlkLCAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICAgIGFjay5hcHBseSh0aGlzLCBbbnVsbCwgLi4uYXJnc10pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGFyZ2V0cyBhIHJvb20gd2hlbiBicm9hZGNhc3RpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9vbVxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICB0byhyb29tKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5ld0Jyb2FkY2FzdE9wZXJhdG9yKCkudG8ocm9vbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRhcmdldHMgYSByb29tIHdoZW4gYnJvYWRjYXN0aW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJvb21cbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgaW4ocm9vbSkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXdCcm9hZGNhc3RPcGVyYXRvcigpLmluKHJvb20pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFeGNsdWRlcyBhIHJvb20gd2hlbiBicm9hZGNhc3RpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9vbVxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBleGNlcHQocm9vbSkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXdCcm9hZGNhc3RPcGVyYXRvcigpLmV4Y2VwdChyb29tKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2VuZHMgYSBgbWVzc2FnZWAgZXZlbnQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgc2VuZCguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMuZW1pdChcIm1lc3NhZ2VcIiwgLi4uYXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZW5kcyBhIGBtZXNzYWdlYCBldmVudC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICB3cml0ZSguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMuZW1pdChcIm1lc3NhZ2VcIiwgLi4uYXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBXcml0ZXMgYSBwYWNrZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFja2V0IC0gcGFja2V0IG9iamVjdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIC0gb3B0aW9uc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcGFja2V0KHBhY2tldCwgb3B0cyA9IHt9KSB7XG4gICAgICAgIHBhY2tldC5uc3AgPSB0aGlzLm5zcC5uYW1lO1xuICAgICAgICBvcHRzLmNvbXByZXNzID0gZmFsc2UgIT09IG9wdHMuY29tcHJlc3M7XG4gICAgICAgIHRoaXMuY2xpZW50Ll9wYWNrZXQocGFja2V0LCBvcHRzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSm9pbnMgYSByb29tLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHJvb21zIC0gcm9vbSBvciBhcnJheSBvZiByb29tc1xuICAgICAqIEByZXR1cm4gYSBQcm9taXNlIG9yIG5vdGhpbmcsIGRlcGVuZGluZyBvbiB0aGUgYWRhcHRlclxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBqb2luKHJvb21zKSB7XG4gICAgICAgIGRlYnVnKFwiam9pbiByb29tICVzXCIsIHJvb21zKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5hZGRBbGwodGhpcy5pZCwgbmV3IFNldChBcnJheS5pc0FycmF5KHJvb21zKSA/IHJvb21zIDogW3Jvb21zXSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBMZWF2ZXMgYSByb29tLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHJvb21cbiAgICAgKiBAcmV0dXJuIGEgUHJvbWlzZSBvciBub3RoaW5nLCBkZXBlbmRpbmcgb24gdGhlIGFkYXB0ZXJcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgbGVhdmUocm9vbSkge1xuICAgICAgICBkZWJ1ZyhcImxlYXZlIHJvb20gJXNcIiwgcm9vbSk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZGVsKHRoaXMuaWQsIHJvb20pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBMZWF2ZSBhbGwgcm9vbXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGxlYXZlQWxsKCkge1xuICAgICAgICB0aGlzLmFkYXB0ZXIuZGVsQWxsKHRoaXMuaWQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgYnkgYE5hbWVzcGFjZWAgdXBvbiBzdWNjZXNzZnVsXG4gICAgICogbWlkZGxld2FyZSBleGVjdXRpb24gKGllOiBhdXRob3JpemF0aW9uKS5cbiAgICAgKiBTb2NrZXQgaXMgYWRkZWQgdG8gbmFtZXNwYWNlIGFycmF5IGJlZm9yZVxuICAgICAqIGNhbGwgdG8gam9pbiwgc28gYWRhcHRlcnMgY2FuIGFjY2VzcyBpdC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX29uY29ubmVjdCgpIHtcbiAgICAgICAgZGVidWcoXCJzb2NrZXQgY29ubmVjdGVkIC0gd3JpdGluZyBwYWNrZXRcIik7XG4gICAgICAgIHRoaXMuY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5qb2luKHRoaXMuaWQpO1xuICAgICAgICBpZiAodGhpcy5jb25uLnByb3RvY29sID09PSAzKSB7XG4gICAgICAgICAgICB0aGlzLnBhY2tldCh7IHR5cGU6IHNvY2tldF9pb19wYXJzZXJfMS5QYWNrZXRUeXBlLkNPTk5FQ1QgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhY2tldCh7IHR5cGU6IHNvY2tldF9pb19wYXJzZXJfMS5QYWNrZXRUeXBlLkNPTk5FQ1QsIGRhdGE6IHsgc2lkOiB0aGlzLmlkIH0gfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdpdGggZWFjaCBwYWNrZXQuIENhbGxlZCBieSBgQ2xpZW50YC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYWNrZXRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9vbnBhY2tldChwYWNrZXQpIHtcbiAgICAgICAgZGVidWcoXCJnb3QgcGFja2V0ICVqXCIsIHBhY2tldCk7XG4gICAgICAgIHN3aXRjaCAocGFja2V0LnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2Ugc29ja2V0X2lvX3BhcnNlcl8xLlBhY2tldFR5cGUuRVZFTlQ6XG4gICAgICAgICAgICAgICAgdGhpcy5vbmV2ZW50KHBhY2tldCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHNvY2tldF9pb19wYXJzZXJfMS5QYWNrZXRUeXBlLkJJTkFSWV9FVkVOVDpcbiAgICAgICAgICAgICAgICB0aGlzLm9uZXZlbnQocGFja2V0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2Ugc29ja2V0X2lvX3BhcnNlcl8xLlBhY2tldFR5cGUuQUNLOlxuICAgICAgICAgICAgICAgIHRoaXMub25hY2socGFja2V0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2Ugc29ja2V0X2lvX3BhcnNlcl8xLlBhY2tldFR5cGUuQklOQVJZX0FDSzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uYWNrKHBhY2tldCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHNvY2tldF9pb19wYXJzZXJfMS5QYWNrZXRUeXBlLkRJU0NPTk5FQ1Q6XG4gICAgICAgICAgICAgICAgdGhpcy5vbmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2Ugc29ja2V0X2lvX3BhcnNlcl8xLlBhY2tldFR5cGUuQ09OTkVDVF9FUlJPUjpcbiAgICAgICAgICAgICAgICB0aGlzLl9vbmVycm9yKG5ldyBFcnJvcihwYWNrZXQuZGF0YSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxlZCB1cG9uIGV2ZW50IHBhY2tldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UGFja2V0fSBwYWNrZXQgLSBwYWNrZXQgb2JqZWN0XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBvbmV2ZW50KHBhY2tldCkge1xuICAgICAgICBjb25zdCBhcmdzID0gcGFja2V0LmRhdGEgfHwgW107XG4gICAgICAgIGRlYnVnKFwiZW1pdHRpbmcgZXZlbnQgJWpcIiwgYXJncyk7XG4gICAgICAgIGlmIChudWxsICE9IHBhY2tldC5pZCkge1xuICAgICAgICAgICAgZGVidWcoXCJhdHRhY2hpbmcgYWNrIGNhbGxiYWNrIHRvIGV2ZW50XCIpO1xuICAgICAgICAgICAgYXJncy5wdXNoKHRoaXMuYWNrKHBhY2tldC5pZCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9hbnlMaXN0ZW5lcnMgJiYgdGhpcy5fYW55TGlzdGVuZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fYW55TGlzdGVuZXJzLnNsaWNlKCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIGxpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzcGF0Y2goYXJncyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByb2R1Y2VzIGFuIGFjayBjYWxsYmFjayB0byBlbWl0IHdpdGggYW4gZXZlbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaWQgLSBwYWNrZXQgaWRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGFjayhpZCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IHNlbnQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHByZXZlbnQgZG91YmxlIGNhbGxiYWNrc1xuICAgICAgICAgICAgaWYgKHNlbnQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBkZWJ1ZyhcInNlbmRpbmcgYWNrICVqXCIsIGFyZ3MpO1xuICAgICAgICAgICAgc2VsZi5wYWNrZXQoe1xuICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICB0eXBlOiBzb2NrZXRfaW9fcGFyc2VyXzEuUGFja2V0VHlwZS5BQ0ssXG4gICAgICAgICAgICAgICAgZGF0YTogYXJncyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2VudCA9IHRydWU7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxlZCB1cG9uIGFjayBwYWNrZXQuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uYWNrKHBhY2tldCkge1xuICAgICAgICBjb25zdCBhY2sgPSB0aGlzLmFja3MuZ2V0KHBhY2tldC5pZCk7XG4gICAgICAgIGlmIChcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIGFjaykge1xuICAgICAgICAgICAgZGVidWcoXCJjYWxsaW5nIGFjayAlcyB3aXRoICVqXCIsIHBhY2tldC5pZCwgcGFja2V0LmRhdGEpO1xuICAgICAgICAgICAgYWNrLmFwcGx5KHRoaXMsIHBhY2tldC5kYXRhKTtcbiAgICAgICAgICAgIHRoaXMuYWNrcy5kZWxldGUocGFja2V0LmlkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlYnVnKFwiYmFkIGFjayAlc1wiLCBwYWNrZXQuaWQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxlZCB1cG9uIGNsaWVudCBkaXNjb25uZWN0IHBhY2tldC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgb25kaXNjb25uZWN0KCkge1xuICAgICAgICBkZWJ1ZyhcImdvdCBkaXNjb25uZWN0IHBhY2tldFwiKTtcbiAgICAgICAgdGhpcy5fb25jbG9zZShcImNsaWVudCBuYW1lc3BhY2UgZGlzY29ubmVjdFwiKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBhIGNsaWVudCBlcnJvci5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX29uZXJyb3IoZXJyKSB7XG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmVycyhcImVycm9yXCIpLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5lbWl0UmVzZXJ2ZWQoXCJlcnJvclwiLCBlcnIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk1pc3NpbmcgZXJyb3IgaGFuZGxlciBvbiBgc29ja2V0YC5cIik7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHVwb24gY2xvc2luZy4gQ2FsbGVkIGJ5IGBDbGllbnRgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHJlYXNvblxuICAgICAqIEB0aHJvdyB7RXJyb3J9IG9wdGlvbmFsIGVycm9yIG9iamVjdFxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfb25jbG9zZShyZWFzb24pIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbm5lY3RlZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICBkZWJ1ZyhcImNsb3Npbmcgc29ja2V0IC0gcmVhc29uICVzXCIsIHJlYXNvbik7XG4gICAgICAgIHRoaXMuZW1pdFJlc2VydmVkKFwiZGlzY29ubmVjdGluZ1wiLCByZWFzb24pO1xuICAgICAgICB0aGlzLmxlYXZlQWxsKCk7XG4gICAgICAgIHRoaXMubnNwLl9yZW1vdmUodGhpcyk7XG4gICAgICAgIHRoaXMuY2xpZW50Ll9yZW1vdmUodGhpcyk7XG4gICAgICAgIHRoaXMuY29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZW1pdFJlc2VydmVkKFwiZGlzY29ubmVjdFwiLCByZWFzb24pO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByb2R1Y2VzIGFuIGBlcnJvcmAgcGFja2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVyciAtIGVycm9yIG9iamVjdFxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZXJyb3IoZXJyKSB7XG4gICAgICAgIHRoaXMucGFja2V0KHsgdHlwZTogc29ja2V0X2lvX3BhcnNlcl8xLlBhY2tldFR5cGUuQ09OTkVDVF9FUlJPUiwgZGF0YTogZXJyIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEaXNjb25uZWN0cyB0aGlzIGNsaWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gY2xvc2UgLSBpZiBgdHJ1ZWAsIGNsb3NlcyB0aGUgdW5kZXJseWluZyBjb25uZWN0aW9uXG4gICAgICogQHJldHVybiB7U29ja2V0fSBzZWxmXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZGlzY29ubmVjdChjbG9zZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICghdGhpcy5jb25uZWN0ZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgaWYgKGNsb3NlKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudC5fZGlzY29ubmVjdCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYWNrZXQoeyB0eXBlOiBzb2NrZXRfaW9fcGFyc2VyXzEuUGFja2V0VHlwZS5ESVNDT05ORUNUIH0pO1xuICAgICAgICAgICAgdGhpcy5fb25jbG9zZShcInNlcnZlciBuYW1lc3BhY2UgZGlzY29ubmVjdFwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgY29tcHJlc3MgZmxhZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gY29tcHJlc3MgLSBpZiBgdHJ1ZWAsIGNvbXByZXNzZXMgdGhlIHNlbmRpbmcgZGF0YVxuICAgICAqIEByZXR1cm4ge1NvY2tldH0gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBjb21wcmVzcyhjb21wcmVzcykge1xuICAgICAgICB0aGlzLmZsYWdzLmNvbXByZXNzID0gY29tcHJlc3M7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgbW9kaWZpZXIgZm9yIGEgc3Vic2VxdWVudCBldmVudCBlbWlzc2lvbiB0aGF0IHRoZSBldmVudCBkYXRhIG1heSBiZSBsb3N0IGlmIHRoZSBjbGllbnQgaXMgbm90IHJlYWR5IHRvXG4gICAgICogcmVjZWl2ZSBtZXNzYWdlcyAoYmVjYXVzZSBvZiBuZXR3b3JrIHNsb3duZXNzIG9yIG90aGVyIGlzc3Vlcywgb3IgYmVjYXVzZSB0aGV54oCZcmUgY29ubmVjdGVkIHRocm91Z2ggbG9uZyBwb2xsaW5nXG4gICAgICogYW5kIGlzIGluIHRoZSBtaWRkbGUgb2YgYSByZXF1ZXN0LXJlc3BvbnNlIGN5Y2xlKS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NvY2tldH0gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBnZXQgdm9sYXRpbGUoKSB7XG4gICAgICAgIHRoaXMuZmxhZ3Mudm9sYXRpbGUgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBhIG1vZGlmaWVyIGZvciBhIHN1YnNlcXVlbnQgZXZlbnQgZW1pc3Npb24gdGhhdCB0aGUgZXZlbnQgZGF0YSB3aWxsIG9ubHkgYmUgYnJvYWRjYXN0IHRvIGV2ZXJ5IHNvY2tldHMgYnV0IHRoZVxuICAgICAqIHNlbmRlci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NvY2tldH0gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBnZXQgYnJvYWRjYXN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXdCcm9hZGNhc3RPcGVyYXRvcigpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgbW9kaWZpZXIgZm9yIGEgc3Vic2VxdWVudCBldmVudCBlbWlzc2lvbiB0aGF0IHRoZSBldmVudCBkYXRhIHdpbGwgb25seSBiZSBicm9hZGNhc3QgdG8gdGhlIGN1cnJlbnQgbm9kZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NvY2tldH0gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBnZXQgbG9jYWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5ld0Jyb2FkY2FzdE9wZXJhdG9yKCkubG9jYWw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgYSBtb2RpZmllciBmb3IgYSBzdWJzZXF1ZW50IGV2ZW50IGVtaXNzaW9uIHRoYXQgdGhlIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHdpdGggYW4gZXJyb3Igd2hlbiB0aGVcbiAgICAgKiBnaXZlbiBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCB3aXRob3V0IGFuIGFja25vd2xlZGdlbWVudCBmcm9tIHRoZSBjbGllbnQ6XG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiBzb2NrZXQudGltZW91dCg1MDAwKS5lbWl0KFwibXktZXZlbnRcIiwgKGVycikgPT4ge1xuICAgICAqICAgaWYgKGVycikge1xuICAgICAqICAgICAvLyB0aGUgY2xpZW50IGRpZCBub3QgYWNrbm93bGVkZ2UgdGhlIGV2ZW50IGluIHRoZSBnaXZlbiBkZWxheVxuICAgICAqICAgfVxuICAgICAqIH0pO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHJldHVybnMgc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICB0aW1lb3V0KHRpbWVvdXQpIHtcbiAgICAgICAgdGhpcy5mbGFncy50aW1lb3V0ID0gdGltZW91dDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERpc3BhdGNoIGluY29taW5nIGV2ZW50IHRvIHNvY2tldCBsaXN0ZW5lcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBldmVudCAtIGV2ZW50IHRoYXQgd2lsbCBnZXQgZW1pdHRlZFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZGlzcGF0Y2goZXZlbnQpIHtcbiAgICAgICAgZGVidWcoXCJkaXNwYXRjaGluZyBhbiBldmVudCAlalwiLCBldmVudCk7XG4gICAgICAgIHRoaXMucnVuKGV2ZW50LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbm5lY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICBzdXBlci5lbWl0VW50eXBlZC5hcHBseSh0aGlzLCBldmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1ZyhcImlnbm9yZSBwYWNrZXQgcmVjZWl2ZWQgYWZ0ZXIgZGlzY29ubmVjdGlvblwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdXAgc29ja2V0IG1pZGRsZXdhcmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiAtIG1pZGRsZXdhcmUgZnVuY3Rpb24gKGV2ZW50LCBuZXh0KVxuICAgICAqIEByZXR1cm4ge1NvY2tldH0gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICB1c2UoZm4pIHtcbiAgICAgICAgdGhpcy5mbnMucHVzaChmbik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyB0aGUgbWlkZGxld2FyZSBmb3IgYW4gaW5jb21pbmcgZXZlbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBldmVudCAtIGV2ZW50IHRoYXQgd2lsbCBnZXQgZW1pdHRlZFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIC0gbGFzdCBmbiBjYWxsIGluIHRoZSBtaWRkbGV3YXJlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBydW4oZXZlbnQsIGZuKSB7XG4gICAgICAgIGNvbnN0IGZucyA9IHRoaXMuZm5zLnNsaWNlKDApO1xuICAgICAgICBpZiAoIWZucy5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm4gZm4obnVsbCk7XG4gICAgICAgIGZ1bmN0aW9uIHJ1bihpKSB7XG4gICAgICAgICAgICBmbnNbaV0oZXZlbnQsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAvLyB1cG9uIGVycm9yLCBzaG9ydC1jaXJjdWl0XG4gICAgICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuKGVycik7XG4gICAgICAgICAgICAgICAgLy8gaWYgbm8gbWlkZGxld2FyZSBsZWZ0LCBzdW1tb24gY2FsbGJhY2tcbiAgICAgICAgICAgICAgICBpZiAoIWZuc1tpICsgMV0pXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihudWxsKTtcbiAgICAgICAgICAgICAgICAvLyBnbyBvbiB0byBuZXh0XG4gICAgICAgICAgICAgICAgcnVuKGkgKyAxKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJ1bigwKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgc29ja2V0IGlzIGN1cnJlbnRseSBkaXNjb25uZWN0ZWRcbiAgICAgKi9cbiAgICBnZXQgZGlzY29ubmVjdGVkKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuY29ubmVjdGVkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBIHJlZmVyZW5jZSB0byB0aGUgcmVxdWVzdCB0aGF0IG9yaWdpbmF0ZWQgdGhlIHVuZGVybHlpbmcgRW5naW5lLklPIFNvY2tldC5cbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBnZXQgcmVxdWVzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50LnJlcXVlc3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEEgcmVmZXJlbmNlIHRvIHRoZSB1bmRlcmx5aW5nIENsaWVudCB0cmFuc3BvcnQgY29ubmVjdGlvbiAoRW5naW5lLklPIFNvY2tldCBvYmplY3QpLlxuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGdldCBjb25uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnQuY29ubjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGdldCByb29tcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5zb2NrZXRSb29tcyh0aGlzLmlkKSB8fCBuZXcgU2V0KCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgZmlyZWQgd2hlbiBhbnkgZXZlbnQgaXMgZW1pdHRlZC4gVGhlIGV2ZW50IG5hbWUgaXMgcGFzc2VkIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGVcbiAgICAgKiBjYWxsYmFjay5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBsaXN0ZW5lclxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBvbkFueShsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLl9hbnlMaXN0ZW5lcnMgPSB0aGlzLl9hbnlMaXN0ZW5lcnMgfHwgW107XG4gICAgICAgIHRoaXMuX2FueUxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgZmlyZWQgd2hlbiBhbnkgZXZlbnQgaXMgZW1pdHRlZC4gVGhlIGV2ZW50IG5hbWUgaXMgcGFzc2VkIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGVcbiAgICAgKiBjYWxsYmFjay4gVGhlIGxpc3RlbmVyIGlzIGFkZGVkIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGxpc3RlbmVycyBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBsaXN0ZW5lclxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBwcmVwZW5kQW55KGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuX2FueUxpc3RlbmVycyA9IHRoaXMuX2FueUxpc3RlbmVycyB8fCBbXTtcbiAgICAgICAgdGhpcy5fYW55TGlzdGVuZXJzLnVuc2hpZnQobGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGZpcmVkIHdoZW4gYW55IGV2ZW50IGlzIGVtaXR0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXJcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgb2ZmQW55KGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5fYW55TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBpZiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2FueUxpc3RlbmVycztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyID09PSBsaXN0ZW5lcnNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fYW55TGlzdGVuZXJzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIHRoYXQgYXJlIGxpc3RlbmluZyBmb3IgYW55IGV2ZW50IHRoYXQgaXMgc3BlY2lmaWVkLiBUaGlzIGFycmF5IGNhbiBiZSBtYW5pcHVsYXRlZCxcbiAgICAgKiBlLmcuIHRvIHJlbW92ZSBsaXN0ZW5lcnMuXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgbGlzdGVuZXJzQW55KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYW55TGlzdGVuZXJzIHx8IFtdO1xuICAgIH1cbiAgICBuZXdCcm9hZGNhc3RPcGVyYXRvcigpIHtcbiAgICAgICAgY29uc3QgZmxhZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmZsYWdzKTtcbiAgICAgICAgdGhpcy5mbGFncyA9IHt9O1xuICAgICAgICByZXR1cm4gbmV3IGJyb2FkY2FzdF9vcGVyYXRvcl8xLkJyb2FkY2FzdE9wZXJhdG9yKHRoaXMuYWRhcHRlciwgbmV3IFNldCgpLCBuZXcgU2V0KFt0aGlzLmlkXSksIGZsYWdzKTtcbiAgICB9XG59XG5leHBvcnRzLlNvY2tldCA9IFNvY2tldDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TdHJpY3RFdmVudEVtaXR0ZXIgPSB2b2lkIDA7XG5jb25zdCBldmVudHNfMSA9IHJlcXVpcmUoXCJldmVudHNcIik7XG4vKipcbiAqIFN0cmljdGx5IHR5cGVkIHZlcnNpb24gb2YgYW4gYEV2ZW50RW1pdHRlcmAuIEEgYFR5cGVkRXZlbnRFbWl0dGVyYCB0YWtlcyB0eXBlXG4gKiBwYXJhbWV0ZXJzIGZvciBtYXBwaW5ncyBvZiBldmVudCBuYW1lcyB0byBldmVudCBkYXRhIHR5cGVzLCBhbmQgc3RyaWN0bHlcbiAqIHR5cGVzIG1ldGhvZCBjYWxscyB0byB0aGUgYEV2ZW50RW1pdHRlcmAgYWNjb3JkaW5nIHRvIHRoZXNlIGV2ZW50IG1hcHMuXG4gKlxuICogQHR5cGVQYXJhbSBMaXN0ZW5FdmVudHMgLSBgRXZlbnRzTWFwYCBvZiB1c2VyLWRlZmluZWQgZXZlbnRzIHRoYXQgY2FuIGJlXG4gKiBsaXN0ZW5lZCB0byB3aXRoIGBvbmAgb3IgYG9uY2VgXG4gKiBAdHlwZVBhcmFtIEVtaXRFdmVudHMgLSBgRXZlbnRzTWFwYCBvZiB1c2VyLWRlZmluZWQgZXZlbnRzIHRoYXQgY2FuIGJlXG4gKiBlbWl0dGVkIHdpdGggYGVtaXRgXG4gKiBAdHlwZVBhcmFtIFJlc2VydmVkRXZlbnRzIC0gYEV2ZW50c01hcGAgb2YgcmVzZXJ2ZWQgZXZlbnRzLCB0aGF0IGNhbiBiZVxuICogZW1pdHRlZCBieSBzb2NrZXQuaW8gd2l0aCBgZW1pdFJlc2VydmVkYCwgYW5kIGNhbiBiZSBsaXN0ZW5lZCB0byB3aXRoXG4gKiBgbGlzdGVuYC5cbiAqL1xuY2xhc3MgU3RyaWN0RXZlbnRFbWl0dGVyIGV4dGVuZHMgZXZlbnRzXzEuRXZlbnRFbWl0dGVyIHtcbiAgICAvKipcbiAgICAgKiBBZGRzIHRoZSBgbGlzdGVuZXJgIGZ1bmN0aW9uIGFzIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBgZXZgLlxuICAgICAqXG4gICAgICogQHBhcmFtIGV2IE5hbWUgb2YgdGhlIGV2ZW50XG4gICAgICogQHBhcmFtIGxpc3RlbmVyIENhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICovXG4gICAgb24oZXYsIGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5vbihldiwgbGlzdGVuZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgb25lLXRpbWUgYGxpc3RlbmVyYCBmdW5jdGlvbiBhcyBhbiBldmVudCBsaXN0ZW5lciBmb3IgYGV2YC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBldiBOYW1lIG9mIHRoZSBldmVudFxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciBDYWxsYmFjayBmdW5jdGlvblxuICAgICAqL1xuICAgIG9uY2UoZXYsIGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5vbmNlKGV2LCBsaXN0ZW5lcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVtaXRzIGFuIGV2ZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIGV2IE5hbWUgb2YgdGhlIGV2ZW50XG4gICAgICogQHBhcmFtIGFyZ3MgVmFsdWVzIHRvIHNlbmQgdG8gbGlzdGVuZXJzIG9mIHRoaXMgZXZlbnRcbiAgICAgKi9cbiAgICBlbWl0KGV2LCAuLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5lbWl0KGV2LCAuLi5hcmdzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRW1pdHMgYSByZXNlcnZlZCBldmVudC5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGBwcm90ZWN0ZWRgLCBzbyB0aGF0IG9ubHkgYSBjbGFzcyBleHRlbmRpbmdcbiAgICAgKiBgU3RyaWN0RXZlbnRFbWl0dGVyYCBjYW4gZW1pdCBpdHMgb3duIHJlc2VydmVkIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBldiBSZXNlcnZlZCBldmVudCBuYW1lXG4gICAgICogQHBhcmFtIGFyZ3MgQXJndW1lbnRzIHRvIGVtaXQgYWxvbmcgd2l0aCB0aGUgZXZlbnRcbiAgICAgKi9cbiAgICBlbWl0UmVzZXJ2ZWQoZXYsIC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmVtaXQoZXYsIC4uLmFyZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFbWl0cyBhbiBldmVudC5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGBwcm90ZWN0ZWRgLCBzbyB0aGF0IG9ubHkgYSBjbGFzcyBleHRlbmRpbmdcbiAgICAgKiBgU3RyaWN0RXZlbnRFbWl0dGVyYCBjYW4gZ2V0IGFyb3VuZCB0aGUgc3RyaWN0IHR5cGluZy4gVGhpcyBpcyB1c2VmdWwgZm9yXG4gICAgICogY2FsbGluZyBgZW1pdC5hcHBseWAsIHdoaWNoIGNhbiBiZSBjYWxsZWQgYXMgYGVtaXRVbnR5cGVkLmFwcGx5YC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBldiBFdmVudCBuYW1lXG4gICAgICogQHBhcmFtIGFyZ3MgQXJndW1lbnRzIHRvIGVtaXQgYWxvbmcgd2l0aCB0aGUgZXZlbnRcbiAgICAgKi9cbiAgICBlbWl0VW50eXBlZChldiwgLi4uYXJncykge1xuICAgICAgICByZXR1cm4gc3VwZXIuZW1pdChldiwgLi4uYXJncyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGxpc3RlbmVycyBsaXN0ZW5pbmcgdG8gYW4gZXZlbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnQgRXZlbnQgbmFtZVxuICAgICAqIEByZXR1cm5zIEFycmF5IG9mIGxpc3RlbmVycyBzdWJzY3JpYmVkIHRvIGBldmVudGBcbiAgICAgKi9cbiAgICBsaXN0ZW5lcnMoZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmxpc3RlbmVycyhldmVudCk7XG4gICAgfVxufVxuZXhwb3J0cy5TdHJpY3RFdmVudEVtaXR0ZXIgPSBTdHJpY3RFdmVudEVtaXR0ZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2VydmVGaWxlID0gZXhwb3J0cy5yZXN0b3JlQWRhcHRlciA9IGV4cG9ydHMucGF0Y2hBZGFwdGVyID0gdm9pZCAwO1xuY29uc3Qgc29ja2V0X2lvX2FkYXB0ZXJfMSA9IHJlcXVpcmUoXCJzb2NrZXQuaW8tYWRhcHRlclwiKTtcbmNvbnN0IGZzXzEgPSByZXF1aXJlKFwiZnNcIik7XG5jb25zdCBkZWJ1Z18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkZWJ1Z1wiKSk7XG5jb25zdCBkZWJ1ZyA9ICgwLCBkZWJ1Z18xLmRlZmF1bHQpKFwic29ja2V0LmlvOmFkYXB0ZXItdXdzXCIpO1xuY29uc3QgU0VQQVJBVE9SID0gXCJcXHgxZlwiOyAvLyBzZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRGVsaW1pdGVyI0FTQ0lJX2RlbGltaXRlZF90ZXh0XG5jb25zdCB7IGFkZEFsbCwgZGVsLCBicm9hZGNhc3QgfSA9IHNvY2tldF9pb19hZGFwdGVyXzEuQWRhcHRlci5wcm90b3R5cGU7XG5mdW5jdGlvbiBwYXRjaEFkYXB0ZXIoYXBwIC8qIDogVGVtcGxhdGVkQXBwICovKSB7XG4gICAgc29ja2V0X2lvX2FkYXB0ZXJfMS5BZGFwdGVyLnByb3RvdHlwZS5hZGRBbGwgPSBmdW5jdGlvbiAoaWQsIHJvb21zKSB7XG4gICAgICAgIGNvbnN0IGlzTmV3ID0gIXRoaXMuc2lkcy5oYXMoaWQpO1xuICAgICAgICBhZGRBbGwuY2FsbCh0aGlzLCBpZCwgcm9vbXMpO1xuICAgICAgICBjb25zdCBzb2NrZXQgPSB0aGlzLm5zcC5zb2NrZXRzLmdldChpZCk7XG4gICAgICAgIGlmICghc29ja2V0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNvY2tldC5jb25uLnRyYW5zcG9ydC5uYW1lID09PSBcIndlYnNvY2tldFwiKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmUodGhpcy5uc3AubmFtZSwgc29ja2V0LCBpc05ldywgcm9vbXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc05ldykge1xuICAgICAgICAgICAgc29ja2V0LmNvbm4ub24oXCJ1cGdyYWRlXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByb29tcyA9IHRoaXMuc2lkcy5nZXQoaWQpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZSh0aGlzLm5zcC5uYW1lLCBzb2NrZXQsIGlzTmV3LCByb29tcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgc29ja2V0X2lvX2FkYXB0ZXJfMS5BZGFwdGVyLnByb3RvdHlwZS5kZWwgPSBmdW5jdGlvbiAoaWQsIHJvb20pIHtcbiAgICAgICAgZGVsLmNhbGwodGhpcywgaWQsIHJvb20pO1xuICAgICAgICBjb25zdCBzb2NrZXQgPSB0aGlzLm5zcC5zb2NrZXRzLmdldChpZCk7XG4gICAgICAgIGlmIChzb2NrZXQgJiYgc29ja2V0LmNvbm4udHJhbnNwb3J0Lm5hbWUgPT09IFwid2Vic29ja2V0XCIpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb25JZCA9IHNvY2tldC5jb25uLmlkO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29uc3Qgd2Vic29ja2V0ID0gc29ja2V0LmNvbm4udHJhbnNwb3J0LnNvY2tldDtcbiAgICAgICAgICAgIGNvbnN0IHRvcGljID0gYCR7dGhpcy5uc3AubmFtZX0ke1NFUEFSQVRPUn0ke3Jvb219YDtcbiAgICAgICAgICAgIGRlYnVnKFwidW5zdWJzY3JpYmUgY29ubmVjdGlvbiAlcyBmcm9tIHRvcGljICVzXCIsIHNlc3Npb25JZCwgdG9waWMpO1xuICAgICAgICAgICAgd2Vic29ja2V0LnVuc3Vic2NyaWJlKHRvcGljKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgc29ja2V0X2lvX2FkYXB0ZXJfMS5BZGFwdGVyLnByb3RvdHlwZS5icm9hZGNhc3QgPSBmdW5jdGlvbiAocGFja2V0LCBvcHRzKSB7XG4gICAgICAgIGNvbnN0IHVzZUZhc3RQdWJsaXNoID0gb3B0cy5yb29tcy5zaXplIDw9IDEgJiYgb3B0cy5leGNlcHQuc2l6ZSA9PT0gMDtcbiAgICAgICAgaWYgKCF1c2VGYXN0UHVibGlzaCkge1xuICAgICAgICAgICAgYnJvYWRjYXN0LmNhbGwodGhpcywgcGFja2V0LCBvcHRzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmbGFncyA9IG9wdHMuZmxhZ3MgfHwge307XG4gICAgICAgIGNvbnN0IGJhc2VQYWNrZXRPcHRzID0ge1xuICAgICAgICAgICAgcHJlRW5jb2RlZDogdHJ1ZSxcbiAgICAgICAgICAgIHZvbGF0aWxlOiBmbGFncy52b2xhdGlsZSxcbiAgICAgICAgICAgIGNvbXByZXNzOiBmbGFncy5jb21wcmVzcyxcbiAgICAgICAgfTtcbiAgICAgICAgcGFja2V0Lm5zcCA9IHRoaXMubnNwLm5hbWU7XG4gICAgICAgIGNvbnN0IGVuY29kZWRQYWNrZXRzID0gdGhpcy5lbmNvZGVyLmVuY29kZShwYWNrZXQpO1xuICAgICAgICBjb25zdCB0b3BpYyA9IG9wdHMucm9vbXMuc2l6ZSA9PT0gMFxuICAgICAgICAgICAgPyB0aGlzLm5zcC5uYW1lXG4gICAgICAgICAgICA6IGAke3RoaXMubnNwLm5hbWV9JHtTRVBBUkFUT1J9JHtvcHRzLnJvb21zLmtleXMoKS5uZXh0KCkudmFsdWV9YDtcbiAgICAgICAgZGVidWcoXCJmYXN0IHB1Ymxpc2ggdG8gJXNcIiwgdG9waWMpO1xuICAgICAgICAvLyBmYXN0IHB1Ymxpc2ggZm9yIGNsaWVudHMgY29ubmVjdGVkIHdpdGggV2ViU29ja2V0XG4gICAgICAgIGVuY29kZWRQYWNrZXRzLmZvckVhY2goKGVuY29kZWRQYWNrZXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlzQmluYXJ5ID0gdHlwZW9mIGVuY29kZWRQYWNrZXQgIT09IFwic3RyaW5nXCI7XG4gICAgICAgICAgICAvLyBcIjRcIiBiZWluZyB0aGUgbWVzc2FnZSB0eXBlIGluIHRoZSBFbmdpbmUuSU8gcHJvdG9jb2wsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vc29ja2V0aW8vZW5naW5lLmlvLXByb3RvY29sXG4gICAgICAgICAgICBhcHAucHVibGlzaCh0b3BpYywgaXNCaW5hcnkgPyBlbmNvZGVkUGFja2V0IDogXCI0XCIgKyBlbmNvZGVkUGFja2V0LCBpc0JpbmFyeSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFwcGx5KG9wdHMsIChzb2NrZXQpID0+IHtcbiAgICAgICAgICAgIGlmIChzb2NrZXQuY29ubi50cmFuc3BvcnQubmFtZSAhPT0gXCJ3ZWJzb2NrZXRcIikge1xuICAgICAgICAgICAgICAgIC8vIGNsYXNzaWMgcHVibGlzaCBmb3IgY2xpZW50cyBjb25uZWN0ZWQgd2l0aCBIVFRQIGxvbmctcG9sbGluZ1xuICAgICAgICAgICAgICAgIHNvY2tldC5jbGllbnQud3JpdGVUb0VuZ2luZShlbmNvZGVkUGFja2V0cywgYmFzZVBhY2tldE9wdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xufVxuZXhwb3J0cy5wYXRjaEFkYXB0ZXIgPSBwYXRjaEFkYXB0ZXI7XG5mdW5jdGlvbiBzdWJzY3JpYmUobmFtZXNwYWNlTmFtZSwgc29ja2V0LCBpc05ldywgcm9vbXMpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3Qgc2Vzc2lvbklkID0gc29ja2V0LmNvbm4uaWQ7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHdlYnNvY2tldCA9IHNvY2tldC5jb25uLnRyYW5zcG9ydC5zb2NrZXQ7XG4gICAgaWYgKGlzTmV3KSB7XG4gICAgICAgIGRlYnVnKFwic3Vic2NyaWJlIGNvbm5lY3Rpb24gJXMgdG8gdG9waWMgJXNcIiwgc2Vzc2lvbklkLCBuYW1lc3BhY2VOYW1lKTtcbiAgICAgICAgd2Vic29ja2V0LnN1YnNjcmliZShuYW1lc3BhY2VOYW1lKTtcbiAgICB9XG4gICAgcm9vbXMuZm9yRWFjaCgocm9vbSkgPT4ge1xuICAgICAgICBjb25zdCB0b3BpYyA9IGAke25hbWVzcGFjZU5hbWV9JHtTRVBBUkFUT1J9JHtyb29tfWA7IC8vICcjJyBjYW4gYmUgdXNlZCBhcyB3aWxkY2FyZFxuICAgICAgICBkZWJ1ZyhcInN1YnNjcmliZSBjb25uZWN0aW9uICVzIHRvIHRvcGljICVzXCIsIHNlc3Npb25JZCwgdG9waWMpO1xuICAgICAgICB3ZWJzb2NrZXQuc3Vic2NyaWJlKHRvcGljKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHJlc3RvcmVBZGFwdGVyKCkge1xuICAgIHNvY2tldF9pb19hZGFwdGVyXzEuQWRhcHRlci5wcm90b3R5cGUuYWRkQWxsID0gYWRkQWxsO1xuICAgIHNvY2tldF9pb19hZGFwdGVyXzEuQWRhcHRlci5wcm90b3R5cGUuZGVsID0gZGVsO1xuICAgIHNvY2tldF9pb19hZGFwdGVyXzEuQWRhcHRlci5wcm90b3R5cGUuYnJvYWRjYXN0ID0gYnJvYWRjYXN0O1xufVxuZXhwb3J0cy5yZXN0b3JlQWRhcHRlciA9IHJlc3RvcmVBZGFwdGVyO1xuY29uc3QgdG9BcnJheUJ1ZmZlciA9IChidWZmZXIpID0+IHtcbiAgICBjb25zdCB7IGJ1ZmZlcjogYXJyYXlCdWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGggfSA9IGJ1ZmZlcjtcbiAgICByZXR1cm4gYXJyYXlCdWZmZXIuc2xpY2UoYnl0ZU9mZnNldCwgYnl0ZU9mZnNldCArIGJ5dGVMZW5ndGgpO1xufTtcbi8vIGltcG9ydGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2tvbG9kemllamN6YWstc3ovdXdlYnNvY2tldC1zZXJ2ZVxuZnVuY3Rpb24gc2VydmVGaWxlKHJlcyAvKiA6IEh0dHBSZXNwb25zZSAqLywgZmlsZXBhdGgpIHtcbiAgICBjb25zdCB7IHNpemUgfSA9ICgwLCBmc18xLnN0YXRTeW5jKShmaWxlcGF0aCk7XG4gICAgY29uc3QgcmVhZFN0cmVhbSA9ICgwLCBmc18xLmNyZWF0ZVJlYWRTdHJlYW0pKGZpbGVwYXRoKTtcbiAgICBjb25zdCBkZXN0cm95UmVhZFN0cmVhbSA9ICgpID0+ICFyZWFkU3RyZWFtLmRlc3Ryb3llZCAmJiByZWFkU3RyZWFtLmRlc3Ryb3koKTtcbiAgICBjb25zdCBvbkVycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICAgIGRlc3Ryb3lSZWFkU3RyZWFtKCk7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgIH07XG4gICAgY29uc3Qgb25EYXRhQ2h1bmsgPSAoY2h1bmspID0+IHtcbiAgICAgICAgY29uc3QgYXJyYXlCdWZmZXJDaHVuayA9IHRvQXJyYXlCdWZmZXIoY2h1bmspO1xuICAgICAgICBjb25zdCBsYXN0T2Zmc2V0ID0gcmVzLmdldFdyaXRlT2Zmc2V0KCk7XG4gICAgICAgIGNvbnN0IFtvaywgZG9uZV0gPSByZXMudHJ5RW5kKGFycmF5QnVmZmVyQ2h1bmssIHNpemUpO1xuICAgICAgICBpZiAoIWRvbmUgJiYgIW9rKSB7XG4gICAgICAgICAgICByZWFkU3RyZWFtLnBhdXNlKCk7XG4gICAgICAgICAgICByZXMub25Xcml0YWJsZSgob2Zmc2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgW29rLCBkb25lXSA9IHJlcy50cnlFbmQoYXJyYXlCdWZmZXJDaHVuay5zbGljZShvZmZzZXQgLSBsYXN0T2Zmc2V0KSwgc2l6ZSk7XG4gICAgICAgICAgICAgICAgaWYgKCFkb25lICYmIG9rKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRTdHJlYW0ucmVzdW1lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvaztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXMub25BYm9ydGVkKGRlc3Ryb3lSZWFkU3RyZWFtKTtcbiAgICByZWFkU3RyZWFtXG4gICAgICAgIC5vbihcImRhdGFcIiwgb25EYXRhQ2h1bmspXG4gICAgICAgIC5vbihcImVycm9yXCIsIG9uRXJyb3IpXG4gICAgICAgIC5vbihcImVuZFwiLCBkZXN0cm95UmVhZFN0cmVhbSk7XG59XG5leHBvcnRzLnNlcnZlRmlsZSA9IHNlcnZlRmlsZTtcbiIsImltcG9ydCBpbyBmcm9tIFwiLi9kaXN0L2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjb25zdCB7U2VydmVyLCBOYW1lc3BhY2UsIFNvY2tldH0gPSBpbztcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJ3NvY2tldC5pbyc7XG5cbmNvbnN0IHsgQVBQX0JBU0VfVVJMLCBBUFBfQ0xJRU5UX1BPUlQsIEFQUF9TRVJWRVJfUE9SVCA9ICczMDAwJyB9ID0gcHJvY2Vzcy5lbnY7XG5cbmNvbnN0IHBvcnQgPSBwYXJzZUludChBUFBfU0VSVkVSX1BPUlQsIDEwKTtcbmNvbnN0IGNsaWVudFVybCA9IGBodHRwOi8vJHtBUFBfQkFTRV9VUkx9OiR7QVBQX0NMSUVOVF9QT1JUfWA7XG5jb25zdCBodHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoKS5saXN0ZW4ocG9ydCwgJzAuMC4wLjAnKTtcbmNvbnNvbGUubG9nKGNsaWVudFVybCk7XG5jb25zdCBpbyA9IG5ldyBTZXJ2ZXIoaHR0cFNlcnZlciwge1xuICBjb3JzOiB7XG4gICAgb3JpZ2luOiBjbGllbnRVcmwsXG4gIH0sXG59KTtcbmNvbnNvbGUubG9nKGBSdW5uaW5nIHNlcnZlciBvbiBwb3J0OiR7cG9ydH1gKTtcblxuaW8ub24oJ2Nvbm5lY3Rpb24nLCAoc29ja2V0KSA9PiB7XG4gIGNvbnNvbGUubG9nKCd1c2VyIGNvbm5lY3RlZCcpO1xuICBzb2NrZXQuZW1pdCgnd2VsY29tZScsICd3ZWxjb21lIG1hbicpO1xufSk7XG4iXSwibmFtZXMiOlsiaHR0cCIsIlNlcnZlciIsInByb2Nlc3MiLCJlbnYiLCJBUFBfQkFTRV9VUkwiLCJBUFBfQ0xJRU5UX1BPUlQiLCJBUFBfU0VSVkVSX1BPUlQiLCJwb3J0IiwicGFyc2VJbnQiLCJjbGllbnRVcmwiLCJodHRwU2VydmVyIiwiY3JlYXRlU2VydmVyIiwibGlzdGVuIiwiY29uc29sZSIsImxvZyIsImlvIiwiY29ycyIsIm9yaWdpbiIsIm9uIiwic29ja2V0IiwiZW1pdCJdLCJzb3VyY2VSb290IjoiIn0=