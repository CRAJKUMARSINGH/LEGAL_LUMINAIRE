import re

def redact_indian_pii(text: str) -> str:
    """
    Masks sensitive Indian PII (Aadhar, PAN, Phone) to protect client privacy.
    Names are intentionally kept to allow AI to maintain case timeline coherence.
    """
    if not text:
        return ""

    # 1. Aadhar Number: 12 digits, often formatted as XXXX XXXX XXXX or XXXXXXXXXXXX
    aadhar_pattern = r'\b\d{4}[ -]?\d{4}[ -]?\d{4}\b'
    text = re.sub(aadhar_pattern, "[AADHAR-REDACTED]", text)

    # 2. PAN Card: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)
    pan_pattern = r'\b[A-Z]{5}\d{4}[A-Z]{1}\b'
    text = re.sub(pan_pattern, "[PAN-REDACTED]", text)

    # 3. Indian Phone Numbers: +91- or 0-, 10 digits
    phone_pattern = r'(\+91[\-\s]?)?[6-9]\d{9}\b'
    text = re.sub(phone_pattern, "[PHONE-REDACTED]", text)

    return text

def audit_redaction_risk(text: str) -> dict:
    """Returns counts of detected sensitive patterns."""
    return {
        "aadhar_found": len(re.findall(r'\b\d{4}[ -]?\d{4}[ -]?\d{4}\b', text)),
        "pan_found": len(re.findall(r'\b[A-Z]{5}\d{4}[A-Z]{1}\b', text)),
        "phone_found": len(re.findall(r'(\+91[\-\s]?)?[6-9]\d{9}\b', text))
    }
