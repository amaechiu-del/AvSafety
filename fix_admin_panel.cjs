const fs = require('fs');
const file = 'src/components/AdminPanel.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  "import StakeholderManager from './admin/StakeholderManager';",
  "import StakeholderManager from './admin/StakeholderManager';\nimport { AdminProtectedView } from './AdminAuthWrapper';"
);

data = data.replace(
  `  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white border-2 border-[#D4AF37] rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-fadeIn">`,
  `  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white border-2 border-[#D4AF37] rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-fadeIn">
        <AdminProtectedView>`
);

// We must also add the closing tag for AdminProtectedView
data = data.replace(
  `      </div>
    </div>
  );`,
  `        </AdminProtectedView>
      </div>
    </div>
  );`
);

fs.writeFileSync(file, data);
console.log('done');
