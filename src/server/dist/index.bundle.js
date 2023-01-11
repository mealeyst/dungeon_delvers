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

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

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


var _process$env = {"TERM_PROGRAM":"iTerm.app","NODENV_SHELL":"zsh","NODE":"/Users/mobealey/.nodenv/versions/16.4.2/bin/node","NODENV_DIR":"/usr/local/bin","INIT_CWD":"/Users/mobealey/Projects/personal/dungeon_delvers","ANDROID_HOME":"/Users/mobealey/.android-sdk","SHELL":"/bin/zsh","TERM":"xterm-256color","npm_config_metrics_registry":"https://registry.npmjs.org/","TMPDIR":"/var/folders/vh/0ys0f72x7dgdy85n1ryv8vvw0000gn/T/","TERM_PROGRAM_VERSION":"3.4.18","_P9K_SSH":"0","COLOR":"1","TERM_SESSION_ID":"w0t0p0:145EDE4C-1F4D-4962-B6A1-72FCC6E5B3E8","npm_config_noproxy":"","NODENV_ROOT":"/Users/mobealey/.nodenv","NODENV_HOOK_PATH":"/Users/mobealey/.nodenv/nodenv.d:/usr/local/Cellar/nodenv/1.4.0/nodenv.d:/usr/local/etc/nodenv.d:/etc/nodenv.d:/usr/lib/nodenv/hooks","USER":"mobealey","COMMAND_MODE":"unix2003","npm_config_globalconfig":"/Users/mobealey/.npm-global/etc/npmrc","SSH_AUTH_SOCK":"/private/tmp/com.apple.launchd.5vAYFxyt2u/Listeners","__CF_USER_TEXT_ENCODING":"0x1F5:0x0:0x0","npm_execpath":"/Users/mobealey/.nodenv/versions/16.4.2/lib/node_modules/npm/bin/npm-cli.js","PAGER":"less","LSCOLORS":"Gxfxcxdxbxegedabagacad","npm_config_init.module":"/Users/mobealey/.npm-init.js","PATH":"/Users/mobealey/Projects/personal/dungeon_delvers/node_modules/.bin:/Users/mobealey/Projects/personal/node_modules/.bin:/Users/mobealey/Projects/node_modules/.bin:/Users/mobealey/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/mobealey/.nodenv/versions/16.4.2/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/Users/mobealey/Projects/personal/dungeon_delvers/node_modules/.bin:/Users/mobealey/Projects/personal/node_modules/.bin:/Users/mobealey/Projects/node_modules/.bin:/Users/mobealey/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/mobealey/.nodenv/versions/16.4.2/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/Users/mobealey/Projects/personal/dungeon_delvers/node_modules/.bin:/Users/mobealey/Projects/personal/node_modules/.bin:/Users/mobealey/Projects/node_modules/.bin:/Users/mobealey/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/usr/local/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/Users/mobealey/.nodenv/versions/16.4.2/bin:/usr/local/Cellar/nodenv/1.4.0/libexec:/Users/mobealey/.nodenv/plugins/nodenv-update/bin:/Users/mobealey/.nodenv/plugins/nodenv-build/bin:/Users/mobealey/.jenv/shims:/Users/mobealey/.composer/vendor/bin:/Users/mobealey/.flutter/flutter/bin:/usr/local/bin:.jenv/bin:/Users/mobealey/.android-sdk/cmdline-tools/tools/bin:/usr/local/Cellar/nodenv/1.3.1/libexec/nodenv:/Users/mobealey/.nodenv/shims:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Apple/usr/bin:/Users/mobealey/Library/Android/sdk/platform-tools:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/heroku:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/pip:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/lein:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/command-not-found:/Users/mobealey/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/mobealey/.antigen/bundles/romkatv/powerlevel10k","npm_package_json":"/Users/mobealey/Projects/personal/dungeon_delvers/package.json","LaunchInstanceID":"71982D5C-6283-49FE-8AEC-994198E669A8","_":"./src/server/node_modules/.bin/webpack","npm_config_userconfig":"/Users/mobealey/.npmrc","npm_config_init_module":"/Users/mobealey/.npm-init.js","__CFBundleIdentifier":"com.googlecode.iterm2","npm_command":"run-script","PWD":"/Users/mobealey/Projects/personal/dungeon_delvers","JENV_LOADED":"1","npm_lifecycle_event":"watch:server","EDITOR":"vi","npm_package_name":"dungeon_delvers","LANG":"en_US.UTF-8","ITERM_PROFILE":"Default","XPC_FLAGS":"0x0","npm_config_node_gyp":"/Users/mobealey/.nodenv/versions/16.4.2/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js","npm_package_version":"0.0.1","XPC_SERVICE_NAME":"0","COLORFGBG":"15;0","HOME":"/Users/mobealey","SHLVL":"4","LC_TERMINAL_VERSION":"3.4.18","ITERM_SESSION_ID":"w0t0p0:145EDE4C-1F4D-4962-B6A1-72FCC6E5B3E8","npm_config_cache":"/Users/mobealey/.npm","LOGNAME":"mobealey","LESS":"-R","npm_lifecycle_script":"./src/server/node_modules/.bin/webpack --config ./src/server/webpack.config.js --mode=development -w","JENV_SHELL":"zsh","LC_CTYPE":"en_US.UTF-8","NODENV_VERSION":"16.4.2","npm_config_user_agent":"npm/7.6.3 node/v16.4.2 darwin x64","LC_TERMINAL":"iTerm2","SECURITYSESSIONID":"186a7","npm_node_execpath":"/Users/mobealey/.nodenv/versions/16.4.2/bin/node","npm_config_prefix":"/Users/mobealey/.npm-global","COLORTERM":"truecolor","APP_BASE_URL":"localhost","APP_CLIENT_PORT":"8080","APP_SERVER_PORT":"3000"},
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCLGdCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxZQUFZO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFdBQVc7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFdBQVc7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixjQUFjO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsY0FBYztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxl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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFdBQVc7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLGdCQUFnQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQywwQkFBMEI7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsNEJBQTRCO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQywrQkFBK0I7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGVBQWU7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsZUFBZTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLHdCQUF3QjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EscUJBQXFCO0FBQ3JCLHdCQUF3QjtBQUN4QixxQkFBcUI7Ozs7Ozs7Ozs7OztBQ3JrQlI7QUFDYjtBQUNBLDZDQUE2QztBQUM3QztBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxpQkFBaUIsR0FBRyx1QkFBdUI7QUFDM0MsaUJBQWlCLG1CQUFPLENBQUMsb0VBQVU7QUFDbkMsdUJBQXVCLG1CQUFPLENBQUMsZ0ZBQWdCO0FBQy9DLGdDQUFnQyxtQkFBTyxDQUFDLG9CQUFPO0FBQy9DLDZCQUE2QixtQkFBTyxDQUFDLDRGQUFzQjtBQUMzRDtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxHQUFHO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjs7Ozs7Ozs7Ozs7O0FDblNKO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdE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QVM7QUFDeEIsZ0JBQWdCLFFBQVE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLFFBQVE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFVBQVU7QUFDekIsZ0JBQWdCLFFBQVE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsVUFBVTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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VUFBQ0MsTUFBRCxFQUFZO0VBQzlCTixPQUFPLENBQUNDLEdBQVIsQ0FBWSxnQkFBWjtFQUNBSyxNQUFNLENBQUNDLElBQVAsQ0FBWSxTQUFaLEVBQXVCLGFBQXZCO0FBQ0QsQ0FIRCxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvYmFzZTY0aWQvbGliL2Jhc2U2NGlkLmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2NvbXBvbmVudC1lbWl0dGVyL2luZGV4LmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2NvcnMvbGliL2luZGV4LmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL3NvY2tldC5pby1hZGFwdGVyL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvc29ja2V0LmlvLXBhcnNlci9kaXN0L2JpbmFyeS5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9zb2NrZXQuaW8tcGFyc2VyL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvc29ja2V0LmlvLXBhcnNlci9kaXN0L2lzLWJpbmFyeS5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvZXh0ZXJuYWwgY29tbW9uanMgXCJhY2NlcHRzXCIiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzL2V4dGVybmFsIGNvbW1vbmpzIFwiY29va2llXCIiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzL2V4dGVybmFsIGNvbW1vbmpzIFwiZGVidWdcIiIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvZXh0ZXJuYWwgY29tbW9uanMgXCJldmVudHNcIiIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvZXh0ZXJuYWwgY29tbW9uanMgXCJvYmplY3QtYXNzaWduXCIiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzL2V4dGVybmFsIGNvbW1vbmpzIFwidmFyeVwiIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy9leHRlcm5hbCBjb21tb25qcyBcIndzXCIiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJjcnlwdG9cIiIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImZzXCIiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJxdWVyeXN0cmluZ1wiIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwic3RyZWFtXCIiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJ1cmxcIiIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInpsaWJcIiIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8tcGFyc2VyL2J1aWxkL2Nqcy9jb21tb25zLmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2VuZ2luZS5pby1wYXJzZXIvYnVpbGQvY2pzL2RlY29kZVBhY2tldC5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8tcGFyc2VyL2J1aWxkL2Nqcy9lbmNvZGVQYWNrZXQuanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvZW5naW5lLmlvLXBhcnNlci9idWlsZC9janMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvZW5naW5lLmlvL2J1aWxkL2VuZ2luZS5pby5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8vYnVpbGQvcGFyc2VyLXYzL2luZGV4LmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2VuZ2luZS5pby9idWlsZC9wYXJzZXItdjMvdXRmOC5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8vYnVpbGQvc2VydmVyLmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2VuZ2luZS5pby9idWlsZC9zb2NrZXQuanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvZW5naW5lLmlvL2J1aWxkL3RyYW5zcG9ydC5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8vYnVpbGQvdHJhbnNwb3J0cy11d3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvZW5naW5lLmlvL2J1aWxkL3RyYW5zcG9ydHMtdXdzL3BvbGxpbmcuanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvZW5naW5lLmlvL2J1aWxkL3RyYW5zcG9ydHMtdXdzL3dlYnNvY2tldC5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8vYnVpbGQvdHJhbnNwb3J0cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8vYnVpbGQvdHJhbnNwb3J0cy9wb2xsaW5nLWpzb25wLmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2VuZ2luZS5pby9idWlsZC90cmFuc3BvcnRzL3BvbGxpbmcuanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvZW5naW5lLmlvL2J1aWxkL3RyYW5zcG9ydHMvd2Vic29ja2V0LmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL2VuZ2luZS5pby9idWlsZC91c2VydmVyLmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL3NvY2tldC5pby9kaXN0L2Jyb2FkY2FzdC1vcGVyYXRvci5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9zb2NrZXQuaW8vZGlzdC9jbGllbnQuanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvc29ja2V0LmlvL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvc29ja2V0LmlvL2Rpc3QvbmFtZXNwYWNlLmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL3NvY2tldC5pby9kaXN0L3BhcmVudC1uYW1lc3BhY2UuanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvc29ja2V0LmlvL2Rpc3Qvc29ja2V0LmpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy8uL3NyYy9zZXJ2ZXIvbm9kZV9tb2R1bGVzL3NvY2tldC5pby9kaXN0L3R5cGVkLWV2ZW50cy5qcyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL25vZGVfbW9kdWxlcy9zb2NrZXQuaW8vZGlzdC91d3MuanMiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzLy4vc3JjL3NlcnZlci9ub2RlX21vZHVsZXMvc29ja2V0LmlvL3dyYXBwZXIubWpzIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL2xpYi9zZXJ2ZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBiYXNlNjRpZCB2MC4xLjBcbiAqL1xuXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXNcbiAqL1xuXG52YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5cbi8qKlxuICogQ29uc3RydWN0b3JcbiAqL1xuXG52YXIgQmFzZTY0SWQgPSBmdW5jdGlvbigpIHsgfTtcblxuLyoqXG4gKiBHZXQgcmFuZG9tIGJ5dGVzXG4gKlxuICogVXNlcyBhIGJ1ZmZlciBpZiBhdmFpbGFibGUsIGZhbGxzIGJhY2sgdG8gY3J5cHRvLnJhbmRvbUJ5dGVzXG4gKi9cblxuQmFzZTY0SWQucHJvdG90eXBlLmdldFJhbmRvbUJ5dGVzID0gZnVuY3Rpb24oYnl0ZXMpIHtcblxuICB2YXIgQlVGRkVSX1NJWkUgPSA0MDk2XG4gIHZhciBzZWxmID0gdGhpczsgIFxuICBcbiAgYnl0ZXMgPSBieXRlcyB8fCAxMjtcblxuICBpZiAoYnl0ZXMgPiBCVUZGRVJfU0laRSkge1xuICAgIHJldHVybiBjcnlwdG8ucmFuZG9tQnl0ZXMoYnl0ZXMpO1xuICB9XG4gIFxuICB2YXIgYnl0ZXNJbkJ1ZmZlciA9IHBhcnNlSW50KEJVRkZFUl9TSVpFL2J5dGVzKTtcbiAgdmFyIHRocmVzaG9sZCA9IHBhcnNlSW50KGJ5dGVzSW5CdWZmZXIqMC44NSk7XG5cbiAgaWYgKCF0aHJlc2hvbGQpIHtcbiAgICByZXR1cm4gY3J5cHRvLnJhbmRvbUJ5dGVzKGJ5dGVzKTtcbiAgfVxuXG4gIGlmICh0aGlzLmJ5dGVzQnVmZmVySW5kZXggPT0gbnVsbCkge1xuICAgICB0aGlzLmJ5dGVzQnVmZmVySW5kZXggPSAtMTtcbiAgfVxuXG4gIGlmICh0aGlzLmJ5dGVzQnVmZmVySW5kZXggPT0gYnl0ZXNJbkJ1ZmZlcikge1xuICAgIHRoaXMuYnl0ZXNCdWZmZXIgPSBudWxsO1xuICAgIHRoaXMuYnl0ZXNCdWZmZXJJbmRleCA9IC0xO1xuICB9XG5cbiAgLy8gTm8gYnVmZmVyZWQgYnl0ZXMgYXZhaWxhYmxlIG9yIGluZGV4IGFib3ZlIHRocmVzaG9sZFxuICBpZiAodGhpcy5ieXRlc0J1ZmZlckluZGV4ID09IC0xIHx8IHRoaXMuYnl0ZXNCdWZmZXJJbmRleCA+IHRocmVzaG9sZCkge1xuICAgICBcbiAgICBpZiAoIXRoaXMuaXNHZW5lcmF0aW5nQnl0ZXMpIHtcbiAgICAgIHRoaXMuaXNHZW5lcmF0aW5nQnl0ZXMgPSB0cnVlO1xuICAgICAgY3J5cHRvLnJhbmRvbUJ5dGVzKEJVRkZFUl9TSVpFLCBmdW5jdGlvbihlcnIsIGJ5dGVzKSB7XG4gICAgICAgIHNlbGYuYnl0ZXNCdWZmZXIgPSBieXRlcztcbiAgICAgICAgc2VsZi5ieXRlc0J1ZmZlckluZGV4ID0gMDtcbiAgICAgICAgc2VsZi5pc0dlbmVyYXRpbmdCeXRlcyA9IGZhbHNlO1xuICAgICAgfSk7IFxuICAgIH1cbiAgICBcbiAgICAvLyBGYWxsIGJhY2sgdG8gc3luYyBjYWxsIHdoZW4gbm8gYnVmZmVyZWQgYnl0ZXMgYXJlIGF2YWlsYWJsZVxuICAgIGlmICh0aGlzLmJ5dGVzQnVmZmVySW5kZXggPT0gLTEpIHtcbiAgICAgIHJldHVybiBjcnlwdG8ucmFuZG9tQnl0ZXMoYnl0ZXMpO1xuICAgIH1cbiAgfVxuICBcbiAgdmFyIHJlc3VsdCA9IHRoaXMuYnl0ZXNCdWZmZXIuc2xpY2UoYnl0ZXMqdGhpcy5ieXRlc0J1ZmZlckluZGV4LCBieXRlcyoodGhpcy5ieXRlc0J1ZmZlckluZGV4KzEpKTsgXG4gIHRoaXMuYnl0ZXNCdWZmZXJJbmRleCsrOyBcbiAgXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgYmFzZTY0IGlkXG4gKlxuICogKE9yaWdpbmFsIHZlcnNpb24gZnJvbSBzb2NrZXQuaW8gPGh0dHA6Ly9zb2NrZXQuaW8+KVxuICovXG5cbkJhc2U2NElkLnByb3RvdHlwZS5nZW5lcmF0ZUlkID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcmFuZCA9IEJ1ZmZlci5hbGxvYygxNSk7IC8vIG11bHRpcGxlIG9mIDMgZm9yIGJhc2U2NFxuICBpZiAoIXJhbmQud3JpdGVJbnQzMkJFKSB7XG4gICAgcmV0dXJuIE1hdGguYWJzKE1hdGgucmFuZG9tKCkgKiBNYXRoLnJhbmRvbSgpICogRGF0ZS5ub3coKSB8IDApLnRvU3RyaW5nKClcbiAgICAgICsgTWF0aC5hYnMoTWF0aC5yYW5kb20oKSAqIE1hdGgucmFuZG9tKCkgKiBEYXRlLm5vdygpIHwgMCkudG9TdHJpbmcoKTtcbiAgfVxuICB0aGlzLnNlcXVlbmNlTnVtYmVyID0gKHRoaXMuc2VxdWVuY2VOdW1iZXIgKyAxKSB8IDA7XG4gIHJhbmQud3JpdGVJbnQzMkJFKHRoaXMuc2VxdWVuY2VOdW1iZXIsIDExKTtcbiAgaWYgKGNyeXB0by5yYW5kb21CeXRlcykge1xuICAgIHRoaXMuZ2V0UmFuZG9tQnl0ZXMoMTIpLmNvcHkocmFuZCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gbm90IHNlY3VyZSBmb3Igbm9kZSAwLjRcbiAgICBbMCwgNCwgOF0uZm9yRWFjaChmdW5jdGlvbihpKSB7XG4gICAgICByYW5kLndyaXRlSW50MzJCRShNYXRoLnJhbmRvbSgpICogTWF0aC5wb3coMiwgMzIpIHwgMCwgaSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHJhbmQudG9TdHJpbmcoJ2Jhc2U2NCcpLnJlcGxhY2UoL1xcLy9nLCAnXycpLnJlcGxhY2UoL1xcKy9nLCAnLScpO1xufTtcblxuLyoqXG4gKiBFeHBvcnRcbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBuZXcgQmFzZTY0SWQoKTtcbiIsIlxyXG4vKipcclxuICogRXhwb3NlIGBFbWl0dGVyYC5cclxuICovXHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICBtb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cclxuICpcclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xyXG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcclxuICogQHJldHVybiB7T2JqZWN0fVxyXG4gKiBAYXBpIHByaXZhdGVcclxuICovXHJcblxyXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcclxuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcclxuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcclxuICB9XHJcbiAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuLyoqXHJcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cclxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG4gICh0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXSlcclxuICAgIC5wdXNoKGZuKTtcclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcclxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgZnVuY3Rpb24gb24oKSB7XHJcbiAgICB0aGlzLm9mZihldmVudCwgb24pO1xyXG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB9XHJcblxyXG4gIG9uLmZuID0gZm47XHJcbiAgdGhpcy5vbihldmVudCwgb24pO1xyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXHJcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuXHJcbiAgLy8gYWxsXHJcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHNwZWNpZmljIGV2ZW50XHJcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XHJcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xyXG5cclxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXHJcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXHJcbiAgdmFyIGNiO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcclxuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XHJcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gUmVtb3ZlIGV2ZW50IHNwZWNpZmljIGFycmF5cyBmb3IgZXZlbnQgdHlwZXMgdGhhdCBub1xyXG4gIC8vIG9uZSBpcyBzdWJzY3JpYmVkIGZvciB0byBhdm9pZCBtZW1vcnkgbGVhay5cclxuICBpZiAoY2FsbGJhY2tzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG5cclxuICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSlcclxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xyXG4gIH1cclxuXHJcbiAgaWYgKGNhbGxiYWNrcykge1xyXG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHJldHVybiB7QXJyYXl9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcclxufTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbiAgdmFyIHZhcnkgPSByZXF1aXJlKCd2YXJ5Jyk7XG5cbiAgdmFyIGRlZmF1bHRzID0ge1xuICAgIG9yaWdpbjogJyonLFxuICAgIG1ldGhvZHM6ICdHRVQsSEVBRCxQVVQsUEFUQ0gsUE9TVCxERUxFVEUnLFxuICAgIHByZWZsaWdodENvbnRpbnVlOiBmYWxzZSxcbiAgICBvcHRpb25zU3VjY2Vzc1N0YXR1czogMjA0XG4gIH07XG5cbiAgZnVuY3Rpb24gaXNTdHJpbmcocykge1xuICAgIHJldHVybiB0eXBlb2YgcyA9PT0gJ3N0cmluZycgfHwgcyBpbnN0YW5jZW9mIFN0cmluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzT3JpZ2luQWxsb3dlZChvcmlnaW4sIGFsbG93ZWRPcmlnaW4pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhbGxvd2VkT3JpZ2luKSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxvd2VkT3JpZ2luLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmIChpc09yaWdpbkFsbG93ZWQob3JpZ2luLCBhbGxvd2VkT3JpZ2luW2ldKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChpc1N0cmluZyhhbGxvd2VkT3JpZ2luKSkge1xuICAgICAgcmV0dXJuIG9yaWdpbiA9PT0gYWxsb3dlZE9yaWdpbjtcbiAgICB9IGVsc2UgaWYgKGFsbG93ZWRPcmlnaW4gaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgIHJldHVybiBhbGxvd2VkT3JpZ2luLnRlc3Qob3JpZ2luKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICEhYWxsb3dlZE9yaWdpbjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjb25maWd1cmVPcmlnaW4ob3B0aW9ucywgcmVxKSB7XG4gICAgdmFyIHJlcXVlc3RPcmlnaW4gPSByZXEuaGVhZGVycy5vcmlnaW4sXG4gICAgICBoZWFkZXJzID0gW10sXG4gICAgICBpc0FsbG93ZWQ7XG5cbiAgICBpZiAoIW9wdGlvbnMub3JpZ2luIHx8IG9wdGlvbnMub3JpZ2luID09PSAnKicpIHtcbiAgICAgIC8vIGFsbG93IGFueSBvcmlnaW5cbiAgICAgIGhlYWRlcnMucHVzaChbe1xuICAgICAgICBrZXk6ICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLFxuICAgICAgICB2YWx1ZTogJyonXG4gICAgICB9XSk7XG4gICAgfSBlbHNlIGlmIChpc1N0cmluZyhvcHRpb25zLm9yaWdpbikpIHtcbiAgICAgIC8vIGZpeGVkIG9yaWdpblxuICAgICAgaGVhZGVycy5wdXNoKFt7XG4gICAgICAgIGtleTogJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsXG4gICAgICAgIHZhbHVlOiBvcHRpb25zLm9yaWdpblxuICAgICAgfV0pO1xuICAgICAgaGVhZGVycy5wdXNoKFt7XG4gICAgICAgIGtleTogJ1ZhcnknLFxuICAgICAgICB2YWx1ZTogJ09yaWdpbidcbiAgICAgIH1dKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXNBbGxvd2VkID0gaXNPcmlnaW5BbGxvd2VkKHJlcXVlc3RPcmlnaW4sIG9wdGlvbnMub3JpZ2luKTtcbiAgICAgIC8vIHJlZmxlY3Qgb3JpZ2luXG4gICAgICBoZWFkZXJzLnB1c2goW3tcbiAgICAgICAga2V5OiAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJyxcbiAgICAgICAgdmFsdWU6IGlzQWxsb3dlZCA/IHJlcXVlc3RPcmlnaW4gOiBmYWxzZVxuICAgICAgfV0pO1xuICAgICAgaGVhZGVycy5wdXNoKFt7XG4gICAgICAgIGtleTogJ1ZhcnknLFxuICAgICAgICB2YWx1ZTogJ09yaWdpbidcbiAgICAgIH1dKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGVhZGVycztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbmZpZ3VyZU1ldGhvZHMob3B0aW9ucykge1xuICAgIHZhciBtZXRob2RzID0gb3B0aW9ucy5tZXRob2RzO1xuICAgIGlmIChtZXRob2RzLmpvaW4pIHtcbiAgICAgIG1ldGhvZHMgPSBvcHRpb25zLm1ldGhvZHMuam9pbignLCcpOyAvLyAubWV0aG9kcyBpcyBhbiBhcnJheSwgc28gdHVybiBpdCBpbnRvIGEgc3RyaW5nXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBrZXk6ICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJyxcbiAgICAgIHZhbHVlOiBtZXRob2RzXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbmZpZ3VyZUNyZWRlbnRpYWxzKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5jcmVkZW50aWFscyA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHMnLFxuICAgICAgICB2YWx1ZTogJ3RydWUnXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbmZpZ3VyZUFsbG93ZWRIZWFkZXJzKG9wdGlvbnMsIHJlcSkge1xuICAgIHZhciBhbGxvd2VkSGVhZGVycyA9IG9wdGlvbnMuYWxsb3dlZEhlYWRlcnMgfHwgb3B0aW9ucy5oZWFkZXJzO1xuICAgIHZhciBoZWFkZXJzID0gW107XG5cbiAgICBpZiAoIWFsbG93ZWRIZWFkZXJzKSB7XG4gICAgICBhbGxvd2VkSGVhZGVycyA9IHJlcS5oZWFkZXJzWydhY2Nlc3MtY29udHJvbC1yZXF1ZXN0LWhlYWRlcnMnXTsgLy8gLmhlYWRlcnMgd2Fzbid0IHNwZWNpZmllZCwgc28gcmVmbGVjdCB0aGUgcmVxdWVzdCBoZWFkZXJzXG4gICAgICBoZWFkZXJzLnB1c2goW3tcbiAgICAgICAga2V5OiAnVmFyeScsXG4gICAgICAgIHZhbHVlOiAnQWNjZXNzLUNvbnRyb2wtUmVxdWVzdC1IZWFkZXJzJ1xuICAgICAgfV0pO1xuICAgIH0gZWxzZSBpZiAoYWxsb3dlZEhlYWRlcnMuam9pbikge1xuICAgICAgYWxsb3dlZEhlYWRlcnMgPSBhbGxvd2VkSGVhZGVycy5qb2luKCcsJyk7IC8vIC5oZWFkZXJzIGlzIGFuIGFycmF5LCBzbyB0dXJuIGl0IGludG8gYSBzdHJpbmdcbiAgICB9XG4gICAgaWYgKGFsbG93ZWRIZWFkZXJzICYmIGFsbG93ZWRIZWFkZXJzLmxlbmd0aCkge1xuICAgICAgaGVhZGVycy5wdXNoKFt7XG4gICAgICAgIGtleTogJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLFxuICAgICAgICB2YWx1ZTogYWxsb3dlZEhlYWRlcnNcbiAgICAgIH1dKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGVhZGVycztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbmZpZ3VyZUV4cG9zZWRIZWFkZXJzKG9wdGlvbnMpIHtcbiAgICB2YXIgaGVhZGVycyA9IG9wdGlvbnMuZXhwb3NlZEhlYWRlcnM7XG4gICAgaWYgKCFoZWFkZXJzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKGhlYWRlcnMuam9pbikge1xuICAgICAgaGVhZGVycyA9IGhlYWRlcnMuam9pbignLCcpOyAvLyAuaGVhZGVycyBpcyBhbiBhcnJheSwgc28gdHVybiBpdCBpbnRvIGEgc3RyaW5nXG4gICAgfVxuICAgIGlmIChoZWFkZXJzICYmIGhlYWRlcnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBrZXk6ICdBY2Nlc3MtQ29udHJvbC1FeHBvc2UtSGVhZGVycycsXG4gICAgICAgIHZhbHVlOiBoZWFkZXJzXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbmZpZ3VyZU1heEFnZShvcHRpb25zKSB7XG4gICAgdmFyIG1heEFnZSA9ICh0eXBlb2Ygb3B0aW9ucy5tYXhBZ2UgPT09ICdudW1iZXInIHx8IG9wdGlvbnMubWF4QWdlKSAmJiBvcHRpb25zLm1heEFnZS50b1N0cmluZygpXG4gICAgaWYgKG1heEFnZSAmJiBtYXhBZ2UubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBrZXk6ICdBY2Nlc3MtQ29udHJvbC1NYXgtQWdlJyxcbiAgICAgICAgdmFsdWU6IG1heEFnZVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBhcHBseUhlYWRlcnMoaGVhZGVycywgcmVzKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBoZWFkZXJzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgdmFyIGhlYWRlciA9IGhlYWRlcnNbaV07XG4gICAgICBpZiAoaGVhZGVyKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcikpIHtcbiAgICAgICAgICBhcHBseUhlYWRlcnMoaGVhZGVyLCByZXMpO1xuICAgICAgICB9IGVsc2UgaWYgKGhlYWRlci5rZXkgPT09ICdWYXJ5JyAmJiBoZWFkZXIudmFsdWUpIHtcbiAgICAgICAgICB2YXJ5KHJlcywgaGVhZGVyLnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChoZWFkZXIudmFsdWUpIHtcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKGhlYWRlci5rZXksIGhlYWRlci52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjb3JzKG9wdGlvbnMsIHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGhlYWRlcnMgPSBbXSxcbiAgICAgIG1ldGhvZCA9IHJlcS5tZXRob2QgJiYgcmVxLm1ldGhvZC50b1VwcGVyQ2FzZSAmJiByZXEubWV0aG9kLnRvVXBwZXJDYXNlKCk7XG5cbiAgICBpZiAobWV0aG9kID09PSAnT1BUSU9OUycpIHtcbiAgICAgIC8vIHByZWZsaWdodFxuICAgICAgaGVhZGVycy5wdXNoKGNvbmZpZ3VyZU9yaWdpbihvcHRpb25zLCByZXEpKTtcbiAgICAgIGhlYWRlcnMucHVzaChjb25maWd1cmVDcmVkZW50aWFscyhvcHRpb25zLCByZXEpKTtcbiAgICAgIGhlYWRlcnMucHVzaChjb25maWd1cmVNZXRob2RzKG9wdGlvbnMsIHJlcSkpO1xuICAgICAgaGVhZGVycy5wdXNoKGNvbmZpZ3VyZUFsbG93ZWRIZWFkZXJzKG9wdGlvbnMsIHJlcSkpO1xuICAgICAgaGVhZGVycy5wdXNoKGNvbmZpZ3VyZU1heEFnZShvcHRpb25zLCByZXEpKTtcbiAgICAgIGhlYWRlcnMucHVzaChjb25maWd1cmVFeHBvc2VkSGVhZGVycyhvcHRpb25zLCByZXEpKTtcbiAgICAgIGFwcGx5SGVhZGVycyhoZWFkZXJzLCByZXMpO1xuXG4gICAgICBpZiAob3B0aW9ucy5wcmVmbGlnaHRDb250aW51ZSkge1xuICAgICAgICBuZXh0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTYWZhcmkgKGFuZCBwb3RlbnRpYWxseSBvdGhlciBicm93c2VycykgbmVlZCBjb250ZW50LWxlbmd0aCAwLFxuICAgICAgICAvLyAgIGZvciAyMDQgb3IgdGhleSBqdXN0IGhhbmcgd2FpdGluZyBmb3IgYSBib2R5XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gb3B0aW9ucy5vcHRpb25zU3VjY2Vzc1N0YXR1cztcbiAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCAnMCcpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGFjdHVhbCByZXNwb25zZVxuICAgICAgaGVhZGVycy5wdXNoKGNvbmZpZ3VyZU9yaWdpbihvcHRpb25zLCByZXEpKTtcbiAgICAgIGhlYWRlcnMucHVzaChjb25maWd1cmVDcmVkZW50aWFscyhvcHRpb25zLCByZXEpKTtcbiAgICAgIGhlYWRlcnMucHVzaChjb25maWd1cmVFeHBvc2VkSGVhZGVycyhvcHRpb25zLCByZXEpKTtcbiAgICAgIGFwcGx5SGVhZGVycyhoZWFkZXJzLCByZXMpO1xuICAgICAgbmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1pZGRsZXdhcmVXcmFwcGVyKG8pIHtcbiAgICAvLyBpZiBvcHRpb25zIGFyZSBzdGF0aWMgKGVpdGhlciB2aWEgZGVmYXVsdHMgb3IgY3VzdG9tIG9wdGlvbnMgcGFzc2VkIGluKSwgd3JhcCBpbiBhIGZ1bmN0aW9uXG4gICAgdmFyIG9wdGlvbnNDYWxsYmFjayA9IG51bGw7XG4gICAgaWYgKHR5cGVvZiBvID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvcHRpb25zQ2FsbGJhY2sgPSBvO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zQ2FsbGJhY2sgPSBmdW5jdGlvbiAocmVxLCBjYikge1xuICAgICAgICBjYihudWxsLCBvKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGNvcnNNaWRkbGV3YXJlKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgICBvcHRpb25zQ2FsbGJhY2socmVxLCBmdW5jdGlvbiAoZXJyLCBvcHRpb25zKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBuZXh0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGNvcnNPcHRpb25zID0gYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICAgICAgdmFyIG9yaWdpbkNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgICBpZiAoY29yc09wdGlvbnMub3JpZ2luICYmIHR5cGVvZiBjb3JzT3B0aW9ucy5vcmlnaW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG9yaWdpbkNhbGxiYWNrID0gY29yc09wdGlvbnMub3JpZ2luO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY29yc09wdGlvbnMub3JpZ2luKSB7XG4gICAgICAgICAgICBvcmlnaW5DYWxsYmFjayA9IGZ1bmN0aW9uIChvcmlnaW4sIGNiKSB7XG4gICAgICAgICAgICAgIGNiKG51bGwsIGNvcnNPcHRpb25zLm9yaWdpbik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChvcmlnaW5DYWxsYmFjaykge1xuICAgICAgICAgICAgb3JpZ2luQ2FsbGJhY2socmVxLmhlYWRlcnMub3JpZ2luLCBmdW5jdGlvbiAoZXJyMiwgb3JpZ2luKSB7XG4gICAgICAgICAgICAgIGlmIChlcnIyIHx8ICFvcmlnaW4pIHtcbiAgICAgICAgICAgICAgICBuZXh0KGVycjIpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvcnNPcHRpb25zLm9yaWdpbiA9IG9yaWdpbjtcbiAgICAgICAgICAgICAgICBjb3JzKGNvcnNPcHRpb25zLCByZXEsIHJlcywgbmV4dCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG5cbiAgLy8gY2FuIHBhc3MgZWl0aGVyIGFuIG9wdGlvbnMgaGFzaCwgYW4gb3B0aW9ucyBkZWxlZ2F0ZSwgb3Igbm90aGluZ1xuICBtb2R1bGUuZXhwb3J0cyA9IG1pZGRsZXdhcmVXcmFwcGVyO1xuXG59KCkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFkYXB0ZXIgPSB2b2lkIDA7XG5jb25zdCBldmVudHNfMSA9IHJlcXVpcmUoXCJldmVudHNcIik7XG5jbGFzcyBBZGFwdGVyIGV4dGVuZHMgZXZlbnRzXzEuRXZlbnRFbWl0dGVyIHtcbiAgICAvKipcbiAgICAgKiBJbi1tZW1vcnkgYWRhcHRlciBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TmFtZXNwYWNlfSBuc3BcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihuc3ApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uc3AgPSBuc3A7XG4gICAgICAgIHRoaXMucm9vbXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuc2lkcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5lbmNvZGVyID0gbnNwLnNlcnZlci5lbmNvZGVyO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUbyBiZSBvdmVycmlkZGVuXG4gICAgICovXG4gICAgaW5pdCgpIHsgfVxuICAgIC8qKlxuICAgICAqIFRvIGJlIG92ZXJyaWRkZW5cbiAgICAgKi9cbiAgICBjbG9zZSgpIHsgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBzb2NrZXQgdG8gYSBsaXN0IG9mIHJvb20uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1NvY2tldElkfSAgaWQgICAgICB0aGUgc29ja2V0IGlkXG4gICAgICogQHBhcmFtIHtTZXQ8Um9vbT59IHJvb21zICAgYSBzZXQgb2Ygcm9vbXNcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgYWRkQWxsKGlkLCByb29tcykge1xuICAgICAgICBpZiAoIXRoaXMuc2lkcy5oYXMoaWQpKSB7XG4gICAgICAgICAgICB0aGlzLnNpZHMuc2V0KGlkLCBuZXcgU2V0KCkpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qgcm9vbSBvZiByb29tcykge1xuICAgICAgICAgICAgdGhpcy5zaWRzLmdldChpZCkuYWRkKHJvb20pO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnJvb21zLmhhcyhyb29tKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucm9vbXMuc2V0KHJvb20sIG5ldyBTZXQoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwiY3JlYXRlLXJvb21cIiwgcm9vbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMucm9vbXMuZ2V0KHJvb20pLmhhcyhpZCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb21zLmdldChyb29tKS5hZGQoaWQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcImpvaW4tcm9vbVwiLCByb29tLCBpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIHNvY2tldCBmcm9tIGEgcm9vbS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U29ja2V0SWR9IGlkICAgICB0aGUgc29ja2V0IGlkXG4gICAgICogQHBhcmFtIHtSb29tfSAgICAgcm9vbSAgIHRoZSByb29tIG5hbWVcbiAgICAgKi9cbiAgICBkZWwoaWQsIHJvb20pIHtcbiAgICAgICAgaWYgKHRoaXMuc2lkcy5oYXMoaWQpKSB7XG4gICAgICAgICAgICB0aGlzLnNpZHMuZ2V0KGlkKS5kZWxldGUocm9vbSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGVsKHJvb20sIGlkKTtcbiAgICB9XG4gICAgX2RlbChyb29tLCBpZCkge1xuICAgICAgICBjb25zdCBfcm9vbSA9IHRoaXMucm9vbXMuZ2V0KHJvb20pO1xuICAgICAgICBpZiAoX3Jvb20gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgZGVsZXRlZCA9IF9yb29tLmRlbGV0ZShpZCk7XG4gICAgICAgICAgICBpZiAoZGVsZXRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcImxlYXZlLXJvb21cIiwgcm9vbSwgaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF9yb29tLnNpemUgPT09IDAgJiYgdGhpcy5yb29tcy5kZWxldGUocm9vbSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJkZWxldGUtcm9vbVwiLCByb29tKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgc29ja2V0IGZyb20gYWxsIHJvb21zIGl0J3Mgam9pbmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTb2NrZXRJZH0gaWQgICB0aGUgc29ja2V0IGlkXG4gICAgICovXG4gICAgZGVsQWxsKGlkKSB7XG4gICAgICAgIGlmICghdGhpcy5zaWRzLmhhcyhpZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHJvb20gb2YgdGhpcy5zaWRzLmdldChpZCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlbChyb29tLCBpZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaWRzLmRlbGV0ZShpZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEJyb2FkY2FzdHMgYSBwYWNrZXQuXG4gICAgICpcbiAgICAgKiBPcHRpb25zOlxuICAgICAqICAtIGBmbGFnc2Age09iamVjdH0gZmxhZ3MgZm9yIHRoaXMgcGFja2V0XG4gICAgICogIC0gYGV4Y2VwdGAge0FycmF5fSBzaWRzIHRoYXQgc2hvdWxkIGJlIGV4Y2x1ZGVkXG4gICAgICogIC0gYHJvb21zYCB7QXJyYXl9IGxpc3Qgb2Ygcm9vbXMgdG8gYnJvYWRjYXN0IHRvXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFja2V0ICAgdGhlIHBhY2tldCBvYmplY3RcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0cyAgICAgdGhlIG9wdGlvbnNcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgYnJvYWRjYXN0KHBhY2tldCwgb3B0cykge1xuICAgICAgICBjb25zdCBmbGFncyA9IG9wdHMuZmxhZ3MgfHwge307XG4gICAgICAgIGNvbnN0IHBhY2tldE9wdHMgPSB7XG4gICAgICAgICAgICBwcmVFbmNvZGVkOiB0cnVlLFxuICAgICAgICAgICAgdm9sYXRpbGU6IGZsYWdzLnZvbGF0aWxlLFxuICAgICAgICAgICAgY29tcHJlc3M6IGZsYWdzLmNvbXByZXNzXG4gICAgICAgIH07XG4gICAgICAgIHBhY2tldC5uc3AgPSB0aGlzLm5zcC5uYW1lO1xuICAgICAgICBjb25zdCBlbmNvZGVkUGFja2V0cyA9IHRoaXMuZW5jb2Rlci5lbmNvZGUocGFja2V0KTtcbiAgICAgICAgdGhpcy5hcHBseShvcHRzLCBzb2NrZXQgPT4ge1xuICAgICAgICAgICAgc29ja2V0LmNsaWVudC53cml0ZVRvRW5naW5lKGVuY29kZWRQYWNrZXRzLCBwYWNrZXRPcHRzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgYSBsaXN0IG9mIHNvY2tldHMgYnkgc2lkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTZXQ8Um9vbT59IHJvb21zICAgdGhlIGV4cGxpY2l0IHNldCBvZiByb29tcyB0byBjaGVjay5cbiAgICAgKi9cbiAgICBzb2NrZXRzKHJvb21zKSB7XG4gICAgICAgIGNvbnN0IHNpZHMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMuYXBwbHkoeyByb29tcyB9LCBzb2NrZXQgPT4ge1xuICAgICAgICAgICAgc2lkcy5hZGQoc29ja2V0LmlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoc2lkcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGxpc3Qgb2Ygcm9vbXMgYSBnaXZlbiBzb2NrZXQgaGFzIGpvaW5lZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U29ja2V0SWR9IGlkICAgdGhlIHNvY2tldCBpZFxuICAgICAqL1xuICAgIHNvY2tldFJvb21zKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpZHMuZ2V0KGlkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbWF0Y2hpbmcgc29ja2V0IGluc3RhbmNlc1xuICAgICAqXG4gICAgICogQHBhcmFtIG9wdHMgLSB0aGUgZmlsdGVycyB0byBhcHBseVxuICAgICAqL1xuICAgIGZldGNoU29ja2V0cyhvcHRzKSB7XG4gICAgICAgIGNvbnN0IHNvY2tldHMgPSBbXTtcbiAgICAgICAgdGhpcy5hcHBseShvcHRzLCBzb2NrZXQgPT4ge1xuICAgICAgICAgICAgc29ja2V0cy5wdXNoKHNvY2tldCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHNvY2tldHMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYWtlcyB0aGUgbWF0Y2hpbmcgc29ja2V0IGluc3RhbmNlcyBqb2luIHRoZSBzcGVjaWZpZWQgcm9vbXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRzIC0gdGhlIGZpbHRlcnMgdG8gYXBwbHlcbiAgICAgKiBAcGFyYW0gcm9vbXMgLSB0aGUgcm9vbXMgdG8gam9pblxuICAgICAqL1xuICAgIGFkZFNvY2tldHMob3B0cywgcm9vbXMpIHtcbiAgICAgICAgdGhpcy5hcHBseShvcHRzLCBzb2NrZXQgPT4ge1xuICAgICAgICAgICAgc29ja2V0LmpvaW4ocm9vbXMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWFrZXMgdGhlIG1hdGNoaW5nIHNvY2tldCBpbnN0YW5jZXMgbGVhdmUgdGhlIHNwZWNpZmllZCByb29tc1xuICAgICAqXG4gICAgICogQHBhcmFtIG9wdHMgLSB0aGUgZmlsdGVycyB0byBhcHBseVxuICAgICAqIEBwYXJhbSByb29tcyAtIHRoZSByb29tcyB0byBsZWF2ZVxuICAgICAqL1xuICAgIGRlbFNvY2tldHMob3B0cywgcm9vbXMpIHtcbiAgICAgICAgdGhpcy5hcHBseShvcHRzLCBzb2NrZXQgPT4ge1xuICAgICAgICAgICAgcm9vbXMuZm9yRWFjaChyb29tID0+IHNvY2tldC5sZWF2ZShyb29tKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYWtlcyB0aGUgbWF0Y2hpbmcgc29ja2V0IGluc3RhbmNlcyBkaXNjb25uZWN0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0cyAtIHRoZSBmaWx0ZXJzIHRvIGFwcGx5XG4gICAgICogQHBhcmFtIGNsb3NlIC0gd2hldGhlciB0byBjbG9zZSB0aGUgdW5kZXJseWluZyBjb25uZWN0aW9uXG4gICAgICovXG4gICAgZGlzY29ubmVjdFNvY2tldHMob3B0cywgY2xvc2UpIHtcbiAgICAgICAgdGhpcy5hcHBseShvcHRzLCBzb2NrZXQgPT4ge1xuICAgICAgICAgICAgc29ja2V0LmRpc2Nvbm5lY3QoY2xvc2UpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYXBwbHkob3B0cywgY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3Qgcm9vbXMgPSBvcHRzLnJvb21zO1xuICAgICAgICBjb25zdCBleGNlcHQgPSB0aGlzLmNvbXB1dGVFeGNlcHRTaWRzKG9wdHMuZXhjZXB0KTtcbiAgICAgICAgaWYgKHJvb21zLnNpemUpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgcm9vbSBvZiByb29tcykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5yb29tcy5oYXMocm9vbSkpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaWQgb2YgdGhpcy5yb29tcy5nZXQocm9vbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkcy5oYXMoaWQpIHx8IGV4Y2VwdC5oYXMoaWQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvY2tldCA9IHRoaXMubnNwLnNvY2tldHMuZ2V0KGlkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvY2tldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soc29ja2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkcy5hZGQoaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChjb25zdCBbaWRdIG9mIHRoaXMuc2lkcykge1xuICAgICAgICAgICAgICAgIGlmIChleGNlcHQuaGFzKGlkKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgY29uc3Qgc29ja2V0ID0gdGhpcy5uc3Auc29ja2V0cy5nZXQoaWQpO1xuICAgICAgICAgICAgICAgIGlmIChzb2NrZXQpXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHNvY2tldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29tcHV0ZUV4Y2VwdFNpZHMoZXhjZXB0Um9vbXMpIHtcbiAgICAgICAgY29uc3QgZXhjZXB0U2lkcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgaWYgKGV4Y2VwdFJvb21zICYmIGV4Y2VwdFJvb21zLnNpemUgPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJvb20gb2YgZXhjZXB0Um9vbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yb29tcy5oYXMocm9vbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb29tcy5nZXQocm9vbSkuZm9yRWFjaChzaWQgPT4gZXhjZXB0U2lkcy5hZGQoc2lkKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBleGNlcHRTaWRzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZW5kIGEgcGFja2V0IHRvIHRoZSBvdGhlciBTb2NrZXQuSU8gc2VydmVycyBpbiB0aGUgY2x1c3RlclxuICAgICAqIEBwYXJhbSBwYWNrZXQgLSBhbiBhcnJheSBvZiBhcmd1bWVudHMsIHdoaWNoIG1heSBpbmNsdWRlIGFuIGFja25vd2xlZGdlbWVudCBjYWxsYmFjayBhdCB0aGUgZW5kXG4gICAgICovXG4gICAgc2VydmVyU2lkZUVtaXQocGFja2V0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInRoaXMgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSBzZXJ2ZXJTaWRlRW1pdCgpIGZ1bmN0aW9uYWxpdHlcIik7XG4gICAgfVxufVxuZXhwb3J0cy5BZGFwdGVyID0gQWRhcHRlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5yZWNvbnN0cnVjdFBhY2tldCA9IGV4cG9ydHMuZGVjb25zdHJ1Y3RQYWNrZXQgPSB2b2lkIDA7XG5jb25zdCBpc19iaW5hcnlfMSA9IHJlcXVpcmUoXCIuL2lzLWJpbmFyeVwiKTtcbi8qKlxuICogUmVwbGFjZXMgZXZlcnkgQnVmZmVyIHwgQXJyYXlCdWZmZXIgfCBCbG9iIHwgRmlsZSBpbiBwYWNrZXQgd2l0aCBhIG51bWJlcmVkIHBsYWNlaG9sZGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYWNrZXQgLSBzb2NrZXQuaW8gZXZlbnQgcGFja2V0XG4gKiBAcmV0dXJuIHtPYmplY3R9IHdpdGggZGVjb25zdHJ1Y3RlZCBwYWNrZXQgYW5kIGxpc3Qgb2YgYnVmZmVyc1xuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiBkZWNvbnN0cnVjdFBhY2tldChwYWNrZXQpIHtcbiAgICBjb25zdCBidWZmZXJzID0gW107XG4gICAgY29uc3QgcGFja2V0RGF0YSA9IHBhY2tldC5kYXRhO1xuICAgIGNvbnN0IHBhY2sgPSBwYWNrZXQ7XG4gICAgcGFjay5kYXRhID0gX2RlY29uc3RydWN0UGFja2V0KHBhY2tldERhdGEsIGJ1ZmZlcnMpO1xuICAgIHBhY2suYXR0YWNobWVudHMgPSBidWZmZXJzLmxlbmd0aDsgLy8gbnVtYmVyIG9mIGJpbmFyeSAnYXR0YWNobWVudHMnXG4gICAgcmV0dXJuIHsgcGFja2V0OiBwYWNrLCBidWZmZXJzOiBidWZmZXJzIH07XG59XG5leHBvcnRzLmRlY29uc3RydWN0UGFja2V0ID0gZGVjb25zdHJ1Y3RQYWNrZXQ7XG5mdW5jdGlvbiBfZGVjb25zdHJ1Y3RQYWNrZXQoZGF0YSwgYnVmZmVycykge1xuICAgIGlmICghZGF0YSlcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgaWYgKGlzX2JpbmFyeV8xLmlzQmluYXJ5KGRhdGEpKSB7XG4gICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0geyBfcGxhY2Vob2xkZXI6IHRydWUsIG51bTogYnVmZmVycy5sZW5ndGggfTtcbiAgICAgICAgYnVmZmVycy5wdXNoKGRhdGEpO1xuICAgICAgICByZXR1cm4gcGxhY2Vob2xkZXI7XG4gICAgfVxuICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IG5ldyBBcnJheShkYXRhLmxlbmd0aCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbmV3RGF0YVtpXSA9IF9kZWNvbnN0cnVjdFBhY2tldChkYXRhW2ldLCBidWZmZXJzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RGF0YTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIgJiYgIShkYXRhIGluc3RhbmNlb2YgRGF0ZSkpIHtcbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgbmV3RGF0YVtrZXldID0gX2RlY29uc3RydWN0UGFja2V0KGRhdGFba2V5XSwgYnVmZmVycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xufVxuLyoqXG4gKiBSZWNvbnN0cnVjdHMgYSBiaW5hcnkgcGFja2V0IGZyb20gaXRzIHBsYWNlaG9sZGVyIHBhY2tldCBhbmQgYnVmZmVyc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYWNrZXQgLSBldmVudCBwYWNrZXQgd2l0aCBwbGFjZWhvbGRlcnNcbiAqIEBwYXJhbSB7QXJyYXl9IGJ1ZmZlcnMgLSBiaW5hcnkgYnVmZmVycyB0byBwdXQgaW4gcGxhY2Vob2xkZXIgcG9zaXRpb25zXG4gKiBAcmV0dXJuIHtPYmplY3R9IHJlY29uc3RydWN0ZWQgcGFja2V0XG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIHJlY29uc3RydWN0UGFja2V0KHBhY2tldCwgYnVmZmVycykge1xuICAgIHBhY2tldC5kYXRhID0gX3JlY29uc3RydWN0UGFja2V0KHBhY2tldC5kYXRhLCBidWZmZXJzKTtcbiAgICBwYWNrZXQuYXR0YWNobWVudHMgPSB1bmRlZmluZWQ7IC8vIG5vIGxvbmdlciB1c2VmdWxcbiAgICByZXR1cm4gcGFja2V0O1xufVxuZXhwb3J0cy5yZWNvbnN0cnVjdFBhY2tldCA9IHJlY29uc3RydWN0UGFja2V0O1xuZnVuY3Rpb24gX3JlY29uc3RydWN0UGFja2V0KGRhdGEsIGJ1ZmZlcnMpIHtcbiAgICBpZiAoIWRhdGEpXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIGlmIChkYXRhICYmIGRhdGEuX3BsYWNlaG9sZGVyKSB7XG4gICAgICAgIHJldHVybiBidWZmZXJzW2RhdGEubnVtXTsgLy8gYXBwcm9wcmlhdGUgYnVmZmVyIChzaG91bGQgYmUgbmF0dXJhbCBvcmRlciBhbnl3YXkpXG4gICAgfVxuICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkYXRhW2ldID0gX3JlY29uc3RydWN0UGFja2V0KGRhdGFbaV0sIGJ1ZmZlcnMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBkYXRhW2tleV0gPSBfcmVjb25zdHJ1Y3RQYWNrZXQoZGF0YVtrZXldLCBidWZmZXJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5EZWNvZGVyID0gZXhwb3J0cy5FbmNvZGVyID0gZXhwb3J0cy5QYWNrZXRUeXBlID0gZXhwb3J0cy5wcm90b2NvbCA9IHZvaWQgMDtcbmNvbnN0IEVtaXR0ZXIgPSByZXF1aXJlKFwiY29tcG9uZW50LWVtaXR0ZXJcIik7XG5jb25zdCBiaW5hcnlfMSA9IHJlcXVpcmUoXCIuL2JpbmFyeVwiKTtcbmNvbnN0IGlzX2JpbmFyeV8xID0gcmVxdWlyZShcIi4vaXMtYmluYXJ5XCIpO1xuY29uc3QgZGVidWcgPSByZXF1aXJlKFwiZGVidWdcIikoXCJzb2NrZXQuaW8tcGFyc2VyXCIpO1xuLyoqXG4gKiBQcm90b2NvbCB2ZXJzaW9uLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0cy5wcm90b2NvbCA9IDU7XG52YXIgUGFja2V0VHlwZTtcbihmdW5jdGlvbiAoUGFja2V0VHlwZSkge1xuICAgIFBhY2tldFR5cGVbUGFja2V0VHlwZVtcIkNPTk5FQ1RcIl0gPSAwXSA9IFwiQ09OTkVDVFwiO1xuICAgIFBhY2tldFR5cGVbUGFja2V0VHlwZVtcIkRJU0NPTk5FQ1RcIl0gPSAxXSA9IFwiRElTQ09OTkVDVFwiO1xuICAgIFBhY2tldFR5cGVbUGFja2V0VHlwZVtcIkVWRU5UXCJdID0gMl0gPSBcIkVWRU5UXCI7XG4gICAgUGFja2V0VHlwZVtQYWNrZXRUeXBlW1wiQUNLXCJdID0gM10gPSBcIkFDS1wiO1xuICAgIFBhY2tldFR5cGVbUGFja2V0VHlwZVtcIkNPTk5FQ1RfRVJST1JcIl0gPSA0XSA9IFwiQ09OTkVDVF9FUlJPUlwiO1xuICAgIFBhY2tldFR5cGVbUGFja2V0VHlwZVtcIkJJTkFSWV9FVkVOVFwiXSA9IDVdID0gXCJCSU5BUllfRVZFTlRcIjtcbiAgICBQYWNrZXRUeXBlW1BhY2tldFR5cGVbXCJCSU5BUllfQUNLXCJdID0gNl0gPSBcIkJJTkFSWV9BQ0tcIjtcbn0pKFBhY2tldFR5cGUgPSBleHBvcnRzLlBhY2tldFR5cGUgfHwgKGV4cG9ydHMuUGFja2V0VHlwZSA9IHt9KSk7XG4vKipcbiAqIEEgc29ja2V0LmlvIEVuY29kZXIgaW5zdGFuY2VcbiAqL1xuY2xhc3MgRW5jb2RlciB7XG4gICAgLyoqXG4gICAgICogRW5jb2RlIGEgcGFja2V0IGFzIGEgc2luZ2xlIHN0cmluZyBpZiBub24tYmluYXJ5LCBvciBhcyBhXG4gICAgICogYnVmZmVyIHNlcXVlbmNlLCBkZXBlbmRpbmcgb24gcGFja2V0IHR5cGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIC0gcGFja2V0IG9iamVjdFxuICAgICAqL1xuICAgIGVuY29kZShvYmopIHtcbiAgICAgICAgZGVidWcoXCJlbmNvZGluZyBwYWNrZXQgJWpcIiwgb2JqKTtcbiAgICAgICAgaWYgKG9iai50eXBlID09PSBQYWNrZXRUeXBlLkVWRU5UIHx8IG9iai50eXBlID09PSBQYWNrZXRUeXBlLkFDSykge1xuICAgICAgICAgICAgaWYgKGlzX2JpbmFyeV8xLmhhc0JpbmFyeShvYmopKSB7XG4gICAgICAgICAgICAgICAgb2JqLnR5cGUgPVxuICAgICAgICAgICAgICAgICAgICBvYmoudHlwZSA9PT0gUGFja2V0VHlwZS5FVkVOVFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBQYWNrZXRUeXBlLkJJTkFSWV9FVkVOVFxuICAgICAgICAgICAgICAgICAgICAgICAgOiBQYWNrZXRUeXBlLkJJTkFSWV9BQ0s7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlQXNCaW5hcnkob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3RoaXMuZW5jb2RlQXNTdHJpbmcob2JqKV07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVuY29kZSBwYWNrZXQgYXMgc3RyaW5nLlxuICAgICAqL1xuICAgIGVuY29kZUFzU3RyaW5nKG9iaikge1xuICAgICAgICAvLyBmaXJzdCBpcyB0eXBlXG4gICAgICAgIGxldCBzdHIgPSBcIlwiICsgb2JqLnR5cGU7XG4gICAgICAgIC8vIGF0dGFjaG1lbnRzIGlmIHdlIGhhdmUgdGhlbVxuICAgICAgICBpZiAob2JqLnR5cGUgPT09IFBhY2tldFR5cGUuQklOQVJZX0VWRU5UIHx8XG4gICAgICAgICAgICBvYmoudHlwZSA9PT0gUGFja2V0VHlwZS5CSU5BUllfQUNLKSB7XG4gICAgICAgICAgICBzdHIgKz0gb2JqLmF0dGFjaG1lbnRzICsgXCItXCI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgd2UgaGF2ZSBhIG5hbWVzcGFjZSBvdGhlciB0aGFuIGAvYFxuICAgICAgICAvLyB3ZSBhcHBlbmQgaXQgZm9sbG93ZWQgYnkgYSBjb21tYSBgLGBcbiAgICAgICAgaWYgKG9iai5uc3AgJiYgXCIvXCIgIT09IG9iai5uc3ApIHtcbiAgICAgICAgICAgIHN0ciArPSBvYmoubnNwICsgXCIsXCI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaW1tZWRpYXRlbHkgZm9sbG93ZWQgYnkgdGhlIGlkXG4gICAgICAgIGlmIChudWxsICE9IG9iai5pZCkge1xuICAgICAgICAgICAgc3RyICs9IG9iai5pZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBqc29uIGRhdGFcbiAgICAgICAgaWYgKG51bGwgIT0gb2JqLmRhdGEpIHtcbiAgICAgICAgICAgIHN0ciArPSBKU09OLnN0cmluZ2lmeShvYmouZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZGVidWcoXCJlbmNvZGVkICVqIGFzICVzXCIsIG9iaiwgc3RyKTtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRW5jb2RlIHBhY2tldCBhcyAnYnVmZmVyIHNlcXVlbmNlJyBieSByZW1vdmluZyBibG9icywgYW5kXG4gICAgICogZGVjb25zdHJ1Y3RpbmcgcGFja2V0IGludG8gb2JqZWN0IHdpdGggcGxhY2Vob2xkZXJzIGFuZFxuICAgICAqIGEgbGlzdCBvZiBidWZmZXJzLlxuICAgICAqL1xuICAgIGVuY29kZUFzQmluYXJ5KG9iaikge1xuICAgICAgICBjb25zdCBkZWNvbnN0cnVjdGlvbiA9IGJpbmFyeV8xLmRlY29uc3RydWN0UGFja2V0KG9iaik7XG4gICAgICAgIGNvbnN0IHBhY2sgPSB0aGlzLmVuY29kZUFzU3RyaW5nKGRlY29uc3RydWN0aW9uLnBhY2tldCk7XG4gICAgICAgIGNvbnN0IGJ1ZmZlcnMgPSBkZWNvbnN0cnVjdGlvbi5idWZmZXJzO1xuICAgICAgICBidWZmZXJzLnVuc2hpZnQocGFjayk7IC8vIGFkZCBwYWNrZXQgaW5mbyB0byBiZWdpbm5pbmcgb2YgZGF0YSBsaXN0XG4gICAgICAgIHJldHVybiBidWZmZXJzOyAvLyB3cml0ZSBhbGwgdGhlIGJ1ZmZlcnNcbiAgICB9XG59XG5leHBvcnRzLkVuY29kZXIgPSBFbmNvZGVyO1xuLyoqXG4gKiBBIHNvY2tldC5pbyBEZWNvZGVyIGluc3RhbmNlXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBkZWNvZGVyXG4gKi9cbmNsYXNzIERlY29kZXIgZXh0ZW5kcyBFbWl0dGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGVjb2RlcyBhbiBlbmNvZGVkIHBhY2tldCBzdHJpbmcgaW50byBwYWNrZXQgSlNPTi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvYmogLSBlbmNvZGVkIHBhY2tldFxuICAgICAqL1xuICAgIGFkZChvYmopIHtcbiAgICAgICAgbGV0IHBhY2tldDtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmogPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHBhY2tldCA9IHRoaXMuZGVjb2RlU3RyaW5nKG9iaik7XG4gICAgICAgICAgICBpZiAocGFja2V0LnR5cGUgPT09IFBhY2tldFR5cGUuQklOQVJZX0VWRU5UIHx8XG4gICAgICAgICAgICAgICAgcGFja2V0LnR5cGUgPT09IFBhY2tldFR5cGUuQklOQVJZX0FDSykge1xuICAgICAgICAgICAgICAgIC8vIGJpbmFyeSBwYWNrZXQncyBqc29uXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNvbnN0cnVjdG9yID0gbmV3IEJpbmFyeVJlY29uc3RydWN0b3IocGFja2V0KTtcbiAgICAgICAgICAgICAgICAvLyBubyBhdHRhY2htZW50cywgbGFiZWxlZCBiaW5hcnkgYnV0IG5vIGJpbmFyeSBkYXRhIHRvIGZvbGxvd1xuICAgICAgICAgICAgICAgIGlmIChwYWNrZXQuYXR0YWNobWVudHMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIuZW1pdChcImRlY29kZWRcIiwgcGFja2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBub24tYmluYXJ5IGZ1bGwgcGFja2V0XG4gICAgICAgICAgICAgICAgc3VwZXIuZW1pdChcImRlY29kZWRcIiwgcGFja2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc19iaW5hcnlfMS5pc0JpbmFyeShvYmopIHx8IG9iai5iYXNlNjQpIHtcbiAgICAgICAgICAgIC8vIHJhdyBiaW5hcnkgZGF0YVxuICAgICAgICAgICAgaWYgKCF0aGlzLnJlY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJnb3QgYmluYXJ5IGRhdGEgd2hlbiBub3QgcmVjb25zdHJ1Y3RpbmcgYSBwYWNrZXRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYWNrZXQgPSB0aGlzLnJlY29uc3RydWN0b3IudGFrZUJpbmFyeURhdGEob2JqKTtcbiAgICAgICAgICAgICAgICBpZiAocGFja2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlY2VpdmVkIGZpbmFsIGJ1ZmZlclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlY29uc3RydWN0b3IgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBzdXBlci5lbWl0KFwiZGVjb2RlZFwiLCBwYWNrZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gdHlwZTogXCIgKyBvYmopO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERlY29kZSBhIHBhY2tldCBTdHJpbmcgKEpTT04gZGF0YSlcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHBhY2tldFxuICAgICAqL1xuICAgIGRlY29kZVN0cmluZyhzdHIpIHtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAvLyBsb29rIHVwIHR5cGVcbiAgICAgICAgY29uc3QgcCA9IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcihzdHIuY2hhckF0KDApKSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKFBhY2tldFR5cGVbcC50eXBlXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHBhY2tldCB0eXBlIFwiICsgcC50eXBlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBsb29rIHVwIGF0dGFjaG1lbnRzIGlmIHR5cGUgYmluYXJ5XG4gICAgICAgIGlmIChwLnR5cGUgPT09IFBhY2tldFR5cGUuQklOQVJZX0VWRU5UIHx8XG4gICAgICAgICAgICBwLnR5cGUgPT09IFBhY2tldFR5cGUuQklOQVJZX0FDSykge1xuICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgIHdoaWxlIChzdHIuY2hhckF0KCsraSkgIT09IFwiLVwiICYmIGkgIT0gc3RyLmxlbmd0aCkgeyB9XG4gICAgICAgICAgICBjb25zdCBidWYgPSBzdHIuc3Vic3RyaW5nKHN0YXJ0LCBpKTtcbiAgICAgICAgICAgIGlmIChidWYgIT0gTnVtYmVyKGJ1ZikgfHwgc3RyLmNoYXJBdChpKSAhPT0gXCItXCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIGF0dGFjaG1lbnRzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcC5hdHRhY2htZW50cyA9IE51bWJlcihidWYpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGxvb2sgdXAgbmFtZXNwYWNlIChpZiBhbnkpXG4gICAgICAgIGlmIChcIi9cIiA9PT0gc3RyLmNoYXJBdChpICsgMSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gaSArIDE7XG4gICAgICAgICAgICB3aGlsZSAoKytpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYyA9IHN0ci5jaGFyQXQoaSk7XG4gICAgICAgICAgICAgICAgaWYgKFwiLFwiID09PSBjKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gc3RyLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwLm5zcCA9IHN0ci5zdWJzdHJpbmcoc3RhcnQsIGkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcC5uc3AgPSBcIi9cIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBsb29rIHVwIGlkXG4gICAgICAgIGNvbnN0IG5leHQgPSBzdHIuY2hhckF0KGkgKyAxKTtcbiAgICAgICAgaWYgKFwiXCIgIT09IG5leHQgJiYgTnVtYmVyKG5leHQpID09IG5leHQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gaSArIDE7XG4gICAgICAgICAgICB3aGlsZSAoKytpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYyA9IHN0ci5jaGFyQXQoaSk7XG4gICAgICAgICAgICAgICAgaWYgKG51bGwgPT0gYyB8fCBOdW1iZXIoYykgIT0gYykge1xuICAgICAgICAgICAgICAgICAgICAtLWk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gc3RyLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwLmlkID0gTnVtYmVyKHN0ci5zdWJzdHJpbmcoc3RhcnQsIGkgKyAxKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbG9vayB1cCBqc29uIGRhdGFcbiAgICAgICAgaWYgKHN0ci5jaGFyQXQoKytpKSkge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRyeVBhcnNlKHN0ci5zdWJzdHIoaSkpO1xuICAgICAgICAgICAgaWYgKERlY29kZXIuaXNQYXlsb2FkVmFsaWQocC50eXBlLCBwYXlsb2FkKSkge1xuICAgICAgICAgICAgICAgIHAuZGF0YSA9IHBheWxvYWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIHBheWxvYWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZGVidWcoXCJkZWNvZGVkICVzIGFzICVqXCIsIHN0ciwgcCk7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgICBzdGF0aWMgaXNQYXlsb2FkVmFsaWQodHlwZSwgcGF5bG9hZCkge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgUGFja2V0VHlwZS5DT05ORUNUOlxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgcGF5bG9hZCA9PT0gXCJvYmplY3RcIjtcbiAgICAgICAgICAgIGNhc2UgUGFja2V0VHlwZS5ESVNDT05ORUNUOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXlsb2FkID09PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjYXNlIFBhY2tldFR5cGUuQ09OTkVDVF9FUlJPUjpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIHBheWxvYWQgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHBheWxvYWQgPT09IFwib2JqZWN0XCI7XG4gICAgICAgICAgICBjYXNlIFBhY2tldFR5cGUuRVZFTlQ6XG4gICAgICAgICAgICBjYXNlIFBhY2tldFR5cGUuQklOQVJZX0VWRU5UOlxuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHBheWxvYWQpICYmIHBheWxvYWQubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIGNhc2UgUGFja2V0VHlwZS5BQ0s6XG4gICAgICAgICAgICBjYXNlIFBhY2tldFR5cGUuQklOQVJZX0FDSzpcbiAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShwYXlsb2FkKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBEZWFsbG9jYXRlcyBhIHBhcnNlcidzIHJlc291cmNlc1xuICAgICAqL1xuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLnJlY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHRoaXMucmVjb25zdHJ1Y3Rvci5maW5pc2hlZFJlY29uc3RydWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLkRlY29kZXIgPSBEZWNvZGVyO1xuZnVuY3Rpb24gdHJ5UGFyc2Uoc3RyKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2Uoc3RyKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbi8qKlxuICogQSBtYW5hZ2VyIG9mIGEgYmluYXJ5IGV2ZW50J3MgJ2J1ZmZlciBzZXF1ZW5jZScuIFNob3VsZFxuICogYmUgY29uc3RydWN0ZWQgd2hlbmV2ZXIgYSBwYWNrZXQgb2YgdHlwZSBCSU5BUllfRVZFTlQgaXNcbiAqIGRlY29kZWQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHBhY2tldFxuICogQHJldHVybiB7QmluYXJ5UmVjb25zdHJ1Y3Rvcn0gaW5pdGlhbGl6ZWQgcmVjb25zdHJ1Y3RvclxuICovXG5jbGFzcyBCaW5hcnlSZWNvbnN0cnVjdG9yIHtcbiAgICBjb25zdHJ1Y3RvcihwYWNrZXQpIHtcbiAgICAgICAgdGhpcy5wYWNrZXQgPSBwYWNrZXQ7XG4gICAgICAgIHRoaXMuYnVmZmVycyA9IFtdO1xuICAgICAgICB0aGlzLnJlY29uUGFjayA9IHBhY2tldDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHRvIGJlIGNhbGxlZCB3aGVuIGJpbmFyeSBkYXRhIHJlY2VpdmVkIGZyb20gY29ubmVjdGlvblxuICAgICAqIGFmdGVyIGEgQklOQVJZX0VWRU5UIHBhY2tldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QnVmZmVyIHwgQXJyYXlCdWZmZXJ9IGJpbkRhdGEgLSB0aGUgcmF3IGJpbmFyeSBkYXRhIHJlY2VpdmVkXG4gICAgICogQHJldHVybiB7bnVsbCB8IE9iamVjdH0gcmV0dXJucyBudWxsIGlmIG1vcmUgYmluYXJ5IGRhdGEgaXMgZXhwZWN0ZWQgb3JcbiAgICAgKiAgIGEgcmVjb25zdHJ1Y3RlZCBwYWNrZXQgb2JqZWN0IGlmIGFsbCBidWZmZXJzIGhhdmUgYmVlbiByZWNlaXZlZC5cbiAgICAgKi9cbiAgICB0YWtlQmluYXJ5RGF0YShiaW5EYXRhKSB7XG4gICAgICAgIHRoaXMuYnVmZmVycy5wdXNoKGJpbkRhdGEpO1xuICAgICAgICBpZiAodGhpcy5idWZmZXJzLmxlbmd0aCA9PT0gdGhpcy5yZWNvblBhY2suYXR0YWNobWVudHMpIHtcbiAgICAgICAgICAgIC8vIGRvbmUgd2l0aCBidWZmZXIgbGlzdFxuICAgICAgICAgICAgY29uc3QgcGFja2V0ID0gYmluYXJ5XzEucmVjb25zdHJ1Y3RQYWNrZXQodGhpcy5yZWNvblBhY2ssIHRoaXMuYnVmZmVycyk7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaGVkUmVjb25zdHJ1Y3Rpb24oKTtcbiAgICAgICAgICAgIHJldHVybiBwYWNrZXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsZWFucyB1cCBiaW5hcnkgcGFja2V0IHJlY29uc3RydWN0aW9uIHZhcmlhYmxlcy5cbiAgICAgKi9cbiAgICBmaW5pc2hlZFJlY29uc3RydWN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlY29uUGFjayA9IG51bGw7XG4gICAgICAgIHRoaXMuYnVmZmVycyA9IFtdO1xuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5oYXNCaW5hcnkgPSBleHBvcnRzLmlzQmluYXJ5ID0gdm9pZCAwO1xuY29uc3Qgd2l0aE5hdGl2ZUFycmF5QnVmZmVyID0gdHlwZW9mIEFycmF5QnVmZmVyID09PSBcImZ1bmN0aW9uXCI7XG5jb25zdCBpc1ZpZXcgPSAob2JqKSA9PiB7XG4gICAgcmV0dXJuIHR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICA/IEFycmF5QnVmZmVyLmlzVmlldyhvYmopXG4gICAgICAgIDogb2JqLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyO1xufTtcbmNvbnN0IHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmNvbnN0IHdpdGhOYXRpdmVCbG9iID0gdHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiB8fFxuICAgICh0eXBlb2YgQmxvYiAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICB0b1N0cmluZy5jYWxsKEJsb2IpID09PSBcIltvYmplY3QgQmxvYkNvbnN0cnVjdG9yXVwiKTtcbmNvbnN0IHdpdGhOYXRpdmVGaWxlID0gdHlwZW9mIEZpbGUgPT09IFwiZnVuY3Rpb25cIiB8fFxuICAgICh0eXBlb2YgRmlsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICB0b1N0cmluZy5jYWxsKEZpbGUpID09PSBcIltvYmplY3QgRmlsZUNvbnN0cnVjdG9yXVwiKTtcbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIG9iaiBpcyBhIEJ1ZmZlciwgYW4gQXJyYXlCdWZmZXIsIGEgQmxvYiBvciBhIEZpbGUuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gaXNCaW5hcnkob2JqKSB7XG4gICAgcmV0dXJuICgod2l0aE5hdGl2ZUFycmF5QnVmZmVyICYmIChvYmogaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fCBpc1ZpZXcob2JqKSkpIHx8XG4gICAgICAgICh3aXRoTmF0aXZlQmxvYiAmJiBvYmogaW5zdGFuY2VvZiBCbG9iKSB8fFxuICAgICAgICAod2l0aE5hdGl2ZUZpbGUgJiYgb2JqIGluc3RhbmNlb2YgRmlsZSkpO1xufVxuZXhwb3J0cy5pc0JpbmFyeSA9IGlzQmluYXJ5O1xuZnVuY3Rpb24gaGFzQmluYXJ5KG9iaiwgdG9KU09OKSB7XG4gICAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaGFzQmluYXJ5KG9ialtpXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChpc0JpbmFyeShvYmopKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAob2JqLnRvSlNPTiAmJlxuICAgICAgICB0eXBlb2Ygb2JqLnRvSlNPTiA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgIGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIGhhc0JpbmFyeShvYmoudG9KU09OKCksIHRydWUpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkgJiYgaGFzQmluYXJ5KG9ialtrZXldKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0cy5oYXNCaW5hcnkgPSBoYXNCaW5hcnk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhY2NlcHRzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvb2tpZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkZWJ1Z1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJldmVudHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwib2JqZWN0LWFzc2lnblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ2YXJ5XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIndzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicXVlcnlzdHJpbmdcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic3RyZWFtXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInVybFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ6bGliXCIpOyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FUlJPUl9QQUNLRVQgPSBleHBvcnRzLlBBQ0tFVF9UWVBFU19SRVZFUlNFID0gZXhwb3J0cy5QQUNLRVRfVFlQRVMgPSB2b2lkIDA7XG5jb25zdCBQQUNLRVRfVFlQRVMgPSBPYmplY3QuY3JlYXRlKG51bGwpOyAvLyBubyBNYXAgPSBubyBwb2x5ZmlsbFxuZXhwb3J0cy5QQUNLRVRfVFlQRVMgPSBQQUNLRVRfVFlQRVM7XG5QQUNLRVRfVFlQRVNbXCJvcGVuXCJdID0gXCIwXCI7XG5QQUNLRVRfVFlQRVNbXCJjbG9zZVwiXSA9IFwiMVwiO1xuUEFDS0VUX1RZUEVTW1wicGluZ1wiXSA9IFwiMlwiO1xuUEFDS0VUX1RZUEVTW1wicG9uZ1wiXSA9IFwiM1wiO1xuUEFDS0VUX1RZUEVTW1wibWVzc2FnZVwiXSA9IFwiNFwiO1xuUEFDS0VUX1RZUEVTW1widXBncmFkZVwiXSA9IFwiNVwiO1xuUEFDS0VUX1RZUEVTW1wibm9vcFwiXSA9IFwiNlwiO1xuY29uc3QgUEFDS0VUX1RZUEVTX1JFVkVSU0UgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuZXhwb3J0cy5QQUNLRVRfVFlQRVNfUkVWRVJTRSA9IFBBQ0tFVF9UWVBFU19SRVZFUlNFO1xuT2JqZWN0LmtleXMoUEFDS0VUX1RZUEVTKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgUEFDS0VUX1RZUEVTX1JFVkVSU0VbUEFDS0VUX1RZUEVTW2tleV1dID0ga2V5O1xufSk7XG5jb25zdCBFUlJPUl9QQUNLRVQgPSB7IHR5cGU6IFwiZXJyb3JcIiwgZGF0YTogXCJwYXJzZXIgZXJyb3JcIiB9O1xuZXhwb3J0cy5FUlJPUl9QQUNLRVQgPSBFUlJPUl9QQUNLRVQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbW1vbnNfanNfMSA9IHJlcXVpcmUoXCIuL2NvbW1vbnMuanNcIik7XG5jb25zdCBkZWNvZGVQYWNrZXQgPSAoZW5jb2RlZFBhY2tldCwgYmluYXJ5VHlwZSkgPT4ge1xuICAgIGlmICh0eXBlb2YgZW5jb2RlZFBhY2tldCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogXCJtZXNzYWdlXCIsXG4gICAgICAgICAgICBkYXRhOiBtYXBCaW5hcnkoZW5jb2RlZFBhY2tldCwgYmluYXJ5VHlwZSlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgdHlwZSA9IGVuY29kZWRQYWNrZXQuY2hhckF0KDApO1xuICAgIGlmICh0eXBlID09PSBcImJcIikge1xuICAgICAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbShlbmNvZGVkUGFja2V0LnN1YnN0cmluZygxKSwgXCJiYXNlNjRcIik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgICAgIGRhdGE6IG1hcEJpbmFyeShidWZmZXIsIGJpbmFyeVR5cGUpXG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmICghY29tbW9uc19qc18xLlBBQ0tFVF9UWVBFU19SRVZFUlNFW3R5cGVdKSB7XG4gICAgICAgIHJldHVybiBjb21tb25zX2pzXzEuRVJST1JfUEFDS0VUO1xuICAgIH1cbiAgICByZXR1cm4gZW5jb2RlZFBhY2tldC5sZW5ndGggPiAxXG4gICAgICAgID8ge1xuICAgICAgICAgICAgdHlwZTogY29tbW9uc19qc18xLlBBQ0tFVF9UWVBFU19SRVZFUlNFW3R5cGVdLFxuICAgICAgICAgICAgZGF0YTogZW5jb2RlZFBhY2tldC5zdWJzdHJpbmcoMSlcbiAgICAgICAgfVxuICAgICAgICA6IHtcbiAgICAgICAgICAgIHR5cGU6IGNvbW1vbnNfanNfMS5QQUNLRVRfVFlQRVNfUkVWRVJTRVt0eXBlXVxuICAgICAgICB9O1xufTtcbmNvbnN0IG1hcEJpbmFyeSA9IChkYXRhLCBiaW5hcnlUeXBlKSA9PiB7XG4gICAgY29uc3QgaXNCdWZmZXIgPSBCdWZmZXIuaXNCdWZmZXIoZGF0YSk7XG4gICAgc3dpdGNoIChiaW5hcnlUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJhcnJheWJ1ZmZlclwiOlxuICAgICAgICAgICAgcmV0dXJuIGlzQnVmZmVyID8gdG9BcnJheUJ1ZmZlcihkYXRhKSA6IGRhdGE7XG4gICAgICAgIGNhc2UgXCJub2RlYnVmZmVyXCI6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gZGF0YTsgLy8gYXNzdW1pbmcgdGhlIGRhdGEgaXMgYWxyZWFkeSBhIEJ1ZmZlclxuICAgIH1cbn07XG5jb25zdCB0b0FycmF5QnVmZmVyID0gYnVmZmVyID0+IHtcbiAgICBjb25zdCBhcnJheUJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihidWZmZXIubGVuZ3RoKTtcbiAgICBjb25zdCB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZpZXdbaV0gPSBidWZmZXJbaV07XG4gICAgfVxuICAgIHJldHVybiBhcnJheUJ1ZmZlcjtcbn07XG5leHBvcnRzLmRlZmF1bHQgPSBkZWNvZGVQYWNrZXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbW1vbnNfanNfMSA9IHJlcXVpcmUoXCIuL2NvbW1vbnMuanNcIik7XG5jb25zdCBlbmNvZGVQYWNrZXQgPSAoeyB0eXBlLCBkYXRhIH0sIHN1cHBvcnRzQmluYXJ5LCBjYWxsYmFjaykgPT4ge1xuICAgIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgfHwgQXJyYXlCdWZmZXIuaXNWaWV3KGRhdGEpKSB7XG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IHRvQnVmZmVyKGRhdGEpO1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZW5jb2RlQnVmZmVyKGJ1ZmZlciwgc3VwcG9ydHNCaW5hcnkpKTtcbiAgICB9XG4gICAgLy8gcGxhaW4gc3RyaW5nXG4gICAgcmV0dXJuIGNhbGxiYWNrKGNvbW1vbnNfanNfMS5QQUNLRVRfVFlQRVNbdHlwZV0gKyAoZGF0YSB8fCBcIlwiKSk7XG59O1xuY29uc3QgdG9CdWZmZXIgPSBkYXRhID0+IHtcbiAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKGRhdGEpKSB7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGRhdGEpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGRhdGEuYnVmZmVyLCBkYXRhLmJ5dGVPZmZzZXQsIGRhdGEuYnl0ZUxlbmd0aCk7XG4gICAgfVxufTtcbi8vIG9ubHkgJ21lc3NhZ2UnIHBhY2tldHMgY2FuIGNvbnRhaW4gYmluYXJ5LCBzbyB0aGUgdHlwZSBwcmVmaXggaXMgbm90IG5lZWRlZFxuY29uc3QgZW5jb2RlQnVmZmVyID0gKGRhdGEsIHN1cHBvcnRzQmluYXJ5KSA9PiB7XG4gICAgcmV0dXJuIHN1cHBvcnRzQmluYXJ5ID8gZGF0YSA6IFwiYlwiICsgZGF0YS50b1N0cmluZyhcImJhc2U2NFwiKTtcbn07XG5leHBvcnRzLmRlZmF1bHQgPSBlbmNvZGVQYWNrZXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVjb2RlUGF5bG9hZCA9IGV4cG9ydHMuZGVjb2RlUGFja2V0ID0gZXhwb3J0cy5lbmNvZGVQYXlsb2FkID0gZXhwb3J0cy5lbmNvZGVQYWNrZXQgPSBleHBvcnRzLnByb3RvY29sID0gdm9pZCAwO1xuY29uc3QgZW5jb2RlUGFja2V0X2pzXzEgPSByZXF1aXJlKFwiLi9lbmNvZGVQYWNrZXQuanNcIik7XG5leHBvcnRzLmVuY29kZVBhY2tldCA9IGVuY29kZVBhY2tldF9qc18xLmRlZmF1bHQ7XG5jb25zdCBkZWNvZGVQYWNrZXRfanNfMSA9IHJlcXVpcmUoXCIuL2RlY29kZVBhY2tldC5qc1wiKTtcbmV4cG9ydHMuZGVjb2RlUGFja2V0ID0gZGVjb2RlUGFja2V0X2pzXzEuZGVmYXVsdDtcbmNvbnN0IFNFUEFSQVRPUiA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMzApOyAvLyBzZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRGVsaW1pdGVyI0FTQ0lJX2RlbGltaXRlZF90ZXh0XG5jb25zdCBlbmNvZGVQYXlsb2FkID0gKHBhY2tldHMsIGNhbGxiYWNrKSA9PiB7XG4gICAgLy8gc29tZSBwYWNrZXRzIG1heSBiZSBhZGRlZCB0byB0aGUgYXJyYXkgd2hpbGUgZW5jb2RpbmcsIHNvIHRoZSBpbml0aWFsIGxlbmd0aCBtdXN0IGJlIHNhdmVkXG4gICAgY29uc3QgbGVuZ3RoID0gcGFja2V0cy5sZW5ndGg7XG4gICAgY29uc3QgZW5jb2RlZFBhY2tldHMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHBhY2tldHMuZm9yRWFjaCgocGFja2V0LCBpKSA9PiB7XG4gICAgICAgIC8vIGZvcmNlIGJhc2U2NCBlbmNvZGluZyBmb3IgYmluYXJ5IHBhY2tldHNcbiAgICAgICAgKDAsIGVuY29kZVBhY2tldF9qc18xLmRlZmF1bHQpKHBhY2tldCwgZmFsc2UsIGVuY29kZWRQYWNrZXQgPT4ge1xuICAgICAgICAgICAgZW5jb2RlZFBhY2tldHNbaV0gPSBlbmNvZGVkUGFja2V0O1xuICAgICAgICAgICAgaWYgKCsrY291bnQgPT09IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVuY29kZWRQYWNrZXRzLmpvaW4oU0VQQVJBVE9SKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcbmV4cG9ydHMuZW5jb2RlUGF5bG9hZCA9IGVuY29kZVBheWxvYWQ7XG5jb25zdCBkZWNvZGVQYXlsb2FkID0gKGVuY29kZWRQYXlsb2FkLCBiaW5hcnlUeXBlKSA9PiB7XG4gICAgY29uc3QgZW5jb2RlZFBhY2tldHMgPSBlbmNvZGVkUGF5bG9hZC5zcGxpdChTRVBBUkFUT1IpO1xuICAgIGNvbnN0IHBhY2tldHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVuY29kZWRQYWNrZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRlY29kZWRQYWNrZXQgPSAoMCwgZGVjb2RlUGFja2V0X2pzXzEuZGVmYXVsdCkoZW5jb2RlZFBhY2tldHNbaV0sIGJpbmFyeVR5cGUpO1xuICAgICAgICBwYWNrZXRzLnB1c2goZGVjb2RlZFBhY2tldCk7XG4gICAgICAgIGlmIChkZWNvZGVkUGFja2V0LnR5cGUgPT09IFwiZXJyb3JcIikge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhY2tldHM7XG59O1xuZXhwb3J0cy5kZWNvZGVQYXlsb2FkID0gZGVjb2RlUGF5bG9hZDtcbmV4cG9ydHMucHJvdG9jb2wgPSA0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnByb3RvY29sID0gZXhwb3J0cy5UcmFuc3BvcnQgPSBleHBvcnRzLlNvY2tldCA9IGV4cG9ydHMudVNlcnZlciA9IGV4cG9ydHMucGFyc2VyID0gZXhwb3J0cy5hdHRhY2ggPSBleHBvcnRzLmxpc3RlbiA9IGV4cG9ydHMudHJhbnNwb3J0cyA9IGV4cG9ydHMuU2VydmVyID0gdm9pZCAwO1xuY29uc3QgaHR0cF8xID0gcmVxdWlyZShcImh0dHBcIik7XG5jb25zdCBzZXJ2ZXJfMSA9IHJlcXVpcmUoXCIuL3NlcnZlclwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlNlcnZlclwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VydmVyXzEuU2VydmVyOyB9IH0pO1xuY29uc3QgaW5kZXhfMSA9IHJlcXVpcmUoXCIuL3RyYW5zcG9ydHMvaW5kZXhcIik7XG5leHBvcnRzLnRyYW5zcG9ydHMgPSBpbmRleF8xLmRlZmF1bHQ7XG5jb25zdCBwYXJzZXIgPSByZXF1aXJlKFwiZW5naW5lLmlvLXBhcnNlclwiKTtcbmV4cG9ydHMucGFyc2VyID0gcGFyc2VyO1xudmFyIHVzZXJ2ZXJfMSA9IHJlcXVpcmUoXCIuL3VzZXJ2ZXJcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJ1U2VydmVyXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB1c2VydmVyXzEudVNlcnZlcjsgfSB9KTtcbnZhciBzb2NrZXRfMSA9IHJlcXVpcmUoXCIuL3NvY2tldFwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlNvY2tldFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc29ja2V0XzEuU29ja2V0OyB9IH0pO1xudmFyIHRyYW5zcG9ydF8xID0gcmVxdWlyZShcIi4vdHJhbnNwb3J0XCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiVHJhbnNwb3J0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0cmFuc3BvcnRfMS5UcmFuc3BvcnQ7IH0gfSk7XG5leHBvcnRzLnByb3RvY29sID0gcGFyc2VyLnByb3RvY29sO1xuLyoqXG4gKiBDcmVhdGVzIGFuIGh0dHAuU2VydmVyIGV4Y2x1c2l2ZWx5IHVzZWQgZm9yIFdTIHVwZ3JhZGVzLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBwb3J0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1NlcnZlcn0gd2Vic29ja2V0LmlvIHNlcnZlclxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gbGlzdGVuKHBvcnQsIG9wdGlvbnMsIGZuKSB7XG4gICAgaWYgKFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIG9wdGlvbnMpIHtcbiAgICAgICAgZm4gPSBvcHRpb25zO1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGNvbnN0IHNlcnZlciA9ICgwLCBodHRwXzEuY3JlYXRlU2VydmVyKShmdW5jdGlvbiAocmVxLCByZXMpIHtcbiAgICAgICAgcmVzLndyaXRlSGVhZCg1MDEpO1xuICAgICAgICByZXMuZW5kKFwiTm90IEltcGxlbWVudGVkXCIpO1xuICAgIH0pO1xuICAgIC8vIGNyZWF0ZSBlbmdpbmUgc2VydmVyXG4gICAgY29uc3QgZW5naW5lID0gYXR0YWNoKHNlcnZlciwgb3B0aW9ucyk7XG4gICAgZW5naW5lLmh0dHBTZXJ2ZXIgPSBzZXJ2ZXI7XG4gICAgc2VydmVyLmxpc3Rlbihwb3J0LCBmbik7XG4gICAgcmV0dXJuIGVuZ2luZTtcbn1cbmV4cG9ydHMubGlzdGVuID0gbGlzdGVuO1xuLyoqXG4gKiBDYXB0dXJlcyB1cGdyYWRlIHJlcXVlc3RzIGZvciBhIGh0dHAuU2VydmVyLlxuICpcbiAqIEBwYXJhbSB7aHR0cC5TZXJ2ZXJ9IHNlcnZlclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1NlcnZlcn0gZW5naW5lIHNlcnZlclxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gYXR0YWNoKHNlcnZlciwgb3B0aW9ucykge1xuICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBzZXJ2ZXJfMS5TZXJ2ZXIob3B0aW9ucyk7XG4gICAgZW5naW5lLmF0dGFjaChzZXJ2ZXIsIG9wdGlvbnMpO1xuICAgIHJldHVybiBlbmdpbmU7XG59XG5leHBvcnRzLmF0dGFjaCA9IGF0dGFjaDtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gaW1wb3J0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc29ja2V0aW8vZW5naW5lLmlvLXBhcnNlci90cmVlLzIuMi54XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlY29kZVBheWxvYWRBc0JpbmFyeSA9IGV4cG9ydHMuZW5jb2RlUGF5bG9hZEFzQmluYXJ5ID0gZXhwb3J0cy5kZWNvZGVQYXlsb2FkID0gZXhwb3J0cy5lbmNvZGVQYXlsb2FkID0gZXhwb3J0cy5kZWNvZGVCYXNlNjRQYWNrZXQgPSBleHBvcnRzLmRlY29kZVBhY2tldCA9IGV4cG9ydHMuZW5jb2RlQmFzZTY0UGFja2V0ID0gZXhwb3J0cy5lbmNvZGVQYWNrZXQgPSBleHBvcnRzLnBhY2tldHMgPSBleHBvcnRzLnByb3RvY29sID0gdm9pZCAwO1xuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG52YXIgdXRmOCA9IHJlcXVpcmUoJy4vdXRmOCcpO1xuLyoqXG4gKiBDdXJyZW50IHByb3RvY29sIHZlcnNpb24uXG4gKi9cbmV4cG9ydHMucHJvdG9jb2wgPSAzO1xuY29uc3QgaGFzQmluYXJ5ID0gKHBhY2tldHMpID0+IHtcbiAgICBmb3IgKGNvbnN0IHBhY2tldCBvZiBwYWNrZXRzKSB7XG4gICAgICAgIGlmIChwYWNrZXQuZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyIHx8IEFycmF5QnVmZmVyLmlzVmlldyhwYWNrZXQuZGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG4vKipcbiAqIFBhY2tldCB0eXBlcy5cbiAqL1xuZXhwb3J0cy5wYWNrZXRzID0ge1xuICAgIG9wZW46IDAgLy8gbm9uLXdzXG4gICAgLFxuICAgIGNsb3NlOiAxIC8vIG5vbi13c1xuICAgICxcbiAgICBwaW5nOiAyLFxuICAgIHBvbmc6IDMsXG4gICAgbWVzc2FnZTogNCxcbiAgICB1cGdyYWRlOiA1LFxuICAgIG5vb3A6IDZcbn07XG52YXIgcGFja2V0c2xpc3QgPSBPYmplY3Qua2V5cyhleHBvcnRzLnBhY2tldHMpO1xuLyoqXG4gKiBQcmVtYWRlIGVycm9yIHBhY2tldC5cbiAqL1xudmFyIGVyciA9IHsgdHlwZTogJ2Vycm9yJywgZGF0YTogJ3BhcnNlciBlcnJvcicgfTtcbmNvbnN0IEVNUFRZX0JVRkZFUiA9IEJ1ZmZlci5jb25jYXQoW10pO1xuLyoqXG4gKiBFbmNvZGVzIGEgcGFja2V0LlxuICpcbiAqICAgICA8cGFja2V0IHR5cGUgaWQ+IFsgPGRhdGE+IF1cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgICA1aGVsbG8gd29ybGRcbiAqICAgICAzXG4gKiAgICAgNFxuICpcbiAqIEJpbmFyeSBpcyBlbmNvZGVkIGluIGFuIGlkZW50aWNhbCBwcmluY2lwbGVcbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZW5jb2RlUGFja2V0KHBhY2tldCwgc3VwcG9ydHNCaW5hcnksIHV0ZjhlbmNvZGUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHR5cGVvZiBzdXBwb3J0c0JpbmFyeSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYWxsYmFjayA9IHN1cHBvcnRzQmluYXJ5O1xuICAgICAgICBzdXBwb3J0c0JpbmFyeSA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdXRmOGVuY29kZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYWxsYmFjayA9IHV0ZjhlbmNvZGU7XG4gICAgICAgIHV0ZjhlbmNvZGUgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHBhY2tldC5kYXRhKSkge1xuICAgICAgICByZXR1cm4gZW5jb2RlQnVmZmVyKHBhY2tldCwgc3VwcG9ydHNCaW5hcnksIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocGFja2V0LmRhdGEgJiYgKHBhY2tldC5kYXRhLmJ1ZmZlciB8fCBwYWNrZXQuZGF0YSkgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gZW5jb2RlQnVmZmVyKHsgdHlwZTogcGFja2V0LnR5cGUsIGRhdGE6IGFycmF5QnVmZmVyVG9CdWZmZXIocGFja2V0LmRhdGEpIH0sIHN1cHBvcnRzQmluYXJ5LCBjYWxsYmFjayk7XG4gICAgfVxuICAgIC8vIFNlbmRpbmcgZGF0YSBhcyBhIHV0Zi04IHN0cmluZ1xuICAgIHZhciBlbmNvZGVkID0gZXhwb3J0cy5wYWNrZXRzW3BhY2tldC50eXBlXTtcbiAgICAvLyBkYXRhIGZyYWdtZW50IGlzIG9wdGlvbmFsXG4gICAgaWYgKHVuZGVmaW5lZCAhPT0gcGFja2V0LmRhdGEpIHtcbiAgICAgICAgZW5jb2RlZCArPSB1dGY4ZW5jb2RlID8gdXRmOC5lbmNvZGUoU3RyaW5nKHBhY2tldC5kYXRhKSwgeyBzdHJpY3Q6IGZhbHNlIH0pIDogU3RyaW5nKHBhY2tldC5kYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbGxiYWNrKCcnICsgZW5jb2RlZCk7XG59XG5leHBvcnRzLmVuY29kZVBhY2tldCA9IGVuY29kZVBhY2tldDtcbjtcbi8qKlxuICogRW5jb2RlIEJ1ZmZlciBkYXRhXG4gKi9cbmZ1bmN0aW9uIGVuY29kZUJ1ZmZlcihwYWNrZXQsIHN1cHBvcnRzQmluYXJ5LCBjYWxsYmFjaykge1xuICAgIGlmICghc3VwcG9ydHNCaW5hcnkpIHtcbiAgICAgICAgcmV0dXJuIGVuY29kZUJhc2U2NFBhY2tldChwYWNrZXQsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgdmFyIGRhdGEgPSBwYWNrZXQuZGF0YTtcbiAgICB2YXIgdHlwZUJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgxKTtcbiAgICB0eXBlQnVmZmVyWzBdID0gZXhwb3J0cy5wYWNrZXRzW3BhY2tldC50eXBlXTtcbiAgICByZXR1cm4gY2FsbGJhY2soQnVmZmVyLmNvbmNhdChbdHlwZUJ1ZmZlciwgZGF0YV0pKTtcbn1cbi8qKlxuICogRW5jb2RlcyBhIHBhY2tldCB3aXRoIGJpbmFyeSBkYXRhIGluIGEgYmFzZTY0IHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYWNrZXQsIGhhcyBgdHlwZWAgYW5kIGBkYXRhYFxuICogQHJldHVybiB7U3RyaW5nfSBiYXNlNjQgZW5jb2RlZCBtZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIGVuY29kZUJhc2U2NFBhY2tldChwYWNrZXQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGRhdGEgPSBCdWZmZXIuaXNCdWZmZXIocGFja2V0LmRhdGEpID8gcGFja2V0LmRhdGEgOiBhcnJheUJ1ZmZlclRvQnVmZmVyKHBhY2tldC5kYXRhKTtcbiAgICB2YXIgbWVzc2FnZSA9ICdiJyArIGV4cG9ydHMucGFja2V0c1twYWNrZXQudHlwZV07XG4gICAgbWVzc2FnZSArPSBkYXRhLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICByZXR1cm4gY2FsbGJhY2sobWVzc2FnZSk7XG59XG5leHBvcnRzLmVuY29kZUJhc2U2NFBhY2tldCA9IGVuY29kZUJhc2U2NFBhY2tldDtcbjtcbi8qKlxuICogRGVjb2RlcyBhIHBhY2tldC4gRGF0YSBhbHNvIGF2YWlsYWJsZSBhcyBhbiBBcnJheUJ1ZmZlciBpZiByZXF1ZXN0ZWQuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSB3aXRoIGB0eXBlYCBhbmQgYGRhdGFgIChpZiBhbnkpXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZGVjb2RlUGFja2V0KGRhdGEsIGJpbmFyeVR5cGUsIHV0ZjhkZWNvZGUpIHtcbiAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICAgIHZhciB0eXBlO1xuICAgIC8vIFN0cmluZyBkYXRhXG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICB0eXBlID0gZGF0YS5jaGFyQXQoMCk7XG4gICAgICAgIGlmICh0eXBlID09PSAnYicpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWNvZGVCYXNlNjRQYWNrZXQoZGF0YS5zdWJzdHIoMSksIGJpbmFyeVR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1dGY4ZGVjb2RlKSB7XG4gICAgICAgICAgICBkYXRhID0gdHJ5RGVjb2RlKGRhdGEpO1xuICAgICAgICAgICAgaWYgKGRhdGEgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoTnVtYmVyKHR5cGUpICE9IHR5cGUgfHwgIXBhY2tldHNsaXN0W3R5cGVdKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IHBhY2tldHNsaXN0W3R5cGVdLCBkYXRhOiBkYXRhLnN1YnN0cmluZygxKSB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHsgdHlwZTogcGFja2V0c2xpc3RbdHlwZV0gfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBCaW5hcnkgZGF0YVxuICAgIGlmIChiaW5hcnlUeXBlID09PSAnYXJyYXlidWZmZXInKSB7XG4gICAgICAgIC8vIHdyYXAgQnVmZmVyL0FycmF5QnVmZmVyIGRhdGEgaW50byBhbiBVaW50OEFycmF5XG4gICAgICAgIHZhciBpbnRBcnJheSA9IG5ldyBVaW50OEFycmF5KGRhdGEpO1xuICAgICAgICB0eXBlID0gaW50QXJyYXlbMF07XG4gICAgICAgIHJldHVybiB7IHR5cGU6IHBhY2tldHNsaXN0W3R5cGVdLCBkYXRhOiBpbnRBcnJheS5idWZmZXIuc2xpY2UoMSkgfTtcbiAgICB9XG4gICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgICBkYXRhID0gYXJyYXlCdWZmZXJUb0J1ZmZlcihkYXRhKTtcbiAgICB9XG4gICAgdHlwZSA9IGRhdGFbMF07XG4gICAgcmV0dXJuIHsgdHlwZTogcGFja2V0c2xpc3RbdHlwZV0sIGRhdGE6IGRhdGEuc2xpY2UoMSkgfTtcbn1cbmV4cG9ydHMuZGVjb2RlUGFja2V0ID0gZGVjb2RlUGFja2V0O1xuO1xuZnVuY3Rpb24gdHJ5RGVjb2RlKGRhdGEpIHtcbiAgICB0cnkge1xuICAgICAgICBkYXRhID0gdXRmOC5kZWNvZGUoZGF0YSwgeyBzdHJpY3Q6IGZhbHNlIH0pO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xufVxuLyoqXG4gKiBEZWNvZGVzIGEgcGFja2V0IGVuY29kZWQgaW4gYSBiYXNlNjQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBiYXNlNjQgZW5jb2RlZCBtZXNzYWdlXG4gKiBAcmV0dXJuIHtPYmplY3R9IHdpdGggYHR5cGVgIGFuZCBgZGF0YWAgKGlmIGFueSlcbiAqL1xuZnVuY3Rpb24gZGVjb2RlQmFzZTY0UGFja2V0KG1zZywgYmluYXJ5VHlwZSkge1xuICAgIHZhciB0eXBlID0gcGFja2V0c2xpc3RbbXNnLmNoYXJBdCgwKV07XG4gICAgdmFyIGRhdGEgPSBCdWZmZXIuZnJvbShtc2cuc3Vic3RyKDEpLCAnYmFzZTY0Jyk7XG4gICAgaWYgKGJpbmFyeVR5cGUgPT09ICdhcnJheWJ1ZmZlcicpIHtcbiAgICAgICAgdmFyIGFidiA9IG5ldyBVaW50OEFycmF5KGRhdGEubGVuZ3RoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhYnYubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFidltpXSA9IGRhdGFbaV07XG4gICAgICAgIH1cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBkYXRhID0gYWJ2LmJ1ZmZlcjtcbiAgICB9XG4gICAgcmV0dXJuIHsgdHlwZTogdHlwZSwgZGF0YTogZGF0YSB9O1xufVxuZXhwb3J0cy5kZWNvZGVCYXNlNjRQYWNrZXQgPSBkZWNvZGVCYXNlNjRQYWNrZXQ7XG47XG4vKipcbiAqIEVuY29kZXMgbXVsdGlwbGUgbWVzc2FnZXMgKHBheWxvYWQpLlxuICpcbiAqICAgICA8bGVuZ3RoPjpkYXRhXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgMTE6aGVsbG8gd29ybGQyOmhpXG4gKlxuICogSWYgYW55IGNvbnRlbnRzIGFyZSBiaW5hcnksIHRoZXkgd2lsbCBiZSBlbmNvZGVkIGFzIGJhc2U2NCBzdHJpbmdzLiBCYXNlNjRcbiAqIGVuY29kZWQgc3RyaW5ncyBhcmUgbWFya2VkIHdpdGggYSBiIGJlZm9yZSB0aGUgbGVuZ3RoIHNwZWNpZmllclxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHBhY2tldHNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBlbmNvZGVQYXlsb2FkKHBhY2tldHMsIHN1cHBvcnRzQmluYXJ5LCBjYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2Ygc3VwcG9ydHNCaW5hcnkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBzdXBwb3J0c0JpbmFyeTtcbiAgICAgICAgc3VwcG9ydHNCaW5hcnkgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoc3VwcG9ydHNCaW5hcnkgJiYgaGFzQmluYXJ5KHBhY2tldHMpKSB7XG4gICAgICAgIHJldHVybiBlbmNvZGVQYXlsb2FkQXNCaW5hcnkocGFja2V0cywgY2FsbGJhY2spO1xuICAgIH1cbiAgICBpZiAoIXBhY2tldHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjaygnMDonKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZW5jb2RlT25lKHBhY2tldCwgZG9uZUNhbGxiYWNrKSB7XG4gICAgICAgIGVuY29kZVBhY2tldChwYWNrZXQsIHN1cHBvcnRzQmluYXJ5LCBmYWxzZSwgZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGRvbmVDYWxsYmFjayhudWxsLCBzZXRMZW5ndGhIZWFkZXIobWVzc2FnZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbWFwKHBhY2tldHMsIGVuY29kZU9uZSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2socmVzdWx0cy5qb2luKCcnKSk7XG4gICAgfSk7XG59XG5leHBvcnRzLmVuY29kZVBheWxvYWQgPSBlbmNvZGVQYXlsb2FkO1xuO1xuZnVuY3Rpb24gc2V0TGVuZ3RoSGVhZGVyKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gbWVzc2FnZS5sZW5ndGggKyAnOicgKyBtZXNzYWdlO1xufVxuLyoqXG4gKiBBc3luYyBhcnJheSBtYXAgdXNpbmcgYWZ0ZXJcbiAqL1xuZnVuY3Rpb24gbWFwKGFyeSwgZWFjaCwgZG9uZSkge1xuICAgIGNvbnN0IHJlc3VsdHMgPSBuZXcgQXJyYXkoYXJ5Lmxlbmd0aCk7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyeS5sZW5ndGg7IGkrKykge1xuICAgICAgICBlYWNoKGFyeVtpXSwgKGVycm9yLCBtc2cpID0+IHtcbiAgICAgICAgICAgIHJlc3VsdHNbaV0gPSBtc2c7XG4gICAgICAgICAgICBpZiAoKytjb3VudCA9PT0gYXJ5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGRvbmUobnVsbCwgcmVzdWx0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbi8qXG4gKiBEZWNvZGVzIGRhdGEgd2hlbiBhIHBheWxvYWQgaXMgbWF5YmUgZXhwZWN0ZWQuIFBvc3NpYmxlIGJpbmFyeSBjb250ZW50cyBhcmVcbiAqIGRlY29kZWQgZnJvbSB0aGVpciBiYXNlNjQgcmVwcmVzZW50YXRpb25cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YSwgY2FsbGJhY2sgbWV0aG9kXG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBkZWNvZGVQYXlsb2FkKGRhdGEsIGJpbmFyeVR5cGUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHR5cGVvZiBkYXRhICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gZGVjb2RlUGF5bG9hZEFzQmluYXJ5KGRhdGEsIGJpbmFyeVR5cGUsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBiaW5hcnlUeXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrID0gYmluYXJ5VHlwZTtcbiAgICAgICAgYmluYXJ5VHlwZSA9IG51bGw7XG4gICAgfVxuICAgIGlmIChkYXRhID09PSAnJykge1xuICAgICAgICAvLyBwYXJzZXIgZXJyb3IgLSBpZ25vcmluZyBwYXlsb2FkXG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIDAsIDEpO1xuICAgIH1cbiAgICB2YXIgbGVuZ3RoID0gJycsIG4sIG1zZywgcGFja2V0O1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gZGF0YS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIGNociA9IGRhdGEuY2hhckF0KGkpO1xuICAgICAgICBpZiAoY2hyICE9PSAnOicpIHtcbiAgICAgICAgICAgIGxlbmd0aCArPSBjaHI7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGlmIChsZW5ndGggPT09ICcnIHx8IChsZW5ndGggIT0gKG4gPSBOdW1iZXIobGVuZ3RoKSkpKSB7XG4gICAgICAgICAgICAvLyBwYXJzZXIgZXJyb3IgLSBpZ25vcmluZyBwYXlsb2FkXG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCAwLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBtc2cgPSBkYXRhLnN1YnN0cihpICsgMSwgbik7XG4gICAgICAgIGlmIChsZW5ndGggIT0gbXNnLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gcGFyc2VyIGVycm9yIC0gaWdub3JpbmcgcGF5bG9hZFxuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgMCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1zZy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBhY2tldCA9IGRlY29kZVBhY2tldChtc2csIGJpbmFyeVR5cGUsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChlcnIudHlwZSA9PT0gcGFja2V0LnR5cGUgJiYgZXJyLmRhdGEgPT09IHBhY2tldC5kYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gcGFyc2VyIGVycm9yIGluIGluZGl2aWR1YWwgcGFja2V0IC0gaWdub3JpbmcgcGF5bG9hZFxuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIDAsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1vcmUgPSBjYWxsYmFjayhwYWNrZXQsIGkgKyBuLCBsKTtcbiAgICAgICAgICAgIGlmIChmYWxzZSA9PT0gbW9yZSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gYWR2YW5jZSBjdXJzb3JcbiAgICAgICAgaSArPSBuO1xuICAgICAgICBsZW5ndGggPSAnJztcbiAgICB9XG4gICAgaWYgKGxlbmd0aCAhPT0gJycpIHtcbiAgICAgICAgLy8gcGFyc2VyIGVycm9yIC0gaWdub3JpbmcgcGF5bG9hZFxuICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCAwLCAxKTtcbiAgICB9XG59XG5leHBvcnRzLmRlY29kZVBheWxvYWQgPSBkZWNvZGVQYXlsb2FkO1xuO1xuLyoqXG4gKlxuICogQ29udmVydHMgYSBidWZmZXIgdG8gYSB1dGY4LmpzIGVuY29kZWQgc3RyaW5nXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGJ1ZmZlclRvU3RyaW5nKGJ1ZmZlcikge1xuICAgIHZhciBzdHIgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGJ1ZmZlci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmZmVyW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn1cbi8qKlxuICpcbiAqIENvbnZlcnRzIGEgdXRmOC5qcyBlbmNvZGVkIHN0cmluZyB0byBhIGJ1ZmZlclxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBzdHJpbmdUb0J1ZmZlcihzdHJpbmcpIHtcbiAgICB2YXIgYnVmID0gQnVmZmVyLmFsbG9jVW5zYWZlKHN0cmluZy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gc3RyaW5nLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBidWYud3JpdGVVSW50OChzdHJpbmcuY2hhckNvZGVBdChpKSwgaSk7XG4gICAgfVxuICAgIHJldHVybiBidWY7XG59XG4vKipcbiAqXG4gKiBDb252ZXJ0cyBhbiBBcnJheUJ1ZmZlciB0byBhIEJ1ZmZlclxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBhcnJheUJ1ZmZlclRvQnVmZmVyKGRhdGEpIHtcbiAgICAvLyBkYXRhIGlzIGVpdGhlciBhbiBBcnJheUJ1ZmZlciBvciBBcnJheUJ1ZmZlclZpZXcuXG4gICAgdmFyIGxlbmd0aCA9IGRhdGEuYnl0ZUxlbmd0aCB8fCBkYXRhLmxlbmd0aDtcbiAgICB2YXIgb2Zmc2V0ID0gZGF0YS5ieXRlT2Zmc2V0IHx8IDA7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGRhdGEuYnVmZmVyIHx8IGRhdGEsIG9mZnNldCwgbGVuZ3RoKTtcbn1cbi8qKlxuICogRW5jb2RlcyBtdWx0aXBsZSBtZXNzYWdlcyAocGF5bG9hZCkgYXMgYmluYXJ5LlxuICpcbiAqIDwxID0gYmluYXJ5LCAwID0gc3RyaW5nPjxudW1iZXIgZnJvbSAwLTk+PG51bWJlciBmcm9tIDAtOT5bLi4uXTxudW1iZXJcbiAqIDI1NT48ZGF0YT5cbiAqXG4gKiBFeGFtcGxlOlxuICogMSAzIDI1NSAxIDIgMywgaWYgdGhlIGJpbmFyeSBjb250ZW50cyBhcmUgaW50ZXJwcmV0ZWQgYXMgOCBiaXQgaW50ZWdlcnNcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwYWNrZXRzXG4gKiBAcmV0dXJuIHtCdWZmZXJ9IGVuY29kZWQgcGF5bG9hZFxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGVuY29kZVBheWxvYWRBc0JpbmFyeShwYWNrZXRzLCBjYWxsYmFjaykge1xuICAgIGlmICghcGFja2V0cy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKEVNUFRZX0JVRkZFUik7XG4gICAgfVxuICAgIG1hcChwYWNrZXRzLCBlbmNvZGVPbmVCaW5hcnlQYWNrZXQsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKEJ1ZmZlci5jb25jYXQocmVzdWx0cykpO1xuICAgIH0pO1xufVxuZXhwb3J0cy5lbmNvZGVQYXlsb2FkQXNCaW5hcnkgPSBlbmNvZGVQYXlsb2FkQXNCaW5hcnk7XG47XG5mdW5jdGlvbiBlbmNvZGVPbmVCaW5hcnlQYWNrZXQocCwgZG9uZUNhbGxiYWNrKSB7XG4gICAgZnVuY3Rpb24gb25CaW5hcnlQYWNrZXRFbmNvZGUocGFja2V0KSB7XG4gICAgICAgIHZhciBlbmNvZGluZ0xlbmd0aCA9ICcnICsgcGFja2V0Lmxlbmd0aDtcbiAgICAgICAgdmFyIHNpemVCdWZmZXI7XG4gICAgICAgIGlmICh0eXBlb2YgcGFja2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgc2l6ZUJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShlbmNvZGluZ0xlbmd0aC5sZW5ndGggKyAyKTtcbiAgICAgICAgICAgIHNpemVCdWZmZXJbMF0gPSAwOyAvLyBpcyBhIHN0cmluZyAobm90IHRydWUgYmluYXJ5ID0gMClcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW5jb2RpbmdMZW5ndGgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzaXplQnVmZmVyW2kgKyAxXSA9IHBhcnNlSW50KGVuY29kaW5nTGVuZ3RoW2ldLCAxMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaXplQnVmZmVyW3NpemVCdWZmZXIubGVuZ3RoIC0gMV0gPSAyNTU7XG4gICAgICAgICAgICByZXR1cm4gZG9uZUNhbGxiYWNrKG51bGwsIEJ1ZmZlci5jb25jYXQoW3NpemVCdWZmZXIsIHN0cmluZ1RvQnVmZmVyKHBhY2tldCldKSk7XG4gICAgICAgIH1cbiAgICAgICAgc2l6ZUJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShlbmNvZGluZ0xlbmd0aC5sZW5ndGggKyAyKTtcbiAgICAgICAgc2l6ZUJ1ZmZlclswXSA9IDE7IC8vIGlzIGJpbmFyeSAodHJ1ZSBiaW5hcnkgPSAxKVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVuY29kaW5nTGVuZ3RoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzaXplQnVmZmVyW2kgKyAxXSA9IHBhcnNlSW50KGVuY29kaW5nTGVuZ3RoW2ldLCAxMCk7XG4gICAgICAgIH1cbiAgICAgICAgc2l6ZUJ1ZmZlcltzaXplQnVmZmVyLmxlbmd0aCAtIDFdID0gMjU1O1xuICAgICAgICBkb25lQ2FsbGJhY2sobnVsbCwgQnVmZmVyLmNvbmNhdChbc2l6ZUJ1ZmZlciwgcGFja2V0XSkpO1xuICAgIH1cbiAgICBlbmNvZGVQYWNrZXQocCwgdHJ1ZSwgdHJ1ZSwgb25CaW5hcnlQYWNrZXRFbmNvZGUpO1xufVxuLypcbiAqIERlY29kZXMgZGF0YSB3aGVuIGEgcGF5bG9hZCBpcyBtYXliZSBleHBlY3RlZC4gU3RyaW5ncyBhcmUgZGVjb2RlZCBieVxuICogaW50ZXJwcmV0aW5nIGVhY2ggYnl0ZSBhcyBhIGtleSBjb2RlIGZvciBlbnRyaWVzIG1hcmtlZCB0byBzdGFydCB3aXRoIDAuIFNlZVxuICogZGVzY3JpcHRpb24gb2YgZW5jb2RlUGF5bG9hZEFzQmluYXJ5XG5cbiAqIEBwYXJhbSB7QnVmZmVyfSBkYXRhLCBjYWxsYmFjayBtZXRob2RcbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIGRlY29kZVBheWxvYWRBc0JpbmFyeShkYXRhLCBiaW5hcnlUeXBlLCBjYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2YgYmluYXJ5VHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYWxsYmFjayA9IGJpbmFyeVR5cGU7XG4gICAgICAgIGJpbmFyeVR5cGUgPSBudWxsO1xuICAgIH1cbiAgICB2YXIgYnVmZmVyVGFpbCA9IGRhdGE7XG4gICAgdmFyIGJ1ZmZlcnMgPSBbXTtcbiAgICB2YXIgaTtcbiAgICB3aGlsZSAoYnVmZmVyVGFpbC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBzdHJMZW4gPSAnJztcbiAgICAgICAgdmFyIGlzU3RyaW5nID0gYnVmZmVyVGFpbFswXSA9PT0gMDtcbiAgICAgICAgZm9yIChpID0gMTs7IGkrKykge1xuICAgICAgICAgICAgaWYgKGJ1ZmZlclRhaWxbaV0gPT09IDI1NSlcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIC8vIDMxMCA9IGNoYXIgbGVuZ3RoIG9mIE51bWJlci5NQVhfVkFMVUVcbiAgICAgICAgICAgIGlmIChzdHJMZW4ubGVuZ3RoID4gMzEwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgMCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdHJMZW4gKz0gJycgKyBidWZmZXJUYWlsW2ldO1xuICAgICAgICB9XG4gICAgICAgIGJ1ZmZlclRhaWwgPSBidWZmZXJUYWlsLnNsaWNlKHN0ckxlbi5sZW5ndGggKyAxKTtcbiAgICAgICAgdmFyIG1zZ0xlbmd0aCA9IHBhcnNlSW50KHN0ckxlbiwgMTApO1xuICAgICAgICB2YXIgbXNnID0gYnVmZmVyVGFpbC5zbGljZSgxLCBtc2dMZW5ndGggKyAxKTtcbiAgICAgICAgaWYgKGlzU3RyaW5nKVxuICAgICAgICAgICAgbXNnID0gYnVmZmVyVG9TdHJpbmcobXNnKTtcbiAgICAgICAgYnVmZmVycy5wdXNoKG1zZyk7XG4gICAgICAgIGJ1ZmZlclRhaWwgPSBidWZmZXJUYWlsLnNsaWNlKG1zZ0xlbmd0aCArIDEpO1xuICAgIH1cbiAgICB2YXIgdG90YWwgPSBidWZmZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdG90YWw7IGkrKykge1xuICAgICAgICB2YXIgYnVmZmVyID0gYnVmZmVyc1tpXTtcbiAgICAgICAgY2FsbGJhY2soZGVjb2RlUGFja2V0KGJ1ZmZlciwgYmluYXJ5VHlwZSwgdHJ1ZSksIGksIHRvdGFsKTtcbiAgICB9XG59XG5leHBvcnRzLmRlY29kZVBheWxvYWRBc0JpbmFyeSA9IGRlY29kZVBheWxvYWRBc0JpbmFyeTtcbjtcbiIsIi8qISBodHRwczovL210aHMuYmUvdXRmOGpzIHYyLjEuMiBieSBAbWF0aGlhcyAqL1xudmFyIHN0cmluZ0Zyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG4vLyBUYWtlbiBmcm9tIGh0dHBzOi8vbXRocy5iZS9wdW55Y29kZVxuZnVuY3Rpb24gdWNzMmRlY29kZShzdHJpbmcpIHtcbiAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciB2YWx1ZTtcbiAgICB2YXIgZXh0cmE7XG4gICAgd2hpbGUgKGNvdW50ZXIgPCBsZW5ndGgpIHtcbiAgICAgICAgdmFsdWUgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuICAgICAgICBpZiAodmFsdWUgPj0gMHhEODAwICYmIHZhbHVlIDw9IDB4REJGRiAmJiBjb3VudGVyIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBoaWdoIHN1cnJvZ2F0ZSwgYW5kIHRoZXJlIGlzIGEgbmV4dCBjaGFyYWN0ZXJcbiAgICAgICAgICAgIGV4dHJhID0gc3RyaW5nLmNoYXJDb2RlQXQoY291bnRlcisrKTtcbiAgICAgICAgICAgIGlmICgoZXh0cmEgJiAweEZDMDApID09IDB4REMwMCkgeyAvLyBsb3cgc3Vycm9nYXRlXG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goKCh2YWx1ZSAmIDB4M0ZGKSA8PCAxMCkgKyAoZXh0cmEgJiAweDNGRikgKyAweDEwMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHVubWF0Y2hlZCBzdXJyb2dhdGU7IG9ubHkgYXBwZW5kIHRoaXMgY29kZSB1bml0LCBpbiBjYXNlIHRoZSBuZXh0XG4gICAgICAgICAgICAgICAgLy8gY29kZSB1bml0IGlzIHRoZSBoaWdoIHN1cnJvZ2F0ZSBvZiBhIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgIGNvdW50ZXItLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xufVxuLy8gVGFrZW4gZnJvbSBodHRwczovL210aHMuYmUvcHVueWNvZGVcbmZ1bmN0aW9uIHVjczJlbmNvZGUoYXJyYXkpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgIHZhciBpbmRleCA9IC0xO1xuICAgIHZhciB2YWx1ZTtcbiAgICB2YXIgb3V0cHV0ID0gJyc7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgICAgIGlmICh2YWx1ZSA+IDB4RkZGRikge1xuICAgICAgICAgICAgdmFsdWUgLT0gMHgxMDAwMDtcbiAgICAgICAgICAgIG91dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApO1xuICAgICAgICAgICAgdmFsdWUgPSAweERDMDAgfCB2YWx1ZSAmIDB4M0ZGO1xuICAgICAgICB9XG4gICAgICAgIG91dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xufVxuZnVuY3Rpb24gY2hlY2tTY2FsYXJWYWx1ZShjb2RlUG9pbnQsIHN0cmljdCkge1xuICAgIGlmIChjb2RlUG9pbnQgPj0gMHhEODAwICYmIGNvZGVQb2ludCA8PSAweERGRkYpIHtcbiAgICAgICAgaWYgKHN0cmljdCkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ0xvbmUgc3Vycm9nYXRlIFUrJyArIGNvZGVQb2ludC50b1N0cmluZygxNikudG9VcHBlckNhc2UoKSArXG4gICAgICAgICAgICAgICAgJyBpcyBub3QgYSBzY2FsYXIgdmFsdWUnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5mdW5jdGlvbiBjcmVhdGVCeXRlKGNvZGVQb2ludCwgc2hpZnQpIHtcbiAgICByZXR1cm4gc3RyaW5nRnJvbUNoYXJDb2RlKCgoY29kZVBvaW50ID4+IHNoaWZ0KSAmIDB4M0YpIHwgMHg4MCk7XG59XG5mdW5jdGlvbiBlbmNvZGVDb2RlUG9pbnQoY29kZVBvaW50LCBzdHJpY3QpIHtcbiAgICBpZiAoKGNvZGVQb2ludCAmIDB4RkZGRkZGODApID09IDApIHsgLy8gMS1ieXRlIHNlcXVlbmNlXG4gICAgICAgIHJldHVybiBzdHJpbmdGcm9tQ2hhckNvZGUoY29kZVBvaW50KTtcbiAgICB9XG4gICAgdmFyIHN5bWJvbCA9ICcnO1xuICAgIGlmICgoY29kZVBvaW50ICYgMHhGRkZGRjgwMCkgPT0gMCkgeyAvLyAyLWJ5dGUgc2VxdWVuY2VcbiAgICAgICAgc3ltYm9sID0gc3RyaW5nRnJvbUNoYXJDb2RlKCgoY29kZVBvaW50ID4+IDYpICYgMHgxRikgfCAweEMwKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoKGNvZGVQb2ludCAmIDB4RkZGRjAwMDApID09IDApIHsgLy8gMy1ieXRlIHNlcXVlbmNlXG4gICAgICAgIGlmICghY2hlY2tTY2FsYXJWYWx1ZShjb2RlUG9pbnQsIHN0cmljdCkpIHtcbiAgICAgICAgICAgIGNvZGVQb2ludCA9IDB4RkZGRDtcbiAgICAgICAgfVxuICAgICAgICBzeW1ib2wgPSBzdHJpbmdGcm9tQ2hhckNvZGUoKChjb2RlUG9pbnQgPj4gMTIpICYgMHgwRikgfCAweEUwKTtcbiAgICAgICAgc3ltYm9sICs9IGNyZWF0ZUJ5dGUoY29kZVBvaW50LCA2KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoKGNvZGVQb2ludCAmIDB4RkZFMDAwMDApID09IDApIHsgLy8gNC1ieXRlIHNlcXVlbmNlXG4gICAgICAgIHN5bWJvbCA9IHN0cmluZ0Zyb21DaGFyQ29kZSgoKGNvZGVQb2ludCA+PiAxOCkgJiAweDA3KSB8IDB4RjApO1xuICAgICAgICBzeW1ib2wgKz0gY3JlYXRlQnl0ZShjb2RlUG9pbnQsIDEyKTtcbiAgICAgICAgc3ltYm9sICs9IGNyZWF0ZUJ5dGUoY29kZVBvaW50LCA2KTtcbiAgICB9XG4gICAgc3ltYm9sICs9IHN0cmluZ0Zyb21DaGFyQ29kZSgoY29kZVBvaW50ICYgMHgzRikgfCAweDgwKTtcbiAgICByZXR1cm4gc3ltYm9sO1xufVxuZnVuY3Rpb24gdXRmOGVuY29kZShzdHJpbmcsIG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICB2YXIgc3RyaWN0ID0gZmFsc2UgIT09IG9wdHMuc3RyaWN0O1xuICAgIHZhciBjb2RlUG9pbnRzID0gdWNzMmRlY29kZShzdHJpbmcpO1xuICAgIHZhciBsZW5ndGggPSBjb2RlUG9pbnRzLmxlbmd0aDtcbiAgICB2YXIgaW5kZXggPSAtMTtcbiAgICB2YXIgY29kZVBvaW50O1xuICAgIHZhciBieXRlU3RyaW5nID0gJyc7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgY29kZVBvaW50ID0gY29kZVBvaW50c1tpbmRleF07XG4gICAgICAgIGJ5dGVTdHJpbmcgKz0gZW5jb2RlQ29kZVBvaW50KGNvZGVQb2ludCwgc3RyaWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIGJ5dGVTdHJpbmc7XG59XG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmZ1bmN0aW9uIHJlYWRDb250aW51YXRpb25CeXRlKCkge1xuICAgIGlmIChieXRlSW5kZXggPj0gYnl0ZUNvdW50KSB7XG4gICAgICAgIHRocm93IEVycm9yKCdJbnZhbGlkIGJ5dGUgaW5kZXgnKTtcbiAgICB9XG4gICAgdmFyIGNvbnRpbnVhdGlvbkJ5dGUgPSBieXRlQXJyYXlbYnl0ZUluZGV4XSAmIDB4RkY7XG4gICAgYnl0ZUluZGV4Kys7XG4gICAgaWYgKChjb250aW51YXRpb25CeXRlICYgMHhDMCkgPT0gMHg4MCkge1xuICAgICAgICByZXR1cm4gY29udGludWF0aW9uQnl0ZSAmIDB4M0Y7XG4gICAgfVxuICAgIC8vIElmIHdlIGVuZCB1cCBoZXJlLCBpdOKAmXMgbm90IGEgY29udGludWF0aW9uIGJ5dGVcbiAgICB0aHJvdyBFcnJvcignSW52YWxpZCBjb250aW51YXRpb24gYnl0ZScpO1xufVxuZnVuY3Rpb24gZGVjb2RlU3ltYm9sKHN0cmljdCkge1xuICAgIHZhciBieXRlMTtcbiAgICB2YXIgYnl0ZTI7XG4gICAgdmFyIGJ5dGUzO1xuICAgIHZhciBieXRlNDtcbiAgICB2YXIgY29kZVBvaW50O1xuICAgIGlmIChieXRlSW5kZXggPiBieXRlQ291bnQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0ludmFsaWQgYnl0ZSBpbmRleCcpO1xuICAgIH1cbiAgICBpZiAoYnl0ZUluZGV4ID09IGJ5dGVDb3VudCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIFJlYWQgZmlyc3QgYnl0ZVxuICAgIGJ5dGUxID0gYnl0ZUFycmF5W2J5dGVJbmRleF0gJiAweEZGO1xuICAgIGJ5dGVJbmRleCsrO1xuICAgIC8vIDEtYnl0ZSBzZXF1ZW5jZSAobm8gY29udGludWF0aW9uIGJ5dGVzKVxuICAgIGlmICgoYnl0ZTEgJiAweDgwKSA9PSAwKSB7XG4gICAgICAgIHJldHVybiBieXRlMTtcbiAgICB9XG4gICAgLy8gMi1ieXRlIHNlcXVlbmNlXG4gICAgaWYgKChieXRlMSAmIDB4RTApID09IDB4QzApIHtcbiAgICAgICAgYnl0ZTIgPSByZWFkQ29udGludWF0aW9uQnl0ZSgpO1xuICAgICAgICBjb2RlUG9pbnQgPSAoKGJ5dGUxICYgMHgxRikgPDwgNikgfCBieXRlMjtcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+PSAweDgwKSB7XG4gICAgICAgICAgICByZXR1cm4gY29kZVBvaW50O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ0ludmFsaWQgY29udGludWF0aW9uIGJ5dGUnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyAzLWJ5dGUgc2VxdWVuY2UgKG1heSBpbmNsdWRlIHVucGFpcmVkIHN1cnJvZ2F0ZXMpXG4gICAgaWYgKChieXRlMSAmIDB4RjApID09IDB4RTApIHtcbiAgICAgICAgYnl0ZTIgPSByZWFkQ29udGludWF0aW9uQnl0ZSgpO1xuICAgICAgICBieXRlMyA9IHJlYWRDb250aW51YXRpb25CeXRlKCk7XG4gICAgICAgIGNvZGVQb2ludCA9ICgoYnl0ZTEgJiAweDBGKSA8PCAxMikgfCAoYnl0ZTIgPDwgNikgfCBieXRlMztcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+PSAweDA4MDApIHtcbiAgICAgICAgICAgIHJldHVybiBjaGVja1NjYWxhclZhbHVlKGNvZGVQb2ludCwgc3RyaWN0KSA/IGNvZGVQb2ludCA6IDB4RkZGRDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdJbnZhbGlkIGNvbnRpbnVhdGlvbiBieXRlJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gNC1ieXRlIHNlcXVlbmNlXG4gICAgaWYgKChieXRlMSAmIDB4RjgpID09IDB4RjApIHtcbiAgICAgICAgYnl0ZTIgPSByZWFkQ29udGludWF0aW9uQnl0ZSgpO1xuICAgICAgICBieXRlMyA9IHJlYWRDb250aW51YXRpb25CeXRlKCk7XG4gICAgICAgIGJ5dGU0ID0gcmVhZENvbnRpbnVhdGlvbkJ5dGUoKTtcbiAgICAgICAgY29kZVBvaW50ID0gKChieXRlMSAmIDB4MDcpIDw8IDB4MTIpIHwgKGJ5dGUyIDw8IDB4MEMpIHxcbiAgICAgICAgICAgIChieXRlMyA8PCAweDA2KSB8IGJ5dGU0O1xuICAgICAgICBpZiAoY29kZVBvaW50ID49IDB4MDEwMDAwICYmIGNvZGVQb2ludCA8PSAweDEwRkZGRikge1xuICAgICAgICAgICAgcmV0dXJuIGNvZGVQb2ludDtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBFcnJvcignSW52YWxpZCBVVEYtOCBkZXRlY3RlZCcpO1xufVxudmFyIGJ5dGVBcnJheTtcbnZhciBieXRlQ291bnQ7XG52YXIgYnl0ZUluZGV4O1xuZnVuY3Rpb24gdXRmOGRlY29kZShieXRlU3RyaW5nLCBvcHRzKSB7XG4gICAgb3B0cyA9IG9wdHMgfHwge307XG4gICAgdmFyIHN0cmljdCA9IGZhbHNlICE9PSBvcHRzLnN0cmljdDtcbiAgICBieXRlQXJyYXkgPSB1Y3MyZGVjb2RlKGJ5dGVTdHJpbmcpO1xuICAgIGJ5dGVDb3VudCA9IGJ5dGVBcnJheS5sZW5ndGg7XG4gICAgYnl0ZUluZGV4ID0gMDtcbiAgICB2YXIgY29kZVBvaW50cyA9IFtdO1xuICAgIHZhciB0bXA7XG4gICAgd2hpbGUgKCh0bXAgPSBkZWNvZGVTeW1ib2woc3RyaWN0KSkgIT09IGZhbHNlKSB7XG4gICAgICAgIGNvZGVQb2ludHMucHVzaCh0bXApO1xuICAgIH1cbiAgICByZXR1cm4gdWNzMmVuY29kZShjb2RlUG9pbnRzKTtcbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHZlcnNpb246ICcyLjEuMicsXG4gICAgZW5jb2RlOiB1dGY4ZW5jb2RlLFxuICAgIGRlY29kZTogdXRmOGRlY29kZVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TZXJ2ZXIgPSBleHBvcnRzLkJhc2VTZXJ2ZXIgPSB2b2lkIDA7XG5jb25zdCBxcyA9IHJlcXVpcmUoXCJxdWVyeXN0cmluZ1wiKTtcbmNvbnN0IHVybF8xID0gcmVxdWlyZShcInVybFwiKTtcbmNvbnN0IGJhc2U2NGlkID0gcmVxdWlyZShcImJhc2U2NGlkXCIpO1xuY29uc3QgdHJhbnNwb3J0c18xID0gcmVxdWlyZShcIi4vdHJhbnNwb3J0c1wiKTtcbmNvbnN0IGV2ZW50c18xID0gcmVxdWlyZShcImV2ZW50c1wiKTtcbmNvbnN0IHNvY2tldF8xID0gcmVxdWlyZShcIi4vc29ja2V0XCIpO1xuY29uc3QgZGVidWdfMSA9IHJlcXVpcmUoXCJkZWJ1Z1wiKTtcbmNvbnN0IGNvb2tpZV8xID0gcmVxdWlyZShcImNvb2tpZVwiKTtcbmNvbnN0IHdzXzEgPSByZXF1aXJlKFwid3NcIik7XG5jb25zdCBkZWJ1ZyA9ICgwLCBkZWJ1Z18xLmRlZmF1bHQpKFwiZW5naW5lXCIpO1xuY2xhc3MgQmFzZVNlcnZlciBleHRlbmRzIGV2ZW50c18xLkV2ZW50RW1pdHRlciB7XG4gICAgLyoqXG4gICAgICogU2VydmVyIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdHMgLSBvcHRpb25zXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jbGllbnRzID0ge307XG4gICAgICAgIHRoaXMuY2xpZW50c0NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5vcHRzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICB3c0VuZ2luZTogd3NfMS5TZXJ2ZXIsXG4gICAgICAgICAgICBwaW5nVGltZW91dDogMjAwMDAsXG4gICAgICAgICAgICBwaW5nSW50ZXJ2YWw6IDI1MDAwLFxuICAgICAgICAgICAgdXBncmFkZVRpbWVvdXQ6IDEwMDAwLFxuICAgICAgICAgICAgbWF4SHR0cEJ1ZmZlclNpemU6IDFlNixcbiAgICAgICAgICAgIHRyYW5zcG9ydHM6IE9iamVjdC5rZXlzKHRyYW5zcG9ydHNfMS5kZWZhdWx0KSxcbiAgICAgICAgICAgIGFsbG93VXBncmFkZXM6IHRydWUsXG4gICAgICAgICAgICBodHRwQ29tcHJlc3Npb246IHtcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQ6IDEwMjRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb3JzOiBmYWxzZSxcbiAgICAgICAgICAgIGFsbG93RUlPMzogZmFsc2VcbiAgICAgICAgfSwgb3B0cyk7XG4gICAgICAgIGlmIChvcHRzLmNvb2tpZSkge1xuICAgICAgICAgICAgdGhpcy5vcHRzLmNvb2tpZSA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgICAgIG5hbWU6IFwiaW9cIixcbiAgICAgICAgICAgICAgICBwYXRoOiBcIi9cIixcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgaHR0cE9ubHk6IG9wdHMuY29va2llLnBhdGggIT09IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNhbWVTaXRlOiBcImxheFwiXG4gICAgICAgICAgICB9LCBvcHRzLmNvb2tpZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0cy5jb3JzKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnNNaWRkbGV3YXJlID0gcmVxdWlyZShcImNvcnNcIikodGhpcy5vcHRzLmNvcnMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRzLnBlck1lc3NhZ2VEZWZsYXRlKSB7XG4gICAgICAgICAgICB0aGlzLm9wdHMucGVyTWVzc2FnZURlZmxhdGUgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQ6IDEwMjRcbiAgICAgICAgICAgIH0sIG9wdHMucGVyTWVzc2FnZURlZmxhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbGlzdCBvZiBhdmFpbGFibGUgdHJhbnNwb3J0cyBmb3IgdXBncmFkZSBnaXZlbiBhIGNlcnRhaW4gdHJhbnNwb3J0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cbiAgICB1cGdyYWRlcyh0cmFuc3BvcnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdHMuYWxsb3dVcGdyYWRlcylcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgcmV0dXJuIHRyYW5zcG9ydHNfMS5kZWZhdWx0W3RyYW5zcG9ydF0udXBncmFkZXNUbyB8fCBbXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVmVyaWZpZXMgYSByZXF1ZXN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtodHRwLkluY29taW5nTWVzc2FnZX1cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB3aGV0aGVyIHRoZSByZXF1ZXN0IGlzIHZhbGlkXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgdmVyaWZ5KHJlcSwgdXBncmFkZSwgZm4pIHtcbiAgICAgICAgLy8gdHJhbnNwb3J0IGNoZWNrXG4gICAgICAgIGNvbnN0IHRyYW5zcG9ydCA9IHJlcS5fcXVlcnkudHJhbnNwb3J0O1xuICAgICAgICBpZiAoIX50aGlzLm9wdHMudHJhbnNwb3J0cy5pbmRleE9mKHRyYW5zcG9ydCkpIHtcbiAgICAgICAgICAgIGRlYnVnKCd1bmtub3duIHRyYW5zcG9ydCBcIiVzXCInLCB0cmFuc3BvcnQpO1xuICAgICAgICAgICAgcmV0dXJuIGZuKFNlcnZlci5lcnJvcnMuVU5LTk9XTl9UUkFOU1BPUlQsIHsgdHJhbnNwb3J0IH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vICdPcmlnaW4nIGhlYWRlciBjaGVja1xuICAgICAgICBjb25zdCBpc09yaWdpbkludmFsaWQgPSBjaGVja0ludmFsaWRIZWFkZXJDaGFyKHJlcS5oZWFkZXJzLm9yaWdpbik7XG4gICAgICAgIGlmIChpc09yaWdpbkludmFsaWQpIHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbiA9IHJlcS5oZWFkZXJzLm9yaWdpbjtcbiAgICAgICAgICAgIHJlcS5oZWFkZXJzLm9yaWdpbiA9IG51bGw7XG4gICAgICAgICAgICBkZWJ1ZyhcIm9yaWdpbiBoZWFkZXIgaW52YWxpZFwiKTtcbiAgICAgICAgICAgIHJldHVybiBmbihTZXJ2ZXIuZXJyb3JzLkJBRF9SRVFVRVNULCB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJJTlZBTElEX09SSUdJTlwiLFxuICAgICAgICAgICAgICAgIG9yaWdpblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2lkIGNoZWNrXG4gICAgICAgIGNvbnN0IHNpZCA9IHJlcS5fcXVlcnkuc2lkO1xuICAgICAgICBpZiAoc2lkKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY2xpZW50cy5oYXNPd25Qcm9wZXJ0eShzaWQpKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ3Vua25vd24gc2lkIFwiJXNcIicsIHNpZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuKFNlcnZlci5lcnJvcnMuVU5LTk9XTl9TSUQsIHtcbiAgICAgICAgICAgICAgICAgICAgc2lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c1RyYW5zcG9ydCA9IHRoaXMuY2xpZW50c1tzaWRdLnRyYW5zcG9ydC5uYW1lO1xuICAgICAgICAgICAgaWYgKCF1cGdyYWRlICYmIHByZXZpb3VzVHJhbnNwb3J0ICE9PSB0cmFuc3BvcnQpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhcImJhZCByZXF1ZXN0OiB1bmV4cGVjdGVkIHRyYW5zcG9ydCB3aXRob3V0IHVwZ3JhZGVcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuKFNlcnZlci5lcnJvcnMuQkFEX1JFUVVFU1QsIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJUUkFOU1BPUlRfTUlTTUFUQ0hcIixcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNwb3J0LFxuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c1RyYW5zcG9ydFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gaGFuZHNoYWtlIGlzIEdFVCBvbmx5XG4gICAgICAgICAgICBpZiAoXCJHRVRcIiAhPT0gcmVxLm1ldGhvZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbihTZXJ2ZXIuZXJyb3JzLkJBRF9IQU5EU0hBS0VfTUVUSE9ELCB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogcmVxLm1ldGhvZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdHMuYWxsb3dSZXF1ZXN0KVxuICAgICAgICAgICAgICAgIHJldHVybiBmbigpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0cy5hbGxvd1JlcXVlc3QocmVxLCAobWVzc2FnZSwgc3VjY2VzcykgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4oU2VydmVyLmVycm9ycy5GT1JCSURERU4sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmbigpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgYWxsIGNsaWVudHMuXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuICAgIGNsb3NlKCkge1xuICAgICAgICBkZWJ1ZyhcImNsb3NpbmcgYWxsIG9wZW4gY2xpZW50c1wiKTtcbiAgICAgICAgZm9yIChsZXQgaSBpbiB0aGlzLmNsaWVudHMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNsaWVudHMuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWVudHNbaV0uY2xvc2UodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGVhbnVwKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBnZW5lcmF0ZSBhIHNvY2tldCBpZC5cbiAgICAgKiBPdmVyd3JpdGUgdGhpcyBtZXRob2QgdG8gZ2VuZXJhdGUgeW91ciBjdXN0b20gc29ja2V0IGlkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdCBvYmplY3RcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuICAgIGdlbmVyYXRlSWQocmVxKSB7XG4gICAgICAgIHJldHVybiBiYXNlNjRpZC5nZW5lcmF0ZUlkKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEhhbmRzaGFrZXMgYSBuZXcgY2xpZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRyYW5zcG9ydCBuYW1lXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3Qgb2JqZWN0XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2xvc2VDb25uZWN0aW9uXG4gICAgICpcbiAgICAgKiBAYXBpIHByb3RlY3RlZFxuICAgICAqL1xuICAgIGFzeW5jIGhhbmRzaGFrZSh0cmFuc3BvcnROYW1lLCByZXEsIGNsb3NlQ29ubmVjdGlvbikge1xuICAgICAgICBjb25zdCBwcm90b2NvbCA9IHJlcS5fcXVlcnkuRUlPID09PSBcIjRcIiA/IDQgOiAzOyAvLyAzcmQgcmV2aXNpb24gYnkgZGVmYXVsdFxuICAgICAgICBpZiAocHJvdG9jb2wgPT09IDMgJiYgIXRoaXMub3B0cy5hbGxvd0VJTzMpIHtcbiAgICAgICAgICAgIGRlYnVnKFwidW5zdXBwb3J0ZWQgcHJvdG9jb2wgdmVyc2lvblwiKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdChcImNvbm5lY3Rpb25fZXJyb3JcIiwge1xuICAgICAgICAgICAgICAgIHJlcSxcbiAgICAgICAgICAgICAgICBjb2RlOiBTZXJ2ZXIuZXJyb3JzLlVOU1VQUE9SVEVEX1BST1RPQ09MX1ZFUlNJT04sXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogU2VydmVyLmVycm9yTWVzc2FnZXNbU2VydmVyLmVycm9ycy5VTlNVUFBPUlRFRF9QUk9UT0NPTF9WRVJTSU9OXSxcbiAgICAgICAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICAgICAgICAgIHByb3RvY29sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjbG9zZUNvbm5lY3Rpb24oU2VydmVyLmVycm9ycy5VTlNVUFBPUlRFRF9QUk9UT0NPTF9WRVJTSU9OKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaWQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZCA9IGF3YWl0IHRoaXMuZ2VuZXJhdGVJZChyZXEpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcImVycm9yIHdoaWxlIGdlbmVyYXRpbmcgYW4gaWRcIik7XG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJjb25uZWN0aW9uX2Vycm9yXCIsIHtcbiAgICAgICAgICAgICAgICByZXEsXG4gICAgICAgICAgICAgICAgY29kZTogU2VydmVyLmVycm9ycy5CQURfUkVRVUVTVCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBTZXJ2ZXIuZXJyb3JNZXNzYWdlc1tTZXJ2ZXIuZXJyb3JzLkJBRF9SRVFVRVNUXSxcbiAgICAgICAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiSURfR0VORVJBVElPTl9FUlJPUlwiLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2xvc2VDb25uZWN0aW9uKFNlcnZlci5lcnJvcnMuQkFEX1JFUVVFU1QpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRlYnVnKCdoYW5kc2hha2luZyBjbGllbnQgXCIlc1wiJywgaWQpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHRyYW5zcG9ydCA9IHRoaXMuY3JlYXRlVHJhbnNwb3J0KHRyYW5zcG9ydE5hbWUsIHJlcSk7XG4gICAgICAgICAgICBpZiAoXCJwb2xsaW5nXCIgPT09IHRyYW5zcG9ydE5hbWUpIHtcbiAgICAgICAgICAgICAgICB0cmFuc3BvcnQubWF4SHR0cEJ1ZmZlclNpemUgPSB0aGlzLm9wdHMubWF4SHR0cEJ1ZmZlclNpemU7XG4gICAgICAgICAgICAgICAgdHJhbnNwb3J0Lmh0dHBDb21wcmVzc2lvbiA9IHRoaXMub3B0cy5odHRwQ29tcHJlc3Npb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChcIndlYnNvY2tldFwiID09PSB0cmFuc3BvcnROYW1lKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNwb3J0LnBlck1lc3NhZ2VEZWZsYXRlID0gdGhpcy5vcHRzLnBlck1lc3NhZ2VEZWZsYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlcS5fcXVlcnkgJiYgcmVxLl9xdWVyeS5iNjQpIHtcbiAgICAgICAgICAgICAgICB0cmFuc3BvcnQuc3VwcG9ydHNCaW5hcnkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyYW5zcG9ydC5zdXBwb3J0c0JpbmFyeSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGRlYnVnKCdlcnJvciBoYW5kc2hha2luZyB0byB0cmFuc3BvcnQgXCIlc1wiJywgdHJhbnNwb3J0TmFtZSk7XG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJjb25uZWN0aW9uX2Vycm9yXCIsIHtcbiAgICAgICAgICAgICAgICByZXEsXG4gICAgICAgICAgICAgICAgY29kZTogU2VydmVyLmVycm9ycy5CQURfUkVRVUVTVCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBTZXJ2ZXIuZXJyb3JNZXNzYWdlc1tTZXJ2ZXIuZXJyb3JzLkJBRF9SRVFVRVNUXSxcbiAgICAgICAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiVFJBTlNQT1JUX0hBTkRTSEFLRV9FUlJPUlwiLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2xvc2VDb25uZWN0aW9uKFNlcnZlci5lcnJvcnMuQkFEX1JFUVVFU1QpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvY2tldCA9IG5ldyBzb2NrZXRfMS5Tb2NrZXQoaWQsIHRoaXMsIHRyYW5zcG9ydCwgcmVxLCBwcm90b2NvbCk7XG4gICAgICAgIHRyYW5zcG9ydC5vbihcImhlYWRlcnNcIiwgKGhlYWRlcnMsIHJlcSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXNJbml0aWFsUmVxdWVzdCA9ICFyZXEuX3F1ZXJ5LnNpZDtcbiAgICAgICAgICAgIGlmIChpc0luaXRpYWxSZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0cy5jb29raWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1tcIlNldC1Db29raWVcIl0gPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICAoMCwgY29va2llXzEuc2VyaWFsaXplKSh0aGlzLm9wdHMuY29va2llLm5hbWUsIGlkLCB0aGlzLm9wdHMuY29va2llKVxuICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJpbml0aWFsX2hlYWRlcnNcIiwgaGVhZGVycywgcmVxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZW1pdChcImhlYWRlcnNcIiwgaGVhZGVycywgcmVxKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRyYW5zcG9ydC5vblJlcXVlc3QocmVxKTtcbiAgICAgICAgdGhpcy5jbGllbnRzW2lkXSA9IHNvY2tldDtcbiAgICAgICAgdGhpcy5jbGllbnRzQ291bnQrKztcbiAgICAgICAgc29ja2V0Lm9uY2UoXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5jbGllbnRzW2lkXTtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50c0NvdW50LS07XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmVtaXQoXCJjb25uZWN0aW9uXCIsIHNvY2tldCk7XG4gICAgICAgIHJldHVybiB0cmFuc3BvcnQ7XG4gICAgfVxufVxuZXhwb3J0cy5CYXNlU2VydmVyID0gQmFzZVNlcnZlcjtcbi8qKlxuICogUHJvdG9jb2wgZXJyb3JzIG1hcHBpbmdzLlxuICovXG5CYXNlU2VydmVyLmVycm9ycyA9IHtcbiAgICBVTktOT1dOX1RSQU5TUE9SVDogMCxcbiAgICBVTktOT1dOX1NJRDogMSxcbiAgICBCQURfSEFORFNIQUtFX01FVEhPRDogMixcbiAgICBCQURfUkVRVUVTVDogMyxcbiAgICBGT1JCSURERU46IDQsXG4gICAgVU5TVVBQT1JURURfUFJPVE9DT0xfVkVSU0lPTjogNVxufTtcbkJhc2VTZXJ2ZXIuZXJyb3JNZXNzYWdlcyA9IHtcbiAgICAwOiBcIlRyYW5zcG9ydCB1bmtub3duXCIsXG4gICAgMTogXCJTZXNzaW9uIElEIHVua25vd25cIixcbiAgICAyOiBcIkJhZCBoYW5kc2hha2UgbWV0aG9kXCIsXG4gICAgMzogXCJCYWQgcmVxdWVzdFwiLFxuICAgIDQ6IFwiRm9yYmlkZGVuXCIsXG4gICAgNTogXCJVbnN1cHBvcnRlZCBwcm90b2NvbCB2ZXJzaW9uXCJcbn07XG5jbGFzcyBTZXJ2ZXIgZXh0ZW5kcyBCYXNlU2VydmVyIHtcbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIHdlYnNvY2tldCBzZXJ2ZXJcbiAgICAgKlxuICAgICAqIEBhcGkgcHJvdGVjdGVkXG4gICAgICovXG4gICAgaW5pdCgpIHtcbiAgICAgICAgaWYgKCF+dGhpcy5vcHRzLnRyYW5zcG9ydHMuaW5kZXhPZihcIndlYnNvY2tldFwiKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMud3MpXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlKCk7XG4gICAgICAgIHRoaXMud3MgPSBuZXcgdGhpcy5vcHRzLndzRW5naW5lKHtcbiAgICAgICAgICAgIG5vU2VydmVyOiB0cnVlLFxuICAgICAgICAgICAgY2xpZW50VHJhY2tpbmc6IGZhbHNlLFxuICAgICAgICAgICAgcGVyTWVzc2FnZURlZmxhdGU6IHRoaXMub3B0cy5wZXJNZXNzYWdlRGVmbGF0ZSxcbiAgICAgICAgICAgIG1heFBheWxvYWQ6IHRoaXMub3B0cy5tYXhIdHRwQnVmZmVyU2l6ZVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLndzLm9uID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRoaXMud3Mub24oXCJoZWFkZXJzXCIsIChoZWFkZXJzQXJyYXksIHJlcSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIG5vdGU6ICd3cycgdXNlcyBhbiBhcnJheSBvZiBoZWFkZXJzLCB3aGlsZSBFbmdpbmUuSU8gdXNlcyBhbiBvYmplY3QgKHJlc3BvbnNlLndyaXRlSGVhZCgpIGFjY2VwdHMgYm90aCBmb3JtYXRzKVxuICAgICAgICAgICAgICAgIC8vIHdlIGNvdWxkIGFsc28gdHJ5IHRvIHBhcnNlIHRoZSBhcnJheSBhbmQgdGhlbiBzeW5jIHRoZSB2YWx1ZXMsIGJ1dCB0aGF0IHdpbGwgYmUgZXJyb3ItcHJvbmVcbiAgICAgICAgICAgICAgICBjb25zdCBhZGRpdGlvbmFsSGVhZGVycyA9IHt9O1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzSW5pdGlhbFJlcXVlc3QgPSAhcmVxLl9xdWVyeS5zaWQ7XG4gICAgICAgICAgICAgICAgaWYgKGlzSW5pdGlhbFJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwiaW5pdGlhbF9oZWFkZXJzXCIsIGFkZGl0aW9uYWxIZWFkZXJzLCByZXEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJoZWFkZXJzXCIsIGFkZGl0aW9uYWxIZWFkZXJzLCByZXEpO1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGFkZGl0aW9uYWxIZWFkZXJzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnNBcnJheS5wdXNoKGAke2tleX06ICR7YWRkaXRpb25hbEhlYWRlcnNba2V5XX1gKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNsZWFudXAoKSB7XG4gICAgICAgIGlmICh0aGlzLndzKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcImNsb3Npbmcgd2ViU29ja2V0U2VydmVyXCIpO1xuICAgICAgICAgICAgdGhpcy53cy5jbG9zZSgpO1xuICAgICAgICAgICAgLy8gZG9uJ3QgZGVsZXRlIHRoaXMud3MgYmVjYXVzZSBpdCBjYW4gYmUgdXNlZCBhZ2FpbiBpZiB0aGUgaHR0cCBzZXJ2ZXIgc3RhcnRzIGxpc3RlbmluZyBhZ2FpblxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByZXBhcmVzIGEgcmVxdWVzdCBieSBwcm9jZXNzaW5nIHRoZSBxdWVyeSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBwcmVwYXJlKHJlcSkge1xuICAgICAgICAvLyB0cnkgdG8gbGV2ZXJhZ2UgcHJlLWV4aXN0aW5nIGByZXEuX3F1ZXJ5YCAoZS5nOiBmcm9tIGNvbm5lY3QpXG4gICAgICAgIGlmICghcmVxLl9xdWVyeSkge1xuICAgICAgICAgICAgcmVxLl9xdWVyeSA9IH5yZXEudXJsLmluZGV4T2YoXCI/XCIpID8gcXMucGFyc2UoKDAsIHVybF8xLnBhcnNlKShyZXEudXJsKS5xdWVyeSkgOiB7fTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjcmVhdGVUcmFuc3BvcnQodHJhbnNwb3J0TmFtZSwgcmVxKSB7XG4gICAgICAgIHJldHVybiBuZXcgdHJhbnNwb3J0c18xLmRlZmF1bHRbdHJhbnNwb3J0TmFtZV0ocmVxKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBhbiBFbmdpbmUuSU8gSFRUUCByZXF1ZXN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtodHRwLkluY29taW5nTWVzc2FnZX0gcmVxdWVzdFxuICAgICAqIEBwYXJhbSB7aHR0cC5TZXJ2ZXJSZXNwb25zZXxodHRwLk91dGdvaW5nTWVzc2FnZX0gcmVzcG9uc2VcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuICAgIGhhbmRsZVJlcXVlc3QocmVxLCByZXMpIHtcbiAgICAgICAgZGVidWcoJ2hhbmRsaW5nIFwiJXNcIiBodHRwIHJlcXVlc3QgXCIlc1wiJywgcmVxLm1ldGhvZCwgcmVxLnVybCk7XG4gICAgICAgIHRoaXMucHJlcGFyZShyZXEpO1xuICAgICAgICByZXEucmVzID0gcmVzO1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IChlcnJvckNvZGUsIGVycm9yQ29udGV4dCkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yQ29kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwiY29ubmVjdGlvbl9lcnJvclwiLCB7XG4gICAgICAgICAgICAgICAgICAgIHJlcSxcbiAgICAgICAgICAgICAgICAgICAgY29kZTogZXJyb3JDb2RlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBTZXJ2ZXIuZXJyb3JNZXNzYWdlc1tlcnJvckNvZGVdLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBlcnJvckNvbnRleHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBhYm9ydFJlcXVlc3QocmVzLCBlcnJvckNvZGUsIGVycm9yQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlcS5fcXVlcnkuc2lkKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoXCJzZXR0aW5nIG5ldyByZXF1ZXN0IGZvciBleGlzdGluZyBjbGllbnRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGllbnRzW3JlcS5fcXVlcnkuc2lkXS50cmFuc3BvcnQub25SZXF1ZXN0KHJlcSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9zZUNvbm5lY3Rpb24gPSAoZXJyb3JDb2RlLCBlcnJvckNvbnRleHQpID0+IGFib3J0UmVxdWVzdChyZXMsIGVycm9yQ29kZSwgZXJyb3JDb250ZXh0KTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRzaGFrZShyZXEuX3F1ZXJ5LnRyYW5zcG9ydCwgcmVxLCBjbG9zZUNvbm5lY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy5jb3JzTWlkZGxld2FyZSkge1xuICAgICAgICAgICAgdGhpcy5jb3JzTWlkZGxld2FyZS5jYWxsKG51bGwsIHJlcSwgcmVzLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy52ZXJpZnkocmVxLCBmYWxzZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnZlcmlmeShyZXEsIGZhbHNlLCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBhbiBFbmdpbmUuSU8gSFRUUCBVcGdyYWRlLlxuICAgICAqXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cbiAgICBoYW5kbGVVcGdyYWRlKHJlcSwgc29ja2V0LCB1cGdyYWRlSGVhZCkge1xuICAgICAgICB0aGlzLnByZXBhcmUocmVxKTtcbiAgICAgICAgdGhpcy52ZXJpZnkocmVxLCB0cnVlLCAoZXJyb3JDb2RlLCBlcnJvckNvbnRleHQpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvckNvZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJjb25uZWN0aW9uX2Vycm9yXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxLFxuICAgICAgICAgICAgICAgICAgICBjb2RlOiBlcnJvckNvZGUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFNlcnZlci5lcnJvck1lc3NhZ2VzW2Vycm9yQ29kZV0sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IGVycm9yQ29udGV4dFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGFib3J0VXBncmFkZShzb2NrZXQsIGVycm9yQ29kZSwgZXJyb3JDb250ZXh0KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBoZWFkID0gQnVmZmVyLmZyb20odXBncmFkZUhlYWQpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vZGUvbm8tZGVwcmVjYXRlZC1hcGlcbiAgICAgICAgICAgIHVwZ3JhZGVIZWFkID0gbnVsbDtcbiAgICAgICAgICAgIC8vIGRlbGVnYXRlIHRvIHdzXG4gICAgICAgICAgICB0aGlzLndzLmhhbmRsZVVwZ3JhZGUocmVxLCBzb2NrZXQsIGhlYWQsIHdlYnNvY2tldCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbldlYlNvY2tldChyZXEsIHNvY2tldCwgd2Vic29ja2V0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHVwb24gYSB3cy5pbyBjb25uZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHt3cy5Tb2NrZXR9IHdlYnNvY2tldFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uV2ViU29ja2V0KHJlcSwgc29ja2V0LCB3ZWJzb2NrZXQpIHtcbiAgICAgICAgd2Vic29ja2V0Lm9uKFwiZXJyb3JcIiwgb25VcGdyYWRlRXJyb3IpO1xuICAgICAgICBpZiAodHJhbnNwb3J0c18xLmRlZmF1bHRbcmVxLl9xdWVyeS50cmFuc3BvcnRdICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICF0cmFuc3BvcnRzXzEuZGVmYXVsdFtyZXEuX3F1ZXJ5LnRyYW5zcG9ydF0ucHJvdG90eXBlLmhhbmRsZXNVcGdyYWRlcykge1xuICAgICAgICAgICAgZGVidWcoXCJ0cmFuc3BvcnQgZG9lc250IGhhbmRsZSB1cGdyYWRlZCByZXF1ZXN0c1wiKTtcbiAgICAgICAgICAgIHdlYnNvY2tldC5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGdldCBjbGllbnQgaWRcbiAgICAgICAgY29uc3QgaWQgPSByZXEuX3F1ZXJ5LnNpZDtcbiAgICAgICAgLy8ga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgd3MuU29ja2V0XG4gICAgICAgIHJlcS53ZWJzb2NrZXQgPSB3ZWJzb2NrZXQ7XG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5jbGllbnRzW2lkXTtcbiAgICAgICAgICAgIGlmICghY2xpZW50KSB7XG4gICAgICAgICAgICAgICAgZGVidWcoXCJ1cGdyYWRlIGF0dGVtcHQgZm9yIGNsb3NlZCBjbGllbnRcIik7XG4gICAgICAgICAgICAgICAgd2Vic29ja2V0LmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjbGllbnQudXBncmFkaW5nKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoXCJ0cmFuc3BvcnQgaGFzIGFscmVhZHkgYmVlbiB0cnlpbmcgdG8gdXBncmFkZVwiKTtcbiAgICAgICAgICAgICAgICB3ZWJzb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNsaWVudC51cGdyYWRlZCkge1xuICAgICAgICAgICAgICAgIGRlYnVnKFwidHJhbnNwb3J0IGhhZCBhbHJlYWR5IGJlZW4gdXBncmFkZWRcIik7XG4gICAgICAgICAgICAgICAgd2Vic29ja2V0LmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhcInVwZ3JhZGluZyBleGlzdGluZyB0cmFuc3BvcnRcIik7XG4gICAgICAgICAgICAgICAgLy8gdHJhbnNwb3J0IGVycm9yIGhhbmRsaW5nIHRha2VzIG92ZXJcbiAgICAgICAgICAgICAgICB3ZWJzb2NrZXQucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBvblVwZ3JhZGVFcnJvcik7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJhbnNwb3J0ID0gdGhpcy5jcmVhdGVUcmFuc3BvcnQocmVxLl9xdWVyeS50cmFuc3BvcnQsIHJlcSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlcS5fcXVlcnkgJiYgcmVxLl9xdWVyeS5iNjQpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNwb3J0LnN1cHBvcnRzQmluYXJ5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnQuc3VwcG9ydHNCaW5hcnkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cmFuc3BvcnQucGVyTWVzc2FnZURlZmxhdGUgPSB0aGlzLm9wdHMucGVyTWVzc2FnZURlZmxhdGU7XG4gICAgICAgICAgICAgICAgY2xpZW50Lm1heWJlVXBncmFkZSh0cmFuc3BvcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gdHJhbnNwb3J0IGVycm9yIGhhbmRsaW5nIHRha2VzIG92ZXJcbiAgICAgICAgICAgIHdlYnNvY2tldC5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIG9uVXBncmFkZUVycm9yKTtcbiAgICAgICAgICAgIGNvbnN0IGNsb3NlQ29ubmVjdGlvbiA9IChlcnJvckNvZGUsIGVycm9yQ29udGV4dCkgPT4gYWJvcnRVcGdyYWRlKHNvY2tldCwgZXJyb3JDb2RlLCBlcnJvckNvbnRleHQpO1xuICAgICAgICAgICAgdGhpcy5oYW5kc2hha2UocmVxLl9xdWVyeS50cmFuc3BvcnQsIHJlcSwgY2xvc2VDb25uZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvblVwZ3JhZGVFcnJvcigpIHtcbiAgICAgICAgICAgIGRlYnVnKFwid2Vic29ja2V0IGVycm9yIGJlZm9yZSB1cGdyYWRlXCIpO1xuICAgICAgICAgICAgLy8gd2Vic29ja2V0LmNsb3NlKCkgbm90IG5lZWRlZFxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhcHR1cmVzIHVwZ3JhZGUgcmVxdWVzdHMgZm9yIGEgaHR0cC5TZXJ2ZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2h0dHAuU2VydmVyfSBzZXJ2ZXJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgYXR0YWNoKHNlcnZlciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGxldCBwYXRoID0gKG9wdGlvbnMucGF0aCB8fCBcIi9lbmdpbmUuaW9cIikucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xuICAgICAgICBjb25zdCBkZXN0cm95VXBncmFkZVRpbWVvdXQgPSBvcHRpb25zLmRlc3Ryb3lVcGdyYWRlVGltZW91dCB8fCAxMDAwO1xuICAgICAgICAvLyBub3JtYWxpemUgcGF0aFxuICAgICAgICBwYXRoICs9IFwiL1wiO1xuICAgICAgICBmdW5jdGlvbiBjaGVjayhyZXEpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoID09PSByZXEudXJsLnN1YnN0cigwLCBwYXRoLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2FjaGUgYW5kIGNsZWFuIHVwIGxpc3RlbmVyc1xuICAgICAgICBjb25zdCBsaXN0ZW5lcnMgPSBzZXJ2ZXIubGlzdGVuZXJzKFwicmVxdWVzdFwiKS5zbGljZSgwKTtcbiAgICAgICAgc2VydmVyLnJlbW92ZUFsbExpc3RlbmVycyhcInJlcXVlc3RcIik7XG4gICAgICAgIHNlcnZlci5vbihcImNsb3NlXCIsIHRoaXMuY2xvc2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHNlcnZlci5vbihcImxpc3RlbmluZ1wiLCB0aGlzLmluaXQuYmluZCh0aGlzKSk7XG4gICAgICAgIC8vIGFkZCByZXF1ZXN0IGhhbmRsZXJcbiAgICAgICAgc2VydmVyLm9uKFwicmVxdWVzdFwiLCAocmVxLCByZXMpID0+IHtcbiAgICAgICAgICAgIGlmIChjaGVjayhyZXEpKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ2ludGVyY2VwdGluZyByZXF1ZXN0IGZvciBwYXRoIFwiJXNcIicsIHBhdGgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlUmVxdWVzdChyZXEsIHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICAgICAgY29uc3QgbCA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzW2ldLmNhbGwoc2VydmVyLCByZXEsIHJlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKH50aGlzLm9wdHMudHJhbnNwb3J0cy5pbmRleE9mKFwid2Vic29ja2V0XCIpKSB7XG4gICAgICAgICAgICBzZXJ2ZXIub24oXCJ1cGdyYWRlXCIsIChyZXEsIHNvY2tldCwgaGVhZCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjaGVjayhyZXEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVXBncmFkZShyZXEsIHNvY2tldCwgaGVhZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGZhbHNlICE9PSBvcHRpb25zLmRlc3Ryb3lVcGdyYWRlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgbm9kZSBiZWhhdmlvciBpcyB0byBkaXNjb25uZWN0IHdoZW4gbm8gaGFuZGxlcnNcbiAgICAgICAgICAgICAgICAgICAgLy8gYnV0IGJ5IGFkZGluZyBhIGhhbmRsZXIsIHdlIHByZXZlbnQgdGhhdFxuICAgICAgICAgICAgICAgICAgICAvLyBhbmQgaWYgbm8gZWlvIHRoaW5nIGhhbmRsZXMgdGhlIHVwZ3JhZGVcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiB0aGUgc29ja2V0IG5lZWRzIHRvIGRpZSFcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc29ja2V0LndyaXRhYmxlICYmIHNvY2tldC5ieXRlc1dyaXR0ZW4gPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzb2NrZXQuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIGRlc3Ryb3lVcGdyYWRlVGltZW91dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLlNlcnZlciA9IFNlcnZlcjtcbi8qKlxuICogQ2xvc2UgdGhlIEhUVFAgbG9uZy1wb2xsaW5nIHJlcXVlc3RcbiAqXG4gKiBAcGFyYW0gcmVzIC0gdGhlIHJlc3BvbnNlIG9iamVjdFxuICogQHBhcmFtIGVycm9yQ29kZSAtIHRoZSBlcnJvciBjb2RlXG4gKiBAcGFyYW0gZXJyb3JDb250ZXh0IC0gYWRkaXRpb25hbCBlcnJvciBjb250ZXh0XG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGFib3J0UmVxdWVzdChyZXMsIGVycm9yQ29kZSwgZXJyb3JDb250ZXh0KSB7XG4gICAgY29uc3Qgc3RhdHVzQ29kZSA9IGVycm9yQ29kZSA9PT0gU2VydmVyLmVycm9ycy5GT1JCSURERU4gPyA0MDMgOiA0MDA7XG4gICAgY29uc3QgbWVzc2FnZSA9IGVycm9yQ29udGV4dCAmJiBlcnJvckNvbnRleHQubWVzc2FnZVxuICAgICAgICA/IGVycm9yQ29udGV4dC5tZXNzYWdlXG4gICAgICAgIDogU2VydmVyLmVycm9yTWVzc2FnZXNbZXJyb3JDb2RlXTtcbiAgICByZXMud3JpdGVIZWFkKHN0YXR1c0NvZGUsIHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSk7XG4gICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGNvZGU6IGVycm9yQ29kZSxcbiAgICAgICAgbWVzc2FnZVxuICAgIH0pKTtcbn1cbi8qKlxuICogQ2xvc2UgdGhlIFdlYlNvY2tldCBjb25uZWN0aW9uXG4gKlxuICogQHBhcmFtIHtuZXQuU29ja2V0fSBzb2NrZXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvckNvZGUgLSB0aGUgZXJyb3IgY29kZVxuICogQHBhcmFtIHtvYmplY3R9IGVycm9yQ29udGV4dCAtIGFkZGl0aW9uYWwgZXJyb3IgY29udGV4dFxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBhYm9ydFVwZ3JhZGUoc29ja2V0LCBlcnJvckNvZGUsIGVycm9yQ29udGV4dCA9IHt9KSB7XG4gICAgc29ja2V0Lm9uKFwiZXJyb3JcIiwgKCkgPT4ge1xuICAgICAgICBkZWJ1ZyhcImlnbm9yaW5nIGVycm9yIGZyb20gY2xvc2VkIGNvbm5lY3Rpb25cIik7XG4gICAgfSk7XG4gICAgaWYgKHNvY2tldC53cml0YWJsZSkge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gZXJyb3JDb250ZXh0Lm1lc3NhZ2UgfHwgU2VydmVyLmVycm9yTWVzc2FnZXNbZXJyb3JDb2RlXTtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgobWVzc2FnZSk7XG4gICAgICAgIHNvY2tldC53cml0ZShcIkhUVFAvMS4xIDQwMCBCYWQgUmVxdWVzdFxcclxcblwiICtcbiAgICAgICAgICAgIFwiQ29ubmVjdGlvbjogY2xvc2VcXHJcXG5cIiArXG4gICAgICAgICAgICBcIkNvbnRlbnQtdHlwZTogdGV4dC9odG1sXFxyXFxuXCIgK1xuICAgICAgICAgICAgXCJDb250ZW50LUxlbmd0aDogXCIgK1xuICAgICAgICAgICAgbGVuZ3RoICtcbiAgICAgICAgICAgIFwiXFxyXFxuXCIgK1xuICAgICAgICAgICAgXCJcXHJcXG5cIiArXG4gICAgICAgICAgICBtZXNzYWdlKTtcbiAgICB9XG4gICAgc29ja2V0LmRlc3Ryb3koKTtcbn1cbi8qIGVzbGludC1kaXNhYmxlICovXG4vKipcbiAqIEZyb20gaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL2Jsb2IvdjguNC4wL2xpYi9faHR0cF9jb21tb24uanMjTDMwMy1MMzU0XG4gKlxuICogVHJ1ZSBpZiB2YWwgY29udGFpbnMgYW4gaW52YWxpZCBmaWVsZC12Y2hhclxuICogIGZpZWxkLXZhbHVlICAgID0gKiggZmllbGQtY29udGVudCAvIG9icy1mb2xkIClcbiAqICBmaWVsZC1jb250ZW50ICA9IGZpZWxkLXZjaGFyIFsgMSooIFNQIC8gSFRBQiApIGZpZWxkLXZjaGFyIF1cbiAqICBmaWVsZC12Y2hhciAgICA9IFZDSEFSIC8gb2JzLXRleHRcbiAqXG4gKiBjaGVja0ludmFsaWRIZWFkZXJDaGFyKCkgaXMgY3VycmVudGx5IGRlc2lnbmVkIHRvIGJlIGlubGluYWJsZSBieSB2OCxcbiAqIHNvIHRha2UgY2FyZSB3aGVuIG1ha2luZyBjaGFuZ2VzIHRvIHRoZSBpbXBsZW1lbnRhdGlvbiBzbyB0aGF0IHRoZSBzb3VyY2VcbiAqIGNvZGUgc2l6ZSBkb2VzIG5vdCBleGNlZWQgdjgncyBkZWZhdWx0IG1heF9pbmxpbmVkX3NvdXJjZV9zaXplIHNldHRpbmcuXG4gKiovXG4vLyBwcmV0dGllci1pZ25vcmVcbmNvbnN0IHZhbGlkSGRyQ2hhcnMgPSBbXG4gICAgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsXG4gICAgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSxcbiAgICAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLFxuICAgIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsXG4gICAgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSxcbiAgICAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAwLFxuICAgIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsXG4gICAgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSxcbiAgICAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLFxuICAgIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsXG4gICAgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSxcbiAgICAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLFxuICAgIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsXG4gICAgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSAvLyAuLi4gMjU1XG5dO1xuZnVuY3Rpb24gY2hlY2tJbnZhbGlkSGVhZGVyQ2hhcih2YWwpIHtcbiAgICB2YWwgKz0gXCJcIjtcbiAgICBpZiAodmFsLmxlbmd0aCA8IDEpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIXZhbGlkSGRyQ2hhcnNbdmFsLmNoYXJDb2RlQXQoMCldKSB7XG4gICAgICAgIGRlYnVnKCdpbnZhbGlkIGhlYWRlciwgaW5kZXggMCwgY2hhciBcIiVzXCInLCB2YWwuY2hhckNvZGVBdCgwKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA8IDIpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIXZhbGlkSGRyQ2hhcnNbdmFsLmNoYXJDb2RlQXQoMSldKSB7XG4gICAgICAgIGRlYnVnKCdpbnZhbGlkIGhlYWRlciwgaW5kZXggMSwgY2hhciBcIiVzXCInLCB2YWwuY2hhckNvZGVBdCgxKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA8IDMpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIXZhbGlkSGRyQ2hhcnNbdmFsLmNoYXJDb2RlQXQoMildKSB7XG4gICAgICAgIGRlYnVnKCdpbnZhbGlkIGhlYWRlciwgaW5kZXggMiwgY2hhciBcIiVzXCInLCB2YWwuY2hhckNvZGVBdCgyKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA8IDQpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIXZhbGlkSGRyQ2hhcnNbdmFsLmNoYXJDb2RlQXQoMyldKSB7XG4gICAgICAgIGRlYnVnKCdpbnZhbGlkIGhlYWRlciwgaW5kZXggMywgY2hhciBcIiVzXCInLCB2YWwuY2hhckNvZGVBdCgzKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gNDsgaSA8IHZhbC5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZiAoIXZhbGlkSGRyQ2hhcnNbdmFsLmNoYXJDb2RlQXQoaSldKSB7XG4gICAgICAgICAgICBkZWJ1ZygnaW52YWxpZCBoZWFkZXIsIGluZGV4IFwiJWlcIiwgY2hhciBcIiVzXCInLCBpLCB2YWwuY2hhckNvZGVBdChpKSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU29ja2V0ID0gdm9pZCAwO1xuY29uc3QgZXZlbnRzXzEgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xuY29uc3QgZGVidWdfMSA9IHJlcXVpcmUoXCJkZWJ1Z1wiKTtcbmNvbnN0IGRlYnVnID0gKDAsIGRlYnVnXzEuZGVmYXVsdCkoXCJlbmdpbmU6c29ja2V0XCIpO1xuY2xhc3MgU29ja2V0IGV4dGVuZHMgZXZlbnRzXzEuRXZlbnRFbWl0dGVyIHtcbiAgICAvKipcbiAgICAgKiBDbGllbnQgY2xhc3MgKGFic3RyYWN0KS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGlkLCBzZXJ2ZXIsIHRyYW5zcG9ydCwgcmVxLCBwcm90b2NvbCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuc2VydmVyID0gc2VydmVyO1xuICAgICAgICB0aGlzLnVwZ3JhZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZ3JhZGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVhZHlTdGF0ZSA9IFwib3BlbmluZ1wiO1xuICAgICAgICB0aGlzLndyaXRlQnVmZmVyID0gW107XG4gICAgICAgIHRoaXMucGFja2V0c0ZuID0gW107XG4gICAgICAgIHRoaXMuc2VudENhbGxiYWNrRm4gPSBbXTtcbiAgICAgICAgdGhpcy5jbGVhbnVwRm4gPSBbXTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gcmVxO1xuICAgICAgICB0aGlzLnByb3RvY29sID0gcHJvdG9jb2w7XG4gICAgICAgIC8vIENhY2hlIElQIHNpbmNlIGl0IG1pZ2h0IG5vdCBiZSBpbiB0aGUgcmVxIGxhdGVyXG4gICAgICAgIGlmIChyZXEud2Vic29ja2V0ICYmIHJlcS53ZWJzb2NrZXQuX3NvY2tldCkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdGVBZGRyZXNzID0gcmVxLndlYnNvY2tldC5fc29ja2V0LnJlbW90ZUFkZHJlc3M7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW90ZUFkZHJlc3MgPSByZXEuY29ubmVjdGlvbi5yZW1vdGVBZGRyZXNzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hlY2tJbnRlcnZhbFRpbWVyID0gbnVsbDtcbiAgICAgICAgdGhpcy51cGdyYWRlVGltZW91dFRpbWVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5waW5nVGltZW91dFRpbWVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5waW5nSW50ZXJ2YWxUaW1lciA9IG51bGw7XG4gICAgICAgIHRoaXMuc2V0VHJhbnNwb3J0KHRyYW5zcG9ydCk7XG4gICAgICAgIHRoaXMub25PcGVuKCk7XG4gICAgfVxuICAgIGdldCByZWFkeVN0YXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVhZHlTdGF0ZTtcbiAgICB9XG4gICAgc2V0IHJlYWR5U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgZGVidWcoXCJyZWFkeVN0YXRlIHVwZGF0ZWQgZnJvbSAlcyB0byAlc1wiLCB0aGlzLl9yZWFkeVN0YXRlLCBzdGF0ZSk7XG4gICAgICAgIHRoaXMuX3JlYWR5U3RhdGUgPSBzdGF0ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHVwb24gdHJhbnNwb3J0IGNvbnNpZGVyZWQgb3Blbi5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uT3BlbigpIHtcbiAgICAgICAgdGhpcy5yZWFkeVN0YXRlID0gXCJvcGVuXCI7XG4gICAgICAgIC8vIHNlbmRzIGFuIGBvcGVuYCBwYWNrZXRcbiAgICAgICAgdGhpcy50cmFuc3BvcnQuc2lkID0gdGhpcy5pZDtcbiAgICAgICAgdGhpcy5zZW5kUGFja2V0KFwib3BlblwiLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBzaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICB1cGdyYWRlczogdGhpcy5nZXRBdmFpbGFibGVVcGdyYWRlcygpLFxuICAgICAgICAgICAgcGluZ0ludGVydmFsOiB0aGlzLnNlcnZlci5vcHRzLnBpbmdJbnRlcnZhbCxcbiAgICAgICAgICAgIHBpbmdUaW1lb3V0OiB0aGlzLnNlcnZlci5vcHRzLnBpbmdUaW1lb3V0XG4gICAgICAgIH0pKTtcbiAgICAgICAgaWYgKHRoaXMuc2VydmVyLm9wdHMuaW5pdGlhbFBhY2tldCkge1xuICAgICAgICAgICAgdGhpcy5zZW5kUGFja2V0KFwibWVzc2FnZVwiLCB0aGlzLnNlcnZlci5vcHRzLmluaXRpYWxQYWNrZXQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdChcIm9wZW5cIik7XG4gICAgICAgIGlmICh0aGlzLnByb3RvY29sID09PSAzKSB7XG4gICAgICAgICAgICAvLyBpbiBwcm90b2NvbCB2MywgdGhlIGNsaWVudCBzZW5kcyBhIHBpbmcsIGFuZCB0aGUgc2VydmVyIGFuc3dlcnMgd2l0aCBhIHBvbmdcbiAgICAgICAgICAgIHRoaXMucmVzZXRQaW5nVGltZW91dCh0aGlzLnNlcnZlci5vcHRzLnBpbmdJbnRlcnZhbCArIHRoaXMuc2VydmVyLm9wdHMucGluZ1RpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gaW4gcHJvdG9jb2wgdjQsIHRoZSBzZXJ2ZXIgc2VuZHMgYSBwaW5nLCBhbmQgdGhlIGNsaWVudCBhbnN3ZXJzIHdpdGggYSBwb25nXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlUGluZygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxlZCB1cG9uIHRyYW5zcG9ydCBwYWNrZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFja2V0XG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgb25QYWNrZXQocGFja2V0KSB7XG4gICAgICAgIGlmIChcIm9wZW5cIiAhPT0gdGhpcy5yZWFkeVN0YXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVidWcoXCJwYWNrZXQgcmVjZWl2ZWQgd2l0aCBjbG9zZWQgc29ja2V0XCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGV4cG9ydCBwYWNrZXQgZXZlbnRcbiAgICAgICAgZGVidWcoYHJlY2VpdmVkIHBhY2tldCAke3BhY2tldC50eXBlfWApO1xuICAgICAgICB0aGlzLmVtaXQoXCJwYWNrZXRcIiwgcGFja2V0KTtcbiAgICAgICAgLy8gUmVzZXQgcGluZyB0aW1lb3V0IG9uIGFueSBwYWNrZXQsIGluY29taW5nIGRhdGEgaXMgYSBnb29kIHNpZ24gb2ZcbiAgICAgICAgLy8gb3RoZXIgc2lkZSdzIGxpdmVuZXNzXG4gICAgICAgIHRoaXMucmVzZXRQaW5nVGltZW91dCh0aGlzLnNlcnZlci5vcHRzLnBpbmdJbnRlcnZhbCArIHRoaXMuc2VydmVyLm9wdHMucGluZ1RpbWVvdXQpO1xuICAgICAgICBzd2l0Y2ggKHBhY2tldC50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwicGluZ1wiOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyYW5zcG9ydC5wcm90b2NvbCAhPT0gMykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRXJyb3IoXCJpbnZhbGlkIGhlYXJ0YmVhdCBkaXJlY3Rpb25cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVidWcoXCJnb3QgcGluZ1wiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRQYWNrZXQoXCJwb25nXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcImhlYXJ0YmVhdFwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJwb25nXCI6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHJhbnNwb3J0LnByb3RvY29sID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25FcnJvcihcImludmFsaWQgaGVhcnRiZWF0IGRpcmVjdGlvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWJ1ZyhcImdvdCBwb25nXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMucGluZ0ludGVydmFsVGltZXIucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcImhlYXJ0YmVhdFwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJlcnJvclwiOlxuICAgICAgICAgICAgICAgIHRoaXMub25DbG9zZShcInBhcnNlIGVycm9yXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm1lc3NhZ2VcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJkYXRhXCIsIHBhY2tldC5kYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJtZXNzYWdlXCIsIHBhY2tldC5kYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgdXBvbiB0cmFuc3BvcnQgZXJyb3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBvYmplY3RcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBvbkVycm9yKGVycikge1xuICAgICAgICBkZWJ1ZyhcInRyYW5zcG9ydCBlcnJvclwiKTtcbiAgICAgICAgdGhpcy5vbkNsb3NlKFwidHJhbnNwb3J0IGVycm9yXCIsIGVycik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBpbmdzIGNsaWVudCBldmVyeSBgdGhpcy5waW5nSW50ZXJ2YWxgIGFuZCBleHBlY3RzIHJlc3BvbnNlXG4gICAgICogd2l0aGluIGB0aGlzLnBpbmdUaW1lb3V0YCBvciBjbG9zZXMgY29ubmVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHNjaGVkdWxlUGluZygpIHtcbiAgICAgICAgdGhpcy5waW5nSW50ZXJ2YWxUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZGVidWcoXCJ3cml0aW5nIHBpbmcgcGFja2V0IC0gZXhwZWN0aW5nIHBvbmcgd2l0aGluICVzbXNcIiwgdGhpcy5zZXJ2ZXIub3B0cy5waW5nVGltZW91dCk7XG4gICAgICAgICAgICB0aGlzLnNlbmRQYWNrZXQoXCJwaW5nXCIpO1xuICAgICAgICAgICAgdGhpcy5yZXNldFBpbmdUaW1lb3V0KHRoaXMuc2VydmVyLm9wdHMucGluZ1RpbWVvdXQpO1xuICAgICAgICB9LCB0aGlzLnNlcnZlci5vcHRzLnBpbmdJbnRlcnZhbCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlc2V0cyBwaW5nIHRpbWVvdXQuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICByZXNldFBpbmdUaW1lb3V0KHRpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucGluZ1RpbWVvdXRUaW1lcik7XG4gICAgICAgIHRoaXMucGluZ1RpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gXCJjbG9zZWRcIilcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2UoXCJwaW5nIHRpbWVvdXRcIik7XG4gICAgICAgIH0sIHRpbWVvdXQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdHRhY2hlcyBoYW5kbGVycyBmb3IgdGhlIGdpdmVuIHRyYW5zcG9ydC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VHJhbnNwb3J0fSB0cmFuc3BvcnRcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBzZXRUcmFuc3BvcnQodHJhbnNwb3J0KSB7XG4gICAgICAgIGNvbnN0IG9uRXJyb3IgPSB0aGlzLm9uRXJyb3IuYmluZCh0aGlzKTtcbiAgICAgICAgY29uc3Qgb25QYWNrZXQgPSB0aGlzLm9uUGFja2V0LmJpbmQodGhpcyk7XG4gICAgICAgIGNvbnN0IGZsdXNoID0gdGhpcy5mbHVzaC5iaW5kKHRoaXMpO1xuICAgICAgICBjb25zdCBvbkNsb3NlID0gdGhpcy5vbkNsb3NlLmJpbmQodGhpcywgXCJ0cmFuc3BvcnQgY2xvc2VcIik7XG4gICAgICAgIHRoaXMudHJhbnNwb3J0ID0gdHJhbnNwb3J0O1xuICAgICAgICB0aGlzLnRyYW5zcG9ydC5vbmNlKFwiZXJyb3JcIiwgb25FcnJvcik7XG4gICAgICAgIHRoaXMudHJhbnNwb3J0Lm9uKFwicGFja2V0XCIsIG9uUGFja2V0KTtcbiAgICAgICAgdGhpcy50cmFuc3BvcnQub24oXCJkcmFpblwiLCBmbHVzaCk7XG4gICAgICAgIHRoaXMudHJhbnNwb3J0Lm9uY2UoXCJjbG9zZVwiLCBvbkNsb3NlKTtcbiAgICAgICAgLy8gdGhpcyBmdW5jdGlvbiB3aWxsIG1hbmFnZSBwYWNrZXQgZXZlbnRzIChhbHNvIG1lc3NhZ2UgY2FsbGJhY2tzKVxuICAgICAgICB0aGlzLnNldHVwU2VuZENhbGxiYWNrKCk7XG4gICAgICAgIHRoaXMuY2xlYW51cEZuLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJhbnNwb3J0LnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIiwgb25FcnJvcik7XG4gICAgICAgICAgICB0cmFuc3BvcnQucmVtb3ZlTGlzdGVuZXIoXCJwYWNrZXRcIiwgb25QYWNrZXQpO1xuICAgICAgICAgICAgdHJhbnNwb3J0LnJlbW92ZUxpc3RlbmVyKFwiZHJhaW5cIiwgZmx1c2gpO1xuICAgICAgICAgICAgdHJhbnNwb3J0LnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIiwgb25DbG9zZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBVcGdyYWRlcyBzb2NrZXQgdG8gdGhlIGdpdmVuIHRyYW5zcG9ydFxuICAgICAqXG4gICAgICogQHBhcmFtIHtUcmFuc3BvcnR9IHRyYW5zcG9ydFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIG1heWJlVXBncmFkZSh0cmFuc3BvcnQpIHtcbiAgICAgICAgZGVidWcoJ21pZ2h0IHVwZ3JhZGUgc29ja2V0IHRyYW5zcG9ydCBmcm9tIFwiJXNcIiB0byBcIiVzXCInLCB0aGlzLnRyYW5zcG9ydC5uYW1lLCB0cmFuc3BvcnQubmFtZSk7XG4gICAgICAgIHRoaXMudXBncmFkaW5nID0gdHJ1ZTtcbiAgICAgICAgLy8gc2V0IHRyYW5zcG9ydCB1cGdyYWRlIHRpbWVyXG4gICAgICAgIHRoaXMudXBncmFkZVRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZGVidWcoXCJjbGllbnQgZGlkIG5vdCBjb21wbGV0ZSB1cGdyYWRlIC0gY2xvc2luZyB0cmFuc3BvcnRcIik7XG4gICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICBpZiAoXCJvcGVuXCIgPT09IHRyYW5zcG9ydC5yZWFkeVN0YXRlKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNwb3J0LmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMuc2VydmVyLm9wdHMudXBncmFkZVRpbWVvdXQpO1xuICAgICAgICBjb25zdCBvblBhY2tldCA9IHBhY2tldCA9PiB7XG4gICAgICAgICAgICBpZiAoXCJwaW5nXCIgPT09IHBhY2tldC50eXBlICYmIFwicHJvYmVcIiA9PT0gcGFja2V0LmRhdGEpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhcImdvdCBwcm9iZSBwaW5nIHBhY2tldCwgc2VuZGluZyBwb25nXCIpO1xuICAgICAgICAgICAgICAgIHRyYW5zcG9ydC5zZW5kKFt7IHR5cGU6IFwicG9uZ1wiLCBkYXRhOiBcInByb2JlXCIgfV0pO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcInVwZ3JhZGluZ1wiLCB0cmFuc3BvcnQpO1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jaGVja0ludGVydmFsVGltZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tJbnRlcnZhbFRpbWVyID0gc2V0SW50ZXJ2YWwoY2hlY2ssIDEwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChcInVwZ3JhZGVcIiA9PT0gcGFja2V0LnR5cGUgJiYgdGhpcy5yZWFkeVN0YXRlICE9PSBcImNsb3NlZFwiKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoXCJnb3QgdXBncmFkZSBwYWNrZXQgLSB1cGdyYWRpbmdcIik7XG4gICAgICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0LmRpc2NhcmQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZ3JhZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyVHJhbnNwb3J0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUcmFuc3BvcnQodHJhbnNwb3J0KTtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJ1cGdyYWRlXCIsIHRyYW5zcG9ydCk7XG4gICAgICAgICAgICAgICAgdGhpcy5mbHVzaCgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IFwiY2xvc2luZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zcG9ydC5jbG9zZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2xvc2UoXCJmb3JjZWQgY2xvc2VcIik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgICAgICB0cmFuc3BvcnQuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLy8gd2UgZm9yY2UgYSBwb2xsaW5nIGN5Y2xlIHRvIGVuc3VyZSBhIGZhc3QgdXBncmFkZVxuICAgICAgICBjb25zdCBjaGVjayA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChcInBvbGxpbmdcIiA9PT0gdGhpcy50cmFuc3BvcnQubmFtZSAmJiB0aGlzLnRyYW5zcG9ydC53cml0YWJsZSkge1xuICAgICAgICAgICAgICAgIGRlYnVnKFwid3JpdGluZyBhIG5vb3AgcGFja2V0IHRvIHBvbGxpbmcgZm9yIGZhc3QgdXBncmFkZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zcG9ydC5zZW5kKFt7IHR5cGU6IFwibm9vcFwiIH1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2xlYW51cCA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBncmFkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuY2hlY2tJbnRlcnZhbFRpbWVyKTtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tJbnRlcnZhbFRpbWVyID0gbnVsbDtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnVwZ3JhZGVUaW1lb3V0VGltZXIpO1xuICAgICAgICAgICAgdGhpcy51cGdyYWRlVGltZW91dFRpbWVyID0gbnVsbDtcbiAgICAgICAgICAgIHRyYW5zcG9ydC5yZW1vdmVMaXN0ZW5lcihcInBhY2tldFwiLCBvblBhY2tldCk7XG4gICAgICAgICAgICB0cmFuc3BvcnQucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLCBvblRyYW5zcG9ydENsb3NlKTtcbiAgICAgICAgICAgIHRyYW5zcG9ydC5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsIG9uRXJyb3IpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihcImNsb3NlXCIsIG9uQ2xvc2UpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBvbkVycm9yID0gZXJyID0+IHtcbiAgICAgICAgICAgIGRlYnVnKFwiY2xpZW50IGRpZCBub3QgY29tcGxldGUgdXBncmFkZSAtICVzXCIsIGVycik7XG4gICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICB0cmFuc3BvcnQuY2xvc2UoKTtcbiAgICAgICAgICAgIHRyYW5zcG9ydCA9IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG9uVHJhbnNwb3J0Q2xvc2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBvbkVycm9yKFwidHJhbnNwb3J0IGNsb3NlZFwiKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgb25DbG9zZSA9ICgpID0+IHtcbiAgICAgICAgICAgIG9uRXJyb3IoXCJzb2NrZXQgY2xvc2VkXCIpO1xuICAgICAgICB9O1xuICAgICAgICB0cmFuc3BvcnQub24oXCJwYWNrZXRcIiwgb25QYWNrZXQpO1xuICAgICAgICB0cmFuc3BvcnQub25jZShcImNsb3NlXCIsIG9uVHJhbnNwb3J0Q2xvc2UpO1xuICAgICAgICB0cmFuc3BvcnQub25jZShcImVycm9yXCIsIG9uRXJyb3IpO1xuICAgICAgICB0aGlzLm9uY2UoXCJjbG9zZVwiLCBvbkNsb3NlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xlYXJzIGxpc3RlbmVycyBhbmQgdGltZXJzIGFzc29jaWF0ZWQgd2l0aCBjdXJyZW50IHRyYW5zcG9ydC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGNsZWFyVHJhbnNwb3J0KCkge1xuICAgICAgICBsZXQgY2xlYW51cDtcbiAgICAgICAgY29uc3QgdG9DbGVhblVwID0gdGhpcy5jbGVhbnVwRm4ubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvQ2xlYW5VcDsgaSsrKSB7XG4gICAgICAgICAgICBjbGVhbnVwID0gdGhpcy5jbGVhbnVwRm4uc2hpZnQoKTtcbiAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzaWxlbmNlIGZ1cnRoZXIgdHJhbnNwb3J0IGVycm9ycyBhbmQgcHJldmVudCB1bmNhdWdodCBleGNlcHRpb25zXG4gICAgICAgIHRoaXMudHJhbnNwb3J0Lm9uKFwiZXJyb3JcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGVidWcoXCJlcnJvciB0cmlnZ2VyZWQgYnkgZGlzY2FyZGVkIHRyYW5zcG9ydFwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGVuc3VyZSB0cmFuc3BvcnQgd29uJ3Qgc3RheSBvcGVuXG4gICAgICAgIHRoaXMudHJhbnNwb3J0LmNsb3NlKCk7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnBpbmdUaW1lb3V0VGltZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgdXBvbiB0cmFuc3BvcnQgY29uc2lkZXJlZCBjbG9zZWQuXG4gICAgICogUG9zc2libGUgcmVhc29uczogYHBpbmcgdGltZW91dGAsIGBjbGllbnQgZXJyb3JgLCBgcGFyc2UgZXJyb3JgLFxuICAgICAqIGB0cmFuc3BvcnQgZXJyb3JgLCBgc2VydmVyIGNsb3NlYCwgYHRyYW5zcG9ydCBjbG9zZWBcbiAgICAgKi9cbiAgICBvbkNsb3NlKHJlYXNvbiwgZGVzY3JpcHRpb24pIHtcbiAgICAgICAgaWYgKFwiY2xvc2VkXCIgIT09IHRoaXMucmVhZHlTdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5yZWFkeVN0YXRlID0gXCJjbG9zZWRcIjtcbiAgICAgICAgICAgIC8vIGNsZWFyIHRpbWVyc1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucGluZ0ludGVydmFsVGltZXIpO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucGluZ1RpbWVvdXRUaW1lcik7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuY2hlY2tJbnRlcnZhbFRpbWVyKTtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tJbnRlcnZhbFRpbWVyID0gbnVsbDtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnVwZ3JhZGVUaW1lb3V0VGltZXIpO1xuICAgICAgICAgICAgLy8gY2xlYW4gd3JpdGVCdWZmZXIgaW4gbmV4dCB0aWNrLCBzbyBkZXZlbG9wZXJzIGNhbiBzdGlsbFxuICAgICAgICAgICAgLy8gZ3JhYiB0aGUgd3JpdGVCdWZmZXIgb24gJ2Nsb3NlJyBldmVudFxuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy53cml0ZUJ1ZmZlciA9IFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnBhY2tldHNGbiA9IFtdO1xuICAgICAgICAgICAgdGhpcy5zZW50Q2FsbGJhY2tGbiA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jbGVhclRyYW5zcG9ydCgpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KFwiY2xvc2VcIiwgcmVhc29uLCBkZXNjcmlwdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0dXAgYW5kIG1hbmFnZSBzZW5kIGNhbGxiYWNrXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBzZXR1cFNlbmRDYWxsYmFjaygpIHtcbiAgICAgICAgLy8gdGhlIG1lc3NhZ2Ugd2FzIHNlbnQgc3VjY2Vzc2Z1bGx5LCBleGVjdXRlIHRoZSBjYWxsYmFja1xuICAgICAgICBjb25zdCBvbkRyYWluID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VudENhbGxiYWNrRm4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlcUZuID0gdGhpcy5zZW50Q2FsbGJhY2tGbi5zcGxpY2UoMCwgMSlbMF07XG4gICAgICAgICAgICAgICAgaWYgKFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIHNlcUZuKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKFwiZXhlY3V0aW5nIHNlbmQgY2FsbGJhY2tcIik7XG4gICAgICAgICAgICAgICAgICAgIHNlcUZuKHRoaXMudHJhbnNwb3J0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShzZXFGbikpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoXCJleGVjdXRpbmcgYmF0Y2ggc2VuZCBjYWxsYmFja1wiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbCA9IHNlcUZuLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIHNlcUZuW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VxRm5baV0odGhpcy50cmFuc3BvcnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnRyYW5zcG9ydC5vbihcImRyYWluXCIsIG9uRHJhaW4pO1xuICAgICAgICB0aGlzLmNsZWFudXBGbi5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0LnJlbW92ZUxpc3RlbmVyKFwiZHJhaW5cIiwgb25EcmFpbik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZW5kcyBhIG1lc3NhZ2UgcGFja2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHJldHVybiB7U29ja2V0fSBmb3IgY2hhaW5pbmdcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuICAgIHNlbmQoZGF0YSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5zZW5kUGFja2V0KFwibWVzc2FnZVwiLCBkYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB3cml0ZShkYXRhLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgICAgICB0aGlzLnNlbmRQYWNrZXQoXCJtZXNzYWdlXCIsIGRhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNlbmRzIGEgcGFja2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhY2tldCB0eXBlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbmFsLCBkYXRhXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBzZW5kUGFja2V0KHR5cGUsIGRhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBvcHRpb25zKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgICAgICAgICBvcHRpb25zID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgb3B0aW9ucy5jb21wcmVzcyA9IGZhbHNlICE9PSBvcHRpb25zLmNvbXByZXNzO1xuICAgICAgICBpZiAoXCJjbG9zaW5nXCIgIT09IHRoaXMucmVhZHlTdGF0ZSAmJiBcImNsb3NlZFwiICE9PSB0aGlzLnJlYWR5U3RhdGUpIHtcbiAgICAgICAgICAgIGRlYnVnKCdzZW5kaW5nIHBhY2tldCBcIiVzXCIgKCVzKScsIHR5cGUsIGRhdGEpO1xuICAgICAgICAgICAgY29uc3QgcGFja2V0ID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChkYXRhKVxuICAgICAgICAgICAgICAgIHBhY2tldC5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgIC8vIGV4cG9ydHMgcGFja2V0Q3JlYXRlIGV2ZW50XG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJwYWNrZXRDcmVhdGVcIiwgcGFja2V0KTtcbiAgICAgICAgICAgIHRoaXMud3JpdGVCdWZmZXIucHVzaChwYWNrZXQpO1xuICAgICAgICAgICAgLy8gYWRkIHNlbmQgY2FsbGJhY2sgdG8gb2JqZWN0LCBpZiBkZWZpbmVkXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spXG4gICAgICAgICAgICAgICAgdGhpcy5wYWNrZXRzRm4ucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICB0aGlzLmZsdXNoKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQXR0ZW1wdHMgdG8gZmx1c2ggdGhlIHBhY2tldHMgYnVmZmVyLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgZmx1c2goKSB7XG4gICAgICAgIGlmIChcImNsb3NlZFwiICE9PSB0aGlzLnJlYWR5U3RhdGUgJiZcbiAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0LndyaXRhYmxlICYmXG4gICAgICAgICAgICB0aGlzLndyaXRlQnVmZmVyLmxlbmd0aCkge1xuICAgICAgICAgICAgZGVidWcoXCJmbHVzaGluZyBidWZmZXIgdG8gdHJhbnNwb3J0XCIpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KFwiZmx1c2hcIiwgdGhpcy53cml0ZUJ1ZmZlcik7XG4gICAgICAgICAgICB0aGlzLnNlcnZlci5lbWl0KFwiZmx1c2hcIiwgdGhpcywgdGhpcy53cml0ZUJ1ZmZlcik7XG4gICAgICAgICAgICBjb25zdCB3YnVmID0gdGhpcy53cml0ZUJ1ZmZlcjtcbiAgICAgICAgICAgIHRoaXMud3JpdGVCdWZmZXIgPSBbXTtcbiAgICAgICAgICAgIGlmICghdGhpcy50cmFuc3BvcnQuc3VwcG9ydHNGcmFtaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZW50Q2FsbGJhY2tGbi5wdXNoKHRoaXMucGFja2V0c0ZuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VudENhbGxiYWNrRm4ucHVzaC5hcHBseSh0aGlzLnNlbnRDYWxsYmFja0ZuLCB0aGlzLnBhY2tldHNGbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBhY2tldHNGbiA9IFtdO1xuICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQuc2VuZCh3YnVmKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdChcImRyYWluXCIpO1xuICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuZW1pdChcImRyYWluXCIsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBhdmFpbGFibGUgdXBncmFkZXMgZm9yIHRoaXMgc29ja2V0LlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0QXZhaWxhYmxlVXBncmFkZXMoKSB7XG4gICAgICAgIGNvbnN0IGF2YWlsYWJsZVVwZ3JhZGVzID0gW107XG4gICAgICAgIGNvbnN0IGFsbFVwZ3JhZGVzID0gdGhpcy5zZXJ2ZXIudXBncmFkZXModGhpcy50cmFuc3BvcnQubmFtZSk7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgY29uc3QgbCA9IGFsbFVwZ3JhZGVzLmxlbmd0aDtcbiAgICAgICAgZm9yICg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHVwZyA9IGFsbFVwZ3JhZGVzW2ldO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VydmVyLm9wdHMudHJhbnNwb3J0cy5pbmRleE9mKHVwZykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlVXBncmFkZXMucHVzaCh1cGcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhdmFpbGFibGVVcGdyYWRlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xvc2VzIHRoZSBzb2NrZXQgYW5kIHVuZGVybHlpbmcgdHJhbnNwb3J0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBkaXNjYXJkIC0gb3B0aW9uYWwsIGRpc2NhcmQgdGhlIHRyYW5zcG9ydFxuICAgICAqIEByZXR1cm4ge1NvY2tldH0gZm9yIGNoYWluaW5nXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cbiAgICBjbG9zZShkaXNjYXJkKSB7XG4gICAgICAgIGlmIChcIm9wZW5cIiAhPT0gdGhpcy5yZWFkeVN0YXRlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLnJlYWR5U3RhdGUgPSBcImNsb3NpbmdcIjtcbiAgICAgICAgaWYgKHRoaXMud3JpdGVCdWZmZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLm9uY2UoXCJkcmFpblwiLCB0aGlzLmNsb3NlVHJhbnNwb3J0LmJpbmQodGhpcywgZGlzY2FyZCkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xvc2VUcmFuc3BvcnQoZGlzY2FyZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsb3NlcyB0aGUgdW5kZXJseWluZyB0cmFuc3BvcnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRpc2NhcmRcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBjbG9zZVRyYW5zcG9ydChkaXNjYXJkKSB7XG4gICAgICAgIGlmIChkaXNjYXJkKVxuICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQuZGlzY2FyZCgpO1xuICAgICAgICB0aGlzLnRyYW5zcG9ydC5jbG9zZSh0aGlzLm9uQ2xvc2UuYmluZCh0aGlzLCBcImZvcmNlZCBjbG9zZVwiKSk7XG4gICAgfVxufVxuZXhwb3J0cy5Tb2NrZXQgPSBTb2NrZXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVHJhbnNwb3J0ID0gdm9pZCAwO1xuY29uc3QgZXZlbnRzXzEgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xuY29uc3QgcGFyc2VyX3Y0ID0gcmVxdWlyZShcImVuZ2luZS5pby1wYXJzZXJcIik7XG5jb25zdCBwYXJzZXJfdjMgPSByZXF1aXJlKFwiLi9wYXJzZXItdjMvaW5kZXhcIik7XG5jb25zdCBkZWJ1Z18xID0gcmVxdWlyZShcImRlYnVnXCIpO1xuY29uc3QgZGVidWcgPSAoMCwgZGVidWdfMS5kZWZhdWx0KShcImVuZ2luZTp0cmFuc3BvcnRcIik7XG4vKipcbiAqIE5vb3AgZnVuY3Rpb24uXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIG5vb3AoKSB7IH1cbmNsYXNzIFRyYW5zcG9ydCBleHRlbmRzIGV2ZW50c18xLkV2ZW50RW1pdHRlciB7XG4gICAgLyoqXG4gICAgICogVHJhbnNwb3J0IGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtodHRwLkluY29taW5nTWVzc2FnZX0gcmVxdWVzdFxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocmVxKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucmVhZHlTdGF0ZSA9IFwib3BlblwiO1xuICAgICAgICB0aGlzLmRpc2NhcmRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnByb3RvY29sID0gcmVxLl9xdWVyeS5FSU8gPT09IFwiNFwiID8gNCA6IDM7IC8vIDNyZCByZXZpc2lvbiBieSBkZWZhdWx0XG4gICAgICAgIHRoaXMucGFyc2VyID0gdGhpcy5wcm90b2NvbCA9PT0gNCA/IHBhcnNlcl92NCA6IHBhcnNlcl92MztcbiAgICB9XG4gICAgZ2V0IHJlYWR5U3RhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWFkeVN0YXRlO1xuICAgIH1cbiAgICBzZXQgcmVhZHlTdGF0ZShzdGF0ZSkge1xuICAgICAgICBkZWJ1ZyhcInJlYWR5U3RhdGUgdXBkYXRlZCBmcm9tICVzIHRvICVzICglcylcIiwgdGhpcy5fcmVhZHlTdGF0ZSwgc3RhdGUsIHRoaXMubmFtZSk7XG4gICAgICAgIHRoaXMuX3JlYWR5U3RhdGUgPSBzdGF0ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRmxhZ3MgdGhlIHRyYW5zcG9ydCBhcyBkaXNjYXJkZWQuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBkaXNjYXJkKCkge1xuICAgICAgICB0aGlzLmRpc2NhcmRlZCA9IHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aXRoIGFuIGluY29taW5nIEhUVFAgcmVxdWVzdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7aHR0cC5JbmNvbWluZ01lc3NhZ2V9IHJlcXVlc3RcbiAgICAgKiBAYXBpIHByb3RlY3RlZFxuICAgICAqL1xuICAgIG9uUmVxdWVzdChyZXEpIHtcbiAgICAgICAgZGVidWcoXCJzZXR0aW5nIHJlcXVlc3RcIik7XG4gICAgICAgIHRoaXMucmVxID0gcmVxO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgdGhlIHRyYW5zcG9ydC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGNsb3NlKGZuKSB7XG4gICAgICAgIGlmIChcImNsb3NlZFwiID09PSB0aGlzLnJlYWR5U3RhdGUgfHwgXCJjbG9zaW5nXCIgPT09IHRoaXMucmVhZHlTdGF0ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5yZWFkeVN0YXRlID0gXCJjbG9zaW5nXCI7XG4gICAgICAgIHRoaXMuZG9DbG9zZShmbiB8fCBub29wKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdpdGggYSB0cmFuc3BvcnQgZXJyb3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBlcnJvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlcnJvciBkZXNjcmlwdGlvblxuICAgICAqIEBhcGkgcHJvdGVjdGVkXG4gICAgICovXG4gICAgb25FcnJvcihtc2csIGRlc2MpIHtcbiAgICAgICAgaWYgKHRoaXMubGlzdGVuZXJzKFwiZXJyb3JcIikubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IobXNnKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGVyci50eXBlID0gXCJUcmFuc3BvcnRFcnJvclwiO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgZXJyLmRlc2NyaXB0aW9uID0gZGVzYztcbiAgICAgICAgICAgIHRoaXMuZW1pdChcImVycm9yXCIsIGVycik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZWJ1ZyhcImlnbm9yZWQgdHJhbnNwb3J0IGVycm9yICVzICglcylcIiwgbXNnLCBkZXNjKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2l0aCBwYXJzZWQgb3V0IGEgcGFja2V0cyBmcm9tIHRoZSBkYXRhIHN0cmVhbS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYWNrZXRcbiAgICAgKiBAYXBpIHByb3RlY3RlZFxuICAgICAqL1xuICAgIG9uUGFja2V0KHBhY2tldCkge1xuICAgICAgICB0aGlzLmVtaXQoXCJwYWNrZXRcIiwgcGFja2V0KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdpdGggdGhlIGVuY29kZWQgcGFja2V0IGRhdGEuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YVxuICAgICAqIEBhcGkgcHJvdGVjdGVkXG4gICAgICovXG4gICAgb25EYXRhKGRhdGEpIHtcbiAgICAgICAgdGhpcy5vblBhY2tldCh0aGlzLnBhcnNlci5kZWNvZGVQYWNrZXQoZGF0YSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgdXBvbiB0cmFuc3BvcnQgY2xvc2UuXG4gICAgICpcbiAgICAgKiBAYXBpIHByb3RlY3RlZFxuICAgICAqL1xuICAgIG9uQ2xvc2UoKSB7XG4gICAgICAgIHRoaXMucmVhZHlTdGF0ZSA9IFwiY2xvc2VkXCI7XG4gICAgICAgIHRoaXMuZW1pdChcImNsb3NlXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuVHJhbnNwb3J0ID0gVHJhbnNwb3J0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBwb2xsaW5nXzEgPSByZXF1aXJlKFwiLi9wb2xsaW5nXCIpO1xuY29uc3Qgd2Vic29ja2V0XzEgPSByZXF1aXJlKFwiLi93ZWJzb2NrZXRcIik7XG5leHBvcnRzLmRlZmF1bHQgPSB7XG4gICAgcG9sbGluZzogcG9sbGluZ18xLlBvbGxpbmcsXG4gICAgd2Vic29ja2V0OiB3ZWJzb2NrZXRfMS5XZWJTb2NrZXRcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUG9sbGluZyA9IHZvaWQgMDtcbmNvbnN0IHRyYW5zcG9ydF8xID0gcmVxdWlyZShcIi4uL3RyYW5zcG9ydFwiKTtcbmNvbnN0IHpsaWJfMSA9IHJlcXVpcmUoXCJ6bGliXCIpO1xuY29uc3QgYWNjZXB0cyA9IHJlcXVpcmUoXCJhY2NlcHRzXCIpO1xuY29uc3QgZGVidWdfMSA9IHJlcXVpcmUoXCJkZWJ1Z1wiKTtcbmNvbnN0IGRlYnVnID0gKDAsIGRlYnVnXzEuZGVmYXVsdCkoXCJlbmdpbmU6cG9sbGluZ1wiKTtcbmNvbnN0IGNvbXByZXNzaW9uTWV0aG9kcyA9IHtcbiAgICBnemlwOiB6bGliXzEuY3JlYXRlR3ppcCxcbiAgICBkZWZsYXRlOiB6bGliXzEuY3JlYXRlRGVmbGF0ZVxufTtcbmNsYXNzIFBvbGxpbmcgZXh0ZW5kcyB0cmFuc3BvcnRfMS5UcmFuc3BvcnQge1xuICAgIC8qKlxuICAgICAqIEhUVFAgcG9sbGluZyBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHJlcSkge1xuICAgICAgICBzdXBlcihyZXEpO1xuICAgICAgICB0aGlzLmNsb3NlVGltZW91dCA9IDMwICogMTAwMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJhbnNwb3J0IG5hbWVcbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiBcInBvbGxpbmdcIjtcbiAgICB9XG4gICAgZ2V0IHN1cHBvcnRzRnJhbWluZygpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBPdmVycmlkZXMgb25SZXF1ZXN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHJlcVxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgb25SZXF1ZXN0KHJlcSkge1xuICAgICAgICBjb25zdCByZXMgPSByZXEucmVzO1xuICAgICAgICBpZiAocmVxLmdldE1ldGhvZCgpID09PSBcImdldFwiKSB7XG4gICAgICAgICAgICB0aGlzLm9uUG9sbFJlcXVlc3QocmVxLCByZXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJlcS5nZXRNZXRob2QoKSA9PT0gXCJwb3N0XCIpIHtcbiAgICAgICAgICAgIHRoaXMub25EYXRhUmVxdWVzdChyZXEsIHJlcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXMud3JpdGVTdGF0dXMoXCI1MDAgSW50ZXJuYWwgU2VydmVyIEVycm9yXCIpO1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBjbGllbnQgc2VuZHMgYSByZXF1ZXN0IGF3YWl0aW5nIGZvciB1cyB0byBzZW5kIGRhdGEuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBvblBvbGxSZXF1ZXN0KHJlcSwgcmVzKSB7XG4gICAgICAgIGlmICh0aGlzLnJlcSkge1xuICAgICAgICAgICAgZGVidWcoXCJyZXF1ZXN0IG92ZXJsYXBcIik7XG4gICAgICAgICAgICAvLyBhc3NlcnQ6IHRoaXMucmVzLCAnLnJlcSBhbmQgLnJlcyBzaG91bGQgYmUgKHVuKXNldCB0b2dldGhlcidcbiAgICAgICAgICAgIHRoaXMub25FcnJvcihcIm92ZXJsYXAgZnJvbSBjbGllbnRcIik7XG4gICAgICAgICAgICByZXMud3JpdGVTdGF0dXMoXCI1MDAgSW50ZXJuYWwgU2VydmVyIEVycm9yXCIpO1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRlYnVnKFwic2V0dGluZyByZXF1ZXN0XCIpO1xuICAgICAgICB0aGlzLnJlcSA9IHJlcTtcbiAgICAgICAgdGhpcy5yZXMgPSByZXM7XG4gICAgICAgIGNvbnN0IG9uQ2xvc2UgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLndyaXRhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm9uRXJyb3IoXCJwb2xsIGNvbm5lY3Rpb24gY2xvc2VkIHByZW1hdHVyZWx5XCIpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXEgPSB0aGlzLnJlcyA9IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIHJlcS5jbGVhbnVwID0gY2xlYW51cDtcbiAgICAgICAgcmVzLm9uQWJvcnRlZChvbkNsb3NlKTtcbiAgICAgICAgdGhpcy53cml0YWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuZW1pdChcImRyYWluXCIpO1xuICAgICAgICAvLyBpZiB3ZSdyZSBzdGlsbCB3cml0YWJsZSBidXQgaGFkIGEgcGVuZGluZyBjbG9zZSwgdHJpZ2dlciBhbiBlbXB0eSBzZW5kXG4gICAgICAgIGlmICh0aGlzLndyaXRhYmxlICYmIHRoaXMuc2hvdWxkQ2xvc2UpIHtcbiAgICAgICAgICAgIGRlYnVnKFwidHJpZ2dlcmluZyBlbXB0eSBzZW5kIHRvIGFwcGVuZCBjbG9zZSBwYWNrZXRcIik7XG4gICAgICAgICAgICB0aGlzLnNlbmQoW3sgdHlwZTogXCJub29wXCIgfV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBjbGllbnQgc2VuZHMgYSByZXF1ZXN0IHdpdGggZGF0YS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uRGF0YVJlcXVlc3QocmVxLCByZXMpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVJlcSkge1xuICAgICAgICAgICAgLy8gYXNzZXJ0OiB0aGlzLmRhdGFSZXMsICcuZGF0YVJlcSBhbmQgLmRhdGFSZXMgc2hvdWxkIGJlICh1bilzZXQgdG9nZXRoZXInXG4gICAgICAgICAgICB0aGlzLm9uRXJyb3IoXCJkYXRhIHJlcXVlc3Qgb3ZlcmxhcCBmcm9tIGNsaWVudFwiKTtcbiAgICAgICAgICAgIHJlcy53cml0ZVN0YXR1cyhcIjUwMCBJbnRlcm5hbCBTZXJ2ZXIgRXJyb3JcIik7XG4gICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXNCaW5hcnkgPSBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiID09PSByZXEuaGVhZGVyc1tcImNvbnRlbnQtdHlwZVwiXTtcbiAgICAgICAgaWYgKGlzQmluYXJ5ICYmIHRoaXMucHJvdG9jb2wgPT09IDQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9uRXJyb3IoXCJpbnZhbGlkIGNvbnRlbnRcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRhUmVxID0gcmVxO1xuICAgICAgICB0aGlzLmRhdGFSZXMgPSByZXM7XG4gICAgICAgIGxldCBjaHVua3MgPSBbXTtcbiAgICAgICAgbGV0IGNvbnRlbnRMZW5ndGggPSAwO1xuICAgICAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYXRhUmVxID0gdGhpcy5kYXRhUmVzID0gY2h1bmtzID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgb25DbG9zZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgIHRoaXMub25FcnJvcihcImRhdGEgcmVxdWVzdCBjb25uZWN0aW9uIGNsb3NlZCBwcmVtYXR1cmVseVwiKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IHtcbiAgICAgICAgICAgIC8vIHRleHQvaHRtbCBpcyByZXF1aXJlZCBpbnN0ZWFkIG9mIHRleHQvcGxhaW4gdG8gYXZvaWQgYW5cbiAgICAgICAgICAgIC8vIHVud2FudGVkIGRvd25sb2FkIGRpYWxvZyBvbiBjZXJ0YWluIHVzZXItYWdlbnRzIChHSC00MylcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwidGV4dC9odG1sXCJcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5oZWFkZXJzKHJlcSwgaGVhZGVycyk7XG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIHJlcy53cml0ZUhlYWRlcihrZXksIFN0cmluZyhoZWFkZXJzW2tleV0pKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG9uRW5kID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkRhdGEoQnVmZmVyLmNvbmNhdChjaHVua3MpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSAhPT0gXCJjbG9zaW5nXCIpIHtcbiAgICAgICAgICAgICAgICByZXMuZW5kKFwib2tcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcy5vbkFib3J0ZWQob25DbG9zZSk7XG4gICAgICAgIHJlcy5vbkRhdGEoKGNodW5rLCBpc0xhc3QpID0+IHtcbiAgICAgICAgICAgIGNodW5rcy5wdXNoKEJ1ZmZlci5mcm9tKGNodW5rKSk7XG4gICAgICAgICAgICBjb250ZW50TGVuZ3RoICs9IEJ1ZmZlci5ieXRlTGVuZ3RoKGNodW5rKTtcbiAgICAgICAgICAgIGlmIChjb250ZW50TGVuZ3RoID4gdGhpcy5tYXhIdHRwQnVmZmVyU2l6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMub25FcnJvcihcInBheWxvYWQgdG9vIGxhcmdlXCIpO1xuICAgICAgICAgICAgICAgIHJlcy53cml0ZVN0YXR1cyhcIjQxMyBQYXlsb2FkIFRvbyBMYXJnZVwiKTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzTGFzdCkge1xuICAgICAgICAgICAgICAgIG9uRW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcm9jZXNzZXMgdGhlIGluY29taW5nIGRhdGEgcGF5bG9hZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBlbmNvZGVkIHBheWxvYWRcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBvbkRhdGEoZGF0YSkge1xuICAgICAgICBkZWJ1ZygncmVjZWl2ZWQgXCIlc1wiJywgZGF0YSk7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gcGFja2V0ID0+IHtcbiAgICAgICAgICAgIGlmIChcImNsb3NlXCIgPT09IHBhY2tldC50eXBlKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoXCJnb3QgeGhyIGNsb3NlIHBhY2tldFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xvc2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9uUGFja2V0KHBhY2tldCk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLnByb3RvY29sID09PSAzKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlci5kZWNvZGVQYXlsb2FkKGRhdGEsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VyLmRlY29kZVBheWxvYWQoZGF0YSkuZm9yRWFjaChjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogT3ZlcnJpZGVzIG9uQ2xvc2UuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBvbkNsb3NlKCkge1xuICAgICAgICBpZiAodGhpcy53cml0YWJsZSkge1xuICAgICAgICAgICAgLy8gY2xvc2UgcGVuZGluZyBwb2xsIHJlcXVlc3RcbiAgICAgICAgICAgIHRoaXMuc2VuZChbeyB0eXBlOiBcIm5vb3BcIiB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIub25DbG9zZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBXcml0ZXMgYSBwYWNrZXQgcGF5bG9hZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYWNrZXRcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBzZW5kKHBhY2tldHMpIHtcbiAgICAgICAgdGhpcy53cml0YWJsZSA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5zaG91bGRDbG9zZSkge1xuICAgICAgICAgICAgZGVidWcoXCJhcHBlbmRpbmcgY2xvc2UgcGFja2V0IHRvIHBheWxvYWRcIik7XG4gICAgICAgICAgICBwYWNrZXRzLnB1c2goeyB0eXBlOiBcImNsb3NlXCIgfSk7XG4gICAgICAgICAgICB0aGlzLnNob3VsZENsb3NlKCk7XG4gICAgICAgICAgICB0aGlzLnNob3VsZENsb3NlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkb1dyaXRlID0gZGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb21wcmVzcyA9IHBhY2tldHMuc29tZShwYWNrZXQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYWNrZXQub3B0aW9ucyAmJiBwYWNrZXQub3B0aW9ucy5jb21wcmVzcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy53cml0ZShkYXRhLCB7IGNvbXByZXNzIH0pO1xuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy5wcm90b2NvbCA9PT0gMykge1xuICAgICAgICAgICAgdGhpcy5wYXJzZXIuZW5jb2RlUGF5bG9hZChwYWNrZXRzLCB0aGlzLnN1cHBvcnRzQmluYXJ5LCBkb1dyaXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VyLmVuY29kZVBheWxvYWQocGFja2V0cywgZG9Xcml0ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogV3JpdGVzIGRhdGEgYXMgcmVzcG9uc2UgdG8gcG9sbCByZXF1ZXN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGFcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHdyaXRlKGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgZGVidWcoJ3dyaXRpbmcgXCIlc1wiJywgZGF0YSk7XG4gICAgICAgIHRoaXMuZG9Xcml0ZShkYXRhLCBvcHRpb25zLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlcS5jbGVhbnVwKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyB0aGUgd3JpdGUuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBkb1dyaXRlKGRhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIGV4cGxpY2l0IFVURi04IGlzIHJlcXVpcmVkIGZvciBwYWdlcyBub3Qgc2VydmVkIHVuZGVyIHV0ZlxuICAgICAgICBjb25zdCBpc1N0cmluZyA9IHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiO1xuICAgICAgICBjb25zdCBjb250ZW50VHlwZSA9IGlzU3RyaW5nXG4gICAgICAgICAgICA/IFwidGV4dC9wbGFpbjsgY2hhcnNldD1VVEYtOFwiXG4gICAgICAgICAgICA6IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCI7XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBjb250ZW50VHlwZVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCByZXNwb25kID0gZGF0YSA9PiB7XG4gICAgICAgICAgICB0aGlzLmhlYWRlcnModGhpcy5yZXEsIGhlYWRlcnMpO1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzLndyaXRlSGVhZGVyKGtleSwgU3RyaW5nKGhlYWRlcnNba2V5XSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnJlcy5lbmQoZGF0YSk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoIXRoaXMuaHR0cENvbXByZXNzaW9uIHx8ICFvcHRpb25zLmNvbXByZXNzKSB7XG4gICAgICAgICAgICByZXNwb25kKGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxlbiA9IGlzU3RyaW5nID8gQnVmZmVyLmJ5dGVMZW5ndGgoZGF0YSkgOiBkYXRhLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbiA8IHRoaXMuaHR0cENvbXByZXNzaW9uLnRocmVzaG9sZCkge1xuICAgICAgICAgICAgcmVzcG9uZChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlbmNvZGluZyA9IGFjY2VwdHModGhpcy5yZXEpLmVuY29kaW5ncyhbXCJnemlwXCIsIFwiZGVmbGF0ZVwiXSk7XG4gICAgICAgIGlmICghZW5jb2RpbmcpIHtcbiAgICAgICAgICAgIHJlc3BvbmQoZGF0YSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wcmVzcyhkYXRhLCBlbmNvZGluZywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzLndyaXRlU3RhdHVzKFwiNTAwIEludGVybmFsIFNlcnZlciBFcnJvclwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhlYWRlcnNbXCJDb250ZW50LUVuY29kaW5nXCJdID0gZW5jb2Rpbmc7XG4gICAgICAgICAgICByZXNwb25kKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHJlc3NlcyBkYXRhLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgY29tcHJlc3MoZGF0YSwgZW5jb2RpbmcsIGNhbGxiYWNrKSB7XG4gICAgICAgIGRlYnVnKFwiY29tcHJlc3NpbmdcIik7XG4gICAgICAgIGNvbnN0IGJ1ZmZlcnMgPSBbXTtcbiAgICAgICAgbGV0IG5yZWFkID0gMDtcbiAgICAgICAgY29tcHJlc3Npb25NZXRob2RzW2VuY29kaW5nXSh0aGlzLmh0dHBDb21wcmVzc2lvbilcbiAgICAgICAgICAgIC5vbihcImVycm9yXCIsIGNhbGxiYWNrKVxuICAgICAgICAgICAgLm9uKFwiZGF0YVwiLCBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICAgICAgICAgIGJ1ZmZlcnMucHVzaChjaHVuayk7XG4gICAgICAgICAgICBucmVhZCArPSBjaHVuay5sZW5ndGg7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAub24oXCJlbmRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgQnVmZmVyLmNvbmNhdChidWZmZXJzLCBucmVhZCkpO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmVuZChkYXRhKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xvc2VzIHRoZSB0cmFuc3BvcnQuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBkb0Nsb3NlKGZuKSB7XG4gICAgICAgIGRlYnVnKFwiY2xvc2luZ1wiKTtcbiAgICAgICAgbGV0IGNsb3NlVGltZW91dFRpbWVyO1xuICAgICAgICBjb25zdCBvbkNsb3NlID0gKCkgPT4ge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGNsb3NlVGltZW91dFRpbWVyKTtcbiAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2UoKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMud3JpdGFibGUpIHtcbiAgICAgICAgICAgIGRlYnVnKFwidHJhbnNwb3J0IHdyaXRhYmxlIC0gY2xvc2luZyByaWdodCBhd2F5XCIpO1xuICAgICAgICAgICAgdGhpcy5zZW5kKFt7IHR5cGU6IFwiY2xvc2VcIiB9XSk7XG4gICAgICAgICAgICBvbkNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5kaXNjYXJkZWQpIHtcbiAgICAgICAgICAgIGRlYnVnKFwidHJhbnNwb3J0IGRpc2NhcmRlZCAtIGNsb3NpbmcgcmlnaHQgYXdheVwiKTtcbiAgICAgICAgICAgIG9uQ2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlYnVnKFwidHJhbnNwb3J0IG5vdCB3cml0YWJsZSAtIGJ1ZmZlcmluZyBvcmRlcmx5IGNsb3NlXCIpO1xuICAgICAgICAgICAgdGhpcy5zaG91bGRDbG9zZSA9IG9uQ2xvc2U7XG4gICAgICAgICAgICBjbG9zZVRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQob25DbG9zZSwgdGhpcy5jbG9zZVRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaGVhZGVycyBmb3IgYSByZXNwb25zZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByZXEgLSByZXF1ZXN0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGV4dHJhIGhlYWRlcnNcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBoZWFkZXJzKHJlcSwgaGVhZGVycykge1xuICAgICAgICBoZWFkZXJzID0gaGVhZGVycyB8fCB7fTtcbiAgICAgICAgLy8gcHJldmVudCBYU1Mgd2FybmluZ3Mgb24gSUVcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL0xlYXJuQm9vc3Qvc29ja2V0LmlvL3B1bGwvMTMzM1xuICAgICAgICBjb25zdCB1YSA9IHJlcS5oZWFkZXJzW1widXNlci1hZ2VudFwiXTtcbiAgICAgICAgaWYgKHVhICYmICh+dWEuaW5kZXhPZihcIjtNU0lFXCIpIHx8IH51YS5pbmRleE9mKFwiVHJpZGVudC9cIikpKSB7XG4gICAgICAgICAgICBoZWFkZXJzW1wiWC1YU1MtUHJvdGVjdGlvblwiXSA9IFwiMFwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdChcImhlYWRlcnNcIiwgaGVhZGVycywgcmVxKTtcbiAgICAgICAgcmV0dXJuIGhlYWRlcnM7XG4gICAgfVxufVxuZXhwb3J0cy5Qb2xsaW5nID0gUG9sbGluZztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5XZWJTb2NrZXQgPSB2b2lkIDA7XG5jb25zdCB0cmFuc3BvcnRfMSA9IHJlcXVpcmUoXCIuLi90cmFuc3BvcnRcIik7XG5jb25zdCBkZWJ1Z18xID0gcmVxdWlyZShcImRlYnVnXCIpO1xuY29uc3QgZGVidWcgPSAoMCwgZGVidWdfMS5kZWZhdWx0KShcImVuZ2luZTp3c1wiKTtcbmNsYXNzIFdlYlNvY2tldCBleHRlbmRzIHRyYW5zcG9ydF8xLlRyYW5zcG9ydCB7XG4gICAgLyoqXG4gICAgICogV2ViU29ja2V0IHRyYW5zcG9ydFxuICAgICAqXG4gICAgICogQHBhcmFtIHJlcVxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocmVxKSB7XG4gICAgICAgIHN1cGVyKHJlcSk7XG4gICAgICAgIHRoaXMud3JpdGFibGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wZXJNZXNzYWdlRGVmbGF0ZSA9IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRyYW5zcG9ydCBuYW1lXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuICAgIGdldCBuYW1lKCkge1xuICAgICAgICByZXR1cm4gXCJ3ZWJzb2NrZXRcIjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWR2ZXJ0aXNlIHVwZ3JhZGUgc3VwcG9ydC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgZ2V0IGhhbmRsZXNVcGdyYWRlcygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkdmVydGlzZSBmcmFtaW5nIHN1cHBvcnQuXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuICAgIGdldCBzdXBwb3J0c0ZyYW1pbmcoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBXcml0ZXMgYSBwYWNrZXQgcGF5bG9hZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHBhY2tldHNcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBzZW5kKHBhY2tldHMpIHtcbiAgICAgICAgY29uc3QgcGFja2V0ID0gcGFja2V0cy5zaGlmdCgpO1xuICAgICAgICBpZiAodHlwZW9mIHBhY2tldCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy53cml0YWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJkcmFpblwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBhbHdheXMgY3JlYXRlcyBhIG5ldyBvYmplY3Qgc2luY2Ugd3MgbW9kaWZpZXMgaXRcbiAgICAgICAgY29uc3Qgb3B0cyA9IHt9O1xuICAgICAgICBpZiAocGFja2V0Lm9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdHMuY29tcHJlc3MgPSBwYWNrZXQub3B0aW9ucy5jb21wcmVzcztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZW5kID0gZGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpc0JpbmFyeSA9IHR5cGVvZiBkYXRhICE9PSBcInN0cmluZ1wiO1xuICAgICAgICAgICAgY29uc3QgY29tcHJlc3MgPSB0aGlzLnBlck1lc3NhZ2VEZWZsYXRlICYmXG4gICAgICAgICAgICAgICAgQnVmZmVyLmJ5dGVMZW5ndGgoZGF0YSkgPiB0aGlzLnBlck1lc3NhZ2VEZWZsYXRlLnRocmVzaG9sZDtcbiAgICAgICAgICAgIGRlYnVnKCd3cml0aW5nIFwiJXNcIicsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy53cml0YWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChkYXRhLCBpc0JpbmFyeSwgY29tcHJlc3MpO1xuICAgICAgICAgICAgdGhpcy5zZW5kKHBhY2tldHMpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAocGFja2V0Lm9wdGlvbnMgJiYgdHlwZW9mIHBhY2tldC5vcHRpb25zLndzUHJlRW5jb2RlZCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgc2VuZChwYWNrZXQub3B0aW9ucy53c1ByZUVuY29kZWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJzZXIuZW5jb2RlUGFja2V0KHBhY2tldCwgdGhpcy5zdXBwb3J0c0JpbmFyeSwgc2VuZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xvc2VzIHRoZSB0cmFuc3BvcnQuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBkb0Nsb3NlKGZuKSB7XG4gICAgICAgIGRlYnVnKFwiY2xvc2luZ1wiKTtcbiAgICAgICAgZm4gJiYgZm4oKTtcbiAgICAgICAgLy8gY2FsbCBmbiBmaXJzdCBzaW5jZSBzb2NrZXQuY2xvc2UoKSBpbW1lZGlhdGVseSBlbWl0cyBhIFwiY2xvc2VcIiBldmVudFxuICAgICAgICB0aGlzLnNvY2tldC5jbG9zZSgpO1xuICAgIH1cbn1cbmV4cG9ydHMuV2ViU29ja2V0ID0gV2ViU29ja2V0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBwb2xsaW5nXzEgPSByZXF1aXJlKFwiLi9wb2xsaW5nXCIpO1xuY29uc3QgcG9sbGluZ19qc29ucF8xID0gcmVxdWlyZShcIi4vcG9sbGluZy1qc29ucFwiKTtcbmNvbnN0IHdlYnNvY2tldF8xID0gcmVxdWlyZShcIi4vd2Vic29ja2V0XCIpO1xuZXhwb3J0cy5kZWZhdWx0ID0ge1xuICAgIHBvbGxpbmc6IHBvbGxpbmcsXG4gICAgd2Vic29ja2V0OiB3ZWJzb2NrZXRfMS5XZWJTb2NrZXRcbn07XG4vKipcbiAqIFBvbGxpbmcgcG9seW1vcnBoaWMgY29uc3RydWN0b3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHBvbGxpbmcocmVxKSB7XG4gICAgaWYgKFwic3RyaW5nXCIgPT09IHR5cGVvZiByZXEuX3F1ZXJ5LmopIHtcbiAgICAgICAgcmV0dXJuIG5ldyBwb2xsaW5nX2pzb25wXzEuSlNPTlAocmVxKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgcG9sbGluZ18xLlBvbGxpbmcocmVxKTtcbiAgICB9XG59XG5wb2xsaW5nLnVwZ3JhZGVzVG8gPSBbXCJ3ZWJzb2NrZXRcIl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuSlNPTlAgPSB2b2lkIDA7XG5jb25zdCBwb2xsaW5nXzEgPSByZXF1aXJlKFwiLi9wb2xsaW5nXCIpO1xuY29uc3QgcXMgPSByZXF1aXJlKFwicXVlcnlzdHJpbmdcIik7XG5jb25zdCByRG91YmxlU2xhc2hlcyA9IC9cXFxcXFxcXG4vZztcbmNvbnN0IHJTbGFzaGVzID0gLyhcXFxcKT9cXFxcbi9nO1xuY2xhc3MgSlNPTlAgZXh0ZW5kcyBwb2xsaW5nXzEuUG9sbGluZyB7XG4gICAgLyoqXG4gICAgICogSlNPTi1QIHBvbGxpbmcgdHJhbnNwb3J0LlxuICAgICAqXG4gICAgICogQGFwaSBwdWJsaWNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihyZXEpIHtcbiAgICAgICAgc3VwZXIocmVxKTtcbiAgICAgICAgdGhpcy5oZWFkID0gXCJfX19laW9bXCIgKyAocmVxLl9xdWVyeS5qIHx8IFwiXCIpLnJlcGxhY2UoL1teMC05XS9nLCBcIlwiKSArIFwiXShcIjtcbiAgICAgICAgdGhpcy5mb290ID0gXCIpO1wiO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGluY29taW5nIGRhdGEuXG4gICAgICogRHVlIHRvIGEgYnVnIGluIFxcbiBoYW5kbGluZyBieSBicm93c2Vycywgd2UgZXhwZWN0IGEgZXNjYXBlZCBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBvbkRhdGEoZGF0YSkge1xuICAgICAgICAvLyB3ZSBsZXZlcmFnZSB0aGUgcXMgbW9kdWxlIHNvIHRoYXQgd2UgZ2V0IGJ1aWx0LWluIERvUyBwcm90ZWN0aW9uXG4gICAgICAgIC8vIGFuZCB0aGUgZmFzdCBhbHRlcm5hdGl2ZSB0byBkZWNvZGVVUklDb21wb25lbnRcbiAgICAgICAgZGF0YSA9IHFzLnBhcnNlKGRhdGEpLmQ7XG4gICAgICAgIGlmIChcInN0cmluZ1wiID09PSB0eXBlb2YgZGF0YSkge1xuICAgICAgICAgICAgLy8gY2xpZW50IHdpbGwgc2VuZCBhbHJlYWR5IGVzY2FwZWQgbmV3bGluZXMgYXMgXFxcXFxcXFxuIGFuZCBuZXdsaW5lcyBhcyBcXFxcblxuICAgICAgICAgICAgLy8gXFxcXG4gbXVzdCBiZSByZXBsYWNlZCB3aXRoIFxcbiBhbmQgXFxcXFxcXFxuIHdpdGggXFxcXG5cbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLnJlcGxhY2UoclNsYXNoZXMsIGZ1bmN0aW9uIChtYXRjaCwgc2xhc2hlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzbGFzaGVzID8gbWF0Y2ggOiBcIlxcblwiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdXBlci5vbkRhdGEoZGF0YS5yZXBsYWNlKHJEb3VibGVTbGFzaGVzLCBcIlxcXFxuXCIpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyB0aGUgd3JpdGUuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBkb1dyaXRlKGRhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIHdlIG11c3Qgb3V0cHV0IHZhbGlkIGphdmFzY3JpcHQsIG5vdCB2YWxpZCBqc29uXG4gICAgICAgIC8vIHNlZTogaHR0cDovL3RpbWVsZXNzcmVwby5jb20vanNvbi1pc250LWEtamF2YXNjcmlwdC1zdWJzZXRcbiAgICAgICAgY29uc3QganMgPSBKU09OLnN0cmluZ2lmeShkYXRhKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcdTIwMjgvZywgXCJcXFxcdTIwMjhcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHUyMDI5L2csIFwiXFxcXHUyMDI5XCIpO1xuICAgICAgICAvLyBwcmVwYXJlIHJlc3BvbnNlXG4gICAgICAgIGRhdGEgPSB0aGlzLmhlYWQgKyBqcyArIHRoaXMuZm9vdDtcbiAgICAgICAgc3VwZXIuZG9Xcml0ZShkYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XG4gICAgfVxufVxuZXhwb3J0cy5KU09OUCA9IEpTT05QO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlBvbGxpbmcgPSB2b2lkIDA7XG5jb25zdCB0cmFuc3BvcnRfMSA9IHJlcXVpcmUoXCIuLi90cmFuc3BvcnRcIik7XG5jb25zdCB6bGliXzEgPSByZXF1aXJlKFwiemxpYlwiKTtcbmNvbnN0IGFjY2VwdHMgPSByZXF1aXJlKFwiYWNjZXB0c1wiKTtcbmNvbnN0IGRlYnVnXzEgPSByZXF1aXJlKFwiZGVidWdcIik7XG5jb25zdCBkZWJ1ZyA9ICgwLCBkZWJ1Z18xLmRlZmF1bHQpKFwiZW5naW5lOnBvbGxpbmdcIik7XG5jb25zdCBjb21wcmVzc2lvbk1ldGhvZHMgPSB7XG4gICAgZ3ppcDogemxpYl8xLmNyZWF0ZUd6aXAsXG4gICAgZGVmbGF0ZTogemxpYl8xLmNyZWF0ZURlZmxhdGVcbn07XG5jbGFzcyBQb2xsaW5nIGV4dGVuZHMgdHJhbnNwb3J0XzEuVHJhbnNwb3J0IHtcbiAgICAvKipcbiAgICAgKiBIVFRQIHBvbGxpbmcgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpYy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihyZXEpIHtcbiAgICAgICAgc3VwZXIocmVxKTtcbiAgICAgICAgdGhpcy5jbG9zZVRpbWVvdXQgPSAzMCAqIDEwMDA7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRyYW5zcG9ydCBuYW1lXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuICAgIGdldCBuYW1lKCkge1xuICAgICAgICByZXR1cm4gXCJwb2xsaW5nXCI7XG4gICAgfVxuICAgIGdldCBzdXBwb3J0c0ZyYW1pbmcoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogT3ZlcnJpZGVzIG9uUmVxdWVzdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7aHR0cC5JbmNvbWluZ01lc3NhZ2V9XG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgb25SZXF1ZXN0KHJlcSkge1xuICAgICAgICBjb25zdCByZXMgPSByZXEucmVzO1xuICAgICAgICBpZiAoXCJHRVRcIiA9PT0gcmVxLm1ldGhvZCkge1xuICAgICAgICAgICAgdGhpcy5vblBvbGxSZXF1ZXN0KHJlcSwgcmVzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChcIlBPU1RcIiA9PT0gcmVxLm1ldGhvZCkge1xuICAgICAgICAgICAgdGhpcy5vbkRhdGFSZXF1ZXN0KHJlcSwgcmVzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoNTAwKTtcbiAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgY2xpZW50IHNlbmRzIGEgcmVxdWVzdCBhd2FpdGluZyBmb3IgdXMgdG8gc2VuZCBkYXRhLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgb25Qb2xsUmVxdWVzdChyZXEsIHJlcykge1xuICAgICAgICBpZiAodGhpcy5yZXEpIHtcbiAgICAgICAgICAgIGRlYnVnKFwicmVxdWVzdCBvdmVybGFwXCIpO1xuICAgICAgICAgICAgLy8gYXNzZXJ0OiB0aGlzLnJlcywgJy5yZXEgYW5kIC5yZXMgc2hvdWxkIGJlICh1bilzZXQgdG9nZXRoZXInXG4gICAgICAgICAgICB0aGlzLm9uRXJyb3IoXCJvdmVybGFwIGZyb20gY2xpZW50XCIpO1xuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg1MDApO1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRlYnVnKFwic2V0dGluZyByZXF1ZXN0XCIpO1xuICAgICAgICB0aGlzLnJlcSA9IHJlcTtcbiAgICAgICAgdGhpcy5yZXMgPSByZXM7XG4gICAgICAgIGNvbnN0IG9uQ2xvc2UgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRXJyb3IoXCJwb2xsIGNvbm5lY3Rpb24gY2xvc2VkIHByZW1hdHVyZWx5XCIpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVxLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIiwgb25DbG9zZSk7XG4gICAgICAgICAgICB0aGlzLnJlcSA9IHRoaXMucmVzID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxLmNsZWFudXAgPSBjbGVhbnVwO1xuICAgICAgICByZXEub24oXCJjbG9zZVwiLCBvbkNsb3NlKTtcbiAgICAgICAgdGhpcy53cml0YWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuZW1pdChcImRyYWluXCIpO1xuICAgICAgICAvLyBpZiB3ZSdyZSBzdGlsbCB3cml0YWJsZSBidXQgaGFkIGEgcGVuZGluZyBjbG9zZSwgdHJpZ2dlciBhbiBlbXB0eSBzZW5kXG4gICAgICAgIGlmICh0aGlzLndyaXRhYmxlICYmIHRoaXMuc2hvdWxkQ2xvc2UpIHtcbiAgICAgICAgICAgIGRlYnVnKFwidHJpZ2dlcmluZyBlbXB0eSBzZW5kIHRvIGFwcGVuZCBjbG9zZSBwYWNrZXRcIik7XG4gICAgICAgICAgICB0aGlzLnNlbmQoW3sgdHlwZTogXCJub29wXCIgfV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBjbGllbnQgc2VuZHMgYSByZXF1ZXN0IHdpdGggZGF0YS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uRGF0YVJlcXVlc3QocmVxLCByZXMpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVJlcSkge1xuICAgICAgICAgICAgLy8gYXNzZXJ0OiB0aGlzLmRhdGFSZXMsICcuZGF0YVJlcSBhbmQgLmRhdGFSZXMgc2hvdWxkIGJlICh1bilzZXQgdG9nZXRoZXInXG4gICAgICAgICAgICB0aGlzLm9uRXJyb3IoXCJkYXRhIHJlcXVlc3Qgb3ZlcmxhcCBmcm9tIGNsaWVudFwiKTtcbiAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoNTAwKTtcbiAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpc0JpbmFyeSA9IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIgPT09IHJlcS5oZWFkZXJzW1wiY29udGVudC10eXBlXCJdO1xuICAgICAgICBpZiAoaXNCaW5hcnkgJiYgdGhpcy5wcm90b2NvbCA9PT0gNCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub25FcnJvcihcImludmFsaWQgY29udGVudFwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGFSZXEgPSByZXE7XG4gICAgICAgIHRoaXMuZGF0YVJlcyA9IHJlcztcbiAgICAgICAgbGV0IGNodW5rcyA9IGlzQmluYXJ5ID8gQnVmZmVyLmNvbmNhdChbXSkgOiBcIlwiO1xuICAgICAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVxLnJlbW92ZUxpc3RlbmVyKFwiZGF0YVwiLCBvbkRhdGEpO1xuICAgICAgICAgICAgcmVxLnJlbW92ZUxpc3RlbmVyKFwiZW5kXCIsIG9uRW5kKTtcbiAgICAgICAgICAgIHJlcS5yZW1vdmVMaXN0ZW5lcihcImNsb3NlXCIsIG9uQ2xvc2UpO1xuICAgICAgICAgICAgdGhpcy5kYXRhUmVxID0gdGhpcy5kYXRhUmVzID0gY2h1bmtzID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgb25DbG9zZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgIHRoaXMub25FcnJvcihcImRhdGEgcmVxdWVzdCBjb25uZWN0aW9uIGNsb3NlZCBwcmVtYXR1cmVseVwiKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgb25EYXRhID0gZGF0YSA9PiB7XG4gICAgICAgICAgICBsZXQgY29udGVudExlbmd0aDtcbiAgICAgICAgICAgIGlmIChpc0JpbmFyeSkge1xuICAgICAgICAgICAgICAgIGNodW5rcyA9IEJ1ZmZlci5jb25jYXQoW2NodW5rcywgZGF0YV0pO1xuICAgICAgICAgICAgICAgIGNvbnRlbnRMZW5ndGggPSBjaHVua3MubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2h1bmtzICs9IGRhdGE7XG4gICAgICAgICAgICAgICAgY29udGVudExlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKGNodW5rcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGVudExlbmd0aCA+IHRoaXMubWF4SHR0cEJ1ZmZlclNpemUpIHtcbiAgICAgICAgICAgICAgICBjaHVua3MgPSBpc0JpbmFyeSA/IEJ1ZmZlci5jb25jYXQoW10pIDogXCJcIjtcbiAgICAgICAgICAgICAgICByZXEuY29ubmVjdGlvbi5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG9uRW5kID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkRhdGEoY2h1bmtzKTtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAgICAgLy8gdGV4dC9odG1sIGlzIHJlcXVpcmVkIGluc3RlYWQgb2YgdGV4dC9wbGFpbiB0byBhdm9pZCBhblxuICAgICAgICAgICAgICAgIC8vIHVud2FudGVkIGRvd25sb2FkIGRpYWxvZyBvbiBjZXJ0YWluIHVzZXItYWdlbnRzIChHSC00MylcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcInRleHQvaHRtbFwiLFxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1MZW5ndGhcIjogMlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB0aGlzLmhlYWRlcnMocmVxLCBoZWFkZXJzKSk7XG4gICAgICAgICAgICByZXMuZW5kKFwib2tcIik7XG4gICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcS5vbihcImNsb3NlXCIsIG9uQ2xvc2UpO1xuICAgICAgICBpZiAoIWlzQmluYXJ5KVxuICAgICAgICAgICAgcmVxLnNldEVuY29kaW5nKFwidXRmOFwiKTtcbiAgICAgICAgcmVxLm9uKFwiZGF0YVwiLCBvbkRhdGEpO1xuICAgICAgICByZXEub24oXCJlbmRcIiwgb25FbmQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcm9jZXNzZXMgdGhlIGluY29taW5nIGRhdGEgcGF5bG9hZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBlbmNvZGVkIHBheWxvYWRcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBvbkRhdGEoZGF0YSkge1xuICAgICAgICBkZWJ1ZygncmVjZWl2ZWQgXCIlc1wiJywgZGF0YSk7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gcGFja2V0ID0+IHtcbiAgICAgICAgICAgIGlmIChcImNsb3NlXCIgPT09IHBhY2tldC50eXBlKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoXCJnb3QgeGhyIGNsb3NlIHBhY2tldFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xvc2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9uUGFja2V0KHBhY2tldCk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLnByb3RvY29sID09PSAzKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlci5kZWNvZGVQYXlsb2FkKGRhdGEsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VyLmRlY29kZVBheWxvYWQoZGF0YSkuZm9yRWFjaChjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogT3ZlcnJpZGVzIG9uQ2xvc2UuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBvbkNsb3NlKCkge1xuICAgICAgICBpZiAodGhpcy53cml0YWJsZSkge1xuICAgICAgICAgICAgLy8gY2xvc2UgcGVuZGluZyBwb2xsIHJlcXVlc3RcbiAgICAgICAgICAgIHRoaXMuc2VuZChbeyB0eXBlOiBcIm5vb3BcIiB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIub25DbG9zZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBXcml0ZXMgYSBwYWNrZXQgcGF5bG9hZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYWNrZXRcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBzZW5kKHBhY2tldHMpIHtcbiAgICAgICAgdGhpcy53cml0YWJsZSA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5zaG91bGRDbG9zZSkge1xuICAgICAgICAgICAgZGVidWcoXCJhcHBlbmRpbmcgY2xvc2UgcGFja2V0IHRvIHBheWxvYWRcIik7XG4gICAgICAgICAgICBwYWNrZXRzLnB1c2goeyB0eXBlOiBcImNsb3NlXCIgfSk7XG4gICAgICAgICAgICB0aGlzLnNob3VsZENsb3NlKCk7XG4gICAgICAgICAgICB0aGlzLnNob3VsZENsb3NlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkb1dyaXRlID0gZGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb21wcmVzcyA9IHBhY2tldHMuc29tZShwYWNrZXQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYWNrZXQub3B0aW9ucyAmJiBwYWNrZXQub3B0aW9ucy5jb21wcmVzcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy53cml0ZShkYXRhLCB7IGNvbXByZXNzIH0pO1xuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy5wcm90b2NvbCA9PT0gMykge1xuICAgICAgICAgICAgdGhpcy5wYXJzZXIuZW5jb2RlUGF5bG9hZChwYWNrZXRzLCB0aGlzLnN1cHBvcnRzQmluYXJ5LCBkb1dyaXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VyLmVuY29kZVBheWxvYWQocGFja2V0cywgZG9Xcml0ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogV3JpdGVzIGRhdGEgYXMgcmVzcG9uc2UgdG8gcG9sbCByZXF1ZXN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGFcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHdyaXRlKGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgZGVidWcoJ3dyaXRpbmcgXCIlc1wiJywgZGF0YSk7XG4gICAgICAgIHRoaXMuZG9Xcml0ZShkYXRhLCBvcHRpb25zLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlcS5jbGVhbnVwKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyB0aGUgd3JpdGUuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBkb1dyaXRlKGRhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIGV4cGxpY2l0IFVURi04IGlzIHJlcXVpcmVkIGZvciBwYWdlcyBub3Qgc2VydmVkIHVuZGVyIHV0ZlxuICAgICAgICBjb25zdCBpc1N0cmluZyA9IHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiO1xuICAgICAgICBjb25zdCBjb250ZW50VHlwZSA9IGlzU3RyaW5nXG4gICAgICAgICAgICA/IFwidGV4dC9wbGFpbjsgY2hhcnNldD1VVEYtOFwiXG4gICAgICAgICAgICA6IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCI7XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBjb250ZW50VHlwZVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCByZXNwb25kID0gZGF0YSA9PiB7XG4gICAgICAgICAgICBoZWFkZXJzW1wiQ29udGVudC1MZW5ndGhcIl0gPVxuICAgICAgICAgICAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBkYXRhID8gQnVmZmVyLmJ5dGVMZW5ndGgoZGF0YSkgOiBkYXRhLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMucmVzLndyaXRlSGVhZCgyMDAsIHRoaXMuaGVhZGVycyh0aGlzLnJlcSwgaGVhZGVycykpO1xuICAgICAgICAgICAgdGhpcy5yZXMuZW5kKGRhdGEpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCF0aGlzLmh0dHBDb21wcmVzc2lvbiB8fCAhb3B0aW9ucy5jb21wcmVzcykge1xuICAgICAgICAgICAgcmVzcG9uZChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsZW4gPSBpc1N0cmluZyA/IEJ1ZmZlci5ieXRlTGVuZ3RoKGRhdGEpIDogZGF0YS5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPCB0aGlzLmh0dHBDb21wcmVzc2lvbi50aHJlc2hvbGQpIHtcbiAgICAgICAgICAgIHJlc3BvbmQoZGF0YSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZW5jb2RpbmcgPSBhY2NlcHRzKHRoaXMucmVxKS5lbmNvZGluZ3MoW1wiZ3ppcFwiLCBcImRlZmxhdGVcIl0pO1xuICAgICAgICBpZiAoIWVuY29kaW5nKSB7XG4gICAgICAgICAgICByZXNwb25kKGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29tcHJlc3MoZGF0YSwgZW5jb2RpbmcsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcy53cml0ZUhlYWQoNTAwKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhlYWRlcnNbXCJDb250ZW50LUVuY29kaW5nXCJdID0gZW5jb2Rpbmc7XG4gICAgICAgICAgICByZXNwb25kKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHJlc3NlcyBkYXRhLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgY29tcHJlc3MoZGF0YSwgZW5jb2RpbmcsIGNhbGxiYWNrKSB7XG4gICAgICAgIGRlYnVnKFwiY29tcHJlc3NpbmdcIik7XG4gICAgICAgIGNvbnN0IGJ1ZmZlcnMgPSBbXTtcbiAgICAgICAgbGV0IG5yZWFkID0gMDtcbiAgICAgICAgY29tcHJlc3Npb25NZXRob2RzW2VuY29kaW5nXSh0aGlzLmh0dHBDb21wcmVzc2lvbilcbiAgICAgICAgICAgIC5vbihcImVycm9yXCIsIGNhbGxiYWNrKVxuICAgICAgICAgICAgLm9uKFwiZGF0YVwiLCBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICAgICAgICAgIGJ1ZmZlcnMucHVzaChjaHVuayk7XG4gICAgICAgICAgICBucmVhZCArPSBjaHVuay5sZW5ndGg7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAub24oXCJlbmRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgQnVmZmVyLmNvbmNhdChidWZmZXJzLCBucmVhZCkpO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmVuZChkYXRhKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xvc2VzIHRoZSB0cmFuc3BvcnQuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBkb0Nsb3NlKGZuKSB7XG4gICAgICAgIGRlYnVnKFwiY2xvc2luZ1wiKTtcbiAgICAgICAgbGV0IGNsb3NlVGltZW91dFRpbWVyO1xuICAgICAgICBpZiAodGhpcy5kYXRhUmVxKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcImFib3J0aW5nIG9uZ29pbmcgZGF0YSByZXF1ZXN0XCIpO1xuICAgICAgICAgICAgdGhpcy5kYXRhUmVxLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvbkNsb3NlID0gKCkgPT4ge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGNsb3NlVGltZW91dFRpbWVyKTtcbiAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2UoKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMud3JpdGFibGUpIHtcbiAgICAgICAgICAgIGRlYnVnKFwidHJhbnNwb3J0IHdyaXRhYmxlIC0gY2xvc2luZyByaWdodCBhd2F5XCIpO1xuICAgICAgICAgICAgdGhpcy5zZW5kKFt7IHR5cGU6IFwiY2xvc2VcIiB9XSk7XG4gICAgICAgICAgICBvbkNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5kaXNjYXJkZWQpIHtcbiAgICAgICAgICAgIGRlYnVnKFwidHJhbnNwb3J0IGRpc2NhcmRlZCAtIGNsb3NpbmcgcmlnaHQgYXdheVwiKTtcbiAgICAgICAgICAgIG9uQ2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlYnVnKFwidHJhbnNwb3J0IG5vdCB3cml0YWJsZSAtIGJ1ZmZlcmluZyBvcmRlcmx5IGNsb3NlXCIpO1xuICAgICAgICAgICAgdGhpcy5zaG91bGRDbG9zZSA9IG9uQ2xvc2U7XG4gICAgICAgICAgICBjbG9zZVRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQob25DbG9zZSwgdGhpcy5jbG9zZVRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaGVhZGVycyBmb3IgYSByZXNwb25zZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7aHR0cC5JbmNvbWluZ01lc3NhZ2V9IHJlcXVlc3RcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXh0cmEgaGVhZGVyc1xuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGhlYWRlcnMocmVxLCBoZWFkZXJzKSB7XG4gICAgICAgIGhlYWRlcnMgPSBoZWFkZXJzIHx8IHt9O1xuICAgICAgICAvLyBwcmV2ZW50IFhTUyB3YXJuaW5ncyBvbiBJRVxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTGVhcm5Cb29zdC9zb2NrZXQuaW8vcHVsbC8xMzMzXG4gICAgICAgIGNvbnN0IHVhID0gcmVxLmhlYWRlcnNbXCJ1c2VyLWFnZW50XCJdO1xuICAgICAgICBpZiAodWEgJiYgKH51YS5pbmRleE9mKFwiO01TSUVcIikgfHwgfnVhLmluZGV4T2YoXCJUcmlkZW50L1wiKSkpIHtcbiAgICAgICAgICAgIGhlYWRlcnNbXCJYLVhTUy1Qcm90ZWN0aW9uXCJdID0gXCIwXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbWl0KFwiaGVhZGVyc1wiLCBoZWFkZXJzLCByZXEpO1xuICAgICAgICByZXR1cm4gaGVhZGVycztcbiAgICB9XG59XG5leHBvcnRzLlBvbGxpbmcgPSBQb2xsaW5nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLldlYlNvY2tldCA9IHZvaWQgMDtcbmNvbnN0IHRyYW5zcG9ydF8xID0gcmVxdWlyZShcIi4uL3RyYW5zcG9ydFwiKTtcbmNvbnN0IGRlYnVnXzEgPSByZXF1aXJlKFwiZGVidWdcIik7XG5jb25zdCBkZWJ1ZyA9ICgwLCBkZWJ1Z18xLmRlZmF1bHQpKFwiZW5naW5lOndzXCIpO1xuY2xhc3MgV2ViU29ja2V0IGV4dGVuZHMgdHJhbnNwb3J0XzEuVHJhbnNwb3J0IHtcbiAgICAvKipcbiAgICAgKiBXZWJTb2NrZXQgdHJhbnNwb3J0XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2h0dHAuSW5jb21pbmdNZXNzYWdlfVxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocmVxKSB7XG4gICAgICAgIHN1cGVyKHJlcSk7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gcmVxLndlYnNvY2tldDtcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJtZXNzYWdlXCIsIChkYXRhLCBpc0JpbmFyeSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGlzQmluYXJ5ID8gZGF0YSA6IGRhdGEudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGRlYnVnKCdyZWNlaXZlZCBcIiVzXCInLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIHN1cGVyLm9uRGF0YShtZXNzYWdlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc29ja2V0Lm9uY2UoXCJjbG9zZVwiLCB0aGlzLm9uQ2xvc2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwiZXJyb3JcIiwgdGhpcy5vbkVycm9yLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wZXJNZXNzYWdlRGVmbGF0ZSA9IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRyYW5zcG9ydCBuYW1lXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuICAgIGdldCBuYW1lKCkge1xuICAgICAgICByZXR1cm4gXCJ3ZWJzb2NrZXRcIjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWR2ZXJ0aXNlIHVwZ3JhZGUgc3VwcG9ydC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHVibGljXG4gICAgICovXG4gICAgZ2V0IGhhbmRsZXNVcGdyYWRlcygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkdmVydGlzZSBmcmFtaW5nIHN1cHBvcnQuXG4gICAgICpcbiAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAqL1xuICAgIGdldCBzdXBwb3J0c0ZyYW1pbmcoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBXcml0ZXMgYSBwYWNrZXQgcGF5bG9hZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHBhY2tldHNcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBzZW5kKHBhY2tldHMpIHtcbiAgICAgICAgY29uc3QgcGFja2V0ID0gcGFja2V0cy5zaGlmdCgpO1xuICAgICAgICBpZiAodHlwZW9mIHBhY2tldCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy53cml0YWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJkcmFpblwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBhbHdheXMgY3JlYXRlcyBhIG5ldyBvYmplY3Qgc2luY2Ugd3MgbW9kaWZpZXMgaXRcbiAgICAgICAgY29uc3Qgb3B0cyA9IHt9O1xuICAgICAgICBpZiAocGFja2V0Lm9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdHMuY29tcHJlc3MgPSBwYWNrZXQub3B0aW9ucy5jb21wcmVzcztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZW5kID0gZGF0YSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5wZXJNZXNzYWdlRGVmbGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxlbiA9IFwic3RyaW5nXCIgPT09IHR5cGVvZiBkYXRhID8gQnVmZmVyLmJ5dGVMZW5ndGgoZGF0YSkgOiBkYXRhLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAobGVuIDwgdGhpcy5wZXJNZXNzYWdlRGVmbGF0ZS50aHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5jb21wcmVzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlYnVnKCd3cml0aW5nIFwiJXNcIicsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy53cml0YWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChkYXRhLCBvcHRzLCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9uRXJyb3IoXCJ3cml0ZSBlcnJvclwiLCBlcnIuc3RhY2spO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZChwYWNrZXRzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBpZiAocGFja2V0Lm9wdGlvbnMgJiYgdHlwZW9mIHBhY2tldC5vcHRpb25zLndzUHJlRW5jb2RlZCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgc2VuZChwYWNrZXQub3B0aW9ucy53c1ByZUVuY29kZWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJzZXIuZW5jb2RlUGFja2V0KHBhY2tldCwgdGhpcy5zdXBwb3J0c0JpbmFyeSwgc2VuZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xvc2VzIHRoZSB0cmFuc3BvcnQuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBkb0Nsb3NlKGZuKSB7XG4gICAgICAgIGRlYnVnKFwiY2xvc2luZ1wiKTtcbiAgICAgICAgdGhpcy5zb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgZm4gJiYgZm4oKTtcbiAgICB9XG59XG5leHBvcnRzLldlYlNvY2tldCA9IFdlYlNvY2tldDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy51U2VydmVyID0gdm9pZCAwO1xuY29uc3QgZGVidWdfMSA9IHJlcXVpcmUoXCJkZWJ1Z1wiKTtcbmNvbnN0IHNlcnZlcl8xID0gcmVxdWlyZShcIi4vc2VydmVyXCIpO1xuY29uc3QgdHJhbnNwb3J0c191d3NfMSA9IHJlcXVpcmUoXCIuL3RyYW5zcG9ydHMtdXdzXCIpO1xuY29uc3QgZGVidWcgPSAoMCwgZGVidWdfMS5kZWZhdWx0KShcImVuZ2luZTp1d3NcIik7XG5jbGFzcyB1U2VydmVyIGV4dGVuZHMgc2VydmVyXzEuQmFzZVNlcnZlciB7XG4gICAgaW5pdCgpIHsgfVxuICAgIGNsZWFudXAoKSB7IH1cbiAgICAvKipcbiAgICAgKiBQcmVwYXJlcyBhIHJlcXVlc3QgYnkgcHJvY2Vzc2luZyB0aGUgcXVlcnkgc3RyaW5nLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgcHJlcGFyZShyZXEsIHJlcykge1xuICAgICAgICByZXEubWV0aG9kID0gcmVxLmdldE1ldGhvZCgpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocmVxLmdldFF1ZXJ5KCkpO1xuICAgICAgICByZXEuX3F1ZXJ5ID0gT2JqZWN0LmZyb21FbnRyaWVzKHBhcmFtcy5lbnRyaWVzKCkpO1xuICAgICAgICByZXEuaGVhZGVycyA9IHt9O1xuICAgICAgICByZXEuZm9yRWFjaCgoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgcmVxLmhlYWRlcnNba2V5XSA9IHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVxLmNvbm5lY3Rpb24gPSB7XG4gICAgICAgICAgICByZW1vdGVBZGRyZXNzOiBCdWZmZXIuZnJvbShyZXMuZ2V0UmVtb3RlQWRkcmVzc0FzVGV4dCgpKS50b1N0cmluZygpXG4gICAgICAgIH07XG4gICAgfVxuICAgIGNyZWF0ZVRyYW5zcG9ydCh0cmFuc3BvcnROYW1lLCByZXEpIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0cmFuc3BvcnRzX3V3c18xLmRlZmF1bHRbdHJhbnNwb3J0TmFtZV0ocmVxKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXR0YWNoIHRoZSBlbmdpbmUgdG8gYSDCtVdlYlNvY2tldHMuanMgc2VydmVyXG4gICAgICogQHBhcmFtIGFwcFxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICovXG4gICAgYXR0YWNoKGFwcCAvKiA6IFRlbXBsYXRlZEFwcCAqLywgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSAob3B0aW9ucy5wYXRoIHx8IFwiL2VuZ2luZS5pb1wiKS5yZXBsYWNlKC9cXC8kLywgXCJcIikgKyBcIi9cIjtcbiAgICAgICAgYXBwXG4gICAgICAgICAgICAuYW55KHBhdGgsIHRoaXMuaGFuZGxlUmVxdWVzdC5iaW5kKHRoaXMpKVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC53cyhwYXRoLCB7XG4gICAgICAgICAgICBtYXhQYXlsb2FkTGVuZ3RoOiB0aGlzLm9wdHMubWF4SHR0cEJ1ZmZlclNpemUsXG4gICAgICAgICAgICB1cGdyYWRlOiB0aGlzLmhhbmRsZVVwZ3JhZGUuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIG9wZW46IHdzID0+IHtcbiAgICAgICAgICAgICAgICB3cy50cmFuc3BvcnQuc29ja2V0ID0gd3M7XG4gICAgICAgICAgICAgICAgd3MudHJhbnNwb3J0LndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB3cy50cmFuc3BvcnQuZW1pdChcImRyYWluXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICh3cywgbWVzc2FnZSwgaXNCaW5hcnkpID0+IHtcbiAgICAgICAgICAgICAgICB3cy50cmFuc3BvcnQub25EYXRhKGlzQmluYXJ5ID8gbWVzc2FnZSA6IEJ1ZmZlci5mcm9tKG1lc3NhZ2UpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlOiAod3MsIGNvZGUsIG1lc3NhZ2UpID0+IHtcbiAgICAgICAgICAgICAgICB3cy50cmFuc3BvcnQub25DbG9zZShjb2RlLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGhhbmRsZVJlcXVlc3QocmVzLCByZXEpIHtcbiAgICAgICAgZGVidWcoJ2hhbmRsaW5nIFwiJXNcIiBodHRwIHJlcXVlc3QgXCIlc1wiJywgcmVxLmdldE1ldGhvZCgpLCByZXEuZ2V0VXJsKCkpO1xuICAgICAgICB0aGlzLnByZXBhcmUocmVxLCByZXMpO1xuICAgICAgICByZXEucmVzID0gcmVzO1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IChlcnJvckNvZGUsIGVycm9yQ29udGV4dCkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yQ29kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwiY29ubmVjdGlvbl9lcnJvclwiLCB7XG4gICAgICAgICAgICAgICAgICAgIHJlcSxcbiAgICAgICAgICAgICAgICAgICAgY29kZTogZXJyb3JDb2RlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBzZXJ2ZXJfMS5TZXJ2ZXIuZXJyb3JNZXNzYWdlc1tlcnJvckNvZGVdLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBlcnJvckNvbnRleHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmFib3J0UmVxdWVzdChyZXEucmVzLCBlcnJvckNvZGUsIGVycm9yQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlcS5fcXVlcnkuc2lkKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoXCJzZXR0aW5nIG5ldyByZXF1ZXN0IGZvciBleGlzdGluZyBjbGllbnRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGllbnRzW3JlcS5fcXVlcnkuc2lkXS50cmFuc3BvcnQub25SZXF1ZXN0KHJlcSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9zZUNvbm5lY3Rpb24gPSAoZXJyb3JDb2RlLCBlcnJvckNvbnRleHQpID0+IHRoaXMuYWJvcnRSZXF1ZXN0KHJlcywgZXJyb3JDb2RlLCBlcnJvckNvbnRleHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZHNoYWtlKHJlcS5fcXVlcnkudHJhbnNwb3J0LCByZXEsIGNsb3NlQ29ubmVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLmNvcnNNaWRkbGV3YXJlKSB7XG4gICAgICAgICAgICAvLyBuZWVkZWQgdG8gYnVmZmVyIGhlYWRlcnMgdW50aWwgdGhlIHN0YXR1cyBpcyBjb21wdXRlZFxuICAgICAgICAgICAgcmVxLnJlcyA9IG5ldyBSZXNwb25zZVdyYXBwZXIocmVzKTtcbiAgICAgICAgICAgIHRoaXMuY29yc01pZGRsZXdhcmUuY2FsbChudWxsLCByZXEsIHJlcS5yZXMsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnZlcmlmeShyZXEsIGZhbHNlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudmVyaWZ5KHJlcSwgZmFsc2UsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoYW5kbGVVcGdyYWRlKHJlcywgcmVxLCBjb250ZXh0KSB7XG4gICAgICAgIGRlYnVnKFwib24gdXBncmFkZVwiKTtcbiAgICAgICAgdGhpcy5wcmVwYXJlKHJlcSwgcmVzKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXEucmVzID0gcmVzO1xuICAgICAgICB0aGlzLnZlcmlmeShyZXEsIHRydWUsIGFzeW5jIChlcnJvckNvZGUsIGVycm9yQ29udGV4dCkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yQ29kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcImNvbm5lY3Rpb25fZXJyb3JcIiwge1xuICAgICAgICAgICAgICAgICAgICByZXEsXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IGVycm9yQ29kZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogc2VydmVyXzEuU2VydmVyLmVycm9yTWVzc2FnZXNbZXJyb3JDb2RlXSxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dDogZXJyb3JDb250ZXh0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QocmVzLCBlcnJvckNvZGUsIGVycm9yQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaWQgPSByZXEuX3F1ZXJ5LnNpZDtcbiAgICAgICAgICAgIGxldCB0cmFuc3BvcnQ7XG4gICAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGllbnQgPSB0aGlzLmNsaWVudHNbaWRdO1xuICAgICAgICAgICAgICAgIGlmICghY2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKFwidXBncmFkZSBhdHRlbXB0IGZvciBjbG9zZWQgY2xpZW50XCIpO1xuICAgICAgICAgICAgICAgICAgICByZXMuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2xpZW50LnVwZ3JhZGluZykge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1ZyhcInRyYW5zcG9ydCBoYXMgYWxyZWFkeSBiZWVuIHRyeWluZyB0byB1cGdyYWRlXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXMuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2xpZW50LnVwZ3JhZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKFwidHJhbnNwb3J0IGhhZCBhbHJlYWR5IGJlZW4gdXBncmFkZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoXCJ1cGdyYWRpbmcgZXhpc3RpbmcgdHJhbnNwb3J0XCIpO1xuICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnQgPSB0aGlzLmNyZWF0ZVRyYW5zcG9ydChyZXEuX3F1ZXJ5LnRyYW5zcG9ydCwgcmVxKTtcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50Lm1heWJlVXBncmFkZSh0cmFuc3BvcnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyYW5zcG9ydCA9IGF3YWl0IHRoaXMuaGFuZHNoYWtlKHJlcS5fcXVlcnkudHJhbnNwb3J0LCByZXEsIChlcnJvckNvZGUsIGVycm9yQ29udGV4dCkgPT4gdGhpcy5hYm9ydFJlcXVlc3QocmVzLCBlcnJvckNvZGUsIGVycm9yQ29udGV4dCkpO1xuICAgICAgICAgICAgICAgIGlmICghdHJhbnNwb3J0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMudXBncmFkZSh7XG4gICAgICAgICAgICAgICAgdHJhbnNwb3J0XG4gICAgICAgICAgICB9LCByZXEuZ2V0SGVhZGVyKFwic2VjLXdlYnNvY2tldC1rZXlcIiksIHJlcS5nZXRIZWFkZXIoXCJzZWMtd2Vic29ja2V0LXByb3RvY29sXCIpLCByZXEuZ2V0SGVhZGVyKFwic2VjLXdlYnNvY2tldC1leHRlbnNpb25zXCIpLCBjb250ZXh0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFib3J0UmVxdWVzdChyZXMsIGVycm9yQ29kZSwgZXJyb3JDb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IHN0YXR1c0NvZGUgPSBlcnJvckNvZGUgPT09IHNlcnZlcl8xLlNlcnZlci5lcnJvcnMuRk9SQklEREVOXG4gICAgICAgICAgICA/IFwiNDAzIEZvcmJpZGRlblwiXG4gICAgICAgICAgICA6IFwiNDAwIEJhZCBSZXF1ZXN0XCI7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlcnJvckNvbnRleHQgJiYgZXJyb3JDb250ZXh0Lm1lc3NhZ2VcbiAgICAgICAgICAgID8gZXJyb3JDb250ZXh0Lm1lc3NhZ2VcbiAgICAgICAgICAgIDogc2VydmVyXzEuU2VydmVyLmVycm9yTWVzc2FnZXNbZXJyb3JDb2RlXTtcbiAgICAgICAgcmVzLndyaXRlU3RhdHVzKHN0YXR1c0NvZGUpO1xuICAgICAgICByZXMud3JpdGVIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGNvZGU6IGVycm9yQ29kZSxcbiAgICAgICAgICAgIG1lc3NhZ2VcbiAgICAgICAgfSkpO1xuICAgIH1cbn1cbmV4cG9ydHMudVNlcnZlciA9IHVTZXJ2ZXI7XG5jbGFzcyBSZXNwb25zZVdyYXBwZXIge1xuICAgIGNvbnN0cnVjdG9yKHJlcykge1xuICAgICAgICB0aGlzLnJlcyA9IHJlcztcbiAgICAgICAgdGhpcy5zdGF0dXNXcml0dGVuID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IFtdO1xuICAgIH1cbiAgICBzZXQgc3RhdHVzQ29kZShzdGF0dXMpIHtcbiAgICAgICAgdGhpcy53cml0ZVN0YXR1cyhzdGF0dXMgPT09IDIwMCA/IFwiMjAwIE9LXCIgOiBcIjIwNCBObyBDb250ZW50XCIpO1xuICAgIH1cbiAgICBzZXRIZWFkZXIoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0aGlzLndyaXRlSGVhZGVyKGtleSwgdmFsdWUpO1xuICAgIH1cbiAgICAvLyBuZWVkZWQgYnkgdmFyeTogaHR0cHM6Ly9naXRodWIuY29tL2pzaHR0cC92YXJ5L2Jsb2IvNWQ3MjVkMDU5YjM4NzEwMjVjZjc1M2U5ZGZhMDg5MjRkMGJjZmE4Zi9pbmRleC5qcyNMMTM0XG4gICAgZ2V0SGVhZGVyKCkgeyB9XG4gICAgd3JpdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgICAgIHRoaXMucmVzLndyaXRlU3RhdHVzKHN0YXR1cyk7XG4gICAgICAgIHRoaXMuc3RhdHVzV3JpdHRlbiA9IHRydWU7XG4gICAgICAgIHRoaXMud3JpdGVCdWZmZXJlZEhlYWRlcnMoKTtcbiAgICB9XG4gICAgd3JpdGVIZWFkZXIoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoa2V5ID09PSBcIkNvbnRlbnQtTGVuZ3RoXCIpIHtcbiAgICAgICAgICAgIC8vIHRoZSBjb250ZW50IGxlbmd0aCBpcyBhdXRvbWF0aWNhbGx5IGFkZGVkIGJ5IHVXZWJTb2NrZXRzLmpzXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzV3JpdHRlbikge1xuICAgICAgICAgICAgdGhpcy5yZXMud3JpdGVIZWFkZXIoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhlYWRlcnMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHdyaXRlQnVmZmVyZWRIZWFkZXJzKCkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlcy53cml0ZUhlYWRlcihrZXksIHZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVuZChkYXRhKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0dXNXcml0dGVuKSB7XG4gICAgICAgICAgICAvLyBzdGF0dXMgd2lsbCBiZSBpbmZlcnJlZCBhcyBcIjIwMCBPS1wiXG4gICAgICAgICAgICB0aGlzLndyaXRlQnVmZmVyZWRIZWFkZXJzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXMuZW5kKGRhdGEpO1xuICAgIH1cbiAgICBvbkFib3J0ZWQoZm4pIHtcbiAgICAgICAgdGhpcy5yZXMub25BYm9ydGVkKGZuKTtcbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUmVtb3RlU29ja2V0ID0gZXhwb3J0cy5Ccm9hZGNhc3RPcGVyYXRvciA9IHZvaWQgMDtcbmNvbnN0IHNvY2tldF8xID0gcmVxdWlyZShcIi4vc29ja2V0XCIpO1xuY29uc3Qgc29ja2V0X2lvX3BhcnNlcl8xID0gcmVxdWlyZShcInNvY2tldC5pby1wYXJzZXJcIik7XG5jbGFzcyBCcm9hZGNhc3RPcGVyYXRvciB7XG4gICAgY29uc3RydWN0b3IoYWRhcHRlciwgcm9vbXMgPSBuZXcgU2V0KCksIGV4Y2VwdFJvb21zID0gbmV3IFNldCgpLCBmbGFncyA9IHt9KSB7XG4gICAgICAgIHRoaXMuYWRhcHRlciA9IGFkYXB0ZXI7XG4gICAgICAgIHRoaXMucm9vbXMgPSByb29tcztcbiAgICAgICAgdGhpcy5leGNlcHRSb29tcyA9IGV4Y2VwdFJvb21zO1xuICAgICAgICB0aGlzLmZsYWdzID0gZmxhZ3M7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRhcmdldHMgYSByb29tIHdoZW4gZW1pdHRpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9vbVxuICAgICAqIEByZXR1cm4gYSBuZXcgQnJvYWRjYXN0T3BlcmF0b3IgaW5zdGFuY2VcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgdG8ocm9vbSkge1xuICAgICAgICBjb25zdCByb29tcyA9IG5ldyBTZXQodGhpcy5yb29tcyk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJvb20pKSB7XG4gICAgICAgICAgICByb29tLmZvckVhY2goKHIpID0+IHJvb21zLmFkZChyKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByb29tcy5hZGQocm9vbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBCcm9hZGNhc3RPcGVyYXRvcih0aGlzLmFkYXB0ZXIsIHJvb21zLCB0aGlzLmV4Y2VwdFJvb21zLCB0aGlzLmZsYWdzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGFyZ2V0cyBhIHJvb20gd2hlbiBlbWl0dGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByb29tXG4gICAgICogQHJldHVybiBhIG5ldyBCcm9hZGNhc3RPcGVyYXRvciBpbnN0YW5jZVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBpbihyb29tKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvKHJvb20pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFeGNsdWRlcyBhIHJvb20gd2hlbiBlbWl0dGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByb29tXG4gICAgICogQHJldHVybiBhIG5ldyBCcm9hZGNhc3RPcGVyYXRvciBpbnN0YW5jZVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBleGNlcHQocm9vbSkge1xuICAgICAgICBjb25zdCBleGNlcHRSb29tcyA9IG5ldyBTZXQodGhpcy5leGNlcHRSb29tcyk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJvb20pKSB7XG4gICAgICAgICAgICByb29tLmZvckVhY2goKHIpID0+IGV4Y2VwdFJvb21zLmFkZChyKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBleGNlcHRSb29tcy5hZGQocm9vbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBCcm9hZGNhc3RPcGVyYXRvcih0aGlzLmFkYXB0ZXIsIHRoaXMucm9vbXMsIGV4Y2VwdFJvb21zLCB0aGlzLmZsYWdzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgY29tcHJlc3MgZmxhZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb21wcmVzcyAtIGlmIGB0cnVlYCwgY29tcHJlc3NlcyB0aGUgc2VuZGluZyBkYXRhXG4gICAgICogQHJldHVybiBhIG5ldyBCcm9hZGNhc3RPcGVyYXRvciBpbnN0YW5jZVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBjb21wcmVzcyhjb21wcmVzcykge1xuICAgICAgICBjb25zdCBmbGFncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZmxhZ3MsIHsgY29tcHJlc3MgfSk7XG4gICAgICAgIHJldHVybiBuZXcgQnJvYWRjYXN0T3BlcmF0b3IodGhpcy5hZGFwdGVyLCB0aGlzLnJvb21zLCB0aGlzLmV4Y2VwdFJvb21zLCBmbGFncyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgYSBtb2RpZmllciBmb3IgYSBzdWJzZXF1ZW50IGV2ZW50IGVtaXNzaW9uIHRoYXQgdGhlIGV2ZW50IGRhdGEgbWF5IGJlIGxvc3QgaWYgdGhlIGNsaWVudCBpcyBub3QgcmVhZHkgdG9cbiAgICAgKiByZWNlaXZlIG1lc3NhZ2VzIChiZWNhdXNlIG9mIG5ldHdvcmsgc2xvd25lc3Mgb3Igb3RoZXIgaXNzdWVzLCBvciBiZWNhdXNlIHRoZXnigJlyZSBjb25uZWN0ZWQgdGhyb3VnaCBsb25nIHBvbGxpbmdcbiAgICAgKiBhbmQgaXMgaW4gdGhlIG1pZGRsZSBvZiBhIHJlcXVlc3QtcmVzcG9uc2UgY3ljbGUpLlxuICAgICAqXG4gICAgICogQHJldHVybiBhIG5ldyBCcm9hZGNhc3RPcGVyYXRvciBpbnN0YW5jZVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBnZXQgdm9sYXRpbGUoKSB7XG4gICAgICAgIGNvbnN0IGZsYWdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5mbGFncywgeyB2b2xhdGlsZTogdHJ1ZSB9KTtcbiAgICAgICAgcmV0dXJuIG5ldyBCcm9hZGNhc3RPcGVyYXRvcih0aGlzLmFkYXB0ZXIsIHRoaXMucm9vbXMsIHRoaXMuZXhjZXB0Um9vbXMsIGZsYWdzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBhIG1vZGlmaWVyIGZvciBhIHN1YnNlcXVlbnQgZXZlbnQgZW1pc3Npb24gdGhhdCB0aGUgZXZlbnQgZGF0YSB3aWxsIG9ubHkgYmUgYnJvYWRjYXN0IHRvIHRoZSBjdXJyZW50IG5vZGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGEgbmV3IEJyb2FkY2FzdE9wZXJhdG9yIGluc3RhbmNlXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGdldCBsb2NhbCgpIHtcbiAgICAgICAgY29uc3QgZmxhZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmZsYWdzLCB7IGxvY2FsOiB0cnVlIH0pO1xuICAgICAgICByZXR1cm4gbmV3IEJyb2FkY2FzdE9wZXJhdG9yKHRoaXMuYWRhcHRlciwgdGhpcy5yb29tcywgdGhpcy5leGNlcHRSb29tcywgZmxhZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFbWl0cyB0byBhbGwgY2xpZW50cy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gQWx3YXlzIHRydWVcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZW1pdChldiwgLi4uYXJncykge1xuICAgICAgICBpZiAoc29ja2V0XzEuUkVTRVJWRURfRVZFTlRTLmhhcyhldikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgXCIke2V2fVwiIGlzIGEgcmVzZXJ2ZWQgZXZlbnQgbmFtZWApO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNldCB1cCBwYWNrZXQgb2JqZWN0XG4gICAgICAgIGNvbnN0IGRhdGEgPSBbZXYsIC4uLmFyZ3NdO1xuICAgICAgICBjb25zdCBwYWNrZXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBzb2NrZXRfaW9fcGFyc2VyXzEuUGFja2V0VHlwZS5FVkVOVCxcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIH07XG4gICAgICAgIGlmIChcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIGRhdGFbZGF0YS5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGJhY2tzIGFyZSBub3Qgc3VwcG9ydGVkIHdoZW4gYnJvYWRjYXN0aW5nXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRhcHRlci5icm9hZGNhc3QocGFja2V0LCB7XG4gICAgICAgICAgICByb29tczogdGhpcy5yb29tcyxcbiAgICAgICAgICAgIGV4Y2VwdDogdGhpcy5leGNlcHRSb29tcyxcbiAgICAgICAgICAgIGZsYWdzOiB0aGlzLmZsYWdzLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgYSBsaXN0IG9mIGNsaWVudHMuXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgYWxsU29ja2V0cygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmFkYXB0ZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGFkYXB0ZXIgZm9yIHRoaXMgbmFtZXNwYWNlLCBhcmUgeW91IHRyeWluZyB0byBnZXQgdGhlIGxpc3Qgb2YgY2xpZW50cyBvZiBhIGR5bmFtaWMgbmFtZXNwYWNlP1wiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnNvY2tldHModGhpcy5yb29tcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG1hdGNoaW5nIHNvY2tldCBpbnN0YW5jZXNcbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBmZXRjaFNvY2tldHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXJcbiAgICAgICAgICAgIC5mZXRjaFNvY2tldHMoe1xuICAgICAgICAgICAgcm9vbXM6IHRoaXMucm9vbXMsXG4gICAgICAgICAgICBleGNlcHQ6IHRoaXMuZXhjZXB0Um9vbXMsXG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoc29ja2V0cykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHNvY2tldHMubWFwKChzb2NrZXQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc29ja2V0IGluc3RhbmNlb2Ygc29ja2V0XzEuU29ja2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZJWE1FIHRoZSBUeXBlU2NyaXB0IGNvbXBpbGVyIGNvbXBsYWlucyBhYm91dCBtaXNzaW5nIHByaXZhdGUgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc29ja2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSZW1vdGVTb2NrZXQodGhpcy5hZGFwdGVyLCBzb2NrZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWFrZXMgdGhlIG1hdGNoaW5nIHNvY2tldCBpbnN0YW5jZXMgam9pbiB0aGUgc3BlY2lmaWVkIHJvb21zXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9vbVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBzb2NrZXRzSm9pbihyb29tKSB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5hZGRTb2NrZXRzKHtcbiAgICAgICAgICAgIHJvb21zOiB0aGlzLnJvb21zLFxuICAgICAgICAgICAgZXhjZXB0OiB0aGlzLmV4Y2VwdFJvb21zLFxuICAgICAgICB9LCBBcnJheS5pc0FycmF5KHJvb20pID8gcm9vbSA6IFtyb29tXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1ha2VzIHRoZSBtYXRjaGluZyBzb2NrZXQgaW5zdGFuY2VzIGxlYXZlIHRoZSBzcGVjaWZpZWQgcm9vbXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSByb29tXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHNvY2tldHNMZWF2ZShyb29tKSB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5kZWxTb2NrZXRzKHtcbiAgICAgICAgICAgIHJvb21zOiB0aGlzLnJvb21zLFxuICAgICAgICAgICAgZXhjZXB0OiB0aGlzLmV4Y2VwdFJvb21zLFxuICAgICAgICB9LCBBcnJheS5pc0FycmF5KHJvb20pID8gcm9vbSA6IFtyb29tXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1ha2VzIHRoZSBtYXRjaGluZyBzb2NrZXQgaW5zdGFuY2VzIGRpc2Nvbm5lY3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjbG9zZSAtIHdoZXRoZXIgdG8gY2xvc2UgdGhlIHVuZGVybHlpbmcgY29ubmVjdGlvblxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBkaXNjb25uZWN0U29ja2V0cyhjbG9zZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuYWRhcHRlci5kaXNjb25uZWN0U29ja2V0cyh7XG4gICAgICAgICAgICByb29tczogdGhpcy5yb29tcyxcbiAgICAgICAgICAgIGV4Y2VwdDogdGhpcy5leGNlcHRSb29tcyxcbiAgICAgICAgfSwgY2xvc2UpO1xuICAgIH1cbn1cbmV4cG9ydHMuQnJvYWRjYXN0T3BlcmF0b3IgPSBCcm9hZGNhc3RPcGVyYXRvcjtcbi8qKlxuICogRXhwb3NlIG9mIHN1YnNldCBvZiB0aGUgYXR0cmlidXRlcyBhbmQgbWV0aG9kcyBvZiB0aGUgU29ja2V0IGNsYXNzXG4gKi9cbmNsYXNzIFJlbW90ZVNvY2tldCB7XG4gICAgY29uc3RydWN0b3IoYWRhcHRlciwgZGV0YWlscykge1xuICAgICAgICB0aGlzLmlkID0gZGV0YWlscy5pZDtcbiAgICAgICAgdGhpcy5oYW5kc2hha2UgPSBkZXRhaWxzLmhhbmRzaGFrZTtcbiAgICAgICAgdGhpcy5yb29tcyA9IG5ldyBTZXQoZGV0YWlscy5yb29tcyk7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRldGFpbHMuZGF0YTtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG5ldyBCcm9hZGNhc3RPcGVyYXRvcihhZGFwdGVyLCBuZXcgU2V0KFt0aGlzLmlkXSkpO1xuICAgIH1cbiAgICBlbWl0KGV2LCAuLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZXJhdG9yLmVtaXQoZXYsIC4uLmFyZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBKb2lucyBhIHJvb20uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gcm9vbSAtIHJvb20gb3IgYXJyYXkgb2Ygcm9vbXNcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgam9pbihyb29tKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZXJhdG9yLnNvY2tldHNKb2luKHJvb20pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBMZWF2ZXMgYSByb29tLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHJvb21cbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgbGVhdmUocm9vbSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVyYXRvci5zb2NrZXRzTGVhdmUocm9vbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERpc2Nvbm5lY3RzIHRoaXMgY2xpZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBjbG9zZSAtIGlmIGB0cnVlYCwgY2xvc2VzIHRoZSB1bmRlcmx5aW5nIGNvbm5lY3Rpb25cbiAgICAgKiBAcmV0dXJuIHtTb2NrZXR9IHNlbGZcbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBkaXNjb25uZWN0KGNsb3NlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5vcGVyYXRvci5kaXNjb25uZWN0U29ja2V0cyhjbG9zZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbmV4cG9ydHMuUmVtb3RlU29ja2V0ID0gUmVtb3RlU29ja2V0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkNsaWVudCA9IHZvaWQgMDtcbmNvbnN0IHNvY2tldF9pb19wYXJzZXJfMSA9IHJlcXVpcmUoXCJzb2NrZXQuaW8tcGFyc2VyXCIpO1xuY29uc3QgZGVidWdNb2R1bGUgPSByZXF1aXJlKFwiZGVidWdcIik7XG5jb25zdCB1cmwgPSByZXF1aXJlKFwidXJsXCIpO1xuY29uc3QgZGVidWcgPSBkZWJ1Z01vZHVsZShcInNvY2tldC5pbzpjbGllbnRcIik7XG5jbGFzcyBDbGllbnQge1xuICAgIC8qKlxuICAgICAqIENsaWVudCBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzZXJ2ZXIgaW5zdGFuY2VcbiAgICAgKiBAcGFyYW0gY29ublxuICAgICAqIEBwYWNrYWdlXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2VydmVyLCBjb25uKSB7XG4gICAgICAgIHRoaXMuc29ja2V0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5uc3BzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnNlcnZlciA9IHNlcnZlcjtcbiAgICAgICAgdGhpcy5jb25uID0gY29ubjtcbiAgICAgICAgdGhpcy5lbmNvZGVyID0gc2VydmVyLmVuY29kZXI7XG4gICAgICAgIHRoaXMuZGVjb2RlciA9IG5ldyBzZXJ2ZXIuX3BhcnNlci5EZWNvZGVyKCk7XG4gICAgICAgIHRoaXMuaWQgPSBjb25uLmlkO1xuICAgICAgICB0aGlzLnNldHVwKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEByZXR1cm4gdGhlIHJlZmVyZW5jZSB0byB0aGUgcmVxdWVzdCB0aGF0IG9yaWdpbmF0ZWQgdGhlIEVuZ2luZS5JTyBjb25uZWN0aW9uXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZ2V0IHJlcXVlc3QoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbm4ucmVxdWVzdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB1cCBldmVudCBsaXN0ZW5lcnMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHNldHVwKCkge1xuICAgICAgICB0aGlzLm9uY2xvc2UgPSB0aGlzLm9uY2xvc2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbmRhdGEgPSB0aGlzLm9uZGF0YS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uZXJyb3IgPSB0aGlzLm9uZXJyb3IuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbmRlY29kZWQgPSB0aGlzLm9uZGVjb2RlZC5iaW5kKHRoaXMpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXMuZGVjb2Rlci5vbihcImRlY29kZWRcIiwgdGhpcy5vbmRlY29kZWQpO1xuICAgICAgICB0aGlzLmNvbm4ub24oXCJkYXRhXCIsIHRoaXMub25kYXRhKTtcbiAgICAgICAgdGhpcy5jb25uLm9uKFwiZXJyb3JcIiwgdGhpcy5vbmVycm9yKTtcbiAgICAgICAgdGhpcy5jb25uLm9uKFwiY2xvc2VcIiwgdGhpcy5vbmNsb3NlKTtcbiAgICAgICAgdGhpcy5jb25uZWN0VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMubnNwcy5zaXplID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoXCJubyBuYW1lc3BhY2Ugam9pbmVkIHlldCwgY2xvc2UgdGhlIGNsaWVudFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhcInRoZSBjbGllbnQgaGFzIGFscmVhZHkgam9pbmVkIGEgbmFtZXNwYWNlLCBub3RoaW5nIHRvIGRvXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLnNlcnZlci5fY29ubmVjdFRpbWVvdXQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb25uZWN0cyBhIGNsaWVudCB0byBhIG5hbWVzcGFjZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gdGhlIG5hbWVzcGFjZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdXRoIC0gdGhlIGF1dGggcGFyYW1ldGVyc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgY29ubmVjdChuYW1lLCBhdXRoID0ge30pIHtcbiAgICAgICAgaWYgKHRoaXMuc2VydmVyLl9uc3BzLmhhcyhuYW1lKSkge1xuICAgICAgICAgICAgZGVidWcoXCJjb25uZWN0aW5nIHRvIG5hbWVzcGFjZSAlc1wiLCBuYW1lKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRvQ29ubmVjdChuYW1lLCBhdXRoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlcnZlci5fY2hlY2tOYW1lc3BhY2UobmFtZSwgYXV0aCwgKGR5bmFtaWNOc3BOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoZHluYW1pY05zcE5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvQ29ubmVjdChuYW1lLCBhdXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlYnVnKFwiY3JlYXRpb24gb2YgbmFtZXNwYWNlICVzIHdhcyBkZW5pZWRcIiwgbmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFja2V0KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogc29ja2V0X2lvX3BhcnNlcl8xLlBhY2tldFR5cGUuQ09OTkVDVF9FUlJPUixcbiAgICAgICAgICAgICAgICAgICAgbnNwOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkludmFsaWQgbmFtZXNwYWNlXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb25uZWN0cyBhIGNsaWVudCB0byBhIG5hbWVzcGFjZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBuYW1lIC0gdGhlIG5hbWVzcGFjZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdXRoIC0gdGhlIGF1dGggcGFyYW1ldGVyc1xuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBkb0Nvbm5lY3QobmFtZSwgYXV0aCkge1xuICAgICAgICBjb25zdCBuc3AgPSB0aGlzLnNlcnZlci5vZihuYW1lKTtcbiAgICAgICAgY29uc3Qgc29ja2V0ID0gbnNwLl9hZGQodGhpcywgYXV0aCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zb2NrZXRzLnNldChzb2NrZXQuaWQsIHNvY2tldCk7XG4gICAgICAgICAgICB0aGlzLm5zcHMuc2V0KG5zcC5uYW1lLCBzb2NrZXQpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY29ubmVjdFRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5jb25uZWN0VGltZW91dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0VGltZW91dCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERpc2Nvbm5lY3RzIGZyb20gYWxsIG5hbWVzcGFjZXMgYW5kIGNsb3NlcyB0cmFuc3BvcnQuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9kaXNjb25uZWN0KCkge1xuICAgICAgICBmb3IgKGNvbnN0IHNvY2tldCBvZiB0aGlzLnNvY2tldHMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIHNvY2tldC5kaXNjb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb2NrZXRzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIHNvY2tldC4gQ2FsbGVkIGJ5IGVhY2ggYFNvY2tldGAuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9yZW1vdmUoc29ja2V0KSB7XG4gICAgICAgIGlmICh0aGlzLnNvY2tldHMuaGFzKHNvY2tldC5pZCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG5zcCA9IHRoaXMuc29ja2V0cy5nZXQoc29ja2V0LmlkKS5uc3AubmFtZTtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0cy5kZWxldGUoc29ja2V0LmlkKTtcbiAgICAgICAgICAgIHRoaXMubnNwcy5kZWxldGUobnNwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlYnVnKFwiaWdub3JpbmcgcmVtb3ZlIGZvciAlc1wiLCBzb2NrZXQuaWQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsb3NlcyB0aGUgdW5kZXJseWluZyBjb25uZWN0aW9uLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjbG9zZSgpIHtcbiAgICAgICAgaWYgKFwib3BlblwiID09PSB0aGlzLmNvbm4ucmVhZHlTdGF0ZSkge1xuICAgICAgICAgICAgZGVidWcoXCJmb3JjaW5nIHRyYW5zcG9ydCBjbG9zZVwiKTtcbiAgICAgICAgICAgIHRoaXMuY29ubi5jbG9zZSgpO1xuICAgICAgICAgICAgdGhpcy5vbmNsb3NlKFwiZm9yY2VkIHNlcnZlciBjbG9zZVwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBXcml0ZXMgYSBwYWNrZXQgdG8gdGhlIHRyYW5zcG9ydC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYWNrZXQgb2JqZWN0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9wYWNrZXQocGFja2V0LCBvcHRzID0ge30pIHtcbiAgICAgICAgaWYgKHRoaXMuY29ubi5yZWFkeVN0YXRlICE9PSBcIm9wZW5cIikge1xuICAgICAgICAgICAgZGVidWcoXCJpZ25vcmluZyBwYWNrZXQgd3JpdGUgJWpcIiwgcGFja2V0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlbmNvZGVkUGFja2V0cyA9IG9wdHMucHJlRW5jb2RlZFxuICAgICAgICAgICAgPyBwYWNrZXQgLy8gcHJldmlvdXMgdmVyc2lvbnMgb2YgdGhlIGFkYXB0ZXIgaW5jb3JyZWN0bHkgdXNlZCBzb2NrZXQucGFja2V0KCkgaW5zdGVhZCBvZiB3cml0ZVRvRW5naW5lKClcbiAgICAgICAgICAgIDogdGhpcy5lbmNvZGVyLmVuY29kZShwYWNrZXQpO1xuICAgICAgICB0aGlzLndyaXRlVG9FbmdpbmUoZW5jb2RlZFBhY2tldHMsIG9wdHMpO1xuICAgIH1cbiAgICB3cml0ZVRvRW5naW5lKGVuY29kZWRQYWNrZXRzLCBvcHRzKSB7XG4gICAgICAgIGlmIChvcHRzLnZvbGF0aWxlICYmICF0aGlzLmNvbm4udHJhbnNwb3J0LndyaXRhYmxlKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcInZvbGF0aWxlIHBhY2tldCBpcyBkaXNjYXJkZWQgc2luY2UgdGhlIHRyYW5zcG9ydCBpcyBub3QgY3VycmVudGx5IHdyaXRhYmxlXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhY2tldHMgPSBBcnJheS5pc0FycmF5KGVuY29kZWRQYWNrZXRzKVxuICAgICAgICAgICAgPyBlbmNvZGVkUGFja2V0c1xuICAgICAgICAgICAgOiBbZW5jb2RlZFBhY2tldHNdO1xuICAgICAgICBmb3IgKGNvbnN0IGVuY29kZWRQYWNrZXQgb2YgcGFja2V0cykge1xuICAgICAgICAgICAgdGhpcy5jb25uLndyaXRlKGVuY29kZWRQYWNrZXQsIG9wdHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aXRoIGluY29taW5nIHRyYW5zcG9ydCBkYXRhLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBvbmRhdGEoZGF0YSkge1xuICAgICAgICAvLyB0cnkvY2F0Y2ggaXMgbmVlZGVkIGZvciBwcm90b2NvbCB2aW9sYXRpb25zIChHSC0xODgwKVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5kZWNvZGVyLmFkZChkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5vbmVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHBhcnNlciBmdWxseSBkZWNvZGVzIGEgcGFja2V0LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBvbmRlY29kZWQocGFja2V0KSB7XG4gICAgICAgIGlmIChzb2NrZXRfaW9fcGFyc2VyXzEuUGFja2V0VHlwZS5DT05ORUNUID09PSBwYWNrZXQudHlwZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29ubi5wcm90b2NvbCA9PT0gMykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZCA9IHVybC5wYXJzZShwYWNrZXQubnNwLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3QocGFyc2VkLnBhdGhuYW1lLCBwYXJzZWQucXVlcnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0KHBhY2tldC5uc3AsIHBhY2tldC5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHNvY2tldCA9IHRoaXMubnNwcy5nZXQocGFja2V0Lm5zcCk7XG4gICAgICAgICAgICBpZiAoc29ja2V0KSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvY2tldC5fb25wYWNrZXQocGFja2V0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlYnVnKFwibm8gc29ja2V0IGZvciBuYW1lc3BhY2UgJXNcIiwgcGFja2V0Lm5zcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBhbiBlcnJvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlcnIgb2JqZWN0XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBvbmVycm9yKGVycikge1xuICAgICAgICBmb3IgKGNvbnN0IHNvY2tldCBvZiB0aGlzLnNvY2tldHMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIHNvY2tldC5fb25lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29ubi5jbG9zZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgdXBvbiB0cmFuc3BvcnQgY2xvc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVhc29uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBvbmNsb3NlKHJlYXNvbikge1xuICAgICAgICBkZWJ1ZyhcImNsaWVudCBjbG9zZSB3aXRoIHJlYXNvbiAlc1wiLCByZWFzb24pO1xuICAgICAgICAvLyBpZ25vcmUgYSBwb3RlbnRpYWwgc3Vic2VxdWVudCBgY2xvc2VgIGV2ZW50XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICAvLyBgbnNwc2AgYW5kIGBzb2NrZXRzYCBhcmUgY2xlYW5lZCB1cCBzZWFtbGVzc2x5XG4gICAgICAgIGZvciAoY29uc3Qgc29ja2V0IG9mIHRoaXMuc29ja2V0cy52YWx1ZXMoKSkge1xuICAgICAgICAgICAgc29ja2V0Ll9vbmNsb3NlKHJlYXNvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb2NrZXRzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuZGVjb2Rlci5kZXN0cm95KCk7IC8vIGNsZWFuIHVwIGRlY29kZXJcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xlYW5zIHVwIGV2ZW50IGxpc3RlbmVycy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuY29ubi5yZW1vdmVMaXN0ZW5lcihcImRhdGFcIiwgdGhpcy5vbmRhdGEpO1xuICAgICAgICB0aGlzLmNvbm4ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCB0aGlzLm9uZXJyb3IpO1xuICAgICAgICB0aGlzLmNvbm4ucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLCB0aGlzLm9uY2xvc2UpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXMuZGVjb2Rlci5yZW1vdmVMaXN0ZW5lcihcImRlY29kZWRcIiwgdGhpcy5vbmRlY29kZWQpO1xuICAgICAgICBpZiAodGhpcy5jb25uZWN0VGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY29ubmVjdFRpbWVvdXQpO1xuICAgICAgICAgICAgdGhpcy5jb25uZWN0VGltZW91dCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuQ2xpZW50ID0gQ2xpZW50O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuTmFtZXNwYWNlID0gZXhwb3J0cy5Tb2NrZXQgPSBleHBvcnRzLlNlcnZlciA9IHZvaWQgMDtcbmNvbnN0IGh0dHAgPSByZXF1aXJlKFwiaHR0cFwiKTtcbmNvbnN0IGZzXzEgPSByZXF1aXJlKFwiZnNcIik7XG5jb25zdCB6bGliXzEgPSByZXF1aXJlKFwiemxpYlwiKTtcbmNvbnN0IGFjY2VwdHMgPSByZXF1aXJlKFwiYWNjZXB0c1wiKTtcbmNvbnN0IHN0cmVhbV8xID0gcmVxdWlyZShcInN0cmVhbVwiKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcbmNvbnN0IGVuZ2luZV9pb18xID0gcmVxdWlyZShcImVuZ2luZS5pb1wiKTtcbmNvbnN0IGNsaWVudF8xID0gcmVxdWlyZShcIi4vY2xpZW50XCIpO1xuY29uc3QgZXZlbnRzXzEgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xuY29uc3QgbmFtZXNwYWNlXzEgPSByZXF1aXJlKFwiLi9uYW1lc3BhY2VcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJOYW1lc3BhY2VcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5hbWVzcGFjZV8xLk5hbWVzcGFjZTsgfSB9KTtcbmNvbnN0IHBhcmVudF9uYW1lc3BhY2VfMSA9IHJlcXVpcmUoXCIuL3BhcmVudC1uYW1lc3BhY2VcIik7XG5jb25zdCBzb2NrZXRfaW9fYWRhcHRlcl8xID0gcmVxdWlyZShcInNvY2tldC5pby1hZGFwdGVyXCIpO1xuY29uc3QgcGFyc2VyID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCJzb2NrZXQuaW8tcGFyc2VyXCIpKTtcbmNvbnN0IGRlYnVnXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRlYnVnXCIpKTtcbmNvbnN0IHNvY2tldF8xID0gcmVxdWlyZShcIi4vc29ja2V0XCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiU29ja2V0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBzb2NrZXRfMS5Tb2NrZXQ7IH0gfSk7XG5jb25zdCB0eXBlZF9ldmVudHNfMSA9IHJlcXVpcmUoXCIuL3R5cGVkLWV2ZW50c1wiKTtcbmNvbnN0IHV3c19qc18xID0gcmVxdWlyZShcIi4vdXdzLmpzXCIpO1xuY29uc3QgZGVidWcgPSAoMCwgZGVidWdfMS5kZWZhdWx0KShcInNvY2tldC5pbzpzZXJ2ZXJcIik7XG5jb25zdCBjbGllbnRWZXJzaW9uID0gcmVxdWlyZShcIi4uL3BhY2thZ2UuanNvblwiKS52ZXJzaW9uO1xuY29uc3QgZG90TWFwUmVnZXggPSAvXFwubWFwLztcbmNsYXNzIFNlcnZlciBleHRlbmRzIHR5cGVkX2V2ZW50c18xLlN0cmljdEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3Ioc3J2LCBvcHRzID0ge30pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9uc3BzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnBhcmVudE5zcHMgPSBuZXcgTWFwKCk7XG4gICAgICAgIGlmIChcIm9iamVjdFwiID09PSB0eXBlb2Ygc3J2ICYmXG4gICAgICAgICAgICBzcnYgaW5zdGFuY2VvZiBPYmplY3QgJiZcbiAgICAgICAgICAgICFzcnYubGlzdGVuKSB7XG4gICAgICAgICAgICBvcHRzID0gc3J2O1xuICAgICAgICAgICAgc3J2ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGF0aChvcHRzLnBhdGggfHwgXCIvc29ja2V0LmlvXCIpO1xuICAgICAgICB0aGlzLmNvbm5lY3RUaW1lb3V0KG9wdHMuY29ubmVjdFRpbWVvdXQgfHwgNDUwMDApO1xuICAgICAgICB0aGlzLnNlcnZlQ2xpZW50KGZhbHNlICE9PSBvcHRzLnNlcnZlQ2xpZW50KTtcbiAgICAgICAgdGhpcy5fcGFyc2VyID0gb3B0cy5wYXJzZXIgfHwgcGFyc2VyO1xuICAgICAgICB0aGlzLmVuY29kZXIgPSBuZXcgdGhpcy5fcGFyc2VyLkVuY29kZXIoKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyKG9wdHMuYWRhcHRlciB8fCBzb2NrZXRfaW9fYWRhcHRlcl8xLkFkYXB0ZXIpO1xuICAgICAgICB0aGlzLnNvY2tldHMgPSB0aGlzLm9mKFwiL1wiKTtcbiAgICAgICAgdGhpcy5vcHRzID0gb3B0cztcbiAgICAgICAgaWYgKHNydiB8fCB0eXBlb2Ygc3J2ID09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICB0aGlzLmF0dGFjaChzcnYpO1xuICAgIH1cbiAgICBzZXJ2ZUNsaWVudCh2KSB7XG4gICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZXJ2ZUNsaWVudDtcbiAgICAgICAgdGhpcy5fc2VydmVDbGllbnQgPSB2O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgdGhlIG1pZGRsZXdhcmUgZm9yIGFuIGluY29taW5nIG5hbWVzcGFjZSBub3QgYWxyZWFkeSBjcmVhdGVkIG9uIHRoZSBzZXJ2ZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZSAtIG5hbWUgb2YgaW5jb21pbmcgbmFtZXNwYWNlXG4gICAgICogQHBhcmFtIGF1dGggLSB0aGUgYXV0aCBwYXJhbWV0ZXJzXG4gICAgICogQHBhcmFtIGZuIC0gY2FsbGJhY2tcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NoZWNrTmFtZXNwYWNlKG5hbWUsIGF1dGgsIGZuKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudE5zcHMuc2l6ZSA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiBmbihmYWxzZSk7XG4gICAgICAgIGNvbnN0IGtleXNJdGVyYXRvciA9IHRoaXMucGFyZW50TnNwcy5rZXlzKCk7XG4gICAgICAgIGNvbnN0IHJ1biA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5leHRGbiA9IGtleXNJdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICBpZiAobmV4dEZuLmRvbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4oZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV4dEZuLnZhbHVlKG5hbWUsIGF1dGgsIChlcnIsIGFsbG93KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVyciB8fCAhYWxsb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJ1bigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbnNwcy5oYXMobmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIG5hbWVzcGFjZSB3YXMgY3JlYXRlZCBpbiB0aGUgbWVhbnRpbWVcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoXCJkeW5hbWljIG5hbWVzcGFjZSAlcyBhbHJlYWR5IGV4aXN0c1wiLCBuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuKHRoaXMuX25zcHMuZ2V0KG5hbWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZXNwYWNlID0gdGhpcy5wYXJlbnROc3BzLmdldChuZXh0Rm4udmFsdWUpLmNyZWF0ZUNoaWxkKG5hbWUpO1xuICAgICAgICAgICAgICAgIGRlYnVnKFwiZHluYW1pYyBuYW1lc3BhY2UgJXMgd2FzIGNyZWF0ZWRcIiwgbmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0cy5lbWl0UmVzZXJ2ZWQoXCJuZXdfbmFtZXNwYWNlXCIsIG5hbWVzcGFjZSk7XG4gICAgICAgICAgICAgICAgZm4obmFtZXNwYWNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBydW4oKTtcbiAgICB9XG4gICAgcGF0aCh2KSB7XG4gICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xuICAgICAgICB0aGlzLl9wYXRoID0gdi5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gICAgICAgIGNvbnN0IGVzY2FwZWRQYXRoID0gdGhpcy5fcGF0aC5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csIFwiXFxcXCQmXCIpO1xuICAgICAgICB0aGlzLmNsaWVudFBhdGhSZWdleCA9IG5ldyBSZWdFeHAoXCJeXCIgK1xuICAgICAgICAgICAgZXNjYXBlZFBhdGggK1xuICAgICAgICAgICAgXCIvc29ja2V0XFxcXC5pbyhcXFxcLm1zZ3BhY2t8XFxcXC5lc20pPyhcXFxcLm1pbik/XFxcXC5qcyhcXFxcLm1hcCk/KD86XFxcXD98JClcIik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBjb25uZWN0VGltZW91dCh2KSB7XG4gICAgICAgIGlmICh2ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29ubmVjdFRpbWVvdXQ7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3RUaW1lb3V0ID0gdjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGFkYXB0ZXIodikge1xuICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWRhcHRlcjtcbiAgICAgICAgdGhpcy5fYWRhcHRlciA9IHY7XG4gICAgICAgIGZvciAoY29uc3QgbnNwIG9mIHRoaXMuX25zcHMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIG5zcC5faW5pdEFkYXB0ZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXR0YWNoZXMgc29ja2V0LmlvIHRvIGEgc2VydmVyIG9yIHBvcnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3J2IC0gc2VydmVyIG9yIHBvcnRcbiAgICAgKiBAcGFyYW0gb3B0cyAtIG9wdGlvbnMgcGFzc2VkIHRvIGVuZ2luZS5pb1xuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBsaXN0ZW4oc3J2LCBvcHRzID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0YWNoKHNydiwgb3B0cyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEF0dGFjaGVzIHNvY2tldC5pbyB0byBhIHNlcnZlciBvciBwb3J0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHNydiAtIHNlcnZlciBvciBwb3J0XG4gICAgICogQHBhcmFtIG9wdHMgLSBvcHRpb25zIHBhc3NlZCB0byBlbmdpbmUuaW9cbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgYXR0YWNoKHNydiwgb3B0cyA9IHt9KSB7XG4gICAgICAgIGlmIChcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIHNydikge1xuICAgICAgICAgICAgY29uc3QgbXNnID0gXCJZb3UgYXJlIHRyeWluZyB0byBhdHRhY2ggc29ja2V0LmlvIHRvIGFuIGV4cHJlc3MgXCIgK1xuICAgICAgICAgICAgICAgIFwicmVxdWVzdCBoYW5kbGVyIGZ1bmN0aW9uLiBQbGVhc2UgcGFzcyBhIGh0dHAuU2VydmVyIGluc3RhbmNlLlwiO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaGFuZGxlIGEgcG9ydCBhcyBhIHN0cmluZ1xuICAgICAgICBpZiAoTnVtYmVyKHNydikgPT0gc3J2KSB7XG4gICAgICAgICAgICBzcnYgPSBOdW1iZXIoc3J2KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXCJudW1iZXJcIiA9PSB0eXBlb2Ygc3J2KSB7XG4gICAgICAgICAgICBkZWJ1ZyhcImNyZWF0aW5nIGh0dHAgc2VydmVyIGFuZCBiaW5kaW5nIHRvICVkXCIsIHNydik7XG4gICAgICAgICAgICBjb25zdCBwb3J0ID0gc3J2O1xuICAgICAgICAgICAgc3J2ID0gaHR0cC5jcmVhdGVTZXJ2ZXIoKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg0MDQpO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3J2Lmxpc3Rlbihwb3J0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBtZXJnZSB0aGUgb3B0aW9ucyBwYXNzZWQgdG8gdGhlIFNvY2tldC5JTyBzZXJ2ZXJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihvcHRzLCB0aGlzLm9wdHMpO1xuICAgICAgICAvLyBzZXQgZW5naW5lLmlvIHBhdGggdG8gYC9zb2NrZXQuaW9gXG4gICAgICAgIG9wdHMucGF0aCA9IG9wdHMucGF0aCB8fCB0aGlzLl9wYXRoO1xuICAgICAgICB0aGlzLmluaXRFbmdpbmUoc3J2LCBvcHRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGF0dGFjaEFwcChhcHAgLyo6IFRlbXBsYXRlZEFwcCAqLywgb3B0cyA9IHt9KSB7XG4gICAgICAgIC8vIG1lcmdlIHRoZSBvcHRpb25zIHBhc3NlZCB0byB0aGUgU29ja2V0LklPIHNlcnZlclxuICAgICAgICBPYmplY3QuYXNzaWduKG9wdHMsIHRoaXMub3B0cyk7XG4gICAgICAgIC8vIHNldCBlbmdpbmUuaW8gcGF0aCB0byBgL3NvY2tldC5pb2BcbiAgICAgICAgb3B0cy5wYXRoID0gb3B0cy5wYXRoIHx8IHRoaXMuX3BhdGg7XG4gICAgICAgIC8vIGluaXRpYWxpemUgZW5naW5lXG4gICAgICAgIGRlYnVnKFwiY3JlYXRpbmcgdVdlYlNvY2tldHMuanMtYmFzZWQgZW5naW5lIHdpdGggb3B0cyAlalwiLCBvcHRzKTtcbiAgICAgICAgY29uc3QgZW5naW5lID0gbmV3IGVuZ2luZV9pb18xLnVTZXJ2ZXIob3B0cyk7XG4gICAgICAgIGVuZ2luZS5hdHRhY2goYXBwLCBvcHRzKTtcbiAgICAgICAgLy8gYmluZCB0byBlbmdpbmUgZXZlbnRzXG4gICAgICAgIHRoaXMuYmluZChlbmdpbmUpO1xuICAgICAgICBpZiAodGhpcy5fc2VydmVDbGllbnQpIHtcbiAgICAgICAgICAgIC8vIGF0dGFjaCBzdGF0aWMgZmlsZSBzZXJ2aW5nXG4gICAgICAgICAgICBhcHAuZ2V0KGAke3RoaXMuX3BhdGh9LypgLCAocmVzLCByZXEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY2xpZW50UGF0aFJlZ2V4LnRlc3QocmVxLmdldFVybCgpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXEuc2V0WWllbGQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZW5hbWUgPSByZXFcbiAgICAgICAgICAgICAgICAgICAgLmdldFVybCgpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKHRoaXMuX3BhdGgsIFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sIFwiXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzTWFwID0gZG90TWFwUmVnZXgudGVzdChmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IGlzTWFwID8gXCJtYXBcIiA6IFwic291cmNlXCI7XG4gICAgICAgICAgICAgICAgLy8gUGVyIHRoZSBzdGFuZGFyZCwgRVRhZ3MgbXVzdCBiZSBxdW90ZWQ6XG4gICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzIjc2VjdGlvbi0yLjNcbiAgICAgICAgICAgICAgICBjb25zdCBleHBlY3RlZEV0YWcgPSAnXCInICsgY2xpZW50VmVyc2lvbiArICdcIic7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2Vha0V0YWcgPSBcIlcvXCIgKyBleHBlY3RlZEV0YWc7XG4gICAgICAgICAgICAgICAgY29uc3QgZXRhZyA9IHJlcS5nZXRIZWFkZXIoXCJpZi1ub25lLW1hdGNoXCIpO1xuICAgICAgICAgICAgICAgIGlmIChldGFnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleHBlY3RlZEV0YWcgPT09IGV0YWcgfHwgd2Vha0V0YWcgPT09IGV0YWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKFwic2VydmUgY2xpZW50ICVzIDMwNFwiLCB0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy53cml0ZVN0YXR1cyhcIjMwNCBOb3QgTW9kaWZpZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVidWcoXCJzZXJ2ZSBjbGllbnQgJXNcIiwgdHlwZSk7XG4gICAgICAgICAgICAgICAgcmVzLndyaXRlSGVhZGVyKFwiY2FjaGUtY29udHJvbFwiLCBcInB1YmxpYywgbWF4LWFnZT0wXCIpO1xuICAgICAgICAgICAgICAgIHJlcy53cml0ZUhlYWRlcihcImNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL1wiICsgKGlzTWFwID8gXCJqc29uXCIgOiBcImphdmFzY3JpcHRcIikpO1xuICAgICAgICAgICAgICAgIHJlcy53cml0ZUhlYWRlcihcImV0YWdcIiwgZXhwZWN0ZWRFdGFnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlcGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vY2xpZW50LWRpc3QvXCIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICAoMCwgdXdzX2pzXzEuc2VydmVGaWxlKShyZXMsIGZpbGVwYXRoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgICgwLCB1d3NfanNfMS5wYXRjaEFkYXB0ZXIpKGFwcCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgZW5naW5lXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3J2IC0gdGhlIHNlcnZlciB0byBhdHRhY2ggdG9cbiAgICAgKiBAcGFyYW0gb3B0cyAtIG9wdGlvbnMgcGFzc2VkIHRvIGVuZ2luZS5pb1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgaW5pdEVuZ2luZShzcnYsIG9wdHMpIHtcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBlbmdpbmVcbiAgICAgICAgZGVidWcoXCJjcmVhdGluZyBlbmdpbmUuaW8gaW5zdGFuY2Ugd2l0aCBvcHRzICVqXCIsIG9wdHMpO1xuICAgICAgICB0aGlzLmVpbyA9ICgwLCBlbmdpbmVfaW9fMS5hdHRhY2gpKHNydiwgb3B0cyk7XG4gICAgICAgIC8vIGF0dGFjaCBzdGF0aWMgZmlsZSBzZXJ2aW5nXG4gICAgICAgIGlmICh0aGlzLl9zZXJ2ZUNsaWVudClcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoU2VydmUoc3J2KTtcbiAgICAgICAgLy8gRXhwb3J0IGh0dHAgc2VydmVyXG4gICAgICAgIHRoaXMuaHR0cFNlcnZlciA9IHNydjtcbiAgICAgICAgLy8gYmluZCB0byBlbmdpbmUgZXZlbnRzXG4gICAgICAgIHRoaXMuYmluZCh0aGlzLmVpbyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEF0dGFjaGVzIHRoZSBzdGF0aWMgZmlsZSBzZXJ2aW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNydiBodHRwIHNlcnZlclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgYXR0YWNoU2VydmUoc3J2KSB7XG4gICAgICAgIGRlYnVnKFwiYXR0YWNoaW5nIGNsaWVudCBzZXJ2aW5nIHJlcSBoYW5kbGVyXCIpO1xuICAgICAgICBjb25zdCBldnMgPSBzcnYubGlzdGVuZXJzKFwicmVxdWVzdFwiKS5zbGljZSgwKTtcbiAgICAgICAgc3J2LnJlbW92ZUFsbExpc3RlbmVycyhcInJlcXVlc3RcIik7XG4gICAgICAgIHNydi5vbihcInJlcXVlc3RcIiwgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbGllbnRQYXRoUmVnZXgudGVzdChyZXEudXJsKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmUocmVxLCByZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZXZzW2ldLmNhbGwoc3J2LCByZXEsIHJlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBhIHJlcXVlc3Qgc2VydmluZyBvZiBjbGllbnQgc291cmNlIGFuZCBtYXBcbiAgICAgKlxuICAgICAqIEBwYXJhbSByZXFcbiAgICAgKiBAcGFyYW0gcmVzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBzZXJ2ZShyZXEsIHJlcykge1xuICAgICAgICBjb25zdCBmaWxlbmFtZSA9IHJlcS51cmwucmVwbGFjZSh0aGlzLl9wYXRoLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKTtcbiAgICAgICAgY29uc3QgaXNNYXAgPSBkb3RNYXBSZWdleC50ZXN0KGZpbGVuYW1lKTtcbiAgICAgICAgY29uc3QgdHlwZSA9IGlzTWFwID8gXCJtYXBcIiA6IFwic291cmNlXCI7XG4gICAgICAgIC8vIFBlciB0aGUgc3RhbmRhcmQsIEVUYWdzIG11c3QgYmUgcXVvdGVkOlxuICAgICAgICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMiNzZWN0aW9uLTIuM1xuICAgICAgICBjb25zdCBleHBlY3RlZEV0YWcgPSAnXCInICsgY2xpZW50VmVyc2lvbiArICdcIic7XG4gICAgICAgIGNvbnN0IHdlYWtFdGFnID0gXCJXL1wiICsgZXhwZWN0ZWRFdGFnO1xuICAgICAgICBjb25zdCBldGFnID0gcmVxLmhlYWRlcnNbXCJpZi1ub25lLW1hdGNoXCJdO1xuICAgICAgICBpZiAoZXRhZykge1xuICAgICAgICAgICAgaWYgKGV4cGVjdGVkRXRhZyA9PT0gZXRhZyB8fCB3ZWFrRXRhZyA9PT0gZXRhZykge1xuICAgICAgICAgICAgICAgIGRlYnVnKFwic2VydmUgY2xpZW50ICVzIDMwNFwiLCB0eXBlKTtcbiAgICAgICAgICAgICAgICByZXMud3JpdGVIZWFkKDMwNCk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkZWJ1ZyhcInNlcnZlIGNsaWVudCAlc1wiLCB0eXBlKTtcbiAgICAgICAgcmVzLnNldEhlYWRlcihcIkNhY2hlLUNvbnRyb2xcIiwgXCJwdWJsaWMsIG1heC1hZ2U9MFwiKTtcbiAgICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL1wiICsgKGlzTWFwID8gXCJqc29uXCIgOiBcImphdmFzY3JpcHRcIikpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKFwiRVRhZ1wiLCBleHBlY3RlZEV0YWcpO1xuICAgICAgICBTZXJ2ZXIuc2VuZEZpbGUoZmlsZW5hbWUsIHJlcSwgcmVzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGZpbGVuYW1lXG4gICAgICogQHBhcmFtIHJlcVxuICAgICAqIEBwYXJhbSByZXNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHN0YXRpYyBzZW5kRmlsZShmaWxlbmFtZSwgcmVxLCByZXMpIHtcbiAgICAgICAgY29uc3QgcmVhZFN0cmVhbSA9ICgwLCBmc18xLmNyZWF0ZVJlYWRTdHJlYW0pKHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vY2xpZW50LWRpc3QvXCIsIGZpbGVuYW1lKSk7XG4gICAgICAgIGNvbnN0IGVuY29kaW5nID0gYWNjZXB0cyhyZXEpLmVuY29kaW5ncyhbXCJiclwiLCBcImd6aXBcIiwgXCJkZWZsYXRlXCJdKTtcbiAgICAgICAgY29uc3Qgb25FcnJvciA9IChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgICAgICAgIGNhc2UgXCJiclwiOlxuICAgICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7IFwiY29udGVudC1lbmNvZGluZ1wiOiBcImJyXCIgfSk7XG4gICAgICAgICAgICAgICAgcmVhZFN0cmVhbS5waXBlKCgwLCB6bGliXzEuY3JlYXRlQnJvdGxpQ29tcHJlc3MpKCkpLnBpcGUocmVzKTtcbiAgICAgICAgICAgICAgICAoMCwgc3RyZWFtXzEucGlwZWxpbmUpKHJlYWRTdHJlYW0sICgwLCB6bGliXzEuY3JlYXRlQnJvdGxpQ29tcHJlc3MpKCksIHJlcywgb25FcnJvcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZ3ppcFwiOlxuICAgICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7IFwiY29udGVudC1lbmNvZGluZ1wiOiBcImd6aXBcIiB9KTtcbiAgICAgICAgICAgICAgICAoMCwgc3RyZWFtXzEucGlwZWxpbmUpKHJlYWRTdHJlYW0sICgwLCB6bGliXzEuY3JlYXRlR3ppcCkoKSwgcmVzLCBvbkVycm9yKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJkZWZsYXRlXCI6XG4gICAgICAgICAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHsgXCJjb250ZW50LWVuY29kaW5nXCI6IFwiZGVmbGF0ZVwiIH0pO1xuICAgICAgICAgICAgICAgICgwLCBzdHJlYW1fMS5waXBlbGluZSkocmVhZFN0cmVhbSwgKDAsIHpsaWJfMS5jcmVhdGVEZWZsYXRlKSgpLCByZXMsIG9uRXJyb3IpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXMud3JpdGVIZWFkKDIwMCk7XG4gICAgICAgICAgICAgICAgKDAsIHN0cmVhbV8xLnBpcGVsaW5lKShyZWFkU3RyZWFtLCByZXMsIG9uRXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEJpbmRzIHNvY2tldC5pbyB0byBhbiBlbmdpbmUuaW8gaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2VuZ2luZS5TZXJ2ZXJ9IGVuZ2luZSBlbmdpbmUuaW8gKG9yIGNvbXBhdGlibGUpIHNlcnZlclxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBiaW5kKGVuZ2luZSkge1xuICAgICAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTtcbiAgICAgICAgdGhpcy5lbmdpbmUub24oXCJjb25uZWN0aW9uXCIsIHRoaXMub25jb25uZWN0aW9uLmJpbmQodGhpcykpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdpdGggZWFjaCBpbmNvbWluZyB0cmFuc3BvcnQgY29ubmVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZW5naW5lLlNvY2tldH0gY29ublxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgb25jb25uZWN0aW9uKGNvbm4pIHtcbiAgICAgICAgZGVidWcoXCJpbmNvbWluZyBjb25uZWN0aW9uIHdpdGggaWQgJXNcIiwgY29ubi5pZCk7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBjbGllbnRfMS5DbGllbnQodGhpcywgY29ubik7XG4gICAgICAgIGlmIChjb25uLnByb3RvY29sID09PSAzKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBjbGllbnQuY29ubmVjdChcIi9cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIExvb2tzIHVwIGEgbmFtZXNwYWNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfEZ1bmN0aW9ufSBuYW1lIG5zcCBuYW1lXG4gICAgICogQHBhcmFtIGZuIG9wdGlvbmFsLCBuc3AgYGNvbm5lY3Rpb25gIGV2IGhhbmRsZXJcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgb2YobmFtZSwgZm4pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCIgfHwgbmFtZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50TnNwID0gbmV3IHBhcmVudF9uYW1lc3BhY2VfMS5QYXJlbnROYW1lc3BhY2UodGhpcyk7XG4gICAgICAgICAgICBkZWJ1ZyhcImluaXRpYWxpemluZyBwYXJlbnQgbmFtZXNwYWNlICVzXCIsIHBhcmVudE5zcC5uYW1lKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnROc3BzLnNldChuYW1lLCBwYXJlbnROc3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnROc3BzLnNldCgobnNwLCBjb25uLCBuZXh0KSA9PiBuZXh0KG51bGwsIG5hbWUudGVzdChuc3ApKSwgcGFyZW50TnNwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBwYXJlbnROc3Aub24oXCJjb25uZWN0XCIsIGZuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYXJlbnROc3A7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFN0cmluZyhuYW1lKVswXSAhPT0gXCIvXCIpXG4gICAgICAgICAgICBuYW1lID0gXCIvXCIgKyBuYW1lO1xuICAgICAgICBsZXQgbnNwID0gdGhpcy5fbnNwcy5nZXQobmFtZSk7XG4gICAgICAgIGlmICghbnNwKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcImluaXRpYWxpemluZyBuYW1lc3BhY2UgJXNcIiwgbmFtZSk7XG4gICAgICAgICAgICBuc3AgPSBuZXcgbmFtZXNwYWNlXzEuTmFtZXNwYWNlKHRoaXMsIG5hbWUpO1xuICAgICAgICAgICAgdGhpcy5fbnNwcy5zZXQobmFtZSwgbnNwKTtcbiAgICAgICAgICAgIGlmIChuYW1lICE9PSBcIi9cIikge1xuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldHMuZW1pdFJlc2VydmVkKFwibmV3X25hbWVzcGFjZVwiLCBuc3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChmbilcbiAgICAgICAgICAgIG5zcC5vbihcImNvbm5lY3RcIiwgZm4pO1xuICAgICAgICByZXR1cm4gbnNwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgc2VydmVyIGNvbm5lY3Rpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBbZm5dIG9wdGlvbmFsLCBjYWxsZWQgYXMgYGZuKFtlcnJdKWAgb24gZXJyb3IgT1IgYWxsIGNvbm5zIGNsb3NlZFxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBjbG9zZShmbikge1xuICAgICAgICBmb3IgKGNvbnN0IHNvY2tldCBvZiB0aGlzLnNvY2tldHMuc29ja2V0cy52YWx1ZXMoKSkge1xuICAgICAgICAgICAgc29ja2V0Ll9vbmNsb3NlKFwic2VydmVyIHNodXR0aW5nIGRvd25cIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmdpbmUuY2xvc2UoKTtcbiAgICAgICAgLy8gcmVzdG9yZSB0aGUgQWRhcHRlciBwcm90b3R5cGVcbiAgICAgICAgKDAsIHV3c19qc18xLnJlc3RvcmVBZGFwdGVyKSgpO1xuICAgICAgICBpZiAodGhpcy5odHRwU2VydmVyKSB7XG4gICAgICAgICAgICB0aGlzLmh0dHBTZXJ2ZXIuY2xvc2UoZm4pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm4gJiYgZm4oKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHVwIG5hbWVzcGFjZSBtaWRkbGV3YXJlLlxuICAgICAqXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHVzZShmbikge1xuICAgICAgICB0aGlzLnNvY2tldHMudXNlKGZuKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRhcmdldHMgYSByb29tIHdoZW4gZW1pdHRpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9vbVxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICB0byhyb29tKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvY2tldHMudG8ocm9vbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRhcmdldHMgYSByb29tIHdoZW4gZW1pdHRpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9vbVxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBpbihyb29tKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvY2tldHMuaW4ocm9vbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEV4Y2x1ZGVzIGEgcm9vbSB3aGVuIGVtaXR0aW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZXhjZXB0KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ja2V0cy5leGNlcHQobmFtZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNlbmRzIGEgYG1lc3NhZ2VgIGV2ZW50IHRvIGFsbCBjbGllbnRzLlxuICAgICAqXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHNlbmQoLi4uYXJncykge1xuICAgICAgICB0aGlzLnNvY2tldHMuZW1pdChcIm1lc3NhZ2VcIiwgLi4uYXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZW5kcyBhIGBtZXNzYWdlYCBldmVudCB0byBhbGwgY2xpZW50cy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICB3cml0ZSguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMuc29ja2V0cy5lbWl0KFwibWVzc2FnZVwiLCAuLi5hcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVtaXQgYSBwYWNrZXQgdG8gb3RoZXIgU29ja2V0LklPIHNlcnZlcnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldiAtIHRoZSBldmVudCBuYW1lXG4gICAgICogQHBhcmFtIGFyZ3MgLSBhbiBhcnJheSBvZiBhcmd1bWVudHMsIHdoaWNoIG1heSBpbmNsdWRlIGFuIGFja25vd2xlZGdlbWVudCBjYWxsYmFjayBhdCB0aGUgZW5kXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHNlcnZlclNpZGVFbWl0KGV2LCAuLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvY2tldHMuc2VydmVyU2lkZUVtaXQoZXYsIC4uLmFyZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbGlzdCBvZiBzb2NrZXQgaWRzLlxuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGFsbFNvY2tldHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvY2tldHMuYWxsU29ja2V0cygpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBjb21wcmVzcyBmbGFnLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbXByZXNzIC0gaWYgYHRydWVgLCBjb21wcmVzc2VzIHRoZSBzZW5kaW5nIGRhdGFcbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgY29tcHJlc3MoY29tcHJlc3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ja2V0cy5jb21wcmVzcyhjb21wcmVzcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgYSBtb2RpZmllciBmb3IgYSBzdWJzZXF1ZW50IGV2ZW50IGVtaXNzaW9uIHRoYXQgdGhlIGV2ZW50IGRhdGEgbWF5IGJlIGxvc3QgaWYgdGhlIGNsaWVudCBpcyBub3QgcmVhZHkgdG9cbiAgICAgKiByZWNlaXZlIG1lc3NhZ2VzIChiZWNhdXNlIG9mIG5ldHdvcmsgc2xvd25lc3Mgb3Igb3RoZXIgaXNzdWVzLCBvciBiZWNhdXNlIHRoZXnigJlyZSBjb25uZWN0ZWQgdGhyb3VnaCBsb25nIHBvbGxpbmdcbiAgICAgKiBhbmQgaXMgaW4gdGhlIG1pZGRsZSBvZiBhIHJlcXVlc3QtcmVzcG9uc2UgY3ljbGUpLlxuICAgICAqXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGdldCB2b2xhdGlsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ja2V0cy52b2xhdGlsZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBhIG1vZGlmaWVyIGZvciBhIHN1YnNlcXVlbnQgZXZlbnQgZW1pc3Npb24gdGhhdCB0aGUgZXZlbnQgZGF0YSB3aWxsIG9ubHkgYmUgYnJvYWRjYXN0IHRvIHRoZSBjdXJyZW50IG5vZGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZ2V0IGxvY2FsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb2NrZXRzLmxvY2FsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXRjaGluZyBzb2NrZXQgaW5zdGFuY2VzXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZmV0Y2hTb2NrZXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb2NrZXRzLmZldGNoU29ja2V0cygpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYWtlcyB0aGUgbWF0Y2hpbmcgc29ja2V0IGluc3RhbmNlcyBqb2luIHRoZSBzcGVjaWZpZWQgcm9vbXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSByb29tXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHNvY2tldHNKb2luKHJvb20pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ja2V0cy5zb2NrZXRzSm9pbihyb29tKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWFrZXMgdGhlIG1hdGNoaW5nIHNvY2tldCBpbnN0YW5jZXMgbGVhdmUgdGhlIHNwZWNpZmllZCByb29tc1xuICAgICAqXG4gICAgICogQHBhcmFtIHJvb21cbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgc29ja2V0c0xlYXZlKHJvb20pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ja2V0cy5zb2NrZXRzTGVhdmUocm9vbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1ha2VzIHRoZSBtYXRjaGluZyBzb2NrZXQgaW5zdGFuY2VzIGRpc2Nvbm5lY3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjbG9zZSAtIHdoZXRoZXIgdG8gY2xvc2UgdGhlIHVuZGVybHlpbmcgY29ubmVjdGlvblxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBkaXNjb25uZWN0U29ja2V0cyhjbG9zZSA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvY2tldHMuZGlzY29ubmVjdFNvY2tldHMoY2xvc2UpO1xuICAgIH1cbn1cbmV4cG9ydHMuU2VydmVyID0gU2VydmVyO1xuLyoqXG4gKiBFeHBvc2UgbWFpbiBuYW1lc3BhY2UgKC8pLlxuICovXG5jb25zdCBlbWl0dGVyTWV0aG9kcyA9IE9iamVjdC5rZXlzKGV2ZW50c18xLkV2ZW50RW1pdHRlci5wcm90b3R5cGUpLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBldmVudHNfMS5FdmVudEVtaXR0ZXIucHJvdG90eXBlW2tleV0gPT09IFwiZnVuY3Rpb25cIjtcbn0pO1xuZW1pdHRlck1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICBTZXJ2ZXIucHJvdG90eXBlW2ZuXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ja2V0c1tmbl0uYXBwbHkodGhpcy5zb2NrZXRzLCBhcmd1bWVudHMpO1xuICAgIH07XG59KTtcbm1vZHVsZS5leHBvcnRzID0gKHNydiwgb3B0cykgPT4gbmV3IFNlcnZlcihzcnYsIG9wdHMpO1xubW9kdWxlLmV4cG9ydHMuU2VydmVyID0gU2VydmVyO1xubW9kdWxlLmV4cG9ydHMuTmFtZXNwYWNlID0gbmFtZXNwYWNlXzEuTmFtZXNwYWNlO1xubW9kdWxlLmV4cG9ydHMuU29ja2V0ID0gc29ja2V0XzEuU29ja2V0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLk5hbWVzcGFjZSA9IGV4cG9ydHMuUkVTRVJWRURfRVZFTlRTID0gdm9pZCAwO1xuY29uc3Qgc29ja2V0XzEgPSByZXF1aXJlKFwiLi9zb2NrZXRcIik7XG5jb25zdCB0eXBlZF9ldmVudHNfMSA9IHJlcXVpcmUoXCIuL3R5cGVkLWV2ZW50c1wiKTtcbmNvbnN0IGRlYnVnXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRlYnVnXCIpKTtcbmNvbnN0IGJyb2FkY2FzdF9vcGVyYXRvcl8xID0gcmVxdWlyZShcIi4vYnJvYWRjYXN0LW9wZXJhdG9yXCIpO1xuY29uc3QgZGVidWcgPSAoMCwgZGVidWdfMS5kZWZhdWx0KShcInNvY2tldC5pbzpuYW1lc3BhY2VcIik7XG5leHBvcnRzLlJFU0VSVkVEX0VWRU5UUyA9IG5ldyBTZXQoW1wiY29ubmVjdFwiLCBcImNvbm5lY3Rpb25cIiwgXCJuZXdfbmFtZXNwYWNlXCJdKTtcbmNsYXNzIE5hbWVzcGFjZSBleHRlbmRzIHR5cGVkX2V2ZW50c18xLlN0cmljdEV2ZW50RW1pdHRlciB7XG4gICAgLyoqXG4gICAgICogTmFtZXNwYWNlIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNlcnZlciBpbnN0YW5jZVxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2VydmVyLCBuYW1lKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc29ja2V0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgLyoqIEBwcml2YXRlICovXG4gICAgICAgIHRoaXMuX2ZucyA9IFtdO1xuICAgICAgICAvKiogQHByaXZhdGUgKi9cbiAgICAgICAgdGhpcy5faWRzID0gMDtcbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSBzZXJ2ZXI7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuX2luaXRBZGFwdGVyKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBgQWRhcHRlcmAgZm9yIHRoaXMgbnNwLlxuICAgICAqIFJ1biB1cG9uIGNoYW5naW5nIGFkYXB0ZXIgYnkgYFNlcnZlciNhZGFwdGVyYFxuICAgICAqIGluIGFkZGl0aW9uIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXRBZGFwdGVyKCkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXMuYWRhcHRlciA9IG5ldyAodGhpcy5zZXJ2ZXIuYWRhcHRlcigpKSh0aGlzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB1cCBuYW1lc3BhY2UgbWlkZGxld2FyZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICB1c2UoZm4pIHtcbiAgICAgICAgdGhpcy5fZm5zLnB1c2goZm4pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgdGhlIG1pZGRsZXdhcmUgZm9yIGFuIGluY29taW5nIGNsaWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzb2NrZXQgLSB0aGUgc29ja2V0IHRoYXQgd2lsbCBnZXQgYWRkZWRcbiAgICAgKiBAcGFyYW0gZm4gLSBsYXN0IGZuIGNhbGwgaW4gdGhlIG1pZGRsZXdhcmVcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHJ1bihzb2NrZXQsIGZuKSB7XG4gICAgICAgIGNvbnN0IGZucyA9IHRoaXMuX2Zucy5zbGljZSgwKTtcbiAgICAgICAgaWYgKCFmbnMubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIGZuKG51bGwpO1xuICAgICAgICBmdW5jdGlvbiBydW4oaSkge1xuICAgICAgICAgICAgZm5zW2ldKHNvY2tldCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIC8vIHVwb24gZXJyb3IsIHNob3J0LWNpcmN1aXRcbiAgICAgICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4oZXJyKTtcbiAgICAgICAgICAgICAgICAvLyBpZiBubyBtaWRkbGV3YXJlIGxlZnQsIHN1bW1vbiBjYWxsYmFja1xuICAgICAgICAgICAgICAgIGlmICghZm5zW2kgKyAxXSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuKG51bGwpO1xuICAgICAgICAgICAgICAgIC8vIGdvIG9uIHRvIG5leHRcbiAgICAgICAgICAgICAgICBydW4oaSArIDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcnVuKDApO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUYXJnZXRzIGEgcm9vbSB3aGVuIGVtaXR0aW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJvb21cbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgdG8ocm9vbSkge1xuICAgICAgICByZXR1cm4gbmV3IGJyb2FkY2FzdF9vcGVyYXRvcl8xLkJyb2FkY2FzdE9wZXJhdG9yKHRoaXMuYWRhcHRlcikudG8ocm9vbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRhcmdldHMgYSByb29tIHdoZW4gZW1pdHRpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9vbVxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBpbihyb29tKSB7XG4gICAgICAgIHJldHVybiBuZXcgYnJvYWRjYXN0X29wZXJhdG9yXzEuQnJvYWRjYXN0T3BlcmF0b3IodGhpcy5hZGFwdGVyKS5pbihyb29tKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRXhjbHVkZXMgYSByb29tIHdoZW4gZW1pdHRpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9vbVxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBleGNlcHQocm9vbSkge1xuICAgICAgICByZXR1cm4gbmV3IGJyb2FkY2FzdF9vcGVyYXRvcl8xLkJyb2FkY2FzdE9wZXJhdG9yKHRoaXMuYWRhcHRlcikuZXhjZXB0KHJvb20pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgbmV3IGNsaWVudC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NvY2tldH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9hZGQoY2xpZW50LCBxdWVyeSwgZm4pIHtcbiAgICAgICAgZGVidWcoXCJhZGRpbmcgc29ja2V0IHRvIG5zcCAlc1wiLCB0aGlzLm5hbWUpO1xuICAgICAgICBjb25zdCBzb2NrZXQgPSBuZXcgc29ja2V0XzEuU29ja2V0KHRoaXMsIGNsaWVudCwgcXVlcnkpO1xuICAgICAgICB0aGlzLnJ1bihzb2NrZXQsIChlcnIpID0+IHtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChcIm9wZW5cIiA9PSBjbGllbnQuY29ubi5yZWFkeVN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbGllbnQuY29ubi5wcm90b2NvbCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzb2NrZXQuX2Vycm9yKGVyci5kYXRhIHx8IGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzb2NrZXQuX2Vycm9yKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGVyci5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIHRyYWNrIHNvY2tldFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvY2tldHMuc2V0KHNvY2tldC5pZCwgc29ja2V0KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaXQncyBwYXJhbW91bnQgdGhhdCB0aGUgaW50ZXJuYWwgYG9uY29ubmVjdGAgbG9naWNcbiAgICAgICAgICAgICAgICAgICAgLy8gZmlyZXMgYmVmb3JlIHVzZXItc2V0IGV2ZW50cyB0byBwcmV2ZW50IHN0YXRlIG9yZGVyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZpb2xhdGlvbnMgKHN1Y2ggYXMgYSBkaXNjb25uZWN0aW9uIGJlZm9yZSB0aGUgY29ubmVjdGlvblxuICAgICAgICAgICAgICAgICAgICAvLyBsb2dpYyBpcyBjb21wbGV0ZSlcbiAgICAgICAgICAgICAgICAgICAgc29ja2V0Ll9vbmNvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZuKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZmlyZSB1c2VyLXNldCBldmVudHNcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0UmVzZXJ2ZWQoXCJjb25uZWN0XCIsIHNvY2tldCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdFJlc2VydmVkKFwiY29ubmVjdGlvblwiLCBzb2NrZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoXCJuZXh0IGNhbGxlZCBhZnRlciBjbGllbnQgd2FzIGNsb3NlZCAtIGlnbm9yaW5nIHNvY2tldFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBzb2NrZXQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBjbGllbnQuIENhbGxlZCBieSBlYWNoIGBTb2NrZXRgLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfcmVtb3ZlKHNvY2tldCkge1xuICAgICAgICBpZiAodGhpcy5zb2NrZXRzLmhhcyhzb2NrZXQuaWQpKSB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldHMuZGVsZXRlKHNvY2tldC5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZWJ1ZyhcImlnbm9yaW5nIHJlbW92ZSBmb3IgJXNcIiwgc29ja2V0LmlkKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBFbWl0cyB0byBhbGwgY2xpZW50cy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gQWx3YXlzIHRydWVcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZW1pdChldiwgLi4uYXJncykge1xuICAgICAgICByZXR1cm4gbmV3IGJyb2FkY2FzdF9vcGVyYXRvcl8xLkJyb2FkY2FzdE9wZXJhdG9yKHRoaXMuYWRhcHRlcikuZW1pdChldiwgLi4uYXJncyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNlbmRzIGEgYG1lc3NhZ2VgIGV2ZW50IHRvIGFsbCBjbGllbnRzLlxuICAgICAqXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHNlbmQoLi4uYXJncykge1xuICAgICAgICB0aGlzLmVtaXQoXCJtZXNzYWdlXCIsIC4uLmFyZ3MpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2VuZHMgYSBgbWVzc2FnZWAgZXZlbnQgdG8gYWxsIGNsaWVudHMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgd3JpdGUoLi4uYXJncykge1xuICAgICAgICB0aGlzLmVtaXQoXCJtZXNzYWdlXCIsIC4uLmFyZ3MpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogRW1pdCBhIHBhY2tldCB0byBvdGhlciBTb2NrZXQuSU8gc2VydmVyc1xuICAgICAqXG4gICAgICogQHBhcmFtIGV2IC0gdGhlIGV2ZW50IG5hbWVcbiAgICAgKiBAcGFyYW0gYXJncyAtIGFuIGFycmF5IG9mIGFyZ3VtZW50cywgd2hpY2ggbWF5IGluY2x1ZGUgYW4gYWNrbm93bGVkZ2VtZW50IGNhbGxiYWNrIGF0IHRoZSBlbmRcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgc2VydmVyU2lkZUVtaXQoZXYsIC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKGV4cG9ydHMuUkVTRVJWRURfRVZFTlRTLmhhcyhldikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgXCIke2V2fVwiIGlzIGEgcmVzZXJ2ZWQgZXZlbnQgbmFtZWApO1xuICAgICAgICB9XG4gICAgICAgIGFyZ3MudW5zaGlmdChldik7XG4gICAgICAgIHRoaXMuYWRhcHRlci5zZXJ2ZXJTaWRlRW1pdChhcmdzKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgcGFja2V0IGlzIHJlY2VpdmVkIGZyb20gYW5vdGhlciBTb2NrZXQuSU8gc2VydmVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJncyAtIGFuIGFycmF5IG9mIGFyZ3VtZW50cywgd2hpY2ggbWF5IGluY2x1ZGUgYW4gYWNrbm93bGVkZ2VtZW50IGNhbGxiYWNrIGF0IHRoZSBlbmRcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX29uU2VydmVyU2lkZUVtaXQoYXJncykge1xuICAgICAgICBzdXBlci5lbWl0VW50eXBlZC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyBhIGxpc3Qgb2YgY2xpZW50cy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gc2VsZlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBhbGxTb2NrZXRzKCkge1xuICAgICAgICByZXR1cm4gbmV3IGJyb2FkY2FzdF9vcGVyYXRvcl8xLkJyb2FkY2FzdE9wZXJhdG9yKHRoaXMuYWRhcHRlcikuYWxsU29ja2V0cygpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBjb21wcmVzcyBmbGFnLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbXByZXNzIC0gaWYgYHRydWVgLCBjb21wcmVzc2VzIHRoZSBzZW5kaW5nIGRhdGFcbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgY29tcHJlc3MoY29tcHJlc3MpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBicm9hZGNhc3Rfb3BlcmF0b3JfMS5Ccm9hZGNhc3RPcGVyYXRvcih0aGlzLmFkYXB0ZXIpLmNvbXByZXNzKGNvbXByZXNzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBhIG1vZGlmaWVyIGZvciBhIHN1YnNlcXVlbnQgZXZlbnQgZW1pc3Npb24gdGhhdCB0aGUgZXZlbnQgZGF0YSBtYXkgYmUgbG9zdCBpZiB0aGUgY2xpZW50IGlzIG5vdCByZWFkeSB0b1xuICAgICAqIHJlY2VpdmUgbWVzc2FnZXMgKGJlY2F1c2Ugb2YgbmV0d29yayBzbG93bmVzcyBvciBvdGhlciBpc3N1ZXMsIG9yIGJlY2F1c2UgdGhleeKAmXJlIGNvbm5lY3RlZCB0aHJvdWdoIGxvbmcgcG9sbGluZ1xuICAgICAqIGFuZCBpcyBpbiB0aGUgbWlkZGxlIG9mIGEgcmVxdWVzdC1yZXNwb25zZSBjeWNsZSkuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZ2V0IHZvbGF0aWxlKCkge1xuICAgICAgICByZXR1cm4gbmV3IGJyb2FkY2FzdF9vcGVyYXRvcl8xLkJyb2FkY2FzdE9wZXJhdG9yKHRoaXMuYWRhcHRlcikudm9sYXRpbGU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgYSBtb2RpZmllciBmb3IgYSBzdWJzZXF1ZW50IGV2ZW50IGVtaXNzaW9uIHRoYXQgdGhlIGV2ZW50IGRhdGEgd2lsbCBvbmx5IGJlIGJyb2FkY2FzdCB0byB0aGUgY3VycmVudCBub2RlLlxuICAgICAqXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGdldCBsb2NhbCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBicm9hZGNhc3Rfb3BlcmF0b3JfMS5Ccm9hZGNhc3RPcGVyYXRvcih0aGlzLmFkYXB0ZXIpLmxvY2FsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXRjaGluZyBzb2NrZXQgaW5zdGFuY2VzXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZmV0Y2hTb2NrZXRzKCkge1xuICAgICAgICByZXR1cm4gbmV3IGJyb2FkY2FzdF9vcGVyYXRvcl8xLkJyb2FkY2FzdE9wZXJhdG9yKHRoaXMuYWRhcHRlcikuZmV0Y2hTb2NrZXRzKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1ha2VzIHRoZSBtYXRjaGluZyBzb2NrZXQgaW5zdGFuY2VzIGpvaW4gdGhlIHNwZWNpZmllZCByb29tc1xuICAgICAqXG4gICAgICogQHBhcmFtIHJvb21cbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgc29ja2V0c0pvaW4ocm9vbSkge1xuICAgICAgICByZXR1cm4gbmV3IGJyb2FkY2FzdF9vcGVyYXRvcl8xLkJyb2FkY2FzdE9wZXJhdG9yKHRoaXMuYWRhcHRlcikuc29ja2V0c0pvaW4ocm9vbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1ha2VzIHRoZSBtYXRjaGluZyBzb2NrZXQgaW5zdGFuY2VzIGxlYXZlIHRoZSBzcGVjaWZpZWQgcm9vbXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSByb29tXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHNvY2tldHNMZWF2ZShyb29tKSB7XG4gICAgICAgIHJldHVybiBuZXcgYnJvYWRjYXN0X29wZXJhdG9yXzEuQnJvYWRjYXN0T3BlcmF0b3IodGhpcy5hZGFwdGVyKS5zb2NrZXRzTGVhdmUocm9vbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1ha2VzIHRoZSBtYXRjaGluZyBzb2NrZXQgaW5zdGFuY2VzIGRpc2Nvbm5lY3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjbG9zZSAtIHdoZXRoZXIgdG8gY2xvc2UgdGhlIHVuZGVybHlpbmcgY29ubmVjdGlvblxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBkaXNjb25uZWN0U29ja2V0cyhjbG9zZSA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBuZXcgYnJvYWRjYXN0X29wZXJhdG9yXzEuQnJvYWRjYXN0T3BlcmF0b3IodGhpcy5hZGFwdGVyKS5kaXNjb25uZWN0U29ja2V0cyhjbG9zZSk7XG4gICAgfVxufVxuZXhwb3J0cy5OYW1lc3BhY2UgPSBOYW1lc3BhY2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGFyZW50TmFtZXNwYWNlID0gdm9pZCAwO1xuY29uc3QgbmFtZXNwYWNlXzEgPSByZXF1aXJlKFwiLi9uYW1lc3BhY2VcIik7XG5jbGFzcyBQYXJlbnROYW1lc3BhY2UgZXh0ZW5kcyBuYW1lc3BhY2VfMS5OYW1lc3BhY2Uge1xuICAgIGNvbnN0cnVjdG9yKHNlcnZlcikge1xuICAgICAgICBzdXBlcihzZXJ2ZXIsIFwiL19cIiArIFBhcmVudE5hbWVzcGFjZS5jb3VudCsrKTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IG5ldyBTZXQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdEFkYXB0ZXIoKSB7XG4gICAgICAgIGNvbnN0IGJyb2FkY2FzdCA9IChwYWNrZXQsIG9wdHMpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgobnNwKSA9PiB7XG4gICAgICAgICAgICAgICAgbnNwLmFkYXB0ZXIuYnJvYWRjYXN0KHBhY2tldCwgb3B0cyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZSBGSVhNRSBpcyB0aGVyZSBhIHdheSB0byBkZWNsYXJlIGFuIGlubmVyIGNsYXNzIGluIFR5cGVTY3JpcHQ/XG4gICAgICAgIHRoaXMuYWRhcHRlciA9IHsgYnJvYWRjYXN0IH07XG4gICAgfVxuICAgIGVtaXQoZXYsIC4uLmFyZ3MpIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChuc3ApID0+IHtcbiAgICAgICAgICAgIG5zcC5lbWl0KGV2LCAuLi5hcmdzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjcmVhdGVDaGlsZChuYW1lKSB7XG4gICAgICAgIGNvbnN0IG5hbWVzcGFjZSA9IG5ldyBuYW1lc3BhY2VfMS5OYW1lc3BhY2UodGhpcy5zZXJ2ZXIsIG5hbWUpO1xuICAgICAgICBuYW1lc3BhY2UuX2ZucyA9IHRoaXMuX2Zucy5zbGljZSgwKTtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMoXCJjb25uZWN0XCIpLmZvckVhY2goKGxpc3RlbmVyKSA9PiBuYW1lc3BhY2Uub24oXCJjb25uZWN0XCIsIGxpc3RlbmVyKSk7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzKFwiY29ubmVjdGlvblwiKS5mb3JFYWNoKChsaXN0ZW5lcikgPT4gbmFtZXNwYWNlLm9uKFwiY29ubmVjdGlvblwiLCBsaXN0ZW5lcikpO1xuICAgICAgICB0aGlzLmNoaWxkcmVuLmFkZChuYW1lc3BhY2UpO1xuICAgICAgICB0aGlzLnNlcnZlci5fbnNwcy5zZXQobmFtZSwgbmFtZXNwYWNlKTtcbiAgICAgICAgcmV0dXJuIG5hbWVzcGFjZTtcbiAgICB9XG59XG5leHBvcnRzLlBhcmVudE5hbWVzcGFjZSA9IFBhcmVudE5hbWVzcGFjZTtcblBhcmVudE5hbWVzcGFjZS5jb3VudCA9IDA7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU29ja2V0ID0gZXhwb3J0cy5SRVNFUlZFRF9FVkVOVFMgPSB2b2lkIDA7XG5jb25zdCBzb2NrZXRfaW9fcGFyc2VyXzEgPSByZXF1aXJlKFwic29ja2V0LmlvLXBhcnNlclwiKTtcbmNvbnN0IGRlYnVnXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRlYnVnXCIpKTtcbmNvbnN0IHR5cGVkX2V2ZW50c18xID0gcmVxdWlyZShcIi4vdHlwZWQtZXZlbnRzXCIpO1xuY29uc3QgYmFzZTY0aWRfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYmFzZTY0aWRcIikpO1xuY29uc3QgYnJvYWRjYXN0X29wZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9icm9hZGNhc3Qtb3BlcmF0b3JcIik7XG5jb25zdCBkZWJ1ZyA9ICgwLCBkZWJ1Z18xLmRlZmF1bHQpKFwic29ja2V0LmlvOnNvY2tldFwiKTtcbmV4cG9ydHMuUkVTRVJWRURfRVZFTlRTID0gbmV3IFNldChbXG4gICAgXCJjb25uZWN0XCIsXG4gICAgXCJjb25uZWN0X2Vycm9yXCIsXG4gICAgXCJkaXNjb25uZWN0XCIsXG4gICAgXCJkaXNjb25uZWN0aW5nXCIsXG4gICAgXCJuZXdMaXN0ZW5lclwiLFxuICAgIFwicmVtb3ZlTGlzdGVuZXJcIixcbl0pO1xuY2xhc3MgU29ja2V0IGV4dGVuZHMgdHlwZWRfZXZlbnRzXzEuU3RyaWN0RXZlbnRFbWl0dGVyIHtcbiAgICAvKipcbiAgICAgKiBJbnRlcmZhY2UgdG8gYSBgQ2xpZW50YCBmb3IgYSBnaXZlbiBgTmFtZXNwYWNlYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TmFtZXNwYWNlfSBuc3BcbiAgICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF1dGhcbiAgICAgKiBAcGFja2FnZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG5zcCwgY2xpZW50LCBhdXRoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubnNwID0gbnNwO1xuICAgICAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZGl0aW9uYWwgaW5mb3JtYXRpb24gdGhhdCBjYW4gYmUgYXR0YWNoZWQgdG8gdGhlIFNvY2tldCBpbnN0YW5jZSBhbmQgd2hpY2ggd2lsbCBiZSB1c2VkIGluIHRoZSBmZXRjaFNvY2tldHMgbWV0aG9kXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmRhdGEgPSB7fTtcbiAgICAgICAgdGhpcy5jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hY2tzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmZucyA9IFtdO1xuICAgICAgICB0aGlzLmZsYWdzID0ge307XG4gICAgICAgIHRoaXMuc2VydmVyID0gbnNwLnNlcnZlcjtcbiAgICAgICAgdGhpcy5hZGFwdGVyID0gdGhpcy5uc3AuYWRhcHRlcjtcbiAgICAgICAgaWYgKGNsaWVudC5jb25uLnByb3RvY29sID09PSAzKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICB0aGlzLmlkID0gbnNwLm5hbWUgIT09IFwiL1wiID8gbnNwLm5hbWUgKyBcIiNcIiArIGNsaWVudC5pZCA6IGNsaWVudC5pZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBiYXNlNjRpZF8xLmRlZmF1bHQuZ2VuZXJhdGVJZCgpOyAvLyBkb24ndCByZXVzZSB0aGUgRW5naW5lLklPIGlkIGJlY2F1c2UgaXQncyBzZW5zaXRpdmUgaW5mb3JtYXRpb25cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhhbmRzaGFrZSA9IHRoaXMuYnVpbGRIYW5kc2hha2UoYXV0aCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEJ1aWxkcyB0aGUgYGhhbmRzaGFrZWAgQkMgb2JqZWN0XG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGJ1aWxkSGFuZHNoYWtlKGF1dGgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMucmVxdWVzdC5oZWFkZXJzLFxuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKSArIFwiXCIsXG4gICAgICAgICAgICBhZGRyZXNzOiB0aGlzLmNvbm4ucmVtb3RlQWRkcmVzcyxcbiAgICAgICAgICAgIHhkb21haW46ICEhdGhpcy5yZXF1ZXN0LmhlYWRlcnMub3JpZ2luLFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgc2VjdXJlOiAhIXRoaXMucmVxdWVzdC5jb25uZWN0aW9uLmVuY3J5cHRlZCxcbiAgICAgICAgICAgIGlzc3VlZDogK25ldyBEYXRlKCksXG4gICAgICAgICAgICB1cmw6IHRoaXMucmVxdWVzdC51cmwsXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBxdWVyeTogdGhpcy5yZXF1ZXN0Ll9xdWVyeSxcbiAgICAgICAgICAgIGF1dGgsXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVtaXRzIHRvIHRoaXMgY2xpZW50LlxuICAgICAqXG4gICAgICogQHJldHVybiBBbHdheXMgcmV0dXJucyBgdHJ1ZWAuXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGVtaXQoZXYsIC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKGV4cG9ydHMuUkVTRVJWRURfRVZFTlRTLmhhcyhldikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgXCIke2V2fVwiIGlzIGEgcmVzZXJ2ZWQgZXZlbnQgbmFtZWApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGEgPSBbZXYsIC4uLmFyZ3NdO1xuICAgICAgICBjb25zdCBwYWNrZXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBzb2NrZXRfaW9fcGFyc2VyXzEuUGFja2V0VHlwZS5FVkVOVCxcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIH07XG4gICAgICAgIC8vIGFjY2VzcyBsYXN0IGFyZ3VtZW50IHRvIHNlZSBpZiBpdCdzIGFuIEFDSyBjYWxsYmFja1xuICAgICAgICBpZiAodHlwZW9mIGRhdGFbZGF0YS5sZW5ndGggLSAxXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMubnNwLl9pZHMrKztcbiAgICAgICAgICAgIGRlYnVnKFwiZW1pdHRpbmcgcGFja2V0IHdpdGggYWNrIGlkICVkXCIsIGlkKTtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJBY2tDYWxsYmFjayhpZCwgZGF0YS5wb3AoKSk7XG4gICAgICAgICAgICBwYWNrZXQuaWQgPSBpZDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmbGFncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZmxhZ3MpO1xuICAgICAgICB0aGlzLmZsYWdzID0ge307XG4gICAgICAgIHRoaXMucGFja2V0KHBhY2tldCwgZmxhZ3MpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICByZWdpc3RlckFja0NhbGxiYWNrKGlkLCBhY2spIHtcbiAgICAgICAgY29uc3QgdGltZW91dCA9IHRoaXMuZmxhZ3MudGltZW91dDtcbiAgICAgICAgaWYgKHRpbWVvdXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5hY2tzLnNldChpZCwgYWNrKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZGVidWcoXCJldmVudCB3aXRoIGFjayBpZCAlZCBoYXMgdGltZWQgb3V0IGFmdGVyICVkIG1zXCIsIGlkLCB0aW1lb3V0KTtcbiAgICAgICAgICAgIHRoaXMuYWNrcy5kZWxldGUoaWQpO1xuICAgICAgICAgICAgYWNrLmNhbGwodGhpcywgbmV3IEVycm9yKFwib3BlcmF0aW9uIGhhcyB0aW1lZCBvdXRcIikpO1xuICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgICAgdGhpcy5hY2tzLnNldChpZCwgKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICBhY2suYXBwbHkodGhpcywgW251bGwsIC4uLmFyZ3NdKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRhcmdldHMgYSByb29tIHdoZW4gYnJvYWRjYXN0aW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJvb21cbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgdG8ocm9vbSkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXdCcm9hZGNhc3RPcGVyYXRvcigpLnRvKHJvb20pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUYXJnZXRzIGEgcm9vbSB3aGVuIGJyb2FkY2FzdGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByb29tXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGluKHJvb20pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV3QnJvYWRjYXN0T3BlcmF0b3IoKS5pbihyb29tKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRXhjbHVkZXMgYSByb29tIHdoZW4gYnJvYWRjYXN0aW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJvb21cbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZXhjZXB0KHJvb20pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV3QnJvYWRjYXN0T3BlcmF0b3IoKS5leGNlcHQocm9vbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNlbmRzIGEgYG1lc3NhZ2VgIGV2ZW50LlxuICAgICAqXG4gICAgICogQHJldHVybiBzZWxmXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHNlbmQoLi4uYXJncykge1xuICAgICAgICB0aGlzLmVtaXQoXCJtZXNzYWdlXCIsIC4uLmFyZ3MpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2VuZHMgYSBgbWVzc2FnZWAgZXZlbnQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgd3JpdGUoLi4uYXJncykge1xuICAgICAgICB0aGlzLmVtaXQoXCJtZXNzYWdlXCIsIC4uLmFyZ3MpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogV3JpdGVzIGEgcGFja2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhY2tldCAtIHBhY2tldCBvYmplY3RcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0cyAtIG9wdGlvbnNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHBhY2tldChwYWNrZXQsIG9wdHMgPSB7fSkge1xuICAgICAgICBwYWNrZXQubnNwID0gdGhpcy5uc3AubmFtZTtcbiAgICAgICAgb3B0cy5jb21wcmVzcyA9IGZhbHNlICE9PSBvcHRzLmNvbXByZXNzO1xuICAgICAgICB0aGlzLmNsaWVudC5fcGFja2V0KHBhY2tldCwgb3B0cyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEpvaW5zIGEgcm9vbS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSByb29tcyAtIHJvb20gb3IgYXJyYXkgb2Ygcm9vbXNcbiAgICAgKiBAcmV0dXJuIGEgUHJvbWlzZSBvciBub3RoaW5nLCBkZXBlbmRpbmcgb24gdGhlIGFkYXB0ZXJcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgam9pbihyb29tcykge1xuICAgICAgICBkZWJ1ZyhcImpvaW4gcm9vbSAlc1wiLCByb29tcyk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuYWRkQWxsKHRoaXMuaWQsIG5ldyBTZXQoQXJyYXkuaXNBcnJheShyb29tcykgPyByb29tcyA6IFtyb29tc10pKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTGVhdmVzIGEgcm9vbS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSByb29tXG4gICAgICogQHJldHVybiBhIFByb21pc2Ugb3Igbm90aGluZywgZGVwZW5kaW5nIG9uIHRoZSBhZGFwdGVyXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGxlYXZlKHJvb20pIHtcbiAgICAgICAgZGVidWcoXCJsZWF2ZSByb29tICVzXCIsIHJvb20pO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmRlbCh0aGlzLmlkLCByb29tKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTGVhdmUgYWxsIHJvb21zLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBsZWF2ZUFsbCgpIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyLmRlbEFsbCh0aGlzLmlkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGVkIGJ5IGBOYW1lc3BhY2VgIHVwb24gc3VjY2Vzc2Z1bFxuICAgICAqIG1pZGRsZXdhcmUgZXhlY3V0aW9uIChpZTogYXV0aG9yaXphdGlvbikuXG4gICAgICogU29ja2V0IGlzIGFkZGVkIHRvIG5hbWVzcGFjZSBhcnJheSBiZWZvcmVcbiAgICAgKiBjYWxsIHRvIGpvaW4sIHNvIGFkYXB0ZXJzIGNhbiBhY2Nlc3MgaXQuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9vbmNvbm5lY3QoKSB7XG4gICAgICAgIGRlYnVnKFwic29ja2V0IGNvbm5lY3RlZCAtIHdyaXRpbmcgcGFja2V0XCIpO1xuICAgICAgICB0aGlzLmNvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuam9pbih0aGlzLmlkKTtcbiAgICAgICAgaWYgKHRoaXMuY29ubi5wcm90b2NvbCA9PT0gMykge1xuICAgICAgICAgICAgdGhpcy5wYWNrZXQoeyB0eXBlOiBzb2NrZXRfaW9fcGFyc2VyXzEuUGFja2V0VHlwZS5DT05ORUNUIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYWNrZXQoeyB0eXBlOiBzb2NrZXRfaW9fcGFyc2VyXzEuUGFja2V0VHlwZS5DT05ORUNULCBkYXRhOiB7IHNpZDogdGhpcy5pZCB9IH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aXRoIGVhY2ggcGFja2V0LiBDYWxsZWQgYnkgYENsaWVudGAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFja2V0XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfb25wYWNrZXQocGFja2V0KSB7XG4gICAgICAgIGRlYnVnKFwiZ290IHBhY2tldCAlalwiLCBwYWNrZXQpO1xuICAgICAgICBzd2l0Y2ggKHBhY2tldC50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIHNvY2tldF9pb19wYXJzZXJfMS5QYWNrZXRUeXBlLkVWRU5UOlxuICAgICAgICAgICAgICAgIHRoaXMub25ldmVudChwYWNrZXQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBzb2NrZXRfaW9fcGFyc2VyXzEuUGFja2V0VHlwZS5CSU5BUllfRVZFTlQ6XG4gICAgICAgICAgICAgICAgdGhpcy5vbmV2ZW50KHBhY2tldCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHNvY2tldF9pb19wYXJzZXJfMS5QYWNrZXRUeXBlLkFDSzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uYWNrKHBhY2tldCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHNvY2tldF9pb19wYXJzZXJfMS5QYWNrZXRUeXBlLkJJTkFSWV9BQ0s6XG4gICAgICAgICAgICAgICAgdGhpcy5vbmFjayhwYWNrZXQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBzb2NrZXRfaW9fcGFyc2VyXzEuUGFja2V0VHlwZS5ESVNDT05ORUNUOlxuICAgICAgICAgICAgICAgIHRoaXMub25kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHNvY2tldF9pb19wYXJzZXJfMS5QYWNrZXRUeXBlLkNPTk5FQ1RfRVJST1I6XG4gICAgICAgICAgICAgICAgdGhpcy5fb25lcnJvcihuZXcgRXJyb3IocGFja2V0LmRhdGEpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgdXBvbiBldmVudCBwYWNrZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BhY2tldH0gcGFja2V0IC0gcGFja2V0IG9iamVjdFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgb25ldmVudChwYWNrZXQpIHtcbiAgICAgICAgY29uc3QgYXJncyA9IHBhY2tldC5kYXRhIHx8IFtdO1xuICAgICAgICBkZWJ1ZyhcImVtaXR0aW5nIGV2ZW50ICVqXCIsIGFyZ3MpO1xuICAgICAgICBpZiAobnVsbCAhPSBwYWNrZXQuaWQpIHtcbiAgICAgICAgICAgIGRlYnVnKFwiYXR0YWNoaW5nIGFjayBjYWxsYmFjayB0byBldmVudFwiKTtcbiAgICAgICAgICAgIGFyZ3MucHVzaCh0aGlzLmFjayhwYWNrZXQuaWQpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fYW55TGlzdGVuZXJzICYmIHRoaXMuX2FueUxpc3RlbmVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2FueUxpc3RlbmVycy5zbGljZSgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiBsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BhdGNoKGFyZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcm9kdWNlcyBhbiBhY2sgY2FsbGJhY2sgdG8gZW1pdCB3aXRoIGFuIGV2ZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGlkIC0gcGFja2V0IGlkXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBhY2soaWQpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBzZW50ID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBwcmV2ZW50IGRvdWJsZSBjYWxsYmFja3NcbiAgICAgICAgICAgIGlmIChzZW50KVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgZGVidWcoXCJzZW5kaW5nIGFjayAlalwiLCBhcmdzKTtcbiAgICAgICAgICAgIHNlbGYucGFja2V0KHtcbiAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgdHlwZTogc29ja2V0X2lvX3BhcnNlcl8xLlBhY2tldFR5cGUuQUNLLFxuICAgICAgICAgICAgICAgIGRhdGE6IGFyZ3MsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbnQgPSB0cnVlO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgdXBvbiBhY2sgcGFja2V0LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBvbmFjayhwYWNrZXQpIHtcbiAgICAgICAgY29uc3QgYWNrID0gdGhpcy5hY2tzLmdldChwYWNrZXQuaWQpO1xuICAgICAgICBpZiAoXCJmdW5jdGlvblwiID09IHR5cGVvZiBhY2spIHtcbiAgICAgICAgICAgIGRlYnVnKFwiY2FsbGluZyBhY2sgJXMgd2l0aCAlalwiLCBwYWNrZXQuaWQsIHBhY2tldC5kYXRhKTtcbiAgICAgICAgICAgIGFjay5hcHBseSh0aGlzLCBwYWNrZXQuZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmFja3MuZGVsZXRlKHBhY2tldC5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZWJ1ZyhcImJhZCBhY2sgJXNcIiwgcGFja2V0LmlkKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgdXBvbiBjbGllbnQgZGlzY29ubmVjdCBwYWNrZXQuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIG9uZGlzY29ubmVjdCgpIHtcbiAgICAgICAgZGVidWcoXCJnb3QgZGlzY29ubmVjdCBwYWNrZXRcIik7XG4gICAgICAgIHRoaXMuX29uY2xvc2UoXCJjbGllbnQgbmFtZXNwYWNlIGRpc2Nvbm5lY3RcIik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgYSBjbGllbnQgZXJyb3IuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9vbmVycm9yKGVycikge1xuICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnMoXCJlcnJvclwiKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdFJlc2VydmVkKFwiZXJyb3JcIiwgZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJNaXNzaW5nIGVycm9yIGhhbmRsZXIgb24gYHNvY2tldGAuXCIpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxlZCB1cG9uIGNsb3NpbmcuIENhbGxlZCBieSBgQ2xpZW50YC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSByZWFzb25cbiAgICAgKiBAdGhyb3cge0Vycm9yfSBvcHRpb25hbCBlcnJvciBvYmplY3RcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX29uY2xvc2UocmVhc29uKSB7XG4gICAgICAgIGlmICghdGhpcy5jb25uZWN0ZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgZGVidWcoXCJjbG9zaW5nIHNvY2tldCAtIHJlYXNvbiAlc1wiLCByZWFzb24pO1xuICAgICAgICB0aGlzLmVtaXRSZXNlcnZlZChcImRpc2Nvbm5lY3RpbmdcIiwgcmVhc29uKTtcbiAgICAgICAgdGhpcy5sZWF2ZUFsbCgpO1xuICAgICAgICB0aGlzLm5zcC5fcmVtb3ZlKHRoaXMpO1xuICAgICAgICB0aGlzLmNsaWVudC5fcmVtb3ZlKHRoaXMpO1xuICAgICAgICB0aGlzLmNvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVtaXRSZXNlcnZlZChcImRpc2Nvbm5lY3RcIiwgcmVhc29uKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcm9kdWNlcyBhbiBgZXJyb3JgIHBhY2tldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlcnIgLSBlcnJvciBvYmplY3RcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2Vycm9yKGVycikge1xuICAgICAgICB0aGlzLnBhY2tldCh7IHR5cGU6IHNvY2tldF9pb19wYXJzZXJfMS5QYWNrZXRUeXBlLkNPTk5FQ1RfRVJST1IsIGRhdGE6IGVyciB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGlzY29ubmVjdHMgdGhpcyBjbGllbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGNsb3NlIC0gaWYgYHRydWVgLCBjbG9zZXMgdGhlIHVuZGVybHlpbmcgY29ubmVjdGlvblxuICAgICAqIEByZXR1cm4ge1NvY2tldH0gc2VsZlxuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGRpc2Nvbm5lY3QoY2xvc2UgPSBmYWxzZSkge1xuICAgICAgICBpZiAoIXRoaXMuY29ubmVjdGVkKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIGlmIChjbG9zZSkge1xuICAgICAgICAgICAgdGhpcy5jbGllbnQuX2Rpc2Nvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFja2V0KHsgdHlwZTogc29ja2V0X2lvX3BhcnNlcl8xLlBhY2tldFR5cGUuRElTQ09OTkVDVCB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uY2xvc2UoXCJzZXJ2ZXIgbmFtZXNwYWNlIGRpc2Nvbm5lY3RcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGNvbXByZXNzIGZsYWcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGNvbXByZXNzIC0gaWYgYHRydWVgLCBjb21wcmVzc2VzIHRoZSBzZW5kaW5nIGRhdGFcbiAgICAgKiBAcmV0dXJuIHtTb2NrZXR9IHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgY29tcHJlc3MoY29tcHJlc3MpIHtcbiAgICAgICAgdGhpcy5mbGFncy5jb21wcmVzcyA9IGNvbXByZXNzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBhIG1vZGlmaWVyIGZvciBhIHN1YnNlcXVlbnQgZXZlbnQgZW1pc3Npb24gdGhhdCB0aGUgZXZlbnQgZGF0YSBtYXkgYmUgbG9zdCBpZiB0aGUgY2xpZW50IGlzIG5vdCByZWFkeSB0b1xuICAgICAqIHJlY2VpdmUgbWVzc2FnZXMgKGJlY2F1c2Ugb2YgbmV0d29yayBzbG93bmVzcyBvciBvdGhlciBpc3N1ZXMsIG9yIGJlY2F1c2UgdGhleeKAmXJlIGNvbm5lY3RlZCB0aHJvdWdoIGxvbmcgcG9sbGluZ1xuICAgICAqIGFuZCBpcyBpbiB0aGUgbWlkZGxlIG9mIGEgcmVxdWVzdC1yZXNwb25zZSBjeWNsZSkuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTb2NrZXR9IHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZ2V0IHZvbGF0aWxlKCkge1xuICAgICAgICB0aGlzLmZsYWdzLnZvbGF0aWxlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgYSBtb2RpZmllciBmb3IgYSBzdWJzZXF1ZW50IGV2ZW50IGVtaXNzaW9uIHRoYXQgdGhlIGV2ZW50IGRhdGEgd2lsbCBvbmx5IGJlIGJyb2FkY2FzdCB0byBldmVyeSBzb2NrZXRzIGJ1dCB0aGVcbiAgICAgKiBzZW5kZXIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTb2NrZXR9IHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZ2V0IGJyb2FkY2FzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV3QnJvYWRjYXN0T3BlcmF0b3IoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBhIG1vZGlmaWVyIGZvciBhIHN1YnNlcXVlbnQgZXZlbnQgZW1pc3Npb24gdGhhdCB0aGUgZXZlbnQgZGF0YSB3aWxsIG9ubHkgYmUgYnJvYWRjYXN0IHRvIHRoZSBjdXJyZW50IG5vZGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTb2NrZXR9IHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZ2V0IGxvY2FsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXdCcm9hZGNhc3RPcGVyYXRvcigpLmxvY2FsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgbW9kaWZpZXIgZm9yIGEgc3Vic2VxdWVudCBldmVudCBlbWlzc2lvbiB0aGF0IHRoZSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCB3aXRoIGFuIGVycm9yIHdoZW4gdGhlXG4gICAgICogZ2l2ZW4gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgd2l0aG91dCBhbiBhY2tub3dsZWRnZW1lbnQgZnJvbSB0aGUgY2xpZW50OlxuICAgICAqXG4gICAgICogYGBgXG4gICAgICogc29ja2V0LnRpbWVvdXQoNTAwMCkuZW1pdChcIm15LWV2ZW50XCIsIChlcnIpID0+IHtcbiAgICAgKiAgIGlmIChlcnIpIHtcbiAgICAgKiAgICAgLy8gdGhlIGNsaWVudCBkaWQgbm90IGFja25vd2xlZGdlIHRoZSBldmVudCBpbiB0aGUgZ2l2ZW4gZGVsYXlcbiAgICAgKiAgIH1cbiAgICAgKiB9KTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgdGltZW91dCh0aW1lb3V0KSB7XG4gICAgICAgIHRoaXMuZmxhZ3MudGltZW91dCA9IHRpbWVvdXQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEaXNwYXRjaCBpbmNvbWluZyBldmVudCB0byBzb2NrZXQgbGlzdGVuZXJzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gZXZlbnQgLSBldmVudCB0aGF0IHdpbGwgZ2V0IGVtaXR0ZWRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGRpc3BhdGNoKGV2ZW50KSB7XG4gICAgICAgIGRlYnVnKFwiZGlzcGF0Y2hpbmcgYW4gZXZlbnQgJWpcIiwgZXZlbnQpO1xuICAgICAgICB0aGlzLnJ1bihldmVudCwgKGVycikgPT4ge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fb25lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25uZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIuZW1pdFVudHlwZWQuYXBwbHkodGhpcywgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoXCJpZ25vcmUgcGFja2V0IHJlY2VpdmVkIGFmdGVyIGRpc2Nvbm5lY3Rpb25cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHVwIHNvY2tldCBtaWRkbGV3YXJlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gLSBtaWRkbGV3YXJlIGZ1bmN0aW9uIChldmVudCwgbmV4dClcbiAgICAgKiBAcmV0dXJuIHtTb2NrZXR9IHNlbGZcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgdXNlKGZuKSB7XG4gICAgICAgIHRoaXMuZm5zLnB1c2goZm4pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgdGhlIG1pZGRsZXdhcmUgZm9yIGFuIGluY29taW5nIGV2ZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gZXZlbnQgLSBldmVudCB0aGF0IHdpbGwgZ2V0IGVtaXR0ZWRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiAtIGxhc3QgZm4gY2FsbCBpbiB0aGUgbWlkZGxld2FyZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcnVuKGV2ZW50LCBmbikge1xuICAgICAgICBjb25zdCBmbnMgPSB0aGlzLmZucy5zbGljZSgwKTtcbiAgICAgICAgaWYgKCFmbnMubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIGZuKG51bGwpO1xuICAgICAgICBmdW5jdGlvbiBydW4oaSkge1xuICAgICAgICAgICAgZm5zW2ldKGV2ZW50LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgLy8gdXBvbiBlcnJvciwgc2hvcnQtY2lyY3VpdFxuICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihlcnIpO1xuICAgICAgICAgICAgICAgIC8vIGlmIG5vIG1pZGRsZXdhcmUgbGVmdCwgc3VtbW9uIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgaWYgKCFmbnNbaSArIDFdKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4obnVsbCk7XG4gICAgICAgICAgICAgICAgLy8gZ28gb24gdG8gbmV4dFxuICAgICAgICAgICAgICAgIHJ1bihpICsgMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBydW4oMCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIHNvY2tldCBpcyBjdXJyZW50bHkgZGlzY29ubmVjdGVkXG4gICAgICovXG4gICAgZ2V0IGRpc2Nvbm5lY3RlZCgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmNvbm5lY3RlZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQSByZWZlcmVuY2UgdG8gdGhlIHJlcXVlc3QgdGhhdCBvcmlnaW5hdGVkIHRoZSB1bmRlcmx5aW5nIEVuZ2luZS5JTyBTb2NrZXQuXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgZ2V0IHJlcXVlc3QoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudC5yZXF1ZXN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBIHJlZmVyZW5jZSB0byB0aGUgdW5kZXJseWluZyBDbGllbnQgdHJhbnNwb3J0IGNvbm5lY3Rpb24gKEVuZ2luZS5JTyBTb2NrZXQgb2JqZWN0KS5cbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBnZXQgY29ubigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50LmNvbm47XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBnZXQgcm9vbXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuc29ja2V0Um9vbXModGhpcy5pZCkgfHwgbmV3IFNldCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGZpcmVkIHdoZW4gYW55IGV2ZW50IGlzIGVtaXR0ZWQuIFRoZSBldmVudCBuYW1lIGlzIHBhc3NlZCBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlXG4gICAgICogY2FsbGJhY2suXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXJcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgb25BbnkobGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5fYW55TGlzdGVuZXJzID0gdGhpcy5fYW55TGlzdGVuZXJzIHx8IFtdO1xuICAgICAgICB0aGlzLl9hbnlMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGZpcmVkIHdoZW4gYW55IGV2ZW50IGlzIGVtaXR0ZWQuIFRoZSBldmVudCBuYW1lIGlzIHBhc3NlZCBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlXG4gICAgICogY2FsbGJhY2suIFRoZSBsaXN0ZW5lciBpcyBhZGRlZCB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBsaXN0ZW5lcnMgYXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXJcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgcHJlcGVuZEFueShsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLl9hbnlMaXN0ZW5lcnMgPSB0aGlzLl9hbnlMaXN0ZW5lcnMgfHwgW107XG4gICAgICAgIHRoaXMuX2FueUxpc3RlbmVycy51bnNoaWZ0KGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBmaXJlZCB3aGVuIGFueSBldmVudCBpcyBlbWl0dGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGxpc3RlbmVyXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIG9mZkFueShsaXN0ZW5lcikge1xuICAgICAgICBpZiAoIXRoaXMuX2FueUxpc3RlbmVycykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9hbnlMaXN0ZW5lcnM7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lciA9PT0gbGlzdGVuZXJzW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2FueUxpc3RlbmVycyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0aGF0IGFyZSBsaXN0ZW5pbmcgZm9yIGFueSBldmVudCB0aGF0IGlzIHNwZWNpZmllZC4gVGhpcyBhcnJheSBjYW4gYmUgbWFuaXB1bGF0ZWQsXG4gICAgICogZS5nLiB0byByZW1vdmUgbGlzdGVuZXJzLlxuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGxpc3RlbmVyc0FueSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FueUxpc3RlbmVycyB8fCBbXTtcbiAgICB9XG4gICAgbmV3QnJvYWRjYXN0T3BlcmF0b3IoKSB7XG4gICAgICAgIGNvbnN0IGZsYWdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5mbGFncyk7XG4gICAgICAgIHRoaXMuZmxhZ3MgPSB7fTtcbiAgICAgICAgcmV0dXJuIG5ldyBicm9hZGNhc3Rfb3BlcmF0b3JfMS5Ccm9hZGNhc3RPcGVyYXRvcih0aGlzLmFkYXB0ZXIsIG5ldyBTZXQoKSwgbmV3IFNldChbdGhpcy5pZF0pLCBmbGFncyk7XG4gICAgfVxufVxuZXhwb3J0cy5Tb2NrZXQgPSBTb2NrZXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU3RyaWN0RXZlbnRFbWl0dGVyID0gdm9pZCAwO1xuY29uc3QgZXZlbnRzXzEgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xuLyoqXG4gKiBTdHJpY3RseSB0eXBlZCB2ZXJzaW9uIG9mIGFuIGBFdmVudEVtaXR0ZXJgLiBBIGBUeXBlZEV2ZW50RW1pdHRlcmAgdGFrZXMgdHlwZVxuICogcGFyYW1ldGVycyBmb3IgbWFwcGluZ3Mgb2YgZXZlbnQgbmFtZXMgdG8gZXZlbnQgZGF0YSB0eXBlcywgYW5kIHN0cmljdGx5XG4gKiB0eXBlcyBtZXRob2QgY2FsbHMgdG8gdGhlIGBFdmVudEVtaXR0ZXJgIGFjY29yZGluZyB0byB0aGVzZSBldmVudCBtYXBzLlxuICpcbiAqIEB0eXBlUGFyYW0gTGlzdGVuRXZlbnRzIC0gYEV2ZW50c01hcGAgb2YgdXNlci1kZWZpbmVkIGV2ZW50cyB0aGF0IGNhbiBiZVxuICogbGlzdGVuZWQgdG8gd2l0aCBgb25gIG9yIGBvbmNlYFxuICogQHR5cGVQYXJhbSBFbWl0RXZlbnRzIC0gYEV2ZW50c01hcGAgb2YgdXNlci1kZWZpbmVkIGV2ZW50cyB0aGF0IGNhbiBiZVxuICogZW1pdHRlZCB3aXRoIGBlbWl0YFxuICogQHR5cGVQYXJhbSBSZXNlcnZlZEV2ZW50cyAtIGBFdmVudHNNYXBgIG9mIHJlc2VydmVkIGV2ZW50cywgdGhhdCBjYW4gYmVcbiAqIGVtaXR0ZWQgYnkgc29ja2V0LmlvIHdpdGggYGVtaXRSZXNlcnZlZGAsIGFuZCBjYW4gYmUgbGlzdGVuZWQgdG8gd2l0aFxuICogYGxpc3RlbmAuXG4gKi9cbmNsYXNzIFN0cmljdEV2ZW50RW1pdHRlciBleHRlbmRzIGV2ZW50c18xLkV2ZW50RW1pdHRlciB7XG4gICAgLyoqXG4gICAgICogQWRkcyB0aGUgYGxpc3RlbmVyYCBmdW5jdGlvbiBhcyBhbiBldmVudCBsaXN0ZW5lciBmb3IgYGV2YC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBldiBOYW1lIG9mIHRoZSBldmVudFxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciBDYWxsYmFjayBmdW5jdGlvblxuICAgICAqL1xuICAgIG9uKGV2LCBsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gc3VwZXIub24oZXYsIGxpc3RlbmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkcyBhIG9uZS10aW1lIGBsaXN0ZW5lcmAgZnVuY3Rpb24gYXMgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIGBldmAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXYgTmFtZSBvZiB0aGUgZXZlbnRcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIgQ2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBvbmNlKGV2LCBsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gc3VwZXIub25jZShldiwgbGlzdGVuZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFbWl0cyBhbiBldmVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBldiBOYW1lIG9mIHRoZSBldmVudFxuICAgICAqIEBwYXJhbSBhcmdzIFZhbHVlcyB0byBzZW5kIHRvIGxpc3RlbmVycyBvZiB0aGlzIGV2ZW50XG4gICAgICovXG4gICAgZW1pdChldiwgLi4uYXJncykge1xuICAgICAgICByZXR1cm4gc3VwZXIuZW1pdChldiwgLi4uYXJncyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVtaXRzIGEgcmVzZXJ2ZWQgZXZlbnQuXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBgcHJvdGVjdGVkYCwgc28gdGhhdCBvbmx5IGEgY2xhc3MgZXh0ZW5kaW5nXG4gICAgICogYFN0cmljdEV2ZW50RW1pdHRlcmAgY2FuIGVtaXQgaXRzIG93biByZXNlcnZlZCBldmVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXYgUmVzZXJ2ZWQgZXZlbnQgbmFtZVxuICAgICAqIEBwYXJhbSBhcmdzIEFyZ3VtZW50cyB0byBlbWl0IGFsb25nIHdpdGggdGhlIGV2ZW50XG4gICAgICovXG4gICAgZW1pdFJlc2VydmVkKGV2LCAuLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5lbWl0KGV2LCAuLi5hcmdzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRW1pdHMgYW4gZXZlbnQuXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBgcHJvdGVjdGVkYCwgc28gdGhhdCBvbmx5IGEgY2xhc3MgZXh0ZW5kaW5nXG4gICAgICogYFN0cmljdEV2ZW50RW1pdHRlcmAgY2FuIGdldCBhcm91bmQgdGhlIHN0cmljdCB0eXBpbmcuIFRoaXMgaXMgdXNlZnVsIGZvclxuICAgICAqIGNhbGxpbmcgYGVtaXQuYXBwbHlgLCB3aGljaCBjYW4gYmUgY2FsbGVkIGFzIGBlbWl0VW50eXBlZC5hcHBseWAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXYgRXZlbnQgbmFtZVxuICAgICAqIEBwYXJhbSBhcmdzIEFyZ3VtZW50cyB0byBlbWl0IGFsb25nIHdpdGggdGhlIGV2ZW50XG4gICAgICovXG4gICAgZW1pdFVudHlwZWQoZXYsIC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmVtaXQoZXYsIC4uLmFyZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBsaXN0ZW5lcnMgbGlzdGVuaW5nIHRvIGFuIGV2ZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IEV2ZW50IG5hbWVcbiAgICAgKiBAcmV0dXJucyBBcnJheSBvZiBsaXN0ZW5lcnMgc3Vic2NyaWJlZCB0byBgZXZlbnRgXG4gICAgICovXG4gICAgbGlzdGVuZXJzKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBzdXBlci5saXN0ZW5lcnMoZXZlbnQpO1xuICAgIH1cbn1cbmV4cG9ydHMuU3RyaWN0RXZlbnRFbWl0dGVyID0gU3RyaWN0RXZlbnRFbWl0dGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnNlcnZlRmlsZSA9IGV4cG9ydHMucmVzdG9yZUFkYXB0ZXIgPSBleHBvcnRzLnBhdGNoQWRhcHRlciA9IHZvaWQgMDtcbmNvbnN0IHNvY2tldF9pb19hZGFwdGVyXzEgPSByZXF1aXJlKFwic29ja2V0LmlvLWFkYXB0ZXJcIik7XG5jb25zdCBmc18xID0gcmVxdWlyZShcImZzXCIpO1xuY29uc3QgZGVidWdfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZGVidWdcIikpO1xuY29uc3QgZGVidWcgPSAoMCwgZGVidWdfMS5kZWZhdWx0KShcInNvY2tldC5pbzphZGFwdGVyLXV3c1wiKTtcbmNvbnN0IFNFUEFSQVRPUiA9IFwiXFx4MWZcIjsgLy8gc2VlIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0RlbGltaXRlciNBU0NJSV9kZWxpbWl0ZWRfdGV4dFxuY29uc3QgeyBhZGRBbGwsIGRlbCwgYnJvYWRjYXN0IH0gPSBzb2NrZXRfaW9fYWRhcHRlcl8xLkFkYXB0ZXIucHJvdG90eXBlO1xuZnVuY3Rpb24gcGF0Y2hBZGFwdGVyKGFwcCAvKiA6IFRlbXBsYXRlZEFwcCAqLykge1xuICAgIHNvY2tldF9pb19hZGFwdGVyXzEuQWRhcHRlci5wcm90b3R5cGUuYWRkQWxsID0gZnVuY3Rpb24gKGlkLCByb29tcykge1xuICAgICAgICBjb25zdCBpc05ldyA9ICF0aGlzLnNpZHMuaGFzKGlkKTtcbiAgICAgICAgYWRkQWxsLmNhbGwodGhpcywgaWQsIHJvb21zKTtcbiAgICAgICAgY29uc3Qgc29ja2V0ID0gdGhpcy5uc3Auc29ja2V0cy5nZXQoaWQpO1xuICAgICAgICBpZiAoIXNvY2tldCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzb2NrZXQuY29ubi50cmFuc3BvcnQubmFtZSA9PT0gXCJ3ZWJzb2NrZXRcIikge1xuICAgICAgICAgICAgc3Vic2NyaWJlKHRoaXMubnNwLm5hbWUsIHNvY2tldCwgaXNOZXcsIHJvb21zKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNOZXcpIHtcbiAgICAgICAgICAgIHNvY2tldC5jb25uLm9uKFwidXBncmFkZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgcm9vbXMgPSB0aGlzLnNpZHMuZ2V0KGlkKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmUodGhpcy5uc3AubmFtZSwgc29ja2V0LCBpc05ldywgcm9vbXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHNvY2tldF9pb19hZGFwdGVyXzEuQWRhcHRlci5wcm90b3R5cGUuZGVsID0gZnVuY3Rpb24gKGlkLCByb29tKSB7XG4gICAgICAgIGRlbC5jYWxsKHRoaXMsIGlkLCByb29tKTtcbiAgICAgICAgY29uc3Qgc29ja2V0ID0gdGhpcy5uc3Auc29ja2V0cy5nZXQoaWQpO1xuICAgICAgICBpZiAoc29ja2V0ICYmIHNvY2tldC5jb25uLnRyYW5zcG9ydC5uYW1lID09PSBcIndlYnNvY2tldFwiKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBjb25zdCBzZXNzaW9uSWQgPSBzb2NrZXQuY29ubi5pZDtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGNvbnN0IHdlYnNvY2tldCA9IHNvY2tldC5jb25uLnRyYW5zcG9ydC5zb2NrZXQ7XG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IGAke3RoaXMubnNwLm5hbWV9JHtTRVBBUkFUT1J9JHtyb29tfWA7XG4gICAgICAgICAgICBkZWJ1ZyhcInVuc3Vic2NyaWJlIGNvbm5lY3Rpb24gJXMgZnJvbSB0b3BpYyAlc1wiLCBzZXNzaW9uSWQsIHRvcGljKTtcbiAgICAgICAgICAgIHdlYnNvY2tldC51bnN1YnNjcmliZSh0b3BpYyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHNvY2tldF9pb19hZGFwdGVyXzEuQWRhcHRlci5wcm90b3R5cGUuYnJvYWRjYXN0ID0gZnVuY3Rpb24gKHBhY2tldCwgb3B0cykge1xuICAgICAgICBjb25zdCB1c2VGYXN0UHVibGlzaCA9IG9wdHMucm9vbXMuc2l6ZSA8PSAxICYmIG9wdHMuZXhjZXB0LnNpemUgPT09IDA7XG4gICAgICAgIGlmICghdXNlRmFzdFB1Ymxpc2gpIHtcbiAgICAgICAgICAgIGJyb2FkY2FzdC5jYWxsKHRoaXMsIHBhY2tldCwgb3B0cyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmxhZ3MgPSBvcHRzLmZsYWdzIHx8IHt9O1xuICAgICAgICBjb25zdCBiYXNlUGFja2V0T3B0cyA9IHtcbiAgICAgICAgICAgIHByZUVuY29kZWQ6IHRydWUsXG4gICAgICAgICAgICB2b2xhdGlsZTogZmxhZ3Mudm9sYXRpbGUsXG4gICAgICAgICAgICBjb21wcmVzczogZmxhZ3MuY29tcHJlc3MsXG4gICAgICAgIH07XG4gICAgICAgIHBhY2tldC5uc3AgPSB0aGlzLm5zcC5uYW1lO1xuICAgICAgICBjb25zdCBlbmNvZGVkUGFja2V0cyA9IHRoaXMuZW5jb2Rlci5lbmNvZGUocGFja2V0KTtcbiAgICAgICAgY29uc3QgdG9waWMgPSBvcHRzLnJvb21zLnNpemUgPT09IDBcbiAgICAgICAgICAgID8gdGhpcy5uc3AubmFtZVxuICAgICAgICAgICAgOiBgJHt0aGlzLm5zcC5uYW1lfSR7U0VQQVJBVE9SfSR7b3B0cy5yb29tcy5rZXlzKCkubmV4dCgpLnZhbHVlfWA7XG4gICAgICAgIGRlYnVnKFwiZmFzdCBwdWJsaXNoIHRvICVzXCIsIHRvcGljKTtcbiAgICAgICAgLy8gZmFzdCBwdWJsaXNoIGZvciBjbGllbnRzIGNvbm5lY3RlZCB3aXRoIFdlYlNvY2tldFxuICAgICAgICBlbmNvZGVkUGFja2V0cy5mb3JFYWNoKChlbmNvZGVkUGFja2V0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpc0JpbmFyeSA9IHR5cGVvZiBlbmNvZGVkUGFja2V0ICE9PSBcInN0cmluZ1wiO1xuICAgICAgICAgICAgLy8gXCI0XCIgYmVpbmcgdGhlIG1lc3NhZ2UgdHlwZSBpbiB0aGUgRW5naW5lLklPIHByb3RvY29sLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3NvY2tldGlvL2VuZ2luZS5pby1wcm90b2NvbFxuICAgICAgICAgICAgYXBwLnB1Ymxpc2godG9waWMsIGlzQmluYXJ5ID8gZW5jb2RlZFBhY2tldCA6IFwiNFwiICsgZW5jb2RlZFBhY2tldCwgaXNCaW5hcnkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hcHBseShvcHRzLCAoc29ja2V0KSA9PiB7XG4gICAgICAgICAgICBpZiAoc29ja2V0LmNvbm4udHJhbnNwb3J0Lm5hbWUgIT09IFwid2Vic29ja2V0XCIpIHtcbiAgICAgICAgICAgICAgICAvLyBjbGFzc2ljIHB1Ymxpc2ggZm9yIGNsaWVudHMgY29ubmVjdGVkIHdpdGggSFRUUCBsb25nLXBvbGxpbmdcbiAgICAgICAgICAgICAgICBzb2NrZXQuY2xpZW50LndyaXRlVG9FbmdpbmUoZW5jb2RlZFBhY2tldHMsIGJhc2VQYWNrZXRPcHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbn1cbmV4cG9ydHMucGF0Y2hBZGFwdGVyID0gcGF0Y2hBZGFwdGVyO1xuZnVuY3Rpb24gc3Vic2NyaWJlKG5hbWVzcGFjZU5hbWUsIHNvY2tldCwgaXNOZXcsIHJvb21zKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHNlc3Npb25JZCA9IHNvY2tldC5jb25uLmlkO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCB3ZWJzb2NrZXQgPSBzb2NrZXQuY29ubi50cmFuc3BvcnQuc29ja2V0O1xuICAgIGlmIChpc05ldykge1xuICAgICAgICBkZWJ1ZyhcInN1YnNjcmliZSBjb25uZWN0aW9uICVzIHRvIHRvcGljICVzXCIsIHNlc3Npb25JZCwgbmFtZXNwYWNlTmFtZSk7XG4gICAgICAgIHdlYnNvY2tldC5zdWJzY3JpYmUobmFtZXNwYWNlTmFtZSk7XG4gICAgfVxuICAgIHJvb21zLmZvckVhY2goKHJvb20pID0+IHtcbiAgICAgICAgY29uc3QgdG9waWMgPSBgJHtuYW1lc3BhY2VOYW1lfSR7U0VQQVJBVE9SfSR7cm9vbX1gOyAvLyAnIycgY2FuIGJlIHVzZWQgYXMgd2lsZGNhcmRcbiAgICAgICAgZGVidWcoXCJzdWJzY3JpYmUgY29ubmVjdGlvbiAlcyB0byB0b3BpYyAlc1wiLCBzZXNzaW9uSWQsIHRvcGljKTtcbiAgICAgICAgd2Vic29ja2V0LnN1YnNjcmliZSh0b3BpYyk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiByZXN0b3JlQWRhcHRlcigpIHtcbiAgICBzb2NrZXRfaW9fYWRhcHRlcl8xLkFkYXB0ZXIucHJvdG90eXBlLmFkZEFsbCA9IGFkZEFsbDtcbiAgICBzb2NrZXRfaW9fYWRhcHRlcl8xLkFkYXB0ZXIucHJvdG90eXBlLmRlbCA9IGRlbDtcbiAgICBzb2NrZXRfaW9fYWRhcHRlcl8xLkFkYXB0ZXIucHJvdG90eXBlLmJyb2FkY2FzdCA9IGJyb2FkY2FzdDtcbn1cbmV4cG9ydHMucmVzdG9yZUFkYXB0ZXIgPSByZXN0b3JlQWRhcHRlcjtcbmNvbnN0IHRvQXJyYXlCdWZmZXIgPSAoYnVmZmVyKSA9PiB7XG4gICAgY29uc3QgeyBidWZmZXI6IGFycmF5QnVmZmVyLCBieXRlT2Zmc2V0LCBieXRlTGVuZ3RoIH0gPSBidWZmZXI7XG4gICAgcmV0dXJuIGFycmF5QnVmZmVyLnNsaWNlKGJ5dGVPZmZzZXQsIGJ5dGVPZmZzZXQgKyBieXRlTGVuZ3RoKTtcbn07XG4vLyBpbXBvcnRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9rb2xvZHppZWpjemFrLXN6L3V3ZWJzb2NrZXQtc2VydmVcbmZ1bmN0aW9uIHNlcnZlRmlsZShyZXMgLyogOiBIdHRwUmVzcG9uc2UgKi8sIGZpbGVwYXRoKSB7XG4gICAgY29uc3QgeyBzaXplIH0gPSAoMCwgZnNfMS5zdGF0U3luYykoZmlsZXBhdGgpO1xuICAgIGNvbnN0IHJlYWRTdHJlYW0gPSAoMCwgZnNfMS5jcmVhdGVSZWFkU3RyZWFtKShmaWxlcGF0aCk7XG4gICAgY29uc3QgZGVzdHJveVJlYWRTdHJlYW0gPSAoKSA9PiAhcmVhZFN0cmVhbS5kZXN0cm95ZWQgJiYgcmVhZFN0cmVhbS5kZXN0cm95KCk7XG4gICAgY29uc3Qgb25FcnJvciA9IChlcnJvcikgPT4ge1xuICAgICAgICBkZXN0cm95UmVhZFN0cmVhbSgpO1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICB9O1xuICAgIGNvbnN0IG9uRGF0YUNodW5rID0gKGNodW5rKSA9PiB7XG4gICAgICAgIGNvbnN0IGFycmF5QnVmZmVyQ2h1bmsgPSB0b0FycmF5QnVmZmVyKGNodW5rKTtcbiAgICAgICAgY29uc3QgbGFzdE9mZnNldCA9IHJlcy5nZXRXcml0ZU9mZnNldCgpO1xuICAgICAgICBjb25zdCBbb2ssIGRvbmVdID0gcmVzLnRyeUVuZChhcnJheUJ1ZmZlckNodW5rLCBzaXplKTtcbiAgICAgICAgaWYgKCFkb25lICYmICFvaykge1xuICAgICAgICAgICAgcmVhZFN0cmVhbS5wYXVzZSgpO1xuICAgICAgICAgICAgcmVzLm9uV3JpdGFibGUoKG9mZnNldCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IFtvaywgZG9uZV0gPSByZXMudHJ5RW5kKGFycmF5QnVmZmVyQ2h1bmsuc2xpY2Uob2Zmc2V0IC0gbGFzdE9mZnNldCksIHNpemUpO1xuICAgICAgICAgICAgICAgIGlmICghZG9uZSAmJiBvaykge1xuICAgICAgICAgICAgICAgICAgICByZWFkU3RyZWFtLnJlc3VtZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb2s7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmVzLm9uQWJvcnRlZChkZXN0cm95UmVhZFN0cmVhbSk7XG4gICAgcmVhZFN0cmVhbVxuICAgICAgICAub24oXCJkYXRhXCIsIG9uRGF0YUNodW5rKVxuICAgICAgICAub24oXCJlcnJvclwiLCBvbkVycm9yKVxuICAgICAgICAub24oXCJlbmRcIiwgZGVzdHJveVJlYWRTdHJlYW0pO1xufVxuZXhwb3J0cy5zZXJ2ZUZpbGUgPSBzZXJ2ZUZpbGU7XG4iLCJpbXBvcnQgaW8gZnJvbSBcIi4vZGlzdC9pbmRleC5qc1wiO1xuXG5leHBvcnQgY29uc3Qge1NlcnZlciwgTmFtZXNwYWNlLCBTb2NrZXR9ID0gaW87XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tICdzb2NrZXQuaW8nO1xuXG5jb25zdCB7IEFQUF9CQVNFX1VSTCwgQVBQX0NMSUVOVF9QT1JULCBBUFBfU0VSVkVSX1BPUlQgPSAnMzAwMCcgfSA9IHByb2Nlc3MuZW52O1xuXG5jb25zdCBwb3J0ID0gcGFyc2VJbnQoQVBQX1NFUlZFUl9QT1JULCAxMCk7XG5jb25zdCBjbGllbnRVcmwgPSBgaHR0cDovLyR7QVBQX0JBU0VfVVJMfToke0FQUF9DTElFTlRfUE9SVH1gO1xuY29uc3QgaHR0cFNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKCkubGlzdGVuKHBvcnQsICcwLjAuMC4wJyk7XG5jb25zb2xlLmxvZyhjbGllbnRVcmwpO1xuY29uc3QgaW8gPSBuZXcgU2VydmVyKGh0dHBTZXJ2ZXIsIHtcbiAgY29yczoge1xuICAgIG9yaWdpbjogY2xpZW50VXJsLFxuICB9LFxufSk7XG5jb25zb2xlLmxvZyhgUnVubmluZyBzZXJ2ZXIgb24gcG9ydDoke3BvcnR9YCk7XG5cbmlvLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4ge1xuICBjb25zb2xlLmxvZygndXNlciBjb25uZWN0ZWQnKTtcbiAgc29ja2V0LmVtaXQoJ3dlbGNvbWUnLCAnd2VsY29tZSBtYW4nKTtcbn0pO1xuIl0sIm5hbWVzIjpbImh0dHAiLCJTZXJ2ZXIiLCJwcm9jZXNzIiwiZW52IiwiQVBQX0JBU0VfVVJMIiwiQVBQX0NMSUVOVF9QT1JUIiwiQVBQX1NFUlZFUl9QT1JUIiwicG9ydCIsInBhcnNlSW50IiwiY2xpZW50VXJsIiwiaHR0cFNlcnZlciIsImNyZWF0ZVNlcnZlciIsImxpc3RlbiIsImNvbnNvbGUiLCJsb2ciLCJpbyIsImNvcnMiLCJvcmlnaW4iLCJvbiIsInNvY2tldCIsImVtaXQiXSwic291cmNlUm9vdCI6IiJ9