const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();
const port = 3000;

// Middleware for parsing JSON
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://mdsaadsyed29:CEfAFK57sHdjfE7a@cluster0.1nayux7.mongodb.net/musicdb?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('MongoDB connection error: ', err));

// Define the Song schema
const songSchema = new mongoose.Schema({
    Songname: String,
    Film: String,
    Music_director: String,
    Singer: String,
    Actor: { type: String, default: '' },
    Actress: { type: String, default: '' }
});

// Create a model based on the schema
const Song = mongoose.model('Song', songSchema);

// Home route
app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>Music App</title>
        </head>
        <body>
          <h1>Music App</h1>
          <a href="/songs">View Songs</a>
        </body>
      </html>
    `);
});

// Task a: Insert 5 song documents
app.get('/add-songs', async (req, res) => {
    const songs = [
        { Songname: "Song 1", Film: "Film 1", Music_director: "Director 1", Singer: "Singer 1" },
        { Songname: "Song 2", Film: "Film 2", Music_director: "Director 2", Singer: "Singer 2" },
        { Songname: "Song 3", Film: "Film 3", Music_director: "Director 3", Singer: "Singer 3" },
        { Songname: "Song 4", Film: "Film 4", Music_director: "Director 4", Singer: "Singer 4" },
        { Songname: "Song 5", Film: "Film 5", Music_director: "Director 5", Singer: "Singer 5" }
    ];

    try {
        await Song.insertMany(songs);
        res.send("Songs added successfully!");
    } catch (error) {
        console.log("Error adding songs:", error);
        res.status(500).send("Error adding songs.");
    }
});

// Task b: Display total count of documents and list all songs
app.get('/songs', async (req, res) => {
    try {
        const songCount = await Song.countDocuments();
        const songs = await Song.find();
        console.log("Songs fetched: ", songs);
        res.send(`
          <html>
            <head><title>Songs List</title></head>
            <body>
              <h1>Total Songs Count: ${songCount}</h1>
              <table border="1">
                <tr>
                  <th>Song Name</th>
                  <th>Film Name</th>
                  <th>Music Director</th>
                  <th>Singer</th>
                  <th>Actor</th>
                  <th>Actress</th>
                </tr>
                ${songs.map(song => `
                  <tr>
                    <td>${song.Songname}</td>
                    <td>${song.Film}</td>
                    <td>${song.Music_director}</td>
                    <td>${song.Singer}</td>
                    <td>${song.Actor}</td>
                    <td>${song.Actress}</td>
                  </tr>`).join('')}
              </table>
            </body>
          </html>
        `);
    } catch (error) {
        console.error("Error fetching songs:", error);
        res.status(500).send("Error fetching songs.");
    }
});

// Task c: List songs by a specified Music Director
app.get('/songs/music-director/:director', async (req, res) => {
    const director = req.params.director;
    try {
        const songs = await Song.find({ Music_director: director });
        res.json(songs);
    } catch (error) {
        console.error("Error fetching songs by director:", error);
        res.status(500).send("Error fetching songs by director.");
    }
});

// Task d: List songs by a specified Music Director and Singer
app.get('/songs/music-director/:director/singer/:singer', async (req, res) => {
    const director = req.params.director;
    const singer = req.params.singer;
    try {
        const songs = await Song.find({ Music_director: director, Singer: singer });
        res.json(songs);
    } catch (error) {
        console.error("Error fetching songs by director and singer:", error);
        res.status(500).send("Error fetching songs by director and singer.");
    }
});

// Task e: Delete a song you don't like
app.delete('/delete-song/:songId', async (req, res) => {
    const songId = req.params.songId;
    try {
        await Song.findByIdAndDelete(songId);
        res.send("Song deleted successfully!");
    } catch (error) {
        console.error("Error deleting song:", error);
        res.status(500).send("Error deleting song.");
    }
});

// Task f: Add a new favorite song
app.post('/add-favorite-song', async (req, res) => {
    const { Songname, Film, Music_director, Singer, Actor, Actress } = req.body;
    const newSong = new Song({ Songname, Film, Music_director, Singer, Actor, Actress });
    try {
        await newSong.save();
        res.send("Favorite song added!");
    } catch (error) {
        console.error("Error adding favorite song:", error);
        res.status(500).send("Error adding favorite song.");
    }
});

// Task g: List Songs sung by a specified Singer in a specified film
app.get('/songs/singer/:singer/film/:film', async (req, res) => {
    const singer = req.params.singer;
    const film = req.params.film;
    try {
        const songs = await Song.find({ Singer: singer, Film: film });
        res.json(songs);
    } catch (error) {
        console.error("Error fetching songs by singer and film:", error);
        res.status(500).send("Error fetching songs by singer and film.");
    }
});

// Task h: Update the song document by adding Actor and Actress names
app.put('/update-song/:songId', async (req, res) => {
    const songId = req.params.songId;
    const { Actor, Actress } = req.body;
    try {
        await Song.findByIdAndUpdate(songId, { Actor, Actress });
        res.send("Song updated successfully!");
    } catch (error) {
        console.error("Error updating song:", error);
        res.status(500).send("Error updating song.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
