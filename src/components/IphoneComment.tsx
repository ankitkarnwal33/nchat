"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Separator } from "./ui/separator";
import { HeartIcon } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

export default function IphoneComment({
  username,
  postImage,
  commentMessage,
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
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-1 left-0 w-full h-2/3 bg-neutral-800 rounded-t-4xl"
      >
        <div className="flex items-center justify-center mt-8">
          <p className="text-white/80 text-[12px] font-sans font-semibold">
            Comments
          </p>
        </div>
        <Separator className="my-2 mt-4 bg-neutral-600/40" />
        <div className="px-4 flex justify-between">
          <div className="flex justify-center gap-2">
            <Image
              src={"/Peoples/profile.png"}
              alt="avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="text-gray-200 text-[10px] font-sans font-medium">
                i_am_john_doe{" "}
                <span className="text-gray-200/60 text-[10px] font-sans font-medium m-1">
                  1s
                </span>
              </p>
              <div>
                <p className="text-gray-300 my-1 text-[12px] font-medium">
                  {commentKeyword}
                </p>
                <div className="flex items-center gap-2 text-gray-200 text-[10px] font-sans font-medium">
                  <span className="text-zinc-400/80">Reply</span>
                  <span className=" text-zinc-400/80">Hide</span>
                </div>
              </div>
            </div>
          </div>
          <HeartIcon className=" size-4 font-sans font-medium text-gray-300/60" />
        </div>
        {commentMessage ? (
          <div className="px-4 flex mt-4 justify-between">
            <div className="flex justify-center gap-2 ml-5">
              <FaUserCircle className="size-6 font-sans font-bold text-gray-300/80" />
              <div className="flex flex-col">
                <p className="text-gray-200 text-[10px] font-sans font-medium relative z-10">
                  {username}{" "}
                  <span className="text-gray-200/60 text-[10px] font-sans font-medium m-1">
                    1s Author
                  </span>
                </p>

                <div>
                  <p className="text-gray-300 my-1 text-[12px] font-medium">
                    <span className=" text-blue-700/95 font-light ">
                      @i_am_john_doe{" "}
                    </span>
                    {commentMessage}
                  </p>
                  <div className="flex items-center gap-2 text-gray-200 text-[10px] font-sans font-medium">
                    <span className="text-zinc-400/80">Reply</span>
                    <span className=" text-zinc-400/80">See translation</span>
                  </div>
                </div>
              </div>
            </div>
            <HeartIcon className=" size-4 font-sans font-medium text-gray-300/60" />
          </div>
        ) : null}
      </motion.div>
      {/* Bottom Bar */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="absolute bottom-97 left-1/2 -translate-x-1/2  h-[2px] w-7 bg-white/60 rounded-4xl"
      ></motion.div>
    </div>
  );
}
