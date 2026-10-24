// Everything that lives down there.
//
// To add an enemy, copy an entry and change it:
//
//   name     what the messages call it
//   floors   [first, last] floor it can show up on. It gets tougher for
//            every floor past its first
//   boss     instead of floors: the floor it guards. The stairs stay sealed
//            until it is dead
//   every    for a boss: it comes back this many floors later, stronger
//            each time. When two bosses land on the same floor, the one
//            that comes back least often wins
//   hp, atk, def   health, damage, and armor
//   xp       experience for killing it
//   ai       'chase'   walks straight at you once it sees you
//            'erratic' wanders, half its steps are random
//            'ranged'  keeps its distance and shoots in a straight line
//            'coward'  chases, but runs when it is badly hurt
//   speed    2 = two moves a turn, 1 = normal, 0.5 = every other turn
//   range    for 'ranged' (and fire): how far it shoots
//   poison   0 to 1, chance a hit poisons you
//   fire     breathes fire in a line and rains embers that set the floor
//            alight
//   size     2 for a big enemy that takes up 2x2 tiles. A big boss gets a
//            lair, a great hall at the end of its floor
//   weight   how common it is compared to others on the same floor
//   art      8 rows of 8 characters ('#' for ink, '.' for empty), or 16 of
//            16 for a big one

window.ENEMIES = {
  rat: {
    name: 'Rat', floors: [1, 4], hp: 4, atk: 2, def: 0, xp: 1, ai: 'erratic', speed: 1, weight: 3,
    art: ['........', '........', '........', '.##.....', '#.####..', '.####.#.', '..#.#..#', '.......#'],
  },
  goblin: {
    name: 'Goblin', floors: [1, 8], hp: 7, atk: 3, def: 1, xp: 3, ai: 'coward', speed: 1, weight: 3,
    art: ['#......#', '.#.##.#.', '..####..', '..#..#..', '.######.', '#.####.#', '..#..#..', '.##..##.'],
  },
  bat: {
    name: 'Bat', floors: [2, 9], hp: 4, atk: 2, def: 0, xp: 2, ai: 'erratic', speed: 2, weight: 2,
    art: ['#......#', '##....##', '##.##.##', '########', '.#.##.#.', '........', '........', '........'],
  },
  snake: {
    name: 'Snake', floors: [3, 10], hp: 8, atk: 3, def: 1, xp: 4, ai: 'chase', speed: 1, poison: 0.35, weight: 2,
    art: ['....###.', '...#.#.#', '....###.', '.....#..', '.####...', '#.....#.', '.#####.#', '.......#'],
  },
  archer: {
    name: 'Goblin archer', floors: [4, 12], hp: 6, atk: 3, def: 0, xp: 5, ai: 'ranged', range: 5, speed: 1, weight: 2,
    art: ['#......#', '.#.##.#.', '..####.#', '..#..#.#', '.#######', '#.####.#', '..#..#.#', '.##..##.'],
  },
  skeleton: {
    name: 'Skeleton', floors: [6, 15], hp: 14, atk: 5, def: 2, xp: 7, ai: 'chase', speed: 0.5, weight: 2,
    art: ['..####..', '.#.##.#.', '..####..', '...##...', '.######.', '...##...', '..#..#..', '.##..##.'],
  },
  brute: {
    name: 'Big goblin', floors: [8, 18], hp: 22, atk: 7, def: 3, xp: 10, ai: 'chase', speed: 1, weight: 2,
    art: ['#.####.#', '########', '#.#..#.#', '########', '.######.', '########', '..#..#..', '.##..##.'],
  },
  wraith: {
    name: 'Wraith', floors: [11, 24], hp: 18, atk: 7, def: 2, xp: 12, ai: 'chase', speed: 2, weight: 2,
    art: ['...##...', '..####..', '..#..#..', '.######.', '#.####.#', '...##...', '...##...', '....##..'],
  },
  imp: {
    name: 'Ember imp', floors: [12, 26], hp: 12, atk: 6, def: 1, xp: 11, ai: 'ranged', range: 6, speed: 1, weight: 2,
    art: ['........', '..#..#..', '..####..', '..#..#..', '.######.', '..####..', '..#..#..', '..#..#..'],
  },
  golem: {
    name: 'Stone golem', floors: [15, 99], hp: 40, atk: 10, def: 5, xp: 16, ai: 'chase', speed: 0.5, weight: 2,
    art: ['.######.', '#.####.#', '.##..##.', '########', '#.####.#', '#.####.#', '..#..#..', '.##..##.'],
  },
  shade: {
    name: 'Shade', floors: [24, 99], hp: 28, atk: 11, def: 3, xp: 20, ai: 'erratic', speed: 2, weight: 2,
    art: ['........', '........', '........', '........', '..####..', '.#.##.#.', '..####..', '..#..#..'],
  },
  giant: {
    name: 'Giant', boss: 5, every: 5, hp: 60, atk: 9, def: 3, xp: 30, ai: 'chase', speed: 1,
    art: ['..####..', '.##..##.', '.#....#.', '.##..##.', '########', '.######.', '..#..#..', '###..###'],
  },
  lich: {
    name: 'Lich', boss: 10, every: 10, hp: 80, atk: 10, def: 3, xp: 50, ai: 'ranged', range: 5, speed: 1, poison: 0.25,
    art: ['.#.#.#..', '.#####.#', '.#.#.#.#', '.#####.#', '..#.#..#', '.#######', '..###..#', '.#####..'],
  },
  dragon: {
    name: 'Dragon', boss: 25, every: 25, hp: 420, atk: 22, def: 10, xp: 150, ai: 'chase', range: 5, speed: 1, fire: true, size: 2,
    art: [
      '#.............##', '##........######', '###......#######', '####....########', '####...########.', '.###...#####....',
      '.###..###.......', '...#..#.........', '..#######.......', '..#########.....', '..##..#######...', '.####....######.',
      '..##.......#####', '.####........###', '.####........###', '..##..........#.',
    ],
  },
};
