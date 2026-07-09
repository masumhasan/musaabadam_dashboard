'use client';

import { useState, useEffect, useCallback } from 'react';
import { Hash, Search, Plus, X } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ADMIN_PERMISSIONS } from '@/lib/constants';
import api, { extractError } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function TagsAndWordsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const [mutedWords, setMutedWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState('');
  
  const [languages, setLanguages] = useState<string[]>(['English']);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/settings/platform');
      const s = data.data.settings;
      setTags(s?.allowedTags || []);
      setMutedWords(s?.globalMutedWords || []);
      setLanguages(s?.allowedLanguages || ['English']);
    } catch (err) {
      setErrorMsg(extractError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.put('/admin/settings/platform', {
        allowedTags: tags,
        globalMutedWords: mutedWords,
        allowedLanguages: languages,
      });
      setSuccessMsg('Settings saved successfully!');
    } catch (err) {
      setErrorMsg(extractError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    const val = newTag.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((x) => x !== t));
  };

  const handleAddWord = () => {
    const val = newWord.trim().toLowerCase();
    if (val && !mutedWords.includes(val)) {
      setMutedWords([...mutedWords, val]);
    }
    setNewWord('');
  };

  const handleRemoveWord = (w: string) => {
    setMutedWords(mutedWords.filter((x) => x !== w));
  };

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.VIEW_REPORTS}>
      <TopBar title="Tags & Muted Words" subtitle="Manage global platform discoverability and moderation" />
      
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Allowed Tags Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <Hash size={20} className="text-blue-400" />
                <h2 className="text-lg font-semibold text-slate-100">Allowed Tags</h2>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                These tags will be available for sellers to select when scheduling a show.
              </p>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="e.g. Vintage"
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={handleAddTag} variant="secondary" className="px-3">
                  <Plus size={16} /> Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 overflow-y-auto flex-1 content-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                {tags.length === 0 ? (
                  <p className="text-sm text-slate-500 w-full text-center py-4">No tags added yet.</p>
                ) : (
                  tags.map((tag) => (
                    <div key={tag} className="flex items-center gap-1.5 bg-blue-500/15 border border-blue-500/30 text-blue-300 px-2.5 py-1 rounded-full text-sm">
                      <span>{tag}</span>
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-blue-100 hover:bg-blue-500/20 rounded-full p-0.5 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Muted Words Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <Search size={20} className="text-red-400" />
                <h2 className="text-lg font-semibold text-slate-100">Global Muted Words</h2>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Words added here will be universally restricted from streams unless the seller overrides it.
              </p>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
                  placeholder="e.g. spam"
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <Button onClick={handleAddWord} variant="secondary" className="px-3">
                  <Plus size={16} /> Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 overflow-y-auto flex-1 content-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                {mutedWords.length === 0 ? (
                  <p className="text-sm text-slate-500 w-full text-center py-4">No muted words added yet.</p>
                ) : (
                  mutedWords.map((word) => (
                    <div key={word} className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 text-red-300 px-2.5 py-1 rounded-full text-sm">
                      <span>{word}</span>
                      <button onClick={() => handleRemoveWord(word)} className="hover:text-red-100 hover:bg-red-500/20 rounded-full p-0.5 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
          </div>
        )}

        {errorMsg && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
            <p className="text-sm text-red-400">{errorMsg}</p>
          </div>
        )}
        
        {successMsg && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
            <p className="text-sm text-green-400">{successMsg}</p>
          </div>
        )}

        <div className="flex justify-end border-t border-slate-800 pt-6">
          <Button onClick={handleSave} loading={saving} size="lg">
            Save Configuration
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
