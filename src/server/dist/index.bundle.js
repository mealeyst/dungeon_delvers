/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************************!*\
  !*** ./src/server/lib/server.ts ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! socket.io */ "socket.io");
/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(socket_io__WEBPACK_IMPORTED_MODULE_1__);


var _process$env = {"NODENV_SHELL":"zsh","TERM_PROGRAM":"iTerm.app","NODENV_DIR":"/usr/local/bin","NODE":"/Users/mobealey/.nodenv/versions/16.4.2/bin/node","ANDROID_HOME":"/Users/mobealey/.android-sdk","INIT_CWD":"/Users/mobealey/Projects/personal/dungeon_delvers","TERM":"xterm-256color","SHELL":"/bin/zsh","TMPDIR":"/var/folders/vh/0ys0f72x7dgdy85n1ryv8vvw0000gn/T/","npm_config_metrics_registry":"https://registry.npmjs.org/","_P9K_SSH":"0","TERM_PROGRAM_VERSION":"3.4.12","TERM_SESSION_ID":"w0t0p0:70CFFFDB-257C-49A8-822B-820CC6F89BB7","COLOR":"1","npm_config_noproxy":"","NODENV_ROOT":"/Users/mobealey/.nodenv","NODENV_HOOK_PATH":"/Users/mobealey/.nodenv/nodenv.d:/usr/local/Cellar/nodenv/1.4.0/nodenv.d:/usr/local/etc/nodenv.d:/etc/nodenv.d:/usr/lib/nodenv/hooks","USER":"mobealey","COMMAND_MODE":"unix2003","npm_config_globalconfig":"/Users/mobealey/.nodenv/versions/16.4.2/etc/npmrc","SSH_AUTH_SOCK":"/private/tmp/com.apple.launchd.1EGzu7lpdH/Listeners","__CF_USER_TEXT_ENCODING":"0x1F5:0x0:0x0","npm_execpath":"/Users/mobealey/.nodenv/versions/16.4.2/lib/node_modules/npm/bin/npm-cli.js","PAGER":"less","LSCOLORS":"Gxfxcxdxbxegedabagacad","PATH":"/Users/mobealey/Projects/personal/dungeon_delvers/node_modules/.bin:/Users/mobealey/Projects/personal/node_modules/.bin:/Users/mobealey/Projects/node_modules/.bin:/Users/mobealey/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/mobealey/.nodenv/versions/16.4.2/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/Users/mobealey/Projects/personal/dungeon_delvers/node_modules/.bin:/Users/mobealey/Projects/personal/node_modules/.bin:/Users/mobealey/Projects/node_modules/.bin:/Users/mobealey/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/usr/local/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/Users/mobealey/.nodenv/versions/16.4.2/bin:/usr/local/Cellar/nodenv/1.4.0/libexec:/Users/mobealey/.nodenv/plugins/nodenv-update/bin:/Users/mobealey/.nodenv/plugins/nodenv-build/bin:/Users/mobealey/.jenv/shims:/Users/mobealey/.composer/vendor/bin:/Users/mobealey/.flutter/flutter/bin:/usr/local/bin:.jenv/bin:/Users/mobealey/.android-sdk/cmdline-tools/tools/bin:/usr/local/Cellar/nodenv/1.3.1/libexec/nodenv:/Users/mobealey/.nodenv/shims:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Apple/usr/bin:/Users/mobealey/Library/Android/sdk/platform-tools:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/heroku:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/pip:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/lein:/Users/mobealey/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/command-not-found:/Users/mobealey/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/mobealey/.antigen/bundles/romkatv/powerlevel10k","npm_config_init.module":"/Users/mobealey/.npm-init.js","_":"node_modules/.bin/webpack","LaunchInstanceID":"E1923E0C-916A-4FBA-AFCF-450FED3640E0","npm_package_json":"/Users/mobealey/Projects/personal/dungeon_delvers/package.json","__CFBundleIdentifier":"com.googlecode.iterm2","npm_config_init_module":"/Users/mobealey/.npm-init.js","npm_config_userconfig":"/Users/mobealey/.npmrc","JENV_LOADED":"1","PWD":"/Users/mobealey/Projects/personal/dungeon_delvers","npm_command":"run-script","EDITOR":"vi","npm_lifecycle_event":"watch:server","LANG":"en_US.UTF-8","npm_package_name":"dungeon_delvers","ITERM_PROFILE":"Default","XPC_FLAGS":"0x0","npm_config_node_gyp":"/Users/mobealey/.nodenv/versions/16.4.2/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js","XPC_SERVICE_NAME":"0","npm_package_version":"0.0.1","SHLVL":"3","HOME":"/Users/mobealey","COLORFGBG":"15;0","LC_TERMINAL_VERSION":"3.4.12","ITERM_SESSION_ID":"w0t0p0:70CFFFDB-257C-49A8-822B-820CC6F89BB7","LESS":"-R","LOGNAME":"mobealey","npm_config_cache":"/Users/mobealey/.npm","JENV_SHELL":"zsh","npm_lifecycle_script":"node_modules/.bin/webpack --config ./src/server/webpack.config.js --mode=development -w","NODENV_VERSION":"16.4.2","LC_CTYPE":"en_US.UTF-8","npm_config_user_agent":"npm/7.6.3 node/v16.4.2 darwin x64","LC_TERMINAL":"iTerm2","SECURITYSESSIONID":"186ab","COLORTERM":"truecolor","npm_config_prefix":"/Users/mobealey/.nodenv/versions/16.4.2","npm_node_execpath":"/Users/mobealey/.nodenv/versions/16.4.2/bin/node","APP_BASE_URL":"localhost","APP_CLIENT_PORT":"8080","APP_SERVER_PORT":"3000"},
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUVBLG1CQUFvRUUsNjNJQUFwRTtBQUFBLElBQVFFLFlBQVIsZ0JBQVFBLFlBQVI7QUFBQSxJQUFzQkMsZUFBdEIsZ0JBQXNCQSxlQUF0QjtBQUFBLHlDQUF1Q0MsZUFBdkM7QUFBQSxJQUF1Q0EsZUFBdkMsc0NBQXlELE1BQXpEO0FBRUEsSUFBTUMsSUFBSSxHQUFHQyxRQUFRLENBQUNGLGVBQUQsRUFBa0IsRUFBbEIsQ0FBckI7QUFDQSxJQUFNRyxTQUFTLG9CQUFhTCxZQUFiLGNBQTZCQyxlQUE3QixDQUFmO0FBQ0EsSUFBTUssVUFBVSxHQUFHVix3REFBQSxHQUFvQlksTUFBcEIsQ0FBMkJMLElBQTNCLEVBQWlDLFNBQWpDLENBQW5CO0FBQ0FNLE9BQU8sQ0FBQ0MsR0FBUixDQUFZTCxTQUFaO0FBQ0EsSUFBTU0sRUFBRSxHQUFHLElBQUlkLDZDQUFKLENBQVdTLFVBQVgsRUFBdUI7QUFDaENNLEVBQUFBLElBQUksRUFBRTtBQUNKQyxJQUFBQSxNQUFNLEVBQUVSO0FBREo7QUFEMEIsQ0FBdkIsQ0FBWDtBQUtBSSxPQUFPLENBQUNDLEdBQVIsa0NBQXNDUCxJQUF0QztBQUVBUSxFQUFFLENBQUNHLEVBQUgsQ0FBTSxZQUFOLEVBQW9CLFVBQUNDLE1BQUQsRUFBWTtBQUM5Qk4sRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksZ0JBQVo7QUFDQUssRUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVksU0FBWixFQUF1QixhQUF2QjtBQUNELENBSEQsRSIsInNvdXJjZXMiOlsid2VicGFjazovL2R1bmdlb25fZGVsdmVycy9leHRlcm5hbCBjb21tb25qcyBcInNvY2tldC5pb1wiIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiaHR0cFwiIiwid2VicGFjazovL2R1bmdlb25fZGVsdmVycy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZHVuZ2Vvbl9kZWx2ZXJzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kdW5nZW9uX2RlbHZlcnMvLi9zcmMvc2VydmVyL2xpYi9zZXJ2ZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic29ja2V0LmlvXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IHsgU2VydmVyIH0gZnJvbSAnc29ja2V0LmlvJztcblxuY29uc3QgeyBBUFBfQkFTRV9VUkwsIEFQUF9DTElFTlRfUE9SVCwgQVBQX1NFUlZFUl9QT1JUID0gJzMwMDAnIH0gPSBwcm9jZXNzLmVudjtcblxuY29uc3QgcG9ydCA9IHBhcnNlSW50KEFQUF9TRVJWRVJfUE9SVCwgMTApO1xuY29uc3QgY2xpZW50VXJsID0gYGh0dHA6Ly8ke0FQUF9CQVNFX1VSTH06JHtBUFBfQ0xJRU5UX1BPUlR9YDtcbmNvbnN0IGh0dHBTZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcigpLmxpc3Rlbihwb3J0LCAnMC4wLjAuMCcpO1xuY29uc29sZS5sb2coY2xpZW50VXJsKTtcbmNvbnN0IGlvID0gbmV3IFNlcnZlcihodHRwU2VydmVyLCB7XG4gIGNvcnM6IHtcbiAgICBvcmlnaW46IGNsaWVudFVybCxcbiAgfSxcbn0pO1xuY29uc29sZS5sb2coYFJ1bm5pbmcgc2VydmVyIG9uIHBvcnQ6JHtwb3J0fWApO1xuXG5pby5vbignY29ubmVjdGlvbicsIChzb2NrZXQpID0+IHtcbiAgY29uc29sZS5sb2coJ3VzZXIgY29ubmVjdGVkJyk7XG4gIHNvY2tldC5lbWl0KCd3ZWxjb21lJywgJ3dlbGNvbWUgbWFuJyk7XG59KTtcbiJdLCJuYW1lcyI6WyJodHRwIiwiU2VydmVyIiwicHJvY2VzcyIsImVudiIsIkFQUF9CQVNFX1VSTCIsIkFQUF9DTElFTlRfUE9SVCIsIkFQUF9TRVJWRVJfUE9SVCIsInBvcnQiLCJwYXJzZUludCIsImNsaWVudFVybCIsImh0dHBTZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJsaXN0ZW4iLCJjb25zb2xlIiwibG9nIiwiaW8iLCJjb3JzIiwib3JpZ2luIiwib24iLCJzb2NrZXQiLCJlbWl0Il0sInNvdXJjZVJvb3QiOiIifQ==