# Splunk-Web-Browser-History-plugin
Chrome compatible plugin to send browser and search history logs to Splunk via HEC
# Splunk Web Browser History Plugin

A universal, high-performance Chromium extension designed to securely capture and stream web navigation patterns and search queries directly into a custom Splunk HTTP Event Collector (HEC) instance. 

Maintained and developed by **[TokenSolution](https://github.com)**.

---

## 🚀 Key Features

* **Dynamic Environment Setup:** Built-in settings GUI lets you securely provision your Splunk server IP and HEC token at runtime—no hardcoded variables required.
* **Tab Switch Focus (Context Tracking):** Monitors whenever a user actively cycles through open background tabs, providing a seamless operational timeline.
* **Intelligent Query Monitoring:** Native dynamic injection intercepts search intents on major engines (Google, Bing, YouTube, DuckDuckGo).
* **Character-Safe UI:** Full UTF-8 support ensures clean visual confirmation status rendering inside the management pane.

---

## 🛠️ Local Installation & Development Mode

To run this plugin locally without the Chrome Web Store:

1. **Clone or Download** this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Toggle the **Developer mode** switch in the top-right corner to **On**.
4. Click the **Load unpacked** button in the top-left corner.
5. Select the root folder containing the extension files.
6. The extension will automatically open the configuration pane on initialization. Enter your target Splunk environment variables to begin ingestion.

---

## ⚖️ Legal & Licensing

This software is distributed under the **PolyForm Noncommercial License 1.0.0**. 

You are free to download, inspect, fork, and use this extension within your own non-commercial environments or private laboratories. However, **commercial usage is strictly prohibited**. You may not bundle this code inside retail products, sell enterprise distributions of this framework, or utilize it as a direct mechanism for monetary gain or commercial advantage.
