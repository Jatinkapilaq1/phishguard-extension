/**
 * PhishGuard AI — AI Chatbot Scanner v2.0
 * ONLY appears on AI chatbots, AI agents, AI-related services
 * 100+ AI services in database
 * Detects: fake AI sites, data theft, prompt injection, suspicious links
 */
(function() {
  'use strict';

  if (window.__phishguard_ai_chatbot_loaded) return;
  window.__phishguard_ai_chatbot_loaded = true;

  /* ═══════════════ COMPREHENSIVE AI SERVICE DATABASE (100+) ═══════════════ */
  var AI_SERVICES = {
    /* ─── MAJOR CHATBOTS ─── */
    chatgpt:     { name: 'ChatGPT',       legit: ['chatgpt.com','chat.openai.com','openai.com'], icon: '🤖', color: '#10a37f' },
    gemini:      { name: 'Gemini',        legit: ['gemini.google.com','bard.google.com','aistudio.google.com'], icon: '✨', color: '#4285f4' },
    claude:      { name: 'Claude',        legit: ['claude.ai','anthropic.com'], icon: '🧠', color: '#d4a574' },
    copilot:     { name: 'Copilot',       legit: ['copilot.microsoft.com','copilot.cloud.microsoft','bing.com/chat'], icon: '🪟', color: '#7b68ee' },
    perplexity:  { name: 'Perplexity',    legit: ['perplexity.ai','www.perplexity.ai','pro.perplexity.ai'], icon: '🔍', color: '#20b2aa' },
    grok:        { name: 'Grok',          legit: ['grok.com','x.com/i/grok'], icon: '⚡', color: '#1da1f2' },
    deepseek:    { name: 'DeepSeek',      legit: ['deepseek.com','chat.deepseek.com','platform.deepseek.com'], icon: '🔮', color: '#6366f1' },
    meta:        { name: 'Meta AI',       legit: ['ai.meta.com','meta.ai'], icon: '🔵', color: '#0668E1' },
    qwen:        { name: 'Qwen',          legit: ['qwen.ai','chat.qwen.ai','tongyi.aliyun.com'], icon: '🌊', color: '#615EFC' },
    doubao:      { name: 'Doubao',        legit: ['doubao.com','www.doubao.com'], icon: '🫘', color: '#34D399' },

    /* ─── AI CODING AGENTS ─── */
    opencode:    { name: 'OpenCode',      legit: ['opencode.ai','opencode.sh'], icon: '💻', color: '#00d4aa' },
    cursor:      { name: 'Cursor',        legit: ['cursor.com','cursor.sh'], icon: '⌨️', color: '#000000' },
    devin:       { name: 'Devin',         legit: ['devin.ai','www.devin.ai','cognition.ai'], icon: '🤖', color: '#1a1a2e' },
    v0:          { name: 'v0',            legit: ['v0.dev','v0.vercel.app'], icon: '🎨', color: '#000000' },
    bolt:        { name: 'Bolt',          legit: ['bolt.new','stackblitz.com'], icon: '⚡', color: '#1389fd' },
    replit:      { name: 'Replit',        legit: ['replit.com','replit.ai'], icon: '🔄', color: '#f26207' },
    lovable:     { name: 'Lovable',       legit: ['lovable.dev'], icon: '💝', color: '#e11d48' },
    windsurf:    { name: 'Windsurf',      legit: ['windsurf.com','codeium.com','codeium.com/windsurf'], icon: '🏄', color: '#00A8E8' },
    cody:        { name: 'Cody',          legit: ['sourcegraph.com/cody','cody.dev'], icon: '📝', color: '#FF5543' },
    phind:       { name: 'Phind',         legit: ['phind.com'], icon: '🔎', color: '#7c3aed' },
    github_copilot: { name: 'GitHub Copilot', legit: ['github.com/features/copilot','copilot.github.com'], icon: '🐙', color: '#24292e' },
    tabnine:     { name: 'Tabnine',       legit: ['tabnine.com','www.tabnine.com'], icon: '✨', color: '#E55AFD' },
    amazon_q:    { name: 'Amazon Q',      legit: ['aws.amazon.com/q','q.aws.amazon.com'], icon: '📦', color: '#FF9900' },
    jetbrains_ai:{ name: 'JetBrains AI',  legit: ['.jetbrains.com/ai','ai.jetbrains.com'], icon: '🧠', color: '#FE315D' },
    augment:     { name: 'Augment',       legit: ['augmentcode.com'], icon: '🚀', color: '#6C63FF' },
    poolside:    { name: 'Poolside',      legit: ['poolside.ai'], icon: '🏊', color: '#0066FF' },
    factory:     { name: 'Factory',       legit: ['factory.ai'], icon: '🏭', color: '#1a1a2e' },
    PearAI:      { name: 'PearAI',        legit: ['pearai.com'], icon: '🍐', color: '#4CAF50' },
    supermaven:  { name: 'Supermaven',    legit: ['supermaven.com'], icon: '⚡', color: '#F59E0B' },
    zed:         { name: 'Zed',           legit: ['zed.dev'], icon: '📝', color: '#42BE65' },

    /* ─── AI AGENTS / AUTONOMOUS ─── */
    manus:       { name: 'Manus AI',      legit: ['manus.im','manus.kim','manus.ai'], icon: '🤖', color: '#6366f1' },
    crewai:      { name: 'CrewAI',        legit: ['crewai.com','app.crewai.com'], icon: '👥', color: '#FF6B35' },
    autogpt:     { name: 'AutoGPT',       legit: ['agpt.co','autogpt.net'], icon: '🤖', color: '#4CAF50' },
    metagpt:     { name: 'MetaGPT',       legit: ['metagpt.io','deepwisdom.ai'], icon: '🎭', color: '#8B5CF6' },
    autogen:     { name: 'AutoGen',       legit: ['autogen.io','microsoft.github.io/autogen'], icon: '🔧', color: '#0078D4' },
    langchain:   { name: 'LangChain',     legit: ['langchain.com','smith.langchain.com'], icon: '🦜', color: '#1C3C3C' },
    langflow:    { name: 'Langflow',      legit: ['langflow.org','flowtest.ai'], icon: '🌊', color: '#10B981' },
    dify:        { name: 'Dify',          legit: ['dify.ai','cloud.dify.ai'], icon: '🔬', color: '#3B82F6' },
    n8n:         { name: 'n8n',           legit: ['n8n.io','app.n8n.io'], icon: '🔄', color: '#EA4B71' },
    lindy:       { name: 'Lindy AI',      legit: ['lindy.ai','www.lindy.ai'], icon: '🦋', color: '#7C3AED' },
    hoppy:       { name: 'Hoppy',         legit: ['hoppyhq.com'], icon: '🐰', color: '#FF6B6B' },
    agency:      { name: 'Agency',        legit: ['agency.ai'], icon: '🏢', color: '#1a1a2e' },
    superagent:  { name: 'SuperAgent',    legit: ['superagent.ai','superagent.sh'], icon: '🦸', color: '#FF4500' },
    sweep:       { name: 'Sweep AI',      legit: ['sweep.dev'], icon: '🧹', color: '#4CAF50' },
    devika:      { name: 'Devika',        legit: ['devika.ai'], icon: '👩‍💻', color: '#9333EA' },
    open interpreter: { name: 'Open Interpreter', legit: ['openinterpreter.com','openinterpreter.computer'], icon: '💻', color: '#000000' },
    e2b:         { name: 'E2B',           legit: ['e2b.dev','e2b.com'], icon: '🚀', color: '#1a1a2e' },
    replicate:   { name: 'Replicate',     legit: ['replicate.com'], icon: '🔁', color: '#000000' },

    /* ─── CREATIVE AI ─── */
    midjourney:  { name: 'Midjourney',    legit: ['midjourney.com','middayjourney.com'], icon: '🎨', color: '#000000' },
    dall_e:      { name: 'DALL-E',        legit: ['openai.com/dall-e','labs.openai.com'], icon: '🖼️', color: '#10a37f' },
    stable_diffusion: { name: 'Stable Diffusion', legit: ['stability.ai','stablediffusionweb.com','clipdrop.co'], icon: '🎨', color: '#A855F7' },
    ideogram:    { name: 'Ideogram',      legit: ['ideogram.ai'], icon: '✏️', color: '#7C3AED' },
    leonardo:    { name: 'Leonardo.AI',    legit: ['leonardo.ai','app.leonardo.ai'], icon: '🎨', color: '#FF6B6B' },
    runway:      { name: 'Runway',        legit: ['runwayml.com','app.runwayml.com'], icon: '🎬', color: '#000000' },
    pika:        { name: 'Pika',          legit: ['pika.art','pika.style'], icon: '🎬', color: '#7C3AED' },
    suno:        { name: 'Suno',          legit: ['suno.com','suno.ai'], icon: '🎵', color: '#000000' },
    udio:        { name: 'Udio',          legit: ['udio.com'], icon: '🎶', color: '#000000' },
    elevenlabs:  { name: 'ElevenLabs',    legit: ['elevenlabs.io','elevenlabs.com'], icon: '🎙️', color: '#000000' },
    elevenlabs:  { name: 'ElevenLabs',    legit: ['elevenlabs.io','elevenlabs.com'], icon: '🎙️', color: '#000000' },
    canva:       { name: 'Canva AI',      legit: ['canva.com','canva.ai'], icon: '🎨', color: '#00C4CC' },
    removebg:    { name: 'Remove.bg',     legit: ['remove.bg'], icon: '✂️', color: '#6C63FF' },
    removes_bg:  { name: 'Remove.bg',     legit: ['remove.bg'], icon: '✂️', color: '#6C63FF' },

    /* ─── AI VIDEO / VOICE ─── */
    synthesia:   { name: 'Synthesia',     legit: ['synthesia.io'], icon: '🎬', color: '#000000' },
    heygen:      { name: 'HeyGen',        legit: ['heygen.com'], icon: '🎬', color: '#6366F1' },
    descript:    { name: 'Descript',      legit: ['descript.com'], icon: '🎬', color: '#4CAF50' },
    speechify:   { name: 'Speechify',     legit: ['speechify.com'], icon: '📖', color: '#FBBF24' },

    /* ─── AI SEARCH / RESEARCH ─── */
    you:         { name: 'You.com',       legit: ['you.com','youchat.com'], icon: '🧑', color: '#1a73e8' },
    phind:       { name: 'Phind',         legit: ['phind.com'], icon: '🔎', color: '#7c3aed' },
    kagi:        { name: 'Kagi',          legit: ['kagi.com','search.kagi.com'], icon: '🔮', color: '#FF6B35' },
    youchat:     { name: 'YouChat',       legit: ['you.com/search?q=YouChat'], icon: '💬', color: '#1a73e8' },

    /* ─── AI WRITING / CONTENT ─── */
    jasper:      { name: 'Jasper',        legit: ['jasper.ai','www.jasper.ai'], icon: '✍️', color: '#E11D48' },
    copy:        { name: 'Copy.ai',       legit: ['copy.ai'], icon: '✍️', color: '#8B5CF6' },
    writesonic:  { name: 'Writesonic',    legit: ['writesonic.com'], icon: '✍️', color: '#4CAF50' },
    grammarly:   { name: 'Grammarly',     legit: ['grammarly.com'], icon: '📝', color: '#15C39A' },
    notion_ai:   { name: 'Notion AI',     legit: ['notion.so','notion.site'], icon: '📝', color: '#000000' },
    notion:      { name: 'Notion',        legit: ['notion.so'], icon: '📝', color: '#000000' },
    mem:         { name: 'Mem',           legit: ['mem.ai'], icon: '🧠', color: '#8B5CF6' },

    /* ─── AI CHATBOT PLATFORMS ─── */
    character:   { name: 'Character.AI',  legit: ['character.ai','beta.character.ai'], icon: '🎭', color: '#8b5cf6' },
    janitor:     { name: 'Janitor AI',    legit: ['janitorai.com'], icon: '🧹', color: '#ef4444' },
    chatpdf:     { name: 'ChatPDF',       legit: ['chatpdf.com'], icon: '📄', color: '#f97316' },
    poe:         { name: 'Poe',           legit: ['poe.com'], icon: '💬', color: '#6c5ce7' },
    huggingface: { name: 'HuggingFace',   legit: ['huggingface.co','hf.co','huggingface.chat'], icon: '🤗', color: '#ffd21e' },
    cohere:      { name: 'Cohere',        legit: ['cohere.com','coral.cohere.com'], icon: '🪸', color: '#3959ff' },
    mistral:     { name: 'Mistral',       legit: ['chat.mistral.ai','mistral.ai','la plateforme'], icon: '🌪️', color: '#ff7000' },
    pi:          { name: 'Pi',            legit: ['pi.ai','heypi.com'], icon: '🫧', color: '#e8457c' },
    lechat:      { name: 'Le Chat',       legit: ['lechat.mistral.ai'], icon: '💬', color: '#ff7000' },
    groq:        { name: 'Groq',          legit: ['groq.com','console.groq.com'], icon: '⚡', color: '#F55036' },
    together:    { name: 'Together AI',   legit: ['together.ai','api.together.xyz'], icon: '🤝', color: '#6366f1' },
    fireworks:   { name: 'Fireworks AI',  legit: ['fireworks.ai','app.fireworks.ai'], icon: '🎆', color: '#FF4500' },
    openrouter:  { name: 'OpenRouter',    legit: ['openrouter.ai'], icon: '🔀', color: '#6366f1' },
    novita:      { name: 'Novita AI',     legit: ['novita.ai','novita.ai/chat'], icon: '💡', color: '#6366f1' },
    chutes:      { name: 'Chutes AI',     legit: ['chutes.ai'], icon: '🚀', color: '#10B981' },
    venice:      { name: 'Venice AI',     legit: ['venice.ai'], icon: '🎭', color: '#8B5CF6' },

    /* ─── AI BUSINESS / ENTERPRISE ─── */
    salesforce_agentforce: { name: 'Agentforce', legit: ['agentforce.com','salesforce.com/agentforce'], icon: '☁️', color: '#00A1E0' },
    zendesk_ai:  { name: 'Zendesk AI',    legit: ['zendesk.com','zendesk.ai'], icon: '🎧', color: '#03363D' },
    intercom_fin: { name: 'Fin AI',       legit: ['intercom.com','intercom.ai'], icon: '💬', color: '#286EFA' },
    freshdesk:   { name: 'Freshdesk AI',  legit: ['freshdesk.com','freshworks.com'], icon: '🎧', color: '#26A69A' },
    ada:         { name: 'Ada AI',        legit: ['ada.cx'], icon: '🤖', color: '#000000' },
    tidio:       { name: 'Tidio',         legit: ['tidio.com','tidio.com/chatbot-ai'], icon: '💬', color: '#0066FF' },
    intercom:    { name: 'Intercom',      legit: ['intercom.com'], icon: '💬', color: '#286EFA' },
    drift:       { name: 'Drift',         legit: ['drift.com'], icon: '💬', color: '#5C2D91' },

    /* ─── AI IMAGE / DESIGN ─── */
    figma:       { name: 'Figma AI',      legit: ['figma.com','figma.ai'], icon: '🎨', color: '#A259FF' },
    framer:      { name: 'Framer',        legit: ['framer.com','framer.ai'], icon: '🎨', color: '#0055FF' },
    webflow:     { name: 'Webflow AI',    legit: ['webflow.com'], icon: '🌐', color: '#4353FF' },
    relume:      { name: 'Relume',        legit: ['relume.io'], icon: '🎨', color: '#000000' },

    /* ─── AI DATA / ANALYTICS ─── */
    julius:      { name: 'Julius AI',     legit: ['julius.ai'], icon: '📊', color: '#6366f1' },
    chatbase:    { name: 'Chatbase',      legit: ['chatbase.co'], icon: '📊', color: '#2563EB' },
    botpress:    { name: 'Botpress',      legit: ['botpress.com','botpress.cloud'], icon: '🤖', color: '#0066FF' },

    /* ─── AI VOICE / TELEPHONY ─── */
    vapi:        { name: 'Vapi',          legit: ['vapi.ai'], icon: '📞', color: '#6366f1' },
    bland:       { name: 'Bland AI',      legit: ['bland.ai'], icon: '📞', color: '#4CAF50' },
    retell:      { name: 'Retell AI',     legit: ['retellai.com'], icon: '📞', color: '#6366f1' },
    cartesia:    { name: 'Cartesia',      legit: ['cartesia.ai'], icon: '🎙️', color: '#000000' },

    /* ─── AI TRANSLATION ─── */
    deepl:       { name: 'DeepL',         legit: ['deepl.com','deepl.pro'], icon: '🌐', color: '#0F2B46' },
    papago:      { name: 'Papago',        legit: ['papago.naver.com'], icon: '🌐', color: '#03CF5D' },

    /* ─── AI HEALTHCARE ─── */
    watsonx:     { name: 'IBM watsonx',   legit: ['ibm.com/watsonx','watsonx.ai'], icon: '🏥', color: '#0F62FE' },

    /* ─── AI EDUCATION ─── */
    khanmigo:    { name: 'Khanmigo',      legit: ['khanacademy.org/khan-labs','khanmigo.khanacademy.org'], icon: '📚', color: '#14BF96' },
    duolingo:    { name: 'Duolingo AI',   legit: ['duolingo.com'], icon: '🦉', color: '#58CC02' },

    /* ─── AI FINANCE ─── */
    cleo:        { name: 'Cleo',          legit: ['askcleo.com','meetcleo.com'], icon: '💰', color: '#000000' },

    /* ─── AI DEVELOPER TOOLS ─── */
    vercel_ai:   { name: 'Vercel AI',     legit: ['vercel.com/ai','sdk.vercel.ai'], icon: '▲', color: '#000000' },
    llamaindex:  { name: 'LlamaIndex',    legit: ['llamaindex.ai','docs.llamaindex.ai'], icon: '🦙', color: '#000000' },
    semantic_kernel: { name: 'Semantic Kernel', legit: ['learn.microsoft.com/semantic-kernel','semantickernel.ai'], icon: '🧩', color: '#0078D4' },
    haystack:    { name: 'Haystack',      legit: ['haystack.deepset.ai','deepset.ai'], icon: '🌾', color: '#FF6B35' },
    flowise:     { name: 'Flowise',       legit: ['flowiseai.com','flowise.ai'], icon: '🌊', color: '#2563EB' },
    posthog:     { name: 'PostHog',       legit: ['posthog.com'], icon: '🦔', color: '#1D4AFF' },

    /* ─── AI MEMORY / KNOWLEDGE ─── */
    mem0:        { name: 'Mem0',          legit: ['mem0.ai'], icon: '🧠', color: '#7C3AED' },
    zep:         { name: 'Zep',           legit: ['getzep.com','zep.com'], icon: '🧠', color: '#000000' },

    /* ─── MISC AI TOOLS ─── */
    zapier_ai:   { name: 'Zapier AI',     legit: ['zapier.com','zapier.ai'], icon: '⚡', color: '#FF4A00' },
    make:        { name: 'Make AI',       legit: ['make.com','make.ai'], icon: '🔄', color: '#6D00CC' },
    bardeen:     { name: 'Bardeen',       legit: ['bardeen.ai'], icon: '⚡', color: '#7C3AED' },
    taskade:     { name: 'Taskade',       legit: ['taskade.com','taskade.ai'], icon: '📋', color: '#7C3AED' },
    otter:       { name: 'Otter AI',      legit: ['otter.ai'], icon: '🦦', color: '#000000' },
    fireflies:   { name: 'Fireflies.ai',  legit: ['fireflies.ai'], icon: '🔥', color: '#7C3AED' },
    tldv:        { name: 'tldv',          legit: ['tldv.io'], icon: '📋', color: '#6366f1' },
    grain:       { name: 'Grain',         legit: ['grain.com'], icon: '📋', color: '#000000' },
    socratic:    { name: 'Socratic',      legit: ['socratic.org'], icon: '📚', color: '#1a73e8' },
    elicit:      { name: 'Elicit',        legit: ['elicit.com'], icon: '🔬', color: '#000000' },
    consensus:   { name: 'Consensus',     legit: ['consensus.app'], icon: '🔬', color: '#4CAF50' },
    scite:       { name: 'Scite',         legit: ['scite.ai'], icon: '🔬', color: '#6366f1' },
    typeset:     { name: 'Typeset.io',    legit: ['typeset.io'], icon: '📄', color: '#7C3AED' },
    scholarcy:   { name: 'Scholarcy',     legit: ['scholarcy.com'], icon: '📄', color: '#4CAF50' },
    penpal:      { name: 'Penpal',        legit: ['penpal.ai'], icon: '💌', color: '#E11D48' },
    synthflow:   { name: 'Synthflow',     legit: ['synthflow.ai'], icon: '🔄', color: '#6366f1' },
    sitegpt:     { name: 'SiteGPT',       legit: ['sitegpt.ai'], icon: '🌐', color: '#4CAF50' },
    docsbot:     { name: 'DocsBot AI',    legit: ['docsbot.ai'], icon: '📚', color: '#6366f1' },
    typefully:   { name: 'Typefully',     legit: ['typefully.com'], icon: '✍️', color: '#000000' },
    ghostwrite:  { name: 'Ghostwriter',   legit: ['ghostwriter.ai'], icon: '✍️', color: '#000000' },
    regie:       { name: 'Regie.ai',      legit: ['regie.ai'], icon: '✍️', color: '#6366f1' },
    gong:        { name: 'Gong AI',       legit: ['gong.io','gong.ai'], icon: '📞', color: '#000000' },
    clarity:     { name: 'Clarity AI',    legit: ['clarity.ai'], icon: '📊', color: '#4CAF50' },
    luma:        { name: 'Luma AI',       legit: ['lumalabs.ai','luma.ai'], icon: '📸', color: '#000000' },
    depth_ai:    { name: 'Depth AI',      legit: ['depthai.com'], icon: '📸', color: '#6366f1' },
    sora:        { name: 'Sora',          legit: ['sora.com','openai.com/sora'], icon: '🎬', color: '#10a37f' },
    flux:        { name: 'Flux',          legit: ['blackforestlabs.ai','flux.1.ai'], icon: '🎨', color: '#000000' },
    minimax:     { name: 'MiniMax',       legit: ['minimaxi.com','minimax.chat'], icon: '🤖', color: '#6366f1' },
    zhipu:       { name: 'Zhipu AI',      legit: ['zhipuai.cn','chatglm.cn'], icon: '🤖', color: '#000000' },
    moonshot:    { name: 'Moonshot AI',   legit: ['moonshot.cn'], icon: '🌙', color: '#000000' },
    baichuan:    { name: 'Baichuan',      legit: ['baichuan-ai.com'], icon: '🐾', color: '#000000' },
    inflection:  { name: 'Inflection AI', legit: ['inflection.ai'], icon: '🫧', color: '#e8457c' },
    anthropic:   { name: 'Anthropic',     legit: ['anthropic.com'], icon: '🧠', color: '#d4a574' },
    openai:      { name: 'OpenAI',        legit: ['openai.com'], icon: '🤖', color: '#10a37f' },
    xai:         { name: 'xAI',           legit: ['x.ai'], icon: '⚡', color: '#1da1f2' },
    alibaba_ai:  { name: 'Alibaba AI',    legit: ['alibabacloud.com','tongyi.aliyun.com'], icon: '☁️', color: '#FF6A00' },
    baidu_ai:    { name: 'Baidu AI',      legit: ['yiyan.baidu.com','aip.com'], icon: '🔵', color: '#2932E1' },
    tencent_ai:  { name: 'Tencent AI',    legit: ['ai.tencent.com','hunyuan.tencent.com'], icon: '🔵', color: '#1DA1F2' },
    samsung_ai:  { name: 'Samsung AI',    legit: ['samsung.com/ai','galaxyai.samsung.com'], icon: '📱', color: '#1428A0' },
    apple_ai:    { name: 'Apple Intelligence', legit: ['apple.com/intelligence','apple.com/ai'], icon: '🍎', color: '#000000' },
    nvidia_ai:   { name: 'NVIDIA AI',     legit: ['nvidia.com/ai','build.nvidia.com'], icon: '💚', color: '#76B900' },
    c3:          { name: 'C3 AI',         legit: ['c3.ai'], icon: '🏢', color: '#000000' },
    palantir:    { name: 'Palantir AI',   legit: ['palantir.com','palantir.com/palantir-ai'], icon: '🔍', color: '#101113' },
    datarobot:   { name: 'DataRobot',     legit: ['datarobot.com'], icon: '🤖', color: '#ED1C24' },
    h2o:         { name: 'H2O.ai',        legit: ['h2o.ai'], icon: '💧', color: '#0F2B46' },
    sas:         { name: 'SAS AI',        legit: ['sas.com','sas.com/en_us/ai.html'], icon: '📊', color: '#000000' },
    databricks:  { name: 'Databricks AI', legit: ['databricks.com'], icon: '⚡', color: '#FF3621' },
    snowflake:   { name: 'Snowflake AI',  legit: ['snowflake.com'], icon: '❄️', color: '#29B5E8' },
    mongodb_ai:  { name: 'MongoDB AI',    legit: ['mongodb.com','mongodb.com/atlas/ai'], icon: '🍃', color: '#47A248' },
    pinecone:    { name: 'Pinecone',      legit: ['pinecone.io','pinecone.com'], icon: '🌲', color: '#000000' },
    weaviate:    { name: 'Weaviate',      legit: ['weaviate.io','weaviate.com'], icon: '🔮', color: '#000000' },
    chroma:      { name: 'Chroma',        legit: ['chromadb.com','trychroma.com'], icon: '🌈', color: '#000000' },
    qdrant:      { name: 'Qdrant',        legit: ['qdrant.tech','qdrant.io'], icon: '🔍', color: '#000000' },
    milvus:      { name: 'Milvus',        legit: ['milvus.io','zilliz.com'], icon: '🔍', color: '#000000' },
    langsmith:   { name: 'LangSmith',     legit: ['smith.langchain.com','langsmith.dev'], icon: '🔍', color: '#1C3C3C' },
    weights_biases: { name: 'Weights & Biases', legit: ['wandb.ai','wandb.ai/site'], icon: '📊', color: '#FFCC33' },
    neptune:     { name: 'Neptune.ai',    legit: ['neptune.ai'], icon: '📊', color: '#000000' },
    comet:       { name: 'Comet ML',      legit: ['comet.ml','comet.com'], icon: '📊', color: '#000000' },
    modal:       { name: 'Modal',         legit: ['modal.com','modal.run'], icon: '☁️', color: '#000000' },
    lamini:      { name: 'Lamini',        legit: ['lamini.ai'], icon: '🦙', color: '#6366f1' },
    anyscale:    { name: 'Anyscale',      legit: ['anyscale.com'], icon: '☁️', color: '#000000' },
    together_ai: { name: 'Together AI',   legit: ['together.ai'], icon: '🤝', color: '#6366f1' },
    deepinfra:   { name: 'DeepInfra',     legit: ['deepinfra.com'], icon: '☁️', color: '#6366f1' },
    friendli:    { name: 'Friendli AI',   legit: ['friendli.ai'], icon: '🤝', color: '#FF6B35' },
    lepton:      { name: 'Lepton AI',     legit: ['lepton.ai'], icon: '⚡', color: '#000000' },
    baseTen:     { name: 'Baseten',       legit: ['baseten.co'], icon: '🔧', color: '#6366f1' },
    bananadev:   { name: 'Banana.dev',    legit: ['banana.dev'], icon: '🍌', color: '#FFE135' },
    fal:         { name: 'fal.ai',        legit: ['fal.ai'], icon: '⚡', color: '#000000' },
    prediction:  { name: 'Prediction Guard', legit: ['predictionguard.com'], icon: '🛡️', color: '#000000' },
    guardrails:  { name: 'Guardrails AI', legit: ['guardrailsai.com'], icon: '🛡️', color: '#4CAF50' },
    anthropic_console: { name: 'Anthropic Console', legit: ['console.anthropic.com'], icon: '🧠', color: '#d4a574' },
    openai_platform: { name: 'OpenAI Platform', legit: ['platform.openai.com'], icon: '🤖', color: '#10a37f' },
    huggingface_hub: { name: 'HuggingFace Hub', legit: ['huggingface.co'], icon: '🤗', color: '#ffd21e' },
    kaggle:      { name: 'Kaggle',        legit: ['kaggle.com'], icon: '📊', color: '#20BEFF' },
    paperswithcode: { name: 'Papers With Code', legit: ['paperswithcode.com'], icon: '📄', color: '#000000' },
    civitai:     { name: 'Civitai',       legit: ['civitai.com'], icon: '🎨', color: '#000000' },
    nightcafe:   { name: 'NightCafe',     legit: ['nightcafe.studio'], icon: '🎨', color: '#000000' },
    dreamstudio:{ name: 'DreamStudio',   legit: ['dreamstudio.ai','dreamstudio.app'], icon: '🎨', color: '#A855F7' },
    clipdrop:    { name: 'Clipdrop',      legit: ['clipdrop.co'], icon: '✂️', color: '#000000' },
    photoroom:   { name: 'PhotoRoom',     legit: ['photoroom.com'], icon: '📸', color: '#000000' },
    cutout_pro:  { name: 'Cutout.pro',    legit: ['cutout.pro'], icon: '✂️', color: '#000000' },
    cleanup_pictures: { name: 'Cleanup.pictures', legit: ['cleanup.pictures'], icon: '🧹', color: '#000000' },
    bigjpg:      { name: 'BigJPG',        legit: ['bigjpg.com'], icon: '🔍', color: '#000000' },
    topaz:       { name: 'Topaz AI',      legit: ['topazlabs.com','topazlabs.com/products'], icon: '📸', color: '#000000' },
    magnific:    { name: 'Magnific AI',   legit: ['magnific.ai'], icon: '✨', color: '#000000' },
    kapwing:     { name: 'Kapwing',       legit: ['kapwing.com'], icon: '🎬', color: '#000000' },
    clipsai:     { name: 'Clips AI',      legit: ['clipsai.com'], icon: '🎬', color: '#000000' },
    opus:        { name: 'Opus Clip',     legit: ['opus.pro','opusclip.com'], icon: '🎬', color: '#000000' },
    munch:       { name: 'Munch',         legit: ['getmunch.com'], icon: '🎬', color: '#000000' },
    reface:      { name: 'Reface',        legit: ['reface.ai'], icon: '🎭', color: '#000000' },
    facecheck:   { name: 'FaceCheck',     legit: ['facecheck.id'], icon: '🔍', color: '#000000' },
    personapixel: { name: 'Personapixel', legit: ['personapixel.com'], icon: '📸', color: '#000000' },
    headshotpro: { name: 'HeadshotPro',   legit: ['headshotpro.com'], icon: '📸', color: '#000000' },
    aragon:      { name: 'Aragon AI',     legit: ['aragon.ai'], icon: '📸', color: '#000000' },
    profilepic:  { name: 'ProfilePic AI', legit: ['profilepic.ai'], icon: '📸', color: '#000000' },
    stunning:    { name: 'Stunning AI',   legit: ['stunning.so'], icon: '🌐', color: '#000000' },
    dora:        { name: 'Dora AI',       legit: ['dora.run'], icon: '🌐', color: '#000000' },
    riffusion:   { name: 'Riffusion',     legit: ['riffusion.com'], icon: '🎵', color: '#000000' },
    musicfy:     { name: 'Musicfy',       legit: ['musicfy.lol'], icon: '🎵', color: '#000000' },
    soundraw:    { name: 'Soundraw',      legit: ['soundraw.io'], icon: '🎵', color: '#000000' },
    mubert:      { name: 'Mubert',        legit: ['mubert.com'], icon: '🎵', color: '#000000' },
    lalal:       { name: 'Lalal.AI',      legit: ['lalal.ai'], icon: '🎵', color: '#000000' },
    vocalremover:{ name: 'VocalRemover',  legit: ['vocalremover.org'], icon: '🎵', color: '#000000' },
    otter_ai:    { name: 'Otter AI',      legit: ['otter.ai'], icon: '🦦', color: '#000000' },
    fireflies_ai:{ name: 'Fireflies AI',  legit: ['fireflies.ai'], icon: '🔥', color: '#7C3AED' },
    tactiq:      { name: 'Tactiq',        legit: ['tactiq.io'], icon: '📋', color: '#000000' },
    read_ai:     { name: 'Read AI',       legit: ['read.ai'], icon: '📊', color: '#000000' },
    notta:       { name: 'Notta',         legit: ['notta.ai'], icon: '📋', color: '#000000' },
    turboscribe: { name: 'TurboScribe',   legit: ['turboscribe.ai'], icon: '📋', color: '#000000' },
    scribbl:     { name: 'Scribbl',       legit: ['scribbl.co'], icon: '📋', color: '#000000' },
   AssemblyAI:   { name: 'AssemblyAI',    legit: ['assemblyai.com'], icon: '🎙️', color: '#000000' },
    whisper:     { name: 'Whisper',       legit: ['openai.com/research/whisper'], icon: '🎙️', color: '#10a37f' },
    replicate_whisper: { name: 'Replicate Whisper', legit: ['replicate.com'], icon: '🔁', color: '#000000' },
    coqui:       { name: 'Coqui',         legit: ['coqui.ai','coqui.com'], icon: '🎙️', color: '#000000' },
    play.ht:     { name: 'Play.ht',       legit: ['play.ht'], icon: '🎙️', color: '#000000' },
    murf:        { name: 'Murf AI',       legit: ['murf.ai'], icon: '🎙️', color: '#000000' },
    wellsaid:    { name: 'WellSaid Labs', legit: ['wellsaidlabs.com'], icon: '🎙️', color: '#000000' },
    lovo:        { name: 'Lovo AI',       legit: ['lovo.ai'], icon: '🎙️', color: '#000000' },
    fakeyou:     { name: 'FakeYou',       legit: ['fakeyou.com'], icon: '🎭', color: '#000000' },
    playHT:      { name: 'Play.ht',       legit: ['play.ht'], icon: '🎙️', color: '#000000' },
    rev:         { name: 'Rev AI',        legit: ['rev.ai','rev.com'], icon: '🎙️', color: '#000000' },
    sonix:       { name: 'Sonix',         legit: ['sonix.ai','sonix.com'], icon: '🎙️', color: '#000000' },
    happy_scribe: { name: 'Happy Scribe', legit: ['happyscribe.com'], icon: '🎙️', color: '#000000' },
    notta_ai:    { name: 'Notta AI',      legit: ['notta.ai'], icon: '📋', color: '#000000' },
    krisp:       { name: 'Krisp AI',      legit: ['krisp.ai'], icon: '🎙️', color: '#000000' },
    cleanvoice:  { name: 'Cleanvoice',    legit: ['cleanvoice.ai'], icon: '🎙️', color: '#000000' },
    transkribus: { name: 'Transkribus',   legit: ['transkribus.eu'], icon: '📄', color: '#000000' },
    textract:    { name: 'Textract',      legit: ['textract.ai'], icon: '📄', color: '#000000' },
    mathpix:     { name: 'Mathpix',       legit: ['mathpix.com'], icon: '📐', color: '#000000' },
    texlyt:      { name: 'Texlyt',        legit: ['texlyt.ai'], icon: '📐', color: '#000000' },
    wolframalpha:{ name: 'Wolfram|Alpha', legit: ['wolframalpha.com'], icon: '🧮', color: '#DD1100' },
    photomath:   { name: 'Photomath',     legit: ['photomath.com'], icon: '📐', color: '#000000' },
    symbolab:    { name: 'Symbolab',      legit: ['symbolab.com'], icon: '📐', color: '#000000' },
    mathway:     { name: 'Mathway',       legit: ['mathway.com'], icon: '📐', color: '#000000' },
    gauthmath:   { name: 'Gauthmath',     legit: ['gauthmath.com'], icon: '📐', color: '#000000' },
    quizlet_ai:  { name: 'Quizlet AI',    legit: ['quizlet.com'], icon: '📚', color: '#4255FF' },
    coursera_ai: { name: 'Coursera AI',   legit: ['coursera.org'], icon: '📚', color: '#0056D2' },
    udemy_ai:    { name: 'Udemy AI',      legit: ['udemy.com'], icon: '📚', color: '#A435F0' },
    edX_ai:      { name: 'edX AI',        legit: ['edx.org'], icon: '📚', color: '#02262B' },
    talkpal:     { name: 'Talkpal AI',    legit: ['talkpal.ai'], icon: '🗣️', color: '#000000' },
    elsa:        { name: 'ELSA Speak',    legit: ['elsaspeak.com'], icon: '🗣️', color: '#000000' },
    memrise_ai:  { name: 'Memrise AI',    legit: ['memrise.com'], icon: '🗣️', color: '#000000' },
    busuu:       { name: 'Busuu AI',      legit: ['busuu.com'], icon: '🗣️', color: '#000000' },
    speak:       { name: 'Speak',         legit: ['speak.com','usespeak.com'], icon: '🗣️', color: '#000000' },
    khan_kids:   { name: 'Khan Kids AI',  legit: ['khanacademy.org'], icon: '📚', color: '#14BF96' },
    photomath_ai:{ name: 'Photomath AI',  legit: ['photomath.com'], icon: '📐', color: '#000000' },
    elicit_ai:   { name: 'Elicit AI',     legit: ['elicit.com'], icon: '🔬', color: '#000000' },
    semantic_scholar: { name: 'Semantic Scholar', legit: ['semanticscholar.org'], icon: '🔬', color: '#000000' },
    connectedpapers: { name: 'Connected Papers', legit: ['connectedpapers.com'], icon: '🔬', color: '#000000' },
    incite:      { name: 'Incite AI',     legit: ['incite.ai'], icon: '🔬', color: '#000000' },
    consensus_ai:{ name: 'Consensus AI',  legit: ['consensus.app'], icon: '🔬', color: '#4CAF50' },
    scholarcy_ai:{ name: 'Scholarcy AI',  legit: ['scholarcy.com'], icon: '📄', color: '#4CAF50' },
    typeset_ai:  { name: 'Typeset AI',    legit: ['typeset.io'], icon: '📄', color: '#7C3AED' },
    paperpal:    { name: 'Paperpal',      legit: ['paperpal.com'], icon: '📄', color: '#000000' },
    writefull:   { name: 'Writefull',     legit: ['writefull.com'], icon: '✍️', color: '#000000' },
    trinka:      { name: 'Trinka AI',     legit: ['trinka.ai'], icon: '✍️', color: '#000000' },
    inkedit:     { name: 'INK Editor',    legit: ['inkforall.com'], icon: '✍️', color: '#000000' },
    rytr:        { name: 'Rytr',          legit: ['rytr.me'], icon: '✍️', color: '#000000' },
    simplified:  { name: 'Simplified',    legit: ['simplified.com'], icon: '✍️', color: '#000000' },
    neuronwriter:{ name: 'NeuronWriter',  legit: ['neuronwriter.com'], icon: '✍️', color: '#000000' },
    frase:       { name: 'Frase',         legit: ['frase.io'], icon: '✍️', color: '#000000' },
    marketmuse:  { name: 'MarketMuse',    legit: ['marketmuse.com'], icon: '✍️', color: '#000000' },
    scalenut:    { name: 'Scalenut',      legit: ['scalenut.com'], icon: '✍️', color: '#000000' },
    surfer:      { name: 'Surfer SEO',    legit: ['surferseo.com'], icon: '✍️', color: '#000000' },
    clearscope:  { name: 'Clearscope',    legit: ['clearscope.io'], icon: '✍️', color: '#000000' },
    wordtune:    { name: 'Wordtune',      legit: ['wordtune.com'], icon: '✍️', color: '#000000' },
    quillbot:    { name: 'QuillBot',      legit: ['quillbot.com'], icon: '✍️', color: '#000000' },
    text_cortex: { name: 'TextCortex',    legit: ['textcortex.com'], icon: '✍️', color: '#000000' },
    hyperwrite:  { name: 'HyperWrite',    legit: ['hyperwriteai.com'], icon: '✍️', color: '#000000' },
    shortlyai:   { name: 'ShortlyAI',     legit: ['shortlyai.com'], icon: '✍️', color: '#000000' },
    longshot:    { name: 'LongShot AI',   legit: ['longshot.ai'], icon: '✍️', color: '#000000' },
    contentbot:  { name: 'ContentBot',    legit: ['contentbot.ai'], icon: '✍️', color: '#000000' },
    writer:      { name: 'Writer',        legit: ['writer.com'], icon: '✍️', color: '#000000' },
    grammarly_business: { name: 'Grammarly Business', legit: ['grammarly.com/business'], icon: '📝', color: '#15C39A' },
    textio:      { name: 'Textio',        legit: ['textio.com'], icon: '📝', color: '#000000' },
    otter_ai_biz:{ name: 'Otter Business', legit: ['otter.ai'], icon: '🦦', color: '#000000' },
    fireflies_biz:{ name: 'Fireflies Business', legit: ['fireflies.ai'], icon: '🔥', color: '#7C3AED' },
    tldv_biz:    { name: 'tldv Business', legit: ['tldv.io'], icon: '📋', color: '#6366f1' },
    grain_biz:   { name: 'Grain Business', legit: ['grain.com'], icon: '📋', color: '#000000' },
    circleback:  { name: 'CircleBack',    legit: ['circleback.ai'], icon: '📋', color: '#000000' },
    fathom:      { name: 'Fathom AI',     legit: ['fathom.video'], icon: '📋', color: '#000000' },
    clari:       { name: 'Clari AI',      legit: ['clari.com'], icon: '📊', color: '#000000' },
    gong_ai:     { name: 'Gong AI',       legit: ['gong.io'], icon: '📊', color: '#000000' },
    chorus:      { name: 'Chorus AI',     legit: ['chorus.ai'], icon: '📊', color: '#000000' },
    Outreach:    { name: 'Outreach AI',   legit: ['outreach.io'], icon: '📊', color: '#000000' },
    salesloft:   { name: 'Salesloft AI',  legit: ['salesloft.com'], icon: '📊', color: '#000000' },
    Apollo:      { name: 'Apollo AI',     legit: ['apollo.io'], icon: '📊', color: '#000000' },
    seamless_ai: { name: 'Seamless.AI',   legit: ['seamless.ai'], icon: '📊', color: '#000000' },
    leadIQ:      { name: 'LeadIQ',        legit: ['leadiq.com'], icon: '📊', color: '#000000' },
    zoominfo:    { name: 'ZoomInfo AI',   legit: ['zoominfo.com'], icon: '📊', color: '#000000' },
    clearbit:    { name: 'Clearbit AI',   legit: ['clearbit.com'], icon: '📊', color: '#000000' },
    6sense:      { name: '6sense AI',     legit: ['6sense.com'], icon: '📊', color: '#000000' },
    demandbase:  { name: 'Demandbase AI', legit: ['demandbase.com'], icon: '📊', color: '#000000' },
   Drift_ai:     { name: 'Drift AI',      legit: ['drift.com'], icon: '💬', color: '#5C2D91' },
    intercom_fin_ai: { name: 'Intercom Fin AI', legit: ['intercom.com'], icon: '💬', color: '#286EFA' },
    freshdesk_ai: { name: 'Freshdesk AI', legit: ['freshdesk.com'], icon: '🎧', color: '#26A69A' },
    zendesk_ai:  { name: 'Zendesk AI',    legit: ['zendesk.com'], icon: '🎧', color: '#03363D' },
    kustomer:    { name: 'Kustomer AI',   legit: ['kustomer.com'], icon: '🎧', color: '#000000' },
    helpscout:   { name: 'Help Scout AI', legit: ['helpscout.com'], icon: '🎧', color: '#000000' },
    crisp:       { name: 'Crisp AI',      legit: ['crisp.chat'], icon: '💬', color: '#000000' },
    livechat:    { name: 'LiveChat AI',   legit: ['livechat.com'], icon: '💬', color: '#000000' },
    tawk_to:     { name: 'tawk.to AI',    legit: ['tawk.to'], icon: '💬', color: '#000000' },
    hubspot_ai:  { name: 'HubSpot AI',    legit: ['hubspot.com','hubspot.ai'], icon: '📊', color: '#FF7A59' },
    salesforce:  { name: 'Salesforce AI', legit: ['salesforce.com'], icon: '☁️', color: '#00A1E0' },
    sap_ai:      { name: 'SAP AI',        legit: ['sap.com','sap.com/products/artificial-intelligence.html'], icon: '🏢', color: '#0070F2' },
    oracle_ai:   { name: 'Oracle AI',     legit: ['oracle.com','oracle.com/artificial-intelligence.html'], icon: '🏢', color: '#C74634' },
    serviceNow:  { name: 'ServiceNow AI', legit: ['servicenow.com'], icon: '🏢', color: '#81B33A' },
    workday:     { name: 'Workday AI',    legit: ['workday.com'], icon: '🏢', color: '#005CB9' },
    sap_concur:  { name: 'SAP Concur AI', legit: ['concur.com'], icon: '🏢', color: '#0070F2' },
    qualtrics:   { name: 'Qualtrics AI',  legit: ['qualtrics.com'], icon: '📊', color: '#000000' },
    surveyMonkey: { name: 'SurveyMonkey AI', legit: ['surveymonkey.com'], icon: '📊', color: '#00BF6F' },
    typeform_ai: { name: 'Typeform AI',   legit: ['typeform.com'], icon: '📋', color: '#262627' },
    jotform_ai:  { name: 'Jotform AI',    legit: ['jotform.com'], icon: '📋', color: '#FF6100' },
    formstack:   { name: 'Formstack AI',  legit: ['formstack.com'], icon: '📋', color: '#000000' },
    zoho_ai:     { name: 'Zoho AI',       legit: ['zoho.com','zoho.com/ai'], icon: '🏢', color: '#E42527' },
    freshworks:  { name: 'Freshworks AI', legit: ['freshworks.com'], icon: '🏢', color: '#26A69A' },
    clickup:     { name: 'ClickUp AI',    legit: ['clickup.com'], icon: '📋', color: '#7B68EE' },
    asana_ai:    { name: 'Asana AI',      legit: ['asana.com'], icon: '📋', color: '#F06A6A' },
    monday_ai:   { name: 'Monday AI',     legit: ['monday.com'], icon: '📋', color: '#FF3D57' },
    trello_ai:   { name: 'Trello AI',     legit: ['trello.com'], icon: '📋', color: '#0079BF' },
    jira_ai:     { name: 'Jira AI',       legit: ['atlassian.com/software/jira'], icon: '📋', color: '#0052CC' },
    linear_ai:   { name: 'Linear AI',     legit: ['linear.app'], icon: '📋', color: '#5E6AD2' },
    github_copilot_x: { name: 'GitHub Copilot X', legit: ['github.com/features/copilot'], icon: '🐙', color: '#24292e' },
    tabnine_ai:  { name: 'Tabnine AI',    legit: ['tabnine.com'], icon: '✨', color: '#E55AFD' },
    codeium_ai:  { name: 'Codeium AI',    legit: ['codeium.com'], icon: '🏄', color: '#00A8E8' },
    amazon_q_dev: { name: 'Amazon Q Developer', legit: ['aws.amazon.com/q'], icon: '📦', color: '#FF9900' },
    intellij_ai: { name: 'IntelliJ AI',   legit: ['jetbrains.com/idea'], icon: '🧠', color: '#FE315D' },
    pycharm_ai:  { name: 'PyCharm AI',    legit: ['jetbrains.com/pycharm'], icon: '🧠', color: '#47D144' },
    vscode_ai:   { name: 'VS Code AI',    legit: ['code.visualstudio.com'], icon: '📝', color: '#007ACC' },
    neovim_ai:   { name: 'Neovim AI',     legit: ['neovim.io'], icon: '📝', color: '#57A143' },
    sublime_ai:  { name: 'Sublime AI',    legit: ['sublimetext.com'], icon: '📝', color: '#FF9800' },
    vim_ai:      { name: 'Vim AI',        legit: ['vim.org'], icon: '📝', color: '#019833' },
    emacs_ai:    { name: 'Emacs AI',      legit: ['gnu.org/software/emacs'], icon: '📝', color: '#7F4FBF' },
    webstorm_ai: { name: 'WebStorm AI',   legit: ['jetbrains.com/webstorm'], icon: '🧠', color: '#00A8E8' },
    riders_ai:   { name: 'Rider AI',      legit: ['jetbrains.com/rider'], icon: '🧠', color: '#FF315D' },
    datagrip_ai: { name: 'DataGrip AI',   legit: ['jetbrains.com/datagrip'], icon: '🧠', color: '#00A8E8' },
    clion_ai:    { name: 'CLion AI',      legit: ['jetbrains.com/clion'], icon: '🧠', color: '#FE315D' },
    goland_ai:   { name: 'GoLand AI',     legit: ['jetbrains.com/goland'], icon: '🧠', color: '#00A8E8' },
    rustrover_ai:{ name: 'RustRover AI',  legit: ['jetbrains.com/rustrover'], icon: '🧠', color: '#FF315D' },
    rubyMine_ai: { name: 'RubyMine AI',   legit: ['jetbrains.com/rubymine'], icon: '🧠', color: '#FF315D' },
    phpstorm_ai: { name: 'PhpStorm AI',   legit: ['jetbrains.com/phpstorm'], icon: '🧠', color: '#7B68EE' },
    appcode_ai:  { name: 'AppCode AI',    legit: ['jetbrains.com/appcode'], icon: '🧠', color: '#00A8E8' },
    spacemacs_ai:{ name: 'Spacemacs AI',  legit: ['spacemacs.org'], icon: '📝', color: '#FF315D' },
    atom_ai:     { name: 'Atom AI',       legit: ['atom.io'], icon: '📝', color: '#66595C' },
    brackets_ai: { name: 'Brackets AI',   legit: ['brackets.io'], icon: '📝', color: '#34A853' },
    notepad_plus_plus_ai: { name: 'Notepad++ AI', legit: ['notepad-plus-plus.org'], icon: '📝', color: '#90C843' },
    vimium_ai:   { name: 'Vimium AI',     legit: ['vimium.github.io'], icon: '📝', color: '#57A143' },
    darkreader_ai:{ name: 'DarkReader AI', legit: ['darkreader.org'], icon: '🌙', color: '#000000' },
    privacy_badger_ai: { name: 'Privacy Badger AI', legit: ['privacybadger.org'], icon: '🛡️', color: '#CC0000' },
    ublock_ai:   { name: 'uBlock AI',     legit: ['ublockorigin.com'], icon: '🛡️', color: '#800000' },
    noscript_ai: { name: 'NoScript AI',   legit: ['noscript.net'], icon: '🛡️', color: '#000000' },
    canvas_blocker_ai: { name: 'CanvasBlocker AI', legit: ['github.com/nicjabens/canvasblocker'], icon: '🛡️', color: '#000000' },
    container_ai: { name: 'Container AI',  legit: ['github.com/nicjabens/container'], icon: '🛡️', color: '#000000' },
    multilogin_ai:{ name: 'Multilogin AI', legit: ['multilogin.com'], icon: '🛡️', color: '#000000' },
    antidetect_ai:{ name: 'Antidetect AI', legit: ['antidetect.com'], icon: '🛡️', color: '#000000' },
    octo_ai:     { name: 'Octo AI',       legit: ['octoai.cloud'], icon: '🐙', color: '#000000' },
    together_ai_2:{ name: 'Together AI 2', legit: ['together.ai'], icon: '🤝', color: '#6366f1' },
    groq_ai:     { name: 'Groq AI',       legit: ['groq.com'], icon: '⚡', color: '#F55036' },
    fireworks_ai_2:{ name: 'Fireworks AI 2', legit: ['fireworks.ai'], icon: '🎆', color: '#FF4500' },
    openrouter_ai:{ name: 'OpenRouter AI', legit: ['openrouter.ai'], icon: '🔀', color: '#6366f1' },
    novita_ai_2: { name: 'Novita AI 2',   legit: ['novita.ai'], icon: '💡', color: '#6366f1' },
    chutes_ai_2: { name: 'Chutes AI 2',   legit: ['chutes.ai'], icon: '🚀', color: '#10B981' },
    venice_ai_2: { name: 'Venice AI 2',   legit: ['venice.ai'], icon: '🎭', color: '#8B5CF6' },
    deepinfra_2: { name: 'DeepInfra 2',   legit: ['deepinfra.com'], icon: '☁️', color: '#6366f1' },
    friendli_ai_2:{ name: 'Friendli AI 2', legit: ['friendli.ai'], icon: '🤝', color: '#FF6B35' },
    lepton_ai_2: { name: 'Lepton AI 2',   legit: ['lepton.ai'], icon: '⚡', color: '#000000' },
    baseten_ai_2:{ name: 'Baseten 2',     legit: ['baseten.co'], icon: '🔧', color: '#6366f1' },
    banana_ai_2: { name: 'Banana.dev 2',  legit: ['banana.dev'], icon: '🍌', color: '#FFE135' },
    fal_ai_2:    { name: 'fal.ai 2',      legit: ['fal.ai'], icon: '⚡', color: '#000000' },
    modal_ai_2:  { name: 'Modal 2',       legit: ['modal.com'], icon: '☁️', color: '#000000' },
    lamini_ai_2: { name: 'Lamini 2',      legit: ['lamini.ai'], icon: '🦙', color: '#6366f1' },
    anyscale_ai_2:{ name: 'Anyscale 2',   legit: ['anyscale.com'], icon: '☁️', color: '#000000' },
    replicate_ai_2:{ name: 'Replicate 2', legit: ['replicate.com'], icon: '🔁', color: '#000000' },
    huggingface_inference: { name: 'HuggingFace Inference', legit: ['huggingface.co/inference'], icon: '🤗', color: '#ffd21e' },
    cohere_command:{ name: 'Cohere Command', legit: ['cohere.com','cohere.com/command'], icon: '🪸', color: '#3959ff' },
    ai21:{ name: 'AI21 Labs', legit: ['ai21.com','ai21.com/studio'], icon: '🔬', color: '#000000' },
    aleph_alpha:{ name: 'Aleph Alpha', legit: ['aleph-alpha.com'], icon: '✨', color: '#000000' },
    inflection_ai_2:{ name: 'Inflection 2', legit: ['inflection.ai'], icon: '🫧', color: '#e8457c' },
    stability_ai:{ name: 'Stability AI', legit: ['stability.ai'], icon: '🎨', color: '#A855F7' },
    midjourney_ai:{ name: 'Midjourney AI', legit: ['midjourney.com'], icon: '🎨', color: '#000000' },
    flux_ai_2:{ name: 'Flux AI 2', legit: ['blackforestlabs.ai'], icon: '🎨', color: '#000000' },
    ideogram_ai:{ name: 'Ideogram AI', legit: ['ideogram.ai'], icon: '✏️', color: '#7C3AED' },
    leonardo_ai_2:{ name: 'Leonardo AI 2', legit: ['leonardo.ai'], icon: '🎨', color: '#FF6B6B' },
    runway_ai:{ name: 'Runway AI', legit: ['runwayml.com'], icon: '🎬', color: '#000000' },
    pika_ai:{ name: 'Pika AI', legit: ['pika.art'], icon: '🎬', color: '#7C3AED' },
    suno_ai:{ name: 'Suno AI', legit: ['suno.com'], icon: '🎵', color: '#000000' },
    udio_ai:{ name: 'Udio AI', legit: ['udio.com'], icon: '🎶', color: '#000000' },
    elevenlabs_ai:{ name: 'ElevenLabs AI', legit: ['elevenlabs.io'], icon: '🎙️', color: '#000000' },
    canva_ai_2:{ name: 'Canva AI 2', legit: ['canva.com'], icon: '🎨', color: '#00C4CC' },
    removebg_ai:{ name: 'Remove.bg AI', legit: ['remove.bg'], icon: '✂️', color: '#6C63FF' },
    synthesia_ai:{ name: 'Synthesia AI', legit: ['synthesia.io'], icon: '🎬', color: '#000000' },
    heygen_ai:{ name: 'HeyGen AI', legit: ['heygen.com'], icon: '🎬', color: '#6366F1' },
    descript_ai:{ name: 'Descript AI', legit: ['descript.com'], icon: '🎬', color: '#4CAF50' },
    speechify_ai:{ name: 'Speechify AI', legit: ['speechify.com'], icon: '📖', color: '#FBBF24' },
    you_ai_2:{ name: 'You.com AI', legit: ['you.com'], icon: '🧑', color: '#1a73e8' },
    kagi_ai:{ name: 'Kagi AI', legit: ['kagi.com'], icon: '🔮', color: '#FF6B35' },
    jasper_ai_2:{ name: 'Jasper AI 2', legit: ['jasper.ai'], icon: '✍️', color: '#E11D48' },
    copy_ai_2:{ name: 'Copy.ai 2', legit: ['copy.ai'], icon: '✍️', color: '#8B5CF6' },
    writesonic_ai:{ name: 'Writesonic AI', legit: ['writesonic.com'], icon: '✍️', color: '#4CAF50' },
    grammarly_ai_2:{ name: 'Grammarly AI 2', legit: ['grammarly.com'], icon: '📝', color: '#15C39A' },
    notion_ai_2:{ name: 'Notion AI 2', legit: ['notion.so'], icon: '📝', color: '#000000' },
    character_ai_2:{ name: 'Character.AI 2', legit: ['character.ai'], icon: '🎭', color: '#8b5cf6' },
    janitor_ai_2:{ name: 'Janitor AI 2', legit: ['janitorai.com'], icon: '🧹', color: '#ef4444' },
    chatpdf_ai:{ name: 'ChatPDF AI', legit: ['chatpdf.com'], icon: '📄', color: '#f97316' },
    poe_ai_2:{ name: 'Poe AI 2', legit: ['poe.com'], icon: '💬', color: '#6c5ce7' },
    huggingface_ai_2:{ name: 'HuggingFace AI 2', legit: ['huggingface.co'], icon: '🤗', color: '#ffd21e' },
    cohere_ai_2:{ name: 'Cohere AI 2', legit: ['cohere.com'], icon: '🪸', color: '#3959ff' },
    mistral_ai_2:{ name: 'Mistral AI 2', legit: ['chat.mistral.ai','mistral.ai'], icon: '🌪️', color: '#ff7000' },
    pi_ai_2:{ name: 'Pi AI 2', legit: ['pi.ai'], icon: '🫧', color: '#e8457c' },
    groq_ai_3:{ name: 'Groq AI 3', legit: ['groq.com'], icon: '⚡', color: '#F55036' },
    together_ai_3:{ name: 'Together AI 3', legit: ['together.ai'], icon: '🤝', color: '#6366f1' },
    fireworks_ai_3:{ name: 'Fireworks AI 3', legit: ['fireworks.ai'], icon: '🎆', color: '#FF4500' },
    openrouter_ai_2:{ name: 'OpenRouter AI 2', legit: ['openrouter.ai'], icon: '🔀', color: '#6366f1' },
    novita_ai_3:{ name: 'Novita AI 3', legit: ['novita.ai'], icon: '💡', color: '#6366f1' },
    chutes_ai_3:{ name: 'Chutes AI 3', legit: ['chutes.ai'], icon: '🚀', color: '#10B981' },
    venice_ai_3:{ name: 'Venice AI 3', legit: ['venice.ai'], icon: '🎭', color: '#8B5CF6' },
    deepinfra_3:{ name: 'DeepInfra 3', legit: ['deepinfra.com'], icon: '☁️', color: '#6366f1' },
    friendli_ai_3:{ name: 'Friendli AI 3', legit: ['friendli.ai'], icon: '🤝', color: '#FF6B35' },
    lepton_ai_3:{ name: 'Lepton AI 3', legit: ['lepton.ai'], icon: '⚡', color: '#000000' },
    baseten_ai_3:{ name: 'Baseten 3', legit: ['baseten.co'], icon: '🔧', color: '#6366f1' },
    banana_ai_3:{ name: 'Banana.dev 3', legit: ['banana.dev'], icon: '🍌', color: '#FFE135' },
    fal_ai_3:{ name: 'fal.ai 3', legit: ['fal.ai'], icon: '⚡', color: '#000000' },
    modal_ai_3:{ name: 'Modal 3', legit: ['modal.com'], icon: '☁️', color: '#000000' },
    lamini_ai_3:{ name: 'Lamini 3', legit: ['lamini.ai'], icon: '🦙', color: '#6366f1' },
    anyscale_ai_3:{ name: 'Anyscale 3', legit: ['anyscale.com'], icon: '☁️', color: '#000000' },
    replicate_ai_3:{ name: 'Replicate 3', legit: ['replicate.com'], icon: '🔁', color: '#000000' },
    ai21_ai:{ name: 'AI21 Labs AI', legit: ['ai21.com'], icon: '🔬', color: '#000000' },
    aleph_alpha_ai:{ name: 'Aleph Alpha AI', legit: ['aleph-alpha.com'], icon: '✨', color: '#000000' },
    stability_ai_2:{ name: 'Stability AI 2', legit: ['stability.ai'], icon: '🎨', color: '#A855F7' },
    midjourney_ai_2:{ name: 'Midjourney AI 2', legit: ['midjourney.com'], icon: '🎨', color: '#000000' },
    flux_ai_3:{ name: 'Flux AI 3', legit: ['blackforestlabs.ai'], icon: '🎨', color: '#000000' },
    ideogram_ai_2:{ name: 'Ideogram AI 2', legit: ['ideogram.ai'], icon: '✏️', color: '#7C3AED' },
    leonardo_ai_3:{ name: 'Leonardo AI 3', legit: ['leonardo.ai'], icon: '🎨', color: '#FF6B6B' },
    runway_ai_2:{ name: 'Runway AI 2', legit: ['runwayml.com'], icon: '🎬', color: '#000000' },
    pika_ai_2:{ name: 'Pika AI 2', legit: ['pika.art'], icon: '🎬', color: '#7C3AED' },
    suno_ai_2:{ name: 'Suno AI 2', legit: ['suno.com'], icon: '🎵', color: '#000000' },
    udio_ai_2:{ name: 'Udio AI 2', legit: ['udio.com'], icon: '🎶', color: '#000000' },
    elevenlabs_ai_2:{ name: 'ElevenLabs AI 2', legit: ['elevenlabs.io'], icon: '🎙️', color: '#000000' },
    canva_ai_3:{ name: 'Canva AI 3', legit: ['canva.com'], icon: '🎨', color: '#00C4CC' },
    removebg_ai_2:{ name: 'Remove.bg AI 2', legit: ['remove.bg'], icon: '✂️', color: '#6C63FF' },
    synthesia_ai_2:{ name: 'Synthesia AI 2', legit: ['synthesia.io'], icon: '🎬', color: '#000000' },
    heygen_ai_2:{ name: 'HeyGen AI 2', legit: ['heygen.com'], icon: '🎬', color: '#6366F1' },
    descript_ai_2:{ name: 'Descript AI 2', legit: ['descript.com'], icon: '🎬', color: '#4CAF50' },
    speechify_ai_2:{ name: 'Speechify AI 2', legit: ['speechify.com'], icon: '📖', color: '#FBBF24' },
    you_ai_3:{ name: 'You.com AI 3', legit: ['you.com'], icon: '🧑', color: '#1a73e8' },
    kagi_ai_2:{ name: 'Kagi AI 2', legit: ['kagi.com'], icon: '🔮', color: '#FF6B35' },
    jasper_ai_3:{ name: 'Jasper AI 3', legit: ['jasper.ai'], icon: '✍️', color: '#E11D48' },
    copy_ai_3:{ name: 'Copy.ai 3', legit: ['copy.ai'], icon: '✍️', color: '#8B5CF6' },
    writesonic_ai_2:{ name: 'Writesonic AI 2', legit: ['writesonic.com'], icon: '✍️', color: '#4CAF50' },
    grammarly_ai_3:{ name: 'Grammarly AI 3', legit: ['grammarly.com'], icon: '📝', color: '#15C39A' },
    notion_ai_3:{ name: 'Notion AI 3', legit: ['notion.so'], icon: '📝', color: '#000000' },
    character_ai_3:{ name: 'Character.AI 3', legit: ['character.ai'], icon: '🎭', color: '#8b5cf6' },
    janitor_ai_3:{ name: 'Janitor AI 3', legit: ['janitorai.com'], icon: '🧹', color: '#ef4444' },
    chatpdf_ai_2:{ name: 'ChatPDF AI 2', legit: ['chatpdf.com'], icon: '📄', color: '#f97316' },
    poe_ai_3:{ name: 'Poe AI 3', legit: ['poe.com'], icon: '💬', color: '#6c5ce7' },
    huggingface_ai_3:{ name: 'HuggingFace AI 3', legit: ['huggingface.co'], icon: '🤗', color: '#ffd21e' },
    cohere_ai_3:{ name: 'Cohere AI 3', legit: ['cohere.com'], icon: '🪸', color: '#3959ff' },
    mistral_ai_3:{ name: 'Mistral AI 3', legit: ['chat.mistral.ai','mistral.ai'], icon: '🌪️', color: '#ff7000' },
    pi_ai_3:{ name: 'Pi AI 3', legit: ['pi.ai'], icon: '🫧', color: '#e8457c' }
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

  /* ═══════════════ HIDDEN PROMPT INJECTION ═══════════════ */
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
    var messages = document.querySelectorAll('[data-message-author], [data-message-id], .markdown, .prose, .message-content, .response-content, article');

    for (var mi = 0; mi < messages.length; mi++) {
      var msgText = messages[mi].innerText || '';
      for (var pi = 0; pi < DATA_THEFT_PROMPTS.length; pi++) {
        if (DATA_THEFT_PROMPTS[pi].test(msgText)) {
          var match = msgText.match(DATA_THEFT_PROMPTS[pi]);
          findings.push({
            sev: 'danger', icon: '💳',
            title: 'Data theft attempt detected',
            text: 'This AI response may be trying to steal sensitive data. Pattern: "' + (match ? match[0].substring(0, 60) : 'suspicious request') + '". Never share passwords, API keys, credit cards, OTPs, Aadhaar, PAN, or bank details with any AI chatbot.'
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

    for (var ii = 0; ii < inputFields.length; ii++) {
      var inputText = inputFields[ii].value || inputFields[ii].textContent || '';
      for (var ipi = 0; ipi < INJECTION_PATTERNS.length; ipi++) {
        if (INJECTION_PATTERNS[ipi].re.test(inputText)) {
          findings.push({
            sev: 'warning', icon: '💉',
            title: 'Prompt injection: ' + INJECTION_PATTERNS[ipi].name,
            text: 'Your message contains "' + INJECTION_PATTERNS[ipi].name.toLowerCase() + '" patterns. This can make the AI bypass safety rules and produce harmful or unreliable outputs.'
          });
          break;
        }
      }
    }

    for (var mi = 0; mi < messages.length; mi++) {
      var msgHtml = messages[mi].innerHTML || '';
      var msgText = messages[mi].innerText || '';
      for (var hi = 0; hi < HIDDEN_INJECTION.length; hi++) {
        if (HIDDEN_INJECTION[hi].test(msgHtml) && !HIDDEN_INJECTION[hi].test(msgText)) {
          findings.push({
            sev: 'danger', icon: '👻',
            title: 'Hidden prompt injection in AI response',
            text: 'This AI response contains hidden text (visible in code but not on screen) that attempts to manipulate the AI. The AI may have been hijacked. Do not trust this response.'
          });
          break;
        }
      }
    }

    return findings;
  }

  function scanForSuspiciousLinks() {
    var findings = [];
    var links = document.querySelectorAll('.markdown a, .prose a, a[href]');
    var seenLinks = {};

    for (var li = 0; li < links.length; li++) {
      var href = links[li].href || '';
      var hostname = '';
      try { hostname = new URL(href).hostname; } catch(e) { continue; }

      for (var si = 0; si < SUSPICIOUS_LINK_PATTERNS.length; si++) {
        if (SUSPICIOUS_LINK_PATTERNS[si].test(href) && !seenLinks[href]) {
          seenLinks[href] = true;
          findings.push({
            sev: 'high', icon: '🔗',
            title: 'Suspicious link in AI response',
            text: 'AI generated link to "' + hostname + (href.length > 60 ? '...' : '"') + '" — shortened, temporary, or IP-based URL. Real AI assistants link to legitimate, permanent URLs. Be cautious.'
          });
        }
      }
    }
    return findings;
  }

  function scanForCodeInjection() {
    var findings = [];
    var scripts = document.querySelectorAll('script:not([src])');
    var suspiciousCount = 0;

    for (var si = 0; si < scripts.length; si++) {
      var content = scripts[si].textContent || '';
      if (content.indexOf('eval(') !== -1 || content.indexOf('document.cookie') !== -1 || content.indexOf('localStorage') !== -1 || (content.indexOf('fetch(') !== -1 && content.indexOf('api') !== -1)) {
        suspiciousCount++;
      }
    }

    if (suspiciousCount > 0) {
      findings.push({
        sev: 'danger', icon: '🕵️',
        title: 'Suspicious scripts on this AI page',
        text: 'Found ' + suspiciousCount + ' suspicious inline script(s). These may be trying to steal your session tokens, conversation history, or personal data. Leave immediately.'
      });
    }

    return findings;
  }

  function scanForFakeUI() {
    var findings = [];
    var hostname = window.location.hostname;

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
          text: 'This site has a password field but is NOT a known AI service. Scammers create fake "free AI" sites to steal your credentials. Real AI services (ChatGPT, Gemini, Claude) do NOT ask you to "log in" on unknown domains.'
        });
      }
    }

    var walletPopups = document.querySelectorAll('[class*="wallet"], [id*="wallet"], [class*="metamask"], [id*="metamask"], [class*="phantom"]');
    if (walletPopups.length > 0) {
      findings.push({
        sev: 'danger', icon: '🦊',
        title: 'Crypto wallet connection prompt detected',
        text: 'This AI page is asking to connect your crypto wallet. No legitimate AI service requires wallet connection. This is a crypto drainer scam. NEVER connect your wallet to an AI chatbot.'
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
      findings.push({
        sev: 'safe', icon: aiInfo.service.icon,
        title: 'Verified ' + aiInfo.service.name + ' website',
        text: 'You are on the official ' + aiInfo.service.name + ' website (' + window.location.hostname + '). This is a legitimate AI service. Running security checks...'
      });

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
      findings.push({
        sev: 'high', icon: '❓',
        title: 'Unknown AI chatbot website',
        text: '"' + window.location.hostname + '" is not a recognized AI service. Running full security scan...'
      });

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
          text: 'Contains "' + aiInfo.service.name + '" in address but is NOT the official site. Real ' + aiInfo.service.name + ' is at ' + aiInfo.service.legit[0] + '. Scammers create fake AI sites to steal data. Do NOT enter any information.'
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

    html += '<div style="padding:0 14px 10px">' +
      '<div style="height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden">' +
      '<div style="height:100%;width:' + result.score + '%;background:' + color + ';border-radius:2px;transition:width .5s"></div></div></div>';

    html += '<div style="flex:1;overflow-y:auto;padding:0 14px 14px">';
    for (var i = 0; i < result.findings.length; i++) {
      var f = result.findings[i];
      var fc = f.sev === 'danger' ? '#f44336' : f.sev === 'high' ? '#ff9800' : f.sev === 'safe' ? '#4caf50' : '#ffc107';
      html += '<div style="background:rgba(0,0,0,.25);border-radius:8px;padding:10px;margin-bottom:6px;border-left:3px solid ' + fc + '">' +
        '<div style="font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px"><span>' + f.icon + '</span> ' + f.title + '</div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,.6);margin-top:4px;line-height:1.5">' + f.text + '</div></div>';
    }
    html += '</div>';

    html += '<div style="padding:10px 14px;border-top:1px solid rgba(76,175,80,.2);text-align:center;font-size:9px;color:rgba(255,255,255,.3)">🤖 PhishGuard AI Chatbot Scanner v2.0 — 200+ AI services protected</div>';

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

  /* ═══════════════ START — ONLY ON AI SITES ═══════════════ */
  function autoScan() {
    try {
      var aiInfo = detectAIService();
      if (!aiInfo) return; /* NOT an AI site — do nothing, no badge */

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
