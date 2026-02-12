import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import {
  Button,
  Collection,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";
import { cn } from "../components-utilities";

interface SelectOption {
  id: string;
  label: string;
}

interface SelectAriaProps {
  id: string;
  label: string;
  options: SelectOption[];
  selectedKey: string;
  onSelectionChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
}

export function SelectAria({
  id,
  label,
  options,
  selectedKey,
  onSelectionChange,
  className,
  buttonClassName,
}: SelectAriaProps) {
  return (
    <Select
      selectedKey={selectedKey}
      onSelectionChange={(key) => onSelectionChange(String(key ?? ""))}
      className={cn("group flex w-full flex-col", className)}
    >
      <Label htmlFor={id} className="text-sm font-medium text-slate-200">
        {label}
      </Label>
      <Button
        id={id}
        className={cn(
          "mt-1 flex h-10 w-full items-center justify-between rounded-lg border border-slate-500/70 bg-slate-950/45 px-3 py-2 text-left text-sm text-slate-100 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-300/30",
          buttonClassName,
        )}
      >
        <SelectValue className="truncate" />
        <ChevronDown size={16} className="text-slate-300 transition group-data-[open]:rotate-180" />
      </Button>
      <Popover className="mt-1 min-w-[var(--trigger-width)] overflow-hidden rounded-lg border border-white/10 bg-slate-900/95 shadow-xl backdrop-blur-xl">
        {({ isEntering, isExiting }) => (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{
              opacity: isExiting ? 0 : 1,
              y: isExiting ? -8 : 0,
              scale: isExiting ? 0.98 : 1,
            }}
            transition={{
              duration: isEntering || isExiting ? 0.18 : 0.22,
              ease: "easeOut",
            }}
            className="p-1"
          >
            <ListBox className="max-h-64 overflow-auto outline-none">
              <Collection items={options}>
                {(item) => (
                  <ListBoxItem
                    id={item.id}
                    textValue={item.label}
                    className={({ isFocused, isSelected }) =>
                      cn(
                        "flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-slate-100 outline-none transition",
                        (isFocused || isSelected) && "bg-white/10",
                      )
                    }
                  >
                    {item.label}
                  </ListBoxItem>
                )}
              </Collection>
            </ListBox>
          </motion.div>
        )}
      </Popover>
    </Select>
  );
}
