const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('e:/Team ADAP(T)/Employa HRMS/Odoo-2026/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Background colors
  content = content.replace(/bg-(?:indigo|violet|purple)-(?:500|600|700)/g, 'bg-primary text-black');
  content = content.replace(/bg-(?:indigo|violet|purple)-50/g, 'bg-primary/10');
  content = content.replace(/bg-(?:indigo|violet|purple)-100/g, 'bg-primary/20');
  
  // Text colors
  content = content.replace(/text-(?:indigo|violet|purple)-(?:500|600|700)/g, 'text-primary');
  content = content.replace(/text-(?:indigo|violet|purple)-(?:800|900)/g, 'text-black');
  
  // Border colors
  content = content.replace(/border-(?:indigo|violet|purple)-(?:500|600|700)/g, 'border-primary');
  content = content.replace(/border-(?:indigo|violet|purple)-(?:100|200)/g, 'border-primary/20');

  // Gradients
  content = content.replace(/from-\[\#775e9f\]/g, 'from-primary/20');
  content = content.replace(/to-\[\#322454\]/g, 'to-primary/5');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log("Color replacement complete.");
