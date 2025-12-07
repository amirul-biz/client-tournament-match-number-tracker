/**
 * Bout Chart Generator Utility
 * 
 * Usage:
 * import { generateBoutChart, Participant, ParticipantBoutChart } from './bout-chart.util';
 * 
 * const result = generateBoutChart(arenaIds, prefixes, participants);
 */

// ============= TYPES =============

export interface Participant {
  id: string;
  name: string;
  teamId: string;
  categoryId: string;
}

export interface BoutEntry {
  round: number;
  number: number;
  color: string;
}

export interface ParticipantBoutChart {
  categoryId: string;
  teamId: string;
  participantId: string;
  arenaId: string;
  hasBye: boolean;
  boutList: BoutEntry[];
}

// ============= INTERNAL TYPES =============

interface BracketMatch {
  matchNumber: number;
  round: number;
  position: number;
  blueParticipant: Participant | null;
  redParticipant: Participant | null;
  winnerGoesTo: number | null;
  winnerColor: string;
}

interface Advancer {
  participant: Participant | null;
  fromMatch: number | null;
  position: number;
}

interface BracketResult {
  matches: BracketMatch[];
  participantCharts: ParticipantBoutChart[];
  nextMatchNumber: number;
}

// ============= HELPER FUNCTIONS =============

function getNextPowerOfTwo(n: number): number {
  let power = 1;
  while (power < n) {
    power *= 2;
  }
  return power;
}

function calculateRounds(participantCount: number): number {
  if (participantCount <= 1) return 0;
  return Math.ceil(Math.log2(participantCount));
}

function generateOptimalSeedPositions(bracketSize: number): number[] {
  const positions: number[] = [];
  
  function recurse(start: number, end: number) {
    if (start > end) return;
    if (start === end) {
      positions.push(start);
      return;
    }
    positions.push(start);
    positions.push(end);
    const mid = Math.floor((start + end) / 2);
    recurse(start + 1, mid);
    recurse(mid + 1, end - 1);
  }
  
  recurse(0, bracketSize - 1);
  return positions;
}

function seedParticipants(participants: Participant[]): Participant[] {
  const teamGroups = new Map<string, Participant[]>();
  for (const p of participants) {
    if (!teamGroups.has(p.teamId)) {
      teamGroups.set(p.teamId, []);
    }
    teamGroups.get(p.teamId)!.push(p);
  }
  
  const teamsBySize = Array.from(teamGroups.entries())
    .sort((a, b) => b[1].length - a[1].length);
  
  const bracketSize = getNextPowerOfTwo(participants.length);
  const seeded: (Participant | null)[] = new Array(bracketSize).fill(null);
  const seedPositions = generateOptimalSeedPositions(bracketSize);
  
  let seedIndex = 0;
  let placed = 0;
  const teamIndices = new Map<string, number>();
  teamsBySize.forEach(([teamId]) => teamIndices.set(teamId, 0));
  
  while (placed < participants.length) {
    for (const [teamId, members] of teamsBySize) {
      const idx = teamIndices.get(teamId)!;
      if (idx < members.length) {
        seeded[seedPositions[seedIndex]] = members[idx];
        teamIndices.set(teamId, idx + 1);
        seedIndex++;
        placed++;
      }
    }
  }
  
  return seeded.filter((p): p is Participant => p !== null);
}

function assignByePositions(participantCount: number, bracketSize: number): Set<number> {
  const byeCount = bracketSize - participantCount;
  const byePositions = new Set<number>();
  
  if (byeCount === 0) return byePositions;
  
  const step = Math.max(1, Math.floor(bracketSize / byeCount));
  
  for (let i = 0; i < byeCount; i++) {
    const pos = ((i * step * 2) + 1) % bracketSize;
    byePositions.add(pos);
  }
  
  return byePositions;
}

function buildBracket(
  participants: Participant[],
  arenaId: string,
  prefixes: [string, string],
  startingMatchNumber: number
): BracketResult {
  const [bluePrefix, redPrefix] = prefixes;
  const bracketSize = getNextPowerOfTwo(participants.length);
  const numRounds = calculateRounds(participants.length);
  
  if (participants.length === 0) {
    return { matches: [], participantCharts: [], nextMatchNumber: startingMatchNumber };
  }
  
  if (participants.length === 1) {
    return {
      matches: [],
      participantCharts: [{
        categoryId: participants[0].categoryId,
        teamId: participants[0].teamId,
        participantId: participants[0].id,
        arenaId,
        hasBye: true,
        boutList: []
      }],
      nextMatchNumber: startingMatchNumber
    };
  }
  
  const seededParticipants = seedParticipants(participants);
  
  const bracketPositions: (Participant | 'BYE')[] = [];
  const byePositions = assignByePositions(participants.length, bracketSize);
  
  let participantIndex = 0;
  for (let i = 0; i < bracketSize; i++) {
    if (byePositions.has(i)) {
      bracketPositions.push('BYE');
    } else if (participantIndex < seededParticipants.length) {
      bracketPositions.push(seededParticipants[participantIndex++]);
    } else {
      bracketPositions.push('BYE');
    }
  }
  
  const matches: BracketMatch[] = [];
  let matchNumber = startingMatchNumber;
  const participantsWithByes = new Set<string>();
  let currentRoundAdvancers: Advancer[] = [];
  
  const round1MatchCount = bracketSize / 2;
  
  for (let i = 0; i < round1MatchCount; i++) {
    const blue = bracketPositions[i * 2];
    const red = bracketPositions[i * 2 + 1];
    
    const blueParticipant = blue === 'BYE' ? null : blue;
    const redParticipant = red === 'BYE' ? null : red;
    
    if (!blueParticipant && !redParticipant) {
      continue;
    } else if (!blueParticipant && redParticipant) {
      participantsWithByes.add(redParticipant.id);
      currentRoundAdvancers.push({ participant: redParticipant, fromMatch: null, position: i });
    } else if (blueParticipant && !redParticipant) {
      participantsWithByes.add(blueParticipant.id);
      currentRoundAdvancers.push({ participant: blueParticipant, fromMatch: null, position: i });
    } else {
      const match: BracketMatch = {
        matchNumber,
        round: 1,
        position: i,
        blueParticipant,
        redParticipant,
        winnerGoesTo: null,
        winnerColor: ''
      };
      matches.push(match);
      currentRoundAdvancers.push({ participant: null, fromMatch: matchNumber, position: i });
      matchNumber++;
    }
  }
  
  for (let round = 2; round <= numRounds; round++) {
    const matchesInRound = Math.floor(currentRoundAdvancers.length / 2);
    const nextRoundAdvancers: Advancer[] = [];
    
    for (let i = 0; i < matchesInRound; i++) {
      const blueAdvancer = currentRoundAdvancers[i * 2];
      const redAdvancer = currentRoundAdvancers[i * 2 + 1];
      
      if (!blueAdvancer || !redAdvancer) continue;
      
      const match: BracketMatch = {
        matchNumber,
        round,
        position: i,
        blueParticipant: blueAdvancer.participant,
        redParticipant: redAdvancer.participant,
        winnerGoesTo: null,
        winnerColor: ''
      };
      
      if (blueAdvancer.fromMatch !== null) {
        const prevMatch = matches.find(m => m.matchNumber === blueAdvancer.fromMatch);
        if (prevMatch) {
          prevMatch.winnerGoesTo = matchNumber;
          prevMatch.winnerColor = bluePrefix;
        }
      }
      if (redAdvancer.fromMatch !== null) {
        const prevMatch = matches.find(m => m.matchNumber === redAdvancer.fromMatch);
        if (prevMatch) {
          prevMatch.winnerGoesTo = matchNumber;
          prevMatch.winnerColor = redPrefix;
        }
      }
      
      matches.push(match);
      nextRoundAdvancers.push({ participant: null, fromMatch: matchNumber, position: i });
      matchNumber++;
    }
    
    currentRoundAdvancers = nextRoundAdvancers;
  }
  
  const participantCharts: ParticipantBoutChart[] = [];
  
  for (const participant of participants) {
    const boutList: BoutEntry[] = [];
    const hasBye = participantsWithByes.has(participant.id);
    
    const r1Match = matches.find(
      m => m.round === 1 && 
      (m.blueParticipant?.id === participant.id || m.redParticipant?.id === participant.id)
    );
    
    if (r1Match) {
      const color = r1Match.blueParticipant?.id === participant.id ? bluePrefix : redPrefix;
      boutList.push({ round: 1, number: r1Match.matchNumber, color });
      
      let currentMatch = r1Match;
      while (currentMatch.winnerGoesTo) {
        const nextMatch = matches.find(m => m.matchNumber === currentMatch.winnerGoesTo);
        if (nextMatch) {
          boutList.push({
            round: nextMatch.round,
            number: nextMatch.matchNumber,
            color: currentMatch.winnerColor
          });
          currentMatch = nextMatch;
        } else break;
      }
    } else if (hasBye) {
      const bracketPos = bracketPositions.findIndex(
        p => p !== 'BYE' && (p as Participant).id === participant.id
      );
      const matchPos = Math.floor(bracketPos / 2);
      const r2MatchPos = Math.floor(matchPos / 2);
      const r2Color = matchPos % 2 === 0 ? bluePrefix : redPrefix;
      
      const r2Match = matches.find(m => m.round === 2 && m.position === r2MatchPos);
      
      if (r2Match) {
        boutList.push({ round: 2, number: r2Match.matchNumber, color: r2Color });
        
        let currentMatch = r2Match;
        while (currentMatch.winnerGoesTo) {
          const nextMatch = matches.find(m => m.matchNumber === currentMatch.winnerGoesTo);
          if (nextMatch) {
            boutList.push({
              round: nextMatch.round,
              number: nextMatch.matchNumber,
              color: currentMatch.winnerColor
            });
            currentMatch = nextMatch;
          } else break;
        }
      }
    }
    
    participantCharts.push({
      categoryId: participant.categoryId,
      teamId: participant.teamId,
      participantId: participant.id,
      arenaId,
      hasBye,
      boutList
    });
  }
  
  return { matches, participantCharts, nextMatchNumber: matchNumber };
}

// ============= MAIN EXPORT FUNCTION =============

/**
 * Generate bout charts for tournament participants
 * 
 * @param arenaIds - Array of arena IDs (can be dynamic from DB)
 * @param prefixes - Tuple of two color prefixes, e.g., ["Blue", "Red"] or ["Biru", "Merah"]
 * @param participants - Array of participants with id, name, teamId, categoryId
 * @returns Array of ParticipantBoutChart objects
 * 
 * @example
 * const arenaIds = ["arena-1-uuid", "arena-2-uuid"];
 * const prefixes: [string, string] = ["Blue", "Red"];
 * const participants = [
 *   { id: "p1", name: "Alex", teamId: "team-a", categoryId: "cat-1" },
 *   { id: "p2", name: "Bob", teamId: "team-b", categoryId: "cat-1" },
 * ];
 * 
 * const boutCharts = generateBoutChart(arenaIds, prefixes, participants);
 */
export function generateBoutChart(
  arenaIds: string[],
  prefixes: [string, string],
  participants: Participant[]
): ParticipantBoutChart[] {
  // Group participants by category
  const byCategory = new Map<string, Participant[]>();
  
  for (const p of participants) {
    if (!byCategory.has(p.categoryId)) {
      byCategory.set(p.categoryId, []);
    }
    byCategory.get(p.categoryId)!.push(p);
  }
  
  const categories = Array.from(byCategory.keys()).sort();
  const allCharts: ParticipantBoutChart[] = [];
  
  // Track match numbers per arena (starting from 1 for each arena)
  // Arena 1: 1, 2, 3...
  // Arena 2: 1, 2, 3...
  const arenaMatchNumbers = new Map<string, number>();
  arenaIds.forEach((id) => {
    arenaMatchNumbers.set(id, 1);
  });
  
  let arenaIndex = 0;
  
  for (const categoryId of categories) {
    const categoryParticipants = byCategory.get(categoryId)!;
    
    // Sort by teamId within category
    categoryParticipants.sort((a, b) => a.teamId.localeCompare(b.teamId));
    
    // Assign arena (round-robin distribution)
    const arenaId = arenaIds[arenaIndex % arenaIds.length];
    const startMatchNumber = arenaMatchNumbers.get(arenaId)!;
    
    const { participantCharts, nextMatchNumber } = buildBracket(
      categoryParticipants,
      arenaId,
      prefixes,
      startMatchNumber
    );
    
    arenaMatchNumbers.set(arenaId, nextMatchNumber);
    allCharts.push(...participantCharts);
    arenaIndex++;
  }
  
  return allCharts;
}

// Default export
export default generateBoutChart;


export function boutChartGenerator() {
  const arenaIds = ['3ce86b82-f5e2-4a3f-b881-950d2e3fc2d2', '4a17b190-8df7-4131-a31b-c0d3a7bcd656', '6097deee-3157-4e04-9bc7-0cd23227e16d'];

  const prefixes: [string, string] = ['Blue', 'Red']; // or ["Biru", "Merah"]

  const participants: Participant[] = sampleData();

  // Generate bout charts
  const boutCharts = generateBoutChart(arenaIds, prefixes, participants);

 return boutCharts
}

export function sampleData() {
  return [
    {
      id: 'e0de32d4-1c9b-47af-938f-3bbe3afb7202',
      name: 'Alex Johnson',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: '5adcdafa-c277-47d3-9445-5f1a6f4d3ad1',
      name: 'Sarah Williams',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: 'b22619ce-a14e-4697-8a80-00b49743a51d',
      name: 'Michael Brown',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: '274e110a-cdeb-460f-9f23-edc5777687a8',
      name: 'Jessica Davis',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: '07ed1846-cf49-4e4a-89ab-224dd024da04',
      name: 'David Miller',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: '9341c503-3bd4-4fa6-a645-93478b309e9b',
      name: 'Emily Wilson',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: '40ecd59f-1679-4952-b98a-a0fbcd0b9f86',
      name: 'James Moore',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: '1a8a8f19-e44d-4c5e-b29c-d447ca674379',
      name: 'Olivia Taylor',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: 'e151dfbb-21bd-47b9-bffb-36fb24333a90',
      name: 'Robert Anderson',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: 'd9825fef-77b0-494e-98f5-755fae59d2d9',
      name: 'Sophia Thomas',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: 'f8c1898e-6352-4a68-8cd9-14264b337a31',
      name: 'William Jackson',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: 'dff6f1b2-f442-4752-932b-b851cfd39e64',
      name: 'Emma White',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: '2ac51b1f-81d0-4a22-a877-1cf37398af98',
      name: 'Daniel Harris',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: '703e1068-2448-4ace-b01c-449dfe6d3d15',
      name: 'Mia Martin',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: 'd5446326-a852-4b88-a22a-8f22a07ee90b',
      name: 'Ethan Garcia',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: '3542c031-407c-4cc5-87c7-da67ac5bd8f7',
      name: 'Ava Rodriguez',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: 'd0c44254-ba05-4d19-81d6-3a2fafdbdc63',
      name: 'Noah Martinez',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: 'b182f716-d374-4fe0-ada2-da84a1bf8855',
      name: 'Isabella Hernandez',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: '2938e236-991f-4c11-9c2b-b1d2df39ade2',
      name: 'Madison Peters',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: '629b97bc-1373-4653-914e-806e833c6ee9',
      name: 'Julian Bell',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: '4c3dd0dc-0b7f-4c94-bb4f-ce049d2a8fc7',
      name: 'Aurora Foster',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: 'fc9fb832-a139-4707-affb-963bed394b60',
      name: 'Leo Rivera',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: 'b8feebb7-c8ed-4820-b398-b77d700b48ef',
      name: 'Scarlett Gray',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: '83be3641-7d82-4b8d-9717-9eaba473ea1b',
      name: 'Owen Ramirez',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: 'bfc1de5e-35c0-4999-93e0-7f1c94e44f70',
      name: 'Stella Brooks',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: '6dadd540-df02-43d9-b800-a6c09cd80900',
      name: 'Mateo Kelly',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: 'a71940fe-08a8-481f-af26-4dbf32b75c3f',
      name: 'Luna Price',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: 'a8c3bd4a-493c-41d6-b862-d63013e050ea',
      name: 'Levi Perry',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: '42d8b443-8708-4c4a-94d6-9ff29a044518',
      name: 'Penelope Cole',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: '33f2f8a8-89f7-4102-88bd-29998f2dfda2',
      name: 'Asher Ross',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: '31125d5b-8156-4906-9c99-d05406054c95',
      name: 'Victoria Wood',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: 'f0bd3de5-b5a1-4152-ade6-281497cc0939',
      name: 'Aaron Barnes',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: '3d3cc30e-008e-48fc-80d9-b612307171da',
      name: 'Elena Guzman',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: '69f882b3-cd0f-4316-879c-7c9c257a1886',
      name: 'Adrian Long',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: 'ad5e4433-65f4-441a-895d-8151bbcdac83',
      name: 'Ben Carter',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: '6e5fe748-190b-43f2-984c-45c4a402895a',
      name: 'Stella Davis',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: '418187ec-9c02-4495-b92d-93b88da1ef5c',
      name: 'Leo Evans',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: '9e04cc9e-3966-4edc-89b6-418632172fc7',
      name: 'Ruby Foster',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: 'd5b1f4d6-a6cb-4742-88aa-2395ffd234c6',
      name: 'Finn Garcia',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: 'ce19d176-f338-44fd-90d6-88b0435dc09e',
      name: 'Isla Harris',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: 'adeb0222-614b-4ffc-96b4-a23a0d35a6f3',
      name: 'Joel Jackson',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: 'b661ff43-e962-43ba-b4bf-b61b9e5bdcff',
      name: 'Eva King',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: '65fc62af-f86d-4ea4-9600-cb1ac4b4a922',
      name: 'Liam Lewis',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: '14cfb5c3-0852-4292-8205-eba1a12cad15',
      name: 'Mia Miller',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: '249efc30-b12d-45a9-924a-f5869a2135fa',
      name: 'Noah Nelson',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: 'd9ffcade-ec21-4d43-9b09-07fa1d0a625d',
      name: 'Olivia Moore',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: '840683b3-786e-4271-9d61-3428e28cfae9',
      name: 'Parker Perez',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: '4cb148bf-8de5-40aa-b469-382344cb4e42',
      name: 'Quinn Ross',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: 'a6205c3c-13c7-4ede-a09d-6e3967fcf759',
      name: 'Riley Sanchez',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: '3b4e33d8-2d0c-4868-b103-e39dacebac5c',
      name: 'Sam Taylor',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: 'a29067d0-9515-41d8-8ba7-16e75ae0e4ef',
      name: 'Tess Thomas',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: '3c727e69-0ed6-4e94-9bd4-a9ec648bc70b',
      name: 'Uriah Turner',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: '4936e307-3fae-4e99-ad24-e523fbfeef24',
      name: 'Vera Walker',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: '665a5443-4d7a-4c18-a7e7-379303b10a1a',
      name: 'Wade Wilson',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: '81960235-4bc5-4622-9993-c395d636ff32',
      name: 'Xena Young',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: '9e0e4dc2-5099-4aad-8994-e15c1d362f3a',
      name: 'Yara Adams',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: 'e1221cbc-ca13-4253-b369-470eae2598f9',
      name: 'Zane Baker',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: 'd42bf839-638a-40d6-8ebb-7c6a7754e413',
      name: 'Alice Brooks',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: '040c59f9-3f4b-40c9-82fc-654f0f0c71f3',
      name: 'Bill Clark',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: 'd2221f62-e462-45de-8462-9ffb7d95aab0',
      name: 'Cindy Davis',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: '66adc29a-8089-436a-910f-2ffbfcf78b62',
    },
    {
      id: 'daff25c4-d15b-4811-af29-82b862ee6666',
      name: 'Drew Evans',
      teamId: '2837d2d6-390d-471d-bfb7-f7e1d95e96d7',
      categoryId: 'e0382b7d-c5e1-414f-9ad4-3b83ce872042',
    },
    {
      id: '08a46da0-9fca-4a47-a81d-41f02bc5b1e0',
      name: 'Fiona Foster',
      teamId: '66c99ecd-d2be-42ab-b2ec-39c5baee4d9c',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
    {
      id: '2dad4514-38e1-458b-9199-a1bf866565ca',
      name: 'Gary Green',
      teamId: '137291c3-be4b-468a-9d01-96528f68e633',
      categoryId: 'bb9cdbc4-b0bc-4d48-ae23-89e51155a263',
    },
  ];
}