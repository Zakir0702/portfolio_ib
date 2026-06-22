export const fallbackMedia = {
  'demo-reel': {
    key: 'demo-reel',
    type: 'video',
    title: 'Demo Reel',
    url: '/assets/demo.mp4',
    poster: '/assets/tajmahal.jpg',
    source: 'local',
  },
  'hero-image': {
    key: 'hero-image',
    type: 'image',
    title: 'Hero Image',
    url: '/assets/horse.jpeg',
    source: 'local',
  },
  avatar: {
    key: 'avatar',
    type: 'image',
    title: 'Ibrahim Shamshad',
    url: '/assets/log.JPG.jpeg',
    source: 'local',
  },
  'project-travel': {
    key: 'project-travel',
    type: 'image',
    title: 'Cinematic Travel Film',
    url: '/assets/tajmahal.jpg',
    source: 'local',
  },
  'project-brand': {
    key: 'project-brand',
    type: 'image',
    title: 'Brand Story Film',
    url: '/assets/edits.JPG.jpeg',
    source: 'local',
  },
  'project-mountain': {
    key: 'project-mountain',
    type: 'image',
    title: 'Mountain Documentary',
    url: '/assets/shangarh.jpg',
    source: 'local',
  },
  'project-photography': {
    key: 'project-photography',
    type: 'image',
    title: 'Photography Preview',
    url: '/assets/photography.jpg',
    source: 'local',
  },
};

export const tools = [
  'Premiere Pro',
  'After Effects',
  'DaVinci Resolve',
  'Final Cut Pro',
  'Photoshop',
  'Lightroom',
  'Cinema 4D',
  'Audition',
];

export const stats = [
  { value: '5+', label: 'years', description: 'Experience editing videos for brands across lifestyle, wellness, and professional services.' },
  { value: '50+', label: 'projects', description: 'Successfully delivered projects, from short social videos to complex, long-form edits.' },
  { value: '30+', label: 'happy clients', description: 'Many returning for new projects, referrals, or ongoing editing work.' },
  { value: '100%', label: 'satisfaction', description: 'Based on client feedback collected over the last two years.' },
];

export const workingImages = ['project-travel', 'project-photography', 'project-mountain', 'hero-image'];

export const services = [
  {
    key: 'video-editing',
    title: 'Video Editing',
    description: 'Narrative-driven editing that keeps viewers emotionally engaged from start to finish.',
    detail: 'Narrative-driven editing that keeps viewers emotionally engaged from start to finish. Watch demos of how raw footage is transformed into polished, cinematic final cuts with seamless transitions, pacing, and storytelling.',
    tools: ['Premiere Pro', 'After Effects', 'Audition'],
    highlights: ['Before and after raw-to-final edit comparison', 'Seamless cut transitions and speed ramps', 'Audio synchronization and sound design', 'Multi-cam editing workflow'],
    videos: ['demo-reel', 'demo-reel', 'demo-reel'],
    labels: ['Cinematic Cut - Raw to Final', 'Speed Ramp Transitions Demo', 'Multi-cam Editing Workflow'],
    images: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop',
    ],
  },
  {
    key: 'color-grading',
    title: 'Color Grading',
    description: 'Filmic color direction that reinforces tone, mood, and brand identity.',
    detail: 'Filmic color direction that reinforces tone, mood, and brand identity. These demos showcase the color grading process from flat log footage to a rich, cinematic grade.',
    tools: ['DaVinci Resolve', 'Premiere Pro', 'Lightroom'],
    highlights: ['Log to cinematic grade transformation', 'Custom LUT creation and application', 'Skin tone correction and consistency', 'Scene-to-scene color matching'],
    videos: ['demo-reel', 'demo-reel', 'demo-reel'],
    labels: ['Log to Cinematic Grade', 'Custom LUT Application', 'Scene Matching and Skin Tones'],
    images: [
      'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=400&h=300&fit=crop',
    ],
  },
  {
    key: 'motion-graphics',
    title: 'Motion Graphics',
    description: 'Elegant motion layers and title systems built for visual impact.',
    detail: 'Elegant motion layers and title systems built for visual impact. These demos show animated elements, kinetic typography, and compositing for visual effects and transitions.',
    tools: ['After Effects', 'Cinema 4D', 'Illustrator'],
    highlights: ['Kinetic typography animations', 'Logo reveal and brand intros', 'Particle effects and compositing', 'Animated lower-thirds and infographics'],
    videos: ['demo-reel', 'demo-reel', 'demo-reel'],
    labels: ['Kinetic Typography Animation', 'Logo Reveal and Brand Intro', 'Compositing Demo'],
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop',
    ],
  },
  {
    key: 'social-reels',
    title: 'Social Reels',
    description: 'Fast-paced short-form edits optimized for retention and shares.',
    detail: 'Fast-paced short-form edits optimized for retention and shares, with punchy cuts, text overlays, trending audio sync, and hooks that stop the scroll.',
    tools: ['Premiere Pro', 'After Effects', 'CapCut'],
    highlights: ['Scroll-stopping hooks in first 3 seconds', 'Trending audio and beat-sync editing', 'Dynamic text overlays and captions', 'Platform-optimized aspect ratios'],
    videos: ['demo-reel', 'demo-reel', 'demo-reel'],
    labels: ['Scroll-Stopping Hook Reel', 'Beat-Sync Trending Edit', 'Dynamic Caption Reel'],
    images: [
      'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1598128558393-70ff21f8be44?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=400&h=300&fit=crop',
    ],
  },
  {
    key: 'youtube-videos',
    title: 'YouTube Videos',
    description: 'Clean long-form storytelling built around clarity and pacing.',
    detail: 'Clean long-form storytelling built around clarity and pacing, with engaging intros, chapter structure, B-roll integration, and retention-focused editing.',
    tools: ['Premiere Pro', 'After Effects', 'Photoshop'],
    highlights: ['Engaging hook and intro sequences', 'Chapter-based pacing and structure', 'B-roll integration and cutaways', 'Thumbnail-worthy color and framing'],
    videos: ['demo-reel', 'demo-reel', 'demo-reel'],
    labels: ['Engaging Hook and Intro', 'Chapter-Based Pacing', 'B-Roll Integration Demo'],
    images: [
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1526698905402-e13b880ad864?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    ],
  },
  {
    key: 'brand-films',
    title: 'Brand Films',
    description: 'Premium launch films that shape brand perception and trust.',
    detail: 'Premium launch films that shape brand perception and trust, from concept to final delivery with storyboarding, cinematic direction, and strategic editing.',
    tools: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Cinema 4D'],
    highlights: ['Story-driven concept development', 'Cinematic filming and direction guidance', 'Premium color grading and finishing', 'Multi-platform delivery and optimization'],
    videos: ['demo-reel', 'demo-reel', 'demo-reel'],
    labels: ['Brand Story Concept Film', 'Cinematic Product Launch', 'Corporate Identity Film'],
    images: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
    ],
  },
];

export const projects = [
  {
    key: 'cinematic-travel-film',
    title: 'Cinematic Travel Film',
    client: 'Personal Project',
    date: 'Jan 20, 2025',
    imageKey: 'project-travel',
    videoKey: 'demo-reel',
    summary: 'A beautifully cinematic travel video showcasing breathtaking locations with smooth transitions and professional color grading.',
    description: 'A beautifully cinematic travel video showcasing breathtaking locations across India. The project involved selecting the most visually compelling moments from hours of raw footage, crafting a narrative arc, and matching every transition to the rhythm of the background score.',
    tools: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Lightroom'],
    highlights: ['Cinematic color grading with custom LUTs', 'Smooth speed-ramp transitions', 'Professional audio mixing and sound design', '4K resolution mastered output'],
  },
  {
    key: 'brand-story-film',
    title: 'Brand Story Film',
    client: 'Brand Client',
    date: 'May 3, 2024',
    imageKey: 'project-brand',
    videoKey: 'demo-reel',
    summary: 'Professionally edited brand video highlighting creative storytelling, emotional pacing, and impactful visual narrative.',
    description: 'A professionally crafted brand story film designed to communicate the client mission, values, and identity through emotionally driven visuals, interview segments, B-roll footage, and brand-aligned text overlays.',
    tools: ['Premiere Pro', 'After Effects', 'Photoshop', 'Audition'],
    highlights: ['Emotional storytelling with strategic pacing', 'Custom lower-thirds and typography', 'Professional voice-over integration', 'Delivered in multiple formats for web and social'],
  },
  {
    key: 'mountain-documentary',
    title: 'Mountain Documentary',
    client: 'Self',
    date: 'Feb 13, 2025',
    imageKey: 'project-mountain',
    videoKey: 'demo-reel',
    summary: 'A cinematic vlog capturing the serenity of mountains with natural moments and storytelling through visuals.',
    description: 'A cinematic documentary-style vlog that captures the raw beauty and serenity of the Himalayan mountains, blending aerial and ground-level footage with subtle slow-motion, time-lapse, and immersive sound design.',
    tools: ['Premiere Pro', 'DaVinci Resolve', 'Audition', 'Lightroom'],
    highlights: ['Aerial and ground-level footage blending', 'Time-lapse and slow-motion storytelling', 'Immersive ambient sound design', 'Documentary-style narrative pacing'],
  },
];

export const testimonials = [
  { stars: '*****', text: 'Ibrahim completely transformed our brand content. Every edit feels cinematic and perfectly on-brand. We have seen a 3x increase in engagement.', name: 'Riya Sharma', role: 'Founder @ Bloom Studio', initials: 'RS' },
  { stars: '*****', text: 'Working with Ibrahim is effortless. He gets the story right the first time, every time. My retention rates went through the roof.', name: 'Karan Mehta', role: 'YouTuber (2.1M Subscribers)', initials: 'KM' },
  { stars: '*****', text: 'Our product launch video exceeded every expectation. The edits were flawless, pacing was perfect, and we hit 1M views in 48 hours.', name: 'Priya Nair', role: 'Marketing Head @ NovaTech', initials: 'PN' },
];

export const brands = ['Bloom Studio', 'NovaTech', 'Urban Creators', 'Pixel Labs', 'Vista Media', 'Karan Mehta'];

