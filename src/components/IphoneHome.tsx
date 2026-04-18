import { HeartIcon } from "lucide-react";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";

import { FaBookmark, FaComment, FaShare } from "react-icons/fa";
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
          <p className="text-xs font-sans font-semibold">@{username}</p>
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
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-1">
              <HeartIcon className="size-5 font-sans  " />
            </div>
            <div className="flex items-center justify-center">
              <FaComment className="size-5 font-sans font-bold" />
            </div>
            <div className="flex items-center justify-center">
              <FaShare className="size-5 font-sans font-bold" />
            </div>
          </div>
          <div>
            <FaBookmark className="size-5 font-sans font-bold" />
          </div>
        </div>
        <div className="flex items-start">
          <p className="text-[13px] font-sans text-left pl-3 line-clamp-5">
            {username} {caption}
          </p>
        </div>
      </div>
    </div>
  );
}
