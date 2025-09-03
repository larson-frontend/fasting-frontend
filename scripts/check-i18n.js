#!/usr/bin/env node
/*
 Checks i18n keys used in src against locales/en.json and locales/de.json
 Reports:
  - keys used but missing in EN or DE
  - keys present in one locale but not the other
*/
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const SRC_DIR = path.join(root, 'src');
const EN_PATH = path.join(root, 'src/locales/en.json');
const DE_PATH = path.join(root, 'src/locales/de.json');

function flatten(obj, prefix = '', out = {}) {
  Object.entries(obj).forEach(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v, key, out);
    } else {
      out[key] = true;
    }
  });
  return out;
}

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function listFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...listFiles(p));
    else if (/\.(vue|ts|js|tsx|jsx)$/.test(e.name)) files.push(p);
  }
  return files;
}

function extractKeysFromFile(content) {
  const keys = new Set();
  // matches $t('key.path') or $t("key.path")
  const reTpl = /\$t\(\s*['"]([^'"\)]+)['"]\s*\)/g;
  // matches t('key.path') in script
  const reComp = /\bt\(\s*['"]([^'"\)]+)['"]\s*\)/g;
  for (const re of [reTpl, reComp]) {
    let m;
    while ((m = re.exec(content))) keys.add(m[1]);
  }
  return keys;
}

function main() {
  const en = flatten(readJSON(EN_PATH));
  const de = flatten(readJSON(DE_PATH));

  const used = new Set();
  for (const file of listFiles(SRC_DIR)) {
    const c = fs.readFileSync(file, 'utf8');
    for (const k of extractKeysFromFile(c)) used.add(k);
  }

  const enKeys = new Set(Object.keys(en));
  const deKeys = new Set(Object.keys(de));

  const missingInEn = [];
  const missingInDe = [];
  for (const k of used) {
    if (!enKeys.has(k)) missingInEn.push(k);
    if (!deKeys.has(k)) missingInDe.push(k);
  }

  const localeMismatchEnOnly = [...enKeys].filter(k => !deKeys.has(k));
  const localeMismatchDeOnly = [...deKeys].filter(k => !enKeys.has(k));

  const report = {
    usedCount: used.size,
    missingInEn: missingInEn.sort(),
    missingInDe: missingInDe.sort(),
    extraInEnNotInDe: localeMismatchEnOnly.sort(),
    extraInDeNotInEn: localeMismatchDeOnly.sort(),
  };

  console.log(JSON.stringify(report, null, 2));

  // Exit non-zero if there are missing keys
  if (report.missingInEn.length || report.missingInDe.length) process.exit(1);
}

main();
