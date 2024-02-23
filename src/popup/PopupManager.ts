// src/popup/PopupManager.ts
import { StorageManager } from "./StorageManager";
import { UIManager } from "./UIManager";

export class PopupManager {
  private storageManager: StorageManager;
  private uiManager: UIManager;

  constructor() {
    this.storageManager = new StorageManager();
    this.uiManager = new UIManager();
    console.log("PopupManager initialized");
    // Bind methods if necessary
    this.restoreOptions = this.restoreOptions.bind(this);
    this.handleAddKeyword = this.handleAddKeyword.bind(this);
    this.handleAddDomain = this.handleAddDomain.bind(this);

    this.setupEventListeners();
  }

  async restoreOptions() {
    const keywords = await this.storageManager.getKeywords();
    const domains = await this.storageManager.getDomains();
    this.uiManager.displayKeywords(keywords);
    this.uiManager.displayDomains(domains);
  }

  setupEventListeners(): void {
    // Event listeners setup remains the same
  }

  async handleAddKeyword(event: MouseEvent): Promise<void> {
    // Extract keyword from input and call addKeyword
    // Make sure to replace "extracted_keyword" with actual extraction logic
    const keywordInput: HTMLInputElement = document.getElementById('new-keyword') as HTMLInputElement;
    if (keywordInput) {
      const keyword = keywordInput.value.trim();
      if (keyword) {
        await this.addKeyword(keyword);
        // Clear the input field after adding the keyword
        keywordInput.value = '';
      }
    }
  }

  async addKeyword(keyword: string): Promise<void> {
    // Use storageManager to interact with storage
    let keywords = await this.storageManager.getKeywords();
    if (!keywords.includes(keyword)) {
      keywords.push(keyword);
      await this.storageManager.setKeywords(keywords);
      // Optionally, refresh the keywords list display
      this.uiManager.displayKeywords(keywords);
    }
  }

  async handleAddDomain(event: MouseEvent): Promise<void> {
    // Extract domain from input and call addDomain
    // Make sure to replace "extracted_domain" with actual extraction logic
    const domainInput: HTMLInputElement = document.getElementById('new-domain') as HTMLInputElement;
    if (domainInput) {
      const domain = domainInput.value.trim();
      if (domain) {
        await this.addDomain(domain);
        // Clear the input field after adding the domain
        domainInput.value = '';
      }
    }
  }

  async addDomain(domain: string): Promise<void> {
    // Use storageManager to interact with storage
    let domains = await this.storageManager.getDomains();
    if (!domains.includes(domain)) {
      domains.push(domain);
      await this.storageManager.setDomains(domains);
      // Optionally, refresh the domains list display
      this.uiManager.displayDomains(domains);
    }
  }

  // Additional methods for removeKeyword, removeDomain, etc.
}
