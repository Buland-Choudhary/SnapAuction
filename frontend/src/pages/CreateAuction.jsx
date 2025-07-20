import { useForm } from "react-hook-form";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CreateAuction() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("basePrice", data.basePrice);
      formData.append("minIncrement", data.minIncrement);
      if (data.maxIncrement) {
        formData.append("maxIncrement", data.maxIncrement);
      }

      // ⬇️ Convert local datetime to UTC ISO string
      const startUTC = new Date(data.startTime).toISOString();
      const endUTC = new Date(data.endTime).toISOString();

      formData.append("startTime", startUTC);
      formData.append("endTime", endUTC);

      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }

      const res = await axios.post("/auctions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      reset();
      navigate(`/auction/${res.data.id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create auction.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 py-10 px-4 flex items-start justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Create New Auction</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              {...register("title", { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">Title is required.</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register("description", { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
              rows={4}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">Description is required.</p>
            )}
          </div>

          {/* Pricing Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Base Price ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("basePrice", { required: true, min: 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
              />
              {errors.basePrice && (
                <p className="text-red-600 text-sm mt-1">Required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Min Increment ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("minIncrement", { required: true, min: 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
              />
              {errors.minIncrement && (
                <p className="text-red-600 text-sm mt-1">Required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max Increment ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("maxIncrement")}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-sm text-gray-500 mt-1">Optional</p>
            </div>
          </div>

          {/* Start and End Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="datetime-local"
                {...register("startTime", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
              />
              {errors.startTime && (
                <p className="text-red-600 text-sm mt-1">Required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="datetime-local"
                {...register("endTime", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
              />
              {errors.endTime && (
                <p className="text-red-600 text-sm mt-1">Required</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              {...register("images", { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
            />
            {errors.images && (
              <p className="text-red-600 text-sm mt-1">At least one image is required.</p>
            )}
          </div>

          {/* Error */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-700 hover:bg-blue-800 transition-all text-white font-semibold py-2 rounded-xl shadow-sm disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Auction"}
          </button>
        </form>
      </div>
    </div>
  );
}
