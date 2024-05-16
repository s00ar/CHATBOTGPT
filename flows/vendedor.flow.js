const { addKeyword } = require("@bot-whatsapp/bot");
/**
 * FLujo Inteligente (va a ser activado por una intencion de una persona o por palabra clave)
 * Flujo de bienvenida
 */
module.exports =  addKeyword('vendedor',{sensitive:true})
.addAction(async (_, {state, flowDynamic}) => {
    const currentState = state.getMyState()
    return flowDynamic(`Hola. Espero que estes teniendo un día genial. Dime tu nombre y consulta para poder asistirte...`)
})
