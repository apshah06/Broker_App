BROKER BOOK – UPDATE YOUR EXISTING GITHUB PAGES APP

Use the SAME repository and the SAME link as last time.
Your saved entries are tied to that link, so they stay safe.

1. Open your repository on github.com
2. Add file > Upload files
3. Drag in everything from this folder:
      index.html  manifest.json  sw.js  icons/  screenshots/
   Replace the old files when asked. Then "Commit changes".
4. Add file > Create new file > name it:  .nojekyll
   (leave it empty) > Commit changes.
   This lets GitHub serve the .well-known folder for Android.
5. Wait 1–2 minutes (Actions tab shows a green tick).
6. Open your link, then ⋯ menu. It should say "Version 30 Sep 2026 · 8".
   On the old app screen you'll see "Bring them in" to copy old data.

PLAY STORE APP
- The installed app loads your GitHub link, so normal updates
  appear by themselves. No new package needed.
- Only rebuild in PWABuilder if you want the new name/icon in the
  store. Then use the SAME package ID and your OLD signing key
  (signing.keystore + signing-key-info.txt from last time's zip),
  and raise the version number.
- Keep .well-known/assetlinks.json exactly as it is.

LATER UPDATES
   Upload the new index.html the same way.
   If you change other files, also change VERSION at the top of sw.js.
