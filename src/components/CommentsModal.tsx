"use client";

import React, { useState } from "react";
import styles from "./CommentsModal.module.scss";
import { formatDate } from "../lib/utils";
import { useBoard, useBoardActions } from "../presentation/hooks/useBoard";
import { findCard } from "../presentation/selectors/boardSelectors";

export default function CommentsModal() {
  const { status, board, selectedCardId } = useBoard();
  const actions = useBoardActions();
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("Anonymous");

  if (status !== "ready" || !board || !selectedCardId) return null;
  const card = findCard(board, selectedCardId);
  if (!card) return null;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    actions.addComment(card.id, newComment.trim(), authorName.trim() || "Anonymous");
    setNewComment("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) handleAddComment();
  };

  return (
    <>
      <div className={styles.modalOverlay} onClick={actions.closeCardComments} />
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{card.title}</h2>
          <button
            className={styles.closeButton}
            onClick={actions.closeCardComments}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.commentsSection}>
            <h3 className={styles.sectionTitle}>
              Comments ({card.comments.length})
            </h3>

            <div className={styles.commentsList}>
              {card.comments.length === 0 ? (
                <p className={styles.emptyState}>
                  No comments yet. Add one to get started!
                </p>
              ) : (
                card.comments.map((comment) => (
                  <div key={comment.id} className={styles.commentItem}>
                    <div className={styles.commentHeader}>
                      <strong className={styles.commentAuthor}>
                        {comment.author}
                      </strong>
                      <span className={styles.commentTime}>
                        {formatDate(comment.createdAtMs)}
                      </span>
                    </div>
                    <p className={styles.commentText}>{comment.text}</p>
                    <button
                      className={styles.deleteCommentBtn}
                      onClick={() => actions.deleteComment(card.id, comment.id)}
                      aria-label="Delete comment"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.addCommentSection}>
            <div className={styles.formGroup}>
              <label htmlFor="author" className={styles.label}>
                Name
              </label>
              <input
                id="author"
                type="text"
                className={styles.authorInput}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="comment" className={styles.label}>
                Comment
              </label>
              <textarea
                id="comment"
                className={styles.commentInput}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a comment... (Ctrl+Enter to submit)"
                rows={3}
              />
            </div>

            <button
              className={styles.submitButton}
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
