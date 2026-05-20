#!/bin/sh
set -e

cat > /usr/share/nginx/html/env.js << EOF
window.__env = {
  keycloakUrl:      '${KEYCLOAK_URL:-/kc}',
  keycloakRealm:    '${KEYCLOAK_REALM:-maison}',
  keycloakClientId: '${KEYCLOAK_CLIENT_ID:-maison-angular}',
  apiUrl:           '${API_URL:-/api}'
};
EOF

exec "$@"
