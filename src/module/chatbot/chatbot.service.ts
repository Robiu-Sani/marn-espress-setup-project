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
const KNOWLEDGE_BASE_INFO = `
[WRITE YOUR COMPLETE INFORMATION HERE - 3000 to 5000 words]

Example structure (replace with your content):

COMPANY/PROJECT NAME: Your Company Name
Established: 2024
Mission: To provide exceptional service and value to our customers
Vision: To become a leader in our industry through innovation and excellence

ABOUT US:
We are a leading provider of innovative solutions dedicated to helping businesses grow and succeed. 
Founded in 2024, our company has quickly established itself as a trusted partner for organizations 
of all sizes. Our team consists of experienced professionals who are passionate about delivering 
exceptional results. We believe in building long-term relationships with our clients based on 
trust, transparency, and mutual success.

Our values include integrity, innovation, customer focus, and continuous improvement. 
We strive to exceed expectations in everything we do, from initial consultation to ongoing support.

SERVICES/PRODUCTS:
Service 1 - Web Development: Custom website development using modern technologies. 
Features responsive design, SEO optimization, and fast loading times. 
Benefits include increased online presence and better customer engagement.

Service 2 - Mobile Apps: Native and cross-platform mobile application development. 
Available for iOS and Android platforms. Benefits include reaching customers on mobile devices.

Service 3 - Digital Marketing: Comprehensive marketing strategies including SEO, social media, 
and email marketing. Benefits include increased brand awareness and lead generation.

HOW IT WORKS:
Step 1: Initial Consultation - We discuss your needs and goals
Step 2: Planning & Strategy - We create a customized plan
Step 3: Development & Implementation - We build your solution
Step 4: Testing & Quality Assurance - We ensure everything works perfectly
Step 5: Launch & Deployment - We go live with your project
Step 6: Ongoing Support - We provide continuous maintenance and updates

FEATURES & BENEFITS:
Feature 1: 24/7 Customer Support - Get help whenever you need it
Feature 2: Money-back Guarantee - Risk-free satisfaction guarantee
Feature 3: Fast Turnaround - Quick delivery without compromising quality
Feature 4: Competitive Pricing - Affordable solutions for every budget

PRICING & PLANS:
Basic Plan: $99/month - Includes essential features and email support
Professional Plan: $299/month - Includes advanced features and priority support
Enterprise Plan: Custom pricing - Includes all features and dedicated support team

FAQ:
Q: How long does implementation take?
A: Implementation typically takes 2-4 weeks depending on project complexity.

Q: Do you offer customer support?
A: Yes, we provide 24/7 customer support via email, phone, and live chat.

Q: Is there a contract commitment?
A: No, our plans are month-to-month with no long-term contracts.

POLICIES:
Return Policy: Full refund within 30 days if not satisfied
Privacy Policy: We never share your personal information with third parties
Terms of Service: Standard terms apply for all services

ACHIEVEMENTS:
Achievement 1: Served 1000+ happy customers
Achievement 2: 98% customer satisfaction rate
Achievement 3: Industry award for innovation in 2024

TESTIMONIALS:
"Excellent service! Highly recommended." - John Doe
"The team went above and beyond our expectations." - Jane Smith

SUPPORT INFORMATION:
Support Hours: Monday-Friday, 9 AM - 6 PM EST
Response Time: Within 24 hours
Supported Languages: English, Spanish, French

TROUBLESHOOTING:
Common Issue 1: Can't access dashboard - Clear browser cache and cookies
Common Issue 2: Billing problems - Contact support with your invoice number

INTEGRATIONS:
Integration 1: PayPal - Secure payment processing
Integration 2: Stripe - Credit card payments
Integration 3: Mailchimp - Email marketing automation

UPDATES & ROADMAP:
Recent Updates: Mobile app launched, New dashboard features added
Future Plans: AI-powered analytics, API access for developers
`;

// 3️⃣ CONTACT METHODS
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
  address: "123 Business Street, City, Country",
  supportHours: "Monday-Friday, 9 AM - 6 PM",
};

// 4️⃣ AI RESPONSE CONFIGURATION
const RESPONSE_CONFIG = {
  maxWords: 40,
  minWords: 10,
  responseStyle: "conversational",
  includeLinks: true,
  includeContact: true,
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
  language: string;
  sources: string[];
  sourceCount: number;
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
    
    if (queryLower.includes(pageNameLower)) {
      relevanceScore += 0.8;
    }
    
    const queryWords = queryLower.split(' ');
    for (const word of queryWords) {
      if (pageNameLower.includes(word) && word.length > 2) {
        relevanceScore += 0.3;
      }
      if (pagePathLower.includes(word) && word.length > 2) {
        relevanceScore += 0.2;
      }
    }
    
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

// Generate AI response
const generateAIResponse = async (
  prompt: string, 
  language: string, 
  relevantPages: PageMatch[]
): Promise<{ response: string; suggestedPages: { name: string; path: string; }[] }> => {
  
  const suggestedPages = relevantPages.map(match => match.page);
  
  const contactInfoText = RESPONSE_CONFIG.includeContact ? formatContactInfo() : '';
  
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
    
    finalResponse = finalResponse.trim();
    
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
        responseTime: 0,
        language: 'english',
        sources: [],
        sourceCount: 0,
      };
    }
    
    const language = detectLanguage(prompt);
    const relevantPages = findRelevantPages(prompt);
    const sourcesList = relevantPages.map(p => p.page.name);
    
    const { response, suggestedPages } = await generateAIResponse(prompt, language, relevantPages);
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      response: response,
      foundResults: relevantPages.length > 0,
      suggestedPages: suggestedPages,
      contactInfo: RESPONSE_CONFIG.includeContact ? CONTACT_METHODS : undefined,
      responseTime: responseTime,
      language: language,
      sources: sourcesList,
      sourceCount: sourcesList.length,
    };
    
  } catch (error) {
    console.error('Error in ChatBotFunction:', error);
    const responseTime = Date.now() - startTime;
    const language = detectLanguage(prompt);
    
    const errorResponses: { [key: string]: string } = {
      english: `Sorry, I'm having trouble right now. Please reach out to ${CONTACT_METHODS.email || CONTACT_METHODS.phone || 'our support team'} for immediate help.`,
      bangla: `দুঃখিত, আমার এখন সমস্যা হচ্ছে। দয়া করে ${CONTACT_METHODS.email || CONTACT_METHODS.phone || 'আমাদের সাপোর্ট টিম'} এ যোগাযোগ করুন।`,
      arabic: `عذراً، أواجه مشكلة الآن. يرجى التواصل مع ${CONTACT_METHODS.email || CONTACT_METHODS.phone || 'فريق الدعم'} للحصول على مساعدة فورية.`,
      hindi: `क्षमा करें, मुझे अभी समस्या हो रही है। कृपया तुरंत सहायता के लिए ${CONTACT_METHODS.email || CONTACT_METHODS.phone || 'हमारी सपोर्ट टीम'} से संपर्क करें।`,
      urdu: `معذرت، مجھے ابھی مسئلہ ہو رہا ہے۔ براہ کرم فوری مدد کے لیے ${CONTACT_METHODS.email || CONTACT_METHODS.phone || 'ہماری سپورٹ ٹیم'} سے رابطہ کریں۔`
    };
    
    return {
      success: false,
      response: errorResponses[language] || errorResponses.english,
      foundResults: false,
      suggestedPages: [],
      responseTime: responseTime,
      language: language,
      sources: [],
      sourceCount: 0,
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
  console.log("Knowledge base update requested:", newInfo.substring(0, 100));
};

// Get current configuration
export const getConfig = () => ({
  pages: CLIENT_SIDE_PAGES,
  contact: CONTACT_METHODS,
  responseConfig: RESPONSE_CONFIG,
});

export default ChatBotFunction;