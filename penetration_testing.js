const axios = require('axios');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:5000';

class PenetrationTester {
  constructor() {
    this.results = [];
    this.severityLevels = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  }

  log(type, message) {
    const ts = new Date().toISOString();
    console.log(`[${ts}] [${type}] ${message}`);
  }

  async runAllTests() {
    this.log('INFO', 'Starting penetration tests...');
    await this.testSQLInjection();
    await this.testXSS();
    await this.testAuthBypass();
    await this.testRateLimiting();
    await this.testInfoDisclosure();
    await this.testSessionManagement();
    await this.testInputValidation();
    this.generateReport();
  }

  addResult({type, endpoint, payload, severity, message}) {
    this.results.push({type, endpoint, payload, severity, message});
    this.log(severity, `${type} on ${endpoint}: ${message}`);
  }

  // --- Test Implementations ---

  async testSQLInjection() {
    // NoSQL injection for MongoDB
    const payloads = [
      { email: { "$ne": null }, password: "anything" },
      { email: "test' || '1'=='1", password: "anything" },
      { email: "test@example.com", password: { "$gt": "" } }
    ];
    for (const payload of payloads) {
      try {
        const res = await axios.post(`${BASE_URL}/api/auth/login`, payload);
        if (res.data && res.data.token) {
          this.addResult({
            type: 'NoSQL Injection',
            endpoint: '/api/auth/login',
            payload,
            severity: 'CRITICAL',
            message: 'Possible NoSQL injection vulnerability (token issued with malicious payload)'
          });
        }
      } catch (err) {
        // Expected: login should fail
      }
    }
  }

  async testXSS() {
    // Test reflected XSS on registration and contact
    const xssPayload = '<script>alert(1)</script>';
    // Registration
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, {
        name: xssPayload,
        email: `xss${crypto.randomBytes(4).toString('hex')}@test.com`,
        password: 'Test1234!',
        token: 'dummy' // bypass recaptcha for test
      });
      this.addResult({
        type: 'XSS',
        endpoint: '/api/auth/register',
        payload: xssPayload,
        severity: 'MEDIUM',
        message: 'Submitted XSS payload in registration. Manual review required.'
      });
    } catch {}
    // Contact form
    try {
      await axios.post(`${BASE_URL}/api/contact`, {
        name: xssPayload,
        email: `xss${crypto.randomBytes(4).toString('hex')}@test.com`,
        message: xssPayload
      });
      this.addResult({
        type: 'XSS',
        endpoint: '/api/contact',
        payload: xssPayload,
        severity: 'MEDIUM',
        message: 'Submitted XSS payload in contact form. Manual review required.'
      });
    } catch {}
  }

  async testAuthBypass() {
    // Try to access protected endpoints without token, using correct HTTP methods
    const endpoints = [
      { method: 'get', url: '/api/users/profile' },
      { method: 'get', url: '/api/users' },
      { method: 'post', url: '/api/users/2fa/generate' },
      { method: 'post', url: '/api/users/2fa/disable' },
      { method: 'post', url: '/api/users/emails', data: { address: 'test@test.com' } },
      { method: 'delete', url: '/api/users/emails', data: { address: 'test@test.com' } }
    ];
    for (const ep of endpoints) {
      try {
        await axios({ method: ep.method, url: `${BASE_URL}${ep.url}`, data: ep.data });
        this.addResult({
          type: 'Auth Bypass',
          endpoint: ep.url,
          payload: ep.data || null,
          severity: 'HIGH',
          message: 'Endpoint accessible without authentication!'
        });
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Expected: protected endpoint
        } else {
          this.addResult({
            type: 'Auth Bypass',
            endpoint: ep.url,
            payload: ep.data || null,
            severity: 'MEDIUM',
            message: `Unexpected error or status code: ${err.response ? err.response.status : err.message}`
          });
        }
      }
    }
  }


  async testRateLimiting() {
    // Brute-force login simulation
    const loginPayload = { email: 'brute@test.com', password: 'WrongPass123!' };
    let blocked = false;
    for (let i = 0; i < 7; i++) {
      try {
        await axios.post(`${BASE_URL}/api/auth/login`, loginPayload);
      } catch (err) {
        if (err.response && err.response.data && /too many/i.test(JSON.stringify(err.response.data))) {
          blocked = true;
          this.addResult({
            type: 'Rate Limiting',
            endpoint: '/api/auth/login',
            payload: loginPayload,
            severity: 'LOW',
            message: 'Rate limiting triggered as expected.'
          });
          break;
        }
      }
    }
    if (!blocked) {
      this.addResult({
        type: 'Rate Limiting',
        endpoint: '/api/auth/login',
        payload: loginPayload,
        severity: 'HIGH',
        message: 'Rate limiting did not trigger after multiple failed attempts.'
      });
    }
  }

  async testInfoDisclosure() {
    // Try to access sensitive files/routes
    const endpoints = [
      '/.env', '/config', '/api/users', '/api/users/profile'
    ];
    for (const endpoint of endpoints) {
      try {
        const res = await axios.get(`${BASE_URL}${endpoint}`);
        if (res.data && typeof res.data === 'string' && /jwt|mongo|secret|password/i.test(res.data)) {
          this.addResult({
            type: 'Info Disclosure',
            endpoint,
            payload: null,
            severity: 'CRITICAL',
            message: 'Sensitive information exposed!'
          });
        }
      } catch (err) {
        // Expected: 404 or 401
      }
    }
  }

  async testSessionManagement() {
    // JWT only, so test for token tampering
    const fakeToken = crypto.randomBytes(32).toString('hex');
    try {
      await axios.get(`${BASE_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${fakeToken}` }
      });
      this.addResult({
        type: 'Session Management',
        endpoint: '/api/users/profile',
        payload: fakeToken,
        severity: 'HIGH',
        message: 'Profile accessible with invalid token!'
      });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Expected
      } else {
        this.addResult({
          type: 'Session Management',
          endpoint: '/api/users/profile',
          payload: fakeToken,
          severity: 'MEDIUM',
          message: 'Unexpected error or status code.'
        });
      }
    }
  }

  async testInputValidation() {
    // Try to submit invalid/malicious payloads
    const endpoints = [
      { url: '/api/auth/register', data: { name: '', email: 'notanemail', password: '123', token: 'dummy' } },
      { url: '/api/contact', data: { name: '', email: 'bad', message: '' } }
    ];
    for (const ep of endpoints) {
      try {
        await axios.post(`${BASE_URL}${ep.url}`, ep.data);
        this.addResult({
          type: 'Input Validation',
          endpoint: ep.url,
          payload: ep.data,
          severity: 'MEDIUM',
          message: 'Endpoint accepted invalid/malicious input.'
        });
      } catch (err) {
        // Expected: should reject
      }
    }
  }

  generateReport() {
    this.log('INFO', '--- Penetration Test Report ---');
    const grouped = {};
    for (const sev of this.severityLevels) grouped[sev] = [];
    for (const r of this.results) grouped[r.severity].push(r);
    for (const sev of this.severityLevels) {
      this.log('INFO', `\n${sev} Findings:`);
      if (grouped[sev].length === 0) {
        this.log('INFO', '  None');
      } else {
        for (const f of grouped[sev]) {
          this.log(sev, `${f.type} | ${f.endpoint} | Payload: ${JSON.stringify(f.payload)} | ${f.message}`);
        }
      }
    }
    this.log('INFO', `\nSummary: ${this.results.length} findings total.`);
    for (const sev of this.severityLevels) {
      this.log('INFO', `${sev}: ${grouped[sev].length}`);
    }
  }
}

if (require.main === module) {
  (async () => {
    const tester = new PenetrationTester();
    await tester.runAllTests();
  })();
} 