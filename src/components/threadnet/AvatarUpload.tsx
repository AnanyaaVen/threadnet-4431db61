import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AvatarUpload({
  userId,
  value,
  onChange,
  size = 112,
  initials = "You",
}: {
  userId: string | null;
  value: string | null;
  onChange: (url: string) => void;
  size?: number;
  initials?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    if (!userId) {
      toast.error("Sign in before uploading a photo.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be under 5MB.");
      return;
    }
    setBusy(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      toast.error(error.message);
      setBusy(false);
      return;
    }
    const { data, error: urlErr } = await supabase.storage
      .from("avatars")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    setBusy(false);
    if (urlErr || !data) {
      toast.error(urlErr?.message ?? "Could not load image URL.");
      return;
    }
    onChange(data.signedUrl);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative overflow-hidden rounded-full border-2 active:scale-95"
        style={{ width: size, height: size, borderColor: "var(--mint)" }}
        aria-label="Upload profile photo"
      >
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-bold"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--muted-foreground)",
              fontSize: size * 0.32,
            }}
          >
            {initials.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div
          className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-card"
          style={{ backgroundColor: "var(--mint)" }}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: "var(--primary-foreground)" }} />
          ) : (
            <Camera className="h-4 w-4" style={{ color: "var(--primary-foreground)" }} />
          )}
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
          e.target.value = "";
        }}
      />
      <span className="mt-2 text-xs text-muted-foreground">Tap to upload a photo</span>
    </div>
  );
}
