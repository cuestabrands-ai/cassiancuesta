# Deploying Cassian's App to cassiancuesta.com

This guide gets the app live at cassiancuesta.com in about 15 minutes.
No coding knowledge needed — just follow the steps.

---

## Step 1 — Put the files on GitHub (free)

1. Go to **github.com** and sign up for a free account (or log in)
2. Click the **+** button → **New repository**
3. Name it: `cassiancuesta` (all lowercase)
4. Set it to **Public**
5. Click **Create repository**
6. On the next screen, click **uploading an existing file**
7. Drag the entire **Cassian** folder contents into the upload area
   (Select all files inside the folder — index.html, all .html files, sw.js, manifest.json, the fonts/ folder, icon files, .js files)
8. Click **Commit changes**

---

## Step 2 — Turn on GitHub Pages (free hosting)

1. In your new repo, click **Settings** (top menu)
2. Click **Pages** (left sidebar)
3. Under "Branch", select **main** → folder: **/ (root)**
4. Click **Save**
5. GitHub will give you a URL like: `https://yourusername.github.io/cassiancuesta`
   — the app is already live here! Test it in Safari on the iPad first.

---

## Step 3 — Connect cassiancuesta.com to GitHub Pages

You need to own the domain cassiancuesta.com first. If you don't yet:
- Buy it at **namecheap.com** or **porkbun.com** (~$12/year)

Once you have it:

### On GitHub:
1. Go to your repo **Settings → Pages**
2. Under "Custom domain", type: `cassiancuesta.com`
3. Click **Save**
4. GitHub will create a file called `CNAME` in your repo automatically

### On your domain registrar (Namecheap, Porkbun, etc.):
Add these DNS records (look for "DNS" or "Advanced DNS" in your registrar):

| Type | Host | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | yourusername.github.io |

DNS changes take 10–30 minutes to fully kick in.

---

## Step 4 — Install as an app on Cassian's iPad

Once the site is live at cassiancuesta.com:

1. Open **Safari** on the iPad (must be Safari, not Chrome)
2. Go to `cassiancuesta.com`
3. Tap the **Share button** (box with arrow pointing up)
4. Scroll down and tap **Add to Home Screen**
5. Tap **Add**

The app now appears on Cassian's home screen with its icon — no browser bar, full screen, works offline.

---

## Updating the app later

Whenever you make changes to the files:
1. Go to **github.com** → your repo
2. Click the file you want to update → click the pencil ✏️ icon → paste new content → **Commit**
   — OR —
   Drag new files into the repo's upload area

Changes go live within 1–2 minutes.

---

## What works offline (no internet needed)

After the first visit, everything except COSMO AI works without internet:
- ✅ Numberblocks game
- ✅ Chess
- ✅ Math games
- ✅ Puzzles
- ✅ Bitcoin cards
- ✅ Jokes
- ✅ Books
- ✅ World Explorer
- ✅ Focus trainer
- 🌐 COSMO AI — needs internet (it talks to Claude)
