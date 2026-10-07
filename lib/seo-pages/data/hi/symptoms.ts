import { SymptomSeoPage } from "../../types";

import symptomPages1 from "./symptoms-1.json";
import symptomPages2 from "./symptoms-2.json";
import symptomPages3 from "./symptoms-3.json";
import symptomPages4 from "./symptoms-4.json";
import symptomPages5 from "./symptoms-5.json";
import symptomPages6 from "./symptoms-6.json";

export const symptomPages: SymptomSeoPage[] = [
  ...(symptomPages1 as SymptomSeoPage[]),
  ...(symptomPages2 as SymptomSeoPage[]),
  ...(symptomPages3 as SymptomSeoPage[]),
  ...(symptomPages4 as SymptomSeoPage[]),
  ...(symptomPages5 as SymptomSeoPage[]),
  ...(symptomPages6 as SymptomSeoPage[])
];
