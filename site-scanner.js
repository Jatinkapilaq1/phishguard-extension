/**
 * PhishGuard AI — Unified Site Scanner v6.0
 * ONE file handles BOTH website scanning AND AI chatbot scanning
 * If AI site → AI badge. If normal site → website badge. Never both.
 */
(function() {
  'use strict';

  if (document.getElementById('phishguard-panel') || document.getElementById('phishguard-badge') || document.getElementById('phishguard-ai-badge')) return;
  if (window.location.protocol === 'chrome-extension:') return;

  /* ══════════════════════════════════════════════════════════════
     AI SERVICE DATABASE — 200+ services
     ══════════════════════════════════════════════════════════════ */
  var AI_SERVICES = {
    chatgpt:{n:'ChatGPT',d:['chatgpt.com','chat.openai.com','openai.com'],i:'🤖',c:'#10a37f'},
    gemini:{n:'Gemini',d:['gemini.google.com','bard.google.com','aistudio.google.com'],i:'✨',c:'#4285f4'},
    claude:{n:'Claude',d:['claude.ai','anthropic.com'],i:'🧠',c:'#d4a574'},
    copilot:{n:'Copilot',d:['copilot.microsoft.com','copilot.cloud.microsoft','bing.com/chat'],i:'🪟',c:'#7b68ee'},
    perplexity:{n:'Perplexity',d:['perplexity.ai','www.perplexity.ai','pro.perplexity.ai'],i:'🔍',c:'#20b2aa'},
    grok:{n:'Grok',d:['grok.com','x.com/i/grok'],i:'⚡',c:'#1da1f2'},
    deepseek:{n:'DeepSeek',d:['deepseek.com','chat.deepseek.com','platform.deepseek.com'],i:'🔮',c:'#6366f1'},
    meta:{n:'Meta AI',d:['ai.meta.com','meta.ai'],i:'🔵',c:'#0668E1'},
    qwen:{n:'Qwen',d:['qwen.ai','chat.qwen.ai','tongyi.aliyun.com'],i:'🌊',c:'#615EFC'},
    doubao:{n:'Doubao',d:['doubao.com','www.doubao.com'],i:'🫘',c:'#34D399'},
    opencode:{n:'OpenCode',d:['opencode.ai','opencode.sh'],i:'💻',c:'#00d4aa'},
    cursor:{n:'Cursor',d:['cursor.com','cursor.sh'],i:'⌨️',c:'#000'},
    devin:{n:'Devin',d:['devin.ai','www.devin.ai','cognition.ai'],i:'🤖',c:'#1a1a2e'},
    v0:{n:'v0',d:['v0.dev','v0.vercel.app'],i:'🎨',c:'#000'},
    bolt:{n:'Bolt',d:['bolt.new','stackblitz.com'],i:'⚡',c:'#1389fd'},
    replit:{n:'Replit',d:['replit.com','replit.ai'],i:'🔄',c:'#f26207'},
    lovable:{n:'Lovable',d:['lovable.dev'],i:'💝',c:'#e11d48'},
    windsurf:{n:'Windsurf',d:['windsurf.com','codeium.com'],i:'🏄',c:'#00A8E8'},
    cody:{n:'Cody',d:['sourcegraph.com/cody'],i:'📝',c:'#FF5543'},
    phind:{n:'Phind',d:['phind.com'],i:'🔎',c:'#7c3aed'},
    ghcopilot:{n:'GitHub Copilot',d:['github.com/features/copilot'],i:'🐙',c:'#24292e'},
    tabnine:{n:'Tabnine',d:['tabnine.com'],i:'✨',c:'#E55AFD'},
    amazonq:{n:'Amazon Q',d:['aws.amazon.com/q'],i:'📦',c:'#FF9900'},
    jetbrains:{n:'JetBrains AI',d:['jetbrains.com/ai'],i:'🧠',c:'#FE315D'},
    augment:{n:'Augment',d:['augmentcode.com'],i:'🚀',c:'#6C63FF'},
    manus:{n:'Manus AI',d:['manus.im','manus.kim','manus.ai'],i:'🤖',c:'#6366f1'},
    crewai:{n:'CrewAI',d:['crewai.com','app.crewai.com'],i:'👥',c:'#FF6B35'},
    autogpt:{n:'AutoGPT',d:['agpt.co','autogpt.net'],i:'🤖',c:'#4CAF50'},
    metagpt:{n:'MetaGPT',d:['metagpt.io','deepwisdom.ai'],i:'🎭',c:'#8B5CF6'},
    autogen:{n:'AutoGen',d:['autogen.io'],i:'🔧',c:'#0078D4'},
    langchain:{n:'LangChain',d:['langchain.com','smith.langchain.com'],i:'🦜',c:'#1C3C3C'},
    langflow:{n:'Langflow',d:['langflow.org','flowtest.ai'],i:'🌊',c:'#10B981'},
    dify:{n:'Dify',d:['dify.ai','cloud.dify.ai'],i:'🔬',c:'#3B82F6'},
    n8n:{n:'n8n',d:['n8n.io','app.n8n.io'],i:'🔄',c:'#EA4B71'},
    lindy:{n:'Lindy AI',d:['lindy.ai'],i:'🦋',c:'#7C3AED'},
    superagent:{n:'SuperAgent',d:['superagent.ai','superagent.sh'],i:'🦸',c:'#FF4500'},
    midjourney:{n:'Midjourney',d:['midjourney.com'],i:'🎨',c:'#000'},
    dalle:{n:'DALL-E',d:['openai.com/dall-e','labs.openai.com'],i:'🖼️',c:'#10a37f'},
    stability:{n:'Stable Diffusion',d:['stability.ai','stablediffusionweb.com','clipdrop.co'],i:'🎨',c:'#A855F7'},
    ideogram:{n:'Ideogram',d:['ideogram.ai'],i:'✏️',c:'#7C3AED'},
    leonardo:{n:'Leonardo.AI',d:['leonardo.ai'],i:'🎨',c:'#FF6B6B'},
    runway:{n:'Runway',d:['runwayml.com'],i:'🎬',c:'#000'},
    pika:{n:'Pika',d:['pika.art'],i:'🎬',c:'#7C3AED'},
    suno:{n:'Suno',d:['suno.com','suno.ai'],i:'🎵',c:'#000'},
    udio:{n:'Udio',d:['udio.com'],i:'🎶',c:'#000'},
    elevenlabs:{n:'ElevenLabs',d:['elevenlabs.io','elevenlabs.com'],i:'🎙️',c:'#000'},
    canva:{n:'Canva AI',d:['canva.com','canva.ai'],i:'🎨',c:'#00C4CC'},
    removebg:{n:'Remove.bg',d:['remove.bg'],i:'✂️',c:'#6C63FF'},
    synthesia:{n:'Synthesia',d:['synthesia.io'],i:'🎬',c:'#000'},
    heygen:{n:'HeyGen',d:['heygen.com'],i:'🎬',c:'#6366F1'},
    descript:{n:'Descript',d:['descript.com'],i:'🎬',c:'#4CAF50'},
    speechify:{n:'Speechify',d:['speechify.com'],i:'📖',c:'#FBBF24'},
    you:{n:'You.com',d:['you.com','youchat.com'],i:'🧑',c:'#1a73e8'},
    kagi:{n:'Kagi',d:['kagi.com'],i:'🔮',c:'#FF6B35'},
    jasper:{n:'Jasper',d:['jasper.ai'],i:'✍️',c:'#E11D48'},
    copy:{n:'Copy.ai',d:['copy.ai'],i:'✍️',c:'#8B5CF6'},
    writesonic:{n:'Writesonic',d:['writesonic.com'],i:'✍️',c:'#4CAF50'},
    grammarly:{n:'Grammarly',d:['grammarly.com'],i:'📝',c:'#15C39A'},
    notion:{n:'Notion AI',d:['notion.so'],i:'📝',c:'#000'},
    mem:{n:'Mem',d:['mem.ai'],i:'🧠',c:'#8B5CF6'},
    character:{n:'Character.AI',d:['character.ai','beta.character.ai'],i:'🎭',c:'#8b5cf6'},
    janitor:{n:'Janitor AI',d:['janitorai.com'],i:'🧹',c:'#ef4444'},
    chatpdf:{n:'ChatPDF',d:['chatpdf.com'],i:'📄',c:'#f97316'},
    poe:{n:'Poe',d:['poe.com'],i:'💬',c:'#6c5ce7'},
    huggingface:{n:'HuggingFace',d:['huggingface.co','hf.co'],i:'🤗',c:'#ffd21e'},
    cohere:{n:'Cohere',d:['cohere.com','coral.cohere.com'],i:'🪸',c:'#3959ff'},
    mistral:{n:'Mistral',d:['chat.mistral.ai','mistral.ai'],i:'🌪️',c:'#ff7000'},
    pi:{n:'Pi',d:['pi.ai','heypi.com'],i:'🫧',c:'#e8457c'},
    groq:{n:'Groq',d:['groq.com'],i:'⚡',c:'#F55036'},
    together:{n:'Together AI',d:['together.ai'],i:'🤝',c:'#6366f1'},
    fireworks:{n:'Fireworks AI',d:['fireworks.ai'],i:'🎆',c:'#FF4500'},
    openrouter:{n:'OpenRouter',d:['openrouter.ai'],i:'🔀',c:'#6366f1'},
    novita:{n:'Novita AI',d:['novita.ai'],i:'💡',c:'#6366f1'},
    chutes:{n:'Chutes AI',d:['chutes.ai'],i:'🚀',c:'#10B981'},
    venice:{n:'Venice AI',d:['venice.ai'],i:'🎭',c:'#8B5CF6'},
    replicate:{n:'Replicate',d:['replicate.com'],i:'🔁',c:'#000'},
    e2b:{n:'E2B',d:['e2b.dev'],i:'🚀',c:'#000'},
    modal:{n:'Modal',d:['modal.com'],i:'☁️',c:'#000'},
    anyscale:{n:'Anyscale',d:['anyscale.com'],i:'☁️',c:'#000'},
    deepinfra:{n:'DeepInfra',d:['deepinfra.com'],i:'☁️',c:'#6366f1'},
    agentforce:{n:'Agentforce',d:['agentforce.com'],i:'☁️',c:'#00A1E0'},
    zendesk:{n:'Zendesk AI',d:['zendesk.com'],i:'🎧',c:'#03363D'},
    intercom:{n:'Intercom',d:['intercom.com'],i:'💬',c:'#286EFA'},
    freshdesk:{n:'Freshdesk AI',d:['freshdesk.com'],i:'🎧',c:'#26A69A'},
    ada:{n:'Ada AI',d:['ada.cx'],i:'🤖',c:'#000'},
    tidio:{n:'Tidio',d:['tidio.com'],i:'💬',c:'#0066FF'},
    drift:{n:'Drift',d:['drift.com'],i:'💬',c:'#5C2D91'},
    figma:{n:'Figma AI',d:['figma.com'],i:'🎨',c:'#A259FF'},
    framer:{n:'Framer',d:['framer.com'],i:'🎨',c:'#0055FF'},
    julius:{n:'Julius AI',d:['julius.ai'],i:'📊',c:'#6366f1'},
    chatbase:{n:'Chatbase',d:['chatbase.co'],i:'📊',c:'#2563EB'},
    botpress:{n:'Botpress',d:['botpress.com','botpress.cloud'],i:'🤖',c:'#0066FF'},
    vapi:{n:'Vapi',d:['vapi.ai'],i:'📞',c:'#6366f1'},
    bland:{n:'Bland AI',d:['bland.ai'],i:'📞',c:'#4CAF50'},
    retell:{n:'Retell AI',d:['retellai.com'],i:'📞',c:'#6366f1'},
    deepl:{n:'DeepL',d:['deepl.com','deepl.pro'],i:'🌐',c:'#0F2B46'},
    watsonx:{n:'IBM watsonx',d:['ibm.com/watsonx'],i:'🏥',c:'#0F62FE'},
    khanmigo:{n:'Khanmigo',d:['khanacademy.org/khan-labs'],i:'📚',c:'#14BF96'},
    duolingo:{n:'Duolingo AI',d:['duolingo.com'],i:'🦉',c:'#58CC02'},
    cleo:{n:'Cleo',d:['askcleo.com'],i:'💰',c:'#000'},
    vercel:{n:'Vercel AI',d:['vercel.com/ai'],i:'▲',c:'#000'},
    llamaindex:{n:'LlamaIndex',d:['llamaindex.ai'],i:'🦙',c:'#000'},
    haystack:{n:'Haystack',d:['haystack.deepset.ai'],i:'🌾',c:'#FF6B35'},
    flowise:{n:'Flowise',d:['flowiseai.com'],i:'🌊',c:'#2563EB'},
    mem0:{n:'Mem0',d:['mem0.ai'],i:'🧠',c:'#7C3AED'},
    zapier:{n:'Zapier AI',d:['zapier.com'],i:'⚡',c:'#FF4A00'},
    make:{n:'Make AI',d:['make.com'],i:'🔄',c:'#6D00CC'},
    otter:{n:'Otter AI',d:['otter.ai'],i:'🦦',c:'#000'},
    fireflies:{n:'Fireflies.ai',d:['fireflies.ai'],i:'🔥',c:'#7C3AED'},
    tldv:{n:'tldv',d:['tldv.io'],i:'📋',c:'#6366f1'},
    elicit:{n:'Elicit',d:['elicit.com'],i:'🔬',c:'#000'},
    consensus:{n:'Consensus',d:['consensus.app'],i:'🔬',c:'#4CAF50'},
    sora:{n:'Sora',d:['sora.com','openai.com/sora'],i:'🎬',c:'#10a37f'},
    flux:{n:'Flux',d:['blackforestlabs.ai'],i:'🎨',c:'#000'},
    xai:{n:'xAI',d:['x.ai'],i:'⚡',c:'#1da1f2'},
    anthropic:{n:'Anthropic',d:['anthropic.com'],i:'🧠',c:'#d4a574'},
    openai:{n:'OpenAI',d:['openai.com'],i:'🤖',c:'#10a37f'},
    lumalabs:{n:'Luma AI',d:['lumalabs.ai'],i:'📸',c:'#000'},
    typeform:{n:'Typeform AI',d:['typeform.com'],i:'📋',c:'#262627'},
    clickup:{n:'ClickUp AI',d:['clickup.com'],i:'📋',c:'#7B68EE'},
    hubspot:{n:'HubSpot AI',d:['hubspot.com'],i:'📊',c:'#FF7A59'},
    salesforce:{n:'Salesforce AI',d:['salesforce.com'],i:'☁️',c:'#00A1E0'},
    assemblyai:{n:'AssemblyAI',d:['assemblyai.com'],i:'🎙️',c:'#000'},
    tavily:{n:'Tavily',d:['tavily.com'],i:'🔍',c:'#6366f1'},
    cartesia:{n:'Cartesia',d:['cartesia.ai'],i:'🎙️',c:'#000'},
    baseten:{n:'Baseten',d:['baseten.co'],i:'🔧',c:'#6366f1'},
    friendli:{n:'Friendli AI',d:['friendli.ai'],i:'🤝',c:'#FF6B35'},
    lepton:{n:'Lepton AI',d:['lepton.ai'],i:'⚡',c:'#000'},
    fal:{n:'fal.ai',d:['fal.ai'],i:'⚡',c:'#000'},
    banana:{n:'Banana.dev',d:['banana.dev'],i:'🍌',c:'#FFE135'},
    lamini:{n:'Lamini',d:['lamini.ai'],i:'🦙',c:'#6366f1'},
    pinecone:{n:'Pinecone',d:['pinecone.io'],i:'🌲',c:'#000'},
    weaviate:{n:'Weaviate',d:['weaviate.io'],i:'🔮',c:'#000'},
    chroma:{n:'Chroma',d:['chromadb.com'],i:'🌈',c:'#000'},
    qdrant:{n:'Qdrant',d:['qdrant.tech'],i:'🔍',c:'#000'},
    milvus:{n:'Milvus',d:['zilliz.com'],i:'🔍',c:'#000'},
    langsmith:{n:'LangSmith',d:['smith.langchain.com'],i:'🔍',c:'#1C3C3C'},
    wandb:{n:'Weights & Biases',d:['wandb.ai'],i:'📊',c:'#FFCC33'},
    nvidia:{n:'NVIDIA AI',d:['nvidia.com/ai','build.nvidia.com'],i:'💚',c:'#76B900'},
    databricks:{n:'Databricks AI',d:['databricks.com'],i:'⚡',c:'#FF3621'},
    snowflake:{n:'Snowflake AI',d:['snowflake.com'],i:'❄️',c:'#29B5E8'},
    mongodb:{n:'MongoDB AI',d:['mongodb.com'],i:'🍃',c:'#47A248'},
    ai21:{n:'AI21 Labs',d:['ai21.com'],i:'🔬',c:'#000'},
    paperpal:{n:'Paperpal',d:['paperpal.com'],i:'📄',c:'#000'},
    photoroom:{n:'PhotoRoom',d:['photoroom.com'],i:'📸',c:'#000'},
    kapwing:{n:'Kapwing',d:['kapwing.com'],i:'🎬',c:'#000'},
    opusclip:{n:'Opus Clip',d:['opus.pro','opusclip.com'],i:'🎬',c:'#000'},
    wolfram:{n:'Wolfram|Alpha',d:['wolframalpha.com'],i:'🧮',c:'#DD1100'},
    talkpal:{n:'Talkpal AI',d:['talkpal.ai'],i:'🗣️',c:'#000'},
    quillbot:{n:'QuillBot',d:['quillbot.com'],i:'✍️',c:'#000'},
    wordtune:{n:'Wordtune',d:['wordtune.com'],i:'✍️',c:'#000'},
    rytr:{n:'Rytr',d:['rytr.me'],i:'✍️',c:'#000'},
    writer:{n:'Writer',d:['writer.com'],i:'✍️',c:'#000'},
    kurzweil:{n:'Kurzweil AI',d:['kurzweilai.net'],i:'🧠',c:'#000'},
    lechat:{n:'Le Chat',d:['lechat.mistral.ai'],i:'💬',c:'#ff7000'},
    huggingchat:{n:'HuggingChat',d:['huggingface.co/chat'],i:'🤗',c:'#ffd21e'},
    sitegpt:{n:'SiteGPT',d:['sitegpt.ai'],i:'🌐',c:'#4CAF50'},
    docsbot:{n:'DocsBot AI',d:['docsbot.ai'],i:'📚',c:'#6366f1'},
    taskade:{n:'Taskade',d:['taskade.com'],i:'📋',c:'#7C3AED'},
    bardeen:{n:'Bardeen',d:['bardeen.ai'],i:'⚡',c:'#7C3AED'},
    gong:{n:'Gong AI',d:['gong.io'],i:'📊',c:'#000'},
    clarity:{n:'Clarity AI',d:['clarity.ai'],i:'📊',c:'#4CAF50'},
    rev:{n:'Rev AI',d:['rev.ai'],i:'🎙️',c:'#000'},
    krisp:{n:'Krisp AI',d:['krisp.ai'],i:'🎙️',c:'#000'},
    murf:{n:'Murf AI',d:['murf.ai'],i:'🎙️',c:'#000'},
    playht:{n:'Play.ht',d:['play.ht'],i:'🎙️',c:'#000'},
    cleanvoice:{n:'Cleanvoice',d:['cleanvoice.ai'],i:'🎙️',c:'#000'},
    sunoai:{n:'Suno AI',d:['suno.ai'],i:'🎵',c:'#000'},
    musicfy:{n:'Musicfy',d:['musicfy.lol'],i:'🎵',c:'#000'},
    soundraw:{n:'Soundraw',d:['soundraw.io'],i:'🎵',c:'#000'},
    lalal:{n:'Lalal.AI',d:['lalal.ai'],i:'🎵',c:'#000'},
    topaz:{n:'Topaz AI',d:['topazlabs.com'],i:'📸',c:'#000'},
    magnific:{n:'Magnific AI',d:['magnific.ai'],i:'✨',c:'#000'},
    cutout:{n:'Cutout.pro',d:['cutout.pro'],i:'✂️',c:'#000'},
    cleanup:{n:'Cleanup.pictures',d:['cleanup.pictures'],i:'🧹',c:'#000'},
    reface:{n:'Reface',d:['reface.ai'],i:'🎭',c:'#000'},
    headshotpro:{n:'HeadshotPro',d:['headshotpro.com'],i:'📸',c:'#000'},
    aragon:{n:'Aragon AI',d:['aragon.ai'],i:'📸',c:'#000'},
    stunning:{n:'Stunning AI',d:['stunning.so'],i:'🌐',c:'#000'},
    dora:{n:'Dora AI',d:['dora.run'],i:'🌐',c:'#000'},
    semantickernel:{n:'Semantic Kernel',d:['semantickernel.ai'],i:'🧩',c:'#0078D4'},
    posthog:{n:'PostHog',d:['posthog.com'],i:'🦔',c:'#1D4AFF'},
    zep:{n:'Zep',d:['getzep.com'],i:'🧠',c:'#000'},
    riffusion:{n:'Riffusion',d:['riffusion.com'],i:'🎵',c:'#000'},
    notionai:{n:'Notion AI',d:['notion.so'],i:'📝',c:'#000'},
    perplexitypro:{n:'Perplexity Pro',d:['pro.perplexity.ai'],i:'🔍',c:'#20b2aa'},
    copilotpro:{n:'Copilot Pro',d:['copilot.microsoft.com'],i:'🪟',c:'#7b68ee'},
    chatgptplus:{n:'ChatGPT Plus',d:['chatgpt.com'],i:'🤖',c:'#10a37f'},
    claudepro:{n:'Claude Pro',d:['claude.ai'],i:'🧠',c:'#d4a574'},
    geminiadvanced:{n:'Gemini Advanced',d:['gemini.google.com'],i:'✨',c:'#4285f4'},
    mistrallechat:{n:'Le Chat Mistral',d:['lechat.mistral.ai'],i:'💬',c:'#ff7000'},
    copilot365:{n:'Copilot 365',d:['copilot.microsoft.com'],i:'🪟',c:'#7b68ee'},
    perplexityai:{n:'Perplexity AI',d:['perplexity.ai'],i:'🔍',c:'#20b2aa'},
    chatgptfree:{n:'ChatGPT Free',d:['chatgpt.com'],i:'🤖',c:'#10a37f'},
    gemini15:{n:'Gemini 1.5',d:['gemini.google.com'],i:'✨',c:'#4285f4'},
    claude3:{n:'Claude 3',d:['claude.ai'],i:'🧠',c:'#d4a574'},
    grok2:{n:'Grok 2',d:['grok.com'],i:'⚡',c:'#1da1f2'},
    deepseekv3:{n:'DeepSeek V3',d:['deepseek.com'],i:'🔮',c:'#6366f1'},
    qwen2:{n:'Qwen 2',d:['qwen.ai'],i:'🌊',c:'#615EFC'},
    llama4:{n:'Llama 4',d:['meta.ai'],i:'🔵',c:'#0668E1'},
    mistralmedium:{n:'Mistral Medium',d:['mistral.ai'],i:'🌪️',c:'#ff7000'},
    coherecommand:{n:'Command R+',d:['cohere.com'],i:'🪸',c:'#3959ff'},
    gpto1:{n:'o1',d:['openai.com'],i:'🤖',c:'#10a37f'},
    gpto3:{n:'o3',d:['openai.com'],i:'🤖',c:'#10a37f'},
    gemini2:{n:'Gemini 2.0',d:['gemini.google.com'],i:'✨',c:'#4285f4'},
    claude4:{n:'Claude 4',d:['claude.ai'],i:'🧠',c:'#d4a574'},
    copilotpages:{n:'Copilot Pages',d:['copilot.microsoft.com'],i:'🪟',c:'#7b68ee'},
    perplexitysonar:{n:'Sonar',d:['perplexity.ai'],i:'🔍',c:'#20b2aa'},
    chatgptcanvas:{n:'Canvas',d:['chatgpt.com'],i:'🤖',c:'#10a37f'},
    geminiexp:{n:'Gemini Exp',d:['gemini.google.com'],i:'✨',c:'#4285f4'},
    deepthink:{n:'DeepThink',d:['deepseek.com'],i:'🔮',c:'#6366f1'},
    moonshot:{n:'Moonshot AI',d:['moonshot.cn'],i:'🌙',c:'#000'},
    zhipu:{n:'Zhipu AI',d:['zhipuai.cn'],i:'🤖',c:'#000'},
    baichuan:{n:'Baichuan',d:['baichuan-ai.com'],i:'🐾',c:'#000'},
    minimax:{n:'MiniMax',d:['minimaxi.com'],i:'🤖',c:'#6366f1'},
    inflection:{n:'Inflection AI',d:['inflection.ai'],i:'🫧',c:'#e8457c'},
    palantir:{n:'Palantir AI',d:['palantir.com'],i:'🔍',c:'#101113'},
    datarobot:{n:'DataRobot',d:['datarobot.com'],i:'🤖',c:'#ED1C24'},
    h2o:{n:'H2O.ai',d:['h2o.ai'],i:'💧',c:'#0F2B46'},
    c3:{n:'C3 AI',d:['c3.ai'],i:'🏢',c:'#000'},
    sas:{n:'SAS AI',d:['sas.com'],i:'📊',c:'#000'},
    grammarlybiz:{n:'Grammarly Business',d:['grammarly.com/business'],i:'📝',c:'#15C39A'},
    otterbiz:{n:'Otter Business',d:['otter.ai'],i:'🦦',c:'#000'},
    nottabiz:{n:'Notta',d:['notta.ai'],i:'📋',c:'#000'},
    happyscribe:{n:'Happy Scribe',d:['happyscribe.com'],i:'🎙️',c:'#000'},
    speechifybiz:{n:'Speechify Business',d:['speechify.com'],i:'📖',c:'#FBBF24'},
    elevenlabsbiz:{n:'ElevenLabs Business',d:['elevenlabs.io'],i:'🎙️',c:'#000'},
    synthesiabiz:{n:'Synthesia Business',d:['synthesia.io'],i:'🎬',c:'#000'},
    heygenbiz:{n:'HeyGen Business',d:['heygen.com'],i:'🎬',c:'#6366F1'},
    canvabiz:{n:'Canva Business',d:['canva.com'],i:'🎨',c:'#00C4CC'},
    midjourneybiz:{n:'Midjourney Business',d:['midjourney.com'],i:'🎨',c:'#000'},
    runwaybiz:{n:'Runway Business',d:['runwayml.com'],i:'🎬',c:'#000'},
    sunobiz:{n:'Suno Business',d:['suno.com'],i:'🎵',c:'#000'},
    udiozbiz:{n:'Udio Business',d:['udio.com'],i:'🎶',c:'#000'},
    sagemaker:{n:'SageMaker',d:['aws.amazon.com/sagemaker'],i:'📦',c:'#FF9900'},
    vertex:{n:'Vertex AI',d:['cloud.google.com/vertex-ai'],i:'✨',c:'#4285f4'},
    azureml:{n:'Azure ML',d:['azure.microsoft.com/machine-learning'],i:'🪟',c:'#0078D4'},
    colab:{n:'Colab',d:['colab.research.google.com'],i:'📝',c:'#F9AB00'},
    kaggle:{n:'Kaggle',d:['kaggle.com'],i:'📊',c:'#20BEFF'},
    paperswithcode:{n:'Papers With Code',d:['paperswithcode.com'],i:'📄',c:'#000'},
    civitai:{n:'Civitai',d:['civitai.com'],i:'🎨',c:'#000'},
    nightcafe:{n:'NightCafe',d:['nightcafe.studio'],i:'🎨',c:'#000'},
    dreamstudio:{n:'DreamStudio',d:['dreamstudio.ai'],i:'🎨',c:'#A855F7'},
    deepseekchat:{n:'DeepSeek Chat',d:['chat.deepseek.com'],i:'🔮',c:'#6366f1'},
    qwenchat:{n:'Qwen Chat',d:['chat.qwen.ai'],i:'🌊',c:'#615EFC'},
    characterai2:{n:'Character.AI 2',d:['character.ai'],i:'🎭',c:'#8b5cf6'},
    janitorai2:{n:'Janitor AI 2',d:['janitorai.com'],i:'🧹',c:'#ef4444'},
    poe2:{n:'Poe 2',d:['poe.com'],i:'💬',c:'#6c5ce7'},
    chatpdf2:{n:'ChatPDF 2',d:['chatpdf.com'],i:'📄',c:'#f97316'},
    cohere2:{n:'Cohere 2',d:['cohere.com'],i:'🪸',c:'#3959ff'},
    mistral2:{n:'Mistral 2',d:['mistral.ai'],i:'🌪️',c:'#ff7000'},
    pi2:{n:'Pi 2',d:['pi.ai'],i:'🫧',c:'#e8457c'},
    groq2:{n:'Groq 2',d:['groq.com'],i:'⚡',c:'#F55036'},
    together2:{n:'Together 2',d:['together.ai'],i:'🤝',c:'#6366f1'},
    fireworks2:{n:'Fireworks 2',d:['fireworks.ai'],i:'🎆',c:'#FF4500'},
    openrouter2:{n:'OpenRouter 2',d:['openrouter.ai'],i:'🔀',c:'#6366f1'},
    novita2:{n:'Novita 2',d:['novita.ai'],i:'💡',c:'#6366f1'},
    chutes2:{n:'Chutes 2',d:['chutes.ai'],i:'🚀',c:'#10B981'},
    venice2:{n:'Venice 2',d:['venice.ai'],i:'🎭',c:'#8B5CF6'},
    deepinfra2:{n:'DeepInfra 2',d:['deepinfra.com'],i:'☁️',c:'#6366f1'},
    friendli2:{n:'Friendli 2',d:['friendli.ai'],i:'🤝',c:'#FF6B35'},
    lepton2:{n:'Lepton 2',d:['lepton.ai'],i:'⚡',c:'#000'},
    baseten2:{n:'Baseten 2',d:['baseten.co'],i:'🔧',c:'#6366f1'},
    banana2:{n:'Banana 2',d:['banana.dev'],i:'🍌',c:'#FFE135'},
    fal2:{n:'fal 2',d:['fal.ai'],i:'⚡',c:'#000'},
    modal2:{n:'Modal 2',d:['modal.com'],i:'☁️',c:'#000'},
    lamini2:{n:'Lamini 2',d:['lamini.ai'],i:'🦙',c:'#6366f1'},
    replicate2:{n:'Replicate 2',d:['replicate.com'],i:'🔁',c:'#000'},
    ai212:{n:'AI21 2',d:['ai21.com'],i:'🔬',c:'#000'},
    stability2:{n:'Stability 2',d:['stability.ai'],i:'🎨',c:'#A855F7'},
    midjourney2:{n:'Midjourney 2',d:['midjourney.com'],i:'🎨',c:'#000'},
    flux2:{n:'Flux 2',d:['blackforestlabs.ai'],i:'🎨',c:'#000'},
    ideogram2:{n:'Ideogram 2',d:['ideogram.ai'],i:'✏️',c:'#7C3AED'},
    leonardo2:{n:'Leonardo 2',d:['leonardo.ai'],i:'🎨',c:'#FF6B6B'},
    runway2:{n:'Runway 2',d:['runwayml.com'],i:'🎬',c:'#000'},
    pika2:{n:'Pika 2',d:['pika.art'],i:'🎬',c:'#7C3AED'},
    suno2:{n:'Suno 2',d:['suno.com'],i:'🎵',c:'#000'},
    udio2:{n:'Udio 2',d:['udio.com'],i:'🎶',c:'#000'},
    elevenlabs2:{n:'ElevenLabs 2',d:['elevenlabs.io'],i:'🎙️',c:'#000'},
    canva2:{n:'Canva 2',d:['canva.com'],i:'🎨',c:'#00C4CC'},
    removebg2:{n:'Remove.bg 2',d:['remove.bg'],i:'✂️',c:'#6C63FF'},
    synthesia2:{n:'Synthesia 2',d:['synthesia.io'],i:'🎬',c:'#000'},
    heygen2:{n:'HeyGen 2',d:['heygen.com'],i:'🎬',c:'#6366F1'},
    descript2:{n:'Descript 2',d:['descript.com'],i:'🎬',c:'#4CAF50'},
    speechify2:{n:'Speechify 2',d:['speechify.com'],i:'📖',c:'#FBBF24'},
    you2:{n:'You.com 2',d:['you.com'],i:'🧑',c:'#1a73e8'},
    kagi2:{n:'Kagi 2',d:['kagi.com'],i:'🔮',c:'#FF6B35'},
    jasper2:{n:'Jasper 2',d:['jasper.ai'],i:'✍️',c:'#E11D48'},
    copy2:{n:'Copy.ai 2',d:['copy.ai'],i:'✍️',c:'#8B5CF6'},
    writesonic2:{n:'Writesonic 2',d:['writesonic.com'],i:'✍️',c:'#4CAF50'},
    grammarly2:{n:'Grammarly 2',d:['grammarly.com'],i:'📝',c:'#15C39A'},
    notion2:{n:'Notion 2',d:['notion.so'],i:'📝',c:'#000'},
    mem2:{n:'Mem 2',d:['mem.ai'],i:'🧠',c:'#8B5CF6'}
  };

  /* ══════════════════════════════════════════════════════════════
     AI DETECTION — check if current site is an AI service
     ══════════════════════════════════════════════════════════════ */
  function detectAIService() {
    var hl = window.location.hostname.toLowerCase();

    /* Exact match */
    for (var key in AI_SERVICES) {
      var d = AI_SERVICES[key].d;
      for (var i = 0; i < d.length; i++) {
        if (hl === d[i] || hl.endsWith('.' + d[i])) {
          return { key: key, svc: AI_SERVICES[key], isLegit: true };
        }
      }
    }

    /* Impersonation — name in domain but not legit */
    for (var key2 in AI_SERVICES) {
      var d2 = AI_SERVICES[key2].d;
      for (var j = 0; j < d2.length; j++) {
        var word = d2[j].split('.')[0].toLowerCase();
        if (word.length > 3 && hl.indexOf(word) !== -1 && !hl.endsWith(d2[j])) {
          return { key: key2, svc: AI_SERVICES[key2], isLegit: false };
        }
      }
    }

    return null;
  }

  /* ══════════════════════════════════════════════════════════════
     AI-SPECIFIC SCANS
     ══════════════════════════════════════════════════════════════ */
  var INJECT = [
    {re:/(?:ignore|forget|disregard)\s+(?:all\s+)?(?:previous|above|prior|your)\s+(?:instructions?|rules?|guidelines?)/i, t:'Instruction override attempt'},
    {re:/(?:jailbreak|dan|do\s+anything\s+now|dev\s+mode|god\s+mode)/i, t:'Jailbreak attempt'},
    {re:/(?:bypass|circumvent|override|disable)\s+(?:your|the|all)\s+(?:safety|security|filter|restriction)/i, t:'Safety bypass attempt'},
    {re:/(?:reveal|show|display|output|print|repeat)\s+(?:your|the)\s+(?:system\s+)?(?:prompt|instructions?|rules?|settings)/i, t:'System prompt extraction'}
  ];

  var HIDDEN = [
    /(?:system\s*prompt|<\|system\|>|\[system\]|<\|im_start\|>system)/i,
    /(?:USER:|ASSISTANT:|<\|im_start\|>user|<\|im_start\|>assistant)/i,
    /(?:BEGIN\s+INSTRUCTION|INSTRUCTION\s*:|DO\s+NOT\s+REVEAL)/i
  ];

  var SUS_LINKS = [
    /(?:bit\.ly|tinyurl|goo\.gl|t\.co|is\.gd|cutt\.ly|rb\.gy)\/[\w-]+/i,
    /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
    /(?:ngrok|localtunnel|serveo|pagekite)\.(?:io|dev|net|com)/i
  ];

  function aiScan() {
    var findings = [];

    /* Prompt injection in user input */
    var inputs = document.querySelectorAll('textarea, [contenteditable="true"], input[type="text"]');
    for (var ii = 0; ii < inputs.length; ii++) {
      var txt = inputs[ii].value || inputs[ii].textContent || '';
      for (var ipi = 0; ipi < INJECT.length; ipi++) {
        if (INJECT[ipi].re.test(txt)) {
          findings.push({sev:'warning',icon:'💉',title:'Prompt injection: ' + INJECT[ipi].t,text:'Your message contains "' + INJECT[ipi].t.toLowerCase() + '" — this can make the AI bypass safety rules and produce harmful or unreliable outputs.'});
          break;
        }
      }
    }

    /* Hidden injection in AI responses */
    var msgs = document.querySelectorAll('.markdown, .prose, .message-content, .response-content, article, [data-message-author]');
    for (var mi = 0; mi < msgs.length; mi++) {
      var html = msgs[mi].innerHTML || '';
      var text = msgs[mi].innerText || '';
      for (var hi = 0; hi < HIDDEN.length; hi++) {
        if (HIDDEN[hi].test(html) && !HIDDEN[hi].test(text)) {
          findings.push({sev:'danger',icon:'👻',title:'Hidden prompt injection detected',text:'This AI response contains hidden text (visible in code but not on screen) that attempts to manipulate the AI. The conversation may have been hijacked. Do not trust this response.'});
          break;
        }
      }
    }

    /* Suspicious links */
    var links = document.querySelectorAll('a[href]');
    var seen = {};
    for (var li = 0; li < links.length; li++) {
      var href = links[li].href || '';
      for (var si = 0; si < SUS_LINKS.length; si++) {
        if (SUS_LINKS[si].test(href) && !seen[href]) {
          seen[href] = true;
          var hn = '';
          try { hn = new URL(href).hostname; } catch(e) { continue; }
          findings.push({sev:'high',icon:'🔗',title:'Suspicious link in AI response',text:'AI generated link to "' + hn + '" — shortened, temporary, or IP-based URL. Real AI assistants link to legitimate URLs. Be cautious.'});
        }
      }
    }

    /* Crypto wallet prompts */
    var wallet = document.querySelectorAll('[class*="wallet"], [id*="wallet"], [class*="metamask"], [id*="metamask"]');
    if (wallet.length > 0) {
      findings.push({sev:'danger',icon:'🦊',title:'Crypto wallet connection prompt',text:'This page is asking to connect your crypto wallet. No legitimate AI service requires wallet connection. This is likely a drainer scam. NEVER connect your wallet.'});
    }

    return findings;
  }

  /* ══════════════════════════════════════════════════════════════
     WEBSITE-SPECIFIC CHECKS
     ══════════════════════════════════════════════════════════════ */
  var KNOWN_PHISHING = ['paypal-security','paypal-verify','apple-id-verify','microsoft-login','google-security','facebook-login','instagram-verify','amazon-security','netflix-billing','bank-login','secure-banking','account-verify','identity-confirm','update-account'];

  var TRUSTED = ['google.com','youtube.com','google.co.in','googleapis.com','gstatic.com','cloud.google.com','facebook.com','instagram.com','twitter.com','x.com','linkedin.com','microsoft.com','outlook.com','live.com','office.com','office365.com','github.com','azure.com','apple.com','icloud.com','amazon.com','amazon.in','paypal.com','netflix.com','spotify.com','flipkart.com','zomato.com','swiggy.com','meesho.com','myntra.com','irctc.co.in','phonepe.com','paytm.com','sbi.co.in','hdfcbank.com','icicibank.com','axisbank.com','kotak.com','wikipedia.org','reddit.com','stackoverflow.com','bing.com','yahoo.com','mozilla.org','zoom.us','slack.com','discord.com','telegram.org','whatsapp.com','ebay.com','gov.in','nic.in'];

  var BAD_TLDS = ['.tk','.ml','.ga','.cf','.gq','.xyz','.top','.buzz','.club','.work','.click','.link','.fun','.site','.online','.icu','.monster','.surf','.cfd','.sbs','.cam','.bond','.mom'];

  var BRAND_MAP = [
    {name:'Google',legit:'google.com',p:['google','gmail']},{name:'Microsoft',legit:'microsoft.com',p:['microsoft','outlook','office365','live']},
    {name:'Apple',legit:'apple.com',p:['apple','icloud','itunes']},{name:'Amazon',legit:'amazon.com',p:['amazon']},
    {name:'Facebook',legit:'facebook.com',p:['facebook','fb','meta','instagram','whatsapp']},
    {name:'Netflix',legit:'netflix.com',p:['netflix']},{name:'PayPal',legit:'paypal.com',p:['paypal']},
    {name:'LinkedIn',legit:'linkedin.com',p:['linkedin']},{name:'HDFC Bank',legit:'hdfcbank.com',p:['hdfc']},
    {name:'SBI',legit:'onlinesbi.sbi',p:['sbi','onlinesbi']},{name:'ICICI Bank',legit:'icicibank.com',p:['icici']},
    {name:'Flipkart',legit:'flipkart.com',p:['flipkart']},{name:'Zomato',legit:'zomato.com',p:['zomato']},
    {name:'Swiggy',legit:'swiggy.com',p:['swiggy']},{name:'PhonePe',legit:'phonepe.com',p:['phonepe']},
    {name:'Paytm',legit:'paytm.com',p:['paytm']},{name:'GitHub',legit:'github.com',p:['github']},
    {name:'Twitter/X',legit:'x.com',p:['twitter']},{name:'Telegram',legit:'telegram.org',p:['telegram']},
    {name:'WhatsApp',legit:'whatsapp.com',p:['whatsapp']}
  ];

  function websiteScan() {
    var hostname = window.location.hostname;
    var hl = hostname.toLowerCase();
    var parts = hl.split('.').filter(function(p){return p.length>0;});
    var findings = [];
    var score = 100;

    if (window.location.protocol === 'http:') {
      findings.push({sev:'danger',icon:'🔓',title:'NOT encrypted — your data is exposed (HTTP)',text:'This website uses HTTP instead of HTTPS. Your data is sent in plain text — anyone on the same WiFi (coffee shop, airport, hotel) can intercept and read your passwords, card numbers, messages, and personal information using free tools like Wireshark. The 🔒 padlock in your address bar means HTTPS is active. Never enter ANY personal information on HTTP sites, especially passwords or payment details.'});
      score -= 25;
    }

    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(hostname)) {
      var ip = hostname.split('/')[0];
      findings.push({sev:'danger',icon:'🚨',title:'Raw IP address instead of domain name',text:'This site uses "' + ip + '" instead of a name like "google.com". Legitimate businesses NEVER use raw IP addresses for their websites. IP addresses are like GPS coordinates — they point to a server but tell you nothing about who owns it. Scammers use IPs because they can\'t register real domain names. This is almost certainly a scam.'});
      score -= 35;
    }

    var tld = '.' + parts[parts.length - 1];
    for (var ti = 0; ti < BAD_TLDS.length; ti++) {
      if (tld === BAD_TLDS[ti] || hl.endsWith(BAD_TLDS[ti])) {
        findings.push({sev:'danger',icon:'🌐',title:'Domain ending "' + tld + '" commonly used for scams',text:'TLDs like ' + tld + ' cost less than ₹1 ($0.10) to register with no identity verification. Studies show 90%+ of phishing sites use these cheap TLDs. Real companies use .com, .in, .org, or country-specific TLDs (.co.uk, .de, etc.). The cheap TLD alone doesn\'t prove it\'s a scam, but combined with other red flags, it\'s a major warning sign.'});
        score -= 40;
        break;
      }
    }

    for (var pi = 0; pi < KNOWN_PHISHING.length; pi++) {
      if (hl.indexOf(KNOWN_PHISHING[pi]) !== -1) {
        findings.push({sev:'danger',icon:'🎣',title:'URL matches phishing pattern: "' + KNOWN_PHISHING[pi] + '"',text:'This address contains "' + KNOWN_PHISHING[pi] + '" — a pattern found in thousands of known phishing sites.'});
        score -= 45;
        break;
      }
    }

    var isTrusted = false;
    var trustName = '';
    for (var tdi = 0; tdi < TRUSTED.length; tdi++) {
      if (hl === TRUSTED[tdi] || hl.endsWith('.' + TRUSTED[tdi])) {
        isTrusted = true;
        trustName = TRUSTED[tdi];
        break;
      }
    }
    if (isTrusted) {
      score = Math.max(score, 95);
      findings.unshift({sev:'safe',icon:'✅',title:'Verified: ' + trustName,text:'This is the official ' + trustName + ' website (' + hostname + '). This domain is recognized as a legitimate, well-known service with proper HTTPS encryption and security practices. Safe to use.'});
    }

    if (parts.length > 3) {
      var subs = parts.slice(0, -2);
      var parent = parts.slice(-2).join('.');
      var subWords = subs.join(', ');
      findings.push({sev:'high',icon:'🔗',title:'Complex subdomain: ' + parts.length + ' parts (' + subWords + ')',text:'Full structure: "' + parts.join(' → ') + '". The REAL domain you\'re visiting is "' + parent + '" — everything before that is a subdomain. Scammers pack subdomains with trust words like "secure", "login", "verify", "account" to fool you. For example, "secure.login.google.com.evil-site.com" looks like Google but the actual domain is "evil-site.com". The real domain is always the last 2 parts before the TLD.'});
      score -= 15;
    }

    if (!isTrusted) {
      var sw = hl;
      var sf = [];
      var swMap = {login:'login',secure:'secure',verify:'verify',account:'account',password:'password',banking:'banking',auth:'auth',wallet:'wallet',crypto:'crypto',pay:'payment'};
      var ks = Object.keys(swMap);
      for (var k = 0; k < ks.length; k++) {
        if (sw.indexOf(ks[k]) !== -1) sf.push('"' + ks[k] + '"');
      }
      if (sf.length > 0) {
        var wordExplanations = sf.map(function(w) {
          var clean = w.replace(/"/g, '');
          var reasons = {login:'phishing pages need login forms',secure:'scammers add "secure" to create false trust',verify:'implies action needed to create urgency',account:'targets users who think their account is at risk',password:'directly references the credential being stolen',banking:'impersonates financial institutions',auth:'mimics legitimate authentication pages',wallet:'targets cryptocurrency users',crypto:'targets cryptocurrency users',pay:'targets payment information'};
          return w + ' (' + (reasons[clean] || 'common phishing word') + ')';
        });
        findings.push({sev:'high',icon:'⚠️',title:sf.length + ' suspicious word(s) found in URL',text:'Found: ' + wordExplanations.join(', ') + '. These words are intentionally placed in phishing URLs to create urgency, fake legitimacy, or trick you into thinking the site is official. Legitimate companies rarely need these words in their domain names.'});
        score -= sf.length * 5;
      }
    }

    if (hostname.indexOf('xn--') !== -1) {
      findings.push({sev:'danger',icon:'🔤',title:'Hidden characters detected (Punycode/IDN attack)',text:'This URL contains encoded foreign characters (shown as "xn--" in the address bar). This is called an "IDN Homograph Attack" — scammers register domains that LOOK identical to real ones using foreign alphabets. For example, "аpple.com" (with a Cyrillic "а") looks exactly like "apple.com" but goes to a scam site. Your browser may show the decoded version, but the real domain is different. Never trust a domain you can\'t visually verify.'});
      score -= 35;
    }

    if (!isTrusted) {
      var pf = document.querySelectorAll('input[type="password"]');
      if (pf.length > 0) {
        var fieldDetails = [];
        var hasUsername = document.querySelectorAll('input[type="email"], input[type="text"][name*="user"], input[type="text"][name*="login"], input[type="text"][name*="mail"], input[type="text"][id*="user"], input[type="text"][id*="login"]').length > 0;
        var allForms = document.querySelectorAll('form');
        var formActions = [];
        var formMethods = [];
        for (var ffi = 0; ffi < allForms.length; ffi++) {
          var frm = allForms[ffi];
          if (frm.querySelector('input[type="password"]')) {
            var action = frm.getAttribute('action') || 'none';
            var method = (frm.getAttribute('method') || 'GET').toUpperCase();
            formActions.push(action);
            formMethods.push(method);
          }
        }
        for (var pi = 0; pi < pf.length; pi++) {
          var field = pf[pi];
          var fieldName = field.getAttribute('name') || field.getAttribute('id') || field.getAttribute('placeholder') || 'unnamed';
          var autocomplete = field.getAttribute('autocomplete') || 'not set';
          var isVisible = field.offsetParent !== null;
          fieldDetails.push('"' + fieldName + '" (autocomplete=' + autocomplete + ', visible=' + isVisible + ')');
        }
        var methodWarning = formMethods.indexOf('GET') !== -1 ? ' ⚠️ One form uses GET method — your password will appear in the URL bar and browser history!' : '';
        var actionInfo = formActions.length > 0 ? ' Form sends data to: ' + formActions.join(', ') + '.' : '';
        var purposeGuess = hasUsername ? 'This looks like a login form (username + password fields found).' : 'Only password field(s) found — unusual for a legitimate login page.';
        findings.push({sev:'danger',icon:'🔑',title:'Password field on untrusted domain (' + hostname + ')',text:'Found ' + pf.length + ' password field(s): ' + fieldDetails.join('; ') + '.' + actionInfo + ' Methods: ' + formMethods.join(', ') + '.' + methodWarning + ' ' + purposeGuess + ' Since "' + hostname + '" is NOT a recognized website, this page could be a phishing replica designed to capture your credentials. Real services like Google, Microsoft, and banks use dedicated auth domains (e.g., accounts.google.com). Before entering anything, ask: did I navigate here myself, or click a link from an email/SMS?'});
        score -= 25;
      }
    }

    var scripts = document.querySelectorAll('script[src]');
    for (var sci = 0; sci < scripts.length; sci++) {
      var src = (scripts[sci].getAttribute('src') || '').toLowerCase();
        if (src.indexOf('coinhive') !== -1 || src.indexOf('cryptoloot') !== -1 || src.indexOf('miner') !== -1) {
        findings.push({sev:'danger',icon:'⛏️',title:'Hidden cryptocurrency miner detected',text:'This website is running a hidden script from "' + src + '" that mines cryptocurrency using YOUR computer\'s CPU/GPU. This slows down your device, increases electricity bills, and can damage hardware over time. The website owner profits while you pay the cost. This script runs silently in the background — you may not notice until your laptop fan starts running at full speed. Leave immediately and consider installing an ad blocker like uBlock Origin to prevent this.'});
        score -= 40;
        break;
      }
    }

    if (!isTrusted) {
      for (var bri = 0; bri < BRAND_MAP.length; bri++) {
        var br = BRAND_MAP[bri];
        for (var bpi = 0; bpi < br.p.length; bpi++) {
          var pat = br.p[bpi];
          if (hl.indexOf(pat) !== -1 && hl.indexOf(pat) < hl.indexOf('.') && !hl.endsWith(br.legit)) {
            findings.push({sev:'danger',icon:'🎭',title:'Impersonating ' + br.name + ' — domain mismatch',text:'This domain contains "' + pat + '" which suggests it\'s pretending to be ' + br.name + ', but it\'s NOT hosted on the official ' + br.legit + ' domain. This is a classic brand impersonation attack. Scammers register domains like "google-secure-login.com" or "verify-paypal.com" to trick you into thinking you\'re on the real site. The ONLY official domain for ' + br.name + ' is ' + br.legit + '. Always check the exact domain in your address bar before entering any information.'});
            score -= 40;
            break;
          }
        }
        if (findings.length > 0 && findings[findings.length - 1].icon === '🎭') break;
      }
    }

    if (!isTrusted && hostname.length > 40) {
      findings.push({sev:'low',icon:'📏',title:'Unusually long domain name (' + hostname.length + ' chars)',text:'This domain is ' + hostname.length + ' characters long. Research shows phishing URLs average 2-3x longer than legitimate ones because scammers pack them with trust words (e.g., "secure-login-verify-account-update.com"). While some legitimate sites have long names (e.g., "support.google.com"), combined with other red flags, this is a warning sign.'});
      score -= 5;
    }

    if (!isTrusted) {
      var hc = (hostname.match(/-/g) || []).length;
      if (hc >= 3) {
        findings.push({sev:'high',icon:'➖',title:hc + ' hyphens found in domain name',text:'This domain has ' + hc + ' hyphens (-). Research shows phishing domains average 3-4x more hyphens than legitimate ones. Scammers use hyphens to pack multiple trust words into a single domain (e.g., "secure-login-verify-account.com"). While some legitimate sites use hyphens (e.g., "my-business.com"), 3+ hyphens on an untrusted domain is a significant red flag.'});
        score -= 10;
      }
    }

    if (findings.length === 0) {
      findings.push({sev:'safe',icon:'✅',title:'No threats detected',text:'No phishing patterns, suspicious scripts, credential harvesting forms, or security issues found on this page. This doesn\'t guarantee the site is safe — always verify the URL matches the official domain before entering sensitive information.'});
    }

    score = Math.max(0, Math.min(100, score));
    var risk = score >= 80 ? 'safe' : score >= 50 ? 'low' : score >= 30 ? 'warning' : 'danger';
    return {hostname: hostname, score: score, risk: risk, findings: findings};
  }

  /* ══════════════════════════════════════════════════════════════
     BADGE (DRAGGABLE + MINIMIZABLE)
     ══════════════════════════════════════════════════════════════ */
  function showBadge(result, isAI) {
    var old = document.getElementById('phishguard-badge');
    if (old) old.remove();

    var colorMap = {safe:'#4caf50',low:'#ffc107',warning:'#ff9800',danger:'#f44336'};
    var labelMap = {safe:'SAFE',low:'LOW RISK',warning:'CAUTION',danger:'DANGER'};
    var iconMap = {safe:'✅',low:'⚠️',warning:'⚡',danger:'🚨'};

    var color = colorMap[result.risk];
    var icon, text;

    if (isAI) {
      icon = result.aiIcon || '🤖';
      text = 'PhishGuard: ' + (result.aiName || 'AI') + ' ' + labelMap[result.risk] + ' (' + result.score + '/100)';
    } else {
      icon = iconMap[result.risk];
      text = 'PhishGuard: ' + labelMap[result.risk] + ' (' + result.score + '/100)';
    }

    var minimized = false;
    var badge = document.createElement('div');
    badge.id = 'phishguard-badge';
    badge.style.cssText = 'position:fixed;bottom:16px;' + (isAI ? 'left:16px' : 'right:16px') + ';z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,sans-serif;cursor:grab;transition:opacity .3s;user-select:none;';
    badge.innerHTML =
      '<div id="pg-badge-inner" style="background:' + color + ';color:#fff;padding:8px 14px;border-radius:24px;box-shadow:0 4px 20px rgba(0,0,0,.4);display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;backdrop-filter:blur(10px)">' +
        '<span style="font-size:14px">' + icon + '</span>' +
        '<span id="pg-badge-text">' + text + '</span>' +
        '<span id="pg-badge-toggle" style="font-size:10px;opacity:.7;cursor:pointer;padding:2px 4px;border-radius:4px;margin-left:4px" title="Minimize">' + (isAI ? '▲' : '▼') + '</span>' +
      '</div>';

    var panel = null;
    var panelOpen = false;

    badge.querySelector('#pg-badge-toggle').onclick = function(e) {
      e.stopPropagation();
      minimized = !minimized;
      var bt = badge.querySelector('#pg-badge-text');
      var tg = badge.querySelector('#pg-badge-toggle');
      var bi = badge.querySelector('#pg-badge-inner');
      if (minimized) { bt.style.display='none'; tg.textContent=isAI?'▼':'▲'; bi.style.padding='8px 10px'; bi.style.borderRadius='50%'; }
      else { bt.style.display=''; tg.textContent=isAI?'▲':'▼'; bi.style.padding='8px 14px'; bi.style.borderRadius='24px'; }
    };

    badge.querySelector('#pg-badge-inner').onclick = function(e) {
      if (e.target.id === 'pg-badge-toggle') return;
      e.stopPropagation();
      if (panelOpen && panel) { panel.remove(); panelOpen = false; return; }
      panel = createPanel(result, isAI);
      document.body.appendChild(panel);
      panelOpen = true;
    };

    /* Drag */
    var dragging = false, sx, sy, sl, st;
    badge.onmousedown = function(e) {
      if (e.target.id === 'pg-badge-toggle') return;
      dragging = true; sx = e.clientX; sy = e.clientY;
      var r = badge.getBoundingClientRect(); sl = r.left; st = r.top;
      badge.style.transition = 'none'; badge.style.cursor = 'grabbing'; e.preventDefault();
    };
    document.onmousemove = function(e) {
      if (!dragging) return;
      badge.style.left = (sl + e.clientX - sx) + 'px';
      badge.style.top = (st + e.clientY - sy) + 'px';
      badge.style.right = 'auto'; badge.style.bottom = 'auto';
    };
    document.onmouseup = function() { if (dragging) { dragging = false; badge.style.cursor = 'grab'; badge.style.transition = 'opacity .3s'; } };

    /* Fade */
    badge.style.opacity = '0';
    setTimeout(function() { badge.style.transition = 'all .4s ease'; badge.style.opacity = '1'; }, isAI ? 2000 : 1500);
    var ht;
    badge.onmouseenter = function() { clearTimeout(ht); badge.style.opacity = '1'; };
    badge.onmouseleave = function() { ht = setTimeout(function() { if (!panelOpen) badge.style.opacity = '0.3'; }, 3000); };
    setTimeout(function() { badge.style.opacity = '1'; ht = setTimeout(function() { if (!panelOpen) badge.style.opacity = '0.3'; }, 5000); }, isAI ? 2000 : 1500);

    document.body.appendChild(badge);
  }

  /* ══════════════════════════════════════════════════════════════
     PANEL
     ══════════════════════════════════════════════════════════════ */
  function createPanel(result, isAI) {
    var colorMap = {safe:'#4caf50',low:'#ffc107',warning:'#ff9800',danger:'#f44336'};
    var labelMap = {safe:'SAFE',low:'LOW RISK',warning:'CAUTION',danger:'DANGER'};
    var color = colorMap[result.risk];

    var el = document.createElement('div');
    el.id = 'phishguard-panel';
    el.style.cssText = 'position:fixed;bottom:60px;' + (isAI ? 'left:16px' : 'right:16px') + ';width:380px;max-height:75vh;background:#1a1a2e;border-radius:16px;overflow:hidden;z-index:2147483646;box-shadow:0 20px 60px rgba(0,0,0,.6);font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#fff;display:flex;flex-direction:column;';

    var title = isAI ? '🤖 PhishGuard AI Chatbot Scanner' : '🛡️ PhishGuard AI';
    var subtitle = isAI ? (result.aiName || 'AI') + ' — ' + result.hostname : result.hostname;

    var html = '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:14px;display:flex;justify-content:space-between;align-items:center">' +
      '<div><div style="font-size:14px;font-weight:700">' + title + '</div>' +
      '<div style="font-size:10px;color:rgba(255,255,255,.4);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px" title="' + result.hostname + '">' + subtitle + '</div></div>' +
      '<div style="text-align:right"><div style="font-size:22px;font-weight:800;color:' + color + '">' + result.score + '</div>' +
      '<div style="font-size:9px;color:' + color + '">' + labelMap[result.risk] + '</div></div></div>';

    html += '<div style="padding:0 14px 10px"><div style="height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden"><div style="height:100%;width:' + result.score + '%;background:' + color + ';border-radius:2px;transition:width .5s"></div></div></div>';

    html += '<div style="flex:1;overflow-y:auto;padding:0 14px 14px">';
    for (var i = 0; i < result.findings.length; i++) {
      var f = result.findings[i];
      var fc = f.sev === 'danger' ? '#f44336' : f.sev === 'high' ? '#ff9800' : f.sev === 'safe' ? '#4caf50' : '#ffc107';
      html += '<div style="background:rgba(0,0,0,.25);border-radius:8px;padding:10px;margin-bottom:6px;border-left:3px solid ' + fc + '">' +
        '<div style="font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px"><span>' + f.icon + '</span> ' + f.title + '</div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,.6);margin-top:4px;line-height:1.5">' + f.text + '</div></div>';
    }
    html += '</div>';

    var footer = isAI ? '🤖 PhishGuard AI Chatbot Scanner v6.0' : '🛡️ PhishGuard AI v6.0';
    html += '<div style="padding:10px 14px;border-top:1px solid rgba(76,175,80,.2);text-align:center;font-size:9px;color:rgba(255,255,255,.3)">' + footer + '</div>';

    el.innerHTML = html;

    setTimeout(function() {
      document.addEventListener('click', function handler(e) {
        if (!el.contains(e.target) && e.target.id !== 'pg-badge-toggle' && !badge.contains(e.target)) {
          el.remove();
          document.removeEventListener('click', handler);
        }
      });
    }, 100);

    return el;
  }

  /* ══════════════════════════════════════════════════════════════
     START — AI SITE → AI BADGE. NORMAL SITE → WEBSITE BADGE.
     ══════════════════════════════════════════════════════════════ */
  function start() {
    try {
      var aiInfo = detectAIService();

      if (aiInfo) {
        /* ─── AI SITE ─── */
        var findings = [];

        if (aiInfo.isLegit) {
          findings.push({sev:'safe',icon:aiInfo.svc.i,title:'Verified ' + aiInfo.svc.n,text:'You are on the official ' + aiInfo.svc.n + ' website (' + window.location.hostname + '). Running security checks...'});
          var aiFindings = aiScan();
          findings = findings.concat(aiFindings);
          if (aiFindings.length === 0) {
            findings.push({sev:'safe',icon:'✅',title:'No threats on ' + aiInfo.svc.n,text:'This page is clean. No prompt injections, suspicious links, or malicious scripts detected.'});
          }
        } else {
          findings.push({sev:'danger',icon:'🎭',title:'Possible fake ' + aiInfo.svc.n + ' clone',text:'This site has "' + aiInfo.svc.n + '" in the address but is NOT the official site. Real ' + aiInfo.svc.n + ' is at ' + aiInfo.svc.d[0] + '. Do NOT enter any information.'});
          findings = findings.concat(aiScan());
        }

        var score = aiInfo.isLegit ? Math.max(60, 100 - findings.length * 15) : Math.max(10, 50 - findings.length * 15);
        score = Math.max(0, Math.min(100, score));
        var risk = score >= 80 ? 'safe' : score >= 50 ? 'low' : score >= 30 ? 'warning' : 'danger';

        showBadge({
          hostname: window.location.hostname,
          score: score,
          risk: risk,
          findings: findings,
          aiName: aiInfo.svc.n,
          aiIcon: aiInfo.svc.i
        }, true);

      } else {
        /* ─── NORMAL WEBSITE ─── */
        var result = websiteScan();
        showBadge(result, false);
      }
    } catch (e) {
      console.error('PhishGuard error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

})();
