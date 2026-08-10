//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/platform/node/globalThis.js
/** only globals that common to node and browsers are allowed */
var _globalThis = typeof globalThis === "object" ? globalThis : global;

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/version.js
var VERSION = "1.9.0";

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/internal/semver.js
var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
/**
* Create a function to test an API version to see if it is compatible with the provided ownVersion.
*
* The returned function has the following semantics:
* - Exact match is always compatible
* - Major versions must match exactly
*    - 1.x package cannot use global 2.x package
*    - 2.x package cannot use global 1.x package
* - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
*    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
*    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
* - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
* - Patch and build tag differences are not considered at this time
*
* @param ownVersion version which should be checked against
*/
function _makeCompatibilityCheck(ownVersion) {
	var acceptedVersions = new Set([ownVersion]);
	var rejectedVersions = /* @__PURE__ */ new Set();
	var myVersionMatch = ownVersion.match(re);
	if (!myVersionMatch) return function() {
		return false;
	};
	var ownVersionParsed = {
		major: +myVersionMatch[1],
		minor: +myVersionMatch[2],
		patch: +myVersionMatch[3],
		prerelease: myVersionMatch[4]
	};
	if (ownVersionParsed.prerelease != null) return function isExactmatch(globalVersion) {
		return globalVersion === ownVersion;
	};
	function _reject(v) {
		rejectedVersions.add(v);
		return false;
	}
	function _accept(v) {
		acceptedVersions.add(v);
		return true;
	}
	return function isCompatible$1(globalVersion) {
		if (acceptedVersions.has(globalVersion)) return true;
		if (rejectedVersions.has(globalVersion)) return false;
		var globalVersionMatch = globalVersion.match(re);
		if (!globalVersionMatch) return _reject(globalVersion);
		var globalVersionParsed = {
			major: +globalVersionMatch[1],
			minor: +globalVersionMatch[2],
			patch: +globalVersionMatch[3],
			prerelease: globalVersionMatch[4]
		};
		if (globalVersionParsed.prerelease != null) return _reject(globalVersion);
		if (ownVersionParsed.major !== globalVersionParsed.major) return _reject(globalVersion);
		if (ownVersionParsed.major === 0) {
			if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) return _accept(globalVersion);
			return _reject(globalVersion);
		}
		if (ownVersionParsed.minor <= globalVersionParsed.minor) return _accept(globalVersion);
		return _reject(globalVersion);
	};
}
/**
* Test an API version to see if it is compatible with this API.
*
* - Exact match is always compatible
* - Major versions must match exactly
*    - 1.x package cannot use global 2.x package
*    - 2.x package cannot use global 1.x package
* - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
*    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
*    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
* - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
* - Patch and build tag differences are not considered at this time
*
* @param version version of the API requesting an instance of the global API
*/
var isCompatible = _makeCompatibilityCheck(VERSION);

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/internal/global-utils.js
var major = VERSION.split(".")[0];
var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for("opentelemetry.js.api." + major);
var _global = _globalThis;
function registerGlobal(type, instance, diag$2, allowOverride) {
	var _a;
	if (allowOverride === void 0) allowOverride = false;
	var api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : { version: VERSION };
	if (!allowOverride && api[type]) {
		var err = /* @__PURE__ */ new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type);
		diag$2.error(err.stack || err.message);
		return false;
	}
	if (api.version !== VERSION) {
		var err = /* @__PURE__ */ new Error("@opentelemetry/api: Registration of version v" + api.version + " for " + type + " does not match previously registered API v" + VERSION);
		diag$2.error(err.stack || err.message);
		return false;
	}
	api[type] = instance;
	diag$2.debug("@opentelemetry/api: Registered a global for " + type + " v" + VERSION + ".");
	return true;
}
function getGlobal(type) {
	var _a, _b;
	var globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
	if (!globalVersion || !isCompatible(globalVersion)) return;
	return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
}
function unregisterGlobal(type, diag$2) {
	diag$2.debug("@opentelemetry/api: Unregistering a global for " + type + " v" + VERSION + ".");
	var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
	if (api) delete api[type];
}

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js
var __read$4 = void 0 && (void 0).__read || function(o, n) {
	var m = typeof Symbol === "function" && o[Symbol.iterator];
	if (!m) return o;
	var i = m.call(o), r, ar = [], e;
	try {
		while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	} catch (error) {
		e = { error };
	} finally {
		try {
			if (r && !r.done && (m = i["return"])) m.call(i);
		} finally {
			if (e) throw e.error;
		}
	}
	return ar;
};
var __spreadArray$3 = void 0 && (void 0).__spreadArray || function(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
};
/**
* Component Logger which is meant to be used as part of any component which
* will add automatically additional namespace in front of the log message.
* It will then forward all message to global diag logger
* @example
* const cLogger = diag.createComponentLogger({ namespace: '@opentelemetry/instrumentation-http' });
* cLogger.debug('test');
* // @opentelemetry/instrumentation-http test
*/
var DiagComponentLogger = function() {
	function DiagComponentLogger$1(props) {
		this._namespace = props.namespace || "DiagComponentLogger";
	}
	DiagComponentLogger$1.prototype.debug = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		return logProxy("debug", this._namespace, args);
	};
	DiagComponentLogger$1.prototype.error = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		return logProxy("error", this._namespace, args);
	};
	DiagComponentLogger$1.prototype.info = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		return logProxy("info", this._namespace, args);
	};
	DiagComponentLogger$1.prototype.warn = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		return logProxy("warn", this._namespace, args);
	};
	DiagComponentLogger$1.prototype.verbose = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		return logProxy("verbose", this._namespace, args);
	};
	return DiagComponentLogger$1;
}();
function logProxy(funcName, namespace, args) {
	var logger = getGlobal("diag");
	if (!logger) return;
	args.unshift(namespace);
	return logger[funcName].apply(logger, __spreadArray$3([], __read$4(args), false));
}

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/diag/types.js
/**
* Defines the available internal logging levels for the diagnostic logger, the numeric values
* of the levels are defined to match the original values from the initial LogLevel to avoid
* compatibility/migration issues for any implementation that assume the numeric ordering.
*/
var DiagLogLevel;
(function(DiagLogLevel$1) {
	/** Diagnostic Logging level setting to disable all logging (except and forced logs) */
	DiagLogLevel$1[DiagLogLevel$1["NONE"] = 0] = "NONE";
	/** Identifies an error scenario */
	DiagLogLevel$1[DiagLogLevel$1["ERROR"] = 30] = "ERROR";
	/** Identifies a warning scenario */
	DiagLogLevel$1[DiagLogLevel$1["WARN"] = 50] = "WARN";
	/** General informational log message */
	DiagLogLevel$1[DiagLogLevel$1["INFO"] = 60] = "INFO";
	/** General debug log message */
	DiagLogLevel$1[DiagLogLevel$1["DEBUG"] = 70] = "DEBUG";
	/**
	* Detailed trace level logging should only be used for development, should only be set
	* in a development environment.
	*/
	DiagLogLevel$1[DiagLogLevel$1["VERBOSE"] = 80] = "VERBOSE";
	/** Used to set the logging level to include all logging */
	DiagLogLevel$1[DiagLogLevel$1["ALL"] = 9999] = "ALL";
})(DiagLogLevel || (DiagLogLevel = {}));

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js
function createLogLevelDiagLogger(maxLevel, logger) {
	if (maxLevel < DiagLogLevel.NONE) maxLevel = DiagLogLevel.NONE;
	else if (maxLevel > DiagLogLevel.ALL) maxLevel = DiagLogLevel.ALL;
	logger = logger || {};
	function _filterFunc(funcName, theLevel) {
		var theFunc = logger[funcName];
		if (typeof theFunc === "function" && maxLevel >= theLevel) return theFunc.bind(logger);
		return function() {};
	}
	return {
		error: _filterFunc("error", DiagLogLevel.ERROR),
		warn: _filterFunc("warn", DiagLogLevel.WARN),
		info: _filterFunc("info", DiagLogLevel.INFO),
		debug: _filterFunc("debug", DiagLogLevel.DEBUG),
		verbose: _filterFunc("verbose", DiagLogLevel.VERBOSE)
	};
}

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/api/diag.js
var __read$3 = void 0 && (void 0).__read || function(o, n) {
	var m = typeof Symbol === "function" && o[Symbol.iterator];
	if (!m) return o;
	var i = m.call(o), r, ar = [], e;
	try {
		while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	} catch (error) {
		e = { error };
	} finally {
		try {
			if (r && !r.done && (m = i["return"])) m.call(i);
		} finally {
			if (e) throw e.error;
		}
	}
	return ar;
};
var __spreadArray$2 = void 0 && (void 0).__spreadArray || function(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
};
var API_NAME$4 = "diag";
/**
* Singleton object which represents the entry point to the OpenTelemetry internal
* diagnostic API
*/
var DiagAPI = function() {
	/**
	* Private internal constructor
	* @private
	*/
	function DiagAPI$1() {
		function _logProxy(funcName) {
			return function() {
				var args = [];
				for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
				var logger = getGlobal("diag");
				if (!logger) return;
				return logger[funcName].apply(logger, __spreadArray$2([], __read$3(args), false));
			};
		}
		var self = this;
		var setLogger = function(logger, optionsOrLogLevel) {
			var _a, _b, _c;
			if (optionsOrLogLevel === void 0) optionsOrLogLevel = { logLevel: DiagLogLevel.INFO };
			if (logger === self) {
				var err = /* @__PURE__ */ new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
				self.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
				return false;
			}
			if (typeof optionsOrLogLevel === "number") optionsOrLogLevel = { logLevel: optionsOrLogLevel };
			var oldLogger = getGlobal("diag");
			var newLogger = createLogLevelDiagLogger((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : DiagLogLevel.INFO, logger);
			if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
				var stack = (_c = (/* @__PURE__ */ new Error()).stack) !== null && _c !== void 0 ? _c : "<failed to generate stacktrace>";
				oldLogger.warn("Current logger will be overwritten from " + stack);
				newLogger.warn("Current logger will overwrite one already registered from " + stack);
			}
			return registerGlobal("diag", newLogger, self, true);
		};
		self.setLogger = setLogger;
		self.disable = function() {
			unregisterGlobal(API_NAME$4, self);
		};
		self.createComponentLogger = function(options) {
			return new DiagComponentLogger(options);
		};
		self.verbose = _logProxy("verbose");
		self.debug = _logProxy("debug");
		self.info = _logProxy("info");
		self.warn = _logProxy("warn");
		self.error = _logProxy("error");
	}
	/** Get the singleton instance of the DiagAPI API */
	DiagAPI$1.instance = function() {
		if (!this._instance) this._instance = new DiagAPI$1();
		return this._instance;
	};
	return DiagAPI$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/baggage/internal/baggage-impl.js
var __read$2 = void 0 && (void 0).__read || function(o, n) {
	var m = typeof Symbol === "function" && o[Symbol.iterator];
	if (!m) return o;
	var i = m.call(o), r, ar = [], e;
	try {
		while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	} catch (error) {
		e = { error };
	} finally {
		try {
			if (r && !r.done && (m = i["return"])) m.call(i);
		} finally {
			if (e) throw e.error;
		}
	}
	return ar;
};
var __values = void 0 && (void 0).__values || function(o) {
	var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	if (m) return m.call(o);
	if (o && typeof o.length === "number") return { next: function() {
		if (o && i >= o.length) o = void 0;
		return {
			value: o && o[i++],
			done: !o
		};
	} };
	throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var BaggageImpl = function() {
	function BaggageImpl$1(entries) {
		this._entries = entries ? new Map(entries) : /* @__PURE__ */ new Map();
	}
	BaggageImpl$1.prototype.getEntry = function(key) {
		var entry = this._entries.get(key);
		if (!entry) return;
		return Object.assign({}, entry);
	};
	BaggageImpl$1.prototype.getAllEntries = function() {
		return Array.from(this._entries.entries()).map(function(_a) {
			var _b = __read$2(_a, 2);
			return [_b[0], _b[1]];
		});
	};
	BaggageImpl$1.prototype.setEntry = function(key, entry) {
		var newBaggage = new BaggageImpl$1(this._entries);
		newBaggage._entries.set(key, entry);
		return newBaggage;
	};
	BaggageImpl$1.prototype.removeEntry = function(key) {
		var newBaggage = new BaggageImpl$1(this._entries);
		newBaggage._entries.delete(key);
		return newBaggage;
	};
	BaggageImpl$1.prototype.removeEntries = function() {
		var e_1, _a;
		var keys = [];
		for (var _i = 0; _i < arguments.length; _i++) keys[_i] = arguments[_i];
		var newBaggage = new BaggageImpl$1(this._entries);
		try {
			for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
				var key = keys_1_1.value;
				newBaggage._entries.delete(key);
			}
		} catch (e_1_1) {
			e_1 = { error: e_1_1 };
		} finally {
			try {
				if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
			} finally {
				if (e_1) throw e_1.error;
			}
		}
		return newBaggage;
	};
	BaggageImpl$1.prototype.clear = function() {
		return new BaggageImpl$1();
	};
	return BaggageImpl$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/baggage/internal/symbol.js
/**
* Symbol used to make BaggageEntryMetadata an opaque type
*/
var baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/baggage/utils.js
var diag$1 = DiagAPI.instance();
/**
* Create a new Baggage with optional entries
*
* @param entries An array of baggage entries the new baggage should contain
*/
function createBaggage(entries) {
	if (entries === void 0) entries = {};
	return new BaggageImpl(new Map(Object.entries(entries)));
}
/**
* Create a serializable BaggageEntryMetadata object from a string.
*
* @param str string metadata. Format is currently not defined by the spec and has no special meaning.
*
*/
function baggageEntryMetadataFromString(str) {
	if (typeof str !== "string") {
		diag$1.error("Cannot create baggage metadata from unknown type: " + typeof str);
		str = "";
	}
	return {
		__TYPE__: baggageEntryMetadataSymbol,
		toString: function() {
			return str;
		}
	};
}

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/context/context.js
/** Get a key to uniquely identify a context value */
function createContextKey(description) {
	return Symbol.for(description);
}
var BaseContext = function() {
	/**
	* Construct a new context which inherits values from an optional parent context.
	*
	* @param parentContext a context from which to inherit values
	*/
	function BaseContext$1(parentContext) {
		var self = this;
		self._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map();
		self.getValue = function(key) {
			return self._currentContext.get(key);
		};
		self.setValue = function(key, value) {
			var context$1 = new BaseContext$1(self._currentContext);
			context$1._currentContext.set(key, value);
			return context$1;
		};
		self.deleteValue = function(key) {
			var context$1 = new BaseContext$1(self._currentContext);
			context$1._currentContext.delete(key);
			return context$1;
		};
	}
	return BaseContext$1;
}();
/** The root context is used as the default parent context when there is no active context */
var ROOT_CONTEXT = new BaseContext();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/diag/consoleLogger.js
var consoleMap = [
	{
		n: "error",
		c: "error"
	},
	{
		n: "warn",
		c: "warn"
	},
	{
		n: "info",
		c: "info"
	},
	{
		n: "debug",
		c: "debug"
	},
	{
		n: "verbose",
		c: "trace"
	}
];
/**
* A simple Immutable Console based diagnostic logger which will output any messages to the Console.
* If you want to limit the amount of logging to a specific level or lower use the
* {@link createLogLevelDiagLogger}
*/
var DiagConsoleLogger = function() {
	function DiagConsoleLogger$1() {
		function _consoleFunc(funcName) {
			return function() {
				var args = [];
				for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
				if (console) {
					var theFunc = console[funcName];
					if (typeof theFunc !== "function") theFunc = console.log;
					if (typeof theFunc === "function") return theFunc.apply(console, args);
				}
			};
		}
		for (var i = 0; i < consoleMap.length; i++) this[consoleMap[i].n] = _consoleFunc(consoleMap[i].c);
	}
	return DiagConsoleLogger$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/metrics/NoopMeter.js
var __extends = void 0 && (void 0).__extends || (function() {
	var extendStatics = function(d, b) {
		extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
			d$1.__proto__ = b$1;
		} || function(d$1, b$1) {
			for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
		};
		return extendStatics(d, b);
	};
	return function(d, b) {
		if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
		extendStatics(d, b);
		function __() {
			this.constructor = d;
		}
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
})();
/**
* NoopMeter is a noop implementation of the {@link Meter} interface. It reuses
* constant NoopMetrics for all of its methods.
*/
var NoopMeter = function() {
	function NoopMeter$1() {}
	/**
	* @see {@link Meter.createGauge}
	*/
	NoopMeter$1.prototype.createGauge = function(_name, _options) {
		return NOOP_GAUGE_METRIC;
	};
	/**
	* @see {@link Meter.createHistogram}
	*/
	NoopMeter$1.prototype.createHistogram = function(_name, _options) {
		return NOOP_HISTOGRAM_METRIC;
	};
	/**
	* @see {@link Meter.createCounter}
	*/
	NoopMeter$1.prototype.createCounter = function(_name, _options) {
		return NOOP_COUNTER_METRIC;
	};
	/**
	* @see {@link Meter.createUpDownCounter}
	*/
	NoopMeter$1.prototype.createUpDownCounter = function(_name, _options) {
		return NOOP_UP_DOWN_COUNTER_METRIC;
	};
	/**
	* @see {@link Meter.createObservableGauge}
	*/
	NoopMeter$1.prototype.createObservableGauge = function(_name, _options) {
		return NOOP_OBSERVABLE_GAUGE_METRIC;
	};
	/**
	* @see {@link Meter.createObservableCounter}
	*/
	NoopMeter$1.prototype.createObservableCounter = function(_name, _options) {
		return NOOP_OBSERVABLE_COUNTER_METRIC;
	};
	/**
	* @see {@link Meter.createObservableUpDownCounter}
	*/
	NoopMeter$1.prototype.createObservableUpDownCounter = function(_name, _options) {
		return NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
	};
	/**
	* @see {@link Meter.addBatchObservableCallback}
	*/
	NoopMeter$1.prototype.addBatchObservableCallback = function(_callback, _observables) {};
	/**
	* @see {@link Meter.removeBatchObservableCallback}
	*/
	NoopMeter$1.prototype.removeBatchObservableCallback = function(_callback) {};
	return NoopMeter$1;
}();
var NoopMetric = function() {
	function NoopMetric$1() {}
	return NoopMetric$1;
}();
var NoopCounterMetric = function(_super) {
	__extends(NoopCounterMetric$1, _super);
	function NoopCounterMetric$1() {
		return _super !== null && _super.apply(this, arguments) || this;
	}
	NoopCounterMetric$1.prototype.add = function(_value, _attributes) {};
	return NoopCounterMetric$1;
}(NoopMetric);
var NoopUpDownCounterMetric = function(_super) {
	__extends(NoopUpDownCounterMetric$1, _super);
	function NoopUpDownCounterMetric$1() {
		return _super !== null && _super.apply(this, arguments) || this;
	}
	NoopUpDownCounterMetric$1.prototype.add = function(_value, _attributes) {};
	return NoopUpDownCounterMetric$1;
}(NoopMetric);
var NoopGaugeMetric = function(_super) {
	__extends(NoopGaugeMetric$1, _super);
	function NoopGaugeMetric$1() {
		return _super !== null && _super.apply(this, arguments) || this;
	}
	NoopGaugeMetric$1.prototype.record = function(_value, _attributes) {};
	return NoopGaugeMetric$1;
}(NoopMetric);
var NoopHistogramMetric = function(_super) {
	__extends(NoopHistogramMetric$1, _super);
	function NoopHistogramMetric$1() {
		return _super !== null && _super.apply(this, arguments) || this;
	}
	NoopHistogramMetric$1.prototype.record = function(_value, _attributes) {};
	return NoopHistogramMetric$1;
}(NoopMetric);
var NoopObservableMetric = function() {
	function NoopObservableMetric$1() {}
	NoopObservableMetric$1.prototype.addCallback = function(_callback) {};
	NoopObservableMetric$1.prototype.removeCallback = function(_callback) {};
	return NoopObservableMetric$1;
}();
var NoopObservableCounterMetric = function(_super) {
	__extends(NoopObservableCounterMetric$1, _super);
	function NoopObservableCounterMetric$1() {
		return _super !== null && _super.apply(this, arguments) || this;
	}
	return NoopObservableCounterMetric$1;
}(NoopObservableMetric);
var NoopObservableGaugeMetric = function(_super) {
	__extends(NoopObservableGaugeMetric$1, _super);
	function NoopObservableGaugeMetric$1() {
		return _super !== null && _super.apply(this, arguments) || this;
	}
	return NoopObservableGaugeMetric$1;
}(NoopObservableMetric);
var NoopObservableUpDownCounterMetric = function(_super) {
	__extends(NoopObservableUpDownCounterMetric$1, _super);
	function NoopObservableUpDownCounterMetric$1() {
		return _super !== null && _super.apply(this, arguments) || this;
	}
	return NoopObservableUpDownCounterMetric$1;
}(NoopObservableMetric);
var NOOP_METER = new NoopMeter();
var NOOP_COUNTER_METRIC = new NoopCounterMetric();
var NOOP_GAUGE_METRIC = new NoopGaugeMetric();
var NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric();
var NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric();
var NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric();
var NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric();
var NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric();
/**
* Create a no-op Meter
*/
function createNoopMeter() {
	return NOOP_METER;
}

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/metrics/Metric.js
/** The Type of value. It describes how the data is reported. */
var ValueType;
(function(ValueType$1) {
	ValueType$1[ValueType$1["INT"] = 0] = "INT";
	ValueType$1[ValueType$1["DOUBLE"] = 1] = "DOUBLE";
})(ValueType || (ValueType = {}));

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/propagation/TextMapPropagator.js
var defaultTextMapGetter = {
	get: function(carrier, key) {
		if (carrier == null) return;
		return carrier[key];
	},
	keys: function(carrier) {
		if (carrier == null) return [];
		return Object.keys(carrier);
	}
};
var defaultTextMapSetter = { set: function(carrier, key, value) {
	if (carrier == null) return;
	carrier[key] = value;
} };

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/context/NoopContextManager.js
var __read$1 = void 0 && (void 0).__read || function(o, n) {
	var m = typeof Symbol === "function" && o[Symbol.iterator];
	if (!m) return o;
	var i = m.call(o), r, ar = [], e;
	try {
		while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	} catch (error) {
		e = { error };
	} finally {
		try {
			if (r && !r.done && (m = i["return"])) m.call(i);
		} finally {
			if (e) throw e.error;
		}
	}
	return ar;
};
var __spreadArray$1 = void 0 && (void 0).__spreadArray || function(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
};
var NoopContextManager = function() {
	function NoopContextManager$1() {}
	NoopContextManager$1.prototype.active = function() {
		return ROOT_CONTEXT;
	};
	NoopContextManager$1.prototype.with = function(_context, fn, thisArg) {
		var args = [];
		for (var _i = 3; _i < arguments.length; _i++) args[_i - 3] = arguments[_i];
		return fn.call.apply(fn, __spreadArray$1([thisArg], __read$1(args), false));
	};
	NoopContextManager$1.prototype.bind = function(_context, target) {
		return target;
	};
	NoopContextManager$1.prototype.enable = function() {
		return this;
	};
	NoopContextManager$1.prototype.disable = function() {
		return this;
	};
	return NoopContextManager$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/api/context.js
var __read = void 0 && (void 0).__read || function(o, n) {
	var m = typeof Symbol === "function" && o[Symbol.iterator];
	if (!m) return o;
	var i = m.call(o), r, ar = [], e;
	try {
		while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	} catch (error) {
		e = { error };
	} finally {
		try {
			if (r && !r.done && (m = i["return"])) m.call(i);
		} finally {
			if (e) throw e.error;
		}
	}
	return ar;
};
var __spreadArray = void 0 && (void 0).__spreadArray || function(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
};
var API_NAME$3 = "context";
var NOOP_CONTEXT_MANAGER = new NoopContextManager();
/**
* Singleton object which represents the entry point to the OpenTelemetry Context API
*/
var ContextAPI = function() {
	/** Empty private constructor prevents end users from constructing a new instance of the API */
	function ContextAPI$1() {}
	/** Get the singleton instance of the Context API */
	ContextAPI$1.getInstance = function() {
		if (!this._instance) this._instance = new ContextAPI$1();
		return this._instance;
	};
	/**
	* Set the current context manager.
	*
	* @returns true if the context manager was successfully registered, else false
	*/
	ContextAPI$1.prototype.setGlobalContextManager = function(contextManager) {
		return registerGlobal(API_NAME$3, contextManager, DiagAPI.instance());
	};
	/**
	* Get the currently active context
	*/
	ContextAPI$1.prototype.active = function() {
		return this._getContextManager().active();
	};
	/**
	* Execute a function with an active context
	*
	* @param context context to be active during function execution
	* @param fn function to execute in a context
	* @param thisArg optional receiver to be used for calling fn
	* @param args optional arguments forwarded to fn
	*/
	ContextAPI$1.prototype.with = function(context$1, fn, thisArg) {
		var _a;
		var args = [];
		for (var _i = 3; _i < arguments.length; _i++) args[_i - 3] = arguments[_i];
		return (_a = this._getContextManager()).with.apply(_a, __spreadArray([
			context$1,
			fn,
			thisArg
		], __read(args), false));
	};
	/**
	* Bind a context to a target function or event emitter
	*
	* @param context context to bind to the event emitter or function. Defaults to the currently active context
	* @param target function or event emitter to bind
	*/
	ContextAPI$1.prototype.bind = function(context$1, target) {
		return this._getContextManager().bind(context$1, target);
	};
	ContextAPI$1.prototype._getContextManager = function() {
		return getGlobal(API_NAME$3) || NOOP_CONTEXT_MANAGER;
	};
	/** Disable and remove the global context manager */
	ContextAPI$1.prototype.disable = function() {
		this._getContextManager().disable();
		unregisterGlobal(API_NAME$3, DiagAPI.instance());
	};
	return ContextAPI$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js
var TraceFlags;
(function(TraceFlags$1) {
	/** Represents no flag set. */
	TraceFlags$1[TraceFlags$1["NONE"] = 0] = "NONE";
	/** Bit to represent whether trace is sampled in trace flags. */
	TraceFlags$1[TraceFlags$1["SAMPLED"] = 1] = "SAMPLED";
})(TraceFlags || (TraceFlags = {}));

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/invalid-span-constants.js
var INVALID_SPANID = "0000000000000000";
var INVALID_TRACEID = "00000000000000000000000000000000";
var INVALID_SPAN_CONTEXT = {
	traceId: INVALID_TRACEID,
	spanId: INVALID_SPANID,
	traceFlags: TraceFlags.NONE
};

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/NonRecordingSpan.js
/**
* The NonRecordingSpan is the default {@link Span} that is used when no Span
* implementation is available. All operations are no-op including context
* propagation.
*/
var NonRecordingSpan = function() {
	function NonRecordingSpan$1(_spanContext) {
		if (_spanContext === void 0) _spanContext = INVALID_SPAN_CONTEXT;
		this._spanContext = _spanContext;
	}
	NonRecordingSpan$1.prototype.spanContext = function() {
		return this._spanContext;
	};
	NonRecordingSpan$1.prototype.setAttribute = function(_key, _value) {
		return this;
	};
	NonRecordingSpan$1.prototype.setAttributes = function(_attributes) {
		return this;
	};
	NonRecordingSpan$1.prototype.addEvent = function(_name, _attributes) {
		return this;
	};
	NonRecordingSpan$1.prototype.addLink = function(_link) {
		return this;
	};
	NonRecordingSpan$1.prototype.addLinks = function(_links) {
		return this;
	};
	NonRecordingSpan$1.prototype.setStatus = function(_status) {
		return this;
	};
	NonRecordingSpan$1.prototype.updateName = function(_name) {
		return this;
	};
	NonRecordingSpan$1.prototype.end = function(_endTime) {};
	NonRecordingSpan$1.prototype.isRecording = function() {
		return false;
	};
	NonRecordingSpan$1.prototype.recordException = function(_exception, _time) {};
	return NonRecordingSpan$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/context-utils.js
/**
* span key
*/
var SPAN_KEY = createContextKey("OpenTelemetry Context Key SPAN");
/**
* Return the span if one exists
*
* @param context context to get span from
*/
function getSpan(context$1) {
	return context$1.getValue(SPAN_KEY) || void 0;
}
/**
* Gets the span from the current context, if one exists.
*/
function getActiveSpan() {
	return getSpan(ContextAPI.getInstance().active());
}
/**
* Set the span on a context
*
* @param context context to use as parent
* @param span span to set active
*/
function setSpan(context$1, span) {
	return context$1.setValue(SPAN_KEY, span);
}
/**
* Remove current span stored in the context
*
* @param context context to delete span from
*/
function deleteSpan(context$1) {
	return context$1.deleteValue(SPAN_KEY);
}
/**
* Wrap span context in a NoopSpan and set as span in a new
* context
*
* @param context context to set active span on
* @param spanContext span context to be wrapped
*/
function setSpanContext(context$1, spanContext) {
	return setSpan(context$1, new NonRecordingSpan(spanContext));
}
/**
* Get the span context of the span if it exists.
*
* @param context context to get values from
*/
function getSpanContext(context$1) {
	var _a;
	return (_a = getSpan(context$1)) === null || _a === void 0 ? void 0 : _a.spanContext();
}

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js
var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
function isValidTraceId(traceId) {
	return VALID_TRACEID_REGEX.test(traceId) && traceId !== INVALID_TRACEID;
}
function isValidSpanId(spanId) {
	return VALID_SPANID_REGEX.test(spanId) && spanId !== INVALID_SPANID;
}
/**
* Returns true if this {@link SpanContext} is valid.
* @return true if this {@link SpanContext} is valid.
*/
function isSpanContextValid(spanContext) {
	return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
}
/**
* Wrap the given {@link SpanContext} in a new non-recording {@link Span}
*
* @param spanContext span context to be wrapped
* @returns a new non-recording {@link Span} with the provided context
*/
function wrapSpanContext(spanContext) {
	return new NonRecordingSpan(spanContext);
}

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/NoopTracer.js
var contextApi = ContextAPI.getInstance();
/**
* No-op implementations of {@link Tracer}.
*/
var NoopTracer = function() {
	function NoopTracer$1() {}
	NoopTracer$1.prototype.startSpan = function(name, options, context$1) {
		if (context$1 === void 0) context$1 = contextApi.active();
		if (Boolean(options === null || options === void 0 ? void 0 : options.root)) return new NonRecordingSpan();
		var parentFromContext = context$1 && getSpanContext(context$1);
		if (isSpanContext(parentFromContext) && isSpanContextValid(parentFromContext)) return new NonRecordingSpan(parentFromContext);
		else return new NonRecordingSpan();
	};
	NoopTracer$1.prototype.startActiveSpan = function(name, arg2, arg3, arg4) {
		var opts;
		var ctx;
		var fn;
		if (arguments.length < 2) return;
		else if (arguments.length === 2) fn = arg2;
		else if (arguments.length === 3) {
			opts = arg2;
			fn = arg3;
		} else {
			opts = arg2;
			ctx = arg3;
			fn = arg4;
		}
		var parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
		var span = this.startSpan(name, opts, parentContext);
		var contextWithSpanSet = setSpan(parentContext, span);
		return contextApi.with(contextWithSpanSet, fn, void 0, span);
	};
	return NoopTracer$1;
}();
function isSpanContext(spanContext) {
	return typeof spanContext === "object" && typeof spanContext["spanId"] === "string" && typeof spanContext["traceId"] === "string" && typeof spanContext["traceFlags"] === "number";
}

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/ProxyTracer.js
var NOOP_TRACER = new NoopTracer();
/**
* Proxy tracer provided by the proxy tracer provider
*/
var ProxyTracer = function() {
	function ProxyTracer$1(_provider, name, version, options) {
		this._provider = _provider;
		this.name = name;
		this.version = version;
		this.options = options;
	}
	ProxyTracer$1.prototype.startSpan = function(name, options, context$1) {
		return this._getTracer().startSpan(name, options, context$1);
	};
	ProxyTracer$1.prototype.startActiveSpan = function(_name, _options, _context, _fn) {
		var tracer = this._getTracer();
		return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
	};
	/**
	* Try to get a tracer from the proxy tracer provider.
	* If the proxy tracer provider has no delegate, return a noop tracer.
	*/
	ProxyTracer$1.prototype._getTracer = function() {
		if (this._delegate) return this._delegate;
		var tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
		if (!tracer) return NOOP_TRACER;
		this._delegate = tracer;
		return this._delegate;
	};
	return ProxyTracer$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/NoopTracerProvider.js
/**
* An implementation of the {@link TracerProvider} which returns an impotent
* Tracer for all calls to `getTracer`.
*
* All operations are no-op.
*/
var NoopTracerProvider = function() {
	function NoopTracerProvider$1() {}
	NoopTracerProvider$1.prototype.getTracer = function(_name, _version, _options) {
		return new NoopTracer();
	};
	return NoopTracerProvider$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/ProxyTracerProvider.js
var NOOP_TRACER_PROVIDER = new NoopTracerProvider();
/**
* Tracer provider which provides {@link ProxyTracer}s.
*
* Before a delegate is set, tracers provided are NoOp.
*   When a delegate is set, traces are provided from the delegate.
*   When a delegate is set after tracers have already been provided,
*   all tracers already provided will use the provided delegate implementation.
*/
var ProxyTracerProvider = function() {
	function ProxyTracerProvider$1() {}
	/**
	* Get a {@link ProxyTracer}
	*/
	ProxyTracerProvider$1.prototype.getTracer = function(name, version, options) {
		var _a;
		return (_a = this.getDelegateTracer(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyTracer(this, name, version, options);
	};
	ProxyTracerProvider$1.prototype.getDelegate = function() {
		var _a;
		return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
	};
	/**
	* Set the delegate tracer provider
	*/
	ProxyTracerProvider$1.prototype.setDelegate = function(delegate) {
		this._delegate = delegate;
	};
	ProxyTracerProvider$1.prototype.getDelegateTracer = function(name, version, options) {
		var _a;
		return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version, options);
	};
	return ProxyTracerProvider$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/SamplingResult.js
/**
* @deprecated use the one declared in @opentelemetry/sdk-trace-base instead.
* A sampling decision that determines how a {@link Span} will be recorded
* and collected.
*/
var SamplingDecision;
(function(SamplingDecision$1) {
	/**
	* `Span.isRecording() === false`, span will not be recorded and all events
	* and attributes will be dropped.
	*/
	SamplingDecision$1[SamplingDecision$1["NOT_RECORD"] = 0] = "NOT_RECORD";
	/**
	* `Span.isRecording() === true`, but `Sampled` flag in {@link TraceFlags}
	* MUST NOT be set.
	*/
	SamplingDecision$1[SamplingDecision$1["RECORD"] = 1] = "RECORD";
	/**
	* `Span.isRecording() === true` AND `Sampled` flag in {@link TraceFlags}
	* MUST be set.
	*/
	SamplingDecision$1[SamplingDecision$1["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
})(SamplingDecision || (SamplingDecision = {}));

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/span_kind.js
var SpanKind;
(function(SpanKind$1) {
	/** Default value. Indicates that the span is used internally. */
	SpanKind$1[SpanKind$1["INTERNAL"] = 0] = "INTERNAL";
	/**
	* Indicates that the span covers server-side handling of an RPC or other
	* remote request.
	*/
	SpanKind$1[SpanKind$1["SERVER"] = 1] = "SERVER";
	/**
	* Indicates that the span covers the client-side wrapper around an RPC or
	* other remote request.
	*/
	SpanKind$1[SpanKind$1["CLIENT"] = 2] = "CLIENT";
	/**
	* Indicates that the span describes producer sending a message to a
	* broker. Unlike client and server, there is no direct critical path latency
	* relationship between producer and consumer spans.
	*/
	SpanKind$1[SpanKind$1["PRODUCER"] = 3] = "PRODUCER";
	/**
	* Indicates that the span describes consumer receiving a message from a
	* broker. Unlike client and server, there is no direct critical path latency
	* relationship between producer and consumer spans.
	*/
	SpanKind$1[SpanKind$1["CONSUMER"] = 4] = "CONSUMER";
})(SpanKind || (SpanKind = {}));

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/status.js
/**
* An enumeration of status codes.
*/
var SpanStatusCode;
(function(SpanStatusCode$1) {
	/**
	* The default status.
	*/
	SpanStatusCode$1[SpanStatusCode$1["UNSET"] = 0] = "UNSET";
	/**
	* The operation has been validated by an Application developer or
	* Operator to have completed successfully.
	*/
	SpanStatusCode$1[SpanStatusCode$1["OK"] = 1] = "OK";
	/**
	* The operation contains an error.
	*/
	SpanStatusCode$1[SpanStatusCode$1["ERROR"] = 2] = "ERROR";
})(SpanStatusCode || (SpanStatusCode = {}));

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/internal/tracestate-validators.js
var VALID_KEY_CHAR_RANGE = "[_0-9a-z-*/]";
var VALID_KEY = "[a-z]" + VALID_KEY_CHAR_RANGE + "{0,255}";
var VALID_VENDOR_KEY = "[a-z0-9]" + VALID_KEY_CHAR_RANGE + "{0,240}@[a-z]" + VALID_KEY_CHAR_RANGE + "{0,13}";
var VALID_KEY_REGEX = /* @__PURE__ */ new RegExp("^(?:" + VALID_KEY + "|" + VALID_VENDOR_KEY + ")$");
var VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
var INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
/**
* Key is opaque string up to 256 characters printable. It MUST begin with a
* lowercase letter, and can only contain lowercase letters a-z, digits 0-9,
* underscores _, dashes -, asterisks *, and forward slashes /.
* For multi-tenant vendor scenarios, an at sign (@) can be used to prefix the
* vendor name. Vendors SHOULD set the tenant ID at the beginning of the key.
* see https://www.w3.org/TR/trace-context/#key
*/
function validateKey(key) {
	return VALID_KEY_REGEX.test(key);
}
/**
* Value is opaque string up to 256 characters printable ASCII RFC0020
* characters (i.e., the range 0x20 to 0x7E) except comma , and =.
*/
function validateValue(value) {
	return VALID_VALUE_BASE_REGEX.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value);
}

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/internal/tracestate-impl.js
var MAX_TRACE_STATE_ITEMS = 32;
var MAX_TRACE_STATE_LEN = 512;
var LIST_MEMBERS_SEPARATOR = ",";
var LIST_MEMBER_KEY_VALUE_SPLITTER = "=";
/**
* TraceState must be a class and not a simple object type because of the spec
* requirement (https://www.w3.org/TR/trace-context/#tracestate-field).
*
* Here is the list of allowed mutations:
* - New key-value pair should be added into the beginning of the list
* - The value of any key can be updated. Modified keys MUST be moved to the
* beginning of the list.
*/
var TraceStateImpl = function() {
	function TraceStateImpl$1(rawTraceState) {
		this._internalState = /* @__PURE__ */ new Map();
		if (rawTraceState) this._parse(rawTraceState);
	}
	TraceStateImpl$1.prototype.set = function(key, value) {
		var traceState = this._clone();
		if (traceState._internalState.has(key)) traceState._internalState.delete(key);
		traceState._internalState.set(key, value);
		return traceState;
	};
	TraceStateImpl$1.prototype.unset = function(key) {
		var traceState = this._clone();
		traceState._internalState.delete(key);
		return traceState;
	};
	TraceStateImpl$1.prototype.get = function(key) {
		return this._internalState.get(key);
	};
	TraceStateImpl$1.prototype.serialize = function() {
		var _this = this;
		return this._keys().reduce(function(agg, key) {
			agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + _this.get(key));
			return agg;
		}, []).join(LIST_MEMBERS_SEPARATOR);
	};
	TraceStateImpl$1.prototype._parse = function(rawTraceState) {
		if (rawTraceState.length > MAX_TRACE_STATE_LEN) return;
		this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR).reverse().reduce(function(agg, part) {
			var listMember = part.trim();
			var i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
			if (i !== -1) {
				var key = listMember.slice(0, i);
				var value = listMember.slice(i + 1, part.length);
				if (validateKey(key) && validateValue(value)) agg.set(key, value);
			}
			return agg;
		}, /* @__PURE__ */ new Map());
		if (this._internalState.size > MAX_TRACE_STATE_ITEMS) this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, MAX_TRACE_STATE_ITEMS));
	};
	TraceStateImpl$1.prototype._keys = function() {
		return Array.from(this._internalState.keys()).reverse();
	};
	TraceStateImpl$1.prototype._clone = function() {
		var traceState = new TraceStateImpl$1();
		traceState._internalState = new Map(this._internalState);
		return traceState;
	};
	return TraceStateImpl$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/internal/utils.js
function createTraceState(rawTraceState) {
	return new TraceStateImpl(rawTraceState);
}

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/context-api.js
/** Entrypoint for context API */
var context = ContextAPI.getInstance();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/diag-api.js
/**
* Entrypoint for Diag API.
* Defines Diagnostic handler used for internal diagnostic logging operations.
* The default provides a Noop DiagLogger implementation which may be changed via the
* diag.setLogger(logger: DiagLogger) function.
*/
var diag = DiagAPI.instance();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/metrics/NoopMeterProvider.js
/**
* An implementation of the {@link MeterProvider} which returns an impotent Meter
* for all calls to `getMeter`
*/
var NoopMeterProvider = function() {
	function NoopMeterProvider$1() {}
	NoopMeterProvider$1.prototype.getMeter = function(_name, _version, _options) {
		return NOOP_METER;
	};
	return NoopMeterProvider$1;
}();
var NOOP_METER_PROVIDER = new NoopMeterProvider();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/api/metrics.js
var API_NAME$2 = "metrics";
/**
* Singleton object which represents the entry point to the OpenTelemetry Metrics API
*/
var MetricsAPI = function() {
	/** Empty private constructor prevents end users from constructing a new instance of the API */
	function MetricsAPI$1() {}
	/** Get the singleton instance of the Metrics API */
	MetricsAPI$1.getInstance = function() {
		if (!this._instance) this._instance = new MetricsAPI$1();
		return this._instance;
	};
	/**
	* Set the current global meter provider.
	* Returns true if the meter provider was successfully registered, else false.
	*/
	MetricsAPI$1.prototype.setGlobalMeterProvider = function(provider) {
		return registerGlobal(API_NAME$2, provider, DiagAPI.instance());
	};
	/**
	* Returns the global meter provider.
	*/
	MetricsAPI$1.prototype.getMeterProvider = function() {
		return getGlobal(API_NAME$2) || NOOP_METER_PROVIDER;
	};
	/**
	* Returns a meter from the global meter provider.
	*/
	MetricsAPI$1.prototype.getMeter = function(name, version, options) {
		return this.getMeterProvider().getMeter(name, version, options);
	};
	/** Remove the global meter provider */
	MetricsAPI$1.prototype.disable = function() {
		unregisterGlobal(API_NAME$2, DiagAPI.instance());
	};
	return MetricsAPI$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/metrics-api.js
/** Entrypoint for metrics API */
var metrics = MetricsAPI.getInstance();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/propagation/NoopTextMapPropagator.js
/**
* No-op implementations of {@link TextMapPropagator}.
*/
var NoopTextMapPropagator = function() {
	function NoopTextMapPropagator$1() {}
	/** Noop inject function does nothing */
	NoopTextMapPropagator$1.prototype.inject = function(_context, _carrier) {};
	/** Noop extract function does nothing and returns the input context */
	NoopTextMapPropagator$1.prototype.extract = function(context$1, _carrier) {
		return context$1;
	};
	NoopTextMapPropagator$1.prototype.fields = function() {
		return [];
	};
	return NoopTextMapPropagator$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/baggage/context-helpers.js
/**
* Baggage key
*/
var BAGGAGE_KEY = createContextKey("OpenTelemetry Baggage Key");
/**
* Retrieve the current baggage from the given context
*
* @param {Context} Context that manage all context values
* @returns {Baggage} Extracted baggage from the context
*/
function getBaggage(context$1) {
	return context$1.getValue(BAGGAGE_KEY) || void 0;
}
/**
* Retrieve the current baggage from the active/current context
*
* @returns {Baggage} Extracted baggage from the context
*/
function getActiveBaggage() {
	return getBaggage(ContextAPI.getInstance().active());
}
/**
* Store a baggage in the given context
*
* @param {Context} Context that manage all context values
* @param {Baggage} baggage that will be set in the actual context
*/
function setBaggage(context$1, baggage) {
	return context$1.setValue(BAGGAGE_KEY, baggage);
}
/**
* Delete the baggage stored in the given context
*
* @param {Context} Context that manage all context values
*/
function deleteBaggage(context$1) {
	return context$1.deleteValue(BAGGAGE_KEY);
}

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/api/propagation.js
var API_NAME$1 = "propagation";
var NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator();
/**
* Singleton object which represents the entry point to the OpenTelemetry Propagation API
*/
var PropagationAPI = function() {
	/** Empty private constructor prevents end users from constructing a new instance of the API */
	function PropagationAPI$1() {
		this.createBaggage = createBaggage;
		this.getBaggage = getBaggage;
		this.getActiveBaggage = getActiveBaggage;
		this.setBaggage = setBaggage;
		this.deleteBaggage = deleteBaggage;
	}
	/** Get the singleton instance of the Propagator API */
	PropagationAPI$1.getInstance = function() {
		if (!this._instance) this._instance = new PropagationAPI$1();
		return this._instance;
	};
	/**
	* Set the current propagator.
	*
	* @returns true if the propagator was successfully registered, else false
	*/
	PropagationAPI$1.prototype.setGlobalPropagator = function(propagator) {
		return registerGlobal(API_NAME$1, propagator, DiagAPI.instance());
	};
	/**
	* Inject context into a carrier to be propagated inter-process
	*
	* @param context Context carrying tracing data to inject
	* @param carrier carrier to inject context into
	* @param setter Function used to set values on the carrier
	*/
	PropagationAPI$1.prototype.inject = function(context$1, carrier, setter) {
		if (setter === void 0) setter = defaultTextMapSetter;
		return this._getGlobalPropagator().inject(context$1, carrier, setter);
	};
	/**
	* Extract context from a carrier
	*
	* @param context Context which the newly created context will inherit from
	* @param carrier Carrier to extract context from
	* @param getter Function used to extract keys from a carrier
	*/
	PropagationAPI$1.prototype.extract = function(context$1, carrier, getter) {
		if (getter === void 0) getter = defaultTextMapGetter;
		return this._getGlobalPropagator().extract(context$1, carrier, getter);
	};
	/**
	* Return a list of all fields which may be used by the propagator.
	*/
	PropagationAPI$1.prototype.fields = function() {
		return this._getGlobalPropagator().fields();
	};
	/** Remove the global propagator */
	PropagationAPI$1.prototype.disable = function() {
		unregisterGlobal(API_NAME$1, DiagAPI.instance());
	};
	PropagationAPI$1.prototype._getGlobalPropagator = function() {
		return getGlobal(API_NAME$1) || NOOP_TEXT_MAP_PROPAGATOR;
	};
	return PropagationAPI$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/propagation-api.js
/** Entrypoint for propagation API */
var propagation = PropagationAPI.getInstance();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/api/trace.js
var API_NAME = "trace";
/**
* Singleton object which represents the entry point to the OpenTelemetry Tracing API
*/
var TraceAPI = function() {
	/** Empty private constructor prevents end users from constructing a new instance of the API */
	function TraceAPI$1() {
		this._proxyTracerProvider = new ProxyTracerProvider();
		this.wrapSpanContext = wrapSpanContext;
		this.isSpanContextValid = isSpanContextValid;
		this.deleteSpan = deleteSpan;
		this.getSpan = getSpan;
		this.getActiveSpan = getActiveSpan;
		this.getSpanContext = getSpanContext;
		this.setSpan = setSpan;
		this.setSpanContext = setSpanContext;
	}
	/** Get the singleton instance of the Trace API */
	TraceAPI$1.getInstance = function() {
		if (!this._instance) this._instance = new TraceAPI$1();
		return this._instance;
	};
	/**
	* Set the current global tracer.
	*
	* @returns true if the tracer provider was successfully registered, else false
	*/
	TraceAPI$1.prototype.setGlobalTracerProvider = function(provider) {
		var success = registerGlobal(API_NAME, this._proxyTracerProvider, DiagAPI.instance());
		if (success) this._proxyTracerProvider.setDelegate(provider);
		return success;
	};
	/**
	* Returns the global tracer provider.
	*/
	TraceAPI$1.prototype.getTracerProvider = function() {
		return getGlobal(API_NAME) || this._proxyTracerProvider;
	};
	/**
	* Returns a tracer from the global tracer provider.
	*/
	TraceAPI$1.prototype.getTracer = function(name, version) {
		return this.getTracerProvider().getTracer(name, version);
	};
	/** Remove the global tracer provider */
	TraceAPI$1.prototype.disable = function() {
		unregisterGlobal(API_NAME, DiagAPI.instance());
		this._proxyTracerProvider = new ProxyTracerProvider();
	};
	return TraceAPI$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace-api.js
/** Entrypoint for trace API */
var trace = TraceAPI.getInstance();

//#endregion
//#region ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js
var esm_default = {
	context,
	diag,
	metrics,
	propagation,
	trace
};

//#endregion
export { DiagConsoleLogger, DiagLogLevel, INVALID_SPANID, INVALID_SPAN_CONTEXT, INVALID_TRACEID, ProxyTracer, ProxyTracerProvider, ROOT_CONTEXT, SamplingDecision, SpanKind, SpanStatusCode, TraceFlags, ValueType, baggageEntryMetadataFromString, context, createContextKey, createNoopMeter, createTraceState, esm_default as default, defaultTextMapGetter, defaultTextMapSetter, diag, isSpanContextValid, isValidSpanId, isValidTraceId, metrics, propagation, trace };