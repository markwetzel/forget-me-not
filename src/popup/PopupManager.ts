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
    // Ensure 'this' within the callback refers to the class instance
    this.restoreOptions = this.restoreOptions.bind(this);
    this.addKeyword = this.addKeyword.bind(this);
    this.addDomain = this.addDomain.bind(this);

    this.setupEventListeners();
  }

  async restoreOptions() {
    const keywords = await this.storageManager.getKeywords();
    const domains = await this.storageManager.getDomains();
    this.uiManager.displayKeywords(keywords);
    this.uiManager.displayDomains(domains);
  }

  setupEventListeners(): void {
    document.addEventListener("DOMContentLoaded", this.restoreOptions);

    const addKeywordButton = document.getElementById("add-keyword");
    if (addKeywordButton) {
      // Note the change here: we don't pass a string, but an event to the handler
      addKeywordButton.addEventListener("click", (e) => this.handleAddKeyword(e));
    }

    const addDomainButton = document.getElementById("add-domain");
    if (addDomainButton) {
      // Note the change here: we don't pass a string, but an event to the handler
      addDomainButton.addEventListener("click", (e) => this.handleAddDomain(e));
    }
  }

  // Event handlers for UI actions
  async handleAddKeyword(event: MouseEvent): Promise<void> {
    // Implement logic to extract keyword from input and add it
    // This is just a placeholder for the actual implementation
    const keyword = "extracted_keyword"; // This should be replaced with actual extraction logic
    await this.addKeyword(keyword);
  }

  async addKeyword(keyword: string): Promise<void> {
    // Add a keyword using storageManager and update UI using uiManager
    await this.storageManager.addKeyword(keyword);
    // Assuming UIManager has a method to update the UI
    this.uiManager.updateKeywordsUI();
  }

  async handleAddDomain(event: MouseEvent): Promise<void> {
    // Similar to handleAddKeyword, implement logic for domains
    const domain = "extracted_domain"; // Replace with actual extraction logic
    await this.addDomain(domain);
  }

  async addDomain(domain: string): Promise<void> {
    // Add a domain using storageManager and update UI using uiManager
    await this.storageManager.addDomain(domain);
    // Assuming UIManager has a method to update the UI
    this.uiManager.updateDomainsUI();
  }

  // Additional methods for removeKeyword, removeDomain, etc.
  
}

// Usage
document.addEventListener("DOMContentLoaded", () => new PopupManager());
