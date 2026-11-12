import React, { useState, useMemo } from 'react';
import {
Play, Pause, Disc, ExternalLink, Plus, Search, Tag, Music,
Volume2, Heart, Share2, Sparkles, Filter, Check, X, Flame,
Layers, Radio, ChevronRight, Bookmark, ArrowUpRight
} from 'lucide-react';

const INITIAL_POSTS = [
{
id: 'post-1',
title: 'Floral Green',
artist: 'Title Fight',
year: '2012',
label: 'SideOneDummy Records',
coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
genres: ['Emo', 'Hardcore', 'Shoegaze', 'Midwest Emo'],
ffo: ['Turnstile', 'Fugazi', 'Basement', 'Citizen', 'Balance and Composure'],
writeup: "A timeless masterpiece that redefined modern hardcore and emo. From the thunderous bass intro of "Numb But I Still Feel It" to the melancholic haze of "Head in the Ceiling Fan", Floral Green sits comfortably as a landmark record for anyone who grew up skateboarding in empty parking lots at 2 AM. The guitar tones are sharp, gritty, yet strangely ambient.",
curator: 'anticasper_admin',
createdAt: '2 hours ago',
likes: 342,
bookmarks: 89,
links: {
apple: 'https://music.apple.com/us/album/floral-green/123456789',
spotify: 'https://open.spotify.com/album/3Xf9U5x7zQj7y8',
youtube: 'https://youtube.com/playlist?list=titlefight-floralgreen',
bandcamp: 'https://titlefight.bandcamp.com/album/floral-green'
},
featuredTrack: 'Head in the Ceiling Fan',
audioSample: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73b22.mp3?filename=ambient-guitar-chill-10821.mp3'
},
{
id: 'post-2',
title: 'GLOW ON',
artist: 'Turnstile',
year: '2021',
label: 'Roadrunner Records',
coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
genres: ['Hardcore', 'Heavy', 'Indie', 'Pop'],
ffo: ['Knocked Loose', 'Title Fight', 'Incendiary', 'Angel Du$t', 'Chubby and the Gang'],
writeup: "Turnstile broke every rule in the hardcore playbook with GLOW ON. Fusing groove-heavy riffs with dream-pop hooks, percussion breakdowns, and danceable rhythms, this album became the soundtrack to summer skate sessions worldwide. Essential listening if you like heavy riffs that make you want to move rather than just fight.",
curator: 'vibe_collector',
createdAt: '5 hours ago',
likes: 512,
bookmarks: 145,
links: {
apple: 'https://music.apple.com/us/album/glow-on/1572348',
spotify: 'https://open.spotify.com/album/2N1D8u1',
youtube: 'https://youtube.com/playlist?list=turnstile-glowon',
bandcamp: 'https://turnstile.bandcamp.com/album/glow-on'
},
featuredTrack: 'BLACKOUT',
audioSample: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=rock-riff-14828.mp3'
},
{
id: 'post-3',
title: 'Never Before Seen, Never Again',
artist: "Arm's Length",
year: '2022',
label: 'Wax Bodega',
coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
genres: ['Emo', 'Pop Punk', 'Midwest Emo', 'Screamo'],
ffo: ['Hot Mulligan', 'The Wonder Years', 'Spanish Love Songs', 'Free Throw'],
writeup: "Raw, cathartic, and relentlessly hook-filled. Arm's Length delivered one of the strongest debut emo records of the decade. Explosive vocal delivery matched with intricate guitar lines that evoke classic 2000s emo with shiny modern production punch.",
curator: 'sadboy_hours',
createdAt: '1 day ago',
likes: 218,
bookmarks: 62,
links: {
apple: 'https://music.apple.com/us/album/never-before-seen/987654',
spotify: 'https://open.spotify.com/album/4M1kX9',
youtube: 'https://youtube.com/playlist?list=armslength-nbsna',
bandcamp: 'https://armslength.bandcamp.com/album/never-before-seen-never-again'
},
featuredTrack: 'Object Permanence',
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
title: '',
artist: '',
year: '2024',
label: '',
coverUrl: '',
writeup: '',
genres: ['Emo'],
ffoInput: '',
featuredTrack: '',
apple: '',
spotify: '',
youtube: '',
bandcamp: ''
});

const allFFOBands = useMemo(() => {
const bandMap = {};
posts.forEach(post => {
post.ffo.forEach(band => {
bandMap[band] = (bandMap[band] || 0) + 1;
});
});
return Object.entries(bandMap)
.sort((a, b) => b[1] - a[1])
.map(([band]) => band);
}, [posts]);

const togglePlayTrack = (post, e) => {
if (e) e.stopPropagation();
if (currentlyPlaying === post.id) {
if (audioObj) audioObj.pause();
setCurrentlyPlaying(null);
} else {
if (audioObj) audioObj.pause();
const newAudio = new Audio(post.audioSample);
newAudio.play().catch(() => showToast("Preview play simulated"));
setAudioObj(newAudio);
setCurrentlyPlaying(post.id);
newAudio.onended = () => setCurrentlyPlaying(null);
}
};

const showToast = (msg) => {
setToastMessage(msg);
setTimeout(() => setToastMessage(null), 3000);
};

const handleLike = (id, e) => {
if (e) e.stopPropagation();
setUserLikes(prev => {
const isLiked = !!prev[id];
const newObj = { ...prev, [id]: !isLiked };
setPosts(currentPosts =>
currentPosts.map(p => p.id === id ? { ...p, likes: p.likes + (isLiked ? -1 : 1) } : p)
);
return newObj;
});
};

const handleBookmark = (id, e) => {
if (e) e.stopPropagation();
setUserBookmarks(prev => {
const isBookmarked = !!prev[id];
showToast(isBookmarked ? "Removed from bookmarks" : "Saved to your bookmarks");
return { ...prev, [id]: !isBookmarked };
});
};

const handleSimulatedImport = () => {
if (!importUrl) {
showToast("Please enter a song/album URL or name");
return;
}
setIsImporting(true);
setTimeout(() => {
setIsImporting(false);
setNewPost({
title: 'Around the Fur',
artist: 'Deftones',
year: '1997',
label: 'Maverick Records',
coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
writeup: "Auto-imported review draft for Deftones' landmark record. Heavy guitar tones paired with emotional vocal hooks that resonate deeply.",
genres: ['Heavy', 'Metalcore', 'Shoegaze'],
ffoInput: 'Loathe, Hum, Far, Fleshwater',
featuredTrack: 'Be Quiet and Drive',
apple: 'https://music.apple.com/us/album/around-the-fur/1099849553',
spotify: 'https://open.spotify.com/album/3Vw1G_9740v9d21y',
youtube: 'https://youtube.com/results?search_query=deftones+around+the+fur',
bandcamp: 'https://deftones.bandcamp.com'
});
showToast("Metadata & Streaming Links Auto-Resolved!");
}, 1200);
};

const handleCreatePostSubmit = (e) => {
e.preventDefault();
if (!newPost.title || !newPost.artist) {
showToast("Please provide Title and Artist");
return;
}

const createdPost = {
  id: `post-${Date.now()}`,
  title: newPost.title,
  artist: newPost.artist,
  year: newPost.year || '2024',
  label: newPost.label || 'Independent',
  coverUrl: newPost.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
  genres: newPost.genres.length ? newPost.genres : ['Emo'],
  ffo: newPost.ffoInput.split(',').map(s => s.trim()).filter(Boolean),
  writeup: newPost.writeup || 'No writeup provided.',
  curator: 'you_skater',
  createdAt: 'Just now',
  likes: 1,
  bookmarks: 0,
  links: {
    apple: newPost.apple || '#',
    spotify: newPost.spotify || '#',
    youtube: newPost.youtube || '#',
    bandcamp: newPost.bandcamp || '#'
  },
  featuredTrack: newPost.featuredTrack || 'Featured Single',
  audioSample: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73b22.mp3?filename=ambient-guitar-chill-10821.mp3'
};

setPosts([createdPost, ...posts]);
setIsShareModalOpen(false);
showToast("Post shared to ANTICASPER BLOG!");
setImportUrl('');
setNewPost({
  title: '', artist: '', year: '2024', label: '', coverUrl: '',
  writeup: '', genres: ['Emo'], ffoInput: '', featuredTrack: '',
  apple: '', spotify: '', youtube: '', bandcamp: ''
});


};

const filteredPosts = useMemo(() => {
return posts.filter(post => {
const matchesGenre = selectedGenre === 'All' || post.genres.includes(selectedGenre);
const matchesFFO = !selectedFFO || post.ffo.some(band => band.toLowerCase() === selectedFFO.toLowerCase());
const q = searchQuery.toLowerCase();
const matchesSearch = !q || (
post.title.toLowerCase().includes(q) ||
post.artist.toLowerCase().includes(q) ||
post.writeup.toLowerCase().includes(q) ||
post.ffo.some(b => b.toLowerCase().includes(q)) ||
post.genres.some(g => g.toLowerCase().includes(q))
);
return matchesGenre && matchesFFO && matchesSearch;
});
}, [posts, selectedGenre, selectedFFO, searchQuery]);

return (

{toastMessage && (

{toastMessage}

)}

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <header className="border-b-2 border-zinc-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div className="flex items-center space-x-3">
          <span className="bg-[#e2ff00] text-black text-xs font-mono font-black px-2 py-0.5 tracking-widest uppercase rotate-[-2deg]">
            VER. 2.4 // ANTICASPER DIY
          </span>
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider">// SKATE & EMO SOUNDS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mt-1 font-mono text-white flex items-center gap-2">
          ANTICASPER <span className="text-[#e2ff00]">BLOG</span>
        </h1>
        <p className="text-zinc-400 text-sm mt-1 max-w-xl">
          Curated underground music, album deep-dives, and cross-platform streaming links for modern emo, hardcore, and skater punk.
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="bg-[#e2ff00] hover:bg-yellow-300 text-black font-mono font-bold px-5 py-3 text-sm tracking-wider uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center space-x-2 cursor-pointer"
        >
          <Plus size={18} strokeWidth={3} />
          <span>SHARE MUSIC + LINK</span>
        </button>
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="md:col-span-3 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search artist, album, genre, or 'For Fans Of' band..."
          className="w-full bg-[#16181e] border-2 border-zinc-800 text-white pl-11 pr-10 py-3 text-sm font-mono focus:border-[#e2ff00] focus:outline-none transition-colors"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>
      <div className="bg-[#16181e] border-2 border-zinc-800 p-3 flex items-center justify-between font-mono text-xs">
        <span className="text-zinc-400 uppercase">ARCHIVE COUNT:</span>
        <span className="text-[#e2ff00] font-bold text-base">{filteredPosts.length} POSTS</span>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1 space-y-8">
        <div className="bg-[#16181e] border-2 border-zinc-800 p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Filter size={16} className="text-[#e2ff00]" />
              GENRES
            </h2>
            {selectedGenre !== 'All' && (
              <button onClick={() => setSelectedGenre('All')} className="text-[10px] font-mono text-[#e2ff00] hover:underline">RESET</button>
            )}
          </div>
          <div className="flex flex-wrap lg:flex-col gap-1.5">
            {ALL_GENRES.map((genre) => {
              const isActive = selectedGenre === genre;
              const count = genre === 'All' ? posts.length : posts.filter(p => p.genres.includes(genre)).length;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`text-left px-3 py-2 text-xs font-mono transition-all flex items-center justify-between border ${
                    isActive ? 'bg-[#e2ff00] text-black border-[#e2ff00] font-bold shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]' : 'bg-[#0d0e12] text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
                  }`}
                >
                  <span className="uppercase"># {genre}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 ${isActive ? 'bg-black text-[#e2ff00]' : 'bg-zinc-800 text-zinc-400'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-[#16181e] border-2 border-zinc-800 p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Radio size={16} className="text-[#e2ff00]" />
              LATEST POSTS
            </h2>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">FRESH CUTS</span>
          </div>
          <div className="space-y-3">
            {posts.slice(0, 4).map((post) => (
              <button
                key={`latest-${post.id}`}
                onClick={() => setActivePostDetail(post)}
                className="w-full text-left group flex items-start space-x-3 p-2 bg-[#0d0e12] hover:bg-zinc-900 border border-zinc-800/80 hover:border-[#e2ff00] transition-all"
              >
                <img src={post.coverUrl} alt={post.title} className="w-10 h-10 object-cover flex-shrink-0 border border-zinc-700 group-hover:border-[#e2ff00]" />
                <div className="overflow-hidden">
                  <div className="text-[11px] font-mono text-white font-bold truncate group-hover:text-[#e2ff00]">{post.artist} - {post.title}</div>
                  <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5 mt-0.5">
                    <span>{post.createdAt}</span>
                    <span>•</span>
                    <span className="text-[#e2ff00]">{post.genres[0]}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#16181e] border-2 border-zinc-800 p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Flame size={16} className="text-[#e2ff00]" />
              FOR FANS OF... (FFO)
            </h2>
            {selectedFFO && (
              <button onClick={() => setSelectedFFO(null)} className="text-[10px] font-mono text-[#e2ff00] hover:underline">CLEAR</button>
            )}
          </div>
          <p className="text-zinc-400 text-xs mb-4">Click an artist influence to discover similar sounds on the blog:</p>
          <div className="flex flex-wrap gap-2">
            {allFFOBands.map((band) => {
              const isSelected = selectedFFO?.toLowerCase() === band.toLowerCase();
              return (
                <button
                  key={band}
                  onClick={() => setSelectedFFO(isSelected ? null : band)}
                  className={`text-xs font-mono px-2.5 py-1 transition-all border ${
                    isSelected ? 'bg-rose-500 text-white border-rose-500 font-bold' : 'bg-[#0d0e12] text-zinc-300 border-zinc-800 hover:border-[#e2ff00] hover:text-[#e2ff00]'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}{band}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <main className="lg:col-span-3 space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="bg-[#16181e] border-2 border-zinc-800 p-12 text-center font-mono">
            <Music size={48} className="mx-auto text-zinc-600 mb-4" />
            <h3 className="text-xl font-bold uppercase text-white mb-2">NO POSTS MATCH YOUR VIBE</h3>
            <p className="text-zinc-400 text-sm mb-6">Try clearing your filters or search terms.</p>
            <button
              onClick={() => { setSelectedGenre('All'); setSelectedFFO(null); setSearchQuery(''); }}
              className="bg-[#e2ff00] text-black font-bold px-4 py-2 text-xs uppercase"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => {
              const isPlaying = currentlyPlaying === post.id;
              const isLiked = !!userLikes[post.id];
              const isBookmarked = !!userBookmarks[post.id];

              return (
                <article
                  key={post.id}
                  onClick={() => setActivePostDetail(post)}
                  className="group bg-[#16181e] border-2 border-zinc-800 hover:border-zinc-400 transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden"
                >
                  <div className="p-4 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500 uppercase">CURATED BY <span className="text-white">@{post.curator}</span></span>
                    <span className="text-zinc-500">{post.createdAt}</span>
                  </div>
                  <div className="relative aspect-square bg-zinc-900 overflow-hidden group">
                    <img src={post.coverUrl} alt={`${post.title} by ${post.artist}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <button
                      onClick={(e) => togglePlayTrack(post, e)}
                      className={`absolute bottom-4 right-4 z-10 p-3 rounded-full border-2 border-black shadow-lg transition-all ${
                        isPlaying ? 'bg-[#e2ff00] text-black scale-110' : 'bg-black/80 text-white hover:bg-[#e2ff00] hover:text-black'
                      }`}
                    >
                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-0.5" fill="currentColor" />}
                    </button>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-mono text-[#e2ff00] font-bold uppercase">{post.artist}</span>
                        <span className="text-zinc-600 font-mono">•</span>
                        <span className="text-xs font-mono text-zinc-400">{post.year}</span>
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-[#e2ff00] transition-colors font-mono">
                        {post.title}
                      </h3>
                      <p className="text-zinc-300 text-xs mt-3 line-clamp-3 leading-relaxed">
                        {post.writeup}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {post.genres.map(g => (
                        <span key={g} className="text-[10px] font-mono bg-[#0d0e12] border border-zinc-800 text-zinc-400 px-2 py-0.5">#{g}</span>
                      ))}
                    </div>
                    <div className="border-t-2 border-zinc-800 pt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                        <a href={post.links.apple} target="_blank" rel="noreferrer" className="text-[10px] font-mono bg-zinc-900 hover:bg-rose-600 hover:text-white text-zinc-300 border border-zinc-800 px-2 py-1">Apple</a>
                        <a href={post.links.spotify} target="_blank" rel="noreferrer" className="text-[10px] font-mono bg-zinc-900 hover:bg-emerald-600 hover:text-white text-zinc-300 border border-zinc-800 px-2 py-1">Spotify</a>
                        <a href={post.links.youtube} target="_blank" rel="noreferrer" className="text-[10px] font-mono bg-zinc-900 hover:bg-red-600 hover:text-white text-zinc-300 border border-zinc-800 px-2 py-1">YT</a>
                        <a href={post.links.bandcamp} target="_blank" rel="noreferrer" className="text-[10px] font-mono bg-zinc-900 hover:bg-teal-600 hover:text-white text-zinc-300 border border-zinc-800 px-2 py-1">Bandcamp</a>
                      </div>
                      <div className="flex items-center space-x-3 text-zinc-400 font-mono text-xs" onClick={(e) => e.stopPropagation()}>
                        <button onClick={(e) => handleLike(post.id, e)} className={`flex items-center space-x-1 hover:text-rose-500 ${isLiked ? 'text-rose-500 font-bold' : ''}`}>
                          <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                          <span>{post.likes}</span>
                        </button>
                        <button onClick={(e) => handleBookmark(post.id, e)} className={`hover:text-[#e2ff00] ${isBookmarked ? 'text-[#e2ff00]' : ''}`}>
                          <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
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

  {activePostDetail && (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#16181e] border-2 border-[#e2ff00] max-w-3xl w-full p-6 relative my-8 font-mono shadow-2xl">
        <button onClick={() => setActivePostDetail(null)} className="absolute top-4 right-4 bg-zinc-800 hover:bg-[#e2ff00] hover:text-black text-white p-2 border border-zinc-700">
          <X size={20} />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="relative aspect-square bg-zinc-900 border-2 border-zinc-800">
              <img src={activePostDetail.coverUrl} alt={activePostDetail.title} className="w-full h-full object-cover" />
              <button onClick={(e) => togglePlayTrack(activePostDetail, e)} className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center text-[#e2ff00] group">
                <div className="bg-black border-2 border-[#e2ff00] p-4 rounded-full group-hover:scale-110">
                  {currentlyPlaying === activePostDetail.id ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                </div>
              </button>
            </div>
          </div>
          <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#e2ff00] font-bold uppercase">{activePostDetail.artist}</span>
              <h2 className="text-3xl font-black uppercase text-white tracking-tight mt-1">{activePostDetail.title}</h2>
              <p className="text-zinc-500 text-xs mt-1">Curated by @{activePostDetail.curator} • {activePostDetail.createdAt}</p>
              <div className="my-4 border-t border-b border-zinc-800 py-4 text-zinc-200 text-sm leading-relaxed font-sans">
                {activePostDetail.writeup}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

  {isShareModalOpen && (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#16181e] border-2 border-[#e2ff00] max-w-2xl w-full p-6 relative my-8 font-mono text-zinc-200">
        <button onClick={() => setIsShareModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <X size={20} />
        </button>
        <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-1 flex items-center gap-2">
          <Radio size={24} className="text-[#e2ff00]" />
          ADD NEW ANTICASPER POST
        </h2>
        <div className="bg-[#0d0e12] border border-zinc-800 p-4 mb-6 mt-4">
          <label className="block text-xs font-bold text-[#e2ff00] mb-2 uppercase">1-Click Apple Music Link Importer</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder="Paste link or album name (e.g. Deftones)"
              className="flex-1 bg-[#16181e] border border-zinc-700 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ff00]"
            />
            <button type="button" onClick={handleSimulatedImport} disabled={isImporting} className="bg-zinc-800 hover:bg-[#e2ff00] hover:text-black text-white px-4 py-2 text-xs font-bold uppercase flex items-center gap-1">
              <Sparkles size={14} />
              <span>{isImporting ? 'FETCHING...' : 'AUTO-FILL'}</span>
            </button>
          </div>
        </div>
        <form onSubmit={handleCreatePostSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1 font-bold">ALBUM TITLE *</label>
              <input type="text" required value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} className="w-full bg-[#0d0e12] border border-zinc-800 text-white p-2.5" />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-bold">ARTIST *</label>
              <input type="text" required value={newPost.artist} onChange={(e) => setNewPost({ ...newPost, artist: e.target.value })} className="w-full bg-[#0d0e12] border border-zinc-800 text-white p-2.5" />
            </div>
          </div>
          <div>
            <label className="block text-zinc-400 mb-1 font-bold">WRITEUP</label>
            <textarea rows={3} value={newPost.writeup} onChange={(e) => setNewPost({ ...newPost, writeup: e.target.value })} className="w-full bg-[#0d0e12] border border-zinc-800 text-white p-2.5" />
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsShareModalOpen(false)} className="px-4 py-2 border border-zinc-700 text-zinc-300 uppercase font-bold">CANCEL</button>
            <button type="submit" className="px-6 py-2 bg-[#e2ff00] text-black font-bold uppercase hover:bg-yellow-300">PUBLISH</button>
          </div>
        </form>
      </div>
    </div>
  )}

  <footer className="border-t-2 border-zinc-800 mt-16 py-8 bg-[#0d0e12]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between font-mono text-xs text-zinc-500 gap-4">
      <div><span className="text-white font-bold">ANTICASPER BLOG</span> // DIY EMO & SKATER MUSIC ARCHIVE</div>
      <div>BUILT FOR HEADPHONES & SKATEPARKS • 2026</div>
    </div>
  </footer>
</div>


);
}
