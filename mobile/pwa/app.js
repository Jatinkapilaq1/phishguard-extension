/**
 * PhishGuard AI — PWA Web App
 * Scans Gmail emails from any phone browser
 * No server needed — everything runs in your browser
 */

/* ═══════════════ CONFIG ═══════════════ */
var CLIENT_ID = '1029639878493-arhv3v93ut7bqo130q29i4t42mue2nci.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCYyDXt7nhtkrnNLrXULduqKeN8Pxa11y0';
var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'];

var gapi = window.gapi;
var tokenClient;
var accessToken = '';

/* ═══════════════ BRAND DATABASE ═══════════════ */
var BRANDS = {
  google:{d:['google.com','gmail.com','google.co.in'],n:['google','gmail','google account','google pay','gpay']},
  microsoft:{d:['microsoft.com','outlook.com','live.com','office.com','hotmail.com'],n:['microsoft','outlook','office 365','onedrive','teams']},
  apple:{d:['apple.com','icloud.com','me.com'],n:['apple','icloud','apple id','apple pay','app store','itunes']},
  amazon:{d:['amazon.com','amazon.in','amazon.co.in','amazonpay.com'],n:['amazon','prime','amazon pay','aws']},
  paypal:{d:['paypal.com','paypal.co.in'],n:['paypal']},
  facebook:{d:['facebook.com','meta.com','fb.com'],n:['facebook','fb','meta','instagram','whatsapp']},
  netflix:{d:['netflix.com'],n:['netflix']},
  spotify:{d:['spotify.com'],n:['spotify']},
  linkedin:{d:['linkedin.com'],n:['linkedin']},
  zomato:{d:['zomato.com'],n:['zomato']},
  swiggy:{d:['swiggy.com','swiggy.in'],n:['swiggy','instamart']},
  flipkart:{d:['flipkart.com'],n:['flipkart']},
  meesho:{d:['meesho.com'],n:['meesho']},
  myntra:{d:['myntra.com'],n:['myntra']},
  uber:{d:['uber.com'],n:['uber']},
  ola:{d:['olacabs.com'],n:['ola']},
  makemytrip:{d:['makemytrip.com'],n:['makemytrip','mmt']},
  irctc:{d:['irctc.co.in','irctc.in'],n:['irctc','indian rail']},
  phonepe:{d:['phonepe.com'],n:['phonepe']},
  paytm:{d:['paytm.com'],n:['paytm']},
  cred:{d:['cred.club'],n:['cred']},
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
  if(/unsubscribe.*(?:newsletter|offer|sale|discount)/i.test(t))return{type:'newsletter',icon:'📰',label:'Newsletter',risk:-20};
  if(/income\s+tax|gst|aadhaar|epfo|gov\.in|nic\.in/i.test(t)||(t.indexOf('gov.in')!==-1))return{type:'govt',icon:'🏛️',label:'Government',risk:-15};
  return{type:'unknown',icon:'📧',label:'General',risk:5};
}

/* ═══════════════ DETECT THREATS ═══════════════ */
function detectThreats(text,sender,domain,cls){
  var f=[];
  var dl=domain;
  /* Brand impersonation */
  var bKeys=Object.keys(BRANDS);
  for(var bi=0;bi<bKeys.length;bi++){
    var brand=bKeys[bi],info=BRANDS[bi===0?brand:brand],found=false,mn='';
    for(var ni=0;ni<info.n.length;ni++){
      var re=new RegExp('(?:^|[\\s,.:@!/-])'+info.n[ni].replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?:[\\s,.:@!/-]|$)','i');
      if(re.test(sender.split('@')[0].toLowerCase())){found=true;mn=info.n[ni];break}
    }
    if(found){
      var dm=false;
      for(var di=0;di<info.d.length;di++){if(domain.indexOf(info.d[di])!==-1){dm=true;break}}
      if(!dm){f.push({sev:'danger',icon:'🎭',title:'Pretends to be '+brand.charAt(0).toUpperCase()+brand.slice(1),text:'Says "'+mn+'" but from '+domain+'. Real emails come from '+info.d[0]+'.'});break}
    }
  }
  /* Free email */
  var isF=false;for(var i=0;i<FREE_EMAILS.length;i++){if(domain.indexOf(FREE_EMAILS[i])!==-1){isF=true;break}}
  if(isF&&f.length>0&&f[0].sev==='danger')f.push({sev:'danger',icon:'📧',title:'Free email faking brand',text:'Real companies never use '+domain+'.'});
  /* Bad TLD */
  var bad=['.tk','.ml','.ga','.cf','.gq','.xyz','.top','.buzz','.club','.click','.site','.online','.icu'];
  for(var ti=0;ti<bad.length;ti++){if(domain.endsWith(bad[ti])){f.push({sev:'danger',icon:'🌐',title:'Suspicious address',text:'"'+domain+'" is often used for scams.'});break}}
  /* Urgency */
  if(SAFE_TYPES.indexOf(cls.type)===-1){
    var um=text.match(/(urgent|immediate|act\s+now|expires?\s+today|last\s+chance|final\s+warning|within\s+\d+\s+(?:hours?|minutes?|days?))/i);
    if(um)f.push({sev:'high',icon:'⏰',title:'Pressure to act fast',text:'Uses "'+um[1]+'" to make you rush.'});
  }
  /* Credential */
  if(SAFE_TYPES.indexOf(cls.type)===-1){
    var cm=text.match(/(verify\s+(?:your|the)\s+(?:account|identity|email)|confirm\s+(?:your|the)\s+(?:password|account)|update\s+(?:your|the)\s+(?:payment|billing|account)|click\s+(?:here|below)\s+to\s+(?:verify|confirm))/i);
    if(cm)f.push({sev:'danger',icon:'🔑',title:'Asks for login details',text:'Says "'+cm[1]+'" — real companies never ask for passwords by email.'});
  }
  /* Fear */
  if(SAFE_TYPES.indexOf(cls.type)===-1){
    var fm=text.match(/(account\s+(?:will|has)\s+be\s+(?:suspended|locked|closed)|unauthorized\s+(?:access|activity)|account\s+(?:has\s+been|is)\s+(?:compromised|hacked))/i);
    if(fm)f.push({sev:'danger',icon:'⚠️',title:'Uses threats to scare you',text:'Says "'+fm[1]+'" to make you panic.'});
  }
  /* HTTP */
  if(text.indexOf('http://')!==-1)f.push({sev:'high',icon:'🔓',title:'Insecure link',text:'Has http:// link — data can be stolen. Use https only.'});
  /* IP */
  if(SAFE_TYPES.indexOf(cls.type)===-1){var ip=text.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);if(ip)f.push({sev:'danger',icon:'🚨',title:'Numeric address in link',text:'Uses '+ip[0]+' instead of a real website name.'})}
  /* Short URLs */
  var sm=text.match(/(bit\.ly|tinyurl|goo\.gl|t\.co|cutt\.ly)\/[\w-]+/i);if(sm)f.push({sev:'high',icon:'🔗',title:'Hidden link',text:'Uses '+sm[1]+' which hides the real destination.'});
  /* Homoglyphs */
  var un=sender.split('@')[0]||'';var bc=['\u0430','\u0435','\u043E','\u0440','\u0441','\u0456','\u0455','\u0445','\u0443'];
  for(var bci=0;bci<bc.length;bci++){if(un.indexOf(bc[bci])!==-1){f.push({sev:'danger',icon:'🔤',title:'Fake characters in address',text:'"'+sender+'" uses fake letters to impersonate.'});break}}
  /* Safe */
  if(f.length===0){
    if(/do\s+not\s+reply|noreply/i.test(text))f.push({sev:'safe',icon:'✅',title:'Automated system email',text:'Legitimate automated email. No action needed.'});
    else if(cls.risk<0)f.push({sev:'safe',icon:cls.icon,title:cls.label,text:'Recognized '+cls.label.toLowerCase()+' from verified sender.'});
    else f.push({sev:'safe',icon:'✅',title:'No threats detected',text:'This email looks normal.'});
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
  for(var i=0;i<findings.length;i++){if(findings[i].sev==='danger')score-=25;else if(findings[i].sev==='high')score-=15}
  score=Math.max(0,Math.min(100,score));
  var risk=score<=25?'danger':score<=50?'warning':score<=75?'low':'safe';
  return{sender:sender,subject:subject,domain:domain,type:cls.type,icon:cls.icon,typeLabel:cls.label,score:score,risk:risk,findings:findings.slice(0,5)};
}

/* ═══════════════ AUTH ═══════════════ */
function signIn(){
  tokenClient=google.accounts.oauth2.initTokenClient({client_id:CLIENT_ID,scope:SCOPES,callback:function(r){accessToken=r.access_token;onSignIn()}});
  tokenClient.requestAccessToken();
}

function onSignIn(){
  document.getElementById('login-screen').classList.remove('active');
  document.getElementById('scan-screen').classList.add('active');
  loadUserEmail();
}

function signOut(){
  if(accessToken)google.accounts.oauth2.revoke(accessToken);
  accessToken='';
  document.getElementById('scan-screen').classList.remove('active');
  document.getElementById('login-screen').classList.add('active');
}

function loadUserEmail(){
  fetch('https://www.googleapis.com/gmail/v1/users/me/profile',{headers:{Authorization:'Bearer '+accessToken}})
  .then(function(r){return r.json()}).then(function(d){document.getElementById('user-email').textContent=d.emailAddress||''});
}

/* ═══════════════ SCAN ═══════════════ */
var currentTab='inbox';
function switchTab(tab){
  currentTab=tab;
  document.querySelectorAll('.tab').forEach(function(t){t.classList.toggle('active',t.dataset.tab===tab)});
  document.getElementById('results').innerHTML='';
  document.getElementById('stats').classList.add('hidden');
}

function getQuery(){
  switch(currentTab){
    case'primary':return'category:primary';
    case'promotions':return'category:promotions';
    case'social':return'category:social';
    case'starred':return'is:starred';
    default:return'in:inbox';
  }
}

async function scanEmails(){
  var btn=document.getElementById('scan-btn');
  var res=document.getElementById('results');
  btn.textContent='Scanning...';btn.disabled=true;
  res.innerHTML='<div class="loading"><div class="spinner"></div>Reading your emails...</div>';
  document.getElementById('stats').classList.add('hidden');

  try{
    var query=getQuery();
    var listRes=await fetch('https://www.googleapis.com/gmail/v1/users/me/messages?q='+encodeURIComponent(query)+'&maxResults=30',{headers:{Authorization:'Bearer '+accessToken}});
    var list=await listRes.json();
    if(!list.messages||!list.messages.length){res.innerHTML='<div class="empty"><div class="icon">📭</div>No emails found in this tab</div>';btn.textContent='🔍 Scan Emails';btn.disabled=false;return}

    var counts={safe:0,low:0,warning:0,danger:0};
    var allResults=[];
    res.innerHTML='';

    for(var i=0;i<list.messages.length;i++){
      var msgRes=await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/'+list.messages[i].id+'?format=metadata&metadataHeaders=From&metadataHeaders=Subject',{headers:{Authorization:'Bearer '+accessToken}});
      var msg=await msgRes.json();
      var headers=msg.payload&&msg.payload.headers||[];
      var from='';var subject='';
      for(var h=0;h<headers.length;h++){
        if(headers[h].name==='From')from=headers[h].value;
        if(headers[h].name==='Subject')subject=headers[h].value;
      }
      /* Extract email address from From */
      var senderMatch=from.match(/<([^>]+)>/);
      var sender=senderMatch?senderMatch[1]:from;
      var display=senderMatch?from.replace(/<[^>]+>/,'').trim():'';

      var result=analyzeEmail(sender,subject,'');
      result.display=display;
      counts[result.risk]++;
      allResults.push(result);
      renderCard(result,res);
      await new Promise(function(r){setTimeout(r,10)});
    }

    /* Summary */
    var threat=counts.danger>5?'CRITICAL':counts.danger>0?'HIGH':counts.warning>0?'MEDIUM':counts.low>0?'LOW':'SAFE';
    var tc=counts.danger>5?'#ff1744':counts.danger>0?'#f44336':counts.warning>0?'#ff9800':counts.low>0?'#ffc107':'#4caf50';
    var summary=document.createElement('div');
    summary.className='summary';
    summary.innerHTML='<div class="summary-title">📊 '+currentTab.charAt(0).toUpperCase()+currentTab.slice(1)+' — Scan Complete</div>'+
      '<div class="summary-grid"><div class="sg safe"><span>'+counts.safe+'</span><small>SAFE</small></div>'+
      '<div class="sg low"><span>'+counts.low+'</span><small>LOW</small></div>'+
      '<div class="sg warn"><span>'+counts.warning+'</span><small>MEDIUM</small></div>'+
      '<div class="sg danger"><span>'+counts.danger+'</span><small>DANGER</small></div></div>'+
      '<div class="summary-info">'+allResults.length+' emails scanned</div>';
    res.insertBefore(summary,res.firstChild);

    document.getElementById('stat-safe').textContent=counts.safe;
    document.getElementById('stat-low').textContent=counts.low;
    document.getElementById('stat-warn').textContent=counts.warning;
    document.getElementById('stat-danger').textContent=counts.danger;
    document.getElementById('stats').classList.remove('hidden');
  }catch(e){res.innerHTML='<div class="empty"><div class="icon">❌</div>Error: '+e.message+'</div>'}
  btn.textContent='🔍 Scan Emails';btn.disabled=false;
}

function renderCard(r,container){
  var card=document.createElement('div');
  card.className='email-card '+r.risk;
  var html='<div class="email-header"><div class="email-sender">'+esc(r.display||r.sender||'Unknown')+'</div><div class="email-score">'+r.score+'</div></div>'+
    '<div class="email-subject">'+esc(r.subject||'(no subject)')+'</div>';
  for(var i=0;i<r.findings.length;i++){
    var f=r.findings[i];
    html+='<div class="finding '+f.sev+'"><div class="finding-title"><span>'+f.icon+'</span> '+esc(f.title)+'</div><div class="finding-text">'+esc(f.text)+'</div></div>';
  }
  card.innerHTML=html;
  container.appendChild(card);
}

function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

/* ═══════════════ INIT ═══════════════ */
window.addEventListener('load',function(){
  var s1=document.createElement('script');
  s1.src='https://apis.google.com/js/api.js';
  s1.onload=function(){gapi.load('client',function(){gapi.client.init({apiKey:API_KEY,discoveryDocs:DISCOVERY_DOCS})})};
  document.head.appendChild(s1);
  var s2=document.createElement('script');
  s2.src='https://accounts.google.com/gsi/client';
  document.head.appendChild(s2);
});
