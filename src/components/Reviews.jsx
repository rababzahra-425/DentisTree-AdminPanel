import React, { useEffect, useState } from "react";
import {FaTrash, FaEye} from "react-icons/fa";
import "./Reviews.css";
import { API_BASE } from "../api";

const API = API_BASE;

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  // ─── Fetch reviews ───────────────────────────────────────────────────
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API}/reviews/`);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      setReviews(arr);
      setFiltered(arr);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ─── Filter by rating ────────────────────────────────────────────────
  useEffect(() => {
    if (filterRating === "all") {
      setFiltered(reviews);
    } else {
      setFiltered(reviews.filter((r) => r.rating === parseInt(filterRating)));
    }
  }, [filterRating, reviews]);

  // ─── Delete review ───────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/reviews/delete/${id}/`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchReviews();
        setDeleteConfirm(null);
      } else {
        alert("Failed to delete review.");
      }
    } catch (err) {
      alert("Network error — could not delete.");
    }
  };

  // ─── Star renderer ───────────────────────────────────────────────────
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "star filled" : "star empty"}>
        ★
      </span>
    ));
  };

//   const toggleExpand = (id) => {
//   setExpanded(prev => ({
//     ...prev,
//     [id]: !prev[id]
//   }));
// };

  // ─── Rating counts for summary bar ──────────────────────────────────
  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rv) => rv.rating === r).length,
  }));

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "—";

  return (
    <div className="rv-container">

      {/* ── Header ── */}
      <div className="rv-header">
        <h2>Customer Reviews</h2>
        <span className="rv-total">{reviews.length} total reviews</span>
      </div>

      {/* ── Summary Bar ── */}
      {reviews.length > 0 && (
        <div className="rv-summary">
          <div className="rv-avg-block">
            <span className="rv-avg-number">{avgRating}</span>
            <div className="rv-avg-stars">{renderStars(Math.round(avgRating))}</div>
            <span className="rv-avg-label">Average Rating</span>
          </div>
          <div className="rv-breakdown">
            {ratingCounts.map(({ rating, count }) => (
              <div className="rv-bar-row" key={rating}>
                <span className="rv-bar-label">{rating} ★</span>
                <div className="rv-bar-track">
                  <div
                    className="rv-bar-fill"
                    style={{
                      width: reviews.length
                        ? `${(count / reviews.length) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
                <span className="rv-bar-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Filter Tabs ── */}
      <div className="rv-filters">
        {["all", "5", "4", "3", "2", "1"].map((val) => (
          <button
            key={val}
            className={`rv-filter-btn ${filterRating === val ? "active" : ""}`}
            onClick={() => setFilterRating(val)}
          >
            {val === "all" ? "All" : `${val} ★`}
          </button>
        ))}
      </div>

      {/* ── Reviews List ── */}
      {loading ? (
        <div className="rv-loading">Loading reviews...</div>
      ) : filtered.length === 0 ? (
        <div className="rv-empty">
          {filterRating === "all"
            ? "No reviews yet."
            : `No ${filterRating}-star reviews found.`}
        </div>
      ) : (
        <div className="rv-list">
          {filtered.map((review) => (
            <div className="rv-card" key={review.id}>
              <div className="rv-card-top">
                {/* Avatar */}
                <div className="rv-avatar">
                  {review.customer_name
                    ? review.customer_name.charAt(0).toUpperCase()
                    : "?"}
                </div>

                {/* Name + meta */}
                {/* <div className="rv-meta">
                  <span className="rv-name">
                    {review.customer_name || "Anonymous"}
                  </span>
                  <div className="rv-stars">{renderStars(review.rating)}</div>
                </div> */}

                <div className="rv-meta">
                  <div className="rv-name-row">
                  <span className="rv-name">
                    {review.customer_name || "Anonymous"}
                    </span>
                    <div className="rv-stars">{renderStars(review.rating)}</div>


    
  </div>
</div>

                {/* Date + delete */}
                <div className="rv-card-right">
                  <span className="rv-date">{review.created_at}</span>
                  <div className="rv-actions">
  <FaEye 
    className="rv-icon view"
    onClick={() => setSelectedReview(review)}
  />
  <FaTrash 
    className="rv-icon delete"
    onClick={() => setDeleteConfirm(review.id)}
  />
</div>
                </div>
              </div>

              {/* Comment */}
              {/* {review.comment && (
                <p className="rv-comment">"{review.comment}"</p>
              )} */}
              {review.comment && (
  <div className="rv-comment-box">
    <p className="rv-comment">
      "{review.comment}"
    </p>
  </div>
)}
            </div>
          ))}
          {selectedReview && (
  <>
    <div 
      className="rv-overlay"
      onClick={() => setSelectedReview(null)}
    />

    <div className="rv-view-modal">
      <h3>{selectedReview.customer_name}</h3>
      <div className="rv-stars">
        {renderStars(selectedReview.rating)}
      </div>
      <p className="rv-full-text">
        "{selectedReview.comment}"
      </p>

      <button 
        className="rv-close-btn"
        onClick={() => setSelectedReview(null)}
      >
        Close
      </button>
    </div>
  </>
)}
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <>
          <div
            className="rv-overlay"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="rv-confirm-modal">
            <h3>Delete this review?</h3>
            <p>This cannot be undone.</p>
            <div className="rv-confirm-actions">
              <button
                className="rv-confirm-delete"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Yes, Delete
              </button>
              <button
                className="rv-confirm-cancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Reviews;
