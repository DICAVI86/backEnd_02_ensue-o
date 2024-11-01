//importar desde Express y FileSystem
const express = requiere("express");
const fs = requiere("fs");
const path = requiere("path");

const app = express();

//Se sube a servidor 3000
app.listen(3000, console.log("Servidor encendido puerto 3000"));

//Middleware
app.use(express.json());

const index = path.join(__dirname, "index.html");

app.get("/", (req, res) => {
    res.senFile(index);
});

app.get("/canciones", (req, res) => {
    try {
      const canciones = JSON.parse(fs.readFileSync("repertorio.json"));
      res.json(canciones);
    } catch (error) {
      res.status(500).send("Error al leer el repertorio");
    }
  });

  app.post("/canciones", (req, res) => {
    const rep = req.body;
    try {
      const repertorio = JSON.parse(fs.readFileSync("repertorio.json"));
      repertorio.push(rep);
      fs.writeFileSync("repertorio.json", JSON.stringify(repertorio));
      res.send("Canción agregada con éxito!");
    } catch (error) {
      res.status(500).send("Error al agregar la cancion");
    }
  });

  app.put("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const rep = req.body;
    try {
      const repertorio = JSON.parse(fs.readFileSync("repertorio.json"));
      const index = repertorio.findIndex((p) => p.id == id);
  
      if (index === -1) {
        return res.status(404).send("Cancion no encontrada");
      }
  
      repertorio[index] = rep;
      fs.writeFileSync("repertorio.json", JSON.stringify(repertorio));
      res.send("Canción modificada con éxito");
    } catch (error) {
      res.status(500).send("Error al modificar la cancion");
    }
  });

  app.delete("/canciones/:id", (req, res) => {
    const { id } = req.params;
    try {
      const repertorio = JSON.parse(fs.readFileSync("repertorio.json"));
      const index = repertorio.findIndex((p) => p.id == id);
  
      if (index === -1) {
        return res.status(404).send("Cancion no encontrada");
      }
  
      repertorio.splice(index, 1);
      fs.writeFileSync("repertorio.json", JSON.stringify(repertorio));
      res.send("Canción eliminada con éxito");
    } catch (error) {
      res.status(500).send("Error al eliminar la cancion");
    }
  });

  //Middleware error
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Algo salio mal");
  });
