/**
 * PhishGuard AI — AI Chatbot Scanner v1.0
 * Scans AI chatbots for threats: fake sites, data theft, prompt injection
 * Works on: ChatGPT, Gemini, Claude, Copilot, Perplexity, and more
 */
(function() {
  'use strict';

  if (window.__phishguard_ai_chatbot_loaded) return;
  window.__phishguard_ai_chatbot_loaded = true;

  /* ═══════════════ AI SERVICE DATABASE ═══════════════ */
  var AI_SERVICES = {
    chatgpt: {
      name: 'ChatGPT',
      legit: ['chatgpt.com', 'chat.openai.com', 'openai.com'],
      icon: '🤖',
      color: '#10a37f',
      desc: 'OpenAI ChatGPT'
    },
    gemini: {
      name: 'Gemini',
      legit: ['gemini.google.com', 'bard.google.com', 'aistudio.google.com'],
      icon: '✨',
      color: '#4285f4',
      desc: 'Google Gemini'
    },
    claude: {
      name: 'Claude',
      legit: ['claude.ai', 'anthropic.com'],
      icon: '🧠',
      color: '#d4a574',
      desc: 'Anthropic Claude'
    },
    copilot: {
      name: 'Copilot',
      legit: ['copilot.microsoft.com', 'copilot.cloud.microsoft', 'bing.com/chat'],
      icon: '🪟',
      color: '#7b68ee',
      desc: 'Microsoft Copilot'
    },
    perplexity: {
      name: 'Perplexity',
      legit: ['perplexity.ai', 'www.perplexity.ai'],
      icon: '🔍',
      color: '#20b2aa',
      desc: 'Perplexity AI'
    },
    opencode: {
      name: 'OpenCode',
      legit: ['opencode.ai', 'opencode.sh'],
      icon: '💻',
      color: '#00d4aa',
      desc: 'OpenCode AI'
    },
    grok: {
      name: 'Grok',
      legit: ['grok.com', 'x.com/i/grok'],
      icon: '⚡',
      color: '#1da1f2',
      desc: 'xAI Grok'
    },
    deepseek: {
      name: 'DeepSeek',
      legit: ['deepseek.com', 'chat.deepseek.com'],
      icon: '🔮',
      color: '#6366f1',
      desc: 'DeepSeek AI'
    },
    huggingface: {
      name: 'HuggingFace',
      legit: ['huggingface.co', 'hf.co'],
      icon: '🤗',
      color: '#ffd21e',
      desc: 'HuggingFace Chat'
    },
    cohere: {
      name: 'Cohere',
      legit: ['cohere.com', 'coral.cohere.com'],
      icon: '🪸',
      color: '#3959ff',
      desc: 'Cohere Command'
    },
    mistral: {
      name: 'Mistral',
      legit: ['chat.mistral.ai', 'mistral.ai'],
      icon: '🌪️',
      color: '#ff7000',
      desc: 'Mistral AI'
    },
    pi: {
      name: 'Pi',
      legit: ['pi.ai', 'heypi.com'],
      icon: '🫧',
      color: '#e8457c',
      desc: 'Inflection Pi'
    },
    you: {
      name: 'You.com',
      legit: ['you.com', 'youchat.com'],
      icon: '🧑',
      color: '#1a73e8',
      desc: 'You.com AI'
    },
    poe: {
      name: 'Poe',
      legit: ['poe.com'],
      icon: '💬',
      color: '#6c5ce7',
      desc: 'Poe by Quora'
    },
    character: {
      name: 'Character.AI',
      legit: ['character.ai', 'beta.character.ai'],
      icon: '🎭',
      color: '#8b5cf6',
      desc: 'Character.AI'
    },
    janitor: {
      name: 'Janitor AI',
      legit: ['janitorai.com'],
      icon: '🧹',
      color: '#ef4444',
      desc: 'Janitor AI'
    },
    chatpdf: {
      name: 'ChatPDF',
      legit: ['chatpdf.com'],
      icon: '📄',
      color: '#f97316',
      desc: 'ChatPDF'
    },
    phind: {
      name: 'Phind',
      legit: ['phind.com'],
      icon: '🔎',
      color: '#7c3aed',
      desc: 'Phind AI'
    },
    cursor: {
      name: 'Cursor',
      legit: ['cursor.com', 'cursor.sh'],
      icon: '⌨️',
      color: '#000000',
      desc: 'Cursor AI IDE'
    },
    v0: {
      name: 'v0',
      legit: ['v0.dev', 'v0.vercel.app'],
      icon: '🎨',
      color: '#000000',
      desc: 'Vercel v0'
    },
    bolt: {
      name: 'Bolt',
      legit: ['bolt.new', 'stackblitz.com'],
      icon: '⚡',
      color: '#1389fd',
      desc: 'Bolt.new'
    },
    replit: {
      name: 'Replit',
      legit: ['replit.com', 'replit.ai'],
      icon: '🔄',
      color: '#f26207',
      desc: 'Replit AI'
    },
    lovable: {
      name: 'Lovable',
      legit: ['lovable.dev'],
      icon: '💝',
      color: '#e11d48',
      desc: 'Lovable AI'
    }
  };

  /* ═══════════════ DATA THEFT KEYWORDS ═══════════════ */
  var DATA_THEFT_PROMPTS = [
    /(?:copy|paste|enter|type|share|send|input)\s+(?:your|my|the)\s+(?:password|api[\s-]?key|secret[\s-]?key|token|credit[\s-]?card|debit[\s-]?card|ssn|social\s+security|aadhaar|pan\s+card|bank\s+account|routing[\s-]?number|cvv|pin)/i,
    /(?:what\s+is\s+your|enter\s+your|type\s+your|give\s+me\s+your|share\s+your)\s+(?:password|api[\s-]?key|secret|token|login|credential)/i,
    /(?:paste|enter)\s+(?:the\s+)?(?:code|otp|verification|2fa|mfa|authentication)[\s:]*(?:code|number)?/i,
    /(?:connect|link|sync)\s+(?:your|my)\s+(?:bank|wallet|paypal|crypto|exchange|metamask|phantom)/i,
    /(?:upload|send|share)\s+(?:your|my)\s+(?:id|passport|license|document|photo|selfie|proof)/i
  ];

  /* ═══════════════ PROMPT INJECTION PATTERNS ═══════════════ */
  var INJECTION_PATTERNS = [
    { re: /(?:ignore|forget|disregard)\s+(?:all\s+)?(?:previous|above|prior|your)\s+(?:instructions?|rules?|guidelines?|prompts?|training)/i, name: 'Instruction override attempt' },
    { re: /(?:you\s+are\s+now|act\s+as|pretend\s+(?:to\s+be|you\s+(?:are|were))|roleplay\s+as|simulate)\s+(?:a\s+)?(?:different|new|another|malicious|evil|jailbroken)/i, name: 'Role hijacking attempt' },
    { re: /(?:jailbreak|dan|do\s+anything\s+now|dev\s+mode|god\s+mode|administrator\s+mode)/i, name: 'Jailbreak attempt' },
    { re: /(?:bypass|circumvent|override|disable)\s+(?:your|the|all)\s+(?:safety|security|filter|restriction|moderation|censor|limit)/i, name: 'Safety bypass attempt' },
    { re: /(?:reveal|show|display|output|print|repeat|echo)\s+(?:your|the|all)\s+(?:system\s+)?(?:prompt|instructions?|rules?|guidelines?|configuration|settings)/i, name: 'System prompt extraction' },
    { re: /(?:base64|rot13|hex|binary|encoded)\s*(?:decode|decode\s+this|encode|translate)/i, name: 'Encoding bypass attempt' }
  ];

  /* ═══════════════ SUSPICIOUS LINKS IN AI RESPONSES ═══════════════ */
  var SUSPICIOUS_LINK_PATTERNS = [
    /(?:bit\.ly|tinyurl|goo\.gl|t\.co|is\.gd|cutt\.ly|rb\.gy|short\.io)\/[\w-]+/i,
    /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
    /(?:ngrok|localtunnel|serveo|pagekite)\.(?:io|dev|net|com)/i,
    /(?:pastebin|ghostbin|hastebin|dpaste|rentry)\.com\/[\w]+/i
  ];

  /* ═══════════════ HIDDEN PROMPT INJECTION (in AI responses) ═══════════════ */
  var HIDDEN_INJECTION = [
    /(?:system\s*prompt|<\|system\|>|\[system\]|<\|im_start\|>system)/i,
    /(?:USER:|ASSISTANT:|<\|im_start\|>user|<\|im_start\|>assistant)/i,
    /(?:BEGIN\s+INSTRUCTION|INSTRUCTION\s*:|DO\s+NOT\s+REVEAL)/i,
    /(?:white\s*text|font[\s-]*size\s*:\s*0|color\s*:\s*(?:white|transparent|#[fF]{6}))/i
  ];

  /* ═══════════════ DETECT CURRENT AI SERVICE ═══════════════ */
  function detectAIService() {
    var hostname = window.location.hostname.toLowerCase();
    var hl = hostname;

    for (var key in AI_SERVICES) {
      var svc = AI_SERVICES[key];
      for (var di = 0; di < svc.legit.length; di++) {
        if (hl === svc.legit[di] || hl.endsWith('.' + svc.legit[di])) {
          return { key: key, service: svc, isLegit: true };
        }
      }
    }

    /* Check for impersonation */
    for (var key2 in AI_SERVICES) {
      var svc2 = AI_SERVICES[key2];
      for (var pi = 0; pi < svc2.legit.length; pi++) {
        var domainName = svc2.legit[pi].split('.')[0].toLowerCase();
        if (hl.indexOf(domainName) !== -1 && !hl.endsWith(svc2.legit[pi])) {
          return { key: key2, service: svc2, isLegit: false };
        }
      }
    }

    return null;
  }

  /* ═══════════════ SCANS ═══════════════ */
  function scanForDataTheft() {
    var findings = [];
    var allText = document.body.innerText || '';
    var messages = document.querySelectorAll('[data-message-author], [data-message-id], .markdown, .prose, .message-content, .response-content, article');

    for (var mi = 0; mi < messages.length; mi++) {
      var msgText = messages[mi].innerText || '';
      for (var pi = 0; pi < DATA_THEFT_PROMPTS.length; pi++) {
        if (DATA_THEFT_PROMPTS[pi].test(msgText)) {
          var match = msgText.match(DATA_THEFT_PROMPTS[pi]);
          findings.push({
            sev: 'danger', icon: '💳',
            title: 'Possible data theft attempt detected',
            text: 'This AI response may be trying to steal sensitive data. Pattern found: "' + (match ? match[0].substring(0, 60) : 'suspicious request') + '". Never share passwords, API keys, credit cards, OTPs, Aadhaar, PAN, or bank details with any AI chatbot. No legitimate AI asks for this.'
          });
          break;
        }
      }
    }
    return findings;
  }

  function scanForPromptInjection() {
    var findings = [];
    var messages = document.querySelectorAll('[data-message-author], [data-message-id], .markdown, .prose, .message-content, .response-content, article');
    var inputFields = document.querySelectorAll('textarea, [contenteditable="true"], input[type="text"]');

    /* Check user inputs for injection attempts */
    for (var ii = 0; ii < inputFields.length; ii++) {
      var inputText = inputFields[ii].value || inputFields[ii].textContent || '';
      for (var ipi = 0; ipi < INJECTION_PATTERNS.length; ipi++) {
        if (INJECTION_PATTERNS[ipi].re.test(inputText)) {
          findings.push({
            sev: 'warning', icon: '💉',
            title: 'Prompt injection detected: ' + INJECTION_PATTERNS[ipi].name,
            text: 'Your message contains "' + INJECTION_PATTERNS[ipi].name.toLowerCase() + '" patterns. This can make the AI bypass safety rules and produce harmful content. Be careful — AI manipulation can lead to unreliable or dangerous outputs.'
          });
          break;
        }
      }
    }

    /* Check AI responses for hidden injections */
    for (var mi = 0; mi < messages.length; mi++) {
      var msgText = messages[mi].innerText || '';
      var msgHtml = messages[mi].innerHTML || '';
      for (var hi = 0; hi < HIDDEN_INJECTION.length; hi++) {
        if (HIDDEN_INJECTION[hi].test(msgHtml) && !HIDDEN_INJECTION[hi].test(msgText)) {
          findings.push({
            sev: 'danger', icon: '👻',
            title: 'Hidden prompt injection in AI response',
            text: 'This AI response contains hidden text (visible in code but not on screen) that attempts to manipulate the AI. This is a technique called "prompt injection via hidden content." The AI may have been hijacked. Do not trust this response.'
          });
          break;
        }
      }
    }

    return findings;
  }

  function scanForSuspiciousLinks() {
    var findings = [];
    var messages = document.querySelectorAll('.markdown a, .prose a, a[href]');
    var seenLinks = {};

    for (var li = 0; li < messages.length; li++) {
      var href = messages[li].href || '';
      var text = messages[li].textContent || '';
      var hostname = '';
      try { hostname = new URL(href).hostname; } catch(e) { continue; }

      /* Check for suspicious link patterns */
      for (var si = 0; si < SUSPICIOUS_LINK_PATTERNS.length; si++) {
        if (SUSPICIOUS_LINK_PATTERNS[si].test(href) && !seenLinks[href]) {
          seenLinks[href] = true;
          findings.push({
            sev: 'high', icon: '🔗',
            title: 'Suspicious link in AI response',
            text: 'AI generated a link to "' + hostname + (href.length > 60 ? '...' : '"') + '" — this is a shortened, temporary, or IP-based URL. Real AI assistants link to legitimate, permanent URLs. Be cautious clicking this.'
          });
        }
      }
    }
    return findings;
  }

  function scanForCodeInjection() {
    var findings = [];
    var scripts = document.querySelectorAll('script:not([src])');
    var inlineCount = 0;
    var suspiciousCount = 0;

    for (var si = 0; si < scripts.length; si++) {
      var content = scripts[si].textContent || '';
      inlineCount++;
      if (content.indexOf('eval(') !== -1 || content.indexOf('document.cookie') !== -1 || content.indexOf('localStorage') !== -1 || content.indexOf('fetch(') !== -1 && content.indexOf('api') !== -1) {
        suspiciousCount++;
      }
    }

    if (suspiciousCount > 0) {
      findings.push({
        sev: 'danger', icon: '🕵️',
        title: 'Suspicious scripts detected on this AI page',
        text: 'Found ' + suspiciousCount + ' suspicious inline script(s) among ' + inlineCount + ' total. These scripts may be trying to steal your session tokens, conversation history, or personal data. Leave this page immediately.'
      });
    }

    return findings;
  }

  function scanForFakeUI() {
    var findings = [];
    var hostname = window.location.hostname;

    /* Check for fake login overlays */
    var loginForms = document.querySelectorAll('input[type="password"]');
    if (loginForms.length > 0) {
      var isOnKnownAI = false;
      for (var key in AI_SERVICES) {
        for (var di = 0; di < AI_SERVICES[key].legit.length; di++) {
          if (hostname.endsWith(AI_SERVICES[key].legit[di])) {
            isOnKnownAI = true;
            break;
          }
        }
        if (isOnKnownAI) break;
      }

      if (!isOnKnownAI) {
        findings.push({
          sev: 'danger', icon: '🔐',
          title: 'Fake AI chatbot with login form',
          text: 'This site has a password field but is NOT a known AI service. Scammers create fake "free AI" sites that ask for your account credentials. This is a credential harvesting attack. Real AI services (ChatGPT, Gemini, Claude) do NOT ask you to "log in" on unknown domains.'
        });
      }
    }

    /* Check for crypto wallet popups */
    var walletPopups = document.querySelectorAll('[class*="wallet"], [id*="wallet"], [class*="metamask"], [id*="metamask"], [class*="phantom"]');
    if (walletPopups.length > 0) {
      findings.push({
        sev: 'danger', icon: '🦊',
        title: 'Crypto wallet connection prompt detected',
        text: 'This AI page is asking to connect your crypto wallet. No legitimate AI service requires wallet connection. This is a crypto drainer scam — connecting your wallet will allow them to steal all your cryptocurrency. NEVER connect your wallet to an AI chatbot.'
      });
    }

    return findings;
  }

  /* ═══════════════ MAIN SCAN ═══════════════ */
  function runAIScan() {
    var aiInfo = detectAIService();
    var findings = [];
    var score = 100;

    if (aiInfo && aiInfo.isLegit) {
      /* Legitimate AI — light scan */
      findings.push({
        sev: 'safe', icon: aiInfo.service.icon,
        title: 'Verified ' + aiInfo.service.name + ' website',
        text: 'You are on the official ' + aiInfo.service.name + ' website (' + window.location.hostname + '). This is a legitimate AI service. Running security checks...'
      });

      /* Even on legit sites, scan for prompt injection and suspicious links */
      var injectionFindings = scanForPromptInjection();
      var linkFindings = scanForSuspiciousLinks();
      var codeFindings = scanForCodeInjection();

      findings = findings.concat(injectionFindings, linkFindings, codeFindings);

      if (injectionFindings.length === 0 && linkFindings.length === 0 && codeFindings.length === 0) {
        findings.push({
          sev: 'safe', icon: '✅',
          title: 'No threats on ' + aiInfo.service.name,
          text: 'This page is clean. No prompt injections, suspicious links, or malicious scripts detected. Your conversation is safe.'
        });
      }

      score -= (injectionFindings.length * 15) + (linkFindings.length * 10) + (codeFindings.length * 20);

    } else {
      /* Unknown or fake AI site — full scan */
      findings.push({
        sev: 'high', icon: '❓',
        title: 'Unknown AI chatbot website',
        text: '"' + window.location.hostname + '" is not a recognized AI service. Running full security scan...'
      });

      /* Run all scans */
      findings = findings.concat(
        scanForDataTheft(),
        scanForPromptInjection(),
        scanForSuspiciousLinks(),
        scanForCodeInjection(),
        scanForFakeUI()
      );

      score -= findings.length * 15;

      if (aiInfo && !aiInfo.isLegit) {
        findings.unshift({
          sev: 'danger', icon: '🎭',
          title: 'Possible fake ' + aiInfo.service.name + ' clone',
          text: 'This website contains "' + aiInfo.service.name + '" in the address but is NOT the official site. The real ' + aiInfo.service.name + ' is at ' + aiInfo.service.legit[0] + '. Scammers create fake AI sites to steal your data or inject malware. Do NOT enter any information.'
        });
        score -= 40;
      }
    }

    score = Math.max(0, Math.min(100, score));
    var risk = score >= 80 ? 'safe' : score >= 50 ? 'low' : score >= 30 ? 'warning' : 'danger';

    return {
      hostname: window.location.hostname,
      score: score,
      risk: risk,
      findings: findings,
      isAI: !!aiInfo,
      aiName: aiInfo ? aiInfo.service.name : null,
      isLegit: aiInfo ? aiInfo.isLegit : false
    };
  }

  /* ═══════════════ BADGE (DRAGGABLE + MINIMIZABLE) ═══════════════ */
  function showAIBadge(result) {
    var existing = document.getElementById('phishguard-ai-badge');
    if (existing) existing.remove();

    var colorMap = { safe: '#4caf50', low: '#ffc107', warning: '#ff9800', danger: '#f44336' };
    var labelMap = { safe: 'SAFE', low: 'LOW RISK', warning: 'CAUTION', danger: 'DANGER' };
    var iconMap = { safe: '✅', low: '⚠️', warning: '⚡', danger: '🚨' };

    var color = colorMap[result.risk];
    var aiLabel = result.isAI ? result.aiName : 'Unknown AI';
    var icon = result.isAI && result.isLegit ? '🤖' : '🛡️';
    var minimized = false;

    var badge = document.createElement('div');
    badge.id = 'phishguard-ai-badge';
    badge.style.cssText = 'position:fixed;bottom:16px;left:16px;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,sans-serif;cursor:grab;transition:opacity .3s,box-shadow .2s;user-select:none;';
    badge.innerHTML =
      '<div id="pg-ai-badge-inner" style="background:' + color + ';color:#fff;padding:8px 14px;border-radius:24px;box-shadow:0 4px 20px rgba(0,0,0,.4);display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;backdrop-filter:blur(10px)">' +
        '<span style="font-size:14px">' + icon + '</span>' +
        '<span id="pg-ai-badge-text">PhishGuard: ' + aiLabel + ' ' + labelMap[result.risk] + ' (' + result.score + '/100)</span>' +
        '<span id="pg-ai-badge-toggle" style="font-size:10px;opacity:.7;cursor:pointer;padding:2px 4px;border-radius:4px;margin-left:4px" title="Minimize/Expand">▲</span>' +
      '</div>';

    var panel = null;
    var panelOpen = false;

    /* ─── MINIMIZE / EXPAND ─── */
    var toggle = badge.querySelector('#pg-ai-badge-toggle');
    var badgeText = badge.querySelector('#pg-ai-badge-text');

    toggle.onclick = function(e) {
      e.stopPropagation();
      minimized = !minimized;
      if (minimized) {
        badgeText.style.display = 'none';
        toggle.textContent = '▼';
        badge.querySelector('#pg-ai-badge-inner').style.padding = '8px 10px';
        badge.querySelector('#pg-ai-badge-inner').style.borderRadius = '50%';
      } else {
        badgeText.style.display = '';
        toggle.textContent = '▲';
        badge.querySelector('#pg-ai-badge-inner').style.padding = '8px 14px';
        badge.querySelector('#pg-ai-badge-inner').style.borderRadius = '24px';
      }
    };

    /* ─── CLICK TO OPEN PANEL ─── */
    badge.querySelector('#pg-ai-badge-inner').onclick = function(e) {
      if (e.target.id === 'pg-ai-badge-toggle') return;
      e.stopPropagation();
      if (panelOpen && panel) {
        panel.remove();
        panelOpen = false;
        return;
      }
      panel = createAIPanel(result);
      document.body.appendChild(panel);
      panelOpen = true;
    };

    /* ─── DRAG ─── */
    var isDragging = false;
    var dragStartX, dragStartY, startLeft, startTop;
    badge.onmousedown = function(e) {
      if (e.target.id === 'pg-ai-badge-toggle' || (e.target.closest('#pg-ai-badge-inner') && e.target.id !== 'pg-ai-badge-text')) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      var rect = badge.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      badge.style.transition = 'none';
      badge.style.cursor = 'grabbing';
      e.preventDefault();
    };
    document.onmousemove = function(e) {
      if (!isDragging) return;
      var dx = e.clientX - dragStartX;
      var dy = e.clientY - dragStartY;
      badge.style.left = (startLeft + dx) + 'px';
      badge.style.top = (startTop + dy) + 'px';
      badge.style.right = 'auto';
      badge.style.bottom = 'auto';
    };
    document.onmouseup = function() {
      if (isDragging) {
        isDragging = false;
        badge.style.cursor = 'grab';
        badge.style.transition = 'opacity .3s';
      }
    };

    /* ─── FADE IN / OUT ─── */
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(20px)';
    setTimeout(function() {
      badge.style.transition = 'all .4s ease';
      badge.style.opacity = '1';
      badge.style.transform = 'translateY(0)';
    }, 2000);

    var hideTimeout;
    badge.onmouseenter = function() { clearTimeout(hideTimeout); badge.style.opacity = '1'; };
    badge.onmouseleave = function() {
      hideTimeout = setTimeout(function() {
        if (!panelOpen) badge.style.opacity = '0.3';
      }, 3000);
    };

    setTimeout(function() {
      badge.style.opacity = '1';
      hideTimeout = setTimeout(function() {
        if (!panelOpen) badge.style.opacity = '0.3';
      }, 5000);
    }, 2000);

    document.body.appendChild(badge);
  }

  /* ═══════════════ PANEL ═══════════════ */
  function createAIPanel(result) {
    var colorMap = { safe: '#4caf50', low: '#ffc107', warning: '#ff9800', danger: '#f44336' };
    var labelMap = { safe: 'SAFE', low: 'LOW RISK', warning: 'CAUTION', danger: 'DANGER' };
    var color = colorMap[result.risk];
    var aiName = result.isAI ? result.aiName : 'Unknown AI';

    var el = document.createElement('div');
    el.id = 'phishguard-ai-panel';
    el.style.cssText = 'position:fixed;bottom:60px;left:16px;width:380px;max-height:75vh;background:#1a1a2e;border-radius:16px;overflow:hidden;z-index:2147483646;box-shadow:0 20px 60px rgba(0,0,0,.6);font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#fff;display:flex;flex-direction:column;';

    var html = '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:14px;display:flex;justify-content:space-between;align-items:center">' +
      '<div><div style="font-size:14px;font-weight:700">🤖 PhishGuard AI Chatbot Scanner</div>' +
      '<div style="font-size:10px;color:rgba(255,255,255,.4);margin-top:2px">' + aiName + ' — ' + result.hostname + '</div></div>' +
      '<div style="text-align:right"><div style="font-size:22px;font-weight:800;color:' + color + '">' + result.score + '</div>' +
      '<div style="font-size:9px;color:' + color + '">' + labelMap[result.risk] + '</div></div>' +
      '</div>';

    /* Score bar */
    html += '<div style="padding:0 14px 10px">' +
      '<div style="height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden">' +
      '<div style="height:100%;width:' + result.score + '%;background:' + color + ';border-radius:2px;transition:width .5s"></div></div></div>';

    /* Findings */
    html += '<div style="flex:1;overflow-y:auto;padding:0 14px 14px">';
    for (var i = 0; i < result.findings.length; i++) {
      var f = result.findings[i];
      var fc = f.sev === 'danger' ? '#f44336' : f.sev === 'high' ? '#ff9800' : f.sev === 'safe' ? '#4caf50' : f.sev === 'warning' ? '#ff9800' : '#ffc107';
      html += '<div style="background:rgba(0,0,0,.25);border-radius:8px;padding:10px;margin-bottom:6px;border-left:3px solid ' + fc + '">' +
        '<div style="font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px"><span>' + f.icon + '</span> ' + f.title + '</div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,.6);margin-top:4px;line-height:1.5">' + f.text + '</div></div>';
    }
    html += '</div>';

    html += '<div style="padding:10px 14px;border-top:1px solid rgba(76,175,80,.2);text-align:center;font-size:9px;color:rgba(255,255,255,.3)">🤖 PhishGuard AI Chatbot Scanner v1.0 — Protecting you on every AI platform</div>';

    el.innerHTML = html;

    setTimeout(function() {
      document.addEventListener('click', function handler(e) {
        if (!el.contains(e.target) && e.target.id !== 'phishguard-ai-badge' && !document.getElementById('phishguard-ai-badge').contains(e.target)) {
          el.remove();
          document.removeEventListener('click', handler);
        }
      });
    }, 100);

    return el;
  }

  /* ═══════════════ START ═══════════════ */
  function autoScan() {
    try {
      var result = runAIScan();
      showAIBadge(result);
    } catch (e) {
      console.error('PhishGuard AI Chatbot Scanner error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoScan);
  } else {
    autoScan();
  }

})();
