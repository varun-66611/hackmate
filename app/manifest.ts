import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hackmate — Find your people. Build your thing.',
    short_name: 'Hackmate',
    description: 'Find compatible teammates, form balanced teams, and collaborate on hackathons.',
    start_url: '/',
    display: 'standalone',
    background_color: '#101117',
    theme_color: '#101117',
    orientation: 'portrait',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}
