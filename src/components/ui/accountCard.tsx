import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";

interface AccountCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  id: number;
  onRemove: (editorId: number) => void;
}

export default function AccountCard({
  name,
  email,
  avatarUrl,
  id,
  onRemove,
}: AccountCardProps) {

  return (
    <div className="flex items-center justify-between w-full h-32 rounded-md bg-slate-800 px-6">
      {/* Avatar + Info */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 felx justify-center items-center border-2 rounded-full overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name}'s avatar`}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserCircle2 className="h-full w-full" />
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-white font-semibold text-lg">{name}</span>
          <span className="text-sm text-gray-300">{email}</span>
        </div>
      </div>

      <Button
        onClick={() => onRemove(id)}
        className="bg-red-600 px-5 py-2 rounded-full font-semibold transition hover:bg-red-700"
        variant="destructive"
      >
        Remove
      </Button>
    </div>
  );
}

