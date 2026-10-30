// Central app name — change here to rename the extension everywhere it appears
const APP_NAME = 'Corporate Cipher';

// Election cycles for Financial Contributions, newest first. Mirrors CYCLE_OPTIONS /
// DEFAULT_CYCLE in the website's src/lib/electionCycle.ts — keep the two in step
// until the API serves this list itself.
const ELECTION_CYCLES = [2026, 2024];
const DEFAULT_ELECTION_CYCLE = 2026;

// Unset or retired values fall back to the default rather than asking for a year
// the site no longer offers.
function resolveElectionCycle(value) {
  const n = Number(value);
  return ELECTION_CYCLES.includes(n) ? n : DEFAULT_ELECTION_CYCLE;
}
