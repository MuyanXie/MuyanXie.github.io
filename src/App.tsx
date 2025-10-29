import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import './App.css';

export interface BlogMetadata {
  note_id: number;
  filename: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

function App() {
  const [blogs, setBlogs] = useState<BlogMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const response = await fetch('/notes/metadata.json');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error loading metadata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <Navbar />
        <main className="main-content">
          <div className="loading-container">
            <p>Loading blogs...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/blogs" replace />} />
          <Route path="/blogs" element={<BlogList blogs={blogs} />} />
          <Route path="/blogs/:slug" element={<BlogPost blogs={blogs} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
