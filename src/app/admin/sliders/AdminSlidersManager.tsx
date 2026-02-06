"use client";

import { useEffect, useState } from "react";
import { Slider } from "../../../types/slider";
import {
  getSliders,
  createSlider,
  deleteSlider,
} from "../../../services/slider";
import SlidersGrid from "./SlidersGrid";
import SliderPreviewPanel from "./SliderPreviewPanel";
import ConfirmationModal from "../../components/common/ConfirmationModal";

export default function AdminSlidersManager() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState<Slider | null>(null);

  /* ================= DELETE MODAL STATE ================= */
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* ================= FETCH ================= */
  const fetchSliders = async () => {
    setLoading(true);
    try {
      const data = await getSliders();
      setSliders(data);
      if (!activeSlide && data.length) setActiveSlide(data[0]);
    } catch (err) {
      console.error("Failed to fetch sliders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  /* ================= ADD ================= */
  const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const fd = new FormData();
    fd.append("image", e.target.files[0]);

    try {
      setLoading(true);
      await createSlider(fd);
      await fetchSliders();
      alert("Slider added successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to add slider");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  /* ================= OPEN MODAL ================= */
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
  };

  /* ================= CLOSE MODAL ================= */
  const closeDeleteModal = () => {
    setDeleteId(null);
  };

  /* ================= CONFIRM DELETE ================= */
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      await deleteSlider(deleteId);

      if (activeSlide?._id === deleteId) {
        setActiveSlide(null);
      }

      await fetchSliders();
    } catch (err) {
      console.error(err);
      alert("Failed to delete slider");
    } finally {
      setLoading(false);
      closeDeleteModal();
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      <SlidersGrid
        sliders={sliders}
        loading={loading}
        onSelect={setActiveSlide}
        onDelete={openDeleteModal}
        onAdd={() =>
          document.getElementById("add-slider-input")?.click()
        }
        selectedSlide={activeSlide}
      />

      <input
        type="file"
        id="add-slider-input"
        accept="image/*"
        className="hidden"
        onChange={handleAdd}
      />

      {activeSlide && <SliderPreviewPanel slide={activeSlide} />}

      {/* ================= COMMON CONFIRMATION MODAL ================= */}
      <ConfirmationModal
        title="Delete Slider"
        description="Are you sure you want to delete this slider?"
        isOpen={!!deleteId}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
}
