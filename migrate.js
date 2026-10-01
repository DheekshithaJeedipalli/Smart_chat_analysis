import fs from 'fs';
import path from 'path';

const moves = [
  { file: 'AiInsights.tsx', destDir: 'Ai insights' },
  { file: 'ActivityAnalytics.tsx', destDir: 'activity analysis' },
  { file: 'Dashboard.tsx', destDir: 'dashboard' },
  { file: 'PeopleParticipants.tsx', destDir: 'people and participants' },
  { file: 'RelationshipInsights.tsx', destDir: 'relationship insight' },
  { file: 'SmartSearch.tsx', destDir: 'smart search' },
];

for (const { file, destDir } of moves) {
  const srcPath = path.join('src', 'pages', file);
  const destPath = path.join(destDir, file);
  
  if (fs.existsSync(srcPath)) {
    console.log(`Moving ${srcPath} to ${destPath}`);
    let content = fs.readFileSync(srcPath, 'utf8');
    
    // Fix imports: anything starting with `../` becomes `../src/`
    content = content.replace(/from\s+['"]\.\.\/([^'"]+)['"]/g, "from '../src/$1'");
    
    fs.writeFileSync(destPath, content);
    fs.unlinkSync(srcPath);
  } else {
    console.log(`${srcPath} not found!`);
  }
}

// Update App.tsx
const appPath = path.join('src', 'App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Replace imports like: import { Dashboard } from './pages/Dashboard';
// with: import { Dashboard } from '../dashboard/Dashboard';
appContent = appContent.replace(/import\s+{\s*Dashboard\s*}\s+from\s+['"]\.\/pages\/Dashboard['"];/g, "import { Dashboard } from '../dashboard/Dashboard';");
appContent = appContent.replace(/import\s+{\s*RelationshipInsights\s*}\s+from\s+['"]\.\/pages\/RelationshipInsights['"];/g, "import { RelationshipInsights } from '../relationship insight/RelationshipInsights';");
appContent = appContent.replace(/import\s+{\s*ActivityAnalytics\s*}\s+from\s+['"]\.\/pages\/ActivityAnalytics['"];/g, "import { ActivityAnalytics } from '../activity analysis/ActivityAnalytics';");
appContent = appContent.replace(/import\s+{\s*PeopleParticipants\s*}\s+from\s+['"]\.\/pages\/PeopleParticipants['"];/g, "import { PeopleParticipants } from '../people and participants/PeopleParticipants';");
appContent = appContent.replace(/import\s+{\s*AiInsights\s*}\s+from\s+['"]\.\/pages\/AiInsights['"];/g, "import { AiInsights } from '../Ai insights/AiInsights';");
appContent = appContent.replace(/import\s+{\s*SmartSearch\s*}\s+from\s+['"]\.\/pages\/SmartSearch['"];/g, "import { SmartSearch } from '../smart search/SmartSearch';");

fs.writeFileSync(appPath, appContent);
console.log('Updated App.tsx');

// Update tailwind.config.js
const tailwindPath = 'tailwind.config.js';
let tailwindContent = fs.readFileSync(tailwindPath, 'utf8');
if (!tailwindContent.includes('"./*/**/*.tsx"')) {
  tailwindContent = tailwindContent.replace(
    /"\.\/src\/\*\*\/\*\.\{js,ts,jsx,tsx\}"/g,
    '"./src/**/*.{js,ts,jsx,tsx}",\n    "./Ai insights/**/*.{js,ts,jsx,tsx}",\n    "./activity analysis/**/*.{js,ts,jsx,tsx}",\n    "./dashboard/**/*.{js,ts,jsx,tsx}",\n    "./people and participants/**/*.{js,ts,jsx,tsx}",\n    "./relationship insight/**/*.{js,ts,jsx,tsx}",\n    "./smart search/**/*.{js,ts,jsx,tsx}"'
  );
  fs.writeFileSync(tailwindPath, tailwindContent);
  console.log('Updated tailwind.config.js');
}

// Update tsconfig.app.json
const tsconfigPath = 'tsconfig.app.json';
let tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
const tsconfig = JSON.parse(tsconfigContent);
if (!tsconfig.include.includes("Ai insights")) {
  tsconfig.include.push("Ai insights");
  tsconfig.include.push("activity analysis");
  tsconfig.include.push("dashboard");
  tsconfig.include.push("people and participants");
  tsconfig.include.push("relationship insight");
  tsconfig.include.push("smart search");
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  console.log('Updated tsconfig.app.json');
}

console.log('Migration complete.');
