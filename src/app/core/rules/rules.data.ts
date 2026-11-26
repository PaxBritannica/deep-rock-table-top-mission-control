/**
 * Quick-reference rules shown in Mission Control and on the Rules page.
 *
 * Paraphrased in our own words from the Deep Rock Galactic: The Board Game
 * 2nd-edition rulebook (deluxe, 2024), mainly its green reference pages
 * (pp. 36-47). Never paste rulebook text here; keep lines short.
 * `page` points back to the rulebook for the full wording.
 */
export interface RuleEntry {
  title: string;
  /** One-line gist, shown in bold on cards. */
  summary?: string;
  /** Material Symbols icon name (cards layout). */
  icon?: string;
  /** Short lines; each renders as its own paragraph. */
  lines: string[];
  /** Rulebook page for the full wording. */
  page?: number;
}

export interface RuleTable {
  caption?: string;
  columns: string[];
  rows: (string | number)[][];
  /** Text table (left-aligned, wrapping) instead of a numeric stat table. */
  text?: boolean;
}

export interface RuleSection {
  id: string;
  /** Short label for the thumb-index tab (max ~8 chars). */
  tab: string;
  title: string;
  icon: string;
  /** 'cards' renders entries as a grid of compact tiles. */
  layout?: 'list' | 'cards';
  /** Tables shown before the entries. */
  tables?: RuleTable[];
  entries: RuleEntry[];
}

export const RULE_SECTIONS: RuleSection[] = [
  // ---------------------------------------------------------------------
  {
    id: 'status',
    tab: 'Status',
    title: 'Status effects',
    icon: 'personal_injury',
    layout: 'cards',
    tables: [
      {
        caption: 'Knocked over or unconscious?',
        text: true,
        columns: ['', 'Knocked over', 'Unconscious (0 health)'],
        rows: [
          ['Actions', 'None until you are standing', 'None'],
          ['Getting up', '2 actions on your own, or 1 action from an adjacent Dwarf', 'An adjacent Dwarf revives you for 1 action: stand up with 1 health'],
          ['Event card', 'Draw as usual', 'Skip it'],
          ['Swarm marker', 'No effect', '+1 at the start of each of your turns'],
          ['Rock ’n’ Stone', 'You can still play cards', 'You cannot play cards'],
          ['Creatures', 'Still attack you', 'Ignore you (may cross your space, never stop on it)'],
          ['Exchange supplies', 'Others may trade with you', 'Others may trade with you'],
        ],
      },
    ],
    entries: [
      {
        title: 'Knocked over',
        icon: 'airline_seat_flat',
        summary: 'Dwarf lies down and can’t act until back up.',
        lines: [
          'Stand up yourself with 2 actions in the same turn, or an adjacent Dwarf helps you up for 1 action.',
          'Creatures keep attacking you. Optional events that need you on your feet are skipped.',
          'Knocked over and stunned at once: 1 action is not enough to stand up alone.',
        ],
        page: 38,
      },
      {
        title: 'Unconscious',
        icon: 'bedtime',
        summary: 'Out of health: skip your turn, swarm marker +1.',
        lines: [
          'No actions, no event card, no Rock ’n’ Stone cards. Advance the swarm marker 1 at the start of your turn.',
          'Creatures look for other targets. An adjacent Dwarf revives you for 1 action: stand up with 1 health.',
          'Everyone unconscious at the same time: the mission fails.',
        ],
        page: 38,
      },
      {
        title: 'Stunned',
        icon: 'star',
        summary: 'Dwarf: 1 action next turn. Creature: skips its next activation.',
        lines: [
          'Dwarf: discard the token at the end of that turn.',
          'Creature: next time it would activate, remove the token instead.',
          'Frozen creatures can’t be stunned; freezing a stunned creature removes the stun.',
        ],
        page: 38,
      },
      {
        title: 'Webbed',
        icon: 'blur_on',
        summary: 'Dwarf can’t move next turn; every other action is fine.',
        lines: ['Caused by the Web Spitter. Discard the token at the end of that turn.'],
        page: 38,
      },
      {
        title: 'Frozen',
        icon: 'ac_unit',
        summary: 'Creature takes double damage and skips its next activation.',
        lines: [
          'Resistance still applies to the doubled damage.',
          'Flying creatures die as soon as they are frozen.',
          'Dwarves can’t be frozen.',
        ],
        page: 38,
      },
      {
        title: 'Scared',
        icon: 'directions_run',
        summary: 'Push creatures up to 2 spaces away from the source. No damage.',
        lines: [
          'Up to 4 spaces if a weapon upgrade doubles the scare. Immobile creatures stay put.',
          'Never affects Dwarves or the sentry gun. Explosion-resistant creatures are still scared.',
          'Scared and stunned or frozen by the same attack: the attacker picks one effect.',
        ],
        page: 20,
      },
      {
        title: 'Shield (Gunner)',
        icon: 'shield',
        summary: 'Gunner and adjacent Dwarves ignore creature damage and effects.',
        lines: [
          'If the Gunner moves away, the token stays: it still protects its space and the spaces around it, and creatures can’t enter it.',
          'Discard it at the start of the Gunner’s next turn; he gets it back next time he collects from a supply pod.',
        ],
        page: 38,
      },
      {
        title: 'Damage and [!]',
        icon: 'water_drop',
        summary: 'Damage symbol: lose 1 health cube. [!]: depends on the creature.',
        lines: ['Check the creature’s card or the Creatures tab for what its [!] does.'],
        page: 38,
      },
      {
        title: 'Warden shield',
        icon: 'security',
        summary: 'Creatures within 3 spaces of a Warden cancel 2 damage per attack.',
        lines: [
          'Killing the Warden removes the shield at once.',
          'In a multi-target attack you may hit the Warden first if it isn’t farther away than the others.',
          'Ignore-resistance upgrades don’t get through this shield.',
        ],
        page: 43,
      },
    ],
  },

  // ---------------------------------------------------------------------
  {
    id: 'missed',
    tab: 'Missed',
    title: 'Often missed',
    icon: 'lightbulb',
    entries: [
      {
        title: 'Drop pod',
        lines: [
          'Dwarves inside can attack but can’t be attacked, and ignore event cards.',
          'Once the objectives are done, Dwarves aboard stop drawing event cards.',
        ],
        page: 46,
      },
      {
        title: 'Double hits',
        lines: ['A double on one weapon die must go to a single target. Pickaxe doubles may be split.'],
        page: 46,
      },
      {
        title: 'Stalagmites',
        lines: ['Block movement for everyone except the Driller, the Scout, BOSCO and flying creatures.'],
        page: 46,
      },
      {
        title: 'Grunts and line of sight',
        lines: ['Grunts are small: you can shoot over them.'],
        page: 41,
      },
      {
        title: 'Throwables',
        lines: [
          'They hurt Dwarves too.',
          'With an area effect only the [T] space must be in range, and you choose how to angle the blast.',
        ],
        page: 46,
      },
      {
        title: 'Minerals and destruction',
        lines: [
          'A stalagmite destroyed by a throwable or the Driller’s drill loses its minerals: no mineral roll.',
          'A wall with a mineral blown up by a throwable drops the mineral on its space for anyone to collect.',
          'The Driller can’t drill into walls that contain minerals.',
        ],
        page: 47,
      },
      {
        title: 'Weapon upgrades',
        lines: ['You can keep an upgrade unattached, attach it later for free, or hand it over with Exchange supplies.'],
        page: 46,
      },
      {
        title: 'Creature activation',
        lines: [
          'Creatures only act when a card tells them to. They attack rather than move, and go passive again at the start of the next player’s turn.',
        ],
        page: 46,
      },
      {
        title: 'Out of miniatures',
        lines: ['Can’t place a creature type? Place a Grunt for each one missing. Out of Grunts: place nothing.'],
        page: 47,
      },
      {
        title: 'Gold and Nitra',
        lines: ['Gold can pay for a supply pod in place of Nitra. Gold also pays for overclocking.'],
        page: 47,
      },
      {
        title: 'Lying-down Dwarves',
        lines: ['You may exchange supplies with a Dwarf who is knocked over or unconscious.'],
        page: 47,
      },
      {
        title: 'Ammo',
        lines: ['Every shot costs ammo unless the weapon says otherwise. The sentry gun only costs ammo to place.'],
        page: 47,
      },
      {
        title: 'Solo mode',
        lines: ['You may play Rock ’n’ Stone cards on yourself, whatever the card says.'],
        page: 47,
      },
    ],
  },

  // ---------------------------------------------------------------------
  {
    id: 'turn',
    tab: 'Turn',
    title: 'Your turn',
    icon: 'sync',
    tables: [
      {
        caption: 'Moving',
        text: true,
        columns: ['', 'Spaces'],
        rows: [
          ['Stop on or pass', 'Empty spaces, the drop pod, tokens'],
          ['Pass only', 'Dwarves, special miniatures, tunnel exits'],
          ['Never', 'Black spaces, stalagmites, creatures, deep pits'],
        ],
      },
      {
        caption: 'Line of sight',
        text: true,
        columns: ['', 'Things in the way'],
        rows: [
          ['Clear over', 'Tokens, Dwarves lying down, Grunts, special miniatures'],
          ['Blocked by', 'Standing Dwarves, every other creature, walls, flames, stalagmites'],
        ],
      },
    ],
    entries: [
      {
        title: 'Action phase',
        lines: [
          '3 actions in any order, repeats allowed (1 if stunned, 0 if unconscious). You may stop early.',
          'Knocked over: your first 2 actions go to standing up.',
          'Unconscious at the start of your turn: swarm marker +1.',
        ],
        page: 44,
      },
      {
        title: 'Event phase',
        lines: [
          'Draw and resolve 1 event card, unless you are unconscious or aboard the drop pod after the objectives are done.',
          'If it triggers a swarm: draw a swarm card, spawn, then activate every creature.',
          'Event deck empty: shuffle the discards into a new deck.',
        ],
        page: 44,
      },
      {
        title: 'Rock ’n’ Stone cards',
        lines: [
          'Free: play any number, on your turn or someone else’s, but not while a creature is moving or attacking (unless the card says so).',
        ],
        page: 19,
      },
    ],
  },

  // ---------------------------------------------------------------------
  {
    id: 'actions',
    tab: 'Actions',
    title: 'Actions',
    icon: 'construction',
    entries: [
      {
        title: 'Move',
        lines: ['Up to 3 spaces; see the Moving table on the Turn tab.'],
        page: 12,
      },
      {
        title: 'Attack',
        lines: [
          'Target in range and line of sight. Each shot costs 1 ammo, even if every die is blank.',
          'Each matching resistance icon on the target cancels one hit of that type.',
        ],
        page: 13,
      },
      {
        title: 'Pickaxe',
        lines: [
          'Roll the pickaxe die; each pickaxe symbol is 1 hit, and doubles may be split.',
          'Use hits to mine minerals, harvest tokens, hit an adjacent creature (1 damage), dig out a wall or cut a stalagmite. No ammo needed.',
        ],
        page: 15,
      },
      {
        title: 'Throw',
        lines: ['Only walls block a throw, and only the [T] space must be in range. See the Throw tab.'],
        page: 17,
      },
      {
        title: 'Overclock secondary weapon',
        lines: ['1 action + 1 gold. Flip the card for good: it now holds up to 5 ammo but isn’t refilled.'],
        page: 17,
      },
      {
        title: 'Call down a supply pod',
        lines: [
          '3 Nitra (gold can stand in). Place it on an empty cave space: not on tunnel exits, pits, tokens or miniatures.',
        ],
        page: 18,
      },
      {
        title: 'Collect supplies',
        lines: ['1 action while adjacent to the pod, limited by free room on your board.'],
        page: 18,
      },
      {
        title: 'Exchange supplies',
        lines: ['With adjacent Dwarves: ammo, throwables, unattached upgrades, Rock ’n’ Stone cards. Never health.'],
        page: 19,
      },
      {
        title: 'Assist / revive',
        lines: [
          'Stand up yourself: 2 actions. Help up an adjacent Dwarf: 1 action.',
          'Revive an adjacent unconscious Dwarf: 1 action, they stand with 1 health.',
        ],
        page: 19,
      },
      {
        title: 'Driller: drilling',
        lines: ['Can move into a wall or stalagmite space, ending the move there. Not walls with minerals.'],
        page: 29,
      },
    ],
  },

  // ---------------------------------------------------------------------
  {
    id: 'dice',
    tab: 'Dice',
    title: 'Dice & upgrades',
    icon: 'casino',
    tables: [
      {
        caption: 'Die results',
        text: true,
        columns: ['Symbol', 'Effect'],
        rows: [
          ['Pickaxe', '1 damage to an adjacent target, or dig, cut a stalagmite, mine'],
          ['Bullet', '1 damage'],
          ['Armor-piercing', '1 damage'],
          ['Flame', '1 damage'],
          ['Explosion', '1 damage to every target in the blast area you choose, Dwarves included'],
          ['Scare', 'No damage; push creatures up to 2 spaces away'],
        ],
      },
    ],
    entries: [
      {
        title: 'Weapon upgrade effects',
        lines: [
          'Double: one die result per attack counts double (a doubled scare pushes up to 4).',
          'Ignore resistance: all damage goes through (not the Warden’s shield).',
          'Range: +1. Reroll: reroll 1 die per attack and keep the new result.',
          'Stun: every creature hit is stunned.',
          'Bonus die: after the normal roll, add an explosion, flame or armor-piercing die; the bonus bullet die also stuns what it hits.',
          'Any ammo: the weapon may use primary, secondary or both.',
        ],
        page: 21,
      },
    ],
  },

  // ---------------------------------------------------------------------
  {
    id: 'swarm',
    tab: 'Swarm',
    title: 'Events & swarms',
    icon: 'warning',
    entries: [
      {
        title: 'Swarm threat',
        lines: [
          'Events push the marker 1 or 2 spaces. Landing on a creature symbol triggers a swarm: flip a swarm card, place the creatures, activate every creature.',
          'Two swarm cards at once: place them one card at a time, then activate everything, new arrivals included.',
        ],
        page: 22,
      },
      {
        title: 'Spawning',
        lines: [
          'Place creatures on (or as close as possible to) the tunnel exit, on the spaces nearest a Dwarf; the active Dwarf breaks ties.',
          'Exit 3 not revealed yet? Its creatures aren’t placed.',
        ],
        page: 22,
      },
      {
        title: 'Optional events',
        lines: ['Most need you standing: if you’re lying down, ignore it.'],
        page: 22,
      },
      {
        title: 'Hazard level',
        lines: [
          'Sets where the swarm marker starts (hazard 4 starts on the "3 - 5" space).',
          'Hazard 4 and 5: an extra Grunt on each tunnel exit at setup. Hazard 5: Grunts also deal 1 damage on [!].',
        ],
        page: 8,
      },
      {
        title: 'End of the track (base rules)',
        lines: [
          'Marker must move past the last space: mission failed, or a modest success if at least one Dwarf is aboard the drop pod.',
          'At our table the House rules tab replaces this.',
        ],
        page: 27,
      },
      {
        title: 'Harder variants',
        lines: [
          'Constant critters: remove Starch nuts, Crack in the floor and Ouch! from the event deck.',
          'Climactic ending: when the drop pod returns, trigger a swarm instead of drawing an event.',
          'Overwhelming odds: at the end of the track draw swarm cards instead of events; an empty swarm deck fails the mission.',
        ],
        page: 27,
      },
    ],
  },

  // ---------------------------------------------------------------------
  {
    id: 'creatures',
    tab: 'Bugs',
    title: 'Creatures',
    icon: 'pest_control',
    layout: 'cards',
    tables: [
      {
        caption: 'Activation order, health, range, move',
        columns: ['Creature', '#', 'HP', 'R', 'M'],
        rows: [
          ['Grunt', 1, 1, 1, 3],
          ['Web Spitter', 2, 2, 5, 3],
          ['Exploder', 3, 1, 1, 3],
          ['Mactera Spawn', 4, 2, 3, 3],
          ['Slasher', 5, 2, 1, 3],
          ['Brood Nexus', 6, 5, '–', 0],
          ['Spitball Infector', 7, 5, 7, 0],
          ['Praetorian', 8, 6, 2, 3],
          ['Oppressor', 9, 7, 1, 3],
          ['Warden', 10, 2, 3, 3],
        ],
      },
    ],
    entries: [
      {
        title: 'How creatures activate',
        icon: 'format_list_numbered',
        summary: 'Lowest number first; attack if possible, otherwise move.',
        lines: [
          'Moving creatures stop as soon as they’re in range, heading for the nearest Dwarf; ties go to whoever took a turn most recently.',
          'Same type: the one closest to a Dwarf goes first. They pass through creatures, never Dwarves, may end on tunnel exits and pits, and never enter or attack the drop pod.',
        ],
        page: 24,
      },
      {
        title: 'Grunt (1)',
        icon: 'pest_control',
        summary: '1 die. [!] does nothing, except 1 damage on hazard 5.',
        lines: ['No resistances. Small: doesn’t block line of sight.'],
        page: 40,
      },
      {
        title: 'Web Spitter (2)',
        icon: 'blur_on',
        summary: '2 dice. [!] webs the target.',
        lines: ['Range 5. No resistances.'],
        page: 40,
      },
      {
        title: 'Exploder (3)',
        icon: 'local_fire_department',
        summary: 'Next to a Dwarf or sentry gun it blows up instead of attacking.',
        lines: [
          'Rolls the explosion die on every adjacent space (creatures too), then dies. Killing it sets it off the same way.',
          'Its scare result only pushes creatures. Resists 1 explosion.',
        ],
        page: 41,
      },
      {
        title: 'Mactera Spawn (4)',
        icon: 'flight',
        summary: '1 die. [!] stuns. Flies.',
        lines: [
          'Flies over obstacles and stalagmites but can’t stop on them. Dies if frozen.',
          'Resists 2 pickaxe, 1 flame.',
        ],
        page: 40,
      },
      {
        title: 'Slasher (5)',
        icon: 'content_cut',
        summary: '2 dice. [!] knocks the target over.',
        lines: ['Resists pickaxe, bullet, flame.'],
        page: 40,
      },
      {
        title: 'Brood Nexus (6)',
        icon: 'egg',
        summary: 'Immobile, no damage. Activation: roll 2 dice, a Grunt per [!].',
        lines: [
          'Grunts go on adjacent empty spaces nearest a Dwarf. Roll once more when it dies.',
          'Resists bullet and stun.',
        ],
        page: 43,
      },
      {
        title: 'Spitball Infector (7)',
        icon: 'spa',
        summary: 'Immobile, range 7. 1 die, [!] knocks over.',
        lines: ['Kill reward: a Rock ’n’ Stone card. Resists explosion, pickaxe, bullet, stun.'],
        page: 42,
      },
      {
        title: 'Praetorian (8)',
        icon: 'shield_with_heart',
        summary: '1 die. [!] deals 2 damage. Hit it from behind.',
        lines: [
          'Resists pickaxe, 2 flame, bullet; all ignored when attacked from behind.',
          'Faces the way it moves; turns on the spot to attack someone behind it.',
          'Kill reward: a Rock ’n’ Stone card.',
        ],
        page: 42,
      },
      {
        title: 'Oppressor (9)',
        icon: 'swords',
        summary: '1 die. [!] knocks over and deals 1 damage. Takes 2 spaces.',
        lines: [
          'Moves in a straight shortest path, smashing stalagmites, Grunts and walls (minerals drop). Ending next to its target gives a free attack.',
          'Resists 2 bullet, armor-piercing, pickaxe, flame, stun; all ignored from behind. Area weapons hitting both spaces don’t double the damage.',
          'Kill reward: a Rock ’n’ Stone card.',
        ],
        page: 43,
      },
      {
        title: 'Warden (10)',
        icon: 'security',
        summary: 'No attack. Shields creatures within 3 spaces (-2 damage per attack).',
        lines: [
          'Moves toward the nearest creature; if it then ends more than 3 spaces from any creature, a Grunt appears next to it (nearest a Dwarf).',
          'Resists flame and explosion.',
        ],
        page: 43,
      },
    ],
  },

  // ---------------------------------------------------------------------
  {
    id: 'throw',
    tab: 'Throw',
    title: 'Throwables',
    icon: 'sports_handball',
    tables: [
      {
        caption: 'Range 4 unless noted',
        text: true,
        columns: ['Throwable', 'What it does'],
        rows: [
          ['Incendiary grenade', '2 flame dice on each affected space'],
          ['Frag grenade', '2 explosion dice on each affected space'],
          ['Plasma grenade', '2 explosion dice on the target and the 2 spaces behind it in a line'],
          ['Impact axe', '2 armor-piercing dice, keep the better one, single target'],
          ['Cluster grenade', '2 explosion dice added together on each hit space except the target space'],
          ['Phosphor grenade', '1 flame die on each affected space, target included'],
          ['Corrosive bomb', '1 damage to everything in the area'],
          ['Electrocution grenade', '1 bullet die on the area; every creature there is stunned even on a blank'],
          ['Cryo grenade', 'Ground creatures in the area are frozen; flyers die'],
          ['Sticky grenade', 'Move a target up to 3 spaces, then 1 explosion die on the blast (Dwarves too). Not huge or immobile creatures'],
          ['Proximity grenade', '2 explosion dice on the first walking creature to enter; if scared, it goes back the way it came'],
          ['Inhibitor field', 'Creatures can’t enter or leave the area (they can still spawn there). Ends at the start of your next turn'],
          ['L.U.R.E. grenade', 'Indestructible decoy that blocks movement; creatures go for it unless a Dwarf or sentry is closer. Ends at the start of your next turn'],
          ['Satchel charge', 'Range 1. Detonate any time, even during creature moves: 2 explosion dice, also wrecks platforms, walls, stalagmites'],
          ['Tunnel carver', 'Clears walls and stalagmites on 3 spaces in a line'],
          ['Soil smasher', 'Clears walls and stalagmites around the target space'],
        ],
      },
    ],
    entries: [
      {
        title: 'Minerals in cleared walls',
        lines: ['Satchel charge, tunnel carver and soil smasher leave wall minerals on the floor for pickup.'],
        page: 36,
      },
    ],
  },

  // ---------------------------------------------------------------------
  {
    id: 'extract',
    tab: 'Extract',
    title: 'Minerals & extraction',
    icon: 'rocket_launch',
    entries: [
      {
        title: 'Minerals',
        lines: [
          'Morkite: usually the main objective, found in the walls.',
          'Nitra: 3 buys a supply pod. Gold: stands in for Nitra and pays for overclocks.',
          'Aquarq: heavy, one per Dwarf, deliver it to a mine head.',
        ],
        page: 39,
      },
      {
        title: 'Drop pod lands',
        lines: [
          'When the objectives are met. Creatures and objects on its segment are crushed; Dwarves there jump to the nearest empty space next to it and are knocked over.',
        ],
        page: 27,
      },
      {
        title: 'Win or lose',
        lines: [
          'Win: objectives met and every Dwarf aboard (any pod space).',
          'Lose: everyone unconscious at once, or the swarm marker must move past its last space.',
          'Modest success: that last case, but at least one Dwarf made it aboard.',
        ],
        page: 27,
      },
    ],
  },

  // ---------------------------------------------------------------------
  {
    id: 'deepdive',
    tab: 'Dive',
    title: 'Deep Dive campaign',
    icon: 'layers',
    entries: [
      {
        title: 'Carry over',
        lines: [
          'Health, ammo, Rock ’n’ Stone cards, throwables, overclocks and weapon upgrades carry over. Weapons are not reloaded.',
          'Only class tokens (Engineer platforms, Gunner ziplines) are restocked.',
        ],
        page: 33,
      },
      {
        title: 'Between missions',
        lines: [
          'Discard upgrades to fully heal yourself, or to fully reload 1 weapon for any Dwarf.',
          'Discard all Nitra and gold; each gold gives any Dwarf 1 health, ammo, throwable or Rock ’n’ Stone card (max 1 throwable and 1 card per Dwarf).',
          'Unconscious at a successful extraction: start the next mission with 1 health. A failed mission ends the dive.',
        ],
        page: 33,
      },
    ],
  },

  // ---------------------------------------------------------------------
  {
    id: 'house',
    tab: 'House',
    title: 'House rules',
    icon: 'home',
    entries: [
      {
        title: 'Swarm overflow',
        lines: [
          'Reaching the end of the swarm track doesn’t end the mission: restart the marker and tap Swarm meter maxed.',
          'Each overflow doubles what "+1 swarm" events are worth: +2, then +4, then +8. Mission Control shows the current value.',
        ],
      },
    ],
  },
];
