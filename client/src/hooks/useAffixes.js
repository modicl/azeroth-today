import { useState, useEffect } from 'react';

export function useAffixes() {
  const [affixes, setAffixes] = useState([]);
  const [seasonName, setSeasonName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAffixes() {
      try {
        const res = await fetch('/api/mythic-keystone/affix/index');
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `HTTP ${res.status}`);
        }
        const data = await res.json();
        // Blizzard returns { current_period: { affixes: [...] }, season: { name: '...' } }
        const affixList = data.current_period?.affixes ?? data.affixes ?? [];
        setAffixes(affixList);
        setSeasonName(data.season?.name ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAffixes();
  }, []);

  return { affixes, seasonName, loading, error };
}
