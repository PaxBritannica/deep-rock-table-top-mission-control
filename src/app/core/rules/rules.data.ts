/**
 * Quick-reference rules shown in Mission Control.
 *
 * Written as short paraphrases (not copied rulebook text) from a rules summary
 * of the base game. Check numbers against your own 2nd-edition rulebook and
 * edit freely: the panel renders whatever is in RULE_SECTIONS.
 */
export interface RuleEntry {
  title: string;
  /** One or more short lines; each renders as its own paragraph/bullet. */
  lines: string[];
}

export interface RuleTable {
  columns: string[];
  rows: (string | number)[][];
}

export interface RuleSection {
  id: string;
  /** Short label for the thumb-index tab (max ~8 chars). */
  tab: string;
  title: string;
  icon: string;
  entries: RuleEntry[];
  table?: RuleTable;
}

export const RULE_SECTIONS: RuleSection[] = [
  {
    id: 'turn',
    tab: 'Turn',
    title: 'Your turn',
    icon: 'sync',
    entries: [
      {
        title: 'Action phase',
        lines: [
          'Take up to 3 actions in any order. Repeating the same action is allowed, and you may stop early.',
          'Stunned: only 1 action. Unconscious: no actions.',
        ],
      },
      {
        title: 'Event phase',
        lines: [
          'Draw one event card, resolve it, discard it.',
          'Skip the draw if you are unconscious, or already aboard the drop pod after the objectives are done.',
          'Event deck empty? Shuffle the discards into a new deck.',
        ],
      },
      {
        title: 'Free actions',
        lines: [
          "Rock 'n' Stone cards cost no action and can be played on anyone's turn, but not while a creature is moving or attacking (unless the card says so).",
        ],
      },
    ],
  },
  {
    id: 'actions',
    tab: 'Actions',
    title: 'Actions',
    icon: 'construction',
    entries: [
      {
        title: 'Move',
        lines: [
          'Up to 3 spaces. Walls, stalagmites, creatures and deep pits block you.',
          'You can pass through dwarves, special miniatures and tunnel exits but cannot stop on them.',
        ],
      },
      {
        title: 'Attack',
        lines: [
          'Target must be in range and line of sight. Every shot spends 1 ammo, even if you roll only blanks.',
          'Each hit symbol is 1 damage; scare symbols do nothing. A double symbol must go to a single target.',
          'Stun and freeze effects only apply if the attack hits. Subtract the target’s resistance from the hits.',
        ],
      },
      {
        title: 'Pickaxe',
        lines: [
          'Roll the white die: each pickaxe symbol is 1 hit (doubles may be split).',
          'Spend hits to mine, farm, dig an adjacent wall into a 1-space cave, cut a stalagmite, or defend yourself (1 damage to an adjacent creature). No ammo needed.',
        ],
      },
      {
        title: 'Driller: drilling',
        lines: [
          'May move into an empty wall or stalagmite space, ending the move there. Walls with minerals cannot be drilled.',
        ],
      },
      {
        title: 'Throw',
        lines: [
          'Throwables are one-shot. Only walls block line of sight, and only the target space must be in range.',
          'Area effects hit dwarves too. Some effects last until the start of the thrower’s next turn.',
        ],
      },
      {
        title: 'Overclock secondary weapon',
        lines: [
          'Costs 1 action and 1 gold. Flip the weapon card for good: it can now hold 5 ammo, but you don’t gain any ammo from flipping.',
          'Re-attach any upgrade tokens to the overclocked side.',
        ],
      },
      {
        title: 'Resupply',
        lines: [
          'Pay 3 Nitra (gold can stand in) to call a supply pod onto an empty cave space, not a tunnel exit or pit.',
          'Collecting from an adjacent pod costs 1 action and is limited by free room on your board.',
        ],
      },
      {
        title: 'Exchange supplies',
        lines: [
          'Swap ammo, throwables, unattached upgrades and Rock ’n’ Stone cards with an adjacent dwarf. Health can never be traded.',
        ],
      },
      {
        title: 'Assist / revive',
        lines: [
          'Getting up on your own after being knocked over: 2 actions. Helping an adjacent knocked-over dwarf: 1 action.',
          'Reviving an adjacent unconscious dwarf: 1 action, they stand up with 1 health.',
        ],
      },
    ],
  },
  {
    id: 'swarm',
    tab: 'Swarm',
    title: 'Swarm threat',
    icon: 'warning',
    entries: [
      {
        title: 'Moving the marker',
        lines: [
          'Event cards push the marker 1 or 2 spaces. It also moves 1 at the start of each unconscious dwarf’s turn.',
          'The starting space depends on the hazard level.',
        ],
      },
      {
        title: 'Swarms',
        lines: [
          'Landing on a creature symbol triggers a swarm: flip a swarm card, place what it shows, then activate every creature.',
          'If two swarm cards are revealed, place them one at a time, then activate everything.',
        ],
      },
      {
        title: 'End of the track',
        lines: [
          'If the marker must advance from the last space, the mission fails, unless at least one dwarf is aboard the drop pod (modest success).',
          'Optional "Overwhelming odds" variant: at the end of the track draw swarm cards instead of events; an empty swarm deck means failure.',
        ],
      },
    ],
  },
  {
    id: 'creatures',
    tab: 'Bugs',
    title: 'Creatures',
    icon: 'pest_control',
    entries: [
      {
        title: 'Activation',
        lines: [
          'Creatures only act when an event or swarm card says so, in ascending activation number.',
          'Each one attacks a dwarf in range and line of sight; otherwise it moves toward the nearest dwarf.',
          'Ties go to the dwarf who most recently took a turn. Unconscious dwarves are ignored.',
        ],
      },
      {
        title: 'Movement',
        lines: [
          'May pass through other creatures, never through dwarves. Can end on tunnel exits and pits, never in the drop pod.',
        ],
      },
      {
        title: 'Spawning',
        lines: [
          'Place new creatures at tunnel exits, on or as close as possible to the exit, nearest a dwarf.',
          'Out of a creature type? Place a Grunt for each missing one. Out of Grunts? Nothing spawns.',
          'Brood Nexus: roll 2 dice, one Grunt per [!].',
        ],
      },
    ],
    table: {
      columns: ['Creature', 'Health', 'Range', 'Move'],
      rows: [
        ['Grunt', 1, 1, 3],
        ['Exploder', 1, 1, 3],
        ['Web Spitter', 2, 5, 3],
        ['Mactera Spawn', 2, 3, 3],
        ['Slasher', 2, 1, 3],
        ['Warden', 2, 3, 3],
        ['Brood Nexus', 5, '–', 0],
        ['Spitball Infector', 5, 7, 0],
        ['Praetorian', 6, 2, 3],
        ['Oppressor', 7, 1, 3],
      ],
    },
  },
  {
    id: 'health',
    tab: 'Health',
    title: 'Health & conditions',
    icon: 'favorite',
    entries: [
      {
        title: 'Health',
        lines: [
          'Dwarves start with 5 health. At 0 you are unconscious: no actions, no event card, and the swarm marker moves 1 at the start of your turn.',
          'Red sugar heals up to 3. Supply pods can bring health.',
          'Everyone unconscious at the same time: the mission fails.',
        ],
      },
      {
        title: 'Stunned',
        lines: ['Dwarf: only 1 action next turn. Creature: skips its next activation. Frozen creatures cannot be stunned.'],
      },
      {
        title: 'Webbed',
        lines: ['Dwarf cannot move on their next turn; other actions are fine.'],
      },
      {
        title: 'Frozen',
        lines: [
          'Creature takes double damage (resistance still applies) and skips its next activation. Frozen flying creatures die at once.',
        ],
      },
    ],
  },
  {
    id: 'hazard',
    tab: 'Hazard',
    title: 'Hazard levels',
    icon: 'speed',
    entries: [
      {
        title: 'Choosing',
        lines: ['Agree on a level from 1 (easiest) to 5 (hardest) before setup. It sets where the swarm marker starts.'],
      },
      {
        title: 'Hazard 4 and 5',
        lines: ['Place one extra Grunt on each tunnel exit during setup.'],
      },
      {
        title: 'Hazard 5',
        lines: ['Grunts also deal 1 damage on a [!] result.'],
      },
    ],
  },
  {
    id: 'mission',
    tab: 'Extract',
    title: 'Minerals & extraction',
    icon: 'rocket_launch',
    entries: [
      {
        title: 'Minerals',
        lines: [
          'Mine with the pickaxe, or roll the mineral die when you destroy a stalagmite. Minerals go to the M.U.L.E. / shared supply.',
          'Aquarqs: one per dwarf at a time; drop it at a mine head to add it to the supply.',
        ],
      },
      {
        title: 'Drop pod',
        lines: [
          'It lands once the objectives are complete. Creatures and objects on its cave segment are removed; dwarves there are moved next to it and knocked over.',
          'Dwarves aboard can attack but cannot be attacked and ignore events.',
        ],
      },
      {
        title: 'Winning and losing',
        lines: [
          'Win: all objectives done and every dwarf aboard the pod.',
          'Lose: all dwarves unconscious at once, or the swarm marker must advance from the final space with nobody aboard.',
        ],
      },
    ],
  },
  {
    id: 'deepdive',
    tab: 'Dive',
    title: 'Deep Dive campaign',
    icon: 'layers',
    entries: [
      {
        title: 'Carried over',
        lines: [
          'Current health, ammo, Rock ’n’ Stone cards, throwables, overclocked weapons and kept upgrades.',
          'Only class tokens (Engineer platforms, Gunner ziplines) are restocked.',
        ],
      },
      {
        title: 'Between missions',
        lines: [
          'Leftover Nitra is lost. Each leftover gold buys 1 health, ammo, throwable or Rock ’n’ Stone card for anyone on the team.',
          'Any dwarf may discard upgrades to fully heal or fully reload one weapon.',
          'Dwarves unconscious at a successful extraction start the next mission with 1 health. A failed mission ends the Deep Dive.',
        ],
      },
    ],
  },
  {
    id: 'house',
    tab: 'House',
    title: 'House rules',
    icon: 'home',
    entries: [
      {
        title: 'Swarm overflow',
        lines: [
          'Reaching the end of the swarm track does not end the mission. Restart the marker and log an overflow in Mission Control.',
          'Every overflow doubles what "+1 swarm" events are worth: +2, then +4, then +8. Mission Control shows the current value.',
        ],
      },
    ],
  },
];
