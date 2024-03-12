const BlogPost = require('../../model/userModel/blogModel');

//--------------------------------------------------------- Add a new blog post------------------------------------------------------//
const addBlogPost = async (req, res) => {
  try {
    const { author, title, content, topic } = req.body;
    const blogPost = new BlogPost({ author, title, content, topic });
    await blogPost.save();
    res.json({ message: 'Blog post added successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ---------------------------------------------------------Get all blog posts-------------------------------------------------------//
const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().sort({ date_posted: -1 });
    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//------------------------------------------------ Get a specific blog post by ID-------------------------------------------------//
const getBlogPostById = async (req, res) => {
    try {
      const postId = req.params.id;
  
      // Find the blog post by ID
      const blogPost = await BlogPost.findById(postId);
  
      // Check if the blog post exists
      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found!' });
      }
  
      // Increment the views field
      blogPost.views += 1;
      await blogPost.save();
  
      res.json(blogPost);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
//------------------------------------------------- Update a specific blog post by ID ---------------------------------------------//
const updateBlogPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { author, title, content, topic } = req.body;

    // Find the blog post by ID and update its fields
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      postId,
      { author, title, content, topic },
      { new: true }
    );

    // Check if the blog post exists
    if (!updatedBlogPost) {
      return res.status(404).json({ error: 'Blog post not found!' });
    }

    res.json(updatedBlogPost);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//------------------------------------------------- Delete a specific blog post by ID ---------------------------------------------//
const deleteBlogPost = async (req, res) => {
    try {
      const postId = req.params.id;
  
      // Find the blog post by ID and delete it
      const deletedBlogPost = await BlogPost.findByIdAndDelete(postId);
  
      // Check if the blog post exists
      if (!deletedBlogPost) {
        return res.status(404).json({ error: 'Blog post not found!' });
      }
  
      res.json({ message: 'Blog post deleted successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  

module.exports = {
  getAllBlogPosts,
  getBlogPostById,
  addBlogPost,
  updateBlogPost,
  deleteBlogPost,
  //getBlogPostByTitle
};
