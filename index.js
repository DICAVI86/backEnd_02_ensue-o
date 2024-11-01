// importar desde Express y FileSystem
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Definir ruta al archivo HTML
const index = path.join(__dirname, "index.html");

// Ruta de página inicial
app.get("/", (req, res) => {
    res.sendFile(index);
});

// Ruta para obtener todas las canciones
app.get("/canciones", (req, res) => {
    try {
        const canciones = JSON.parse(fs.readFileSync("repertorio.json"));
        res.json(canciones);
    } catch (error) {
        res.status(500).send("Error al leer el repertorio");
    }
});

// Ruta para agregar una canción
app.post("/canciones", (req, res) => {
    const nuevaCancion = { id: Date.now(), ...req.body };
    try {
        const repertorio = JSON.parse(fs.readFileSync("repertorio.json"));
        repertorio.push(nuevaCancion);
        fs.writeFileSync("repertorio.json", JSON.stringify(repertorio));
        res.send("Cancion agregada con exito");
    } catch (error) {
        res.status(500).send("Error al agregar la cancion");
    }
});

// Ruta para actualizar una canción por ID
app.put("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;
    try {
        const repertorio = JSON.parse(fs.readFileSync("repertorio.json"));
        const index = repertorio.findIndex((p) => p.id == id);

        if (index === -1) {
            return res.status(404).send("Cancion no encontrada");
        }

        repertorio[index] = { ...repertorio[index], ...datosActualizados };
        fs.writeFileSync("repertorio.json", JSON.stringify(repertorio));
        res.send("Canción modificada con éxito");
    } catch (error) {
        res.status(500).send("Error al modificar la cancion");
    }
});

// Ruta para eliminar una canción por ID
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

// Middleware de error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Algo salió mal");
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor encendido en el puerto ${PORT}`);
});
