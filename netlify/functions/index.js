import { Telegraf } from "telegraf"

import { FirebaseAPI, UzumAPI } from "./core/globalAPI.js"


const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN


const bot = new Telegraf(TELEGRAM_TOKEN)

bot.start(async ctx => {
  await ctx.reply("Welcome to Uzum Dashboard Bot!\n\n" +
    "This bot allows you to manage your Uzum API tokens and access the dashboard.\n\n" +
    "Use /api command to set your API token.")
  await ctx.reply("To get started, please provide your Uzum API token in the format:\n" +
    "`/api your_api_token_here`")
  await FirebaseAPI().createUser({
    userId: ctx.message.chat.id,
    username: ctx.message.chat.username || "Unknown",
    firstName: ctx.message.chat.first_name || "Unknown",
    lastName: ctx.message.chat.last_name || "Unknown"
  })
  await ctx.reply("User created! Now you can use the /api command to set your API token.")
})

bot.command("api", async ctx => {
  await ctx.reply("Analyzing API token...")
  await FirebaseAPI().updateUser(ctx.message.chat.id, {
    uzumApiToken: ctx.message.text.split(" ")[1] || ""
  })
  await ctx.reply("Saved!")
  await ctx.reply("You can now use the bot to manage your Uzum API tokens and access the dashboard.")
  await ctx.reply("Login to the dashboard at https://uzumdashboard.netlify.app via" + "\n" + "Login: " + ctx.message.chat.id + "\n" + "Password: " + ctx.message.text.split(" ")[1])
})

bot.command("invoice", async ctx => {
  const invoiceId = ctx.message.text.split(" ")[1]
  const UzumAPIToken = await FirebaseAPI().getUser(ctx.message.chat.id).then(user => user.uzumApiToken)
  if (!UzumAPIToken) {
    await ctx.reply("Please set your Uzum API token using the /api command.")
  } else {
    if (!invoiceId) {
      await ctx.reply("Get invoice only first page. Usage: `/invoice all` for all invoices or `/invoice <invoice_id>` for specific invoice.")
      const invoices = await UzumAPI(UzumAPIToken).getInvoice()
      if (!invoices || invoices.length === 0) {
        await ctx.reply("No invoices found.")
      } else {
        await ctx.reply("Invoices found:\n" + JSON.stringify(invoices, null, 2))
      }
    } else if (invoiceId.toLowerCase() === "all") {
      const invoices = await UzumAPI(UzumAPIToken).getAllInvoices()
      if (!invoices || invoices.length === 0) {
        await ctx.reply("No invoices found.")
      } else {
        await ctx.reply("Invoices found:\n" + JSON.stringify(invoices, null, 2))
      }
    } else if (Number.isInteger(Number(invoiceId))) {
      const invoice = await UzumAPI(UzumAPIToken).getInvoiceById(invoiceId)
      if (!invoice) {
        await ctx.reply("Invoice not found.")
      } else {
        await ctx.reply("Invoice details:\n" + JSON.stringify(invoice, null, 2))
      }
    }
  }
})

bot.command("returned", async ctx => {
  const returnId = ctx.message.text.split(" ")[1]
  const UzumAPIToken = await FirebaseAPI().getUser(ctx.message.chat.id).then(user => user.uzumApiToken)
  if (!returnId) {
    await ctx.reply("Get return only first page. Usage: `/returned all` for all returns or `/returned <return_id>` for specific return.")
    const returns = await UzumAPI(UzumAPIToken).getReturn()
    if (!returns || returns.length === 0) {
      await ctx.reply("No returns found.")
    } else {
      await ctx.reply("Returns found:\n" + JSON.stringify(returns, null, 2))
    }
  } else if (returnId.toLowerCase() === "all") {
    const returns = await UzumAPI(UzumAPIToken).getAllReturns()
    if (!returns || returns.length === 0) {
      await ctx.reply("No returns found.")
    } else {
      await ctx.reply("Returns found:\n" + JSON.stringify(returns, null, 2))
    }
  } else if (Number.isInteger(Number(returnId))) {
    const returned = await UzumAPI(UzumAPIToken).getReturnById(returnId)
    if (!returned) {
      await ctx.reply("Return not found.")
    } else {
      await ctx.reply("Return details:\n" + JSON.stringify(returned, null, 2))
    }
  }
})


exports.handler = async function(event, context) {
  await bot.handleUpdate(JSON.parse(event.body))
  return {statusCode: 200, body: ""}
}


process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))