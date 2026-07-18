'use client';

import { useState, useEffect } from 'react';
import { Award, CheckCircle2, Save, Plus, Trash2, ShieldCheck, TrendingUp, Truck } from 'lucide-react';
import api, { extractError } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface PremierShopConfig {
  activeDays: number;
  hostedShows: number;
  completedOrders: number;
  gmvAmount: number;
  timelyShippingPercent: number;
  shippingHours: number;
  orderReliabilityPercent: number;
  policyAdherenceText: string;
  commissionDiscountPercent: number;
  perks: string[];
}

export default function PremierShopAdminPage() {
  const [config, setConfig] = useState<PremierShopConfig>({
    activeDays: 90,
    hostedShows: 10,
    completedOrders: 250,
    gmvAmount: 50000,
    timelyShippingPercent: 95,
    shippingHours: 48,
    orderReliabilityPercent: 99,
    policyAdherenceText: 'Full compliance with BidsRush Community Guidelines & Trust Standards',
    commissionDiscountPercent: 10,
    perks: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [newPerk, setNewPerk] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/settings/premier-shop');
      if (data?.data?.config) {
        setConfig((prev) => ({
          ...prev,
          ...data.data.config,
        }));
      }
    } catch (err) {
      setErrorMsg(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSuccessMsg('');
    setErrorMsg('');
    setSaving(true);
    try {
      const { data } = await api.put('/admin/settings/premier-shop', config);
      if (data?.data?.config) {
        setConfig((prev) => ({ ...prev, ...data.data.config }));
      }
      setSuccessMsg('Premier Shop criteria and perks updated successfully!');
    } catch (err) {
      setErrorMsg(extractError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleAddPerk = () => {
    if (!newPerk.trim()) return;
    setConfig((prev) => ({
      ...prev,
      perks: [...prev.perks, newPerk.trim()],
    }));
    setNewPerk('');
  };

  const handleRemovePerk = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      perks: prev.perks.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Premier Shop Settings</h1>
              <p className="text-sm text-slate-400">
                Configure eligibility criteria, perks, and commission discounts for top-performing sellers
              </p>
            </div>
          </div>
        </div>
        <Button onClick={handleSave} loading={saving} className="gap-2">
          <Save size={16} /> Save Changes
        </Button>
      </div>

      {successMsg && (
        <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-400 flex items-center gap-2">
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales & Activity Volume */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-5">
          <div className="flex items-center gap-2 text-blue-400 font-semibold border-b border-slate-800 pb-3">
            <TrendingUp size={18} />
            <h2>Sales & Activity Volume Criteria</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Active Seller Tenure (Days)
              </label>
              <input
                type="number"
                value={config.activeDays}
                onChange={(e) => setConfig({ ...config, activeDays: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
              />
              <p className="text-xs text-slate-500 mt-1">Minimum days seller must be registered</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Minimum Hosted Live Shows
              </label>
              <input
                type="number"
                value={config.hostedShows}
                onChange={(e) => setConfig({ ...config, hostedShows: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Minimum Completed Orders
              </label>
              <input
                type="number"
                value={config.completedOrders}
                onChange={(e) => setConfig({ ...config, completedOrders: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Minimum GMV Sales Amount ($)
              </label>
              <input
                type="number"
                value={config.gmvAmount}
                onChange={(e) => setConfig({ ...config, gmvAmount: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Fulfillment & Service Excellence */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-5">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold border-b border-slate-800 pb-3">
            <Truck size={18} />
            <h2>Fulfillment & Service Excellence</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Timely Shipping (%)
                </label>
                <input
                  type="number"
                  value={config.timelyShippingPercent}
                  onChange={(e) => setConfig({ ...config, timelyShippingPercent: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Business Hours Limit
                </label>
                <input
                  type="number"
                  value={config.shippingHours}
                  onChange={(e) => setConfig({ ...config, shippingHours: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Order Reliability Rate (%)
              </label>
              <input
                type="number"
                value={config.orderReliabilityPercent}
                onChange={(e) => setConfig({ ...config, orderReliabilityPercent: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
              />
              <p className="text-xs text-slate-500 mt-1">Order success rate (minimal seller cancellations/refunds)</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Policy Adherence Guidelines
              </label>
              <textarea
                value={config.policyAdherenceText}
                onChange={(e) => setConfig({ ...config, policyAdherenceText: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Perks & Benefits Section */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-5">
        <div className="flex items-center gap-2 text-amber-400 font-semibold border-b border-slate-800 pb-3">
          <ShieldCheck size={18} />
          <h2>Premier Shop Perks & Commission Discounts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Commission Fee Discount (%)
            </label>
            <input
              type="number"
              value={config.commissionDiscountPercent}
              onChange={(e) => setConfig({ ...config, commissionDiscountPercent: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
            />
            <p className="text-xs text-slate-500 mt-1">
              Discount applied to standard seller commission fee (e.g. 10% reduction)
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <label className="block text-xs font-medium text-slate-400">
              Configured Premier Shop Perks
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={newPerk}
                onChange={(e) => setNewPerk(e.target.value)}
                placeholder="Add new perk (e.g. Priority Seller Support)..."
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPerk())}
              />
              <Button type="button" onClick={handleAddPerk} size="sm" className="gap-1">
                <Plus size={16} /> Add Perk
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pt-2">
              {config.perks.map((perk, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-slate-800 px-3.5 py-2 border border-slate-700/60 text-sm text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <Award size={14} className="text-amber-400" />
                    {perk}
                  </span>
                  <button
                    onClick={() => handleRemovePerk(idx)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {config.perks.length === 0 && (
                <p className="text-xs text-slate-500 italic">No custom perks added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
