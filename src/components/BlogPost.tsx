import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './BlogPost.css';

interface BlogMetadata {
  note_id: number;
  filename: string;
  created_at: string;
  updated_at: string;
}

interface BlogPostProps {
  blog: BlogMetadata;
  onBack: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ blog, onBack }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/notes/${blog.filename}`);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Error loading markdown:', error);
        setContent('Error loading blog post.');
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [blog.filename]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTitle = (filename: string) => {
    return filename.replace('.md', '').replace(/-/g, ' ').replace(/_/g, ' ');
  };

  return (
    <div className="blog-post">
      <button className="back-button" onClick={onBack}>
        ← Back to all posts
      </button>
      <article className="blog-post-content">
        <header className="blog-post-header">
          <h1 className="blog-post-title">{getTitle(blog.filename)}</h1>
          <div className="blog-post-meta">
            <time className="blog-post-date">{formatDate(blog.updated_at)}</time>
          </div>
        </header>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogPost;
