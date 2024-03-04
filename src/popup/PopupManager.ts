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

    this.restoreOptions = this.restoreOptions.bind(this);
    this.handleAddKeyword = this.handleAddKeyword.bind(this);
    this.handleAddDomain = this.handleAddDomain.bind(this);

    this.setupEventListeners();

    // Update UI with initial data
    this.uiManager.updateKeywordsUI();
    this.uiManager.updateDomainsUI();
  }

  async restoreOptions() {
    const keywords = await this.storageManager.getKeywords();
    const domains = await this.storageManager.getDomains();
    this.uiManager.displayKeywords(keywords);
    this.uiManager.displayDomains(domains);
  }

  setupEventListeners(): void {
    const addKeywordButton = document.getElementById("add-keyword");
    const addDomainButton = document.getElementById("add-domain");

    if (addKeywordButton) {
      addKeywordButton.addEventListener("click", this.handleAddKeyword);
    } else {
      console.error("Can't find the add-keyword button. Is it hiding?");
    }

    if (addDomainButton) {
      addDomainButton.addEventListener("click", this.handleAddDomain);
    } else {
      console.error(
        "Can't find the add-domain button. Maybe it's on a coffee break?"
      );
    }
  }

  async handleAddKeyword(event: MouseEvent): Promise<void> {
    const keywordInput: HTMLInputElement = document.getElementById(
      "new-keyword"
    ) as HTMLInputElement;
    console.log(keywordInput);

    if (keywordInput) {
      const keyword = keywordInput.value.trim();
      if (keyword) {
        await this.addKeyword(keyword);
        // Clear the input field after adding the keyword
        keywordInput.value = "";
      }
    }
  }

  async handleAddDomain(event: MouseEvent): Promise<void> {
    const domainInput: HTMLInputElement = document.getElementById(
      "new-domain"
    ) as HTMLInputElement;
    if (domainInput) {
      const domain = domainInput.value.trim();
      if (domain) {
        await this.addDomain(domain);
        domainInput.value = "";
      }
    }
  }

  async addKeyword(keyword: string): Promise<void> {
    // let keywords = await this.storageManager.getKeywords();
    // if (!keywords.includes(keyword)) {
    //   keywords.push(keyword);
    //   await this.storageManager.setKeywords(keywords);
    //   this.uiManager.displayKeywords(keywords);
    // }
  }

  async addDomain(domain: string): Promise<void> {
    // let domains = await this.storageManager.getDomains();
    // if (!domains.includes(domain)) {
    //   domains.push(domain);
    //   await this.storageManager.setDomains(domains);
    //   this.uiManager.displayDomains(domains);
    // }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new PopupManager();
  console.log("PopupManager instance created");
});
