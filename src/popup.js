document.getElementById('block-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const keyword = document.getElementById('keyword').value;
  const domain = document.getElementById('domain').value;

  // Add the keyword and domain to the blocked lists
  addBlockedKeyword(keyword);
  addBlockedDomain(domain);

  // Clear the input fields
  document.getElementById('keyword').value = '';
  document.getElementById('domain').value = '';
});