from typing import Optional, Any
from ..models.scheme import Scheme
from ..models.user import UserProfile

class EligibilityEngine:
    @classmethod
    def evaluate(cls, scheme: Scheme, profile: Optional[UserProfile], uploaded_doc_types: list[str]) -> dict:
        """
        Evaluates citizen profile and uploaded documents against scheme criteria.
        Returns:
            status: "Likely Eligible" | "Possibly Eligible" | "More Information Required" | "Not Eligible"
            confidence_score: int (0 - 100)
            satisfied_criteria: list[str]
            missing_criteria: list[str]
            unmet_criteria: list[str]
            reasoning: str
            required_documents_status: dict[str, bool]
        """
        if not profile:
            return {
                "scheme_id": scheme.id,
                "scheme_name": scheme.name,
                "status": "More Information Required",
                "confidence_score": 40,
                "satisfied_criteria": [],
                "missing_criteria": ["User profile information (age, state, income, family situation)"],
                "unmet_criteria": [],
                "reasoning": "Please complete your profile or share more details in chat so we can check your exact eligibility.",
                "required_documents_status": {doc: False for doc in (scheme.required_documents or [])}
            }

        satisfied = []
        missing = []
        unmet = []

        # 1. State check
        if scheme.government_level == "State" and scheme.state:
            if not profile.state:
                missing.append(f"Residence state confirmation (Required: {scheme.state})")
            elif profile.state.lower() != scheme.state.lower():
                unmet.append(f"Scheme is specifically for residents of {scheme.state} (Current profile: {profile.state})")
            else:
                satisfied.append(f"Resident of {scheme.state}")

        slug = (scheme.slug or "").lower()

        # 2. Widow-specific schemes (IGNWPS, Sanjay Gandhi Niradhar, Bal Seva, NFBS)
        if "widow" in slug or "niradhar" in slug or "demise" in slug or "nfbs" in slug:
            if profile.is_widow:
                satisfied.append("Citizen is a bereaved spouse / widow")
            elif profile.marital_status and profile.marital_status.lower() == "widow":
                satisfied.append("Marital status: Widow")
            elif profile.marital_status and profile.marital_status.lower() != "widow":
                unmet.append("Scheme specifically supports widows and bereaved spouses")
            else:
                missing.append("Marital / bereavement status (Widow status)")

            # Age checks for Widow pensions
            if "ignwps" in slug or "indira-gandhi-widow" in slug:
                if profile.age:
                    if 40 <= profile.age <= 79:
                        satisfied.append(f"Age {profile.age} meets requirement (40 - 79 years)")
                    elif profile.age < 40:
                        unmet.append(f"Age {profile.age} is below minimum requirement of 40 years for central widow pension")
                    else:
                        satisfied.append(f"Age {profile.age} (Transitions to Old Age Pension at 80)")
                else:
                    missing.append("Age verification (40-79 years)")

            if "sanjay-gandhi" in slug:
                if profile.age:
                    if profile.age < 65:
                        satisfied.append(f"Age {profile.age} is under 65 (Qualifies for Niradhar assistance)")
                else:
                    missing.append("Age detail")

        # 3. Farmer / Agricultural schemes (PM-KISAN, Krishi Sinchayee, PMFBY)
        if "kisan" in slug or "farmer" in slug or "agriculture" in slug:
            if profile.is_farmer or (profile.occupation and "farmer" in profile.occupation.lower()):
                satisfied.append("Applicant is a farmer / agricultural family")
            elif profile.occupation and "farmer" not in profile.occupation.lower():
                unmet.append("Requires landholding farmer family status")
            else:
                missing.append("Farmer status / agricultural family affiliation")

            if profile.land_holding_acres:
                satisfied.append(f"Cultivable agricultural landholding documented ({profile.land_holding_acres} acres)")
            else:
                missing.append("Agricultural landholding / 7-12 record")

        # 4. Income limits
        if profile.annual_income is not None:
            if "sanjay-gandhi" in slug and profile.annual_income <= 50000:
                satisfied.append(f"Annual income ₹{profile.annual_income:,} is within ceiling (₹50,000/yr)")
            elif "sanjay-gandhi" in slug and profile.annual_income > 50000:
                unmet.append(f"Annual income ₹{profile.annual_income:,} exceeds state limit of ₹50,000/yr")
            elif "bpl" in slug or "ignwps" in slug:
                if profile.annual_income <= 100000 or profile.income_category in ["BPL", "EWS"]:
                    satisfied.append(f"Income category ({profile.income_category or 'Low Income'}) qualifies under BPL/EWS")
                else:
                    unmet.append("Requires household income under BPL/EWS thresholds")
        else:
            missing.append("Annual household income declaration")

        # 5. Check Document Coverage
        norm_uploaded = [d.lower() for d in uploaded_doc_types]
        docs_status = {}
        for req_doc in (scheme.required_documents or []):
            rd_lower = req_doc.lower()
            matched = any(
                ("death" in rd_lower and "death" in u) or
                ("land" in rd_lower and ("land" in u or "7/12" in u or "satbara" in u)) or
                ("aadhaar" in rd_lower and "aadhaar" in u) or
                ("income" in rd_lower and "income" in u) or
                ("bank" in rd_lower and "bank" in u) or
                ("ration" in rd_lower and "ration" in u)
                for u in norm_uploaded
            )
            docs_status[req_doc] = matched
            if matched:
                satisfied.append(f"Mandatory document verified: {req_doc}")

        # Compute status and confidence
        if unmet:
            status = "Not Eligible"
            score = max(10, 30 - (len(unmet) * 10))
            reasoning = f"Does not meet {len(unmet)} essential eligibility criteria: {', '.join(unmet)}."
        elif not missing and len(satisfied) >= 2:
            status = "Likely Eligible"
            score = min(98, 85 + (len(satisfied) * 2))
            reasoning = "All evaluated profile and administrative criteria align with official scheme rules."
        elif len(satisfied) > len(missing) and len(satisfied) >= 2:
            status = "Likely Eligible"
            score = 88
            reasoning = f"Profile strongly matches core requirements ({len(satisfied)} criteria met). Please verify: {', '.join(missing)}."
        elif len(satisfied) >= 1:
            status = "Possibly Eligible"
            score = 68
            reasoning = f"Potentially eligible based on available details ({', '.join(satisfied)}), but pending verification of: {', '.join(missing)}."
        else:
            status = "More Information Required"
            score = 45
            reasoning = f"Additional information required to establish eligibility: {', '.join(missing)}."

        return {
            "scheme_id": scheme.id,
            "scheme_name": scheme.name,
            "status": status,
            "confidence_score": score,
            "satisfied_criteria": satisfied,
            "missing_criteria": missing,
            "unmet_criteria": unmet,
            "reasoning": reasoning,
            "required_documents_status": docs_status
        }
