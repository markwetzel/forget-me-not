import * as browser from "webextension-polyfill";

console.log("Extension loaded");

// I want a function that will store sample blocked keywords in local storage (if the user hasn't already set them)
async function getBlockedKeywords(): Promise<string[]> {
  const blockedKeywords = await browser.storage.local.get("blockedKeywords");
  if (blockedKeywords.blockedKeywords) {
    return blockedKeywords.blockedKeywords;
  } else {
    const defaultKeywords = ["gonewild", "superstonk", "gme"];
    await browser.storage.local.set({ blockedKeywords: defaultKeywords });
    return defaultKeywords;
  }
}

// I want a function that will store sample blocked domains in local storage (if the user hasn't already set them)
async function getBlockedDomains(): Promise<string[]> {
  const blockedDomains = await browser.storage.local.get("blockedDomains");
  if (blockedDomains.blockedDomains) {
    return blockedDomains.blockedDomains;
  } else {
    const defaultDomains = [
      "reddit.com/r/gonewild",
      "reddit.com/r/Superstonk",
      "reddit-stream.com",
    ];
    await browser.storage.local.set({ blockedDomains: defaultDomains });
    return defaultDomains; // Return the default list instead of []
  }
}

filterHistory();

export async function filterHistory(): Promise<void> {
  try {
    const blockedKeywords = await getBlockedKeywords();
    const blockedDomains = await getBlockedDomains();

    const historyItems = await browser.history.search({
      text: "",
      startTime: 0,
    });

    // console.log(`Found ${historyItems.length} history items`);
    // console.log(`Blocked keywords: ${blockedKeywords}`);
    // console.log(`Blocked domains: ${blockedDomains}`);

    for (const item of historyItems) {
      if (item.url) {
        if (shouldDeleteForDomain(item.url, blockedDomains)) {
          console.log(`Deleting ${item.url}`);
          await browser.history.deleteUrl({ url: item.url! });
        }
        if (shouldDeleteForKeyword(item.url, blockedKeywords)) {
          console.log(`Deleting ${item.url}`);
          await browser.history.deleteUrl({ url: item.url! });
        }
      }
    }
  } catch (error) {
    console.error("Error filtering history", error);
  }
}

function shouldDeleteForDomain(url: string, blockedDomains: string[]) {
  try {
    const urlObj = new URL(url);
    const domainWithSub = urlObj.hostname; // Gets 'example.com' from 'https://example.com/path'
    return blockedDomains.some((domain) => domainWithSub.includes(domain));
  } catch (error) {
    console.error("Error parsing URL", error);
    return false;
  }
}

function shouldDeleteForKeyword(
  url: string | undefined,
  blockedKeywords: string[]
) {
  if (!url) return false; // If there's no URL, no need to proceed.

  const urlLower = url.toLowerCase(); // Convert to lower case once for efficiency.
  return blockedKeywords.some((keyword) =>
    urlLower.includes(keyword.toLowerCase())
  );
}

const intervalInSeconds = 10;
setInterval(filterHistory, intervalInSeconds * 1000);
console.log(`filterHistory will run every ${intervalInSeconds} seconds`);
