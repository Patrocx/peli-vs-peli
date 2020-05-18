const connection = require('../connectiondb');

function obtenerPreguntas(req, res) {
    let sql = 'SELECT * FROM cuestionario'
    connection.query(sql, function(error, results, fields) {
        if (error) {
            return res.status(500).send(JSON.stringify(error))
        }
        if (results == '') {
            return res.status(404).send('Hubo un error. No se encontro el archivo')
        }
        res.send(JSON.stringify(results));
    })
}

function obtenerPeliculas(req, res) {

    let id = req.params.id.toString();
    let sql = 'SELECT * FROM cuestionario WHERE id =' + id;
    connection.query(sql, function(error, results, fields) {
        const response = {
            nombre: '',
            genero_nombre: '',
            director_nombre: '',
            actor_nombre: '',
            competencia: '',
            peliculas: ''
        }
        if (error) {
            return res.status(500).send(JSON.stringify(error))
        }
        if (results[0] == undefined) {
            return res.status(404);
        }
        response.competencia = results[0].nombre;
        response.genero_nombre = results[0].genero_nombre;
        response.director_nombre = results[0].director_nombre;
        response.actor_nombre = results[0].actor_nombre;
        

        let genero_id;
        let actor_id;
        let where = ' WHERE ';
        if (response.genero_nombre != null) {
            sql = "SELECT * FROM genero WHERE genero.nombre = '" + response.genero_nombre + "'";
            connection.query(sql, function(error, results, fields) {
                if(error) {
                    return res.status(500).send(JSON.stringify(error))
                }
                genero_id = results[0].id;
                sql = 'SELECT * FROM pelicula WHERE genero_id = ' + genero_id + ' ORDER BY RAND() LIMIT 2';
                buscarPelicula(sql);
            })
        }
        if (response.director_nombre != null) {
            where = where + "director = '" + response.director_nombre + "'";
            sql = "SELECT * FROM pelicula WHERE director = '" + response.director_nombre + "'";
            sql = sql + ' ORDER BY RAND() LIMIT 2';
            buscarPelicula(sql);
        }
        if (response.actor_nombre != null) {
            sql = "SELECT * FROM actor WHERE actor.nombre = '" + response.actor_nombre + "'";
            connection.query(sql, function(error, results, fields) {
                if(error) {
                    return res.status(500).send(JSON.stringify(error))
                }
                actor_id = results[0].id;
                let inner = ' inner join actor_pelicula on pelicula_id = pelicula.id'
                inner = inner + where + 'actor_id = ' + actor_id;
                sql = "SELECT pelicula.id, pelicula.titulo, pelicula.poster FROM pelicula inner join actor_pelicula on pelicula_id = pelicula.id WHERE actor_id = " + actor_id;
                sql = sql + ' ORDER BY RAND() LIMIT 2';
                buscarPelicula(sql);
            })
        }
        if (response.genero_nombre == null && response.director_nombre == null && response.actor_nombre == null){
            sql = 'SELECT * FROM pelicula ORDER BY RAND() LIMIT 2';
            buscarPelicula(sql);
        }

        function buscarPelicula(sqlParam){
            connection.query(sqlParam, function(error, results, fields) {
                if (error) {
                    return res.status(500).send(JSON.stringify(error))
                }
                response.peliculas = results
                res.send(JSON.stringify(response));
            })
        }
    })
}

function votarPelicula(req, res) {
    let pelicula_id = req.body.idPelicula.toString();
    let cuestionario_id = req.params.id.toString();
    let sql = 'SELECT * FROM pelicula WHERE id = '+ pelicula_id;
    connection.query(sql, function(error, results, fields) {
        if (error) {
            return res.status(500).send(JSON.stringify(error))
        }
        if (results[0] == undefined) {
            return res.status(404)
        }

        sql = 'SELECT * FROM cuestionario WHERE id = '+ cuestionario_id;
        connection.query(sql, function(error, results, fields) {
            if (error) {
                return res.status(500).send(JSON.stringify(error))
            }
            if (results[0] == undefined) {
                return res.status(404)
            }
            sql = 'INSERT INTO votos (cuestionario_id, pelicula_id) VALUES (?, ?)'
            connection.query(sql, [cuestionario_id, pelicula_id], function(error, results, fields) {
                if (error) {
                    return res.status(500).send(JSON.stringify(error))
                }
                res.send(JSON.stringify(results));
            })
        })
    })
}

function resultadosCompetencias(req, res) {
    let competencia_id = req.params.id.toString();
    let sql = 'SELECT * FROM cuestionario WHERE id= ' + competencia_id;
    const response = {
        competencia: '',
        resultados: []
    }
    connection.query(sql, function(error, results, fields) {
        if (error) {
            return res.status(500).send(JSON.stringify(error))
        }
        if (results[0] == undefined) {
            return res.status(404)
        }
        response.competencia = results[0].nombre
        sql = 'SELECT cuestionario_id, pelicula_id, titulo, poster, COUNT(pelicula_id) as votos FROM votos INNER JOIN pelicula ON votos.pelicula_id = pelicula.id GROUP BY pelicula_id HAVING cuestionario_id = ';
        sql = sql + competencia_id + ' ORDER BY votos desc LIMIT 3';
        connection.query(sql, function(error, results, fields) {
            if (error) {
                return res.status(500).send(JSON.stringify(error))
            }
            if (results[0] == undefined) {
                return res.status(404)
            }
            response.resultados= results;
            res.send(JSON.stringify(response));
        });
    });
};

function generos(req, res) {
    let sql = 'SELECT * FROM genero';
    connection.query(sql, function(error, results, fields) {
        if (error) {
            return res.status(500).send(JSON.stringify(error))
        }
        if (results[0] == undefined) {
            return res.status(404)
        }
        let response = results;
        res.send(JSON.stringify(response))
    });
}

function directores(req, res) {
    let sql = 'SELECT * FROM director';
    connection.query(sql, function(error, results, fields) {
        if (error) {
            return res.status(500).send(JSON.stringify(error))
        }
        if (results[0] == undefined) {
            return res.status(404)
        }
        let response = results;
        res.send(JSON.stringify(response));
    });
}

function actores(req, res) {
    let sql = 'SELECT * FROM actor';
    connection.query(sql, function(error, results, fields) {
        if (error) {
            return res.status(500).send(JSON.stringify(error))
        }
        if (results[0] == undefined) {
            return res.status(404)
        }
        let response = results;
        res.send(JSON.stringify(response));
    })
}

function crearCompetencia(req, res) {
    
    const nombre = req.body.nombre;
    const genero = req.body.genero === '0' ? null : req.body.genero;
    const director = req.body.director === '0' ? null : req.body.director;
    const actor = req.body.actor === '0' ? null : req.body.actor;

    if (nombre != '') {

        let nombre_genero = null;
        let nombre_director = null;
        let nombre_actor = null;
        let where = ' WHERE ';

        if(genero != null){    
            let sql = 'SELECT * FROM genero WHERE id = ' + genero;
            connection.query(sql, function(error, results, filds) {
                if (error) {
                    return res.status(500).send(JSON.stringify(error))
                }
                nombre_genero = results[0].nombre;
                where = where + 'genero_id = ' + genero;
            })
        }

        if(director != null){
            sql = 'SELECT * FROM director WHERE id = ' + director;
            connection.query(sql, function(error, results, filds) {
                if (error) {
                    return res.status(500).send(JSON.stringify(error))
                }
                nombre_director = results[0].nombre;

                if (genero != null){
                    where = where + ' AND' + " director = '" + nombre_director + "'";
                } else {
                    where = where + " director = '" + nombre_director + "'";
                }
            });
        }

        if(actor != null){
            sql = 'SELECT * FROM actor WHERE id = ' + actor;
            connection.query(sql, function(error, results, filds) {
                if (error) {
                    return res.status(500).send(JSON.stringify(error))
                }
                nombre_actor = results[0].nombre;
                if (genero != null || director != null) {
                    where = where + ' AND' + ' actor_id = ' + actor
                } else {
                    where = where + ' actor_id = ' + actor;
                }
            });
        } 

        sql = "SELECT nombre FROM cuestionario WHERE cuestionario.nombre LIKE '%";
        sql = sql + nombre + "%'";
        connection.query(sql, function(error, results, fields) {
            if (error) {
                return res.status(500).send(JSON.stringify(error))
            }
            if (results[0] != undefined) {
                return res.status(422).send(JSON.stringify('Hubo un error!!! (422)'))
            }
            sql = 'SELECT * FROM pelicula JOIN actor_pelicula on pelicula.id = pelicula_id JOIN actor ON actor.id = actor_id'
            sql = sql + where;
            connection.query(sql, function(error, results, fields) {
                if (error) {
                    return res.status(500).send(JSON.stringify(error))
                }
                if (results[0] == undefined) {
                    return res.status(422).send(JSON.stringify('Hubo un error!!! (422)'))
                }
                sql = 'INSERT INTO cuestionario (nombre, genero_nombre, director_nombre, actor_nombre) VALUES (?,?,?,?)';
                connection.query(sql, [nombre, nombre_genero, nombre_director, nombre_actor], function(error, results, fields) {
                if (error) {
                    return res.status(500).send(JSON.stringify(error))
                }
                    res.send(JSON.stringify(results));
                });
            });
        });
    } else {
        return res.status(422).send(JSON.stringify("Hubo un error 422"))
    }
};


function obtenerCompetencia(req, res) {
    let competencia_id = req.params.id.toString();
    let sql = 'SELECT * FROM cuestionario WHERE id = ' + competencia_id;
    connection.query(sql, function(error, results, fields) {
        if (error) {
            return res.status(500).send(JSON.stringify(error))
        }
        if (results[0] == undefined) {
            return res.status(404)
        }
        res.send(JSON.stringify(results[0]));
    })
}

function reinciarVotacion(req, res) {
    let competencia_id = req.params.id.toString();
    let sql = 'SELECT * FROM cuestionario WHERE id = ' + competencia_id;
    connection.query(sql, function(error, results, fields) {
        if (error) {
            return res.status(500).send(JSON.stringify(error))
        }
        if (results[0] == undefined) {
            return res.status(422).send(JSON.stringify('Hubo un error!!! (422)'));
        }
        sql = 'DELETE FROM votos WHERE cuestionario_id = '+ competencia_id;
        connection.query(sql,function(error, results, fields) {
            if (error) {
                return res.status(500).send(JSON.stringify(error))
            }
            res.send(JSON.stringify(results));
        })
    })
}

function borrarCompetencia(req, res) {

    let competencia_id = req.params.id.toString();
    let sql = 'SELECT * FROM cuestionario WHERE id = '+ competencia_id;
    connection.query(sql, function(error, results, fields) {
        if (error) {
            return res.status(500).send(JSON.stringify(error))
        }
        if (results[0] == undefined) {
            return res.status(404).send(JSON.stringify('Hubo un error!!! (404)'));
        }
        sql = 'SELECT * FROM votos WHERE cuestionario_id = ' + competencia_id;
        connection.query(sql, function(error, results, fields) {
            if (error) {
                return res.status(500).send(JSON.stringify(error))
            }
            if (results[0] == undefined) {
                borrar(competencia_id);
            }
            sql = 'delete from votos where cuestionario_id= ' + competencia_id;
            connection.query(sql, function(error, results, fields) {
                if (error) {
                    return res.status(500).send(JSON.stringify(error))
                }
                borrar(competencia_id);
            })
        })
    })
    function borrar(id){
        sql = 'DELETE FROM cuestionario WHERE id = '+ id;
        connection.query(sql, function(error, results, fields) {
            if (error) {
                return res.status(500).send(JSON.stringify(error))
            }
            res.send(JSON.stringify(results));
        })
    }
}

function modificarCompetencia(req, res) {
    let nombreNuevo = req.body.nombre;
    let competencia_id = req.params.id.toString();
    let sql = "UPDATE cuestionario SET nombre = '" + nombreNuevo + "' WHERE id = " + competencia_id;
    connection.query(sql, function(error, results, fields) {
        if (error) {
            return res.status(500).send(JSON.stringify(error))
        }
        res.send(JSON.stringify(results));
    })
}

module.exports = {
    obtenerPreguntas: obtenerPreguntas,
    obtenerPeliculas : obtenerPeliculas,
    votarPelicula: votarPelicula,
    resultadosCompetencias: resultadosCompetencias,
    crearCompetencia: crearCompetencia,
    generos: generos,
    directores: directores,
    actores: actores,
    reiniciarVotacion: reinciarVotacion,
    obtenerCompetencia: obtenerCompetencia,
    borrarCompetencia: borrarCompetencia,
    modificarCompetencia: modificarCompetencia
}