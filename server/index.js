import WebSocket, { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });
import url from "url";

const users = {};

wss.on("connection", (socket, request) => {
  // Get username from query params
  const parsedUrl = url.parse(request.url, true);
  let username = parsedUrl.query.username;

  // On connection check username avaliblity
  if (users[username] != null) {
    const client = users[username];
    if (client.readyState === WebSocket.OPEN) {
      socket.close(1003, "Username already exist");
    } else {
      client.close(1003, "New connection established");
      users[username] = socket;
    }
  } else {
    users[username] = socket;
  }

  socket.on("error", console.error);

  // When user disconncts remove them from users
  socket.on("close", () => {
    Object.keys(users).forEach((user) => {
      if (socket === users[user]) {
        delete users[user];
      }
    });
  });

  socket.on("message", function message(data, isBinary) {
    const message = JSON.parse(data);

    // When user sends "getAllUsers" request, send names of all active usernames
    if (message.action == "getAllUsers") {
      const userNames = Object.keys(users);
      socket.send(JSON.stringify({ action: "getAllUsers", users: userNames }));
    }

    // If user send message to other user, send that message to perticular user
    if (message.from && message.to && message.content) {
      if (users[message.to] != null) {
        const client = users[message.to];
        client.send(data, { binary: isBinary });
      }
    }
  });
});
