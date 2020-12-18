/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "b65c451eb67be75cb6e5";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\nmodule.exports = function(updatedModules, renewedModules) {\n\tvar unacceptedModules = updatedModules.filter(function(moduleId) {\n\t\treturn renewedModules && renewedModules.indexOf(moduleId) < 0;\n\t});\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\tif (unacceptedModules.length > 0) {\n\t\tlog(\n\t\t\t\"warning\",\n\t\t\t\"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)\"\n\t\t);\n\t\tunacceptedModules.forEach(function(moduleId) {\n\t\t\tlog(\"warning\", \"[HMR]  - \" + moduleId);\n\t\t});\n\t}\n\n\tif (!renewedModules || renewedModules.length === 0) {\n\t\tlog(\"info\", \"[HMR] Nothing hot updated.\");\n\t} else {\n\t\tlog(\"info\", \"[HMR] Updated modules:\");\n\t\trenewedModules.forEach(function(moduleId) {\n\t\t\tif (typeof moduleId === \"string\" && moduleId.indexOf(\"!\") !== -1) {\n\t\t\t\tvar parts = moduleId.split(\"!\");\n\t\t\t\tlog.groupCollapsed(\"info\", \"[HMR]  - \" + parts.pop());\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t\tlog.groupEnd(\"info\");\n\t\t\t} else {\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t}\n\t\t});\n\t\tvar numberIds = renewedModules.every(function(moduleId) {\n\t\t\treturn typeof moduleId === \"number\";\n\t\t});\n\t\tif (numberIds)\n\t\t\tlog(\n\t\t\t\t\"info\",\n\t\t\t\t\"[HMR] Consider using the NamedModulesPlugin for module names.\"\n\t\t\t);\n\t}\n};\n\n\n//# sourceURL=webpack:///(webpack)/hot/log-apply-result.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var logLevel = \"info\";\n\nfunction dummy() {}\n\nfunction shouldLog(level) {\n\tvar shouldLog =\n\t\t(logLevel === \"info\" && level === \"info\") ||\n\t\t([\"info\", \"warning\"].indexOf(logLevel) >= 0 && level === \"warning\") ||\n\t\t([\"info\", \"warning\", \"error\"].indexOf(logLevel) >= 0 && level === \"error\");\n\treturn shouldLog;\n}\n\nfunction logGroup(logFn) {\n\treturn function(level, msg) {\n\t\tif (shouldLog(level)) {\n\t\t\tlogFn(msg);\n\t\t}\n\t};\n}\n\nmodule.exports = function(level, msg) {\n\tif (shouldLog(level)) {\n\t\tif (level === \"info\") {\n\t\t\tconsole.log(msg);\n\t\t} else if (level === \"warning\") {\n\t\t\tconsole.warn(msg);\n\t\t} else if (level === \"error\") {\n\t\t\tconsole.error(msg);\n\t\t}\n\t}\n};\n\n/* eslint-disable node/no-unsupported-features/node-builtins */\nvar group = console.group || dummy;\nvar groupCollapsed = console.groupCollapsed || dummy;\nvar groupEnd = console.groupEnd || dummy;\n/* eslint-enable node/no-unsupported-features/node-builtins */\n\nmodule.exports.group = logGroup(group);\n\nmodule.exports.groupCollapsed = logGroup(groupCollapsed);\n\nmodule.exports.groupEnd = logGroup(groupEnd);\n\nmodule.exports.setLogLevel = function(level) {\n\tlogLevel = level;\n};\n\nmodule.exports.formatError = function(err) {\n\tvar message = err.message;\n\tvar stack = err.stack;\n\tif (!stack) {\n\t\treturn message;\n\t} else if (stack.indexOf(message) < 0) {\n\t\treturn message + \"\\n\" + stack;\n\t} else {\n\t\treturn stack;\n\t}\n};\n\n\n//# sourceURL=webpack:///(webpack)/hot/log.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?100":
/*!*********************************!*\
  !*** (webpack)/hot/poll.js?100 ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n/*globals __resourceQuery */\nif (true) {\n\tvar hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\tvar checkForUpdate = function checkForUpdate(fromUpdate) {\n\t\tif (module.hot.status() === \"idle\") {\n\t\t\tmodule.hot\n\t\t\t\t.check(true)\n\t\t\t\t.then(function(updatedModules) {\n\t\t\t\t\tif (!updatedModules) {\n\t\t\t\t\t\tif (fromUpdate) log(\"info\", \"[HMR] Update applied.\");\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\t__webpack_require__(/*! ./log-apply-result */ \"./node_modules/webpack/hot/log-apply-result.js\")(updatedModules, updatedModules);\n\t\t\t\t\tcheckForUpdate(true);\n\t\t\t\t})\n\t\t\t\t.catch(function(err) {\n\t\t\t\t\tvar status = module.hot.status();\n\t\t\t\t\tif ([\"abort\", \"fail\"].indexOf(status) >= 0) {\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Cannot apply update.\");\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] \" + log.formatError(err));\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] You need to restart the application!\");\n\t\t\t\t\t} else {\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Update failed: \" + log.formatError(err));\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t}\n\t};\n\tsetInterval(checkForUpdate, hotPollInterval);\n} else {}\n\n/* WEBPACK VAR INJECTION */}.call(this, \"?100\"))\n\n//# sourceURL=webpack:///(webpack)/hot/poll.js?");

/***/ }),

/***/ "./src/config/mysql.config.ts":
/*!************************************!*\
  !*** ./src/config/mysql.config.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.db = void 0;\nconst dotenv = __importStar(__webpack_require__(/*! dotenv */ \"dotenv\"));\nconst Sequelize = __webpack_require__(/*! sequelize */ \"sequelize\");\ndotenv.config();\nconst instance = new Sequelize(process.env.DB, process.env.DBUSER, process.env.PASSWORD, {\n    host: process.env.HOST,\n    dialect: process.env.DIALECT,\n});\nexports.db = {\n    sequelize: Sequelize,\n    instance: instance,\n};\n\n\n//# sourceURL=webpack:///./src/config/mysql.config.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * Required External Modules\n */\nconst dotenv = __importStar(__webpack_require__(/*! dotenv */ \"dotenv\"));\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst cors_1 = __importDefault(__webpack_require__(/*! cors */ \"cors\"));\nconst helmet_1 = __importDefault(__webpack_require__(/*! helmet */ \"helmet\"));\nconst cars_router_1 = __webpack_require__(/*! ./models/cars/cars.router */ \"./src/models/cars/cars.router.ts\");\nconst reservations_router_1 = __webpack_require__(/*! ./models/reservations/reservations.router */ \"./src/models/reservations/reservations.router.ts\");\nconst swagger_jsdoc_1 = __importDefault(__webpack_require__(/*! swagger-jsdoc */ \"swagger-jsdoc\"));\nconst swagger_ui_express_1 = __importDefault(__webpack_require__(/*! swagger-ui-express */ \"swagger-ui-express\"));\nconst mysql_config_1 = __webpack_require__(/*! ./config/mysql.config */ \"./src/config/mysql.config.ts\");\nconst db_init_1 = __webpack_require__(/*! ./models/db.init */ \"./src/models/db.init.ts\");\nconst users_router_1 = __webpack_require__(/*! ./models/users/users.router */ \"./src/models/users/users.router.ts\");\n(() => __awaiter(void 0, void 0, void 0, function* () {\n    dotenv.config();\n    /**\n     * App Variables\n     */\n    if (!process.env.PORT) {\n        process.exit(1);\n    }\n    const PORT = parseInt(process.env.PORT, 10);\n    const app = express_1.default();\n    /**\n     * Swagger documentation\n     */\n    const options = {\n        swaggerOptions: {\n            authAction: { JWT: { name: \"JWT\", schema: { type: \"apiKey\", in: \"header\", name: \"Authorization\", description: \"\" }, value: \"Bearer <JWT>\" } }\n        },\n        definition: {\n            openapi: \"3.0.0\",\n            info: {\n                title: \"Team BS Car\",\n                version: \"1.0.3\",\n                description: \"To launch request with this documentation you need to send a request to /users/login at the end with the credentials admin/admin and then put the token in authorize in the top right corner. After that you will be able to test all of our request within the documentation. To launch request within your app you need to do the same.\"\n            },\n            components: {\n                securitySchemes: {\n                    bearerAuth: {\n                        type: 'http',\n                        scheme: 'bearer',\n                        bearerFormat: 'JWT',\n                    }\n                }\n            },\n            security: {\n                bearerAuth: [],\n            },\n            servers: [\n                {\n                    url: \"https://mysterious-eyrie-25660.herokuapp.com\",\n                },\n            ],\n        },\n        apis: [\"./**/**/*.router.ts\"],\n    };\n    const specs = swagger_jsdoc_1.default(options);\n    /**\n     *  App Configuration\n     */\n    app.use(helmet_1.default());\n    app.use((req, res, next) => { next(); }, cors_1.default());\n    app.use(express_1.default.json());\n    app.use(\"/cars\", cars_router_1.carsRouter);\n    app.use(\"/users\", users_router_1.usersRouter);\n    app.use(\"/reservations\", reservations_router_1.reservationsRouter);\n    app.use(\"/api-docs\", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));\n    /**\n     * Database initialization\n     */\n    db_init_1.databaseTableInitialization();\n    db_init_1.databaseForeignJeyInitialization();\n    yield mysql_config_1.db.instance.sync({ force: true });\n    //if (process.env.ENVIRONMENT == \"dev\") {\n    //    await mysql.instance.sync({ force: true });\n    //}\n    //else {\n    //    mysql.instance.sync();\n    //}\n    db_init_1.databseDataInitialization();\n    /**\n     * Server Activation\n     */\n    const server = app.listen(PORT, () => {\n        console.log(`Listening on port ${PORT}`);\n    });\n    if (true) {\n        module.hot.accept();\n        module.hot.dispose(() => server.close());\n    }\n}))();\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/middleware/Auth.ts":
/*!********************************!*\
  !*** ./src/middleware/Auth.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\nexports.default = (req, res, next) => {\n    try {\n        const token = req.headers.authorization.split(' ')[1];\n        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');\n        const userId = decodedToken.userId;\n        if (req.body.userId && req.body.userId !== userId) {\n            throw 'Invalid user ID';\n        }\n        else {\n            next();\n        }\n    }\n    catch (e) {\n        throw 'Invalid token';\n    }\n};\n\n\n//# sourceURL=webpack:///./src/middleware/Auth.ts?");

/***/ }),

/***/ "./src/models/cars/car.class.ts":
/*!**************************************!*\
  !*** ./src/models/cars/car.class.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.initialize = exports.Car = void 0;\nconst sequelize_1 = __webpack_require__(/*! sequelize */ \"sequelize\");\nconst mysql_config_1 = __webpack_require__(/*! ../../config/mysql.config */ \"./src/config/mysql.config.ts\");\nconst reservation_class_1 = __webpack_require__(/*! ../reservations/reservation.class */ \"./src/models/reservations/reservation.class.ts\");\nconst sequelize = mysql_config_1.db.instance;\nclass Car extends sequelize_1.Model {\n}\nexports.Car = Car;\nexports.initialize = {\n    table: () => {\n        Car.init({\n            id: {\n                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,\n                autoIncrement: true,\n                primaryKey: true,\n            },\n            name: {\n                type: new sequelize_1.DataTypes.STRING(128),\n                allowNull: false,\n            },\n            description: {\n                type: new sequelize_1.DataTypes.STRING(128),\n                allowNull: false,\n            },\n            brand: {\n                type: new sequelize_1.DataTypes.STRING(128),\n                allowNull: false,\n            },\n            immat: {\n                type: new sequelize_1.DataTypes.STRING(128),\n                allowNull: false,\n            },\n            dailyPrice: {\n                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,\n                allowNull: false,\n            }\n        }, {\n            tableName: \"Car\",\n            sequelize: sequelize\n        });\n    },\n    fk: () => {\n        Car.hasMany(reservation_class_1.Reservation, {\n            sourceKey: \"id\",\n            foreignKey: \"carId\",\n            as: \"reservations\",\n        });\n    }\n};\n\n\n//# sourceURL=webpack:///./src/models/cars/car.class.ts?");

/***/ }),

/***/ "./src/models/cars/cars.router.ts":
/*!****************************************!*\
  !*** ./src/models/cars/cars.router.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Required External Modules and Interfaces\n */\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.carsRouter = void 0;\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst car_class_1 = __webpack_require__(/*! ./car.class */ \"./src/models/cars/car.class.ts\");\nconst Auth_1 = __importDefault(__webpack_require__(/*! ../../middleware/Auth */ \"./src/middleware/Auth.ts\"));\n/**\n * Router Definition\n */\nexports.carsRouter = express_1.default.Router();\n/**\n * Controller Definitions\n */\n/**\n * @swagger\n *\n * definitions:\n *   NewCar:\n *     type: object\n *     required:\n *       - immat\n *       - name\n *       - brand\n *       - description\n *       - dailyPrice\n *     properties:\n *       name:\n *         type: string\n *       immat:\n *         type: string\n *       brand:\n *         type: string\n *       description:\n *         type: string\n *       dailyPrice:\n *         type: number\n *   Car:\n *     allOf:\n *       - $ref: '#/definitions/NewCar'\n *       - required:\n *         - id\n *       - properties:\n *         id:\n *           type: integer\n *           format: int64\n */\n// GET cars/\n/**\n * @swagger\n * /cars:\n *   get:\n *     security:\n *       - bearerAuth: []\n *     tags:\n *       - Cars\n *     description: Returns cars\n *     produces:\n *      - application/json\n *     responses:\n *       200:\n *         description: cars\n *         schema:\n *           type: array\n *           items:\n *             $ref: '#/definitions/Car'\n */\nexports.carsRouter.get(\"/\", Auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    try {\n        const cars = yield car_class_1.Car.findAll();\n        res.status(200).send(cars);\n    }\n    catch (e) {\n        res.status(404).send(e.message);\n    }\n}));\n// GET cars/:id\n/**\n * @swagger\n *\n * /cars/{id}:\n *   get:\n *     security:\n *       - bearerAuth: []\n *     tags:\n *       - Cars\n *     produces:\n *       - application/json\n *     parameters:\n *       - name: id\n *         in: path\n *         required: true\n *         type: number\n *     responses:\n *       200:\n *         description: Car\n *         schema:\n *           type: Car\n *           item:\n *             $ref: '#/definitions/Car'\n */\nexports.carsRouter.get(\"/:id\", Auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    const id = parseInt(req.params.id, 10);\n    try {\n        const car = yield car_class_1.Car.findOne({\n            where: {\n                id: id\n            }\n        });\n        res.status(200).send(car);\n    }\n    catch (e) {\n        res.status(404).send(e.message);\n    }\n}));\n/**\n * @swagger\n *\n * /cars:\n *   post:\n *     security:\n *       - bearerAuth: []\n *     tags:\n *       - Cars\n *     description: Creates a car\n *     requestBody:\n *       required: true\n *       content:\n *         application/json:\n *           schema:\n *             $ref: '#/definitions/NewCar'\n *     responses:\n *       200:\n *         description: cars\n *         schema:\n *           $ref: '#/definitions/Car'\n */\n// POST cars/\nexports.carsRouter.post(\"/\", Auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    try {\n        const car = req.body;\n        yield car_class_1.Car.create(car);\n        res.sendStatus(201);\n    }\n    catch (e) {\n        res.status(404).send(e.message);\n    }\n}));\n// PUT cars/\n/**\n * @swagger\n *\n * /cars/{id}:\n *   put:\n *     security:\n *       - bearerAuth: []\n *     description: Update a existing car\n *     tags:\n *       - Cars\n *     parameters:\n *       - name: id\n *         in: path\n *         required: true\n *         type: number\n *     requestBody:\n *       required: true\n *       content:\n *         application/json:\n *           schema:\n *             $ref: '#/definitions/NewCar'\n *     responses:\n *       200:\n *         description: Cars\n *         schema:\n *           $ref: '#/definitions/Car'\n */\nexports.carsRouter.put(\"/:id\", Auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    try {\n        const id = parseInt(req.params.id, 10);\n        const car = req.body;\n        yield car_class_1.Car.update(car, {\n            where: {\n                id: id\n            }\n        });\n        res.sendStatus(200);\n    }\n    catch (e) {\n        res.status(500).send(e.message);\n    }\n}));\n// DELETE cars/:id\n/**\n * @swagger\n *\n * /cars/{id}:\n *   delete:\n *     security:\n *       - bearerAuth: []\n *     tags:\n *       - Cars\n *     produces:\n *       - application/json\n *     parameters:\n *       - name: id\n *         in: path\n *         required: true\n *         type: number\n *     responses:\n *       200:\n *         description: Success\n */\nexports.carsRouter.delete(\"/:id\", Auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    try {\n        const id = parseInt(req.params.id, 10);\n        yield car_class_1.Car.destroy({\n            where: {\n                id: id\n            }\n        });\n        res.sendStatus(200);\n    }\n    catch (e) {\n        res.status(500).send(e.message);\n    }\n}));\n\n\n//# sourceURL=webpack:///./src/models/cars/cars.router.ts?");

/***/ }),

/***/ "./src/models/db.init.ts":
/*!*******************************!*\
  !*** ./src/models/db.init.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.databseDataInitialization = exports.databaseForeignJeyInitialization = exports.databaseTableInitialization = void 0;\nconst car_class_1 = __webpack_require__(/*! ./cars/car.class */ \"./src/models/cars/car.class.ts\");\nconst reservation_class_1 = __webpack_require__(/*! ./reservations/reservation.class */ \"./src/models/reservations/reservation.class.ts\");\nconst car_class_2 = __webpack_require__(/*! ./cars/car.class */ \"./src/models/cars/car.class.ts\");\nconst reservation_class_2 = __webpack_require__(/*! ./reservations/reservation.class */ \"./src/models/reservations/reservation.class.ts\");\nconst moment_1 = __importDefault(__webpack_require__(/*! moment */ \"moment\"));\nconst databaseTableInitialization = () => {\n    car_class_1.initialize.table();\n    reservation_class_1.initialize.table();\n};\nexports.databaseTableInitialization = databaseTableInitialization;\nconst databaseForeignJeyInitialization = () => {\n    car_class_1.initialize.fk();\n};\nexports.databaseForeignJeyInitialization = databaseForeignJeyInitialization;\nconst databseDataInitialization = () => __awaiter(void 0, void 0, void 0, function* () {\n    let instance = yield car_class_2.Car.create({\n        immat: \"BS-264-VV\",\n        name: \"Model S\",\n        brand: \"Tesla\",\n        description: \"Ca fume le bitume\",\n        dailyPrice: 120\n    });\n    yield reservation_class_2.Reservation.create({\n        carId: instance.getDataValue(\"id\"),\n        begin: moment_1.default.utc(\"12/12/2020\", \"DD/MM/YYYY\", \"Europe/Paris\").toDate(),\n        end: moment_1.default.utc(\"13/12/2020\", \"DD/MM/YYYY\", \"Europe/Paris\").toDate(),\n    });\n    yield reservation_class_2.Reservation.create({\n        carId: instance.getDataValue(\"id\"),\n        begin: moment_1.default.utc(\"14/12/2020\", \"DD/MM/YYYY\", \"Europe/Paris\").toDate(),\n        end: moment_1.default.utc(\"18/12/2020\", \"DD/MM/YYYY\", \"Europe/Paris\").toDate(),\n    });\n    yield reservation_class_2.Reservation.create({\n        carId: instance.getDataValue(\"id\"),\n        begin: moment_1.default.utc(\"19/12/2020\", \"DD/MM/YYYY\", \"Europe/Paris\").toDate(),\n        end: moment_1.default.utc(\"19/12/2020\", \"DD/MM/YYYY\", \"Europe/Paris\").toDate(),\n    });\n    instance = yield car_class_2.Car.create({\n        immat: \"BS-264-VV\",\n        name: \"Model 3\",\n        brand: \"Tesla\",\n        description: \"Ca fume le bitume un peu moins mais quand même pas trop mal.\",\n        dailyPrice: 220\n    });\n    yield reservation_class_2.Reservation.create({\n        carId: instance.getDataValue(\"id\"),\n        begin: moment_1.default.utc(\"12/12/2020\", \"DD/MM/YYYY\", \"Europe/Paris\").toDate(),\n        end: moment_1.default.utc(\"13/12/2020\", \"DD/MM/YYYY\", \"Europe/Paris\").toDate(),\n    });\n    yield reservation_class_2.Reservation.create({\n        carId: instance.getDataValue(\"id\"),\n        begin: moment_1.default.utc(\"14/12/2020\", \"DD/MM/YYYY\", \"Europe/Paris\").toDate(),\n        end: moment_1.default.utc(\"18/12/2020\", \"DD/MM/YYYY\", \"Europe/Paris\").toDate(),\n    });\n    yield reservation_class_2.Reservation.create({\n        carId: instance.getDataValue(\"id\"),\n        begin: moment_1.default.utc(\"19/12/2020\", \"DD/MM/YYYY\", \"Europe/Paris\").toDate(),\n        end: moment_1.default.utc(\"19/12/2020\", \"DD/MM/YYYY\", \"Europe/Paris\").toDate(),\n    });\n});\nexports.databseDataInitialization = databseDataInitialization;\n\n\n//# sourceURL=webpack:///./src/models/db.init.ts?");

/***/ }),

/***/ "./src/models/reservations/reservation.class.ts":
/*!******************************************************!*\
  !*** ./src/models/reservations/reservation.class.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.initialize = exports.Reservation = void 0;\nconst sequelize_1 = __webpack_require__(/*! sequelize */ \"sequelize\");\nconst mysql_config_1 = __webpack_require__(/*! ../../config/mysql.config */ \"./src/config/mysql.config.ts\");\nconst sequelize = mysql_config_1.db.instance;\nclass Reservation extends sequelize_1.Model {\n}\nexports.Reservation = Reservation;\nexports.initialize = {\n    table: () => {\n        Reservation.init({\n            id: {\n                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,\n                autoIncrement: true,\n                primaryKey: true,\n            },\n            carId: {\n                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,\n                allowNull: false,\n            },\n            begin: {\n                type: sequelize_1.DataTypes.DATE,\n                allowNull: false,\n            },\n            end: {\n                type: sequelize_1.DataTypes.DATE,\n                allowNull: false,\n            },\n        }, {\n            tableName: \"Reservation\",\n            sequelize: sequelize\n        });\n    }\n};\n\n\n//# sourceURL=webpack:///./src/models/reservations/reservation.class.ts?");

/***/ }),

/***/ "./src/models/reservations/reservations.router.ts":
/*!********************************************************!*\
  !*** ./src/models/reservations/reservations.router.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Required External Modules and Interfaces\n */\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.reservationsRouter = void 0;\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst reservation_class_1 = __webpack_require__(/*! ./reservation.class */ \"./src/models/reservations/reservation.class.ts\");\nconst moment_1 = __importDefault(__webpack_require__(/*! moment */ \"moment\"));\nconst Auth_1 = __importDefault(__webpack_require__(/*! ../../middleware/Auth */ \"./src/middleware/Auth.ts\"));\nconst isInConflict = (reservation) => __awaiter(void 0, void 0, void 0, function* () {\n    let isInConflict = false;\n    const reservations = yield reservation_class_1.Reservation.findAll({\n        where: {\n            carId: reservation.carId\n        }\n    });\n    reservations.forEach(element => {\n        if ((reservation.begin >= element.begin && reservation.begin <= element.end)\n            || (reservation.end <= element.end && reservation.end >= element.begin)\n            || (element.begin >= reservation.begin && element.end <= reservation.end)) {\n            isInConflict = true;\n        }\n    });\n    return isInConflict;\n});\n/**\n * Router Definition\n */\nexports.reservationsRouter = express_1.default.Router();\n/**\n * Controller Definitions\n */\n/**\n * @swagger\n *\n * definitions:\n *   NewReservation:\n *     type: object\n *     required:\n *       - carId\n *       - begin\n *       - end\n *     properties:\n *       carId:\n *         type: number\n *       begin:\n *         type: date\n *       end:\n *         type: date\n *   Reservation:\n *     allOf:\n *       - $ref: '#/definitions/NewReservation'\n *       - required:\n *         - id\n *       - properties:\n *         id:\n *           type: integer\n *           format: int64\n */\n/**\n * @swagger\n * /reservations:\n *   get:\n *     security:\n *       - bearerAuth: []\n *     description: Returns reservations\n *     produces:\n *      - application/json\n *     responses:\n *       200:\n *         description: reservations\n *         schema:\n *           type: array\n *           reservations:\n *             $ref: '#/definitions/Reservation'\n *     tags:\n *       - Reservation\n */\nexports.reservationsRouter.get(\"/\", Auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    try {\n        const reservations = yield reservation_class_1.Reservation.findAll();\n        let reservationsReturns = [];\n        reservationsReturns = reservations.map((element) => {\n            let elementReturned = {\n                id: element.id,\n                carId: element.carId,\n                begin: element.begin.getUTCDate() + \"/\" + (element.begin.getUTCMonth() + 1) + \"/\" + element.begin.getUTCFullYear(),\n                end: element.end.getUTCDate() + \"/\" + (element.begin.getUTCMonth() + 1) + \"/\" + element.end.getUTCFullYear()\n            };\n            return elementReturned;\n        });\n        res.status(200).send(reservationsReturns);\n    }\n    catch (e) {\n        res.status(500).send(e.message);\n    }\n}));\n/**\n * @swagger\n *\n * /reservations/{id}:\n *   get:\n *     security:\n *       - bearerAuth: []\n *     produces:\n *       - application/json\n *     parameters:\n *       - name: id\n *         in: path\n *         required: true\n *         type: number\n *     responses:\n *       200:\n *         description: reservation\n *         schema:\n *           type: reservation\n *           reservation:\n *             $ref: '#/definitions/Reservation'\n *     tags:\n *       - Reservation\n */\nexports.reservationsRouter.get(\"/:id\", Auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    const id = parseInt(req.params.id, 10);\n    try {\n        const reservation = yield reservation_class_1.Reservation.findOne({\n            where: {\n                id: id\n            }\n        });\n        if (reservation !== null && reservation !== undefined) {\n            const resReturn = {\n                id: reservation === null || reservation === void 0 ? void 0 : reservation.id,\n                carId: reservation === null || reservation === void 0 ? void 0 : reservation.carId,\n                begin: (reservation === null || reservation === void 0 ? void 0 : reservation.begin.getUTCDate()) + \"/\" + ((reservation === null || reservation === void 0 ? void 0 : reservation.begin.getUTCMonth()) + 1) + \"/\" + (reservation === null || reservation === void 0 ? void 0 : reservation.begin.getUTCFullYear()),\n                end: (reservation === null || reservation === void 0 ? void 0 : reservation.end.getUTCDate()) + \"/\" + ((reservation === null || reservation === void 0 ? void 0 : reservation.end.getUTCMonth()) + 1) + \"/\" + (reservation === null || reservation === void 0 ? void 0 : reservation.end.getUTCFullYear())\n            };\n            res.status(200).send(resReturn);\n        }\n        else {\n            res.status(404).send();\n        }\n    }\n    catch (e) {\n        res.status(500).send(e.message);\n    }\n}));\n/**\n * @swagger\n *\n * /reservations:\n *   post:\n *     security:\n *       - bearerAuth: []\n *     description: Creates a reservation\n *     requestBody:\n *       required: true\n *       content:\n *         application/json:\n *           schema:\n *             $ref: '#/definitions/NewReservation'\n *     responses:\n *       200:\n *         description: reservations\n *         schema:\n *           $ref: '#/definitions/Reservation'\n *     tags:\n *       - Reservation\n */\nexports.reservationsRouter.post(\"/\", Auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    try {\n        const reservation = req.body;\n        reservation.begin = moment_1.default.utc(reservation.begin, \"DD/MM/YYYY\", \"Europe/Paris\").toDate();\n        reservation.end = moment_1.default.utc(reservation.end, \"DD/MM/YYYY\", \"Europe/Paris\").toDate();\n        if (!(yield isInConflict(reservation))) {\n            yield reservation_class_1.Reservation.create(reservation);\n        }\n        else\n            throw new Error('Car is already reserved for this time.');\n        res.sendStatus(201);\n    }\n    catch (e) {\n        res.status(500).send(e.message);\n    }\n}));\n/**\n * @swagger\n *\n * /reservations/disponibility:\n *   post:\n *     security:\n *       - bearerAuth: []\n *     description: Test if you can create a reservation\n *     requestBody:\n *       required: true\n *       content:\n *         application/json:\n *           schema:\n *             $ref: '#/definitions/NewReservation'\n *     responses:\n *       200:\n *         description: reservations\n *         schema:\n *           $ref: '#/definitions/Reservation'\n *     tags:\n *       - Reservation\n */\nexports.reservationsRouter.post(\"/disponibility\", Auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    try {\n        const reservation = req.body;\n        reservation.begin = moment_1.default.utc(reservation.begin, \"DD/MM/YYYY\", \"Europe/Paris\").toDate();\n        reservation.end = moment_1.default.utc(reservation.end, \"DD/MM/YYYY\", \"Europe/Paris\").toDate();\n        let disponibility = !(yield isInConflict(reservation));\n        res.send({ disponibility: disponibility });\n    }\n    catch (e) {\n        res.status(500).send(e.message);\n    }\n}));\n/**\n * @swagger\n *\n * /reservations/{id}:\n *   put:\n *     security:\n *       - bearerAuth: []\n *     description: Update an existing reservation\n *     parameters:\n *       - name: id\n *         in: path\n *         required: true\n *         type: number\n *     requestBody:\n *       required: true\n *       content:\n *         application/json:\n *           schema:\n *             $ref: '#/definitions/NewReservation'\n *     responses:\n *       200:\n *         description: reservations\n *         schema:\n *           $ref: '#/definitions/Reservation'\n *     tags:\n *       - Reservation\n */\nexports.reservationsRouter.put(\"/:id\", Auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    try {\n        const id = parseInt(req.params.id, 10);\n        const reservation = req.body;\n        reservation.begin = moment_1.default.utc(reservation.begin, \"DD/MM/YYYY\", \"Europe/Paris\").toDate();\n        reservation.end = moment_1.default.utc(reservation.end, \"DD/MM/YYYY\", \"Europe/Paris\").toDate();\n        if (!(yield isInConflict(reservation))) {\n            yield reservation_class_1.Reservation.update(reservation, {\n                where: {\n                    id: reservation.id\n                }\n            });\n        }\n        else\n            throw new Error('Car is already reserved for this time.');\n        res.sendStatus(200);\n    }\n    catch (e) {\n        res.status(500).send(e.message);\n    }\n}));\n/**\n * @swagger\n *\n * /reservations/{id}:\n *   delete:\n *     security:\n *       - bearerAuth: []\n *     produces:\n *       - application/json\n *     parameters:\n *       - name: id\n *         in: path\n *         required: true\n *         type: number\n *     responses:\n *       200:\n *         description: Success\n *     tags:\n *       - Reservation\n */\nexports.reservationsRouter.delete(\"/:id\", Auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    try {\n        const id = parseInt(req.params.id, 10);\n        yield reservation_class_1.Reservation.destroy({\n            where: {\n                id: id\n            }\n        });\n        res.sendStatus(200);\n    }\n    catch (e) {\n        res.status(500).send(e.message);\n    }\n}));\n\n\n//# sourceURL=webpack:///./src/models/reservations/reservations.router.ts?");

/***/ }),

/***/ "./src/models/users/users.router.ts":
/*!******************************************!*\
  !*** ./src/models/users/users.router.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.usersRouter = void 0;\n/**\n * Required External Modules and Interfaces\n */\nvar jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\n/**\n * @swagger\n *\n * definitions:\n *   User:\n *     type: object\n *     required:\n *       - user\n *       - password\n *     properties:\n *       user:\n *         type: string\n *       password:\n *         type: string\n */\n/**\n * Router Definition\n */\nexports.usersRouter = express_1.default.Router();\n/**\n * @swagger\n * paths:\n *   /users/login:\n *     post:\n *       summary: Login to the api\n *       tags:\n *         - User\n *       requestBody:\n *         description: The credentials are admin/admin\n *         required: true\n *         content:\n *           application/json:\n *             schema:\n *               $ref: '#/definitions/User'\n *       responses:\n *         '201':\n *           description: Created\n */\nexports.usersRouter.post('/login', function (req, res) {\n    console.log('======================');\n    console.log(req.body);\n    console.log('======================');\n    if (req.body.user === \"admin\" && req.body.password === \"admin\") {\n        var token = jwt.sign({ id: 1 }, \"RANDOM_TOKEN_SECRET\", {\n            expiresIn: 86400\n        });\n        res.status(200).send({ auth: true, token: token });\n    }\n    else {\n        res.status(404).send({ auth: false, token: null });\n    }\n});\n\n\n//# sourceURL=webpack:///./src/models/users/users.router.ts?");

/***/ }),

/***/ 0:
/*!*************************************************!*\
  !*** multi webpack/hot/poll?100 ./src/index.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! webpack/hot/poll?100 */\"./node_modules/webpack/hot/poll.js?100\");\nmodule.exports = __webpack_require__(/*! ./src/index.ts */\"./src/index.ts\");\n\n\n//# sourceURL=webpack:///multi_webpack/hot/poll?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv\");\n\n//# sourceURL=webpack:///external_%22dotenv%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"helmet\");\n\n//# sourceURL=webpack:///external_%22helmet%22?");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jsonwebtoken\");\n\n//# sourceURL=webpack:///external_%22jsonwebtoken%22?");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"moment\");\n\n//# sourceURL=webpack:///external_%22moment%22?");

/***/ }),

/***/ "sequelize":
/*!****************************!*\
  !*** external "sequelize" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"sequelize\");\n\n//# sourceURL=webpack:///external_%22sequelize%22?");

/***/ }),

/***/ "swagger-jsdoc":
/*!********************************!*\
  !*** external "swagger-jsdoc" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"swagger-jsdoc\");\n\n//# sourceURL=webpack:///external_%22swagger-jsdoc%22?");

/***/ }),

/***/ "swagger-ui-express":
/*!*************************************!*\
  !*** external "swagger-ui-express" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"swagger-ui-express\");\n\n//# sourceURL=webpack:///external_%22swagger-ui-express%22?");

/***/ })

/******/ });