# Chat Application Readme

This is a Chat Application project using Next.js for frontend and Node.js for backend, implemented using native WebSocket protocol.

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine.

### Starting the Server

1. Navigate to the server directory:

   ```bash
   cd chat-app/server
   ```

2. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Start the server:

   ```bash
   npm start
   # or
   yarn start
   # or
   pnpm start
   # or
   bun start
   ```

### Starting the Client

1. Navigate to the app directory:

   ```bash
   cd chat-app/app
   ```

2. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Start the client:

   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   # or
   bun build
   ```

   Then

   ```bash
   npm run start
   # or
   yarn start
   # or
   pnpm start
   # or
   bun start
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

- Upon initial loading of the application, the user is prompted for a username. After entering the username, it checks if the username is available.
- If the username is already taken, an error message is displayed.
- Otherwise, the user is taken to the home page.

## Home Page Features

- The user can see their username displayed on the top left corner of the page.
- On the top right corner, the user can see all the active users in a dropdown menu. The user can select which user to send messages to from this dropdown.
- In the message input box at the bottom, the user can input messages to send to other users.
- If no user is selected in the dropdown menu, the message is not sent and an error message is displayed.

## Error Handling

- If the selected user is disconnected, an error message is displayed to notify the user.
