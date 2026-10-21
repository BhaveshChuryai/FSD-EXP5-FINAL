import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { MessageCircle, Heart, MapPin, Search, TrendingUp, FileText, Users, Building, MessageSquare } from 'lucide-react'
import LiveInvestorChat from '../components/chat/LiveInvestorChat'
import './Community.css'

const categories = [
  { id: 'location', icon: MapPin, label: 'Location Insights' },
  { id: 'investment', icon: TrendingUp, label: 'Land Investment' },
  { id: 'documentation', icon: FileText, label: 'Documentation' },
  { id: 'buying', icon: Building, label: 'Buying & Selling' },
  { id: 'brokers', icon: Users, label: 'Broker Network' },
]

const demoPosts = [
  { id: 1, cat: 'Location Insights', title: 'What makes Karjat the best-kept farmhouse investment secret in Maharashtra?', author: 'Rahul M.', location: 'Karjat', replies: 14, likes: 32, preview: 'Karjat offers a unique combination of river access, highway connectivity, and natural beauty that few other locations can match at this price point.' },
  { id: 2, cat: 'Land Investment', title: 'Panvel corridor land prices — where are they headed with the new airport?', author: 'Priya S.', location: 'Panvel', replies: 9, likes: 28, preview: 'With Navi Mumbai International Airport construction underway, land prices in Panvel and surrounding talukas have shown notable movement.' },
  { id: 3, cat: 'Documentation', title: 'Understanding 7/12 extract — a practical guide for first-time Maharashtra land buyers', author: 'Amit K.', location: 'General', replies: 22, likes: 61, preview: 'The 7/12 extract (Satbara Utara) is one of the most important land records in Maharashtra. Here is a practical breakdown.' },
  { id: 4, cat: 'Broker Network', title: 'How do I evaluate whether a land broker is trustworthy in Maharashtra?', author: 'Sneha P.', location: 'General', replies: 7, likes: 19, preview: 'After years in this market, I have developed a simple checklist that I share with every buyer I work with.' },
  { id: 5, cat: 'Buying & Selling', title: 'Lonavala farmhouse land — what should first-time buyers look out for?', author: 'Dev R.', location: 'Lonavala', replies: 11, likes: 44, preview: 'Lonavala is popular but not without its own unique complexities. Here is what buyers typically overlook.' },
]

export default function Community() {
  const { isAuthenticated } = useSelector(s => s.auth)
  const [activeTab, setActiveTab] = useState('chat')
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const filtered = demoPosts.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = selectedCat === 'all' || p.cat === categories.find(c => c.id === selectedCat)?.label
    return matchSearch && matchCat
  })

  return (
    <div className="community-page" ref={ref}>
      {/* Hero */}
      <div className="community-hero">
        <div className="container community-hero__content">
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            COMMUNITY & LIVE LOUNGE
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Real-time investor communications, peer insights, and land discovery across Maharashtra.
          </motion.p>
          {!isAuthenticated && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-gold">Join Community</Link>
              <Link to="/login" className="btn btn-outline">Sign In</Link>
            </motion.div>
          )}
        </div>
      </div>

      <div className="container community-body">
        {/* Tab Switcher: Live Chat vs Forum */}
        <div className="community-tabs-nav">
          <button
            className={`community-tab-btn ${activeTab === 'chat' ? 'community-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('chat')}
            id="tab-live-chat"
          >
            <MessageSquare size={16} /> Live Investor Lounge (WebSockets)
          </button>
          <button
            className={`community-tab-btn ${activeTab === 'forum' ? 'community-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('forum')}
            id="tab-forum-posts"
          >
            <FileText size={16} /> Forum Topics & Insights
          </button>
        </div>

        {activeTab === 'chat' ? (
          <div style={{ maxWidth: 880, margin: '0 auto' }}>
            <LiveInvestorChat />
          </div>
        ) : (
          <>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--error)', opacity: 0.6, marginBottom: '1.5rem' }}>
              ⚠ Demonstration discussions — these are sample topic threads
            </p>

            {/* Search + filters */}
            <div className="community-controls">
              <div className="community-search">
                <Search size={16} />
                <input type="search" placeholder="Search discussions..." value={search}
                  onChange={e => setSearch(e.target.value)} className="community-search__input" />
              </div>
              <div className="community-cats">
                <button className={`explore__pill ${selectedCat === 'all' ? 'explore__pill--active' : ''}`}
                  onClick={() => setSelectedCat('all')}>All</button>
                {categories.map(c => (
                  <button key={c.id}
                    className={`explore__pill ${selectedCat === c.id ? 'explore__pill--active' : ''}`}
                    onClick={() => setSelectedCat(c.id)}>{c.label}</button>
                ))}
              </div>
            </div>

        {/* Posts */}
        <div className="community-posts">
          {filtered.map((post, i) => (
            <motion.div key={post.id} className="community-post"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div className="community-post__header">
                <span className="badge badge-gold">{post.cat}</span>
                {post.location !== 'General' && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    <MapPin size={11} /> {post.location}
                  </span>
                )}
              </div>
              <h3 className="community-post__title">{post.title}</h3>
              <p className="community-post__preview">{post.preview}</p>
              <div className="community-post__footer">
                <span className="community-post__author">By {post.author}</span>
                <div className="community-post__meta">
                  <span><MessageCircle size={12} /> {post.replies}</span>
                  <span><Heart size={12} /> {post.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!isAuthenticated && (
          <div className="community-cta">
            <p>Sign in or create an account to post, comment, and engage with discussions.</p>
            <Link to="/register" className="btn btn-gold">Join the Community</Link>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  )
}
