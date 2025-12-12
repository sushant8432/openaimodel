

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
  // ==========================================
  // EMOTIONAL SUPPORT & WELLBEING
  // ==========================================
  
  visiting_policy: {
    keywords: ['visit', 'visiting', 'can i visit', 'parent visit', 'meet daughter', 'see my daughter', 'visiting hours', 'when can i visit', 'visiting time'],
    answer: "👨‍👩‍👧 Parent Visits:\n\nYes! Parents are warmly welcomed to visit their daughters whenever they wish. We strongly believe in maintaining close family connections.\n\n✅ Visit anytime you're in town\n✅ Preferably after school hours (to avoid disrupting academics)\n✅ No appointment needed - just come see your daughter!\n\nWe encourage regular interaction between parents and students. Your presence matters! 💙"
  },

  homesickness_emotional_support: {
    keywords: ['homesick', 'homesickness', 'sad', 'emotional support', 'feeling sad', 'missing home', 'counselor', 'counselling', 'emotional care', 'mental health', 'feelings'],
    answer: "💚 Emotional Support System:\n\nYes, we provide comprehensive emotional care:\n\n👩‍⚕️ Professional counselor on campus\n🏠 Caring dorm mothers\n👩‍🏫 Supportive teachers\n📞 Weekly video calls with parents (every Sunday)\n👭 Small, close-knit community\n🤝 Regular check-ins & bonding sessions\n\nEvery girl receives continuous emotional support to feel at home. Our nurturing environment ensures no student feels alone or unsupported."
  },

  hunger_between_meals: {
    keywords: ['hungry', 'hunger', 'snack', 'between meals', 'food timing', 'meal schedule', 'feeling hungry', 'eat between', 'hungry at night'],
    answer: "🍎 Meal Schedule & Snacks:\n\nNo child ever goes hungry! Our meal schedule:\n\n☀️ 8:00 AM - Breakfast\n🍪 11:00 AM - Morning Snack\n🍽️ 1:00 PM - Lunch\n🥤 6:00 PM - Evening Snack\n🍲 9:00 PM - Dinner\n🥛 Before Bed - Glass of Milk\n\n✅ Students can keep personal dry fruits or healthy snacks in dorms\n✅ Staff ensures every meal is nutritious and satisfying\n✅ No one goes hungry - ever!"
  },

  daily_routine: {
    keywords: ['daily routine', 'schedule', 'timetable', 'day schedule', 'what does a day look like', 'typical day', 'daily schedule', 'routine'],
    answer: "📅 Daily Routine:\n\nStudents follow a balanced routine:\n\n📚 Academics (structured class hours)\n⚽ Sports & Physical Activities\n🎨 Co-curricular Activities\n📖 Self-Study Time\n😌 Relaxation Periods\n\n🌅 Evenings: Outdoor play & recreation\n🎯 Weekends: Time for hobbies & recreation\n\nA perfect balance of learning, activity, and rest!"
  },

  safety_security_detailed: {
    keywords: ['safe', 'secure', 'security system', 'campus security', '24x7 security', 'how safe', 'protection'],
    answer: "🛡️ Safety & Security Measures:\n\n📹 24x7 CCTV surveillance across campus\n👮 Trained security personnel at all entry points\n🚪 Restricted entry with ID verification\n🏠 Round-the-clock dorm supervision\n🚨 Regular safety drills & emergency preparedness\n\nYour daughter's safety is our top priority. The campus is completely secure with multiple layers of protection."
  },

  bullying_policy: {
    keywords: ['bully', 'bullying', 'bullied', 'unsafe', 'harassment', 'feel unsafe', 'teasing', 'ragging'],
    answer: "🚫 Zero-Tolerance Bullying Policy:\n\nWe have a STRICT zero-tolerance policy against bullying in ANY form.\n\n✅ Students encouraged to speak openly with:\n   • Dorm mothers\n   • Counselors\n   • Teachers\n\n📮 Multiple reporting channels:\n   • Suggestion boxes\n   • Feedback mechanisms\n   • Regular meetings with leadership\n\n⚡ All concerns addressed:\n   • Promptly\n   • Confidentially\n   • With appropriate action\n\nEvery student feels safe, supported, and heard!"
  },

  parent_communication: {
    keywords: ['speak to daughter', 'call daughter', 'talk to my daughter', 'phone call', 'video call', 'communication', 'contact daughter', 'emergency contact'],
    answer: "📱 Parent-Student Communication:\n\n📞 Regular Calls:\n• Every Sunday: 1 hour device access for video/phone calls\n\n🚨 Emergency Communication:\n• Pastoral team ensures immediate contact\n• Front desk available 24/7\n• Parents informed instantly in emergencies\n\nWe ensure you stay connected with your daughter while maintaining a healthy balance with campus life."
  },

 medical_facilities: {
  keywords: ['medical facility', 'doctor on campus', 'nurse', 'infirmary', 'sick', 'illness', 'health care', 'medical emergency', 'hospital'],
  answer: "🏥 Medical Facilities:<br><br>✅ Fully equipped infirmary on campus with 24/7 medical assistance<br>👩‍⚕️ Qualified female doctor and trained nurses available<br>🚑 School ambulance for immediate evacuation<br>🏥 Tie-ups with nearby hospitals like Graphic Era, Synergy, and Max for emergencies<br>📞 Parents informed immediately in case of any medical situation<br><br>Your daughter’s health and safety are always a top priority. For complete details, visit: <a href='https://vantagehall.org/medical-services/' target='_blank'>Medical Services</a>"
},

  staff_training: {
    keywords: ['staff trained', 'teacher training', 'pastoral care training', 'staff qualification', 'how staff trained', 'mentors', 'staff care'],
    answer: "👩‍🏫 Staff Training & Pastoral Care:\n\nAll staff members receive specialized training in:\n\n📚 Pastoral care\n🧠 Child psychology\n💚 Emotional support techniques\n🤝 Mentoring skills\n\nOur staff act as mentors, ensuring every student feels:\n✅ Supported\n✅ Valued\n✅ Heard\n✅ Cared for\n\nYour daughter is in caring, professional hands!"
  },

  food_nutrition: {
    keywords: ['food quality', 'nutrition', 'nutritious food', 'healthy food', 'what kind of food', 'meal quality', 'eating properly', 'meal supervision'],
    answer: "🍽️ Food & Nutrition Care:\n\nMeals are:\n✅ Nutritious & diverse\n✅ Lovingly prepared\n✅ Curated by a professional nutritionist\n✅ Mix of Indian & Continental dishes\n\n👩‍🍳 Personal Care:\n• Motherly pastoral team supervises mealtimes\n• Ensures no one skips meals\n• Makes sure each student eats properly\n\nNutrition is more than just a menu - it's care and supervision that ensures every child eats well!"
  },

  academic_balance: {
    keywords: ['balance academics', 'extracurricular balance', 'sports vs study', 'how balance', 'academics and sports', 'holistic development'],
    answer: "⚖️ Academic & Extracurricular Balance:\n\nWe believe every child is unique with her own strengths and pace.\n\n📚 Structured timetable ensures:\n✅ Equal importance to academics, sports, arts & leadership\n✅ Flexibility for individual needs\n\n🏃‍♀️ Sports enthusiasts: Encouraged to pursue passions\n📖 Academic focused: Time & support for strong goals\n\nNo compromise on physical fitness or creative growth!\n\nIt's a balance that nurtures both intellect and individuality."
  },

  emergency_protocols: {
    keywords: ['emergency procedure', 'emergency protocol', 'what if emergency', 'emergency handling', 'crisis management'],
    answer: "🚨 Emergency Protocols:\n\nWell-defined safety and emergency procedures:\n\n✅ Trained staff & pastoral team\n✅ Every procedure handled with:\n   • Utmost care\n   • Calm approach\n   • Empathy\n\n📞 Parents informed immediately\n\nYour child's safety is your top priority - and it's ours too. We're prepared for every situation."
  },

  new_student_settling: {
    keywords: ['new student', 'settling in', 'transition', 'adjustment', 'first day', 'orientation', 'buddy system', 'new admission'],
    answer: "🎒 Helping New Students Settle:\n\nWe know transitioning to boarding life can be emotional.\n\n🤝 Support System:\n✅ Buddy pairing (every new student gets a buddy)\n✅ Personal mentor assigned\n✅ Caring dorm mother\n✅ Orientation sessions\n✅ Interactive activities\n✅ Community-building programs\n\n💚 Focus: Creating a warm, inclusive environment where every child feels:\n• At home\n• Understood\n• Cared for\n\nRight from day one!"
  },

  special_needs: {
    keywords: ['special dietary', 'allergies', 'allergy', 'medical condition', 'special needs', 'dietary requirements', 'customized meal', 'food allergy', 'health condition'],
    answer: "🏥 Special Dietary & Medical Needs:\n\nEvery child's well-being is personally attended to.\n\n✅ Parents share:\n   • Medical conditions\n   • Allergies\n   • Dietary preferences\n\n👩‍⚕️ With our:\n   • Infirmary team\n   • Kitchen team\n\n🍽️ Customized Care:\n• Meals tailored individually\n• Care plans personalized\n• Same attention as at home\n\nYour daughter receives exactly what she needs!"
  },

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
    answer: `🏫 All faculty members are highly qualified professionals with CBSE teaching certifications. Many hold postgraduate degrees and have years of teaching and mentoring experience.\n🔗 Learn more: <a href='https://vantagehall.org/teachers-bio/' target='_blank'>vantagehall.org/teachers-bio</a>`
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
  answer: "📚 We follow the CBSE curriculum with a well-balanced, student-centric academic programme that encourages holistic learning and critical thinking.<br><br>🎓 Streams Offered (Classes 11-12):<br>• Science<br>• Commerce<br>• Humanities<br><br>Our curriculum emphasizes holistic development beyond textbooks, including hands-on activities, critical thinking, and creative expression. For full information, visit: <a href='https://vantagehall.org/curriculum/' target='_blank'>Curriculum</a>"
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
  answer: "📝 Admission Process:<br><br>✅ Step 1: Written Test (English, Mathematics, Science)<br>✅ Step 2: Interaction with Principal<br>✅ Step 3: Interaction with Director<br><br>📅 Registrations: September-October<br>📅 Session Starts: April<br><br>📞 Contact:<br>+91-8191912999, +91-7078311863<br>📧 admissions@vantagehall.org<br>🔗 <a href='https://vantagehall.org/admission-procedure/' target='_blank'>Admission Procedure</a> for complete details"
},


  // Documents Required
  documents: {
    keywords: ['document', 'paper', 'certificate', 'required', 'need', 'bring'],
    answer: "📄 Required Documents:\n\n• Birth Certificate & Aadhaar Card\n• Parents' Aadhaar & PAN Cards\n• Last examination mark sheet\n• Original Transfer Certificate\n• Medical Fitness Certificate\n• Student's PEN Number / APAAR ID"
  },

 // Fee Structure
fee: {
  keywords: ['fee', 'fees', 'cost', 'tuition', 'charge', 'payment', 'price'],
  answer: "💰 Fee Structure:<br><br>📌 Classes 3-7: ₹7,35,000 (Annual: ₹5,50,000 + One-time: ₹1,85,000)<br><br>📌 Classes 8-10: ₹8,35,000 (Annual: ₹6,50,000 + One-time: ₹1,85,000)<br><br>📌 Classes 11-12: ₹8,85,000 (Annual: ₹7,00,000 + One-time: ₹1,85,000)<br><br>*One-time fees include registration, joining kit, imprest deposit & admission fee.<br><br>For full details, visit: <a href='https://vantagehall.org/fee-structure/' target='_blank'>Fee Structure</a>"
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
  answer: "⚽ Sports & Athletics:<br><br>Training under qualified coaches in:<br><br>🏃‍♀️ Football, Self Defense, Basketball,<br>🎾 Squash, Badminton, Zumba Classes, Table Tennis<br>⛸️ Skating, Gymnasium, Swimming<br>♟️ Indoor Games: Chess<br><br>For full details, visit: <a href='https://vantagehall.org/sports-facilities/' target='_blank'>Sports Facilities</a>"
},


  // Clubs & Activities
clubs: {
  keywords: ['club', 'activity', 'extracurricular', 'societies', 'hobby'],
  answer: "🎨 Clubs & Societies:<br><br>• Art Club<br>• Culinary Club<br>• Dance & Music Club<br>• Theatre Club<br>• Finance & Maths Club<br>• IT Club<br>• Science Club<br>• Photography Club<br>• Sustainability Club<br>• Editorial Board<br><br>Explore more activities at: <a href='https://vantagehall.org/clubs/' target='_blank'>Clubs & Activities</a>"
},


  // Career Guidance
  career: {
    keywords: ['career', 'guidance', 'college', 'university', 'neet', 'jee', 'clat'],
    answer: "🎯 Career Guidance:\n\nWe offer counseling for Grades 8-12, including:\n\n✅ Medical (NEET)\n✅ Engineering (JEE)\n✅ Law (CLAT, AILET)\n✅ Management (IPM, NMIMS)\n✅ Design (NIFT, UCEED)\n✅ SAT & AP (foreign universities)\n\n1-on-1 guidance sessions available!"
  },

  // Contact Information
  contact: {
    keywords: ['contact', 'phone', 'email', 'address', 'reach', 'call', 'number'],
    answer: "📍 Vantage Hall Girls' Residential School\nThe Yellow Brick Road, Doonga\nDehradun - 248007, Uttarakhand\n📞 General: <a href='tel:01352776225'>0135-2776225</a>, <a href='tel:01352776226'>226</a>, <a href='tel:01352776227'>227</a>, <a href='tel:01352776228'>228</a>\n📧 <a href='mailto:info@vantagehall.org'>info@vantagehall.org</a>\n\n👤 Admissions:\n📞 <a href='tel:+918191912999'>+91-8191912999</a>, <a href='tel:+917078311863'>+91-7078311863</a>\n📧 <a href='mailto:admissions@vantagehall.org'>admissions@vantagehall.org</a>\n🔗 Contact page: <a href='https://vantagehall.org/contact-us' target='_blank'>vantagehall.org/contact-us</a>"
  },

  // ==========================================
  // IT & GADGETS POLICY SECTION (with Interactive Options)
  // ==========================================

  // 1. Internet Use & Safety - Main Entry
  internet_use_safety: {
    keywords: ['internet', 'online', 'internet safety', 'online safety', 'web safety', 'internet use', 'browsing'],
    answer: "Hi! Would you like to know how we keep students safe online?\n\nPlease choose an option:",
    hasOptions: true,
    options: [
      {
        id: 1,
        label: "🛡️ Internet Safety",
        trigger: ['1', 'internet safety', 'safety', 'safe online'],
        response: "All online sessions at school are supervised. Students use the Internet only for learning, research, and projects.\n\nWould you like to know about monitoring or safe browsing?",
        subOptions: [
          {
            id: 1,
            label: "👀 How is browsing monitored?",
            trigger: ['1', 'monitoring', 'monitored', 'track'],
            response: "We keep an eye on all online activity to make sure students stay safe. There's no expectation of privacy on school devices or Wi-Fi because safety comes first.\n\nAnything else you'd like to ask?"
          },
          {
            id: 2,
            label: "🌐 What sites are restricted?",
            trigger: ['2', 'restricted', 'blocked', 'banned sites'],
            response: "Don't worry, harmful or inappropriate websites are automatically blocked. Students cannot access unsafe or unsuitable content.\n\nWant to know about downloading rules?",
            subOptions: [
              {
                id: 1,
                label: "📥 Downloading rules",
                trigger: ['1', 'download', 'downloading rules'],
                response: "Students can't download any non-approved apps or software. This helps protect devices and ensures learning stays the focus.\n\nAnything unsafe, unnecessary, or unrelated to academics isn't allowed - including games, movies, or unknown software."
              },
              {
                id: 2,
                label: "❌ Prohibited actions",
                trigger: ['2', 'prohibited', 'not allowed'],
                response: "Prohibited actions include:\n• Downloading games or entertainment apps\n• Installing unknown software\n• Accessing blocked websites\n• Sharing login credentials\n\nThese rules help maintain a safe learning environment!"
              }
            ]
          }
        ]
      },
      {
        id: 2,
        label: "👀 Monitoring",
        trigger: ['2', 'monitoring', 'track', 'supervise'],
        response: "We keep an eye on all online activity to make sure students stay safe. There's no expectation of privacy on school devices or Wi-Fi because safety comes first.\n\nAll browsing is supervised and logged for student protection."
      },
      {
        id: 3,
        label: "🚫 Restricted Websites",
        trigger: ['3', 'restricted', 'blocked websites', 'banned'],
        response: "Don't worry, harmful or inappropriate websites are automatically blocked. Students cannot access unsafe or unsuitable content.\n\nContent filtering ensures a safe browsing environment!"
      }
    ]
  },

  // 2. Downloading & Permissions
  downloading_permissions: {
    keywords: ['download', 'install', 'app', 'software', 'permission', 'installing apps'],
    answer: "Looking for information about installing apps or software?\n\nPlease choose an option:",
    hasOptions: true,
    options: [
      {
        id: 1,
        label: "📥 Can students download apps?",
        trigger: ['1', 'can download', 'download apps', 'install apps'],
        response: "Students can't download any non-approved apps or software. This helps protect devices and ensures learning stays the focus."
      },
      {
        id: 2,
        label: "🛑 What is not allowed?",
        trigger: ['2', 'not allowed', 'prohibited', 'banned'],
        response: "Anything unsafe, unnecessary, or unrelated to academics isn't allowed - including games, movies, or unknown software.\n\nThis policy protects both students and school devices!"
      }
    ]
  },

  // 3. Gadget Use & Permissions
  gadget_use: {
    keywords: ['gadget', 'device', 'bring gadget', 'what gadgets', 'allowed gadgets', 'phone', 'laptop', 'tablet'],
    answer: "Would you like to know what gadgets students can bring?\n\nPlease choose an option:",
    hasOptions: true,
    options: [
      {
        id: 1,
        label: "📱 Mobile Phones",
        trigger: ['1', 'mobile', 'phone', 'smartphone', 'cell phone'],
        response: "Students can bring phones, but they must be submitted to the staff and are only given back during travel or approved events.\n\nThis ensures students stay focused on academics and campus activities!"
      },
      {
        id: 2,
        label: "💻 Laptops/Tablets",
        trigger: ['2', 'laptop', 'tablet', 'computer', 'ipad'],
        response: "Yes, students may bring learning devices, but they are issued only for academic work, research, and exam preparation and always with permission.\n\nDevices must be used responsibly for educational purposes only!"
      },
      {
        id: 3,
        label: "🎧 Gadgets Not Allowed",
        trigger: ['3', 'not allowed', 'prohibited', 'banned gadgets'],
        response: "Some gadgets like speakers, smartwatches, or wireless headphones are not permitted. If brought, they're taken into safe custody and not returned during the term.\n\nThey will be returned to parents at term-end only."
      }
    ]
  },

  // 4. Device Storage & Access
  device_storage_access: {
    keywords: ['device storage', 'where kept', 'device access', 'get device', 'when use device', 'device timing'],
    answer: "Want to know how devices are stored or accessed?\n\nPlease choose an option:",
    hasOptions: true,
    options: [
      {
        id: 1,
        label: "🗄️ Where are devices kept?",
        trigger: ['1', 'where kept', 'storage', 'kept where'],
        response: "Devices are stored safely with the house staff or admin team. Students are responsible for keeping their own devices in good condition.\n\nAll devices are kept in secure storage areas!"
      },
      {
        id: 2,
        label: "📝 How to get a device issued?",
        trigger: ['2', 'get device', 'issue device', 'request device'],
        response: "Devices are issued only for study purposes and only with proper permission from authorized staff. Students should request approvals in advance.\n\nProper authorization ensures responsible usage!"
      },
      {
        id: 3,
        label: "⏳ When can devices be used?",
        trigger: ['3', 'when use', 'device timing', 'usage time'],
        response: "Devices are used during approved times for academic work, research, or school activities. Not during free time, dorm hours, or without supervision.\n\nThis helps maintain a healthy balance between study and rest!"
      }
    ]
  },

  // 5. Misuse & Consequences
  misuse_consequences: {
    keywords: ['misuse', 'breaking rules', 'consequences', 'punishment', 'what happens', 'rule violation', 'disciplinary'],
    answer: "Have questions about rules or consequences?\n\nPlease choose an option:",
    hasOptions: true,
    options: [
      {
        id: 1,
        label: "⚠️ What counts as misuse?",
        trigger: ['1', 'what is misuse', 'counts as misuse', 'misuse means'],
        response: "Things like accessing unsafe sites, using gadgets without permission, downloading unapproved material, or misusing someone else's device all count as misuse.\n\nFollowing these rules keeps everyone safe!"
      },
      {
        id: 2,
        label: "🚨 What happens if rules are broken?",
        trigger: ['2', 'consequences', 'punishment', 'what happens', 'broken rules'],
        response: "Misuse can lead to withdrawal of gadget or Internet access, warnings, and further disciplinary action if needed. Safety and responsibility are priorities.\n\nWe believe in fair consequences that help students learn!"
      }
    ]
  }
};

// ==============================================
// SMART KEYWORD MATCHING FUNCTION WITH OPTIONS SUPPORT
// ==============================================
function findBestMatch(userMessage, lastTopic = null, lastOptionLevel = null) {
  const msg = userMessage.toLowerCase().trim();
  
  // If we're in an option flow (user previously selected a topic with options)
  if (lastTopic && KNOWLEDGE_BASE[lastTopic]) {
    const topicData = KNOWLEDGE_BASE[lastTopic];
    
    // Check if user is selecting an option
    if (topicData.hasOptions) {
      // Check main options
      for (const option of topicData.options) {
        for (const trigger of option.trigger) {
          if (msg === trigger.toLowerCase() || msg.includes(trigger.toLowerCase())) {
            // Check if this option has sub-options
            if (option.subOptions) {
              return {
                answer: option.response,
                topic: lastTopic,
                hasOptions: true,
                options: option.subOptions,
                optionLevel: 'sub'
              };
            }
            return {
              answer: option.response,
              topic: lastTopic,
              hasOptions: false
            };
          }
        }
      }
      
      // If we're at sub-option level, check those too
      if (lastOptionLevel === 'sub') {
        for (const mainOption of topicData.options) {
          if (mainOption.subOptions) {
            for (const subOption of mainOption.subOptions) {
              for (const trigger of subOption.trigger) {
                if (msg === trigger.toLowerCase() || msg.includes(trigger.toLowerCase())) {
                  // Check if sub-option has further sub-options
                  if (subOption.subOptions) {
                    return {
                      answer: subOption.response,
                      topic: lastTopic,
                      hasOptions: true,
                      options: subOption.subOptions,
                      optionLevel: 'deep'
                    };
                  }
                  return {
                    answer: subOption.response,
                    topic: lastTopic,
                    hasOptions: false
                  };
                }
              }
            }
          }
        }
      }
    }
  }
  
  // Regular keyword matching for initial queries
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
        matchedKeywords: matchedKeywords,
        hasOptions: data.hasOptions || false,
        options: data.options || null
      };
    }
  }
  
  if (bestMatch && bestMatch.score >= 10) {
    console.log(`✅ Best Match: ${bestMatch.topic} (Score: ${bestMatch.score})`);
    return bestMatch;
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
    message: 'Vantage Hall Chatbot API - Enhanced Version with IT & Gadgets Policy + Emotional Support',
    model: 'OpenAI GPT-4o-mini + Email Notifications',
    knowledgeBaseTopics: Object.keys(KNOWLEDGE_BASE).length,
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
// CHAT ENDPOINT WITH OPTIONS SUPPORT
// ==============================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message, lastTopic, lastOptionLevel } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    console.log(`📩 User: ${message}`);
    if (lastTopic) console.log(`📌 Context: ${lastTopic} (Level: ${lastOptionLevel || 'main'})`);

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

    // Try knowledge base first (with option support)
    const knowledgeMatch = findBestMatch(message, lastTopic, lastOptionLevel);
    
    if (knowledgeMatch) {
      console.log(`✅ Knowledge Base Match Found`);
      
      let reply = knowledgeMatch.answer;
      
      // If this response has options, format them
      if (knowledgeMatch.hasOptions && knowledgeMatch.options) {
        reply += "\n\n";
        knowledgeMatch.options.forEach(opt => {
          reply += `${opt.label}\n`;
        });
      }
      
      return res.json({ 
        success: true, 
        reply: reply,
        mode: 'knowledge-base',
        hasOptions: knowledgeMatch.hasOptions,
        options: knowledgeMatch.options || null,
        currentTopic: knowledgeMatch.topic,
        optionLevel: knowledgeMatch.optionLevel || 'main'
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
