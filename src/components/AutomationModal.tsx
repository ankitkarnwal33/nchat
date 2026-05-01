import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import UploadedMedia from "./UploadedMedia";

export function AutomationModal({
  canCreateAutomation,
}: {
  canCreateAutomation?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="default">
          <PlusIcon className="w-4 h-4" />
          Create Automation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Create New Automation</DialogTitle>
          <DialogDescription>
            Please select the media you want to create an automation for.
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[70vh] overflow-y-auto px-4 py-6">
          <UploadedMedia canCreateAutomation={canCreateAutomation} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
