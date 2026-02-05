"use client";

import { useEffect, useState } from "react";
import { Slider } from "../../../types/slider";
import { getSliders, createSlider, deleteSlider } from "../../../services/slider";
import SlidersGrid from "./SlidersGrid";
import SliderPreviewPanel from "./SliderPreviewPanel";

export default function AdminSlidersManager() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState<Slider | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slider?")) return;

    try {
      setLoading(true);
      await deleteSlider(id);
      if (activeSlide?._id === id) setActiveSlide(null);
      await fetchSliders();
    } catch (err) {
      console.error(err);
      alert("Failed to delete slider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SlidersGrid
        sliders={sliders}
        loading={loading}
        onSelect={setActiveSlide}
        onDelete={handleDelete}
        onAdd={() => document.getElementById("add-slider-input")?.click()}
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
    </div>
  );
}
