import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { PostMeta } from '../lib/posts';
import { searchPosts, getSearchSuggestions, SearchResult } from '../lib/search';
import Link from 'next/link';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  posts: PostMeta[];
}

export default function SearchBar({ placeholder = "搜索文章...", onSearch, posts }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 搜索逻辑
  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchPosts(query, posts);
      setResults(searchResults);

      if (query.length >= 2) {
        const searchSuggestions = getSearchSuggestions(query, posts);
        setSuggestions(searchSuggestions);
      } else {
        setSuggestions([]);
      }
    } else {
      setResults([]);
      setSuggestions([]);
    }
  }, [query, posts]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    onSearch?.(value);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsOpen(false);
    onSearch?.(suggestion);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setIsOpen(false);
    onSearch?.('');
    inputRef.current?.focus();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        {query && (
          <button className="search-clear" onClick={handleClear}>
            <FaTimes />
          </button>
        )}
      </div>

      {isOpen && (results.length > 0 || suggestions.length > 0) && (
        <div className="search-dropdown">
          {/* 搜索建议 */}
          {suggestions.length > 0 && results.length === 0 && (
            <div className="search-suggestions">
              <div className="search-section-title">搜索建议</div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="search-suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <FaSearch className="suggestion-icon" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* 搜索结果 */}
          {results.length > 0 && (
            <div className="search-results">
              <div className="search-section-title">
                找到 {results.length} 篇文章
              </div>
              {results.map((result, index) => (
                <Link
                  key={result.post.uuid}
                  href={`/post/${result.post.uuid}`}
                  className="search-result-item"
                  onClick={handleResultClick}
                >
                  <div className="search-result-title">
                    {result.post.title}
                  </div>
                  <div className="search-result-meta">
                    <span className="search-result-date">
                      {formatDate(result.post.date)}
                    </span>
                    {result.post.tags && result.post.tags.length > 0 && (
                      <span className="search-result-tags">
                        {result.post.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="search-tag">
                            {tag}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                  {result.post.description && (
                    <div className="search-result-description">
                      {result.post.description}
                    </div>
                  )}
                  <div className="search-match-indicators">
                    {result.matches.title && (
                      <span className="match-indicator">标题</span>
                    )}
                    {result.matches.tags && (
                      <span className="match-indicator">标签</span>
                    )}
                    {result.matches.description && (
                      <span className="match-indicator">描述</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* 无结果 */}
          {query.trim() && results.length === 0 && suggestions.length === 0 && (
            <div className="search-no-results">
              <div className="no-results-text">
                没有找到包含 "{query}" 的文章
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}