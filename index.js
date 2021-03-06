const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');


// Initialise postgres client
const configs = {
  user: 'ishak',
  host: '127.0.0.1',
  database: 'tunr_db',
  port: 5432,
};

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(express.static(__dirname+'/public/'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(methodOverride('_method'));


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Routes for Artist
 * ===================================
 */

//Display all Artists_The Index Feature
app.get('/artists/', (request, response) => {

    const queryText = `SELECT * FROM artists ORDER BY id ASC`;                                        // query database for All Artists

    pool.query(queryText, (err, queryResult)=>{
        if(err){
            console.log("Error occured " + err);
        } else {
            response.render('home', {artists:queryResult.rows});
        }
    });
});

//Create New Artist Form_The Create Feature
app.get('/artist/new', (request, response) => {
  // respond with HTML page with form to create new Artist
  response.render('create-artist-form');
});

app.post('/artist',(request,response)=>{
    const body = request.body;

    const queryText = `INSERT INTO artists (name,photo_url,nationality) VALUES ($1, $2, $3)`;

    const values = [body.name, body.photo, body.nationality];

     pool.query(queryText, values, (err, queryResult)=>{
        if(err){
            console.log("Error occured " + err);
        } else {
            response.render('artist-created', {new:body});
        }
    });
});

//Show individual Artist_ The Show Feature
app.get('/artist/:id', (request, response) => {
  // respond with HTML page show individual Artists
    const artistId = request.params.id;                                               //get the input of :id
    const queryTextArtists = `SELECT * FROM artists where id = ${artistId}`;         //query from Artist where id is input of :id

    pool.query(queryTextArtists, (err, queryArtistsResult)=>{                       //a callback within a callback, query Artist
        if (err){
            console.log("Error occured " + err);
        } else {
            const result = queryArtistsResult.rows;
            response.render('show-each-artist', {artist:result});
        }
    });
});


//Edit Artist Form
app.get('/artist/:id/edit', (request, response) => {

    const artistId = request.params.id;
    const queryText = `SELECT * FROM artists where id = ${artistId}`;

    pool.query(queryText, (err, queryResult)=>{
        if(err){
            console.log("Error occured " + err);
        } else {
            const result = queryResult.rows;
            response.render('edit-artist',{artist:result});
        }
    });
});

app.put('/artist/:id', (request, response) => {
    // respond with HTML page with form to create new Artist
    const artistId = request.params.id;
    const body = request.body;
    const queryText = `UPDATE artists SET name = '${body.name}',photo_url = '${body.photo_url}',nationality = '${body.nationality}' WHERE id = ${artistId}`;

        pool.query(queryText,(err,queryResult)=>{
            if (err) {
                console.log("Error occured" + err);
            } else {
                response.render ('updated-artist');
            }
        });
});


app.delete('/artist/:id', (request, response) => {

    const artistId = request.params.id;
    const queryText = `DELETE FROM artists WHERE id = ${artistId}`;

    pool.query(queryText,(err,queryResult)=> {
        if (err) {
            console.log("Error occured " + err);
        } else {
            response.render('deleted-artist');
        }
    });

});





/**
 * ===================================
 * Routes for Songs
 * ===================================
 */

//Display all Songs_The Index Feature
app.get('/songs/', (request, response) => {

    const queryText = `SELECT * FROM songs ORDER BY title ASC`;                                        // query database for All Artists

    pool.query(queryText, (err, queryResult)=>{
        if(err){
            console.log("Error occured " + err);
        } else {
            response.render('all-songs', {songs:queryResult.rows});
        }
    });
});

//Create New Song Form_The Create Feature
app.get('/song/new', (request, response) => {
  // respond with HTML page with form to create new Artist
  response.render('create-song-form');
});

app.post('/song',(request,response)=>{

    const queryText = `INSERT INTO songs (title,album,preview_link,artwork,artist_id) VALUES ($1, $2, $3, $4, $5)`;

    const values = [body.title, body.album, body.preview_link, body.artwork, body.artist_id];

     pool.query(queryText, values, (err, queryResult)=>{
        if(err){
            console.log("Error occured " + err);
        } else {
            response.render('song-created', {new:body});
        }
    });
});


//Show Songs Artist_Id_ The Show Feature
app.get('/songs/:id', (request, response) => {
  // respond with HTML page show individual Artists
    const artistId = request.params.id;                                               //get the input of :id
    const queryTextArtists = `SELECT * FROM songs WHERE artist_id = ${artistId}`;         //query from Artist where id is input of :id

    pool.query(queryTextArtists, (err, queryArtistsResult)=>{                       //a callback within a callback, query Artist
        if (err){
            console.log("Error occured " + err);
        } else {
            const result = queryArtistsResult.rows;
            response.render('songs-byArtistId', {artist:result});
        }
    });
});


//Edit Song Form
app.get('/song/:id/edit', (request, response) => {

    const songId = request.params.id;
    const queryText = `SELECT * FROM songs WHERE id = '${songId}'`;

    pool.query(queryText, (err, queryResult)=>{
        if(err){
            console.log("Error occured " + err);
        } else {
            const result = queryResult.rows;

            response.render('edit-song',{song:result});
        }
    });
});


app.put('/song/:id', (request, response) => {
    // respond with HTML page with form to create new Artist
    const songId = request.params.id;
    const body = request.body;
    const queryText = `UPDATE songs SET title = '${body.title}',album = '${body.album}',preview_link = '${body.preview_link}',artwork = '${body.artwork}', artist_id = '${body.artist_id}' WHERE id =${songId}`;

        pool.query(queryText,(err,queryResult)=>{
            if (err) {
                console.log("Error occured" + err);
            } else {
                response.render ('updated-songs');
            }
        });
});

app.delete('/song/:id', (request, response) => {

    const artistId = request.params.id;
    const queryText = `DELETE FROM songs WHERE id = ${artistId}`;

    pool.query(queryText,(err,queryResult)=> {
        if (err) {
            console.log("Error occured " + err);
        } else {
            response.render('deleted-artist');
        }
    });

});


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));

let onClose = function(){

  console.log("closing");

  server.close(() => {

    console.log('Process terminated');

    pool.end( () => console.log('Shut down db connection pool'));
  })
};

process.on('SIGTERM', onClose);
process.on('SIGINT', onClose);