import { AllAutomationList } from "./AllAutomations";
import { useEffect, useState } from "react";
import AutomationPause from "./AutomationPause";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Switch } from "@/src/components/ui/switch";
import { cn } from "../lib/utils";
import { FaCommentAlt } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { DropdownMenuIcons } from "./ContextMenu";
import AutomationDelete from "./AutomationDelete";
import { formatDistance } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

export default function AutomationCard({
  automation,
}: {
  automation: AllAutomationList;
}) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [automationId, setAutomationId] = useState<string | null>(
    automation.id,
  );
  const [checked, setChecked] = useState(automation.isActive || false);

  // update checked state when automation is active or paused
  useEffect(() => {
    const timeout = setTimeout(() => {
      setChecked(automation.isActive ?? false);
    }, 0);
    return () => clearTimeout(timeout);
  }, [automation.isActive]);

  const handleOpenChange = (open: boolean, id: string) => {
    setAutomationId(id);
    setOpen(true);
  };

  const actionSummary = automation.actions
    .map((a) => a.type.replace("_", " "))
    .join(", ");
  return (
    <>
      {/* Automation Pause/ Resume Dialog */}
      {open && (
        <AutomationPause
          automationId={automationId}
          open={open}
          setOpen={setOpen}
          checked={checked}
          setChecked={setChecked}
        />
      )}
      {/* Automation Delete Dialog */}
      {deleteOpen && (
        <AutomationDelete
          automationId={automationId}
          open={deleteOpen}
          setDeleteOpen={setDeleteOpen}
          automationName={automation.name}
        />
      )}
      {/* Automation Card */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -7 }}
          transition={{ duration: 0.3, ease: "easeInOut", bounce: 0.1 }}
        >
          <Card key={automation.id} className="rounded-2xl">
            <CardContent className="p-5 space-y-4">
              {/* Top */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg leading-tight mb-2 pr-5">
                    {automation.name}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    {automation.triggerType === "COMMENT" ? (
                      <FaCommentAlt className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <AiFillMessage className="w-4 h-4 text-muted-foreground" />
                    )}
                    {automation.triggerType}
                  </p>
                </div>
                <DropdownMenuIcons
                  automationId={automation.id}
                  setDeleteOpen={setDeleteOpen}
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between mt-4">
                <Badge
                  className={cn(
                    checked
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white",
                  )}
                >
                  {checked ? "Active" : "Paused"}
                </Badge>

                <Switch
                  checked={checked}
                  onCheckedChange={(checked) =>
                    handleOpenChange(checked as boolean, automation.id)
                  }
                  className="cursor-grab"
                />
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">
                    Trigger Keywords:{" "}
                  </span>
                  {automation.triggers.length > 0
                    ? automation.triggers.map((t) => (
                        <Badge key={t.id} className="mx-1 text-xs">
                          {t.keyword}{" "}
                        </Badge>
                      ))
                    : `Runs On each ${automation.triggerType === "COMMENT" ? "comment" : "Direct Message"}.`}
                </p>

                <p>
                  <span className="text-muted-foreground">Action: </span>
                  {actionSummary || "—"}
                </p>

                <p>
                  <span className="text-muted-foreground">Target: </span>
                  {automation.targetMediaId ? "Specific Post" : "All Posts"}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-muted-foreground flex justify-between gap-2 w-full">
                  <p>
                    Created at:{" "}
                    {formatDistance(
                      new Date(automation.createdAt),
                      new Date(),
                      {
                        addSuffix: true,
                      },
                    )}
                  </p>
                  <p className="text-muted-foreground">
                    {new Date(automation.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
