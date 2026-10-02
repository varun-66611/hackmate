import type { Metadata } from 'next';
import HackmateApp from '../hackmate-app';

export const metadata: Metadata = {
  title: 'Competitions | Hackmate',
  description: 'Explore upcoming hackathons and competitions, then assemble the right team.',
};

export default function EventsPage() {
  return <HackmateApp initialView="events" />;
}
