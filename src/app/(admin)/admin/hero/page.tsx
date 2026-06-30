"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiArrowUp, FiArrowDown, FiEye, FiEyeOff } from "react-icons/fi";
import { HeroSlide } from "@/types/hero";

interface SlideFormValues {
  imageUrl: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  isActive: boolean;
}

export default function HeroAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState<SlideFormValues>({
    imageUrl: "",
    imageAlt: "",
    eyebrow: "",
    title: "",
    titleHighlight: "",
    description: "",
    ctaPrimaryLabel: undefined,
    ctaPrimaryHref: undefined,
    ctaSecondaryLabel: undefined,
    ctaSecondaryHref: undefined,
    isActive: true,
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/hero?active=false");
      const data = await res.json();
      if (!res.ok) {
        console.error("Failed to fetch slides:", data);
        setError(data.error || "Failed to load slides");
        return;
      }
      if (data.slides) {
        setSlides(data.slides);
      }
    } catch (error) {
      console.error("Failed to fetch slides:", error);
      setError("Failed to load slides");
    } finally {
      setLoading(false);
    }
  }

  async function saveSlide() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        imageUrl: formValues.imageUrl,
        imageAlt: formValues.imageAlt,
        eyebrow: formValues.eyebrow,
        title: formValues.title,
        titleHighlight: formValues.titleHighlight,
        description: formValues.description,
        ctaPrimaryLabel: formValues.ctaPrimaryLabel,
        ctaPrimaryHref: formValues.ctaPrimaryHref,
        ctaSecondaryLabel: formValues.ctaSecondaryLabel,
        ctaSecondaryHref: formValues.ctaSecondaryHref,
        isActive: formValues.isActive,
      };
      const url = editingSlide
        ? `/api/admin/hero/${editingSlide.id}`
        : "/api/admin/hero";
      const method = editingSlide ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save slide");
      }
      const data = await res.json();
      if (editingSlide) {
        setSlides(slides.map((s) => (s.id === editingSlide.id ? data.slide : s)));
      } else {
        setSlides([...slides, data.slide]);
      }
      resetForm();
    } catch (error: any) {
      setError(error.message || "Failed to save slide");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSlide(id: string) {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    try {
      const res = await fetch(`/api/admin/hero/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSlides(slides.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete slide:", error);
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/hero/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        setSlides(slides.map((s) => (s.id === id ? { ...s, isActive: !isActive } : s)));
      }
    } catch (error) {
      console.error("Failed to toggle slide:", error);
    }
  }

  async function moveSlide(id: string, direction: "up" | "down") {
    const currentIndex = slides.findIndex((s) => s.id === id);
    if (currentIndex === -1) return;
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const newSlides = [...slides];
    [newSlides[currentIndex], newSlides[newIndex]] = [newSlides[newIndex], newSlides[currentIndex]];
    for (let i = 0; i < newSlides.length; i++) {
      newSlides[i] = { ...newSlides[i], order: i + 1 };
    }

    try {
      const res = await fetch("/api/admin/hero/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newSlides.map((s) => s.id) }),
      });
      if (res.ok) {
        setSlides(newSlides);
      }
    } catch (error) {
      console.error("Failed to reorder slides:", error);
    }
  }

  function editSlide(slide: HeroSlide) {
    setEditingSlide(slide);
    setFormValues({
      imageUrl: slide.imageUrl,
      imageAlt: slide.imageAlt,
      eyebrow: slide.eyebrow,
      title: slide.title,
      titleHighlight: slide.titleHighlight,
      description: slide.description,
      ctaPrimaryLabel: slide.ctaPrimaryLabel,
      ctaPrimaryHref: slide.ctaPrimaryHref,
      ctaSecondaryLabel: slide.ctaSecondaryLabel,
      ctaSecondaryHref: slide.ctaSecondaryHref,
      isActive: slide.isActive,
    });
    setShowForm(true);
  }

  function resetForm() {
    setEditingSlide(null);
    setFormValues({
      imageUrl: "",
      imageAlt: "",
      eyebrow: "",
      title: "",
      titleHighlight: "",
      description: "",
      ctaPrimaryLabel: undefined,
      ctaPrimaryHref: undefined,
      ctaSecondaryLabel: undefined,
      ctaSecondaryHref: undefined,
      isActive: true,
    });
    setShowForm(false);
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0a0a0a]">Hero Slides</h1>
          <p className="mt-1 text-sm text-[#5A5E55]">Manage homepage carousel slides</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-[#d8a928] px-4 py-2 text-sm font-medium text-white hover:bg-[#b8923f]"
        >
          <FiPlus className="h-4 w-4" />
          Add Slide
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0a0a0a]">
                {editingSlide ? "Edit Slide" : "Add New Slide"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0a0a0a] mb-1.5">Image</label>
                <div className="flex items-start gap-3">
                  <input
                    type="text"
                    value={formValues.imageUrl}
                    onChange={(e) => setFormValues((v) => ({ ...v, imageUrl: e.target.value }))}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50"
                    placeholder="https://example.com/image.jpg"
                  />
                  <label className="rounded-lg border border-[#d8a928]/25 bg-white px-3 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-[#fcf5e8] cursor-pointer">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("file", file);
                        const res = await fetch("/api/admin/hero/upload", {
                          method: "POST",
                          body: formData,
                        });
                        const data = await res.json();
                        if (res.ok && data.url) {
                          setFormValues((v) => ({ ...v, imageUrl: data.url }));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                {formValues.imageUrl && (
                  <img src={formValues.imageUrl} alt="Preview" className="mt-2 h-24 w-32 rounded object-cover border border-gray-200" />
                )}
              </div>

              <input
                value={formValues.imageAlt}
                onChange={(e) => setFormValues((v) => ({ ...v, imageAlt: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50"
                placeholder="Image Alt Text"
              />

              <input
                value={formValues.eyebrow}
                onChange={(e) => setFormValues((v) => ({ ...v, eyebrow: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50"
                placeholder="Eyebrow Text (e.g., Your Trusted Tech Destination)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  value={formValues.title}
                  onChange={(e) => setFormValues((v) => ({ ...v, title: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50"
                  placeholder="Title (e.g., Premium Laptops)"
                />
                <input
                  value={formValues.titleHighlight}
                  onChange={(e) => setFormValues((v) => ({ ...v, titleHighlight: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50"
                  placeholder="Title Highlight (e.g., & Tech)"
                />
              </div>

              <textarea
                value={formValues.description}
                onChange={(e) => setFormValues((v) => ({ ...v, description: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50 resize-none"
                placeholder="Description"
              />

              <div className="border-t border-[#d8a928]/20 pt-4">
                <p className="text-sm font-medium text-[#0a0a0a] mb-3">Primary CTA</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    value={formValues.ctaPrimaryLabel}
                    onChange={(e) => setFormValues((v) => ({ ...v, ctaPrimaryLabel: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50"
                    placeholder="Label (e.g., Shop Now)"
                  />
                  <input
                    value={formValues.ctaPrimaryHref}
                    onChange={(e) => setFormValues((v) => ({ ...v, ctaPrimaryHref: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50"
                    placeholder="URL (e.g., /products)"
                  />
                </div>
              </div>

              <div className="border-t border-[#d8a928]/20 pt-4">
                <p className="text-sm font-medium text-[#0a0a0a] mb-3">Secondary CTA</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    value={formValues.ctaSecondaryLabel}
                    onChange={(e) => setFormValues((v) => ({ ...v, ctaSecondaryLabel: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50"
                    placeholder="Label (e.g., View Deals)"
                  />
                  <input
                    value={formValues.ctaSecondaryHref}
                    onChange={(e) => setFormValues((v) => ({ ...v, ctaSecondaryHref: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50"
                    placeholder="URL (e.g., /collections/hot-deals)"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 p-4 rounded-xl border border-[#d8a928]/20 cursor-pointer hover:bg-[#fcf5e8] transition-colors">
                <input
                  type="checkbox"
                  checked={formValues.isActive}
                  onChange={(e) => setFormValues((v) => ({ ...v, isActive: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-300 text-[#f6a45d] focus:ring-[#f6a45d]"
                />
                <div>
                  <p className="text-sm font-medium text-[#0a0a0a]">Active</p>
                  <p className="text-xs text-[#5A5E55]">Visible on homepage</p>
                </div>
              </label>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSlide}
                  disabled={saving || !formValues.imageUrl || !formValues.title}
                  className="rounded-lg bg-[#d8a928] px-4 py-2 text-sm font-medium text-white hover:bg-[#b8923f] disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingSlide ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : slides.length === 0 ? (
        <p className="text-gray-500 text-sm">No slides found. Add your first slide!</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {slides.map((slide, index) => (
                  <tr key={slide.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {slide.imageUrl ? (
                        <img
                          src={slide.imageUrl}
                          alt={slide.imageAlt}
                          className="h-16 w-24 rounded object-cover"
                        />
                      ) : (
                        <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#0a0a0a]">{slide.title} {slide.titleHighlight}</p>
                      <p className="text-xs text-gray-500">{slide.eyebrow}</p>
                      <p className="mt-1 text-xs text-gray-600 line-clamp-2">{slide.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          slide.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {slide.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => moveSlide(slide.id, "up")}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-[#d8a928] disabled:opacity-30"
                          title="Move up"
                        >
                          <FiArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveSlide(slide.id, "down")}
                          disabled={index === slides.length - 1}
                          className="p-1 text-gray-400 hover:text-[#d8a928] disabled:opacity-30"
                          title="Move down"
                        >
                          <FiArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleActive(slide.id, slide.isActive)}
                          className="p-1 text-gray-400 hover:text-amber-600"
                          title={slide.isActive ? "Hide" : "Show"}
                        >
                          {slide.isActive ? (
                            <FiEyeOff className="h-4 w-4" />
                          ) : (
                            <FiEye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => editSlide(slide)}
                          className="p-1 text-gray-400 hover:text-[#d8a928]"
                          title="Edit"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteSlide(slide.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                          title="Delete"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}