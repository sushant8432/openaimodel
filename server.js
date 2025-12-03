// server.js - ENHANCED VERSION with OpenAI & User Details Collection & Email

const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// ==============================================
// YOUR API KEYS
// ==============================================
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Email Configuration (Gmail)
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL, // Your Gmail
    pass: process.env.EMAIL_PASSWORD // Gmail App Password
  }
};

// Admin email to receive notifications
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'your-admin@vantagehall.org';

// Create email transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// ==============================================
// COMPREHENSIVE KNOWLEDGE BASE
// ==============================================
const KNOWLEDGE_BASE = {
  // Medical & Healthcare
  medical_team: {
    keywords: ['doctor', 'nurse', 'medical staff', 'physician', 'gynaecologist', 'school doctor'],
    answer: "👩‍⚕️ Medical Staff:\n\nOur school has a qualified in-house doctor (MBBS, DGO – Physician & Gynaecologist) supported by three trained nurses, ensuring round-the-clock healthcare for all students."
  },
  
  hospital_tieups: {
    keywords: ['hospital', 'emergency hospital', 'tie-up', 'synergy', 'max', 'graphic era'],
    answer: "🏥 Hospital Tie-ups:\n\nFor emergencies requiring specialized care, we have tie-ups with:\n• Graphic Era Hospital (nearby)\n• Synergy Hospital\n• Max Hospital\n\nThis ensures immediate and expert medical attention when needed."
  },

  first_aid: {
    keywords: ['first aid', 'injury', 'wound', 'fever', 'allergy', 'minor injury'],
    answer: "🚑 First Aid Services:\n\nOur medical team provides prompt first aid, including:\n• Minor injury care\n• Wound dressing\n• Fever management\n• Allergic reaction support\n\nStudents receive immediate attention and comfort within the campus."
  },

  monthly_checkup: {
    keywords: ['health checkup', 'monthly checkup', 'medical exam', 'routine health', 'vision test'],
    answer: "🩺 Monthly Health Check-ups:\n\nRegular health assessments include:\n• Height & Weight tracking\n• Vision tests\n• Dental hygiene\n• General physical examination\n\nThis helps monitor every student's well-being throughout the year."
  },

  medical_availability: {
    keywords: ['24x7', 'available', 'round the clock', 'night doctor', 'day doctor'],
    answer: "⏱️ 24x7 Medical Availability:\n\nMedical assistance, including first and primary aid, is available at all hours — ensuring your child's safety day and night."
  },

  // Founder & History
  founder: {
    keywords: ['founder', 'established', 'history', 'who started', 'foundation', 'when founded'],
    answer: "🏫 Vantage Hall Girls' Residential School was established in 2013 with a vision to provide world-class boarding education for girls in a nurturing and empowering environment."
  },

  // Affiliation
  affiliation: {
    keywords: ['affiliation', 'cbse code', 'board affiliation', 'school code'],
    answer: "📘 The school is affiliated to the Central Board of Secondary Education (CBSE), New Delhi."
  },

  // Location
  location: {
    keywords: ['location', 'map', 'how to reach', 'directions', 'bus stop', 'address'],
    answer: "📍 Vantage Hall is located in Doonga, Dehradun — about 10 km from the city centre. Easily accessible via Sahaspur Road & Rajpur Road.\n🗺 Google Maps: https://maps.app.goo.gl/F9okR4GADbhN9x5G8"
  },

  // Faculty
  faculty: {
    keywords: ['faculty', 'teachers', 'staff', 'teaching quality', 'teacher qualification'],
    answer: "👩‍🏫 All faculty members are highly qualified professionals with CBSE teaching certifications. Many hold postgraduate degrees and have years of teaching and mentoring experience."
  },

  // Smart Classes
  smart_class: {
    keywords: ['smart class', 'technology', 'digital classroom', 'computer lab', 'ERP', 'online learning'],
    answer: "💻 Digital & Smart Learning:\n• Smart classrooms with interactive panels\n• Computer & Robotics Labs\n• Wi-Fi-enabled learning environment\n• Integrated Edunext ERP for attendance, grades & communication"
  },

  // Safety & Security
  safety: {
    keywords: ['safety', 'security', 'cctv', 'warden', 'camera', 'rules'],
    answer: "🛡 Safety & Security:\n• 24x7 wardens in each hostel block\n• CCTV surveillance in corridors & common areas\n• Controlled visitor access with ID verification\n• Strict discipline & conduct policy"
  },

  // Campus
  campus: {
    keywords: ['campus', 'infrastructure', 'library', 'labs', 'facilities available', 'auditorium'],
    answer: "🏫 Campus Facilities:\n• 12-acre lush green campus\n• Modern academic blocks & labs\n• Fully stocked library\n• Amphitheatre & multi-purpose auditorium\n• Indoor & outdoor sports arenas"
  },

  // Vision & Mission
  vision: {
    keywords: ['vision', 'goal', 'objective', 'purpose', 'mission'],
    answer: "🎯 Our Vision & Mission:\n\nTo nurture happy, independent, and unique individuals in a safe and supportive environment."
  },

  // Curriculum
  curriculum: {
    keywords: ['curriculum', 'board', 'cbse', 'syllabus', 'academics system', 'what subject', 'subjects taught'],
    answer: "📚 We follow the CBSE curriculum\n\n🎓 Streams Offered (Classes 11-12):\n• Science\n• Commerce\n• Humanities\n\nOur curriculum emphasizes holistic development beyond textbooks."
  },

  // Timings
  timings: {
    keywords: ['timing', 'time', 'hour', 'schedule', 'start'],
    answer: "🕐 School Timings:\n\n• Grades 3-9: 7:45 AM - 12:55 PM\n• Grades 10-12: 7:45 AM - 1:35 PM\n• Activity Classes: 2:45 PM - 4:05 PM"
  },

  // Student-Teacher Ratio
  ratio: {
    keywords: ['ratio', 'student', 'teacher', 'class size', 'students per'],
    answer: "👩‍🏫 Student-Teacher Ratio: 1:5\n\nWe maintain small class sizes to ensure personalized attention and effective learning for every student."
  },

  // Eligibility
  eligibility: {
    keywords: ['eligibility', 'eligible', 'criteria', 'qualify', 'who can', 'age'],
    answer: "📝 Eligibility Criteria:\n\n✅ Classes: 3-12\n✅ Age: As per CBSE guidelines\n✅ Eligibility: Successful completion of previous grade\n✅ Required: Transfer Certificate and Report Card\n⚠️ Note: Admission to Class 10 is considered only in exceptional cases"
  },

  // Admission Process
  admission: {
    keywords: ['admission', 'admit', 'process of admission', 'enroll', 'join', 'apply'],
    answer: "📝 Admission Process:\n\n✅ Step 1: Written Test (English, Mathematics, Science)\n✅ Step 2: Interaction with Principal\n✅ Step 3: Interaction with Director\n\n📅 Registrations: September-October\n📅 Session Starts: April\n\n📞 Contact:\n+91-8191912999, +91-7078311863\n🔗 https://vantagehall.org/contact-us \n📧 admissions@vantagehall.org"
  },

  // Documents Required
  documents: {
    keywords: ['document', 'paper', 'certificate', 'required', 'need', 'bring'],
    answer: "📄 Required Documents:\n\n• Birth Certificate & Aadhaar Card\n• Parents' Aadhaar & PAN Cards\n• Last examination mark sheet\n• Original Transfer Certificate\n• Medical Fitness Certificate\n• Student's PEN Number / APAAR ID"
  },

  // Fee Structure
  fee: {
    keywords: ['fee', 'fees', 'cost', 'tuition', 'charge', 'payment', 'price'],
    answer: "💰 Fee Structure:\n\n📌 Classes 3-7: ₹7,35,000 (Annual: ₹5,50,000 + One-time: ₹1,85,000)\n\n📌 Classes 8-10: ₹8,35,000 (Annual: ₹6,50,000 + One-time: ₹1,85,000)\n\n📌 Classes 11-12: ₹8,85,000 (Annual: ₹7,00,000 + One-time: ₹1,85,000)\n\n*One-time fees include registration, joining kit, imprest deposit & admission fee"
  },

  // Hostel Facilities
  hostel: {
    keywords: ['hostel', 'hostel facilities', 'boarding', 'residential', 'accommodation', 'room'],
    answer: "🏡 Hostel Facilities:\n\n✨ Well-furnished dormitories with beds, storage, study tables & wardrobes\n✨ Separate hostels for juniors & seniors\n✨ Regular laundry service\n✨ Daily housekeeping\n✨ 24/7 supervision by wardens\n✨ Safe & supportive environment"
  },

  // Food & Dining
  food: {
    keywords: ['food', 'dining', 'menu', 'meal', 'lunch', 'dinner', 'breakfast', 'diet'],
    answer: "🍽️ Dining & Nutrition:\n\n✅ Nutritionist-planned meals\n✅ Special diets for athletes & medical needs\n✅ Veg & non-veg options\n✅ Menu rotates every 15 days\n\n🥗 Daily Meals:\n• Breakfast: Fruits, cereals, milk, eggs, bread/parathas\n• Lunch: Dal, rice/roti, vegetables, salad\n• Dinner: Similar to lunch with variety\n• Night Milk: Mandatory"
  },

  // Sports
  sports: {
    keywords: ['sports', 'sport available', 'games', 'what sports', 'sports facilities', 'athletics', 'physical education', 'football', 'cricket', 'basketball', 'swimming', 'which sports'],
    answer: "⚽ Sports & Athletics:\n\nTraining under qualified coaches in:\n\n🏃‍♀️ Football, Cricket, Basketball, Volleyball\n🎾 Squash, Badminton, Lawn Tennis, Table Tennis\n⛸️ Skating, Gymnasium, Swimming\n♟️ Indoor Games: Carrom, Chess"
  },

  // Clubs & Activities
  clubs: {
    keywords: ['club', 'activity', 'extracurricular', 'societies', 'hobby'],
    answer: "🎨 Clubs & Societies:\n\n• Art Club\n• Culinary Club\n• Dance & Music Club\n• Theatre Club\n• Finance & Maths Club\n• IT Club\n• Science Club\n• Photography Club\n• Sustainability Club\n• Editorial Board"
  },

  // Career Guidance
  career: {
    keywords: ['career', 'guidance', 'college', 'university', 'neet', 'jee', 'clat'],
    answer: "🎯 Career Guidance:\n\nWe offer counseling for Grades 8-12, including:\n\n✅ Medical (NEET)\n✅ Engineering (JEE)\n✅ Law (CLAT, AILET)\n✅ Management (IPM, NMIMS)\n✅ Design (NIFT, UCEED)\n✅ SAT & AP (foreign universities)\n\n1-on-1 guidance sessions available!"
  },

  // Contact Information
  contact: {
    keywords: ['contact', 'phone', 'email', 'address', 'reach', 'call', 'number'],
    answer: "📍 Vantage Hall Girls' Residential School\nThe Yellow Brick Road, Doonga\nDehradun - 248007, Uttarakhand\n📞 General: 0135-2776225, 226, 227, 228\n📧 info@vantagehall.org\n\n👤 Admissions:\n📞 +91-8191912999, +91-7078311863\n📧 admissions@vantagehall.org\n🔗 Contact page: https://vantagehall.org/contact-us"
  }
};

// ==============================================
// SMART KEYWORD MATCHING FUNCTION
// ==============================================
function findBestMatch(userMessage) {
  const msg = userMessage.toLowerCase().trim();
  
  let bestMatch = null;
  let highestScore = 0;
  
  for (const [topic, data] of Object.entries(KNOWLEDGE_BASE)) {
    let score = 0;
    let matchedKeywords = [];
    
    for (const keyword of data.keywords) {
      const keywordLower = keyword.toLowerCase();
      
      if (msg === keywordLower) {
        score += 100;
        matchedKeywords.push(keyword);
      }
      else if (new RegExp(`\\b${keywordLower}\\b`, 'i').test(msg)) {
        score += 50;
        matchedKeywords.push(keyword);
      }
      else if (msg.includes(keywordLower)) {
        score += 10;
        matchedKeywords.push(keyword);
      }
    }
    
    if (score > highestScore && score > 0) {
      highestScore = score;
      bestMatch = {
        answer: data.answer,
        topic: topic,
        score: score,
        matchedKeywords: matchedKeywords
      };
    }
  }
  
  if (bestMatch && bestMatch.score >= 10) {
    console.log(`✅ Best Match: ${bestMatch.topic} (Score: ${bestMatch.score})`);
    return bestMatch.answer;
  }
  
  return null;
}

// ==============================================
// SEND EMAIL NOTIFICATION TO ADMIN
// ==============================================
async function sendAdminEmail(userDetails) {
  try {
    const mailOptions = {
      from: EMAIL_CONFIG.auth.user,
      to: ADMIN_EMAIL,
      subject: '🔔 New Chatbot User Registration - Vantage Hall',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-row { margin: 15px 0; padding: 12px; background: #f0f0f0; border-radius: 6px; }
            .label { font-weight: bold; color: #667eea; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🎓 New User Started Chat</h2>
              <p>Vantage Hall Chatbot</p>
            </div>
            <div class="content">
              <h3>User Details:</h3>
              
              <div class="info-row">
                <span class="label">👤 Name:</span><br>
                ${userDetails.name}
              </div>
              
              <div class="info-row">
                <span class="label">📧 Email:</span><br>
                ${userDetails.email}
              </div>
              
              <div class="info-row">
                <span class="label">📱 Phone:</span><br>
                ${userDetails.phone}
              </div>
              
              <div class="info-row">
                <span class="label">🕐 Time:</span><br>
                ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </div>
              
              <p style="margin-top: 25px; padding: 15px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;">
                <strong>Action Required:</strong> This user has started a conversation with the chatbot. You may want to follow up via email or phone.
              </p>
            </div>
            <div class="footer">
              <p>This is an automated notification from Vantage Hall Chatbot System</p>
              <p>© ${new Date().getFullYear()} Vantage Hall Girls' Residential School</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to admin successfully!');
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
}

// ==============================================
// OPENAI API CALL
// ==============================================
async function callOpenAI(prompt) {
  try {
    const url = 'https://api.openai.com/v1/chat/completions';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using GPT-4o-mini (cost-effective)
        messages: [
          {
            role: 'system',
            content: 'You are a friendly assistant for Vantage Hall Girls\' Residential School, Dehradun. Answer ONLY questions about Vantage Hall school. For unrelated questions, politely redirect to school-related topics.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API failed');
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    
    if (!text) {
      throw new Error('No response from OpenAI');
    }

    console.log('✅ OpenAI API responded successfully');
    return text;

  } catch (error) {
    console.error('❌ OpenAI Error:', error.message);
    throw error;
  }
}

// ==============================================
// ROOT ENDPOINT
// ==============================================
app.get('/', (req, res) => {
  res.json({
    status: '✅ Server Running',
    message: 'Vantage Hall Chatbot API - Enhanced Version with User Registration',
    model: 'OpenAI GPT-4o-mini + Email Notifications',
    endpoints: {
      health: '/api/health',
      chat: '/api/chat (POST)',
      register: '/api/register (POST)',
      test: '/api/test'
    }
  });
});

// ==============================================
// HEALTH CHECK
// ==============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==============================================
// USER REGISTRATION ENDPOINT
// ==============================================
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'All fields (name, email, phone) are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Phone validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, '').slice(-10))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number'
      });
    }

    console.log('📝 New user registration:', { name, email, phone });

    // Send email to admin
    const emailSent = await sendAdminEmail({ name, email, phone });

    res.json({
      success: true,
      message: 'Registration successful! You can now start chatting.',
      emailSent: emailSent
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.'
    });
  }
});

// ==============================================
// TEST ENDPOINT
// ==============================================
app.get('/api/test', async (req, res) => {
  try {
    const reply = await callOpenAI('Say "Hello! The OpenAI API is working!" in one sentence.');
    res.json({ 
      success: true, 
      message: '✅ OpenAI API is WORKING!',
      testReply: reply,
      knowledgeBaseTopics: Object.keys(KNOWLEDGE_BASE).length
    });
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message,
      fallbackMode: 'Enabled - Using comprehensive knowledge base',
      knowledgeBaseTopics: Object.keys(KNOWLEDGE_BASE).length
    });
  }
});

// ==============================================
// CHAT ENDPOINT
// ==============================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    console.log(`📩 User: ${message}`);

    const GREETINGS = [
      "Hello! 👋 Welcome to Vantage Hall Girls' Residential School. How can I help you today?",
      "Hi there! I'm here to answer your questions about Vantage Hall. What would you like to know?"
    ];

    const GENERAL_FALLBACK = [
      "Thank you for your question! 😊\n\nFor detailed information:\n📞 Call: 0135-2776225\n📧 Email: info@vantagehall.org\n📱 Admissions: +91-8191912999",
      "I'd be happy to help! For specific details:\n📞 0135-2776225\n📧 info@vantagehall.org"
    ];

    // Check for greeting
    if (/^(hi|hello|hey|good morning|good afternoon|good evening)/i.test(message.trim())) {
      const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
      return res.json({ 
        success: true, 
        reply: greeting,
        mode: 'greeting'
      });
    }

    // Try knowledge base first
    const knowledgeAnswer = findBestMatch(message);
    
    if (knowledgeAnswer) {
      console.log(`✅ Knowledge Base Match Found`);
      return res.json({ 
        success: true, 
        reply: knowledgeAnswer + "\n\n📚 *From Knowledge Base*",
        mode: 'knowledge-base'
      });
    }

    // Try OpenAI
    try {
      const systemContext = `
School Information:
Location: Doonga, Dehradun - 248007
Phone: 0135-2776225
Email: info@vantagehall.org
Admissions: +91-8191912999, +91-7078311863

User question: ${message}`;

      const reply = await callOpenAI(systemContext);
      
      return res.json({ 
        success: true, 
        reply: reply.trim() + "\n\n🤖 *Powered by AI*",
        mode: 'ai-powered'
      });
      
    } catch (openaiError) {
      const fallback = GENERAL_FALLBACK[Math.floor(Math.random() * GENERAL_FALLBACK.length)];
      
      return res.json({ 
        success: true, 
        reply: fallback,
        mode: 'general-fallback'
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    res.json({
      success: true,
      reply: `Thank you for your message! 😊\n\nFor immediate assistance:\n📞 Call: 0135-2776225\n📧 Email: info@vantagehall.org`,
      mode: 'emergency-fallback'
    });
  }
});

// ==============================================
// START SERVER
// ==============================================
app.listen(PORT, () => {
  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║   🎓 Vantage Hall Chatbot Server            ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
  console.log(`🤖 AI Model: OpenAI GPT-4o-mini`);
  console.log(`📚 Knowledge Base: ${Object.keys(KNOWLEDGE_BASE).length} topics`);
  console.log(`📧 Email: ${EMAIL_CONFIG.auth.user ? 'Configured ✅' : 'Not Configured ❌'}`);
  console.log('╚═══════════════════════════════════════════\n');
  console.log('🚀 Ready to chat! Open index.html in your browser.\n');
});