# Saru for You 💗
A personal romantic surprise website crafted with care by **Rihan** for **Sarena**.

“A little world made with love, just for you.”

---

## Overview

This website is a custom, responsive romantic experience featuring:
1. **Welcome Screen**: An introduction dedicated to Sarena (Saru).
2. **Secret Word Gate**: A personal surprise lock screen (default word: `rose`).
3. **Our Story**: The main couple memory (Photo 1) and the dedicated "A Little World of You" gallery (Photos 2, 3, 4, 5).
4. **3×3 Sliding Photo Puzzle**: A solvable sliding puzzle using Photo 1 of Sarena and Rihan together, unlocking the final surprise upon completion.
5. **The Final Surprise**: The sealed envelope with an animated typewriter letter, five personal message cards, the keepsake gallery, birthday wish (20 November 2026), and song details for *Alfaaz* by Hamza Malik & Zain Zohaib.

All personal words, captions, secret words, and photo settings are configured in one central file:
`src/config.ts`

---

## Beginner's Step-by-Step Guide

### 1. How to Install Node.js
1. Visit the official website: [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version for your operating system (Windows, Mac, or Linux).
3. Run the installer and click "Next" through the setup steps.
4. Verify the installation by opening your Terminal (Mac/Linux) or Command Prompt / PowerShell (Windows) and typing:
   ```bash
   node -v
   npm -v
   ```
   Both should print version numbers (e.g. `v20.x` or `v22.x`).

---

### 2. How to Open the Project in VS Code
1. If you haven't installed VS Code, download it free from [https://code.visualstudio.com/](https://code.visualstudio.com/).
2. Open VS Code.
3. Click **File > Open Folder...** (or press `Ctrl+O` on Windows, `Cmd+O` on Mac).
4. Select this project folder and click **Open**.

---

### 3. How to Install Dependencies
1. Inside VS Code, open the integrated terminal: press `Ctrl + ~` (or go to menu **Terminal > New Terminal**).
2. Type the following command and press Enter:
   ```bash
   npm install
   ```
3. Wait a few moments while the project's dependencies are installed into `node_modules`.

---

### 4. How to Run the Development Server
In your terminal, run:
```bash
npm run dev
```
You will see output similar to:
```
  VITE v6.x.x  ready in 200 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

### 5. How to View the Website in a Browser
- Open your browser (Google Chrome, Safari, Edge, or Brave).
- In the address bar, type:
  `http://localhost:3000`
- Press Enter. You will see the **Saru for You** website live!

---

### 6. Where to Place All Six Photos
Place your 6 photos inside the `public/images/` folder of this project:

```
public/
  └── images/
        ├── photo1.jpg  <-- Sarena and Rihan Together (The ONLY couple photo)
        ├── photo2.jpg  <-- Sarena alone
        ├── photo3.jpg  <-- Sarena alone
        ├── photo4.jpg  <-- Sarena alone
        ├── photo5.jpg  <-- Sarena alone
        └── photo6.jpg  <-- Secret-code screen decorative background
```

- **Photo 1**: Used for the main Our Story feature card and the 3×3 sliding puzzle.
- **Photos 2, 3, 4, 5**: Displayed in the "A Little World of You" gallery dedicated to Sarena.
- **Photo 6**: Used as the soft background on the secret-word screen.

*Tip:* Keep the filenames exactly as `photo1.jpg`, `photo2.jpg`, etc. If your photos are PNGs (e.g., `photo1.png`), simply update the paths in `src/config.ts`.

---

### 7. How to Change Photo Captions
Open `src/config.ts` in VS Code and locate the `photos` object:
```typescript
couplePhoto: {
  src: "/images/photo1.jpg",
  title: "Sarena & Rihan",
  caption: "One picture, two people, and a memory worth keeping.", // <-- Edit here
  alt: "...",
},
sarenaGallery: [
  {
    id: 2,
    src: "/images/photo2.jpg",
    caption: "A little moment to remember.", // <-- Edit here
    alt: "...",
  },
  // ...
]
```
Save the file (`Ctrl+S` / `Cmd+S`). The changes will immediately appear on the website.

---

### 8. How to Change the 'Time Since We Met' Date
In `src/config.ts`, find the `timeSinceWeMet` section:
```typescript
timeSinceWeMet: {
  enabled: true,
  startDate: "2024-04-14", // <-- Edit your date here (YYYY-MM-DD)
  displayDate: "14 April 2024", // <-- Formatted date text
  title: "Time Since We Met",
  caption: "Every single day since our first conversation has become a memory worth keeping.",
},
```
The counter on the **Our Story** screen will automatically calculate the exact years, months, and days elapsed since that date!

---

### 9. How to Change the Secret Word
Open `src/config.ts` and look for:
```typescript
// 🔑 SECRET WORD: Edit this to whatever secret code you and Sarena share!
secretWord: "rose",
```
Change `"rose"` to any word or phrase (e.g., `"saru"`, `"forever"`, `"november"`). It is automatically case-insensitive, so `"Rose"`, `"ROSE"`, and `"rose"` will all unlock the door.

---

### 9. How to Edit the Personal Letter
In `src/config.ts`, find the `envelope` section:
```typescript
envelope: {
  coverTitle: "One Last Thing",
  letterHeading: "Dear Saru,",
  letterBody:
    "I wanted to create something a little different for you, something made with care rather than something ordinary.\n\nEvery photo holds a memory...",
  letterSignoff: "With love,\nRihan",
}
```
You can edit the text, paragraphs, or signoff whenever you wish.

---

### 10. How to Update the Five Message Cards
In `src/config.ts`, find the `personalMessages` array:
```typescript
personalMessages: [
  { id: 1, quote: "Some moments become special without even trying.", note: "01" },
  { id: 2, quote: "A little memory can bring back a big smile.", note: "02" },
  { id: 3, quote: "Some pictures say more than words can.", note: "03" },
  { id: 4, quote: "The smallest moments can become the most memorable.", note: "04" },
  { id: 5, quote: "This little surprise was made with care, just for you.", note: "05" },
]
```
Customize each quote to match personal moments, inside jokes, or heartfelt feelings.

---

### 11. How to Test the Puzzle
1. Navigate to the **Photo Puzzle** screen.
2. Tap or click any tile adjacent to the empty spot to slide it.
3. The move counter will increment with each move.
4. You can use the "Show Tile Numbers" toggle to see the tile positions (1 to 8).
5. You can click "Peek Original" to inspect the reference image.
6. When all 8 tiles are in order, celebratory rose & gold confetti will shower the screen, and the "Reveal the Surprise" button will appear!
7. *Fast testing shortcut:* Click "Solve Puzzle For Me" or append `?autostart=1` to the URL in your browser to immediately unlock all screens during development.

---

### 12. How to Build the Production Website
When you are ready to prepare the website for publishing, run:
```bash
npm run build
```
This compiles the TypeScript code and bundles optimized HTML, CSS, and JavaScript into the `dist/` directory.

---

### 13. How to Deploy the Website to a Hosting Service
You can host this website completely free using any modern static hosting platform:

#### Option A: Vercel (Recommended, easiest)
1. Push your project to a private or public GitHub repository.
2. Go to [https://vercel.com/](https://vercel.com/) and sign in with GitHub.
3. Click "Add New Project" and select your repository.
4. Click "Deploy". In under 1 minute, you will receive a live URL (e.g. `saru-for-you.vercel.app`).

#### Option B: Netlify
1. Go to [https://www.netlify.com/](https://www.netlify.com/) and sign up.
2. Drag and drop the `dist/` folder directly onto Netlify Drop, or connect your GitHub repository.
3. Netlify will build and deploy your site immediately.

#### Option C: Cloudflare Pages or GitHub Pages
1. Both provide fast, free static hosting with custom domain support.

---

### 14. Important Security & Privacy Notice: Shareable Links vs. Access Control
- **What this website is:** A romantic front-end surprise gift website.
- **The Secret Word Gate:** The secret word check happens inside the visitor's browser (client-side JavaScript). It is designed to create a fun, playful moment of discovery for Sarena.
- **Important distinction:** Because this is a static frontend website without a backend database, anyone who has the web link and knows how to open browser Developer Tools could inspect the files or images.
- If you want the website to remain personal:
  - Share the private link only directly with Sarena.
  - Do not post the link publicly on social media.
  - If true encrypted access control is ever required in the future, a server-side authentication system (such as Firebase Auth or password hashing) can be added.

---

*Made with love by Rihan for Sarena.* 💗
