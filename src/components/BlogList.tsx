import React from 'react';
import './BlogList.css';

interface BlogMetadata {
  note_id: number;
  filename: string;
  created_at: string;
  updated_at: string;
}

interface BlogListProps {
  blogs: BlogMetadata[];
  onSelectBlog: (blog: BlogMetadata) => void;
}

const BlogList: React.FC<BlogListProps> = ({ blogs, onSelectBlog }) => {
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
          <div
            key={blog.note_id}
            className="blog-card"
            onClick={() => onSelectBlog(blog)}
          >
            <h3 className="blog-card-title">{getTitle(blog.filename)}</h3>
            <div className="blog-card-meta">
              <span className="blog-card-date">
                {formatDate(blog.updated_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
