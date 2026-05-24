import React, { useEffect, useState, useTransition } from "react";
import uniqolor from "uniqolor";
import random from "random-string-generator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "./components/ui/CopyButton";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router";
import { ArrowRight, DoorOpen, Loader2, Palette, User } from "lucide-react";
import Logo from "./components/ui/Logo";
import type { FetchResponse } from "./types/globaltype";
const RoomProvider = () => {
  const checkroom = async (): Promise<string> => {
    const id = random(12);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_server_url}/checkroom?id=${id}`,
      );
      const res: FetchResponse = await response.json();
      return res.status === false ? id : await checkroom();
    } catch {
      return await checkroom();
    }
  };

  const [room, setRoom] = useState("");
  const [joinroom, setjoinRoom] = useState("");
  const [color, setColor] = useState("");
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  useEffect(() => {
    checkroom().then((id) => {
      setRoom(id);
      const userdata = localStorage.getItem("userdata");

      if (userdata) {
        const parsed = JSON.parse(userdata);
        setName(parsed.name ?? "");
        if (parsed.color) setColor(parsed.color);
        else setColor(uniqolor(id).color);
      } else {
        setColor(uniqolor(id).color);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlenameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handlecolorChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setColor(e.target.value);

  useEffect(() => {
    if (!name || !color) return;
    localStorage.setItem("userdata", JSON.stringify({ name, color }));
  }, [name, color]);

  const handleJoinSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    temproom: string,
  ) => {
    startTransition(async () => {
      e.preventDefault();
      const res = await fetch(
        `${import.meta.env.VITE_server_url}/prewarm/${temproom}`,
      );
      const js = await res.json();
      if (js.status === true) navigate(`/collaborative/${temproom}`);
    });
  };

  const formInputClass =
    "h-12 rounded-lg border-input bg-background text-foreground placeholder:text-muted-foreground shadow-xs focus-visible:border-ring focus-visible:ring-ring/50";
  const actionButtonClass =
    "h-12 w-full cursor-pointer rounded-lg font-semibold shadow-xs";

  return (
    <main className="dark bg-background text-foreground min-h-screen w-full overflow-hidden selection:bg-chart-2/30">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06] sm:opacity-[0.15]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 39px, var(--border) 39px, var(--border) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, var(--border) 39px, var(--border) 40px)
          `,
        }}
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-8">
        <header className="flex items-center justify-between">
          <Logo className="text-3xl sm:text-5xl" />
          <div className="flex items-center gap-2">
            <span className="bg-primary block h-2 w-2 rounded-full sm:hidden" />
            <div className="border-border bg-muted/50 text-muted-foreground hidden items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold uppercase sm:flex">
              <span className="bg-primary h-2 w-2 rounded-full" />
              Live code rooms
            </div>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-6 py-6 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:py-4">
          <div className="max-w-2xl">
            <h1 className="text-foreground text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Spin up a shared code desk.
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl text-sm leading-relaxed sm:mt-5 sm:text-lg">
              Create a room, invite collaborators, choose a language, and run
              code together in a focused workspace.
            </p>
          </div>

          <Tabs defaultValue="create" className="w-full">
            <TabsList className="border-border bg-muted/50 text-muted-foreground mx-auto mb-5 grid h-11 w-full max-w-md grid-cols-2 rounded-lg border p-1 shadow-xs">
              <TabsTrigger
                value="create"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground cursor-pointer rounded-md text-sm font-semibold"
              >
                Create Room
              </TabsTrigger>

              <TabsTrigger
                value="join"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground cursor-pointer rounded-md text-sm font-semibold"
              >
                Join Room
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="min-h-[32rem]">
              <Card className="border-border bg-card text-card-foreground mx-auto flex min-h-[32rem] w-full max-w-md flex-col overflow-hidden rounded-xl shadow-sm">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-card-foreground text-2xl font-bold">
                    Create room
                  </CardTitle>
                  <p className="text-muted-foreground text-sm leading-6">
                    Your room ID is ready to share. Add your name before
                    entering.
                  </p>
                </CardHeader>

                <CardContent className="grid flex-1 gap-6">
                  <form
                    onSubmit={(e) => handleJoinSubmit(e, room)}
                    className="text-card-foreground grid h-full grid-rows-[auto_auto_auto_1fr] gap-5"
                  >
                    <CopyButton text={room} className="text-base" />

                    <div className="grid gap-2">
                      <Label
                        htmlFor="create-name"
                        className="text-card-foreground flex items-center gap-2 text-sm font-semibold"
                      >
                        <User className="text-muted-foreground size-4" />
                        Name
                      </Label>
                      <Input
                        id="create-name"
                        value={name}
                        required
                        onChange={handlenameChange}
                        placeholder="Enter your preferred name"
                        className={formInputClass}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="create-color"
                        className="text-card-foreground flex items-center gap-2 text-sm font-semibold"
                      >
                        <Palette className="text-muted-foreground size-4" />
                        Preferred Color
                      </Label>
                      <Input
                        id="create-color"
                        type="color"
                        className="border-input bg-background h-12 w-20 cursor-pointer rounded-lg p-1"
                        value={color}
                        onChange={handlecolorChange}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className={`${actionButtonClass} self-end`}
                    >
                      {isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          Create Room
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="join" className="min-h-[32rem]">
              <Card className="border-border bg-card text-card-foreground mx-auto flex min-h-[32rem] w-full max-w-md flex-col overflow-hidden rounded-xl shadow-sm">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-card-foreground text-2xl font-bold">
                    Join room
                  </CardTitle>
                  <p className="text-muted-foreground text-sm leading-6">
                    Paste a room ID from your teammate and enter with your own
                    identity.
                  </p>
                </CardHeader>

                <CardContent className="grid flex-1 gap-6">
                  <form
                    onSubmit={(e) => handleJoinSubmit(e, joinroom)}
                    className="text-card-foreground grid h-full grid-rows-[auto_auto_auto_1fr] gap-5"
                  >
                    <div className="grid gap-2">
                      <Label
                        htmlFor="join-room"
                        className="text-card-foreground flex items-center gap-2 text-sm font-semibold"
                      >
                        <DoorOpen className="text-muted-foreground size-4" />
                        Room ID
                      </Label>
                      <Input
                        id="join-room"
                        value={joinroom}
                        required
                        onChange={(e) => setjoinRoom(e.target.value)}
                        placeholder="Enter room ID"
                        className={formInputClass}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="join-name"
                        className="text-card-foreground flex items-center gap-2 text-sm font-semibold"
                      >
                        <User className="text-muted-foreground size-4" />
                        Name
                      </Label>
                      <Input
                        id="join-name"
                        value={name}
                        required
                        onChange={handlenameChange}
                        placeholder="Enter your preferred name"
                        className={formInputClass}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="join-color"
                        className="text-card-foreground flex items-center gap-2 text-sm font-semibold"
                      >
                        <Palette className="text-muted-foreground size-4" />
                        Preferred Color
                      </Label>
                      <Input
                        id="join-color"
                        type="color"
                        className="border-input bg-background h-12 w-20 cursor-pointer rounded-lg p-1"
                        value={color}
                        onChange={handlecolorChange}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className={`${actionButtonClass} self-end`}
                    >
                      {isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          Join Room
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  );
};

export default RoomProvider;
