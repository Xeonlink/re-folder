const set = {
  txt: true, // Text files
  md: true, // Markdown files
  json: true, // JSON files
  js: true, // JavaScript files
  ts: true, // TypeScript files
  html: true, // HTML files
  css: true, // CSS files
  jpg: true, // JPEG image files
  jpeg: true, // JPEG image files
  png: true, // PNG image files
  gif: true, // GIF image files
  svg: true, // SVG image files
  bmp: true, // Bitmap image files
  tiff: true, // TIFF image files
  webp: true, // WebP image files
  pdf: true, // PDF files
  doc: true, // Microsoft Word documents
  docx: true, // Microsoft Word documents
  xls: true, // Microsoft Excel spreadsheets
  xlsx: true, // Microsoft Excel spreadsheets
  ppt: true, // Microsoft PowerPoint presentations
  pptx: true, // Microsoft PowerPoint presentations
  zip: true, // ZIP archive files
  tar: true, // TAR archive files
  gz: true, // GZIP compressed files
  rar: true, // RAR archive files
  exe: true, // Executable files
  bat: true, // Batch files
  sh: true, // Shell scripts
  py: true, // Python files
  java: true, // Java files
  c: true, // C language files
  cpp: true, // C++ language files
  h: true, // C/C++ header files
  php: true, // PHP files
  rb: true, // Ruby files
  swift: true, // Swift files
  go: true, // Go language files
  xml: true, // XML files
  yaml: true, // YAML files
  yml: true, // YAML files
  sql: true, // SQL database files
  log: true, // Log files
  eml: true, // Email message files
  msg: true, // Microsoft Outlook message files
  psd: true, // Adobe Photoshop files
  ai: true, // Adobe Illustrator files
  fig: true, // Figma design files
  indd: true, // Adobe InDesign files
  svgz: true, // Compressed SVG files
  epub: true, // eBook files
  mobi: true, // Mobipocket eBook files
  fla: true, // Adobe Flash files
  aspx: true, // ASP.NET files
  jsp: true, // JavaServer Pages files
  pl: true, // Perl scripts
  r: true, // R language files
  dart: true, // Dart language files
  m4a: true, // MPEG 4 Audio files
  mp3: true, // MP3 audio files
  wav: true, // WAV audio files
  aac: true, // AAC audio files
  flac: true, // FLAC audio files
  mp4: true, // MP4 video files
  avi: true, // AVI video files
  mov: true, // QuickTime video files
  wmv: true, // Windows Media Video files
  mkv: true, // Matroska video files
  "3gp": true, // 3GPP video files
  webm: true, // WebM video files
  vob: true, // VOB video files
  cpl: true, // Windows Control Panel files
  crt: true, // Security Certificate files
  dll: true, // Dynamic Link Library files
  dmg: true, // macOS Disk Image files
  iso: true, // ISO image files
  img: true, // Disk Image files
  torrent: true, // BitTorrent files
  nfo: true, // Info files
  "7z": true, // 7-Zip archive files
  apk: true, // Android Package files
  csv: true, // Comma-Separated Values files
  ics: true, // iCalendar files
  otf: true, // OpenType Font files
  ttf: true, // TrueType Font files
  woff: true, // Web Open Font Format files
  woff2: true, // Web Open Font Format 2 files
  xhtml: true, // XHTML files
  m3u: true, // Audio Playlist files
  m4v: true, // MPEG-4 Video files
  xpi: true, // Mozilla Firefox Extension files
  swf: true, // Adobe Flash files
  bzip2: true, // Bzip2 compressed files
  vcf: true, // vCard files
  cfg: true, // Configuration files
  dtd: true, // Document Type Definition files
  xsd: true, // XML Schema Definition files
  "3ds": true, // 3D Studio files
  abw: true, // AbiWord Document files
  accdb: true, // Microsoft Access Database files
  apng: true, // Animated PNG files
  asf: true, // Advanced Streaming Format files
  bin: true, // Binary files
  flv: true, // Flash Video files
  gpx: true, // GPS Exchange Format files
  htm: true, // Hypertext Markup Language files
  ini: true, // Initialization files
  less: true, // LESS CSS files
  midi: true, // MIDI files
  mpeg: true, // MPEG Video files
  mpg: true, // MPEG Video files
  odt: true, // OpenDocument Text files
  oga: true, // Ogg Audio files
  ogg: true, // Ogg Container files
  tgz: true, // Compressed TAR files
  tif: true, // TIFF Image files
  wma: true, // Windows Media Audio files
  zsh: true, // Z Shell Script files
  mpa: true, // MPEG Audio files
  m2ts: true, // MPEG-2 Transport Stream files
  xap: true, // Silverlight Application files
  json5: true, // JSON5 files
  sqlitedb: true, // SQLite Database files
  ml: true, // OCaml files
  sol: true, // Solidity files
  dot: true, // Dot files (Graphviz)
  skp: true, // SketchUp files
  tga: true, // Targa image files
  weba: true, // Web Audio files
  azw: true, // Amazon Kindle files
  cbr: true, // Comic Book RAR files
  cbz: true, // Comic Book ZIP files
  gcode: true, // G-Code files
  stl: true, // Stereolithography files
  srt: true, // SubRip Subtitle files
  vtt: true, // Web Video Text Tracks files
  xltx: true, // Microsoft Excel Template files
  dotx: true, // Microsoft Word Template files
  mxf: true, // Material Exchange Format files
  vdi: true, // VirtualBox Disk Image files
  bak: true, // Backup files
  dcr: true, // Kodak Digital Camera files
  nef: true, // Nikon Electronic Format files
  orf: true, // Olympus RAW Format files
  cr2: true, // Canon RAW Version 2 files
  pef: true, // Pentax Electronic Format files
  arw: true // Sony RAW Format files
};

export const knownExtensions = Object.entries(set)
  .filter(([_, value]) => value)
  .map(([key, _]) => key);
