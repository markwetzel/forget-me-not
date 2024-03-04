// src/background/BackgroundManager.ts

import * as browser from "webextension-polyfill";
import { BlockedItem, StorageManager } from "../popup/StorageManager";

class BackgroundManager {
  private storageManager: StorageManager;

  constructor() {
    this.storageManager = new StorageManager();
    console.log("BackgroundManager initialized");
    this.initializeDefaultSettings();
    this.setupHistoryFilter();
  }

  async initializeDefaultSettings(): Promise<void> {
    await this.initializeBlockedKeywords();
    await this.initializeBlockedDomains();
  }

  async initializeBlockedKeywords(): Promise<void> {
    let blockedKeywords = await this.storageManager.getKeywords();
    if (!blockedKeywords || blockedKeywords.length === 0) {
      const defaultKeywords = ["gonewild", "superstonk", "gme"];

      defaultKeywords.forEach(async (keyword) => {
        await this.storageManager.addStorageItem({
          type: "keyword",
          value: keyword,
        });
      });
    }
  }

  async initializeBlockedDomains(): Promise<void> {
    let blockedDomains = await this.storageManager.getDomains();
    // Check if blockedDomains are already initialized
    if (!blockedDomains || blockedDomains.length === 0) {
      const defaultDomains = [
        "reddit.com/r/gonewild",
        "reddit.com/r/Superstonk",
        "reddit-stream.com",
      ];

      // Use addStorageItem for each domain to ensure they're added according to the new system
      for (const domain of defaultDomains) {
        await this.storageManager.addStorageItem({
          type: "domain",
          value: domain,
        });
      }
    }
  }

  setupHistoryFilter(): void {
    const intervalInSeconds = 10;
    setInterval(() => this.filterHistory(), intervalInSeconds * 1000);
    console.log(`filterHistory will run every ${intervalInSeconds} seconds`);
  }

  async filterHistory(): Promise<void> {
    try {
      const blockedKeywords = await this.storageManager.getKeywords();
      const blockedDomains = await this.storageManager.getDomains();

      const historyItems = await browser.history.search({
        text: "",
        startTime: 0,
      });

      for (const item of historyItems) {
        if (item.url) {
          if (
            this.shouldDeleteForDomain(item.url, blockedDomains) ||
            this.shouldDeleteForKeyword(item.url, blockedKeywords)
          ) {
            console.log(`Deleting ${item.url}`);
            await browser.history.deleteUrl({ url: item.url });
          }
        }
      }
    } catch (error) {
      console.error("Error filtering history", error);
    }
  }

  private shouldDeleteForDomain(
    url: string,
    blockedDomains: BlockedItem[]
  ): boolean {
    try {
      if (!Array.isArray(blockedDomains)) {
        console.error("blockedDomains is not an array:", blockedDomains);
        return false;
      }
      const urlObj = new URL(url);
      return blockedDomains.some((domain) =>
        urlObj.hostname.includes(domain.value)
      );
    } catch (error) {
      console.error("Error parsing URL", error);
      return false;
    }
  }

  private shouldDeleteForKeyword(
    url: string,
    blockedKeywords: BlockedItem[]
  ): boolean {
    // Ensure blockedKeywords is treated as an array
    if (!Array.isArray(blockedKeywords)) {
      console.error("blockedKeywords is not an array:", blockedKeywords);
      return false;
    }
    const urlLower = url.toLowerCase();
    return blockedKeywords.some((keyword) =>
      urlLower.includes(keyword.value.toLowerCase())
    );
  }
}

// Assuming StorageManager is suitable for use here without modifications.
// If not, you may need to adjust it or create a background-specific version.

// Initialize BackgroundManager when the extension is loaded.
new BackgroundManager();
