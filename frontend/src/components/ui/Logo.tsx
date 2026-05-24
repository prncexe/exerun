import { cn } from "@/lib/utils";
const Logo = ({ className }: { className?: string }) => {
  return (
    <h1 className={cn("bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text font-sans font-black tracking-normal text-transparent leading-none", className)}>
      Exerun
    </h1>
  );
};

export default Logo;
