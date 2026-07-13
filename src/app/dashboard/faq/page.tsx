'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, HelpCircle } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Spinner';
import api, { extractError } from '@/lib/api';
import type { ApiResponse } from '@/types';

interface Faq {
  _id: string;
  question: string;
  answer: string;
  type: 'seller' | 'global';
  order: number;
  createdAt: string;
  updatedAt: string;
}

type FaqType = 'seller' | 'global';

export default function FAQPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<FaqType>('seller');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Faq | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [order, setOrder] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch FAQs
  const { data: faqs = [], isLoading } = useQuery<Faq[]>({
    queryKey: ['admin-faqs', activeTab],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ faqs: Faq[] }>>('/admin/settings/faqs', {
        params: { type: activeTab },
      });
      return data.data.faqs;
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-faqs', activeTab] });
  };

  // Create FAQ Mutation
  const createMut = useMutation({
    mutationFn: (body: Omit<Faq, '_id' | 'createdAt' | 'updatedAt'>) =>
      api.post('/admin/settings/faqs', body),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err) => setErrorMsg(extractError(err)),
  });

  // Update FAQ Mutation
  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Omit<Faq, '_id' | 'createdAt' | 'updatedAt'> }) =>
      api.put(`/admin/settings/faqs/${id}`, body),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err) => setErrorMsg(extractError(err)),
  });

  // Delete FAQ Mutation
  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/settings/faqs/${id}`),
    onSuccess: () => invalidate(),
    onError: (err) => alert(extractError(err)),
  });

  const openCreateModal = () => {
    setEditTarget(null);
    setQuestion('');
    setAnswer('');
    setOrder(0);
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (faq: Faq) => {
    setEditTarget(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setOrder(faq.order);
    setErrorMsg('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    setQuestion('');
    setAnswer('');
    setOrder(0);
    setErrorMsg('');
  };

  const handleSave = () => {
    setErrorMsg('');
    if (!question.trim() || !answer.trim()) {
      setErrorMsg('Question and Answer are required.');
      return;
    }

    const payload = {
      question: question.trim(),
      answer: answer.trim(),
      type: activeTab,
      order: Number(order) || 0,
    };

    if (editTarget) {
      updateMut.mutate({ id: editTarget._id, body: payload });
    } else {
      createMut.mutate(payload);
    }
  };

  const handleDelete = (id: string, question: string) => {
    if (confirm(`Are you sure you want to delete this FAQ: "${question}"?`)) {
      deleteMut.mutate(id);
    }
  };

  return (
    <ProtectedRoute>
      <TopBar
        title="FAQ Management"
        subtitle="Configure Seller FAQ and Global FAQ questions and answers"
        actions={
          <Button size="sm" onClick={openCreateModal}>
            <Plus size={14} className="mr-1" /> New FAQ
          </Button>
        }
      />

      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-800 mb-6">
          {(['seller', 'global'] as FaqType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle size={16} />
              {tab === 'seller' ? 'Seller FAQ' : 'Global FAQ'}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-slate-400 font-medium">
                    <th className="px-4 py-3 w-1/4">Question</th>
                    <th className="px-4 py-3 w-1/2">Answer</th>
                    <th className="px-4 py-3 w-12 text-center">Order</th>
                    <th className="px-4 py-3 text-right w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {faqs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                        No FAQs created yet for this category.
                      </td>
                    </tr>
                  ) : (
                    faqs.map((faq) => (
                      <tr key={faq._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 text-slate-200 font-medium align-top whitespace-pre-wrap">{faq.question}</td>
                        <td className="px-4 py-3 text-slate-400 align-top whitespace-pre-wrap">{faq.answer}</td>
                        <td className="px-4 py-3 text-slate-500 text-center align-top">{faq.order}</td>
                        <td className="px-4 py-3 text-right align-top">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(faq)}
                              className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors rounded hover:bg-slate-800"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(faq._id, faq.question)}
                              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded hover:bg-slate-800"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create / Edit */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editTarget ? 'Edit FAQ' : `New ${activeTab === 'seller' ? 'Seller' : 'Global'} FAQ`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. How do I unlock my seller access?"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              placeholder="Enter answer here..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Sort Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">Lower order FAQs are displayed first.</p>
          </div>

          {errorMsg && (
            <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
              {errorMsg}
            </p>
          )}

          <div className="flex justify-end gap-3 mt-6 border-t border-slate-800 pt-4">
            <Button variant="outline" size="md" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              size="md"
              onClick={handleSave}
              loading={createMut.isPending || updateMut.isPending}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </ProtectedRoute>
  );
}
