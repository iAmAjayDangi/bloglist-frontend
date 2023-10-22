import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({message}) => (
  <p>{message}</p>
)

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) =>{
    event.preventDefault()
    
    try{
      const user = await loginService.login({username, password})
      console.log('login successful')
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage('successfully logged in')
      setTimeout(()=>{
        setMessage('')
      },5000)
    }
    catch(exception){
      console.log('wrong credentials')
      setMessage('wrong username or password')
      setTimeout(()=>{
        setMessage('')
      },5000)
    }

  }

  const handleLogOut = (event) =>{
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try{
      const newBlog = await blogService.create({title, author, url})
      console.log(newBlog)
      setMessage(`${newBlog.title} added`)
      setTimeout(()=>{
        setMessage('')
      },5000)
      setTitle('')
      setAuthor('')
      setUrl('')
      setBlogs([])
    }
    catch(exception){
      console.log('exception occured while creating new blog')
      setMessage(`blog not added`)
      setTimeout(()=>{
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
            <input type='text' value={username} name='Username' onChange={({target}) => setUsername(target.value)}/>
        </div>
        <div>
          password
            <input type='password' value={password} name='Password' onChange={({target}) => setPassword(target.value)}/>
        </div>
        <button type='submit'>login</button>
      </form>
      </div>
    )
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
      title:
        <input type='text' value = {title} name = 'Title' onChange={({target}) => setTitle(target.value)} />
      </div>
      <div>
      author:
        <input type='text' value = {author} name = 'Author' onChange={({target}) => setAuthor(target.value)} />
      </div>
      <div>
      url:
        <input type='text' value = {url} name = 'Url' onChange={({target}) => setUrl(target.value)} />
      </div>
      <button type='submit'>create</button>
    </form>
  )

  return (
    <div>
      <Notification message={message} />
      <h2>blogs</h2>

      <span>{user.username} logged in</span>
      <button onClick={handleLogOut}>log out</button>

      <h2>create new</h2>
      {blogForm()}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App