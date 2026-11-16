import { Scheme, User, DocumentItem, Application, NotificationItem, ChatMessage, ExtractedField } from './types';

export const DEFAULT_SCHEMES: Scheme[] = [
  {
    id: 1,
    slug: 'sanjay-gandhi-niradhar-anudan-yojana',
    name: 'Sanjay Gandhi Niradhar Anudan Yojana',
    name_hi: 'संजय गांधी निराधार अनुदान योजना',
    name_mr: 'संजय गांधी निराधार अनुदान योजना (महाराष्ट्र शासन)',
    department: 'Social Justice and Special Assistance Department, Maharashtra',
    government_level: 'State',
    state: 'Maharashtra',
    category: 'Pension & Social Security',
    description: 'Financial assistance program by the Government of Maharashtra providing monthly pension to destitute persons, widows, divorced women, abandoned women, and persons with disabilities to ensure a dignified life.',
    description_hi: 'महाराष्ट्र सरकार की वित्तीय सहायता योजना जो निराधार व्यक्तियों, विधवाओं और असहाय महिलाओं को सम्मानजनक जीवन के लिए मासिक पेंशन प्रदान करती है।',
    description_mr: 'निराधार व्यक्ती, अनाथ मुले, विधवा, घटस्फोटित महिला आणि दिव्यांगांना आर्थिक स्थैर्य देण्यासाठी महाराष्ट्र शासनाकडून दरमहा दिली जाणारी पेन्शन योजना.',
    benefits: 'Monthly financial pension of ₹1,500 per month deposited directly into beneficiary bank account via DBT.',
    financial_benefit_amount: '₹1,500 / month',
    eligibility_summary: 'Resident of Maharashtra for at least 15 years; Bereaved widow or destitute person below 65 years; Family annual income not exceeding ₹50,000.',
    required_documents: [
      'Death Certificate of Spouse',
      '7/12 Land Record or Nil Land Declaration',
      'Aadhaar Card',
      'Income Certificate (Tahsildar)',
      'Domicile / Residence Certificate (15 years)',
      'Bank Passbook (Aadhaar linked)'
    ],
    application_procedure: 'Submit application online through MahaDBT / MahaSeva portal or at Taluka Tahsildar / Setu Kendra. Document verification followed by Sanction Committee approval.',
    official_portal_url: 'https://mahadbt.maharashtra.gov.in/',
    last_verified_date: '2026-03-01',
    is_active: true,
    eligibility_status: 'Likely Eligible',
    match_score: 96,
    satisfied_criteria: [
      'Resident of Maharashtra verified',
      'Bereaved widow applicant identified',
      'Annual household income below ₹50,000 ceiling'
    ],
    missing_criteria: []
  },
  {
    id: 2,
    slug: 'indira-gandhi-widow-pension',
    name: 'Indira Gandhi National Widow Pension Scheme (IGNWPS)',
    name_hi: 'इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना',
    name_mr: 'इंदिरा गांधी राष्ट्रीय विधवा निवृत्तीवेतन योजना',
    department: 'Ministry of Rural Development, Government of India',
    government_level: 'Central',
    state: undefined,
    category: 'Pension & Social Security',
    description: 'Centrally sponsored social assistance scheme under the National Social Assistance Programme (NSAP) providing social security pensions to widows living below the poverty line.',
    description_hi: 'राष्ट्रीय सामाजिक सहायता कार्यक्रम (NSAP) के तहत गरीबी रेखा से नीचे (BPL) जीवन यापन करने वाली विधवाओं के लिए केंद्र सरकार की मासिक पेंशन योजना।',
    description_mr: 'दारिद्र्य रेषेखालील (BPL) विधवा महिलांना आर्थिक संरक्षण देण्यासाठी भारत सरकारची राष्ट्रीय सामाजिक सहाय्य योजना.',
    benefits: 'Monthly pension of ₹300 to ₹1,000 per month (combined Central + State contribution) credited directly to bank account.',
    financial_benefit_amount: '₹300 - ₹1,000 / month',
    eligibility_summary: 'Widows aged between 40 and 79 years belonging to a household living below the poverty line (BPL).',
    required_documents: [
      'Death Certificate of Husband',
      'Aadhaar Card',
      'BPL Ration Card / Income Certificate',
      'Age Proof',
      'Bank Passbook'
    ],
    application_procedure: 'Apply online at nsap.nic.in or through Gram Panchayat / Municipal Ward Office. Verified by Village Level Worker and approved by Sub-Divisional Officer.',
    official_portal_url: 'https://nsap.nic.in/',
    last_verified_date: '2026-02-15',
    is_active: true,
    eligibility_status: 'Likely Eligible',
    match_score: 92,
    satisfied_criteria: [
      'Widow applicant aged 47 (qualifies within 40-79 window)',
      'BPL family status verified'
    ],
    missing_criteria: []
  },
  {
    id: 3,
    slug: 'pm-kisan-succession-transfer',
    name: 'PM-KISAN Heirship & Succession Benefit Transfer',
    name_hi: 'पीएम किसान उत्तराधिकार / वारिस सम्मान निधि अंतरण',
    name_mr: 'पी.एम. किसान वारस हक्क नोंद व सन्मान निधी हस्तांतरण',
    department: 'Ministry of Agriculture and Farmers Welfare, Government of India',
    government_level: 'Central',
    state: undefined,
    category: 'Agriculture',
    description: 'Enables legal heirs (widow / children) of deceased PM-KISAN beneficiary farmers to register succession on land records and seamlessly transfer ongoing PM-KISAN direct income benefits to their name.',
    description_hi: 'दिवंगत किसान लाभार्थियों के वारिसों (विधवा/बच्चों) के लिए जमीन के रिकॉर्ड पर नाम दर्ज करवाकर पीएम किसान सम्मान निधि का लाभ अपने नाम जारी रखने की विशेष प्रक्रिया।',
    description_mr: 'दिवंगत शेतकरी लाभार्थींच्या वारसांना (विधवा पत्नी/मुलांना) जमीन महसूल अभिलेखात वारस नोंद करून पीएम किसानचा ₹६,००० वार्षिक हप्ता सुरू ठेवण्याची सुविधा.',
    benefits: '₹6,000 per year paid in three equal 4-monthly installments of ₹2,000 directly into Aadhaar-seeded bank account.',
    financial_benefit_amount: '₹6,000 / year',
    eligibility_summary: 'Legal heir (surviving spouse/dependent) of a deceased registered farmer holding cultivable agricultural land.',
    required_documents: [
      'Death Certificate of Deceased Farmer',
      'Updated 7/12 Land Record (Satbara) with Heir Entry (Ferd)',
      'Aadhaar Card of Heir / Widow',
      'Bank Account linked with Aadhaar',
      'Family Heirship / Pedigree Tree (Vanshavali)'
    ],
    application_procedure: 'Submit heirship mutation at Talathi office, then file PM-KISAN update on pmkisan.gov.in portal. Approval by District Agriculture Officer.',
    official_portal_url: 'https://pmkisan.gov.in/',
    last_verified_date: '2026-03-01',
    is_active: true,
    eligibility_status: 'Likely Eligible',
    match_score: 95,
    satisfied_criteria: [
      '7/12 Land Record (4.32 Acres) verified',
      'Surviving spouse identified on inheritance record'
    ],
    missing_criteria: []
  },
  {
    id: 4,
    slug: 'national-family-benefit-scheme',
    name: 'National Family Benefit Scheme (NFBS)',
    name_hi: 'राष्ट्रीय पारिवारिक लाभ योजना (NFBS)',
    name_mr: 'राष्ट्रीय कुटुंब लाभ योजना (NFBS)',
    department: 'Ministry of Rural Development & State Social Welfare Departments',
    government_level: 'Central',
    state: undefined,
    category: 'Social Welfare',
    description: 'Provides one-time lump-sum financial assistance to bereaved BPL families upon the demise of the primary breadwinner (male or female) aged between 18 and 59 years.',
    description_hi: 'परिवार के मुख्य कमाने वाले व्यक्ति (18 से 59 वर्ष) की मृत्यु होने पर शोकग्रस्त बीपीएल परिवार को एकमुश्त ₹20,000 की वित्तीय सहायता।',
    description_mr: 'कुटुंबातील १८ ते ५९ वयोगटातील प्रमुख कमावत्या व्यक्तीच्या निधनानंतर दारिद्र्यरेषेखालील कुटुंबाला एकरकमी ₹२०,००० तातडीचे आर्थिक साहाय्य.',
    benefits: 'One-time lump-sum grant of ₹20,000 directly to the surviving spouse / head of household.',
    financial_benefit_amount: '₹20,000 one-time',
    eligibility_summary: 'Death of primary breadwinner aged 18-59 years; Household classified as BPL or low-income.',
    required_documents: [
      'Death Certificate of Primary Breadwinner',
      'Age Proof of Deceased',
      'BPL Ration Card or Income Certificate',
      'Aadhaar Card of Surviving Spouse',
      'Bank Passbook'
    ],
    application_procedure: 'Apply within 6 months of demise through Tahsildar / Taluka Social Welfare Officer.',
    official_portal_url: 'https://nsap.nic.in/',
    last_verified_date: '2026-02-20',
    is_active: true,
    eligibility_status: 'Likely Eligible',
    match_score: 88,
    satisfied_criteria: [
      'Demise of primary farmer breadwinner established',
      'Deceased age at demise was within 18-59 window'
    ],
    missing_criteria: []
  },
  {
    id: 5,
    slug: 'pm-kisan-samman-nidhi',
    name: 'PM-KISAN Samman Nidhi',
    name_hi: 'प्रधानमंत्री किसान सम्मान निधि',
    name_mr: 'प्रधानमंत्री किसान सन्मान निधी योजना',
    department: 'Ministry of Agriculture and Farmers Welfare',
    government_level: 'Central',
    state: undefined,
    category: 'Agriculture',
    description: 'Direct income support of ₹6,000 per year to all landholding farmer families across India having cultivable agricultural land.',
    description_hi: 'देश भर के सभी भूमिधारक किसान परिवारों को सालाना ₹6,000 की प्रत्यक्ष आय सहायता।',
    description_mr: 'शेतजमीन असणाऱ्या सर्व शेतकरी कुटुंबांना केंद्र सरकारकडून दरवर्षी ₹६,००० थेट बँक खात्यात आर्थिक सहाय्य.',
    benefits: '₹6,000 annually credited in 3 equal installments of ₹2,000 every 4 months via Direct Benefit Transfer.',
    financial_benefit_amount: '₹6,000 / year',
    eligibility_summary: 'All landholding farmer families with cultivable land parcels in their names. Institutional landholders and high-income tax filers excluded.',
    required_documents: [
      '7/12 Land Record (Satbara) / ROR Land Document',
      'Aadhaar Card (Mandatory)',
      'Active Bank Account with Aadhaar eKYC',
      'Mobile Number linked to Aadhaar'
    ],
    application_procedure: 'Register at pmkisan.gov.in (New Farmer Registration) or CSC Centers. Land verified by State Revenue Department.',
    official_portal_url: 'https://pmkisan.gov.in/',
    last_verified_date: '2026-03-01',
    is_active: true,
    eligibility_status: 'Possibly Eligible',
    match_score: 78,
    satisfied_criteria: ['Family owns cultivable agricultural land'],
    missing_criteria: ['Requires mutation entry of legal heir in revenue record']
  },
  {
    id: 6,
    slug: 'ayushman-bharat-pmjay',
    name: 'Ayushman Bharat - PM Jan Arogya Yojana (AB-PMJAY)',
    name_hi: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना',
    name_mr: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना',
    department: 'National Health Authority, Ministry of Health and Family Welfare',
    government_level: 'Central',
    state: undefined,
    category: 'Healthcare',
    description: 'World\'s largest government-funded healthcare assurance scheme providing cashless hospitalisation cover of up to ₹5,00,000 per family per year.',
    description_hi: 'प्रति परिवार प्रति वर्ष ₹5,00,000 तक का मुफ्त कैशलेस स्वास्थ्य बीमा और अस्पताल में इलाज की सुविधा।',
    description_mr: 'पात्र कुटुंबांना दरवर्षी ₹५ लाखांपर्यंत मोफत व कॅशलेस वैद्यकीय उपचारांची सुविधा देणारी आरोग्य योजना.',
    benefits: 'Cashless in-patient secondary and tertiary healthcare coverage up to ₹5,00,000 per family per year at public and empaneled private hospitals.',
    financial_benefit_amount: '₹5,00,000 / year health cover',
    eligibility_summary: 'Households identified under SECC 2011 deprivation criteria, active NFSA ration card holders, and senior citizens aged 70+.',
    required_documents: [
      'Aadhaar Card of all family members',
      'Ration Card (Yellow / Orange / BPL)',
      'Mobile number linked to Aadhaar'
    ],
    application_procedure: 'Check eligibility at beneficiary.nha.gov.in, complete eKYC, and instantly download Ayushman Card.',
    official_portal_url: 'https://beneficiary.nha.gov.in/',
    last_verified_date: '2026-02-28',
    is_active: true,
    eligibility_status: 'Likely Eligible',
    match_score: 94,
    satisfied_criteria: ['BPL / Antyodaya ration card category verified'],
    missing_criteria: []
  },
  {
    id: 7,
    slug: 'pm-awas-yojana-gramin',
    name: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G)',
    name_hi: 'प्रधानमंत्री आवास योजना - ग्रामीण',
    name_mr: 'प्रधानमंत्री आवास योजना - ग्रामीण',
    department: 'Ministry of Rural Development',
    government_level: 'Central',
    state: undefined,
    category: 'Housing',
    description: 'Provides financial grant to houseless villagers and families living in kutcha or dilapidated houses to construct pucca houses with hygienic facilities.',
    description_hi: 'ग्रामीण क्षेत्रों में बेघर और कच्चे मकानों में रहने वाले परिवारों को पक्का मकान बनाने के लिए ₹1.20 लाख से ₹1.30 लाख की वित्तीय सहायता।',
    description_mr: 'ग्रामीण भागातील बेघर आणि कच्च्या घरात राहणाऱ्या कुटुंबांना हक्काचे पक्के घर बांधण्यासाठी आर्थिक अनुदान.',
    benefits: 'Financial assistance of ₹1,20,000 in plains and ₹1,30,000 in hilly/difficult areas, plus 90-95 days of unskilled wage labor under MGNREGA.',
    financial_benefit_amount: '₹1,20,000 grant',
    eligibility_summary: 'Rural families without a pucca house in their name anywhere in India.',
    required_documents: [
      'Aadhaar Card',
      'Job Card / MGNREGA registration',
      'Bank Passbook',
      'Site photograph and Land document'
    ],
    application_procedure: 'Selection through Gram Sabha prioritization based on Awaas+ 2024 verification.',
    official_portal_url: 'https://pmayg.nic.in/',
    last_verified_date: '2026-02-10',
    is_active: true,
    eligibility_status: 'Possibly Eligible',
    match_score: 70,
    satisfied_criteria: ['Resident in rural village'],
    missing_criteria: ['Gram Sabha verification report needed']
  },
  {
    id: 8,
    slug: 'sukanya-samriddhi-yojana',
    name: 'Sukanya Samriddhi Yojana (SSY)',
    name_hi: 'सुकन्या समृद्धि योजना',
    name_mr: 'सुकन्या समृद्धी योजना',
    department: 'Ministry of Finance & Department of Posts',
    government_level: 'Central',
    state: undefined,
    category: 'Women & Child Development',
    description: 'Government-backed savings scheme for girl children offering attractive government interest rates (8.2%) and full tax exemption under Beti Bachao Beti Padhao initiative.',
    description_hi: 'बालिकाओं के उज्ज्वल भविष्य और शिक्षा हेतु भारत सरकार की उच्च ब्याज दर वाली छोटी बचत योजना।',
    description_mr: 'मुलींच्या उच्च शिक्षण आणि विवाहासाठी सुरक्षित भविष्य घडवणारी उच्च परताव्याची शासनमान्य योजना.',
    benefits: 'High annual compound interest (8.2% p.a.), exempt from income tax (EEE status), matures at girl\'s age 21.',
    financial_benefit_amount: '8.2% guaranteed returns',
    eligibility_summary: 'Girl child aged up to 10 years; Account opened by parents / legal guardian.',
    required_documents: [
      'Birth Certificate of Girl Child',
      'Aadhaar / ID Proof of Parent/Guardian',
      'Address Proof'
    ],
    application_procedure: 'Open account at any India Post Office or commercial bank branch.',
    official_portal_url: 'https://www.indiapost.gov.in/',
    last_verified_date: '2026-03-01',
    is_active: true,
    eligibility_status: 'More Information Required',
    match_score: 55,
    satisfied_criteria: [],
    missing_criteria: ['Details on girl child age and birth certificate required']
  }
];

export const DEFAULT_USER: User = {
  id: 1,
  phone: '9876543210',
  email: 'savitri.patil@janseva.gov.demo',
  full_name: 'Savitribai Tukaram Patil',
  role: 'citizen',
  preferred_language: 'mr',
  is_active: true,
  profile: {
    id: 1,
    user_id: 1,
    age: 47,
    gender: 'Female',
    marital_status: 'Widow',
    state: 'Maharashtra',
    district: 'Pune',
    taluka_or_subdistrict: 'Haveli',
    village_or_city: 'Ambegaon',
    pincode: '411046',
    occupation: 'Small Agricultural Farmer',
    is_farmer: true,
    land_holding_acres: '4.32',
    annual_income: 48000,
    income_category: 'BPL',
    social_category: 'OBC',
    has_disability: false,
    is_widow: true,
    deceased_spouse_name: 'Late Tukaram Pandurang Patil',
    date_of_spouse_demise: '14/10/2025',
    dependents_count: 2,
    has_bank_account: true,
    bank_name: 'State Bank of India',
    account_number_masked: 'XXXX-XXXX-8921',
    ifsc_code: 'SBIN0004123'
  }
};

export const DEMO_PERSONAS: Record<string, User> = {
  widow: {
    ...DEFAULT_USER,
    id: 1,
    full_name: 'Savitribai Tukaram Patil',
    preferred_language: 'mr',
    role: 'citizen'
  },
  farmer: {
    id: 2,
    phone: '9822012345',
    email: 'ramesh.shinde@janseva.gov.demo',
    full_name: 'Ramesh Balasaheb Shinde',
    role: 'citizen',
    preferred_language: 'mr',
    is_active: true,
    profile: {
      id: 2,
      user_id: 2,
      age: 52,
      gender: 'Male',
      marital_status: 'Married',
      state: 'Maharashtra',
      district: 'Nashik',
      taluka_or_subdistrict: 'Niphad',
      village_or_city: 'Pimpalgaon',
      pincode: '422209',
      occupation: 'Farmer',
      is_farmer: true,
      land_holding_acres: '3.10',
      annual_income: 72000,
      income_category: 'Non-BPL',
      social_category: 'General',
      has_disability: false,
      is_widow: false,
      dependents_count: 3,
      has_bank_account: true,
      bank_name: 'Bank of Maharashtra',
      account_number_masked: 'XXXX-XXXX-4512',
      ifsc_code: 'MAHB0000124'
    }
  },
  senior: {
    id: 3,
    phone: '9833445566',
    email: 'gangadhar.joshi@janseva.gov.demo',
    full_name: 'Gangadhar Keshav Joshi',
    role: 'citizen',
    preferred_language: 'hi',
    is_active: true,
    profile: {
      id: 3,
      user_id: 3,
      age: 72,
      gender: 'Male',
      marital_status: 'Married',
      state: 'Maharashtra',
      district: 'Nagpur',
      taluka_or_subdistrict: 'Nagpur Rural',
      village_or_city: 'Kalmeshwar',
      pincode: '441501',
      occupation: 'Retired / Senior Citizen',
      is_farmer: false,
      land_holding_acres: '0',
      annual_income: 36000,
      income_category: 'BPL',
      social_category: 'General',
      has_disability: false,
      is_widow: false,
      dependents_count: 1,
      has_bank_account: true,
      bank_name: 'Punjab National Bank',
      account_number_masked: 'XXXX-XXXX-9901',
      ifsc_code: 'PUNB0123400'
    }
  }
};

export const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: 1,
    user_id: 1,
    document_type: 'Death Certificate',
    original_filename: 'Tukaram_Patil_Death_Certificate_PuneMC.pdf',
    file_size_bytes: 42500,
    mime_type: 'application/pdf',
    ocr_status: 'Completed',
    ocr_confidence: 0.98,
    ocr_raw_text: 'GOVERNMENT OF MAHARASHTRA\nDEATH CERTIFICATE\nRegistrar of Births & Deaths, Pune Municipal Corporation\nRegistration No: MC/PUN/DTH/2025/08941\nName of Deceased: Tukaram Pandurang Patil\nDate of Death: 14/10/2025\nPlace of Death: Ambegaon, Haveli, Pune',
    is_verified: true,
    has_issues: false,
    validation_notes: 'Verified civil death registration certificate from Pune Municipal Corporation registry.',
    created_at: '2026-03-01T10:15:00Z',
    extracted_fields: [
      { id: 101, field_key: 'deceased_name', field_label: 'Name of Deceased', extracted_value: 'Tukaram Pandurang Patil', confidence: 0.98, is_sensitive: false },
      { id: 102, field_key: 'date_of_death', field_label: 'Date of Demise', extracted_value: '14/10/2025', confidence: 0.96, is_sensitive: false },
      { id: 103, field_key: 'registration_no', field_label: 'Registration / Certificate No.', extracted_value: 'MC/PUN/DTH/2025/08941', confidence: 0.97, is_sensitive: false },
      { id: 104, field_key: 'place_of_death', field_label: 'Place of Demise', extracted_value: 'Village Ambegaon, Taluka Haveli, District Pune', confidence: 0.94, is_sensitive: false },
      { id: 105, field_key: 'issuing_authority', field_label: 'Issuing Authority', extracted_value: 'Registrar of Births & Deaths, Pune Municipal Corporation', confidence: 0.95, is_sensitive: false }
    ]
  },
  {
    id: 2,
    user_id: 1,
    document_type: '7/12 Land Record Extract',
    original_filename: 'Satbara_7_12_Extract_Gat_204A_Ambegaon.pdf',
    file_size_bytes: 56200,
    mime_type: 'application/pdf',
    ocr_status: 'Completed',
    ocr_confidence: 0.96,
    ocr_raw_text: 'MAHARASHTRA BHUMI ABHILEKH\nFORM VII-XII (7/12 EXTRACT)\nVillage: Ambegaon, Taluka: Haveli, District: Pune\nGat / Survey No: 204/A, Khata: KH-148/2\nArea: 1.75 Hectares (4.32 Acres)\nHolder: Late Tukaram Pandurang Patil (Jointly with Savitribai Patil)',
    is_verified: true,
    has_issues: false,
    validation_notes: 'Verified digital 7/12 land extract from Mahabhumi portal.',
    created_at: '2026-03-01T10:20:00Z',
    extracted_fields: [
      { id: 106, field_key: 'khata_number', field_label: 'Khata / Account No.', extracted_value: 'KH-148/2', confidence: 0.96, is_sensitive: false },
      { id: 107, field_key: 'survey_gat_number', field_label: 'Survey / Gat Number', extracted_value: 'Gat No. 204/A', confidence: 0.97, is_sensitive: false },
      { id: 108, field_key: 'land_area', field_label: 'Total Land Area', extracted_value: '1.75 Hectares (4.32 Acres)', confidence: 0.95, is_sensitive: false },
      { id: 109, field_key: 'land_cultivation_type', field_label: 'Land Type', extracted_value: 'Jirayat (Rainfed Agricultural Crop)', confidence: 0.92, is_sensitive: false },
      { id: 110, field_key: 'owner_names', field_label: 'Registered Landholder(s)', extracted_value: 'Late Tukaram Pandurang Patil (Joint with Savitribai Tukaram Patil)', confidence: 0.96, is_sensitive: false },
      { id: 111, field_key: 'village_taluka', field_label: 'Village & Taluka', extracted_value: 'Village Ambegaon, Taluka Haveli, Dist Pune', confidence: 0.95, is_sensitive: false }
    ]
  },
  {
    id: 3,
    user_id: 1,
    document_type: 'Aadhaar Card',
    original_filename: 'Savitribai_Patil_Aadhaar_Masked.pdf',
    file_size_bytes: 38900,
    mime_type: 'application/pdf',
    ocr_status: 'Completed',
    ocr_confidence: 0.99,
    ocr_raw_text: 'UNIQUE IDENTIFICATION AUTHORITY OF INDIA\nAADHAAR\nName: Savitribai Tukaram Patil\nGender: Female\nYear of Birth: 1979\nAadhaar No: XXXX XXXX 6712\nAddress: At Post Ambegaon, Taluka Haveli, District Pune - 411046',
    is_verified: true,
    has_issues: false,
    validation_notes: 'UIDAI standard masked Aadhaar verified. First 8 digits safely masked.',
    created_at: '2026-03-01T10:25:00Z',
    extracted_fields: [
      { id: 112, field_key: 'citizen_name', field_label: 'Name as per Aadhaar', extracted_value: 'Savitribai Tukaram Patil', confidence: 0.99, is_sensitive: false },
      { id: 113, field_key: 'gender', field_label: 'Gender', extracted_value: 'Female', confidence: 0.98, is_sensitive: false },
      { id: 114, field_key: 'yob_dob', field_label: 'Year of Birth / Age', extracted_value: '1979 (Age: 47)', confidence: 0.97, is_sensitive: false },
      { id: 115, field_key: 'aadhaar_masked', field_label: 'Masked Aadhaar Number', extracted_value: 'XXXX-XXXX-6712', confidence: 0.99, is_sensitive: true },
      { id: 116, field_key: 'address', field_label: 'Permanent Address', extracted_value: 'At Post Ambegaon, Taluka Haveli, District Pune, Maharashtra - 411046', confidence: 0.96, is_sensitive: false }
    ]
  }
];

export const DEFAULT_APPLICATIONS: Application[] = [
  {
    id: 1,
    application_reference_no: 'JANSEVA-2026-89412',
    portal_acknowledgment_no: 'MH-SGN-2026-89412',
    user_id: 1,
    scheme_id: 1,
    status: 'Under Verification',
    department: 'Social Justice and Special Assistance Department, Maharashtra',
    form_data: {
      applicant_name: 'Savitribai Tukaram Patil',
      gender: 'Female',
      date_of_birth: '1979 (Age: 47)',
      contact_phone: '9876543210',
      residence_address: 'Village Ambegaon, Taluka Haveli, Dist Pune, Maharashtra - 411046',
      district: 'Pune',
      taluka: 'Haveli',
      state: 'Maharashtra',
      pincode: '411046',
      aadhaar_masked: 'XXXX-XXXX-6712',
      social_category: 'OBC',
      annual_income: '₹ 48,000 / year',
      income_category: 'BPL',
      is_widow_applicant: 'Yes',
      deceased_spouse_name: 'Late Tukaram Pandurang Patil',
      date_of_spouse_demise: '14/10/2025',
      death_registration_no: 'MC/PUN/DTH/2025/08941',
      issuing_death_authority: 'Registrar of Births & Deaths, Pune',
      is_farmer: 'Yes',
      survey_gat_number: 'Gat No. 204/A',
      khata_number: 'KH-148/2',
      land_area_acres: '4.32 Acres',
      bank_name: 'State Bank of India',
      account_number_masked: 'XXXX-XXXX-8921',
      ifsc_code: 'SBIN0004123'
    },
    attached_documents: [
      { type: 'Death Certificate', filename: 'Tukaram_Patil_Death_Certificate_PuneMC.pdf' },
      { type: '7/12 Land Record Extract', filename: 'Satbara_7_12_Extract_Gat_204A_Ambegaon.pdf' },
      { type: 'Aadhaar Card', filename: 'Savitribai_Patil_Aadhaar_Masked.pdf' }
    ],
    reviewed_by_citizen: true,
    citizen_declaration_signed: true,
    submission_method: 'Automated Portal Adapter (MahaDBT / MahaSeva)',
    portal_response_data: {
      portal_name: 'MahaDBT (Government of Maharashtra)',
      token: 'MHD-TOK-2026-9817',
      verification_officer: 'Tahsildar Haveli Desk',
      dbt_linked_bank: 'State Bank of India (Ending 8921)'
    },
    next_required_action: 'Field verification scheduled by Talathi / Circle Officer (Haveli Taluka)',
    created_at: '2026-03-01T11:00:00Z',
    submitted_at: '2026-03-01T11:05:00Z',
    updated_at: '2026-03-02T09:30:00Z',
    scheme: DEFAULT_SCHEMES[0],
    status_history: [
      {
        id: 1,
        status: 'Submitted',
        title: 'Application Submitted to MahaDBT Portal',
        description: 'Application successfully forwarded to MahaDBT / MahaSeva portal adapter.',
        action_by: 'JanSeva Citizen Agent',
        remarks: 'Acknowledgment No. MH-SGN-2026-89412 generated.',
        created_at: '2026-03-01T11:05:00Z'
      },
      {
        id: 2,
        status: 'Under Verification',
        title: 'Document Verification in Progress',
        description: 'Taluka Welfare Officer has received the file for primary scrutiny.',
        action_by: 'Tahsildar Office, Haveli',
        remarks: 'Death Certificate & 7/12 Land Record authenticated.',
        created_at: '2026-03-02T09:30:00Z'
      }
    ]
  }
];

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    user_id: 1,
    title: 'Welcome to JanSeva AI',
    message: 'Your citizen profile is initialized. Ask our AI Assistant about widow pensions and agricultural benefits in Marathi, Hindi, or English.',
    notification_type: 'info',
    category: 'system',
    is_read: false,
    sent_in_app: true,
    sent_whatsapp: true,
    whatsapp_status: 'simulated_delivered',
    sent_sms: true,
    created_at: '2026-03-01T10:00:00Z'
  },
  {
    id: 2,
    user_id: 1,
    title: 'Application Submitted: Sanjay Gandhi Niradhar Yojana',
    message: 'Your application has been received by the MahaDBT portal. Acknowledgment: MH-SGN-2026-89412. Verification is underway.',
    notification_type: 'success',
    category: 'application',
    is_read: false,
    sent_in_app: true,
    sent_whatsapp: true,
    whatsapp_status: 'simulated_delivered',
    sent_sms: true,
    created_at: '2026-03-01T11:06:00Z'
  }
];

export const DEFAULT_ADMIN_METRICS = {
  total_applications: 1420,
  under_review: 189,
  approved: 1145,
  rejected: 86,
  success_rate: '93.8%',
  avg_processing_days: 4.2,
  dbt_disbursed_total: '₹ 2.18 Crore',
  schemes_active: 8,
  districts_covered: 36
};

export const DEFAULT_AUDIT_LOGS = [
  {
    id: 1,
    action: 'CITIZEN_REGISTRATION',
    user: 'Savitribai Tukaram Patil',
    resource: 'Citizen Profile',
    timestamp: '2026-03-01T10:00:00Z',
    status: 'Success'
  },
  {
    id: 2,
    action: 'OCR_DOCUMENT_EXTRACTION',
    user: 'Savitribai Tukaram Patil',
    resource: 'Death Certificate (Tukaram Patil)',
    timestamp: '2026-03-01T10:15:00Z',
    status: 'Confidence 98%'
  },
  {
    id: 3,
    action: 'PORTAL_SUBMISSION_DISPATCH',
    user: 'JanSeva Citizen Agent',
    resource: 'MahaDBT (Ref: MH-SGN-2026-89412)',
    timestamp: '2026-03-01T11:05:00Z',
    status: 'Ack Generated'
  },
  {
    id: 4,
    action: 'OFFICER_VERIFICATION_STEP',
    user: 'Haveli Taluka Tahsildar Desk',
    resource: 'Application #1',
    timestamp: '2026-03-02T09:30:00Z',
    status: 'Documents Verified'
  }
];

export function getMockAssistantReply(message: string, language: string): ChatMessage {
  const msgLower = message.toLowerCase();
  const isWidowFarmer = msgLower.includes('husband') || msgLower.includes('farmer') || msgLower.includes('widow') || msgLower.includes('पती') || msgLower.includes('शेतकरी') || msgLower.includes('निधन') || msgLower.includes('पति') || msgLower.includes('मौत');
  const isPMKisan = msgLower.includes('kisan') || msgLower.includes('किसान') || msgLower.includes('शेती') || msgLower.includes('जमीन') || msgLower.includes('land');
  const isAyushman = msgLower.includes('health') || msgLower.includes('arogya') || msgLower.includes('आरोग्य') || msgLower.includes('इलाज') || msgLower.includes('hospital');

  let text = '';
  let followUpQuestions: string[] = [];
  let suggestedActions: string[] = [];
  let recommendedSchemes: any[] = [];

  if (isWidowFarmer) {
    if (language === 'mr') {
      text = 'आपल्या कुटुंबावर ओढवलेल्या दुःखाबद्दल आम्ही तीव्र संवेदना व्यक्त करतो. जनसेवा AI आपणास आणि आपल्या कुटुंबाला शासकीय आधार मिळवून देण्यासाठी पूर्ण सहकार्य करेल.\n\nतुमच्या परिस्थितीनुसार तुम्ही खालील महत्त्वाच्या शासकीय योजनांसाठी **९५% पात्र** आहात:\n\n१. **संजय गांधी निराधार अनुदान योजना (महाराष्ट्र शासन)** — दरमहा ₹१,५०० थेट बँक पेन्शन.\n२. **पी.एम. किसान वारस हक्क नोंद व सन्मान निधी हस्तांतरण** — दरवर्षी ₹६,००० चा वार्षिक हप्ता तुमच्या नावे सुरू राहील.\n३. **राष्ट्रीय कुटुंब लाभ योजना (NFBS)** — कुटुंब प्रमुखाच्या निधनानंतर एकरकमी ₹२०,००० तात्काळ मदत.\n\nमी तुमच्या कागदपत्रांची पडताळणी करून अर्ज तयार करू का?';
      followUpQuestions = [
        'तुमच्याकडे ग्रामपंचायत किंवा नगरपालिकेकडील पतीचा मृत्यू दाखला आहे का?',
        '७/१२ शेतजमीन उताऱ्यावर तुमची वारस नोंद झाली आहे का?',
        'तुमचे बँक खाते आधार कार्डशी जोडलेले आहे का?'
      ];
      suggestedActions = [
        'पतीचा मृत्यू दाखला अपलोड करा',
        'संजय गांधी निराधार पेन्शनसाठी अर्ज करा',
        'पी.एम. किसान वारस हक्क अर्ज तयार करा'
      ];
    } else if (language === 'hi') {
      text = 'आपके परिवार पर आए इस दुःख के समय में हम आपके साथ हैं। जनसेवा AI आपको और आपके बच्चों को सभी हकदार सरकारी लाभ दिलाने में पूरी सहायता करेगा।\n\nआपकी स्थिति के अनुसार आप निम्नलिखित प्रमुख योजनाओं के लिए **95% पात्र** हैं:\n\n1. **संजय गांधी निराधार अनुदान योजना / इंदिरा गांधी विधवा पेंशन** — ₹1,500 प्रतिमाह सीधे बैंक खाते में।\n2. **पीएम-किसान वारिस अंतरण** — ₹6,000 प्रति वर्ष की कृषि सम्मान निधि आपके नाम जारी रहेगी।\n3. **राष्ट्रीय पारिवारिक लाभ योजना (NFBS)** — मुख्य कमाने वाले के निधन पर ₹20,000 एकमुश्त सहायता।\n\nक्या आपके पास मृत्यु प्रमाण पत्र और 7/12 खतौनी रिकॉर्ड उपलब्ध है?';
      followUpQuestions = [
        'क्या आपके पास पति का मृत्यु प्रमाण पत्र है?',
        'क्या बैंक खाता आधार से जुड़ा हुआ है?',
        'क्या हम आपके लिए विधवा पेंशन का आवेदन तैयार करें?'
      ];
      suggestedActions = [
        'मृत्यु प्रमाण पत्र अपलोड करें',
        'विधवा पेंशन आवेदन तैयार करें',
        'पीएम किसान सम्मान निधि अंतरित करें'
      ];
    } else {
      text = 'I am deeply sorry for your loss. JanSeva AI is here to stand with you and ensure your family receives every government benefit and pension you are legally entitled to.\n\nBased on your circumstances, you are **95% likely eligible** for the following welfare programs:\n\n1. **Sanjay Gandhi Niradhar Anudan Yojana (Maharashtra)** — ₹1,500 monthly direct bank pension for bereaved widows.\n2. **PM-KISAN Heirship & Succession Benefit Transfer** — Seamlessly transfer ongoing ₹6,000 annual installment to your name.\n3. **National Family Benefit Scheme (NFBS)** — One-time lump-sum grant of ₹20,000 upon demise of the primary earning member.\n\nYour 7/12 Land Record and Aadhaar are already in your vault. Shall I prepare your application right away?';
      followUpQuestions = [
        'Do you have the official Death Certificate from the local Municipal or Gram Panchayat registry?',
        'Is your active bank account linked with Aadhaar for DBT payments?',
        'Would you like me to generate your Sanjay Gandhi Niradhar application now?'
      ];
      suggestedActions = [
        'Upload Death Certificate',
        'Apply for Sanjay Gandhi Widow Pension',
        'Transfer PM-KISAN to Widow Name'
      ];
    }

    recommendedSchemes = [
      { id: 1, name: 'Sanjay Gandhi Niradhar Anudan Yojana', amount: '₹1,500 / month', match: 96 },
      { id: 3, name: 'PM-KISAN Heirship & Succession Transfer', amount: '₹6,000 / year', match: 95 },
      { id: 4, name: 'National Family Benefit Scheme', amount: '₹20,000 one-time', match: 88 }
    ];
  } else if (isPMKisan) {
    if (language === 'mr') {
      text = 'पी.एम. किसान सन्मान निधी योजनेअंतर्गत पात्र शेतकरी कुटुंबांना दरवर्षी ₹६,००० (प्रत्येकी ₹२,००० चे तीन हप्ते) दिले जातात. जर मूळ खातेदाराचे निधन झाले असेल, तर ७/१२ फेरफार नोंदीच्या आधारे वारसदार विधवा पत्नीच्या नावे हा लाभ थेट हस्तांतरित केला जातो.';
      followUpQuestions = ['तुमच्याकडे चालू ७/१२ उतारा आहे का?', 'वारस फेरफार नोंद झाली आहे का?'];
      suggestedActions = ['पी.एम. किसान वारस हस्तांतरण अर्ज करा'];
    } else {
      text = 'Under PM-KISAN, eligible farmers receive ₹6,000 annually in 3 installments of ₹2,000 via DBT. For deceased farmers, the legal heir can transfer ongoing benefits by submitting the updated 7/12 land extract and death certificate.';
      followUpQuestions = ['Do you have the updated 7/12 Land Extract?', 'Is your bank account Aadhaar-seeded?'];
      suggestedActions = ['Apply for PM-KISAN Succession Transfer'];
    }
    recommendedSchemes = [
      { id: 3, name: 'PM-KISAN Heirship & Succession Transfer', amount: '₹6,000 / year', match: 95 },
      { id: 5, name: 'PM-KISAN Samman Nidhi', amount: '₹6,000 / year', match: 78 }
    ];
  } else if (isAyushman) {
    if (language === 'mr') {
      text = 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (AB-PMJAY) अंतर्गत दारिद्र्य रेषेखालील व पात्र कुटुंबांना दरवर्षी ₹५,००,००० पर्यंत मोफत आणि कॅशलेस वैद्यकीय उपचारांचे संरक्षण मिळते. यासाठी पिवळे किंवा केशरी रेशन कार्ड व आधार कार्ड लागते.';
      followUpQuestions = ['तुमच्याकडे रेशन कार्ड आहे का?', 'कुटुंबातील सर्व सदस्यांचे आधार कार्ड तयार आहे का?'];
      suggestedActions = ['आयुष्मान भारत कार्डसाठी तपासा'];
    } else {
      text = 'Ayushman Bharat PM-JAY provides cashless hospitalization cover of up to ₹5,00,000 per family per year at public and empaneled private hospitals for secondary and tertiary care.';
      followUpQuestions = ['Do you hold an active NFSA / BPL Ration Card?', 'Are all family members linked to Aadhaar?'];
      suggestedActions = ['Check Ayushman Bharat Card Eligibility'];
    }
    recommendedSchemes = [
      { id: 6, name: 'Ayushman Bharat - PM Jan Arogya Yojana', amount: '₹5,00,000 / year health cover', match: 94 }
    ];
  } else {
    if (language === 'mr') {
      text = 'नमस्कार! मी जनसेवा AI सहाय्यक आहे. मी तुम्हाला केंद्र व राज्य शासनाच्या विविध कल्याणकारी योजना शोधण्यात, आवश्यक कागदपत्रांची पडताळणी करण्यात आणि थेट अर्ज भरण्यात मदत करू शकतो. तुम्ही विधवा पेन्शन, शेतकरी अनुदान, घरकुल किंवा आरोग्य योजनांबद्दल विचारू शकता.';
      followUpQuestions = [
        'मला शेतकरी विधवा मदतीबद्दल माहिती द्या.',
        'माझे ७/१२ उताऱ्यावर आधारित कोणत्या योजना मिळतील?',
        'मासिक पेन्शनसाठी कोणती कागदपत्रे लागतात?'
      ];
      suggestedActions = [
        'शासकीय योजना शोधा',
        'कागदपत्रे अपलोड करा'
      ];
    } else if (language === 'hi') {
      text = 'नमस्ते! मैं जनसेवा AI सहायक हूँ। मैं आपको केंद्र और राज्य सरकार की कल्याणकारी योजनाओं को खोजने, पात्रता जांचने और सीधे आवेदन करने में मदद कर सकता हूँ। आप किसान सहायता, विधवा पेंशन, स्वास्थ्य बीमा या आवास योजना के बारे में पूछ सकते हैं।';
      followUpQuestions = [
        'किसान विधवा सहायता के बारे में बताएं।',
        'मासिक पेंशन के लिए क्या दस्तावेज चाहिए?',
        'पीएम किसान सम्मान निधि कैसे मिलेगी?'
      ];
      suggestedActions = [
        'सरकारी योजनाएं खोजें',
        'दस्तावेज अपलोड करें'
      ];
    } else {
      text = 'Hello! I am your JanSeva AI Government Service Agent. I can help you discover government welfare schemes you qualify for, verify your documents via OCR, and guide you through completing official applications.\n\nYou can ask about widow pensions, PM-KISAN agricultural transfers, Ayushman Bharat health coverage, or housing grants.';
      followUpQuestions = [
        'Tell me about assistance for a deceased farmer\'s widow.',
        'Which schemes match my 7/12 land record?',
        'How can I get the ₹1,500 monthly widow pension?'
      ];
      suggestedActions = [
        'Explore All Government Schemes',
        'Upload Official Documents'
      ];
    }
    recommendedSchemes = [
      { id: 1, name: 'Sanjay Gandhi Niradhar Anudan Yojana', amount: '₹1,500 / month', match: 96 },
      { id: 3, name: 'PM-KISAN Heirship & Succession Transfer', amount: '₹6,000 / year', match: 95 }
    ];
  }

  return {
    id: Date.now(),
    conversation_id: 1,
    sender: 'assistant',
    text,
    language,
    has_audio: true,
    suggested_actions: suggestedActions,
    recommended_schemes: recommendedSchemes,
    follow_up_questions: followUpQuestions,
    created_at: new Date().toISOString()
  };
}
