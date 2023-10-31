import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders Blog title and author', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Testuser',
    url: 'google.com'
  }

  render(<Blog blog={blog}/>)

  const element1 = screen.getByText('Test Blog', { exact: false })
  expect(element1).toBeDefined()

})


test('not renders Blog likes and url', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Testuser',
    url: 'google.com'
  }

  render(<Blog blog={blog}/>)

  const element2 = screen.getByText('google.com', { exact: false })
  expect(element2).toNotBeDefined()

})


test('renders url and likes when view button is clicked', async () => {

  const blog = {
    title: 'Test Blog',
    author: 'Testuser',
    url: 'google.com'
  }

  render(<Blog blog={blog}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const element2 = screen.getByText('google.com', { exact: false })
  expect(element2).toBeDefined()
})

test('when likes button clicked multiple times', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Testuser',
    url: 'google.com',
    id: '652ec50b5426c98d0fe59c59',
    user: {
      id: '651102087cdc484000748a8f'
    }
  }

  const blogs = [
    {
      title: 'Test Blog1',
      author: 'Testuser1',
      url: 'google.com1',
      user: {
        id: '6123'
      }
    }
  ]

  const mockHandler = jest.fn()

  render(<Blog blog={blog} blogs={blogs} setBlogs={mockHandler}/>)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)
  await waitFor(() => expect(mockHandler.mock.calls).toHaveLength(2))
})

test('new blog addition', async () => {

  const mockHandler = jest.fn()
  const user = userEvent.setup()
  render(<BlogForm addBlog={mockHandler} />)

  const inputs = screen.getAllByRole('textbox')
  const button = screen.getByText('create')

  screen.debug(inputs)

  await user.type(inputs[0], 'Testing Title')
  await user.type(inputs[1], 'Testing author')
  await user.type(inputs[2], 'Testing url')

  await user.click(button)

  await waitFor(() => expect(mockHandler.mock.calls).toHaveLength(1))


})