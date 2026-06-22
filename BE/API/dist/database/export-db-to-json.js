"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path = __importStar(require("path"));
const fs_1 = require("fs");
function rowToSeedItem(row) {
    const out = {};
    const set = (k, v) => {
        out[k] = v ?? '';
    };
    set('media', row.media);
    set('index', row.index_value);
    set('image', row.image);
    set('thumb', row.thumb);
    set('name', row.name);
    set('description', row.description);
    set('company', row.company);
    set('productDescription', row.productDescription);
    set('technology', row.technology);
    return out;
}
async function exportTable(db, table, outFile, label) {
    const rows = db
        .prepare(`SELECT media, index_value, image, thumb, name, description, company, productDescription, technology
       FROM ${table}
       ORDER BY CAST(COALESCE(index_value, '0') AS INTEGER), id`)
        .all();
    const payload = rows.map(rowToSeedItem);
    const json = JSON.stringify(payload, null, 4) + '\n';
    await fs_1.promises.writeFile(outFile, json, 'utf-8');
    console.log(`Wrote ${label}: ${payload.length} rows -> ${outFile}`);
}
async function main() {
    const dbPath = path.join(process.cwd(), '..', 'DB', 'digitalflute.db');
    const outDir = path.resolve(process.cwd(), '..', '..', 'FE', 'js');
    const db = new better_sqlite3_1.default(dbPath, { readonly: true });
    await exportTable(db, 'information', path.join(outDir, 'info.json'), 'information');
    await exportTable(db, 'education', path.join(outDir, 'edu.json'), 'education');
    await exportTable(db, 'entertainment', path.join(outDir, 'fun.json'), 'entertainment');
    db.close();
    console.log('Default seed JSON files updated under FE/js/');
}
main().catch((err) => {
    console.error('Export failed:', err);
    process.exit(1);
});
//# sourceMappingURL=export-db-to-json.js.map