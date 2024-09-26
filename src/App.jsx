import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SideNav from './components/SideNav';
import Login from './components/Login';
import Chat from './components/Chat';
import Register from './components/SignUp';
import { Container, Alert, Spinner } from 'react-bootstrap';
import './index.css';

const ProtectedRoute = ({ component: Component, token }) => {
  return token ? <Component /> : <Navigate to="/login" />;
};

const DisplayError = ({ message }) => {
  if (!message) return null;
  return (
    <Alert variant="danger" className="text-center my-3">
      {message}
    </Alert>
  );
};

const LoadingIndicator = () => (
  <div className="text-center my-3">
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    <p className="mt-2">Loading, please wait...</p>
  </div>
);

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(localStorage.getItem('userId') || '');
  const [csrfToken, setCsrfToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('userId', user);
  }, [authToken, user]);

  useEffect(() => {
    const getCsrfToken = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://chatify-api.up.railway.app/csrf', {
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch CSRF token');
        }

        const data = await response.json();
        console.log('Fetched CSRF Token:', data.csrfToken);
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
        setErrorMsg(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getCsrfToken();
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Container fluid>
      <DisplayError message={errorMsg} />
        <SideNav authToken={authToken} setAuthToken={setAuthToken} /> {/* Skickar rätt prop */}
        <Routes>
          <Route path="/" element={<Register csrfToken={csrfToken} />} />
          <Route path="/login" element={<Login setToken={setAuthToken} setUserId={setUser} csrfToken={csrfToken} />} />
          <Route path="/chat" element={<ProtectedRoute component={() => <Chat token={authToken} userId={user} />} token={authToken} />} />
          <Route path="*" element={<Navigate to={authToken ? "/chat" : "/login"} />} />
        </Routes>
    </Container>
  );
};

export default App;
