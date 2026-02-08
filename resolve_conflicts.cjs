const fs = require('fs');
const path = require('path');

const filesToFix = [
   'vite.config.ts',
   'tailwind.config.ts',
   'src/utils/calculateSeverity.ts',
   'src/pages/ReportIssue.tsx',
   'src/pages/Services.tsx',
   'src/pages/ForgotPassword.tsx',
   'src/pages/Contact.tsx',
   'src/pages/AdminDashboard.tsx',
   'src/pages/About.tsx',
   'src/hooks/useUsers.ts',
   'src/hooks/useScrollAnimation.ts',
   'src/context/IssueContext.tsx',
   'src/components/layout/Footer.tsx',
   'README.md',
   'index.html'
];

const rootDir = process.cwd();

filesToFix.forEach(file => {
   const filePath = path.join(rootDir, file);
   if (fs.existsSync(filePath)) {
      try {
         let content = fs.readFileSync(filePath, 'utf8');

         // Regex to find conflict blocks and keep HEAD
         // Matches <<<<<<< HEAD ... ======= ... >>>>>>> ...
         // Capture group 1 is HEAD content
         const regex = /<<<<<<< HEAD\r?\n([\s\S]*?)\r?\n=======\r?\n[\s\S]*?>>>>>>> [a-f0-9]+/g;

         if (regex.test(content)) {
            const newContent = content.replace(regex, '$1');
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Fixed ${file}`);
         } else {
            console.log(`No conflicts found in ${file}`);
         }
      } catch (err) {
         console.error(`Error fixing ${file}:`, err.message);
      }
   } else {
      console.log(`File not found: ${file}`);
   }
});
