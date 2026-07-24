/**
 * PhishGuard AI - Gmail Add-on
 * Works on Android + iOS inside the Gmail app
 * No DOM access — uses Gmail API + CardService UI
 */

/* ═══════════════ BRAND DATABASE ═══════════════ */
var BRANDS = {
  google:    { d: ['google.com','gmail.com','google.co.in','googlemail.com'], n: ['google','gmail','google account','google pay','gpay'] },
  microsoft: { d: ['microsoft.com','outlook.com','live.com','office.com','office365.com','hotmail.com'], n: ['microsoft','outlook','office 365','onedrive','azure','teams'] },
  apple:     { d: ['apple.com','icloud.com','me.com'], n: ['apple','icloud','apple id','apple pay','app store','itunes'] },
  amazon:    { d: ['amazon.com','amazon.in','amazon.co.in','amazonpay.com','amazonaws.com'], n: ['amazon','prime','amazon pay','aws'] },
  paypal:    { d: ['paypal.com','paypal.co.in','paypal.in'], n: ['paypal'] },
  facebook:  { d: ['facebook.com','meta.com','fb.com'], n: ['facebook','fb','meta','instagram','whatsapp'] },
  netflix:   { d: ['netflix.com','netflix.co.in'], n: ['netflix'] },
  spotify:   { d: ['spotify.com'], n: ['spotify'] },
  linkedin:  { d: ['linkedin.com','linkedinmail.com'], n: ['linkedin'] },
  zomato:    { d: ['zomato.com'], n: ['zomato'] },
  swiggy:    { d: ['swiggy.com','swiggy.in'], n: ['swiggy','instamart'] },
  flipkart:  { d: ['flipkart.com'], n: ['flipkart'] },
  meesho:    { d: ['meesho.com'], n: ['meesho'] },
  myntra:    { d: ['myntra.com'], n: ['myntra'] },
  uber:      { d: ['uber.com'], n: ['uber','uber eats'] },
  ola:       { d: ['olacabs.com'], n: ['ola'] },
  makemytrip:{ d: ['makemytrip.com'], n: ['makemytrip','mmt'] },
  irctc:     { d: ['irctc.co.in','irctc.in'], n: ['irctc','indian rail'] },
  ajio:      { d: ['ajio.com'], n: ['ajio'] },
  Tatacliq:  { d: ['tatacliq.com'], n: ['tata cliq','tatacliq'] },
  'phonepe': { d: ['phonepe.com'], n: ['phonepe'] },
  paytm:     { d: ['paytm.com','paytmmall.com'], n: ['paytm'] },
  cred:      { d: ['cred.club'], n: ['cred'] },
  freecharge:{ d: ['freecharge.in'], n: ['freecharge'] },
  mobikwik:  { d: ['mobikwik.com'], n: ['mobikwik'] },
  oyo:       { d: ['oyorooms.com','oyo.com'], n: ['oyo'] }
};

var INDIAN_BANKS = ['sbi','hdfc','icici','axis','kotak','yesbank','pnb','bob','bank of baroda','federal bank','canara','union bank','idbi','indusind','karur vysya','city union','south indian','bandhan','ucobank','central bank','bank of india','bank of maharashtra','indian bank','punjab and sind'];
var FREE_EMAILS = ['gmail.com','yahoo.com','hotmail.com','outlook.com','rediffmail.com','aol.com','mail.com','protonmail.com','zoho.com','yandex.com'];
var SAFE_TYPES = ['bank_statement','bank_alert','bank_security','otp','security_notification','ecommerce_order','ecommerce_shipping','food_order','travel_flight','travel_hotel','train_ticket','newsletter','subscription','payment_receipt','social_media','govt','job'];

/* ═══════════════ HELPER FUNCTIONS ═══════════════ */
function senderDomain(email) {
  var m = email.match(/@([\w.-]+)/);
  return m ? m[1].toLowerCase() : '';
}

function isBank(d) {
  for (var i = 0; i < INDIAN_BANKS.length; i++) {
    if (d.indexOf(INDIAN_BANKS[i]) !== -1) return true;
  }
  return false;
}

/* ═══════════════ CLASSIFY EMAIL ═══════════════ */
function classifyEmail(subject, body, domain, display) {
  var text = (subject + ' ' + body).toLowerCase();

  if (isBank(domain)) {
    if (/statement|mini\s+statement|account\s+summary|balance/i.test(text))
      return { type: 'bank_statement', icon: '🏦', label: 'Bank Statement', risk: -35 };
    if (/otp|one[-\s]?time|verification\s+code|\d{4,6}\s+is/i.test(text))
      return { type: 'otp', icon: '🔢', label: 'OTP / Verification', risk: -40 };
    if (/credit|debit|transaction|payment|spent|transferred/i.test(text))
      return { type: 'bank_alert', icon: '💳', label: 'Bank Transaction Alert', risk: -30 };
    if (/login|sign[-\s]?in|password|security\s+alert|unusual/i.test(text))
      return { type: 'bank_security', icon: '🔐', label: 'Bank Security Alert', risk: -20 };
    return { type: 'bank_other', icon: '🏦', label: 'Bank Email', risk: -15 };
  }

  if (/(?:order\s+(?:confirmed|placed|received|#)|your\s+order|order\s+status|delivery\s+update|track\s+(?:your|order)|shipment)/i.test(text))
    return { type: 'ecommerce_order', icon: '📦', label: 'Order / Shipping', risk: -30 };

  if (/(?:swiggy|zomato|dominos|pizza\s+hut|food|order|delivery|menu|restaurant|meal|dish|menu)/i.test(text) &&
      /(?:order|delivery|bill|receipt|invoice)/i.test(text))
    return { type: 'food', icon: '🍔', label: 'Food Order', risk: -30 };

  if (/(irctc|railway|train|pnr|ticket|seat|coach|departure|arrival)/i.test(text))
    return { type: 'train', icon: '🚂', label: 'Train / IRCTC', risk: -30 };

  if (/(flight|airline|boarding|departure|arrival|pnr|seat|aviation)/i.test(text) &&
      /(ticket|booking|reservation|confirm)/i.test(text))
    return { type: 'flight', icon: '✈️', label: 'Flight / Travel', risk: -25 };

  if (/(hotel|booking|reservation|check-?in|room|stay)/i.test(text) &&
      /(confirm|booked|reservation|invoice)/i.test(text))
    return { type: 'hotel', icon: '🏨', label: 'Hotel Booking', risk: -25 };

  if (/(paytm|phonepe|google\s+pay|gpay|amazon\s+pay|cred|freecharge|mobikwik).*(?:payment|receipt|transaction|successful)/i.test(text) ||
      /(?:payment|receipt|transaction|successful).*(?:paytm|phonepe|google\s+pay|gpay)/i.test(text))
    return { type: 'payment', icon: '💳', label: 'Payment Receipt', risk: -35 };

  if (/your\s+(?:otp|one[-\s]?time\s+password|verification\s+code)\s+(?:is|:)|otp\s+(?:is|for)\s+\d{4,6}|\d{4,6}\s+is\s+your/i.test(text))
    return { type: 'otp', icon: '🔢', label: 'OTP / Verification Code', risk: -40 };

  if (/(new\s+sign[-\s]?in|device\s*[:=]|if\s+this\s+was\s+you|you\s+can\s+ignore|wasn.t\s+you)/i.test(text) &&
      /(ip\s+address|location|browser|device)/i.test(text))
    return { type: 'security', icon: '🔒', label: 'Security Notification', risk: -30 };

  if (/unsubscribe|view\s+in\s+browser|email\s+preferences/i.test(text) &&
      /newsletter|weekly|monthly|digest|marketing|promotion|offer|sale|%|discount/i.test(text))
    return { type: 'newsletter', icon: '📰', label: 'Newsletter / Marketing', risk: -20 };

  if (/(?:friend\s+request|someone\s+(?:tagged|mentioned|liked)|new\s+(?:follower|connection)|your\s+(?:post|photo))/i.test(text) &&
      /(facebook|instagram|twitter|linkedin|telegram)/i.test(text))
    return { type: 'social', icon: '👤', label: 'Social Media Notification', risk: -25 };

  if (/(?:job\s+(?:offer|opening|alert|description)|interview\s+(?:schedule|confirmation|invite)|your\s+application|recruitment)/i.test(text))
    return { type: 'job', icon: '💼', label: 'Job / Recruitment', risk: 5 };

  if (/(?:income\s+tax|gst|aadhaar|pan\s+card|epfo|passport|visa|e-?filing|epf|udyog|mygov)/i.test(text) ||
      /(?:gov\.in|nic\.in|incometax\.gov|uidai\.gov|epfindia)/.test(domain) ||
      /(?:income\s+tax|gst|aadhaar|pan\s+card|epfo|passport|visa).*(?:gov\.in|government|incometax|uidai)/i.test(text))
    return { type: 'govt', icon: '🏛️', label: 'Government / Tax', risk: -15 };

  return { type: 'unknown', icon: '📧', label: 'General Email', risk: 5 };
}

/* ═══════════════ THREAT DETECTION ═══════════════ */
function detectThreats(text, sender, domain, display, classification) {
  var findings = [];

  /* Brand impersonation — word-boundary check */
  var displayLower = (display || '').toLowerCase().trim();
  var senderLower = (sender || '').toLowerCase().trim();
  var brandKeys = Object.keys(BRANDS);
  for (var bi = 0; bi < brandKeys.length; bi++) {
    var brand = brandKeys[bi];
    var info = BRANDS[brand];
    var claimedBrand = false;
    var matchedName = '';
    for (var ni = 0; ni < info.n.length; ni++) {
      var bname = info.n[ni];
      var wordRe = new RegExp('(?:^|[\\s,;.:@!/()\\[\\]{}\'"-])' + bname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:[\\s,;.:@!/()\\[\\]{}\'"-]|$)', 'i');
      if (wordRe.test(displayLower)) { claimedBrand = true; matchedName = bname; break; }
      var localPart = senderLower.split('@')[0] || '';
      if (wordRe.test(localPart)) { claimedBrand = true; matchedName = bname; break; }
    }
    if (claimedBrand) {
      var domainMatch = false;
      for (var di = 0; di < info.d.length; di++) {
        if (domain.indexOf(info.d[di]) !== -1) { domainMatch = true; break; }
      }
      if (!domainMatch) {
        var brandLabel = brand.charAt(0).toUpperCase() + brand.slice(1);
        findings.push({
          sev: 'danger', icon: '🎭',
          title: 'Pretends to be ' + brandLabel,
          text: 'Sender name says "' + matchedName + '" but this email is from ' + domain + '. Real ' + brandLabel + ' emails only come from ' + info.d[0] + '.'
        });
      }
      break;
    }
  }

  /* Free email claiming brand */
  var isFree = false;
  for (var fi = 0; fi < FREE_EMAILS.length; fi++) {
    if (domain.indexOf(FREE_EMAILS[fi]) !== -1) { isFree = true; break; }
  }
  if (isFree && findings.length > 0 && findings[0].sev === 'danger') {
    findings.push({
      sev: 'danger', icon: '📧',
      title: 'Free email pretending to be brand',
      text: 'Official companies never send emails from ' + domain + '. This is a scam.'
    });
  }

  /* Suspicious TLD */
  var badTlds = ['.tk','.ml','.ga','.cf','.gq','.xyz','.top','.buzz','.club','.work','.click','.link','.fun','.site','.online','.icu','.monster','.surf','.cfd','.sbs'];
  for (var ti = 0; ti < badTlds.length; ti++) {
    if (domain.indexOf(badTlds[ti]) === domain.length - badTlds[ti].length) {
      findings.push({
        sev: 'danger', icon: '🌐',
        title: 'Suspicious website address',
        text: 'The sender uses "' + domain + '" — this type of address is often used for scams because it is free or very cheap.'
      });
      break;
    }
  }

  /* Urgency */
  if (SAFE_TYPES.indexOf(classification.type) === -1) {
    var urgentRe = /(urgent|immediate|act\s+now|right\s+now|expires?\s+today|last\s+chance|final\s+warning|within\s+\d+\s+(?:hours?|minutes?|days?))/i;
    var urgentMatch = text.match(urgentRe);
    if (urgentMatch) {
      findings.push({
        sev: 'high', icon: '⏰',
        title: 'Creates pressure to act fast',
        text: 'Uses "' + urgentMatch[1] + '" to make you rush. Real companies give you time to think.'
      });
    }
  }

  /* Credential harvesting */
  if (SAFE_TYPES.indexOf(classification.type) === -1) {
    var credRe = /(verify\s+(?:your|the)\s+(?:account|identity|email)|confirm\s+(?:your|the)\s+(?:password|account|identity)|update\s+(?:your|the)\s+(?:payment|billing|account|details)|re-?enter\s+(?:your|the)\s+(?:password|account)|click\s+(?:here|below)\s+to\s+(?:verify|confirm|update))/i;
    var credMatch = text.match(credRe);
    if (credMatch) {
      findings.push({
        sev: 'danger', icon: '🔑',
        title: 'Asks for your login details',
        text: 'Says "' + credMatch[1] + '" — real companies never ask for passwords or sensitive info through email.'
      });
    }
  }

  /* Fear tactics */
  if (SAFE_TYPES.indexOf(classification.type) === -1) {
    var fearRe = /(account\s+(?:will|has)\s+be\s+(?:suspended|locked|closed|terminated)|unauthorized\s+(?:access|activity)|legal\s+action|police\s+(?:complaint|report)|account\s+(?:has\s+been|is)\s+(?:compromised|hacked))/i;
    var fearMatch = text.match(fearRe);
    if (fearMatch) {
      findings.push({
        sev: 'danger', icon: '⚠️',
        title: 'Uses threats to scare you',
        text: 'Says "' + fearMatch[1] + '" to make you panic. Real companies send polite notices, not scary emails.'
      });
    }
  }

  /* Insecure HTTP link */
  if (text.indexOf('http://') !== -1) {
    var httpMatch = text.match(/http:\/\/[^\s"<>]+/);
    findings.push({
      sev: 'high', icon: '🔓',
      title: 'Insecure link found',
      text: 'Contains an "http://" link (not secure). Your data can be stolen. Legitimate companies use "https://".'
    });
  }

  /* IP address in link */
  if (SAFE_TYPES.indexOf(classification.type) === -1) {
    var ipRe = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    var ipMatch = text.match(ipRe);
    if (ipMatch) {
      findings.push({
        sev: 'danger', icon: '🚨',
        title: 'Link uses numbers instead of website name',
        text: 'Contains ' + ipMatch[0] + ' which is a numeric address. Real companies use names like "google.com", not numbers.'
      });
    }
  }

  /* Shortened URLs */
  var shortRe = /(bit\.ly|tinyurl|goo\.gl|t\.co|is\.gd|buff\.ly|cutt\.ly|rb\.gy)\/[\w-]+/i;
  var shortMatch = text.match(shortRe);
  if (shortMatch) {
    findings.push({
      sev: 'high', icon: '🔗',
      title: 'Hidden link found',
      text: 'Uses a shortened link (' + shortMatch[1] + ') that hides the real destination. Never trust hidden links.'
    });
  }

  /* Homoglyph / unicode attack */
  var username = sender.split('@')[0] || '';
  var badChars = ['\u0430','\u0435','\u043E','\u0440','\u0441','\u0456','\u0455','\u0445','\u0443'];
  for (var bc = 0; bc < badChars.length; bc++) {
    if (username.indexOf(badChars[bc]) !== -1) {
      findings.push({
        sev: 'danger', icon: '🔤',
        title: 'Fake characters in sender address',
        text: 'The sender "' + sender + '" uses fake characters that look like real letters but are not. This impersonates a real company.'
      });
      break;
    }
  }

  /* Safe patterns */
  if (findings.length === 0) {
    if (/do\s+not\s+reply|noreply|no-reply/i.test(text))
      findings.push({ sev: 'safe', icon: '✅', title: 'Automated system email', text: 'This is a real automated email from a legitimate service. No action needed.' });
    else if (/unsubscribe|view\s+in\s+browser/i.test(text))
      findings.push({ sev: 'safe', icon: '✅', title: 'Legitimate marketing email', text: 'Has unsubscribe link — this is a real marketing email, not dangerous.' });
    else if (classification.risk < 0)
      findings.push({ sev: 'safe', icon: classification.icon, title: classification.label, text: 'This is a recognized ' + classification.label.toLowerCase() + ' from a verified sender.' });
    else
      findings.push({ sev: 'safe', icon: '✅', title: 'No threats detected', text: 'This email looks normal. No phishing patterns found.' });
  }

  return findings;
}

/* ═══════════════ CORE ANALYSIS ═══════════════ */
function analyzeEmail(sender, subject, body, display) {
  var domain = senderDomain(sender);
  var fullText = (subject + ' ' + body).toLowerCase();

  var classification = classifyEmail(subject, body, domain, display);
  var findings = detectThreats(fullText, sender, domain, display, classification);

  var score = 100 + classification.risk;
  for (var fi = 0; fi < findings.length; fi++) {
    if (findings[fi].sev === 'danger') score -= 25;
    else if (findings[fi].sev === 'high') score -= 15;
  }
  score = Math.max(0, Math.min(100, score));

  var riskLevel;
  if (score <= 25) riskLevel = 'danger';
  else if (score <= 50) riskLevel = 'warning';
  else if (score <= 75) riskLevel = 'low';
  else riskLevel = 'safe';

  return {
    sender: sender,
    subject: subject,
    display: display,
    domain: domain,
    type: classification.type,
    icon: classification.icon,
    typeLabel: classification.label,
    score: score,
    risk: riskLevel,
    findings: findings.slice(0, 5)
  };
}

/* ═══════════════ GMAIL ADD-ON: CONTEXTUAL TRIGGER ═══════════════ */
function onGmailMessage(e) {
  var message = e.gmail.message;
  var sender = message.sender || '';
  var subject = message.subject || '';
  var display = message.senderName || '';
  var body = message.body || '';

  var result = analyzeEmail(sender, subject, body, display);
  return buildResultCard(result);
}

/* ═══════════════ GMAIL ADD-ON: HOMEPAGE ═══════════════ */
function onHomepage(e) {
  var card = CardService.newCardBuilder()
    .setName('PhishGuard AI')
    .setHeader(CardService.newCardHeader()
      .setTitle('PhishGuard AI v4.0')
      .setSubtitle('Email Security Scanner')
      .setImageStyle(CardService.ImageStyle.CIRCLE)
      .setImageUrl('https://raw.githubusercontent.com/nicehash/PhishGuard/main/icons/icon128.png'))
    .addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText('Open any email to scan it for phishing threats.'))
      .addWidget(CardService.newTextParagraph()
        .setText('PhishGuard checks: sender identity, suspicious links, brand impersonation, urgency tactics, and more.'))
      .addWidget(CardService.newButtonSet()
        .addButton(CardService.newTextButton()
          .setText('Scan Current Email')
          .setOnClickAction(CardService.newAction().setFunctionName('scanFromHomepage'))
          .setTextButtonStyle(CardService.TextButtonStyle.FILLED))))
    .build();
  return [card];
}

function scanFromHomepage(e) {
  var accessToken = e.gmail.accessToken;
  GmailApp.setCurrentAccessToken(accessToken);

  var threads = GmailApp.search('is:unread', 0, 1);
  if (threads.length === 0) {
    threads = GmailApp.search('in:inbox', 0, 1);
  }

  if (threads.length === 0) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText('No emails found to scan'))
      .build();
  }

  var messages = threads[0].getMessages();
  var msg = messages[messages.length - 1];

  var result = analyzeEmail(
    msg.getFrom() || '',
    msg.getSubject() || '',
    msg.getPlainBody() || '',
    msg.getFrom() || ''
  );

  var card = buildResultCard(result);
  return CardService.newActionResponseBuilder()
    .setOpenLink(CardService.newOpenLink().setUrl('https://mail.google.com'))
    .build();
}

/* ═══════════════ BUILD RESULT CARD ═══════════════ */
function buildResultCard(result) {
  var colorMap = {
    safe: '#0F9D58',
    low: '#F4B400',
    warning: '#FF6D00',
    danger: '#DB4437'
  };
  var color = colorMap[result.risk] || '#999';

  var riskLabels = {
    safe: 'SAFE',
    low: 'LOW RISK',
    warning: 'MEDIUM RISK',
    danger: 'DANGER'
  };

  var builder = CardService.newCardBuilder()
    .setName('PhishGuard Result')
    .setHeader(CardService.newCardHeader()
      .setTitle(result.icon + ' ' + (result.display || result.sender || 'Unknown'))
      .setSubtitle(result.subject || '(no subject)')
      .setImageStyle(CardService.ImageStyle.CIRCLE)
      .setImageUrl('https://raw.githubusercontent.com/nicehash/PhishGuard/main/icons/icon128.png'));

  /* Risk score section */
  var scoreSection = CardService.newCardSection()
    .setHeader('Scan Result')
    .addWidget(CardService.newDecoratedText()
      .setTopLabel('Risk Score')
      .setText(result.score + '/100 — ' + riskLabels[result.risk])
      .setStartIcon(CardService.newIconImage()
        .setIconUrl('https://raw.githubusercontent.com/nicehash/PhishGuard/main/icons/icon128.png')
        .setAltText('PhishGuard')));

  builder.addSection(scoreSection);

  /* Findings section */
  var findingsSection = CardService.newCardSection()
    .setHeader('Findings (' + result.findings.length + ')');

  for (var i = 0; i < result.findings.length; i++) {
    var f = result.findings[i];
    var sevColor = f.sev === 'danger' ? '#DB4437' : f.sev === 'high' ? '#FF6D00' : f.sev === 'safe' ? '#0F9D58' : '#F4B400';

    findingsSection.addWidget(CardService.newDecoratedText()
      .setTopLabel(f.icon + ' ' + f.title)
      .setText(f.text)
      .setBottomLabel('Severity: ' + f.sev.toUpperCase()));
  }

  builder.addSection(findingsSection);

  /* Info section */
  var infoSection = CardService.newCardSection()
    .setHeader('Email Info')
    .addWidget(CardService.newKeyValue()
      .setTopLabel('From')
      .setContent(result.sender))
    .addWidget(CardService.newKeyValue()
      .setTopLabel('Domain')
      .setContent(result.domain))
    .addWidget(CardService.newKeyValue()
      .setTopLabel('Type')
      .setContent(result.icon + ' ' + result.typeLabel));

  builder.addSection(infoSection);

  return builder.build();
}
