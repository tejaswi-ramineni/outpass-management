import { useEffect, useState } from 'react';
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001'
});

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001')
      .then(res => setMessage(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
