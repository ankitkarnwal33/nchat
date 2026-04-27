import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import { VscFlag } from "react-icons/vsc";
import { BsTelephonePlus } from "react-icons/bs";
import { Button } from "./ui/button";
import { BiSolidCamera } from "react-icons/bi";
import { VscMicFilled } from "react-icons/vsc";
import { RxImage } from "react-icons/rx";
import { FaRegSmile } from "react-icons/fa";
import { LuCirclePlus } from "react-icons/lu";

export default function IphoneMessage({
  message,
  linkText,
  link = false,
}: {
  message: string;
  linkText: string;
  link: boolean;
}) {
  return (
    <div className="relative flex h-full w-full">
      {/* Top bar of the message */}
      <div className="absolute top-2 px-2  flex items-center justify-center gap-2">
        <ArrowLeftIcon className="size-5 font-sans font-bold dark:text-gray-300/80 text-black/80 justify-between" />
        <div className="flex items-center justify-center relative">
          <Image
            src={"/Peoples/profile.png"}
            alt="avatar"
            width={24}
            height={24}
            className="w-7 h-7 ml-4 rounded-full object-cover "
          />

          <div className="flex flex-col ml-2">
            <p className="text-[10px] font-sans font-semibold text-black/80 dark:text-white/80">
              John Doe
            </p>
            <p className="text-[10px] font-sans font-light dark:text-gray-300/80 text-black/70">
              Active today
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 mr-1">
          <BsTelephonePlus className="ml-10 size-5 font-sans font-bold dark:text-gray-300/80 text-black/80" />
          <VscFlag className="size-5 font-sans font-bold dark:text-gray-300/80 text-black/80" />
        </div>
      </div>
      <div className="flex mt-15 justify-center  mx-auto">
        <div className="flex flex-col items-center  justify-baseline gap-4">
          <Image
            src={"/Peoples/profile.png"}
            alt="avatar"
            width={500}
            height={500}
            className="w-20 h-20  rounded-full object-cover "
          />
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-sans font-semibold text-black/90 dark:text-white/80">
              John Doe
            </p>
            <p className="text-[13px] font-sans  dark:text-gray-300/80 text-black/80 ">
              i_am_john_doe
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="text-black/90 text-xs font-semibold rounded-xl dark:text-white/80"
          >
            View Profile
          </Button>
        </div>
      </div>

      {/* Bottom Bar of the message */}
      <div className="flex items-center justify-center gap-2 bottom-18 absolute w-full px-2 flex-col">
        {message ? (
          <div className="flex absolute bottom-20 right-2 gap-2 px-1.5 py-1  bg-gray-100/30 dark:bg-gray-300/10 rounded-2xl">
            <div className="text-sm font-sans  p-1 whitespace-pre-line max-w-[170px] min-w-[150px] max-h-48 overflow-y-auto text-black/90 dark:text-white/80">
              {message}
              {link ? (
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-black/90 text-xs font-semibold rounded-xl dark:text-white/80 mx-auto w-full mt-3"
                >
                  {linkText || "Click here"}
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-2 px-1.5 py-1 w-full bg-gray-500/10 rounded-full">
          <div className="flex items-center justify-center">
            <BiSolidCamera className="size-8 font-sans font-bold dark:text-white/80 text-white/96 bg-blue-600/80 rounded-full p-1" />
            <p className="text-sm font-sans text-muted-foreground pl-2">
              Message...
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <VscMicFilled className="size-5 font-sans font-bold dark:text-white/80 text-black/80 rounded-full " />
            <RxImage className="size-5 font-sans font-bold dark:text-white/80 text-black/80 " />
            <FaRegSmile className="size-5 font-sans font-bold dark:text-white/80 text-black/80 " />
            <LuCirclePlus className="size-5 font-sans font-bold dark:text-white/80 text-black/80 " />
          </div>
        </div>
      </div>
    </div>
  );
}
