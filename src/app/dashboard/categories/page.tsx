'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Spinner';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { ADMIN_PERMISSIONS } from '@/lib/constants';
import api, { extractError } from '@/lib/api';
import type { Category, CategoryPaginatedResponse, ApiResponse } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const categorySchema = z.object({
  name: z.string().min(1, 'Name required').max(80),
  slug: z.string().max(80).regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers, hyphens only').optional().or(z.literal('')),
  parentId: z.string().optional().or(z.literal('')),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().min(0).optional(),
});
type CategoryForm = z.infer<typeof categorySchema>;

const updateSchema = categorySchema.extend({
  isActive: z.boolean().optional(),
});
type UpdateForm = z.infer<typeof updateSchema>;

function useCategories(page: number) {
  return useQuery({
    queryKey: ['admin-categories', page],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<CategoryPaginatedResponse>>('/admin/categories', {
        params: { page, limit: 20 },
      });
      return data.data;
    },
  });
}

function useTopLevel() {
  return useQuery({
    queryKey: ['admin-categories-top'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<CategoryPaginatedResponse>>('/admin/categories', {
        params: { parentId: 'null', limit: 200 },
      });
      return data.data.categories;
    },
  });
}

export default function CategoriesPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [formError, setFormError] = useState('');

  const { data, isLoading } = useCategories(page);
  const { data: topLevel = [] } = useTopLevel();

  const createForm = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', slug: '', parentId: '', imageUrl: '', sortOrder: 0 },
  });

  const editForm = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-categories'] });
    qc.invalidateQueries({ queryKey: ['admin-categories-top'] });
  };

  const createMut = useMutation({
    mutationFn: (body: CategoryForm) =>
      api.post('/admin/categories', { ...body, slug: body.slug || slugify(body.name) }),
    onSuccess: () => { invalidate(); setCreateOpen(false); createForm.reset(); setFormError(''); },
    onError: (err) => setFormError(extractError(err)),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateForm }) =>
      api.patch(`/admin/categories/${id}`, body),
    onSuccess: () => { invalidate(); setEditTarget(null); editForm.reset(); setFormError(''); },
    onError: (err) => setFormError(extractError(err)),
  });

  const toggleActiveMut = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/admin/categories/${id}`, { isActive }),
    onSuccess: () => invalidate(),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/categories/${id}`),
    onSuccess: () => invalidate(),
    onError: (err) => alert(extractError(err)),
  });

  const openEdit = (cat: Category) => {
    setFormError('');
    setEditTarget(cat);
    editForm.reset({
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId?._id ?? '',
      imageUrl: cat.imageUrl ?? '',
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
    });
  };

  const watchName = createForm.watch('name');

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.MANAGE_CATEGORIES}>
      <TopBar
        title="Categories"
        subtitle="Manage product categories and subcategories"
        actions={
          <Button size="sm" onClick={() => { setFormError(''); setCreateOpen(true); }}>
            <Plus size={14} /> New Category
          </Button>
        }
      />

      <div className="p-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          {isLoading ? <PageLoader /> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-400">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Slug</th>
                  <th className="px-4 py-3 font-medium">Parent</th>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data?.categories?.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {cat.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cat.imageUrl} alt="" className="h-7 w-7 rounded object-cover" />
                        ) : (
                          <div className="h-7 w-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center">
                            <span className="text-[10px] text-slate-500 font-medium">N/A</span>
                          </div>
                        )}
                        <p className="font-medium text-slate-200">{cat.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{cat.slug}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {cat.parentId ? (
                        <Badge variant="default">{cat.parentId.name}</Badge>
                      ) : (
                        <span className="text-slate-600 text-xs">Top-level</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{cat.sortOrder}</td>
                    <td className="px-4 py-3">
                      <Badge variant={cat.isActive ? 'success' : 'muted'}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button size="sm" variant="ghost"
                          onClick={() => toggleActiveMut.mutate({ id: cat._id, isActive: !cat.isActive })}
                          loading={toggleActiveMut.isPending}>
                          {cat.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => openEdit(cat)}>
                          <Pencil size={14} />
                        </Button>
                        <Button size="sm" variant="ghost"
                          onClick={() => {
                            if (confirm(`Delete "${cat.name}"? This cannot be undone.`)) {
                              deleteMut.mutate(cat._id);
                            }
                          }}
                          loading={deleteMut.isPending}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data?.categories?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No categories yet. Create your first one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {data && data.total > 0 && (
            <div className="border-t border-slate-800 px-4">
              <Pagination page={data.page} totalPages={data.totalPages} total={data.total} limit={data.limit} onChange={setPage} />
            </div>
          )}
        </div>
      </div>

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => { setCreateOpen(false); createForm.reset(); setFormError(''); }} title="Create Category">
        <form onSubmit={createForm.handleSubmit((d) => { setFormError(''); createMut.mutate(d); })} className="space-y-3">
          <Input
            label="Name"
            error={createForm.formState.errors.name?.message}
            {...createForm.register('name')}
          />
          <Input
            label="Slug (auto-generated if empty)"
            placeholder={watchName ? slugify(watchName) : 'e.g. trading-cards'}
            error={createForm.formState.errors.slug?.message}
            {...createForm.register('slug')}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Parent category (optional)</label>
            <select
              {...createForm.register('parentId')}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Top-level category —</option>
              {topLevel.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <ImageUpload
            label="Category Image (optional)"
            folder="category"
            value={createForm.watch('imageUrl')}
            onChange={(url) => createForm.setValue('imageUrl', url)}
            error={createForm.formState.errors.imageUrl?.message}
          />
          <Input
            label="Sort order"
            type="number"
            error={createForm.formState.errors.sortOrder?.message}
            {...createForm.register('sortOrder')}
          />
          {formError && <p className="text-sm text-red-400">{formError}</p>}
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => { setCreateOpen(false); createForm.reset(); }}>Cancel</Button>
            <Button type="submit" loading={createMut.isPending}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editTarget} onClose={() => { setEditTarget(null); editForm.reset(); setFormError(''); }} title="Edit Category">
        <form onSubmit={editForm.handleSubmit((d) => {
          if (!editTarget) return;
          setFormError('');
          updateMut.mutate({ id: editTarget._id, body: d });
        })} className="space-y-3">
          <Input
            label="Name"
            error={editForm.formState.errors.name?.message}
            {...editForm.register('name')}
          />
          <Input
            label="Slug"
            error={editForm.formState.errors.slug?.message}
            {...editForm.register('slug')}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Parent category</label>
            <select
              {...editForm.register('parentId')}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Top-level category —</option>
              {topLevel
                .filter((c) => c._id !== editTarget?._id)
                .map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
          </div>
          <ImageUpload
            label="Category Image (optional)"
            folder="category"
            value={editForm.watch('imageUrl')}
            onChange={(url) => editForm.setValue('imageUrl', url)}
            error={editForm.formState.errors.imageUrl?.message}
          />
          <Input
            label="Sort order"
            type="number"
            error={editForm.formState.errors.sortOrder?.message}
            {...editForm.register('sortOrder')}
          />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" {...editForm.register('isActive')} className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-blue-500" />
            <label htmlFor="isActive" className="text-sm text-slate-300">Active</label>
          </div>
          {formError && <p className="text-sm text-red-400">{formError}</p>}
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => { setEditTarget(null); editForm.reset(); }}>Cancel</Button>
            <Button type="submit" loading={updateMut.isPending}>Save Changes</Button>
          </div>
        </form>
      </Modal>
    </ProtectedRoute>
  );
}
