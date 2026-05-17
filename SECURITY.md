# Security policy — GAC Customer Experience

The General Authority for Competition (GAC) appreciates responsible disclosure
of any security issue found in this application.

## Reporting a vulnerability

- **Email:** security@gac.gov.sa
- **Preferred languages:** Arabic, English
- **Response target:** initial acknowledgement within 5 working days.

Please include reproduction steps, affected URLs, and any proof-of-concept
material. Do **not** test against live citizen data, and do **not** publicly
disclose findings before we confirm the fix.

## Scope

- Web application at `https://cx-platform-six.vercel.app/`
- Source code in this repository (`/server/*`, `/client/src/*`)

## Out of scope

- Denial-of-service / volumetric attacks
- Social engineering of GAC staff
- Findings limited to outdated browsers or unsupported platforms
- Self-XSS that requires the user to paste an attacker-supplied script into
  their own devtools

## Coordinated disclosure

We follow a coordinated-disclosure model. After verifying a report we will:

1. Confirm receipt and a working contact channel.
2. Investigate, reproduce, and triage severity.
3. Patch the issue and roll out the fix to production.
4. Credit the reporter (with permission) in the changelog.

Built in-house by GAC's IT team.
