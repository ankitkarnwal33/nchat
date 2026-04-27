import { CardDescription } from "@/src/components/ui/card";
import { Switch } from "@/src/components/ui/switch";
import { TooltipHelp } from "./TooltipHelp";

export default function LinkSwitch({
  addLink,
  setAddLink,
}: {
  addLink: boolean;
  setAddLink: (addLink: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2 my-4">
      <Switch
        checked={addLink}
        onCheckedChange={setAddLink}
        className={"cursor-pointer"}
      />
      <CardDescription className="font-semibold text-muted-foreground">
        <TooltipHelp title="Add a link to your message. Which will be displayed as a button in the DM. Link will be sent in the DM to the user with private message.">
          Add Link To The Private Message
        </TooltipHelp>
      </CardDescription>
    </div>
  );
}
