import { ACCENT, ACCENT_DIM, BORDER } from "../utils/styleUtil";

export default function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-semibold text-lg md:text-xl border"
        style={{
          background: ACCENT_DIM,
          borderColor: BORDER,
          color: ACCENT,
        }}
      >
        {initials || "?"}
      </div>
    </div>
  );
}
