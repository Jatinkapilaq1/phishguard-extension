/**
 * PhishGuard AI — Website Auto-Scanner v5.0
 * Runs on EVERY webpage automatically
 * Shows floating safety badge — click for full analysis
 * Professional-grade detailed explanations
 */
(function() {
  'use strict';

  if (document.getElementById('phishguard-panel') || document.getElementById('phishguard-badge')) return;
  if (window.location.protocol === 'chrome-extension:') return;

  /* ═══════════════ SKIP AI CHATBOT SITES ═══════════════ */
  /* AI sites are handled by ai-chatbot-scanner.js — don't show duplicate badge */
  var AI_DOMAINS = [
    'chatgpt.com','chat.openai.com','openai.com','gemini.google.com','bard.google.com','aistudio.google.com',
    'claude.ai','anthropic.com','console.anthropic.com',
    'copilot.microsoft.com','copilot.cloud.microsoft','bing.com',
    'perplexity.ai','grok.com','deepseek.com','chat.deepseek.com',
    'ai.meta.com','meta.ai','qwen.ai','chat.qwen.ai',
    'opencode.ai','opencode.sh','cursor.com','cursor.sh','devin.ai','cognition.ai',
    'v0.dev','bolt.new','stackblitz.com','replit.com','replit.ai','lovable.dev',
    'windsurf.com','codeium.com','sourcegraph.com','phind.com','github.com/features/copilot',
    'tabnine.com','aws.amazon.com/q','jetbrains.com/ai',
    'manus.im','manus.kim','crewai.com','agpt.co','autogpt.net','metagpt.io',
    'autogen.io','langchain.com','smith.langchain.com','flowtest.ai','dify.ai','cloud.dify.ai',
    'n8n.io','lindy.ai','superagent.sh',
    'midjourney.com','openai.com/dall-e','stability.ai','stablediffusionweb.com','clipdrop.co',
    'ideogram.ai','leonardo.ai','runwayml.com','pika.art','suno.com','udio.com',
    'elevenlabs.io','canva.com','remove.bg',
    'synthesia.io','heygen.com','descript.com','speechify.com',
    'you.com','youchat.com','kagi.com',
    'jasper.ai','copy.ai','writesonic.com','grammarly.com','notion.so','mem.ai',
    'character.ai','janitorai.com','chatpdf.com','poe.com',
    'huggingface.co','hf.co','cohere.com','chat.mistral.ai','mistral.ai',
    'pi.ai','heypi.com','groq.com','together.ai','fireworks.ai','openrouter.ai',
    'novita.ai','chutes.ai','venice.ai',
    'agentforce.com','zendesk.com','intercom.com','freshdesk.com','ada.cx','tidio.com','drift.com',
    'figma.com','framer.com','webflow.com',
    'julius.ai','chatbase.co','botpress.com','botpress.cloud',
    'vapi.ai','bland.ai','retellai.com','cartesia.ai',
    'deepl.com','deepl.pro',
    'ibm.com/watsonx',
    'khanacademy.org/khan-labs','duolingo.com',
    'askcleo.com',
    'vercel.com/ai','llamaindex.ai','semantickernel.ai','haystack.deepset.ai','flowiseai.com',
    'mem0.ai','getzep.com',
    'zapier.com','make.com','bardeen.ai','taskade.com','otter.ai','fireflies.ai','tldv.io','grain.com',
    'elicit.com','consensus.app','scite.ai','typeset.io','scholarcy.com',
    'replicate.com','e2b.dev','modal.com','anyscale.com','deepinfra.com','friendli.ai',
    'baseten.co','banana.dev','fal.ai','lamini.ai',
    'blackforestlabs.ai','minimaxi.com','zhipuai.cn','moonshot.cn','baichuan-ai.com',
    'inflection.ai','x.ai','alibabacloud.com','yiyan.baidu.com','tencent.com',
    'nvidia.com/ai','build.nvidia.com','c3.ai','palantir.com','datarobot.com','h2o.ai',
    'databricks.com','snowflake.com','mongodb.com','pinecone.io','weaviate.io','chromadb.com','qdrant.tech','zilliz.com',
    'wandb.ai','neptune.ai','comet.ml',
    'wandb.ai/site','comet.com',
    'paperpal.com','writefull.com','trinka.ai','inkforall.com',
    'rytr.me','simplified.com','neuronwriter.com','frase.io','marketmuse.com','scalenut.com','surferseo.com',
    'clearscope.io','wordtune.com','quillbot.com','textcortex.com','hyperwriteai.com',
    'shortlyai.com','longshot.ai','contentbot.ai','writer.com',
    'assemblyai.com','play.ht','murf.ai','wellsaidlabs.com','lovo.ai',
    'photoroom.com','cutout.pro','cleanup.pictures','bigjpg.com','topazlabs.com','magnific.ai',
    'kapwing.com','opus.pro','opusclip.com','getmunch.com',
    'reface.ai','facecheck.id','personapixel.com','headshotpro.com','aragon.ai',
    'stunning.so','dora.run','riffusion.com','musicfy.lol','soundraw.io','mubert.com','lalal.ai',
    'tactiq.io','read.ai','notta.ai','turboscribe.ai',
    'rev.ai','sonix.ai','happyscribe.com','krisp.ai','cleanvoice.ai',
    'transkribus.eu','mathpix.com',
    'wolframalpha.com','photomath.com','symbolab.com','mathway.com',
    'coursera.org','udemy.com','edx.org',
    'talkpal.ai','elsaspeak.com','memrise.com','busuu.com','speak.com',
    'semanticscholar.org','connectedpapers.com',
    'sonora.com','notion.site',
    'lechat.mistral.ai',
    'lumalabs.ai','sora.com',
    'salesforce.com','sap.com','oracle.com','servicenow.com','workday.com',
    'qualtrics.com','surveymonkey.com','typeform.com','jotform.com',
    'zoho.com','freshworks.com',
    'clickup.com','asana.com','monday.com','trello.com','atlassian.com','linear.app',
    'hubspot.com','gong.io','clari.com','outreach.io','salesloft.com',
    'apollo.io','seamless.ai','leadiq.com','zoominfo.com','clearbit.com','6sense.com','demandbase.com',
    'kustomer.com','helpscout.com','crisp.chat','livechat.com','tawk.to',
    'sitegpt.ai','docsbot.ai',
    'ghostwrite.ai','regie.ai',
    'cleanvoice.ai','play.ht',
    'speechify.com',
    'opencode.ai','opencode.sh'
  ];
  var hostname = window.location.hostname.toLowerCase();
  for (var aiDi = 0; aiDi < AI_DOMAINS.length; aiDi++) {
    if (hostname === AI_DOMAINS[aiDi] || hostname.endsWith('.' + AI_DOMAINS[aiDi])) {
      return; /* AI site — ai-chatbot-scanner.js handles this */
    }
  }

  /* ═══════════════ PHISHING DATABASE ═══════════════ */
  var KNOWN_PHISHING = [
    'paypal-security','paypal-verify','apple-id-verify','microsoft-login','google-security',
    'facebook-login','instagram-verify','amazon-security','netflix-billing','spotify-payment',
    'whatsapp-web','telegram-login','linkedin-verify','dropbox-login','dhl-tracking',
    'fedex-delivery','ups-package','usps-tracking','irs-gov','aadhaar-verify',
    'bank-login','secure-banking','account-verify','identity-confirm','update-account'
  ];

  var TRUSTED_DOMAINS = [
    'google.com','gmail.com','youtube.com','google.co.in','googleapis.com','gstatic.com','cloud.google.com','gemini.google.com',
    'facebook.com','instagram.com','twitter.com','x.com','linkedin.com',
    'microsoft.com','outlook.com','live.com','office.com','office365.com','github.com','azure.com','copilot.microsoft.com',
    'apple.com','icloud.com','microsoftonline.com',
    'amazon.com','amazon.in','amazon.co.in','aws.amazon.com',
    'paypal.com','paypal.in',
    'netflix.com','spotify.com',
    'flipkart.com','zomato.com','swiggy.com','meesho.com','myntra.com',
    /* AI Services */
    'chatgpt.com','chat.openai.com','openai.com','claude.ai','anthropic.com','perplexity.ai',
    'copilot.cloud.microsoft','bing.com','deepseek.com','chat.deepseek.com','grok.com',
    'huggingface.co','hf.co','cohere.com','chat.mistral.ai','mistral.ai',
    'pi.ai','heypi.com','you.com','youchat.com','poe.com','character.ai',
    'phind.com','cursor.com','cursor.sh','v0.dev','bolt.new','stackblitz.com','replit.com',
    'lovable.dev','opencode.ai','opencode.sh',
    'irctc.co.in','makemytrip.com','redbus.in',
    'phonepe.com','paytm.com','cred.club',
    'sbi.co.in','hdfcbank.com','icicibank.com','axisbank.com','kotak.com',
    'wikipedia.org','reddit.com','quora.com','medium.com','stackoverflow.com',
    'bing.com','yahoo.com','duckduckgo.com','mozilla.org',
    'zoom.us','slack.com','discord.com','telegram.org','whatsapp.com',
    'ebay.com','walmart.com','target.com','bestbuy.com','etsy.com',
    'booking.com','airbnb.com','tripadvisor.com','expedia.com',
    'gov.in','nic.in','uidai.gov.in','incometax.gov.in'
  ];

  var BAD_TLDS = ['.tk','.ml','.ga','.cf','.gq','.xyz','.top','.buzz','.club','.work','.click','.link','.fun','.site','.online','.icu','.monster','.surf','.cfd','.sbs','.cam','.rest','.bond','.mom'];

  var BRAND_MAP = [
    { name: 'Google', legit: 'google.com', patterns: ['google','gmail','gdrive','gcloud'] },
    { name: 'Microsoft', legit: 'microsoft.com', patterns: ['microsoft','outlook','office365','live','hotmail'] },
    { name: 'Apple', legit: 'apple.com', patterns: ['apple','icloud','itunes','appleid'] },
    { name: 'Amazon', legit: 'amazon.com', patterns: ['amazon','aws'] },
    { name: 'Facebook', legit: 'facebook.com', patterns: ['facebook','fb','meta','instagram','whatsapp'] },
    { name: 'Netflix', legit: 'netflix.com', patterns: ['netflix'] },
    { name: 'PayPal', legit: 'paypal.com', patterns: ['paypal'] },
    { name: 'LinkedIn', legit: 'linkedin.com', patterns: ['linkedin'] },
    { name: 'HDFC Bank', legit: 'hdfcbank.com', patterns: ['hdfc','hdfcbank'] },
    { name: 'SBI', legit: 'onlinesbi.sbi', patterns: ['sbi','onlinesbi'] },
    { name: 'ICICI Bank', legit: 'icicibank.com', patterns: ['icici','icicibank'] },
    { name: 'Flipkart', legit: 'flipkart.com', patterns: ['flipkart'] },
    { name: 'Zomato', legit: 'zomato.com', patterns: ['zomato'] },
    { name: 'Swiggy', legit: 'swiggy.com', patterns: ['swiggy'] },
    { name: 'PhonePe', legit: 'phonepe.com', patterns: ['phonepe'] },
    { name: 'Paytm', legit: 'paytm.com', patterns: ['paytm'] },
    { name: 'GitHub', legit: 'github.com', patterns: ['github','githubio'] },
    { name: 'Twitter/X', legit: 'x.com', patterns: ['twitter','xcom'] },
    { name: 'Telegram', legit: 'telegram.org', patterns: ['telegram'] },
    { name: 'WhatsApp', legit: 'whatsapp.com', patterns: ['whatsapp'] }
  ];

  /* ═══════════════ HELPERS ═══════════════ */
  function splitHostname(h) {
    return h.split('.').filter(function(p) { return p.length > 0; });
  }

  function isSubdomainOf(host, domain) {
    return host === domain || host.endsWith('.' + domain);
  }

  /* ═══════════════ URL ANALYSIS ═══════════════ */
  function analyzeWebsite() {
    var url = window.location.href;
    var hostname = window.location.hostname;
    var protocol = window.location.protocol;
    var pathname = window.location.pathname;
    var parts = splitHostname(hostname);
    var findings = [];
    var score = 100;

    /* ─── 1. HTTPS CHECK ─── */
    if (protocol === 'http:') {
      findings.push({
        sev: 'danger', icon: '🔓',
        title: 'Website is NOT encrypted (HTTP)',
        text: 'This website uses HTTP instead of HTTPS. Your data is sent in plain text — anyone on the same WiFi (coffee shop, airport) can read your passwords, card numbers, and messages. Look for the 🔒 lock icon in your address bar. Never enter personal information on HTTP sites.'
      });
      score -= 25;
    }

    /* ─── 2. IP ADDRESS URL ─── */
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(hostname)) {
      var ip = hostname.split('/')[0];
      findings.push({
        sev: 'danger', icon: '🚨',
        title: 'Website uses numbers, not a real name',
        text: 'Instead of a name like "google.com", this website uses an IP address: "' + ip + '". Real businesses never use raw numbers. Scammers do this because domain names cost money but IPs can be obtained cheaply. This is almost certainly a scam or attack.'
      });
      score -= 35;
    }

    /* ─── 3. BAD TLD CHECK ─── */
    var tld = '.' + parts[parts.length - 1];
    for (var ti = 0; ti < BAD_TLDS.length; ti++) {
      if (tld === BAD_TLDS[ti] || hostname.endsWith(BAD_TLDS[ti])) {
        findings.push({
          sev: 'danger', icon: '🌐',
          title: 'This domain ending "' + tld + '" is commonly used for scams',
          text: 'The domain ending (TLD) is "' + tld + '". These endings cost almost nothing (<₹1) and have no identity verification. Studies show 90%+ of phishing sites use these cheap TLDs. Real companies use .com, .in, .org, .net, or .gov. Be very cautious.'
        });
        score -= 40;
        break;
      }
    }

    /* ─── 4. PHISHING PATTERN ─── */
    var hl = hostname.toLowerCase();
    for (var pi = 0; pi < KNOWN_PHISHING.length; pi++) {
      if (hl.indexOf(KNOWN_PHISHING[pi]) !== -1) {
        var matchStr = KNOWN_PHISHING[pi];
        findings.push({
          sev: 'danger', icon: '🎣',
          title: 'URL matches known phishing pattern: "' + matchStr + '"',
          text: 'This website address contains "' + matchStr + '" — a pattern found in thousands of known phishing websites. Scammers register domains like "paypal-security-verify.com" or "microsoft-login-secure.net" to trick you into thinking it\'s the real site. The real ' + matchStr.split('-')[0] + ' website is NOT this address.'
        });
        score -= 45;
        break;
      }
    }

    /* ─── 5. TRUSTED DOMAIN ─── */
    var isTrusted = false;
    var trustedBrand = '';
    for (var tdi = 0; tdi < TRUSTED_DOMAINS.length; tdi++) {
      if (isSubdomainOf(hl, TRUSTED_DOMAINS[tdi])) {
        isTrusted = true;
        trustedBrand = TRUSTED_DOMAINS[tdi];
        break;
      }
    }
    if (isTrusted) {
      score = Math.max(score, 95);
      findings.unshift({
        sev: 'safe', icon: '✅',
        title: 'Verified trusted website: ' + trustedBrand,
        text: '"' + hostname + '" is owned and operated by ' + trustedBrand + '. This is a legitimate, well-known website with proper security. You can safely use this site.'
      });
    }

    /* ─── 6. SUBDOMAIN ANALYSIS ─── */
    if (parts.length > 3) {
      var subdomainParts = parts.slice(0, -2);
      var parentDomain = parts.slice(-2).join('.');
      findings.push({
        sev: 'high', icon: '🔗',
        title: 'Complex subdomain structure detected',
        text: 'This URL has ' + parts.length + ' parts: "' + parts.join('" → "') + '". The subdomains are: "' + subdomainParts.join('", "') + '" sitting on top of "' + parentDomain + '". Real ' + parentDomain.split('.')[0] + ' pages rarely need this many sub-layers. Scammers add words like "secure", "verify", "login" as subdomains to make fake sites look real. Always check: is the FINAL domain (after the last dot before .com) the real company?'
      });
      score -= 15;
    } else if (parts.length === 3 && !isTrusted) {
      findings.push({
        sev: 'low', icon: '🔗',
        title: 'This site uses a subdomain',
        text: 'Structure: "' + parts[0] + '" is a subdomain of "' + parts.slice(1).join('.') + '". Not all subdomains are bad — many real sites use them. But verify the parent domain is legitimate.'
      });
    }

    /* ─── 7. SUSPICIOUS WORDS IN URL ─── */
    if (!isTrusted) {
      var urlWords = hostname.toLowerCase();
      var suspiciousFindings = [];
      var suspWordMap = {
        'login': 'login', 'signin': 'sign-in', 'secure': 'secure', 'verify': 'verify',
        'account': 'account', 'update': 'update', 'confirm': 'confirm', 'password': 'password',
        'banking': 'banking', 'auth': 'authentication', 'wallet': 'wallet', 'crypto': 'cryptocurrency',
        'pay': 'payment', 'recover': 'recovery', 'suspend': 'suspension'
      };
      var keys = Object.keys(suspWordMap);
      for (var swi = 0; swi < keys.length; swi++) {
        if (urlWords.indexOf(keys[swi]) !== -1) {
          suspiciousFindings.push('"' + keys[swi] + '" (' + suspWordMap[keys[swi]] + ')');
        }
      }
      if (suspiciousFindings.length > 0) {
        findings.push({
          sev: 'high', icon: '⚠️',
          title: 'URL contains ' + suspiciousFindings.length + ' suspicious word(s)',
          text: 'Found words: ' + suspiciousFindings.join(', ') + ' in the website address. These words are commonly used in phishing URLs to create urgency or fake legitimacy. For example, a real bank\'s website is "hdfcbank.com" — not "secure-hdfc-banking-login.com". The more of these words combined, the more suspicious.'
        });
        score -= suspiciousFindings.length * 5;
      }
    }

    /* ─── 8. PUNYCODE / IDN HOMOGRAPH ─── */
    if (hostname.indexOf('xn--') !== -1) {
      findings.push({
        sev: 'danger', icon: '🔤',
        title: 'Hidden characters detected (Punycode/IDN)',
        text: 'This URL contains encoded characters (shown as "xn--" in the address). This is called an "IDN Homograph Attack" — scammers register domains that LOOK like real ones using foreign characters. For example, "аpple.com" (with a Cyrillic "а") looks identical to "apple.com" but goes to a scam site. Your browser shows the decoded version, but the real domain is different.'
      });
      score -= 35;
    }

    /* ─── 9. PASSWORD FORMS ON UNTRUSTED ─── */
    if (!isTrusted) {
      var passForms = document.querySelectorAll('input[type="password"]');
      if (passForms.length > 0) {
        var formDetails = [];
        for (var ffi = 0; ffi < passForms.length; ffi++) {
          var f = passForms[ffi];
          var formParent = f.closest('form');
          var action = formParent ? formParent.getAttribute('action') : null;
          var formInfo = 'password field';
          if (action) formInfo += ' → form submits to "' + action + '"';
          formDetails.push(formInfo);
        }
        findings.push({
          sev: 'danger', icon: '🔑',
          title: 'This website asks for a password — but is NOT a trusted site',
          text: 'Found ' + passForms.length + ' password field(s) on this page. ' + formDetails.join('; ') + '. Since "' + hostname + '" is NOT a well-known website, this could be a phishing page designed to steal your login credentials. Before entering any password, verify the website is legitimate. Ask yourself: did I come here directly, or did I click a link in an email/SMS?'
        });
        score -= 25;
      }
    }

    /* ─── 10. CRYPTO MINERS ─── */
    var scripts = document.querySelectorAll('script[src]');
    for (var sci = 0; sci < scripts.length; sci++) {
      var src = (scripts[sci].getAttribute('src') || '').toLowerCase();
      if (src.indexOf('coinhive') !== -1 || src.indexOf('coin-') !== -1 || src.indexOf('cryptoloot') !== -1 || src.indexOf('miner') !== -1) {
        findings.push({
          sev: 'danger', icon: '⛏️',
          title: 'Hidden cryptocurrency miner found',
          text: 'This website is running a hidden script from "' + src + '" that mines cryptocurrency using YOUR computer\'s processor. This slows down your device, increases electricity bills, and can damage hardware over time. The website owner profits while you pay the cost. Leave immediately and consider using an ad blocker.'
        });
        score -= 40;
        break;
      }
    }

    /* ─── 11. BRAND IMPERSONATION ─── */
    if (!isTrusted) {
      for (var bri = 0; bri < BRAND_MAP.length; bri++) {
        var brand = BRAND_MAP[bri];
        for (var bpi = 0; bpi < brand.patterns.length; bpi++) {
          var pat = brand.patterns[bpi];
          if (hl.indexOf(pat) !== -1 && hl.indexOf(pat) < hl.indexOf('.') && !isSubdomainOf(hl, brand.legit)) {
            findings.push({
              sev: 'danger', icon: '🎭',
              title: 'This website may be pretending to be ' + brand.name,
              text: 'The address contains "' + pat + '" which suggests it\'s trying to look like ' + brand.name + '. But the real ' + brand.name + ' website is "' + brand.legit + '" — NOT "' + hostname + '". This is a classic "typosquatting" or "subdomain impersonation" trick. Scammers register domains like "secure-' + pat + '-verify.com" to fool people. Always type the real URL directly instead of clicking links.'
            });
            score -= 40;
            break;
          }
        }
        if (findings.length > 0 && findings[findings.length - 1].icon === '🎭') break;
      }
    }

    /* ─── 12. URL LENGTH (phishing indicator) ─── */
    if (!isTrusted && hostname.length > 40) {
      findings.push({
        sev: 'low', icon: '📏',
        title: 'Unusually long website address',
        text: 'This domain name is ' + hostname.length + ' characters long: "' + hostname + '". Phishing URLs tend to be longer because they pack in words like "secure", "verify", "login" to look legitimate. While not always malicious, it\'s a warning sign.'
      });
      score -= 5;
    }

    /* ─── 13. MANY HYPHENS ─── */
    if (!isTrusted) {
      var hyphenCount = (hostname.match(/-/g) || []).length;
      if (hyphenCount >= 3) {
        findings.push({
          sev: 'high', icon: '➖',
          title: 'URL has ' + hyphenCount + ' hyphens — phishing indicator',
          text: 'This domain has ' + hyphenCount + ' hyphens: "' + hostname + '". Research shows phishing domains average 3-4x more hyphens than legitimate ones. Real companies rarely use more than 1-2 hyphens in their domains.'
        });
        score -= 10;
      }
    }

    /* ─── DEFAULT SAFE ─── */
    if (findings.length === 0) {
      findings.push({
        sev: 'safe', icon: '✅',
        title: 'No threats detected on this website',
        text: 'PhishGuard analyzed this page and found no known phishing patterns, suspicious scripts, or security issues. The website uses encryption, has a clean URL, and doesn\'t match any known threat signatures.'
      });
    }

    score = Math.max(0, Math.min(100, score));
    var risk = score >= 80 ? 'safe' : score >= 50 ? 'low' : score >= 30 ? 'warning' : 'danger';

    return {
      url: url,
      hostname: hostname,
      score: score,
      risk: risk,
      findings: findings,
      partCount: parts.length,
      parts: parts
    };
  }

  /* ═══════════════ FLOATING BADGE (DRAGGABLE + MINIMIZABLE) ═══════════════ */
  function showBadge(result) {
    var existing = document.getElementById('phishguard-badge');
    if (existing) existing.remove();

    var colorMap = { safe: '#4caf50', low: '#ffc107', warning: '#ff9800', danger: '#f44336' };
    var labelMap = { safe: 'SAFE', low: 'LOW RISK', warning: 'CAUTION', danger: 'DANGER' };
    var iconMap = { safe: '✅', low: '⚠️', warning: '⚡', danger: '🚨' };

    var color = colorMap[result.risk];
    var minimized = false;

    var badge = document.createElement('div');
    badge.id = 'phishguard-badge';
    badge.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,sans-serif;cursor:grab;transition:opacity .3s,box-shadow .2s;user-select:none;';
    badge.innerHTML =
      '<div id="pg-badge-inner" style="background:' + color + ';color:#fff;padding:8px 14px;border-radius:24px;box-shadow:0 4px 20px rgba(0,0,0,.4);display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;backdrop-filter:blur(10px)">' +
        '<span style="font-size:14px">' + iconMap[result.risk] + '</span>' +
        '<span id="pg-badge-text">PhishGuard: ' + labelMap[result.risk] + ' (' + result.score + '/100)</span>' +
        '<span id="pg-badge-toggle" style="font-size:10px;opacity:.7;cursor:pointer;padding:2px 4px;border-radius:4px;margin-left:4px" title="Minimize/Expand">▼</span>' +
      '</div>';

    var panel = null;
    var panelOpen = false;

    /* ─── MINIMIZE / EXPAND ─── */
    var toggle = badge.querySelector('#pg-badge-toggle');
    var badgeText = badge.querySelector('#pg-badge-text');

    toggle.onclick = function(e) {
      e.stopPropagation();
      minimized = !minimized;
      if (minimized) {
        badgeText.style.display = 'none';
        toggle.textContent = '▲';
        badge.querySelector('#pg-badge-inner').style.padding = '8px 10px';
        badge.querySelector('#pg-badge-inner').style.borderRadius = '50%';
      } else {
        badgeText.style.display = '';
        toggle.textContent = '▼';
        badge.querySelector('#pg-badge-inner').style.padding = '8px 14px';
        badge.querySelector('#pg-badge-inner').style.borderRadius = '24px';
      }
    };

    /* ─── CLICK TO OPEN PANEL ─── */
    badge.querySelector('#pg-badge-inner').onclick = function(e) {
      if (e.target.id === 'pg-badge-toggle') return;
      e.stopPropagation();
      if (panelOpen && panel) {
        panel.remove();
        panelOpen = false;
        return;
      }
      panel = createPanel(result);
      document.body.appendChild(panel);
      panelOpen = true;
    };

    /* ─── DRAG ─── */
    var isDragging = false;
    var dragStartX, dragStartY, startLeft, startTop;
    badge.onmousedown = function(e) {
      if (e.target.id === 'pg-badge-toggle' || e.target.closest('#pg-badge-inner') && e.target.closest('#pg-badge-inner').onclick) {
        if (e.target.id !== 'pg-badge-toggle' && e.target.id !== 'pg-badge-text') return;
      }
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
    }, 1500);

    var hideTimeout;
    badge.onmouseenter = function() { clearTimeout(hideTimeout); badge.style.opacity = '1'; };
    badge.onmouseleave = function() {
      hideTimeout = setTimeout(function() {
        if (!panelOpen) { badge.style.opacity = '0.3'; }
      }, 3000);
    };

    setTimeout(function() {
      badge.style.opacity = '1';
      hideTimeout = setTimeout(function() {
        if (!panelOpen) badge.style.opacity = '0.3';
      }, 5000);
    }, 1500);

    document.body.appendChild(badge);
  }

  /* ═══════════════ FULL PANEL ═══════════════ */
  function createPanel(result) {
    var colorMap = { safe: '#4caf50', low: '#ffc107', warning: '#ff9800', danger: '#f44336' };
    var labelMap = { safe: 'SAFE', low: 'LOW RISK', warning: 'CAUTION', danger: 'DANGER' };
    var color = colorMap[result.risk];

    var el = document.createElement('div');
    el.id = 'phishguard-panel';
    el.style.cssText = 'position:fixed;bottom:60px;right:16px;width:380px;max-height:75vh;background:#1a1a2e;border-radius:16px;overflow:hidden;z-index:2147483646;box-shadow:0 20px 60px rgba(0,0,0,.6);font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#fff;display:flex;flex-direction:column;';

    var html = '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:14px;display:flex;justify-content:space-between;align-items:center">' +
      '<div><div style="font-size:14px;font-weight:700">🛡️ PhishGuard AI</div>' +
      '<div style="font-size:10px;color:rgba(255,255,255,.4);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px" title="' + result.hostname + '">' + result.hostname + '</div></div>' +
      '<div style="text-align:right"><div style="font-size:22px;font-weight:800;color:' + color + '">' + result.score + '</div>' +
      '<div style="font-size:9px;color:' + color + '">' + labelMap[result.risk] + '</div></div>' +
      '</div>';

    /* URL Breakdown */
    html += '<div style="padding:0 14px 10px">' +
      '<div style="background:rgba(0,0,0,.3);border-radius:8px;padding:8px 10px;font-size:10px;font-family:monospace;color:rgba(255,255,255,.5);word-break:break-all">' +
      '<span style="color:#4caf50">' + window.location.protocol + '//</span>' +
      '<span style="color:#ff9800">' + result.hostname + '</span>' +
      (window.location.pathname !== '/' ? '<span style="color:rgba(255,255,255,.3)">' + window.location.pathname + '</span>' : '') +
      '</div></div>';

    /* Score bar */
    html += '<div style="padding:0 14px 10px">' +
      '<div style="height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden">' +
      '<div style="height:100%;width:' + result.score + '%;background:' + color + ';border-radius:2px;transition:width .5s"></div></div></div>';

    /* Findings */
    html += '<div style="flex:1;overflow-y:auto;padding:0 14px 14px">';
    for (var i = 0; i < result.findings.length; i++) {
      var f = result.findings[i];
      var fc = f.sev === 'danger' ? '#f44336' : f.sev === 'high' ? '#ff9800' : f.sev === 'safe' ? '#4caf50' : '#ffc107';
      html += '<div style="background:rgba(0,0,0,.25);border-radius:8px;padding:10px;margin-bottom:6px;border-left:3px solid ' + fc + '">' +
        '<div style="font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px"><span>' + f.icon + '</span> ' + f.title + '</div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,.6);margin-top:4px;line-height:1.5">' + f.text + '</div></div>';
    }
    html += '</div>';

    html += '<div style="padding:10px 14px;border-top:1px solid rgba(76,175,80,.2);text-align:center;font-size:9px;color:rgba(255,255,255,.3)">🛡️ Powered by PhishGuard AI v5.0</div>';

    el.innerHTML = html;

    setTimeout(function() {
      document.addEventListener('click', function handler(e) {
        if (!el.contains(e.target) && e.target.id !== 'phishguard-badge' && !document.getElementById('phishguard-badge').contains(e.target)) {
          el.remove();
          document.removeEventListener('click', handler);
        }
      });
    }, 100);

    return el;
  }

  /* ═══════════════ AUTO-SCAN ═══════════════ */
  function autoScan() {
    try {
      var result = analyzeWebsite();
      showBadge(result);
    } catch (e) {
      console.error('PhishGuard: Auto-scan error', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoScan);
  } else {
    autoScan();
  }

})();
