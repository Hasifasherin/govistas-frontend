"use client";

import React, { useState, useEffect } from "react";
import axios from "../../../utils/api";
import {
  FiX,
  FiUpload,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiTag,
  FiUsers,
  FiFileText,
} from "react-icons/fi";

interface AddTourFormProps {
  onClose: () => void;
  onTourAdded: () => Promise<void> | void;
}

export default function AddTourForm({ onClose, onTourAdded }: AddTourFormProps) {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    duration: "",
    maxGroupSize: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- LOAD CATEGORIES ---------------- */
  useEffect(() => {
    axios
      .get("/tours/categories")
      .then((res) => setCategories(res.data?.categories || []))
      .catch(() =>
        setCategories(["Adventure", "Beach", "Island", "Luxury", "Honeymoon"])
      );
  }, []);

  /* ---------------- CHANGE ---------------- */
  const onChange = (e: any) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setImageFile(files[0]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.location || !form.price || !imageFile) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      fd.append("image", imageFile);

      const res = await axios.post("/tours", fd);

      if (res.data?.success) {
        onTourAdded();
        onClose();
      } else {
        setError("Failed to create tour");
      }
    } catch (err: any) {
      setError("Server error. Try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">Create New Tour</h2>
            <p className="text-sm text-gray-500">
              Add a new tour package for customers
            </p>
          </div>

          <button onClick={onClose}>
            <FiX size={22} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={submit}
          className="p-6 grid grid-cols-2 gap-5 max-h-[75vh] overflow-y-auto"
        >

          {/* TITLE */}
          <div className="col-span-2">
            <label className="label">Tour Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Maldives Island Paradise Tour"
              className="input"
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="label">Location *</label>
            <div className="relative">
              <FiMapPin className="icon" />
              <input
                name="location"
                value={form.location}
                onChange={onChange}
                placeholder="Maldives"
                className="input pl-10"
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="label">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              className="input"
            >
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* PRICE */}
          <div>
            <label className="label">Price ($) *</label>
            <div className="relative">
              <FiDollarSign className="icon" />
              <input
                name="price"
                type="number"
                placeholder="1500"
                value={form.price}
                onChange={onChange}
                className="input pl-10"
              />
            </div>
          </div>

          {/* DAYS */}
          <div>
            <label className="label">Duration (Days) *</label>
            <input
              name="duration"
              type="number"
              placeholder="5"
              value={form.duration}
              onChange={onChange}
              className="input"
            />
          </div>

          {/* GROUP */}
          <div>
            <label className="label">Max Group</label>
            <div className="relative">
              <FiUsers className="icon" />
              <input
                name="maxGroupSize"
                type="number"
                placeholder="10"
                value={form.maxGroupSize}
                onChange={onChange}
                className="input pl-10"
              />
            </div>
          </div>

          {/* START DATE */}
          <div>
            <label className="label">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={onChange}
              className="input"
            />
          </div>

          {/* END DATE */}
          <div>
            <label className="label">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={onChange}
              className="input"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="col-span-2">
            <label className="label">Description</label>
            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Experience crystal clear waters, luxury resorts, snorkeling, island hopping..."
              className="input"
            />
          </div>

          {/* IMAGE */}
          <div className="col-span-2">
            <label className="label">Tour Image *</label>

            <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center cursor-pointer hover:border-green-500 transition">
              <FiUpload size={28} className="text-green-600" />
              <p className="text-sm mt-2">
                {imageFile ? imageFile.name : "Upload tour image"}
              </p>

              <input
                type="file"
                name="image"
                onChange={onChange}
                className="hidden"
              />
            </label>
          </div>

          {/* ERROR */}
          {error && (
            <div className="col-span-2 bg-red-100 text-red-700 p-3 rounded">
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="col-span-2 flex gap-4 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              {saving ? "Creating..." : "Create Tour"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-lg py-3 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* REUSABLE STYLES */}
      <style jsx>{`
        .label {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
          display: block;
        }

        .input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          outline: none;
        }

        .input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
        }

        .icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: gray;
        }
      `}</style>
    </div>
  );
}
