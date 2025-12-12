export const environment = {
  production: true,
  authApiUrl: (process.env['AUTH_API_URL'] || 'https://your-production-domain.com') + '/api/auth',
};
