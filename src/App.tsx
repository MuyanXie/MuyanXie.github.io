import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import './App.css';

interface BlogMetadata {
  note_id: number;
  filename: string;
  created_at: string;
  updated_at: string;
}

function App() {
  const [blogs, setBlogs] = useState<BlogMetadata[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BlogMetadata | null>(null);
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

  const handleSelectBlog = (blog: BlogMetadata) => {
    setSelectedBlog(blog);
  };

  const handleBackToList = () => {
    setSelectedBlog(null);
  };

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        {loading ? (
          <div className="loading-container">
            <p>Loading blogs...</p>
          </div>
        ) : selectedBlog ? (
          <BlogPost blog={selectedBlog} onBack={handleBackToList} />
        ) : (
          <BlogList blogs={blogs} onSelectBlog={handleSelectBlog} />
        )}
      </main>
    </div>
  );
}

export default App;
