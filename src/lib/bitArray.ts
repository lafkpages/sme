export class BitArray {
	buffer = 0n;

	get(index: bigint) {
		return ((this.buffer >> index) & 1n) as 0n | 1n;
	}

	set(index: bigint, value: 0n | 1n | 0 | 1 | boolean) {
		this.buffer = value ? this.buffer | (1n << index) : this.buffer & ~(1n << index);
	}

	toUint8Array(byteLength: number) {
		const result = new Uint8Array(byteLength);
		for (let i = 0n; i < byteLength; i++) {
			result[Number(i)] = Number((this.buffer >> (i * 8n)) & 0xffn);
		}
		return result;
	}

	static fromUint8Array(array: Uint8Array) {
		const result = new BitArray();
		for (let i = 0n; i < array.length; i++) {
			result.buffer |= BigInt(array[Number(i)]) << (i * 8n);
		}
		return result;
	}
}
