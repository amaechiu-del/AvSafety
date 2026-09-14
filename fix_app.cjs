const fs = require('fs');
const file = 'src/App.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  "import { INITIAL_PROGRAMME_SESSIONS } from './data/programmeData';",
  "import { INITIAL_PROGRAMME_SESSIONS } from './data/programmeData';\nimport { useAdminAuth, AdminProtectedView } from './components/AdminAuthWrapper';"
);

data = data.replace(
  "const [isAdminMode, setIsAdminMode] = useState(true);",
  "const [isAdminMode, setIsAdminMode] = useState(false);\n  const { isAdmin, signIn, signOutAdmin } = useAdminAuth();\n\n  useEffect(() => {\n    if (!isAdmin) setIsAdminMode(false);\n  }, [isAdmin]);"
);

data = data.replace(
  /\{\/\* Database\/CMS Admin Panel Modal \*\/\}\n\s*<AdminPanel\s+registrations=\{registrations\}\s+memos=\{memos\}\s+onResetDb=\{handleResetDb\}\s+onUpdateRegistrationStatus=\{handleUpdateRegistrationStatus\}\s+isOpen=\{isAdminOpen\}\s+onClose=\{\(\) => setIsAdminOpen\(false\)\}\s+\/>/,
  `{/* Database/CMS Admin Panel Modal */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-6xl h-[90vh] relative bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <AdminProtectedView>
              <AdminPanel 
                registrations={registrations} 
                memos={memos} 
                onResetDb={handleResetDb} 
                onUpdateRegistrationStatus={handleUpdateRegistrationStatus}
                isOpen={isAdminOpen} 
                onClose={() => setIsAdminOpen(false)} 
              />
            </AdminProtectedView>
          </div>
        </div>
      )}`
);

data = data.replace(
  /<button\n\s*onClick=\{\(\) => setIsAdminOpen\(true\)\}\n\s*className="mt-1.5 text-xs text-white font-bold underline hover:text-\[\#D4AF37\]"\n\s*>\n\s*OPEN DATABASE SYSTEM\n\s*<\/button>/g,
  `<div className="mt-2 flex items-center space-x-2">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="text-xs text-white font-bold underline hover:text-[#D4AF37]"
              >
                OPEN DATABASE SYSTEM
              </button>
              {isAdmin && (
                <button
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className="text-xs px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/50 rounded text-[#D4AF37] hover:bg-[#D4AF37]/40 transition-colors uppercase font-mono ml-2"
                >
                  {isAdminMode ? 'Disable Inline Edit' : 'Enable Inline Edit'}
                </button>
              )}
            </div>`
);

fs.writeFileSync(file, data);
console.log('done');
