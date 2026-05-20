/**
 * Cassian Adaptive Profile
 * All games read from and write to this shared profile.
 * Stored in localStorage('cassian_profile')
 */

const CassianProfile = (() => {

  const DOMAINS = {
    math_arithmetic:  { label: 'Arithmetic',     min: 1, max: 10, default: 5 },
    math_patterns:    { label: 'Patterns',        min: 1, max: 10, default: 6 },
    math_bigNumbers:  { label: 'Big Numbers',     min: 1, max: 10, default: 7 },
    chess_tactics:    { label: 'Chess Tactics',   min: 1, max: 10, default: 2 },
    chess_puzzles:    { label: 'Chess Puzzles',   min: 1, max: 10, default: 2 },
    language_spanish: { label: 'Spanish',         min: 1, max: 10, default: 1 },
    language_arabic:  { label: 'Arabic',          min: 1, max: 10, default: 1 },
    reading:          { label: 'Reading',         min: 1, max: 10, default: 3 },
    focus_duration:   { label: 'Focus Duration',  min: 1, max: 10, default: 3 },
  };

  function load() {
    try { return JSON.parse(localStorage.getItem('cassian_profile')) || {}; }
    catch { return {}; }
  }

  function save(data) {
    localStorage.setItem('cassian_profile', JSON.stringify(data));
  }

  return {
    get(domain) {
      const data = load();
      return data[domain] ?? DOMAINS[domain]?.default ?? 1;
    },

    set(domain, level) {
      const data = load();
      const d = DOMAINS[domain];
      if (!d) return;
      data[domain] = Math.max(d.min, Math.min(d.max, level));
      save(data);
    },

    // result: { correct: bool, timeMs: number, streakCorrect: number }
    recordResult(domain, result) {
      const current = this.get(domain);
      let next = current;
      if (result.correct && result.streakCorrect >= 5 && result.timeMs < 5000) {
        next = Math.min(current + 1, DOMAINS[domain]?.max ?? 10);
      } else if (!result.correct && result.timeMs > 15000) {
        next = Math.max(current - 1, DOMAINS[domain]?.min ?? 1);
      }
      if (next !== current) this.set(domain, next);
      return next;
    },

    getAll() {
      const data = load();
      return Object.entries(DOMAINS).map(([key, meta]) => ({
        key,
        label: meta.label,
        level: data[key] ?? meta.default,
        max: meta.max
      }));
    },

    reset(domain) {
      const data = load();
      delete data[domain];
      save(data);
    },

    resetAll() {
      localStorage.removeItem('cassian_profile');
    }
  };
})();
