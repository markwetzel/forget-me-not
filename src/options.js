document.getElementById('settings-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const blockedKeywords = document.getElementById('blocked-keywords').value.split(',');
  const blockedDomains = document.getElementById('blocked-domains').value.split(',');

  browser.storage.local.set({ blockedKeywords, blockedDomains });
});