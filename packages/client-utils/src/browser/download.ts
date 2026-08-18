interface FilePickerWindow extends Window {
	showSaveFilePicker?: (options?: unknown) => Promise<FileSystemFileHandle>;
}

export async function saveFileViaPicker(
	blob: Blob,
	suggestedName: string,
	description?: string,
) {
	try {
		const win = window as FilePickerWindow;
		if (win.showSaveFilePicker) {
			const handle = await win.showSaveFilePicker({
				suggestedName,
				types: [
					{
						description: description || "File",
						accept: {
							[blob.type || "application/octet-stream"]: [
								`.${suggestedName.split(".").pop()}`,
							],
						},
					},
				],
			});
			const writable = await handle.createWritable();
			await writable.write(blob);
			await writable.close();
			return true;
		}
	} catch (err) {
		if ((err as Error).name === "AbortError") {
			return true; // User cancelled
		}
		console.error("File picker failed:", err);
	}
	return false;
}

export async function saveFileStreaming(
	url: string,
	suggestedName: string,
	description?: string,
) {
	try {
		const win = window as FilePickerWindow;
		if (!win.showSaveFilePicker) return false;

		const response = await fetch(url);
		if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
		if (!response.body) throw new Error("Response body is null");

		const contentType =
			response.headers.get("content-type") || "application/octet-stream";
		const extension = suggestedName.split(".").pop();

		const handle = await win.showSaveFilePicker({
			suggestedName,
			types: [
				{
					description: description || "File",
					accept: {
						[contentType]: [`.${extension}`],
					},
				},
			],
		});

		const writable = await handle.createWritable();
		await response.body.pipeTo(writable);
		return true;
	} catch (err) {
		if ((err as Error).name === "AbortError") {
			return true; // User cancelled
		}
		console.error("Streaming save failed:", err);
		return false;
	}
}

export function triggerNativeDownload(url: string, filename?: string) {
	const link = document.createElement("a");
	link.href = url;
	if (filename) {
		link.download = filename;
	}
	// Only open in a new tab if it is a remote/cross-origin URL, to bypass popup blockers for local blobs
	if (!url.startsWith("blob:")) {
		link.target = "_blank";
		link.rel = "noopener noreferrer";
	}

	link.style.display = "none";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

export async function downloadFileLegacy(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	triggerNativeDownload(url, filename);
	setTimeout(() => URL.revokeObjectURL(url), 100);
}
