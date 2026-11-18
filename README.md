# SD8 — Cyber Project Tree (GitHub Pages)

An interactive, glowing project tree branded with **your original SD8 gold-and-silver logo**. Each leaf can represent a project or other work. It uses only HTML/CSS/JavaScript and works without a server or build tools.

### Your confirmed starting leaves

- Blood Donor Finder
- Rai Real Estate

Other projects are intentionally excluded. These descriptions are editable. No private source code is bundled; GitHub repository links are blank by default.

## 1. Replace your current local website files (Windows)

1. Make a backup copy of your current folder, `C:\projects`.
2. Extract the new `sd8-cyber-tree.zip`.
3. Copy the extracted website files into `C:\projects`, choosing **Replace** for old `index.html`, `style.css`, `app.js`, `projects.js`, and `.nojekyll` when asked.
4. Keep the new image file `sd8-logo.png` in the same folder as `index.html`.
5. Double-click `index.html`. The logo should appear in the top navigation, hero display, and tree root.

You can also run it in VS Code using Live Server, but that's not required.

## 2. Add a project or any other work, without coding

1. On the website, click **MANAGE LEAVES** in the top navigation.
2. Click **+ NEW LEAF**.
3. Set its title, **Type** (Project or Work), category (Web, Design, AI, Research, etc.), status, year, description, skills/tags and optional public links.
4. Click **SAVE LEAF**. The new leaf instantly appears in the glowing tree and project directory.
5. Use the editor to select an existing leaf, edit it, or choose **REMOVE**. The tree automatically rearranges itself. It does **not** have the old 18-leaf display cap.

**IMPORTANT:** These editor changes are saved only in the local storage of the browser you used. Other devices and website visitors will not see the change until you publish it. Clearing browser data can remove unexported edits.

## 3. Publish changes made in the editor

1. Open **MANAGE LEAVES** and click **EXPORT projects.js**.
2. The browser downloads a file named `projects.js` (it may rename it to `projects (1).js` if one exists in Downloads).
3. Save the downloaded file in `C:\projects`, renaming it to **exactly** `projects.js` and replacing the previous copy.
4. If your website is live on GitHub Pages: go to the Pages repository and replace its old `projects.js` with this newly exported file, then commit it. Once GitHub Pages deploys that commit, everyone sees your new leaves.

> GitHub Pages hosts static files. No ordinary browser editor can silently update a GitHub repository without authentication. The editor is a safe local preview/export tool, **not** an online admin account. The public visitor can modify only their own browser preview, not the published files.

To discard your local preview changes and use the data currently in the published `projects.js` file, click **RESET LOCAL EDITS**.

## 4. Alternative: edit projects.js directly

Open `projects.js` in VS Code and edit the `projects` array. Each entry can have:

```js
{
  id: "my-design-work",       // Unique lowercase slug
  name: "My Design Work",
  type: "Work",                // "Project" or "Work"
  category: "Design",         // Any category name
  status: "Complete",         // Any text
  year: "2026",
  description: "A short summary.",
  tags: ["Figma", "UI/UX"],
  repoUrl: "",                  // Public repository URL, optional
  liveUrl: ""                   // Public site/portfolio URL, optional
}
```

Add or remove entries and refresh the page. **If you previously made browser-local edits, click `RESET LOCAL EDITS`** so the browser will read the updated file instead of its local copy.

## 5. Publish your website on GitHub Pages

Your connected GitHub username when this site was made: `learner091-newbie`.

1. Create a **public** repository named **`learner091-newbie.github.io`** on GitHub.
2. Upload files from this ZIP at the repository root, not inside an extra folder:
   - `index.html`
   - `style.css`
   - `app.js`
   - `projects.js`
   - `sd8-logo.png`
   - `.nojekyll` (optional)
3. Commit the files to `main`.
4. Go to **Settings → Pages → Source: Deploy from a branch → Branch: main → / (root) → Save**.
5. After GitHub Pages deploys, your site should be at **https://learner091-newbie.github.io/**.

To update the live site later, simply commit the updated files, typically only `projects.js`.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Notes on privacy

All content included in your public website files is viewable by visitors, including names and descriptions of projects. Share only links/data you want public. `Blood Donor Finder` currently has a private GitHub repository; its repo URL is intentionally blank. Never put secrets, credentials or private project data in a public GitHub Pages website.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Website structure, SD8 logo placement, in-page manager |
| `style.css` | Cyber aesthetic, glow, mobile styles, editor styles |
| `app.js` | Resizable tree layout, search, filters, project inspector, editor |
| `projects.js` | Initial published project/work list |
| `sd8-logo.png` | Your original SD8 logo, unchanged |
| `.nojekyll` | Optional GitHub Pages compatibility file |
