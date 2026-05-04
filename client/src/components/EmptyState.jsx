export default function EmptyState({ message = 'No active events at this time.' }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">⚔️</div>
      <p className="empty-state-text">{message}</p>
    </div>
  );
}
