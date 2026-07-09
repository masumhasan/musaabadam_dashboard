'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquareOff, Plus, X } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ADMIN_PERMISSIONS } from '@/lib/constants';
import api, { extractError } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function MutedWordsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [globalMutedWords, setGlobalMutedWords] = useState<string[]>([]);
  const [newGlobalWord, setNewGlobalWord] = useState('');
  
  const [selectiveMutedWords, setSelectiveMutedWords] = useState<string[]>([]);
  const [newSelectiveWord, setNewSelectiveWord] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/settings/platform');
      const s = data.data.settings;
      setGlobalMutedWords(s?.globalMutedWords || []);
      setSelectiveMutedWords(s?.selectiveMutedWords || []);
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
        globalMutedWords,
        selectiveMutedWords,
      });
      setSuccessMsg('Muted words saved successfully!');
    } catch (err) {
      setErrorMsg(extractError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleAddGlobalWord = () => {
    const val = newGlobalWord.trim().toLowerCase();
    if (val && !globalMutedWords.includes(val)) {
      setGlobalMutedWords([...globalMutedWords, val]);
    }
    setNewGlobalWord('');
  };

  const handleRemoveGlobalWord = (w: string) => {
    setGlobalMutedWords(globalMutedWords.filter((x) => x !== w));
  };

  const handleAddSelectiveWord = () => {
    const val = newSelectiveWord.trim().toLowerCase();
    if (val && !selectiveMutedWords.includes(val)) {
      setSelectiveMutedWords([...selectiveMutedWords, val]);
    }
    setNewSelectiveWord('');
  };

  const handleRemoveSelectiveWord = (w: string) => {
    setSelectiveMutedWords(selectiveMutedWords.filter((x) => x !== w));
  };

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.VIEW_REPORTS}>
      <TopBar title="Muted Words" subtitle="Manage chat moderation filters" />
      
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
            
            {/* Global Muted Words Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquareOff size={20} className="text-red-400" />
                <h2 className="text-lg font-semibold text-slate-100">Global Muted Words</h2>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                These words are universally blocked across ALL live streams on the platform. Chat messages containing these words will be rejected.
              </p>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newGlobalWord}
                  onChange={(e) => setNewGlobalWord(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddGlobalWord()}
                  placeholder="e.g. spam"
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <Button onClick={handleAddGlobalWord} variant="secondary" className="px-3">
                  <Plus size={16} /> Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 overflow-y-auto flex-1 content-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                {globalMutedWords.length === 0 ? (
                  <p className="text-sm text-slate-500 w-full text-center py-4">No global muted words added yet.</p>
                ) : (
                  globalMutedWords.map((word) => (
                    <div key={word} className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 text-red-300 px-2.5 py-1 rounded-full text-sm">
                      <span>{word}</span>
                      <button onClick={() => handleRemoveGlobalWord(word)} className="hover:text-red-100 hover:bg-red-500/20 rounded-full p-0.5 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Selective Muted Words Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquareOff size={20} className="text-orange-400" />
                <h2 className="text-lg font-semibold text-slate-100">Selective Muted Words</h2>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                These words are available for sellers to explicitly select and enable for their individual streams before going live.
              </p>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSelectiveWord}
                  onChange={(e) => setNewSelectiveWord(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSelectiveWord()}
                  placeholder="e.g. scam"
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Button onClick={handleAddSelectiveWord} variant="secondary" className="px-3">
                  <Plus size={16} /> Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 overflow-y-auto flex-1 content-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                {selectiveMutedWords.length === 0 ? (
                  <p className="text-sm text-slate-500 w-full text-center py-4">No selective muted words added yet.</p>
                ) : (
                  selectiveMutedWords.map((word) => (
                    <div key={word} className="flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/30 text-orange-300 px-2.5 py-1 rounded-full text-sm">
                      <span>{word}</span>
                      <button onClick={() => handleRemoveSelectiveWord(word)} className="hover:text-orange-100 hover:bg-orange-500/20 rounded-full p-0.5 transition-colors">
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
