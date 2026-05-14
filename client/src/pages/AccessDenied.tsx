import { useLocale } from "@/contexts/LocaleContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Lock } from "lucide-react";

export default function AccessDenied() {
  const { t } = useLocale();
  const { user } = useAuth();
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center max-w-md">
        <span className="inline-flex h-14 w-14 rounded-full bg-rose-50 text-rose-700 items-center justify-center mb-4 ring-1 ring-rose-200">
          <Lock size={24} />
        </span>
        <h1 className="text-xl font-semibold">{t("denied.title")}</h1>
        <p className="text-sm text-muted-foreground mt-2">{t("denied.body")}</p>
        {user && (
          <Link href={user.landing}>
            <Button className="mt-5" data-testid="button-back-home">
              {t("common.welcome")}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
