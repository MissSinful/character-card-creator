# TODO - Character Card Creator

## Current Sprint: MVP

### Setup
- [ ] Initialize Vite + React project
- [ ] Configure Tailwind CSS
- [ ] Set up project structure per PLAN.md

### Core Components
- [ ] App.jsx - Main shell with tab navigation
- [ ] BasicsForm.jsx - Input form for character skeleton
- [ ] DescriptionEditor.jsx - Generated description display/edit
- [ ] FirstMessageEditor.jsx - First message display/edit
- [ ] AltGreetingsEditor.jsx - Collapsible greeting management
- [ ] TagManager.jsx - Tag input/display/AI generation
- [ ] AdvancedOptions.jsx - System prompt, examples, etc.

### AI Integration
- [ ] lib/ai.js - API call wrapper with error handling
- [ ] lib/prompts.js - All prompt templates
- [ ] useAIGeneration.js hook - Loading states, error handling

### State Management
- [ ] useCharacterCard.js hook - Central state for card data
- [ ] Separate basics state from card state (basics → generate → card)

### Import/Export
- [ ] lib/export.js - Generate valid chara_card_v2 JSON
- [ ] lib/import.js - Parse uploaded JSON, handle v1/v2 formats

### UX Polish
- [ ] Loading spinners during AI generation
- [ ] Error toasts for failed generations
- [ ] Autosave to localStorage
- [ ] Confirmation before discarding unsaved changes

---

## Backlog

### Phase 2 Features
- [ ] Tone selector (dark, fluffy, slow burn, smut, wholesome)
- [ ] NSFW level toggle (SFW, Suggestive, Explicit)
- [ ] Scenario hint input for alt greetings
- [ ] Template library with preset basics
- [ ] PNG export with embedded data (requires canvas manipulation)

### Phase 3 Features
- [ ] Lorebook editor (entries, keys, recursion settings)
- [ ] Image upload → base64 avatar
- [ ] Multiple export formats
- [ ] Character variants (same base, different scenarios)

---

## Known Issues / Tech Debt
- None yet

---

## Notes

### AI Generation Considerations
- Sonnet 4 works well for character writing
- 4000 max_tokens is usually enough for descriptions
- Consider streaming for better UX on long generations
- Need to handle rate limits gracefully

### Character Card Quirks
- Some frontends expect `personality` field even if empty
- Tags are strings, not objects
- `alternate_greetings` is array of strings, not objects
- `extensions` object varies by source (chub, etc.)
