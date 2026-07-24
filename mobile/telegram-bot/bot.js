/**
 * PhishGuard AI — Telegram Bot
 * Users forward suspicious emails → bot scans and replies
 * Run: npm install && npm start
 */

var TelegramBot = require('node-telegram-bot-api');
var TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
var bot = new TelegramBot(TOKEN, { polling: true });

console.log('PhishGuard Bot started! Send /start to begin.');

/* ═══════════════ BRAND DATABASE ═══════════════ */
var BRANDS={
  google:{d:['google.com','gmail.com','google.co.in'],n:['google','gmail','google account','google pay','gpay']},
  microsoft:{d:['microsoft.com','outlook.com','live.com','office.com','hotmail.com'],n:['microsoft','outlook','office 365','onedrive','teams']},
  apple:{d:['apple.com','icloud.com'],n:['apple','icloud','apple id','apple pay','app store','itunes']},
  amazon:{d:['amazon.com','amazon.in','amazon.co.in'],n:['amazon','prime','amazon pay','aws']},
  paypal:{d:['paypal.com'],n:['paypal']},
  facebook:{d:['facebook.com','meta.com','fb.com'],n:['facebook','fb','meta','instagram','whatsapp']},
  netflix:{d:['netflix.com'],n:['netflix']},
  linkedin:{d:['linkedin.com'],n:['linkedin']},
  zomato:{d:['zomato.com'],n:['zomato']},
  swiggy:{d:['swiggy.com','swiggy.in'],n:['swiggy','instamart']},
  flipkart:{d:['flipkart.com'],n:['flipkart']},
  phonepe:{d:['phonepe.com'],n:['phonepe']},
  paytm:{d:['paytm.com'],n:['paytm']},
  irctc:{d:['irctc.co.in','irctc.in'],n:['irctc','indian rail']},
  uber:{d:['uber.com'],n:['uber']},
  makemytrip:{d:['makemytrip.com'],n:['makemytrip','mmt']},
  oyo:{d:['oyorooms.com','oyo.com'],n:['oyo']}
};
var INDIAN_BANKS=['sbi','hdfc','icici','axis','kotak','yesbank','pnb','bob','bank of baroda','federal bank','canara','union bank','idbi','indusind'];
var FREE_EMAILS=['gmail.com','yahoo.com','hotmail.com','outlook.com','rediffmail.com','aol.com','protonmail.com'];
var SAFE_TYPES=['bank_statement','bank_alert','bank_security','otp','security_notification','ecommerce_order','food_order','travel_flight','travel_hotel','train_ticket','newsletter','subscription','payment_receipt','social_media','govt','job'];

/* ═══════════════ HELPERS ═══════════════ */
function senderDomain(e){var m=e.match(/@([\w.-]+)/);return m?m[1].toLowerCase():''}
function isBank(d){for(var i=0;i<INDIAN_BANKS.length;i++){if(d.indexOf(INDIAN_BANKS[i])!==-1)return true}return false}

/* ═══════════════ CLASSIFY ═══════════════ */
function classifyEmail(sub,body,domain){
  var t=(sub+' '+body).toLowerCase();
  if(isBank(domain)){
    if(/statement|balance/i.test(t))return{type:'bank_statement',icon:'🏦',label:'Bank Statement',risk:-35};
    if(/otp|one[-\s]?time/i.test(t))return{type:'otp',icon:'🔢',label:'OTP',risk:-40};
    if(/credit|debit|transaction|payment|spent/i.test(t))return{type:'bank_alert',icon:'💳',label:'Bank Alert',risk:-30};
    if(/login|sign[-\s]?in|password|security/i.test(t))return{type:'bank_security',icon:'🔐',label:'Bank Security',risk:-20};
    return{type:'bank_other',icon:'🏦',label:'Bank Email',risk:-15};
  }
  if(/order\s+(?:confirmed|placed)|your\s+order|delivery|track|shipment/i.test(t))return{type:'ecommerce_order',icon:'📦',label:'Order/Shipping',risk:-30};
  if(/(?:swiggy|zomato|dominos|food).*(?:order|delivery|bill|receipt)/i.test(t))return{type:'food',icon:'🍔',label:'Food Order',risk:-30};
  if(/irctc|railway|train|pnr|ticket/i.test(t))return{type:'train',icon:'🚂',label:'Train/IRCTC',risk:-30};
  if(/flight|airline|boarding|aviation.*(ticket|booking)/i.test(t))return{type:'flight',icon:'✈️',label:'Flight',risk:-25};
  if(/hotel|booking|reservation.*(confirm|booked)/i.test(t))return{type:'hotel',icon:'🏨',label:'Hotel',risk:-25};
  if(/(?:paytm|phonepe|gpay|google\s+pay).*(?:payment|receipt|transaction)/i.test(t))return{type:'payment',icon:'💳',label:'Payment',risk:-35};
  if(/your\s+otp|otp\s+(?:is|for)\s+\d{4,6}/i.test(t))return{type:'otp',icon:'🔢',label:'OTP',risk:-40};
  if(/new\s+sign[-\s]?in|device|if\s+this\s+was\s+you.*(ip|location|browser)/i.test(t))return{type:'security',icon:'🔒',label:'Security',risk:-30};
  if(/income\s+tax|gst|aadhaar|epfo|gov\.in|nic\.in/i.test(t)||(t.indexOf('gov.in')!==-1))return{type:'govt',icon:'🏛️',label:'Government',risk:-15};
  return{type:'unknown',icon:'📧',label:'General',risk:5};
}

/* ═══════════════ DETECT THREATS ═══════════════ */
function detectThreats(text,sender,domain,cls){
  var f=[];
  var bKeys=Object.keys(BRANDS);
  for(var bi=0;bi<bKeys.length;bi++){
    var brand=bKeys[bi],info=BRANDS[brand],found=false,mn='';
    for(var ni=0;ni<info.n.length;ni++){
      var re=new RegExp('(?:^|[\\s,.:@!/-])'+info.n[ni].replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?:[\\s,.:@!/-]|$)','i');
      if(re.test(sender.split('@')[0].toLowerCase())){found=true;mn=info.n[ni];break}
    }
    if(found){
      var dm=false;
      for(var di=0;di<info.d.length;di++){if(domain.indexOf(info.d[di])!==-1){dm=true;break}}
      if(!dm){f.push({sev:'DANGER',icon:'🎭',title:'Pretends to be '+brand.charAt(0).toUpperCase()+brand.slice(1),text:'Says "'+mn+'" but from '+domain+'. Real emails come from '+info.d[0]+'.'});break}
    }
  }
  var isF=false;for(var i=0;i<FREE_EMAILS.length;i++){if(domain.indexOf(FREE_EMAILS[i])!==-1){isF=true;break}}
  if(isF&&f.length>0&&f[0].sev==='DANGER')f.push({sev:'DANGER',icon:'📧',title:'Free email faking brand',text:'Real companies never use '+domain+'.'});
  var bad=['.tk','.ml','.ga','.cf','.gq','.xyz','.top','.buzz','.club','.click','.site','.online','.icu'];
  for(var ti=0;ti<bad.length;ti++){if(domain.endsWith(bad[ti])){f.push({sev:'DANGER',icon:'🌐',title:'Suspicious address',text:'"'+domain+'" is often used for scams.'});break}}
  if(SAFE_TYPES.indexOf(cls.type)===-1){
    var um=text.match(/(urgent|immediate|act\s+now|expires?\s+today|last\s+chance|final\s+warning|within\s+\d+\s+(?:hours?|minutes?|days?))/i);
    if(um)f.push({sev:'HIGH',icon:'⏰',title:'Pressure to act fast',text:'Uses "'+um[1]+'" to make you rush.'});
  }
  if(SAFE_TYPES.indexOf(cls.type)===-1){
    var cm=text.match(/(verify\s+(?:your|the)\s+(?:account|identity|email)|confirm\s+(?:your|the)\s+(?:password|account)|update\s+(?:your|the)\s+(?:payment|billing|account)|click\s+(?:here|below)\s+to\s+(?:verify|confirm))/i);
    if(cm)f.push({sev:'DANGER',icon:'🔑',title:'Asks for login details',text:'Says "'+cm[1]+'" — real companies never ask for passwords by email.'});
  }
  if(SAFE_TYPES.indexOf(cls.type)===-1){
    var fm=text.match(/(account\s+(?:will|has)\s+be\s+(?:suspended|locked|closed)|unauthorized\s+(?:access|activity)|account\s+(?:has\s+been|is)\s+(?:compromised|hacked))/i);
    if(fm)f.push({sev:'DANGER',icon:'⚠️',title:'Uses threats to scare you',text:'Says "'+fm[1]+'" to make you panic.'});
  }
  if(text.indexOf('http://')!==-1)f.push({sev:'HIGH',icon:'🔓',title:'Insecure link',text:'Has http:// link — data can be stolen.'});
  if(SAFE_TYPES.indexOf(cls.type)===-1){var ip=text.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);if(ip)f.push({sev:'DANGER',icon:'🚨',title:'Numeric address',text:'Uses '+ip[0]+' instead of a real website.'})}
  var sm=text.match(/(bit\.ly|tinyurl|goo\.gl|t\.co|cutt\.ly)\/[\w-]+/i);if(sm)f.push({sev:'HIGH',icon:'🔗',title:'Hidden link',text:'Uses '+sm[1]+' which hides the real destination.'});
  var un=sender.split('@')[0]||'';var bc=['\u0430','\u0435','\u043E','\u0440','\u0441','\u0456','\u0455','\u0445','\u0443'];
  for(var bci=0;bci<bc.length;bci++){if(un.indexOf(bc[bci])!==-1){f.push({sev:'DANGER',icon:'🔤',title:'Fake characters',text:'"'+sender+'" uses fake letters to impersonate.'});break}}
  if(f.length===0){
    if(/do\s+not\s+reply|noreply/i.test(text))f.push({sev:'SAFE',icon:'✅',title:'Automated system email',text:'Legitimate automated email. No action needed.'});
    else if(cls.risk<0)f.push({sev:'SAFE',icon:cls.icon,title:cls.label,text:'Recognized '+cls.label.toLowerCase()+' from verified sender.'});
    else f.push({sev:'SAFE',icon:'✅',title:'No threats detected',text:'This email looks normal.'});
  }
  return f;
}

/* ═══════════════ ANALYZE ═══════════════ */
function analyzeEmail(sender,subject,body){
  var domain=senderDomain(sender);
  var fullText=(subject+' '+body).toLowerCase();
  var cls=classifyEmail(subject,body,domain);
  var findings=detectThreats(fullText,sender,domain,cls);
  var score=100+cls.risk;
  for(var i=0;i<findings.length;i++){if(findings[i].sev==='DANGER')score-=25;else if(findings[i].sev==='HIGH')score-=15}
  score=Math.max(0,Math.min(100,score));
  var risk=score<=25?'🔴 DANGER':score<=50?'🟠 MEDIUM':score<=75?'🟡 LOW':'🟢 SAFE';
  return{sender:sender,subject:subject,domain:domain,type:cls.type,icon:cls.icon,typeLabel:cls.label,score:score,risk:risk,findings:findings.slice(0,5)};
}

/* ═══════════════ PARSE FORWARDED EMAIL ═══════════════ */
function parseForwarded(text){
  var lines=text.split('\n');
  var sender='',subject='',body='',inBody=false;
  for(var i=0;i<lines.length;i++){
    var l=lines[i].trim();
    if(/^from:/i.test(l)){sender=l.replace(/^from:\s*/i,'').replace(/<[^>]+>/g,'').trim();continue}
    if(/^subject:/i.test(l)){subject=l.replace(/^subject:\s*/i,'').trim();continue}
    if(/^date:|^to:|^cc:|^sent:/i.test(l))continue;
    if(l==='---'||l===' forwarded message'||l==='begin forwarded message'){inBody=true;continue}
    if(inBody||(!sender&&!subject&&l.length>0)){body+=' '+l}
  }
  /* If no structured headers, try to extract from raw text */
  if(!sender){
    var fromMatch=text.match(/from:\s*(.+)/i);
    if(fromMatch)sender=fromMatch[1].replace(/<[^>]+>/g,'').trim();
  }
  if(!subject){
    var subMatch=text.match(/subject:\s*(.+)/i);
    if(subMatch)subject=subMatch[1].trim();
  }
  /* Try to find email address */
  var emailMatch=text.match(/[\w.+-]+@[\w.-]+\.\w{2,}/);
  if(!sender&&emailMatch)sender=emailMatch[0];
  return{sender:sender,subject:subject,body:body.trim()||text};
}

/* ═══════════════ BOT HANDLERS ═══════════════ */
bot.onText(/\/start/,function(msg){
  var name=msg.from.first_name||'there';
  bot.sendMessage(msg.chat.id,
    '🛡️ *PhishGuard AI*\n\n'+
    'Hi '+name+'! I can scan emails for phishing threats.\n\n'+
    '*How to use:*\n'+
    '1️⃣ Forward any suspicious email to me\n'+
    '2️⃣ Or paste the email text here\n'+
    '3️⃣ I\'ll scan it and tell you if it\'s safe\n\n'+
    '*What I check:*\n'+
    '• Sender identity & domain\n'+
    '• Brand impersonation\n'+
    '• Urgency & fear tactics\n'+
    '• Suspicious links\n'+
    '• Credential harvesting\n'+
    '• Fake characters\n\n'+
    'Send /help for more info.',
    {parse_mode:'Markdown'}
  );
});

bot.onText(/\/help/,function(msg){
  bot.sendMessage(msg.chat.id,
    '🛡️ *PhishGuard Help*\n\n'+
    '*Commands:*\n'+
    '/start — Welcome message\n'+
    '/help — This help\n'+
    '/scan — Scan a sample email\n\n'+
    '*To scan an email:*\n'+
    '• Forward an email to this bot\n'+
    '• Or paste the email text (including From/Subject headers)\n\n'+
    '*Supported formats:*\n'+
    '• Forwarded emails from Gmail/Outlook\n'+
    '• Raw email text with From: and Subject: lines\n'+
    '• Plain text descriptions of emails\n\n'+
    '*Privacy:* Your emails are analyzed in memory and never stored.',
    {parse_mode:'Markdown'}
  );
});

bot.onText(/\/scan/,function(msg){
  bot.sendMessage(msg.chat.id,
    '📋 *Paste an email to scan*\n\n'+
    'Example format:\n'+
    '```\n'+
    'From: security@paypa1.com\n'+
    'Subject: Your account will be suspended\n'+
    '\n'+
    'Dear user, verify your account immediately or it will be closed. Click here: http://paypa1.com/verify\n'+
    '```',
    {parse_mode:'Markdown'}
  );
});

bot.on('message',function(msg){
  if(!msg.text)return;
  if(msg.text.startsWith('/start')||msg.text.startsWith('/help')||msg.text.startsWith('/scan'))return;

  var parsed=parseForwarded(msg.text);
  if(!parsed.sender&&!parsed.subject){
    bot.sendMessage(msg.chat.id,'⚠️ Could not find email details. Please forward an email or paste text with From: and Subject: lines.\n\nType /help for format examples.');
    return;
  }

  bot.sendMessage(msg.chat.id,'🔍 Scanning...');

  var result=analyzeEmail(parsed.sender,parsed.subject,parsed.body);

  var response='🛡️ *PhishGuard Scan Result*\n\n';
  response+='*Risk Score:* '+result.score+'/100 '+result.risk+'\n';
  response+='*Type:* '+result.icon+' '+result.typeLabel+'\n\n';

  if(parsed.sender)response+='*From:* `'+parsed.sender+'`\n';
  if(parsed.subject)response+='*Subject:* '+parsed.subject+'\n';
  if(result.domain)response+='*Domain:* `'+result.domain+'`\n';
  response+='\n';

  response+='*Findings:*\n';
  for(var i=0;i<result.findings.length;i++){
    var f=result.findings[i];
    var emoji=f.sev==='DANGER'?'🔴':f.sev==='HIGH'?'🟠':f.sev==='LOW'?'🟡':'🟢';
    response+=emoji+' *'+f.title+'*\n'+f.text+'\n\n';
  }

  if(result.score>=80){
    response+='✅ *This email appears safe.*';
  }else if(result.score>=50){
    response+='⚠️ *Be careful with this email.*';
  }else{
    response+='🚨 *This email looks dangerous! Do not click any links or share personal info.*';
  }

  bot.sendMessage(msg.chat.id,response,{parse_mode:'Markdown'});
});
