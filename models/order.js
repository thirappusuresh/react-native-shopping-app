import moment from "moment";

class Order {
  constructor(id, items, totalAmount, date, status, address) {
    this.id = id;
    this.items = items;
    this.totalAmount = totalAmount;
    this.date = date;
    this.status = status;
    this.address = address;
  }
  get readableDate() {
    // return this.date.toLocaleDateString("en-EN", {
    //   year: "numeric",
    //   month: "long",
    //   day: "numeric",
    //   hour: "2-digit",
    //   minute: "2-digit"
    // });
    return moment(this.date).format("lll");
  }
}

export default Order;
