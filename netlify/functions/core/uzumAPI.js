class UzumAPI {
  constructor(token) {
    this.token = token || null;
    this.baseUrlv1 = "https://api-seller.uzum.uz/api/seller-openapi/v1";
    this.baseUrlv2 = "https://api-seller.uzum.uz/api/seller-openapi/v2";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "Authorization": `${this.token}`
    };
  }
}

class UzumAPIv1 extends UzumAPI {
  constructor(token) {
    super(token);
    this.baseUrl = this.baseUrlv1;
  }
}

class UzumAPIv2 extends UzumAPI {
  constructor(token) {
    super(token);
    this.baseUrl = this.baseUrlv2;
  }
}

export class UzumAPIDBSv2 extends UzumAPIv2 {

  constructor(token) {
    super(token);
  }

  async getSKUstock() {
    let content = 'DBS SKU Stocks:\n\n';
    const url = `${this.baseUrl}/fbs/sku/stocks`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders
    });
    if (!res.ok) return null;
    res = await res.json();
    if (res.payload.skuAmountList.length === 0) {
      return "You haven't added any SKU stocks yet.";
    } else {
      for (const sku of res.payload.skuAmountList) {
        content += `SKU ID: ${sku.skuId}\nSKU Title: ${sku.skuTitle}\nProduct Title: ${sku.productTitle}\nStock: ${sku.amount}\n\n`;
      }
    }
    return content || "No SKU stocks found.";
  }
}

export class UzumAPIFBSv2 extends UzumAPIv2 {
  constructor(token) {
    super(token);
    this.baseUrl = this.baseUrlv2;
  }
  async getOrders(shopId) {
    let content = 'FBS Order Details:\n\n';
    const url = `${this.baseUrl}/fbs/order?shopIds=${shopId}&status=CREATED&size=50`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders
    });
    if (!res.ok) return null; 
    res = await res.json();
    if (!res.payload || res.payload.orders.length === 0) {
      return "No orders found.";
    }
    for (const order of res.payload.orders) {
      content += `Order ID: ${order.id}\nOrder Status: ${order.status}\nOrder Date: ${order.dateCreated}\nOrder Price: ${order.price}\n\n`;
      for (const item of order.orderItems) {
        content += `Product ID: ${item.productId}\nSKU Title: ${item.skuTitle}\nProduct Color: ${item.productImage.color}\nProduct Price: ${item.sellerPrice}\nClient Price: ${item.purchasePrice}\nAmount: ${item.amount}\n\n`;
      }
      content += "--------------------\n\n"
    }
    return content || "No order details found.";
  }
}

export class UzumAPIShopv1 extends UzumAPIv1 {

  constructor(token) {
    super(token);
  }

  async getShopDetails() {
    let content = 'Shop Details:\n\n';
    const url = `${this.baseUrl}/shops`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders
    });
    if (!res.ok) return "No shop details found.";
    for (const shop of await res.json()) {
      content += `Shop ID: ${shop.id}\nShop Name: ${shop.name}\n\n`;
    }
    return content || "No shop details found.";
  }

  async getShopIds() {
    let content = [];
    const url = `${this.baseUrl}/shops`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders
    });
    if (!res.ok) return null;
    for (const shop of await res.json()) {
      content.push(shop.id);
    }
    return content.length > 0 ? content : null;
  }
}

export class UzumAPIInvoicev1 extends UzumAPIv1 {

  constructor(token) {
    super(token);
  }

  async getInvoice() {
    let content = 'Invoice Details:\n\n';
    const url = `${this.baseUrl}/invoice?page=0&size=50`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders
    });
    if (!res.ok) return null;
    for (const invoice of await res.json()) {
      content += `Invoice ID: ${invoice.id}\nInvoice Date: ${invoice.dateCreated}\nTotal Accepted: ${invoice.totalAccepted}\n\n`;
    }
    return content || "No invoice details found.";
  }

  async getAllInvoices() {
    let page = 0;
    let content = 'Invoice Details:\n\n';
    const url = `${this.baseUrl}/invoice?page=${page}&size=50`;
    while (true) {
      const res = await fetch(url, {
        method: "GET",
        headers: this.defaultHeaders
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.length > 0) {
        for (const invoice of data) {
          content += `Invoice ID: ${invoice.id}\nInvoice Date: ${invoice.dateCreated}\nTotal Accepted: ${invoice.totalAccepted}\n\n`;
        }
      } else {
        break;
      }
      page++;
    }
    return content || "No invoice details found.";
  }

  async getReturn() {
    let content = 'Return Details:\n\n';
    const url = `${this.baseUrl}/return?page=0&size=50`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders
    });
    if (!res.ok) return null;
    res = await res.json();
    for (const item of res) {
      content += `Return ID: ${item.id}\nReturn Date: ${item.dateCreated}\nTotal Amount: ${item.totalAmount}\n\n`;
    }
    return content || "No return details found.";
  }

  async getAllReturns() {
    let page = 0;
    let content = 'Return Details:\n\n';
    const url = `${this.baseUrl}/return?page=${page}&size=50`;
    while (true) {
      const res = await fetch(url, {
        method: "GET",
        headers: this.defaultHeaders
      });
      if (!res.ok) return null
      const data = await res.json();
      if (data && data.length > 0) {
        for (const item of data) {
          content += `Return ID: ${item.id}\nReturn Date: ${item.dateCreated}\nTotal Amount: ${item.totalAmount}\n\n`;
        }
      } else {
        break;
      }
      page++;
    }
    return content || "No return details found.";
  }
}