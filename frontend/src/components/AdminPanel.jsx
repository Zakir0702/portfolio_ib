import { useEffect, useMemo, useState } from 'react';

import { deleteAdminMedia, fetchAdminMedia, uploadAdminMedia } from '../api/adminMedia.js';

const ADMIN_TOKEN_KEY = 'portfolio-admin-token';
const DEFAULT_CATEGORY = 'portfolio';
const CATEGORY_OPTIONS = ['hero', 'profile', 'reel', 'project', 'service', 'portfolio'];

function readSavedToken() {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function saveToken(token) {
  try {
    if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // Session storage is optional. Upload still works for the current form value.
  }
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function titleFromFilename(filename = '') {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatBytes(bytes = 0) {
  const size = Number(bytes || 0);
  if (!size) return 'Unknown size';
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value) {
  if (!value) return 'Recently';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

function MediaIcon({ type }) {
  if (type === 'image') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="M21 16l-5.2-5.2a1.5 1.5 0 0 0-2.1 0L5 19" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="14" height="14" rx="2" />
      <path d="M17 9l4-2v10l-4-2" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M5 20h14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function AdminMediaPreview({ item }) {
  const poster = item.poster || item.url;

  return (
    <div className="admin-media-preview">
      {item.type === 'image' ? (
        <img src={item.url} alt={item.title || item.key} loading="lazy" />
      ) : (
        <video src={item.url} poster={poster || undefined} preload="metadata" muted playsInline />
      )}
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="admin-stat-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function AdminPanel({ theme, onToggleTheme }) {
  const [token, setToken] = useState(() => readSavedToken());
  const [media, setMedia] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [copiedId, setCopiedId] = useState('');
  const [form, setForm] = useState({
    title: '',
    key: '',
    category: DEFAULT_CATEGORY,
  });

  useEffect(() => {
    saveToken(token);
  }, [token]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError('');

    fetchAdminMedia({ type: filterType, category: filterCategory })
      .then(records => {
        if (cancelled) return;
        setMedia(records);
        setStatus('ready');
      })
      .catch(err => {
        if (cancelled) return;
        setStatus('error');
        setError(err.message || 'Unable to load media library.');
      });

    return () => {
      cancelled = true;
    };
  }, [filterType, filterCategory, refreshKey]);

  const stats = useMemo(() => {
    const images = media.filter(item => item.type === 'image').length;
    const videos = media.filter(item => item.type === 'video').length;
    const categories = new Set(media.map(item => item.category).filter(Boolean)).size;

    return { total: media.length, images, videos, categories };
  }, [media]);

  const categories = useMemo(() => {
    const known = new Set(CATEGORY_OPTIONS);
    for (const item of media) {
      if (item.category) known.add(item.category);
    }
    return [...known].sort();
  }, [media]);

  const selectedFileKind = file ? (file.type.startsWith('image/') ? 'image' : 'video') : 'media';

  function updateForm(name, value) {
    setForm(current => ({ ...current, [name]: value }));
  }

  function handleFileChange(event) {
    const selected = event.target.files?.[0] || null;
    setFile(selected);
    setMessage('');
    setError('');

    if (!selected) return;

    const baseTitle = titleFromFilename(selected.name);
    setForm(current => ({
      ...current,
      title: current.title || baseTitle,
      key: current.key || slugify(baseTitle),
    }));
  }

  async function handleUpload(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!file) {
      setError('Choose an image or video first.');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadAdminMedia({
        token,
        file,
        title: form.title,
        key: form.key,
        category: form.category,
      });

      setMessage(`${result.media?.title || 'Media'} uploaded to Cloudinary.`);
      setFile(null);
      setFileInputKey(key => key + 1);
      setForm(current => ({ title: '', key: '', category: current.category || DEFAULT_CATEGORY }));
      setRefreshKey(key => key + 1);
    } catch (err) {
      setError(err.message || 'Unable to upload media.');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(`Delete "${item.title || item.key}" from Cloudinary and the media library?`);
    if (!confirmed) return;

    setDeletingId(item.id);
    setMessage('');
    setError('');

    try {
      await deleteAdminMedia(item.id, { token });
      setMedia(current => current.filter(mediaItem => mediaItem.id !== item.id));
      setMessage(`${item.title || item.key} deleted.`);
    } catch (err) {
      setError(err.message || 'Unable to delete media.');
    } finally {
      setDeletingId('');
    }
  }

  async function handleCopy(item) {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      window.setTimeout(() => setCopiedId(''), 1600);
    } catch {
      setError('Unable to copy URL from this browser.');
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-topbar">
        <a className="admin-brand" href="/">
          <span className="admin-brand-mark">IB</span>
          <span>Portfolio Admin</span>
        </a>
        <div className="admin-top-actions">
          <button className="dark-mode-toggle" type="button" aria-label="Toggle dark mode" onClick={onToggleTheme}>
            {theme === 'dark' ? (
              <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            ) : (
              <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /></svg>
            )}
          </button>
          <a className="admin-site-link" href="/">View site</a>
        </div>
      </header>

      <main className="admin-shell">
        <section className="admin-summary">
          <div>
            <h1>Media library</h1>
            <p>Upload Cloudinary assets and use their keys across the portfolio.</p>
          </div>
          <div className="admin-stats">
            <StatTile label="Total" value={stats.total} />
            <StatTile label="Videos" value={stats.videos} />
            <StatTile label="Images" value={stats.images} />
            <StatTile label="Categories" value={stats.categories} />
          </div>
        </section>

        <section className="admin-grid">
          <form className="admin-tool admin-upload" onSubmit={handleUpload}>
            <div className="admin-section-heading">
              <h2>Add media</h2>
              <span>{selectedFileKind}</span>
            </div>

            <label className="admin-field">
              <span>Admin token</span>
              <input
                type="password"
                value={token}
                onChange={event => setToken(event.target.value)}
                autoComplete="off"
                placeholder="Required in production"
              />
            </label>

            <label className={`admin-file-drop ${file ? 'has-file' : ''}`}>
              <input
                key={fileInputKey}
                className="admin-file-input"
                type="file"
                accept="image/*,video/mp4,video/webm,video/quicktime,video/x-msvideo"
                onChange={handleFileChange}
              />
              {previewUrl ? (
                <span className="admin-file-preview">
                  {file.type.startsWith('image/') ? (
                    <img src={previewUrl} alt="Selected upload preview" />
                  ) : (
                    <video src={previewUrl} muted playsInline controls />
                  )}
                </span>
              ) : (
                <span className="admin-upload-icon"><UploadIcon /></span>
              )}
              <span className="admin-file-meta">
                <strong>{file?.name || 'Choose media file'}</strong>
                <small>{file ? `${file.type || 'media'} / ${formatBytes(file.size)}` : 'Image or video'}</small>
              </span>
            </label>

            <div className="admin-form-row">
              <label className="admin-field">
                <span>Title</span>
                <input value={form.title} onChange={event => updateForm('title', event.target.value)} placeholder="Demo Reel" />
              </label>
              <label className="admin-field">
                <span>Key</span>
                <input value={form.key} onChange={event => updateForm('key', slugify(event.target.value))} placeholder="demo-reel" />
              </label>
            </div>

            <label className="admin-field">
              <span>Category</span>
              <input
                list="admin-category-options"
                value={form.category}
                onChange={event => updateForm('category', slugify(event.target.value) || DEFAULT_CATEGORY)}
                placeholder={DEFAULT_CATEGORY}
              />
              <datalist id="admin-category-options">
                {categories.map(category => <option value={category} key={category} />)}
              </datalist>
            </label>

            <button className="btn-primary admin-submit" type="submit" disabled={isUploading}>
              <span className="btn-text">{isUploading ? 'Uploading...' : 'Upload media'}</span>
            </button>
          </form>

          <section className="admin-library">
            <div className="admin-library-header">
              <div className="admin-section-heading">
                <h2>Current assets</h2>
                <span>{status === 'loading' ? 'Loading' : `${media.length} records`}</span>
              </div>
              <div className="admin-filters">
                <select value={filterType} onChange={event => setFilterType(event.target.value)} aria-label="Filter by type">
                  <option value="">All types</option>
                  <option value="video">Videos</option>
                  <option value="image">Images</option>
                </select>
                <select value={filterCategory} onChange={event => setFilterCategory(event.target.value)} aria-label="Filter by category">
                  <option value="">All categories</option>
                  {categories.map(category => <option value={category} key={category}>{category}</option>)}
                </select>
                <button className="admin-icon-button" type="button" onClick={() => setRefreshKey(key => key + 1)} aria-label="Refresh media">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.34-5.66" /><path d="M20 4v6h-6" /></svg>
                </button>
              </div>
            </div>

            {(message || error) && (
              <div className={`admin-alert ${error ? 'is-error' : 'is-success'}`} role="status">
                {error || message}
              </div>
            )}

            {status === 'loading' ? (
              <div className="admin-empty">Loading media...</div>
            ) : media.length === 0 ? (
              <div className="admin-empty">No media found.</div>
            ) : (
              <div className="admin-media-list">
                {media.map(item => (
                  <article className="admin-media-row" key={item.id}>
                    <AdminMediaPreview item={item} />
                    <div className="admin-media-main">
                      <div className="admin-media-title-row">
                        <div>
                          <h3>{item.title || item.key}</h3>
                          <p>{item.key}</p>
                        </div>
                        <span className="admin-type-chip">
                          <MediaIcon type={item.type} />
                          {item.type}
                        </span>
                      </div>
                      <div className="admin-media-meta">
                        <span>{item.category}</span>
                        <span>{formatBytes(item.size)}</span>
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                      <input className="admin-url-field" value={item.url} readOnly aria-label={`${item.title || item.key} URL`} />
                    </div>
                    <div className="admin-row-actions">
                      <button className="admin-icon-button" type="button" onClick={() => handleCopy(item)} aria-label={`Copy ${item.title || item.key} URL`}>
                        <CopyIcon />
                      </button>
                      <button className="admin-icon-button danger" type="button" onClick={() => handleDelete(item)} disabled={deletingId === item.id} aria-label={`Delete ${item.title || item.key}`}>
                        <TrashIcon />
                      </button>
                      {copiedId === item.id && <span className="admin-copied">Copied</span>}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
