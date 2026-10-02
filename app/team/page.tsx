import type { Metadata } from 'next';
import HackmateApp from '../hackmate-app';

export const metadata: Metadata = {
  title: 'Team Workspace | Hackmate',
  description: 'Chat, plan tasks, track deadlines, and share project links with your hackathon team.',
};

export default function TeamPage() {
  return <HackmateApp initialView="team" />;
}
