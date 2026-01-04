/**
 * Prompt templates for AI generation
 * See docs/PROMPTS.md for full documentation
 */

/**
 * Generate prompt for character description
 * @param {Object} basics - Basic character info
 * @returns {string} The prompt
 */
export function descriptionPrompt(basics) {
  const {
    cardType,
    name,
    title,
    age,
    gender,
    keyTraits,
    appearanceNotes,
    scenarioPremise,
    relationshipToUser,
    additionalNotes,
  } = basics;

  // Narrator/World card prompt
  if (cardType === 'narrator') {
    return `Create a detailed narrator/world card for an interactive roleplay experience:

World/Card Name: ${name}
Genre/Setting Type: ${title || 'Not specified'}
Narrator Style & World Rules: ${keyTraits}
World Details & Setting: ${appearanceNotes || 'Not specified'}
World Premise/Hook: ${scenarioPremise || 'Not specified'}
{{user}}'s Role: ${relationshipToUser || 'Not specified'}
Lore/NPCs/Factions: ${additionalNotes || 'None'}

Write a comprehensive world/narrator description that includes:

1. **ROLE & VOICE** - Define what "you" are (The Narrator, Game Master, the world itself). Establish the narrative voice and tone.

2. **WORLD SETTING** - Describe the world, its rules, atmosphere, key locations or concepts. What makes this world unique?

3. **NARRATOR BEHAVIOR** - How should the narrator respond? Rules like:
   - Describe environments, NPCs, and consequences of {{user}}'s actions
   - Control all characters except {{user}}
   - Never speak or act FOR {{user}}
   - Present challenges and react dynamically to choices

4. **WORLD RULES** - Any special mechanics, magic systems, survival elements, or consistent world logic.

5. **{{user}}'s PLACE** - Who is {{user}} in this world? What is their starting situation?

6. **KEY NPCS/FACTIONS** (if applicable) - Brief mentions of recurring characters or groups {{user}} might encounter.

Requirements:
- Use {{user}} to refer to the player
- Format with clear sections the AI can reference
- Write it as instructions TO the AI about how to narrate this world
- Around 800-1200 words
- Make the world feel immersive and reactive`;
  }

  // Standard character card prompt
  return `Create a detailed character profile for a roleplay character with these details:

Name: ${name}
Title/Role: ${title || 'Not specified'}
Age: ${age || 'Not specified'}
Gender: ${gender}
Key Personality Traits: ${keyTraits}
Appearance Notes: ${appearanceNotes || 'Not specified'}
Scenario/Setting: ${scenarioPremise || 'Not specified'}
Relationship to {{user}}: ${relationshipToUser || 'Not specified'}
Additional Notes: ${additionalNotes || 'None'}

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
- Make the character feel real and three-dimensional`;
}

/**
 * Generate prompt for first message
 * @param {string} description - The character description
 * @param {string} scenario - Optional scenario
 * @param {string} hint - Optional user hint/direction for the scene
 * @param {string} cardType - 'character' or 'narrator'
 * @returns {string} The prompt
 */
export function firstMessagePrompt(description, scenario = '', hint = '', cardType = 'character') {
  const hintSection = hint.trim()
    ? `\nUser's direction for this scene:\n${hint}\n\nUse this as inspiration or a starting point. Expand on it while maintaining the ${cardType === 'narrator' ? 'narrator' : 'character'}'s voice.`
    : '';

  if (cardType === 'narrator') {
    return `Based on this world/narrator description:

${description}

Premise: ${scenario || 'Not specified'}
${hintSection}
Write a compelling opening narration for this world. This should:
- Be written in the narrator's voice (as established in the description)
- Set the scene: describe the environment, atmosphere, and situation
- Introduce {{user}}'s starting position in the world
- Include sensory details (sights, sounds, smells)
- Create immediate hooks or choices for {{user}} to engage with
- Optionally introduce an NPC or situation {{user}} must respond to
- Be around 400-800 words
- End with something {{user}} can naturally react to or a choice to make

Do not include any meta-text or instructions. Write only the opening narration itself.`;
  }

  return `Based on this character description:

${description}

Scenario: ${scenario || 'Not specified'}
${hintSection}
Write a compelling first message/opening post for a roleplay. This should:
- Be written from the character's perspective (first person)
- Set up an interesting scene or situation that establishes the dynamic
- Show the character's personality through their thoughts and actions
- Include internal monologue revealing their thoughts about {{user}}
- Create hooks that invite {{user}} to respond
- Be around 400-800 words
- End with something {{user}} can naturally react to

Do not include any meta-text, instructions, or scene-setting brackets. Write only the first message itself as the character would deliver it.`;
}

/**
 * Generate prompt for alternate greeting
 * @param {string} description - The character description
 * @param {string[]} existingGreetings - Existing greetings to avoid repetition
 * @param {string} scenarioHint - Optional specific scenario hint
 * @param {string} cardType - 'character' or 'narrator'
 * @returns {string} The prompt
 */
export function altGreetingPrompt(description, existingGreetings = [], scenarioHint = '', cardType = 'character') {
  const existingSection = existingGreetings.length > 0
    ? `\nExisting openings (write something DIFFERENT from these):\n${existingGreetings.map((g, i) => `${i + 1}. ${g.substring(0, 200)}...`).join('\n')}\n`
    : '';

  if (cardType === 'narrator') {
    return `Based on this world/narrator description:

${description}

${scenarioHint ? `Specific scenario to write: ${scenarioHint}` : 'Write a unique alternate starting scenario.'}
${existingSection}
Write an alternate opening narration that:
- Places {{user}} in a completely different situation or location than previous openings
- Maintains the world's rules and narrator voice
- Is around 400-700 words
- Creates immediate hooks or choices for {{user}}
- Could introduce different NPCs or challenges
- Sets a distinct mood or stakes from other greetings

Output only the narration text, no explanations or meta-commentary.`;
  }

  return `Based on this character description:

${description}

${scenarioHint ? `Specific scenario to write: ${scenarioHint}` : 'Write a unique alternate opening scenario.'}
${existingSection}
Write an alternate first message/greeting that:
- Shows a completely different situation or context than any previous greetings
- Is written from the character's perspective (first person)
- Is around 400-700 words
- Maintains the character's voice and personality
- Creates interesting hooks for {{user}} to respond to
- Includes internal monologue

Output only the greeting text, no explanations or meta-commentary.`;
}

/**
 * Generate prompt for tag suggestions
 * @param {string} description - The character description
 * @param {string} cardType - 'character' or 'narrator'
 * @returns {string} The prompt
 */
export function tagsPrompt(description, cardType = 'character') {
  if (cardType === 'narrator') {
    return `Based on this world/narrator description:

${description}

Generate 15-25 relevant tags for this world card. Include a mix of:
- Genre (e.g., Fantasy, Sci-Fi, Horror, Post-Apocalyptic)
- Tone (e.g., Dark, Wholesome, Gritty, Mysterious)
- Content (e.g., NSFW, SFW, Violence, Adventure)
- World type (e.g., Open World, Survival, RPG, Dungeon Crawl)
- Setting elements (e.g., Magic System, Medieval, Futuristic, Urban)
- Format tags (e.g., Narrator, World Card, Multiple Scenarios, Interactive)

Output ONLY a comma-separated list of tags, nothing else. No explanations, no numbering.`;
  }

  return `Based on this character description:

${description}

Generate 15-25 relevant tags for this character card. Include a mix of:
- Character traits (e.g., Possessive, Dominant, Cold, Gentle)
- Content indicators (e.g., NSFW, SFW, Dark Themes, Fluff)
- Setting/genre (e.g., Modern, Fantasy, Office, Historical)
- Relationship dynamics (e.g., Slowburn, Enemies to Lovers, Boss/Employee)
- Character type (e.g., Male, Female, Human, Vampire)
- Format tags (e.g., Multiple Greetings, Fempov, OC)

Output ONLY a comma-separated list of tags, nothing else. No explanations, no numbering.`;
}

/**
 * Tone modifiers that can be appended to prompts
 */
export const toneModifiers = {
  dark: `\nAdditional tone guidance: Write with a dark, intense atmosphere. Emphasize internal conflict, moral ambiguity, and emotional complexity. The character should feel dangerous or troubled.`,
  
  fluffy: `\nAdditional tone guidance: Write with warmth and tenderness. Focus on sweet moments, genuine care, and emotional safety. The character should feel comforting and kind.`,
  
  slowburn: `\nAdditional tone guidance: Emphasize restraint and building tension. The character should be fighting their feelings, with lots of loaded glances, almost-touches, and internal conflict about their growing attraction.`,
  
  explicit: `\nAdditional tone guidance: Include sensual awareness and sexual tension. The character's thoughts can include explicit desires. Physical descriptions can be more detailed and suggestive.`,
};

/**
 * Apply tone modifier to a prompt
 * @param {string} prompt - Base prompt
 * @param {string} tone - Tone key from toneModifiers
 * @returns {string} Modified prompt
 */
export function applyTone(prompt, tone) {
  if (tone && toneModifiers[tone]) {
    return prompt + toneModifiers[tone];
  }
  return prompt;
}

export default {
  descriptionPrompt,
  firstMessagePrompt,
  altGreetingPrompt,
  tagsPrompt,
  toneModifiers,
  applyTone,
};
