import React from 'react';
import { Link } from 'react-router-dom';
import type { BlogMetadata } from '../App';
import './BlogList.css';

interface BlogListProps {
  blogs: BlogMetadata[];
}

const BlogList: React.FC<BlogListProps> = ({ blogs }) => {
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
    <div className="blog-list">
      <div className="blog-list-header">
        <h2>Recent Posts</h2>
        <p className="blog-count">{blogs.length} {blogs.length === 1 ? 'post' : 'posts'}</p>
      </div>
      <div className="blog-cards">
        {blogs.map((blog) => (
          <Link
            key={blog.note_id}
            to={`/blogs/${blog.slug}`}
            className="blog-card"
          >
            <h3 className="blog-card-title">{getTitle(blog.filename)}</h3>
            <div className="blog-card-meta">
              <span className="blog-card-date">
                {formatDate(blog.updated_at)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
