const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const customerSession = require("./customerSession.js");

const { Server } = require("socket.io");

const io = new Server(server);
const PORT = process.env.PORT || 9000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  const CustomerSession = new customerSession({ io });
  console.log("There has been a connection");
  socket.on("display_options_to_user", () => {
    socket.emit("show_options", CustomerSession.displayOptions());
  });
  socket.on("place_order", () => {
    console.log("An Order was placed");
    socket.emit("order_placed", CustomerSession.placeNewOrder());
  });
  socket.on("add_item_to_order", (menuItem) => {
    socket.emit(
      "item_added_to_order",
      CustomerSession.addItemToCurrentOrder(parseInt(menuItem))
    );
  });
  socket.on("view_order", () => {
    socket.emit("order_viewed", CustomerSession.viewCurrentOrder());
  });
  socket.on("cancel_order", () => {
    socket.emit("order_canceled", CustomerSession.cancelOrder());
  });
  socket.on("checkout_order", () => {
    socket.emit("order_checked_out", CustomerSession.checkoutOrder());
  });
  socket.on("view_order_history", () => {
    socket.emit("order_history_viewed", CustomerSession.viewOrderHistory());
  });
});

server.listen(PORT, () =>
  console.log(`Server is now listening on port ${PORT}...`)
);