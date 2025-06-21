import { Telegraf } from "telegraf"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env["FIREBASE_APIKEY"],
  authDomain: process.env["FIREBASE_AUTHDOMAIN"],
  projectId: process.env["FIREBASE_PROJECTID"],
  storageBucket: process.env["FIREBASE_STORAGEBUCKET"],
  messagingSenderId: process.env["FIREBASE_MESSAGINGSENDERID"],
  appId: process.env["FIREBASE_APPID"],
  measurementId: process.env["FIREBASE_MEASUREMENTID"]
};


const app = initializeApp(firebaseConfig);


const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN


const bot = new Telegraf(TELEGRAM_TOKEN)

bot.start(async ctx => {
  await ctx.reply(`Give me API token to swagger for analyzing\nExample: /api disafjo/fdisajf+sakdpsaf0=`)
})

bot.command("api", async ctx => {
  await ctx.reply("Saved!")
  await ctx.reply("Go to website: https://uzumdashboard.netlify.app")
})


exports.handler = async function(event, context) {
  await bot.handleUpdate(JSON.parse(event.body))
  return {statusCode: 200, body: ""}
}


process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))