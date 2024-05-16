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
const directorFlow = require('./flows/director.flow')

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
    name: "Gonzalo",
    description:
      "Hola, soy Gonzalo, especialista en estrategias de marketing digital en Metamorfosis 360. Estoy aquí para ayudarte a destacar tu agencia de viajes en un mercado competitivo, utilizando herramientas avanzadas de SEO, Google Display, y pauta digital en redes como Facebook y TikTok. Mi enfoque está en crear conexiones significativas que transformen la visibilidad de tu negocio en resultados tangibles.",
    flow: vendedorFlow,
  },
  {
    name: "Fernanda",
    description:
      "Saludos, soy Fernanda, tu experta en CRM y automatizaciones en Metamorfosis 360. Mi objetivo es facilitar la automatización de tus procesos de atención al cliente, incluyendo la implementación de chatbots AI y Whatsapp Marketing. Con estos recursos, tu agencia de viajes operará de manera más eficiente, permitiéndote concentrarte en lo que realmente importa: crecer y prosperar.",
    flow: expertoFlow,
  },
  {
    name: "Diego",
    description:
      "Hola, me llamo Diego y soy el director de proyectos en Metamorfosis 360. Comprendo los desafíos únicos que enfrentan las agencias de viajes como la tuya. Estoy aquí para asegurar que cada campaña de marketing digital no solo alcance, sino supere tus expectativas. Con una estrategia personalizada y un enfoque flexible, trabajaremos juntos para asegurar que cada inversión en marketing contribuya al éxito de tu negocio.",
    flow: directorFlow,
  }
])

/**
 * 
 */


const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([
    welcomeFlow,
    vendedorFlow,
    directorFlow,
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
