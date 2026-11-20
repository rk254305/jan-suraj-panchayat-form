/**
 * Simulated DOM Lifecycle & Interactive Testing
 */

const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🧪 RUNNING INTERACTIVE DOM LIFECYCLE TEST');
console.log('====================================================\n');

// Mock a lightweight browser DOM environment
class MockClassList {
  constructor() {
    this.classes = new Set();
  }
  add(c) { this.classes.add(c); }
  remove(c) { this.classes.delete(c); }
  contains(c) { return this.classes.has(c); }
  toString() { return Array.from(this.classes).join(' '); }
}

class MockElement {
  constructor(tag, id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.classList = new MockClassList();
    this.children = [];
    this.parentNode = null;
    this.attributes = {};
    this.value = '';
    this.disabled = false;
    this.checked = false;
    this.style = {};
    this.eventListeners = {};
  }

  appendChild(child) {
    this.children.push(child);
    child.parentNode = this;
    return child;
  }

  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k]; }
  removeAttribute(k) { delete this.attributes[k]; }

  set innerHTML(val) {
    this.children = [];
  }

  addEventListener(event, handler) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(handler);
  }

  dispatchEvent(event) {
    const list = this.eventListeners[event.type] || [];
    list.forEach(fn => fn(event));
  }

  closest(selector) {
    let curr = this;
    while (curr) {
      if (selector.startsWith('.') && curr.classList.contains(selector.slice(1))) return curr;
      if (selector.startsWith('#') && curr.id === selector.slice(1)) return curr;
      curr = curr.parentNode;
    }
    return null;
  }

  querySelectorAll(selector) {
    const results = [];
    const traverse = (node) => {
      node.children.forEach(c => {
        if (selector.startsWith('.') && c.classList.contains(selector.slice(1))) results.push(c);
        if (selector.startsWith('#') && c.id === selector.slice(1)) results.push(c);
        traverse(c);
      });
    };
    traverse(this);
    return results;
  }

  scrollIntoView() {}
}

// Read assets
const geoDataCode = fs.readFileSync(path.join(__dirname, 'geoData.js'), 'utf8');
const { BIHAR_GEO_DATA, BIHAR_DISTRICT_ASSEMBLIES } = eval(geoDataCode + '; ({BIHAR_GEO_DATA, BIHAR_DISTRICT_ASSEMBLIES})');

// Setup elements
const distSelect = new MockElement('select', 'district');
const assemblySelect = new MockElement('select', 'assembly');
const blockSelect = new MockElement('select', 'block');
const panchayatInput = new MockElement('input', 'panchayat');

const wrapDistrict = new MockElement('div', 'wrap_district');
wrapDistrict.classList.add('sub-field');
wrapDistrict.appendChild(distSelect);

const wrapAssembly = new MockElement('div', 'wrap_assembly');
wrapAssembly.classList.add('sub-field');
wrapAssembly.appendChild(assemblySelect);

const wrapBlock = new MockElement('div', 'wrap_block');
wrapBlock.classList.add('sub-field');
wrapBlock.appendChild(blockSelect);

const wrapPanchayat = new MockElement('div', 'wrap_panchayat');
wrapPanchayat.classList.add('sub-field');
wrapPanchayat.appendChild(panchayatInput);

const cardLocation = new MockElement('div', 'card_location');
cardLocation.classList.add('card');
cardLocation.appendChild(wrapDistrict);
cardLocation.appendChild(wrapAssembly);
cardLocation.appendChild(wrapBlock);
cardLocation.appendChild(wrapPanchayat);

// Test 1: Populate District options
Object.keys(BIHAR_GEO_DATA).sort().forEach(d => {
  const opt = new MockElement('option');
  opt.value = d;
  distSelect.appendChild(opt);
});

console.log(`District dropdown populated with ${distSelect.children.length} districts.`);
if (distSelect.children.length !== 38) throw new Error('Expected 38 districts');

// Test 2: Simulate cascade event listener
distSelect.addEventListener('change', () => {
  const selectedDist = distSelect.value;
  assemblySelect.innerHTML = '';
  blockSelect.innerHTML = '';

  if (!selectedDist) {
    assemblySelect.disabled = true;
    blockSelect.disabled = true;
    return;
  }

  assemblySelect.disabled = false;
  const assemblies = BIHAR_DISTRICT_ASSEMBLIES[selectedDist] || [];
  assemblies.forEach(ac => {
    const opt = new MockElement('option');
    opt.value = ac;
    assemblySelect.appendChild(opt);
  });

  blockSelect.disabled = false;
  const blocks = BIHAR_GEO_DATA[selectedDist] || [];
  blocks.forEach(blk => {
    const opt = new MockElement('option');
    opt.value = blk;
    blockSelect.appendChild(opt);
  });
});

// Select 'अरवल'
distSelect.value = 'अरवल';
distSelect.dispatchEvent({ type: 'change' });

console.log(`When 'अरवल' selected:`);
console.log(`- Assembly options: ${assemblySelect.children.length} (${assemblySelect.children.map(c=>c.value).join(', ')})`);
console.log(`- Block options: ${blockSelect.children.length} (${blockSelect.children.map(c=>c.value).join(', ')})`);

if (assemblySelect.children.length !== 2) throw new Error('Arwal should have exactly 2 assemblies');
if (blockSelect.children.length !== 5) throw new Error('Arwal should have exactly 5 blocks');

// Select 'पटना'
distSelect.value = 'पटना';
distSelect.dispatchEvent({ type: 'change' });

console.log(`\nWhen 'पटना' selected:`);
console.log(`- Assembly count: ${assemblySelect.children.length}`);
console.log(`- Block count: ${blockSelect.children.length}`);

if (assemblySelect.children.length !== 14) throw new Error('Patna should have exactly 14 assemblies');
if (blockSelect.children.length !== 23) throw new Error('Patna should have exactly 23 blocks');

// Select 'गया'
distSelect.value = 'गया';
distSelect.dispatchEvent({ type: 'change' });
console.log(`\nWhen 'गया' selected:`);
console.log(`- Assembly count: ${assemblySelect.children.length} (Expected 10)`);
console.log(`- Block count: ${blockSelect.children.length} (Expected 24)`);

if (assemblySelect.children.length !== 10) throw new Error('Gaya should have exactly 10 assemblies');
if (blockSelect.children.length !== 24) throw new Error('Gaya should have exactly 24 blocks');

console.log('\n====================================================');
console.log('✅ ALL DOM CASCADE LIFECYCLE TESTS COMPLETED SUCCESSFULLY!');
console.log('====================================================');
