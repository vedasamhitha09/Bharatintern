const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3003;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/myblog', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Function to generate a random hex color
function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// MongoDB Schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  backgroundColor: String, // Add a new field for background color
});

const Post = mongoose.model('Post', postSchema);

// Routes
app.get('/', async (req, res) => {
  const posts = await Post.find();
  res.render('index', { posts });
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', async (req, res) => {
  const { title, content } = req.body;
  const newPost = new Post({ title, content, backgroundColor: generateRandomColor() });
  await newPost.save();
  res.redirect('/');
});

// Add a new route for deleting posts
app.delete('/delete/:postId', async (req, res) => {
  const { postId } = req.params;
  await Post.findByIdAndDelete(postId);
  res.sendStatus(200);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
