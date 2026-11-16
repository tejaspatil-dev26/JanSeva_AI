import json
from sqlalchemy.orm import Session
from .models.user import User, UserProfile
from .models.scheme import Scheme, EligibilityRule
from .models.audit import Notification, AuditLog

SEED_SCHEMES = [
    {
        "slug": "sanjay-gandhi-niradhar-anudan-yojana",
        "name": "Sanjay Gandhi Niradhar Anudan Yojana",
        "name_hi": "संजय गांधी निराधार अनुदान योजना",
        "name_mr": "संजय गांधी निराधार अनुदान योजना (महाराष्ट्र शासन)",
        "department": "Social Justice and Special Assistance Department, Maharashtra",
        "government_level": "State",
        "state": "Maharashtra",
        "category": "Pension & Social Security",
        "description": "Financial assistance program by the Government of Maharashtra providing monthly pension to destitute persons, widows, divorced women, abandoned women, and persons with disabilities to ensure a dignified life.",
        "description_hi": "महाराष्ट्र सरकार की वित्तीय सहायता योजना जो निराधार व्यक्तियों, विधवाओं और असहाय महिलाओं को सम्मानजनक जीवन के लिए मासिक पेंशन प्रदान करती है।",
        "description_mr": "निराधार व्यक्ती, अनाथ मुले, विधवा, घटस्फोटित महिला आणि दिव्यांगांना आर्थिक स्थैर्य देण्यासाठी महाराष्ट्र शासनाकडून दरमहा दिली जाणारी पेन्शन योजना.",
        "benefits": "Monthly financial pension of ₹1,500 per month deposited directly into beneficiary's bank account via DBT.",
        "financial_benefit_amount": "₹1,500 / month",
        "eligibility_summary": "Resident of Maharashtra for at least 15 years; Bereaved widow or destitute person below 65 years; Family annual income not exceeding ₹50,000.",
        "eligibility_criteria_json": {
            "state": "Maharashtra",
            "is_widow_or_destitute": True,
            "max_annual_income": 50000,
            "max_age": 65
        },
        "required_documents": [
            "Death Certificate of Spouse",
            "7/12 Land Record or Nil Land Declaration",
            "Aadhaar Card",
            "Income Certificate (Tahsildar)",
            "Domicile / Residence Certificate (15 years)",
            "Bank Passbook (Aadhaar linked)"
        ],
        "application_procedure": "Submit application online through MahaDBT / MahaSeva portal or at Taluka Tahsildar / Setu Kendra. Document verification followed by Sanction Committee approval.",
        "official_portal_url": "https://mahadbt.maharashtra.gov.in/",
        "portal_adapter_key": "mahaseva_widow_adapter",
        "last_verified_date": "2026-03-01",
        "rules": [
            {"criterion_type": "state", "operator": "==", "target_value": "Maharashtra", "explanation": "Must be a resident of Maharashtra state"},
            {"criterion_type": "is_widow", "operator": "==", "target_value": "True", "explanation": "Applicant must be a widow, destitute, or abandoned woman"},
            {"criterion_type": "max_income", "operator": "<=", "target_value": "50000", "explanation": "Annual household income must be at or below ₹50,000"}
        ]
    },
    {
        "slug": "indira-gandhi-widow-pension",
        "name": "Indira Gandhi National Widow Pension Scheme (IGNWPS)",
        "name_hi": "इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना",
        "name_mr": "इंदिरा गांधी राष्ट्रीय विधवा निवृत्तीवेतन योजना",
        "department": "Ministry of Rural Development, Government of India",
        "government_level": "Central",
        "state": None,
        "category": "Pension & Social Security",
        "description": "Centrally sponsored social assistance scheme under the National Social Assistance Programme (NSAP) providing social security pensions to widows living below the poverty line.",
        "description_hi": "राष्ट्रीय सामाजिक सहायता कार्यक्रम (NSAP) के तहत गरीबी रेखा से नीचे (BPL) जीवन यापन करने वाली विधवाओं के लिए केंद्र सरकार की मासिक पेंशन योजना।",
        "description_mr": "दारिद्र्य रेषेखालील (BPL) विधवा महिलांना आर्थिक संरक्षण देण्यासाठी भारत सरकारची राष्ट्रीय सामाजिक सहाय्य योजना.",
        "benefits": "Monthly pension of ₹300 to ₹1,000 per month (combined Central + State contribution) credited directly to bank account.",
        "financial_benefit_amount": "₹300 - ₹1,000 / month",
        "eligibility_summary": "Widows aged between 40 and 79 years belonging to a household living below the poverty line (BPL).",
        "eligibility_criteria_json": {
            "is_widow": True,
            "min_age": 40,
            "max_age": 79,
            "income_category": "BPL"
        },
        "required_documents": [
            "Death Certificate of Husband",
            "Aadhaar Card",
            "BPL Ration Card / Income Certificate",
            "Age Proof",
            "Bank Passbook"
        ],
        "application_procedure": "Apply online at nsap.nic.in or through Gram Panchayat / Municipal Ward Office. Verified by Village Level Worker and approved by Sub-Divisional Officer.",
        "official_portal_url": "https://nsap.nic.in/",
        "portal_adapter_key": "nsap_central_adapter",
        "last_verified_date": "2026-02-15",
        "rules": [
            {"criterion_type": "is_widow", "operator": "==", "target_value": "True", "explanation": "Applicant must be a widow"},
            {"criterion_type": "age_min", "operator": ">=", "target_value": "40", "explanation": "Minimum age is 40 years"},
            {"criterion_type": "age_max", "operator": "<=", "target_value": "79", "explanation": "Maximum age is 79 years (converts to old age pension at 80)"}
        ]
    },
    {
        "slug": "pm-kisan-succession-transfer",
        "name": "PM-KISAN Heirship & Succession Benefit Transfer",
        "name_hi": "पीएम किसान उत्तराधिकार / वारिस सम्मान निधि अंतरण",
        "name_mr": "पी.एम. किसान वारस हक्क नोंद व सन्मान निधी हस्तांतरण",
        "department": "Ministry of Agriculture and Farmers Welfare, Government of India",
        "government_level": "Central",
        "state": None,
        "category": "Agriculture",
        "description": "Enables legal heirs (widow / children) of deceased PM-KISAN beneficiary farmers to register succession on land records and seamlessly transfer ongoing PM-KISAN direct income benefits to their name.",
        "description_hi": "दिवंगत किसान लाभार्थियों के वारिसों (विधवा/बच्चों) के लिए जमीन के रिकॉर्ड पर नाम दर्ज करवाकर पीएम किसान सम्मान निधि का लाभ अपने नाम जारी रखने की विशेष प्रक्रिया।",
        "description_mr": "दिवंगत शेतकरी लाभार्थींच्या वारसांना (विधवा पत्नी/मुलांना) जमीन महसूल अभिलेखात वारस नोंद करून पीएम किसानचा ₹६,००० वार्षिक हप्ता सुरू ठेवण्याची सुविधा.",
        "benefits": "₹6,000 per year paid in three equal 4-monthly installments of ₹2,000 directly into Aadhaar-seeded bank account.",
        "financial_benefit_amount": "₹6,000 / year",
        "eligibility_summary": "Legal heir (surviving spouse/dependent) of a deceased registered farmer holding cultivable agricultural land.",
        "eligibility_criteria_json": {
            "is_farmer": True,
            "has_cultivable_land": True,
            "is_heir_of_deceased_farmer": True
        },
        "required_documents": [
            "Death Certificate of Deceased Farmer",
            "Updated 7/12 Land Record (Satbara) with Heir Entry (Ferd)",
            "Aadhaar Card of Heir / Widow",
            "Bank Account linked with Aadhaar",
            "Family Heirship / Pedigree Tree (Vanshavali)"
        ],
        "application_procedure": "Submit heirship mutation at Talathi office, then file PM-KISAN update on pmkisan.gov.in portal. Approval by District Agriculture Officer.",
        "official_portal_url": "https://pmkisan.gov.in/",
        "portal_adapter_key": "pmkisan_adapter",
        "last_verified_date": "2026-03-01",
        "rules": [
            {"criterion_type": "is_farmer", "operator": "==", "target_value": "True", "explanation": "Applicant or family must hold agricultural land"},
            {"criterion_type": "landholding", "operator": ">=", "target_value": "0.1", "explanation": "Must hold cultivable land"}
        ]
    },
    {
        "slug": "national-family-benefit-scheme",
        "name": "National Family Benefit Scheme (NFBS)",
        "name_hi": "राष्ट्रीय पारिवारिक लाभ योजना (NFBS)",
        "name_mr": "राष्ट्रीय कुटुंब लाभ योजना (NFBS)",
        "department": "Ministry of Rural Development & State Social Welfare Departments",
        "government_level": "Central",
        "state": None,
        "category": "Social Welfare",
        "description": "Provides one-time lump-sum financial assistance to bereaved BPL families upon the demise of the primary breadwinner (male or female) aged between 18 and 59 years.",
        "description_hi": "परिवार के मुख्य कमाने वाले व्यक्ति (18 से 59 वर्ष) की मृत्यु होने पर शोकग्रस्त बीपीएल परिवार को एकमुश्त ₹20,000 की वित्तीय सहायता।",
        "description_mr": "कुटुंबातील १८ ते ५९ वयोगटातील प्रमुख कमावत्या व्यक्तीच्या निधनानंतर दारिद्र्यरेषेखालील कुटुंबाला एकरकमी ₹२०,००० तातडीचे आर्थिक साहाय्य.",
        "benefits": "One-time lump-sum grant of ₹20,000 directly to the surviving spouse / head of household.",
        "financial_benefit_amount": "₹20,000 one-time",
        "eligibility_summary": "Death of primary breadwinner aged 18-59 years; Household classified as BPL or low-income.",
        "eligibility_criteria_json": {
            "breadwinner_demise": True,
            "breadwinner_age_min": 18,
            "breadwinner_age_max": 59,
            "income_category": "BPL"
        },
        "required_documents": [
            "Death Certificate of Primary Breadwinner",
            "Age Proof of Deceased",
            "BPL Ration Card or Income Certificate",
            "Aadhaar Card of Surviving Spouse",
            "Bank Passbook"
        ],
        "application_procedure": "Apply within 6 months of demise through Tahsildar / Taluka Social Welfare Officer.",
        "official_portal_url": "https://nsap.nic.in/",
        "portal_adapter_key": "nfbs_adapter",
        "last_verified_date": "2026-02-20",
        "rules": [
            {"criterion_type": "breadwinner_demise", "operator": "==", "target_value": "True", "explanation": "Primary breadwinner must have passed away"}
        ]
    },
    {
        "slug": "pm-kisan-samman-nidhi",
        "name": "PM-KISAN Samman Nidhi",
        "name_hi": "प्रधानमंत्री किसान सम्मान निधि",
        "name_mr": "प्रधानमंत्री किसान सन्मान निधी योजना",
        "department": "Ministry of Agriculture and Farmers Welfare",
        "government_level": "Central",
        "state": None,
        "category": "Agriculture",
        "description": "Direct income support of ₹6,000 per year to all landholding farmer families across India having cultivable agricultural land.",
        "description_hi": "देश भर के सभी भूमिधारक किसान परिवारों को सालाना ₹6,000 की प्रत्यक्ष आय सहायता।",
        "description_mr": "शेतजमीन असणाऱ्या सर्व शेतकरी कुटुंबांना केंद्र सरकारकडून दरवर्षी ₹६,००० थेट बँक खात्यात आर्थिक सहाय्य.",
        "benefits": "₹6,000 annually credited in 3 equal installments of ₹2,000 every 4 months via Direct Benefit Transfer.",
        "financial_benefit_amount": "₹6,000 / year",
        "eligibility_summary": "All landholding farmer families with cultivable land parcels in their names. Institutional landholders and high-income tax filers excluded.",
        "eligibility_criteria_json": {
            "is_farmer": True,
            "has_cultivable_land": True
        },
        "required_documents": [
            "7/12 Land Record (Satbara) / ROR Land Document",
            "Aadhaar Card (Mandatory)",
            "Active Bank Account with Aadhaar eKYC",
            "Mobile Number linked to Aadhaar"
        ],
        "application_procedure": "Register at pmkisan.gov.in (New Farmer Registration) or CSC Centers. Land verified by State Revenue Department.",
        "official_portal_url": "https://pmkisan.gov.in/",
        "portal_adapter_key": "pmkisan_adapter",
        "last_verified_date": "2026-03-01",
        "rules": [
            {"criterion_type": "is_farmer", "operator": "==", "target_value": "True", "explanation": "Must be an active landholder farmer"}
        ]
    },
    {
        "slug": "ayushman-bharat-pmjay",
        "name": "Ayushman Bharat - PM Jan Arogya Yojana (AB-PMJAY)",
        "name_hi": "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना",
        "name_mr": "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना",
        "department": "National Health Authority, Ministry of Health and Family Welfare",
        "government_level": "Central",
        "state": None,
        "category": "Healthcare",
        "description": "World's largest government-funded healthcare assurance scheme providing cashless hospitalisation cover of up to ₹5,00,000 per family per year.",
        "description_hi": "प्रति परिवार प्रति वर्ष ₹5,00,000 तक का मुफ्त कैशलेस स्वास्थ्य बीमा और अस्पताल में इलाज की सुविधा।",
        "description_mr": "पात्र कुटुंबांना दरवर्षी ₹५ लाखांपर्यंत मोफत व कॅशलेस वैद्यकीय उपचारांची सुविधा देणारी आरोग्य योजना.",
        "benefits": "Cashless in-patient secondary and tertiary healthcare coverage up to ₹5,00,000 per family per year at public and empaneled private hospitals.",
        "financial_benefit_amount": "₹5,00,000 / year health cover",
        "eligibility_summary": "Households identified under SECC 2011 deprivation criteria, active NFSA ration card holders, and senior citizens aged 70+.",
        "eligibility_criteria_json": {
            "has_ration_card": True,
            "income_category": "BPL"
        },
        "required_documents": [
            "Aadhaar Card of all family members",
            "Ration Card (Yellow / Orange / BPL)",
            "Mobile number linked to Aadhaar"
        ],
        "application_procedure": "Check eligibility at beneficiary.nha.gov.in, complete eKYC, and instantly download Ayushman Card.",
        "official_portal_url": "https://beneficiary.nha.gov.in/",
        "portal_adapter_key": "pmjay_adapter",
        "last_verified_date": "2026-02-28",
        "rules": [
            {"criterion_type": "has_ration_card", "operator": "==", "target_value": "True", "explanation": "Requires active Ration Card"}
        ]
    },
    {
        "slug": "pm-awas-yojana-gramin",
        "name": "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
        "name_hi": "प्रधानमंत्री आवास योजना - ग्रामीण",
        "name_mr": "प्रधानमंत्री आवास योजना - ग्रामीण",
        "department": "Ministry of Rural Development",
        "government_level": "Central",
        "state": None,
        "category": "Housing",
        "description": "Provides financial grant to houseless villagers and families living in kutcha or dilapidated houses to construct pucca houses with hygienic facilities.",
        "description_hi": "ग्रामीण क्षेत्रों में बेघर और कच्चे मकानों में रहने वाले परिवारों को पक्का मकान बनाने के लिए ₹1.20 लाख से ₹1.30 लाख की वित्तीय सहायता।",
        "description_mr": "ग्रामीण भागातील बेघर आणि कच्च्या घरात राहणाऱ्या कुटुंबांना हक्काचे पक्के घर बांधण्यासाठी आर्थिक अनुदान.",
        "benefits": "Financial assistance of ₹1,20,000 in plains and ₹1,30,000 in hilly/difficult areas, plus 90-95 days of unskilled wage labor under MGNREGA.",
        "financial_benefit_amount": "₹1,20,000 grant",
        "eligibility_summary": "Rural families without a pucca house in their name anywhere in India.",
        "eligibility_criteria_json": {
            "is_houseless": True,
            "rural_resident": True
        },
        "required_documents": [
            "Aadhaar Card",
            "Job Card / MGNREGA registration",
            "Bank Passbook",
            "Site photograph and Land document"
        ],
        "application_procedure": "Selection through Gram Sabha prioritization based on Awaas+ 2024 verification.",
        "official_portal_url": "https://pmayg.nic.in/",
        "portal_adapter_key": "pmay_adapter",
        "last_verified_date": "2026-02-10",
        "rules": [
            {"criterion_type": "rural_resident", "operator": "==", "target_value": "True", "explanation": "Must reside in rural village"}
        ]
    },
    {
        "slug": "sukanya-samriddhi-yojana",
        "name": "Sukanya Samriddhi Yojana (SSY)",
        "name_hi": "सुकन्या समृद्धि योजना",
        "name_mr": "सुकन्या समृद्धी योजना",
        "department": "Ministry of Finance & Department of Posts",
        "government_level": "Central",
        "state": None,
        "category": "Women & Child Development",
        "description": "Government-backed savings scheme for girl children offering attractive government interest rates (8.2%) and full tax exemption under Beti Bachao Beti Padhao initiative.",
        "description_hi": "बालिकाओं के उज्ज्वल भविष्य और शिक्षा हेतु भारत सरकार की उच्च ब्याज दर वाली छोटी बचत योजना।",
        "description_mr": "मुलींच्या उच्च शिक्षण आणि विवाहासाठी सुरक्षित भविष्य घडवणारी उच्च परताव्याची शासनमान्य योजना.",
        "benefits": "High annual compound interest (8.2% p.a.), exempt from income tax (EEE status), matures at girl's age 21.",
        "financial_benefit_amount": "8.2% guaranteed returns",
        "eligibility_summary": "Girl child aged up to 10 years; Account opened by parents / legal guardian.",
        "eligibility_criteria_json": {
            "has_girl_child": True,
            "child_age_max": 10
        },
        "required_documents": [
            "Birth Certificate of Girl Child",
            "Aadhaar / ID Proof of Parent/Guardian",
            "Address Proof"
        ],
        "application_procedure": "Open account at any India Post Office or commercial bank branch.",
        "official_portal_url": "https://www.indiapost.gov.in/",
        "portal_adapter_key": "ssy_adapter",
        "last_verified_date": "2026-03-01",
        "rules": [
            {"criterion_type": "has_girl_child", "operator": "==", "target_value": "True", "explanation": "Must have daughter under 10 years"}
        ]
    }
]

def seed_database(db: Session):
    # Check if schemes already exist
    existing_count = db.query(Scheme).count()
    if existing_count == 0:
        for s_data in SEED_SCHEMES:
            rules_data = s_data.pop("rules", [])
            scheme = Scheme(**s_data)
            db.add(scheme)
            db.flush()
            for r in rules_data:
                rule = EligibilityRule(scheme_id=scheme.id, **r)
                db.add(rule)
        db.commit()

    # Seed Default User: Savitribai Patil (Farmer's Widow demo persona)
    default_user = db.query(User).filter(User.phone == "9876543210").first()
    if not default_user:
        user = User(
            phone="9876543210",
            email="savitri.patil@janseva.gov.demo",
            full_name="Savitribai Tukaram Patil",
            role="citizen",
            preferred_language="mr"
        )
        db.add(user)
        db.flush()

        profile = UserProfile(
            user_id=user.id,
            age=47,
            gender="Female",
            marital_status="Widow",
            state="Maharashtra",
            district="Pune",
            taluka_or_subdistrict="Haveli",
            village_or_city="Ambegaon",
            pincode="411046",
            occupation="Small Agricultural Farmer",
            is_farmer=True,
            land_holding_acres="4.32",
            annual_income=48000,
            income_category="BPL",
            social_category="OBC",
            has_disability=False,
            is_widow=True,
            deceased_spouse_name="Late Tukaram Pandurang Patil",
            date_of_spouse_demise="14/10/2025",
            dependents_count=2,
            has_bank_account=True,
            bank_name="State Bank of India",
            account_number_masked="XXXX-XXXX-8921",
            ifsc_code="SBIN0004123"
        )
        db.add(profile)

        # Welcome notification
        notif = Notification(
            user_id=user.id,
            title="Welcome to JanSeva AI",
            message="Your citizen profile is initialized. Ask our AI Assistant about widow pensions and agricultural benefits in Marathi, Hindi, or English.",
            notification_type="info",
            category="system",
            sent_in_app=True,
            sent_whatsapp=True,
            whatsapp_status="simulated_delivered"
        )
        db.add(notif)
        db.commit()

    # Seed Admin User
    admin_user = db.query(User).filter(User.phone == "9999999999").first()
    if not admin_user:
        admin = User(
            phone="9999999999",
            email="admin@janseva.gov.in",
            full_name="JanSeva District Administrative Officer",
            role="admin",
            preferred_language="en"
        )
        db.add(admin)
        db.commit()
