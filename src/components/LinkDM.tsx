import { TooltipHelp } from "./TooltipHelp";
import { CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export default function LinkDM({
  link,
  setLink,
  linkText,
  setLinkText,
}: {
  link: string;
  setLink: (link: string) => void;
  linkText: string;
  setLinkText: (linkText: string) => void;
}) {
  return (
    <div className="space-y-2 mt-2">
      <Input
        type="url"
        className="w-full mt-2"
        placeholder="https://example.com"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        required={true}
      />
      <CardDescription className="font-semibold text-muted-foreground mt-3">
        <TooltipHelp title="The text that will be displayed as the link. Example: “Click here to get the offer”">
          Link Text (Optional)
        </TooltipHelp>
      </CardDescription>
      <Input
        type="text"
        className="w-full mt-2"
        placeholder="Ex: Click here to get the offer"
        value={linkText}
        onChange={(e) => setLinkText(e.target.value)}
        required={true}
      />
      <Separator className="my-4" />
    </div>
  );
}
