const Order = require("./Order");

const orderOptions = {
  2: "Noodles and Pasta",
  3: "Rice and Grains",
  4: "Akara, Custard, Milk and Home-made syrup",
  5: "Plantain, Moin-Moin and Fried croacker fish-stew",
  6: "Jollof Rice",
  7: "Beans Porridge, Rosemary Fried Tilapia with Fried Plantain side",
  8: "Swallow, Afang soup and Cow leg",
  9: "Teriyaki Beef Salad and Teriyaki Sauce",
  10: "Sweet Potato Fries, Peppered Coriander Gizmedo with Sweet pepper Dip",
  11: "Yam & Goat Meat Pepper Soup Bowl with Spicy Stir-Fry Cabbage",
  12: "Avocado, Pineapple, and Coconut Milk Smoothie",
  13: "Ice cream",
};

const commandOptions = {
  1: "Place an Order",
  99: "Checkout an Order",
  98: "See Order History",
  97: "See Current Order",
  0: "Cancel Order",
};

class CustomerSession {
  constructor({ io }) {
    this.customer = null;
    this.orders = [];
    this.currentOrder = null;
    this.socket = io;
  }

  emitEvent(event) {
    this.socket.emit(event.eventName, event);
  }

  placeNewOrder() {
    if (!this.currentOrder) {
      this.currentOrder = new Order();
      let message = "Kindly make your choice of Order: <br />";
      for (let key of Object.keys(orderOptions)) {
        message += `${key}- ${orderOptions[key]} <br />`;
      }
      console.log(message);
      return message;
    } else {
      return "Order in progress, want to add more items to your order.";
    }
  }

  displayOptions() {
    let message = "";
    const showOptions = (initial_message, options) => {
      message += initial_message;
      for (let key of Object.keys(options)) {
        message += `${key}- ${options[key]} \n`;
      }
      console.log(message);
    };
    if (!this.currentOrder) {
      showOptions("These are the possible commands: \n", commandOptions);
    } else {
      showOptions("These are the items that you can order: \n", orderOptions);
    }
    return message;
  }

  addItemToCurrentOrder(menuItemNo) {
    if (!this.currentOrder) {
      return "Please place an order to be able to add items to it.";
    } else {
      this.currentOrder.addItemToOrder(orderOptions[menuItemNo]);
      return `Successfully added item to order: ${orderOptions[menuItemNo]}`;
    }
  }

  viewCurrentOrder() {
    const countOccurence = (value, array) => {
      let count = 0;
      for (let item of array) {
        if (item == value) count += 1;
      }
      return count;
    };
    if (!this.currentOrder) {
      return "There is no order in Progress. <br />Kindly input 1 to place an order.";
    }
    let message = "The items in your order are: <br />";
    const orderWithoutDuplicates = new Set(this.currentOrder.items);
    for (let item of Array.from(orderWithoutDuplicates)) {
      message += `${countOccurence(item, this.currentOrder.items)} portion${
        countOccurence(item, this.currentOrder.items) > 1 ? "s" : ""
      } of ${item} <br />`;
    }
    message +=
      "<br />To checkout your order, input 99 <br />To cancel your order, input 0 ";
    return message;
  }

  checkoutOrder() {
    if (!this.currentOrder)
      return "There is no order in Progress to Checkout. <br />To place an order, input 1";
    else {
      this.orders.push(this.currentOrder);
      this.currentOrder = null;
      return "Order Checked Out Successfully. <br />To place a new order, input 1. <br />To See Order History, input 98";
    }
  }

  cancelOrder() {
    if (!this.currentOrder)
      return "You presently don't have any Order. <br />To place an order, input 1.";
    else {
      this.currentOrder = null;
      return "Order Cancelled Successfully!<br />To place a new order, input 1";
    }
  }

  viewOrderHistory() {
    if (this.orders.length == 0)
      return "You've not placed any orders. <br />Input 1 to start placing an order.";
    let message = "";
    let count = 1;
    for (let order of this.orders) {
      message += `Order ${count} <br />`;
      message += order.viewOrder();
      message += "<br /> <br />";
      count += 1;
    }
    console.log(message);
    return message;
  }
}

module.exports = CustomerSession;