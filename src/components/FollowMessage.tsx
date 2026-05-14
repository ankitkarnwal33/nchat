import { TooltipHelp } from "./TooltipHelp";
import { CardDescription } from "./ui/card";
import { Textarea } from "./ui/textarea";

export default function FollowMessage({
  followMessage,
  setFollowMessage,
}: {
  followMessage: string;
  setFollowMessage: (followMessage: string) => void;
}) {
  return (
    <div>
      <CardDescription className="font-semibold text-muted-foreground my-2">
        <TooltipHelp title="The message that will be sent when the user is asked to follow your account before receiving the DM. Example: “Follow us on Instagram to get the offer 🎉”">
          Follow Message
        </TooltipHelp>
      </CardDescription>
      <Textarea
        className="w-full mt-2"
        placeholder="Follow us on Instagram to get the offer 🎉"
        value={followMessage}
        onChange={(e) => setFollowMessage(e.target.value)}
        required={true}
      />
    </div>
  );
}
