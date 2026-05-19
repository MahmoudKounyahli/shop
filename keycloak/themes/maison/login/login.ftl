<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Maison – Sign In</title>
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
    .card {
      border: 1px solid #e5e7eb;
      padding: 2.5rem;
    }
    h2 {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
      font-weight: normal;
    }
    .subtitle { font-size: 0.875rem; color: #6b7280; margin-bottom: 2rem; }
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
      <h2>Sign In</h2>
      <p class="subtitle">Log in to your Maison account.</p>

      <#if message?has_content && message.type == "error">
        <div class="error">${kcSanitize(message.summary)?no_esc}</div>
      </#if>

      <form action="${url.loginAction}" method="post">
        <input type="hidden" name="credentialId"
               <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>

        <div class="field">
          <label for="username">Email</label>
          <input type="email" id="username" name="username"
                 value="${(login.username)!''}"
                 placeholder="your@email.com"
                 autocomplete="email" autofocus/>
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input type="password" id="password" name="password"
                 placeholder="••••••••"
                 autocomplete="current-password"/>
        </div>

        <button type="submit" class="btn-primary">Log In</button>
      </form>

      <#if realm.registrationAllowed>
        <p class="footer-link">
          No account? <a href="${url.registrationUrl}">Create one</a>
        </p>
      </#if>
    </div>
  </div>
</body>
</html>
