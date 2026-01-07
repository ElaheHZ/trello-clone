"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./InlineEdit.module.scss";

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
  as?: "h2" | "h3" | "span";
  maxLength?: number;
}

export default function InlineEdit({
  value,
  onSave,
  placeholder = "Untitled",
  className = "",
  as: Component = "span",
  maxLength = 100,
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedValue = editValue.trim() || placeholder;
    if (trimmedValue !== value) {
      onSave(trimmedValue);
    }
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        className={`${styles.inlineEditInput} ${className}`}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        maxLength={maxLength}
      />
    );
  }

  return (
    <Component
      className={`${styles.inlineEditText} ${className}`}
      onClick={() => setIsEditing(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsEditing(true);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {value || placeholder}
    </Component>
  );
}
