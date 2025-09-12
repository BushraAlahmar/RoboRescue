import { LogOutIcon, Volume2, VolumeX } from "lucide-react";

interface LevelControlsProps {
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onShowConfirmDialog: () => void;
}

export function LevelControls({
  audioEnabled,
  onToggleAudio,
  onShowConfirmDialog,
}: LevelControlsProps) {
  return (
    <div className="absolute top-4 right-6 flex gap-2 z-50">
      <button
        onClick={onToggleAudio}
        className="bg-black/50 text-white px-3 py-2 rounded-lg shadow hover:bg-black/70 transition"
        title={audioEnabled ? "Mute Audio" : "Unmute Audio"}
      >
        {audioEnabled ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>
      <button
        onClick={onShowConfirmDialog}
        className="bg-black/50 text-white px-3 py-2 rounded-lg shadow hover:bg-black/70 transition"
        title="Exit Level"
      >
        <LogOutIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
