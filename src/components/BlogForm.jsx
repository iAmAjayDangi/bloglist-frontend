import { useState } from 'react'

const BlogForm = ({ addBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addNewBlog = (event) => {
    event.preventDefault()
    addBlog(title, author, url)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addNewBlog}>
        <div>
            title:
          <input type='text' value = {title} name = 'Title' onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
            author:
          <input type='text' value = {author} name = 'Author' onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
            url:
          <input type='text' value = {url} name = 'Url' onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm