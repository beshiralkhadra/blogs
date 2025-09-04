const router = require('express').Router();
const {
  createNewBlog,
  getBlogs,
  getUserBlogs,
  updateBlogData,
  deleteBlog,
} = require('../controllers/blog');
const auth = require('../../middlewares/auth');

// create new blog (protected)
router.post('/blogs', auth, createNewBlog);
// get blogs
router.get('/blogs', getBlogs);
// get user-specific blogs (protected)
router.get('/user-blogs', auth, getUserBlogs);
// get single blog (currently returns all; TODO: implement getById)
router.get('/blogs/:id', getBlogs);
// update blog (protected)
router.put('/blogs/:id', auth, updateBlogData);
// delete blogs (protected)
router.delete('/blogs/:id', auth, deleteBlog);

module.exports = router;


