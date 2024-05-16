require('dotenv').config()
const {
  createBot,
  createProvider,
  createFlow,
} = require("@bot-whatsapp/bot");

const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");

const welcomeFlow = require("./flows/welcome.flow");
const vendedorFlow = require('./flows/vendedor.flow')
const expertoFlow = require('./flows/experto.flow')
// const pagarFlow = require('./flows/pagar.flow')

const {init} = require('bot-ws-plugin-openai');
const ServerAPI = require('./http');
/**
 * Configuracion de Plugin
 */
const employeesAddonConfig = {
  model: "gpt-3.5-turbo-16k",
  temperature: 0,
  apiKey: process.env?.OPENAI_API_KEY,
};
const employeesAddon = init(employeesAddonConfig);

employeesAddon.employees([
  {
    name: "EMPLEADO_VENDEDOR",
    description:
    "Hola, soy Gonzalo, tu asesor de confianza en Metamorfosis 360. Estoy aquí para ayudarte si estás interesado en nuestros servicios de Google Ads o soluciones técnicas para desarrollo de sitios web, aplicaciones de escritorio o móviles, utilizando tecnologías como Node.js, React.js y JavaScript. O incluso si tienes preguntas sobre cómo podemos ayudar a crecer tu negocio. Mi enfoque es proporcionarte respuestas claras y rápidas para asegurar una excelente experiencia de servicio.",
  flow: vendedorFlow,
  },
  {
    name: "EMPLEADO_EXPERTO",
    description:
    "Saludos, soy Fernanda, la experta en marketing digital de Metamorfosis 360. Me especializo en optimizar y automatizar las estrategias de marketing, facebook, tiktok y otras redes sociales para negocios como el tuyo. Estoy aquí para resolver cualquier duda que tengas sobre nuestros cursos y servicios, diseñados específicamente para potenciar las ventas y el crecimiento de tu empresa. Te ofreceré respuestas precisas para maximizar tu comprensión y aplicabilidad de nuestras soluciones.",
  flow: expertoFlow,
  }
  // ,
  // {
  //   name: "CEO",
  //   description:
  //     "Saludos, mi nombre es Diego. Soy el CEO de Metamorfosis 360 y me encargo de asistir en casos que requieran un conocimiento intrinseco sobre nuestros sistemas, procesos y en los cuales se requiere un manejo extremo de know-how de negocios.",
  //   flow: pagarFlow,
  // }
])

/**
 * 
 */


const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([
    welcomeFlow,
    vendedorFlow,
    // pagarFlow,
    expertoFlow    
  ]);
  
  const adapterProvider = createProvider(BaileysProvider);

  const httpServer = new ServerAPI(adapterProvider, adapterDB)

  const configBot = {
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  }

  const configExtra = {
    extensions:{
      employeesAddon
    }
  }

  await createBot(configBot,configExtra);
  httpServer.start()
};

main();
