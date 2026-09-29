import React, { useState } from 'react';
import { Mail, Copy, Check, Send, Github, Linkedin, Instagram, ArrowUpRight, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { PERSONAL_DATA } from '../../data/personalData';
import { Theme } from '../../types/portfolio';
import { soundEngine } from '../../utils/soundEngine';

interface ContactSectionProps {
  theme: Theme;
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const [copied, setCopied] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [emailError, setEmailError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent'>('idle');
  const [dispatchDetails, setDispatchDetails] = useState({
    subject: '',
    body: '',
    mailtoUrl: '',
    gmailWebUrl: '',
  });

  const fallbackCopyText = (text: string, onSuccess: () => void) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      onSuccess();
    } catch {
      // ignore
    }
  };

  const handleCopyEmail = () => {
    soundEngine.playClick();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(PERSONAL_DATA.email)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2400);
        })
        .catch(() => {
          fallbackCopyText(PERSONAL_DATA.email, () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2400);
          });
        });
    } else {
      fallbackCopyText(PERSONAL_DATA.email, () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      });
    }
  };

  const handleCopyDraft = () => {
    soundEngine.playClick();
    const fullText = `Subject: ${dispatchDetails.subject}\nTo: ${PERSONAL_DATA.email}\n\n${dispatchDetails.body}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText)
        .then(() => {
          setCopiedDraft(true);
          setTimeout(() => setCopiedDraft(false), 2400);
        })
        .catch(() => {
          fallbackCopyText(fullText, () => {
            setCopiedDraft(true);
            setTimeout(() => setCopiedDraft(false), 2400);
          });
        });
    } else {
      fallbackCopyText(fullText, () => {
        setCopiedDraft(true);
        setTimeout(() => setCopiedDraft(false), 2400);
      });
    }
  };

  const triggerMailto = (url: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.location.href = url;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) return;

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address (e.g. name@domain.com)');
      return;
    }

    soundEngine.playClick();
    setStatus('submitting');

    const subject = `Portfolio Inquiry from ${trimmedName}`;
    const body = `${trimmedMessage}\n\n---\nSender: ${trimmedName}\nContact: ${trimmedEmail}`;
    const mailtoUrl = `mailto:${PERSONAL_DATA.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(PERSONAL_DATA.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setDispatchDetails({
      subject,
      body,
      mailtoUrl,
      gmailWebUrl,
    });

    // Try to trigger the system mailto link
    setTimeout(() => {
      triggerMailto(mailtoUrl);
      setStatus('sent');
      soundEngine.playBlip(680, 0.1, 'sine');
    }, 450);
  };

  return (
    <section id="contact" className="relative py-16 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="rounded-2xl sm:rounded-3xl border border-[#DADCE0] dark:border-white/[0.08] bg-white dark:bg-[#070912]/80 p-5 sm:p-14 backdrop-blur-xl shadow-[0_4px_24px_rgba(60,64,67,0.08)] dark:shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1A73E8]/8 dark:bg-[#2563EB]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start relative z-10">
          {/* Left Column: System Status & Direct Channels */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#1A73E8] dark:text-[#38BDF8] uppercase tracking-widest font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
              <span>COMMUNICATION CHANNEL // ACTIVE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-[#202124] dark:text-white tracking-tight leading-[1.05]">
              LET'S BUILD SOMETHING.
            </h2>

            <p className="text-sm sm:text-base text-[#3C4043] dark:text-slate-300 leading-relaxed font-normal">
              Whether you are looking to collaborate on applied machine learning pipelines,
              architect robust web applications, or discuss innovative engineering opportunities —
              my inbox is always open.
            </p>

            {/* Quick Copy Email Strip */}
            <div className="pt-2">
              <div className="text-xs font-mono text-[#5F6368] dark:text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                Primary Direct Transmission
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8F9FA] dark:bg-white/[0.03] border border-[#DADCE0] dark:border-white/[0.08] max-w-md shadow-2xs">
                <Mail className="w-4 h-4 text-[#1A73E8] dark:text-[#38BDF8] ml-2 shrink-0" />
                <a
                  href={`mailto:${PERSONAL_DATA.email}`}
                  className="text-sm font-mono text-[#202124] dark:text-white truncate hover:text-[#1A73E8] dark:hover:text-[#38BDF8] transition-colors"
                  title="Click to write email directly"
                >
                  {PERSONAL_DATA.email}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1A73E8] hover:bg-[#174EA6] text-white transition-colors cursor-pointer shrink-0 shadow-sm"
                  data-cursor="action"
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Verified Social Channels */}
            <div className="pt-4 border-t border-[#DADCE0] dark:border-white/[0.08] space-y-3">
              <div className="text-xs font-mono text-[#5F6368] dark:text-slate-400 uppercase tracking-wider font-semibold">
                Connected Networks
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-mono">
                <a
                  href={PERSONAL_DATA.social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[#3C4043] dark:text-slate-300 hover:text-[#1A73E8] dark:hover:text-white transition-colors"
                  data-cursor="action"
                >
                  <Github className="w-4 h-4 text-[#1A73E8] dark:text-[#38BDF8]" />
                  <span>/{PERSONAL_DATA.social.githubHandle}</span>
                  <ArrowUpRight className="w-3 h-3 text-[#5F6368]" />
                </a>

                <a
                  href={PERSONAL_DATA.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[#3C4043] dark:text-slate-300 hover:text-[#1A73E8] dark:hover:text-white transition-colors"
                  data-cursor="action"
                >
                  <Linkedin className="w-4 h-4 text-[#1A73E8] dark:text-[#38BDF8]" />
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight className="w-3 h-3 text-[#5F6368]" />
                </a>

                <a
                  href={PERSONAL_DATA.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[#3C4043] dark:text-slate-300 hover:text-[#1A73E8] dark:hover:text-white transition-colors"
                  data-cursor="action"
                >
                  <Instagram className="w-4 h-4 text-[#1A73E8] dark:text-[#38BDF8]" />
                  <span>/{PERSONAL_DATA.social.instagramHandle}</span>
                  <ArrowUpRight className="w-3 h-3 text-[#5F6368]" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Direct Message Form */}
          <div className="lg:col-span-6 bg-[#F8F9FA] dark:bg-white/[0.02] border border-[#DADCE0] dark:border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-display font-bold text-[#202124] dark:text-white mb-4">
              Dispatch Transmission
            </h3>

            {status === 'sent' ? (
              <div className="py-4 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#E6F4EA] dark:bg-emerald-500/20 text-[#137333] dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <div className="text-lg font-bold text-[#202124] dark:text-white">
                    Transmission Formatted & Ready
                  </div>
                  <p className="text-xs text-[#5F6368] dark:text-slate-400 max-w-sm mx-auto">
                    Your inquiry has been compiled. You can launch your mail client, open directly in Gmail, or copy the pre-formatted draft below:
                  </p>
                </div>

                {/* Draft Preview Snippet */}
                <div className="text-left bg-white dark:bg-[#05070D] border border-[#DADCE0] dark:border-white/10 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-[#DADCE0] dark:border-white/10 pb-1.5 text-[11px] font-mono text-[#5F6368] dark:text-slate-400">
                    <span>TO: {PERSONAL_DATA.email}</span>
                    <span className="text-[#137333] dark:text-emerald-400 font-semibold">STATUS: COMPILED</span>
                  </div>
                  <div className="font-semibold text-[#202124] dark:text-white truncate">
                    {dispatchDetails.subject}
                  </div>
                  <div className="text-[#3C4043] dark:text-slate-300 font-mono text-[11px] line-clamp-3 leading-relaxed whitespace-pre-wrap">
                    {formData.message}
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                  <a
                    href={dispatchDetails.gmailWebUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-1/2 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#1A73E8] hover:bg-[#174EA6] text-white font-semibold rounded-lg transition-colors cursor-pointer text-xs shadow-sm"
                    data-cursor="action"
                  >
                    <span>Open in Gmail</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => triggerMailto(dispatchDetails.mailtoUrl)}
                    className="w-full sm:w-1/2 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#F1F3F4] hover:bg-[#E8EAED] text-[#202124] dark:bg-white/10 dark:text-white dark:hover:bg-white/15 font-semibold rounded-lg transition-colors cursor-pointer text-xs border border-[#DADCE0] dark:border-transparent"
                    data-cursor="action"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#38BDF8]" />
                    <span>Launch Mail App</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#DADCE0] dark:border-white/10 text-xs">
                  <button
                    onClick={handleCopyDraft}
                    className="flex items-center gap-1 text-[#1A73E8] dark:text-[#38BDF8] hover:underline cursor-pointer font-medium"
                    data-cursor="action"
                  >
                    {copiedDraft ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Draft copied to clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy message text</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setStatus('idle')}
                    className="flex items-center gap-1 text-[#5F6368] dark:text-slate-400 hover:text-[#202124] dark:hover:text-white cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Send another</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label htmlFor="name-input" className="block text-[#3C4043] dark:text-slate-300 font-mono mb-1.5 font-medium">
                    Your Name:
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-white dark:bg-[#05070D] border border-[#DADCE0] dark:border-white/10 rounded-lg p-3 text-sm text-[#202124] dark:text-white placeholder-[#80868B] dark:placeholder-slate-500 focus:outline-none focus:border-[#1A73E8] dark:focus:border-[#38BDF8] focus:ring-1 focus:ring-[#1A73E8]"
                  />
                </div>

                <div>
                  <label htmlFor="email-input" className="block text-[#3C4043] dark:text-slate-300 font-mono mb-1.5 font-medium">
                    Your Email:
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (emailError) setEmailError('');
                    }}
                    placeholder="e.g. alex@organization.com"
                    className={`w-full bg-white dark:bg-[#05070D] border rounded-lg p-3 text-sm text-[#202124] dark:text-white placeholder-[#80868B] dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
                      emailError
                        ? 'border-[#EA4335] focus:border-[#EA4335] focus:ring-[#EA4335]'
                        : 'border-[#DADCE0] dark:border-white/10 focus:border-[#1A73E8] dark:focus:border-[#38BDF8] focus:ring-[#1A73E8]'
                    }`}
                  />
                  {emailError && (
                    <div className="flex items-center gap-1 text-[#EA4335] text-[11px] mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{emailError}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="message-input" className="block text-[#3C4043] dark:text-slate-300 font-mono mb-1.5 font-medium">
                    Project Brief or Inquiry:
                  </label>
                  <textarea
                    id="message-input"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your project, role, or technical challenge..."
                    className="w-full bg-white dark:bg-[#05070D] border border-[#DADCE0] dark:border-white/10 rounded-lg p-3 text-sm text-[#202124] dark:text-white placeholder-[#80868B] dark:placeholder-slate-500 focus:outline-none focus:border-[#1A73E8] dark:focus:border-[#38BDF8] focus:ring-1 focus:ring-[#1A73E8]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1A73E8] hover:bg-[#174EA6] text-white font-semibold rounded-lg transition-colors cursor-pointer text-sm shadow-[0_2px_8px_rgba(26,115,232,0.35)]"
                  data-cursor="action"
                >
                  <Send className="w-4 h-4" />
                  <span>{status === 'submitting' ? 'Dispatching...' : 'Dispatch Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
