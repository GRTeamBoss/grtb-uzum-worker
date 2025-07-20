import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore, collection, addDoc, getDoc, updateDoc, deleteDoc, doc, setDoc } from "firebase-admin/firestore"


class API {

  constructor() {
  }
}

export class FirebaseAPI extends API {
  constructor() {
    super()
    this.firebaseConfig = {
      apiKey: process.env["FIREBASE_APIKEY"],
      authDomain: process.env["FIREBASE_AUTHDOMAIN"],
      projectId: process.env["FIREBASE_PROJECTID"],
      storageBucket: process.env["FIREBASE_STORAGEBUCKET"],
      messagingSenderId: process.env["FIREBASE_MESSAGINGSENDERID"],
      appId: process.env["FIREBASE_APPID"],
      measurementId: process.env["FIREBASE_MEASUREMENTID"]
    };
    this.serviceAccount = {
      type: process.env["FIREBASE_TYPE"],
      project_id: process.env["FIREBASE_PROJECT_ID"],
      private_key_id: process.env["FIREBASE_PRIVATE_KEY_ID"],
      private_key: process.env["FIREBASE_PRIVATE_KEY"].replace(/\\n/g, "\n"),
      client_email: process.env["FIREBASE_CLIENT_EMAIL"],
      client_id: process.env["FIREBASE_CLIENT_ID"],
      auth_uri: process.env["FIREBASE_AUTH_URI"],
      token_uri: process.env["FIREBASE_TOKEN_URI"],
      auth_provider_x509_cert_url: process.env["FIREBASE_AUTH_PROVIDER_CERT_URL"],
      client_x509_cert_url: process.env["FIREBASE_CLIENT_CERT_URL"],
      universe_domain: process.env["FIREBASE_UNIVERSE_DOMAIN"]
    };
    if (!getApps().length) {
      initializeApp({credential: cert(this.serviceAccount),});
    } else {
      initializeApp()
    }
    this.firestore = getFirestore();
  }

  async getUser(userId) {
    const userDoc = await this.firestore.collection("users").doc(userId).get();
    if (userDoc.exists) {
      return userDoc.data();
    } else {
      return null;
    }
  }

  async createUser(data) {
    const docRef = await this.firestore.collection("users").doc(data.userId).set(data);
    return docRef.id;
  }

  async updateUser(userId, data) {
    const userRef = await this.firestore.collection("users").doc(userId).update(data);
    return true;
  }

  async deleteUser(userId) {
    const userRef = await this.firestore.collection("users").doc(userId).delete();
    return true;
  }

  async getDetails(detailsId) {
    const detailsRef = collection(this.firestore, "details");
    const detailsDoc = await getDoc(detailsRef, detailsId);
    if (detailsDoc.exists()) {
      return detailsDoc.data();
    } else {
      return null;
    }
  }

  async createDetails(data) {
    const docRef = await setDoc(doc(this.firestore, "details", data.detailsId), data);
    return docRef.id;
  }

  async updateDetails(detailsId, data) {
    const detailsRef = collection(this.firestore, "details");
    await updateDoc(detailsRef, detailsId, data);
    return true;
  }

  async deleteDetails(detailsId) {
    const detailsRef = collection(this.firestore, "details");
    await deleteDoc(detailsRef, detailsId);
    return true;
  }
}


export class UzumAPI extends API {
  constructor(token) {
    super();
    this.token = token || null;
    this.baseUrl = "https://api-seller.uzum.uz/api/seller-openapi/v1";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "Authorization": `${this.token}`
    };
  }

  async getInvoice() {
    const url = `${this.baseUrl}/invoice?page=0&size=100`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders
    });
    if (!res.ok) return null;
    return await res.json();
  }

  async getInvoiceById(invoiceId) {
    const url = `${this.baseUrl}/invoice/${invoiceId}`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders
    });
    if (!res.ok) return null;
    return await res.json();
  }

  async getAllInvoices() {
    let page = 0;
    let result = [];
    const url = `${this.baseUrl}/invoice?page=${page}&size=100`;
    while (true) {
      const res = await fetch(url, {
        method: "GET",
        headers: this.defaultHeaders
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.length > 0) {
        result = result.concat(data);
      } else {
        break;
      }
      page++;
    }
    return result;
  }

  async getReturn() {
    const url = `${this.baseUrl}/return?page=0&size=100`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders
    });
    if (!res.ok) return null;
    return await res.json();
  }

  async getAllReturns() {
    let page = 0;
    let result = [];
    const url = `${this.baseUrl}/return?page=${page}&size=100`;
    while (true) {
      const res = await fetch(url, {
        method: "GET",
        headers: this.defaultHeaders
      });
      if (!res.ok) return null
      const data = await res.json();
      if (data && data.length > 0) {
        result = result.concat(data);
      } else {
        break;
      }
      page++;
    }
    return result;
  }

  async getReturnById(returnId) {
    const url = `${this.baseUrl}/return/${returnId}?page=0&size=100`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders
    });
    if (!res.ok) return null;
    return await res.json();
  }

  async getProductById(productId) {
    const url = `${this.baseUrl}/product/shop/${productId}?page=0&size=100&sortBy=DEFAULT&order=ASC&filter=ALL`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders
    });
    if (!res.ok) throw new Error("Failed to fetch product");
    return await res.json();
  }

  async getPrice(productId) {
    const url = `${this.baseUrl}/product/${productId}/price`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders
    });
    if (!res.ok) throw new Error("Failed to fetch price");
    return await res.json();
  }
}