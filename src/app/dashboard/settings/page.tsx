'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileText, Shield, Settings } from 'lucide-react';
import api, { extractError } from '@/lib/api';
import { Button } from '@/components/ui/Button';

type TabKey = 'privacy_policy' | 'terms_and_conditions' | 'platform_settings';

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  getEndpoint: string;
  putEndpoint: string;
}

const TABS: Tab[] = [
  {
    key: 'privacy_policy',
    label: 'Privacy Policy',
    icon: <Shield size={16} />,
    getEndpoint: '/settings/privacy-policy',
    putEndpoint: '/admin/settings/privacy-policy',
  },
  {
    key: 'terms_and_conditions',
    label: 'Terms & Conditions',
    icon: <FileText size={16} />,
    getEndpoint: '/settings/terms',
    putEndpoint: '/admin/settings/terms',
  },
  {
    key: 'platform_settings',
    label: 'Platform Settings',
    icon: <Settings size={16} />,
    getEndpoint: '/settings/platform',
    putEndpoint: '/admin/settings/platform',
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('privacy_policy');
  const [contents, setContents] = useState<Record<string, any>>({
    privacy_policy: '',
    terms_and_conditions: '',
    platform_settings: {
      allowedTags: [],
      globalMutedWords: [],
      allowedLanguages: ['English'],
    },
  });
  const [loading, setLoading] = useState<Record<TabKey, boolean>>({
    privacy_policy: false,
    terms_and_conditions: false,
    platform_settings: false,
  });
  const [saving, setSaving] = useState(false);
  const [fetchedTabs, setFetchedTabs] = useState<Set<TabKey>>(new Set());
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTab = useCallback(async (tab: Tab) => {
    if (fetchedTabs.has(tab.key)) return;
    setLoading((prev) => ({ ...prev, [tab.key]: true }));
    try {
      const { data } = await api.get(tab.getEndpoint);
      if (tab.key === 'platform_settings') {
        setContents((prev) => ({
          ...prev,
          [tab.key]: {
            allowedTags: data.data.settings?.allowedTags || [],
            globalMutedWords: data.data.settings?.globalMutedWords || [],
            allowedLanguages: data.data.settings?.allowedLanguages || ['English'],
          },
        }));
      } else {
        setContents((prev) => ({ ...prev, [tab.key]: data.data.content ?? '' }));
      }
      setFetchedTabs((prev) => new Set([...prev, tab.key]));
    } catch {
      // leave empty on failure
    } finally {
      setLoading((prev) => ({ ...prev, [tab.key]: false }));
    }
  }, [fetchedTabs]);

  useEffect(() => {
    const tab = TABS.find((t) => t.key === activeTab)!;
    fetchTab(tab);
  }, [activeTab, fetchTab]);

  const handleSave = async () => {
    const tab = TABS.find((t) => t.key === activeTab)!;
    setSuccessMsg('');
    setErrorMsg('');
    setSaving(true);
    try {
      if (tab.key === 'platform_settings') {
        await api.put(tab.putEndpoint, contents[activeTab]);
      } else {
        await api.put(tab.putEndpoint, { content: contents[activeTab] });
      }
      setSuccessMsg('Saved successfully.');
    } catch (err) {
      setErrorMsg(extractError(err));
    } finally {
      setSaving(false);
    }
  };

  const currentTab = TABS.find((t) => t.key === activeTab)!;

  const renderPlatformSettings = () => {
    const pSettings = contents.platform_settings;
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Allowed Tags (comma separated)</label>
          <input
            type="text"
            value={pSettings.allowedTags.join(', ')}
            onChange={(e) =>
              setContents((prev) => ({
                ...prev,
                platform_settings: {
                  ...prev.platform_settings,
                  allowedTags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                },
              }))
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Global Muted Words (comma separated)</label>
          <input
            type="text"
            value={pSettings.globalMutedWords.join(', ')}
            onChange={(e) =>
              setContents((prev) => ({
                ...prev,
                platform_settings: {
                  ...prev.platform_settings,
                  globalMutedWords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                },
              }))
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Allowed Languages (comma separated)</label>
          <input
            type="text"
            value={pSettings.allowedLanguages.join(', ')}
            onChange={(e) =>
              setContents((prev) => ({
                ...prev,
                platform_settings: {
                  ...prev.platform_settings,
                  allowedLanguages: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                },
              }))
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage platform configuration and legal content</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-slate-800 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setSuccessMsg('');
              setErrorMsg('');
              setActiveTab(tab.key);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-slate-300">{currentTab.icon}</span>
          <h2 className="text-lg font-semibold text-slate-100">{currentTab.label}</h2>
        </div>

        {activeTab !== 'platform_settings' && (
          <p className="text-sm text-slate-400 mb-3">
            This text is shown to users in the app under{' '}
            <span className="text-slate-200 font-medium">Profile → {currentTab.label}</span>.
            Plain text only — line breaks are preserved.
          </p>
        )}

        {loading[activeTab] ? (
          <div className="h-64 flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500" />
          </div>
        ) : activeTab === 'platform_settings' ? (
          renderPlatformSettings()
        ) : (
          <textarea
            value={contents[activeTab]}
            onChange={(e) =>
              setContents((prev) => ({ ...prev, [activeTab]: e.target.value }))
            }
            rows={20}
            placeholder={`Enter ${currentTab.label} text here…`}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y leading-relaxed font-mono"
          />
        )}

        {successMsg && (
          <p className="mt-3 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-sm text-green-400">
            {successMsg}
          </p>
        )}
        {errorMsg && (
          <p className="mt-3 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
            {errorMsg}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleSave}
            loading={saving}
            disabled={loading[activeTab]}
            size="lg"
          >
            Save {currentTab.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
