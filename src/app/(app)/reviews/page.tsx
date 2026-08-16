"use client";

import { useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { mockReviews } from "@/data/reviews";
import { mockSessions } from "@/data/sessions";
import { currentUser } from "@/data/users";
import { cn } from "@/lib/utils";
import Modal from "@/components/ui/Modal";

interface ReviewFormState {
  teachingQuality: number;
  communication: number;
  knowledge: number;
  punctuality: number;
  overallExperience: number;
  comment: string;
}

export default function ReviewsPage() {
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<ReviewFormState>({
    teachingQuality: 0,
    communication: 0,
    knowledge: 0,
    punctuality: 0,
    overallExperience: 0,
    comment: "",
  });

  // Sessions awaiting review
  const completedSessions = mockSessions.filter((s) => s.status === "completed");
  const reviewSession = completedSessions[0];

  const dimensions: { key: keyof ReviewFormState; label: string }[] = [
    { key: "teachingQuality", label: "Teaching Quality" },
    { key: "communication", label: "Communication" },
    { key: "knowledge", label: "Knowledge" },
    { key: "punctuality", label: "Punctuality" },
    { key: "overallExperience", label: "Overall Experience" },
  ];

  const handleSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowModal(false);
      setForm({ teachingQuality: 0, communication: 0, knowledge: 0, punctuality: 0, overallExperience: 0, comment: "" });
    }, 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reviews</h1>
        <p className="text-slate-400">Your reviews and sessions awaiting feedback.</p>
      </div>

      {/* Pending reviews */}
      {completedSessions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Awaiting Your Review</h2>
          <div className="space-y-3">
            {completedSessions.slice(0, 2).map((session) => {
              const partner = session.teacherId === "current" ? session.learner : session.teacher;
              return (
                <div key={session.id} className="bg-surface-2 border border-amber-500/20 rounded-2xl p-5">
                  <div className="flex items-center gap-4">
                    <Avatar src={partner.avatar} name={partner.name} size="lg" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{partner.name}</h3>
                      <p className="text-sm text-slate-400">{session.skill.name} · {session.date}</p>
                    </div>
                    <Badge variant="warning" size="sm">Review Pending</Badge>
                    <Button size="sm" onClick={() => setShowModal(true)}>
                      Leave Review
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews received */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Reviews You&apos;ve Received</h2>
        <div className="space-y-4">
          {mockReviews.filter((r) => r.revieweeId === "current" || r.revieweeId === "u1").map((review) => (
            <div key={review.id} className="bg-surface-2 border border-white/6 rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar src={review.reviewer.avatar} name={review.reviewer.name} size="md" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{review.reviewer.name}</h3>
                    <span className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <StarRating value={review.overallExperience} size="sm" className="mt-1" />
                  <Badge variant="default" size="sm" className="mt-2">{review.skill.name}</Badge>
                </div>
              </div>

              <p className="text-sm text-slate-300 italic mb-5">&ldquo;{review.comment}&rdquo;</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Teaching", value: review.teachingQuality },
                  { label: "Knowledge", value: review.knowledge },
                  { label: "Communication", value: review.communication },
                  { label: "Punctuality", value: review.punctuality },
                ].map((dim) => (
                  <div key={dim.label} className="bg-surface-3 rounded-xl p-3 text-center border border-white/5">
                    <p className="text-xs text-slate-500 mb-1.5">{dim.label}</p>
                    <StarRating value={dim.value} size="sm" className="justify-center" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews you've written */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Reviews You&apos;ve Written</h2>
        <div className="space-y-4">
          {mockReviews.filter((r) => r.reviewerId === "current").map((review) => (
            <div key={review.id} className="bg-surface-2 border border-white/6 rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar src={review.reviewee.avatar} name={review.reviewee.name} size="md" />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Review for {review.reviewee.name}</h3>
                  <StarRating value={review.overallExperience} size="sm" className="mt-1" />
                  <Badge variant="default" size="sm" className="mt-2">{review.skill.name}</Badge>
                </div>
                <span className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-slate-300 italic">&ldquo;{review.comment}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Leave a Review" size="md">
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Review Submitted!</h3>
            <p className="text-slate-400">Thank you for your feedback.</p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {reviewSession && (
              <div className="flex items-center gap-3 p-4 bg-surface-3 rounded-xl border border-white/6">
                <Avatar
                  src={reviewSession.teacherId === "current" ? reviewSession.learner.avatar : reviewSession.teacher.avatar}
                  name={reviewSession.teacherId === "current" ? reviewSession.learner.name : reviewSession.teacher.name}
                  size="md"
                />
                <div>
                  <p className="font-semibold text-white text-sm">
                    {reviewSession.teacherId === "current" ? reviewSession.learner.name : reviewSession.teacher.name}
                  </p>
                  <p className="text-xs text-slate-500">{reviewSession.skill.name} · {reviewSession.date}</p>
                </div>
              </div>
            )}

            {dimensions.map((dim) => (
              <div key={dim.key}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">{dim.label}</label>
                  <StarRating
                    value={form[dim.key] as number}
                    size="md"
                    interactive
                    onChange={(v) => setForm({ ...form, [dim.key]: v })}
                  />
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Written Review</label>
              <textarea
                rows={4}
                placeholder="Share your experience with this swap partner..."
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className="w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-600 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleSubmit}
              disabled={form.overallExperience === 0}
            >
              Submit Review
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

