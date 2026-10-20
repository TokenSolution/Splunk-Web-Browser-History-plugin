// Function to handle saving data permanently
function saveConfiguration() {
  const hecUrl = document.getElementById('hecUrl').value.trim();
  const token = document.getElementById('token').value.trim();
  const status = document.getElementById('status');

  if (!hecUrl || !token) {
    status.style.color = 'red';
    status.textContent = '❌ Please fill out both fields before saving.';
    return;
  }

  chrome.storage.local.set({ 
    splunkHecUrl: hecUrl, 
    splunkToken: token 
  }, () => {
    status.style.color = 'green';
    status.textContent = '✅ Saved! You can close this window.';
  });
}

// Function to test the Splunk HEC endpoint dynamically
function testConnection() {
  const hecUrl = document.getElementById('hecUrl').value.trim();
  const token = document.getElementById('token').value.trim();
  const status = document.getElementById('status');

  if (!hecUrl || !token) {
    status.style.color = 'red';
    status.textContent = '❌ Please enter both a URL and a Token to test.';
    return;
  }

  status.style.color = '#555';
  status.textContent = '⏳ Testing connection to Splunk HEC...';

  // Build a standard test event payload
  const testPayload = {
    event: { message: "Splunk Extension HEC Connection Test Successful" },
    sourcetype: "browser:activity:extension:test",
    source: "browser_extension_setup"
  };

  // Perform a live ping to the HEC server using the inputted configuration
  fetch(hecUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Splunk ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(testPayload)
  })
  .then(response => {
    if (response.ok) {
      status.style.color = 'green';
      status.textContent = '🚀 Connection Successful! Splunk acknowledged the HEC test packet (HTTP ' + response.status + ').';
    } else {
      status.style.color = 'orange';
      status.textContent = '⚠️ Server reached, but rejected: HTTP ' + response.status + '. Check if your token or path is correct.';
    }
  })
  .catch(error => {
    console.error('HEC Test Connection Error:', error);
    status.style.color = 'red';
    status.textContent = '❌ Connection Failed. Unable to reach the server. Verify the IP/URL, port number, or local firewall settings.';
  });
}

// Bind direct clicks immediately when script loads
document.getElementById('saveBtn').onclick = saveConfiguration;
document.getElementById('testBtn').onclick = testConnection;

// Auto-populate fields if data already exists in storage from a previous run
chrome.storage.local.get(['splunkHecUrl', 'splunkToken'], (items) => {
  if (items.splunkHecUrl) document.getElementById('hecUrl').value = items.splunkHecUrl;
  if (items.splunkToken) document.getElementById('token').value = items.splunkToken;
});
