const fs = require('fs');
const file = 'src/App.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  /{isAdminOpen && \(\n\s*<div className="fixed inset-0 z-\[100\] flex items-center justify-center bg-black\/60 backdrop-blur-sm p-4">\n\s*<div className="w-full max-w-6xl h-\[90vh\] relative bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl">\n\s*<AdminProtectedView>\n\s*<AdminPanel \n\s*registrations=\{registrations\} \n\s*memos=\{memos\} \n\s*onResetDb=\{handleResetDb\} \n\s*onUpdateRegistrationStatus=\{handleUpdateRegistrationStatus\}\n\s*isOpen=\{isAdminOpen\} \n\s*onClose=\{\(\) => setIsAdminOpen\(false\)\} \n\s*\/>\n\s*<\/AdminProtectedView>\n\s*<\/div>\n\s*<\/div>\n\s*\)}/,
  `{/* Database/CMS Admin Panel Modal */}
      <AdminPanel 
        registrations={registrations} 
        memos={memos} 
        onResetDb={handleResetDb} 
        onUpdateRegistrationStatus={handleUpdateRegistrationStatus}
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />`
);

fs.writeFileSync(file, data);
console.log('done revert app');
