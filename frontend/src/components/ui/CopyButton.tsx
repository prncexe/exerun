import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/CopyToClipboard";
import { cn } from "../../lib/utils";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  text,
  className,
  className2,
}: {
  text: string;
  className?: string;
  className2?: string;
}) {
  const [copy, isCopied] = useCopyToClipboard();

  const handleCopy = () => {
    copy(text);
  };

  return (
    <div className={cn("flex items-stretch gap-2", className)}>
      <pre className="border-border bg-background text-foreground min-w-0 flex-1 overflow-hidden rounded-lg border px-3 py-3 font-mono text-sm md:text-base shadow-xs">
        {text}
      </pre>
      <Button
        type="button"
        onClick={handleCopy}
        className={cn(
          "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 h-auto cursor-pointer rounded-lg border px-3",
          className2,
        )}
        aria-label="Copy room ID"
      >
        {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
        <span className="hidden sm:inline">{isCopied ? "Copied" : "Copy"}</span>
      </Button>
    </div>
  );
}
