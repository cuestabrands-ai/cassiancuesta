# Cassian's Genius App — Task Card Specs for Claude Code

> Feed these TCs to Claude Code one at a time. Each is self-contained.
> Working directory: `/Users/aeos/Cassian/`
> All files are single HTML files — CSS and JS inline, no build step.

---

## TC-NB · numberblocks.html — TurboWarp Wrapper

**Pre-condition (RC does this manually first):**
1. On a computer, go to **https://packager.turbowarp.org/**
2. Enter project ID **1291946676** and click Load
3. Under Output → select **HTML file** → click Package
4. Rename the downloaded file to **`nb-scratch.html`**
5. Move `nb-scratch.html` into the same folder as this project
6. Then run this TC

**Goal:** Replace `numberblocks.html` with a thin wrapper that shows Cassian's nav at the bottom and the full TurboWarp game filling the rest of the screen. When `nb-scratch.html` is not found, show clear setup instructions.

**Exact implementation:**

Replace `numberblocks.html` entirely with this file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover">
<title>Numberblocks 🔢 — Cassian's Genius App</title>
<link rel="manifest" href="/manifest.json">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:#0a0a1a}
body{display:flex;flex-direction:column;height:100dvh}
.game-frame{flex:1;min-height:0;position:relative}
.game-frame iframe{width:100%;height:100%;border:none;display:block}
/* Setup screen */
.setup{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:24px;text-align:center;color:white;font-family:system-ui,sans-serif;gap:10px}
.setup h2{font-size:22px;font-weight:800;color:#00d4ff;margin-bottom:4px}
.setup p{font-size:14px;color:rgba(255,255,255,.6);line-height:1.6;max-width:340px}
.setup .step{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:13px 16px;font-size:14px;text-align:left;width:100%;max-width:340px}
.setup .step strong{color:#00d4ff}
.setup button{margin-top:8px;padding:12px 32px;border-radius:50px;background:linear-gradient(135deg,#00d4ff,#8b5cf6);border:none;color:white;font-size:15px;font-weight:800;cursor:pointer;font-family:system-ui}
/* Nav */
.app-nav{background:rgba(10,8,30,.97);backdrop-filter:blur(20px);display:flex;justify-content:space-around;align-items:center;padding:8px 4px;padding-bottom:calc(12px + env(safe-area-inset-bottom));border-top:1px solid rgba(255,255,255,.1);z-index:100;flex-shrink:0}
.nav-btn{display:flex;flex-direction:column;align-items:center;gap:2px;text-decoration:none;color:#4a4a6a;transition:all .2s;padding:5px 10px;border-radius:12px}
.nav-btn:hover,.nav-btn.active{color:#00d4ff}
.nav-icon{font-size:22px;line-height:1}
.nav-label{font-size:9px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;font-family:system-ui}
</style>
</head>
<body>
<div class="game-frame" id="gameFrame">
  <iframe src="nb-scratch.html" id="nbFrame" allowfullscreen title="Numberblocks"></iframe>
</div>
<nav class="app-nav">
  <a href="index.html" class="nav-btn"><span class="nav-icon">🏠</span><span class="nav-label">Home</span></a>
  <a href="numberblocks.html" class="nav-btn active"><span class="nav-icon">🔢</span><span class="nav-label">Numbers</span></a>
  <a href="games.html" class="nav-btn"><span class="nav-icon">🎮</span><span class="nav-label">Games</span></a>
  <a href="chess.html" class="nav-btn"><span class="nav-icon">♟️</span><span class="nav-label">Chess</span></a>
  <a href="cosmo.html" class="nav-btn"><span class="nav-icon">🤖</span><span class="nav-label">Cosmo</span></a>
</nav>
<script>
fetch('nb-scratch.html',{method:'HEAD'})
  .then(r=>{if(!r.ok)showSetup();})
  .catch(()=>showSetup());
function showSetup(){
  document.getElementById('gameFrame').innerHTML=`
    <div class="setup">
      <div style="font-size:52px">🔢</div>
      <h2>One Setup Step Needed</h2>
      <p>The Numberblocks game file needs to be downloaded once. Here's how:</p>
      <div class="step"><strong>Step 1:</strong> Go to <strong>packager.turbowarp.org</strong> on a computer</div>
      <div class="step"><strong>Step 2:</strong> Enter project ID <strong style="color:#A29BFE;font-size:17px">1291946676</strong> and click Load</div>
      <div class="step"><strong>Step 3:</strong> Output → HTML file → Package → download</div>
      <div class="step"><strong>Step 4:</strong> Rename the file to <strong>nb-scratch.html</strong> and put it in the Cassian app folder</div>
      <button onclick="location.reload()">Tap here after setup ✓</button>
    </div>`;
}
</script>
<script>if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js');</script>
</body>
</html>
```

**Notes:**
- Do NOT modify any other files
- The iframe loads `nb-scratch.html` from the same directory
- The `fetch HEAD` check detects if the file is missing and shows setup instructions
- Nav bar stays fixed at bottom at all times

---

## TC-01 · chess.html — Add Playable Game Tab

**Goal:** `chess.html` already has "📚 Piece School" and "🧩 Puzzles" tabs — keep both exactly as-is. Add a third tab **"♟️ Play"** with a fully playable chess game.

**Working file:** `/Users/aeos/Cassian/chess.html`

---

### 1. Tab bar change

Add a third button to the existing `.tabs` div:
```html
<button class="tab-btn" onclick="switchTab('play')" id="tab-play">♟️ Play</button>
```

Update `switchTab()` to handle `'play'`:
```javascript
function switchTab(tab){
  ['school','puzzles','play'].forEach(t=>{
    document.getElementById('section-'+t).style.display = t===tab ? 'block' : 'none';
    document.getElementById('tab-'+t).classList.toggle('active', t===tab);
  });
  if(tab==='puzzles') renderCurrentPuzzle();
  if(tab==='play') renderPlayBoard();
  window.scrollTo({top:0,behavior:'smooth'});
}
```

---

### 2. Play section HTML

Add this after the `section-puzzles` div (before closing `</div>` of page-wrap):

```html
<!-- ══════════ PLAY ══════════ -->
<div id="section-play" style="display:none">

  <!-- Mode select -->
  <div style="display:flex;gap:8px;margin-bottom:14px">
    <button class="tab-btn active" id="modeHumanBtn" onclick="setGameMode('human')" style="flex:1">👥 vs Human</button>
    <button class="tab-btn" id="modeCosmoBtn" onclick="setGameMode('cosmo')" style="flex:1">🤖 vs Cosmo</button>
  </div>

  <!-- Status row -->
  <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09);border-radius:14px;margin-bottom:10px">
    <span id="turnTxt" style="font-size:15px;font-weight:900;color:white">White to move ♔</span>
    <span id="checkBadge" style="display:none;background:#e53935;color:white;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:900;letter-spacing:.5px;animation:cpulse .9s ease-in-out infinite">⚠️ CHECK!</span>
  </div>

  <!-- Captured by Black (shown above board) -->
  <div id="capturedTop" style="min-height:26px;padding:3px 8px;font-size:20px;letter-spacing:-3px;text-align:center;color:rgba(255,255,255,.7)"></div>

  <!-- Board -->
  <div style="display:flex;justify-content:center;margin:8px 0">
    <div id="playBoard" style="display:grid;grid-template-columns:repeat(8,1fr);border:3px solid rgba(255,215,0,.35);border-radius:8px;overflow:hidden;width:min(380px,98vw);height:min(380px,98vw)"></div>
  </div>

  <!-- Captured by White (shown below board) -->
  <div id="capturedBot" style="min-height:26px;padding:3px 8px;font-size:20px;letter-spacing:-3px;text-align:center;color:rgba(255,255,255,.7)"></div>

  <!-- Thinking indicator -->
  <div id="thinkingRow" style="display:none;text-align:center;padding:10px;color:#A29BFE;font-size:15px;font-weight:800;animation:throb .8s ease-in-out infinite">🤖 Cosmo is thinking…</div>

  <!-- Buttons -->
  <div style="display:flex;gap:10px;margin-top:12px">
    <button id="undoBtn" onclick="undoMove()" style="flex:1;padding:12px 8px;border-radius:14px;border:2px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:white;font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;cursor:pointer">↩ Undo</button>
    <button onclick="newGame()" style="flex:1;padding:12px 8px;border-radius:14px;border:2px solid rgba(162,155,254,.4);background:rgba(162,155,254,.18);color:#A29BFE;font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;cursor:pointer">↺ New Game</button>
  </div>
</div>
```

Also add these two elements **outside** page-wrap (before `</body>`):

```html
<!-- COSMO Toast notification -->
<div id="cosmoToast" style="position:fixed;bottom:calc(80px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%) translateY(20px);background:rgba(30,20,70,.97);border:1px solid rgba(162,155,254,.4);border-radius:20px;padding:10px 20px;font-size:14px;font-weight:800;color:#A29BFE;opacity:0;transition:all .35s;z-index:600;white-space:nowrap;pointer-events:none"></div>

<!-- Game Over overlay -->
<div id="goOverlay" style="display:none;position:fixed;inset:0;z-index:700;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)">
  <div style="background:rgba(14,8,38,.98);border:2px solid rgba(162,155,254,.35);border-radius:24px;padding:34px 24px;text-align:center;max-width:340px;width:100%;animation:popIn .4s ease-out">
    <div id="goEmoji" style="font-size:58px;margin-bottom:12px">🏆</div>
    <div id="goTitle" style="font-size:28px;font-weight:900;background:linear-gradient(90deg,#FFD700,#A29BFE);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:8px">Checkmate!</div>
    <div id="goMsg" style="color:#a0aec0;font-size:15px;font-weight:700;margin-bottom:22px;line-height:1.55"></div>
    <button onclick="newGame()" style="padding:12px 32px;border-radius:50px;border:2px solid rgba(162,155,254,.4);background:rgba(162,155,254,.18);color:#A29BFE;font-family:'Nunito',sans-serif;font-size:15px;font-weight:800;cursor:pointer">Play Again</button>
  </div>
</div>
```

---

### 3. New CSS to add inside `<style>`

```css
@keyframes cpulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes throb{0%,100%{opacity:1}50%{opacity:.4}}
```

Also add square styles for the play board (these use `.psq` class — see JS section):
```css
.psq{display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;transition:background .1s;font-size:clamp(22px,5.8vw,38px);aspect-ratio:1}
.psq.light{background:#f0d9b5}.psq.dark{background:#b58863}
.psq.sel{background:rgba(255,215,0,.82)!important}
.psq.lastmv{background:rgba(120,180,255,.55)!important}
.psq.hint::after{content:'';position:absolute;width:32%;height:32%;background:rgba(20,200,70,.72);border-radius:50%;pointer-events:none}
.psq.capthint{background:rgba(220,50,50,.55)!important}
.psq.kingcheck{background:rgba(255,40,40,.45)!important}
```

---

### 4. Chess engine JavaScript

Add this entire block at the end of the `<script>` tag (after existing puzzle/tab code):

```javascript
// ═══════════════════════════════════════
// CHESS ENGINE + PLAY UI
// ═══════════════════════════════════════

// ── Helpers ──
const UNI={K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙',k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟','':''};
function isW(p){return p&&p===p.toUpperCase()&&p!=='.';}
function isB(p){return p&&p===p.toLowerCase()&&p!=='.';}
function isOwn(p,c){return c==='w'?isW(p):isB(p);}
function isEnemy(p,c){return c==='w'?isB(p):isW(p);}
function inB(r,c){return r>=0&&r<8&&c>=0&&c<8;}
function cpB(b){return b.map(r=>[...r]);}

// ── Initial position ──
const INIT=[
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  ['.','.','.','.','.','.','.','.'],
  ['.','.','.','.','.','.','.','.'],
  ['.','.','.','.','.','.','.','.'],
  ['.','.','.','.','.','.','.','.'],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R']
];

// ── Game state ──
let gs={
  board:null, turn:'w',
  castling:{wK:true,wQ:true,bK:true,bQ:true},
  ep:null,              // en passant target {r,c}
  sel:null,             // selected square {r,c}
  hints:[],             // legal move destinations for selected piece
  lastFrom:null, lastTo:null,
  capW:[], capB:[],     // captured pieces (unicode)
  over:false, result:null,
  mode:'human',
  history:[]            // undo stack
};

// ── Piece values + PSTs ──
const VAL={P:100,N:320,B:330,R:500,Q:900,K:20000};
const PST={
  P:[[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]],
  N:[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]],
  B:[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],[-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]],
  R:[[0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]],
  Q:[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],[-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]],
  K:[[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],[20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]]
};

function evaluate(board){
  let s=0;
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const p=board[r][c]; if(p==='.')continue;
    const t=p.toUpperCase(), v=VAL[t]||0, pt=PST[t];
    if(isW(p)) s+=v+(pt?pt[r][c]:0);
    else s-=v+(pt?pt[7-r][c]:0);
  }
  return s;
}

// ── Move generation ──
function getPseudoMoves(board,r,c,color,ep){
  const moves=[]; const p=board[r][c]; const T=p.toUpperCase();
  const dir=color==='w'?-1:1;
  const slide=(dr,dc)=>{let rr=r+dr,cc=c+dc;while(inB(rr,cc)){if(isOwn(board[rr][cc],color))break;moves.push({fr:r,fc:c,tr:rr,tc:cc});if(isEnemy(board[rr][cc],color))break;rr+=dr;cc+=dc;}};
  const add=(tr,tc,sp)=>{if(inB(tr,tc)&&!isOwn(board[tr][tc],color))moves.push({fr:r,fc:c,tr,tc,sp});};
  if(T==='P'){
    if(inB(r+dir,c)&&board[r+dir][c]==='.'){
      moves.push({fr:r,fc:c,tr:r+dir,tc:c,sp:(r+dir===0||r+dir===7)?'promo':null});
      const sr=color==='w'?6:1;
      if(r===sr&&board[r+2*dir][c]==='.') moves.push({fr:r,fc:c,tr:r+2*dir,tc:c,sp:'p2'});
    }
    for(const dc of[-1,1]){const tr=r+dir,tc=c+dc;if(!inB(tr,tc))continue;
      if(isEnemy(board[tr][tc],color)) moves.push({fr:r,fc:c,tr,tc,sp:(tr===0||tr===7)?'promo':null});
      if(ep&&tr===ep.r&&tc===ep.c) moves.push({fr:r,fc:c,tr,tc,sp:'ep'});
    }
  } else if(T==='N'){for(const[dr,dc]of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]])add(r+dr,c+dc);}
  else if(T==='B'){for(const[dr,dc]of[[1,1],[1,-1],[-1,1],[-1,-1]])slide(dr,dc);}
  else if(T==='R'){for(const[dr,dc]of[[1,0],[-1,0],[0,1],[0,-1]])slide(dr,dc);}
  else if(T==='Q'){for(const[dr,dc]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]])slide(dr,dc);}
  else if(T==='K'){for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++)if(dr||dc)add(r+dr,c+dc);}
  return moves;
}

function isAttacked(board,r,c,byColor){
  const d=byColor==='w'?1:-1;
  for(const dc of[-1,1]){const pr=r+d,pc=c+dc;if(inB(pr,pc)&&((byColor==='w'&&board[pr][pc]==='P')||(byColor==='b'&&board[pr][pc]==='p')))return true;}
  for(const[dr,dc]of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){const nr=r+dr,nc=c+dc;if(inB(nr,nc)){const p=board[nr][nc];if(byColor==='w'&&p==='N')return true;if(byColor==='b'&&p==='n')return true;}}
  for(const[dr,dc]of[[1,0],[-1,0],[0,1],[0,-1]]){let rr=r+dr,cc=c+dc;while(inB(rr,cc)){const p=board[rr][cc];if(p!=='.'){if(byColor==='w'&&(p==='R'||p==='Q'))return true;if(byColor==='b'&&(p==='r'||p==='q'))return true;break;}rr+=dr;cc+=dc;}}
  for(const[dr,dc]of[[1,1],[1,-1],[-1,1],[-1,-1]]){let rr=r+dr,cc=c+dc;while(inB(rr,cc)){const p=board[rr][cc];if(p!=='.'){if(byColor==='w'&&(p==='B'||p==='Q'))return true;if(byColor==='b'&&(p==='b'||p==='q'))return true;break;}rr+=dr;cc+=dc;}}
  for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){if(!dr&&!dc)continue;const nr=r+dr,nc=c+dc;if(inB(nr,nc)){const p=board[nr][nc];if(byColor==='w'&&p==='K')return true;if(byColor==='b'&&p==='k')return true;}}
  return false;
}

function findKing(board,color){const k=color==='w'?'K':'k';for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(board[r][c]===k)return{r,c};return null;}
function inCheck(board,color){const k=findKing(board,color);return k?isAttacked(board,k.r,k.c,color==='w'?'b':'w'):false;}

function applyMove(board,mv,castling,color){
  const nb=cpB(board); const nc={...castling}; let nep=null;
  const{fr,fc,tr,tc,sp}=mv; const piece=nb[fr][fc];
  if(sp==='ep'){nb[fr][tc]='.';}  // remove captured pawn (same row, dest col)
  if(sp==='p2'){nep={r:(fr+tr)/2,c:fc};}
  let mp=sp==='promo'?(color==='w'?'Q':'q'):piece;
  if(sp==='castle-k'){
    nb[fr][6]=piece;nb[fr][4]='.';nb[fr][5]=color==='w'?'R':'r';nb[fr][7]='.';
    if(color==='w'){nc.wK=false;nc.wQ=false;}else{nc.bK=false;nc.bQ=false;}
    return{board:nb,ep:null,castling:nc};
  }
  if(sp==='castle-q'){
    nb[fr][2]=piece;nb[fr][4]='.';nb[fr][3]=color==='w'?'R':'r';nb[fr][0]='.';
    if(color==='w'){nc.wK=false;nc.wQ=false;}else{nc.bK=false;nc.bQ=false;}
    return{board:nb,ep:null,castling:nc};
  }
  nb[tr][tc]=mp; nb[fr][fc]='.';
  if(piece==='K'){nc.wK=false;nc.wQ=false;}
  if(piece==='k'){nc.bK=false;nc.bQ=false;}
  if(piece==='R'&&fr===7&&fc===7)nc.wK=false;
  if(piece==='R'&&fr===7&&fc===0)nc.wQ=false;
  if(piece==='r'&&fr===0&&fc===7)nc.bK=false;
  if(piece==='r'&&fr===0&&fc===0)nc.bQ=false;
  return{board:nb,ep:nep,castling:nc};
}

function getLegalMoves(board,color,castling,ep){
  const moves=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    if(!isOwn(board[r][c],color))continue;
    for(const mv of getPseudoMoves(board,r,c,color,ep)){
      const res=applyMove(board,mv,castling,color);
      if(!inCheck(res.board,color))moves.push(mv);
    }
  }
  // Castling
  const kr=color==='w'?7:0; const kp=color==='w'?'K':'k'; const opp=color==='w'?'b':'w';
  if(!inCheck(board,color)){
    if((color==='w'?castling.wK:castling.bK)&&board[kr][4]===kp&&board[kr][5]==='.'&&board[kr][6]==='.'&&board[kr][7]===(color==='w'?'R':'r')&&!isAttacked(board,kr,5,opp)&&!isAttacked(board,kr,6,opp))
      moves.push({fr:kr,fc:4,tr:kr,tc:6,sp:'castle-k'});
    if((color==='w'?castling.wQ:castling.bQ)&&board[kr][4]===kp&&board[kr][3]==='.'&&board[kr][2]==='.'&&board[kr][1]==='.'&&board[kr][0]===(color==='w'?'R':'r')&&!isAttacked(board,kr,3,opp)&&!isAttacked(board,kr,2,opp))
      moves.push({fr:kr,fc:4,tr:kr,tc:2,sp:'castle-q'});
  }
  return moves;
}

// ── Minimax ──
function minimax(board,depth,alpha,beta,isMax,castling,ep){
  const color=isMax?'w':'b';
  const moves=getLegalMoves(board,color,castling,ep);
  if(!moves.length) return inCheck(board,color)?(isMax?-90000:90000):0;
  if(!depth) return evaluate(board);
  // Move ordering: captures first
  moves.sort((a,b)=>(board[b.tr][b.tc]!=='.'?VAL[board[b.tr][b.tc].toUpperCase()]||0:0)-(board[a.tr][a.tc]!=='.'?VAL[board[a.tr][a.tc].toUpperCase()]||0:0));
  if(isMax){
    let best=-Infinity;
    for(const mv of moves){const r=applyMove(board,mv,castling,color);const v=minimax(r.board,depth-1,alpha,beta,false,r.castling,r.ep);best=Math.max(best,v);alpha=Math.max(alpha,v);if(beta<=alpha)break;}
    return best;
  } else {
    let best=Infinity;
    for(const mv of moves){const r=applyMove(board,mv,castling,color);const v=minimax(r.board,depth-1,alpha,beta,true,r.castling,r.ep);best=Math.min(best,v);beta=Math.min(beta,v);if(beta<=alpha)break;}
    return best;
  }
}

function getBestMove(board,castling,ep){
  const moves=getLegalMoves(board,'b',castling,ep);
  if(!moves.length)return null;
  moves.sort((a,b)=>(board[b.tr][b.tc]!=='.'?VAL[board[b.tr][b.tc].toUpperCase()]||0:0)-(board[a.tr][a.tc]!=='.'?VAL[board[a.tr][a.tc].toUpperCase()]||0:0));
  let best=Infinity,bestMv=moves[0];
  for(const mv of moves){
    const r=applyMove(board,mv,castling,'b');
    const v=minimax(r.board,2,-Infinity,Infinity,true,r.castling,r.ep);
    if(v<best){best=v;bestMv=mv;}
  }
  return bestMv;
}

// ── COSMO messages ──
const COSMO_CAP=['Oooh sneaky! 😏','I see what you\'re doing... 👀','Nice try! 🤖','Got it! 😄','Thanks for that! 😏','My collection grows! 🤖'];
const COSMO_CHECK=['Watch your King! 👑','Check! 👁️','Your King\'s in danger! ⚠️'];
const COSMO_WIN=['Checkmate! Great game, Cassian! 🎉','You\'re getting better every time! 🤖','Checkmate! You\'ll beat me next time! 🏆'];
function randMsg(arr){return arr[Math.floor(Math.random()*arr.length)];}

function showToast(msg){
  const t=document.getElementById('cosmoToast');
  t.textContent=msg;t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';
  clearTimeout(t._tid);t._tid=setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(-50%) translateY(20px)';},2200);
}

// ── Play UI ──
function newGame(){
  gs.board=cpB(INIT);gs.turn='w';gs.castling={wK:true,wQ:true,bK:true,bQ:true};
  gs.ep=null;gs.sel=null;gs.hints=[];gs.lastFrom=null;gs.lastTo=null;
  gs.capW=[];gs.capB=[];gs.over=false;gs.result=null;gs.history=[];
  document.getElementById('goOverlay').style.display='none';
  document.getElementById('thinkingRow').style.display='none';
  try{localStorage.removeItem('chess_game');}catch(e){}
  renderPlayBoard();updateStatus();
}

function setGameMode(mode){
  gs.mode=mode;
  document.getElementById('modeHumanBtn').classList.toggle('active',mode==='human');
  document.getElementById('modeCosmoBtn').classList.toggle('active',mode==='cosmo');
  newGame();
}

function renderPlayBoard(){
  const board=document.getElementById('playBoard');
  board.innerHTML='';
  // Captured pieces display
  const capUni=arr=>arr.join('');
  document.getElementById('capturedTop').textContent=capUni(gs.capB); // black captured by white — show above
  document.getElementById('capturedBot').textContent=capUni(gs.capW); // white captured by black — show below
  const hintsSet=new Set(gs.hints.map(h=>h.tr*8+h.tc));
  const kPos=gs.over?null:(inCheck(gs.board,gs.turn)?findKing(gs.board,gs.turn):null);
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const sq=document.createElement('div');
    sq.className='psq '+(((r+c)%2===0)?'light':'dark');
    const p=gs.board[r][c];
    if(p&&p!=='.')sq.textContent=UNI[p]||'';
    if(gs.sel&&gs.sel.r===r&&gs.sel.c===c)sq.classList.add('sel');
    else if(gs.lastFrom&&gs.lastFrom.r===r&&gs.lastFrom.c===c)sq.classList.add('lastmv');
    else if(gs.lastTo&&gs.lastTo.r===r&&gs.lastTo.c===c)sq.classList.add('lastmv');
    if(hintsSet.has(r*8+c)){
      if(p&&p!=='.')sq.classList.add('capthint');
      else sq.classList.add('hint');
    }
    if(kPos&&kPos.r===r&&kPos.c===c)sq.classList.add('kingcheck');
    sq.onclick=()=>handleClick(r,c);
    board.appendChild(sq);
  }
  updateStatus();
  saveGame();
}

function handleClick(r,c){
  if(gs.over)return;
  if(gs.mode==='cosmo'&&gs.turn==='b')return; // Cosmo's turn
  const p=gs.board[r][c];
  // If a piece is selected and this is a legal destination → move
  if(gs.sel){
    const mv=gs.hints.find(h=>h.tr===r&&h.tc===c);
    if(mv){executeMove(mv);return;}
    // Clicked own piece → reselect
    if(isOwn(p,gs.turn)){gs.sel={r,c};gs.hints=getLegalMoves(gs.board,gs.turn,gs.castling,gs.ep).filter(m=>m.fr===r&&m.fc===c);renderPlayBoard();return;}
    // Clicked elsewhere → deselect
    gs.sel=null;gs.hints=[];renderPlayBoard();return;
  }
  // No selection: select own piece
  if(isOwn(p,gs.turn)){
    gs.sel={r,c};
    gs.hints=getLegalMoves(gs.board,gs.turn,gs.castling,gs.ep).filter(m=>m.fr===r&&m.fc===c);
    renderPlayBoard();
  }
}

function executeMove(mv){
  // Save history
  gs.history.push({board:cpB(gs.board),turn:gs.turn,castling:{...gs.castling},ep:gs.ep?{...gs.ep}:null,capW:[...gs.capW],capB:[...gs.capB],lastFrom:gs.lastFrom?{...gs.lastFrom}:null,lastTo:gs.lastTo?{...gs.lastTo}:null});
  const captured=gs.board[mv.tr][mv.tc];
  const wasEp=mv.sp==='ep';
  const res=applyMove(gs.board,mv,gs.castling,gs.turn);
  gs.board=res.board;gs.castling=res.castling;gs.ep=res.ep;
  gs.lastFrom={r:mv.fr,c:mv.fc};gs.lastTo={r:mv.tr,c:mv.tc};
  // Track captures
  if(captured&&captured!=='.')  {if(gs.turn==='w')gs.capB.push(UNI[captured]);else gs.capW.push(UNI[captured]);}
  if(wasEp){const epCap=gs.turn==='w'?'p':'P';if(gs.turn==='w')gs.capB.push(UNI[epCap]);else gs.capW.push(UNI[epCap]);}
  gs.sel=null;gs.hints=[];
  const opp=gs.turn==='w'?'b':'w';
  gs.turn=opp;
  // Check for game over
  const legalNext=getLegalMoves(gs.board,opp,gs.castling,gs.ep);
  if(!legalNext.length){
    gs.over=true;
    if(inCheck(gs.board,opp)){
      gs.result=gs.turn==='b'?'white':'black'; // the player who just moved wins... wait
      // opp has no moves AND is in check → opp is checkmated → the player whose turn it WAS (not opp) wins
      // gs.turn is now opp (the one checkmated)
      // So the winner is the other color
      const winner=gs.turn==='w'?'Black':'White'; // Wait: gs.turn was already flipped to opp above
      // Let me re-check: before flip gs.turn was the mover, after flip gs.turn = opp (the checkmated side)
      // Winner = the mover = opposite of current gs.turn
      const winnerColor=gs.turn==='w'?'b':'w';
      showGameOver('checkmate',winnerColor);
    } else {
      showGameOver('stalemate',null);
    }
    renderPlayBoard();return;
  }
  // Cosmo capture toast
  if(gs.mode==='cosmo'&&gs.turn==='w'&&(captured&&captured!=='.')){showToast(randMsg(COSMO_CAP));}
  // Check toast for Cosmo
  if(gs.mode==='cosmo'&&gs.turn==='w'&&inCheck(gs.board,'w')){showToast(randMsg(COSMO_CHECK));}
  renderPlayBoard();
  // Cosmo plays
  if(gs.mode==='cosmo'&&gs.turn==='b'&&!gs.over){
    document.getElementById('thinkingRow').style.display='block';
    document.getElementById('undoBtn').disabled=true;
    setTimeout(()=>cosmoMove(),620);
  }
}

function cosmoMove(){
  const mv=getBestMove(gs.board,gs.castling,gs.ep);
  document.getElementById('thinkingRow').style.display='none';
  document.getElementById('undoBtn').disabled=false;
  if(!mv){gs.over=true;showGameOver('stalemate',null);renderPlayBoard();return;}
  const captured=gs.board[mv.tr][mv.tc];
  if(captured&&captured!=='.'){setTimeout(()=>showToast(randMsg(COSMO_CAP)),100);}
  executeMove(mv);
}

function undoMove(){
  if(!gs.history.length||gs.over)return;
  // In vs Cosmo, undo both Cosmo's move and player's move
  const steps=gs.mode==='cosmo'&&gs.history.length>=2?2:1;
  for(let i=0;i<steps;i++){if(gs.history.length)Object.assign(gs,gs.history.pop());}
  // Restore properly: history entry has all fields
  const h=gs.history.length?null:null; // already assigned above via Object.assign
  gs.sel=null;gs.hints=[];gs.over=false;gs.result=null;
  document.getElementById('goOverlay').style.display='none';
  renderPlayBoard();
}

function showGameOver(type,winner){
  const overlay=document.getElementById('goOverlay');
  if(type==='checkmate'){
    const wName=winner==='w'?'White':'Black';
    document.getElementById('goEmoji').textContent=winner==='w'?'🏆':'🤖';
    document.getElementById('goTitle').textContent='Checkmate!';
    if(gs.mode==='cosmo'&&winner==='b'){
      document.getElementById('goMsg').textContent=randMsg(COSMO_WIN);
    } else {
      document.getElementById('goMsg').textContent=`${wName} wins! Great game! 🎉`;
    }
  } else {
    document.getElementById('goEmoji').textContent='🤝';
    document.getElementById('goTitle').textContent='Stalemate!';
    document.getElementById('goMsg').textContent='No legal moves — it\'s a draw! A clever result. 🤝';
  }
  overlay.style.display='flex';
}

function updateStatus(){
  if(gs.over)return;
  const t=document.getElementById('turnTxt');
  const cb=document.getElementById('checkBadge');
  t.textContent=gs.turn==='w'?'White to move ♔':'Black to move ♚';
  const check=inCheck(gs.board,gs.turn);
  cb.style.display=check?'inline-block':'none';
  document.getElementById('undoBtn').disabled=!gs.history.length;
}

function saveGame(){try{localStorage.setItem('chess_game',JSON.stringify({board:gs.board,turn:gs.turn,castling:gs.castling,ep:gs.ep,capW:gs.capW,capB:gs.capB,lastFrom:gs.lastFrom,lastTo:gs.lastTo,mode:gs.mode}));}catch(e){}}
function loadGame(){
  try{
    const d=JSON.parse(localStorage.getItem('chess_game'));
    if(d&&d.board){gs.board=d.board;gs.turn=d.turn;gs.castling=d.castling;gs.ep=d.ep;gs.capW=d.capW||[];gs.capB=d.capB||[];gs.lastFrom=d.lastFrom;gs.lastTo=d.lastTo;gs.mode=d.mode||'human';
    document.getElementById('modeHumanBtn').classList.toggle('active',gs.mode==='human');
    document.getElementById('modeCosmoBtn').classList.toggle('active',gs.mode==='cosmo');
    gs.history=[];return true;}
  }catch(e){}return false;
}

// Init
function initPlay(){if(!loadGame()){gs.board=cpB(INIT);gs.turn='w';gs.castling={wK:true,wQ:true,bK:true,bQ:true};gs.ep=null;gs.capW=[];gs.capB=[];gs.history=[];}gs.sel=null;gs.hints=[];gs.over=false;}
initPlay();
```

---

### 5. Fix the undo function

The undo as written above uses `Object.assign(gs, gs.history.pop())` — this works because the history entries contain all the game state fields. However, add a safety check to handle `cosmoThinking` state:

```javascript
// At the top of undoMove(), also cancel any pending Cosmo timer:
if(gs.cosmoThinking) return; // don't undo mid-Cosmo-think
```

Set `gs.cosmoThinking = true` at the start of `cosmoMove()` and `false` at the end.

---

### 6. Quick verification checklist (Claude Code must confirm before finishing)

- [ ] Three tabs render: 📚 Pieces | 🧩 Puzzles | ♟️ Play
- [ ] Piece School and Puzzles tabs work exactly as before (no changes to their code)
- [ ] Play tab shows board with correct starting position
- [ ] Tapping a piece selects it (gold highlight) and shows green dots for legal moves
- [ ] Pawn moves forward, captures diagonally, promotes to Queen at row 0/7
- [ ] Knight moves in L-shape
- [ ] Castling: king moves 2 squares, rook jumps over
- [ ] En passant works
- [ ] King in check → red background on king square + CHECK badge
- [ ] No move leaves own king in check
- [ ] Checkmate detected → game over modal appears
- [ ] Stalemate detected → draw modal appears
- [ ] "vs Cosmo" → Cosmo makes moves after 600ms delay
- [ ] Cosmo toast messages appear after captures
- [ ] Undo works (2 moves back in vs Cosmo mode)
- [ ] New Game resets cleanly
- [ ] Game saved to `localStorage('chess_game')` on every move
- [ ] Nav bar unchanged: 🏠🔢🎮♟️🤖

---

## TC-02 · cosmo.html — COSMO AI Tutor

**Goal:** Build `cosmo.html` — Cassian's AI tutor powered by Claude Haiku via Cloudflare Worker.

### Setup Flow
On first load, if no Worker URL configured:
1. Show setup screen with instructions:
   - "Paste your Cloudflare Worker URL below"
   - Input field + Save button
   - Brief explanation: "COSMO uses a secure proxy so your API key stays safe"
2. After URL saved to `localStorage('cosmo_worker_url')`, show main chat

### Worker URL format
The Worker proxies requests to Anthropic. RC will set up the Worker separately.
The app POSTs to: `{workerUrl}/chat`
```json
{
  "messages": [...],
  "system": "...",
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 1024
}
```
Worker returns Anthropic's response directly.

### System Prompt for COSMO
```
You are COSMO, Cassian's personal AI tutor and best learning friend. Cassian is 6 years old, has an IQ around 150 (2e — twice exceptional), and is homeschooled. He is passionate about: math (especially big numbers, patterns, primes), chess, piano (perfect pitch), robotics, Numberblocks, Bitcoin/economics, and learning Arabic and Spanish.

Speak to Cassian directly — warm, encouraging, playful, and smart. Never talk down to him. Use short sentences. Use emojis occasionally. When he asks a math question, give the answer AND show why it's interesting. When he wants to explore a number, tell him what clubs it's in (prime? square? fibonacci?). Celebrate his discoveries. Ask one follow-up question to keep the conversation going.

If asked something in Spanish or Arabic, respond in that language. Always be his enthusiastic learning partner.
```

### Chat UI
- Messages appear in bubbles (Cassian right/teal, COSMO left/purple)
- COSMO avatar: 🤖 with purple background
- Text input at bottom with Send button
- While waiting: animated "COSMO is thinking..." with bouncing dots
- Scroll to latest message automatically
- Message history kept in session (not persisted — fresh each visit)

### Quick Action Buttons (above input)
Tappable chips that pre-fill common questions:
- `🔢 Tell me about [number]` → prompts for number then sends
- `♟️ Chess tip`
- `🌟 Fun math fact`
- `🌍 Teach me a word` (Spanish or Arabic)
- `🎵 Music question`

### Journal Tab (second tab)

The journal is a **guided reflection tool powered by COSMO** — not a blank text box. The goal is to help Cassian develop his thoughts, ideas, and conversational skills through AI dialogue.

**Flow:**
1. COSMO opens with a warm reflection prompt, e.g.: *"Hey Cassian! What's one thing you discovered or thought about today? 🌟"*
2. Cassian types his response (or voice-to-text on iPad)
3. COSMO responds in 2-3 sentences — asks a follow-up question to go deeper (e.g., "That's amazing! Why do you think that happens?")
4. Continue for 2-4 turns until Cassian feels done
5. "Save this conversation" button → saves the full exchange with date to `localStorage('cosmo_journal')`
6. Past journals shown as expandable cards (last 7 entries)

**COSMO system prompt for Journal mode (different from chat):**
```
You are COSMO, Cassian's reflective thinking partner. Cassian is 6 years old, IQ ~150, twice-exceptional. Your job in Journal mode is to help him reflect on what he learned, thought about, or wondered today. Ask one thoughtful follow-up question per turn. Help him go deeper — not just "what did you do" but "why was it interesting", "what surprised you", "what do you want to know next". Be warm, short, smart. 2-3 sentences max per reply. End with one question.
```

**Offline fallback for Journal:** If no Worker URL is set, still allow free-text journaling. Replace the COSMO prompt with: *"COSMO is offline — write whatever you discovered today!"* Save button still works.

**Entry format saved to localStorage:**
```json
{
  "date": "2026-05-20",
  "messages": [
    {"role": "cosmo", "text": "Hey Cassian! What's one thing you discovered today? 🌟"},
    {"role": "cassian", "text": "I learned that 7 is the only prime that's also magic"},
    {"role": "cosmo", "text": "That's so interesting! What makes you think 7 feels magic?"}
  ]
}
```

### Offline Fallback
If Worker URL not set OR fetch fails:
- Show: "COSMO is offline right now, but here's a fun fact: [rotating list of 20 pre-written facts about math/chess/Numberblocks]"
- Still show Journal tab

### Style
- Dark purple/space theme matching app
- COSMO header with animated star sparkles
- Nav: Home | Numbers | Games | Chess | 🤖 Cosmo (active)

---

## TC-03 · Intelligence Layer — Adaptive Hints via Claude Haiku

**Goal:** Add an optional AI hint system that any game page can call.

### Shared utility: `cosmo-hints.js`

```javascript
// Call this from any page to get a COSMO hint
async function getCosmoHint(context) {
  const workerUrl = localStorage.getItem('cosmo_worker_url');
  if (!workerUrl) return null;
  
  const response = await fetch(`${workerUrl}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: 'You are COSMO, Cassian\'s AI tutor. Give one short, encouraging hint (2-3 sentences max). Be specific and smart.',
      messages: [{ role: 'user', content: context }]
    })
  });
  
  const data = await response.json();
  return data.content?.[0]?.text || null;
}
```

### Integration points per page:

**numberblocks.html** — "Ask COSMO" button in INFO modal:
- Context: `"Cassian is looking at the number ${N}. Tell him one fascinating thing about it — mathematical, historical, or from the Numberblocks show."`
- Shows response in a purple bubble below the info facts

**chess.html** — "Get Hint" button during puzzles:
- Context: `"Cassian is solving chess puzzle: ${puzzleTitle}. The position is: ${puzzleDescription}. Give him one hint without giving away the answer."`
- Shows as a speech bubble from the 🤖 COSMO icon

**games.html** — Adaptive difficulty hint after 2 wrong answers:
- Context: `"Cassian got this math problem wrong twice: ${question}. Explain it in a fun way for a 6-year-old genius."`

**bitcoin.html** — "Why?" button on each Learn card:
- Context: `"Cassian wants to know more about: ${cardTitle}. Explain it in 2-3 sentences for a 6-year-old who loves math and economics."`

### UI pattern for hints
All hints use the same floating bubble:
```html
<div id="cosmoHint" style="display:none">
  <div class="cosmo-bubble">
    <span>🤖</span>
    <p id="cosmoHintText"></p>
  </div>
</div>
```

---

## TC-04 · games.html — Add COSMO Adaptive Difficulty

**Goal:** Enhance `games.html` with adaptive math difficulty.

**Current state:** 3 static math games (Number Quest, Speed Math, Pattern Wizard)

**Changes:**
1. Track per-game: correct answers, wrong answers, average response time
2. After every 5 questions, adjust difficulty:
   - <60% correct OR avg time >15s → decrease difficulty
   - >85% correct AND avg time <5s → increase difficulty
3. Store difficulty level in `localStorage('games_diff_${gameName}')`
4. After 2 consecutive wrong answers → show "Ask COSMO?" button
5. On click → call `getCosmoHint()` with the problem context

**New difficulty tiers for Speed Math:**
- Level 1: 1-digit + 1-digit (1+2)
- Level 2: 2-digit + 1-digit (23+7)
- Level 3: 2-digit + 2-digit (34+28)
- Level 4: Multiplication 1-digit (6×7)
- Level 5: Multiplication 2-digit × 1-digit (24×6)
- Level 6: Mixed operations with 3 numbers

---

## TC-05 · index.html — Apple-Style Redesign

**Goal:** Redesign `index.html` with clean, minimal Apple-style aesthetic.

**Design system:**
- Background: very dark navy `#0a0a1a` — clean, not gradient-heavy
- Cards: `rgba(255,255,255,0.06)` glass with `backdrop-filter:blur(20px)`
- Borders: `1px solid rgba(255,255,255,0.08)` — very subtle
- Card hover: `translateY(-4px)` + border brightens to `rgba(255,255,255,0.18)`
- No emoji overload — one icon per card, clean typography
- Font sizes: tighter, more intentional
- Grid: 2 columns on iPad, 1 on mobile — not auto-fill

**Card structure** (8 cards total — keep existing):
1. Numberblocks → numberblocks.html
2. Math Games → games.html
3. Chess → chess.html
4. COSMO → cosmo.html
5. Bitcoin Mine → bitcoin.html
6. Math Puzzles → puzzles.html
7. Smart Jokes → jokes.html
8. Beast Academy → https://beastacademy.com (external)

**XP bar:** keep but redesign — thinner (4px), more subtle colors

**Daily challenge:** keep but make card cleaner

**Nav:** fixed bottom, frosted glass `rgba(10,10,26,0.95)`, thinner (60px height)

---

## TC-06 · sw.js — Update Service Worker Cache

**Goal:** Update `sw.js` to cache all current pages.

Replace the cached files list with:
```javascript
const CACHE_FILES = [
  '/', '/index.html', '/numberblocks.html', '/games.html',
  '/chess.html', '/jokes.html', '/cosmo.html', '/bitcoin.html',
  '/books.html', '/puzzles.html', '/learning-path.html', '/manifest.json'
];
```

Bump cache version to `cassian-v3`.

Also add fetch handler that falls back to cached version on network failure (offline-first).

---

## TC-07 · All Pages — Nav Consistency Pass

**Goal:** Audit all HTML files and standardize the bottom nav.

**Correct nav for all pages:**
```html
<nav class="app-nav">
  <a href="index.html" class="nav-btn"><span class="nav-icon">🏠</span><span class="nav-label">Home</span></a>
  <a href="numberblocks.html" class="nav-btn"><span class="nav-icon">🔢</span><span class="nav-label">Numbers</span></a>
  <a href="games.html" class="nav-btn"><span class="nav-icon">🎮</span><span class="nav-label">Games</span></a>
  <a href="chess.html" class="nav-btn"><span class="nav-icon">♟️</span><span class="nav-label">Chess</span></a>
  <a href="cosmo.html" class="nav-btn"><span class="nav-icon">🤖</span><span class="nav-label">Cosmo</span></a>
</nav>
```

Files to update: `games.html`, `jokes.html`, `puzzles.html`, `bitcoin.html`, `books.html`, `learning-path.html`

Add `.active` class to the nav button matching the current page on each file.

Also ensure every file has:
- `<link rel="manifest" href="/manifest.json">`
- Service worker registration script:
```html
<script>if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js');</script>
```

---

## TC-08 · books.html — "100 Cool Things About..." Interactive Library

**Goal:** Build `books.html` — an interactive reading room.

**Concept:** Flipbook-style cards for fascinating facts across topics Cassian loves.

**Categories:**
- 🔢 Math (primes, infinity, patterns)
- ♟️ Chess (history, famous games, openings)
- ₿ Bitcoin (how it works, Satoshi story)
- 🎵 Music & Piano (notes, composers, theory)
- 🤖 Robotics (famous robots, how they work)
- 🌍 Languages (Spanish/Arabic fun facts)
- 🌌 Space (black holes, galaxies, scale of universe)

**Each card:** front (big emoji + title) → flip → back (2-3 sentences fact, age-appropriate but smart)

**CSS 3D flip animation:** `transform: rotateY(180deg)` on tap

**100 facts total** (pre-written, no API). Show 10 per category.

**Progress:** track which cards Cassian has flipped (`localStorage('books_seen')`).

**Style:** Rich, warm library colors. Card backs in category color. "Discovered: X/100" counter at top.

---

---

## TC-09 · CLAUDE.md — Claude Code Project Context File

**Goal:** Create a `CLAUDE.md` in the project root so Claude Code has full context every session — no re-explaining needed.

### File to create: `CLAUDE.md`

```markdown
# Cassian's Genius App — Claude Code Context

## Who this is for
This is a personal learning app for Cassian Cuesta, age 6, IQ ~150, 2e (twice exceptional).
Built by his father RC (cuestabrands@gmail.com) using Claude Code + Cowork.

## Cassian's Profile
- **Math:** Year 2+ level (advanced — treat as 8-10 year old for numbers/patterns)
- **Chess:** Learning — needs clear explanations, not expert language
- **Reading:** Age-appropriate (6 years old)
- **Languages:** English primary, learning Spanish + Arabic
- **Interests:** Big numbers, primes, patterns, Numberblocks, chess, piano, Bitcoin/economics, robotics
- **2e notes:** Gifted intellectually, age-level emotionally. Short focus bursts (8-12 min). Hyperfocus on maths.

## Project Structure
- `index.html` — Home screen (Apple-style grid of 8 app cards)
- `numberblocks.html` — Number explorer (TurboWarp Numberblocks replica)
- `chess.html` — Chess: Piece School + Puzzles + Play vs Human/Cosmo
- `games.html` — Math games (Number Quest, Speed Math, Pattern Wizard)
- `cosmo.html` — COSMO AI tutor (Claude Haiku via Cloudflare Worker)
- `bitcoin.html` — Bitcoin/economics learn cards
- `puzzles.html` — Math puzzles
- `jokes.html` — Smart jokes
- `books.html` — 100 Cool Things interactive flipbook library
- `learning-path.html` — Learning progress tracker
- `focus.html` — Focus & Flow Trainer (Pomodoro adapted for 2e kids)
- `sw.js` — Service worker for offline-first PWA
- `manifest.json` — PWA manifest
- `cosmo-hints.js` — Shared utility for COSMO AI hint calls

## Design System
- Background: `#0a0a1a` (very dark navy)
- Cards: `rgba(255,255,255,0.06)` glass + `backdrop-filter:blur(20px)`
- Borders: `1px solid rgba(255,255,255,0.08)`
- Accent: teal (`#00d4ff`) and purple (`#8b5cf6`)
- Font: system-ui / SF Pro feel
- All pages are single HTML files — CSS and JS inline, no build step

## Bottom Nav (all pages must have this)
```html
<nav class="app-nav">
  <a href="index.html" class="nav-btn"><span class="nav-icon">🏠</span><span class="nav-label">Home</span></a>
  <a href="numberblocks.html" class="nav-btn"><span class="nav-icon">🔢</span><span class="nav-label">Numbers</span></a>
  <a href="games.html" class="nav-btn"><span class="nav-icon">🎮</span><span class="nav-label">Games</span></a>
  <a href="chess.html" class="nav-btn"><span class="nav-icon">♟️</span><span class="nav-label">Chess</span></a>
  <a href="cosmo.html" class="nav-btn"><span class="nav-icon">🤖</span><span class="nav-label">Cosmo</span></a>
</nav>
```

## localStorage Keys (do not conflict)
- `cassian_profile` — Adaptive profile (domain difficulty levels)
- `cosmo_worker_url` — Cloudflare Worker URL for COSMO AI
- `cosmo_journal` — Daily journal entries
- `chess_game` — Chess game in progress
- `games_diff_${gameName}` — Per-game difficulty level
- `books_seen` — Set of flipped book cards
- `focus_sessions` — Focus session history
- `xp_total` — Total XP across all activities

## Conventions
- No external CSS/JS dependencies (everything inline or from cdnjs)
- PWA-ready: every page registers `sw.js`
- Trilingual UI: English primary, Spanish + Arabic toggleable
- No API keys in frontend — all AI calls go through Cloudflare Worker at `cosmo_worker_url`
- Adaptive difficulty: read/write via `cassianProfile.get(domain)` / `cassianProfile.set(domain, level)`

## TC_SPECS.md
All Task Cards (TC-01 through TC-11) are in `TC_SPECS.md`. Feed one TC at a time to Claude Code.
Current priority order is at the bottom of TC_SPECS.md.
```

**Notes for Claude Code:** After creating CLAUDE.md, verify it reads cleanly. No code changes to any other files.

---

## TC-10 · focus.html — Focus & Flow Trainer

**Goal:** Build `focus.html` — a dedicated focus and deep work tool based on research into 2e/gifted learners.

### Background (important for implementation)
Cassian is 2e: IQ ~150, age 6. Research-backed methods for this profile:
- Pomodoro adapted shorter: **8–12 min work, 3 min break** (not 25 min — gifted kids burn out faster)
- Flow state protection: detect streaks, never interrupt mid-flow
- Avoid childish stars/badges — use real achievement metrics (streak count, personal bests)
- One thing at a time: no menus during active focus
- COSMO as body-double: companion presence during work, not Q&A

### Tabs

**Tab 1: 🎯 Focus Session**

Setup screen (before session starts):
- "What are we working on today?" — text input (e.g., "Chess puzzles", "Math", "Piano")
- Duration picker: 8 min | 10 min | 12 min | Custom
- Big START button

Active session screen (no distractions — full screen feel):
- Large circular timer countdown (CSS `conic-gradient` progress ring, teal color)
- Current task name shown in center
- Session status: "🔥 In the zone" once 2+ min in without interruption
- COSMO presence bar at bottom: small purple bar with "🤖 COSMO is here with you" (static, reassuring)
- Only two buttons visible: ⏸ Pause | ✕ End Early
- When paused: "Take a breath 🌬️" message + resume button + 3-min break auto-suggestion

Break screen:
- 3-minute countdown (smaller, calmer)
- Breathing animation: expanding/contracting circle, 4s inhale / 4s exhale
- "Great work! Rest your brain for 3 minutes."
- Option: "Keep going" (skip break) or let timer run

Session complete screen:
- Confetti burst (CSS only — no library)
- "You focused for [N] minutes on [task]! 🎉"
- "That's your [X]th session today" / "New personal best!"
- Option: Start another session | Go home

**Tab 2: 📊 My Focus**

Stats dashboard:
- Today: sessions completed, total focus minutes
- This week: 7-day bar chart (CSS bars, no library) showing daily focus minutes
- Personal best: longest single session
- Current streak: consecutive days with at least 1 session
- All-time: total sessions, total hours

Recent sessions list (last 10):
- Each row: [task name] — [duration] — [date]

**Tab 3: 🗓️ Plan My Day**

Simple structured daily planner:
- Morning intention: "Today I want to learn about..." (text input)
- 3 task slots: Task 1 / Task 2 / Task 3 (each with subject + time estimate)
- Checkboxes to mark done
- Evening reflection: "What did I discover today?" (text area)
- Saves to `localStorage('focus_sessions')` with date

### Data structure
```javascript
// localStorage('focus_sessions') — array of:
{
  date: "2026-05-20",
  task: "Chess puzzles",
  durationMinutes: 10,
  completed: true,  // false if ended early
  startTime: "14:32"
}
```

### Style
- Dark space theme matching app
- Timer ring: teal `#00d4ff` on dark `rgba(255,255,255,0.06)` track
- Break screen: softer purple tones
- Stats bars: teal fill on dark background
- Font sizes large — easy to read for a 6-year-old
- No nav visible during active session (full focus mode)
- Nav visible on stats + plan tabs

### COSMO Hook (if Worker URL configured)
After session complete, optional: "Ask COSMO how to remember what you learned" button.
Context: `"Cassian just finished a ${duration}-minute focus session on '${task}'. Give him one quick tip for locking in what he learned — 2 sentences, fun and specific."`

---

## TC-11 · cassian-profile.js — Adaptive Learning Profile System

**Goal:** Create a shared `cassian-profile.js` utility that all game pages import. Stores and exposes Cassian's current difficulty level per learning domain, so every game adapts to where he actually is — not a generic difficulty.

### File: `cassian-profile.js`

```javascript
/**
 * Cassian Adaptive Profile
 * All games read from and write to this shared profile.
 * Stored in localStorage('cassian_profile')
 */

const CassianProfile = (() => {
  
  // Domain definitions with initial levels
  const DOMAINS = {
    math_arithmetic:    { label: 'Arithmetic',       min: 1, max: 10, default: 5 },
    math_patterns:      { label: 'Patterns',          min: 1, max: 10, default: 6 },
    math_bigNumbers:    { label: 'Big Numbers',       min: 1, max: 10, default: 7 },
    chess_tactics:      { label: 'Chess Tactics',     min: 1, max: 10, default: 2 },
    chess_puzzles:      { label: 'Chess Puzzles',     min: 1, max: 10, default: 2 },
    language_spanish:   { label: 'Spanish',           min: 1, max: 10, default: 1 },
    language_arabic:    { label: 'Arabic',            min: 1, max: 10, default: 1 },
    reading:            { label: 'Reading',           min: 1, max: 10, default: 3 },
    focus_duration:     { label: 'Focus Duration',   min: 1, max: 10, default: 3 },
  };

  function load() {
    try {
      return JSON.parse(localStorage.getItem('cassian_profile')) || {};
    } catch { return {}; }
  }

  function save(data) {
    localStorage.setItem('cassian_profile', JSON.stringify(data));
  }

  return {
    // Get level for a domain (1-10)
    get(domain) {
      const data = load();
      return data[domain] ?? DOMAINS[domain]?.default ?? 1;
    },

    // Set level for a domain
    set(domain, level) {
      const data = load();
      const d = DOMAINS[domain];
      if (!d) return;
      data[domain] = Math.max(d.min, Math.min(d.max, level));
      save(data);
    },

    // Record a result and auto-adjust level
    // result: { correct: bool, timeMs: number, streakCorrect: number }
    recordResult(domain, result) {
      const current = this.get(domain);
      let next = current;
      
      // Fast + correct streak → level up
      if (result.correct && result.streakCorrect >= 5 && result.timeMs < 5000) {
        next = Math.min(current + 1, DOMAINS[domain]?.max ?? 10);
      }
      // Wrong + slow → level down
      else if (!result.correct && result.timeMs > 15000) {
        next = Math.max(current - 1, DOMAINS[domain]?.min ?? 1);
      }
      
      if (next !== current) this.set(domain, next);
      return next;
    },

    // Get all domains with current levels (for display)
    getAll() {
      const data = load();
      return Object.entries(DOMAINS).map(([key, meta]) => ({
        key,
        label: meta.label,
        level: data[key] ?? meta.default,
        max: meta.max
      }));
    },

    // Reset a domain to default
    reset(domain) {
      const data = load();
      delete data[domain];
      save(data);
    },

    // Reset everything
    resetAll() {
      localStorage.removeItem('cassian_profile');
    }
  };
})();
```

### Integration — how each page uses it

**games.html** (replace per-game localStorage with profile):
```javascript
// On load — read difficulty for this domain
const level = CassianProfile.get('math_arithmetic');
setDifficulty(level);

// After each answer
CassianProfile.recordResult('math_arithmetic', {
  correct: isCorrect,
  timeMs: responseTimeMs,
  streakCorrect: currentStreak
});
```

**chess.html** (puzzle difficulty):
```javascript
const puzzleLevel = CassianProfile.get('chess_puzzles');
// Show puzzles rated at or below puzzleLevel
```

**cosmo.html** (system prompt enrichment):
```javascript
const profile = CassianProfile.getAll();
const profileStr = profile.map(d => `${d.label}: Level ${d.level}/${d.max}`).join(', ');
// Append to COSMO system prompt: "Cassian's current levels: ${profileStr}"
```

### Profile Viewer (add to cosmo.html Settings tab or learning-path.html)

Simple display of all domain levels as a visual bar chart:
```html
<div class="profile-grid">
  <!-- For each domain: -->
  <div class="domain-row">
    <span class="domain-label">Arithmetic</span>
    <div class="level-bar">
      <div class="level-fill" style="width: 70%"></div> <!-- level/max * 100 -->
    </div>
    <span class="level-num">7/10</span>
  </div>
</div>
```

RC can manually override any level by tapping the bar and dragging, or using +/- buttons.

### Notes for Claude Code
1. Create `cassian-profile.js` as a standalone file
2. Add `<script src="cassian-profile.js"></script>` to: `games.html`, `chess.html`, `cosmo.html`, `focus.html`
3. Update `sw.js` cache list to include `cassian-profile.js`
4. Update `CLAUDE.md` localStorage keys section

---

## TC-12 · robotics.html — Light Theme + UX Demo Redesign

**Goal:** Two things in one pass:
1. Full light theme CSS (matches the rest of the app — bright, kid-friendly)
2. UX overhaul — add a guided "First Mission" intro so Cassian knows what to do the moment he lands

**Who:** Cassian, age 6, gifted in math/patterns, attention in 8–12 min bursts. He needs a clear starting point or he bounces.

---

### Part 1 — Light Theme CSS

Inject this block **before the closing `</style>` tag** (around line 155). Do not touch any JS.

```css
/* ── LIGHT THEME ── */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
body {
  background: linear-gradient(160deg, #F0FFF8 0%, #F5F0FF 55%, #FFF8F0 100%) !important;
  color: #1E1B4B !important;
  font-family: 'Nunito', system-ui, sans-serif !important;
}
body::before { display: none !important; }

.hero-title {
  -webkit-text-fill-color: unset !important;
  background: none !important;
  color: #059669 !important;
  font-weight: 900 !important;
}
.hero-sub { color: #9CA3AF !important; }

.section-title { color: #9CA3AF !important; }
.section-title::after { background: rgba(0,0,0,.08) !important; }

/* Glass cards → white cards */
.glass {
  background: white !important;
  border-color: rgba(0,0,0,.07) !important;
  box-shadow: 0 4px 20px rgba(0,0,0,.07) !important;
}

/* Parts */
.part-card {
  background: white !important;
  border-color: rgba(0,0,0,.08) !important;
  box-shadow: 0 2px 10px rgba(0,0,0,.06) !important;
}
.part-card.active, .part-card:hover {
  box-shadow: 0 6px 20px rgba(5,150,105,.15) !important;
  border-color: var(--c) !important;
}
.part-name { color: #1E1B4B !important; }
.part-short { color: #9CA3AF !important; }
.part-detail {
  background: #F9FAFB !important;
  border-color: rgba(0,0,0,.07) !important;
}
.detail-desc { color: #4B5563 !important; }
.spec-pill {
  background: #F3F4F6 !important;
  border-color: rgba(0,0,0,.08) !important;
  color: #4B5563 !important;
}
.detail-tip {
  background: rgba(5,150,105,.07) !important;
  border-color: rgba(5,150,105,.2) !important;
  color: #065F46 !important;
}

/* Calculators */
.calc-card {
  background: white !important;
  border-color: rgba(0,0,0,.07) !important;
  box-shadow: 0 2px 10px rgba(0,0,0,.06) !important;
}
.calc-title { color: #1E1B4B !important; }
.calc-sub { color: #9CA3AF !important; }
label { color: #6B7280 !important; }
input[type=number] {
  background: #F9FAFB !important;
  border-color: rgba(0,0,0,.1) !important;
  color: #1E1B4B !important;
}
input[type=number]:focus { border-color: #059669 !important; }
input[type=range] { accent-color: #059669 !important; }
.result-box {
  background: rgba(5,150,105,.07) !important;
  border-color: rgba(5,150,105,.2) !important;
}
.result-label { color: rgba(5,150,105,.8) !important; }
.result-val { color: #059669 !important; }
.result-sub { color: #9CA3AF !important; }

/* Challenges */
.challenge {
  background: white !important;
  border-color: rgba(0,0,0,.07) !important;
  box-shadow: 0 2px 10px rgba(0,0,0,.06) !important;
}
.challenge:hover { border-color: rgba(0,0,0,.14) !important; }
.ch-q { color: #1E1B4B !important; }
.hint-btn {
  background: #F3F4F6 !important;
  border-color: rgba(0,0,0,.08) !important;
  color: #6B7280 !important;
}
.hint-btn:hover { background: #E5E7EB !important; color: #1E1B4B !important; }
.hint-text {
  background: rgba(251,191,36,.08) !important;
  border-color: rgba(251,191,36,.3) !important;
  color: #92400E !important;
}
.answer-text {
  background: rgba(5,150,105,.07) !important;
  border-color: rgba(5,150,105,.25) !important;
  color: #065F46 !important;
}

/* Wiring */
.wire-tab {
  background: #F3F4F6 !important;
  border-color: rgba(0,0,0,.08) !important;
  color: #6B7280 !important;
}
.wire-tab.active {
  background: rgba(5,150,105,.12) !important;
  border-color: rgba(5,150,105,.4) !important;
  color: #059669 !important;
}
.wire-desc { color: #4B5563 !important; }
.pin {
  background: #F9FAFB !important;
  border-color: rgba(0,0,0,.07) !important;
}
.pin-name { color: #1E1B4B !important; }
.pin-desc { color: #9CA3AF !important; }

/* Notes */
.notes-area {
  background: #F9FAFB !important;
  border-color: rgba(0,0,0,.1) !important;
  color: #1E1B4B !important;
}
.notes-area:focus { border-color: rgba(5,150,105,.4) !important; }
.notes-area::placeholder { color: #9CA3AF !important; }
.notes-saved { color: #059669 !important; }
.notes-clear { color: #9CA3AF !important; }
.notes-clear:hover { color: #EF4444 !important; }

/* Nav */
.app-nav {
  background: white !important;
  border-top: 2px solid #ECFDF5 !important;
  box-shadow: 0 -4px 20px rgba(5,150,105,.06) !important;
  backdrop-filter: none !important;
}
.nav-btn { color: #9CA3AF !important; }
.nav-btn.active, .nav-btn:hover { color: #059669 !important; }
```

---

### Part 2 — UX: "First Mission" Guided Intro

**The problem:** Cassian (age 6) lands on a page full of components with no idea where to start. He needs a clear first instruction. After he's seen the page once, the intro stays out of the way.

**The solution:** A dismissable "Mission Card" at the very top, shown only on first visit (tracked in localStorage key `robotics_seen`). It has 3 tap-through steps that highlight each section in sequence, then disappears.

#### Add this HTML immediately after `<div class="page">` (before the HERO div):

```html
<!-- FIRST MISSION (shown once, dismissed after 3 steps) -->
<div id="missionCard" class="mission-card" style="display:none">
  <div class="mission-inner">
    <span class="mission-emoji" id="missionEmoji">🚀</span>
    <div class="mission-body">
      <div class="mission-step-label" id="missionLabel">MISSION 1 of 3</div>
      <div class="mission-text" id="missionText">Welcome to Robotics Lab! Tap any <strong>part card</strong> below to learn what it does. Start with the Servo! 👇</div>
    </div>
    <button class="mission-next" id="missionBtn" onclick="advanceMission()">Next →</button>
  </div>
  <div class="mission-dots">
    <span class="mdot active" id="md0"></span>
    <span class="mdot" id="md1"></span>
    <span class="mdot" id="md2"></span>
  </div>
</div>
```

#### Add these CSS rules inside the `<style>` block (before `</style>`):

```css
/* FIRST MISSION CARD */
.mission-card {
  background: linear-gradient(135deg, rgba(5,150,105,.1), rgba(99,102,241,.08));
  border: 2px solid rgba(5,150,105,.3);
  border-radius: 20px;
  padding: 18px 16px 12px;
  margin-bottom: 20px;
  animation: slideDown .4s cubic-bezier(.34,1.56,.64,1);
}
@keyframes slideDown {
  from { opacity:0; transform:translateY(-12px); }
  to   { opacity:1; transform:translateY(0); }
}
.mission-inner {
  display: flex;
  align-items: center;
  gap: 14px;
}
.mission-emoji {
  font-size: 36px;
  flex-shrink: 0;
  animation: bounce 1.5s ease-in-out infinite;
}
@keyframes bounce {
  0%,100% { transform:translateY(0); }
  50%      { transform:translateY(-5px); }
}
.mission-body { flex: 1; }
.mission-step-label {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #059669;
  margin-bottom: 4px;
}
.mission-text {
  font-size: 14px;
  font-weight: 700;
  color: #1E1B4B;
  line-height: 1.5;
}
.mission-next {
  flex-shrink: 0;
  background: linear-gradient(135deg, #059669, #10B981);
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 13px;
  font-weight: 900;
  padding: 10px 18px;
  cursor: pointer;
  font-family: 'Nunito', system-ui, sans-serif;
  white-space: nowrap;
  transition: transform .15s;
}
.mission-next:active { transform: scale(.95); }
.mission-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
}
.mdot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: rgba(5,150,105,.2);
  transition: background .2s;
}
.mdot.active { background: #059669; }

/* Pulse highlight for guided sections */
.section-highlight {
  animation: sectionPulse 1s ease-in-out 3;
}
@keyframes sectionPulse {
  0%,100% { box-shadow: none; }
  50%      { box-shadow: 0 0 0 4px rgba(5,150,105,.35); border-radius: 20px; }
}
```

#### Add this JS (inside the `<script>` block, before the closing `</script>`):

```javascript
/* ── FIRST MISSION GUIDE ── */
const MISSION_KEY = 'robotics_seen';
const MISSIONS = [
  {
    emoji: '🔄',
    label: 'MISSION 1 of 3',
    text: 'Tap any <strong>part card</strong> to learn what it does. Try the <strong>Servo Motor</strong> first! 👇',
    btnText: 'Got it! →',
    highlight: 'partsScroll'
  },
  {
    emoji: '🧮',
    label: 'MISSION 2 of 3',
    text: 'Drag the <strong>Servo Angle</strong> slider and watch the arm move! Try the Gear Ratio calculator too. ⚙️',
    btnText: 'Cool! →',
    highlight: 'calc-grid'
  },
  {
    emoji: '🏆',
    label: 'MISSION 3 of 3',
    text: 'Can you solve a <strong>Build Challenge</strong>? Tap "Hint" if you need help. You\'ve got this! 💪',
    btnText: 'Let\'s go! 🚀',
    highlight: 'challengesGrid'
  }
];

let missionStep = 0;

function initMission() {
  if (localStorage.getItem(MISSION_KEY)) return; // already seen
  const card = document.getElementById('missionCard');
  card.style.display = 'block';
  renderMissionStep();
}

function renderMissionStep() {
  const m = MISSIONS[missionStep];
  document.getElementById('missionEmoji').textContent = m.emoji;
  document.getElementById('missionLabel').textContent = m.label;
  document.getElementById('missionText').innerHTML = m.text;
  document.getElementById('missionBtn').textContent = m.btnText;
  // dots
  document.querySelectorAll('.mdot').forEach((d,i) => d.classList.toggle('active', i === missionStep));
}

function advanceMission() {
  // Highlight the relevant section
  const m = MISSIONS[missionStep];
  const el = document.getElementById(m.highlight) ||
             document.querySelector('.' + m.highlight);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('section-highlight');
    setTimeout(() => el.classList.remove('section-highlight'), 3000);
  }

  missionStep++;
  if (missionStep >= MISSIONS.length) {
    // Done — dismiss forever
    localStorage.setItem(MISSION_KEY, '1');
    const card = document.getElementById('missionCard');
    card.style.transition = 'opacity .4s, transform .4s';
    card.style.opacity = '0';
    card.style.transform = 'translateY(-8px)';
    setTimeout(() => card.style.display = 'none', 400);
    return;
  }
  renderMissionStep();
}

// Call at init (after buildParts/buildChallenges/etc.)
initMission();
```

**Important:** Add `initMission();` call at the very end of the existing init line, so it reads:
```javascript
buildParts(); buildChallenges(); buildWiring(); updateServo(); updateGear(); loadNotes(); initMission();
```

---

### Part 3 — Bump service worker cache

In `sw.js`, change `cassian-v11` → `cassian-v12`. Also confirm `robotics.html` is in the ASSETS list — add it if missing.

---

### Part 4 — Fix nav + apple-touch-icon

The `<head>` in robotics.html is missing:
```html
<link rel="apple-touch-icon" href="/icon-192.png">
```
It's already there. But the bottom nav currently shows `world.html` in the 🌍 slot. **No change needed** — nav is correct for this page (it's not in the main 5-slot nav; that's fine).

---

### Completion check

- [ ] Light theme renders — bright green/white/purple gradient, no dark background
- [ ] Mission card appears on first load, disappears after 3 taps
- [ ] Mission card does NOT appear on second visit (localStorage flag set)
- [ ] Tapping "Next →" scrolls to the highlighted section and pulses it
- [ ] Parts scroll cards are white with green accent on tap
- [ ] Calculators, challenges, wiring all render on light background
- [ ] Nav bar is white with green active state
- [ ] sw.js cache bumped to cassian-v12

---

## Priority Order for Claude Code

1. **TC-09** (CLAUDE.md — do this first, gives Claude Code context for everything else)
2. **TC-01** (Chess game — most requested)
3. **TC-11** (Cassian Profile — unlocks adaptive difficulty everywhere)
4. **TC-02** (cosmo.html — critical AI tutor)
5. **TC-10** (focus.html — Focus & Flow Trainer)
6. **TC-07** (nav consistency — quick win)
7. **TC-06** (sw.js — quick win)
8. **TC-03** (intelligence layer — adds AI to everything)
9. **TC-04** (games adaptive difficulty — now uses TC-11 profile)
10. **TC-05** (Apple redesign)
11. **TC-08** (books.html)
12. **TC-12** (robotics.html — light theme + guided demo)
