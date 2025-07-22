import { Telegraf } from "telegraf"

import { FirebaseAPI } from "./core/firebaseAPI.js"
import { UzumAPIShopv1, UzumAPIInvoicev1, UzumAPIDBSv2, UzumAPIFBSv2 } from "./core/uzumAPI.js"


const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN


const bot = new Telegraf(TELEGRAM_TOKEN)
const firebaseAPI = new FirebaseAPI()

bot.start(async ctx => {
  await ctx.reply("Welcome to Uzum Dashboard Bot!\n\n" +
    "This bot allows you to manage your Uzum API tokens and access the dashboard.\n\n" +
    "Use /api command to set your API token.\n" +
    "To get started, please provide your Uzum API token in the format:\n" +
    "`/api your_api_token_here`")
  let createUser = await firebaseAPI.createUser({
    userId: ctx.message.chat.id.toString(),
    username: ctx.message.chat.username || "Unknown",
    firstName: ctx.message.chat.first_name || "Unknown",
    lastName: ctx.message.chat.last_name || "Unknown",
    uzumApiToken: null
  })
  if (createUser === ctx.message.chat.id.toString()) {
    await ctx.reply("User created successfully! Now you can set your API token using the /api command.")
  } else {
    await ctx.reply("User already exists! You can set your API token using the /api command.")
  }
})

bot.command("api", async ctx => {
  await ctx.reply("Analyzing API token...")
  const UzumShopID = await new UzumAPIShopv1(ctx.message.text.split(" ")[1]).getShopIds()
  if (!UzumShopID) {
    await ctx.reply("Invalid API token. Please check your token and try again.")
  } else {
    await firebaseAPI.updateUser(ctx.message.chat.id.toString(), {
      uzumApiToken: ctx.message.text.split(" ")[1] || "",
      uzumShopId: UzumShopID[0] || ""
    })
    await ctx.reply("Saved!")
    await ctx.reply("You can now use the bot to manage your Uzum API tokens and access the dashboard.")
    await ctx.reply("Login to the dashboard at https://uzumdashboard.netlify.app via" + "\n" + "Login: " + ctx.message.chat.id + "\n" + "Password: " + ctx.message.text.split(" ")[1])
  }
})

bot.command("invoice", async ctx => {
  const invoiceId = ctx.message.text.split(" ")[1]
  const UzumAPIToken = await firebaseAPI.getUser(ctx.message.chat.id.toString()).then(user => user.uzumApiToken)
  if (!UzumAPIToken) {
    await ctx.reply("Please set your Uzum API token using the /api command.")
  } else {
    if (!invoiceId) {
      await ctx.reply("Get invoice only first page. Usage: `/invoice all` for all invoices or `/invoice <invoice_id>` for specific invoice.")
      const invoices = await new UzumAPIInvoicev1(UzumAPIToken).getInvoice()
      await ctx.reply(invoices)
    } else if (invoiceId.toLowerCase() === "all") {
      const invoices = await new UzumAPIInvoicev1(UzumAPIToken).getAllInvoices()
      await ctx.reply(invoices)
    } else {
      await ctx.reply("command options are invalid. Usage: `/invoice all` for all invoices or `/invoice`")
    }
  }
})

bot.command("returned", async ctx => {
  const returnId = ctx.message.text.split(" ")[1]
  const UzumAPIToken = await firebaseAPI.getUser(ctx.message.chat.id.toString()).then(user => user.uzumApiToken)
  if (!UzumAPIToken) {
    await ctx.reply("Please set your Uzum API token using the /api command.")
  } else {
    if (!returnId) {
      await ctx.reply("Get return only first page. Usage: `/returned all` for all returns or `/returned <return_id>` for specific return.")
      const returns = await new UzumAPIInvoicev1(UzumAPIToken).getReturn()
      await ctx.reply(returns)
    } else if (returnId.toLowerCase() === "all") {
      const returns = await new UzumAPIInvoicev1(UzumAPIToken).getAllReturns()
      await ctx.reply(returns)
    } else {
      await ctx.reply("command options are invalid. Usage: `/returned all` for all returns or `/returned`")
    }
  }
})

bot.command("sku", async ctx => {
  const UzumAPIToken = await firebaseAPI.getUser(ctx.message.chat.id.toString()).then(user => user.uzumApiToken)
  if (!UzumAPIToken) {
    await ctx.reply("Please set your Uzum API token using the /api command.")
  } else {
    const skus = await new UzumAPIDBSv2(UzumAPIToken).getSKUstock()
    await ctx.reply(skus)
  }
})

bot.command("orders", async ctx => {
  const UzumAPIToken = await firebaseAPI.getUser(ctx.message.chat.id.toString()).then(user => user.uzumApiToken)
  if (!UzumAPIToken) {
    await ctx.reply("Please set your Uzum API token using the /api command.")
  } else {
    const shopId = await firebaseAPI.getUser(ctx.message.chat.id.toString()).then(user => user.uzumShopId)
    if (!shopId) {
      await ctx.reply("Please create a shop for using this command.")
    } else {
      const orders = await new UzumAPIFBSv2(UzumAPIToken).getOrders(shopId)
      await ctx.reply(orders)
    }
  }
})

exports.handler = async function(event, context) {
  await bot.handleUpdate(JSON.parse(event.body))
  return {statusCode: 200, body: ""}
}


process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))