import { CLINIC } from "@/lib/seo-pages/constants";
import { useTranslations } from "next-intl";
import { Clock, MapPin, MessagesSquare, Phone } from "lucide-react";

export default function ClinicInfoBar({ lang }: { lang: string }) {
  const t = useTranslations("clinic");
  const common = useTranslations("common");

  return (
    <section className="bg-card text-foreground py-10 px-4 border-t">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("name")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <MapPin className="size-6 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold mb-1">{t("address")}</h3>
            <p className="text-muted-foreground text-sm">{t("fullAddress")}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=Palamu Neuro & Eye Care+Clinic+Palamu&query_place_id=${CLINIC.placeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/80 text-sm hover:underline mt-1 inline-block"
            >
              {common("viewOnGoogleMaps")}
            </a>
          </div>
          <div className="p-4">
            <Phone className="size-6 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold mb-1">{t("phone")}</h3>
            <a href={`tel:${CLINIC.phone}`} className="text-primary/80 hover:underline">
              {CLINIC.phoneDisplay}
            </a>
          </div>
          <div className="p-4">
            <MessagesSquare className="size-6 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold mb-1">{t("whatsapp")}</h3>
            <a
              href={CLINIC.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/80 hover:underline"
            >
              {t("chatWithUs")}
            </a>
          </div>
          <div className="p-4">
            <Clock className="size-6 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold mb-1">{t("hours")}</h3>
            <p className="text-muted-foreground text-sm">{CLINIC.hours.full}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
