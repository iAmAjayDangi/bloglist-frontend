import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message }) => (
  <p>{message}</p>
)

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a,b) => {
        if(parseInt(a.likes) < parseInt(b.likes)){
          return 1
        }
        return -1
      })
      // console.log(blogs)
      setBlogs( blogs )
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try{
      const user = await loginService.login({ username, password })
      console.log('login successful')
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage('successfully logged in')
      setTimeout(() => {
        setMessage('')
      },5000)
    }
    catch(exception){
      console.log('wrong credentials')
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage('')
      },5000)
    }

  }

  const handleLogOut = (event) => {
    window.localStorage.clear()
    setUser(null)
  }


  const addBlog = async (title, author, url) => {
    try{
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create({ title, author, url })
      console.log(newBlog)
      setMessage(`${newBlog.title} added`)
      setTimeout(() => {
        setMessage('')
      },5000)
      const addedBlog = blogs.concat(newBlog)
      addedBlog.sort((a,b) => {
        if(parseInt(a.likes) < parseInt(b.likes)){
          return 1
        }
        return -1
      })
      setBlogs(addedBlog)
    }
    catch(exception){
      console.log('exception occured while creating new blog')
      setMessage('blog not added')
      setTimeout(() => {
        setMessage('')
      },5000)
    }
  }


  if(user === null){
    return(
      <div>
        <Notification message={message} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
          username
            <input type='text' value={username} name='Username' onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
          password
            <input type='password' value={password} name='Password' onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification message={message} />
      <h2>blogs</h2>

      <span>{user.username} logged in</span>
      <button onClick={handleLogOut}>log out</button>

      <Togglable buttonLabel = 'new blog' ref = {blogFormRef}>
        <BlogForm addBlog = {addBlog} />
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} blogs = {blogs} setBlogs = {setBlogs} />
      )}
    </div>
  )
}

export default App