const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const express = require("express");
const app = express();
const cors = require("cors");
const route = require("./routes/router");
const port = 3000;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start(); // Ensure that Apollo Server is started

  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  server.applyMiddleware({ app, path: "/api/graphql" }); //by default it will be /graphql if you not added path

  app.use(route);

  app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Error starting the server:", error);
});
