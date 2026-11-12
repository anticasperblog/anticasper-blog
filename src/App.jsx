import React, { useState, useMemo, useEffect } from 'react';
import {
Play, Pause, Disc, ExternalLink, Plus, Search, Tag, Music,
Volume2, Heart, Share2, Sparkles, Filter, Check, X, Flame,
Layers, Radio, ChevronRight, Bookmark, ArrowUpRight, Copy
} from 'lucide-react';

// Initial Sample Music Posts (Emo / Skater / Hardcore / Indie showcase)
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
writeup: A timeless masterpiece that redefined modern hardcore and emo. From the thunderous bass intro of "Numb But I Still Feel It" to the melancholic haze of "Head in the Ceiling Fan", Floral Green sits comfortably as a landmark record for anyone who grew up skateboarding in empty parking lots at 2 AM. The guitar tones are sharp, gritty, yet strangely ambient.,
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
writeup: Turnstile broke every rule in the hardcore playbook with GLOW ON. Fusing groove-heavy riffs with dream-pop hooks, percussion breakdowns, and danceable rhythms, this album became the soundtrack to summer skate sessions worldwide. Essential listening if you like heavy riffs that make you want to move rather than just fight.,
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
writeup: Raw, cathartic, and relentlessly hook-filled. Arm's Length delivered one of the strongest debut emo records of the decade. Explosive vocal delivery matched with intricate guitar lines that evoke classic 2000s emo with shiny modern production punch.,
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
},
{
id: 'post-4',
title: 'American Football (LP1)',
artist: 'American Football',
year: '1999',
label: 'Polyvinyl Record Co.',
coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
genres: ['Midwest Emo', 'Math Rock', 'Indie', 'Chill'],
ffo: ['Sunny Day Real Estate', 'Cap'n Jazz', 'Covet', 'TTNG', 'Mineral'],
writeup: The house in Urbana, Illinois. The clean, interlocking 6/8 and 7/8 guitar riffs. The muted trumpet solos. LP1 is the undisputed holy grail of Midwest Emo and math rock. Perfect late-night study or rooftop chill record.,
curator: 'poly_rhythm',
createdAt: '2 days ago',
likes: 890,
bookmarks: 410,
links: {
apple: 'https://music.apple.com/us/album/american-football/2345678',
spotify: 'https://open.spotify.com/album/1A2B3C',
youtube: 'https://youtube.com/playlist?list=americanfootball-lp1',
bandcamp: 'https://americanfootball.bandcamp.com/album/american-football'
},
featuredTrack: 'Never Meant',
audioSample: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c33f2780f2.mp3?filename=soft-acoustic-lullaby-10330.mp3'
},
{
id: 'post-5',
title: 'You'll Be Fine',
artist: 'Hot Mulligan',
year: '2020',
label: 'No Sleep Records',
coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&q=80&w=800',
genres: ['Pop Punk', 'Emo', 'Midwest Emo'],
ffo: ['The Story So Far', 'Mom Jeans.', 'Free Throw', 'Knuckle Puck'],
writeup: Hot Mulligan self-identify as '#1 Hot New Band' for a reason. Desperate, gravelly vocals paired with mathy emo-revival riffs and tongue-in-cheek song titles. It captures the modern anxiety of growing older and feeling behind.,
curator: 'post_hardcore_pete',
createdAt: '3 days ago',
likes: 421,
bookmarks: 112,
links: {
apple: 'https://music.apple.com/us/album/youll-be-fine/3456789',
spotify: 'https://open.spotify.com/album/9Z8Y7X',
youtube: 'https://youtube.com/playlist?list=hotmulligan-ybf',
bandcamp: 'https://hotmulligan.bandcamp.com/album/youll-be-fine'
},
featuredTrack: 'BCKYRD',
audioSample: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_1e89b4b0a4.mp3?filename=punk-rock-drive-18239.mp3'
},
{
id: 'post-6',
title: 'Punisher',
artist: 'Phoebe Bridgers',
year: '2020',
label: 'Dead Oceans',
coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
genres: ['Folk', 'Indie', 'Chill', 'Emo'],
ffo: ['Julien Baker', 'Lucy Dacus', 'Bright Eyes', 'Boygenius', 'Elliott Smith'],
writeup: Atmospheric, ghostly, and intensely lyrical. Punisher mixes bedroom indie folk with subtle electronics and apocalyptic strings, culminating in the earth-shattering scream on "I Know The End". A modern melancholy masterpiece.,
curator: 'ghost_notes',
createdAt: '4 days ago',
likes: 765,
bookmarks: 230,
links: {
apple: 'https://music.apple.com/us/album/punisher/4567890',
spotify: 'https://open.spotify.com/album/5H6I7J',
youtube: 'https://youtube.com/playlist?list=phoebebridgers-punisher',
bandcamp: 'https://phoebebridgers.bandcamp.com/album/punisher'
},
featuredTrack: 'I Know The End',
audioSample: 'https://cdn.pixabay.com/download/audio/2021/11/24/audio_3d15982e56.mp3?filename=melancholic-piano-and-strings-8102.mp3'
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

// New Post Form State
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

// Collect all unique FFO bands across posts
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

// Audio Playback Handling
const togglePlayTrack = (post, e) => {
if (e) e.stopPropagation();
if (currentlyPlaying === post.id) {
if (audioObj) {
audioObj.pause();
}
setCurrentlyPlaying(null);
} else {
if (audioObj) {
audioObj.pause();
}
const newAudio = new Audio(post.audioSample);
newAudio.play().catch(() => showToast("Preview play simulated"));
setAudioObj(newAudio);
setCurrentlyPlaying(post.id);

  newAudio.onended = () => {
    setCurrentlyPlaying(null);
  };
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

// Smart Link Importer Simulation
const handleSimulatedImport = () => {
if (!importUrl) {
showToast("Please enter a song/album URL or name");
return;
}
setIsImporting(true);

setTimeout(() => {
  setIsImporting(false);
  const cleanInput = importUrl.toLowerCase();

  let mockArtist = "Basement";
  let mockTitle = "colourmeinkindness";
  let mockCover = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800";
  let mockGenres = ["Emo", "Hardcore", "Shoegaze"];
  let mockFFO = "Title Fight, Superheaven, Daylight, Citizen";

  if (cleanInput.includes("deftones") || cleanInput.includes("around the fur")) {
    mockArtist = "Deftones";
    mockTitle = "Around the Fur";
    mockCover = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800";
    mockGenres = ["Heavy", "Metalcore", "Shoegaze"];
    mockFFO = "Loathe, Hum, Far, Fleshwater";
  } else if (cleanInput.includes("sunny day") || cleanInput.includes("diary")) {
    mockArtist = "Sunny Day Real Estate";
    mockTitle = "Diary";
    mockCover = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800";
    mockGenres = ["Emo", "Midwest Emo", "Indie"];
    mockFFO = "American Football, Mineral, Christie Front Drive";
  }

  const slug = mockTitle.toLowerCase().replace(/\s+/g, '-');
  const artistSlug = mockArtist.toLowerCase().replace(/\s+/g, '');

  setNewPost({
    title: mockTitle,
    artist: mockArtist,
    year: '2023',
    label: 'Run For Cover Records',
    coverUrl: mockCover,
    writeup: `Auto-imported review draft for ${mockArtist}'s landmark record "${mockTitle}". Heavy guitar tones paired with emotional vocal hooks that resonate deeply. Perfect soundtrack for late night skates and headphone listening sessions.`,
    genres: mockGenres,
    ffoInput: mockFFO,
    featuredTrack: 'Track 01',
    apple: `https://music.apple.com/us/album/${slug}/99887766`,
    spotify: `https://open.spotify.com/album/${slug}-id`,
    youtube: `https://youtube.com/results?search_query=${artistSlug}+${slug}`,
    bandcamp: `https://${artistSlug}.bandcamp.com/album/${slug}`
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

// Filter Logic
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

{/* Toast Banner */}
{toastMessage && (


{toastMessage}

)}

  {/* Main Container */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    
    {/* Header / Navbar */}
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

    {/* Global Search & Quick Stats Bar */}
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
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="bg-[#16181e] border-2 border-zinc-800 p-3 flex items-center justify-between font-mono text-xs">
        <span className="text-zinc-400 uppercase">ARCHIVE COUNT:</span>
        <span className="text-[#e2ff00] font-bold text-base">{filteredPosts.length} POSTS</span>
      </div>
    </div>

    {/* Layout Grid: Sidebar + Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

      {/* Left Sidebar: Genre Menu + Latest Posts + FFO Explorer */}
      <aside className="lg:col-span-1 space-y-8">
        
        {/* Genre Filter Panel */}
        <div className="bg-[#16181e] border-2 border-zinc-800 p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Filter size={16} className="text-[#e2ff00]" />
              GENRES
            </h2>
            {selectedGenre !== 'All' && (
              <button 
                onClick={() => setSelectedGenre('All')}
                className="text-[10px] font-mono text-[#e2ff00] hover:underline"
              >
                RESET
              </button>
            )}
          </div>

          <div className="flex flex-wrap lg:flex-col gap-1.5">
            {ALL_GENRES.map((genre) => {
              const isActive = selectedGenre === genre;
              const count = genre === 'All' 
                ? posts.length 
                : posts.filter(p => p.genres.includes(genre)).length;

              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`text-left px-3 py-2 text-xs font-mono transition-all flex items-center justify-between border ${
                    isActive 
                      ? 'bg-[#e2ff00] text-black border-[#e2ff00] font-bold shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]' 
                      : 'bg-[#0d0e12] text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
                  }`}
                >
                  <span className="uppercase"># {genre}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 ${isActive ? 'bg-black text-[#e2ff00]' : 'bg-zinc-800 text-zinc-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Latest Posts Quick Access Panel */}
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
                <img 
                  src={post.coverUrl} 
                  alt={post.title} 
                  className="w-10 h-10 object-cover flex-shrink-0 border border-zinc-700 group-hover:border-[#e2ff00]"
                />
                <div className="overflow-hidden">
                  <div className="text-[11px] font-mono text-white font-bold truncate group-hover:text-[#e2ff00]">
                    {post.artist} - {post.title}
                  </div>
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

        {/* "For Fans Of" (FFO) Explorer Panel */}
        <div className="bg-[#16181e] border-2 border-zinc-800 p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Flame size={16} className="text-[#e2ff00]" />
              FOR FANS OF... (FFO)
            </h2>
            {selectedFFO && (
              <button 
                onClick={() => setSelectedFFO(null)}
                className="text-[10px] font-mono text-[#e2ff00] hover:underline"
              >
                CLEAR
              </button>
            )}
          </div>
          <p className="text-zinc-400 text-xs mb-4">
            Click an artist influence to discover similar sounds on the blog:
          </p>

          <div className="flex flex-wrap gap-2">
            {allFFOBands.map((band) => {
              const isSelected = selectedFFO?.toLowerCase() === band.toLowerCase();
              return (
                <button
                  key={band}
                  onClick={() => setSelectedFFO(isSelected ? null : band)}
                  className={`text-xs font-mono px-2.5 py-1 transition-all border ${
                    isSelected
                      ? 'bg-rose-500 text-white border-rose-500 font-bold'
                      : 'bg-[#0d0e12] text-zinc-300 border-zinc-800 hover:border-[#e2ff00] hover:text-[#e2ff00]'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}{band}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skater Zine Callout Widget */}
        <div className="border-2 border-dashed border-zinc-800 p-4 text-center font-mono text-xs text-zinc-400">
          <Disc className="mx-auto text-zinc-600 mb-2 animate-spin-slow" size={28} />
          <p className="text-white font-bold uppercase mb-1">DIY TAPE EXCHANGE</p>
          <p>Got an unreleased demo or band recommendation? Click <span className="text-[#e2ff00]">"SHARE MUSIC"</span> to add it to our archive.</p>
        </div>

      </aside>

      {/* Right Main Feed Section */}
      <main className="lg:col-span-3 space-y-6">

        {/* Active Filter Bar */}
        {(selectedGenre !== 'All' || selectedFFO || searchQuery) && (
          <div className="bg-[#16181e] border-2 border-[#e2ff00] p-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <span className="text-zinc-400">FILTERING BY:</span>
              {selectedGenre !== 'All' && (
                <span className="bg-[#e2ff00] text-black px-2 py-1 font-bold">
                  GENRE: {selectedGenre}
                </span>
              )}
              {selectedFFO && (
                <span className="bg-rose-500 text-white px-2 py-1 font-bold">
                  FFO: {selectedFFO}
                </span>
              )}
              {searchQuery && (
                <span className="bg-zinc-800 text-white px-2 py-1">
                  QUERY: "{searchQuery}"
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedGenre('All');
                setSelectedFFO(null);
                setSearchQuery('');
              }}
              className="text-zinc-400 hover:text-white uppercase underline"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Post Feed Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-[#16181e] border-2 border-zinc-800 p-12 text-center font-mono">
            <Music size={48} className="mx-auto text-zinc-600 mb-4" />
            <h3 className="text-xl font-bold uppercase text-white mb-2">NO POSTS MATCH YOUR VIBE</h3>
            <p className="text-zinc-400 text-sm mb-6">Try clearing your filters or search terms.</p>
            <button
              onClick={() => {
                setSelectedGenre('All');
                setSelectedFFO(null);
                setSearchQuery('');
              }}
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
                  {/* Top Bar / Metadata */}
                  <div className="p-4 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500 uppercase">
                      CURATED BY <span className="text-white">@{post.curator}</span>
                    </span>
                    <span className="text-zinc-500">{post.createdAt}</span>
                  </div>

                  {/* Album Art Container with Play Overlay */}
                  <div className="relative aspect-square bg-zinc-900 overflow-hidden group">
                    <img 
                      src={post.coverUrl} 
                      alt={`${post.title} by ${post.artist}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Audio Preview Play Trigger */}
                    <button
                      onClick={(e) => togglePlayTrack(post, e)}
                      className={`absolute bottom-4 right-4 z-10 p-3 rounded-full border-2 border-black shadow-lg transition-all ${
                        isPlaying 
                          ? 'bg-[#e2ff00] text-black scale-110' 
                          : 'bg-black/80 text-white hover:bg-[#e2ff00] hover:text-black'
                      }`}
                      title="Preview Track"
                    >
                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-0.5" fill="currentColor" />}
                    </button>

                    {/* Playing Wave Indicator Badge */}
                    {isPlaying && (
                      <div className="absolute top-4 left-4 bg-black/90 border border-[#e2ff00] px-3 py-1 flex items-center space-x-2 text-[#e2ff00] font-mono text-[10px]">
                        <Volume2 size={14} className="animate-pulse" />
                        <span>PLAYING PREVIEW</span>
                      </div>
                    )}
                  </div>

                  {/* Info & Content */}
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

                      {/* Snippet Writeup */}
                      <p className="text-zinc-300 text-xs mt-3 line-clamp-3 leading-relaxed">
                        {post.writeup}
                      </p>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {post.genres.map(g => (
                        <span key={g} className="text-[10px] font-mono bg-[#0d0e12] border border-zinc-800 text-zinc-400 px-2 py-0.5">
                          #{g}
                        </span>
                      ))}
                    </div>

                    {/* FFO Tags */}
                    {post.ffo.length > 0 && (
                      <div className="text-[11px] font-mono text-zinc-400 border-t border-zinc-800/80 pt-3">
                        <span className="text-zinc-500 font-bold">FFO: </span>
                        {post.ffo.slice(0, 3).join(', ')}
                        {post.ffo.length > 3 && ` +${post.ffo.length - 3} more`}
                      </div>
                    )}

                    {/* Streaming Platform Fast Links Bar */}
                    <div className="border-t-2 border-zinc-800 pt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={post.links.apple}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-mono bg-zinc-900 hover:bg-rose-600 hover:text-white text-zinc-300 border border-zinc-800 px-2 py-1 transition-colors flex items-center gap-1"
                          title="Apple Music"
                        >
                          Apple
                        </a>
                        <a
                          href={post.links.spotify}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-mono bg-zinc-900 hover:bg-emerald-600 hover:text-white text-zinc-300 border border-zinc-800 px-2 py-1 transition-colors flex items-center gap-1"
                          title="Spotify"
                        >
                          Spotify
                        </a>
                        <a
                          href={post.links.youtube}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-mono bg-zinc-900 hover:bg-red-600 hover:text-white text-zinc-300 border border-zinc-800 px-2 py-1 transition-colors flex items-center gap-1"
                          title="YouTube"
                        >
                          YT
                        </a>
                        <a
                          href={post.links.bandcamp}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-mono bg-zinc-900 hover:bg-teal-600 hover:text-white text-zinc-300 border border-zinc-800 px-2 py-1 transition-colors flex items-center gap-1"
                          title="Bandcamp"
                        >
                          Bandcamp
                        </a>
                      </div>

                      {/* Social Actions */}
                      <div className="flex items-center space-x-3 text-zinc-400 font-mono text-xs" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={(e) => handleLike(post.id, e)}
                          className={`flex items-center space-x-1 hover:text-rose-500 ${isLiked ? 'text-rose-500 font-bold' : ''}`}
                        >
                          <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                          <span>{post.likes}</span>
                        </button>
                        <button 
                          onClick={(e) => handleBookmark(post.id, e)}
                          className={`hover:text-[#e2ff00] ${isBookmarked ? 'text-[#e2ff00]' : ''}`}
                        >
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

  {/* POST DETAIL EXPANDED MODAL */}
  {activePostDetail && (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#16181e] border-2 border-[#e2ff00] max-w-3xl w-full p-6 relative my-8 font-mono shadow-2xl">
        
        <button
          onClick={() => setActivePostDetail(null)}
          className="absolute top-4 right-4 bg-zinc-800 hover:bg-[#e2ff00] hover:text-black text-white p-2 border border-zinc-700 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Album Cover & Track Preview Trigger */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-zinc-900 border-2 border-zinc-800">
              <img 
                src={activePostDetail.coverUrl} 
                alt={activePostDetail.title} 
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => togglePlayTrack(activePostDetail, e)}
                className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center text-[#e2ff00] transition-colors group"
              >
                <div className="bg-black border-2 border-[#e2ff00] p-4 rounded-full group-hover:scale-110 transition-transform">
                  {currentlyPlaying === activePostDetail.id ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                </div>
              </button>
            </div>

            <div className="bg-[#0d0e12] border border-zinc-800 p-3 text-xs space-y-1 text-zinc-400">
              <div><span className="text-zinc-500">RELEASE YEAR:</span> {activePostDetail.year}</div>
              <div><span className="text-zinc-500">LABEL:</span> {activePostDetail.label}</div>
              <div><span className="text-zinc-500">FEATURED TRACK:</span> <span className="text-[#e2ff00]">{activePostDetail.featuredTrack}</span></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#e2ff00] font-bold uppercase tracking-wider">{activePostDetail.artist}</span>
              <h2 className="text-3xl font-black uppercase text-white tracking-tight mt-1">
                {activePostDetail.title}
              </h2>
              <p className="text-zinc-500 text-xs mt-1">Curated by @{activePostDetail.curator} • {activePostDetail.createdAt}</p>

              <div className="my-4 border-t border-b border-zinc-800 py-4 text-zinc-200 text-sm leading-relaxed whitespace-pre-line font-sans">
                {activePostDetail.writeup}
              </div>

              {/* FFO List */}
              <div className="mb-4">
                <span className="text-xs text-zinc-400 font-bold uppercase block mb-1">For Fans Of (FFO):</span>
                <div className="flex flex-wrap gap-1.5">
                  {activePostDetail.ffo.map(band => (
                    <button
                      key={band}
                      onClick={() => {
                        setSelectedFFO(band);
                        setActivePostDetail(null);
                      }}
                      className="text-xs bg-rose-950/40 text-rose-300 border border-rose-800/60 px-2 py-0.5 hover:bg-rose-900"
                    >
                      + {band}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Streaming Links Section */}
            <div className="space-y-2 pt-4 border-t border-zinc-800">
              <span className="text-xs text-zinc-400 font-bold uppercase block">LISTEN ON YOUR PLATFORM:</span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={activePostDetail.links.apple}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-zinc-900 hover:bg-rose-600 hover:text-white border border-zinc-800 p-2 text-xs flex items-center justify-between transition-colors"
                >
                  <span>Apple Music</span>
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href={activePostDetail.links.spotify}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-zinc-900 hover:bg-emerald-600 hover:text-white border border-zinc-800 p-2 text-xs flex items-center justify-between transition-colors"
                >
                  <span>Spotify</span>
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href={activePostDetail.links.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-zinc-900 hover:bg-red-600 hover:text-white border border-zinc-800 p-2 text-xs flex items-center justify-between transition-colors"
                >
                  <span>YouTube</span>
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href={activePostDetail.links.bandcamp}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-zinc-900 hover:bg-teal-600 hover:text-white border border-zinc-800 p-2 text-xs flex items-center justify-between transition-colors"
                >
                  <span>Bandcamp</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )}

  {/* SHARE / CREATE NEW POST MODAL */}
  {isShareModalOpen && (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#16181e] border-2 border-[#e2ff00] max-w-2xl w-full p-6 relative my-8 font-mono text-zinc-200">
        
        <button
          onClick={() => setIsShareModalOpen(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-1 flex items-center gap-2">
          <Radio size={24} className="text-[#e2ff00]" />
          ADD NEW ANTICASPER POST
        </h2>
        <p className="text-zinc-400 text-xs mb-6">
          Paste an Apple Music link (or album name) to auto-fetch streaming links & cover artwork:
        </p>

        {/* Smart Importer Section */}
        <div className="bg-[#0d0e12] border border-zinc-800 p-4 mb-6">
          <label className="block text-xs font-bold text-[#e2ff00] mb-2 uppercase">
            1-Click Apple Music Link / Song Importer
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder="https://music.apple.com/... or 'Deftones - Around the Fur'"
              className="flex-1 bg-[#16181e] border border-zinc-700 text-white px-3 py-2 text-xs font-mono focus:border-[#e2ff00] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSimulatedImport}
              disabled={isImporting}
              className="bg-zinc-800 hover:bg-[#e2ff00] hover:text-black text-white px-4 py-2 text-xs font-bold uppercase transition-colors flex items-center gap-1"
            >
              {isImporting ? <Disc className="animate-spin" size={14} /> : <Sparkles size={14} />}
              <span>{isImporting ? 'FETCHING...' : 'AUTO-FILL'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleCreatePostSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1 font-bold">ALBUM TITLE *</label>
              <input
                type="text"
                required
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="e.g. Floral Green"
                className="w-full bg-[#0d0e12] border border-zinc-800 text-white p-2.5 font-mono focus:border-[#e2ff00] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-bold">ARTIST / BAND *</label>
              <input
                type="text"
                required
                value={newPost.artist}
                onChange={(e) => setNewPost({ ...newPost, artist: e.target.value })}
                placeholder="e.g. Title Fight"
                className="w-full bg-[#0d0e12] border border-zinc-800 text-white p-2.5 font-mono focus:border-[#e2ff00] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1 font-bold">YEAR</label>
              <input
                type="text"
                value={newPost.year}
                onChange={(e) => setNewPost({ ...newPost, year: e.target.value })}
                className="w-full bg-[#0d0e12] border border-zinc-800 text-white p-2.5 font-mono focus:border-[#e2ff00] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-bold">LABEL</label>
              <input
                type="text"
                value={newPost.label}
                onChange={(e) => setNewPost({ ...newPost, label: e.target.value })}
                placeholder="e.g. SideOneDummy"
                className="w-full bg-[#0d0e12] border border-zinc-800 text-white p-2.5 font-mono focus:border-[#e2ff00] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-bold">FEATURED TRACK</label>
              <input
                type="text"
                value={newPost.featuredTrack}
                onChange={(e) => setNewPost({ ...newPost, featuredTrack: e.target.value })}
                placeholder="e.g. Secret Song"
                className="w-full bg-[#0d0e12] border border-zinc-800 text-white p-2.5 font-mono focus:border-[#e2ff00] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-bold">COVER IMAGE URL</label>
            <input
              type="url"
              value={newPost.coverUrl}
              onChange={(e) => setNewPost({ ...newPost, coverUrl: e.target.value })}
              placeholder="https://..."
              className="w-full bg-[#0d0e12] border border-zinc-800 text-white p-2.5 font-mono focus:border-[#e2ff00] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-bold">ALBUM WRITEUP / REVIEW</label>
            <textarea
              rows={4}
              value={newPost.writeup}
              onChange={(e) => setNewPost({ ...newPost, writeup: e.target.value })}
              placeholder="What makes this record special? Describe the riffs, atmosphere, or skate memories..."
              className="w-full bg-[#0d0e12] border border-zinc-800 text-white p-2.5 font-mono focus:border-[#e2ff00] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-bold">FOR FANS OF (FFO) - COMMA SEPARATED</label>
            <input
              type="text"
              value={newPost.ffoInput}
              onChange={(e) => setNewPost({ ...newPost, ffoInput: e.target.value })}
              placeholder="Turnstile, Fugazi, Basement, Citizen"
              className="w-full bg-[#0d0e12] border border-zinc-800 text-white p-2.5 font-mono focus:border-[#e2ff00] focus:outline-none"
            />
          </div>

          {/* Cross Platform Streaming Links */}
          <div className="border-t border-zinc-800 pt-3 space-y-2">
            <label className="block text-zinc-400 font-bold uppercase">GENERATED STREAMING LINKS</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Apple Music Link"
                value={newPost.apple}
                onChange={(e) => setNewPost({ ...newPost, apple: e.target.value })}
                className="bg-[#0d0e12] border border-zinc-800 text-zinc-300 p-2 font-mono"
              />
              <input
                type="text"
                placeholder="Spotify Link"
                value={newPost.spotify}
                onChange={(e) => setNewPost({ ...newPost, spotify: e.target.value })}
                className="bg-[#0d0e12] border border-zinc-800 text-zinc-300 p-2 font-mono"
              />
              <input
                type="text"
                placeholder="YouTube Link"
                value={newPost.youtube}
                onChange={(e) => setNewPost({ ...newPost, youtube: e.target.value })}
                className="bg-[#0d0e12] border border-zinc-800 text-zinc-300 p-2 font-mono"
              />
              <input
                type="text"
                placeholder="Bandcamp Link"
                value={newPost.bandcamp}
                onChange={(e) => setNewPost({ ...newPost, bandcamp: e.target.value })}
                className="bg-[#0d0e12] border border-zinc-800 text-zinc-300 p-2 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(false)}
              className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 uppercase font-bold"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#e2ff00] text-black font-bold uppercase hover:bg-yellow-300 border-2 border-black"
            >
              PUBLISH TO ANTICASPER
            </button>
          </div>

        </form>

      </div>
    </div>
  )}

  {/* Footer */}
  <footer className="border-t-2 border-zinc-800 mt-16 py-8 bg-[#0d0e12]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between font-mono text-xs text-zinc-500 gap-4">
      <div>
        <span className="text-white font-bold">ANTICASPER BLOG</span> // DIY EMO & SKATER MUSIC ARCHIVE
      </div>
      <div>
        BUILT FOR HEADPHONES & SKATEPARKS • 2026
      </div>
    </div>
  </footer>

</div>


);
}
