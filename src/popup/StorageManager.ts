// src/popup/StorageManager.ts
import * as browser from "webextension-polyfill";

export class StorageManager {
  async getStorageItem(key: string): Promise<any> {
    return await browser.storage.local.get(key);
  }

  async setStorageItem(key: string, value: any): Promise<void> {
    await browser.storage.local.set({ [key]: value });
  }

  addKeyword(keyword: string): Promise<void> {
    return this.addStorageItem("blockedKeywords", keyword);
  }

  addDomain(domain: string): Promise<void> {
    return this.addStorageItem("blockedDomains", domain);
  }

  getKeywords(): Promise<string[]> {
    return this.getStorageItem("blockedKeywords");
  }

  getDomains(): Promise<string[]> {
    return this.getStorageItem("blockedDomains");
  }

  private async addStorageItem(key: string, value: any): Promise<void> {
    await browser.storage.local.set({ [key]: value });
  }
}
