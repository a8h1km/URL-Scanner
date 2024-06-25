import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [result, setResult] = useState("")
  const [url, setUrl] = useState("")
  const api_key = 'c16d75cc089baa9c4b4a7ac5dfe0f1351c77908a41ce4479ecd2ac5cc0c98844'
  const checkMal = async () => {
    if (url == "") {
      setResult("Invalid Input")
      return
    }
    const res = await fetch("http://localhost:3001/scan-url", {
      method: "POST"
      , headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "url": url
      })
    })
    const data = await res.json()
    const resMess = data.resultMessage
    setResult(resMess)
  }
  return (
    <>
      <div>
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder='Enter URL' />
        <button onClick={checkMal}>SUBMIT</button>
        <span>{result}</span>
      </div>
    </>
  )
}

export default App
