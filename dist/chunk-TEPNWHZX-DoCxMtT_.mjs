//#region ../../node_modules/.pnpm/@jitl+quickjs-ffi-types@0.29.2/node_modules/@jitl/quickjs-ffi-types/dist/index.mjs
var i = {
	JS_EVAL_TYPE_GLOBAL: 0,
	JS_EVAL_TYPE_MODULE: 1,
	JS_EVAL_TYPE_DIRECT: 2,
	JS_EVAL_TYPE_INDIRECT: 3,
	JS_EVAL_TYPE_MASK: 3,
	JS_EVAL_FLAG_STRICT: 8,
	JS_EVAL_FLAG_STRIP: 16,
	JS_EVAL_FLAG_COMPILE_ONLY: 32,
	JS_EVAL_FLAG_BACKTRACE_BARRIER: 64
}, a = {
	BaseObjects: 1,
	Date: 2,
	Eval: 4,
	StringNormalize: 8,
	RegExp: 16,
	RegExpCompiler: 32,
	JSON: 64,
	Proxy: 128,
	MapSet: 256,
	TypedArrays: 512,
	Promise: 1024,
	BigInt: 2048,
	BigFloat: 4096,
	BigDecimal: 8192,
	OperatorOverloading: 16384,
	BignumExt: 32768
}, p$1 = {
	Pending: 0,
	Fulfilled: 1,
	Rejected: 2
};

//#endregion
//#region ../../node_modules/.pnpm/quickjs-emscripten-core@0.29.2/node_modules/quickjs-emscripten-core/dist/chunk-TEPNWHZX.mjs
var Z = Object.defineProperty;
var ee = (s, i$1) => {
	for (var e in i$1) Z(s, e, {
		get: i$1[e],
		enumerable: !0
	});
};
var R = !1;
function p(...s) {
	R && console.log(...s);
}
var te = {};
ee(te, {
	QuickJSAsyncifyError: () => k,
	QuickJSAsyncifySuspended: () => g,
	QuickJSEmscriptenModuleError: () => O,
	QuickJSMemoryLeakDetected: () => A,
	QuickJSNotImplemented: () => _,
	QuickJSPromisePending: () => Q,
	QuickJSUnknownIntrinsic: () => P,
	QuickJSUnwrapError: () => y,
	QuickJSUseAfterFree: () => x,
	QuickJSWrongOwner: () => w
});
var y = class extends Error {
	constructor(e, t) {
		super(String(e));
		this.cause = e;
		this.context = t;
		this.name = "QuickJSUnwrapError";
	}
}, w = class extends Error {
	constructor() {
		super(...arguments);
		this.name = "QuickJSWrongOwner";
	}
}, x = class extends Error {
	constructor() {
		super(...arguments);
		this.name = "QuickJSUseAfterFree";
	}
}, _ = class extends Error {
	constructor() {
		super(...arguments);
		this.name = "QuickJSNotImplemented";
	}
}, k = class extends Error {
	constructor() {
		super(...arguments);
		this.name = "QuickJSAsyncifyError";
	}
}, g = class extends Error {
	constructor() {
		super(...arguments);
		this.name = "QuickJSAsyncifySuspended";
	}
}, A = class extends Error {
	constructor() {
		super(...arguments);
		this.name = "QuickJSMemoryLeakDetected";
	}
}, O = class extends Error {
	constructor() {
		super(...arguments);
		this.name = "QuickJSEmscriptenModuleError";
	}
}, P = class extends TypeError {
	constructor() {
		super(...arguments);
		this.name = "QuickJSUnknownIntrinsic";
	}
}, Q = class extends Error {
	constructor() {
		super(...arguments);
		this.name = "QuickJSPromisePending";
	}
};
function* z(s) {
	return yield s;
}
function re(s) {
	return z(V(s));
}
var L = z;
L.of = re;
function F(s, i$1) {
	return (...e) => {
		return V(i$1.call(s, L, ...e));
	};
}
function Y(s, i$1) {
	return V(i$1.call(s, L));
}
function V(s) {
	function i$1(e) {
		return e.done ? e.value : e.value instanceof Promise ? e.value.then((t) => i$1(s.next(t)), (t) => i$1(s.throw(t))) : i$1(s.next(e.value));
	}
	return i$1(s.next());
}
var f = class {
	[Symbol.dispose]() {
		return this.dispose();
	}
}, U = Symbol.dispose ?? Symbol.for("Symbol.dispose"), G = f.prototype;
G[U] || (G[U] = function() {
	return this.dispose();
});
var c = class s extends f {
	constructor(e, t, r, n) {
		super();
		this._value = e;
		this.copier = t;
		this.disposer = r;
		this._owner = n;
		this._alive = !0;
		this._constructorStack = R ? (/* @__PURE__ */ new Error("Lifetime constructed")).stack : void 0;
	}
	get alive() {
		return this._alive;
	}
	get value() {
		return this.assertAlive(), this._value;
	}
	get owner() {
		return this._owner;
	}
	get dupable() {
		return !!this.copier;
	}
	dup() {
		if (this.assertAlive(), !this.copier) throw new Error("Non-dupable lifetime");
		return new s(this.copier(this._value), this.copier, this.disposer, this._owner);
	}
	consume(e) {
		this.assertAlive();
		let t = e(this);
		return this.dispose(), t;
	}
	dispose() {
		this.assertAlive(), this.disposer && this.disposer(this._value), this._alive = !1;
	}
	assertAlive() {
		if (!this.alive) throw this._constructorStack ? new x(`Lifetime not alive
${this._constructorStack}
Lifetime used`) : new x("Lifetime not alive");
	}
}, S = class extends c {
	constructor(i$1, e) {
		super(i$1, void 0, void 0, e);
	}
	get dupable() {
		return !0;
	}
	dup() {
		return this;
	}
	dispose() {}
}, C = class extends c {
	constructor(i$1, e, t, r) {
		super(i$1, e, t, r);
	}
	dispose() {
		this._alive = !1;
	}
};
function I(s, i$1) {
	let e;
	try {
		s.dispose();
	} catch (t) {
		e = t;
	}
	if (i$1 && e) throw Object.assign(i$1, {
		message: `${i$1.message}
 Then, failed to dispose scope: ${e.message}`,
		disposeError: e
	}), i$1;
	if (i$1 || e) throw i$1 || e;
}
var h = class s extends f {
	constructor() {
		super(...arguments);
		this._disposables = new c(/* @__PURE__ */ new Set());
	}
	static withScope(e) {
		let t = new s(), r;
		try {
			return e(t);
		} catch (n) {
			throw r = n, n;
		} finally {
			I(t, r);
		}
	}
	static withScopeMaybeAsync(e, t) {
		return Y(void 0, function* (r) {
			let n = new s(), o;
			try {
				return yield* r.of(t.call(e, r, n));
			} catch (a$1) {
				throw o = a$1, a$1;
			} finally {
				I(n, o);
			}
		});
	}
	static async withScopeAsync(e) {
		let t = new s(), r;
		try {
			return await e(t);
		} catch (n) {
			throw r = n, n;
		} finally {
			I(t, r);
		}
	}
	manage(e) {
		return this._disposables.value.add(e), e;
	}
	get alive() {
		return this._disposables.alive;
	}
	dispose() {
		let e = Array.from(this._disposables.value.values()).reverse();
		for (let t of e) t.alive && t.dispose();
		this._disposables.dispose();
	}
};
var T = class extends f {
	constructor(e) {
		super();
		this.resolve = (e$1) => {
			this.resolveHandle.alive && (this.context.unwrapResult(this.context.callFunction(this.resolveHandle, this.context.undefined, e$1 || this.context.undefined)).dispose(), this.disposeResolvers(), this.onSettled());
		};
		this.reject = (e$1) => {
			this.rejectHandle.alive && (this.context.unwrapResult(this.context.callFunction(this.rejectHandle, this.context.undefined, e$1 || this.context.undefined)).dispose(), this.disposeResolvers(), this.onSettled());
		};
		this.dispose = () => {
			this.handle.alive && this.handle.dispose(), this.disposeResolvers();
		};
		this.context = e.context, this.owner = e.context.runtime, this.handle = e.promiseHandle, this.settled = new Promise((t) => {
			this.onSettled = t;
		}), this.resolveHandle = e.resolveHandle, this.rejectHandle = e.rejectHandle;
	}
	get alive() {
		return this.handle.alive || this.resolveHandle.alive || this.rejectHandle.alive;
	}
	disposeResolvers() {
		this.resolveHandle.alive && this.resolveHandle.dispose(), this.rejectHandle.alive && this.rejectHandle.dispose();
	}
};
var J = class {
	constructor(i$1) {
		this.module = i$1;
	}
	toPointerArray(i$1) {
		let e = new Int32Array(i$1.map((o) => o.value)), t = e.length * e.BYTES_PER_ELEMENT, r = this.module._malloc(t);
		return new Uint8Array(this.module.HEAPU8.buffer, r, t).set(new Uint8Array(e.buffer)), new c(r, void 0, (o) => this.module._free(o));
	}
	newMutablePointerArray(i$1) {
		let e = new Int32Array(new Array(i$1).fill(0)), t = e.length * e.BYTES_PER_ELEMENT, r = this.module._malloc(t), n = new Int32Array(this.module.HEAPU8.buffer, r, i$1);
		return n.set(e), new c({
			typedArray: n,
			ptr: r
		}, void 0, (o) => this.module._free(o.ptr));
	}
	newHeapCharPointer(i$1) {
		let e = this.module.lengthBytesUTF8(i$1), t = e + 1, r = this.module._malloc(t);
		return this.module.stringToUTF8(i$1, r, t), new c({
			ptr: r,
			strlen: e
		}, void 0, (n) => this.module._free(n.ptr));
	}
	newHeapBufferPointer(i$1) {
		let e = i$1.byteLength, t = this.module._malloc(e);
		return this.module.HEAPU8.set(i$1, t), new c({
			pointer: t,
			numBytes: e
		}, void 0, (r) => this.module._free(r.pointer));
	}
	consumeHeapCharPointer(i$1) {
		let e = this.module.UTF8ToString(i$1);
		return this.module._free(i$1), e;
	}
};
var Je = Object.freeze({
	BaseObjects: !0,
	Date: !0,
	Eval: !0,
	StringNormalize: !0,
	RegExp: !0,
	JSON: !0,
	Proxy: !0,
	MapSet: !0,
	TypedArrays: !0,
	Promise: !0
});
function K(s) {
	if (!s) return 0;
	let i$1 = 0;
	for (let [e, t] of Object.entries(s)) {
		if (!(e in a)) throw new P(e);
		t && (i$1 |= a[e]);
	}
	return i$1;
}
function q(s) {
	if (typeof s == "number") return s;
	if (s === void 0) return 0;
	let { type: i$1, strict: e, strip: t, compileOnly: r, backtraceBarrier: n } = s, o = 0;
	return i$1 === "global" && (o |= i.JS_EVAL_TYPE_GLOBAL), i$1 === "module" && (o |= i.JS_EVAL_TYPE_MODULE), e && (o |= i.JS_EVAL_FLAG_STRICT), t && (o |= i.JS_EVAL_FLAG_STRIP), r && (o |= i.JS_EVAL_FLAG_COMPILE_ONLY), n && (o |= i.JS_EVAL_FLAG_BACKTRACE_BARRIER), o;
}
function W(...s) {
	let i$1 = [];
	for (let e of s) e !== void 0 && (i$1 = i$1.concat(e));
	return i$1;
}
var N = class extends J {
	constructor(e) {
		super(e.module);
		this.scope = new h();
		this.copyJSValue = (e$1) => this.ffi.QTS_DupValuePointer(this.ctx.value, e$1);
		this.freeJSValue = (e$1) => {
			this.ffi.QTS_FreeValuePointer(this.ctx.value, e$1);
		};
		e.ownedLifetimes?.forEach((t) => this.scope.manage(t)), this.owner = e.owner, this.module = e.module, this.ffi = e.ffi, this.rt = e.rt, this.ctx = this.scope.manage(e.ctx);
	}
	get alive() {
		return this.scope.alive;
	}
	dispose() {
		return this.scope.dispose();
	}
	[Symbol.dispose]() {
		return this.dispose();
	}
	manage(e) {
		return this.scope.manage(e);
	}
	consumeJSCharPointer(e) {
		let t = this.module.UTF8ToString(e);
		return this.ffi.QTS_FreeCString(this.ctx.value, e), t;
	}
	heapValueHandle(e) {
		return new c(e, this.copyJSValue, this.freeJSValue, this.owner);
	}
}, M = class extends f {
	constructor(e) {
		super();
		this._undefined = void 0;
		this._null = void 0;
		this._false = void 0;
		this._true = void 0;
		this._global = void 0;
		this._BigInt = void 0;
		this.fnNextId = -32768;
		this.fnMaps = /* @__PURE__ */ new Map();
		this.cToHostCallbacks = { callFunction: (e$1, t, r, n, o) => {
			if (e$1 !== this.ctx.value) throw new Error("QuickJSContext instance received C -> JS call with mismatched ctx");
			let a$1 = this.getFunction(o);
			if (!a$1) throw new Error(`QuickJSContext had no callback with id ${o}`);
			return h.withScopeMaybeAsync(this, function* (l, u) {
				let m = u.manage(new C(t, this.memory.copyJSValue, this.memory.freeJSValue, this.runtime)), H = new Array(r);
				for (let d = 0; d < r; d++) {
					let v = this.ffi.QTS_ArgvGetJSValueConstPointer(n, d);
					H[d] = u.manage(new C(v, this.memory.copyJSValue, this.memory.freeJSValue, this.runtime));
				}
				try {
					let d = yield* l(a$1.apply(m, H));
					if (d) {
						if ("error" in d && d.error) throw p("throw error", d.error), d.error;
						let v = u.manage(d instanceof c ? d : d.value);
						return this.ffi.QTS_DupValuePointer(this.ctx.value, v.value);
					}
					return 0;
				} catch (d) {
					return this.errorToHandle(d).consume((v) => this.ffi.QTS_Throw(this.ctx.value, v.value));
				}
			});
		} };
		this.runtime = e.runtime, this.module = e.module, this.ffi = e.ffi, this.rt = e.rt, this.ctx = e.ctx, this.memory = new N({
			...e,
			owner: this.runtime
		}), e.callbacks.setContextCallbacks(this.ctx.value, this.cToHostCallbacks), this.dump = this.dump.bind(this), this.getString = this.getString.bind(this), this.getNumber = this.getNumber.bind(this), this.resolvePromise = this.resolvePromise.bind(this);
	}
	get alive() {
		return this.memory.alive;
	}
	dispose() {
		this.memory.dispose();
	}
	get undefined() {
		if (this._undefined) return this._undefined;
		return this._undefined = new S(this.ffi.QTS_GetUndefined());
	}
	get null() {
		if (this._null) return this._null;
		return this._null = new S(this.ffi.QTS_GetNull());
	}
	get true() {
		if (this._true) return this._true;
		return this._true = new S(this.ffi.QTS_GetTrue());
	}
	get false() {
		if (this._false) return this._false;
		return this._false = new S(this.ffi.QTS_GetFalse());
	}
	get global() {
		if (this._global) return this._global;
		let e = this.ffi.QTS_GetGlobalObject(this.ctx.value);
		return this.memory.manage(this.memory.heapValueHandle(e)), this._global = new S(e, this.runtime), this._global;
	}
	newNumber(e) {
		return this.memory.heapValueHandle(this.ffi.QTS_NewFloat64(this.ctx.value, e));
	}
	newString(e) {
		let t = this.memory.newHeapCharPointer(e).consume((r) => this.ffi.QTS_NewString(this.ctx.value, r.value.ptr));
		return this.memory.heapValueHandle(t);
	}
	newUniqueSymbol(e) {
		let t = (typeof e == "symbol" ? e.description : e) ?? "", r = this.memory.newHeapCharPointer(t).consume((n) => this.ffi.QTS_NewSymbol(this.ctx.value, n.value.ptr, 0));
		return this.memory.heapValueHandle(r);
	}
	newSymbolFor(e) {
		let t = (typeof e == "symbol" ? e.description : e) ?? "", r = this.memory.newHeapCharPointer(t).consume((n) => this.ffi.QTS_NewSymbol(this.ctx.value, n.value.ptr, 1));
		return this.memory.heapValueHandle(r);
	}
	newBigInt(e) {
		if (!this._BigInt) {
			let n = this.getProp(this.global, "BigInt");
			this.memory.manage(n), this._BigInt = new S(n.value, this.runtime);
		}
		let t = this._BigInt, r = String(e);
		return this.newString(r).consume((n) => this.unwrapResult(this.callFunction(t, this.undefined, n)));
	}
	newObject(e) {
		e && this.runtime.assertOwned(e);
		let t = e ? this.ffi.QTS_NewObjectProto(this.ctx.value, e.value) : this.ffi.QTS_NewObject(this.ctx.value);
		return this.memory.heapValueHandle(t);
	}
	newArray() {
		let e = this.ffi.QTS_NewArray(this.ctx.value);
		return this.memory.heapValueHandle(e);
	}
	newArrayBuffer(e) {
		let t = new Uint8Array(e), r = this.memory.newHeapBufferPointer(t), n = this.ffi.QTS_NewArrayBuffer(this.ctx.value, r.value.pointer, t.length);
		return this.memory.heapValueHandle(n);
	}
	newPromise(e) {
		let t = h.withScope((r) => {
			let n = r.manage(this.memory.newMutablePointerArray(2)), o = this.ffi.QTS_NewPromiseCapability(this.ctx.value, n.value.ptr), a$1 = this.memory.heapValueHandle(o), [l, u] = Array.from(n.value.typedArray).map((m) => this.memory.heapValueHandle(m));
			return new T({
				context: this,
				promiseHandle: a$1,
				resolveHandle: l,
				rejectHandle: u
			});
		});
		return e && typeof e == "function" && (e = new Promise(e)), e && Promise.resolve(e).then(t.resolve, (r) => r instanceof c ? t.reject(r) : this.newError(r).consume(t.reject)), t;
	}
	newFunction(e, t) {
		let r = ++this.fnNextId;
		return this.setFunction(r, t), this.memory.heapValueHandle(this.ffi.QTS_NewFunction(this.ctx.value, r, e));
	}
	newError(e) {
		let t = this.memory.heapValueHandle(this.ffi.QTS_NewError(this.ctx.value));
		return e && typeof e == "object" ? (e.name !== void 0 && this.newString(e.name).consume((r) => this.setProp(t, "name", r)), e.message !== void 0 && this.newString(e.message).consume((r) => this.setProp(t, "message", r))) : typeof e == "string" ? this.newString(e).consume((r) => this.setProp(t, "message", r)) : e !== void 0 && this.newString(String(e)).consume((r) => this.setProp(t, "message", r)), t;
	}
	typeof(e) {
		return this.runtime.assertOwned(e), this.memory.consumeHeapCharPointer(this.ffi.QTS_Typeof(this.ctx.value, e.value));
	}
	getNumber(e) {
		return this.runtime.assertOwned(e), this.ffi.QTS_GetFloat64(this.ctx.value, e.value);
	}
	getString(e) {
		return this.runtime.assertOwned(e), this.memory.consumeJSCharPointer(this.ffi.QTS_GetString(this.ctx.value, e.value));
	}
	getSymbol(e) {
		this.runtime.assertOwned(e);
		let t = this.memory.consumeJSCharPointer(this.ffi.QTS_GetSymbolDescriptionOrKey(this.ctx.value, e.value));
		return this.ffi.QTS_IsGlobalSymbol(this.ctx.value, e.value) ? Symbol.for(t) : Symbol(t);
	}
	getBigInt(e) {
		this.runtime.assertOwned(e);
		let t = this.getString(e);
		return BigInt(t);
	}
	getArrayBuffer(e) {
		this.runtime.assertOwned(e);
		let t = this.ffi.QTS_GetArrayBufferLength(this.ctx.value, e.value), r = this.ffi.QTS_GetArrayBuffer(this.ctx.value, e.value);
		if (!r) throw new Error("Couldn't allocate memory to get ArrayBuffer");
		return new c(this.module.HEAPU8.subarray(r, r + t), void 0, () => this.module._free(r));
	}
	getPromiseState(e) {
		this.runtime.assertOwned(e);
		let t = this.ffi.QTS_PromiseState(this.ctx.value, e.value);
		if (t < 0) return {
			type: "fulfilled",
			value: e,
			notAPromise: !0
		};
		if (t === p$1.Pending) return {
			type: "pending",
			get error() {
				return new Q("Cannot unwrap a pending promise");
			}
		};
		let r = this.ffi.QTS_PromiseResult(this.ctx.value, e.value), n = this.memory.heapValueHandle(r);
		if (t === p$1.Fulfilled) return {
			type: "fulfilled",
			value: n
		};
		if (t === p$1.Rejected) return {
			type: "rejected",
			error: n
		};
		throw n.dispose(), /* @__PURE__ */ new Error(`Unknown JSPromiseStateEnum: ${t}`);
	}
	resolvePromise(e) {
		this.runtime.assertOwned(e);
		let t = h.withScope((r) => {
			let n = r.manage(this.getProp(this.global, "Promise")), o = r.manage(this.getProp(n, "resolve"));
			return this.callFunction(o, n, e);
		});
		return t.error ? Promise.resolve(t) : new Promise((r) => {
			h.withScope((n) => {
				let o = n.manage(this.newFunction("resolve", (m) => {
					r({ value: m && m.dup() });
				})), a$1 = n.manage(this.newFunction("reject", (m) => {
					r({ error: m && m.dup() });
				})), l = n.manage(t.value), u = n.manage(this.getProp(l, "then"));
				this.unwrapResult(this.callFunction(u, l, o, a$1)).dispose();
			});
		});
	}
	getProp(e, t) {
		this.runtime.assertOwned(e);
		let r = this.borrowPropertyKey(t).consume((o) => this.ffi.QTS_GetProp(this.ctx.value, e.value, o.value));
		return this.memory.heapValueHandle(r);
	}
	setProp(e, t, r) {
		this.runtime.assertOwned(e), this.borrowPropertyKey(t).consume((n) => this.ffi.QTS_SetProp(this.ctx.value, e.value, n.value, r.value));
	}
	defineProp(e, t, r) {
		this.runtime.assertOwned(e), h.withScope((n) => {
			let o = n.manage(this.borrowPropertyKey(t)), a$1 = r.value || this.undefined, l = !!r.configurable, u = !!r.enumerable, m = !!r.value, H = r.get ? n.manage(this.newFunction(r.get.name, r.get)) : this.undefined, d = r.set ? n.manage(this.newFunction(r.set.name, r.set)) : this.undefined;
			this.ffi.QTS_DefineProp(this.ctx.value, e.value, o.value, a$1.value, H.value, d.value, l, u, m);
		});
	}
	callFunction(e, t, ...r) {
		this.runtime.assertOwned(e);
		let n = this.memory.toPointerArray(r).consume((a$1) => this.ffi.QTS_Call(this.ctx.value, e.value, t.value, r.length, a$1.value)), o = this.ffi.QTS_ResolveException(this.ctx.value, n);
		return o ? (this.ffi.QTS_FreeValuePointer(this.ctx.value, n), { error: this.memory.heapValueHandle(o) }) : { value: this.memory.heapValueHandle(n) };
	}
	evalCode(e, t = "eval.js", r) {
		let n = r === void 0 ? 1 : 0, o = q(r), a$1 = this.memory.newHeapCharPointer(e).consume((u) => this.ffi.QTS_Eval(this.ctx.value, u.value.ptr, u.value.strlen, t, n, o)), l = this.ffi.QTS_ResolveException(this.ctx.value, a$1);
		return l ? (this.ffi.QTS_FreeValuePointer(this.ctx.value, a$1), { error: this.memory.heapValueHandle(l) }) : { value: this.memory.heapValueHandle(a$1) };
	}
	throw(e) {
		return this.errorToHandle(e).consume((t) => this.ffi.QTS_Throw(this.ctx.value, t.value));
	}
	borrowPropertyKey(e) {
		return typeof e == "number" ? this.newNumber(e) : typeof e == "string" ? this.newString(e) : new S(e.value, this.runtime);
	}
	getMemory(e) {
		if (e === this.rt.value) return this.memory;
		throw new Error("Private API. Cannot get memory from a different runtime");
	}
	dump(e) {
		this.runtime.assertOwned(e);
		let t = this.typeof(e);
		if (t === "string") return this.getString(e);
		if (t === "number") return this.getNumber(e);
		if (t === "bigint") return this.getBigInt(e);
		if (t === "undefined") return;
		if (t === "symbol") return this.getSymbol(e);
		let r = this.getPromiseState(e);
		if (r.type === "fulfilled" && !r.notAPromise) return e.dispose(), {
			type: r.type,
			value: r.value.consume(this.dump)
		};
		if (r.type === "pending") return e.dispose(), { type: r.type };
		if (r.type === "rejected") return e.dispose(), {
			type: r.type,
			error: r.error.consume(this.dump)
		};
		let n = this.memory.consumeJSCharPointer(this.ffi.QTS_Dump(this.ctx.value, e.value));
		try {
			return JSON.parse(n);
		} catch {
			return n;
		}
	}
	unwrapResult(e) {
		if (e.error) {
			let t = "context" in e.error ? e.error.context : this, r = e.error.consume((n) => this.dump(n));
			if (r && typeof r == "object" && typeof r.message == "string") {
				let { message: n, name: o, stack: a$1 } = r, l = new y(""), u = l.stack;
				throw typeof o == "string" && (l.name = r.name), typeof a$1 == "string" && (l.stack = `${o}: ${n}
${r.stack}Host: ${u}`), Object.assign(l, {
					cause: r,
					context: t,
					message: n
				}), l;
			}
			throw new y(r, t);
		}
		return e.value;
	}
	getFunction(e) {
		let t = e >> 8, r = this.fnMaps.get(t);
		if (r) return r.get(e);
	}
	setFunction(e, t) {
		let r = e >> 8, n = this.fnMaps.get(r);
		return n || (n = /* @__PURE__ */ new Map(), this.fnMaps.set(r, n)), n.set(e, t);
	}
	errorToHandle(e) {
		return e instanceof c ? e : this.newError(e);
	}
	encodeBinaryJSON(e) {
		let t = this.ffi.QTS_bjson_encode(this.ctx.value, e.value);
		return this.memory.heapValueHandle(t);
	}
	decodeBinaryJSON(e) {
		let t = this.ffi.QTS_bjson_decode(this.ctx.value, e.value);
		return this.memory.heapValueHandle(t);
	}
};
var E = class extends f {
	constructor(e) {
		super();
		this.scope = new h();
		this.contextMap = /* @__PURE__ */ new Map();
		this.cToHostCallbacks = {
			shouldInterrupt: (e$1) => {
				if (e$1 !== this.rt.value) throw new Error("QuickJSContext instance received C -> JS interrupt with mismatched rt");
				let t = this.interruptHandler;
				if (!t) throw new Error("QuickJSContext had no interrupt handler");
				return t(this) ? 1 : 0;
			},
			loadModuleSource: F(this, function* (e$1, t, r, n) {
				let o = this.moduleLoader;
				if (!o) throw new Error("Runtime has no module loader");
				if (t !== this.rt.value) throw new Error("Runtime pointer mismatch");
				let a$1 = this.contextMap.get(r) ?? this.newContext({ contextPointer: r });
				try {
					let l = yield* e$1(o(n, a$1));
					if (typeof l == "object" && "error" in l && l.error) throw p("cToHostLoadModule: loader returned error", l.error), l.error;
					let u = typeof l == "string" ? l : "value" in l ? l.value : l;
					return this.memory.newHeapCharPointer(u).value.ptr;
				} catch (l) {
					return p("cToHostLoadModule: caught error", l), a$1.throw(l), 0;
				}
			}),
			normalizeModule: F(this, function* (e$1, t, r, n, o) {
				let a$1 = this.moduleNormalizer;
				if (!a$1) throw new Error("Runtime has no module normalizer");
				if (t !== this.rt.value) throw new Error("Runtime pointer mismatch");
				let l = this.contextMap.get(r) ?? this.newContext({ contextPointer: r });
				try {
					let u = yield* e$1(a$1(n, o, l));
					if (typeof u == "object" && "error" in u && u.error) throw p("cToHostNormalizeModule: normalizer returned error", u.error), u.error;
					let m = typeof u == "string" ? u : u.value;
					return l.getMemory(this.rt.value).newHeapCharPointer(m).value.ptr;
				} catch (u) {
					return p("normalizeModule: caught error", u), l.throw(u), 0;
				}
			})
		};
		e.ownedLifetimes?.forEach((t) => this.scope.manage(t)), this.module = e.module, this.memory = new J(this.module), this.ffi = e.ffi, this.rt = e.rt, this.callbacks = e.callbacks, this.scope.manage(this.rt), this.callbacks.setRuntimeCallbacks(this.rt.value, this.cToHostCallbacks), this.executePendingJobs = this.executePendingJobs.bind(this);
	}
	get alive() {
		return this.scope.alive;
	}
	dispose() {
		return this.scope.dispose();
	}
	newContext(e = {}) {
		let t = K(e.intrinsics), r = new c(e.contextPointer || this.ffi.QTS_NewContext(this.rt.value, t), void 0, (o) => {
			this.contextMap.delete(o), this.callbacks.deleteContext(o), this.ffi.QTS_FreeContext(o);
		}), n = new M({
			module: this.module,
			ctx: r,
			ffi: this.ffi,
			rt: this.rt,
			ownedLifetimes: e.ownedLifetimes,
			runtime: this,
			callbacks: this.callbacks
		});
		return this.contextMap.set(r.value, n), n;
	}
	setModuleLoader(e, t) {
		this.moduleLoader = e, this.moduleNormalizer = t, this.ffi.QTS_RuntimeEnableModuleLoader(this.rt.value, this.moduleNormalizer ? 1 : 0);
	}
	removeModuleLoader() {
		this.moduleLoader = void 0, this.ffi.QTS_RuntimeDisableModuleLoader(this.rt.value);
	}
	hasPendingJob() {
		return !!this.ffi.QTS_IsJobPending(this.rt.value);
	}
	setInterruptHandler(e) {
		let t = this.interruptHandler;
		this.interruptHandler = e, t || this.ffi.QTS_RuntimeEnableInterruptHandler(this.rt.value);
	}
	removeInterruptHandler() {
		this.interruptHandler && (this.ffi.QTS_RuntimeDisableInterruptHandler(this.rt.value), this.interruptHandler = void 0);
	}
	executePendingJobs(e = -1) {
		let t = this.memory.newMutablePointerArray(1), r = this.ffi.QTS_ExecutePendingJob(this.rt.value, e ?? -1, t.value.ptr), n = t.value.typedArray[0];
		if (t.dispose(), n === 0) return this.ffi.QTS_FreeValuePointerRuntime(this.rt.value, r), { value: 0 };
		let o = this.contextMap.get(n) ?? this.newContext({ contextPointer: n }), a$1 = o.getMemory(this.rt.value).heapValueHandle(r);
		if (o.typeof(a$1) === "number") {
			let u = o.getNumber(a$1);
			return a$1.dispose(), { value: u };
		} else return { error: Object.assign(a$1, { context: o }) };
	}
	setMemoryLimit(e) {
		if (e < 0 && e !== -1) throw new Error("Cannot set memory limit to negative number. To unset, pass -1");
		this.ffi.QTS_RuntimeSetMemoryLimit(this.rt.value, e);
	}
	computeMemoryUsage() {
		let e = this.getSystemContext().getMemory(this.rt.value);
		return e.heapValueHandle(this.ffi.QTS_RuntimeComputeMemoryUsage(this.rt.value, e.ctx.value));
	}
	dumpMemoryUsage() {
		return this.memory.consumeHeapCharPointer(this.ffi.QTS_RuntimeDumpMemoryUsage(this.rt.value));
	}
	setMaxStackSize(e) {
		if (e < 0) throw new Error("Cannot set memory limit to negative number. To unset, pass 0.");
		this.ffi.QTS_RuntimeSetMaxStackSize(this.rt.value, e);
	}
	assertOwned(e) {
		if (e.owner && e.owner.rt !== this.rt) throw new w(`Handle is not owned by this runtime: ${e.owner.rt.value} != ${this.rt.value}`);
	}
	getSystemContext() {
		return this.context || (this.context = this.scope.manage(this.newContext())), this.context;
	}
};
var D = class {
	constructor(i$1) {
		this.callFunction = i$1.callFunction, this.shouldInterrupt = i$1.shouldInterrupt, this.loadModuleSource = i$1.loadModuleSource, this.normalizeModule = i$1.normalizeModule;
	}
}, j = class {
	constructor(i$1) {
		this.contextCallbacks = /* @__PURE__ */ new Map();
		this.runtimeCallbacks = /* @__PURE__ */ new Map();
		this.suspendedCount = 0;
		this.cToHostCallbacks = new D({
			callFunction: (i$2, e, t, r, n, o) => this.handleAsyncify(i$2, () => {
				try {
					let a$1 = this.contextCallbacks.get(e);
					if (!a$1) throw new Error(`QuickJSContext(ctx = ${e}) not found for C function call "${o}"`);
					return a$1.callFunction(e, t, r, n, o);
				} catch (a$1) {
					return console.error("[C to host error: returning null]", a$1), 0;
				}
			}),
			shouldInterrupt: (i$2, e) => this.handleAsyncify(i$2, () => {
				try {
					let t = this.runtimeCallbacks.get(e);
					if (!t) throw new Error(`QuickJSRuntime(rt = ${e}) not found for C interrupt`);
					return t.shouldInterrupt(e);
				} catch (t) {
					return console.error("[C to host interrupt: returning error]", t), 1;
				}
			}),
			loadModuleSource: (i$2, e, t, r) => this.handleAsyncify(i$2, () => {
				try {
					let n = this.runtimeCallbacks.get(e);
					if (!n) throw new Error(`QuickJSRuntime(rt = ${e}) not found for C module loader`);
					let o = n.loadModuleSource;
					if (!o) throw new Error(`QuickJSRuntime(rt = ${e}) does not support module loading`);
					return o(e, t, r);
				} catch (n) {
					return console.error("[C to host module loader error: returning null]", n), 0;
				}
			}),
			normalizeModule: (i$2, e, t, r, n) => this.handleAsyncify(i$2, () => {
				try {
					let o = this.runtimeCallbacks.get(e);
					if (!o) throw new Error(`QuickJSRuntime(rt = ${e}) not found for C module loader`);
					let a$1 = o.normalizeModule;
					if (!a$1) throw new Error(`QuickJSRuntime(rt = ${e}) does not support module loading`);
					return a$1(e, t, r, n);
				} catch (o) {
					return console.error("[C to host module loader error: returning null]", o), 0;
				}
			})
		});
		this.module = i$1, this.module.callbacks = this.cToHostCallbacks;
	}
	setRuntimeCallbacks(i$1, e) {
		this.runtimeCallbacks.set(i$1, e);
	}
	deleteRuntime(i$1) {
		this.runtimeCallbacks.delete(i$1);
	}
	setContextCallbacks(i$1, e) {
		this.contextCallbacks.set(i$1, e);
	}
	deleteContext(i$1) {
		this.contextCallbacks.delete(i$1);
	}
	handleAsyncify(i$1, e) {
		if (i$1) return i$1.handleSleep((r) => {
			try {
				let n = e();
				if (!(n instanceof Promise)) {
					p("asyncify.handleSleep: not suspending:", n), r(n);
					return;
				}
				if (this.suspended) throw new k(`Already suspended at: ${this.suspended.stack}
Attempted to suspend at:`);
				this.suspended = new g(`(${this.suspendedCount++})`), p("asyncify.handleSleep: suspending:", this.suspended), n.then((o) => {
					this.suspended = void 0, p("asyncify.handleSleep: resolved:", o), r(o);
				}, (o) => {
					p("asyncify.handleSleep: rejected:", o), console.error("QuickJS: cannot handle error in suspended function", o), this.suspended = void 0;
				});
			} catch (n) {
				throw p("asyncify.handleSleep: error:", n), this.suspended = void 0, n;
			}
		});
		let t = e();
		if (t instanceof Promise) throw new Error("Promise return value not supported in non-asyncify context.");
		return t;
	}
};
function ie(s, i$1) {
	i$1.interruptHandler && s.setInterruptHandler(i$1.interruptHandler), i$1.maxStackSizeBytes !== void 0 && s.setMaxStackSize(i$1.maxStackSizeBytes), i$1.memoryLimitBytes !== void 0 && s.setMemoryLimit(i$1.memoryLimitBytes);
}
function ne(s, i$1) {
	i$1.moduleLoader && s.setModuleLoader(i$1.moduleLoader), i$1.shouldInterrupt && s.setInterruptHandler(i$1.shouldInterrupt), i$1.memoryLimitBytes !== void 0 && s.setMemoryLimit(i$1.memoryLimitBytes), i$1.maxStackSizeBytes !== void 0 && s.setMaxStackSize(i$1.maxStackSizeBytes);
}
var X = class {
	constructor(i$1, e) {
		this.module = i$1, this.ffi = e, this.callbacks = new j(i$1);
	}
	newRuntime(i$1 = {}) {
		let e = new c(this.ffi.QTS_NewRuntime(), void 0, (r) => {
			this.callbacks.deleteRuntime(r), this.ffi.QTS_FreeRuntime(r);
		}), t = new E({
			module: this.module,
			callbacks: this.callbacks,
			ffi: this.ffi,
			rt: e
		});
		return ie(t, i$1), i$1.moduleLoader && t.setModuleLoader(i$1.moduleLoader), t;
	}
	newContext(i$1 = {}) {
		let e = this.newRuntime(), t = e.newContext({
			...i$1,
			ownedLifetimes: W(e, i$1.ownedLifetimes)
		});
		return e.context = t, t;
	}
	evalCode(i$1, e = {}) {
		return h.withScope((t) => {
			let r = t.manage(this.newContext());
			ne(r.runtime, e);
			let n = r.evalCode(i$1, "eval.js");
			if (e.memoryLimitBytes !== void 0 && r.runtime.setMemoryLimit(-1), n.error) throw r.dump(t.manage(n.error));
			return r.dump(t.manage(n.value));
		});
	}
	getWasmMemory() {
		let e = this.module.quickjsEmscriptenInit?.(() => {})?.getWasmMemory?.();
		if (!e) throw new Error("Variant does not support getting WebAssembly.Memory");
		return e;
	}
	getFFI() {
		return this.ffi;
	}
};

//#endregion
export { ne as i, ie as n, j as r, X as t };