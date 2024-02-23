// src/popup/StorageManager.ts
import * as browser from "webextension-polyfill";

export class StorageManager {
  async getStorageItem(key: string): Promise<any> {
    console.log(`Getting ${key} from storage`);
    return await browser.storage.local.get(key);
  }

  async setStorageItem(key: string, value: any): Promise<void> {
    console.log(`Setting ${key} to`, value);
    await browser.storage.local.set({ [key]: value });
  }

  addKeyword(keyword: string): Promise<void> {  
    console.log(`Adding ${keyword} to blockedKeywords`);
    return this.addStorageItem("blockedKeywords", keyword);
  }

  addDomain(domain: string): Promise<void> {
    console.log(`Adding ${domain} to blockedDomains`);
    return this.addStorageItem("blockedDomains", domain);
  }

  async getKeywords(): Promise<string[]> {
    console.log("Getting blocked keywords");
    const result = await this.getStorageItem("blockedKeywords");
    return result.blockedKeywords || []; // Ensure an array is returned
  }

  async getDomains(): Promise<string[]> {
    console.log("Getting blocked domains");
    const result = await this.getStorageItem("blockedDomains");
    return result.blockedDomains || []; // Ensure an array is returned
  }

  // Method to set (update) the list of blocked keywords
  async setKeywords(keywords: string[]): Promise<void> {
    console.log("Setting blocked keywords to", keywords);
    await browser.storage.local.set({ blockedKeywords: keywords });
  }

  // Method to set (update) the list of blocked domains
  async setDomains(domains: string[]): Promise<void> {
    console.log("Setting blocked domains to", domains);
    await browser.storage.local.set({ blockedDomains: domains });
  }

  private async addStorageItem(key: string, value: any): Promise<void> {
    console.log(`Adding ${value} to ${key}`);
    await browser.storage.local.set({ [key]: value });
  }
}
