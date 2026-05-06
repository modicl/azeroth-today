export default function CharacterCard({ character }) {
  if (!character) return null;

  const stats = [
    { label: 'Name',       value: character.name },
    { label: 'Realm',      value: character.realm?.name },
    { label: 'Class',      value: character.character_class?.name },
    { label: 'Spec',       value: character.active_spec?.name },
    { label: 'Level',      value: character.level },
    { label: 'Item Level', value: character.equipped_item_level },
  ];

  return (
    <div className="card">
      {stats.map(({ label, value }) => (
        <div key={label} className="character-stat">
          <span className="character-stat-label">{label}</span>
          <span className="character-stat-value">{value ?? '—'}</span>
        </div>
      ))}
    </div>
  );
}
