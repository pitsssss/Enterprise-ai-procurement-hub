import * as fs from 'fs';
import * as path from 'path';

interface TranslationObject {
  [key: string]: string | TranslationObject;
}

function getDeepKeys(obj: TranslationObject, prefix = ''): Map<string, string> {
  const result = new Map<string, string>();
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nested = getDeepKeys(value as TranslationObject, fullPath);
      for (const [nKey, nVal] of nested.entries()) {
        result.set(nKey, nVal);
      }
    } else if (typeof value === 'string') {
      result.set(fullPath, value);
    }
  }
  return result;
}

function extractInterpolationVariables(str: string): string[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(str)) !== null) {
    matches.push(match[1].trim());
  }
  return matches.sort();
}

function verifyTranslations() {
  const enPath = path.resolve(process.cwd(), 'src/locales/en.json');
  const arPath = path.resolve(process.cwd(), 'src/locales/ar.json');

  if (!fs.existsSync(enPath)) {
    console.error(`Missing English locale file: ${enPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(arPath)) {
    console.error(`Missing Arabic locale file: ${arPath}`);
    process.exit(1);
  }

  const enRaw = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  const arRaw = JSON.parse(fs.readFileSync(arPath, 'utf-8'));

  const enKeys = getDeepKeys(enRaw);
  const arKeys = getDeepKeys(arRaw);

  console.log(`\n======================================================`);
  console.log(`  Synthetix Sourcing - Translation Integrity Verifier`);
  console.log(`======================================================`);
  console.log(`English (en) total translation units: ${enKeys.size}`);
  console.log(`Arabic (ar) total translation units:  ${arKeys.size}\n`);

  const missingInAr: string[] = [];
  const missingInEn: string[] = [];
  const paramMismatches: Array<{ key: string; enParams: string[]; arParams: string[] }> = [];

  // Check EN keys in AR
  for (const [key, enVal] of enKeys.entries()) {
    if (!arKeys.has(key)) {
      missingInAr.push(key);
    } else {
      const arVal = arKeys.get(key)!;
      const enParams = extractInterpolationVariables(enVal);
      const arParams = extractInterpolationVariables(arVal);
      if (enParams.join(',') !== arParams.join(',')) {
        paramMismatches.push({ key, enParams, arParams });
      }
    }
  }

  // Check AR keys in EN
  for (const key of arKeys.keys()) {
    if (!enKeys.has(key)) {
      missingInEn.push(key);
    }
  }

  let hasErrors = false;

  if (missingInAr.length > 0) {
    hasErrors = true;
    console.error(`❌ Keys present in English but MISSING in Arabic (${missingInAr.length}):`);
    missingInAr.slice(0, 20).forEach(k => console.error(`   - ${k}`));
    if (missingInAr.length > 20) console.error(`   ... and ${missingInAr.length - 20} more`);
  } else {
    console.log(`✅ 100% of English keys are present in Arabic.`);
  }

  if (missingInEn.length > 0) {
    hasErrors = true;
    console.error(`\n❌ Keys present in Arabic but MISSING in English (${missingInEn.length}):`);
    missingInEn.slice(0, 20).forEach(k => console.error(`   - ${k}`));
    if (missingInEn.length > 20) console.error(`   ... and ${missingInEn.length - 20} more`);
  } else {
    console.log(`✅ 100% of Arabic keys are present in English.`);
  }

  if (paramMismatches.length > 0) {
    hasErrors = true;
    console.error(`\n❌ Interpolation parameter mismatches (${paramMismatches.length}):`);
    paramMismatches.forEach(m => {
      console.error(`   - Key: ${m.key}`);
      console.error(`     EN params: [${m.enParams.join(', ')}]`);
      console.error(`     AR params: [${m.arParams.join(', ')}]`);
    });
  } else {
    console.log(`✅ All interpolation parameters (e.g. {{param}}) match perfectly.`);
  }

  console.log(`\n======================================================`);
  if (hasErrors) {
    console.error(`Translation integrity verification FAILED.`);
    process.exit(1);
  } else {
    console.log(`Translation integrity verification PASSED with 100% parity!`);
    console.log(`======================================================\n`);
  }
}

verifyTranslations();
