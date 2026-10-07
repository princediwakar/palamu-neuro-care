import { Stethoscope } from "lucide-react";
import BookAppointmentBtn from "@/components/BookAppointmentBtn";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">
            Oops! The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex justify-center">
          <Stethoscope className="w-24 h-24 text-primary" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <BookAppointmentBtn buttonText="Book a visit today" />
        </div>
      </div>
    </div>
  );
}
