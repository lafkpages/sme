import { describe, expect, test } from "bun:test";

import { BitArray } from "./bitArray";

describe("BitArray", () => {
  describe("get()", () => {
    test("returns 0n for unset bits", () => {
      const bitArray = new BitArray();
      expect(bitArray.get(0n)).toBe(0n);
      expect(bitArray.get(7n)).toBe(0n);
      expect(bitArray.get(64n)).toBe(0n);
    });

    test("returns 1n for set bits", () => {
      const bitArray = new BitArray();
      bitArray.set(3n, 1);
      expect(bitArray.get(3n)).toBe(1n);

      bitArray.set(15n, true);
      expect(bitArray.get(15n)).toBe(1n);
    });
  });

  describe("set()", () => {
    test("sets and clears bits with various value types", () => {
      const bitArray = new BitArray();

      // Set with boolean
      bitArray.set(0n, true);
      expect(bitArray.get(0n)).toBe(1n);

      // Set with number
      bitArray.set(1n, 1);
      expect(bitArray.get(1n)).toBe(1n);

      // Set with bigint
      bitArray.set(2n, 1n);
      expect(bitArray.get(2n)).toBe(1n);

      // Clear with boolean
      bitArray.set(0n, false);
      expect(bitArray.get(0n)).toBe(0n);

      // Clear with number
      bitArray.set(1n, 0);
      expect(bitArray.get(1n)).toBe(0n);

      // Clear with bigint
      bitArray.set(2n, 0n);
      expect(bitArray.get(2n)).toBe(0n);
    });

    test("handles large indices", () => {
      const bitArray = new BitArray();
      const bigIndex = 128n;

      bitArray.set(bigIndex, 1);
      expect(bitArray.get(bigIndex)).toBe(1n);

      bitArray.set(bigIndex, 0);
      expect(bitArray.get(bigIndex)).toBe(0n);
    });
  });

  describe("toUint8Array()", () => {
    test("converts buffer to correct byte representation", () => {
      const bitArray = new BitArray();
      bitArray.buffer = 0x1234n;

      const result = bitArray.toUint8Array(2);
      expect(result).toEqual(new Uint8Array([0x34, 0x12]));
    });

    test("pads with zeros when byteLength exceeds buffer size", () => {
      const bitArray = new BitArray();
      bitArray.buffer = 0xffn;

      const result = bitArray.toUint8Array(3);
      expect(result).toEqual(new Uint8Array([0xff, 0x00, 0x00]));
    });
  });

  describe("fromUint8Array()", () => {
    test("creates BitArray from Uint8Array", () => {
      const array = new Uint8Array([0x12, 0x34, 0x56]);
      const bitArray = BitArray.fromUint8Array(array);

      expect(bitArray.buffer).toBe(0x563412n);
    });

    test("handles empty array", () => {
      const array = new Uint8Array([]);
      const bitArray = BitArray.fromUint8Array(array);

      expect(bitArray.buffer).toBe(0n);
    });
  });
});
