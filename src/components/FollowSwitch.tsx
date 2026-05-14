import Link from "next/link";
import { TooltipHelp } from "./TooltipHelp";
import { CardDescription } from "./ui/card";
import { Switch } from "./ui/switch";
import { ArrowRightIcon } from "lucide-react";

export default function FollowSwitch({
  askForFollow,
  setAskForFollow,
  can_use_follow_feature,
}: {
  askForFollow: boolean;
  setAskForFollow: (askForFollow: boolean) => void;
  can_use_follow_feature: boolean;
}) {
  return (
    <div className="flex gap-2">
      <Switch
        checked={askForFollow}
        onCheckedChange={setAskForFollow}
        className="cursor-pointer disabled:cursor-not-allowed "
        disabled={!can_use_follow_feature}
      />

      <CardDescription className="font-semibold text-muted-foreground">
        <TooltipHelp title="Ask users to follow your account before receiving the DM. If enabled, the user will be asked to follow your account before receiving the DM. If disabled, the user will not be asked to follow your account before receiving the DM.">
          Require Follow Before Sending DM (Link)
        </TooltipHelp>
        {!can_use_follow_feature && (
          <div className="flex justify-between items-center gap-10 text-[12px] mt-5 bg-amber-500/10 p-4 rounded-xl ">
            <span className=" text-muted-foreground font-normal ">
              Please upgrade to a <strong>Pro</strong> or{" "}
              <strong>Growth</strong> plan to use{" "}
              <strong>Follow Before Sending DM</strong> feature.
            </span>
            <Link
              href="/upgrade"
              className=" hover:text-primary-dark font-semibold flex items-center flex-row gap-2 min-w-fit bg-orange-500/80 text-white p-2 rounded-md"
            >
              Upgrade
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        )}
      </CardDescription>
    </div>
  );
}
