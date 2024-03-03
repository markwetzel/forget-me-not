// src/popup/UIManager.ts

import { BlockedItem, StorageManager } from "./StorageManager";

export class UIManager {
  private storageManager: StorageManager;

  constructor() {
    this.storageManager = new StorageManager();
  }

  displayKeywords(keywords: BlockedItem[]): void {
    const keywordsList = document.getElementById("keywords-list");
    if (keywordsList) {
      keywordsList.innerHTML = "";

      keywords.forEach((keyword, index) => {
        const li = document.createElement("li");
        li.textContent = `${keyword.type} (${keyword.value.join(", ")})`;

        // Create a removal button for each keyword
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => this.removeKeyword(index);

        li.appendChild(removeButton);
        keywordsList.appendChild(li);
      });
    }
  }

  displayDomains(domains: BlockedItem[]): void {
    const domainsList = document.getElementById("domains-list");
    if (domainsList) {
      domainsList.innerHTML = "";

      domains.forEach((domain, index) => {
        const li = document.createElement("li");
        li.textContent = `${domain.type} (${domain.value.join(", ")})`;

        // Create a removal button for each domain
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => this.removeDomain(index);

        li.appendChild(removeButton);
        domainsList.appendChild(li);
      });
    }
  }

  updateKeywordsUI(): void {
    this.storageManager.getKeywords().then((keywords) => {
      this.displayKeywords(keywords);
    });
  }

  updateDomainsUI(): void {
    this.storageManager.getDomains().then((domains) => {
      this.displayDomains(domains);
    });
  }

  async removeKeyword(index: number): Promise<void> {
    // Fetch the current list of keywords
    let keywords = await this.storageManager.getKeywords();

    // Remove the keyword at the specified index
    keywords.splice(index, 1);

    // Update the keywords in storage
    await this.storageManager.setKeywords(keywords);

    // Refresh the keywords display
    this.updateKeywordsUI();
  }

  async removeDomain(index: number): Promise<void> {
    let domains = await this.storageManager.getDomains();
    domains.splice(index, 1);
    await this.storageManager.setDomains(domains);
    this.updateDomainsUI();
  }
}
