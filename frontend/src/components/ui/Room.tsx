import CodeEditor from "./CodeEditor";
import {
  useEventListener,
  useMutation,
  useSelf,
  useStorage,
  useUpdateMyPresence,
} from "@liveblocks/react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useOthers } from "@liveblocks/react";
import Cursor from "./Cursor";
import { useState } from "react";
import { useParams } from "react-router";
import { CopyButton } from "./CopyButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "./Loader";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Outputbox from "./Output";
import { FILE_MAP } from "../../constants/filename";
import { setOutput } from "@/features/code";
import { Users, X } from "lucide-react";
import Logo from "./Logo";
const Room = () => {
  const dispatch = useDispatch();
  const notify = (text: string) => toast(text);
  const language = useStorage((root) => root.codeDetails.language);
  const updateLanguage = useMutation(({ storage }, newLanguage: string) => {
    const details = storage.get("codeDetails");
    const newFilename = FILE_MAP[newLanguage];
    details.set("language", newLanguage);
    details.set("filename", newFilename);
  }, []);
  const { id } = useParams<{ id: string }>();
  useEventListener(({ event }) => {
    if (event.type == "USER_JOINED") {
      notify(`${event.name} joined the room`);
    }
    if (event.type == "USER_LEFT") {
      notify(`${event.name} left the room`);
    }
    if (event.type == "CODE_OUTPUT") {
      dispatch(setOutput({ ...event.name }));
    }
  });
  const me = useSelf();
  const selector = useSelector((state: RootState) => state.todo);
  const codeSelector = useSelector((state: RootState) => state.code);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();

  const handleMove = (e: React.PointerEvent) => {
    const offsetX = e.clientX - (selector?.totalWidth || 0);
    const offsetY = e.clientY - (selector?.totalHeight || 0);
    const height = selector.height;
    const width = selector.width;
    const hratio = (offsetY / height) * 100;
    const wratio = (offsetX / width) * 100;
    updateMyPresence({ cursor: { x: wratio, y: hratio } });
  };

  const handleLeave = () => {
    updateMyPresence({ cursor: null });
  };

  const rendered = Object.keys(FILE_MAP).map((key) => (
    <SelectItem
      key={key}
      value={key}
      className="bg-popover text-popover-foreground hover:bg-accent focus:bg-accent"
    >
      {key}
    </SelectItem>
  ));
  return (
    <main className="dark bg-background text-foreground min-h-screen w-full overflow-hidden selection:bg-chart-2/30">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 39px, var(--border) 39px, var(--border) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, var(--border) 39px, var(--border) 40px)
          `,
        }}
      />
      <div className="relative flex min-h-screen flex-col px-4 py-4 sm:px-6">
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="dark"
          transition={Bounce}
        />
        <Loader variable={language as string} />
        <header className="mb-5 flex items-center justify-between gap-3">
          <Logo className="text-3xl sm:text-4xl" />
          <div className="flex items-center gap-3">
            <div className="border-border bg-muted/50 text-card-foreground hidden items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium tracking-tight md:flex md:text-base">
              <span className="bg-primary size-1.5 rounded-full" />
              <span className="text-muted-foreground">Room</span>
              <span className="text-foreground font-mono">{id}</span>
            </div>
            <button
              type="button"
              className="border-border bg-accent text-accent-foreground hover:bg-accent/80 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border shadow-xs transition"
              onClick={() => setIsHovering(true)}
              aria-label="Open participants"
            >
              <Users className="size-4.5" />
            </button>
          </div>
        </header>

        <div className="grid flex-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,1fr)]">
          <CodeEditor handleMove={handleMove} handleLeave={handleLeave} />
          <Outputbox codeObject={codeSelector} />
        </div>
        {others.map((other) => {
          const cursor = other.presence.cursor;
          if (!cursor) return null;
          return (
            <Cursor
              key={other.connectionId}
              x={cursor.x}
              y={cursor.y}
              color={other?.info?.color}
            />
          );
        })}

        <div
          className={`fixed inset-0 z-[70] bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
            isHovering ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setIsHovering(false)}
        />
        <aside
          className={`border-border bg-card text-card-foreground fixed top-4 right-4 z-[80] flex max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border shadow-2xl transition-all duration-300 sm:top-6 sm:right-6 ${
            isHovering
              ? "translate-x-0 scale-100 opacity-100"
              : "pointer-events-none translate-x-4 scale-95 opacity-0"
          }`}
        >
          <div className="border-border flex items-center justify-between border-b px-5 py-4">
            <div className="flex items-center gap-2">
              <Users className="text-muted-foreground size-4" />
              <span className="text-card-foreground text-sm font-semibold">
                Participants
              </span>
              <span className="bg-muted text-muted-foreground ml-1.5 rounded-md px-2 py-0.5 text-xs font-medium tabular-nums">
                {(others?.length || 0) + 1}
              </span>
            </div>
            <button
              type="button"
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg p-1.5 transition"
              onClick={() => setIsHovering(false)}
              aria-label="Close participants"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto p-5">
            <div className="border-border bg-background rounded-xl border p-4">
              <div className="text-muted-foreground mb-3 text-sm font-semibold uppercase tracking-wider">
                Language
              </div>
              <Select
                value={language || ""}
                onValueChange={(e) => updateLanguage(e)}
              >
                <SelectTrigger className="border-input bg-background text-foreground h-10 w-full rounded-lg border text-sm md:text-base">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>

                <SelectContent className="border-border bg-popover text-popover-foreground z-[90] border">
                  {rendered}
                </SelectContent>
              </Select>
            </div>

            <CopyButton text={id || "not found"} className="w-full" />

            <div className="text-card-foreground space-y-2">
              <div className="border-border bg-background flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium md:text-base">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    style={{ background: me?.info?.color }}
                    className="border-border size-7 shrink-0 rounded-full border"
                  />
                  <span className="text-foreground truncate">{me?.info?.name}</span>
                  <span className="text-muted-foreground text-xs md:text-sm">(you)</span>
                </div>
              </div>
              {others?.length > 0 ? (
                others.map((other, idx) => (
                  <div
                    key={idx}
                    className="border-border bg-background flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium md:text-base"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        style={{ background: other?.info?.color }}
                        className="border-border size-7 shrink-0 rounded-full border"
                      />
                      <span className="text-foreground truncate">
                        {other?.info?.name || "Unknown"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border-border text-muted-foreground rounded-xl border border-dashed px-4 py-8 text-center text-sm md:text-base">
                  No other users here yet
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Room;
