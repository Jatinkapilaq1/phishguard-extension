document.addEventListener('DOMContentLoaded', function() {
  var statusDot = document.getElementById('statusDot');
  var statusText = document.getElementById('statusText');
  var currentUrl = document.getElementById('currentUrl');
  var scannedCount = document.getElementById('scannedCount');
  var blockedCount = document.getElementById('blockedCount');
  var threatsList = document.getElementById('threatsList');
  var scanBtn = document.getElementById('scanBtn');
  var gmailBtn = document.getElementById('gmailBtn');
  var loadingState = document.getElementById('loadingState');
  var resultsSection = document.getElementById('resultsSection');

  var currentTab = null;

  /* Init */
  async function init() {
    try {
      var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      currentTab = tabs[0];
      currentUrl.textContent = currentTab.url || 'No URL';

      var stats = await chrome.runtime.sendMessage({ action: 'getStats' });
      scannedCount.textContent = stats.totalScanned || 0;
      blockedCount.textContent = stats.threatsBlocked || 0;

      statusText.textContent = 'Ready to scan';
      statusDot.classList.remove('danger', 'warning');

      /* Auto scan current page */
      await scanCurrentPage();
    } catch (err) {
      statusText.textContent = 'Error loading';
      statusDot.classList.add('danger');
    }
  }

  /* Scan current page via background */
  async function scanCurrentPage() {
    if (!currentTab || !currentTab.url) return;

    loadingState.style.display = 'block';
    resultsSection.style.display = 'none';
    statusText.textContent = 'Scanning...';
    threatsList.innerHTML = '';

    try {
      var result = await chrome.runtime.sendMessage({ action: 'scanUrl', url: currentTab.url });
      showPageResult(result);
    } catch (err) {
      statusText.textContent = 'Scan failed';
      statusDot.classList.add('danger');
    } finally {
      loadingState.style.display = 'none';
      resultsSection.style.display = 'block';
    }
  }

  function showPageResult(result) {
    threatsList.innerHTML = '';

    if (result.isPhishing) {
      statusDot.className = 'status-dot danger';
      statusText.textContent = '\u26A0\uFE0F Threat Detected!';
      (result.threats || []).forEach(function(t) {
        addThreatItem(t, 'danger');
      });
    } else if (result.threats && result.threats.length > 0) {
      statusDot.className = 'status-dot warning';
      statusText.textContent = '\u26A1 Warnings Found';
      result.threats.forEach(function(t) {
        addThreatItem(t, 'warn');
      });
    } else {
      statusDot.className = 'status-dot';
      statusText.textContent = '\u2705 This page looks safe';
      addThreatItem('No threats detected on this page', 'safe');
    }
  }

  function addThreatItem(text, level) {
    var item = document.createElement('div');
    var cls = level === 'safe' ? 'threat-item safe-item' : level === 'warn' ? 'threat-item warn-item' : 'threat-item';
    item.className = cls;
    var icon = level === 'safe' ? '\u2705' : level === 'warn' ? '\u26A0\uFE0F' : '\u{1F6A8}';
    item.innerHTML = '<span class="threat-icon">' + icon + '</span><span class="threat-text">' + text + '</span>';
    threatsList.appendChild(item);
  }

  /* Scan button */
  scanBtn.addEventListener('click', async function() {
    scanBtn.textContent = '\u{1F504} Scanning...';
    scanBtn.disabled = true;
    await scanCurrentPage();
    scanBtn.textContent = '\u{1F50D} Scan Current Page';
    scanBtn.disabled = false;
  });

  /* Gmail button */
  gmailBtn.addEventListener('click', async function() {
    gmailBtn.textContent = '\u{1F4E7} Opening Gmail...';
    gmailBtn.disabled = true;

    try {
      var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      var tab = tabs[0];

      if (tab.url && tab.url.includes('mail.google.com')) {
        chrome.tabs.sendMessage(tab.id, { action: 'scanGmail' });
        gmailBtn.textContent = '\u2705 Scanning...';
      } else {
        await chrome.tabs.create({ url: 'https://mail.google.com' });
        gmailBtn.textContent = '\u{1F4E7} Gmail opened';
      }
    } catch (err) {
      gmailBtn.textContent = '\u{1F4E7} Open Gmail first';
    }

    setTimeout(function() {
      gmailBtn.textContent = '\u{1F4E7} Scan Gmail';
      gmailBtn.disabled = false;
    }, 2000);
  });

  init();
});