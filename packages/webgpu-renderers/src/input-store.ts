import { ALL_FORMATS, Input, UrlSource } from "mediabunny";

class InputStore {
	private store = new Map<
		string,
		{ promise: Promise<Input>; refCount: number }
	>();

	async acquire(url: string): Promise<Input> {
		if (!url) throw new Error("Cannot acquire Input for empty URL");
		let shared = this.store.get(url);
		if (!shared) {
			const promise = (async () => {
				return new Input({
					source: new UrlSource(url),
					formats: ALL_FORMATS,
				});
			})();
			promise.catch(() => {
				this.store.delete(url);
			});
			shared = { promise, refCount: 0 };
			this.store.set(url, shared);
		}
		shared.refCount++;
		return shared.promise;
	}

	release(url: string): void {
		if (!url) return;
		const shared = this.store.get(url);
		if (!shared) return;

		shared.refCount--;
		if (shared.refCount <= 0) {
			this.store.delete(url);
			shared.promise.then(
				(input) => {
					try {
						input.dispose();
					} catch (_) {}
				},
				() => {},
			);
		}
	}
}

export const inputStore = new InputStore();
