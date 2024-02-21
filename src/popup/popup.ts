import * as browser from "webextension-polyfill";
import { PopupManager } from "./PopupManager";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize PopupManager
  const popupManager = new PopupManager();

  // If there are other tasks to be performed on DOMContentLoaded, you can add them here.
  // For example, if there's a need to interact with the DOM directly or initialize other components.
});

// Define interfaces for storage items for clarity and type checking
interface StorageItem {
  blockedKeywords?: string[];
  blockedDomains?: string[];
}

// Function to load and display existing blocked keywords and domains
async function restoreOptions(): Promise<void> {
  const keywords: StorageItem = await browser.storage.local.get(
    "blockedKeywords"
  );
  const domains: StorageItem = await browser.storage.local.get(
    "blockedDomains"
  );
  displayKeywords(keywords.blockedKeywords || []);
  displayDomains(domains.blockedDomains || []);
}

// Save the updated list of keywords to storage
async function saveKeywords(keywords: string[]): Promise<void> {
  await browser.storage.local.set({ blockedKeywords: keywords });
  // Optionally, refresh the keywords list display
}

// Save the updated list of domains to storage
async function saveDomains(domains: string[]): Promise<void> {
  await browser.storage.local.set({ blockedDomains: domains });
  // Optionally, refresh the domains list display
}

function displayKeywords(keywords: string[]): void {
  const listElement = document.getElementById("keywords-list");
  if (!listElement) return; // Guard clause to ensure the element exists

  // Clear existing list items to prevent duplication
  listElement.innerHTML = "";

  // Create and append a list item for each keyword
  keywords.forEach((keyword) => {
    const listItem = document.createElement("li");
    listItem.textContent = keyword;

    // Optional: Add a button to remove the keyword from the list
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = () => removeKeyword(keyword);
    listItem.appendChild(removeButton);

    listElement.appendChild(listItem);
  });
}

async function removeKeyword(keywordToRemove: string): Promise<void> {
  const { blockedKeywords } = await browser.storage.local.get(
    "blockedKeywords"
  );
  const updatedKeywords = blockedKeywords.filter(
    (keyword: string) => keyword !== keywordToRemove
  );
  await browser.storage.local.set({ blockedKeywords: updatedKeywords });
  displayKeywords(updatedKeywords); // Refresh the list
}

function displayDomains(domains: string[]): void {
  const listElement = document.getElementById("domains-list");
  if (!listElement) return; // Guard clause to ensure the element exists

  // Clear existing list items to prevent duplication
  listElement.innerHTML = "";

  // Create and append a list item for each domain
  domains.forEach((domain) => {
    const listItem = document.createElement("li");
    listItem.textContent = domain;

    // Optional: Add a button to remove the domain from the list
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = () => removeDomain(domain);
    listItem.appendChild(removeButton);

    listElement.appendChild(listItem);
  });
}

async function removeDomain(domainToRemove: string): Promise<void> {
  const { blockedDomains } = await browser.storage.local.get("blockedDomains");
  const updatedDomains = blockedDomains.filter(
    (domain: string) => domain !== domainToRemove
  );
  await browser.storage.local.set({ blockedDomains: updatedDomains });
  displayDomains(updatedDomains); // Refresh the list
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("add-keyword")!.addEventListener("click", addKeyword);
document.getElementById("add-domain")!.addEventListener("click", addDomain);

//////

// popup.ts
// import * as browser from "webextension-polyfill";

// Utilize an IIFE (Immediately Invoked Function Expression) for setup to ensure code runs after DOM is fully loaded
(() => {
  document.addEventListener("DOMContentLoaded", async () => {
    await restoreOptions();
    setupEventListeners();
  });
})();

function setupEventListeners(): void {
  // Setting up event listeners after ensuring the DOM content is fully loaded
  document.getElementById("add-keyword")?.addEventListener("click", addKeyword);
  document.getElementById("add-domain")?.addEventListener("click", addDomain);

  setupEnterKeySubmission();
}

// Consider refactoring addKeyword and addDomain to reduce repetition
async function addEntry(entryType: "keyword" | "domain"): Promise<void> {
  const inputId = entryType === "keyword" ? "new-keyword" : "new-domain";
  const storageKey =
    entryType === "keyword" ? "blockedKeywords" : "blockedDomains";

  const inputElement: HTMLInputElement = document.getElementById(
    inputId
  ) as HTMLInputElement;
  if (!inputElement) return; // Guard clause if input element not found

  const entry = inputElement.value.trim();
  if (entry) {
    let storageItem: StorageItem = await browser.storage.local.get(storageKey);
    let updatedList: string[] = [...(storageItem[storageKey] || []), entry];
    await browser.storage.local.set({ [storageKey]: updatedList });

    inputElement.value = ""; // Clear input after adding
    entryType === "keyword"
      ? displayKeywords(updatedList)
      : displayDomains(updatedList); // Refresh UI
  }
}

async function addKeyword(): Promise<void> {
  await addEntry("keyword");
}

// Function to add a domain to the list and save it, with validation and inline error display
async function addDomain(): Promise<void> {
  const input: HTMLInputElement = document.getElementById(
    "new-domain"
  ) as HTMLInputElement;
  const errorDiv: HTMLElement = document.getElementById("domain-error")!;
  errorDiv.textContent = ""; // Clear previous error message

  const newDomain: string = input.value.trim();
  if (newDomain) {
    if (!isValidDomain(newDomain)) {
      errorDiv.textContent = "Please enter a valid domain."; // Display error inline
      return;
    }

    const { blockedDomains }: StorageItem = await browser.storage.local.get(
      "blockedDomains"
    );
    const updatedDomains: string[] = [...(blockedDomains || []), newDomain];
    await saveDomains(updatedDomains);
    input.value = ""; // Clear the input field after adding
    displayDomains(updatedDomains); // Refresh the displayed list with the new domain included
    errorDiv.textContent = ""; // Clear error after successful add
  }
}

// Utility function to check if the domain is in a valid format
function isValidDomain(domain: string): boolean {
  const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return domainPattern.test(domain);
}

// Function to handle Enter key press for both keywords and domains
function setupEnterKeySubmission(): void {
  const keywordInput: HTMLInputElement = document.getElementById(
    "new-keyword"
  ) as HTMLInputElement;
  const domainInput: HTMLInputElement = document.getElementById(
    "new-domain"
  ) as HTMLInputElement;

  keywordInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addKeyword();
    }
  });

  domainInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addDomain();
    }
  });
}


