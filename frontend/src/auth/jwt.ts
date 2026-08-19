export interface JWTPayloadClaim {
  key: string;
  value: string | number | boolean | object | null;
  formattedValue: string;
  type: string;
  description: string;
  category: 'Standard Claim' | 'User Identity' | 'Security & Auth' | 'System Metadata';
  statusBadge?: {
    label: string;
    variant: 'success' | 'info' | 'warning' | 'purple' | 'gray';
  };
}

export function parseJwtPayload(token: string | null | undefined): Record<string, any> | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    try {
      // Fallback for node environment / standard base64 decoding
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
      return JSON.parse(jsonPayload);
    } catch {
      console.error('Failed to parse JWT token payload');
      return null;
    }
  }
}

export function formatJwtClaims(payload: Record<string, any> | null): JWTPayloadClaim[] {
  if (!payload) return [];

  const claims: JWTPayloadClaim[] = [];

  const claimDescriptions: Record<string, { desc: string; category: JWTPayloadClaim['category'] }> = {
    userId: { desc: 'Unique database identifier for the user account', category: 'User Identity' },
    sub: { desc: 'Subject claim identifying the principal of the token', category: 'User Identity' },
    email: { desc: 'Authenticated user email address', category: 'User Identity' },
    name: { desc: 'Full display name of the account holder', category: 'User Identity' },
    is_verified: { desc: 'Indicates whether user email verification is completed', category: 'Security & Auth' },
    google_id: { desc: 'Linked Google OAuth 2.0 account identifier', category: 'Security & Auth' },
    provider: { desc: 'Authentication mechanism used (Google OAuth vs Password)', category: 'Security & Auth' },
    role: { desc: 'User role & authorization scope level', category: 'Security & Auth' },
    iat: { desc: 'Issued At timestamp (Unix epoch seconds)', category: 'Standard Claim' },
    exp: { desc: 'Expiration Time timestamp (Unix epoch seconds)', category: 'Standard Claim' },
    nbf: { desc: 'Not Before timestamp (Unix epoch seconds)', category: 'Standard Claim' },
    iss: { desc: 'Issuer domain / authority of the JWT token', category: 'Standard Claim' },
    aud: { desc: 'Audience intended recipient for the token', category: 'Standard Claim' },
  };

  Object.entries(payload).forEach(([key, val]) => {
    const meta = claimDescriptions[key] || {
      desc: `Custom claim metadata field (${key})`,
      category: 'System Metadata',
    };

    let formattedValue = String(val);
    let typeName: string = typeof val;
    let badge: JWTPayloadClaim['statusBadge'] = undefined;

    if (key === 'iat' || key === 'exp' || key === 'nbf') {
      typeName = 'timestamp (epoch)';
      if (typeof val === 'number') {
        const date = new Date(val * 1000);
        formattedValue = `${date.toLocaleString()} (${val})`;
        if (key === 'exp') {
          const isExpired = Date.now() > val * 1000;
          badge = isExpired
            ? { label: 'Expired', variant: 'warning' }
            : { label: 'Active Token', variant: 'success' };
        } else if (key === 'iat') {
          badge = { label: 'Issued', variant: 'info' };
        }
      }
    } else if (typeof val === 'boolean') {
      formattedValue = val ? 'true' : 'false';
      badge = val
        ? { label: 'Verified ✓', variant: 'success' }
        : { label: 'Pending Verification', variant: 'warning' };
    } else if (key === 'email') {
      badge = { label: 'Primary Email', variant: 'info' };
    } else if (key === 'userId' || key === 'sub') {
      badge = { label: 'UUID / ID', variant: 'purple' };
    } else if (typeof val === 'object' && val !== null) {
      formattedValue = JSON.stringify(val);
      typeName = Array.isArray(val) ? 'array' : 'object';
    }

    claims.push({
      key,
      value: val,
      formattedValue,
      type: typeName,
      description: meta.desc,
      category: meta.category,
      statusBadge: badge,
    });
  });

  return claims;
}
