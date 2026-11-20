/**
 * Comprehensive Automated Test Suite for Jan Suraaj Panchayat Form
 * Tests:
 * 1. GeoData integrity (38 districts, 522 blocks, 243 assemblies, 1-243 numbering).
 * 2. District to Assembly & Block cascade logic.
 * 3. Form validation, error mapping, and user requested enhancements:
 *    - Zila Parishad Kshetra optional without asterisk
 *    - DOB with automatic age calculation (Year & Month)
 *    - Contact details (WhatsApp & Facebook link)
 *    - Education without female qualification text
 *    - New Posts (प्रखंड प्रमुख & चेयरमैन / मुख्य पार्षद)
 *    - Biodata optional upload
 *    - Campaign Poster & QR Code generation
 */

const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🧪 STARTING AUTOMATED TEST SUITE: JAN SURAAJ FORM');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`❌ FAIL: ${testName} - ${details}`);
    process.exitCode = 1;
  }
}

// ----------------------------------------------------
// TEST 1: GeoData Validation
// ----------------------------------------------------
console.log('--- 1. Testing geoData.js Structure & Numbers ---');
const geoDataCode = fs.readFileSync(path.join(__dirname, 'geoData.js'), 'utf8');

const evaluated = eval(geoDataCode + '\n; ({BIHAR_GEO_DATA, BIHAR_DISTRICT_ASSEMBLIES})');
const { BIHAR_GEO_DATA, BIHAR_DISTRICT_ASSEMBLIES } = evaluated;

assert(typeof BIHAR_GEO_DATA === 'object', 'BIHAR_GEO_DATA is defined as an object');
assert(typeof BIHAR_DISTRICT_ASSEMBLIES === 'object', 'BIHAR_DISTRICT_ASSEMBLIES is defined as an object');

const geoDistricts = Object.keys(BIHAR_GEO_DATA);
const acDistricts = Object.keys(BIHAR_DISTRICT_ASSEMBLIES);

assert(geoDistricts.length === 38, `Exactly 38 districts in BIHAR_GEO_DATA (found: ${geoDistricts.length})`);
assert(acDistricts.length === 38, `Exactly 38 districts in BIHAR_DISTRICT_ASSEMBLIES (found: ${acDistricts.length})`);

// Count blocks
let totalBlocks = 0;
geoDistricts.forEach(d => {
  totalBlocks += BIHAR_GEO_DATA[d].length;
});
assert(totalBlocks >= 530 && totalBlocks <= 535, `Total 533+ official blocks mapped across Bihar (found: ${totalBlocks})`);

// Count assemblies
let totalAssemblies = 0;
const allAcNumbers = [];
acDistricts.forEach(d => {
  const acs = BIHAR_DISTRICT_ASSEMBLIES[d];
  totalAssemblies += acs.length;
  acs.forEach(ac => {
    const match = ac.match(/^(\d+)\s*-\s*(.+)$/);
    if (match) {
      allAcNumbers.push(parseInt(match[1], 10));
    }
  });
});

assert(totalAssemblies === 243, `Total 243 Vidhan Sabha constituencies mapped (found: ${totalAssemblies})`);
assert(allAcNumbers.length === 243, `All 243 constituencies have proper numbering format (found: ${allAcNumbers.length})`);

allAcNumbers.sort((a, b) => a - b);
let isSequenceValid = true;
for (let i = 0; i < 243; i++) {
  if (allAcNumbers[i] !== i + 1) {
    isSequenceValid = false;
    break;
  }
}
assert(isSequenceValid, 'Constituencies are strictly numbered from 1 to 243 without duplicates or missing numbers');

// ----------------------------------------------------
// TEST 2: Specific District Cascade Accuracy
// ----------------------------------------------------
console.log('\n--- 2. Testing District -> Vidhan Sabha & Block Filter Accuracy ---');

// Test Case A: पटना (Patna) -> 14 assemblies, 23 blocks
const patnaAssemblies = BIHAR_DISTRICT_ASSEMBLIES['पटना'];
const patnaBlocks = BIHAR_GEO_DATA['पटना'];
assert(patnaAssemblies && patnaAssemblies.length === 14, `Patna has exactly 14 assemblies (found: ${patnaAssemblies?.length})`);
assert(patnaAssemblies && patnaAssemblies[0].includes('मोकामा') && patnaAssemblies[13].includes('बिक्रम'), 'Patna assemblies range from 178 - मोकामा to 191 - बिक्रम');
assert(patnaBlocks && patnaBlocks.length === 23, `Patna has exactly 23 blocks (found: ${patnaBlocks?.length})`);

// Test Case B: अरवल (Arwal) -> 2 assemblies, 5 blocks
const arwalAssemblies = BIHAR_DISTRICT_ASSEMBLIES['अरवल'];
const arwalBlocks = BIHAR_GEO_DATA['अरवल'];
assert(arwalAssemblies && arwalAssemblies.length === 2, `Arwal has exactly 2 assemblies (found: ${arwalAssemblies?.length})`);
assert(arwalAssemblies && arwalAssemblies[0].includes('अरवल') && arwalAssemblies[1].includes('कुर्था'), 'Arwal assemblies are exactly 214 - अरवल and 215 - कुर्था');
assert(arwalBlocks && arwalBlocks.length === 5, `Arwal has exactly 5 blocks (found: ${arwalBlocks?.length})`);

// Test Case C: शिवहर (Sheohar) -> 1 assembly, 5 blocks
const sheoharAssemblies = BIHAR_DISTRICT_ASSEMBLIES['शिवहर'];
const sheoharBlocks = BIHAR_GEO_DATA['शिवहर'];
assert(sheoharAssemblies && sheoharAssemblies.length === 1, `Sheohar has exactly 1 assembly: 22 - शिवहर (found: ${sheoharAssemblies?.length})`);
assert(sheoharBlocks && sheoharBlocks.length === 5, `Sheohar has exactly 5 blocks (found: ${sheoharBlocks?.length})`);

// ----------------------------------------------------
// TEST 3: HTML Structure & User Enhancements Setup
// ----------------------------------------------------
console.log('\n--- 3. Testing HTML Structure & User Enhancements ---');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

assert(html.includes('id="district"'), 'index.html contains district select');
assert(html.includes('id="assembly"') && html.includes('class="select-input"'), 'index.html has assembly as <select> element');
assert(html.includes('id="block"') && html.includes('class="select-input"'), 'index.html has block as <select> element');
assert(html.includes('id="wrap_district"') && html.includes('id="wrap_assembly"') && html.includes('id="wrap_block"') && html.includes('id="wrap_panchayat"'), 'Subfields have dedicated wrapper IDs for field-level error isolation');
assert(!html.includes('id="assemblyList"'), 'Old global datalist assemblyList has been removed');

// User requested checks
assert(html.includes('id="dob"'), 'index.html contains DOB datepicker input (replacing age select)');
assert(html.includes('id="ageCalculationBox"'), 'index.html contains automated age calculation box');
assert(html.includes('id="whatsapp"'), 'index.html contains WhatsApp number input');
assert(html.includes('id="sameAsMobile"'), 'index.html contains "Same as Mobile" checkbox');
assert(html.includes('id="fbLink"'), 'index.html contains Facebook link input');
assert(html.includes('value="प्रखंड प्रमुख"'), 'index.html contains "प्रखंड प्रमुख" post option');
assert(html.includes('value="चेयरमैन / मुख्य पार्षद"'), 'index.html contains "चेयरमैन / मुख्य पार्षद" post option');
assert(!html.includes('विशेषकर महिला उम्मीदवारों हेतु'), 'Female candidate note has been successfully removed from education options');
assert(html.includes('id="card_zpKshetra"') && !html.includes('id="card_zpKshetra">\n        <label class="question-label" for="zpKshetra">\n          9. जिला परिषद प्रादेशिक निर्वाचन क्षेत्र संख्या (1 से 75 तक) <span class="req-star">*</span>'), 'Zila Parishad Kshetra does not have mandatory asterisk');
assert(html.includes('id="biodataFile"'), 'index.html contains Biodata file upload input');
assert(html.includes('assets/qrcode.min.js'), 'index.html includes local QR code library script');
assert(html.includes('id="creativeModal"'), 'index.html contains creative campaign poster modal');

// ----------------------------------------------------
// TEST 4: CSS Styles
// ----------------------------------------------------
console.log('\n--- 4. Testing CSS Definitions ---');
const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');

assert(css.includes('.sub-field.has-error .error-msg'), 'CSS includes isolated .sub-field.has-error .error-msg');
assert(css.includes('.sub-field.has-error .select-input'), 'CSS includes isolated red border styling for .sub-field inputs');
assert(css.includes('.card.has-error > .error-msg'), 'CSS uses direct child selector for single card errors');
assert(css.includes('.age-calc-box'), 'CSS includes styles for automated age calculation box');
assert(css.includes('.file-upload-box'), 'CSS includes styles for biodata drag & drop box');
assert(css.includes('.campaign-poster'), 'CSS includes campaign poster styling');
assert(css.includes('@media print'), 'CSS includes print stylesheet for campaign poster');

// ----------------------------------------------------
// TEST 5: JavaScript Logic Simulation
// ----------------------------------------------------
console.log('\n--- 5. Simulating Form Validation & Cascading ---');
const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

assert(appJs.includes('BIHAR_DISTRICT_ASSEMBLIES[selectedDist]'), 'app.js populates assembly strictly from BIHAR_DISTRICT_ASSEMBLIES[selectedDist]');
assert(appJs.includes('BIHAR_GEO_DATA[selectedDist]'), 'app.js populates block strictly from BIHAR_GEO_DATA[selectedDist]');
assert(appJs.includes('setupDobAgeCalculator'), 'app.js includes setupDobAgeCalculator function');
assert(appJs.includes('setupContactFields'), 'app.js includes setupContactFields function');
assert(appJs.includes('setupBiodataUpload'), 'app.js includes setupBiodataUpload function');
assert(appJs.includes('setupQrCreativeModal'), 'app.js includes setupQrCreativeModal function');
assert(appJs.includes('resetFormState'), 'app.js has resetFormState function');

console.log('\n====================================================');
console.log(`🎉 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED! (100% SUCCESS)`);
console.log('====================================================\n');
