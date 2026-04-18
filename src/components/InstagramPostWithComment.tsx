"use client";

import Image from "next/image";
import { useState } from "react";

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "#ed4956" : "none"}
    stroke={filled ? "#ed4956" : "currentColor"}
    strokeWidth={2}
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

const CommentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
    />
  </svg>
);

const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
    />
  </svg>
);

const BookmarkIcon = ({ saved }: { saved: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={saved ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={2}
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
    />
  </svg>
);

const DotsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
      clipRule="evenodd"
    />
  </svg>
);

const SmileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-6 h-6 text-[#737373]"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
    />
  </svg>
);

export default function InstagramPost({
  imageUrl,
  caption,
  username,
  profilePicture,
  comment,
  timestamp,
}: {
  imageUrl: string;
  caption: string;
  username: string;
  profilePicture: string;
  comment: string;
  timestamp: string;
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentLiked, setCommentLiked] = useState(false);
  const [replyLiked, setReplyLiked] = useState(false);
  const [showReply, setShowReply] = useState(true);
  const [likeCount, setLikeCount] = useState(2847);
  const [commentInput, setCommentInput] = useState("");

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fafafa]">
      <div className="w-[470px] bg-white border border-[#dbdbdb] rounded-sm font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Avatar with gradient ring */}
            <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#fd5949] via-[#d6249f] to-[#285AEB]">
              <div className="p-[2px] bg-white rounded-full">
                <Image
                  src={profilePicture}
                  alt={username}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-[#262626] leading-[18px]">
                {username}
              </span>
              <span className="text-[12px] text-[#737373] leading-[14px]">
                {caption}
              </span>
            </div>
          </div>
          <button className="text-[#262626] hover:opacity-50 transition-opacity">
            <DotsIcon />
          </button>
        </div>

        {/* Post Image */}
        <div className="w-full aspect-square bg-[#efefef] overflow-hidden">
          <Image
            src={imageUrl}
            alt={caption}
            width={470}
            height={470}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Action Buttons */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className="hover:opacity-50 transition-opacity active:scale-110 transform"
              >
                <HeartIcon filled={liked} />
              </button>
              <button className="hover:opacity-50 transition-opacity">
                <CommentIcon />
              </button>
              <button className="hover:opacity-50 transition-opacity">
                <ShareIcon />
              </button>
            </div>
            <button
              onClick={() => setSaved((p) => !p)}
              className="hover:opacity-50 transition-opacity"
            >
              <BookmarkIcon saved={saved} />
            </button>
          </div>
        </div>

        {/* Likes */}
        <div className="px-4 pb-1">
          <span className="text-[14px] font-semibold text-[#262626]">
            {likeCount.toLocaleString()} likes
          </span>
        </div>

        {/* Caption */}
        <div className="px-4 pb-2">
          <p className="text-[14px] text-[#262626] leading-[18px]">
            <span className="font-semibold mr-1">{username}</span>
            {caption}
          </p>
        </div>

        {/* View all comments */}
        <div className="px-4 pb-1">
          <button className="text-[14px] text-[#737373] hover:text-[#262626] transition-colors">
            View all 143 comments
          </button>
        </div>

        {/* Comment */}
        <div className="px-4 pb-1">
          <div className="flex items-start gap-3">
            <Image
              src={profilePicture}
              alt={username}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[14px] text-[#262626] leading-[18px]">
                    <span className="font-semibold mr-1">{username}</span>
                    Send me the offer for this product
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[12px] text-[#737373]">2d</span>
                    <span className="text-[12px] text-[#737373] font-semibold">
                      {commentLiked ? "2 likes" : "1 like"}
                    </span>
                    <button
                      onClick={() => setShowReply((p) => !p)}
                      className="text-[12px] text-[#737373] font-semibold hover:text-[#262626] transition-colors"
                    >
                      Reply
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setCommentLiked((p) => !p)}
                  className="ml-3 flex-shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={commentLiked ? "#ed4956" : "none"}
                    stroke={commentLiked ? "#ed4956" : "#c7c7c7"}
                    strokeWidth={2}
                    className="w-3.5 h-3.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </button>
              </div>

              {/* Reply toggle */}
              {showReply && (
                <div className="mt-2 ml-0">
                  <button
                    onClick={() => setShowReply(false)}
                    className="flex items-center gap-2 text-[12px] text-[#737373] font-semibold mb-2 hover:text-[#262626] transition-colors"
                  >
                    <span className="inline-block w-5 h-[1px] bg-[#737373]" />
                    Hide replies
                  </button>

                  {/* Reply */}
                  <div className="flex items-start gap-3">
                    <Image
                      src={profilePicture}
                      alt={username}
                      width={32}
                      height={32}
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-[14px] text-[#262626] leading-[18px]">
                            <span className="font-semibold mr-1">
                              {username}
                            </span>
                            <span className="text-[#00376b] mr-1">
                              @sofia.travels
                            </span>
                            {comment}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[12px] text-[#737373]">
                              1d
                            </span>
                            <span className="text-[12px] text-[#737373] font-semibold">
                              {replyLiked ? "1 like" : "0 likes"}
                            </span>
                            <button className="text-[12px] text-[#737373] font-semibold hover:text-[#262626] transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => setReplyLiked((p) => !p)}
                          className="ml-3 flex-shrink-0"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={replyLiked ? "#ed4956" : "none"}
                            stroke={replyLiked ? "#ed4956" : "#c7c7c7"}
                            strokeWidth={2}
                            className="w-3.5 h-3.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="px-4 pt-2 pb-3">
          <span className="text-[10px] text-[#c7c7c7] uppercase tracking-wide">
            2 days ago
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-[#dbdbdb]" />

        {/* Comment Input */}
        <div className="flex items-center px-4 py-3 gap-3">
          <SmileIcon />
          <input
            type="text"
            placeholder="Add a comment…"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="flex-1 text-[14px] text-[#262626] placeholder-[#737373] outline-none bg-transparent"
          />
          {commentInput.trim() && (
            <button
              onClick={() => setCommentInput("")}
              className="text-[14px] font-semibold text-[#0095f6] hover:text-[#00376b] transition-colors"
            >
              Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
