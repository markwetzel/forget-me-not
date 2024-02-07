import * as browser from "webextension-polyfill";

console.log("Extension loaded");

// I want a function that will store sample blocked keywords in local storage (if the user hasn't already set them)
async function getBlockedKeywords(): Promise<string[]> {
  const blockedKeywords = await browser.storage.local.get("blockedKeywords");
  if (blockedKeywords.blockedKeywords) {
    return blockedKeywords.blockedKeywords;
  } else {
    await browser.storage.local.set({ blockedKeywords: [] });
    return [];
  }
}

// I want a function that will store sample blocked domains in local storage (if the user hasn't already set them)
async function getBlockedDomains(): Promise<string[]> {
  const blockedDomains = await browser.storage.local.get("blockedDomains");
  if (blockedDomains.blockedDomains) {
    return blockedDomains.blockedDomains;
  } else {
    await browser.storage.local.set({
      blockedDomains: ["reddit.com/r/gonewild", "reddit.com/r/superstonk"],
    });
    return [];
  }
}

filterHistory();

async function filterHistory(): Promise<void> {
  const blockedKeywords = await getBlockedKeywords();
  const blockedDomains = await getBlockedDomains();

  browser.history.search({ text: "", startTime: 0 }).then((historyItems) => {
    console.log(`Found ${historyItems.length} history items`);
    historyItems.forEach((item) => {
      if (item.url) {
        // check to see if the current history item contains any part for each blocked domain
        const shouldDelete = blockedDomains.some((blockedDomain) => {
          return item.url?.toLowerCase().includes(blockedDomain.toLowerCase());
        });

        if (shouldDelete) {
          console.log(`Deleting history item: ${item.url}`);
          browser.history.deleteUrl({ url: item.url });
        }
      }
    });
  });
}

const intervalInSeconds = 5;
setInterval(filterHistory, intervalInSeconds * 1000);
console.log(`filterHistory will run every ${intervalInSeconds} seconds`);
