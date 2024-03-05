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
  Input,
} from "@/components/ui";

type Message = {
  username: string;
  content: string;
};

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const username = "Santhosh";
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState(() => {
    return new WebSocket("ws://localhost:8080");
  });

  useEffect(() => {
    socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      setMessages((messages) => {
        return [...messages, message];
      });
    };
  }, [socket]);

  function SendMessage() {
    if (inputRef.current) {
      const content = inputRef.current.value.trim();
      setMessages((messages) => {
        return [...messages, message];
      });

      const message = { username: username, content: content };
      const data = JSON.stringify(message);
      socket.send(data);
      inputRef.current.value = "";
    }
  }

  return (
    <main className="flex flex-col container gap-8 items-center justify-center">
      <Card className="w-full h-[100vh] relative my-8">
        <CardHeader className="flex flex-row items-center">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{username.at(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{username}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.username === username
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex w-full items-center space-x-2">
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            ref={inputRef}
          />
          <Button onClick={SendMessage} size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
