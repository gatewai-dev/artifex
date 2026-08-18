import { injectable } from "inversify";

export interface MockFileAsset {
	id: string;
	name: string;
	key: string;
	bucket: string;
	mimeType: string;
	size: number;
	width: number | null;
	height: number | null;
	duration: number | null;
	fps: number | null;
	fingerprint: string | null;
	createdAt: Date;
}

@injectable()
export class MockPrismaClient {
	private assets = new Map<string, MockFileAsset>();

	fileAsset = {
		create: async ({ data }: { data: any }) => {
			const asset: MockFileAsset = {
				id:
					data.id ??
					`asset-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
				createdAt: new Date(),
				width: data.width ?? null,
				height: data.height ?? null,
				duration: data.duration ?? null,
				fps: data.fps ?? null,
				fingerprint: data.fingerprint ?? null,
				...data,
			};
			this.assets.set(asset.id, asset);
			return asset;
		},
		findUnique: async ({ where }: { where: { id: string } }) => {
			return this.assets.get(where.id) ?? null;
		},
		findFirst: async ({ where }: { where: { fingerprint?: string } }) => {
			if (where?.fingerprint) {
				for (const asset of this.assets.values()) {
					if (asset.fingerprint === where.fingerprint) {
						return asset;
					}
				}
			}
			return null;
		},
		delete: async ({ where }: { where: { id: string } }) => {
			this.assets.delete(where.id);
			return { id: where.id };
		},
	};

	$transaction = async (cb: (tx: MockPrismaClient) => Promise<any>) => {
		return cb(this);
	};
}
