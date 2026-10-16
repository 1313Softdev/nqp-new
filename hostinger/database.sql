-- ============================================================================
-- News for All — Modern-Vintage Editorial Blog & News CMS
-- Hostinger MySQL 8.0 / MariaDB Complete Database Schema & Seed Dump
-- Import this file directly via Hostinger phpMyAdmin -> Import
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. Table Structure for `settings` (Branding, Categories, Post Formats, SEO, Theme)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `_id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `siteName` VARCHAR(255) DEFAULT 'News for All',
  `siteTagline` TEXT,
  `siteEdition` VARCHAR(255) DEFAULT 'VOL. XCIV • INTERNATIONAL EDITION',
  `logoUrl` LONGTEXT,
  `metaTitle` VARCHAR(500),
  `metaDescription` TEXT,
  `metaKeywords` TEXT,
  `ogImage` LONGTEXT,
  `categories` JSON,
  `postFormats` JSON,
  `theme` JSON,
  `socialLinks` JSON,
  `footerText` TEXT,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Default Site Settings
INSERT INTO `settings` (
  `_id`, `siteName`, `siteTagline`, `siteEdition`, `logoUrl`,
  `metaTitle`, `metaDescription`, `metaKeywords`, `ogImage`,
  `categories`, `postFormats`, `theme`, `socialLinks`, `footerText`
) VALUES (
  'site_settings_main',
  'News for All',
  'THE GLOBAL CHRONICLE • INDEPENDENT STORIES, NEWS & EDITORIAL ARTICLES',
  'VOL. XCIV • INTERNATIONAL EDITION',
  '',
  'News for All — Modern Vintage Editorial & Global News Blog',
  'An independent modern-vintage publication dedicated to breaking news, investigative stories, cultural essays, and video journalism.',
  'news, blog, stories, articles, investigative journalism, video news, world, politics, culture',
  '',
  '["All", "News", "Stories", "Articles", "World", "Politics", "Culture", "Technology", "Opinion", "Video"]',
  '["News", "Story", "Article", "Editorial", "Video"]',
  '{"bgColor": "#FBF8F3", "cardBg": "#FFFDF9", "textColor": "#181615", "accentColor": "#9E2A2B", "secondaryText": "#5C554E", "borderColor": "#D8CFC2", "presetName": "Classic Broadsheet"}',
  '{"facebook": "https://facebook.com", "instagram": "https://instagram.com", "linkedin": "https://linkedin.com", "medium": "https://medium.com", "youtube": "https://youtube.com", "twitter": "https://x.com"}',
  '© 2026 News for All Chronicle. Printed & Published Digitally Worldwide. All Rights Reserved.'
);

-- ----------------------------------------------------------------------------
-- 2. Table Structure for `channels` (Syndicated Bureaus & News Desks)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `channels`;
CREATE TABLE `channels` (
  `_id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `logo` LONGTEXT,
  `url` TEXT NOT NULL,
  `description` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Initial Syndicated Channels
INSERT INTO `channels` (`_id`, `name`, `logo`, `url`, `description`) VALUES
('chan_nfa', 'News for All', 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&h=120&fit=crop', 'https://newsforall.com', 'News for All — Flagship Editorial Desk'),
('chan_bbc', 'BBC NEWS', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/BBC_News_2019.svg/512px-BBC_News_2019.svg.png', 'https://www.bbc.com/news', 'BBC World Service & Global Correspondents'),
('chan_reuters', 'REUTERS', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Reuters_Logo.svg/512px-Reuters_Logo.svg.png', 'https://www.reuters.com', 'International Wire & Financial Dispatches'),
('chan_cnn', 'CNN NEWS', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/512px-CNN.svg.png', 'https://www.cnn.com', 'Global Breaking Broadcasts'),
('chan_aljazeera', 'AL JAZEERA', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Al_Jazeera_English_logo.svg/512px-Al_Jazeera_English_logo.svg.png', 'https://www.aljazeera.com', 'In-Depth Global Perspectives & Documentaries'),
('chan_abc', 'ABC NEWS', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/ABC_News_logo_2021.svg/512px-ABC_News_logo_2021.svg.png', 'https://abcnews.go.com', 'National & Investigative Reporting');

-- ----------------------------------------------------------------------------
-- 3. Table Structure for `news` (Articles, Stories, News, Editorials, Videos)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `_id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `subtitle` TEXT,
  `postType` VARCHAR(100) DEFAULT 'Article',
  `author` VARCHAR(255) DEFAULT 'Editorial Desk',
  `readTime` VARCHAR(100) DEFAULT '5 min read',
  `publishDate` VARCHAR(50),
  `publishedAt` VARCHAR(100),
  `url` TEXT,
  `youtubeUrl` TEXT,
  `description` LONGTEXT,
  `image` LONGTEXT,
  `category` VARCHAR(150) DEFAULT 'News',
  `tags` JSON,
  `channelName` VARCHAR(255) DEFAULT 'News for All',
  `channelLogo` LONGTEXT,
  `seoTitle` VARCHAR(500),
  `seoDescription` TEXT,
  `likes` INT DEFAULT 0,
  `dislikes` INT DEFAULT 0,
  `isFeatured` TINYINT(1) DEFAULT 0,
  `postedByAdmin` TINYINT(1) DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Initial Editorial Stories & Articles
INSERT INTO `news` (
  `_id`, `title`, `subtitle`, `postType`, `author`, `readTime`, `publishDate`, `publishedAt`,
  `url`, `youtubeUrl`, `description`, `image`, `category`, `tags`,
  `channelName`, `channelLogo`, `seoTitle`, `seoDescription`, `likes`, `dislikes`, `isFeatured`, `postedByAdmin`
) VALUES
(
  'news_1',
  'The Renaissance of Independent Print & Digital Longform Journalism in 2026',
  'Why readers across the globe are returning to thoughtful, investigative stories, archival aesthetics, and unhurried analysis in an age of instant feeds.',
  'Editorial',
  'Eleanor Vance',
  '6 min read',
  '2026-10-17',
  'Oct 17, 2026',
  'https://www.bbc.com/news',
  'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
  'Across major capitals from London to Tokyo, a quiet revolution is reshaping how citizens consume information. After a decade dominated by fleeting ten-second clips and algorithmic noise, audiences are increasingly gravitating toward curated publications that value verification, narrative depth, and visual craftsmanship.\n\nEditors and independent publishers report record readership for longform investigative stories and documentary dispatches. By combining classic broadsheet typography—inspired by 20th-century literary journals—with modern multimedia capabilities such as embedded video essays and interactive archives, modern-vintage newsrooms are forging a new gold standard.\n\n"Readers don''t want more noise; they want context, provenance, and a publication they can trust," notes media historian Dr. Arthur Pendelton. Whether through written essays or on-the-ground video reporting, the mission remains timeless: to bear witness and illuminate the stories that matter.',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=85',
  'Articles',
  '["Journalism", "Media", "Editorial", "Culture"]',
  'News for All',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&h=120&fit=crop',
  'The Renaissance of Independent Print & Digital Longform Journalism in 2026',
  'Why readers across the globe are returning to thoughtful, investigative stories, archival aesthetics, and unhurried analysis.',
  1840,
  24,
  1,
  1
),
(
  'news_2',
  'Inside the Global Clean Energy Transition: Megaprojects Reshaping Continents',
  'From high-altitude solar arrays in the Andes to offshore wind corridors in the North Sea, engineers are racing to power the next century.',
  'News',
  'Marcus Sterling',
  '5 min read',
  '2026-10-16',
  'Oct 16, 2026',
  'https://www.reuters.com',
  'https://www.youtube.com/watch?v=ysz5S6PUM-U',
  'Global investment in renewable grid infrastructure reached an unprecedented milestone this quarter, surpassing traditional fossil-fuel capital expenditure by nearly three-to-one.\n\nIn a series of field dispatches, our correspondents visited three continents to document how ultra-high-voltage transmission lines and grid-scale battery reserves are stabilizing industrial economies while lowering carbon intensity.',
  'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&auto=format&fit=crop&q=80',
  'World',
  '["Energy", "Climate", "Technology", "Economy"]',
  'REUTERS',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Reuters_Logo.svg/512px-Reuters_Logo.svg.png',
  'Inside the Global Clean Energy Transition: Megaprojects Reshaping Continents',
  'From high-altitude solar arrays in the Andes to offshore wind corridors in the North Sea.',
  940,
  18,
  1,
  1
),
(
  'news_3',
  'The Last Watchmakers of Geneva: Preserving Mechanical Artistry in a Silicon Era',
  'An intimate portrait of master horologists who spend three thousand hours crafting a single timepiece by hand.',
  'Story',
  'Clara Moreau',
  '8 min read',
  '2026-10-15',
  'Oct 15, 2026',
  '',
  '',
  'High above the cobblestone streets of Geneva''s Old Town, winter light filters through tall atelier windows onto workbenches worn smooth by four generations of artisans. Here, time is measured not in milliseconds or server ticks, but in the patient filing of brass gears and the bluing of steel screws over an open flame.\n\nIn this feature story, we spend a week inside three independent workshops where young apprentices are learning centuries-old techniques that no CNC machine can replicate.',
  'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=900&auto=format&fit=crop&q=80',
  'Stories',
  '["Craftsmanship", "History", "Culture", "Geneva"]',
  'News for All',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&h=120&fit=crop',
  'The Last Watchmakers of Geneva: Preserving Mechanical Artistry in a Silicon Era',
  'An intimate portrait of master horologists who spend three thousand hours crafting a single timepiece by hand.',
  1290,
  9,
  1,
  1
),
(
  'news_4',
  'Diplomatic Summit in Vienna Opens New Corridor for Maritime Trade & Security',
  'Delegates from thirty-four nations sign historic accord aimed at safeguarding international shipping lanes and supply chains.',
  'News',
  'Julian Vance',
  '4 min read',
  '2026-10-14',
  'Oct 14, 2026',
  'https://www.bbc.com/news',
  '',
  'After six weeks of intensive negotiations at the Hofburg Palace in Vienna, foreign ministers and trade representatives unveiled a comprehensive framework designed to de-escalate maritime tensions and modernize customs clearing protocols across key straits.',
  'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
  'Politics',
  '["Diplomacy", "World", "Trade"]',
  'BBC NEWS',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/BBC_News_2019.svg/512px-BBC_News_2019.svg.png',
  'Diplomatic Summit in Vienna Opens New Corridor for Maritime Trade & Security',
  'Delegates from thirty-four nations sign historic accord aimed at safeguarding international shipping lanes.',
  620,
  31,
  0,
  1
),
(
  'news_5',
  'How Open-Source AI Models Are Empowering Local Hospitals and Rural Clinics',
  'Diagnostic tools running on offline hardware are helping physicians detect early-stage conditions in remote communities.',
  'Article',
  'Dr. Rohan Mehta',
  '7 min read',
  '2026-10-13',
  'Oct 13, 2026',
  'https://www.aljazeera.com',
  'https://www.youtube.com/watch?v=jNQXAC9IVRw',
  'While headlines often focus on massive cloud data centers, some of the most transformative applications of artificial intelligence are happening on compact, low-power devices miles away from reliable fiber internet.\n\nMedical teams in rural clinics are utilizing specialized open-weight vision models to assist in reading retinal scans and chest radiographs within seconds, bridging the specialist gap for millions of patients.',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
  'Technology',
  '["AI", "Healthcare", "Innovation"]',
  'AL JAZEERA',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Al_Jazeera_English_logo.svg/512px-Al_Jazeera_English_logo.svg.png',
  'How Open-Source AI Models Are Empowering Local Hospitals and Rural Clinics',
  'Diagnostic tools running on offline hardware are helping physicians detect early-stage conditions.',
  1120,
  14,
  0,
  1
),
(
  'news_6',
  'The Architecture of Silence: Inside the World’s Most Extraordinary Public Libraries',
  'A visual and historical journey through civic sanctuaries designed for contemplation, scholarship, and community.',
  'Story',
  'Sofia Lindqvist',
  '6 min read',
  '2026-10-12',
  'Oct 12, 2026',
  'https://www.cnn.com',
  '',
  'From the grand vaulted reading rooms of Stockholm and Paris to timber-framed civic halls in Kyoto, public libraries remain among the few spaces in modern cities where entry requires no transaction—only curiosity.',
  'https://images.unsplash.com/photo-1507842229356-51c61504d3ab?w=800&auto=format&fit=crop&q=80',
  'Culture',
  '["Architecture", "Books", "Culture"]',
  'CNN NEWS',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/512px-CNN.svg.png',
  'The Architecture of Silence: Inside the World’s Most Extraordinary Public Libraries',
  'A visual and historical journey through civic sanctuaries designed for contemplation.',
  1560,
  8,
  0,
  1
);

SET FOREIGN_KEY_CHECKS = 1;
