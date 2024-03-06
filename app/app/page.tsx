"use client";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { toast } from "sonner";

type Message = {
  from: string;
  to: string;
  content: string;
};

export default function Home() {
  const messageInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Open username prompt dialog on initial loading
  useEffect(() => {
    if (!username) {
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(false);
    }
  }, [username]);

  // Remove selected user when user is disconnected
  useEffect(() => {
    if (selectedUser !== null && !users.includes(selectedUser)) {
      toast.error(`${selectedUser} disconnected`);
      setSelectedUser(null);
    }
  }, [users]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    // Get all active users names every 5 sec
    const intervel = setInterval(() => {
      socket.send(JSON.stringify({ action: "getAllUsers", from: username }));
    }, 5000);

    return () => {
      clearInterval(intervel);
    };
  }, [socket]);

  useEffect(() => {
    if (!username) {
      return;
    }

    const webSocket = new WebSocket(`ws://localhost:8080?username=${username}`);

    webSocket.onerror = (error) => {
      console.log("error: ", error);
    };

    webSocket.onopen = (e) => {
      console.log("connected");
    };

    webSocket.onclose = (e) => {
      console.log("clossed: ", e);
      setUsername("");
      toast.error(e.reason);
    };

    // Handle recieving message
    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.action === "getAllUsers") {
        setUsers(data.users);
      } else {
        const message: Message = data;
        setMessages((messages) => {
          return [...messages, message];
        });
      }
    };

    setSocket(webSocket);

    return () => {
      webSocket.close();
    };
  }, [username]);

  // Handle send message
  function SendMessage() {
    if (socket == null) {
      return;
    }

    if (messageInputRef.current) {
      if (selectedUser) {
        const content = messageInputRef.current.value.trim();
        if (!content) {
          return;
        }
        setMessages((messages) => {
          return [...messages, message];
        });

        const message = { from: username, to: selectedUser, content: content };
        const data = JSON.stringify(message);
        socket.send(data);
        messageInputRef.current.value = "";
      } else {
        toast.error("Select which user to send the message to");
      }
    }
  }

  return (
    <>
      <Dialog open={isDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Username</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                ref={usernameInputRef}
                defaultValue={username}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter suppressHydrationWarning>
            <DialogClose asChild suppressHydrationWarning>
              <Button
                type="submit"
                onClick={() => {
                  setUsername(usernameInputRef.current?.value || "");
                }}
              >
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-8 items-center justify-center">
        <Card className="w-full h-[90vh] relative my-[5vh]">
          <CardHeader className="flex flex-row items-center">
            <div className="flex w-full sm:justify-between sm:flex-row flex-col ">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>{username.at(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{username}</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <Label>Select User: </Label>
                  <Select
                    onValueChange={(value) => {
                      setSelectedUser(value);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select user.." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {users.length <= 1 ? (
                          <SelectLabel>No active users</SelectLabel>
                        ) : null}
                        {users.map((user) =>
                          user !== username ? (
                            <SelectItem key={user} value={user}>
                              {user}
                            </SelectItem>
                          ) : null
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[63vh] sm:h-[68vh] w-full">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      message.from === username
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="flex gap-2">
                      {message.content}
                      <span className="text-gray-400 text-[10px]">
                        {message.from !== username
                          ? `by ${message.from}`
                          : `to ${message.to}`}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex w-full items-center space-x-2 absolute bottom-0">
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              ref={messageInputRef}
            />
            <Button onClick={SendMessage} size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
