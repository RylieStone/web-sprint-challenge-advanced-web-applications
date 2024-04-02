import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'


export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticle, setCurrentArticle] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token')
      redirectToLogin()
      setMessage('Goodbye!')
    }
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner! data.message, data.token
    setMessage('')
    setSpinnerOn(true)
    axios.post('http://localhost:9000/api/login', {username: username, password: password})
    .then(res => {
      setMessage(res.data.message)
      localStorage.setItem('token', res.data.token)
    })
    .catch(err => console.log(err))
    .finally(() => {
      redirectToArticles()
      setSpinnerOn(false)
    })
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner! articles, message
    setMessage('')
    setSpinnerOn(true)
    axios.get('http://localhost:9000/api/articles', {headers: {authorization: localStorage.getItem('token')}})
    .then(res => {
      setArticles(res.data.articles)
      setMessage(res.data.message)
    }).catch(() => redirectToLogin).finally(() => setSpinnerOn(false))
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage('')
    setSpinnerOn(true)
    axios.post('http://localhost:9000/api/articles', article ,{headers: {authorization: localStorage.getItem('token')}})
    .then(res => {
      
      setArticles([...articles, res.data.article]) 
      setMessage(res.data.message)
    }).catch(() => redirectToLogin).finally(() => setSpinnerOn(false))
  }

  const updateArticle = (art) => {
    // ✨ implement 
    // You got this! 
    setMessage('')
    setSpinnerOn(true)
    axios.put(`http://localhost:9000/api/articles/${currentArticle.article_id}`, art, {headers: {authorization: localStorage.getItem('token')}})
    .then(res => {
      setMessage(res.data.message)
      setArticles(articles.map((art) => {
        return art.article_id === currentArticle.article_id ? res.data.article : art
      }))
    })
    .catch(err => console.log(err)).finally(() => {
      setSpinnerOn(false)
    })
  }

  const deleteArticle = article_id => {
    setMessage('')
    setSpinnerOn(true)
    axios.delete(`http://localhost:9000/api/articles/${article_id}`, {headers: {authorization: localStorage.getItem('token')}})
    .then(res => {
      setMessage(res.data.message)
      console.log(res)
      setArticles(articles.filter(art => art.article_id !== article_id))
    })
    .catch(err => console.log(err)).finally(() => {
      setSpinnerOn(false)
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle} currentArticle={currentArticle} updateArticle={updateArticle} setCurrentArticle={setCurrentArticle}/>
              <Articles getArticles={getArticles} articles={articles} setCurrentArticle={setCurrentArticle} deleteArticle={deleteArticle}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
