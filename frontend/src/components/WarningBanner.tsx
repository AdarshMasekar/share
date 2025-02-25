import React from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WarningBannerProps {
  message?: string;
}

const WarningBanner = ({
  message = "WARNING: This is an unsecured file sharing service. Do not upload sensitive data.",
}: WarningBannerProps) => {
  return (
    <div className="w-full bg-background">
      <Alert
        variant="destructive"
        className="rounded-none border-x-0 border-t-0 border-b"
      >
        <AlertTriangle className="h-5 w-5" />
        <AlertDescription className="font-semibold">{message}</AlertDescription>
      </Alert>
    </div>
  );
};

export default WarningBanner;
