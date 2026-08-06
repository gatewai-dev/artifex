import { i as HTTPException, n as decodeURIComponent_, r as tryDecode } from "./dist-DNUa9xfL.mjs";

//#region ../../node_modules/.pnpm/hono@4.12.5/node_modules/hono/dist/utils/cookie.js
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/;
var parse = (cookie, name) => {
	if (name && cookie.indexOf(name) === -1) return {};
	const pairs = cookie.trim().split(";");
	const parsedCookie = {};
	for (let pairStr of pairs) {
		pairStr = pairStr.trim();
		const valueStartPos = pairStr.indexOf("=");
		if (valueStartPos === -1) continue;
		const cookieName = pairStr.substring(0, valueStartPos).trim();
		if (name && name !== cookieName || !validCookieNameRegEx.test(cookieName)) continue;
		let cookieValue = pairStr.substring(valueStartPos + 1).trim();
		if (cookieValue.startsWith("\"") && cookieValue.endsWith("\"")) cookieValue = cookieValue.slice(1, -1);
		if (validCookieValueRegEx.test(cookieValue)) {
			parsedCookie[cookieName] = cookieValue.indexOf("%") !== -1 ? tryDecode(cookieValue, decodeURIComponent_) : cookieValue;
			if (name) break;
		}
	}
	return parsedCookie;
};

//#endregion
//#region ../../node_modules/.pnpm/hono@4.12.5/node_modules/hono/dist/helper/cookie/index.js
var getCookie = (c, key, prefix) => {
	const cookie = c.req.raw.headers.get("Cookie");
	if (typeof key === "string") {
		if (!cookie) return;
		let finalKey = key;
		if (prefix === "secure") finalKey = "__Secure-" + key;
		else if (prefix === "host") finalKey = "__Host-" + key;
		return parse(cookie, finalKey)[finalKey];
	}
	if (!cookie) return {};
	return parse(cookie);
};

//#endregion
//#region ../../node_modules/.pnpm/hono@4.12.5/node_modules/hono/dist/utils/buffer.js
var bufferToFormData = (arrayBuffer, contentType) => {
	return new Response(arrayBuffer, { headers: { "Content-Type": contentType } }).formData();
};

//#endregion
//#region ../../node_modules/.pnpm/hono@4.12.5/node_modules/hono/dist/validator/validator.js
var jsonRegex = /^application\/([a-z-\.]+\+)?json(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;
var multipartRegex = /^multipart\/form-data(;\s?boundary=[a-zA-Z0-9'"()+_,\-./:=?]+)?$/;
var urlencodedRegex = /^application\/x-www-form-urlencoded(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;
var validator = (target, validationFunc) => {
	return async (c, next) => {
		let value = {};
		const contentType = c.req.header("Content-Type");
		switch (target) {
			case "json":
				if (!contentType || !jsonRegex.test(contentType)) break;
				try {
					value = await c.req.json();
				} catch {
					throw new HTTPException(400, { message: "Malformed JSON in request body" });
				}
				break;
			case "form": {
				if (!contentType || !(multipartRegex.test(contentType) || urlencodedRegex.test(contentType))) break;
				let formData;
				if (c.req.bodyCache.formData) formData = await c.req.bodyCache.formData;
				else try {
					formData = await bufferToFormData(await c.req.arrayBuffer(), contentType);
					c.req.bodyCache.formData = formData;
				} catch (e) {
					let message = "Malformed FormData request.";
					message += e instanceof Error ? ` ${e.message}` : ` ${String(e)}`;
					throw new HTTPException(400, { message });
				}
				const form = /* @__PURE__ */ Object.create(null);
				formData.forEach((value2, key) => {
					if (key.endsWith("[]")) (form[key] ??= []).push(value2);
					else if (Array.isArray(form[key])) form[key].push(value2);
					else if (Object.hasOwn(form, key)) form[key] = [form[key], value2];
					else form[key] = value2;
				});
				value = form;
				break;
			}
			case "query":
				value = Object.fromEntries(Object.entries(c.req.queries()).map(([k, v]) => {
					return v.length === 1 ? [k, v[0]] : [k, v];
				}));
				break;
			case "param":
				value = c.req.param();
				break;
			case "header":
				value = c.req.header();
				break;
			case "cookie":
				value = getCookie(c);
				break;
		}
		const res = await validationFunc(value, c);
		if (res instanceof Response) return res;
		c.req.addValidatedData(target, res);
		return await next();
	};
};

//#endregion
//#region ../../node_modules/.pnpm/@hono+zod-validator@0.7.6_hono@4.12.5_zod@4.3.6/node_modules/@hono/zod-validator/dist/index.js
function zValidatorFunction(target, schema, hook, options) {
	return validator(target, async (value, c) => {
		let validatorValue = value;
		if (target === "header" && "_def" in schema || target === "header" && "_zod" in schema) {
			const schemaKeys = Object.keys("in" in schema ? schema.in.shape : schema.shape);
			const caseInsensitiveKeymap = Object.fromEntries(schemaKeys.map((key) => [key.toLowerCase(), key]));
			validatorValue = Object.fromEntries(Object.entries(value).map(([key, value$1]) => [caseInsensitiveKeymap[key] || key, value$1]));
		}
		const result = options && options.validationFunction ? await options.validationFunction(schema, validatorValue) : await schema.safeParseAsync(validatorValue);
		if (hook) {
			const hookResult = await hook({
				data: validatorValue,
				...result,
				target
			}, c);
			if (hookResult) {
				if (hookResult instanceof Response) return hookResult;
				if ("response" in hookResult) return hookResult.response;
			}
		}
		if (!result.success) return c.json(result, 400);
		return result.data;
	});
}
const zValidator = zValidatorFunction;

//#endregion
export { getCookie as n, zValidator as t };