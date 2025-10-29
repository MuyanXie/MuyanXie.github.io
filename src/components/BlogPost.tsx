import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { BlogMetadata } from '../App';
import './BlogPost.css';

interface BlogPostProps {
  blogs: BlogMetadata[];
}

const BlogPost: React.FC<BlogPostProps> = ({ blogs }) => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const blog = blogs.find(b => b.slug === slug);

  useEffect(() => {
    if (!blog) return;

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
  }, [blog]);

  if (!blog) {
    return <Navigate to="/blogs" replace />;
  }

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
      <Link to="/blogs" className="back-button">
        ← Back to all posts
      </Link>
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
