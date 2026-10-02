import type { Metadata } from 'next';
import HackmateApp from '../hackmate-app';

export const metadata: Metadata = {
  title: 'Builder Profile | Hackmate',
  description: 'Show your skills, availability, goals, and preferred role to compatible teams.',
};

export default function ProfilePage() {
  return <HackmateApp initialView="profile" />;
}
