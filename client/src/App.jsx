import { useEvents } from './hooks/useEvents';
import { useAffixes } from './hooks/useAffixes';
import { useCharacter } from './hooks/useCharacter';
import EventCard from './components/EventCard';
import AffixCard from './components/AffixCard';
import CharacterCard from './components/CharacterCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import EmptyState from './components/EmptyState';

export default function App() {
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const { affixes, seasonName, loading: affixesLoading, error: affixesError } = useAffixes();
  const { character, loading: characterLoading, error: characterError } = useCharacter();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Azeroth Today</h1>
        <p className="subtitle">World of Warcraft — Live Event Tracker</p>
      </header>

      {/* My Character */}
      <h2 className="section-title">My Character</h2>
      {characterError && (
        <div className="error-banner">Failed to load character: {characterError}</div>
      )}
      {characterLoading ? (
        <LoadingSkeleton count={1} />
      ) : (
        <div className="grid" style={{ marginBottom: '3rem' }}>
          <CharacterCard character={character} />
        </div>
      )}

      {seasonName && (
        <div className="season-banner">Current Season: {seasonName}</div>
      )}

      {/* Mythic+ Affixes */}
      <h2 className="section-title">Mythic+ Affixes</h2>
      {affixesError && (
        <div className="error-banner">Failed to load affixes: {affixesError}</div>
      )}
      {affixesLoading ? (
        <LoadingSkeleton count={1} />
      ) : (
        <div className="grid" style={{ marginBottom: '3rem' }}>
          <AffixCard affixes={affixes} />
        </div>
      )}

      {/* In-Game Events */}
      <h2 className="section-title">Active Events</h2>
      {eventsError && (
        <div className="error-banner">Failed to load events: {eventsError}</div>
      )}
      {eventsLoading ? (
        <LoadingSkeleton count={6} />
      ) : events.length === 0 ? (
        <EmptyState message="No active in-game events found." />
      ) : (
        <div className="grid">
          {events.map((event, i) => (
            <EventCard key={event.id ?? i} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
