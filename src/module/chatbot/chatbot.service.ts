/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Updated client-side navigation structure for Madrasha
const CLIENT_NAVIGATION = {
  "Home": { path: "/" },
  "About Madrasha": {
    children: {
      "History": "/about-madrasha/history",
      "Principal's Message": "/about-madrasha/principal-message",
      "Teaching Methodology": "/about-madrasha/teaching-methodology",
      "Our Features": "/about-madrasha/features",
      "Future Plans": "/about-madrasha/plans"
    }
  },
  "Admission": {
    children: {
      "Admission Information": "/admission/information",
      "Admission Notice": "/admission/notice",
      "Admission Process": "/admission/process",
      "Admission Requirements": "/admission/requirements",
      "Admission Schedule": "/admission/schedule",
      "Admission Form": "/admission/form"
    }
  },
  "Academics": {
    children: {
      "Departments": "/academics/departments",
      "Classes": "/academics/classes",
      "Subjects": "/academics/subjects",
      "Daily Schedule": "/academics/schedule",
      "Course Details": "/academics/courses",
      "Exam System": "/academics/exam-system",
      "Islamic Programs": "/academics/islamic-programs"
    }
  },
  "Facilities": {
    children: {
      "Hostel": "/facilities/hostel",
      "Library": "/facilities/library",
      "Cafeteria": "/facilities/canteen",
      "Prayer Facilities": "/facilities/prayer",
      "Sports Facilities": "/facilities/sports"
    }
  },
  "Activities": {
    children: {
      "Notice": "/activities/notice",
      "Achievements": "/activities/achievements",
      "Daily Diary": "/activities/dairy",
      "Photo Gallery": "/activities/images",
      "Videos": "/activities/videos",
      "Islamic Events": "/activities/islamic-events"
    }
  },
  "Fees & Payments": {
    children: {
      "Pay Fees": "/fees/pay",
      "Fee Structure": "/fees/fee-info"
    }
  },
  "Attendance": { path: "/attendance" },
  "Contact": { path: "/contact" }
};

// Enhanced knowledge base with Madrasha data
const INSTITUTION_KNOWLEDGE_BASE = `
নূরে রিসালাত মডেল মাদ্রাসা - COMPREHENSIVE KNOWLEDGE BASE

INSTITUTION OVERVIEW:
নূরে রিসালাত মডেল মাদ্রাসা is an Islamic educational institution dedicated to providing quality education combining modern education with Islamic values. We focus on holistic development of students with both religious and contemporary education.

LEADERSHIP:
স্বপ্নদ্রষ্টা-প্রতিষ্ঠাতা ও প্রধান পৃষ্ঠপোষক: আলহাজ্ব অধ্যক্ষ মাওলানা মোঃ শহিদুর রহমান
Contact: ০১৭২৩-১৫৪৬৭৬ (01723-154676)

NAVIGATION STRUCTURE:
${JSON.stringify(CLIENT_NAVIGATION, null, 2)}

ADMISSION PROCESS DETAILS:
- Admission Period: Throughout the year based on availability
- Required Documents: Birth certificate, previous academic transcripts, guardian's ID, passport photos
- Application Methods: Direct admission at madrasha
- Eligibility: Based on age and previous educational background
- Special Focus: Islamic education alongside modern curriculum

FEE STRUCTURE DETAILS:
- Affordable fee structure for all students
- Special consideration for needy students
- Monthly and quarterly payment options
- Transparent fee system with no hidden costs

ACADEMIC PROGRAMS:
- Islamic Studies: Quran, Hadith, Fiqh, Arabic Language
- Modern Education: Bengali, English, Mathematics, Science
- Vocational Training: Basic computer skills, handicrafts
- Special Programs: Islamic ethics and moral education

EXAMINATION SYSTEM:
- Continuous assessment throughout the year
- Semester examinations for modern subjects
- Practical tests for Islamic studies
- Annual examination system

FACILITIES DETAILS:
Library: Islamic books, modern educational materials, study areas
Hostel: Accommodation for outstation students
Prayer Facilities: Separate prayer areas for students
Sports: Basic sports facilities for physical development
Cafeteria: Hygienic food service

TEACHING METHODOLOGY:
- Combination of traditional and modern teaching methods
- Focus on character building
- Individual attention to students
- Practical learning approach
- Islamic values integration in daily learning

CONTACT INFORMATION:
- Address: As mentioned on Facebook page
- Phone: ০১৭২৩-১৫৪৬৭৬ (01723-154676)
- Facebook: https://www.facebook.com/p/নূরে-রিসালাত-মডেল-মাদ্রাসা-100078782875984/
- Office Hours: Always open as per Facebook status

ACADEMIC CALENDAR:
- Academic Year: Follows national educational calendar
- Islamic Holidays: According to Hijri calendar
- Special Events: Islamic festivals and celebrations

EXTRA-CURRICULAR ACTIVITIES:
- Islamic competitions (Quran recitation, Hadith)
- Cultural programs
- Sports competitions
- Community service activities
- Educational tours

VISION & MISSION:
Vision: To develop students with strong Islamic character and modern education.
Mission: Providing quality education that nurtures both religious and contemporary knowledge through dedicated teaching and proper guidance.
`;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Enhanced training data for common queries
const TRAINING_EXAMPLES = {
  admission: {
    questions: ['admission', 'how to apply', 'admission process', 'get admission', 'ভর্তি', 'ভর্তি প্রক্রিয়া'],
    response: `Our admission process is simple and straightforward:
• Visit the madrasha directly for admission
• Submit required documents
• Complete admission formalities
• Start classes as per schedule

Required documents include birth certificate, previous academic records, and guardian's ID.

For detailed information, visit [Admission Process](/admission/process) or check [Admission Requirements](/admission/requirements).`
  },
  fees: {
    questions: ['fees', 'fee structure', 'tuition', 'scholarship', 'ফি', 'টিউশন ফি'],
    response: `We offer affordable fee structure with special consideration for needy students:
• Transparent fee system
• Monthly/quarterly payment options
• Special discounts for deserving students
• No hidden costs

Details available at [Fee Structure](/fees/fee-info) and [Pay Fees](/fees/pay).`
  },
  contact: {
    questions: ['contact', 'address', 'phone', 'email', 'location', 'যোগাযোগ', 'ফোন'],
    response: `You can reach us through:
• Phone: ০১৭২৩-১৫৪৬৭৬ (01723-154676)
• Facebook: নূরে রিসালাত মডেল মাদ্রাসা
• Direct visit: Our madrasha campus
• Founder: আলহাজ্ব অধ্যক্ষ মাওলানা মোঃ শহিদুর রহমান

Visit [Contact](/contact) page for complete details.`
  },
  about: {
    questions: ['about', 'history', 'principal', 'founder', 'সম্পর্কে', 'ইতিহাস', 'প্রধান'],
    response: `নূরে রিসালাত মডেল মাদ্রাসা is established by:
• Founder & Chief Patron: আলহাজ্ব অধ্যক্ষ মাওলানা মোঃ শহিদুর রহমান
• Contact: ০১৭২৩-১৫৪৬৭৬

We provide combined education of Islamic and modern studies focusing on character building.

Learn more at [About Madrasha](/about-madrasha/history) and [Principal's Message](/about-madrasha/principal-message).`
  },
  programs: {
    questions: ['programs', 'courses', 'subjects', 'education', 'প্রোগ্রাম', 'কোর্স'],
    response: `We offer comprehensive educational programs:
• Islamic Studies: Quran, Hadith, Fiqh, Arabic
• Modern Education: Bengali, English, Mathematics, Science
• Vocational Training
• Extra-curricular activities

Explore our [Academics](/academics/departments) section for details.`
  }
};

// ... (Keep all the existing interfaces and functions the same, they don't need changes)
// Interface definitions
interface ChatResponse {
  success: boolean;
  response: string;
  foundResults: boolean;
  sourceCount: number;
  sources: string[];
  language: string;
  responseTime?: number;
  suggestedPages?: string[];
}

interface NavigationMatch {
  mainCategory: string;
  subCategory?: string;
  path: string;
  confidence: number;
}

// Function to detect language from prompt
const detectLanguage = (text: string): string => {
  const banglaRegex = /[\u0980-\u09FF]/;
  const arabicRegex = /[\u0600-\u06FF]/;
  
  if (banglaRegex.test(text)) return 'bangla';
  if (arabicRegex.test(text)) return 'arabic';
  return 'english';
};

// Enhanced function to map user query to exact client navigation
const mapQueryToNavigation = (prompt: string): NavigationMatch[] => {
  const matches: NavigationMatch[] = [];
  const lowerPrompt = prompt.toLowerCase();

  // First check training examples for quick responses
  Object.entries(TRAINING_EXAMPLES).forEach(([category, data]) => {
    if (data.questions.some(question => lowerPrompt.includes(question.toLowerCase()))) {
      // Map to relevant navigation pages based on category
      switch(category) {
        case 'admission':
          matches.push({
            mainCategory: "Admission",
            subCategory: "Admission Process",
            path: "/admission/process",
            confidence: 0.95
          });
          break;
        case 'fees':
          matches.push({
            mainCategory: "Fees & Payments",
            subCategory: "Fee Structure",
            path: "/fees/fee-info",
            confidence: 0.95
          });
          break;
        case 'contact':
          matches.push({
            mainCategory: "Contact",
            path: "/contact",
            confidence: 0.95
          });
          break;
        case 'about':
          matches.push({
            mainCategory: "About Madrasha",
            subCategory: "History",
            path: "/about-madrasha/history",
            confidence: 0.95
          });
          break;
        case 'programs':
          matches.push({
            mainCategory: "Academics",
            subCategory: "Departments",
            path: "/academics/departments",
            confidence: 0.95
          });
          break;
      }
    }
  });

  // Search through all navigation items
  Object.entries(CLIENT_NAVIGATION).forEach(([mainCategory, mainData] : any) => {
    const mainCategoryLower = mainCategory.toLowerCase();
    
    // Check main category match
    if (lowerPrompt.includes(mainCategoryLower) || 
        mainCategoryLower.split(' ').some((word:any) => lowerPrompt.includes(word))) {
      matches.push({
        mainCategory,
        path: mainData.path,
        confidence: 0.8
      });
    }

    // Check sub-categories if they exist
    if (mainData.children) {
      Object.entries(mainData.children).forEach(([subCategory, subPath]) => {
        const subCategoryLower = subCategory.toLowerCase();
        
        if (lowerPrompt.includes(subCategoryLower) || 
            subCategoryLower.split(' ').some(word => lowerPrompt.includes(word)) ||
            mainCategoryLower.split(' ').some((word:any) => lowerPrompt.includes(word))) {
          
          matches.push({
            mainCategory,
            subCategory,
            path: subPath as string,
            confidence: 0.9
          });
        }
      });
    }
  });

  // Sort by confidence and remove duplicates
  return matches
    .sort((a, b) => b.confidence - a.confidence)
    .filter((match, index, self) => 
      index === self.findIndex(m => 
        m.mainCategory === match.mainCategory && 
        m.subCategory === match.subCategory
      )
    )
    .slice(0, 3);
};

// Enhanced AI response generation with proper path formatting
const generateAIResponse = async (prompt: string, language: string, navigationMatches: NavigationMatch[]): Promise<{response: string, suggestedPages: string[]}> => {
  
  const suggestedPages = navigationMatches.map(match => 
    match.subCategory ? `${match.mainCategory} → ${match.subCategory}` : match.mainCategory
  );

  // Check for exact matches in training examples first
  const lowerPrompt = prompt.toLowerCase();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [category, data] of Object.entries(TRAINING_EXAMPLES)) {
    if (data.questions.some(question => lowerPrompt.includes(question.toLowerCase()))) {
      return {
        response: data.response,
        suggestedPages: suggestedPages.slice(0, 2)
      };
    }
  }

  const navigationContext = navigationMatches.length > 0 ? 
    `RELEVANT PAGES FOR USER QUERY:
${navigationMatches.map(match => 
  `- ${match.mainCategory}${match.subCategory ? ` → ${match.subCategory}` : ''} (Path: ${match.path})`
).join('\n')}

IMPORTANT FORMATTING INSTRUCTIONS:
- When suggesting pages, use this format: [Page Name](path)
- Use • for bullet points instead of *
- Keep links natural and contextual` 
    : 'No specific page matches found.';

  const systemPrompt = `
You are an AI assistant for নূরে রিসালাত মডেল মাদ্রাসা. Provide accurate, helpful information.

CRITICAL INSTRUCTIONS:
1. Use EXACT paths from navigation context below
2. Format page references as: [Page Name](path)
3. Use • for bullet points, not *
4. Keep responses concise (100-200 words)
5. Respond in ${language.toUpperCase()}
6. Never say "I don't know" - always provide helpful information
7. Include relevant page suggestions when applicable
8. Always mention founder: আলহাজ্ব অধ্যক্ষ মাওলানা মোঃ শহিদুর রহমান (01723-154676) when relevant

NAVIGATION CONTEXT:
${navigationContext}

KNOWLEDGE BASE:
${INSTITUTION_KNOWLEDGE_BASE}

USER QUESTION: ${prompt}

RESPONSE GUIDELINES:
- Be specific and accurate
- Use natural language with page links
- Focus on most relevant information
- Suggest 1-2 relevant pages at the end if applicable
- Use proper formatting with • bullet points
- Mention contact number 01723-154676 when appropriate

RESPOND IN ${language.toUpperCase()}:
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });
    
    let finalResponse = response.text || generateFallbackResponse(language, prompt, suggestedPages);
    
    // Ensure proper path formatting
    navigationMatches.forEach(match => {
      const pageName = match.subCategory ? match.subCategory : match.mainCategory;
      finalResponse = finalResponse.replace(
        new RegExp(`\\b${pageName}\\b`, 'gi'),
        `[${pageName}](${match.path})`
      );
    });
    
    return {
      response: finalResponse,
      suggestedPages: suggestedPages.slice(0, 2)
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      response: generateFallbackResponse(language, prompt, suggestedPages),
      suggestedPages: suggestedPages.slice(0, 2)
    };
  }
};

const generateFallbackResponse = (language: string, prompt: string, suggestedPages: string[]): string => {
  const pageSuggestions = suggestedPages.length > 0 ? 
    `\n\nYou might find these pages helpful: ${suggestedPages.slice(0, 2).join(', ')}` : '';

  const fallbackResponses: any = {
    bangla: `নূরে রিসালাত মডেল মাদ্রাসায় আপনাকে স্বাগতম! আপনার প্রশ্ন "${prompt}" সম্পর্কে আমি সাহায্য করতে পারি।${pageSuggestions}\nআরও তথ্যের জন্য যোগাযোগ করুন: ০১৭২৩-১৫৪৬৭৬ অথবা ফেসবুক পেজ ভিজিট করুন।`,
    arabic: `مرحبًا بكم في مدرسة نورى رسالة النموذجية! يمكنني المساعدة في استفسارك "${prompt}".${pageSuggestions}\nلمزيد من المعلومات، اتصل على: 01723-154676 أو قم بزيارة صفحة الفيسبوك.`,
    english: `Welcome to Noore Risalat Model Madrasha! I can help you with your question "${prompt}".${pageSuggestions}\nFor more information, contact: 01723-154676 or visit our Facebook page.`
  };
  
  return fallbackResponses[language] || fallbackResponses.english;
};

// Main chat function
export const ChatBorFunctions = async (prompt: string): Promise<ChatResponse> => {
  const startTime = Date.now();
  
  try {
    const language = detectLanguage(prompt);
    const navigationMatches = mapQueryToNavigation(prompt);
    const { response, suggestedPages } = await generateAIResponse(prompt, language, navigationMatches);
    const responseTime = Date.now() - startTime;

    return {
      success: true,
      response: response,
      foundResults: true,
      sourceCount: 1,
      sources: ['Madrasha Knowledge Base'],
      language: language,
      responseTime: responseTime,
      suggestedPages: suggestedPages
    };
    
  } catch (error) {
    console.error('Error in ChatBorFunctions:', error);
    
    const responseTime = Date.now() - startTime;
    const language = detectLanguage(prompt);
    
    const errorResponses: any = {
      bangla: `দুঃখিত, সিস্টেমে একটি সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন। সরাসরি যোগাযোগ: ০১৭২৩-১৫৪৬৭৬`,
      arabic: `عذرًا، حدث خطأ في النظام. يرجى المحاولة مرة أخرى later. للاتصال المباشر: 01723-154676`,
      english: `Sorry, a system error occurred. Please try again later. Direct contact: 01723-154676`
    };
    
    return {
      success: false,
      response: errorResponses[language] || errorResponses.english,
      foundResults: false,
      sourceCount: 0,
      sources: [],
      language: language,
      responseTime: responseTime,
      suggestedPages: []
    };
  }
};

// Utility functions
export const getQuickResponse = async (prompt: string): Promise<string> => {
  try {
    const result = await ChatBorFunctions(prompt);
    return result.response;
  } catch (error) {
    console.log(error)
    return 'Sorry, I am unable to process your request at the moment.';
  }
};

export const getNavigationSuggestions = (prompt: string): NavigationMatch[] => {
  return mapQueryToNavigation(prompt);
};

export default ChatBorFunctions;