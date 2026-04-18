import { EditIcon, MoreVertical, TrashIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useSidebar } from "./ui/sidebar";

export function DropdownMenuIcons({
  automationId,
  setDeleteOpen,
}: {
  automationId: string;
  setDeleteOpen: (value: boolean) => void;
}) {
  const router = useRouter();
  const { setOpen } = useSidebar();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical className="w-4 h-4 text-muted-foreground cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            setOpen(false);
            router.push(`/automations/edit/${automationId}`);
          }}
          className="cursor-pointer"
        >
          <EditIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setDeleteOpen(true)}
          className="cursor-pointer"
        >
          <TrashIcon className="w-4 h-4 text-destructive" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
