#!/bin/sh
set -e

# Schreibt Laufzeit-Konfiguration in env.js bevor nginx startet.
# ENV-Variablen können pro Deployment gesetzt werden ohne neu zu bauen.

cat > /usr/share/nginx/html/env.js << EOF
window.__env = {
  keycloakUrl:           '${KEYCLOAK_URL:-/kc}',
  keycloakRealm:         '${KEYCLOAK_REALM:-maison}',
  keycloakClientId:      '${KEYCLOAK_CLIENT_ID:-maison-angular}',
  keycloakAdminUser:     '${KEYCLOAK_ADMIN_USER:-admin}',
  keycloakAdminPassword: '${KEYCLOAK_ADMIN_PASSWORD:-admin}',
  apiUrl:                '${API_URL:-/api}'
};
EOF

echo "env.js generated:"
cat /usr/share/nginx/html/env.js

exec "$@"
