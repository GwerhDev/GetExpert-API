require("dotenv").config();
const { PORT } = require("./config/config");
const server = require("./app");
const db = require("./integrations/mongodb")

async function main() {
  db.connect()
    .then(() => {
      console.log('Conexión exitosa a MongoDB');
      server.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
    })
    .catch((error) => console.error(error));
}

main();
