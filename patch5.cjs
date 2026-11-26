const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');

const importsToLazy = [
  "import { EditCaseModal } from \"./modals/EditCaseModal\";",
  "import { ClientModal } from \"./modals/ClientModal\";",
  "import { NewsModal } from \"./modals/NewsModal\";",
  "import { PaymentModal } from \"./modals/PaymentModal\";",
  "import { ReceiptModal } from \"./modals/ReceiptModal\";",
  "import { CalendarHearingModal } from \"./modals/CalendarHearingModal\";",
  "import { GoogleSheetsManager } from \"./GoogleSheetsManager\";",
  "import { CaseNotesAndAttachments } from \"./CaseNotesAndAttachments\";",
  "import { HearingPdfManagerTab } from \"./HearingPdfManagerTab\";"
];

const lazyImports = `const EditCaseModal = React.lazy(() => import('./modals/EditCaseModal').then(module => ({ default: module.EditCaseModal })));
const ClientModal = React.lazy(() => import('./modals/ClientModal').then(module => ({ default: module.ClientModal })));
const NewsModal = React.lazy(() => import('./modals/NewsModal').then(module => ({ default: module.NewsModal })));
const PaymentModal = React.lazy(() => import('./modals/PaymentModal').then(module => ({ default: module.PaymentModal })));
const ReceiptModal = React.lazy(() => import('./modals/ReceiptModal').then(module => ({ default: module.ReceiptModal })));
const CalendarHearingModal = React.lazy(() => import('./modals/CalendarHearingModal').then(module => ({ default: module.CalendarHearingModal })));
const GoogleSheetsManager = React.lazy(() => import('./GoogleSheetsManager').then(module => ({ default: module.GoogleSheetsManager })));
const CaseNotesAndAttachments = React.lazy(() => import('./CaseNotesAndAttachments').then(module => ({ default: module.CaseNotesAndAttachments })));
const HearingPdfManagerTab = React.lazy(() => import('./HearingPdfManagerTab').then(module => ({ default: module.HearingPdfManagerTab })));
`;

for (const imp of importsToLazy) {
  code = code.replace(imp, "");
}

code = code.replace("import { motion, AnimatePresence } from \"motion/react\";", "import { motion, AnimatePresence } from \"motion/react\";\n" + lazyImports);

fs.writeFileSync('src/components/admin/AdminDashboard.tsx', code);
