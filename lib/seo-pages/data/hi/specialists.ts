import { SpecialistSeoPage } from "../../types";

import specialistPages1 from "./specialists-1.json";
import specialistPages2 from "./specialists-2.json";
import specialistPages3 from "./specialists-3.json";
import specialistPages4 from "./specialists-4.json";
import specialistPages5 from "./specialists-5.json";
import specialistPages6 from "./specialists-6.json";
import specialistPages7 from "./specialists-7.json";
import specialistPages8 from "./specialists-8.json";

export const specialistPages: SpecialistSeoPage[] = [
  ...(specialistPages1 as SpecialistSeoPage[]),
  ...(specialistPages2 as SpecialistSeoPage[]),
  ...(specialistPages3 as SpecialistSeoPage[]),
  ...(specialistPages4 as SpecialistSeoPage[]),
  ...(specialistPages5 as SpecialistSeoPage[]),
  ...(specialistPages6 as SpecialistSeoPage[]),
  ...(specialistPages7 as SpecialistSeoPage[]),
  ...(specialistPages8 as SpecialistSeoPage[]),
];
