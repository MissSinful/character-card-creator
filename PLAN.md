# Character Card Creator - Project Plan

## Vision

An AI-powered web application for creating detailed roleplay character cards. Users provide basic information (name, traits, scenario), and AI generates comprehensive character descriptions, first messages, and alternate greetings in the proper format for SillyTavern and other frontends.

## Target Users

- Roleplay enthusiasts who want detailed characters without writing 2000+ words themselves
- People who have character concepts but struggle with execution
- Users who want to quickly iterate on character variants

## Core Workflow

```
1. BASICS → User fills in skeleton info
   - Name, age, gender, title/role
   - Key personality traits (bullet points)
   - Appearance notes
   - Scenario/premise
   - Relationship to {{user}}
   - Additional notes/themes

2. GENERATE DESCRIPTION → AI expands basics into full profile
   - 800-1200 word detailed description
   - Structured with: Appearance, Personality, Behavior, Background, Core Tension
   - Uses {{user}} placeholder appropriately

3. GENERATE FIRST MESSAGE → AI writes opening post
   - First-person perspective from character
   - 400-800 words
   - Sets up scene, shows personality, creates hooks
   - Includes internal monologue

4. GENERATE ALT GREETINGS → AI creates variant scenarios
   - Each greeting is unique situation
   - User can provide scenario hints ("at a gala", "finding a secret", etc.)
   - Unlimited greetings

5. EDIT & REFINE → User tweaks all generated content
   - Full manual editing
   - Regenerate individual sections
   - Add/remove tags

6. EXPORT → Download as chara_card_v2 JSON
   - Proper format for SillyTavern import
   - All metadata included
```

## Key Features

### MVP (Phase 1)
- [ ] Basic form for character info input
- [ ] AI generation for description
- [ ] AI generation for first message
- [ ] AI generation for alternate greetings
- [ ] Manual editing of all fields
- [ ] Tag management (manual + AI-suggested)
- [ ] JSON export in chara_card_v2 format
- [ ] JSON import for editing existing cards

### Phase 2
- [ ] Tone/style presets (dark, fluffy, slow burn, comedic)
- [ ] NSFW level toggle affecting generation
- [ ] Scenario hints for alt greetings
- [ ] Template library (CEO, Fantasy Knight, Vampire, etc.)
- [ ] PNG export with embedded character data
- [ ] LocalStorage autosave

### Phase 3
- [ ] Lorebook/character book editor
- [ ] World info management
- [ ] Image upload for avatar
- [ ] Multiple export formats (v1, v2, Tavern, etc.)
- [ ] Character variant management (same char, different scenarios)
- [ ] Sharing/publishing integration

## Tech Stack

- **Framework**: React (Vite or Next.js)
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **State**: React hooks (useState, useReducer for complex state)
- **Storage**: LocalStorage for autosave, IndexedDB for larger data

## AI Integration Architecture

### API Pattern
```javascript
const callAI = async (prompt, systemPrompt) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await response.json();
  return data.content?.[0]?.text || '';
};
```

### Generation Prompts (see docs/PROMPTS.md)
- Each generation type has a tuned prompt
- Prompts reference existing content for consistency
- Prompts enforce {{user}} placeholder usage

## File Structure

```
character-card-creator/
├── PLAN.md                 # This file
├── TODO.md                 # Current tasks
├── docs/
│   ├── CHARA_CARD_SPEC.md  # Character card format spec
│   └── PROMPTS.md          # AI prompt templates
├── src/
│   ├── components/
│   │   ├── App.jsx              # Main app shell
│   │   ├── BasicsForm.jsx       # Initial info input
│   │   ├── DescriptionEditor.jsx
│   │   ├── FirstMessageEditor.jsx
│   │   ├── AltGreetingsEditor.jsx
│   │   ├── TagManager.jsx
│   │   ├── AdvancedOptions.jsx
│   │   └── ui/                  # Reusable UI components
│   ├── lib/
│   │   ├── ai.js               # AI API calls
│   │   ├── prompts.js          # Prompt templates
│   │   ├── export.js           # Export functions
│   │   └── import.js           # Import/parse functions
│   ├── hooks/
│   │   ├── useCharacterCard.js # Main state management
│   │   └── useAIGeneration.js  # AI call handling
│   └── main.jsx
└── package.json
```

## UI/UX Notes

- Dark theme (zinc-900/950 base)
- Purple accent color for AI/magic actions
- Tab-based navigation through workflow
- Loading states with spinners during generation
- Collapsible sections for alt greetings
- Toast notifications for success/error
- Responsive but desktop-first

## Character Card Fields Reference

Required:
- `name` - Character name
- `description` - Full character profile
- `first_mes` - Opening message

Optional but common:
- `scenario` - Brief scenario description
- `personality` - Personality summary (often empty, folded into description)
- `alternate_greetings` - Array of alternate opening messages
- `tags` - Array of tag strings
- `mes_example` - Example dialogue
- `system_prompt` - Custom system instructions
- `post_history_instructions` - Instructions after chat history
- `creator_notes` - Meta notes about the card
- `character_version` - Version string

See docs/CHARA_CARD_SPEC.md for full format details.
