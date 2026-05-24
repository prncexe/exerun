const Loader = ({ variable }: { variable: string }) => {
  if (variable !== undefined && variable !== null) return null;

  return (
    <div className="bg-background/80 fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md">
      <div className="border-border bg-card text-card-foreground flex items-center gap-4 rounded-lg border px-5 py-4 shadow-lg">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        <span className="text-muted-foreground text-sm font-medium">
          Syncing workspace
        </span>
      </div>
    </div>
  );
};

export default Loader;
