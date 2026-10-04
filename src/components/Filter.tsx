import { InputGroup, InputGroupButton } from "./ui/input-group";
import { FilterIcon, SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { TbRadioactiveFilled } from "react-icons/tb";
import { HiSortDescending } from "react-icons/hi";
import { HiSortAscending } from "react-icons/hi";
import { FaCalendar } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { TbRadioactiveOff } from "react-icons/tb";

export default function Filter({
  type = "automations",
}: {
  type?: "payments" | "automations";
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(search);
  const router = useRouter();

  const debounceTimeout = useRef<NodeJS.Timeout>(null);
  // Sync when input chants
  useEffect(() => {
    setSearchInput(search);
  }, [search]);
  const handleSearch = (value: string) => {
    setSearchInput(value);
    clearTimeout(debounceTimeout?.current ?? undefined);

    debounceTimeout.current = setTimeout(() => {
      updateParams("search", value);
    }, 400);
  };

  // Function to update the URL search params

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <InputGroup>
          <AnimatePresence>
            {isOpen ? (
              <Input
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search"
                className="flex-1"
              />
            ) : searchInput !== "" ? (
              <Input
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search"
                className="flex-1"
              />
            ) : null}
          </AnimatePresence>
          <InputGroupButton
            type="button"
            variant="ghost"
            className="size-10 hover:bg-transparent cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <SearchIcon className="w-4 h-4" />
          </InputGroupButton>
        </InputGroup>
      </div>
      <div className="flex-1">
        <DropdownMenuSubmenu updateParams={updateParams} type={type} />
      </div>
    </div>
  );
}

export function DropdownMenuSubmenu({
  updateParams,
  type,
}: {
  type?: "payments" | "automations";
  updateParams: (key: string, value: string) => void;
}) {
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<string>("desc");
  useEffect(() => {
    updateParams("status", status);
  }, [status]);
  useEffect(() => {
    updateParams("sort", sort);
  }, [sort]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">
          <FilterIcon className="w-4 h-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Filter By</DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <TbRadioactiveFilled className="w-4 h-4" />
              Status
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              {type === "automations" ? (
                <>
                  <DropdownMenuSubContent>
                    <DropdownMenuCheckboxItem
                      checked={status === "all" ? true : false}
                      onCheckedChange={(checked) =>
                        setStatus(checked ? "all" : "")
                      }
                    >
                      All
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={status === "active" ? true : false}
                      onCheckedChange={(checked) =>
                        setStatus(checked ? "active" : "")
                      }
                    >
                      <TbRadioactiveFilled className="w-4 h-4" />
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={status === "inactive" ? true : false}
                      onCheckedChange={(checked) =>
                        setStatus(checked ? "inactive" : "")
                      }
                    >
                      <TbRadioactiveOff className="w-4 h-4" />
                      Inactive
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuSubContent>
                </>
              ) : (
                <>
                  {/* Payment Status */}
                  <DropdownMenuSubContent>
                    <DropdownMenuCheckboxItem
                      checked={status === "all" ? true : false}
                      onCheckedChange={(checked) =>
                        setStatus(checked ? "all" : "")
                      }
                    >
                      All
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={status === "PAID" ? true : false}
                      onCheckedChange={(checked) =>
                        setStatus(checked ? "PAID" : "")
                      }
                    >
                      <TbRadioactiveFilled className="w-4 h-4" />
                      Paid
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={status === "FAILED" ? true : false}
                      onCheckedChange={(checked) =>
                        setStatus(checked ? "FAILED" : "")
                      }
                    >
                      <TbRadioactiveOff className="w-4 h-4" />
                      Failed
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuSubContent>
                </>
              )}
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FaCalendar />
              Sort By
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuCheckboxItem
                  checked={sort === "desc" ? true : false}
                  onCheckedChange={(checked) => setSort(checked ? "desc" : "")}
                >
                  <HiSortDescending className="w-4 h-4" />
                  Newest
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={sort === "asc" ? true : false}
                  onCheckedChange={(checked) => setSort(checked ? "asc" : "")}
                >
                  <HiSortAscending className="w-4 h-4" />
                  Oldest
                </DropdownMenuCheckboxItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
