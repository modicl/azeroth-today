import { useState, useEffect } from 'react';

function formatDate(ts) {
  if (!ts) return 'Unknown';
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getCountdown(endTs) {
  if (!endTs) return null;
  const diff = endTs - Date.now();
  if (diff <= 0) return 'Ended';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `Ends in ${d}d ${h}h`;
  if (h > 0) return `Ends in ${h}h ${m}m`;
  return `Ends in ${m}m`;
}

export default function EventCard({ event }) {
  const endTs = event.end_timestamp;
  const [countdown, setCountdown] = useState(() => getCountdown(endTs));

  useEffect(() => {
    if (!endTs) return;
    const interval = setInterval(() => setCountdown(getCountdown(endTs)), 60000);
    return () => clearInterval(interval);
  }, [endTs]);

  const name = event.name?.en_US ?? event.name ?? 'Unknown Event';

  return (
    <div className="card">
      <div className="card-title">{name}</div>
      <div className="card-meta">Start: {formatDate(event.start_timestamp)}</div>
      <div className="card-meta">End: {formatDate(endTs)}</div>
      {countdown && <div className="card-countdown">{countdown}</div>}
    </div>
  );
}
