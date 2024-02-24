// src/popup/StorageManager.ts

import * as browser from "webextension-polyfill";

export class StorageManager {
  async getStorageItem(key: string): Promise<any> {
    // console.log(`Getting ${key} from storage`);
    return await browser.storage.local.get(key);
  }

  async setStorageItem(key: string, value: any): Promise<void> {
    console.log(`Setting ${key} to`, value);
    await browser.storage.local.set({ [key]: value });
  }

  async getKeywords(): Promise<string[]> {
    console.log("Getting blocked keywords");
    const result = await this.getStorageItem("blockedKeywords");
    console.log(result);
    return result.blockedKeywords || [];
  }

  async getDomains(): Promise<string[]> {
    console.log("Getting blocked domains");
    const result = await this.getStorageItem("blockedDomains");
    console.log(result);
    return result.blockedDomains || [];
  }

  async setKeywords(keywords: string[]): Promise<void> {
    console.log("Setting blocked keywords to", keywords);
    await browser.storage.local.set({ blockedKeywords: keywords });
  }

  async setDomains(domains: string[]): Promise<void> {
    console.log("Setting blocked domains to", domains);
    await browser.storage.local.set({ blockedDomains: domains });
  }
}
