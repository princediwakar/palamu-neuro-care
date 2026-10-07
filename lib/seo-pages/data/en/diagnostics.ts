import { DiagnosticSeoPage } from "../../types";

import diagnosticPages1 from "./diagnostics-1.json";
import diagnosticPages2 from "./diagnostics-2.json";
import diagnosticPages3 from "./diagnostics-3.json";
import diagnosticPages4 from "./diagnostics-4.json";
import diagnosticPages5 from "./diagnostics-5.json";
import diagnosticPages6 from "./diagnostics-6.json";

export const diagnosticPages: DiagnosticSeoPage[] = [
  ...(diagnosticPages1 as DiagnosticSeoPage[]),
  ...(diagnosticPages2 as DiagnosticSeoPage[]),
  ...(diagnosticPages3 as DiagnosticSeoPage[]),
  ...(diagnosticPages4 as DiagnosticSeoPage[]),
  ...(diagnosticPages5 as DiagnosticSeoPage[]),
  ...(diagnosticPages6 as DiagnosticSeoPage[]),
];
