const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const fs = require("fs");
const path = require("path");
const { chat } = require("../services/chatgpt.js");

module.exports =  addKeyword(EVENTS.ACTION)
.addAction(async (ctx, {state, flowDynamic}) => {
    // const currentState = state.getMyState()
    const pathIntro = path.join(__dirname, '/prompts', "promptMarketing.txt");
    const prompt = fs.readFileSync(pathIntro, 'utf-8')

    const answ = await chat(prompt, ctx.body, "")
    return flowDynamic(answ.content)
})
