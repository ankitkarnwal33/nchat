"use client";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function FreePlanPopup({ onFreePlan }: { onFreePlan: boolean }) {
  const [open, setOpen] = useState<boolean>(true);
  const router = useRouter();
  const handleUpgrade = () => {
    setOpen(false);
    router.push("/upgrade");
  };
  return open ? (
    <AnimatePresence mode="popLayout">
      <motion.div
        key="free-plan-popup"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed bottom-4 right-4 z-100 bg-gray-800 text-white py-10 rounded-3xl shadow-xl max-w-sm px-6 flex flex-col gap-4"
      >
        <p className="text-lg  font-semibold text-white/90">
          Want more limits ?
        </p>
        <p className=" text-muted-foreground">
          Upgrade to a paid plan to get more limits and continue automating.
        </p>
        <Button
          variant="default"
          className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white mt-5 hover:scale-105 transition-all duration-300"
          onClick={handleUpgrade}
        >
          Upgrade Now <ArrowRightIcon className="w-4 h-4" />
        </Button>
        <IoCloseCircle
          className="absolute top-4 size-7 cursor-pointer right-4"
          onClick={() => setOpen(false)}
        />
      </motion.div>
    </AnimatePresence>
  ) : null;
}
