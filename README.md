# SD8 Cyber Energy Tree — Final Six-Branch Edition (v4)

This is the **six-branch** version of your interactive SD8 GitHub Pages portfolio. The same neon tree artwork and metallic SD8 logo are retained. Magenta electricity travels upward from the logo through six flowing paths.

## How it looks

- **Branch 01 (the top crown): Blood Donor Finder**
- **Branch 02 (upper right): Rai Real Estate**
- **Branches 03–06: purely glowing illustration until you publish real work there.** There are **no empty bush badges, placeholder cards, or "Coming soon" project names** on the public page.
- Each branch may contain multiple work/project entries; adding an entry creates a clickable bush label and project card automatically. Removing the last entry from a branch hides its label and card again, leaving the underlying bush artwork intact.
- The metallic SD8 logo is the power core at the tree's base. The energy effect travels to all **six** branch locations whether or not they contain a project.

## Windows: preview the update

1. Back up your existing folder `C:\projects\my-project-digital-tree`.
2. Extract this ZIP and copy all **eight** files into that folder. Replace files of the same name.
3. Open `index.html` in Edge or Chrome. If the previous design appears, press **Ctrl + Shift + R** to refresh.

The ZIP contains:

```text
index.html           Website
style.css            Visual appearance and animation
app.js               Six branches, electricity, project manager
projects.js          Published projects and work data
cyber-tree-art.webp  Cyber-bush tree image
sd8-logo.png         Your SD8 emblem
.nojekyll            GitHub Pages configuration marker
README.md            This guide
```

## Updating your live GitHub Pages site

Your site lives in this existing GitHub repository:

- Repository: https://github.com/learner091-newbie/projects
- Website: https://learner091-newbie.github.io/projects/

Keep the current repository and GitHub Pages configuration (`main` branch, `/(root)`). To publish this redesign, upload the eight extracted files to the **root** of `projects` (replace old versions), then **commit to main**. GitHub Pages should deploy the changed files. Refresh the website when deployment succeeds.

## Add or remove a project (no code changes needed)

1. Open your website and select **+ MANAGE TREE**.
2. Click **+ ADD A PROJECT / WORK** (or choose an existing entry to edit or delete).
3. Set **SECTOR / BUSH** to branch **01–06**. Branch 01 is at the top.
4. Fill in the name, type, status, description, optional GitHub/demo links, and save.
5. The new project label becomes visible immediately **in your browser**. Empty branches remain invisible on the page.
6. Click **↓ EXPORT projects.js FOR GITHUB** to download the updated file. Replace `projects.js` in your GitHub repository and commit to publish for everyone.

**Important:** GitHub Pages is a static host. Changes through the editor are only stored locally in the browser until you export and commit `projects.js`. Website visitors can preview their own local edits, but cannot modify your published GitHub content without repository permissions.

You can also directly edit `projects.js` and add another object to its `projects` array:

```js
{
  id: 'new-project',
  zone: 3,  // branch 1 to 6
  name: 'New Project',
  type: 'Project',
  category: 'Web',
  status: 'Building',
  year: '2026',
  description: 'Brief public description.',
  tags: ['HTML', 'CSS'],
  repoUrl: '',
  liveUrl: ''
}
```

## Notes about older edits

This version can load previous local project edits from version 3 in the same browser. Old branch 7 is moved to branch 6, and old branch 8 to branch 3. This migration is only relevant if you previously saved work in those branches. If the browser shows an old local version of your project list, open **Manage Tree → RESET LOCAL CHANGES** to reload the entries published in `projects.js`.

## Troubleshooting

- **Why do I see only two project labels?** That's intentional: only Blood Donor Finder and Rai Real Estate are currently registered. The other four branches are artwork only.
- **Why do I still see six energy routes?** The six powered branches always exist. Project badges appear only after you add actual work.
- **Why don't others see my new entry?** Export `projects.js` and commit the file to GitHub; browser-only saves are private.
- **Why does the old tree display?** Check that the correct files were uploaded, allow the GitHub Pages deployment to complete, and hard-refresh the browser.

No private project source code is bundled in this public portfolio. All portfolio text can be edited using the website editor.
