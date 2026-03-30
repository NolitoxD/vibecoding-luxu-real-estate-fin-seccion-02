"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { scheduleVisit } from "@/app/actions/profile";

interface ScheduleVisitModalProps {
  propertyId: string;
  propertyTitle: string;
  isLoggedIn: boolean;
  label: string;
}

const scheduleSchema = z.object({
  date: z.string().min(1, "Please select a date."),
  time: z.string().min(1, "Please select a time.")
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

export default function ScheduleVisitModal({
  propertyId,
  propertyTitle,
  isLoggedIn,
  label,
}: ScheduleVisitModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      date: "",
      time: ""
    }
  });

  const today = new Date().toISOString().split("T")[0];

  const handleOpen = () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    setIsOpen(true);
    setSuccess(false);
    setSubmitError("");
    reset();
  };

  const onSubmit = (data: ScheduleFormValues) => {
    setSubmitError("");
    startTransition(async () => {
      try {
        await scheduleVisit(propertyId, data.date, data.time);
        setSuccess(true);
      } catch {
        setSubmitError("Could not schedule your visit. Please try again.");
      }
    });
  };

  // Remove watch


  return (
    <>
      <button
        onClick={handleOpen}
        className="w-full bg-mosque hover:bg-[#005544] text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group"
      >
        <span className="material-icons text-xl group-hover:scale-110 transition-transform font-material-icons">
          calendar_today
        </span>
        {label}
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="visit-modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-nordic/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-nordic/10 text-nordic/60 hover:text-nordic transition-colors"
              aria-label="Close modal"
            >
              <span className="material-icons font-material-icons">close</span>
            </button>

            <h2
              id="visit-modal-title"
              className="text-xl font-semibold text-nordic mb-1"
            >
              Schedule a Visit
            </h2>
            <p className="text-nordic/60 text-sm mb-5 truncate">
              {propertyTitle}
            </p>

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-green-600 text-3xl font-material-icons">
                    check_circle
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-nordic mb-1">
                  Visit Scheduled!
                </h3>
                <p className="text-nordic/60 text-sm mb-5">
                  Your visit has been confirmed for{" "}
                  <strong>{new Date(getValues("date")).toLocaleDateString()}</strong> at{" "}
                  <strong>{getValues("time")}</strong>. You can manage it in your profile.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-mosque hover:bg-[#005544] text-white rounded-lg font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label
                    htmlFor="visit-date"
                    className="block text-sm font-medium text-nordic mb-1"
                  >
                    Preferred Date
                  </label>
                  <input
                    id="visit-date"
                    type="date"
                    min={today}
                    {...register("date")}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mosque focus:border-transparent ${
                      errors.date ? "border-red-500" : "border-nordic/20"
                    }`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="visit-time"
                    className="block text-sm font-medium text-nordic mb-1"
                  >
                    Preferred Time
                  </label>
                  <select
                    id="visit-time"
                    {...register("time")}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mosque focus:border-transparent bg-white ${
                      errors.time ? "border-red-500" : "border-nordic/20"
                    }`}
                  >
                    <option value="">Select a time...</option>
                    {[
                      "09:00",
                      "10:00",
                      "11:00",
                      "12:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-500">{errors.time.message}</p>
                  )}
                </div>

                {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

                <button
                  type="submit"
                  disabled={isPending}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    isPending
                      ? "bg-nordic/20 text-nordic/50 cursor-not-allowed"
                      : "bg-mosque hover:bg-[#005544] text-white shadow-md shadow-mosque/20"
                  }`}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      Scheduling...
                    </span>
                  ) : (
                    "Confirm Visit"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
