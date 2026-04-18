import AutomationEdit from "@/src/components/AutomationEdit";
import { AllAutomationList } from "@/src/components/AllAutomations";
import { caller } from "@/src/trpc/server";
import { FcWorkflow } from "react-icons/fc";
import { InstagramMedia } from "@/types/types";

export default async function EditAutomation({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const automation = await caller.instagram.getAutomation({
    automationId: id,
  });

  return (
    <div className="flex flex-col gap-6 w-full mx-auto">
      <div className="flex  justify-between flex-col">
        <h1 className="text-2xl font-semibold items-center flex gap-2 mb-4 ">
          <FcWorkflow className="w-5 h-5 mr-2" />
          Edit Automation
        </h1>
        <AutomationEdit
          automation={automation.automation as AllAutomationList}
          mediaData={automation.mediaData as InstagramMedia}
        />
      </div>
    </div>
  );
}
