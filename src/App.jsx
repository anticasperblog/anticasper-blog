import React, { useState, useMemo } from 'react';
import {
  Play, Pause, Plus, Search, Music,
  Heart, Sparkles, Filter, X, Flame,
  Radio, Bookmark
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
    writeup: `A timeless masterpiece that redefined modern hardcore and emo. From the thunderous bass intro of "Numb But I Still Feel It" to the melancholic haze of "Head in the Ceiling Fan", Floral Green sits comfortably as a landmark record for anyone who grew up skateboarding in empty parking lots at 2 AM. The guitar tones are sharp, gritty, yet strangely ambient.`,
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
    writeup: `Turnstile broke every rule in the hardcore playbook with GLOW ON. Fusing groove-heavy riffs with dream-pop hooks, percussion breakdowns, and danceable rhythms, this album became the soundtrack to summer skate sessions worldwide. Essential listening if you like heavy riffs that make you want to move rather than just fight.`,
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
    writeup: `Raw, cathartic, and relentlessly hook-filled. Arm's Length delivered one of the strongest debut emo records of the decade. Explosive vocal delivery matched with intricate guitar lines that evoke classic 2000s emo with shiny modern production punch.`,
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
        writeup: `Auto-imported review draft for Deftones' landmark record. Heavy guitar tones paired with emotional vocal hooks that resonate deeply.`,
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
        post.title.
