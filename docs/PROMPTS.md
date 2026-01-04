# AI Prompt Templates

## Overview

This document contains the prompt templates used for AI generation. Each prompt is designed to produce consistent, high-quality output for character cards.

## System Prompt (Base)

Used as the system prompt for all generations:

```
You are an expert character writer specializing in detailed, psychologically complex characters for roleplay. Write in a vivid, engaging style. Do not include any preamble, explanation, or meta-commentary - output only the requested content.
```

## Description Generation

### Input Variables
- `name` - Character name
- `title` - Title/role (optional)
- `age` - Age (optional)
- `gender` - Gender
- `keyTraits` - Key personality traits
- `appearanceNotes` - Appearance details (optional)
- `scenarioPremise` - Scenario/setting (optional)
- `relationshipToUser` - Relationship to {{user}} (optional)
- `additionalNotes` - Extra details (optional)

### Prompt Template

```
Create a detailed character profile for a roleplay character with these details:

Name: {name}
Title/Role: {title || 'Not specified'}
Age: {age || 'Not specified'}
Gender: {gender}
Key Personality Traits: {keyTraits}
Appearance Notes: {appearanceNotes || 'Not specified'}
Scenario/Setting: {scenarioPremise || 'Not specified'}
Relationship to {{user}}: {relationshipToUser || 'Not specified'}
Additional Notes: {additionalNotes || 'None'}

Write a comprehensive character description including:
1. **Appearance** - Detailed physical description (height, build, features, style)
2. **Personality** - Multiple aspects covering different facets of their character
3. **Behavior Towards {{user}}** - How they act publicly vs privately, their dynamic
4. **Background** - Their history, what shaped them, key events
5. **Core Motivation/Tension** - What drives them, internal conflicts

Requirements:
- Use {{user}} to refer to the player character
- Format with markdown headers and bullet points where appropriate
- Be detailed and psychologically complex
- Around 800-1200 words
- Make the character feel real and three-dimensional
```

## First Message Generation

### Input Variables
- `description` - The full character description
- `scenario` - Scenario description (optional)

### Prompt Template

```
Based on this character description:

{description}

Scenario: {scenario || 'Not specified'}

Write a compelling first message/opening post for a roleplay. This should:
- Be written from the character's perspective (first person)
- Set up an interesting scene or situation that establishes the dynamic
- Show the character's personality through their thoughts and actions
- Include internal monologue revealing their thoughts about {{user}}
- Create hooks that invite {{user}} to respond
- Be around 400-800 words
- End with something {{user}} can naturally react to

Do not include any meta-text, instructions, or scene-setting brackets. Write only the first message itself as the character would deliver it.
```

## Alternate Greeting Generation

### Input Variables
- `description` - The full character description
- `existingGreetings` - Array of existing greetings (to avoid repetition)
- `scenarioHint` - Optional specific scenario to write (e.g., "at a gala")

### Prompt Template

```
Based on this character description:

{description}

{scenarioHint ? `Specific scenario to write: ${scenarioHint}` : 'Write a unique alternate opening scenario.'}

{existingGreetings.length > 0 ? `
Existing greetings (write something DIFFERENT from these):
${existingGreetings.map((g, i) => `${i + 1}. ${g.substring(0, 200)}...`).join('\n')}
` : ''}

Write an alternate first message/greeting that:
- Shows a completely different situation or context than any previous greetings
- Is written from the character's perspective (first person)
- Is around 400-700 words
- Maintains the character's voice and personality
- Creates interesting hooks for {{user}} to respond to
- Includes internal monologue

Output only the greeting text, no explanations or meta-commentary.
```

## Tag Generation

### Input Variables
- `description` - The full character description

### Prompt Template

```
Based on this character description:

{description}

Generate 15-25 relevant tags for this character card. Include a mix of:
- Character traits (e.g., Possessive, Dominant, Cold, Gentle)
- Content indicators (e.g., NSFW, SFW, Dark Themes, Fluff)
- Setting/genre (e.g., Modern, Fantasy, Office, Historical)
- Relationship dynamics (e.g., Slowburn, Enemies to Lovers, Boss/Employee)
- Character type (e.g., Male, Female, Human, Vampire)
- Format tags (e.g., Multiple Greetings, Fempov, OC)

Output ONLY a comma-separated list of tags, nothing else. No explanations, no numbering.
```

## Tone/Style Modifiers

These can be appended to prompts based on user selection:

### Dark/Angsty
```
Additional tone guidance: Write with a dark, intense atmosphere. Emphasize internal conflict, moral ambiguity, and emotional complexity. The character should feel dangerous or troubled.
```

### Fluffy/Wholesome
```
Additional tone guidance: Write with warmth and tenderness. Focus on sweet moments, genuine care, and emotional safety. The character should feel comforting and kind.
```

### Slow Burn
```
Additional tone guidance: Emphasize restraint and building tension. The character should be fighting their feelings, with lots of loaded glances, almost-touches, and internal conflict about their growing attraction.
```

### Smut/Explicit
```
Additional tone guidance: Include sensual awareness and sexual tension. The character's thoughts can include explicit desires. Physical descriptions can be more detailed and suggestive.
```

## Example Messages Generation (Future)

### Prompt Template

```
Based on this character description:

{description}

Write 2-3 example message exchanges showing this character's voice and style. Format as:

[START]
*action or description*
"Dialogue from the character"
Internal thoughts if relevant
[END]

Each example should demonstrate:
- Their unique speech patterns and vocabulary
- How they express emotion
- Their typical actions/mannerisms
- Appropriate length and detail level for responses
```

## Best Practices

1. **Always include the full description** when generating dependent content (first_mes, greetings) for consistency

2. **Reference existing content** when generating multiples (greetings) to ensure variety

3. **Keep system prompt minimal** - the heavy lifting is in the user prompt

4. **Handle empty optionals gracefully** - don't include "Not specified" for truly optional fields if it would clutter the output

5. **Temperature settings**:
   - Description: 0.8-1.0 (more creative)
   - First message: 0.7-0.9 (balanced)
   - Tags: 0.3-0.5 (more deterministic)
