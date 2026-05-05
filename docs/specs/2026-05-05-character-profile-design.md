# Character Profile Feature — Design Spec

**Date:** 2026-05-05
**Status:** Approved

## Goal

Add a "My Character" section to Azeroth Today that displays essential profile information for the WoW character **Jsonparser** on the realm **Kel'Thuzad (US)**. This also serves as a meaningful CI/CD test payload to trigger the GitHub Actions → Docker Hub → EC2 deploy pipeline.

## Architecture

Follows the identical pattern already in use for affixes and events:

```
Blizzard Profile API
       ↓
Express route (GET /api/character)   ← new: server/routes/character.js
       ↓
React hook (useCharacter)            ← new: client/src/hooks/useCharacter.js
       ↓
React component (CharacterCard)      ← new: client/src/components/CharacterCard.jsx
       ↓
App.jsx section                      ← modified: placed below header, above season banner
```

## Backend

### `server/routes/character.js`

- Route: `GET /api/character`
- Calls Blizzard Profile API:
  ```
  GET https://us.api.blizzard.com/profile/wow/character/kelthuzad/jsonparser
      ?namespace=profile-us&locale=en_US
  ```
- Uses `getToken()` from `./token` (existing shared helper — Bearer auth)
- On success: forwards the full JSON response to the client
- On Blizzard API non-ok: returns the upstream status code + `{ error: "Blizzard API error: ..." }`
- On network/token failure: returns 502 + `{ error: err.message }`

### `server/index.js` (modified)

Mount the new router:
```js
const characterRouter = require('./routes/character');
app.use('/api', characterRouter);
```

## Frontend

### `client/src/hooks/useCharacter.js`

Returns `{ character, loading, error }`.

- Fetches `GET /api/character` (relative URL — works in dev via Vite proxy, in prod via Express)
- `character` is the raw Blizzard response object, or `null` on error
- Sets `loading: false` and `error: <message>` on failure

### `client/src/components/CharacterCard.jsx`

Displays the following fields from the Blizzard response:

| Field | Source path |
|-------|-------------|
| Name | `character.name` |
| Realm | `character.realm.name` |
| Class | `character.character_class.name` |
| Spec | `character.active_spec.name` |
| Level | `character.level` |
| Item Level | `character.equipped_item_level` |

- Renders as a single `.card` using the existing card CSS classes
- Each field is a `.character-stat` row: bold label + value
- If any field is missing (optional chaining), shows `"—"` as fallback
- Empty/null `character` prop → renders nothing (parent handles loading/error)

### `client/src/App.jsx` (modified)

New section added immediately after `<header>`, before the season banner:

```
[header]
[Character section]   ← new
[season-banner]
[Mythic+ Affixes]
[Active Events]
```

- Section title: "My Character"
- Shows `<LoadingSkeleton count={1} />` while loading
- Shows `<div className="error-banner">` if error
- Shows `<CharacterCard character={character} />` when loaded

### `client/src/index.css` (modified)

Add `.character-stat` style:
```css
.character-stat {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.2rem 0;
  border-bottom: 1px solid rgba(200, 169, 81, 0.08);
  font-size: 0.95rem;
}

.character-stat:last-child {
  border-bottom: none;
}

.character-stat-label {
  color: var(--text-muted);
  font-family: var(--font-heading);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.character-stat-value {
  color: var(--text-primary);
  font-weight: 600;
}
```

## Data Contract

The Blizzard Character Profile API response shape used:

```json
{
  "name": "Jsonparser",
  "realm": { "name": "Kel'Thuzad" },
  "character_class": { "name": "Warrior" },
  "active_spec": { "name": "Arms" },
  "level": 80,
  "equipped_item_level": 620
}
```

All field accesses use optional chaining with `"—"` as fallback.

## Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Blizzard API non-ok response | Express returns upstream status + `{ error }`, frontend shows error-banner |
| Network / token failure | Express returns 502 + `{ error }`, frontend shows error-banner |
| Missing field in response | `?.` optional chaining shows `"—"` — card still renders |
| Character not found (404) | error-banner: "Failed to load character: Blizzard API error: ..." |

## Files Changed

| File | Type |
|------|------|
| `server/routes/character.js` | Create |
| `server/index.js` | Modify (add 2 lines) |
| `client/src/hooks/useCharacter.js` | Create |
| `client/src/components/CharacterCard.jsx` | Create |
| `client/src/App.jsx` | Modify (add ~15 lines) |
| `client/src/index.css` | Modify (add ~20 lines) |
