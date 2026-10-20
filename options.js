// Direct function to save inputs
function saveConfiguration() {
  const hecUrl = document.getElementById('hecUrl').value.trim();
  const token = document.getElementById('token').value.trim();
  const status = document.getElementById('status');

  if (!hecUrl || !token) {
    status.style.color = 'red';
    status.textContent = '❌ Please fill out both fields.';
    return;
  }

  // Force save to Chrome's local database
  chrome.storage.local.set({ 
    splunkHecUrl: hecUrl, 
    splunkToken: token 
  }, () => {
    status.style.color = 'green';
    status.textContent = '✅ Saved! You can close this window.';
    console.log("Splunk variables updated successfully.");
  });
}

// Bind directly to the button immediately when script loads
document.getElementById('saveBtn').onclick = saveConfiguration;

// Auto-populate fields if data already exists
chrome.storage.local.get(['splunkHecUrl', 'splunkToken'], (items) => {
  if (items.splunkHecUrl) document.getElementById('hecUrl').value = items.splunkHecUrl;
  if (items.splunkToken) document.getElementById('token').value = items.splunkToken;
});
