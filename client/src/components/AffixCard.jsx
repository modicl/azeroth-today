export default function AffixCard({ affixes }) {
  if (!affixes || affixes.length === 0) {
    return (
      <div className="card">
        <div className="card-title">Mythic+ Affixes</div>
        <p className="card-meta" style={{ fontStyle: 'italic' }}>No affix data available.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">This Week's Affixes</div>
      <div className="affix-list" style={{ marginTop: '0.75rem' }}>
        {affixes.map((a, i) => {
          const name = a.keystone_affix?.name?.en_US ?? a.keystone_affix?.name ?? a.name ?? `Affix ${i + 1}`;
          const description = a.keystone_affix?.description?.en_US ?? '';
          return (
            <div key={i} className="affix-item">
              <div>
                <div className="affix-name">{name}</div>
                {description && <div className="affix-desc">{description}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
