// src/popup/StorageManager.ts

import * as browser from "webextension-polyfill";

export interface BlockedDomain {
  // "discriminated union"
  type: "domain";
  value: string;
}

export interface BlockedKeyword {
  // ...or "tagged union"
  type: "keyword";
  value: string;
}

export type BlockedItem = BlockedDomain | BlockedKeyword;

export interface StorageItems {
  id: string;
  name: string;
}

export class StorageManager {
  private validateStorageItem(
    key: string,
    value: any
  ): asserts value is BlockedItem[] {
    if (
      !Array.isArray(value) ||
      value.some((item) => typeof item !== "object")
    ) {
      throw new Error(
        `Invalid value for storage item ${key}: ${JSON.stringify(value)}`
      );
    }
  }

  async getStorageItem(key: string): Promise<BlockedItem[]> {
    try {
      const result = await browser.storage.local.get(key);
      const deserializedValue = JSON.parse(result[key]);
      this.validateStorageItem(key, deserializedValue);
      return deserializedValue;
    } catch (e) {
      console.error(`Error getting storage item ${key}:`, e);
      throw e;
    }
  }

  async setStorageItems(key: string, value: BlockedItem[]): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await browser.storage.local.set({ [key]: serializedValue });
    } catch (e) {
      console.error(`Failed to set storage item ${key}:`, e);
      throw e;
    }
  }

  async getKeywords(): Promise<BlockedItem[]> {
    try {
      const result = await this.getStorageItem("blockedKeywords");
      this.validateStorageItem("blockedKeywords", result);
      return Array.isArray(result) ? result : [];
    } catch (e) {
      console.error("Error getting blocked keywords:", e);
      return [];
    }
  }

  async getDomains(): Promise<BlockedItem[]> {
    try {
      const result = await this.getStorageItem("blockedDomains");
      this.validateStorageItem("blockedDomains", result);
      return Array.isArray(result) ? result : [];
    } catch (e) {
      console.error("Error getting blocked domains:", e);
      return [];
    }
  }

  private validateInput(input: any): asserts input is BlockedItem[] {
    if (
      !Array.isArray(input) ||
      input.some((item) => typeof item !== "object")
    ) {
      throw new Error(`Invalid input: ${JSON.stringify(input)}`);
    }
  }

  async setKeywords(keywords: BlockedItem[]): Promise<void> {
    try {
      this.validateInput(keywords);
      console.log("Setting blocked keywords to", keywords);
      await browser.storage.local.set({ blockedKeywords: keywords });
    } catch (e) {
      console.error("Error setting blocked keywords:", e);
      throw e;
    }
  }

  async setDomains(domains: BlockedItem[]): Promise<void> {
    try {
      this.validateInput(domains);
      console.log("Setting blocked domains to", domains);
      await browser.storage.local.set({ blockedDomains: domains });
    } catch (e) {
      console.error("Error setting blocked domains:", e);
      throw e;
    }
  }
}
