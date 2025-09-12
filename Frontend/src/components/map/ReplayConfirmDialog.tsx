"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HoverButton } from "@/components/ui/hover-button";
import { useTranslations } from "next-intl";

interface ReplayConfirmDialogProps {
  open: boolean;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onViewSection?: () => void;
}

export function ReplayConfirmDialog({
  open,
  isLoading,
  onCancel,
  onConfirm,
  onViewSection,
}: ReplayConfirmDialogProps) {
  const t = useTranslations("map.replay");

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-white">
            {t("title")}
          </DialogTitle>
        </DialogHeader>
        <div className="text-center text-gray-300 mb-6">{t("message")}</div>
        <div className=" gap-4 grid grid-cols-2 justify-center w-full">
          {onViewSection && (
            <HoverButton
              onClick={onViewSection}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!!isLoading}
            >
              {t("viewLevels")}
            </HoverButton>
          )}
          <HoverButton
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
            disabled={!!isLoading}
          >
            {isLoading ? t("replaying") : t("confirm")}
          </HoverButton>
          <HoverButton
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 w-full col-span-2"
            disabled={!!isLoading}
          >
            {t("cancel")}
          </HoverButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReplayConfirmDialog;
