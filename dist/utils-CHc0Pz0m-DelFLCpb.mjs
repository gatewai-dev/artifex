//#region ../../nodes/node-mesh-warp/dist/utils-CHc0Pz0m.mjs
function createUniformGrid(cols, rows) {
	const points = [];
	for (let r = 0; r < rows; r++) {
		const y = r / (rows - 1) * 100;
		for (let c = 0; c < cols; c++) {
			const x = c / (cols - 1) * 100;
			points.push({
				x,
				y
			});
		}
	}
	return points;
}

//#endregion
export { createUniformGrid as t };