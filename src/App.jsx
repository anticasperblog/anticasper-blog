import React, { useState, useMemo } from 'react';
import {
  Play, Pause, Plus, Search, Music, Heart,
  Sparkles, Filter, X, Flame, Radio, Bookmark
} from 'lucide-react';

const INITIAL_POSTS = [
  {
    id: 'post-1',
    title: 'Floral Green',
    artist: 'Title Fight',
    year: '2012',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    genres: ['Emo', 'Hardcore', 'Shoegaze', 'Midwest Emo'],
    ffo: ['Turnstile', 'Fugazi', 'Basement', 'Citizen', 'Balance and Composure'],
    writeup: `A timeless masterpiece that redefined modern hardcore and emo. From the thunderous bass intro of "Numb But I Still Feel It" to the melancholic haze of "Head in the Ceiling Fan", Floral Green sits comfortably as a landmark record for anyone who grew up skateboarding in empty parking lots at 2 AM.`,
    curator: 'anticasper_admin',
    createdAt: '2 hours ago',
    likes: 342,
    links: {
      apple: 'https://music.apple.com/us/album/floral-green/123456789',
      spotify: 'https://open.spotify.com/album/3Xf9U5x7zQj7y8',
      youtube: 'https://youtube.com/playlist?list=titlefight-floralgreen',
      bandcamp: 'https://titlefight.bandcamp.com/album/floral-green'
    },
    audioSample: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73b22.mp3?filename=ambient-guitar-chill-10821.mp3'
  },
  {
    id: 'post-2',
    title: 'GLOW ON',
    artist: 'Turnstile',
    year: '2021',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    genres: ['Hardcore', 'Heavy', 'Indie', 'Pop'],
    ffo: ['Knocked Loose', 'Title Fight', 'Incendiary', 'Angel Du$t'],
    writeup: `Turnstile broke every rule in the hardcore playbook with GLOW ON. Fusing groove-heavy riffs with dream-pop hooks, percussion breakdowns, and danceable rhythms, this album became the soundtrack to summer skate sessions worldwide.`,
    curator: 'vibe_collector',
    createdAt: '5 hours ago',
    likes: 512,
    links: {
      apple: 'https://music.apple.com/us/album/glow-on/1572348',
      spotify: 'https://open.spotify.com/album/2N1D8u1',
      youtube: 'https://youtube.com/playlist?list=turnstile-glowon',
      bandcamp: 'https://turnstile.bandcamp.com/album/glow-on'
    },
    audioSample: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=rock-riff-14828.mp3'
  },
  {
    id: 'post-3',
    title: 'Never Before Seen, Never Again',
    artist: "Arm's Length",
    year: '2022',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    genres: ['Emo', 'Pop Punk', 'Midwest Emo', 'Screamo'],
    ffo: ['Hot Mulligan', 'The Wonder Years', 'Spanish Love Songs', 'Free Throw'],
    writeup: `Raw, cathartic, and relentlessly hook-filled. Arm's Length delivered one of the strongest debut emo records of the decade. Explosive vocal delivery matched with intricate guitar lines that evoke classic 2000s emo.`,
    curator: 'sadboy_hours',
    createdAt: '1 day ago',
    likes: 218,
    links: {
      apple: 'https://music.apple.com/us/album/never-before-seen/987654',
      spotify: 'https://open.spotify.com/album/4M1kX9',
      youtube: 'https://youtube.com/playlist?list=armslength-nbsna',
      bandcamp: 'https://armslength.bandcamp.com/album/never-before-seen-never-again'
    },
    audioSample: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6522c069.mp3?filename=energetic-indie-rock-111246.mp3'
  }
];

const ALL_GENRES = [
  'All', 'Emo', 'Midwest Emo', 'Pop Punk', 'Hardcore', 'Metalcore',
  'Heavy', 'Screamo', 'Shoegaze', 'Indie', 'Folk', 'Chill', 'Pop'
];

export default function App() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedFFO, setSelectedFFO] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePostDetail, setActivePostDetail] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [audioObj, setAudioObj] = useState(null);
  const [userLikes, setUserLikes] = useState({});
  const [userBookmarks, setUserBookmarks] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '', artist: '', year: '2026', coverUrl: '', writeup: '',
    genres: ['Emo'], ffoInput: '', apple: '', spotify: '', youtube: '', bandcamp: ''
  });

  const allFFOBands = useMemo(() => {
    const bandMap = {};
    posts.forEach(p => p.ffo.forEach(b => { bandMap[b] = (bandMap[b] || 0) + 1; }));
    return Object.entries(bandMap).sort((a, b) => b[1] - a[1]).map(([b]) => b);
  }, [posts]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const togglePlayTrack = (post, e) => {
    if (e) e.stopPropagation();
    if (currentlyPlaying === post.id) {
      if (audioObj) audioObj.pause();
      setCurrentlyPlaying(null);
    } else {
      if (audioObj) audioObj.pause();
      const nextAudio = new Audio(post.audioSample);
      nextAudio.play().catch(() => showToast('Preview play simulated'));
      setAudioObj(nextAudio);
      setCurrentlyPlaying(post.id);
      nextAudio.onended = () => setCurrentlyPlaying(null);
    }
  };

  const handleLike = (id, e) => {
    if (e) e.stopPropagation();
    setUserLikes(prev => {
      const liked = !!prev[id];
      setPosts(curr => curr.map(p => p.id === id ? { ...p, likes: p.likes + (liked ? -1 : 1) } : p));
      return { ...prev, [id]: !liked };
    });
  };

  const handleBookmark = (id, e) => {
    if (e) e.stopPropagation();
    setUserBookmarks(prev => {
      const saved = !!prev[id];
      showToast(saved ? 'Removed from bookmarks' : 'Saved to bookmarks');
      return { ...prev, [id]: !saved };
    });
  };

  const handleSimulatedImport = () => {
    if (!importUrl) return showToast('Enter a song/album URL or name');
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      setNewPost({
        title: 'Around the Fur',
        artist: 'Deftones',
        year: '1997',
        coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
        writeup: `Auto-imported review draft for Deftones' landmark record. Heavy guitar tones paired with emotional vocal hooks.`,
        genres: ['Heavy', 'Metalcore', 'Shoegaze'],
        ffoInput: 'Loathe, Hum, Far, Fleshwater',
        apple: 'https://music.apple.com/us/album/around-the-fur/1099849553',
        spotify: 'https://open.spotify.com/album/3Vw1G_9740v9d21y',
        youtube: 'https://youtube.com/results?search_query=deftones+around+the+fur',
        bandcamp: 'https://deftones.bandcamp.com'
      });
      showToast('Metadata & Links Auto-Resolved!');
    }, 800);
  };

  const handleCreatePostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.artist) return showToast('Title and Artist required');
    const created = {
      id: `post-${Date.now()}`,
      title: newPost.title,
      artist: newPost.artist,
      year: newPost.year || '2026',
      coverUrl: newPost.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
      genres: newPost.genres.length ? newPost.genres : ['Emo'],
      ffo: newPost.ffoInput.split(',').map(s => s.trim()).filter(Boolean),
      writeup: newPost.writeup || 'No writeup provided.',
      curator: 'you_skater',
      createdAt: 'Just now',
      likes: 1,
      links: {
        apple: newPost.apple || '#',
        spotify: newPost.spotify || '#',
        youtube: newPost.youtube || '#',
        bandcamp: newPost.bandcamp || '#'
      },
      audioSample: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73b22.mp3?filename=ambient-guitar-chill-10821.mp3'
    };
    setPosts([created, ...posts]);
    setIsShareModalOpen(false);
    showToast('Published to ANTICASPER BLOG!');
  };

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return posts.filter(p => {
      const okGenre = selectedGenre === 'All' || p.genres.includes(selectedGenre);
      const okFFO = !selectedFFO || p.ffo.some(b => b.toLowerCase() === selectedFFO.toLowerCase());
      const okSearch = !q || p.title.toLowerCase().includes(q) || p.artist.toLowerCase().includes(q) || p.writeup.toLowerCase().includes(q);
      return okGenre && okFFO && okSearch;
    });
  }, [posts, selectedGenre, selectedFFO, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0d0e12] text-zinc-100 font-sans selection:bg-[#e2ff00] selection:text-black">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#e2ff00] text-black font-mono font-bold text-xs px-4 py-3 border-2 border-black">
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="border-b-2 border-zinc-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="bg-[#e2ff00] text-black text-xs font-mono font-black px-2 py-0.5 uppercase">
              VER. 2.4 // ANTICASPER DIY
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mt-1 font-mono text-white">
              ANTICASPER <span className="text-[#e2ff00]">BLOG</span>
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Curated underground music, album deep-dives, and cross-platform streaming links.
            </p>
          </div>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="bg-[#e2ff00] hover:bg-yellow-300 text-black font-mono font-bold px-5 py-3 text-sm uppercase border-2 border-black flex items-center gap-2 cursor-pointer"
          >
            <Plus size={18} strokeWidth={3} />
            <span>SHARE MUSIC + LINK</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artist, album, or review..."
              className="w-full bg-[#16181e] border-2 border-zinc-800 text-white pl-11 pr-10 py-3 text-sm font-mono focus:border-[#e2ff00] focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="bg-[#16181e] border-2 border-zinc-800 p-3 flex items-center justify-between font-mono text-xs">
            <span className="text-zinc-400 uppercase">ARCHIVE:</span>
            <span className="text-[#e2ff00] font-bold text-base">{filteredPosts.length} POSTS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-[#16181e] border-2 border-zinc-800 p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
                <h2 className="font-mono text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Filter size={16} className="text-[#e2ff00]" /> GENRES
                </h2>
                {selectedGenre !== 'All' && (
                  <button onClick={() => setSelectedGenre('All')} className="text-[10px] font-mono text-[#e2ff00]">RESET</button>
                )}
              </div>
              <div className="flex flex-wrap lg:flex-col gap-1.5">
                {ALL_GENRES.map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g)}
                    className={`text-left px-3 py-2 text-xs font-mono border ${
                      selectedGenre === g ? 'bg-[#e2ff00] text-black border-[#e2ff00] font-bold' : 'bg-[#0d0e12] text-zinc-300 border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    # {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#16181e] border-2 border-zinc-800 p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
                <h2 className="font-mono text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Flame size={16} className="text-[#e2ff00]" /> FOR FANS OF
                </h2>
                {selectedFFO && (
                  <button onClick={() => setSelectedFFO(null)} className="text-[10px] font-mono text-[#e2ff00]">CLEAR</button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allFFOBands.map(band => {
                  const active = selectedFFO?.toLowerCase() === band.toLowerCase();
                  return (
                    <button
                      key={band}
                      onClick={() => setSelectedFFO(active ? null : band)}
                      className={`text-xs font-mono px-2.5 py-1 border ${
                        active ? 'bg-rose-500 text-white border-rose-500 font-bold' : 'bg-[#0d0e12] text-zinc-300 border-zinc-800 hover:border-[#e2ff00]'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}{band}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            {filteredPosts.length === 0 ? (
              <div className="bg-[#16181e] border-2 border-zinc-800 p-12 text-center font-mono">
                <Music size={48} className="mx-auto text-zinc-600 mb-4" />
                <h3 className="text-xl font-bold uppercase text-white mb-4">NO POSTS MATCH YOUR VIBE</h3>
                <button
                  onClick={() => { setSelectedGenre('All'); setSelectedFFO(null); setSearchQuery(''); }}
                  className="bg-[#e2ff00] text-black font-bold px-4 py-2 text-xs uppercase"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map(post => {
                  const isPlaying = currentlyPlaying === post.id;
                  const isLiked = !!userLikes[post.id];
                  const isSaved = !!userBookmarks[post.id];
                  return (
                    <article
                      key={post.id}
                      onClick={() => setActivePostDetail(post)}
                      className="group bg-[#16181e] border-2 border-zinc-800 hover:border-zinc-400 flex flex-col justify-between cursor-pointer"
                    >
                      <div className="p-4 border-b border-zinc-800 flex justify-between text-xs font-mono text-zinc-500">
                        <span>@{post.curator}</span>
                        <span>{post.createdAt}</span>
                      </div>
                      <div className="relative aspect-square bg-zinc-900 overflow-hidden">
                        <img src={post.coverUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <button
