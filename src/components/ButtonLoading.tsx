"use client";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { AnimatePresence, motion } from "framer-motion";

export default function ButtonLoading({
  idle,
  success,
  buttonState,
}: {
  idle: string;
  success: string;
  buttonState: "idle" | "loading" | "success";
}) {
  const buttonContent = {
    idle,
    loading: <Spinner className="animate-spin" />,
    success,
  };

  return (
    <Button
      type="submit"
      className=" w-full  hover:scale-102 disabled:cursor-not-allowed disabled:opacity-90"
      disabled={buttonState === "loading" || buttonState === "success"}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={buttonState}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
        >
          {buttonContent[buttonState]}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
