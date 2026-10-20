// Target precise selectors for modern search bars
const searchSelectors = [
  'input[name="q"]',                // Google and Bing standard
  'input#search',                   // YouTube desktop element ID
  'ytd-searchbox input',            // YouTube custom element fallback
  'input[placeholder*="Search"]'    // General fallback
];

function captureAndSend(inputElement) {
  if (!inputElement || !inputElement.value.trim()) return;

  // Send the query safely to background.js
  chrome.runtime.sendMessage({
    type: "SEARCH_QUERY",
    platform: window.location.hostname,
    query: inputElement.value.trim(),
    timestamp: new Date().toISOString()
  });
}

function attachListenersToSearch() {
  const searchInput = document.querySelector(searchSelectors.join(','));
  
  if (searchInput && !searchInput.dataset.splunkTracked) {
    // Mark it so we don't accidentally attach duplicate event listeners
    searchInput.dataset.splunkTracked = "true";

    // 1. Listen for the 'Enter' key press
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        // Use a tiny timeout to ensure the value attribute updates fully
        setTimeout(() => captureAndSend(searchInput), 100);
      }
    });

    // 2. Listen for the parent form submissions (clicking magnifying glass icons)
    const form = searchInput.closest('form') || document.querySelector('form#search-form');
    if (form) {
      form.addEventListener('submit', () => {
        setTimeout(() => captureAndSend(searchInput), 100);
      });
    }
  }
}

// Use a MutationObserver to instantly catch dynamic DOM injections on SPA sites like YouTube
const observer = new MutationObserver(() => {
  attachListenersToSearch();
});

// Start watching the page structure for updates
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Run an immediate initialization check for standard static page loads
attachListenersToSearch();
