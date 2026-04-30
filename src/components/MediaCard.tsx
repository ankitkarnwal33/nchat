import { InstagramMedia } from "@/types/types";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import Image from "next/image";
import { CalendarIcon, ExternalLinkIcon, PlusIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { useSidebar } from "./ui/sidebar";

export default function MediaCard({ media }: { media: InstagramMedia }) {
  const { setOpen } = useSidebar();
  const imageUrl =
    media.media_type === "VIDEO" ? media.thumbnail_url : media.media_url;

  const encodedImageUrl = encodeURIComponent(imageUrl);

  const caption = media.caption?.replaceAll(/<[^>]*>?/g, "") || "No caption";
  const mediaId = media.id;
  const username = media.username;
  return (
    <Card className="hover:scale-[1.02] transition-all duration-300">
      <CardHeader>
        <div className="aspect-square w-full overflow-hidden rounded-lg relative">
          <Image
            src={
              media.media_type === "VIDEO"
                ? media.thumbnail_url
                : media.media_url
            }
            alt={media.caption || "No caption"}
            width={1000}
            height={1000}
            className="w-full h-full object-cover relative"
            loading="eager"
          />
          <Badge
            variant="secondary"
            className="absolute bottom-2 left-2 text-xs"
          >
            {media.media_type === "VIDEO" ? "Reel" : "Post"}
          </Badge>
          <Badge
            variant="secondary"
            className="absolute bottom-2 right-2 text-xs"
          >
            <Link
              href={media.permalink}
              target="_blank"
              className="flex items-center gap-1"
            >
              <ExternalLinkIcon className="w-3 h-3 " />
              View
            </Link>
          </Badge>
        </div>
        <CardTitle className="text-sm font-semibold  line-clamp-2 mt-4">
          {media.caption?.replaceAll(/<[^>]*>?/g, "") || "No caption"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3 h-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground capitalize">
              {new Date(media.timestamp).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div></div>
        </div>
        <div className="flex items-center gap-2 ">
          <Link
            href={`/automations/new_automation?mediaId=${mediaId}&username=${username}&imageUrl=${encodedImageUrl}&caption=${caption}`}
            onClick={() => {
              setOpen(false);
            }}
            className="transition-colors w-full py-2 text-sm bg-primary/80 rounded-md shadow-sm hover:shadow-md font-medium text-center flex items-center justify-center "
          >
            <PlusIcon className="w-4 h-4" />
            Create Automation
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
