import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs }) => {

  const [showDetails, setShowDetails] = useState(false)

  const btn = showDetails ? 'hide' : 'view'

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const updatedBlogLikes = async () => {
    console.log(blog)
    const newUpdatedBlog1 = { ...blog, likes: blog.likes + 1 }
    const newUpdatedBlog = { ...newUpdatedBlog1, user: newUpdatedBlog1.user.id }
    const updatedBlog = await blogService.update(blog.id, newUpdatedBlog)
    console.log(updatedBlog)
    const newBlogs = blogs.filter(b => b.id !== blog.id)
    const addedBlog = newBlogs.concat(updatedBlog)
    addedBlog.sort((a,b) => {
      if(parseInt(a.likes) < parseInt(b.likes)){
        return 1
      }
      return -1
    })
    setBlogs(addedBlog)
  }

  const removeBlog = async () => {
    try{
      if(window.confirm(`Remove blog ${blog.title}`)){
        await blogService.deleteBlog(blog.id)
        const newBlogs = blogs.filter(b => b.id !== blog.id)
        newBlogs.sort((a,b) => {
          if(parseInt(a.likes) < parseInt(b.likes)){
            return 1
          }
          return -1
        })
        setBlogs(newBlogs)
      }
    }
    catch(exception){
      console.log(exception)
    }
  }


  return (
    <div>
      {showDetails ? <div style={blogStyle}><div>{blog.title}</div><div>{blog.url}</div><div>{blog.likes} <button onClick={updatedBlogLikes}>like</button></div><div>{blog.author}</div><button onClick={removeBlog}>remove</button></div>: <div style={blogStyle}>{blog.title} {blog.author} <button onClick={updatedBlogLikes}>like</button> </div>}
      <button onClick={() => setShowDetails(!showDetails)}>{btn}</button>
    </div>
  )
}

export default Blog