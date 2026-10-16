import Channel from './models/Channel.js';
import News from './models/News.js';
import Settings from './models/Settings.js';
import {
  getIsMySQLConnected,
  getMySQLPool,
  getIsMongoConnected,
  CHANNELS_FILE,
  NEWS_FILE,
  SETTINGS_FILE,
  readLocalData,
  writeLocalData
} from './config/db.js';
import { defaultSettings } from './routes/settings.js';

const initialChannels = [
  {
    _id: 'chan_nfa',
    name: 'News for All',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&h=120&fit=crop',
    url: 'https://newsforall.com',
    description: 'News for All — Flagship Editorial Desk'
  },
  {
    _id: 'chan_bbc',
    name: 'BBC NEWS',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/BBC_News_2019.svg/512px-BBC_News_2019.svg.png',
    url: 'https://www.bbc.com/news',
    description: 'BBC World Service & Global Correspondents'
  },
  {
    _id: 'chan_reuters',
    name: 'REUTERS',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Reuters_Logo.svg/512px-Reuters_Logo.svg.png',
    url: 'https://www.reuters.com',
    description: 'International Wire & Financial Dispatches'
  },
  {
    _id: 'chan_cnn',
    name: 'CNN NEWS',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/512px-CNN.svg.png',
    url: 'https://www.cnn.com',
    description: 'Global Breaking Broadcasts'
  },
  {
    _id: 'chan_aljazeera',
    name: 'AL JAZEERA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Al_Jazeera_English_logo.svg/512px-Al_Jazeera_English_logo.svg.png',
    url: 'https://www.aljazeera.com',
    description: 'In-Depth Global Perspectives & Documentaries'
  },
  {
    _id: 'chan_abc',
    name: 'ABC NEWS',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/ABC_News_logo_2021.svg/512px-ABC_News_logo_2021.svg.png',
    url: 'https://abcnews.go.com',
    description: 'National & Investigative Reporting'
  }
];

const initialNews = [
  {
    _id: 'news_1',
    title: 'The Renaissance of Independent Print & Digital Longform Journalism in 2026',
    subtitle: 'Why readers across the globe are returning to thoughtful, investigative stories, archival aesthetics, and unhurried analysis in an age of instant feeds.',
    postType: 'Editorial',
    author: 'Eleanor Vance',
    readTime: '6 min read',
    publishDate: '2026-10-17',
    publishedAt: 'Oct 17, 2026',
    url: 'https://www.bbc.com/news',
    youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    description: `Across major capitals from London to Tokyo, a quiet revolution is reshaping how citizens consume information. After a decade dominated by fleeting ten-second clips and algorithmic noise, audiences are increasingly gravitating toward curated publications that value verification, narrative depth, and visual craftsmanship.\n\nEditors and independent publishers report record readership for longform investigative stories and documentary dispatches. By combining classic broadsheet typography—inspired by 20th-century literary journals—with modern multimedia capabilities such as embedded video essays and interactive archives, modern-vintage newsrooms are forging a new gold standard.\n\n"Readers don't want more noise; they want context, provenance, and a publication they can trust," notes media historian Dr. Arthur Pendelton. Whether through written essays or on-the-ground video reporting, the mission remains timeless: to bear witness and illuminate the stories that matter.`,
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=85',
    category: 'Articles',
    tags: ['Journalism', 'Media', 'Editorial', 'Culture'],
    channelName: 'News for All',
    channelLogo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&h=120&fit=crop',
    likes: 1840,
    dislikes: 24,
    isFeatured: true
  },
  {
    _id: 'news_2',
    title: 'Inside the Global Clean Energy Transition: Megaprojects Reshaping Continents',
    subtitle: 'From high-altitude solar arrays in the Andes to offshore wind corridors in the North Sea, engineers are racing to power the next century.',
    postType: 'News',
    author: 'Marcus Sterling',
    readTime: '5 min read',
    publishDate: '2026-10-16',
    publishedAt: 'Oct 16, 2026',
    url: 'https://www.reuters.com',
    youtubeUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    description: `Global investment in renewable grid infrastructure reached an unprecedented milestone this quarter, surpassing traditional fossil-fuel capital expenditure by nearly three-to-one.\n\nIn a series of field dispatches, our correspondents visited three continents to document how ultra-high-voltage transmission lines and grid-scale battery reserves are stabilizing industrial economies while lowering carbon intensity.`,
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&auto=format&fit=crop&q=80',
    category: 'World',
    tags: ['Energy', 'Climate', 'Technology', 'Economy'],
    channelName: 'REUTERS',
    channelLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Reuters_Logo.svg/512px-Reuters_Logo.svg.png',
    likes: 940,
    dislikes: 18,
    isFeatured: true
  },
  {
    _id: 'news_3',
    title: 'The Last Watchmakers of Geneva: Preserving Mechanical Artistry in a Silicon Era',
    subtitle: 'An intimate portrait of master horologists who spend three thousand hours crafting a single timepiece by hand.',
    postType: 'Story',
    author: 'Clara Moreau',
    readTime: '8 min read',
    publishDate: '2026-10-15',
    publishedAt: 'Oct 15, 2026',
    url: '',
    youtubeUrl: '',
    description: `High above the cobblestone streets of Geneva's Old Town, winter light filters through tall atelier windows onto workbenches worn smooth by four generations of artisans. Here, time is measured not in milliseconds or server ticks, but in the patient filing of brass gears and the bluing of steel screws over an open flame.\n\nIn this feature story, we spend a week inside three independent workshops where young apprentices are learning centuries-old techniques that no CNC machine can replicate.`,
    image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=900&auto=format&fit=crop&q=80',
    category: 'Stories',
    tags: ['Craftsmanship', 'History', 'Culture', 'Geneva'],
    channelName: 'News for All',
    channelLogo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&h=120&fit=crop',
    likes: 1290,
    dislikes: 9,
    isFeatured: true
  },
  {
    _id: 'news_4',
    title: 'Diplomatic Summit in Vienna Opens New Corridor for Maritime Trade & Security',
    subtitle: 'Delegates from thirty-four nations sign historic accord aimed at safeguarding international shipping lanes and supply chains.',
    postType: 'News',
    author: 'Julian Vance',
    readTime: '4 min read',
    publishDate: '2026-10-14',
    publishedAt: 'Oct 14, 2026',
    url: 'https://www.bbc.com/news',
    youtubeUrl: '',
    description: `After six weeks of intensive negotiations at the Hofburg Palace in Vienna, foreign ministers and trade representatives unveiled a comprehensive framework designed to de-escalate maritime tensions and modernize customs clearing protocols across key straits.`,
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    category: 'Politics',
    tags: ['Diplomacy', 'World', 'Trade'],
    channelName: 'BBC NEWS',
    channelLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/BBC_News_2019.svg/512px-BBC_News_2019.svg.png',
    likes: 620,
    dislikes: 31,
    isFeatured: false
  },
  {
    _id: 'news_5',
    title: 'How Open-Source AI Models Are Empowering Local Hospitals and Rural Clinics',
    subtitle: 'Diagnostic tools running on offline hardware are helping physicians detect early-stage conditions in remote communities.',
    postType: 'Article',
    author: 'Dr. Rohan Mehta',
    readTime: '7 min read',
    publishDate: '2026-10-13',
    publishedAt: 'Oct 13, 2026',
    url: 'https://www.aljazeera.com',
    youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    description: `While headlines often focus on massive cloud data centers, some of the most transformative applications of artificial intelligence are happening on compact, low-power devices miles away from reliable fiber internet.\n\nMedical teams in rural clinics are utilizing specialized open-weight vision models to assist in reading retinal scans and chest radiographs within seconds, bridging the specialist gap for millions of patients.`,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    category: 'Technology',
    tags: ['AI', 'Healthcare', 'Innovation'],
    channelName: 'AL JAZEERA',
    channelLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Al_Jazeera_English_logo.svg/512px-Al_Jazeera_English_logo.svg.png',
    likes: 1120,
    dislikes: 14,
    isFeatured: false
  },
  {
    _id: 'news_6',
    title: 'The Architecture of Silence: Inside the World’s Most Extraordinary Public Libraries',
    subtitle: 'A visual and historical journey through civic sanctuaries designed for contemplation, scholarship, and community.',
    postType: 'Story',
    author: 'Sofia Lindqvist',
    readTime: '6 min read',
    publishDate: '2026-10-12',
    publishedAt: 'Oct 12, 2026',
    url: 'https://www.cnn.com',
    youtubeUrl: '',
    description: `From the grand vaulted reading rooms of Stockholm and Paris to timber-framed civic halls in Kyoto, public libraries remain among the few spaces in modern cities where entry requires no transaction—only curiosity.`,
    image: 'https://images.unsplash.com/photo-1507842229356-51c61504d3ab?w=800&auto=format&fit=crop&q=80',
    category: 'Culture',
    tags: ['Architecture', 'Books', 'Culture'],
    channelName: 'CNN NEWS',
    channelLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/512px-CNN.svg.png',
    likes: 1560,
    dislikes: 8,
    isFeatured: false
  }
];

export const seedData = async () => {
  // Always ensure local files have initial data if empty
  const existingChannels = readLocalData(CHANNELS_FILE);
  if (!existingChannels || existingChannels.length === 0) {
    writeLocalData(CHANNELS_FILE, initialChannels);
  }
  const existingNews = readLocalData(NEWS_FILE);
  if (!existingNews || existingNews.length === 0 || !existingNews[0]?.postType) {
    writeLocalData(NEWS_FILE, initialNews);
  }
  const existingSettings = readLocalData(SETTINGS_FILE);
  if (!existingSettings || Array.isArray(existingSettings) || !existingSettings.siteName) {
    writeLocalData(SETTINGS_FILE, defaultSettings);
  }

  // Seed MySQL if connected
  if (getIsMySQLConnected()) {
    const pool = getMySQLPool();

    const [chanRows] = await pool.query('SELECT COUNT(*) as cnt FROM channels');
    if (chanRows[0].cnt === 0) {
      const channelsToSeed = readLocalData(CHANNELS_FILE).length ? readLocalData(CHANNELS_FILE) : initialChannels;
      for (const ch of channelsToSeed) {
        await pool.query(
          'INSERT IGNORE INTO channels (_id, name, logo, url, description, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
          [ch._id, ch.name, ch.logo || '', ch.url, ch.description || '', new Date()]
        );
      }
      console.log('🌱 Seeded channels into MySQL 8.0');
    }

    const [newsRows] = await pool.query('SELECT COUNT(*) as cnt FROM news');
    if (newsRows[0].cnt === 0) {
      const newsToSeed = readLocalData(NEWS_FILE).length ? readLocalData(NEWS_FILE) : initialNews;
      for (const item of newsToSeed) {
        await pool.query(
          `INSERT IGNORE INTO news (
            _id, title, subtitle, postType, author, readTime, publishDate, publishedAt,
            url, youtubeUrl, description, image, category, tags, channelName, channelLogo,
            seoTitle, seoDescription, likes, dislikes, isFeatured, postedByAdmin, createdAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item._id,
            item.title,
            item.subtitle || '',
            item.postType || 'Article',
            item.author || 'Editorial Desk',
            item.readTime || '5 min read',
            item.publishDate || '2026-10-17',
            item.publishedAt || 'Oct 17, 2026',
            item.url || '',
            item.youtubeUrl || '',
            item.description || '',
            item.image || '',
            item.category || 'News',
            JSON.stringify(item.tags || []),
            item.channelName || 'News for All',
            item.channelLogo || '',
            item.seoTitle || item.title,
            item.seoDescription || '',
            item.likes || 0,
            item.dislikes || 0,
            item.isFeatured ? 1 : 0,
            1,
            new Date()
          ]
        );
      }
      console.log('🌱 Seeded editorial stories & news into MySQL 8.0');
    }

    const [setRows] = await pool.query('SELECT COUNT(*) as cnt FROM settings');
    if (setRows[0].cnt === 0) {
      const s = readLocalData(SETTINGS_FILE) || defaultSettings;
      await pool.query(
        `INSERT IGNORE INTO settings (_id, siteName, siteTagline, siteEdition, logoUrl, metaTitle, metaDescription, metaKeywords, ogImage, categories, postFormats, theme, socialLinks, footerText)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'site_settings_main',
          s.siteName || defaultSettings.siteName,
          s.siteTagline || defaultSettings.siteTagline,
          s.siteEdition || defaultSettings.siteEdition,
          s.logoUrl || '',
          s.metaTitle || defaultSettings.metaTitle,
          s.metaDescription || defaultSettings.metaDescription,
          s.metaKeywords || defaultSettings.metaKeywords,
          s.ogImage || '',
          JSON.stringify(s.categories || defaultSettings.categories),
          JSON.stringify(s.postFormats || defaultSettings.postFormats),
          JSON.stringify(s.theme || defaultSettings.theme),
          JSON.stringify(s.socialLinks || defaultSettings.socialLinks),
          s.footerText || defaultSettings.footerText
        ]
      );
      console.log('🌱 Seeded site settings (Categories & Post Formats) into MySQL 8.0');
    }
    return;
  }

  if (getIsMongoConnected()) {
    const channelCount = await Channel.countDocuments();
    if (channelCount === 0) {
      await Channel.insertMany(initialChannels.map(({ _id, ...rest }) => rest));
    }
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      await News.insertMany(initialNews.map(({ _id, ...rest }) => rest));
    }
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      const { _id, ...restSettings } = defaultSettings;
      await Settings.create(restSettings);
    }
  }
};

export default seedData;
