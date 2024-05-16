require('dotenv').config()
const {
  createBot,
  createProvider,
  createFlow,
} = require("@bot-whatsapp/bot");

const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MongoAdapter = require("@bot-whatsapp/database/mongo");

const welcomeFlow = require("./flows/welcome.flow");
const introFlow = require('./flows/intro.flow')
const chatbotFlow = require('./flows/chatbot.flow')
const marketingFlow = require('./flows/marketing.flow')

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
    flow: introFlow,
  },
  {
    name: "Fernanda",
    description:
      "Saludos, soy Fernanda, tu experta en CRM y automatizaciones en Metamorfosis 360. Mi objetivo es facilitar la automatización de tus procesos de atención al cliente, incluyendo la implementación de chatbots AI y Whatsapp Marketing. Con estos recursos, tu agencia de viajes operará de manera más eficiente, permitiéndote concentrarte en lo que realmente importa: crecer y prosperar.",
    flow: chatbotFlow,
  },
  {
    name: "Diego",
    description:
      "Hola, me llamo Diego y soy el director de proyectos en Metamorfosis 360. Comprendo los desafíos únicos que enfrentan las agencias de viajes como la tuya. Estoy aquí para asegurar que cada campaña de marketing digital no solo alcance, sino supere tus expectativas. Con una estrategia personalizada y un enfoque flexible, trabajaremos juntos para asegurar que cada inversión en marketing contribuya al éxito de tu negocio.",
    flow: marketingFlow,
  }
])

/**
 * 
 */


const main = async () => {
  const uri = process.env.MONGO_DB_URL;
  const adapterDB = new MongoAdapter({
    dbUri: uri,
    dbName: "StateContextMambo"
  });
  // const uri = process.env.DB_HOST;
  // const dbName = process.env.DB_NAME;
  // const dbUser = process.env.DB_USER;
  // const dbPassword =  process.env.DB_PASSWORD;
  // const dbPort = process.env.DB_PORT;

  // const adapterDB = new MysqlAdapter({
  //   dbUri: uri,
  //   dbName: dbName,
  //   dbUser: dbUser,
  //   dbPassword:  dbPassword,
  //   dbPort: dbPort,
  //   dbTable: "bot_whatsapp",
  //   dbTableMessages: "bot_whatsapp_messages",
  // });
  const adapterFlow = createFlow([
    welcomeFlow,
    introFlow,
    marketingFlow,
    chatbotFlow    
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
