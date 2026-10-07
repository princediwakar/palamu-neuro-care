import { LocationSeoPage } from "../../types";

import locationPages1 from "./locations-1.json";
import locationPages2 from "./locations-2.json";

export const locationPages: LocationSeoPage[] = [
  ...(locationPages1 as LocationSeoPage[]),
  ...(locationPages2 as LocationSeoPage[]),
];
