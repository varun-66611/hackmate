'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Tab = 'home' | 'discover' | 'events' | 'team' | 'profile';
type WorkspaceTab = 'chat' | 'tasks' | 'links';

const navItems: { id: Tab; label: string; shortLabel: string; icon: string }[] = [
  { id: 'home', label: 'Home', shortLabel: 'Home', icon: '◇' },
  { id: 'discover', label: 'Find teammates', shortLabel: 'People', icon: '⌕' },
  { id: 'events', label: 'Competitions', shortLabel: 'Events', icon: '▦' },
  { id: 'team', label: 'Team workspace', shortLabel: 'Team', icon: '◉' },
  { id: 'profile', label: 'My profile', shortLabel: 'You', icon: '○' },
];

const teammates = [
  { id: 'maya', name: 'Maya Singh', initials: 'MS', role: 'ML Engineer', college: 'VIT Chennai', level: 'Intermediate', availability: 'This weekend', score: 94, accent: 'coral', skills: ['Python', 'NLP', 'FastAPI'], reason: 'Adds the ML skill your team is missing' },
  { id: 'arjun', name: 'Arjun Mehta', initials: 'AM', role: 'Product Designer', college: 'SRM Institute', level: 'Advanced', availability: 'Evenings', score: 91, accent: 'teal', skills: ['Figma', 'UX Research', 'Motion'], reason: 'Shares your climate-tech interests' },
  { id: 'nisha', name: 'Nisha Rao', initials: 'NR', role: 'Backend Developer', college: 'VIT Chennai', level: 'Advanced', availability: 'Fri - Sun', score: 88, accent: 'violet', skills: ['Node.js', 'Postgres', 'APIs'], reason: 'Available when the rest of your team is' },
  { id: 'dev', name: 'Dev Khanna', initials: 'DK', role: 'Pitch & Strategy', college: 'IIT Madras', level: 'Beginner', availability: 'Remote', score: 84, accent: 'amber', skills: ['Storytelling', 'Research', 'Growth'], reason: 'Brings the pitch strength your squad needs' },
];

const competitions = [
  { id: 'innovate', day: '18', month: 'OCT', title: 'Innovate India 2026', host: 'Google Developer Groups', mode: 'Hybrid · Chennai', deadline: 'Closes in 9 days', prize: '₹8L prize pool', tags: ['AI for good', 'FinTech', 'Climate'], tone: 'violet' },
  { id: 'buildspace', day: '26', month: 'OCT', title: 'Buildspace Nights', host: 'Founders Hub', mode: 'Online', deadline: 'Closes in 17 days', prize: '$10K in grants', tags: ['Open track', 'Consumer', 'Web3'], tone: 'teal' },
  { id: 'designathon', day: '08', month: 'NOV', title: 'Designathon South', host: 'UX India', mode: 'On-site · Bengaluru', deadline: 'Closes in 24 days', prize: '₹3L prize pool', tags: ['Design', 'Accessibility', 'Health'], tone: 'coral' },
];

const initialMessages = [
  { id: 1, author: 'Nisha', initials: 'NR', text: 'I pushed the Supabase schema and added the team capacity guard.', time: '10:24', mine: false },
  { id: 2, author: 'You', initials: 'RV', text: 'Perfect. I will wire it into the team invite flow today.', time: '10:31', mine: true },
  { id: 3, author: 'Jai', initials: 'JK', text: 'The pitch deck outline is ready too. We are moving fast 🚀', time: '10:36', mine: false },
];

const initialTasks = [
  { id: 1, title: 'Finalize problem statement', owner: 'You', due: 'Today', done: true },
  { id: 2, title: 'Connect recommendation API', owner: 'Nisha', due: 'Tomorrow', done: false },
  { id: 3, title: 'Prototype onboarding flow', owner: 'Jai', due: 'Oct 5', done: false },
  { id: 4, title: 'Record 90-second demo', owner: 'Team', due: 'Oct 8', done: false },
];

function Avatar({ initials, accent = 'violet', small = false }: { initials: string; accent?: string; small?: boolean }) {
  return <span className={`avatar avatar-${accent}${small ? ' avatar-small' : ''}`} aria-hidden="true">{initials}</span>;
}

function PageTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <header className="page-title"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{subtitle}</p></header>;
}

export default function HackmateApp() {
  const [active, setActive] = useState<Tab>('home');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [invited, setInvited] = useState<string[]>([]);
  const [savedEvents, setSavedEvents] = useState<string[]>(['innovate']);
  const [interestedEvents, setInterestedEvents] = useState<string[]>([]);
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('chat');
  const [messages, setMessages] = useState(initialMessages);
  const [messageDraft, setMessageDraft] = useState('');
  const [tasks, setTasks] = useState(initialTasks);
  const [lookingForTeam, setLookingForTeam] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('hackmate-state');
      if (saved) {
        const state = JSON.parse(saved);
        setInvited(state.invited ?? []);
        setSavedEvents(state.savedEvents ?? ['innovate']);
        setInterestedEvents(state.interestedEvents ?? []);
        setTasks(state.tasks ?? initialTasks);
        setMessages(state.messages ?? initialMessages);
        setLookingForTeam(state.lookingForTeam ?? true);
      }
    } catch { /* Start with the safe demo state. */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem('hackmate-state', JSON.stringify({ invited, savedEvents, interestedEvents, tasks, messages, lookingForTeam }));
  }, [hydrated, invited, savedEvents, interestedEvents, tasks, messages, lookingForTeam]);

  const filteredPeople = useMemo(() => teammates.filter((person) => {
    const matchesQuery = `${person.name} ${person.role} ${person.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'All' || person.role.includes(filter) || person.skills.some((skill) => skill.includes(filter));
    return matchesQuery && matchesFilter;
  }), [query, filter]);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2200);
  };

  const navigate = (tab: Tab) => {
    setActive(tab);
    setNotificationsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleInvite = (id: string, name: string) => {
    setInvited((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    if (!invited.includes(id)) flash(`Invite sent to ${name}`);
  };

  const toggleSaved = (id: string) => setSavedEvents((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleInterested = (id: string, title: string) => {
    setInterestedEvents((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    if (!interestedEvents.includes(id)) flash(`${title} added to your plan`);
  };

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    const text = messageDraft.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: Date.now(), author: 'You', initials: 'RV', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), mine: true }]);
    setMessageDraft('');
  };

  const completedTasks = tasks.filter((task) => task.done).length;

  return (
    <main className="app-shell">
      <aside className="side-nav" aria-label="Primary navigation">
        <button className="brand" type="button" onClick={() => navigate('home')} aria-label="Hackmate home">
          <span className="brand-mark">H</span><span>hackmate</span>
        </button>
        <nav>
          {navItems.map((item) => <button key={item.id} type="button" className={active === item.id ? 'nav-item active' : 'nav-item'} onClick={() => navigate(item.id)}><span aria-hidden="true">{item.icon}</span>{item.label}</button>)}
        </nav>
        <div className="side-note"><span>✦</span><p><strong>Team chemistry</strong><small>Balanced across 4 core roles</small></p></div>
        <button className="profile-mini" type="button" onClick={() => navigate('profile')}>
          <Avatar initials="RV" small /><span><strong>Ram Varsham</strong><small>Builder mode</small></span><b>›</b>
        </button>
      </aside>

      <section className="content">
        <header className="topbar">
          <button className="mobile-brand" type="button" onClick={() => navigate('home')}><span className="brand-mark">H</span><strong>hackmate</strong></button>
          <div className="online-signal"><span className="signal-dot" /> 8 builders online now</div>
          <div className="top-actions"><button className="search-jump" type="button" onClick={() => navigate('discover')}><span>⌕</span> Search people</button><button className="icon-button" type="button" aria-label="Open notifications" onClick={() => setNotificationsOpen(true)}><span>●</span><b>3</b></button></div>
        </header>

        <div className="main-stage">
          {active === 'home' && <>
            <section className="home-grid">
              <article className="welcome-card">
                <div className="hero-glow" /><p className="eyebrow">YOUR BUILD PULSE</p><h1>One teammate away<br />from <em>ready.</em></h1>
                <p className="hero-copy">Your squad has product, design, and data covered. Find the backend builder who makes it whole.</p>
                <button className="primary-button" type="button" onClick={() => navigate('discover')}>Meet your matches <span>↗</span></button>
                <div className="connection-map" aria-hidden="true"><span className="map-line line-a" /><span className="map-line line-b" /><span className="map-node node-a"><Avatar initials="MS" accent="coral" small /></span><span className="map-node node-b"><Avatar initials="AM" accent="teal" small /></span><span className="map-node node-c"><Avatar initials="NR" accent="violet" small /></span></div>
              </article>

              <article className="pulse-card panel">
                <div className="section-heading"><div><p className="eyebrow">TEAM READINESS</p><h2>Pixel Pioneers</h2></div><span className="status-pill">3 of 4</span></div>
                <div className="readiness-ring"><div><strong>75</strong><span>%</span><small>ready</small></div></div>
                <div className="team-row"><div className="stacked-avatars"><Avatar initials="RV" small /><Avatar initials="NR" accent="violet" small /><Avatar initials="JK" accent="teal" small /><span className="empty-avatar">+</span></div><p><strong>Backend role open</strong><small>2 matches found</small></p></div>
                <button className="text-button" type="button" onClick={() => navigate('team')}>Open team room <span>→</span></button>
              </article>
            </section>

            <section className="section-block">
              <div className="section-heading large"><div><p className="eyebrow">EXPLAINABLE MATCHES</p><h2>People worth meeting</h2><p>Suggested for the actual gaps in your team.</p></div><button className="text-button" type="button" onClick={() => navigate('discover')}>View all <span>→</span></button></div>
              <div className="match-grid compact">
                {teammates.slice(0, 3).map((person) => <PersonCard key={person.id} person={person} invited={invited.includes(person.id)} onInvite={() => toggleInvite(person.id, person.name)} compact />)}
              </div>
            </section>

            <section className="event-strip panel">
              <div className="event-date"><strong>18</strong><span>OCT</span></div><div className="event-main"><p className="eyebrow">NEXT UP · HYBRID</p><h2>Innovate India 2026</h2><p>AI for good · FinTech · Climate</p></div><div className="event-countdown"><strong>9</strong><span>days to register</span></div><button className="secondary-button" type="button" onClick={() => navigate('events')}>View event</button>
            </section>
          </>}

          {active === 'discover' && <section className="page-view">
            <PageTitle eyebrow="DISCOVER" title="Find your missing piece." subtitle="Matches are ranked by team skill gaps, shared interests, and overlapping availability." />
            <div className="search-panel panel"><label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, role, or skill" aria-label="Search teammates" /></label><button className="filter-button" type="button" onClick={() => flash('Filters are set to your current availability')}>Availability · Weekend</button></div>
            <div className="filter-chips" aria-label="Filter teammates">{['All', 'Backend', 'Designer', 'Python', 'Beginner'].map((item) => <button type="button" key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
            <div className="results-meta"><p><strong>{filteredPeople.length}</strong> compatible builders</p><span>Sorted by team fit</span></div>
            {filteredPeople.length ? <div className="match-grid discover-grid">{filteredPeople.map((person) => <PersonCard key={person.id} person={person} invited={invited.includes(person.id)} onInvite={() => toggleInvite(person.id, person.name)} />)}</div> : <div className="empty-state panel"><span>⌕</span><h2>No exact matches yet</h2><p>Try a broader skill or clear the active filter.</p><button className="secondary-button" type="button" onClick={() => { setQuery(''); setFilter('All'); }}>Clear filters</button></div>}
          </section>}

          {active === 'events' && <section className="page-view">
            <PageTitle eyebrow="COMPETITIONS" title="Pick a challenge worth losing sleep over." subtitle="Discover verified events, build a team, then register through the official organizer link." />
            <div className="event-tabs"><button className="active" type="button">For you</button><button type="button" onClick={() => flash(`${savedEvents.length} saved competitions`)}>Saved {savedEvents.length ? `(${savedEvents.length})` : ''}</button><button type="button" onClick={() => flash('Showing online-friendly events')}>Online</button></div>
            <div className="competition-list">{competitions.map((event) => <article className={`competition-card panel tone-${event.tone}`} key={event.id}><div className="event-date"><strong>{event.day}</strong><span>{event.month}</span></div><div className="competition-info"><div className="competition-title-row"><div><p className="eyebrow">{event.host}</p><h2>{event.title}</h2></div><button className={savedEvents.includes(event.id) ? 'bookmark saved' : 'bookmark'} type="button" aria-label={savedEvents.includes(event.id) ? 'Remove bookmark' : 'Bookmark event'} onClick={() => toggleSaved(event.id)}>{savedEvents.includes(event.id) ? '★' : '☆'}</button></div><div className="competition-meta"><span>{event.mode}</span><span>{event.prize}</span><span>{event.deadline}</span></div><div className="tag-row">{event.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="event-actions"><button className={interestedEvents.includes(event.id) ? 'secondary-button selected' : 'secondary-button'} type="button" onClick={() => toggleInterested(event.id, event.title)}>{interestedEvents.includes(event.id) ? '✓ Interested' : 'I’m interested'}</button><button className="text-button" type="button" onClick={() => flash('Official registration opens in a new tab on launch')}>Official page ↗</button></div></div></article>)}</div>
          </section>}

          {active === 'team' && <section className="page-view workspace-view">
            <div className="workspace-head panel"><div><p className="eyebrow">ACTIVE SQUAD · INNOVATE INDIA</p><h1>Pixel Pioneers</h1><p>3 members · 1 role open · Submission due Oct 18</p></div><div className="stacked-avatars"><Avatar initials="RV" /><Avatar initials="NR" accent="violet" /><Avatar initials="JK" accent="teal" /><span className="empty-avatar">+</span></div></div>
            <div className="workspace-tabs" role="tablist">{(['chat', 'tasks', 'links'] as WorkspaceTab[]).map((item) => <button key={item} type="button" role="tab" aria-selected={workspaceTab === item} className={workspaceTab === item ? 'active' : ''} onClick={() => setWorkspaceTab(item)}>{item === 'chat' ? 'Team chat' : item === 'tasks' ? `Tasks ${completedTasks}/${tasks.length}` : 'Project links'}</button>)}</div>
            {workspaceTab === 'chat' && <div className="chat-layout"><section className="chat-panel panel"><div className="chat-head"><div><span className="signal-dot" /><strong>Team chat</strong></div><span>Private to team members</span></div><div className="messages" aria-live="polite">{messages.map((message) => <article className={message.mine ? 'message mine' : 'message'} key={message.id}>{!message.mine && <Avatar initials={message.initials} accent={message.initials === 'NR' ? 'violet' : 'teal'} small />}<div><p><strong>{message.author}</strong><time>{message.time}</time></p><span>{message.text}</span></div></article>)}</div><form className="message-form" onSubmit={sendMessage}><input value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} placeholder="Message Pixel Pioneers…" aria-label="Message team" /><button type="submit" aria-label="Send message">↑</button></form></section><aside className="team-aside"><div className="aside-card panel"><p className="eyebrow">NEXT DEADLINE</p><strong>Connect match API</strong><span>Tomorrow · Nisha</span><div className="mini-rail"><span /></div></div><div className="aside-card panel"><p className="eyebrow">MISSING SKILL</p><strong>Backend systems</strong><span>2 recommended builders</span><button className="text-button" type="button" onClick={() => navigate('discover')}>Find someone →</button></div></aside></div>}
            {workspaceTab === 'tasks' && <section className="task-panel panel"><div className="task-summary"><div><p className="eyebrow">SHIP PLAN</p><h2>{completedTasks} of {tasks.length} complete</h2></div><div className="task-progress"><span style={{ width: `${completedTasks / tasks.length * 100}%` }} /></div></div><div className="task-list">{tasks.map((task) => <label key={task.id} className={task.done ? 'task done' : 'task'}><input type="checkbox" checked={task.done} onChange={() => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))} /><span className="checkmark">✓</span><span><strong>{task.title}</strong><small>{task.owner}</small></span><time>{task.due}</time></label>)}</div><button className="secondary-button" type="button" onClick={() => { setTasks((current) => [...current, { id: Date.now(), title: 'New team task', owner: 'You', due: 'This week', done: false }]); flash('New task added'); }}>+ Add task</button></section>}
            {workspaceTab === 'links' && <section className="links-grid"><article className="link-card panel"><span className="link-icon">F</span><div><p className="eyebrow">DESIGN</p><h2>Product prototype</h2><span>figma.com/pixel-pioneers</span></div><button type="button" onClick={() => flash('Project link copied')}>↗</button></article><article className="link-card panel"><span className="link-icon code">G</span><div><p className="eyebrow">CODE</p><h2>Hackmate repository</h2><span>github.com/team/pixel-pioneers</span></div><button type="button" onClick={() => flash('Project link copied')}>↗</button></article><article className="link-card panel add-link"><span>+</span><h2>Add project link</h2><button className="text-button" type="button" onClick={() => flash('Link form ready for your URL')}>Add link</button></article></section>}
          </section>}

          {active === 'profile' && <section className="page-view profile-view">
            <PageTitle eyebrow="YOUR BUILDER PROFILE" title="Be easy to choose." subtitle="A complete, specific profile helps serious teams find you faster." />
            <section className="profile-hero panel"><div className="profile-identity"><Avatar initials="RV" /><div><div className="verified-row"><h2>Ram Varsham</h2><span>✓ College verified</span></div><p>Full-stack builder who enjoys turning ambitious weekend ideas into products people can actually use.</p><div className="profile-location"><span>VIT Chennai</span><span>Computer Science</span><span>Intermediate</span></div></div></div><button className="secondary-button" type="button" onClick={() => flash('Profile edit mode enabled')}>Edit profile</button></section>
            <div className="profile-grid"><section className="profile-card panel"><div className="section-heading"><div><p className="eyebrow">STATUS</p><h2>Open to build</h2></div><button className={lookingForTeam ? 'toggle on' : 'toggle'} type="button" role="switch" aria-checked={lookingForTeam} onClick={() => setLookingForTeam((value) => !value)}><span /></button></div><p>{lookingForTeam ? 'Teams can find and invite you right now.' : 'Your profile is hidden from new team searches.'}</p></section><section className="profile-card panel"><p className="eyebrow">COLLABORATION</p><h2>Not yet reviewed</h2><p>Complete your first recorded event to exchange verified teammate reviews.</p></section></div>
            <section className="profile-card panel skills-card"><div className="section-heading"><div><p className="eyebrow">SKILLS & ROLES</p><h2>Your building blocks</h2></div><span className="self-reported">Self-reported</span></div><div className="large-skill-row"><span>React</span><span>TypeScript</span><span>Product thinking</span><span>Node.js</span><span>UI prototyping</span><button type="button" onClick={() => flash('Add another skill from edit profile')}>+</button></div></section>
            <section className="profile-card panel preference-card"><p className="eyebrow">TEAM PREFERENCES</p><div className="preference-grid"><div><span>Goal</span><strong>Competitive + learning</strong></div><div><span>Availability</span><strong>Fri evenings, weekends</strong></div><div><span>Work mode</span><strong>Hybrid or online</strong></div><div><span>Preferred role</span><strong>Full-stack developer</strong></div></div></section>
          </section>}
        </div>
      </section>

      <nav className="bottom-nav" aria-label="Mobile navigation">{navItems.map((item) => <button key={item.id} type="button" className={active === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><span aria-hidden="true">{item.icon}</span><small>{item.shortLabel}</small></button>)}</nav>

      {notificationsOpen && <div className="drawer-layer"><button className="drawer-scrim" type="button" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)} /><aside className="notification-drawer" aria-label="Notifications"><div className="drawer-head"><div><p className="eyebrow">UPDATES</p><h2>Notifications</h2></div><button type="button" onClick={() => setNotificationsOpen(false)} aria-label="Close">×</button></div><div className="notification-list"><article className="unread"><span className="notice-icon violet">✦</span><div><strong>Maya accepted your invite</strong><p>She joined Pixel Pioneers as ML Engineer.</p><time>8 min ago</time></div></article><article className="unread"><span className="notice-icon teal">◉</span><div><strong>New team message</strong><p>Nisha mentioned you in Team Chat.</p><time>22 min ago</time></div></article><article><span className="notice-icon amber">▦</span><div><strong>Registration closing soon</strong><p>Innovate India closes in 9 days.</p><time>2 hr ago</time></div></article></div><button className="secondary-button drawer-action" type="button" onClick={() => { flash('All notifications marked as read'); setNotificationsOpen(false); }}>Mark all as read</button></aside></div>}
      {notice && <div className="toast" role="status"><span>✓</span>{notice}</div>}
    </main>
  );
}

function PersonCard({ person, invited, onInvite, compact = false }: { person: typeof teammates[number]; invited: boolean; onInvite: () => void; compact?: boolean }) {
  return <article className={`match-card panel${compact ? ' compact-card' : ''}`}><div className="match-top"><Avatar initials={person.initials} accent={person.accent} /><div className="match-score"><strong>{person.score}%</strong><span>team fit</span></div></div><h3>{person.name}</h3><p>{person.role} · {person.college}</p><div className="tag-row skills">{person.skills.map((skill) => <span key={skill}>{skill}</span>)}</div><div className="why-match"><span>✦</span><p><strong>Why this match</strong>{person.reason}</p></div>{!compact && <div className="person-meta"><span>{person.level}</span><span>{person.availability}</span></div>}<button className={invited ? 'invite-button invited' : 'invite-button'} type="button" onClick={onInvite}>{invited ? '✓ Invite sent' : 'Invite to team'}</button></article>;
}
