UNCIP-APP (UNAMI NATIONAL CHILD IDENTIFICATION PROGRAM (PROGRESSIVE WEB APP)
-OPTIMIZED FOR VERCEL FREE TIER - PROVIDED  SOME  RELEVANT PROJECT FILES , .ENV.LOCAL, ETC)


🎯 App Vision & Mission
Mission: To create a secure, user-friendly mobile platform that enables rapid child identification and enhances community safety in South African townships.
Vision: A connected network of parents, schools, and authorities working together to protect every child through technology.
🎭 Target Users
👪 Parents & Guardians
Register children, update information, receive alerts, access emergency resources
🏫 Schools & Teachers
Verify student identities, report incidents, communicate with parents
👮 Authorities & NGOs
Access verified child data during emergencies, coordinate search efforts
🏘️ Community Leaders
Monitor local child safety, coordinate community responses, access resources
⚠️ Privacy First: All data encrypted, POPIA compliant, with multi-level access controls and parent consent management.
🌟 Key Benefits
• ✅ Instant Identification: Quick access to child information during emergencies
• 📱 Mobile-First Design: Works on basic smartphones, offline capability
• 🔐 Secure & Private: Bank-level security, POPIA compliance
• 🌍 Community Network: Connects families, schools, and authorities

🎯 Core Features
👤 User Management
🔐 Secure Registration
Multi-step verification process with SMS/email confirmation and document upload
👥 Role-Based Access
Different permission levels for parents, schools, authorities, and community leaders
🆔 Digital ID Verification
Integration with Home Affairs database for identity verification - NOT OUR FOCUS RIGHT NOW
👶 Child Profile Management
📋 Comprehensive Profiles
Photos, personal details, medical info, guardian contacts, school information
🔄 Real-time Updates
Instant synchronization across all authorized devices and users
🏥 Medical Integration
Critical medical information, allergies, emergency medical contacts
🚨 Emergency Features
⚡ Instant Alerts
Push notifications, SMS alerts, and email notifications for missing children
📍 Location Services
GPS integration for last known location and geofenced safe zones
🔍 Quick Search
Advanced search by photo recognition, name, ID, or physical description
🤝 Community Features
🏫 School Integration
Attendance tracking, incident reporting, parent-teacher communication
📊 Analytics Dashboard
Community safety metrics, trend analysis, and reporting tools
🎓 Educational Resources
Child safety tips, trafficking awareness content, emergency procedures
🔒 Security & Privacy Features
🔐 End-to-End Encryption👁️ POPIA Compliance🔑 Multi-Factor Authentication📱 Biometric Login🛡️ Data Minimization⏰ Auto-Logout📝 Audit Trails🚫 Screen Recording Block
Integration Requirements
📱 Third-Party Services
• SMS gateway (Clickatell/Twilio)
• Push notifications (Firebase)
• Mapping services (Google Maps)
• Photo recognition (AWS Rekognition) - COMING SOON - NOT APPLICABLE NOW

📱 Platform Support
Primary: Android (90% of SA market)
Secondary: iOS
Web: Progressive Web App - our main focus for ow
Minimum: Android 7.0+


🔧 API Development
Framework: Node.js with Express
Authentication: JWT + OAuth 2.0
Documentation: Swagger/OpenAPI
Rate Limiting: Redis-based

N.B Use firebase, FIRESTORE, ETC -  for auth and database if possible: I have a firebase account, AND GOOGLE CLOUD AND CONSOLE ACCOUNT. 

LETS CONTINUE THE BUILD - PROGRESSIVE WEB APP (NEXTJS/TYPSCRIPT)

SO FAR WE NEED TO IMPLEMENTED BASIC RBAC AND CORE FEATURES - ADMIN DASHBOARD, FULL ROLES , EMERGENCY ARLETS , ADD CHILD ,  PROVIDE MODULES FOR THEMING - , LOGIN FORMS, DASHBOARD PAGE, ETC.
PLEASE ESTABLISH A CLEAR STRATEGY AND IMPLEMENTATION PLAN TO MAKE THESTRUCTURE MORE RESILENT - SEPARATE SEVER COMPONENTS FROM CLIENT COMPONENTS, FIREBASE IS SETUP BUT NOT PRPOERLY, FIRESTRE, AUTH, ETC - DOUBLE CHECK EVERYTHING , NO DUPLICATE FILES , REFRACTOR CODE IF IT NEEDS TO BE, LETS MAKE THE APP WORK STEP BY STEP, STARTED THE PROJECT BY TEMPLATING , THE TRIED TO IMPLENT RBAC AND EMERGENCY ARLETS , ETC. LETS PUT ALL THE PAGES, FEATURES,ROLES, FUCTIONS, ETC - TOGETHER - 

AND AFTER EVERY MAJOR MILESTONE HAS BEEN CONFIRMED A SUCCESS - UPDATE THE README.MD WE NEED TO BUILD CONTEXT FOR FUTURE CHATS