/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI } from '@google/genai';
import config from '../../config';

// ============================================
// 📦 CONFIGURATION SECTION - UPDATE YOUR DATA HERE
// ============================================

// 1️⃣ CLIENT SIDE NAVIGATION PAGES
// Format: { name: "Page Name", path: "/url-path" }
// Add all your website pages here
const CLIENT_SIDE_PAGES = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Products", path: "/products" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
  { name: "FAQ", path: "/faq" },
  { name: "Pricing", path: "/pricing" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Team", path: "/team" },
  { name: "Careers", path: "/careers" },
  { name: "Support", path: "/support" },
  { name: "Login", path: "/login" },
  { name: "Register", path: "/register" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Settings", path: "/settings" },
  { name: "Profile", path: "/profile" },
  { name: "Terms", path: "/terms" },
  { name: "Privacy", path: "/privacy" },
];

// 2️⃣ KNOWLEDGE BASE INFORMATION (3000-5000 words paragraph)
// Add ALL your business/project information here as plain text
// The AI will use this to answer questions
const KNOWLEDGE_BASE_INFO = `
[WRITE YOUR COMPLETE INFORMATION HERE - 3000 to 5000 words]

Example structure (replace with your content):

COMPANY/PROJECT NAME: [Your Name Here]
Established: [Year]
Mission: [Your mission statement]
Vision: [Your vision]

ABOUT US:
[Write detailed description about your company/project. Include history, values, achievements, team information, etc. - 500-1000 words]

SERVICES/PRODUCTS:
[List all services or products with detailed descriptions]
Service 1: [Description, features, benefits, pricing]
Service 2: [Description, features, benefits, pricing]
[Add all services/products - 500-1000 words]

HOW IT WORKS:
[Step by step process of how your service/product works]
Step 1: [Description]
Step 2: [Description]
[Add all steps - 300-500 words]

FEATURES & BENEFITS:
[List all key features and their benefits]
Feature 1: [Benefit to customer]
Feature 2: [Benefit to customer]
[Add all features - 300-500 words]

PRICING & PLANS:
[Describe all pricing plans, packages, offers]
Plan 1: [Price, features, duration]
Plan 2: [Price, features, duration]
[Add all pricing details - 200-300 words]

FAQ:
Question 1: [Answer]
Question 2: [Answer]
[Add 10-20 common questions and answers - 500-1000 words]

POLICIES:
Return Policy: [Details]
Shipping Policy: [Details]
Privacy Policy: [Key points]
Terms of Service: [Key points]
[Add all policies - 300-500 words]

ACHIEVEMENTS:
[Achievement 1: Description]
[Achievement 2: Description]
[Add achievements - 200-300 words]

TESTIMONIALS:
[Customer 1: "Testimonial text"]
[Customer 2: "Testimonial text"]
[Add testimonials - 200-300 words]

SUPPORT INFORMATION:
Support Hours: [Days and times]
Response Time: [Within X hours/days]
Supported Languages: [Languages available]
[Add support details - 100-200 words]

TROUBLESHOOTING:
Common Issue 1: [Solution]
Common Issue 2: [Solution]
[Add troubleshooting - 200-300 words]

INTEGRATIONS:
[Integration 1: Description]
[Integration 2: Description]
[Add integrations - 100-200 words]

UPDATES & ROADMAP:
Recent Updates: [List latest updates]
Future Plans: [Upcoming features]
[Add roadmap - 100-200 words]

[Continue adding any other relevant information up to 5000 words]
`;

// 3️⃣ CONTACT METHODS
// Add all your contact information here
const CONTACT_METHODS = {
  email: "support@yourcompany.com",
  phone: "+1234567890",
  whatsapp: "+1234567890",
  website: "https://www.yourwebsite.com",
  facebook: "https://facebook.com/yourpage",
  instagram: "https://instagram.com/yourpage",
  twitter: "https://twitter.com/yourpage",
  linkedin: "https://linkedin.com/company/yourpage",
  youtube: "https://youtube.com/yourchannel",
  address: "Your full address here",
  supportHours: "Monday-Friday, 9 AM - 6 PM",
};

// 4️⃣ AI RESPONSE CONFIGURATION
const RESPONSE_CONFIG = {
  maxWords: 40,           // Maximum words in response
  minWords: 10,           // Minimum words in response
  responseStyle: "conversational", // conversational, professional, friendly
  includeLinks: true,     // Include page links in responses
  includeContact: true,   // Include contact info when relevant
};

// ============================================
// 🤖 CORE AI CHATBOT ENGINE
// ============================================

const GEMINI_API_KEY = config.gemini_api_key || process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

interface ChatResponse {
  success: boolean;
  response: string;
  foundResults: boolean;
  suggestedPages: { name: string; path: string; }[];
  contactInfo?: any;
  responseTime?: number;
}

interface PageMatch {
  page: { name: string; path: string; };
  relevanceScore: number;
}

// Detect user language
const detectLanguage = (text: string): string => {
  const banglaRegex = /[\u0980-\u09FF]/;
  const arabicRegex = /[\u0600-\u06FF]/;
  const hindiRegex = /[\u0900-\u097F]/;
  const urduRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  
  if (banglaRegex.test(text)) return 'bangla';
  if (arabicRegex.test(text)) return 'arabic';
  if (hindiRegex.test(text)) return 'hindi';
  if (urduRegex.test(text)) return 'urdu';
  return 'english';
};

// Find relevant pages based on user query
const findRelevantPages = (query: string): PageMatch[] => {
  const queryLower = query.toLowerCase();
  const matches: PageMatch[] = [];
  
  for (const page of CLIENT_SIDE_PAGES) {
    let relevanceScore = 0;
    const pageNameLower = page.name.toLowerCase();
    const pagePathLower = page.path.toLowerCase();
    
    // Check if query contains page name
    if (queryLower.includes(pageNameLower)) {
      relevanceScore += 0.8;
    }
    
    // Check individual words
    const queryWords = queryLower.split(' ');
    for (const word of queryWords) {
      if (pageNameLower.includes(word) && word.length > 2) {
        relevanceScore += 0.3;
      }
      if (pagePathLower.includes(word) && word.length > 2) {
        relevanceScore += 0.2;
      }
    }
    
    // Check for synonyms/common variations
    const synonyms: { [key: string]: string[] } = {
      'contact': ['reach', 'call', 'email', 'phone', 'support'],
      'about': ['company', 'us', 'team', 'story'],
      'service': ['offer', 'provide', 'solution', 'feature'],
      'product': ['item', 'goods', 'merchandise'],
      'pricing': ['cost', 'price', 'plan', 'package', 'fee'],
      'faq': ['question', 'answer', 'help'],
      'login': ['signin', 'sign in', 'log in'],
      'register': ['signup', 'sign up', 'create account'],
    };
    
    for (const [key, syns] of Object.entries(synonyms)) {
      if (pageNameLower.includes(key)) {
        for (const syn of syns) {
          if (queryLower.includes(syn)) {
            relevanceScore += 0.5;
            break;
          }
        }
      }
    }
    
    if (relevanceScore > 0) {
      matches.push({ page, relevanceScore });
    }
  }
  
  return matches
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3);
};

// Format contact information as text
const formatContactInfo = (): string => {
  const availableMethods = [];
  
  if (CONTACT_METHODS.email) availableMethods.push(`📧 Email: ${CONTACT_METHODS.email}`);
  if (CONTACT_METHODS.phone) availableMethods.push(`📞 Phone: ${CONTACT_METHODS.phone}`);
  if (CONTACT_METHODS.whatsapp) availableMethods.push(`💬 WhatsApp: ${CONTACT_METHODS.whatsapp}`);
  if (CONTACT_METHODS.facebook) availableMethods.push(`📘 Facebook: ${CONTACT_METHODS.facebook}`);
  if (CONTACT_METHODS.instagram) availableMethods.push(`📷 Instagram: ${CONTACT_METHODS.instagram}`);
  if (CONTACT_METHODS.twitter) availableMethods.push(`🐦 Twitter: ${CONTACT_METHODS.twitter}`);
  if (CONTACT_METHODS.linkedin) availableMethods.push(`🔗 LinkedIn: ${CONTACT_METHODS.linkedin}`);
  if (CONTACT_METHODS.youtube) availableMethods.push(`🎥 YouTube: ${CONTACT_METHODS.youtube}`);
  if (CONTACT_METHODS.website) availableMethods.push(`🌐 Website: ${CONTACT_METHODS.website}`);
  if (CONTACT_METHODS.address) availableMethods.push(`📍 Address: ${CONTACT_METHODS.address}`);
  if (CONTACT_METHODS.supportHours) availableMethods.push(`⏰ Support Hours: ${CONTACT_METHODS.supportHours}`);
  
  return availableMethods.join('\n');
};

// Generate AI response (10-40 words, conversational)
const generateAIResponse = async (
  prompt: string, 
  language: string, 
  relevantPages: PageMatch[]
): Promise<{ response: string; suggestedPages: { name: string; path: string; }[] }> => {
  
  const suggestedPages = relevantPages.map(match => match.page);
  
  // Prepare contact info for AI
  const contactInfoText = RESPONSE_CONFIG.includeContact ? formatContactInfo() : '';
  
  // Prepare page suggestions text
  const pagesText = relevantPages.map(p => 
    `- ${p.page.name}: ${p.page.path}`
  ).join('\n');
  
  const systemPrompt = `
You are a helpful AI assistant for a business/website. Follow these rules STRICTLY:

CRITICAL RULES:
1. RESPONSE LENGTH: MUST be between ${RESPONSE_CONFIG.minWords} to ${RESPONSE_CONFIG.maxWords} words ONLY
2. RESPONSE STYLE: ${RESPONSE_CONFIG.responseStyle} and conversational
3. LANGUAGE: Respond in ${language.toUpperCase()}
4. BE HELPFUL: Always provide useful information from the knowledge base
5. BE HONEST: If you don't know something, say "I'll help you connect with our team"
6. INCLUDE CONTACT: When user asks for contact, provide relevant info
7. SUGGEST PAGES: Naturally mention relevant pages when helpful

KNOWLEDGE BASE (Use this to answer questions):
${KNOWLEDGE_BASE_INFO}

RELEVANT PAGES FOR THIS QUERY:
${pagesText}

CONTACT INFORMATION:
${contactInfoText}

USER QUESTION: ${prompt}

INSTRUCTIONS FOR RESPONSE:
- Keep it short and sweet (${RESPONSE_CONFIG.minWords}-${RESPONSE_CONFIG.maxWords} words)
- Sound natural and conversational
- ${RESPONSE_CONFIG.includeLinks ? 'Mention relevant pages like this: "Check our [Page Name]"' : 'Don\'t mention specific pages'}
- ${RESPONSE_CONFIG.includeContact ? 'Include contact info only if user asks for it' : 'Don\'t share contact info'}
- Answer directly without long explanations

YOUR RESPONSE (${RESPONSE_CONFIG.minWords}-${RESPONSE_CONFIG.maxWords} words in ${language}):
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });
    
    let finalResponse = response.text || generateFallbackResponse(language, prompt);
    
    // Clean up response - ensure it's conversational and proper length
    finalResponse = finalResponse.trim();
    
    // Add page links if enabled
    if (RESPONSE_CONFIG.includeLinks && relevantPages.length > 0) {
      const topPage = relevantPages[0].page;
      if (!finalResponse.includes(topPage.name.toLowerCase())) {
        finalResponse += ` Check our ${topPage.name} page for more details.`;
      }
    }
    
    return {
      response: finalResponse,
      suggestedPages: suggestedPages.slice(0, 2)
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      response: generateFallbackResponse(language, prompt),
      suggestedPages: suggestedPages.slice(0, 2)
    };
  }
};

// Fallback response when AI fails
const generateFallbackResponse = (language: string, prompt: string): string => {
  const responses: { [key: string]: string } = {
    english: `Thanks for your question! I'd love to help. Could you please contact us at ${CONTACT_METHODS.email || CONTACT_METHODS.phone || 'our support team'} for detailed assistance?`,
    bangla: `আপনার প্রশ্নের জন্য ধন্যবাদ! আমি সাহায্য করতে চাই। বিস্তারিত জানতে আমাদের ${CONTACT_METHODS.email || CONTACT_METHODS.phone || 'সাপোর্ট টিম'} এ যোগাযোগ করুন।`,
    arabic: `شكراً لسؤالك! يسعدني مساعدتك. يرجى الاتصال بنا على ${CONTACT_METHODS.email || CONTACT_METHODS.phone || 'فريق الدعم'} للحصول على مساعدة مفصلة.`,
    hindi: `आपके प्रश्न के लिए धन्यवाद! मैं मदद करना चाहूंगा। विस्तृत सहायता के लिए कृपया हमसे ${CONTACT_METHODS.email || CONTACT_METHODS.phone || 'सपोर्ट टीम'} पर संपर्क करें।`,
    urdu: `آپ کے سوال کا شکریہ! میں مدد کرنا چاہوں گا۔ تفصیلی مدد کے لیے براہ کرم ہم سے ${CONTACT_METHODS.email || CONTACT_METHODS.phone || 'سپورٹ ٹیم'} پر رابطہ کریں۔`
  };
  
  return responses[language] || responses.english;
};

// ============================================
// 🚀 MAIN CHATBOT FUNCTION
// ============================================

export const ChatBotFunction = async (prompt: string): Promise<ChatResponse> => {
  const startTime = Date.now();
  
  try {
    if (!prompt || prompt.trim().length === 0) {
      return {
        success: false,
        response: RESPONSE_CONFIG.includeContact ? 
          `Please ask me something! Need help? Contact us at ${CONTACT_METHODS.email || CONTACT_METHODS.phone}` :
          "Please ask me something! I'm here to help.",
        foundResults: false,
        suggestedPages: [],
        responseTime: 0
      };
    }
    
    const language = detectLanguage(prompt);
    const relevantPages = findRelevantPages(prompt);
    const { response, suggestedPages } = await generateAIResponse(prompt, language, relevantPages);
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      response: response,
      foundResults: true,
      suggestedPages: suggestedPages,
      contactInfo: RESPONSE_CONFIG.includeContact ? CONTACT_METHODS : undefined,
      responseTime: responseTime
    };
    
  } catch (error) {
    console.error('Error in ChatBotFunction:', error);
    const responseTime = Date.now() - startTime;
    const language = detectLanguage(prompt);
    
    const errorResponses: { [key: string]: string } = {
      english: `Sorry, I'm having trouble right now. Please reach out to ${CONTACT_METHODS.email || CONTACT_METHODS.phone || 'our support team'} for immediate help.`,
      bangla: `দুঃখিত, আমার এখন সমস্যা হচ্ছে। দয়া করে ${CONTACT_METHODS.email || CONTACT_METHODS.phone || 'আমাদের সাপোর্ট টিম'} এ যোগাযোগ করুন।`,
      arabic: `عذراً، أواجه مشكلة الآن. يرجى التواصل مع ${CONTACT_METHODS.email || CONTACT_METHODS.phone || 'فريق الدعم'} للحصول على مساعدة فورية.`,
    };
    
    return {
      success: false,
      response: errorResponses[language] || errorResponses.english,
      foundResults: false,
      suggestedPages: [],
      responseTime: responseTime
    };
  }
};

// ============================================
// 📚 HELPER FUNCTIONS
// ============================================

// Quick response without full object
export const quickReply = async (prompt: string): Promise<string> => {
  const result = await ChatBotFunction(prompt);
  return result.response;
};

// Get page suggestions for a query
export const getPageSuggestions = (query: string): { name: string; path: string; }[] => {
  return findRelevantPages(query).map(match => match.page);
};

// Update knowledge base dynamically
export const updateKnowledgeBase = (newInfo: string): void => {
  // This is a placeholder - in real implementation, you'd update your database
  console.log("Knowledge base update requested:", newInfo.substring(0, 100));
  // (KNOWLEDGE_BASE_INFO as any) = newInfo; // Only works if using let instead of const
};

// Get current configuration
export const getConfig = () => ({
  pages: CLIENT_SIDE_PAGES,
  contact: CONTACT_METHODS,
  responseConfig: RESPONSE_CONFIG,
});

export default ChatBotFunction;