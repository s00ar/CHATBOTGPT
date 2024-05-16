const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

/**
 * Flujo de gestión de proyectos
 */
module.exports = addKeyword(EVENTS.ACTION)
.addAction(async (_, {state, flowDynamic}) =>{
    const currentState = state.getMyState();

    // Dependiendo de la respuesta o consulta del cliente, el director proporciona orientación estratégica
    const response = evaluateProjectStatus(currentState);
    return flowDynamic(response);
});

/**
 * Función para evaluar el estado del proyecto y determinar la respuesta estratégica adecuada
 * @param {Object} currentState - Estado actual de la conversación o proyecto
 * @return {String} - Respuesta personalizada basada en la evaluación del estado del proyecto
 */
function evaluateProjectStatus(currentState) {
    // Ejemplo de lógica para determinar la respuesta en función del estado del proyecto
    if (currentState.projectPhase === 'inicio') {
        return "Estamos en la fase de inicio de tu proyecto. Vamos a definir los objetivos claros y las expectativas.";
    } else if (currentState.projectPhase === 'ejecución') {
        return "Tu proyecto está en plena ejecución. ¿Hay alguna área específica que te gustaría revisar?";
    } else if (currentState.projectPhase === 'finalización') {
        return "Estamos finalizando tu proyecto. Vamos a revisar los entregables y asegurarnos de que todo esté conforme a tus expectativas.";
    } else {
        return "¿Cómo puedo asistirte hoy con respecto a tus proyectos?";
    }
}
