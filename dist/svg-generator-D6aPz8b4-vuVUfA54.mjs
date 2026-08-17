//#region ../../nodes/node-shape-generator/dist/svg-generator-D6aPz8b4.mjs
/**
* Scale corner radii proportionally if their sum exceeds the box dimensions (W3C CSS standard).
*/
function normalizeCornerRadii(w, h, rTL, rTR, rBR, rBL) {
	const topSum = rTL + rTR;
	const bottomSum = rBL + rBR;
	const leftSum = rTL + rBL;
	const rightSum = rTR + rBR;
	let scale = 1;
	if (topSum > w && topSum > 0) scale = Math.min(scale, w / topSum);
	if (bottomSum > w && bottomSum > 0) scale = Math.min(scale, w / bottomSum);
	if (leftSum > h && leftSum > 0) scale = Math.min(scale, h / leftSum);
	if (rightSum > h && rightSum > 0) scale = Math.min(scale, h / rightSum);
	return [
		Math.max(0, rTL * scale),
		Math.max(0, rTR * scale),
		Math.max(0, rBR * scale),
		Math.max(0, rBL * scale)
	];
}
/**
* Generates an SVG path string for a rounded rectangle with 4 independent corner radii.
*/
function buildRectanglePath(w, h, rTL, rTR, rBR, rBL, strokeWidth = 0) {
	const inset = strokeWidth > 0 ? strokeWidth / 2 : 0;
	const x = inset;
	const y = inset;
	const boxW = Math.max(.1, w - strokeWidth);
	const boxH = Math.max(.1, h - strokeWidth);
	const [rtl, rtr, rbr, rbl] = normalizeCornerRadii(boxW, boxH, rTL, rTR, rBR, rBL);
	return [
		`M ${x + rtl} ${y}`,
		`L ${x + boxW - rtr} ${y}`,
		rtr > 0 ? `A ${rtr} ${rtr} 0 0 1 ${x + boxW} ${y + rtr}` : "",
		`L ${x + boxW} ${y + boxH - rbr}`,
		rbr > 0 ? `A ${rbr} ${rbr} 0 0 1 ${x + boxW - rbr} ${y + boxH}` : "",
		`L ${x + rbl} ${y + boxH}`,
		rbl > 0 ? `A ${rbl} ${rbl} 0 0 1 ${x} ${y + boxH - rbl}` : "",
		`L ${x} ${y + rtl}`,
		rtl > 0 ? `A ${rtl} ${rtl} 0 0 1 ${x + rtl} ${y}` : "",
		"Z"
	].filter(Boolean).join(" ");
}
/**
* Generates an SVG path string for an ellipse/circle.
*/
function buildEllipsePath(w, h, strokeWidth = 0) {
	const cx = w / 2;
	const cy = h / 2;
	const rx = Math.max(.1, (w - strokeWidth) / 2);
	const ry = Math.max(.1, (h - strokeWidth) / 2);
	return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
}
/**
* Generates an SVG path string for a regular polygon with N sides.
*/
function buildPolygonPath(w, h, sides, strokeWidth = 0) {
	const n = Math.max(3, Math.min(64, Math.floor(sides)));
	const cx = w / 2;
	const cy = h / 2;
	const radius = Math.max(.1, Math.min(w - strokeWidth, h - strokeWidth) / 2);
	const points = [];
	const angleStep = 2 * Math.PI / n;
	const startAngle = -Math.PI / 2;
	for (let i = 0; i < n; i++) {
		const angle = startAngle + i * angleStep;
		points.push({
			x: cx + radius * Math.cos(angle),
			y: cy + radius * Math.sin(angle)
		});
	}
	return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(3)} ${p.y.toFixed(3)}`).join(" ") + " Z";
}
/**
* Generates an SVG path string for a star with N spikes and configurable inner radius ratio.
*/
function buildStarPath(w, h, pointsCount, innerRadiusRatio, strokeWidth = 0) {
	const n = Math.max(3, Math.min(64, Math.floor(pointsCount)));
	const ratio = Math.max(.01, Math.min(.99, innerRadiusRatio));
	const cx = w / 2;
	const cy = h / 2;
	const outerRadius = Math.max(.1, Math.min(w - strokeWidth, h - strokeWidth) / 2);
	const innerRadius = outerRadius * ratio;
	const points = [];
	const totalVertices = n * 2;
	const angleStep = Math.PI / n;
	const startAngle = -Math.PI / 2;
	for (let i = 0; i < totalVertices; i++) {
		const r = i % 2 === 0 ? outerRadius : innerRadius;
		const angle = startAngle + i * angleStep;
		points.push({
			x: cx + r * Math.cos(angle),
			y: cy + r * Math.sin(angle)
		});
	}
	return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(3)} ${p.y.toFixed(3)}`).join(" ") + " Z";
}
/**
* Generates an SVG path string for a parametric arrow pointing right.
*/
function buildArrowPath(w, h, headWidth, headLength, shaftWidth, strokeWidth = 0) {
	const inset = strokeWidth > 0 ? strokeWidth / 2 : 0;
	const boxW = Math.max(1, w - strokeWidth);
	const boxH = Math.max(1, h - strokeWidth);
	const cy = h / 2;
	const hw = Math.min(boxH, Math.max(4, headWidth));
	const hl = Math.min(boxW * .9, Math.max(4, headLength));
	const sw = Math.min(hw * .95, Math.max(2, shaftWidth));
	const leftX = inset;
	const rightX = inset + boxW;
	const headBaseX = rightX - hl;
	const topShaftY = cy - sw / 2;
	const bottomShaftY = cy + sw / 2;
	const topHeadY = cy - hw / 2;
	const bottomHeadY = cy + hw / 2;
	return [
		`M ${leftX.toFixed(2)} ${topShaftY.toFixed(2)}`,
		`L ${headBaseX.toFixed(2)} ${topShaftY.toFixed(2)}`,
		`L ${headBaseX.toFixed(2)} ${topHeadY.toFixed(2)}`,
		`L ${rightX.toFixed(2)} ${cy.toFixed(2)}`,
		`L ${headBaseX.toFixed(2)} ${bottomHeadY.toFixed(2)}`,
		`L ${headBaseX.toFixed(2)} ${bottomShaftY.toFixed(2)}`,
		`L ${leftX.toFixed(2)} ${bottomShaftY.toFixed(2)}`,
		"Z"
	].join(" ");
}
/**
* Calculates linear gradient coordinate vector from an angle in degrees.
*/
function calculateLinearGradientCoords(angleDeg = 0) {
	const rad = angleDeg * Math.PI / 180;
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);
	const x1 = ((.5 - cos * .5) * 100).toFixed(2);
	const y1 = ((.5 - sin * .5) * 100).toFixed(2);
	const x2 = ((.5 + cos * .5) * 100).toFixed(2);
	const y2 = ((.5 + sin * .5) * 100).toFixed(2);
	return {
		x1: `${x1}%`,
		y1: `${y1}%`,
		x2: `${x2}%`,
		y2: `${y2}%`
	};
}
/**
* Builds the complete shape geometry path for any ShapeGenerator config.
*/
function generateShapePath(config) {
	const width = Math.max(1, config.width ?? 500);
	const height = Math.max(1, config.height ?? 500);
	const strokeWidth = config.strokeWidth ?? 0;
	switch (config.shapeType) {
		case "Rectangle": return buildRectanglePath(width, height, config.radiusTL ?? 0, config.radiusTR ?? 0, config.radiusBR ?? 0, config.radiusBL ?? 0, strokeWidth);
		case "Ellipse": return buildEllipsePath(width, height, strokeWidth);
		case "Polygon": return buildPolygonPath(width, height, config.polygonSides ?? 5, strokeWidth);
		case "Star": return buildStarPath(width, height, config.starPoints ?? 5, config.starInnerRadius ?? .5, strokeWidth);
		case "Arrow": return buildArrowPath(width, height, config.arrowHeadWidth ?? 40, config.arrowHeadLength ?? 40, config.arrowShaftWidth ?? 20, strokeWidth);
		case "CustomPath": return config.customPath?.trim() || buildRectanglePath(width, height, 0, 0, 0, 0, strokeWidth);
		default: return buildRectanglePath(width, height, 0, 0, 0, 0, strokeWidth);
	}
}
/**
* Generates an SVG string representation of the parametric shape configuration.
*/
function generateShapeSvg(config) {
	const width = Math.max(1, config.width ?? 500);
	const height = Math.max(1, config.height ?? 500);
	const pathD = generateShapePath(config);
	const fillType = config.fillType ?? "solid";
	const fillColor = config.fillColor ?? "#3b82f6";
	const gradientEndColor = config.gradientEndColor ?? "#1d4ed8";
	const gradientAngle = config.gradientAngle ?? 0;
	const strokeColor = config.strokeColor ?? "#ffffff";
	const strokeWidth = Math.max(0, config.strokeWidth ?? 0);
	const strokeDashArray = config.strokeDashArray?.trim();
	const strokeLineCap = config.strokeLineCap ?? "round";
	const strokeLineJoin = config.strokeLineJoin ?? "round";
	const strokeDashOffset = config.strokeDashOffset ?? 0;
	const rotation = config.rotation ?? 0;
	const opacity = Math.max(0, Math.min(1, config.opacity ?? 1));
	const customPathScale = config.shapeType === "CustomPath" ? config.customPathScale ?? 1 : 1;
	const gradId = `gw_shape_grad_${Math.abs(Math.round(gradientAngle) * 31 + (fillType === "linear" ? 1 : 2))}`;
	let defs = "";
	let fillAttr = fillColor;
	if (fillType === "none") fillAttr = "none";
	else if (fillType === "linear") {
		const coords = calculateLinearGradientCoords(gradientAngle);
		defs = `<defs><linearGradient id="${gradId}" x1="${coords.x1}" y1="${coords.y1}" x2="${coords.x2}" y2="${coords.y2}"><stop offset="0%" stop-color="${fillColor}"/><stop offset="100%" stop-color="${gradientEndColor}"/></linearGradient></defs>`;
		fillAttr = `url(#${gradId})`;
	} else if (fillType === "radial") {
		defs = `<defs><radialGradient id="${gradId}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${fillColor}"/><stop offset="100%" stop-color="${gradientEndColor}"/></radialGradient></defs>`;
		fillAttr = `url(#${gradId})`;
	}
	const strokeAttrs = strokeWidth > 0 ? `stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="${strokeLineCap}" stroke-linejoin="${strokeLineJoin}" ${strokeDashArray ? `stroke-dasharray="${strokeDashArray}"` : ""} ${strokeDashOffset ? `stroke-dashoffset="${strokeDashOffset}"` : ""}` : "stroke=\"none\"";
	const cx = width / 2;
	const cy = height / 2;
	const transformParts = [];
	if (rotation !== 0) transformParts.push(`rotate(${rotation} ${cx} ${cy})`);
	if (customPathScale !== 1) transformParts.push(`scale(${customPathScale})`);
	const transformAttr = transformParts.length > 0 ? `transform="${transformParts.join(" ")}"` : "";
	const opacityAttr = opacity < 1 ? `opacity="${opacity}"` : "";
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${defs}<g ${transformAttr} ${opacityAttr}><path d="${pathD}" fill="${fillAttr}" ${strokeAttrs} /></g></svg>`;
}
/**
* Encodes the SVG into a base64 data URL for robust cross-environment rendering.
*/
function generateShapeSvgDataUrl(config) {
	const svgString = generateShapeSvg(config);
	if (typeof Buffer !== "undefined") return `data:image/svg+xml;base64,${Buffer.from(svgString).toString("base64")}`;
	return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
}

//#endregion
export { generateShapeSvgDataUrl as n, generateShapeSvg as t };