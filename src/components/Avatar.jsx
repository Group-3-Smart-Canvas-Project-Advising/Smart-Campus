import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../context/UserContext.jsx';
import './Avatar.css';

const Avatar = ({ size = 40, alt = 'Profile', sticky = false }) => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className={`avatar-wrap${sticky ? ' avatar-sticky' : ''}`} ref={wrapRef}>
      <button
        type="button"
        className="avatar-button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        title="Open profile menu"
        style={{ width: size, height: size }}
      >
        <img
          className="avatar"
          src={user?.profilePic}
          alt={alt}
          style={{ width: size, height: size }}
        />
      </button>

      {open && (
        <div className="avatar-menu" role="menu">
          <button className="avatar-menu-item" role="menuitem" onClick={() => { setOpen(false); /* placeholder */ }}>
            Change avatar picture
          </button>
          <button className="avatar-menu-item" role="menuitem" onClick={() => { setOpen(false); /* placeholder */ }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Avatar;
