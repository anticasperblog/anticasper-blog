import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
Play, Pause, Plus, Search, Music, Heart,
Sparkles, Filter, X, Flame, Radio, Bookmark, Lock, LogOut
} from 'lucide-react';

// Initialize Supabase Client (Replace with your own Supabase project URL and Anon Key when ready!)
const supabaseUrl = 'https://your-supabase-project.supabase.co';
const supabaseKey = 'your-supabase-anon-key';
export const supabase = createClient(supabaseUrl, supabaseKey);

const FALLBACK_INITIAL_POSTS = [
{
id: 'post-1',
title: 'Floral Green',
artist: 'Title Fight',
year: '2012',
coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
genres: ['Emo', 'Hardcore', 'Shoegaze', 'Midwest Emo'],
ffo: ['Turnstile', 'Fugazi', 'Basement', 'Citizen', 'Balance and Composure'],
writeup: "A timeless masterpiece that redefined modern hardcore and emo. From the thunderous bass intro of 'Numb But I Still Feel It' to the melancholic haze of 'Head in the Ceiling Fan', Floral Green sits comfortably as a landmark record for anyone who grew up skateboarding in empty parking lots at 2 AM. The guitar tones are sharp, gritty, yet strangely ambient.",
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
writeup: "Turnstile broke every rule in the hardcore playbook with GLOW ON. Fusing groove-heavy riffs with dream-pop hooks, percussion breakdowns, and danceable rhythms, this album became the soundtrack to summer skate sessions worldwide.",
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
}
];

const ALL_GENRES = [
'All', 'Emo', 'Midwest Emo', 'Pop Punk', 'Hardcore', 'Metalcore',
'Heavy', 'Screamo', 'Shoegaze', 'Indie', 'Folk', 'Chill', 'Pop'
];

export default function App() {
const [posts, setPosts] = useState<any[]>(FALLBACK_INITIAL_POSTS);
const [selectedGenre, setSelectedGenre] = useState('All');
const [selectedFFO, setSelectedFFO] = useState<string | null>(null);
const [searchQuery, setSearchQuery] = useState('');
const [activePostDetail, setActivePostDetail] = useState<any | null>(null);

// Owner Authentication & Modals
const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState(false);
const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
const [isShareModalOpen, setIsShareModalOpen] = useState(false);
const [adminPasswordInput, setAdminPasswordInput] = useState('');
const OWNER_PASSCODE = 'anticasper2026';

const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);
const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
const [toastMessage, setToastMessage] = useState<string | null>(null);

const [importUrl, setImportUrl] = useState('');
const [isImporting, setIsImporting] = useState(false);
const [newPost, setNewPost] = useState({
title: '', artist: '', year: '2026', coverUrl: '', writeup: '',
genres: ['Emo'], ffoInput: '', apple: '', spotify: '', youtube: '', bandcamp: ''
});

useEffect(() => {
async function fetchSupabasePosts() {
try {
const { data } = await supabase
.from('posts')
.select('*')
.order('created_at', { ascending: false });

    if (data && data.length > 0) {
      const formatted = data.map((item: any) => ({
        id: item.id || "post-" + Math.random(),
        title: item.title,
        artist: item.artist,
        year: item.year || '2026',
        coverUrl: item.cover_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
        genres: item.genres || ['Emo'],
        ffo: item.ffo || [],
        writeup: item.writeup || '',
        curator: item.curator || 'anticasper',
        createdAt: 'Recently',
        likes: item.likes || 1,
        links: {
          apple: item.apple_link || '#',
          spotify: item.spotify_link || '#',
          youtube: '#',
          bandcamp: '#'
        },
        audioSample: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73b22.mp3?filename=ambient-guitar-chill-10821.mp3'
      }));
      setPosts(formatted);
    }
  } catch (err) {
    console.log("Using local fallback posts while Supabase is unconfigured.");
  }
}
fetchSupabasePosts();


}, []);

const allFFOBands = useMemo(() => {
const map: Record<string, number> = {};
posts.forEach(p => (p.ffo || []).forEach((b: string) => { map[b] = (map[b] || 0) + 1; }));
return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([b]) => b);
}, [posts]);

const showToast = (msg: string) => {
setToastMessage(msg);
setTimeout(() => setToastMessage(null), 3000);
};

const handleAdminLoginSubmit = (e: React.FormEvent) => {
e.preventDefault();
if (adminPasswordInput === OWNER_PASSCODE) {
setIsOwnerAuthenticated(true);
setIsLoginModalOpen(false);
setAdminPasswordInput('');
setIsShareModalOpen(true);
showToast('Welcome back, owner!');
} else {
showToast('Incorrect owner passcode');
}
};

const handleLogout = () => {
setIsOwnerAuthenticated(false);
showToast('Logged out of owner mode');
};

const togglePlayTrack = (post: any, e?: React.MouseEvent) => {
if (e) e.stopPropagation();
if (currentlyPlaying === post.id) {
if (audioObj) audioObj.pause();
setCurrentlyPlaying(null);
} else {
if (audioObj) audioObj.pause();
const audio = new Audio(post.audioSample);
audio.play().catch(() => showToast('Preview play simulated'));
setAudioObj(audio);
setCurrentlyPlaying(post.id);
audio.onended = () => setCurrentlyPlaying(null);
}
};

const handleLike = (id: string, e?: React.MouseEvent) => {
if (e) e.stopPropagation();
setUserLikes(prev => {
const liked = !!prev[id];
setPosts(curr => curr.map(p => p.id === id ? { ...p, likes: p.likes + (liked ? -1 : 1) } : p));
return { ...prev, [id]: !liked };
});
};

const handleBookmark = (id: string, e?: React.MouseEvent) => {
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
title: 'Around the Fur', artist: 'Deftones', year: '1997',
coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
writeup: "Auto-imported review draft for Deftones' landmark record.",
genres: ['Heavy', 'Metalcore', 'Shoegaze'], ffoInput: 'Loathe, Hum, Far, Fleshwater',
apple: 'https://music.apple.com/us/album/around-the-fur/1099849553',
spotify: 'https://open.spotify.com/album/3Vw1G_9740v9d21y',
youtube: 'https://youtube.com',
bandcamp: 'https://deftones.bandcamp.com'
});
showToast('Metadata Auto-Resolved!');
}, 600);
};

const handleCreatePostSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (!newPost.title || !newPost.artist) return showToast('Title and Artist required');

const newDbRow = {
  title: newPost.title,
  artist: newPost.artist,
  year: newPost.year || '2026',
  cover_url: newPost.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
  genres: newPost.genres.length ? newPost.genres : ['Emo'],
  ffo: newPost.ffoInput.split(',').map(s => s.trim()).filter(Boolean),
  writeup: newPost.writeup || 'No writeup provided.',
  curator: 'anticasper',
  apple_link: newPost.apple || '',
  spotify_link: newPost.spotify || ''
};

try {
  const { error } = await supabase.from('posts').insert([newDbRow]).select();
  if (error) throw error;
} catch (err) {
  console.log("Saved locally (Supabase keys not yet plugged in)");
}

const created = {
  id: "post-" + Date.now(),
  title: newDbRow.title,
  artist: newDbRow.artist,
  year: newDbRow.year,
  coverUrl: newDbRow.cover_url,
  genres: newDbRow.genres,
  ffo: newDbRow.ffo,
  writeup: newDbRow.writeup,
  curator: newDbRow.curator,
  createdAt: 'Just now',
  likes: 1,
  links: { apple: newDbRow.apple_link, spotify: newDbRow.spotify_link, youtube: '#', bandcamp: '#' },
  audioSample: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73b22.mp3?filename=ambient-guitar-chill-10821.mp3'
};

setPosts([created, ...posts]);
setIsShareModalOpen(false);
showToast('Published successfully!');


};

const filteredPosts = useMemo(() => {
const q = searchQuery.toLowerCase();
return posts.filter(p => {
const okGenre = selectedGenre === 'All' || (p.genres || []).includes(selectedGenre);
const okFFO = !selectedFFO || (p.ffo || []).some((b: string) => b.toLowerCase() === selectedFFO.toLowerCase());
const okSearch = !q || p.title.toLowerCase().includes(q) || p.artist.toLowerCase().includes(q) || p.writeup.toLowerCase().includes(q);
return okGenre && okFFO && okSearch;
});
}, [posts, selectedGenre, selectedFFO, searchQuery]);

return (

{toastMessage && (

{toastMessage}

)}

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <header className="border-b-2 border-zinc-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <span className="bg-[#e2ff00] text-black text-xs font-mono font-black px-2 py-0.5 uppercase">VER. 2.6 // SECURE OWNER MODE</span>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mt-1 font-mono text-white">
          ANTICASPER <span className="text-[#e2ff00]">BLOG</span>
        </h1>
        <p className="text-zinc-400 text-sm mt-1">Curated underground music, album deep-dives, and cross-platform streaming links.</p>
      </div>
      {isOwnerAuthenticated && (
        <button onClick={() => setIsShareModalOpen(true)} className="bg-[#e2ff00] text-black font-mono font-bold px-4 py-2.5 text-xs uppercase border-2 border-black flex items-center gap-2 cursor-pointer">
          <Plus size={16} strokeWidth={3} />
          <span>NEW POST DASHBOARD</span>
        </button>
      )}
    </header>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="md:col-span-3 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search artist, album, or review..." className="w-full bg-[#16181e] border-2 border-zinc-800 text-white pl-11 pr-10 py-3 text-sm font-mono focus:border-[#e2ff00] focus:outline-none" />
        {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"><X size={16} /></button>}
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
            <h2 className="font-mono text-sm font-bold uppercase text-white flex items-center gap-2"><Filter size={16} className="text-[#e2ff00]" /> GENRES</h2>
            {selectedGenre !== 'All' && <button onClick={() => setSelectedGenre('All')} className="text-[10px] font-mono text-[#e2ff00]">RESET</button>}
          </div>
          <div className="flex flex-wrap lg:flex-col gap-1.5">
            {ALL_GENRES.map(g => (
              <button key={g} onClick={() => setSelectedGenre(g)} className={"text-left px-3 py-2 text-xs font-mono border " + (selectedGenre === g ? 'bg-[#e2ff00] text-black border-[#e2ff00] font-bold' : 'bg-[#0d0e12] text-zinc-300 border-zinc-800 hover:border-zinc-600')}>
                # {g}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#16181e] border-2 border-zinc-800 p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
            <h2 className="font-mono text-sm font-bold uppercase text-white flex items-center gap-2"><Flame size={16} className="text-[#e2ff00]" /> FOR FANS OF</h2>
            {selectedFFO && <button onClick={() => setSelectedFFO(null)} className="text-[10px] font-mono text-[#e2ff00]">CLEAR</button>}
          </div>
          <div className="flex flex-wrap gap-2">
            {allFFOBands.map(band => {
              const active = selectedFFO?.toLowerCase() === band.toLowerCase();
              return (
                <button key={band} onClick={() => setSelectedFFO(active ? null : band)} className={"text-xs font-mono px-2.5 py-1 border " + (active ? 'bg-rose-500 text-white border-rose-500 font-bold' : 'bg-[#0d0e12] text-zinc-300 border-zinc-800 hover:border-[#e2ff00]')}>
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
            <button onClick={() => { setSelectedGenre('All'); setSelectedFFO(null); setSearchQuery(''); }} className="bg-[#e2ff00] text-black font-bold px-4 py-2 text-xs uppercase">Reset Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map(post => {
              const isPlaying = currentlyPlaying === post.id;
              const isLiked = !!userLikes[post.id];
              const isSaved = !!userBookmarks[post.id];
              return (
                <article key={post.id} onClick={() => setActivePostDetail(post)} className="group bg-[#16181e] border-2 border-zinc-800 hover:border-zinc-400 flex flex-col justify-between cursor-pointer">
                  <div className="p-4 border-b border-zinc-800 flex justify-between text-xs font-mono text-zinc-500">
                    <span>@{post.curator}</span>
                    <span>{post.createdAt}</span>
                  </div>
                  <div className="relative aspect-square bg-zinc-900 overflow-hidden">
                    <img src={post.coverUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button onClick={(e) => togglePlayTrack(post, e)} className={"absolute bottom-4 right-4 p-3 rounded-full border-2 border-black " + (isPlaying ? 'bg-[#e2ff00] text-black' : 'bg-black/80 text-white hover:bg-[#e2ff00] hover:text-black')}>
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-xs font-mono text-[#e2ff00] font-bold uppercase">{post.artist} • {post.year}</div>
                      <h3 className="text-2xl font-black uppercase text-white group-hover:text-[#e2ff00] font-mono mt-1">{post.title}</h3>
                      <p className="text-zinc-300 text-xs mt-3 line-clamp-3 leading-relaxed">{post.writeup}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(post.genres || []).map((g: string) => <span key={g} className="text-[10px] font-mono bg-[#0d0e12] border border-zinc-800 text-zinc-400 px-2 py-0.5">#{g}</span>)}
                    </div>
                    <div className="border-t-2 border-zinc-800 pt-4 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1.5 text-[10px] font-mono">
                        <a href={post.links.apple} target="_blank" rel="noreferrer" className="bg-zinc-900 hover:bg-rose-600 text-zinc-300 hover:text-white border border-zinc-800 px-2 py-1">Apple</a>
                        <a href={post.links.spotify} target="_blank" rel="noreferrer" className="bg-zinc-900 hover:bg-emerald-600 text-zinc-300 hover:text-white border border-zinc-800 px-2 py-1">Spotify</a>
                        <a href={post.links.youtube} target="_blank" rel="noreferrer" className="bg-zinc-900 hover:bg-red-600 text-zinc-300 hover:text-white border border-zinc-800 px-2 py-1">YT</a>
                        <a href={post.links.bandcamp} target="_blank" rel="noreferrer" className="bg-zinc-900 hover:bg-teal-600 text-zinc-300 hover:text-white border border-zinc-800 px-2 py-1">Bandcamp</a>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-400 font-mono text-xs">
                        <button onClick={(e) => handleLike(post.id, e)} className={"flex items-center gap-1 " + (isLiked ? 'text-rose-500 font-bold' : '')}>
                          <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                          <span>{post.likes}</span>
                        </button>
                        <button onClick={(e) => handleBookmark(post.id, e)} className={isSaved ? 'text-[#e2ff00]' : ''}>
                          <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  </div>

  {/* Detail Modal */}
  {activePostDetail && (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-[#16181e] border-2 border-[#e2ff00] max-w-2xl w-full p-6 relative font-mono">
        <button onClick={() => setActivePostDetail(null)} className="absolute top-4 right-4 bg-zinc-800 text-white p-2"><X size={20} /></button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <img src={activePostDetail.coverUrl} alt={activePostDetail.title} className="w-full aspect-square object-cover border border-zinc-800" />
          <div className="md:col-span-2">
            <span className="text-xs text-[#e2ff00] font-bold uppercase">{activePostDetail.artist}</span>
            <h2 className="text-3xl font-black uppercase text-white mt-1">{activePostDetail.title}</h2>
            <p className="text-zinc-200 text-sm leading-relaxed font-sans mt-4">{activePostDetail.writeup}</p>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Owner Passcode Modal */}
  {isLoginModalOpen && (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-[#16181e] border-2 border-[#e2ff00] max-w-sm w-full p-6 relative font-mono text-zinc-200">
        <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X size={20} /></button>
        <h3 className="text-lg font-bold uppercase text-white mb-3 flex items-center gap-2"><Lock size={18} className="text-[#e2ff00]" /> OWNER LOGIN</h3>
        <form onSubmit={handleAdminLoginSubmit} className="space-y-3">
          <input type="password" autoFocus placeholder="Enter passcode..." value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} className="w-full bg-[#0d0e12] border border-zinc-700 text-white p-2.5 text-sm" />
          <button type="submit" className="w-full bg-[#e2ff00] text-black font-bold py-2 text-xs uppercase">Unlock Admin</button>
        </form>
      </div>
    </div>
  )}

  {/* Share / Publish Modal */}
  {isShareModalOpen && (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-[#16181e] border-2 border-[#e2ff00] max-w-xl w-full p-6 relative font-mono text-zinc-200">
        <button onClick={() => setIsShareModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-xl font-black uppercase text-white mb-4 flex items-center gap-2"><Radio size={20} className="text-[#e2ff00]" /> PUBLISH NEW POST</h2>
        <div className="bg-[#0d0e12] border border-zinc-800 p-3 mb-4 flex gap-2">
          <input type="text" value={importUrl} onChange={(e) => setImportUrl(e.target.value)} placeholder="Paste link or album name..." className="flex-1 bg-[#16181e] border border-zinc-700 text-white px-3 py-2 text-xs" />
          <button type="button" onClick={handleSimulatedImport} className="bg-zinc-800 hover:bg-[#e2ff00] hover:text-black text-white px-3 py-2 text-xs font-bold uppercase flex items-center gap-1">
            <Sparkles size={14} /> {isImporting ? '...' : 'AUTO-FILL'}
          </button>
        </div>
        <form onSubmit={handleCreatePostSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" required placeholder="Album Title *" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} className="bg-[#0d0e12] border border-zinc-800 text-white p-2.5" />
            <input type="text" required placeholder="Artist *" value={newPost.artist} onChange={(e) => setNewPost({ ...newPost, artist: e.target.value })} className="bg-[#0d0e12] border border-zinc-800 text-white p-2.5" />
          </div>
          <textarea rows={3} placeholder="Writeup..." value={newPost.writeup} onChange={(e) => setNewPost({ ...newPost, writeup: e.target.value })} className="w-full bg-[#0d0e12] border border-zinc-800 text-white p-2.5" />
          <div className="flex justify-between items-center pt-2">
            <button type="button" onClick={handleLogout} className="text-rose-400 text-xs flex items-center gap-1"><LogOut size={12} /> Lock Admin</button>
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsShareModalOpen(false)} className="px-4 py-2 border border-zinc-700 uppercase font-bold">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-[#e2ff00] text-black font-bold uppercase">Publish</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* Footer with Owner Login Door */}
  <footer className="border-t-2 border-zinc-800 mt-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between font-mono text-xs text-zinc-500 gap-4">
    <div>ANTICASPER BLOG // DIY EMO & SKATER MUSIC ARCHIVE • 2026</div>
    <div className="flex items-center gap-4">
      {isOwnerAuthenticated ? (
        <button onClick={() => setIsShareModalOpen(true)} className="text-[#e2ff00] hover:underline font-bold">Open Publisher Dashboard</button>
      ) : (
        <button onClick={() => setIsLoginModalOpen(true)} className="text-zinc-600 hover:text-zinc-300 flex items-center gap-1 transition-colors">
          <Lock size={12} /> Owner Login
        </button>
      )}
    </div>
  </footer>
</div>


);
}
