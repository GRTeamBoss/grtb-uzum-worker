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

  async getRequest(url) {
    const res = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders
    });
    if (!res.ok) return null;
    return await res.json();
  }

  async postRequest(url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: this.defaultHeaders,
      body: JSON.stringify(body)
    });
    if (!res.ok) return null;
    return await res.json();
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

export class UzumDBS extends UzumAPIv2 {
  constructor(token) {
    super(token);
  }

  async getSKUstock() {
    const url = `${this.baseUrl}/fbs/sku/stocks`;
    const res = await this.getRequest(url);
    return res;
  }

  async postSKUstock(data) {
    const url = `${this.baseUrl}/fbs/sku/stocks`;
    const res = await this.postRequest(url, data);
    return res;
  }
}

export class UzumFBSv1 extends UzumAPIv1 {
  constructor(token) {
    super(token);
  }

  async getOrderMetaByID(orderId) {
    const url = `${this.baseUrl}/fbs/order/${orderId}`;
    const res = await this.getRequest(url);
    return res;
  }

  async getOrders(shopIDs, status="CREATED") {
    const url = `${this.baseUrl}/fbs/orders?shopIds=[${shopIDs.join(",")}]&status=${status}`;
    const res = await this.getRequest(url);
    return res;
  }

  async getSKUstocks(shopIDs) {
    const url = `${this.baseUrl}/fbs/sku/stocks?shopIds=[${shopIDs.join(",")}]`;
    const res = await this.getRequest(url);
    return res;
  }

  async postOrderCancelByID(orderId) {
    const url = `${this.baseUrl}/fbs/order/${orderId}/cancel`;
    const res = await this.postRequest(url, {reason: "OUT_OF_STOCK", comment: "Out of stock."});
    return res;
  }

  async postOrderConfirmByID(orderId) {
    const url = `${this.baseUrl}/fbs/order/${orderId}/confirm`;
    const res = await this.postRequest(url, {});
    return res;
  }
}

export class UzumFBSv2 extends UzumAPIv2 {
  constructor(token) {
    super(token);
  }

  async getOrders(shopIDs, status="CREATED", dateFrom=new Date(`01/01/${new Date().getFullYear()}`).getTime(), dateTo=new Date().getTime(), page=0, size=50) {
    const url = `${this.baseUrl}/fbs/orders?shopIds=[${shopIDs.join(",")}]&status=${status}&dateFrom=${dateFrom}&dateTo=${dateTo}&page=${page}&size=${size}`;
    const res = await this.getRequest(url);
    return res;
  }

  async getOrdersCount(shopIDs, status="CREATED", dateFrom=new Date(`01/01/${new Date().getFullYear()}`).getTime(), dateTo=new Date().getTime()) {
    const url = `${this.baseUrl}/fbs/order/count?shopIds=[${shopIDs.join(",")}]&status=${status}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
    const res = await this.getRequest(url);
    return res;
  }

  async getSKUstocks() {
    const url = `${this.baseUrl}/fbs/sku/stocks`;
    const res = await this.getRequest(url);
    return res;
  }

  async postSKUstocks(data) {
    const url = `${this.baseUrl}/fbs/sku/stocks`;
    const res = await this.postRequest(url, data);
    return res;
  }
}

export class UzumFinance extends UzumAPIv1 {
  constructor(token) {
    super(token);
  }

  async getExpenses(shopID, shopIDs, dateFrom=new Date(`01/01/${new Date().getFullYear()}`).getTime(), dateTo=new Date().getTime(), page=0, size=50) {
    const url = `${this.baseUrl}/finance/expenses?shopId=${shopID}&shopIds=[${shopIDs.join(",")}]&dateFrom=${dateFrom}&dateTo=${dateTo}&page=${page}&size=${size}`;
    const res = await this.getRequest(url);
    return res;
  }

  async getOrders(shopIDs, group=false, statuses="TO_WITHDRAW", dateFrom=new Date(`01/01/${new Date().getFullYear()}`).getTime(), dateTo=new Date().getTime(), page=0, size=50) {
    const url = `${this.baseUrl}/finance/orders?shopIds=[${shopIDs.join(",")}]&group=${group}&statuses=${statuses}&dateFrom=${dateFrom}&dateTo=${dateTo}&page=${page}&size=${size}`;
    const res = await this.getRequest(url);
    return res;
  }
}

export class UzumInvoice extends UzumAPIv1 {
  constructor(token) {
    super(token);
  }

  async getInvoice(page=0, size=50) {
    const url = `${this.baseUrl}/invoice?page=${page}&size=${size}`;
    const res = await this.getRequest(url);
    return res;
  }

  async getReturn(returnId, page=0, size=50) {
    const url = `${this.baseUrl}/return/?returnId=${returnId}&page=${page}&size=${size}`;
    const res = await this.getRequest(url);
    return res;
  }

  async getInvoiceByShopId(shopID, page=0, size=50) {
    const url = `${this.baseUrl}/invoice/shop/${shopID}/invoice?page=${page}&size=${size}`;
    const res = await this.getRequest(url);
    return res;
  }

  async getProductsInvoiceByShopId(shopID, invoiceID, page=0, size=50) {
    const url = `${this.baseUrl}/invoice/shop/${shopID}/products?invoiceId=${invoiceID}&shopId=${shopID}&page=${page}&size=${size}`;
    const res = await this.getRequest(url);
    return res;
  }

  async getReturnsByShopId(shopID, page=0, size=50) {
    const url = `${this.baseUrl}/return/shop/${shopID}/returns?shopId=${shopID}&page=${page}&size=${size}`;
    const res = await this.getRequest(url);
    return res;
  }

  async getReturnById(shopID, returnID, page=0, size=50) {
    const url = `${this.baseUrl}/return/shop/${shopID}/return/${returnID}?shopId=${shopID}&returnId=${returnID}&page=${page}&size=${size}`;
    const res = await this.getRequest(url);
    return res;
  }
}

export class UzumProduct extends UzumAPIv1 {
  constructor(token) {
    super(token);
  }

  async getProducts(shopID, searchQuery, productRank, filter="ALL", sortBy="DEFAULT", order="ASC", page=0, size=50) {
    const url = `${this.baseUrl}/product/shop/${shopID}?shopId=${shopID}&searchQuery=${searchQuery}&productRank=${productRank}&filter=${filter}&sortBy=${sortBy}&order=${order}&page=${page}&size=${size}`;
    const res = await this.getRequest(url);
    return res;
  }

  async postProductPrice(shopID, data) {
    const url = `${this.baseUrl}/product/shop/${shopID}/sendPriceData`;
    const res = await this.postRequest(url, data);
    return res;
  }
}

export class UzumShop extends UzumAPIv1 {
  constructor(token) {
    super(token);
  }

  async getShops() {
    const url = `${this.baseUrl}/shops`;
    const res = await this.getRequest(url);
    return res;
  }
}