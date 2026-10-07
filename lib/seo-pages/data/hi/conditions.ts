import { ConditionSeoPage } from "../../types";

import conditionPages1 from "./conditions-1.json";
import conditionPages2 from "./conditions-2.json";
import conditionPages3 from "./conditions-3.json";
import conditionPages4 from "./conditions-4.json";
import conditionPages5 from "./conditions-5.json";
import conditionPages6 from "./conditions-6.json";
import conditionPages7 from "./conditions-7.json";
import conditionPages8 from "./conditions-8.json";
import conditionPages9 from "./conditions-9.json";
import conditionPages10 from "./conditions-10.json";

export const conditionPages: ConditionSeoPage[] = [
  ...(conditionPages1 as ConditionSeoPage[]),
  ...(conditionPages2 as ConditionSeoPage[]),
  ...(conditionPages3 as ConditionSeoPage[]),
  ...(conditionPages4 as ConditionSeoPage[]),
  ...(conditionPages5 as ConditionSeoPage[]),
  ...(conditionPages6 as ConditionSeoPage[]),
  ...(conditionPages7 as ConditionSeoPage[]),
  ...(conditionPages8 as ConditionSeoPage[]),
  ...(conditionPages9 as ConditionSeoPage[]),
  ...(conditionPages10 as ConditionSeoPage[])
];
