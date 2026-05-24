import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react";
import { ErrorBoundary } from "react-error-boundary";
import Room from "./components/ui/Room";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { LiveObject } from "@liveblocks/client";
import type { UserData } from "./types/globaltype";
import Logo from "./components/ui/Logo";

const StatusScreen = ({ title, detail }: { title: string; detail: string }) => (
  <main className="dark bg-background text-foreground flex min-h-screen items-center justify-center overflow-hidden px-5">
    <div className="border-border bg-card text-card-foreground w-full max-w-md rounded-lg border p-8 text-center shadow-lg">
      <Logo className="mx-auto mb-6 text-4xl" />
      <h1 className="text-card-foreground text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground mt-3 text-sm leading-6">{detail}</p>
    </div>
  </main>
);

export const CollaborativeEditor = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<UserData>({});

  useEffect(() => {
    const stored = localStorage.getItem("userdata");
    if (stored) setData(JSON.parse(stored));
  }, []);
  if (!id || !data.name) {
    return (
      <StatusScreen
        title="Room access needs a name"
        detail="Go back to the home page, add your display name, and rejoin the room."
      />
    );
  }

  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
        const response = await fetch(
          `${import.meta.env.VITE_server_url}/auth`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: data.name,
              color: data.color,
              roomId: room,
            }),
          },
        );
        return await response.json();
      }}
    >
      <ErrorBoundary
        fallback={
          <StatusScreen
            title="Something interrupted the room"
            detail="Refresh the page or rejoin from the room entry screen."
          />
        }
      >
        <ClientSideSuspense
          fallback={
            <StatusScreen
              title="Opening workspace"
              detail="Syncing the editor, participants, and room storage."
            />
          }
        >
          <RoomProvider
            id={id}
            initialPresence={{
              cursor: null,
            }}
            initialStorage={{
              codeDetails: new LiveObject({
                code: "//wellcome to the collaborative editor try typing something here",
                language: "javascript",
                filename: "main.js",
              }),
            }}
          >
            <Room />
          </RoomProvider>
        </ClientSideSuspense>
      </ErrorBoundary>
    </LiveblocksProvider>
  );
};
