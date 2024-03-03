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


  async addStorageItem(newItem: BlockedItem): Promise<void> {
    try {
      // Retrieve the existing list from localStorage
      const key = newItem.type;
      const storedValue = await browser.storage.local.get(key);
      const currentItems = storedValue[key] ? JSON.parse(storedValue[key]) : [];

      // Ensure we're working with an array and the newItem is not already included
      if (!Array.isArray(currentItems)) {
        console.error(`Existing data for key "${key}" is not an array.`);
        return;
      }

      if (currentItems.includes(newItem.value)) {
        console.log(`Item "${newItem.value}" is already in the list.`);
        return;
      }

      // Add the new item to the array and update localStorage
      const updatedItems = [...currentItems, newItem.value];
      await browser.storage.local.set({ [key]: JSON.stringify(updatedItems) });
    } catch (e) {
      console.error(`Failed to add storage item of type ${newItem.type}:`, e);
      throw e;
    }
  }

  async removeStorageItem(itemToRemove: BlockedItem): Promise<void> {
    try {
      // Retrieve the existing list from localStorage
      const key = itemToRemove.type;
      const storedValue = await browser.storage.local.get(key);
      const currentItems = storedValue[key] ? JSON.parse(storedValue[key]) : [];

      // Ensure we're working with an array
      if (!Array.isArray(currentItems)) {
        console.error(`Existing data for key "${key}" is not an array.`);
        return;
      }

      // Check if the item is in the array and remove it if present
      const itemIndex = currentItems.indexOf(itemToRemove.value);
      if (itemIndex !== -1) {
        currentItems.splice(itemIndex, 1);
        // Update localStorage with the new array
        await browser.storage.local.set({
          [key]: JSON.stringify(currentItems),
        });
      } else {
        console.log(`Item "${itemToRemove.value}" not found in the list.`);
      }
    } catch (e) {
      console.error(
        `Failed to remove storage item of type ${itemToRemove.type}:`,
        e
      );
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
