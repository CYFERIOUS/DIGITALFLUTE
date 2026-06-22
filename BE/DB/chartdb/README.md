# ChartDB files for Digital Flute (SQLite)

## Important: two different JSON formats

ChartDB distinguishes:

1. **Database metadata** (Smart Query result) — `fk_info`, `pk_info`, `columns`, `tables`, … This is what `chartdb-sqlite-metadata.json` contains.
2. **Saved diagram** — ChartDB’s own export with `tables` as positioned boxes, `relationships`, `id`, `createdAt`, etc. That is what **Import diagram** expects.

If you use **Import diagram** and paste `chartdb-sqlite-metadata.json`, you will see: *“The diagram JSON is invalid.”* That is expected; use the flow below instead.

## Correct way to load this schema in ChartDB

1. Open [app.chartdb.io](https://app.chartdb.io).
2. Start a new project or open the editor.
3. Open **Import database** (wording may be “Import from database” / database icon in the sidebar — not “Import diagram”).
4. Choose **SQLite**.
5. Select the **Query** import method (the default that pastes the JSON output of the Smart Query — not DDL, not DBML).
6. Paste the **entire contents** of `chartdb-sqlite-metadata.json` into the text area and confirm import.

Alternatively, run the SQL in `sqlite-metadata-query.sql` against `digitalflute.db` with the `sqlite3` CLI and paste **that single-row JSON result** into the same Query field (see [ChartDB README](https://github.com/chartdb/chartdb#try-it-on-our-website)).

## Regenerate `chartdb-sqlite-metadata.json`

From `BE/DB` after `digitalflute.db` exists:

```bash
npm install
npm run chartdb:json
```

This runs `chartdb/generate-import.mjs`.
