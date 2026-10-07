import { InfoSeoPage } from "../../types";

import infoPages1 from "./info-1.json";
import infoPages2 from "./info-2.json";
import infoPages3 from "./info-3.json";
import infoPages4 from "./info-4.json";
import infoPages5 from "./info-5.json";
import infoPages6 from "./info-6.json";
import infoPages7 from "./info-7.json";
import infoPages8 from "./info-8.json";

export const infoPages: InfoSeoPage[] = [
  ...(infoPages1 as InfoSeoPage[]),
  ...(infoPages2 as InfoSeoPage[]),
  ...(infoPages3 as InfoSeoPage[]),
  ...(infoPages4 as InfoSeoPage[]),
  ...(infoPages5 as InfoSeoPage[]),
  ...(infoPages6 as InfoSeoPage[]),
  ...(infoPages7 as InfoSeoPage[]),
  ...(infoPages8 as InfoSeoPage[]),
];
