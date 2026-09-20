import { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  ChevronDown,
  CloudUpload,
  FileAudio,
  FileVideo,
  Headphones,
  LockKeyhole,
  Menu,
  Mic,
  Pause,
  Play,
  Plus,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
  Zap,
} from 'lucide-react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Link } from 'wouter';
import { AboutPage, AuthPage, BlogPage, ContactPage, FaqPage, NotFoundPage } from '@/pages/ProductPages';

const queryClient = new QueryClient();

type ProcessingState = 'idle' | 'processing' | 'complete';
type UploadTab = 'upload' | 'record';

const navItems = [
  ['Home', '/'],
  ['Blog', '/blog'],
  ['About', '/about'],
  ['FAQ', '/faq'],
  ['Contact Us', '/contact'],
];

const faqs = [
  ['What kind of files can I clean?', 'Noise Remover works with common audio and video formats including MP3, WAV, FLAC, M4A, OGG, AIFF, AAC, MP4, and MOV.'],
  ['Will my voice sound natural after processing?', 'Yes. Auto mode is tuned to reduce unwanted sound while keeping speech texture and room presence natural. You can use Voice Focus for a stronger clean-up.'],
  ['How long does processing take?', 'Most short recordings are ready in under a minute. Longer video files are processed in the background and keep their original picture and sync.'],
  ['Are my recordings private?', 'Your files are encrypted during transfer and automatically removed from our processing systems after a limited retention window.'],
];

const waveform = Array.from({ length: 64 }, (_, index) => 19 + ((index * 17) % 53));
const calmWaveform = Array.from({ length: 64 }, (_, index) => 13 + ((index * 11) % 26));

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AppLogo() {
  return (
    <Link className="brand" href="/" data-testid="link-brand">
      <span className="brand-mark">NR</span>
      <span className="brand-name">Noise<span>Remover</span></span>
    </Link>
  );
}

function UploadStudio() {
  const [tab, setTab] = useState<UploadTab>('upload');
  const [mode, setMode] = useState('Auto');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<ProcessingState>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFile = (nextFile?: File) => {
    if (!nextFile) return;
    setFile(nextFile);
    setState('idle');
  };

  const startProcessing = () => {
    if (!file) return;
    setState('processing');
    window.setTimeout(() => setState('complete'), 1700);
  };

  const fileUrl = file ? URL.createObjectURL(file) : undefined;
  useEffect(() => () => { if (fileUrl) URL.revokeObjectURL(fileUrl); }, [fileUrl]);

  return (
      <div className="upload-card" id="studio" data-testid="card-upload-studio">
      <div className="upload-tabs" role="tablist" aria-label="Upload input">
        <button className={`tab ${tab === 'upload' ? 'active' : ''}`} type="button" onClick={() => setTab('upload')} role="tab" aria-selected={tab === 'upload'} data-testid="tab-upload">Upload a file</button>
        <button className={`tab ${tab === 'record' ? 'active' : ''}`} type="button" onClick={() => setTab('record')} role="tab" aria-selected={tab === 'record'} data-testid="tab-record">Record in browser</button>
      </div>

      {tab === 'upload' ? (
        <>
          {state === 'idle' && (
            <div
              className={`dropzone ${dragging ? 'dragging' : ''}`}
              onClick={() => inputRef.current?.click()}
              onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
              onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => { event.preventDefault(); setDragging(false); acceptFile(event.dataTransfer.files?.[0]); }}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click(); }}
              data-testid="dropzone-file"
            >
              <input ref={inputRef} hidden type="file" accept="audio/*,video/*,.mp3,.wav,.flac,.m4a,.ogg,.aiff,.aac,.mp4,.mov" onChange={(event) => acceptFile(event.target.files?.[0])} data-testid="input-file-upload" />
              {file ? (
                <div className="file-selected">
                  {file.type.startsWith('video') ? <FileVideo className="file-icon" /> : <FileAudio className="file-icon" />}
                  <div className="file-meta"><strong>{file.name}</strong><span>{formatSize(file.size)} · Ready to clean</span></div>
                  <button className="file-remove" type="button" aria-label="Remove selected file" onClick={(event) => { event.stopPropagation(); setFile(null); }} data-testid="button-remove-file"><X size={16} /></button>
                </div>
              ) : (
                <>
                  <span className="upload-icon"><CloudUpload size={17} /></span>
                  <span className="drop-title">Drop one audio or video file here</span>
                  <span className="drop-sub">Drag and drop your file, or choose it from your device.</span>
                </>
              )}
            </div>
          )}
          {state === 'processing' && (
            <div className="status-box" data-testid="status-processing">
              <div className="status-line"><Sparkles size={16} /> Cleaning distracting sound</div>
              <div className="progress-track"><div className="progress-fill" /></div>
              <div className="drop-sub">Separating speech from your recording. This usually takes a few seconds.</div>
            </div>
          )}
          {state === 'complete' && file && (
            <div className="result-box" data-testid="status-complete">
              <div className="result-title"><span><Check size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Noise removed</span><span>Ready</span></div>
              {file.type.startsWith('video') ? <video className="result-audio" controls src={fileUrl} /> : <audio className="result-audio" controls src={fileUrl} />}
              <button className="btn btn-dark download-btn" type="button" onClick={() => { if (fileUrl) { const link = document.createElement('a'); link.href = fileUrl; link.download = `clean-${file.name}`; link.click(); } }} data-testid="button-download-result"><ArrowDownToLine size={14} /> Download cleaned file</button>
            </div>
          )}
          <div className="upload-types"><strong>Supported inputs:</strong> MP3, WAV, FLAC, M4A, OGG, AIFF, AAC, MP4, and MOV<br /><strong>Free-file limit:</strong> up to 200 MB and 15 minutes per file on the Free plan</div>
          <label className="mode-row"><span>Processing mode</span><select value={mode} onChange={(event) => setMode(event.target.value)} aria-label="Processing mode" data-testid="select-processing-mode"><option>Auto</option><option>Voice Focus</option><option>Light Touch</option></select></label>
          <button className="btn btn-orange upload-submit" type="button" disabled={!file || state === 'processing'} onClick={startProcessing} data-testid="button-process-file">{state === 'processing' ? 'Removing background noise...' : state === 'complete' ? 'Process another file' : 'Remove Background Noise'}</button>
          <div className="upload-footnote"><ShieldCheck size={11} /> Microphone audio stays in your browser until you select “Use recording.” Recording is processed after capture; this is not real-time noise cancellation.</div>
        </>
      ) : (
        <>
          <div className="record-state" data-testid="record-demo-state">
            <span className="record-dot" />
            <strong>Ready when you are</strong>
            <p>Record a short sample in this browser, then choose when to send it for noise removal.</p>
            <button className="btn btn-outline btn-small" type="button" onClick={() => setTab('upload')} data-testid="button-record-demo"><Mic size={13} /> Start a demo recording</button>
          </div>
          <div className="upload-types">Your microphone is never opened without your action.</div>
          <div className="mode-row"><span>Processing mode</span><strong>{mode}</strong></div>
          <button className="btn btn-orange upload-submit" type="button" onClick={() => setTab('upload')} data-testid="button-record-upload"><Upload size={13} /> Use a file instead</button>
          <div className="upload-footnote"><ShieldCheck size={11} /> Recording permission is requested only when you choose to start. No automatic access.</div>
        </>
      )}
    </div>
  );
}

function Waveform({ bars, color }: { bars: number[]; color?: string }) {
  return <div className="waveform" aria-hidden="true">{bars.map((height, index) => <span key={index} className="wave-bar" style={{ height: `${height}%`, ...(color ? { background: color } : {}) }} />)}</div>;
}

function Comparison() {
  const [playing, setPlaying] = useState<'original' | 'clean' | null>(null);
  return (
    <section className="section compare-section" id="before-after">
      <div className="container compare-inner">
        <div className="section-head reveal">
          <div className="section-kicker">Hear the difference</div>
          <h2>Make room for the voice that matters.</h2>
          <p>From a busy café to a windy street, Noise Remover hears what should stay and softens what should not.</p>
          <div className="compare-note"><Zap size={16} /><span>Our speech-first model keeps timing, tone, and natural pauses intact while reducing hum, hiss, traffic, and competing speech.</span></div>
        </div>
        <div className="wave-card reveal-delay" data-testid="card-before-after">
          <div className="wave-row">
            <div className="wave-label"><span>Original recording</span><span>room tone + traffic</span></div>
            <Waveform bars={waveform} />
            <div className="play-row"><button className="play-btn" type="button" onClick={() => setPlaying(playing === 'original' ? null : 'original')} aria-label="Play original recording" data-testid="button-play-original">{playing === 'original' ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}</button><div className="play-track"><div className="play-progress" /></div><span className="play-time">0:18</span></div>
          </div>
          <div className="wave-divider" />
          <div className="wave-row after">
            <div className="wave-label"><span>Noise Remover</span><span>speech isolated</span></div>
            <Waveform bars={calmWaveform} />
            <div className="play-row"><button className="play-btn green" type="button" onClick={() => setPlaying(playing === 'clean' ? null : 'clean')} aria-label="Play cleaned recording" data-testid="button-play-clean">{playing === 'clean' ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}</button><div className="play-track"><div className="play-progress" style={{ background: '#67c3aa', width: '58%' }} /></div><span className="play-time">0:18</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    ['01', 'Choose your file', 'Drop in an audio or video recording from your device. No account is needed to try it.'],
    ['02', 'Pick your clean-up', 'Auto mode is a great place to start. Choose Voice Focus or Light Touch when the moment calls for it.'],
    ['03', 'Download and share', 'Preview the result, download the cleaned file, and get back to your edit with a clearer track.'],
  ];
  return (
    <section className="section workflow-section" id="how-it-works">
      <div className="container">
        <div className="workflow-head section-head"><div className="section-kicker">A simpler studio</div><h2>From noisy to ready in three calm steps.</h2><p>No plug-ins, no audio engineering degree, no guesswork. Just a clean path from raw recording to publishable sound.</p></div>
        <div className="workflow-grid">{steps.map(([number, title, copy], index) => <article className="workflow-card" key={number}><div className="workflow-num">{number}</div><h3>{title}</h3><p>{copy}</p>{index < 2 && <ArrowRight className="workflow-arrow" size={20} />}</article>)}</div>
      </div>
    </section>
  );
}

function PrivacySection() {
  return (
    <section className="feature-band" id="about">
      <div className="container feature-grid">
        <div className="feature-copy"><div className="section-kicker">Made for real work</div><h2>A quiet tool for loud environments.</h2><p>Whether you are publishing a podcast, sending a voice note, or rescuing an interview, the controls stay simple and the result stays yours.</p><div className="feature-points"><div className="feature-point"><span className="point-check"><Check size={13} /></span><div><strong>Audio and video in one place</strong><span>Keep your visuals and sync intact while the soundtrack gets a reset.</span></div></div><div className="feature-point"><span className="point-check"><Check size={13} /></span><div><strong>Built for speech</strong><span>Reduce wind, fan hum, keyboard clicks, room noise, and other voices.</span></div></div><div className="feature-point"><span className="point-check"><Check size={13} /></span><div><strong>Works when inspiration strikes</strong><span>Use it from a browser on your laptop, tablet, or phone.</span></div></div></div></div>
        <div className="privacy-card" id="api"><span className="privacy-lock"><LockKeyhole size={22} /></span><h3>Your recordings deserve a private room.</h3><p>Encrypted transfers and short-lived processing keep your work protected. We do not use your recordings to train models.</p><span className="privacy-badge"><ShieldCheck size={16} /> Private by default</span></div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq-section" id="pricing">
      <div className="container faq-layout">
        <div className="section-head"><div className="section-kicker">Good to know</div><h2>Questions, answered clearly.</h2><p>Start free, make a few clips, and see if the difference fits your workflow.</p><div className="faq-cta">Need help with a recording or workflow? <Link href="/contact" data-testid="link-contact-cta">Contact us.</Link></div></div>
        <div className="faq-list" id="blog">{faqs.map(([question, answer], index) => <div className={`faq-item ${open === index ? 'open' : ''}`} key={question}><button className="faq-question" type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index} data-testid={`button-faq-${index}`}><span>{question}</span><Plus size={17} /></button><div className="faq-answer">{answer}</div></div>)}</div>
      </div>
    </section>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-shell" id="home">
      <header className="topbar">
        <div className="container nav-inner">
          <AppLogo />
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen} data-testid="button-mobile-menu">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
          <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">{navItems.map(([label, href]) => <Link className="nav-link" href={href} key={label} onClick={() => setMenuOpen(false)} data-testid={`link-nav-${label.toLowerCase()}`}>{label}</Link>)}</nav>
          <div className="nav-actions"><Link className="btn btn-outline btn-small" href="/login" data-testid="button-login">Log in</Link><Link className="btn btn-dark btn-small" href="/signup" data-testid="button-signup">Sign up free</Link></div>
        </div>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="hero-copy reveal"><div className="eyebrow"><span className="eyebrow-mark"><Sparkles size={10} /></span> Online AI Noise Remover for Audio and Video</div><h1 id="hero-title" className="display">AI Background Noise Reduction for <span className="highlight">Clearer Audio and Video</span></h1><p>Upload a supported audio file or an MP4 or MOV video. Reduce distracting hum, hiss, wind, traffic, room noise, and other sounds that compete with speech. Compare the original with the processed result, then download a cleaner track or a completely cleaned video.</p><div className="hero-actions"><a className="btn btn-orange" href="#studio" data-testid="button-hero-upload"><Play size={13} fill="currentColor" /> Remove Background Noise Free</a><Link className="btn btn-outline" href="/contact" data-testid="link-hero-contact">Contact Us</Link></div><div className="hero-note"><ShieldCheck size={13} /> Start with free noise removal. No credit card required.</div></div>
            <UploadStudio />
          </div>
        </section>
        <section className="trust-strip" aria-label="Product benefits"><div className="container trust-grid"><div className="trust-item"><span className="trust-icon"><Zap size={14} /></span><div><strong>Fast, speech-first<br />processing</strong><span>Results in moments</span></div></div><div className="trust-item"><span className="trust-icon"><Headphones size={14} /></span><div><strong>Audio and video<br />support</strong><span>Keep your sync intact</span></div></div><div className="trust-item"><span className="trust-icon"><ShieldCheck size={14} /></span><div><strong>Private by<br />default</strong><span>Short-lived processing</span></div></div><div className="trust-item"><span className="trust-icon"><ArrowDownToLine size={14} /></span><div><strong>Download when<br />ready</strong><span>Simple, useful files</span></div></div></div></section>
        <Comparison />
        <Workflow />
        <PrivacySection />
        <FAQ />
        <section className="final-cta"><h2>Give your next recording<br />a little more room.</h2><p>Try Noise Remover free. Your clearest take might already be on your device.</p><button className="btn" type="button" onClick={() => document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-final-cta">Remove Background Noise <ArrowRight size={15} /></button></section>
      </main>
      <footer className="footer" id="footer"><div className="container"><div className="footer-grid"><div><AppLogo /><p className="footer-copy">Clearer speech for creators, teams, and the moments worth hearing.</p></div><div><h4>Explore</h4><div className="footer-links"><Link className="footer-link" href="/blog">Blog</Link><Link className="footer-link" href="/about">About</Link><Link className="footer-link" href="/faq">FAQ</Link></div></div><div><h4>Get in touch</h4><div className="footer-links"><Link className="footer-link" href="/contact">Contact Us</Link><Link className="footer-link" href="/signup">Create a free account</Link><Link className="footer-link" href="/login">Log in</Link></div></div><div><h4>Resources</h4><div className="footer-links"><a className="footer-link" href="#before-after">Audio samples</a><a className="footer-link" href="#how-it-works">How it works</a><Link className="footer-link" href="/contact">Get support</Link></div></div></div><div className="footer-bottom"><span>Made in Pakistan</span><span>Made for better listening.</span></div></div></footer>
    </div>
  );
}

function Router() {
  return <ErrorBoundary resetKey="product-routes"><Switch>
    <Route path="/" component={Home} />
    <Route path="/blog" component={BlogPage} />
    <Route path="/about" component={AboutPage} />
    <Route path="/faq" component={FaqPage} />
    <Route path="/contact" component={ContactPage} />
    <Route path="/login"><AuthPage mode="login" /></Route>
    <Route path="/signup"><AuthPage mode="signup" /></Route>
    <Route component={NotFoundPage} />
  </Switch></ErrorBoundary>;
}

export default function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}