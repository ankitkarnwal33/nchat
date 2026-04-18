"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Separator } from "./ui/separator";
import { HeartIcon } from "lucide-react";

export default function IphoneComment({
  username,
  postImage,
  commentMessage = "❤️❤️❤️❤️",
  commentKeyword,
}: {
  username: string;
  postImage: string;
  commentMessage: string;
  commentKeyword: string;
}) {
  return (
    <div className="relative flex h-full w-full">
      <Image
        src={postImage}
        alt={username}
        width={1000}
        height={1000}
        className="w-full object-cover aspect-square"
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: "easeIn", delay: 0.4 }}
        className="absolute bottom-1 left-0 w-full h-2/3 bg-neutral-700 rounded-t-4xl"
      >
        <div className="flex items-center justify-center mt-5">
          <p className="text-white text-[13px] font-sans font-black">
            Comments
          </p>
        </div>
        <Separator className="my-2 mt-4 bg-neutral-600/40" />
        <div className="px-4 flex justify-between">
          <div className="flex items-center justify-center gap-2">
            <Image
              src={"/Peoples/profile.png"}
              alt="avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="text-white text-[10px] font-sans font-bold">
                iam_instagram_user 1s
              </p>
              <p className="text-white text-[12px] font-medium">
                {commentKeyword}
              </p>
            </div>
          </div>
          <HeartIcon className=" size-4 font-sans font-bold text-gray-300" />
        </div>
      </motion.div>
      {/* Bottom Bar */}
      <div className="absolute bottom-97 left-1/2 -translate-x-1/2  h-[2px] w-7 bg-white rounded-4xl"></div>
    </div>
  );
}
