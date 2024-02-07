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

export async function filterHistory(): Promise<void> {
  try {
    const blockedKeywords = await getBlockedKeywords();
    const blockedDomains = await getBlockedDomains();

    const historyItems = await browser.history.search({
      text: "",
      startTime: 0,
    });

    console.log(`Found ${historyItems.length} history items`);

    for (const item of historyItems) {
      if (
        (item.url && shouldDeleteForDomain(item.url, blockedDomains)) ||
        shouldDeleteForKeyword(item.url, blockedKeywords)
      ) {
        console.log(`Deleting ${item.url}`);
        await browser.history.deleteUrl({ url: item.url! });
      }
    }
  } catch (error) {
    console.error("Error filtering history", error);
  }
}

function shouldDeleteForDomain(url: string, blockedDomains: string[]) {
  return blockedDomains.some((domain: string) =>
    url.toLowerCase().includes(domain.toLowerCase())
  );
}

function shouldDeleteForKeyword(
  url: string | undefined,
  blockedKeywords: string[]
) {
  return blockedKeywords.some((keyword: string) =>
    url!.toLowerCase().includes(keyword.toLowerCase())
  );
}

const intervalInSeconds = 5;
setInterval(filterHistory, intervalInSeconds * 1000);
console.log(`filterHistory will run every ${intervalInSeconds} seconds`);
