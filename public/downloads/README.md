# Contact one-pagers

The contact form's sent state offers the UNCHAIN deck as a download in either language.
These two files are what `success.downloads` in `src/components/contact/content.ts`
points at, and the names must match byte for byte:

- English — `New_UNCHAIN_Company_Deck_EN (2).pdf`
- Japanese — `Copy of NEURON_向けご提案資料_統合版.pptx.pdf`

The names are stored unescaped in `content.ts` and percent-encoded when the href is
built, so the spaces, parentheses, double extension and Japanese characters need no
renaming on disk.

Careful when replacing them: `vercel.json` rewrites `/(.*)` to `/index.html`, so a
missing or renamed PDF does not 404 — it silently serves the SPA shell, and the browser
saves a 1 KB `.htm` file under the PDF's name. If a download comes back tiny, the file
is not here under the name the code expects.
