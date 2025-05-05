import { Role } from "@prisma/client";
import { UserCircle2 } from "lucide-react";
import ConfirmDisconnect from "../alerts/ConfirmDisconnect";

interface AccountCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  id: number;
  role: Role,
  onRemove: (editorId: number) => void;
}

export default function AccountCard({
  name,
  email,
  avatarUrl,
  id,
  role,
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

      <ConfirmDisconnect role={role} onRemove={onRemove} id={id} />
    </div>
  );
}

