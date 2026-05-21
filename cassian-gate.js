// cassian-gate.js — Responsibilities Before Benefits
// Every gated page calls CassianGate.check(pageKey, pageName, pageEmoji) on load.
// Spark passes are granted from index.html via CassianGate.grantSparkPass().

const CassianGate = (() => {

  const LOCK_MS   = 45 * 60 * 1000; // 45 minutes
  const PASS_KEY  = 'gate_spark_pass';
  const LOCK_PFX  = 'gate_unlock_';

  // ── QUESTION BANKS ─────────────────────────────────────────────
  // Each question: { q, options: ['correct', 'wrong', 'wrong', 'wrong'], hint }
  // options[0] is ALWAYS the correct answer — shuffle happens at runtime.

  const QUESTIONS = {

    language: [
      { q:'How do you say "thank you" in Italian?',       options:['Grazie','Gracias','Shukran','Merci'],            hint:'It sounds like "GRAT-zee-eh"' },
      { q:'How do you say "hello" in Spanish?',           options:['Hola','Ciao','Marhaba','Bonjour'],              hint:'It rhymes with "cola"' },
      { q:'How do you say "good morning" in Italian?',    options:['Buongiorno','Buenos días','Sabah al-khayr','Bonjour'], hint:'Buon = good, giorno = day' },
      { q:'What does "Ciao" mean in Italian?',            options:['Hello / Goodbye','Thank you','Please','Good night'], hint:'Italians use it both when arriving AND leaving' },
      { q:'How do you say "please" in Spanish?',          options:['Por favor','Per favore','Min fadlak','S\'il vous plaît'], hint:'Literally "for a favour"' },
      { q:'How do you say "yes" in Arabic?',              options:['Na\'am','Sì','Sí','Oui'],                       hint:'It starts with an "N"' },
      { q:'What is "one" in Italian?',                    options:['Uno','Un','Eins','Une'],                        hint:'Same as in Spanish!' },
      { q:'How do you say "water" in Spanish?',           options:['Agua','Acqua','Ma\'i','Eau'],                   hint:'Sounds like "AH-gwa"' },
      { q:'How do you say "good night" in Italian?',      options:['Buonanotte','Buenas noches','Layla tayyiba','Bonne nuit'], hint:'Buona = good, notte = night' },
      { q:'What is "two" in Spanish?',                    options:['Dos','Due','Ithnan','Deux'],                    hint:'It rhymes with "nose"' },
      { q:'How do you say "I love you" in Italian?',      options:['Ti amo','Te quiero','Uhibbuka','Je t\'aime'],   hint:'Ti = you, amo = love' },
      { q:'What does "Marhaba" mean in Arabic?',          options:['Welcome / Hello','Goodbye','Thank you','Please'], hint:'You\'d hear it when arriving somewhere' },
      { q:'How do you count 1-2-3 in Spanish?',          options:['Uno, dos, tres','Una, due, tre','Wahid, ithnan, thalatha','Un, deux, trois'], hint:'Very similar to Italian!' },
      { q:'How do you say "cat" in Italian?',             options:['Gatto','Gato','Qit','Chat'],                    hint:'Sounds almost the same in Spanish too' },
      { q:'How do you say "pizza" in Italian?',           options:['Pizza (same!)','Pitsa','Fateera','Tarte'],      hint:'Some words are international!' },
      { q:'What is "sun" in Spanish?',                    options:['Sol','Sole','Shams','Soleil'],                  hint:'Also a common name!' },
      { q:'How do you say "number" in Italian?',          options:['Numero','Número','Raqm','Nombre'],              hint:'Very similar to English!' },
      { q:'What does "Shukran" mean in Arabic?',          options:['Thank you','Hello','Please','Goodbye'],         hint:'RC says this to you sometimes!' },
    ],

    science: [
      { q:'What is the closest planet to the Sun?',       options:['Mercury','Venus','Mars','Earth'],               hint:'It\'s the smallest planet too' },
      { q:'How many legs does a spider have?',             options:['8','6','4','10'],                              hint:'Insects have 6 — spiders are not insects!' },
      { q:'What gas do we breathe in to survive?',        options:['Oxygen','Carbon dioxide','Nitrogen','Hydrogen'], hint:'Plants make it for us' },
      { q:'Which is the largest planet in our solar system?', options:['Jupiter','Saturn','Neptune','Mars'],        hint:'More than 1,300 Earths fit inside it' },
      { q:'What makes plants green?',                     options:['Chlorophyll','Oxygen','Water','Sunlight'],      hint:'It\'s a pigment that traps sunlight' },
      { q:'How many bones are in a human body?',          options:['206','180','300','350'],                        hint:'Babies have more — bones fuse as you grow' },
      { q:'What is the powerhouse of the cell?',          options:['Mitochondria','Nucleus','Ribosome','Vacuole'],  hint:'The "power station" of every living cell' },
      { q:'What force keeps us on Earth?',                options:['Gravity','Magnetism','Electricity','Pressure'], hint:'The same force that makes apples fall' },
      { q:'How many hearts does an octopus have?',        options:['3','1','2','4'],                               hint:'Two pump blood to the gills, one to the body' },
      { q:'What is the hardest natural material?',        options:['Diamond','Gold','Iron','Bone'],                 hint:'Made of pure carbon — used in drill bits' },
      { q:'What do you call a baby kangaroo?',            options:['Joey','Cub','Foal','Kitten'],                   hint:'It\'s tiny when born — smaller than a grape!' },
      { q:'What is the speed of light (km per second)?',  options:['300,000','150,000','500,000','30,000'],         hint:'It circles the Earth 7.5 times per second' },
      { q:'How many chambers does a human heart have?',   options:['4','2','3','6'],                               hint:'Two on the left, two on the right' },
      { q:'What is the outer layer of Earth called?',     options:['Crust','Mantle','Core','Magma'],               hint:'We live on it — it\'s the thinnest layer' },
      { q:'Which animal has the biggest brain?',          options:['Sperm whale','Elephant','Human','Gorilla'],     hint:'They also have the most complex communication' },
    ],

    math: [
      { q:'What is 7 × 8?',                              options:['56','54','48','63'],                            hint:'Remember: 5, 6, 7, 8 → 56 = 7 × 8' },
      { q:'What is the square root of 81?',              options:['9','7','8','11'],                               hint:'Think: what number times itself = 81?' },
      { q:'What comes next: 2, 4, 8, 16, ___?',         options:['32','24','20','28'],                            hint:'Each number doubles!' },
      { q:'What is 100 ÷ 4?',                            options:['25','20','30','50'],                            hint:'100 ÷ 2 = 50, then ÷ 2 again' },
      { q:'How many sides does a hexagon have?',          options:['6','7','5','8'],                               hint:'Hex means six in Greek' },
      { q:'What is 12 × 12?',                            options:['144','124','132','164'],                        hint:'A dozen dozens = a gross!' },
      { q:'Is 17 a prime number?',                        options:['Yes','No','Only sometimes','Only if odd'],     hint:'Try dividing it by 2, 3, 5, 7...' },
      { q:'What is 1,000 × 1,000?',                      options:['1,000,000','10,000','100,000','1,000,000,000'], hint:'That\'s one million!' },
      { q:'What fraction of an hour is 15 minutes?',     options:['¼','⅓','½','⅕'],                              hint:'60 ÷ 4 = 15' },
      { q:'What is 8² (8 squared)?',                     options:['64','56','72','48'],                            hint:'8 × 8' },
      { q:'What is the next prime after 11?',             options:['13','12','14','15'],                           hint:'Check: 12 = 2×6, 13 = ?' },
      { q:'How many minutes in 3 hours?',                options:['180','120','200','160'],                        hint:'60 × 3' },
      { q:'What is 50% of 80?',                          options:['40','50','30','45'],                            hint:'50% means half' },
      { q:'What is 9 × 9?',                              options:['81','72','63','91'],                            hint:'9 × 10 = 90, then minus 9' },
      { q:'How many zeros in one billion?',              options:['9','6','8','12'],                               hint:'Million has 6, billion has...' },
    ],

    economics: [
      { q:'Who invented Bitcoin?',                       options:['Satoshi Nakamoto','Elon Musk','Steve Jobs','Bill Gates'], hint:'Nobody knows who this person really is!' },
      { q:'How many Bitcoin will EVER exist?',           options:['21 million','100 million','1 billion','Unlimited'],      hint:'It\'s a small, fixed number — that\'s the point' },
      { q:'What is inflation?',                          options:['Money losing value','Money gaining value','Saving money','Borrowing money'], hint:'$10 today buys less than $10 did 10 years ago' },
      { q:'What does "invest" mean?',                    options:['Put money in to earn more','Spend money on fun','Give money away','Borrow money'], hint:'You\'re making your money work for you' },
      { q:'What is supply and demand?',                  options:['Rare things cost more','Cheap things are better','Saving is spending','Prices never change'], hint:'Bitcoin is rare — only 21M — so...' },
      { q:'What is a profit?',                           options:['Earning more than you spend','Spending more than you earn','Saving nothing','Giving money back'], hint:'Revenue minus costs' },
      { q:'What does a CEO do?',                         options:['Leads a company','Designs buildings','Writes code','Flies planes'], hint:'Chief Executive Officer — the boss' },
      { q:'What is a Satoshi?',                          options:['Smallest unit of Bitcoin','A type of wallet','A mining machine','A blockchain block'], hint:'1 Bitcoin = 100 million Satoshis' },
      { q:'What does entrepreneur mean?',                options:['Someone who starts a business','A type of scientist','A government worker','A professional athlete'], hint:'They spot problems and build solutions' },
      { q:'What is compound interest?',                  options:['Earning interest on interest','A type of loan','A savings account','A Bitcoin term'], hint:'Einstein called it the 8th wonder of the world!' },
    ],
  };

  // ── CROSS-DOMAIN ROUTING ────────────────────────────────────────
  // What subject category should we ask based on the page being unlocked?
  const PAGE_TO_SUBJECT = {
    'numberblocks':    'language',   // math page → language question
    'chess':           'science',    // chess page → science question
    'games':           'economics',  // games page → economics question
    'bitcoin':         'language',   // bitcoin page → language question
    'books':           'math',       // books page → math question
    'puzzles':         'language',   // puzzles page → language question
    'jokes':           'math',       // jokes page → math question
    'robotics':        'language',   // robotics page → language question
    'world':           'math',       // world page → math question
    'ai':              'science',    // ai page → science question
    'entrepreneur':    'science',    // entrepreneur page → science question
    'learning-path':   'language',   // learning path → language question
    'focus':           'math',       // focus → math question
  };

  // Subject display labels
  const SUBJECT_LABELS = {
    language:  'Language 🌍',
    science:   'Science 🔬',
    math:      'Math 🔢',
    economics: 'Economics ₿',
  };

  // ── UTILITIES ───────────────────────────────────────────────────
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function isUnlocked(pageKey) {
    // Check spark pass first
    const pass = +localStorage.getItem(PASS_KEY) || 0;
    if (Date.now() - pass < LOCK_MS) return true;
    // Check page unlock
    const unlocked = +localStorage.getItem(LOCK_PFX + pageKey) || 0;
    return Date.now() - unlocked < LOCK_MS;
  }

  function recordUnlock(pageKey) {
    localStorage.setItem(LOCK_PFX + pageKey, Date.now().toString());
  }

  function giveXP(amount) {
    let xp  = +localStorage.getItem('c_xp')  || 0;
    let lvl = +localStorage.getItem('c_lvl') || 1;
    xp += amount;
    const need = lvl * 100;
    if (xp >= need) { xp -= need; lvl++; localStorage.setItem('c_lvl', lvl); }
    localStorage.setItem('c_xp', xp);
  }

  // ── STYLES ──────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('cg-styles')) return;
    const s = document.createElement('style');
    s.id = 'cg-styles';
    s.textContent = `
#cg-overlay{
  position:fixed;inset:0;z-index:99999;
  background:rgba(10,8,28,0.94);
  display:flex;align-items:center;justify-content:center;
  padding:20px;
  animation:cg-in .3s ease both;
}
@keyframes cg-in{0%{opacity:0}100%{opacity:1}}
#cg-box{
  background:#1a1630;
  border:1px solid rgba(255,255,255,0.1);
  border-radius:28px;
  padding:28px 22px 22px;
  width:100%;max-width:380px;
  text-align:center;
  animation:cg-up .35s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes cg-up{0%{transform:translateY(24px);opacity:0}100%{transform:translateY(0);opacity:1}}
#cg-chip{
  display:inline-block;
  background:rgba(255,255,255,0.08);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:20px;
  padding:5px 16px;
  font-size:12px;font-weight:800;
  color:rgba(255,255,255,0.55);
  letter-spacing:.4px;
  margin-bottom:18px;
  font-family:'Nunito',system-ui,sans-serif;
}
#cg-lock{font-size:46px;line-height:1;margin-bottom:10px;animation:cg-pulse 2s ease-in-out infinite}
@keyframes cg-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
#cg-title{font-size:20px;font-weight:900;color:white;margin-bottom:4px;font-family:'Nunito',system-ui,sans-serif}
#cg-sub{font-size:12px;font-weight:700;color:rgba(255,255,255,0.38);margin-bottom:20px;font-family:'Nunito',system-ui,sans-serif}
#cg-qcard{
  background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:18px;
  padding:16px 14px 14px;
  margin-bottom:14px;
  text-align:left;
}
#cg-qlabel{
  font-size:9px;font-weight:900;letter-spacing:2.5px;text-transform:uppercase;
  color:rgba(255,255,255,0.35);
  margin-bottom:10px;
  font-family:'Nunito',system-ui,sans-serif;
}
#cg-qtext{
  font-size:15px;font-weight:800;color:white;line-height:1.5;
  font-family:'Nunito',system-ui,sans-serif;
}
#cg-options{
  display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;
}
.cg-opt{
  background:rgba(255,255,255,0.07);
  border:1.5px solid rgba(255,255,255,0.12);
  border-radius:14px;
  padding:12px 8px;
  font-family:'Nunito',system-ui,sans-serif;
  font-size:13px;font-weight:800;
  color:white;cursor:pointer;
  line-height:1.35;
  transition:background .15s,border-color .15s,transform .12s;
}
.cg-opt:active{transform:scale(.94)}
.cg-opt:not(:disabled):hover{background:rgba(255,255,255,0.13);border-color:rgba(255,255,255,0.25)}
.cg-opt.correct{background:rgba(16,185,129,.22);border-color:#10B981;color:#6EE7B7;cursor:default}
.cg-opt.wrong{background:rgba(239,68,68,.18);border-color:#EF4444;color:#FCA5A5;cursor:default}
.cg-opt:disabled{cursor:default}
#cg-hint{
  font-size:12px;font-weight:800;color:#FBBF24;
  background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.25);
  border-radius:12px;padding:10px 12px;margin-bottom:12px;
  display:none;text-align:left;
  font-family:'Nunito',system-ui,sans-serif;
}
#cg-skip{
  width:100%;border:none;
  background:rgba(99,102,241,.2);
  border:1px solid rgba(99,102,241,.35);
  border-radius:14px;padding:12px;
  font-family:'Nunito',system-ui,sans-serif;
  font-size:13px;font-weight:900;
  color:#A5B4FC;cursor:pointer;
  margin-top:4px;
  display:none;
  transition:background .15s;
}
#cg-skip:hover{background:rgba(99,102,241,.3)}
#cg-correct-overlay{
  position:fixed;inset:0;z-index:100000;
  background:rgba(16,185,129,.12);
  pointer-events:none;
  animation:cg-flash .6s ease forwards;
}
@keyframes cg-flash{0%{opacity:1}100%{opacity:0}}
    `;
    document.head.appendChild(s);
  }

  // ── BUILD GATE UI ───────────────────────────────────────────────
  function buildGate(pageKey, pageName, pageEmoji) {
    const subject   = PAGE_TO_SUBJECT[pageKey] || 'language';
    const bank      = QUESTIONS[subject];
    const picked    = bank[Math.floor(Math.random() * bank.length)];
    const correct   = picked.options[0];
    const shuffled  = shuffle(picked.options);
    let attempts    = 0;

    const overlay = document.createElement('div');
    overlay.id = 'cg-overlay';

    // Check if spark pass is available
    const passAvail = Date.now() - (+localStorage.getItem(PASS_KEY) || 0) < LOCK_MS;

    overlay.innerHTML = `
      <div id="cg-box">
        <div id="cg-chip">Unlocking ${pageName} ${pageEmoji}</div>
        <div id="cg-lock">🔐</div>
        <div id="cg-title">Quick challenge first!</div>
        <div id="cg-sub">Answer correctly to unlock · Attempt <span id="cg-att">1</span> of 3</div>
        <div id="cg-qcard">
          <div id="cg-qlabel">${SUBJECT_LABELS[subject]}</div>
          <div id="cg-qtext">${picked.q}</div>
        </div>
        <div id="cg-options">
          ${shuffled.map(opt => `<button class="cg-opt" data-ans="${opt}">${opt}</button>`).join('')}
        </div>
        <div id="cg-hint">💡 Hint: ${picked.hint}</div>
        ${passAvail ? `<button id="cg-skip">⚡ Use Spark Pass — Skip the gate!</button>` : ''}
      </div>
    `;

    // Show skip button if pass available
    if (passAvail) {
      const skipBtn = overlay.querySelector('#cg-skip');
      skipBtn.style.display = 'block';
      skipBtn.addEventListener('click', () => dismiss(overlay, pageKey, false));
    }

    // Option click handlers
    overlay.querySelectorAll('.cg-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        // Disable all options
        overlay.querySelectorAll('.cg-opt').forEach(b => b.disabled = true);

        const isCorrect = btn.dataset.ans === correct;

        if (isCorrect) {
          btn.classList.add('correct');
          // Flash green
          const flash = document.createElement('div');
          flash.id = 'cg-correct-overlay';
          document.body.appendChild(flash);
          setTimeout(() => flash.remove(), 700);
          // Celebration
          overlay.querySelector('#cg-lock').textContent = '🎉';
          overlay.querySelector('#cg-title').textContent = 'Unlocked! 🚀';
          overlay.querySelector('#cg-sub').textContent = '+15 XP earned!';
          giveXP(15);
          setTimeout(() => dismiss(overlay, pageKey, true), 900);
        } else {
          btn.classList.add('wrong');
          attempts++;
          // Show correct answer
          overlay.querySelectorAll('.cg-opt').forEach(b => {
            if (b.dataset.ans === correct) b.classList.add('correct');
          });

          if (attempts >= 3) {
            // Auto-unlock after 3 wrong — never block a kid
            overlay.querySelector('#cg-lock').textContent = '🔓';
            overlay.querySelector('#cg-title').textContent = 'Almost there!';
            overlay.querySelector('#cg-sub').textContent = `The answer was: ${correct}`;
            setTimeout(() => dismiss(overlay, pageKey, false), 1400);
          } else {
            // Show hint, reset for next attempt
            overlay.querySelector('#cg-hint').style.display = 'block';
            overlay.querySelector('#cg-att').textContent = attempts + 1;
            setTimeout(() => {
              // Reset options for retry
              overlay.querySelectorAll('.cg-opt').forEach(b => {
                b.classList.remove('correct','wrong');
                b.disabled = false;
              });
            }, 1200);
          }
        }
      });
    });

    return overlay;
  }

  function dismiss(overlay, pageKey, wasCorrect) {
    recordUnlock(pageKey);
    overlay.style.animation = 'none';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity .25s';
    setTimeout(() => overlay.remove(), 260);
  }

  // ── PUBLIC API ──────────────────────────────────────────────────
  return {
    /**
     * Call this at the top of every gated page's <script>:
     *   CassianGate.check('chess', 'Chess', '♟️');
     */
    check(pageKey, pageName, pageEmoji) {
      if (isUnlocked(pageKey)) return; // already unlocked — do nothing
      injectStyles();
      const gate = buildGate(pageKey, pageName, pageEmoji);
      document.body.appendChild(gate);
    },

    /**
     * Call this from index.html whenever a Spark is claimed:
     *   CassianGate.grantSparkPass();
     * Gives a 45-minute free gate skip on any one page.
     */
    grantSparkPass() {
      localStorage.setItem(PASS_KEY, Date.now().toString());
    },

    /**
     * Manually unlock a page (for testing or parent override).
     */
    unlock(pageKey) {
      recordUnlock(pageKey);
    },
  };

})();
