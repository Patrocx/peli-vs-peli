require('dotenv').config({ path: './.env' });

const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const controller = require('./controllers/competenciasController');
const connection =require('./connectiondb');

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/competencias', controller.obtenerPreguntas);
app.post('/competencias', controller.crearCompetencia);
app.get('/competencias/:id', controller.obtenerCompetencia);
app.put('/competencias/:id', controller.modificarCompetencia);
app.delete('/competencias/:id', controller.borrarCompetencia);
app.get('/competencias/:id/peliculas', controller.obtenerPeliculas);
app.post('/competencias/:id/voto', controller.votarPelicula);
app.get('/competencias/:id/resultados', controller.resultadosCompetencias);
app.delete('/competencias/:id/votos', controller.reiniciarVotacion);
app.get('/genero:1', controller.generos);
app.get('/directores', controller.directores);
app.get('/actores', controller.actores);

const puerto = '8080';
app.listen(puerto, function() {
    console.log('escuchando en el puerto: ' + puerto);
})