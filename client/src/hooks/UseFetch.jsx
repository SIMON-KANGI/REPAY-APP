import { useState, useEffect } from 'react';
import axios from 'axios';
import { selectCurrentToken } from '../features/auth/Authslice';
import { useSelector } from'react-redux';
function useFetch(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const access_token= useSelector(selectCurrentToken)
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(url,{
         headers: { Authorization: `Bearer ${access_token}` },
      }
       
      );
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const reFetch = () => {
    fetchData();
  };

  return { data, loading, error, reFetch };
}

export default useFetch;
