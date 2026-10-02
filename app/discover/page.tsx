import type { Metadata } from 'next';
import HackmateApp from '../hackmate-app';

export const metadata: Metadata = {
  title: 'Find Teammates | Hackmate',
  description: 'Discover compatible hackathon teammates by skills, roles, interests, and availability.',
};

export default function DiscoverPage() {
  return <HackmateApp initialView="discover" />;
}
