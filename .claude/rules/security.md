## Security

### Project Setup
- Never commit secrets — use environment variables and add secret files to `.gitignore`
- Pin dependency versions; audit regularly with `npm audit` or equivalent
- Set strict Content Security Policy headers in production
- Enable HTTPS everywhere; never serve sensitive content over HTTP

### OWASP Top 10 Practices
- **Injection**: use parameterised queries/prepared statements; never interpolate user input into SQL, shell commands, or HTML
- **Broken auth**: use short-lived tokens, secure cookie flags (`HttpOnly`, `Secure`, `SameSite`), and established auth libraries — never roll your own
- **XSS**: treat all user input as untrusted; use framework-native escaping; avoid `dangerouslySetInnerHTML`/`v-html` unless content is explicitly sanitised
- **Insecure direct object references**: authorise every resource access server-side; don't trust client-supplied IDs alone
- **Security misconfiguration**: remove debug endpoints, default credentials, and verbose error messages before production
- **Sensitive data exposure**: never log PII or tokens; redact before persisting or transmitting
- **CSRF**: use SameSite cookies and/or CSRF tokens for any state-changing requests

When reviewing a PR, flag any of the above before approving.
