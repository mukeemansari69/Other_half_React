export const securityHeaderValues = {
  contentSecurityPolicy: [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
    "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://www.pet-plus.co.in https://pet-plus.co.in https://images.unsplash.com",
    "media-src 'self' blob: https://www.pexels.com https://*.pexels.com",
    "connect-src 'self' https://www.pet-plus.co.in https://pet-plus.co.in https://api.razorpay.com https://www.google.com/recaptcha/",
    "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://www.google.com/recaptcha/",
  ].join("; "),
  referrerPolicy: "strict-origin-when-cross-origin",
  frameOptions: "SAMEORIGIN",
  contentTypeOptions: "nosniff",
  permissionsPolicy: "camera=(), microphone=(), geolocation=()",
};

export const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: securityHeaderValues.contentSecurityPolicy,
  },
  {
    key: "Referrer-Policy",
    value: securityHeaderValues.referrerPolicy,
  },
  {
    key: "X-Frame-Options",
    value: securityHeaderValues.frameOptions,
  },
  {
    key: "X-Content-Type-Options",
    value: securityHeaderValues.contentTypeOptions,
  },
  {
    key: "Permissions-Policy",
    value: securityHeaderValues.permissionsPolicy,
  },
];
