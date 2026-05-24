import type { Output } from "@/types/globaltype";
import { Hash, Terminal } from "lucide-react";
const Outputbox = ({ codeObject }: { codeObject: Output }) => {
  const { stdout, stderr, exception, executionTime, error } = codeObject;

  return (
    <section className="border-border bg-card text-card-foreground flex min-h-[44vh] flex-col overflow-hidden rounded-lg border shadow-lg lg:min-h-0">
      <div className="border-border bg-muted/50 flex min-h-12 items-center justify-between border-b px-4">
        <div className="text-foreground flex items-center gap-2 text-sm font-semibold">
          <Terminal className="text-muted-foreground size-4" />
          Output
        </div>
        {executionTime !== null && (
          <div className="border-border bg-background text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs">
            <Hash className="size-3" />
            {executionTime}ms
          </div>
        )}
      </div>

      <div className="no-scrollbar bg-background text-foreground flex-1 overflow-auto p-5 font-mono text-sm leading-relaxed">
        <div className="text-muted-foreground/60 mb-6 flex items-center gap-2 text-xs">
          <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 font-semibold">$</span>
          exerun --latest
        </div>

        {!stdout && !stderr && !exception && !error && (
          <div className="border-border text-muted-foreground mt-6 rounded-xl border border-dashed px-4 py-10 text-center font-sans text-sm">
            <Terminal className="text-muted-foreground/30 mx-auto mb-3 size-8" />
            <p className="font-medium">No output yet</p>
            <p className="text-muted-foreground/70 mt-1">
              Run your code to see results here.
            </p>
          </div>
        )}

        <div className="mt-4 space-y-5">
          {stdout && (
            <div>
              <span className="text-muted-foreground mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                <span className="bg-muted size-1 rounded-full" />
                stdout
              </span>
              <pre className="border-border bg-muted/50 text-foreground mt-1 rounded-xl border p-4 whitespace-pre-wrap">
                {stdout}
              </pre>
            </div>
          )}

          {stderr && (
            <div>
              <span className="text-destructive mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                <span className="bg-destructive size-1 rounded-full" />
                stderr
              </span>
              <pre className="border-destructive/50 bg-destructive/5 text-destructive mt-1 rounded-xl border p-4 whitespace-pre-wrap">
                {stderr}
              </pre>
            </div>
          )}

          {exception && (
            <div className="border-border bg-accent/30 rounded-xl border p-4">
              <span className="text-muted-foreground mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                <span className="bg-muted-foreground size-1 rounded-full" />
                exception
              </span>
              <p className="text-foreground mt-1">{exception}</p>
            </div>
          )}

          {error && (
            <div className="border-destructive/50 bg-destructive/5 rounded-xl border p-4">
              <span className="text-destructive mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                <span className="bg-destructive size-1 rounded-full" />
                error
              </span>
              <p className="text-foreground mt-1">{error}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Outputbox;
