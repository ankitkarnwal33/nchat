import { HeartIcon, SendIcon } from "lucide-react";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { RiBookmarkLine } from "react-icons/ri";
import { TfiLoop } from "react-icons/tfi";

import { FaComment, FaUserCircle } from "react-icons/fa";
export default function IphoneHome({
  username,
  imageUrl,
  caption,
}: {
  username: string;
  imageUrl: string;
  caption: string;
}) {
  return (
    <div className="overflow-hidden">
      <div className="mt-2 py-2 flex justify-between flex-col ">
        <div className="flex items-center justify-between w-full px-2 py-2">
          <div className="flex items-center justify-center gap-2">
            <FaUserCircle className="size-5 font-sans font-bold dark:text-gray-300/80 text-black/80" />
            <p className="text-xs font-sans font-semibold">@{username}</p>
          </div>
          <BsThreeDots />
        </div>
        <Image
          src={imageUrl}
          alt="post"
          width={1000}
          height={1000}
          className="w-full h-full object-cover aspect-square"
        />
        <div className="flex items-center justify-between w-full px-2 py-2">
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center justify-center gap-1">
              <HeartIcon className="size-5 font-sans dark:text-gray-300/80 text-black/80" />
            </div>
            <div className="flex items-center justify-center">
              <FaComment className="size-5 font-sans font-bold dark:text-gray-300/80 text-black/80" />
            </div>
            <div className="flex items-center justify-center">
              <TfiLoop className="size-5 font-sans font-bold dark:text-gray-300/80 text-black/80" />
            </div>
            <div className="flex items-center justify-center">
              <SendIcon className="size-5 font-sans font-bold dark:text-gray-300/80 text-black/80 transform rotate-15" />
            </div>
          </div>
          <div>
            <RiBookmarkLine className="size-5  font-sans font-bold dark:text-gray-300/80 text-black/80 mt-2" />
          </div>
        </div>
        <div className="flex items-start">
          <p className="text-[12px] font-sans text-left pl-3 dark:text-white/80 text-black/80">
            <span className="font-semibold text-black/80 dark:text-white/80">
              @{username}
            </span>
            <span className="text-black/80 dark:text-gray-300/80">
              {" "}
              {caption} more
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
