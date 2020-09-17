class CartItem {
  constructor(quantity, productPrice, productTitle, sum, productImage, productCategory) {
    this.quantity = quantity;
    this.productPrice = productPrice;
    this.productTitle = productTitle;
    this.sum = sum;
    this.productImage = productImage;
    this.productCategory = productCategory;
  }
}

export default CartItem;
