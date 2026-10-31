// Usage: node scripts/add-image-bg-path.cjs [path/to/cars.json]
const fs = require('node:fs');
const path = require('node:path');

const file = process.argv[2] || path.join(__dirname, '..', 'cars.json');
const source = fs.readFileSync(file, 'utf8');
const bom = source.startsWith('\uFEFF') ? '\uFEFF' : '';
const cars = JSON.parse(source.slice(bom.length));
if (!Array.isArray(cars) || cars.some(car => !car || typeof car !== 'object' || Array.isArray(car))) {
  throw new Error('Expected a JSON array of car objects.');
}

let added = 0;
for (const [index, car] of cars.entries()) {
  if (!Object.prototype.hasOwnProperty.call(car, 'imageBGPath')) {
    const entries = Object.entries(car);
    const imageIndex = entries.findIndex(([key]) => key === 'imagePath');
    // If imagePath is absent, append the new field instead.
    entries.splice(imageIndex === -1 ? entries.length : imageIndex + 1, 0, ['imageBGPath', '']);
    cars[index] = Object.fromEntries(entries);
    added++;
  }
}

if (added > 0) {
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  const indent = source.match(/\n([\t ]+)\S/)?.[1] || '  ';
  const trailingNewline = source.endsWith('\n') ? newline : '';
  fs.writeFileSync(file, bom + JSON.stringify(cars, null, indent).replace(/\n/g, newline) + trailingNewline, 'utf8');
}
console.log(`Added imageBGPath to ${added} of ${cars.length} objects.`);
