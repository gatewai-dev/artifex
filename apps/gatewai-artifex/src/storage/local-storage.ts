import { createReadStream, existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import type { StorageService } from "@gatewai.studio/server-utils";
import { injectable } from "inversify";

export function getLocalStorageDir(): string {
	return process.env.GATEWAI_STORAGE_DIR
		? path.resolve(process.env.GATEWAI_STORAGE_DIR)
		: path.resolve(process.cwd(), "gw-assets");
}

@injectable()
export class LocalStorageService implements StorageService {
	private storageDir: string;

	constructor(storageDir?: string) {
		this.storageDir = storageDir
			? path.resolve(storageDir)
			: getLocalStorageDir();
	}

	getStorageDir(): string {
		return this.storageDir;
	}

	private getLocalPath(key: string): string {
		if (path.isAbsolute(key)) return key;
		return path.join(this.storageDir, key);
	}

	async uploadToStorage(buffer: Buffer, key: string): Promise<void> {
		const filePath = this.getLocalPath(key);
		await fs.mkdir(path.dirname(filePath), { recursive: true });
		await fs.writeFile(filePath, buffer);
	}

	async uploadFileToStorage(filePath: string, key: string): Promise<void> {
		const dest = this.getLocalPath(key);
		await fs.mkdir(path.dirname(dest), { recursive: true });
		await fs.copyFile(filePath, dest);
	}

	async getFromStorage(key: string): Promise<Buffer> {
		return fs.readFile(this.getLocalPath(key));
	}

	async fileExistsInStorage(key: string): Promise<boolean> {
		return existsSync(this.getLocalPath(key));
	}

	async deleteFromStorage(key: string): Promise<void> {
		await fs.unlink(this.getLocalPath(key)).catch(() => {});
	}

	getPublicUrl(key: string): string {
		return `file://${this.getLocalPath(key)}`;
	}

	async generateSignedUrl(key: string): Promise<string> {
		return this.getPublicUrl(key);
	}

	async generateSignedPutUrl(key: string): Promise<string> {
		return this.getPublicUrl(key);
	}

	getStreamFromStorage(key: string) {
		return createReadStream(this.getLocalPath(key)) as any;
	}

	async getObjectMetadata(key: string) {
		const stats = await fs.stat(this.getLocalPath(key));
		return {
			ContentLength: stats.size,
			ContentType: key.endsWith(".mp4")
				? "video/mp4"
				: key.endsWith(".mp3")
					? "audio/mpeg"
					: key.endsWith(".png")
						? "image/png"
						: key.endsWith(".jpg") || key.endsWith(".jpeg")
							? "image/jpeg"
							: key.endsWith(".gif")
								? "image/gif"
								: "application/octet-stream",
		};
	}

	async listFromStorage(): Promise<string[]> {
		return [];
	}

	async uploadToTemporaryStorageFolder(
		buffer: Buffer,
		_mimeType: string,
		key: string,
	) {
		await this.uploadToStorage(buffer, key);
		return { key };
	}
}
