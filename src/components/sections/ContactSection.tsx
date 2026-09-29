import React, { useState } from 'react';
import { Mail, Copy, Check, Send, Github, Linkedin, Instagram, ArrowUpRight, Terminal } from 'lucide-react';
import { PERSONAL_DATA } from '../../data/personalData';
import { Theme } from '../../types/portfolio';
import { soundEngine } from '../../utils/soundEngine';

interface ContactSectionProps {
  theme: Theme;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ theme }) => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent'>('idle');

  const handleCopyEmail = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(PERSONAL_DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    soundEngine.playClick();
    setStatus('submitting');

    // Simulate network submission and trigger mailto fallback
    setTimeout(() => {
      setStatus('sent');
      soundEngine.playBlip(680, 0.1, 'sine');
      const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
      const body = encodeURIComponent(`${formData.message}\n\nFrom: ${formData.name} (${formData.email})`);
      window.location.href = `mailto:${PERSONAL_DATA.email}?subject=${subject}&body=${body}`;
    }, 600);
  };

  return (
    <section id="contact" className="relative py-28 px-6 max-w-7xl mx-auto w-full">
      <div className="rounded-3xl border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 bg-[#070912]/80 dark:bg-[#070912]/80 light:bg-slate-50/80 p-8 sm:p-14 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          {/* Left Column: System Status & Direct Channels */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TERMINAL STATUS // ONLINE</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white dark:text-white light:text-slate-900 tracking-tight leading-[1.05]">
              LET'S BUILD SOMETHING.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed font-normal">
              Whether you are looking to collaborate on applied machine learning pipelines,
              architect robust web applications, or discuss innovative engineering opportunities —
              my inbox is always open.
            </p>

            {/* Quick Copy Email Strip */}
            <div className="pt-2">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                Primary Direct Transmission
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] max-w-md">
                <Mail className="w-4 h-4 text-[#38BDF8] ml-2 shrink-0" />
                <span className="text-sm font-mono text-white dark:text-white light:text-slate-900 truncate">
                  {PERSONAL_DATA.email}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors cursor-pointer shrink-0"
                  data-cursor="action"
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
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Connected Networks
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-mono">
                <a
                  href={PERSONAL_DATA.social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  data-cursor="action"
                >
                  <Github className="w-4 h-4 text-[#38BDF8]" />
                  <span>/{PERSONAL_DATA.social.githubHandle}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>

                <a
                  href={PERSONAL_DATA.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  data-cursor="action"
                >
                  <Linkedin className="w-4 h-4 text-[#38BDF8]" />
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>

                <a
                  href={PERSONAL_DATA.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  data-cursor="action"
                >
                  <Instagram className="w-4 h-4 text-[#38BDF8]" />
                  <span>/{PERSONAL_DATA.social.instagramHandle}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Direct Message Form */}
          <div className="lg:col-span-6 bg-white/[0.02] dark:bg-white/[0.02] light:bg-white border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-display font-bold text-white dark:text-white light:text-slate-900 mb-4">
              Dispatch Transmission
            </h3>

            {status === 'sent' ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <div className="text-base font-semibold text-white dark:text-white light:text-slate-900">
                  Transmission Prepared
                </div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Your mail client has been opened with your message. Thank you for connecting!
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-4 text-xs font-mono text-[#38BDF8] hover:underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label htmlFor="name-input" className="block text-slate-300 dark:text-slate-300 light:text-slate-700 font-mono mb-1.5">
                    Your Name:
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-[#05070D] dark:bg-[#05070D] light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-300 rounded-lg p-3 text-sm text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <div>
                  <label htmlFor="email-input" className="block text-slate-300 dark:text-slate-300 light:text-slate-700 font-mono mb-1.5">
                    Your Email:
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. alex@organization.com"
                    className="w-full bg-[#05070D] dark:bg-[#05070D] light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-300 rounded-lg p-3 text-sm text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <div>
                  <label htmlFor="message-input" className="block text-slate-300 dark:text-slate-300 light:text-slate-700 font-mono mb-1.5">
                    Project Brief or Inquiry:
                  </label>
                  <textarea
                    id="message-input"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your project, role, or technical challenge..."
                    className="w-full bg-[#05070D] dark:bg-[#05070D] light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-300 rounded-lg p-3 text-sm text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg transition-colors cursor-pointer text-sm shadow-[0_0_16px_rgba(37,99,235,0.3)]"
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
