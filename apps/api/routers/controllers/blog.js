const { Blog } = require('../../models');

// Create a new blog
const createNewBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to create a blog'
      });
    }
    
    // Check if user has a valid name
    if (!req.user.name) {
      return res.status(400).json({
        success: false,
        message: 'User must have a valid name to create a blog'
      });
    }
    
    const author = req.user.name;
    
    console.log('Creating blog with author:', author);
    console.log('User object:', req.user);
    
    const newBlog = await Blog.create({
      title,
      content,
      author
    });
    
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: newBlog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message
    });
  }
};

// Get all blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: {
        recordStatus: 'LATEST'
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      message: 'Blogs retrieved successfully',
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving blogs',
      error: error.message
    });
  }
};

// Get user-specific blogs
const getUserBlogs = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to view your blogs'
      });
    }
    
    const blogs = await Blog.findAll({
      where: {
        recordStatus: 'LATEST',
        author: req.user.name // Filter by current user's name
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      message: 'User blogs retrieved successfully',
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user blogs',
      error: error.message
    });
  }
};

// Update blog data
const updateBlogData = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;
    
    const blog = await Blog.findByPk(id);
    
    if (!blog || blog.recordStatus === 'DELETED') {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    await blog.update({
      title: title || blog.title,
      content: content || blog.content,
      author: author || blog.author
    });

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating blog',
      error: error.message
    });
  }
};

// Delete blog (soft delete)
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findByPk(id);
    
    if (!blog || blog.recordStatus === 'DELETED') {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    await blog.update({
      recordStatus: 'DELETED'
    });
    
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting blog',
      error: error.message
    });
  }
};

module.exports = {
  createNewBlog,
  getBlogs,
  getUserBlogs,
  updateBlogData,
  deleteBlog
};
