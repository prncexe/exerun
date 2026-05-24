import { Editor, loader, type OnMount } from "@monaco-editor/react";
import { useEffect, useRef, useState, useTransition } from "react";
import { updateHW } from "../../features/heightWidth";
import { setOutput } from "../../features/code";
import type { Output } from "@/types/globaltype";
import { useDispatch } from "react-redux";
import { useMutation, useStorage } from "@liveblocks/react";
import { CodeRunner } from "../../hooks/codeRunner";
import { Loader, Play, RotateCcw, RotateCw } from "lucide-react";
import { useParams } from "react-router";
function CodeEditor({
  handleLeave,
  handleMove,
}: {
  handleLeave: () => void;
  handleMove: (e: React.PointerEvent) => void;
}) {
  const { id } = useParams();
  const code = useStorage((root) => root.codeDetails.code);
  const filename = useStorage((root) => root.codeDetails.filename) || "main.js";

  const language = useStorage((root) => root.codeDetails.language);
  const updateCode = useMutation(({ storage }, newCode: string) => {
    const details = storage.get("codeDetails");
    details.set("code", newCode);
  }, []);
  const dispatch = useDispatch();
  const reference = useRef<HTMLDivElement>(null);

  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const [UndoRedoState, setUndoRedoState] = useState<{
    canUndo: boolean;
    canRedo: boolean;
  }>({ canUndo: false, canRedo: false });
  loader.init();
  // .then((monaco) => console.log("here is the monaco instance:", monaco));

  function useUndo() {
    editorRef.current?.trigger("", "undo", null);
  }
  function useRedo() {
    editorRef.current?.trigger("", "redo", null);
  }
  function handleValueChange(value: string | undefined) {
    const canUndo = editorRef.current?.getModel()?.canUndo() || false;
    const canRedo = editorRef.current?.getModel()?.canRedo() || false;
    if (
      UndoRedoState.canUndo !== canUndo ||
      UndoRedoState.canRedo !== canRedo
    ) {
      setUndoRedoState({ canUndo, canRedo });
    }
    if (value) {
      updateCode(value);
    } else updateCode("");
  }
  const [isPending, startTransition] = useTransition();

  function runcode() {
    startTransition(async () => {
      const response: Output | string = await CodeRunner({
        roomId: id || "",
        language,
        code,
        filename,
      });
      if (typeof response == "string") return;
      const {
        exception,
        executionTime,
        limitPerMonthRemaining,
        status,
        stderr,
        stdout,
        error,
      } = response;
      dispatch(
        setOutput({
          exception,
          executionTime,
          limitPerMonthRemaining,
          status,
          stderr,
          stdout,
          error,
        }),
      );
      return;
    });
  }

  useEffect(() => {
    if (!reference.current) return;

    const el = reference.current;

    const update = () => {
      const rect = el.getBoundingClientRect();
      dispatch(
        updateHW({
          height: el.clientHeight,
          width: el.clientWidth,
          totalHeight: rect.top,
          totalWidth: rect.left,
        }),
      );
    };

    const observer = new ResizeObserver(() => {
      update();
    });

    observer.observe(el);
    update();

    window.addEventListener("scroll", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, [reference, dispatch]);

  return (
    <>
      <div className="border-border bg-card text-card-foreground flex min-h-[72vh] flex-col overflow-hidden rounded-lg border shadow-lg lg:min-h-0">
        <div className="border-border bg-muted flex min-h-14 items-center gap-3 border-b px-3 py-2 sm:px-4">
          <div className="flex items-center gap-2">
            <span className="bg-destructive h-3 w-3 rounded-full"></span>
            <span className="bg-chart-1 h-3 w-3 rounded-full"></span>
            <span className="bg-chart-2 h-3 w-3 rounded-full"></span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={useUndo}
              className={`rounded-md p-2 transition ${
                UndoRedoState.canUndo
                  ? "text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  : "text-muted-foreground cursor-not-allowed opacity-50"
              }`}
              aria-label="Undo"
            >
              <RotateCcw className="size-4" />
            </button>
            <button
              type="button"
              onClick={useRedo}
              className={`rounded-md p-2 transition ${
                UndoRedoState.canRedo
                  ? "text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  : "text-muted-foreground cursor-not-allowed opacity-50"
              }`}
              aria-label="Redo"
            >
              <RotateCw className="size-4" />
            </button>
          </div>
          <div className="border-border bg-background text-muted-foreground min-w-0 flex-1 truncate rounded-md border px-3 py-1.5 font-mono text-xs">
            {filename}
          </div>
          <div className="flex justify-end">
            {isPending ? (
              <Loader className="text-foreground size-5 animate-spin" />
            ) : (
              <button
                onClick={runcode}
                disabled={isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 cursor-pointer items-center gap-2 rounded-md px-4 text-sm font-bold transition"
              >
                <Play className="fill-primary-foreground size-4" />
                <span className="hidden sm:inline">Run</span>
              </button>
            )}
          </div>
        </div>
        <div
          className="h-screen flex-1"
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
          ref={reference}
        >
          <Editor
            height="100%"
            width="100%"
            className=""
            language={language || ""}
            theme="vs-dark"
            onChange={handleValueChange}
            onMount={(editor) => {
              editorRef.current = editor;
              editor.focus();
              window.addEventListener("resize", () => editor.layout());
            }}
            options={{
              fontSize: 14,
              fontFamily: "JetBrains Mono, monospace",
              lineNumbers: "on",
              minimap: { enabled: true },
              smoothScrolling: true,
              wordWrap: "on",
              cursorBlinking: "smooth",
              padding: { top: 10 },
            }}
            value={code || ""}
          />
        </div>
      </div>
    </>
  );
}

export default CodeEditor;
