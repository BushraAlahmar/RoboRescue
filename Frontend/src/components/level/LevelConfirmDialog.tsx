import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HoverButton } from "@/components/ui/hover-button";
import { useLocale, useTranslations } from "next-intl";

interface LevelConfirmDialogProps {
  showConfirmDialog: boolean;
  onClose: () => void;
}

export function LevelConfirmDialog({
  showConfirmDialog,
  onClose,
}: LevelConfirmDialogProps) {
  const t = useTranslations("level.dialog");
  const locale = useLocale();
  return (
    <Dialog open={showConfirmDialog} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-white">
            {t("endLevel")}
          </DialogTitle>
        </DialogHeader>
        <div className="text-center text-gray-300 mb-6">
          {t("endLevelDescription")}
        </div>
        <div className="flex gap-4 justify-center">
          <HoverButton
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700"
          >
            {t("cancel")}
          </HoverButton>
          <Link href={`/${locale}/`}>
            <HoverButton className="bg-red-600 hover:bg-red-700">
              {t("endLevelButton")}
            </HoverButton>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
