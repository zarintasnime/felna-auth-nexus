"use client";

import React, { useState } from "react";
import { Star, Check, Send, CheckCircle2, ShieldCheck } from "lucide-react";

export default function FeedbackForm() {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    notRobot: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ratingLabels: Record<number, string> = {
    1: "Poor — Needs improvement",
    2: "Fair — Could be better",
    3: "Good — Satisfactory experience",
    4: "Very Good — Impressed!",
    5: "Excellent — Outstanding service!",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);

    // Simulate seamless asynchronous submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="bg-[#E5E2DC] dark:bg-[#1B1815] border border-[#2C2520]/15 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-xl dark:shadow-2xl shadow-[#2C2520]/5 dark:shadow-black/50 relative overflow-hidden transition-colors duration-300">
      {/* Top Ambient Subtle Flare */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 bg-[#D49624]/10 dark:bg-[#F5B83D]/10 rounded-full blur-[80px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Form Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#2C2520] dark:text-white tracking-tight">
          How was your experience?
        </h3>
        <p className="text-[#6E665E] dark:text-neutral-400 text-xs sm:text-sm mt-1">
          Your feedback directly guides our continuous product innovations.
        </p>
      </div>

      {isSubmitted ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#D49624]/20 dark:bg-[#F5B83D]/20 border border-[#D49624]/40 dark:border-[#F5B83D]/40 flex items-center justify-center text-[#D49624] dark:text-[#F5B83D] shadow-lg shadow-[#D49624]/10 dark:shadow-[#F5B83D]/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-2xl font-bold text-[#2C2520] dark:text-white">Thank You for Your Feedback!</h4>

          {/* Submitted Star Preview */}
          <div className="flex items-center gap-1.5 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= rating
                    ? "fill-[#D49624] text-[#D49624] dark:fill-[#F5B83D] dark:text-[#F5B83D]"
                    : "text-[#6E665E]/40 dark:text-neutral-600"
                }`}
              />
            ))}
            <span className="text-xs font-semibold text-[#D49624] dark:text-[#F5B83D] ml-2">
              {rating}/5 &mdash; {ratingLabels[rating]}
            </span>
          </div>

          <p className="text-[#6E665E] dark:text-neutral-400 text-sm max-w-sm leading-relaxed">
            Your review and message have been recorded. Our team genuinely appreciates your partnership and time.
          </p>

          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: "",
                email: "",
                phone: "",
                address: "",
                message: "",
                notRobot: true,
              });
              setRating(5);
            }}
            className="mt-4 px-6 py-2.5 rounded-full border border-[#2C2520]/20 dark:border-white/20 text-[#3D3630] dark:text-neutral-300 hover:text-[#2C2520] dark:hover:text-white hover:border-[#D49624] dark:hover:border-[#F5B83D] text-xs font-semibold transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
          >
            Submit Another Feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* =============================================================== */}
          {/* Interactive Star Rating Component                               */}
          {/* =============================================================== */}
          <div className="p-5 rounded-2xl bg-[#F4F1EA] dark:bg-[#12100E] border border-[#2C2520]/15 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2C2520] dark:text-neutral-300">
                Rate Your Experience*
              </span>
              <span className="text-xs font-semibold text-[#D49624] dark:text-[#F5B83D] transition-colors">
                {ratingLabels[hoverRating || rating] || "Select 1 to 5 stars"}
              </span>
            </div>

            <div
              className="flex items-center gap-2 pt-1"
              onMouseLeave={() => setHoverRating(0)}
              role="radiogroup"
              aria-label="Rating out of 5 stars"
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    className="p-1 rounded-lg transition-transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49624] dark:focus-visible:ring-[#F5B83D]"
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    aria-checked={rating === star}
                    role="radio"
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-all duration-200 ${
                        isFilled
                          ? "fill-[#D49624] text-[#D49624] drop-shadow-[0_0_8px_rgba(212,150,36,0.5)] dark:fill-[#F5B83D] dark:text-[#F5B83D] dark:drop-shadow-[0_0_10px_rgba(245,184,61,0.6)]"
                          : "text-[#6E665E]/40 hover:text-[#6E665E] dark:text-neutral-600 dark:hover:text-neutral-400 stroke-1"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enter your name* */}
          <div>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name*"
              className="w-full bg-[#F4F1EA] dark:bg-[#12100E] border border-[#2C2520]/15 dark:border-white/10 rounded-xl px-5 py-4 text-[#2C2520] dark:text-white placeholder-[#6E665E]/70 dark:placeholder-neutral-500 text-sm sm:text-base focus:outline-none focus:border-[#D49624] dark:focus:border-[#F5B83D] focus:ring-1 focus:ring-[#D49624] dark:focus:ring-[#F5B83D] transition-all duration-300"
            />
          </div>

          {/* Email address* */}
          <div>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email address*"
              className="w-full bg-[#F4F1EA] dark:bg-[#12100E] border border-[#2C2520]/15 dark:border-white/10 rounded-xl px-5 py-4 text-[#2C2520] dark:text-white placeholder-[#6E665E]/70 dark:placeholder-neutral-500 text-sm sm:text-base focus:outline-none focus:border-[#D49624] dark:focus:border-[#F5B83D] focus:ring-1 focus:ring-[#D49624] dark:focus:ring-[#F5B83D] transition-all duration-300"
            />
          </div>

          {/* Phone number */}
          <div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone number"
              className="w-full bg-[#F4F1EA] dark:bg-[#12100E] border border-[#2C2520]/15 dark:border-white/10 rounded-xl px-5 py-4 text-[#2C2520] dark:text-white placeholder-[#6E665E]/70 dark:placeholder-neutral-500 text-sm sm:text-base focus:outline-none focus:border-[#D49624] dark:focus:border-[#F5B83D] focus:ring-1 focus:ring-[#D49624] dark:focus:ring-[#F5B83D] transition-all duration-300"
            />
          </div>

          {/* Address */}
          <div>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Address"
              className="w-full bg-[#F4F1EA] dark:bg-[#12100E] border border-[#2C2520]/15 dark:border-white/10 rounded-xl px-5 py-4 text-[#2C2520] dark:text-white placeholder-[#6E665E]/70 dark:placeholder-neutral-500 text-sm sm:text-base focus:outline-none focus:border-[#D49624] dark:focus:border-[#F5B83D] focus:ring-1 focus:ring-[#D49624] dark:focus:ring-[#F5B83D] transition-all duration-300"
            />
          </div>

          {/* Your message* */}
          <div>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Your feedback or message*"
              className="w-full bg-[#F4F1EA] dark:bg-[#12100E] border border-[#2C2520]/15 dark:border-white/10 rounded-xl px-5 py-4 text-[#2C2520] dark:text-white placeholder-[#6E665E]/70 dark:placeholder-neutral-500 text-sm sm:text-base focus:outline-none focus:border-[#D49624] dark:focus:border-[#F5B83D] focus:ring-1 focus:ring-[#D49624] dark:focus:ring-[#F5B83D] transition-all duration-300 resize-none"
            />
          </div>

          {/* Checkbox / Consent: I'm not a robot (Mockup) */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F4F1EA] dark:bg-[#12100E] border border-[#2C2520]/15 dark:border-white/10 mb-6 select-none">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                  formData.notRobot
                    ? "bg-[#D49624] dark:bg-[#F5B83D] border-[#D49624] dark:border-[#F5B83D] text-[#1B1815]"
                    : "border-[#2C2520]/25 dark:border-white/20 bg-black/5 dark:bg-white/5 hover:border-[#D49624] dark:hover:border-white/40"
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, notRobot: !prev.notRobot }))
                }
              >
                {formData.notRobot && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
              <span className="text-sm font-medium text-[#2C2520] dark:text-neutral-300">
                I&apos;m not a robot
              </span>
            </label>

            <div className="flex flex-col items-center text-[10px] text-[#6E665E] dark:text-neutral-500 leading-tight">
              <ShieldCheck className="w-5 h-5 text-[#D49624] dark:text-[#F5B83D] mb-0.5 opacity-80" />
              <span>reCAPTCHA</span>
              <span className="text-[8px] text-[#6E665E]/80 dark:text-neutral-600">Privacy - Terms</span>
            </div>
          </div>

          {/* Submit Button (h-56px solid amber) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#D49624] hover:bg-[#c3861c] dark:bg-[#F5B83D] dark:hover:bg-[#e5a930] text-[#1B1815] font-bold text-lg rounded-full h-[56px] active:scale-[0.98] transition-all duration-200 mt-2 flex items-center justify-center gap-2 shadow-lg shadow-[#D49624]/20 dark:shadow-[#F5B83D]/20 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-[#1B1815] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>SUBMIT FEEDBACK</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Footer Text */}
          <span className="text-xs text-[#6E665E] dark:text-neutral-500 text-center mt-6 block leading-relaxed">
            We will never collect information about you without your explicit consent.
          </span>
        </form>
      )}
    </div>
  );
}
