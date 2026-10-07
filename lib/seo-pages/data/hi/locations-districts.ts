import { LocationSeoPage } from "../../types";

import districtLocationPages1 from "./locations-districts-1.json";
import districtLocationPages2 from "./locations-districts-2.json";
import districtLocationPages3 from "./locations-districts-3.json";
import districtLocationPages4 from "./locations-districts-4.json";
import districtLocationPages5 from "./locations-districts-5.json";

export const districtLocationPages: LocationSeoPage[] = [
  ...(districtLocationPages1 as LocationSeoPage[]),
  ...(districtLocationPages2 as LocationSeoPage[]),
  ...(districtLocationPages3 as LocationSeoPage[]),
  ...(districtLocationPages4 as LocationSeoPage[]),
  ...(districtLocationPages5 as LocationSeoPage[]),
];
