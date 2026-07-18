const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const BLOGS_FILE = path.join(__dirname, 'blogs-data.json');

app.use(express.json());
app.use(express.static(__dirname));

// Helper to read blogs
function readBlogs() {
  if (!fs.existsSync(BLOGS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(BLOGS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

// Helper to write blogs
function writeBlogs(blogs) {
  fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), 'utf8');
}

// Get all blogs
app.get('/api/blogs', (req, res) => {
  res.json(readBlogs());
});

// Add a new blog (requires password)
const BLOG_POST_PASSWORD = process.env.BLOG_POST_PASSWORD || 'changeme';
app.post('/api/blogs', (req, res) => {
  const { title, content, password } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Missing title or content' });
  if (!password || password !== BLOG_POST_PASSWORD) return res.status(401).json({ error: 'Incorrect password' });
  const blogs = readBlogs();
  const newBlog = { title, content, date: new Date().toISOString() };
  blogs.push(newBlog);
  writeBlogs(blogs);
  res.status(201).json(newBlog);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
