# Character Card V2 Specification

## Overview

The `chara_card_v2` format is the standard for character cards used in SillyTavern, ChubAI, and other roleplay frontends. This document describes the JSON structure.

## Root Structure

```json
{
  "spec": "chara_card_v2",
  "spec_version": "2.0",
  "data": {
    // All character data lives here
  }
}
```

## Data Fields

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Character's display name |
| `description` | string | Full character description/profile |
| `first_mes` | string | Initial message when starting a chat |

### Common Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `personality` | string | `""` | Brief personality summary (often empty, folded into description) |
| `scenario` | string | `""` | Brief scenario/setting description |
| `mes_example` | string | `""` | Example messages showing character voice |
| `alternate_greetings` | string[] | `[]` | Array of alternative first messages |
| `tags` | string[] | `[]` | Searchable/filterable tags |
| `system_prompt` | string | `""` | Custom system instructions for LLM |
| `post_history_instructions` | string | `""` | Instructions inserted after chat history |
| `creator_notes` | string | `""` | Notes for users of the card |
| `creator` | string | `""` | Creator name/handle |
| `character_version` | string | `"main"` | Version identifier |
| `avatar` | string | `""` | URL or base64 image data |

### Extensions Object

The `extensions` field holds platform-specific metadata:

```json
{
  "extensions": {
    "chub": {
      "id": 12345,
      "full_path": "username/character-name",
      "related_lorebooks": []
    },
    "depth_prompt": {
      "depth": 0,
      "prompt": ""
    }
  }
}
```

### Character Book (Lorebook)

Optional embedded lorebook:

```json
{
  "character_book": {
    "name": "Character Lore",
    "entries": [
      {
        "keys": ["keyword1", "keyword2"],
        "content": "Information to inject when keywords match",
        "enabled": true,
        "insertion_order": 0,
        "case_sensitive": false,
        "priority": 10,
        "id": 0,
        "comment": "",
        "selective": false,
        "secondary_keys": [],
        "constant": false,
        "position": "before_char"
      }
    ]
  }
}
```

## Full Example

```json
{
  "spec": "chara_card_v2",
  "spec_version": "2.0",
  "data": {
    "name": "Elias Thorne",
    "description": "**Character Profile: Elias Thorne**\n\n**Title:** CEO of Thorne Global...",
    "personality": "",
    "first_mes": "Day Four.\n\nI was reviewing the Shanghai acquisition...",
    "avatar": "",
    "mes_example": "",
    "scenario": "{{user}} is his new secretary in her first week.",
    "creator_notes": "A slowburn variant where the obsession is just beginning.",
    "system_prompt": "",
    "post_history_instructions": "",
    "alternate_greetings": [
      "The elevator doors opened...",
      "Friday. End of her first week..."
    ],
    "tags": [
      "Male",
      "CEO",
      "Romance",
      "Slowburn",
      "Possessive",
      "NSFW"
    ],
    "creator": "Anonymous",
    "character_version": "first_week",
    "extensions": {
      "depth_prompt": {
        "depth": 0,
        "prompt": ""
      }
    },
    "character_book": null
  }
}
```

## Placeholder Convention

- `{{user}}` - Replaced with the player's name/persona
- `{{char}}` - Replaced with the character's name
- These should be used in description, first_mes, greetings, etc.

## Content Guidelines (for AI Generation)

When generating content for these fields:

### Description
- Use markdown formatting (headers, bullets, bold)
- Structure: Appearance → Personality → Behavior → Background → Core Tension
- 800-1500 words typical
- Reference `{{user}}` for relationship/behavior sections

### First Message
- First-person perspective from character
- 400-800 words typical
- Include internal monologue (thoughts about {{user}})
- Set up scene, show personality, create response hooks
- End with something {{user}} can react to

### Alternate Greetings
- Each should be a distinct scenario/situation
- Same quality standards as first_mes
- Vary the contexts (different locations, times, situations)

### Tags
- Mix of: character traits, content warnings, setting, dynamics, format
- Common tags: Male, Female, NSFW, SFW, Romance, Fantasy, Modern, Dominant, Submissive, Slowburn, etc.
