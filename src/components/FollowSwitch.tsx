import { TooltipHelp } from "./TooltipHelp";
import { CardDescription } from "./ui/card";
import { Switch } from "./ui/switch";

export default function FollowSwitch({
  askForFollow,
  setAskForFollow,
}: {
  askForFollow: boolean;
  setAskForFollow: (askForFollow: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={askForFollow}
        onCheckedChange={setAskForFollow}
        className="cursor-pointer "
      />
      <CardDescription className="font-semibold text-muted-foreground">
        <TooltipHelp title="Ask users to follow your account before receiving the DM. If enabled, the user will be asked to follow your account before receiving the DM. If disabled, the user will not be asked to follow your account before receiving the DM.">
          Require Follow Before Sending DM (Link)
        </TooltipHelp>
      </CardDescription>
    </div>
  );
}
