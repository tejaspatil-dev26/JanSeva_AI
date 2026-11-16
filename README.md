# JanSeva AI — One-Stop Government Service Agent
> **"Your Rights. Your Benefits. One Simple Conversation."**  
> *"Don't just tell citizens what they can get. Help them get it."*

JanSeva AI is a production-grade, AI-powered GovTech application designed to bridge the gap between Indian welfare entitlements and the millions of citizens who need them. Through an empathetic, multilingual conversational interface, document intelligence OCR, and automated portal integration, JanSeva AI guides citizens from initial discovery to verified government submission.

---

## 🌟 Key Capabilities & Modules

### 1. Module A — Premium Landing Page
- Designed with high-trust Indian GovTech aesthetics: Forest Green (`#0C382E`), Saffron & Amber accents (`#D97706`), Warm Off-White (`#FAF9F5`), and high-contrast typography.
- Clear value proposition: *"Government Benefits. Made Accessible to Everyone."*
- Features section, How-It-Works timeline, verified scheme previews, DPDP Act 2023 compliance overview, and citizen FAQs.
- Prominent 1-click **"Try the Farmer's Widow Journey"** demo launcher.

### 2. Module B — Frictionless Multilingual Onboarding
- Native support for **English, Marathi (मराठी), Hindi (हिंदी), Gujarati (ગુજરાતી), Tamil (தமிழ்), Telugu (తెలుగు), and Bengali (বাংলা)**.
- 3-step profile builder: Demographics, Domicile/Location (State, District, Taluka, Village), and Socio-Economic criteria (Farmer status, Landholding acres, Income category, Social category).
- One-click test personas for rapid demonstration:
  - **Savitribai Patil**: Farmer's Widow, Pune District, Maharashtra
  - **Rameshwar Patil**: Small Landholder Farmer, Solapur District
  - **Priya Sharma**: Rural Youth / Vocational Trainee

### 3. Module C — AI Government Assistant
- **Voice & Speech-to-Text**: Speech-to-Text input using Web Speech API; Text-to-Speech voice responses in Marathi, Hindi, and English.
- **Empathetic Context Awareness**: Empathetically recognizes bereavement and farming distress; asks 2-3 focused administrative follow-up questions to confirm eligibility.
- **In-Chat Scheme Recommendations**: Direct welfare scheme cards rendered inside the chat stream with instant "Check Eligibility" and "Prepare Application" buttons.
- **Direct Document Upload**: Citizens can attach certificates directly within the conversation.

### 4. Module D — Government Scheme Discovery Engine
- Pre-seeded with verified Central and State welfare programs (e.g. *Sanjay Gandhi Niradhar Anudan Yojana, Indira Gandhi National Widow Pension, PM-KISAN Succession Transfer, Ayushman Bharat, PM Awas Yojana - Gramin, Sukanya Samriddhi*).
- Real-time multi-criteria eligibility engine evaluating age, gender, marital status, landholding, income ceiling, and document status.
- Clear eligibility classifications:
  - 🟢 **Likely Eligible (85-98%)**
  - 🟡 **Possibly Eligible (65-80%)**
  - 🔵 **More Information Required**
  - ⚪ **Not Eligible**

### 5. Module E — Smart Document Intelligence & OCR
- Secure document vault for **Death Certificates, 7/12 Land Records (Satbara Utara), Aadhaar Cards, Income Certificates, and Bank Passbooks**.
- Intelligent administrative field extraction:
  - Deceased Name, Date of Demise, Death Registration Number, Issuing Authority
  - Khata Number, Survey / Gat Number, Land Area (Acres/Guntha), Cultivation Type
  - Annual Income, Tahsildar Certificate Number, Validity Period
- **Privacy Enforcement**: Automatic masking of Aadhaar numbers (`XXXX-XXXX-1234`) on ingestion to comply with UIDAI and Digital Personal Data Protection (DPDP) Act 2023 rules.
- Inline citizen field correction interface.

### 6. Module F — Smart Application Preparation & Playwright Automation
- Reusable application preparation engine: retrieves verified scheme criteria, maps citizen demographics + OCR-extracted fields into official portal schemas.
- **Pre-Submission Review & Explicit Citizen Consent Gate**: Citizens review pre-populated fields and sign a digital declaration before any data is transmitted.
- **Playwright Browser Automation & Portal Adapter**: Connects to government portal testbeds (MahaDBT / National Citizen Services), populates DOM form inputs, attaches verified document receipts, and returns permanent official acknowledgment IDs (e.g. `MH-REV-WID-2026-53501`).

### 7. Module G — Application Tracking Dashboard
- Full lifecycle status tracking: `Draft`, `Ready for Review`, `Submitted`, `Under Verification`, `Approved`, `Rejected`.
- Department verification timeline with timestamped officer remarks.
- Next milestone indicators and printable application summary receipt.

### 8. Module H — Notification Center
- Real-time in-app alerts on status changes and document scrutiny milestones.
- Transparent simulated **WhatsApp Alert** and **GovSMS Gateway** dispatch logs showing realistic delivery receipts (`+91 98765 43210`, `Sender: GOVMAH-JS`).

### 9. Module I — Admin Dashboard & Oversight Console
- Real-time operations KPIs: Registered citizens, active schemes, applications submitted, OCR accuracy rate (96.8%), status distribution.
- Officer Application Scrutiny Queue: District officers can review dossiers and advance statuses (`Under Verification`, `Approved`) with official remarks.
- Tamper-evident Audit Trail logging every consent grant, upload, and portal transmission.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti |
| **Backend** | Python 3.14, FastAPI, Pydantic v2, SQLAlchemy, Uvicorn |
| **Database** | SQLite (zero-config local) / PostgreSQL ready |
| **Document Intelligence** | PyMuPDF (fitz), PIL, Regex & Heuristic Administrative Certificate Extractors |
| **Browser Automation** | Playwright Chromium Headless Automation & Configurable Portal Adapters |
| **AI Layer** | Multi-Provider Engine supporting Google Gemini API, OpenAI-compatible endpoints, and an Offline Context-Aware GovTech Reasoning Engine |

---

## 📂 Project Structure

```
JanSeva AI/
├── backend/
│   ├── config.py              # Configuration & settings
│   ├── database.py            # SQLAlchemy database engine
│   ├── main.py                # FastAPI entry point & SPA static file server
│   ├── seed_data.py           # Preloaded official Indian welfare schemes
│   ├── models/                # SQLAlchemy database models
│   │   ├── user.py            # User & UserProfile
│   │   ├── scheme.py          # Scheme & EligibilityRule
│   │   ├── document.py        # Document & ExtractedField
│   │   ├── application.py     # Application & ApplicationStatusHistory
│   │   ├── chat.py            # Conversation & ChatMessage
│   │   └── audit.py           # Notification & AuditLog
│   ├── schemas/               # Pydantic validation schemas
│   ├── services/              # Core business engines
│   │   ├── ai_service.py      # Conversational GovTech AI engine
│   │   ├── ocr_service.py     # Document OCR & field extractor
│   │   ├── eligibility_engine.py # Multi-criteria scheme evaluation
│   │   └── automation_service.py # Playwright portal automation runner
│   └── routers/               # API endpoints
│       ├── auth.py            # Profile & persona loading
│       ├── schemes.py         # Scheme search & eligibility check
│       ├── documents.py       # Upload & OCR extraction
│       ├── assistant.py       # Conversational AI assistant
│       ├── applications.py    # Form mapping & portal submission
│       ├── notifications.py   # In-app notifications & simulated SMS
│       ├── mock_portal.py     # MahaSeva government portal testbed
│       └── admin.py           # Metrics, officer scrutiny & audit log
├── frontend/
│   ├── index.html             # HTML root with Indian fonts
│   ├── vite.config.ts         # Vite bundler with @tailwindcss/vite
│   ├── src/
│   │   ├── main.tsx           # React DOM bootstrap
│   │   ├── App.tsx            # Root application coordinator
│   │   ├── types.ts           # Full TypeScript data definitions
│   │   ├── translations.ts    # 7 Indian languages dictionary
│   │   ├── api.ts             # REST API client
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── OnboardingModal.tsx
│   │   │   ├── DocumentUploadModal.tsx
│   │   │   └── ApplicationWizardModal.tsx
│   │   └── pages/             # Main application views
│   │       ├── LandingPage.tsx
│   │       ├── AssistantPage.tsx
│   │       ├── SchemesPage.tsx
│   │       ├── DocumentsPage.tsx
│   │       ├── ApplicationsPage.tsx
│   │       ├── NotificationsPage.tsx
│   │       ├── MockPortalPage.tsx
│   │       └── AdminPage.tsx
├── tests/
│   └── test_e2e_journey.py    # Complete 13-step Playwright automated test
├── .env.example               # Environment variables template
└── README.md                  # Comprehensive platform documentation
```

---

## 🚀 Quick Setup & Run Instructions

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Running Backend (and Serving Frontend)
```bash
# From project root:
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
Open **`http://127.0.0.1:8000/`** in your browser. The backend automatically serves the pre-built React frontend and all `/api/v1/*` endpoints.

### 3. Optional: Running Frontend in Vite Dev Mode (with Hot Reloading)
```bash
cd frontend
npm run dev
```
Open **`http://localhost:5173/`**. Vite automatically proxies API requests to `http://127.0.0.1:8000`.

---

## 🧪 Automated Testing Results

The entire citizen journey was verified using Playwright end-to-end automation (`tests/test_e2e_journey.py`):

```
--- Starting End-to-End GovTech Verification Test ---
Health check OK: Server is live.
Step 1 Passed: JanSeva AI Homepage Loaded.
Step 2 Passed: Hero Headline Verified.
Step 3 Passed: Launched Farmer's Widow Journey.
Step 4 Passed: AI Government Assistant Connected.
Step 5 Passed: Document Vault Loaded.
Step 6 Passed: Death Certificate OCR Extracted Deceased Name (Tukaram Pandurang Patil).
Step 7 Passed: 7/12 Land Record OCR Extracted Survey Number (Gat No. 204/A).
Step 8 Passed: Scheme Discovery Catalog Loaded (Sanjay Gandhi Niradhar Yojana).
Step 9 Passed: Application Preparation Wizard Opened.
Step 10 Passed: Application Successfully Submitted with Official Ack ID (MH-REV-WID-2026-XXXXX)!
Step 11 Passed: Applications Tracking Dashboard Verified!
Step 12 Passed: Official MahaSeva Testbed Gateway Verified!
Step 13 Passed: Admin Console & Audit Log Verified!

*** ALL 13 END-TO-END DEMONSTRATION STEPS PASSED SUCCESSFULLY! ***
```

---

## 🔒 Security & Privacy Guarantees

1. **Aadhaar Data Minimization**: Raw 12-digit Aadhaar numbers are never logged or stored unmasked. Masked format `XXXX-XXXX-1234` is enforced by OCR parser.
2. **Explicit Citizen Approval**: Automation is halted until the citizen reviews all pre-populated fields and checks the digital declaration.
3. **Audit Trail**: Every transaction is permanently captured with timestamp, IP address, and resource ID in the `AuditLog` table.
4. **No Middlemen**: Bypasses predatory intermediaries by linking directly to official DBT bank accounts.
