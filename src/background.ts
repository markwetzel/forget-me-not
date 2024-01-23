import * as browser from "webextension-polyfill";

console.log("Extension loaded");

function filterHistory(): void {
  const blockedKeywords: string[] = ["facebook", "youtube", "billionaires"];
  const blockedDomains: string[] = ["example.com", "sub.example.com"];

  browser.history.search({ text: "", startTime: 0 }).then((historyItems) => {
    historyItems.forEach((item) => {
      if (item.url) {
        const shouldDelete: boolean =
          blockedKeywords.some(
            (keyword) =>
              item.title?.includes(keyword) || item.url?.includes(keyword)
          ) ||
          blockedDomains.some((domain) => new URL(item.url!).hostname === domain);

        if (shouldDelete) {
          browser.history.deleteUrl({ url: item.url });
        }
      }
    });
  });
}

setInterval(filterHistory, 10000);
console.log("filterHistory will run every 10 seconds");