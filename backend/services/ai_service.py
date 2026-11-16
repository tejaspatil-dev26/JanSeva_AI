import os
import json
import logging
import httpx
from typing import Optional, Any
from ..config import settings

logger = logging.getLogger("ai_service")

class AIService:
    @classmethod
    async def chat_response(
        cls,
        user_message: str,
        language: str = "en",
        conversation_history: list[dict[str, str]] = None,
        user_profile: dict[str, Any] = None,
        available_schemes: list[dict[str, Any]] = None
    ) -> dict[str, Any]:
        """
        Generates conversational assistance, situation analysis, follow-up questions,
        and recommended schemes based on user input and conversation state.
        Uses Gemini API if key is configured, else invokes high-precision GovTech reasoning model.
        """
        conversation_history = conversation_history or []
        user_profile = user_profile or {}
        available_schemes = available_schemes or []

        # If Gemini API Key is available, try Gemini API call first
        if settings.GEMINI_API_KEY:
            try:
                result = await cls._call_gemini(user_message, language, conversation_history, user_profile, available_schemes)
                if result:
                    return result
            except Exception as e:
                logger.warning(f"Gemini API invocation failed, falling back to GovTech domain engine: {e}")

        # High-Precision Context-Aware GovTech Reasoning Engine
        return cls._govtech_reasoning_engine(user_message, language, conversation_history, user_profile, available_schemes)

    @classmethod
    async def _call_gemini(
        cls,
        user_message: str,
        language: str,
        conversation_history: list[dict[str, str]],
        user_profile: dict[str, Any],
        available_schemes: list[dict[str, Any]]
    ) -> Optional[dict[str, Any]]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
        
        system_instruction = f"""
You are JanSeva AI, an empathetic, highly knowledgeable Indian Government Service Agent.
The citizen's preferred language is '{language}' (en=English, hi=Hindi, mr=Marathi, etc.).
Your mission: Help Indian citizens discover and apply for central and state government schemes (e.g. PM Kisan, Widow Pension, Sanjay Gandhi Niradhar Yojana, Ayushman Bharat, PMAY).
Always reply in the requested language ({language}).
When a bereaved widow or distressed citizen reaches out:
1. First express genuine compassion and reassurance.
2. Ask 2-3 specific administrative follow-up questions to verify eligibility (e.g., state, farmer registration, death certificate, annual income).
3. Suggest 2-4 eligible schemes by exact name.
Output your response as JSON matching:
{{
  "reply_text": "Empathetic conversational response in {language} with clear questions",
  "follow_up_questions": ["Question 1", "Question 2"],
  "suggested_actions": ["Upload Death Certificate", "Explore Widow Pension Schemes"],
  "recommended_scheme_slugs": ["indira-gandhi-widow-pension", "sanjay-gandhi-niradhar-anudan-yojana"],
  "extracted_profile_facts": {{"is_widow": true, "husband_was_farmer": true}}
}}
"""
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": system_instruction + f"\n\nCitizen profile: {json.dumps(user_profile)}\nCitizen query: {user_message}"}]}
            ],
            "generationConfig": {
                "temperature": 0.2,
                "response_mime_type": "application/json"
            }
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                raw_json = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(raw_json)
                return {
                    "text": parsed.get("reply_text", ""),
                    "follow_up_questions": parsed.get("follow_up_questions", []),
                    "suggested_actions": parsed.get("suggested_actions", []),
                    "recommended_scheme_slugs": parsed.get("recommended_scheme_slugs", []),
                    "extracted_facts": parsed.get("extracted_profile_facts", {})
                }
        return None

    @classmethod
    def _govtech_reasoning_engine(
        cls,
        user_message: str,
        language: str,
        conversation_history: list[dict[str, str]],
        user_profile: dict[str, Any],
        available_schemes: list[dict[str, Any]]
    ) -> dict[str, Any]:
        msg = user_message.lower()
        lang = (language or "en").lower()

        is_widow_context = any(
            w in msg for w in ["widow", "husband passed away", "passed away", "husband died", "death", "demise", 
                               "विधवा", "पति का निधन", "पति शांत झाले", "पती वारले", "निधन झाले", "पतीचे निधन", "पती एक्सपायर"]
        )
        is_farmer_context = any(
            w in msg for w in ["farmer", "kisan", "agriculture", "land", "crop", "शेती", "शेतकरी", "जमीन", "किसान", "खेती", "सातबारा", "7/12"]
        )
        is_health_context = any(
            w in msg for w in ["health", "hospital", "ayushman", "treatment", "medicine", "आरोग्य", "दवाखाना", "रुग्णालय", "इलाज", "स्वास्थ्य"]
        )
        is_housing_context = any(
            w in msg for w in ["house", "housing", "awas", "home", "घर", "आवास", "मकान"]
        )
        is_girl_child_context = any(
            w in msg for w in ["daughter", "girl", "sukanya", "mulgi", "बेटी", "सुकन्या", "मुलगी"]
        )

        extracted_facts = {}
        if is_widow_context:
            extracted_facts["is_widow"] = True
            extracted_facts["marital_status"] = "Widow"
        if is_farmer_context:
            extracted_facts["is_farmer"] = True

        # =========================================================================
        # 1. FARMER'S WIDOW / BEREAVEMENT SCENARIO (THE CORE JOURNEY)
        # =========================================================================
        if is_widow_context or (user_profile.get("is_widow") and is_farmer_context):
            schemes = [
                "sanjay-gandhi-niradhar-anudan-yojana",
                "indira-gandhi-widow-pension",
                "pm-kisan-succession-transfer",
                "national-family-benefit-scheme"
            ]

            if lang == "mr":
                reply = (
                    "तुमच्या पतीच्या निधनाबद्दल आम्ही अत्यंत दुःख व्यक्त करतो. या कठीण प्रसंगी आम्ही तुमच्या पाठीशी आहोत.\n\n"
                    "शेतकरी विधवा भगिनी आणि त्यांच्या कुटुंबांसाठी केंद्र व महाराष्ट्र शासनाच्या अत्यंत महत्त्वाच्या कल्याणकारी योजना उपलब्ध आहेत. "
                    "तुम्हाला योग्य लाभ मिळवून देण्यासाठी कृपया खालील काही बाबींची माहिती द्या:\n\n"
                    "१. तुम्ही महाराष्ट्रातील कोणत्या जिल्ह्यात व तालुक्यात राहता?\n"
                    "२. तुमच्या पतींच्या नावावर शेतजमीन (७/१२ उतारा) होती का?\n"
                    "३. तुमच्याकडे पतींचा अधिकृत मृत्यू दाखला उपलब्ध आहे का?\n"
                    "४. तुमच्या कुटुंबाचे वार्षिक उत्पन्न अंदाजे किती आहे?"
                )
                questions = [
                    "पतींचा मृत्यू दाखला काढला आहे का?",
                    "शेतीचा ७/१२ उतारा तुमच्याकडे किंवा पतींच्या नावावर आहे का?",
                    "कुटुंबाचे वार्षिक उत्पन्न ५०,००० रुपयांपेक्षा कमी आहे का?"
                ]
                actions = [
                    "मृत्यू दाखला अपलोड करा",
                    "७/१२ शेतजमीन उतारा अपलोड करा",
                    "संजय गांधी निराधार योजनेसाठी अर्ज करा",
                    "पी.एम. किसान वारस हक्क अर्ज"
                ]
            elif lang == "hi":
                reply = (
                    "आपके पति के निधन पर हमें गहरा दुःख है। इस कठिन समय में हम आपकी पूरी सहायता करेंगे।\n\n"
                    "किसान विधवाओं और उनके परिवारों के लिए केंद्र और राज्य सरकार की कई महत्वपूर्ण वित्तीय सहायता व पेंशन योजनाएं उपलब्ध हैं। "
                    "आपकी सटीक पात्रता सुनिश्चित करने के लिए कृपया निम्नलिखित प्रश्नों का उत्तर दें:\n\n"
                    "1. आप किस राज्य और जिले में निवास करते हैं?\n"
                    "2. क्या आपके पति के नाम पर कृषि भूमि (जमीन का खसरा/खतौनी) दर्ज थी?\n"
                    "3. क्या आपके पास पति का अधिकृत मृत्यु प्रमाण पत्र है?\n"
                    "4. आपके परिवार की वार्षिक आय लगभग कितनी है?"
                )
                questions = [
                    "क्या आपके पास पति का मृत्यु प्रमाण पत्र उपलब्ध है?",
                    "क्या कृषि भूमि की खतौनी / 7/12 रिकॉर्ड आपके पास है?",
                    "क्या परिवार की वार्षिक आय ₹1 लाख से कम है?"
                ]
                actions = [
                    "मृत्यु प्रमाण पत्र अपलोड करें",
                    "भूमि दस्तावेज (7/12) अपलोड करें",
                    "इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना देखें",
                    "पीएम किसान वारिस हस्तांतरण प्रक्रिया शुरू करें"
                ]
            elif lang == "gu":
                reply = (
                    "તમારા પતિના નિધન પર અમે દિલગીરી વ્યક્ત કરીએ છીએ. આ મુશ્કેલ સમયમાં જનસેવા AI તમારી સાથે છે.\n\n"
                    "ખેડૂત વિધવા પરિવારો માટે કેન્દ્ર અને રાજ્ય સરકારની મહત્વપૂર્ણ સહાય અને પેન્શન યોજનાઓ ઉપલબ્ધ છે. "
                    "તમારી પાત્રતા નક્કી કરવા કૃપા કરીને નીચેની માહિતી આપો:\n\n"
                    "૧. તમે કયા રાજ્ય અને જિલ્લામાં રહો છો?\n"
                    "૨. શું તમારા પતિના નામે ખેતીની જમીન હતી?\n"
                    "૩. શું તમારી પાસે પતિનું મૃત્યુ પ્રમાણપત્ર છે?\n"
                    "૪. તમારા કુટુંબની વાર્ષિક આવક અંદાજે કેટલી છે?"
                )
                questions = [
                    "શું પતિનું મૃત્યુ પ્રમાણપત્ર ઉપલબ્ધ છે?",
                    "શું 7/12 જમીનનો રેકોર્ડ છે?",
                    "શું વાર્ષિક આવક મર્યાદા હેઠળ છે?"
                ]
                actions = [
                    "મૃત્યુ પ્રમાણપત્ર અપલોડ કરો",
                    "જમીન રેકોર્ડ અપલોડ કરો",
                    "વિધવા પેન્શન યોજના જુઓ",
                    "પીએમ કિસાન વારસાઈ ટ્રાન્સફર"
                ]
            elif lang == "ta":
                reply = (
                    "உங்கள் கணவரின் மறைவுக்கு ஆழ்ந்த இரங்கலைத் தெரிவித்துக் கொள்கிறோம். இந்த கடினமான சூழலில் உதவ நாங்கள் தயாராக இருக்கிறோம்.\n\n"
                    "விவசாய குடும்ப விதவைகளுக்கு மத்திய மற்றும் மாநில அரசுகளின் சிறப்பு நலத்திட்டங்கள் உள்ளன. தகுதியை சரிபார்க்க சில தகவல்களை கூறவும்:\n\n"
                    "1. நீங்கள் எந்த மாவட்டம் மற்றும் ஊரில் வசிக்கிறீர்கள்?\n"
                    "2. உங்கள் கணவருக்கு விவசாய நிலம் இருந்ததா?\n"
                    "3. கணவரின் இறப்புச் சான்றிதழ் உங்களிடம் உள்ளதா?\n"
                    "4. குடும்பத்தின் தோராயமான ஆண்டு வருமானம் என்ன?"
                )
                questions = [
                    "கணவரின் இறப்புச் சான்றிதழ் உள்ளதா?",
                    "விவசாய நில ஆவணங்கள் உள்ளதா?",
                    "ஆண்டு வருமானம் தகுதி வரம்பிற்குள் உள்ளதா?"
                ]
                actions = [
                    "இறப்புச் சான்றிதழ் பதிவேற்றவும்",
                    "நில ஆவணங்கள் பதிவேற்றவும்",
                    "விதவை ஓய்வூதிய திட்டம்",
                    "விவசாயி வாரிசு பரிமாற்றம்"
                ]
            elif lang == "te":
                reply = (
                    "మీ భర్త మరణానికి మా ప్రగాఢ సానుభూతి తెలియజేస్తున్నాము. ఈ కష్ట సమయంలో మీకు సహాయం చేయడానికి మేము సిద్ధంగా ఉన్నాము.\n\n"
                    "రైతు వితంతు కుటుంబాలకు కేంద్ర మరియు రాష్ట్ర ప్రభుత్వాల నుండి అనేక సంక్షేమ పథకాలు ఉన్నాయి. దయచేసి వివరాలను తెలుపండి:\n\n"
                    "1. మీరు ఏ రాష్ట్రం మరియు జిల్లాలో నివసిస్తున్నారు?\n"
                    "2. మీ భర్త పేరిట వ్యవసాయ భూమి ఉందా?\n"
                    "3. మీ వద్ద భర్త మరణ ధృవీకరణ పత్రం ఉందా?\n"
                    "4. మీ కుటుంబ వార్షిక ఆదాయం సుమారు ఎంత?"
                )
                questions = [
                    "భర్త మరణ ధృవీకరణ పత్రం ఉందా?",
                    "భూమి పట్టాదారు పాస్ పుస్తకం ఉందా?",
                    "వార్షిక ఆదాయం అర్హత పరిమితిలో ఉందా?"
                ]
                actions = [
                    "మరణ ధృవీకరణ పత్రం అప్‌లోడ్ చేయండి",
                    "భూమి పత్రాలు అప్‌లోడ్ చేయండి",
                    "వితంతు పెన్షన్ పథకం",
                    "పీఎం కిసాన్ వారసత్వ బదిలీ"
                ]
            elif lang == "bn":
                reply = (
                    "আপনার স্বামীর প্রয়াণে আমরা গভীরভাবে শোকাহত। এই কঠিন সময়ে আমরা আপনার পাশে আছি।\n\n"
                    "কৃষক বিধবা ও তাদের পরিবারের জন্য কেন্দ্র ও রাজ্য সরকারের গুরুত্বপূর্ণ কল্যাণমূলক প্রকল্প রয়েছে। সঠিক প্রকল্পের জন্য অনুগ্রহ করে জানান:\n\n"
                    "১. আপনি কোন জেলা ও রাজ্যে বসবাস করেন?\n"
                    "২. আপনার স্বামীর নামে কৃষিজমি ছিল কি?\n"
                    "৩. আপনার কাছে স্বামীর মৃত্যুর শংসাপত্র আছে কি?\n"
                    "৪. পরিবারের আনুমানিক বার্ষিক আয় কত?"
                )
                questions = [
                    "স্বামীর মৃত্যুর শংসাপত্র আছে কি?",
                    "কৃষিজমির খতিয়ান বা পরচা আছে কি?",
                    "বার্ষিক আয় নির্ধারিত সীমার মধ্যে কি?"
                ]
                actions = [
                    "মৃত্যু শংসাপত্র আপলোড করুন",
                    "জমির রেকর্ড আপলোড করুন",
                    "বিধবা পেনশন প্রকল্পের আবেদন",
                    "পিএম কিষাণ উত্তরাধিকার স্থানান্তর"
                ]
            else: # English default
                reply = (
                    "I am deeply sorry for the loss of your husband. Please be assured that JanSeva AI is here to support you in accessing all government assistance, pensions, and benefits your family is entitled to.\n\n"
                    "There are specific Central and State welfare programs designed to provide financial security to farmer widows. To determine your exact eligibility and prepare your applications, could you please confirm:\n\n"
                    "1. Which state and district do you reside in (e.g., Maharashtra)?\n"
                    "2. Did your husband hold registered agricultural land (7/12 or land passbook)?\n"
                    "3. Do you have his registered Death Certificate available?\n"
                    "4. What is your approximate annual family income?"
                )
                questions = [
                    "Do you have your husband's official Death Certificate?",
                    "Is there a registered 7/12 Land Record in his or joint name?",
                    "Is your annual household income under ₹50,000 / ₹1,00,000?"
                ]
                actions = [
                    "Upload Death Certificate",
                    "Upload 7/12 Land Extract",
                    "Check Sanjay Gandhi Niradhar Scheme",
                    "Apply for PM-KISAN Succession"
                ]

            return {
                "text": reply,
                "follow_up_questions": questions,
                "suggested_actions": actions,
                "recommended_scheme_slugs": schemes,
                "extracted_facts": extracted_facts
            }

        # =========================================================================
        # 2. GENERAL FARMER / AGRICULTURE INQUIRY
        # =========================================================================
        elif is_farmer_context:
            schemes = ["pm-kisan-samman-nidhi", "pm-fasal-bima-yojana", "pm-kisan-maandhan"]
            if lang == "mr":
                reply = "शेतकरी बांधवांसाठी पीएम-किसान सन्मान निधी (वार्षिक ₹६,०००), पिक विमा योजना आणि सिंचन अनुदान योजना उपलब्ध आहेत. तुमच्याकडे किती एकर शेतजमीन आहे?"
                questions = ["तुमच्याकडे २ हेक्टर (५ एकर) पेक्षा कमी जमीन आहे का?", "तुमचे बँक खाते आधार लिंक आहे का?"]
                actions = ["७/१२ उतारा अपलोड करा", "पीएम-किसान पात्रता तपासा"]
            elif lang == "hi":
                reply = "किसान परिवारों के लिए पीएम-किसान सम्मान निधि (₹6,000 वार्षिक), प्रधानमंत्री फसल बीमा योजना और किसान मानधन पेंशन योजना उपलब्ध हैं। आपके पास कितनी कृषि भूमि है?"
                questions = ["क्या आपके पास 2 हेक्टेयर से कम कृषि भूमि है?", "क्या आपका बैंक खाता आधार से जुड़ा हुआ है?"]
                actions = ["7/12 भूमि रिकॉर्ड अपलोड करें", "पीएम किसान आवेदन तैयार करें"]
            else:
                reply = "For farmers and agrarian households, key welfare schemes include PM-KISAN Samman Nidhi (₹6,000/yr direct income support), PM Fasal Bima (crop insurance), and Kisan Pension. How many acres of cultivable land do you own?"
                questions = ["Do you own less than 2 hectares (5 acres) of land?", "Is your bank account Aadhaar-seeded for DBT?"]
                actions = ["Upload 7/12 Land Record", "Apply for PM-KISAN", "Check Crop Insurance Status"]

            return {
                "text": reply,
                "follow_up_questions": questions,
                "suggested_actions": actions,
                "recommended_scheme_slugs": schemes,
                "extracted_facts": extracted_facts
            }

        # =========================================================================
        # 3. HEALTHCARE / AYUSHMAN BHARAT
        # =========================================================================
        elif is_health_context:
            schemes = ["ayushman-bharat-pmjay"]
            reply = "Under Ayushman Bharat (PM-JAY), eligible families receive up to ₹5,00,000 per year of cashless hospitalization coverage across empaneled government and private hospitals."
            return {
                "text": reply,
                "follow_up_questions": ["Do you hold a Ration Card (BPL / Yellow / Antyodaya)?", "Is your family listed in the SECC 2011 database?"],
                "suggested_actions": ["Upload Ration Card", "Check Ayushman Card Eligibility"],
                "recommended_scheme_slugs": schemes,
                "extracted_facts": extracted_facts
            }

        # =========================================================================
        # 4. HOUSING / PMAY
        # =========================================================================
        elif is_housing_context:
            schemes = ["pm-awas-yojana-gramin"]
            reply = "Pradhan Mantri Awas Yojana - Gramin provides financial assistance of up to ₹1,20,000 to ₹1,30,000 to houseless families and those living in kutcha/dilapidated houses."
            return {
                "text": reply,
                "follow_up_questions": ["Do you or any family member currently own a pucca (concrete) house anywhere in India?"],
                "suggested_actions": ["Upload Aadhaar Card", "Check PMAY Beneficiary List"],
                "recommended_scheme_slugs": schemes,
                "extracted_facts": extracted_facts
            }

        # =========================================================================
        # 5. GENERAL WELCOME / INQUIRY
        # =========================================================================
        else:
            if lang == "mr":
                reply = (
                    "नमस्कार! मी जनसेवा AI — तुमचा अधिकृत शासकीय सेवा व योजना सहाय्यक आहे.\n\n"
                    "तुम्ही तुमच्या परिस्थितीबद्दल (उदा. शेती, निवृत्तीवेतन, आरोग्य, शिक्षण किंवा कुटुंबातील अडचण) साध्या भाषेत सांगा. "
                    "मी केंद्र व राज्य शासनाच्या सर्व योग्य योजना शोधून अर्ज भरण्यात मदत करेन."
                )
                questions = ["तुम्हाला कोणत्या क्षेत्रातील योजनांची माहिती हवी आहे?", "तुम्ही कोणत्या राज्यात व जिल्ह्यात राहता?"]
                actions = ["सर्व शासकीय योजना शोधा", "दाखले व कागदपत्रे अपलोड करा"]
            elif lang == "hi":
                reply = (
                    "नमस्ते! मैं जनसेवा AI हूँ — आपका सरकारी सेवा और कल्याणकारी योजनाओं का मार्गदर्शक।\n\n"
                    "आप अपनी वर्तमान स्थिति या समस्या (जैसे खेती, विधवा पेंशन, स्वास्थ्य कार्ड, आवास या व्यापार) के बारे में बताएं। "
                    "मैं आपके लिए सभी पात्र सरकारी योजनाओं की पहचान कर आवेदन करवाने में सहायता करूँगा।"
                )
                questions = ["आपको किस क्षेत्र की योजनाओं की जानकारी चाहिए?", "आपका गृह राज्य कौन सा है?"]
                actions = ["सरकारी योजनाएं खोजें", "दस्तावेज अपलोड करें"]
            elif lang == "gu":
                reply = (
                    "નમસ્તે! હું જનસેવા AI છું — તમારો સરકારી યોજના સહાયક.\n\n"
                    "તમારી સ્થિતિ વિશે સાદી ભાષામાં કહો (જેમ કે ખેતી, પેન્શન કે આરોગ્ય સહાય). "
                    "હું તમારા માટે યોગ્ય સરકારી યોજનાઓ શોધી આપીશ."
                )
                questions = ["તમારે કયા ક્ષેત્રની યોજના જોઈએ છે?", "તમારો જિલ્લો કયો છે?"]
                actions = ["બધી સરકારી યોજનાઓ જુઓ", "દસ્તાવેજ અપલોડ કરો"]
            elif lang == "ta":
                reply = (
                    "வணக்கம்! நான் ஜன்சேவா AI — உங்கள் அரசு சேவை மற்றும் நலத்திட்ட வழிகாட்டி.\n\n"
                    "உங்கள் தேவைகளை எளிமையாக கூறுங்கள் (விவசாயம், ஓய்வூதியம், மருத்துவம்). "
                    "உங்களுக்கான சிறந்த திட்டங்களை கண்டறிந்து விண்ணப்பிக்க உதவுகிறேன்."
                )
                questions = ["எந்த வகையான திட்டங்கள் உங்களுக்கு தேவை?", "நீங்கள் எந்த மாவட்டத்தில் வசிக்கிறீர்கள்?"]
                actions = ["அனைத்து அரசு திட்டங்கள்", "ஆவணங்களை பதிவேற்றவும்"]
            elif lang == "te":
                reply = (
                    "నమస్కారం! నేను జనసేవ AI — మీ ప్రభుత్వ సంక్షేమ పథకాల మార్గదర్శిని.\n\n"
                    "మీ పరిస్థితిని సాధారణ మాటల్లో చెప్పండి (వ్యవసాయం, పెన్షన్, వైద్యం). "
                    "అర్హత గల ప్రభుత్వ పథకాలను గుర్తించి దరఖాస్తు చేసుకోవడానికి సహాయం చేస్తాను."
                )
                questions = ["మీకు ఏ పథకాల వివరాలు కావాలి?", "మీ జిల్లా ఏది?"]
                actions = ["ప్రభుత్వ పథకాలను చూడండి", "పత్రాలు అప్‌లోడ్ చేయండి"]
            elif lang == "bn":
                reply = (
                    "নমস্কার! আমি জনসেবা AI — আপনার সরকারি কল্যাণমূলক প্রকল্প সহায়ক।\n\n"
                    "আপনার পরিস্থিতি সহজ ভাষায় বলুন (যেমন কৃষি, পেনশন, স্বাস্থ্য বা পরিবার)। "
                    "আমি আপনার জন্য সমস্ত যোগ্য সরকারি প্রকল্প খুঁজে আবেদন প্রস্তুত করতে সাহায্য করব।"
                )
                questions = ["আপনি কোন ক্ষেত্রের প্রকল্প খুঁজছেন?", "আপনার জেলা কোনটি?"]
                actions = ["সমস্ত সরকারি প্রকল্প দেখুন", "নথি আপলোড করুন"]
            else:
                reply = (
                    "Namaste! I am JanSeva AI — your one-stop Government Service Agent.\n\n"
                    "Tell me about your situation in plain words (e.g. 'My husband was a farmer and passed away', 'I need farming support', or 'Free medical treatment card'). "
                    "I will evaluate your eligibility across central and state government schemes and help prepare your applications directly."
                )
                questions = [
                    "What assistance are you looking for today?",
                    "Which state and district do you live in?"
                ]
                actions = [
                    "Farmer's Widow Assistance Journey",
                    "Browse All Government Schemes",
                    "Upload Documents for OCR Verification"
                ]

            return {
                "text": reply,
                "follow_up_questions": questions,
                "suggested_actions": actions,
                "recommended_scheme_slugs": ["sanjay-gandhi-niradhar-anudan-yojana", "pm-kisan-samman-nidhi", "ayushman-bharat-pmjay"],
                "extracted_facts": extracted_facts
            }
