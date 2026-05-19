<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Maison – Create Account</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #fff;
      color: #111;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
    }
    .logo {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 1.5rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 3rem;
      text-decoration: none;
      color: #111;
      display: block;
    }
    .wrapper { width: 100%; max-width: 28rem; }
    .card { border: 1px solid #e5e7eb; padding: 2.5rem; }
    h2 {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
      font-weight: normal;
    }
    .subtitle { font-size: 0.875rem; color: #6b7280; margin-bottom: 2rem; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .field { margin-bottom: 1rem; }
    label {
      display: block;
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 0.3rem;
    }
    input[type="email"],
    input[type="text"],
    input[type="password"] {
      width: 100%;
      border: 1px solid #d1d5db;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      outline: none;
      transition: border-color 0.15s;
      background: #fff;
      color: #111;
    }
    input:focus { border-color: #111; }
    input.error-field { border-color: #dc2626; }
    .field-error { color: #dc2626; font-size: 0.7rem; margin-top: 0.2rem; }
    .btn-primary {
      width: 100%;
      padding: 1rem;
      background: #111;
      color: #fff;
      border: none;
      font-size: 0.875rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.15s;
      margin-top: 0.5rem;
    }
    .btn-primary:hover { background: #374151; }
    .error {
      color: #dc2626;
      font-size: 0.75rem;
      margin-bottom: 1rem;
      padding: 0.6rem 0.75rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
    }
    .footer-link {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    }
    .footer-link a { color: #111; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="wrapper">
    <a href="${properties.kcLogoLink!}" class="logo">Maison</a>

    <div class="card">
      <h2>Create Account</h2>
      <p class="subtitle">Join Maison today.</p>

      <#if message?has_content && message.type == "error">
        <div class="error">${kcSanitize(message.summary)?no_esc}</div>
      </#if>

      <form action="${url.registrationAction}" method="post">

        <div class="row">
          <div class="field">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName"
                   value="${(register.formData.firstName)!''}"
                   placeholder="Anna"
                   class="${messagesPerField.existsError('firstName')?then('error-field', '')}"/>
            <#if messagesPerField.existsError('firstName')>
              <span class="field-error">${kcSanitize(messagesPerField.getFirstError('firstName'))?no_esc}</span>
            </#if>
          </div>
          <div class="field">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName"
                   value="${(register.formData.lastName)!''}"
                   placeholder="Müller"
                   class="${messagesPerField.existsError('lastName')?then('error-field', '')}"/>
            <#if messagesPerField.existsError('lastName')>
              <span class="field-error">${kcSanitize(messagesPerField.getFirstError('lastName'))?no_esc}</span>
            </#if>
          </div>
        </div>

        <div class="field">
          <label for="email">Email</label>
          <input type="email" id="email" name="email"
                 value="${(register.formData.email)!''}"
                 placeholder="your@email.com"
                 autocomplete="email"
                 class="${messagesPerField.existsError('email')?then('error-field', '')}"/>
          <#if messagesPerField.existsError('email')>
            <span class="field-error">${kcSanitize(messagesPerField.getFirstError('email'))?no_esc}</span>
          </#if>
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input type="password" id="password" name="password"
                 placeholder="min. 8 characters"
                 autocomplete="new-password"
                 class="${messagesPerField.existsError('password', 'password-confirm')?then('error-field', '')}"/>
          <#if messagesPerField.existsError('password')>
            <span class="field-error">${kcSanitize(messagesPerField.getFirstError('password'))?no_esc}</span>
          </#if>
        </div>

        <div class="field">
          <label for="password-confirm">Confirm Password</label>
          <input type="password" id="password-confirm" name="password-confirm"
                 placeholder="••••••••"
                 autocomplete="new-password"
                 class="${messagesPerField.existsError('password-confirm')?then('error-field', '')}"/>
          <#if messagesPerField.existsError('password-confirm')>
            <span class="field-error">${kcSanitize(messagesPerField.getFirstError('password-confirm'))?no_esc}</span>
          </#if>
        </div>

        <button type="submit" class="btn-primary">Create Account</button>
      </form>

      <p class="footer-link">
        Already have an account? <a href="${url.loginUrl}">Sign in</a>
      </p>
    </div>
  </div>
</body>
</html>
