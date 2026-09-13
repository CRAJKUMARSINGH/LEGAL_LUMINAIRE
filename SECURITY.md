# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.2.x   | Yes       |
| 2.1.x   | Yes       |
| < 2.1   | No        |

## Reporting a Vulnerability

Legal Luminaire handles synthetic legal data only. However, if you discover a security vulnerability (XSS, dependency CVE, data exposure), please:

1. **Do NOT open a public GitHub issue** for security vulnerabilities
2. **Contact the maintainer directly** via LinkedIn: https://in.linkedin.com/in/rajkumar-singh-chauhan-76627b18
3. Include: description of the vulnerability, steps to reproduce, potential impact

You will receive a response within 72 hours. If the issue is confirmed, a fix will be released within 14 days.

## Security Design Principles

- **No real PII in repo** — all demo data is synthetic (ADR-006)
- **PII redaction in-browser** — document redaction runs client-side, no files transmitted
- **No live court APIs** — no Manupatra/SCC Online calls in demo mode (ADR-004)
- **localStorage only** — case state never leaves the browser without user consent
- **CSP headers** — Content-Security-Policy enforced in netlify.toml
- **Security audit CI** — pnpm audit and pip-audit run on every push and weekly

## Dependency Auditing

`ash
pnpm audit --audit-level high
pip-audit -r artifacts/legal-luminaire/backend/requirements.txt
`

These run automatically in .github/workflows/security-audit.yml every Monday.
