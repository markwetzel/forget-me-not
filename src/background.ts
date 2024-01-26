import * as browser from "webextension-polyfill";

console.log("Extension loaded");

browser.storage.local.set({
  blockedKeywords: ["facebook", "youtube"],
  blockedDomains: ["example.com", "sub.example.com"],
});

async function getBlockedItems(): Promise<{
  blockedKeywords: string[];
  blockedDomains: string[];
}> {
  const { blockedKeywords, blockedDomains } = await browser.storage.local.get([
    "blockedKeywords",
    "blockedDomains",
  ]);

  return { blockedKeywords, blockedDomains };
}

async function addBlockedKeyword(keyword: string): Promise<void> {
  const { blockedKeywords } = await getBlockedItems();

  blockedKeywords.push(keyword);
  browser.storage.local.set({ blockedKeywords });
}

async function addBlockedDomain(domain: string): Promise<void> {
  const { blockedDomains } = await getBlockedItems();

  blockedDomains.push(domain);
  browser.storage.local.set({ blockedDomains });
}

async function removeBlockedKeyword(keyword: string): Promise<void> {
  const { blockedKeywords } = await getBlockedItems();

  const index = blockedKeywords.indexOf(keyword);
  if (index > -1) {
    blockedKeywords.splice(index, 1);
  }

  browser.storage.local.set({ blockedKeywords });
}

async function removeBlockedDomain(domain: string): Promise<void> {
  const { blockedDomains } = await getBlockedItems();

  const index = blockedDomains.indexOf(domain);
  if (index > -1) {
    blockedDomains.splice(index, 1);
  }

  browser.storage.local.set({ blockedDomains });
}

async function filterHistory(): Promise<void> {
  const { blockedKeywords, blockedDomains } = await getBlockedItems();

  browser.history.search({ text: "", startTime: 0 }).then((historyItems) => {
    historyItems.forEach((item) => {
      if (item.url) {
        const shouldDelete: boolean =
          blockedKeywords.some(
            (keyword) =>
              item.title?.includes(keyword) || item.url?.includes(keyword)
          ) ||
          blockedDomains.some(
            (domain) => new URL(item.url!).hostname === domain
          );

        if (shouldDelete) {
          browser.history.deleteUrl({ url: item.url });
        }
      }
    });
  });
}

setInterval(filterHistory, 10000);
console.log("filterHistory will run every 10 seconds");

browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && (changes.blockedKeywords || changes.blockedDomains)) {
    filterHistory();
  }
});