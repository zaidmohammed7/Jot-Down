import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./EditPage.css";
import { useNavigate } from "react-router-dom";

// How often to autosave after the user stops typing (ms)
const AUTOSAVE_MS = 2000;
// edit for commit
// NOTE: When backend is wired up, you can pass noteId via router params or props.
async function saveNoteDraft(content) {
  // TODO: Replace this with a real API call to persist the note.
  // Example:
  //   await api.updateNote(noteId, { body: content });
  //
  // For now this just logs so you can see when autosave would happen.
  console.log("[AutoSave] Draft would be saved with length:", content.length);
}

const modules = {
  toolbar: [
    // Header levels
    [{ header: [1, 2, 3, false] }],
    // Font family (we'll style 'serif' as Times New Roman in CSS)
    [{ font: [] }],
    // Inline styles
    ["bold", "italic", "underline", "strike"],
    // Colors
    [{ color: [] }, { background: [] }],
    // Lists
    [{ list: "ordered" }, { list: "bullet" }],
    // Alignment
    [{ align: [] }],
    // Blocks
    ["blockquote", "code-block"],
    // Links
    ["link"],
  ],
};

const formats = [
  "header",
  "font",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "align",
  "link",
  "color",
  "background",
];

function EditPage() {
  const navigate = useNavigate();

  // TODO: query DB for actual path + name for this noteId
  const [notePath] = useState("Course / Topic / ");
  const [noteName, setNoteName] = useState("Untitled note");

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameDraft, setRenameDraft] = useState(noteName);

  const [value, setValue] = useState("");

  const startRename = () => {
    setRenameDraft(noteName);
    setIsRenaming(true);
  };

  const commitRename = () => {
    const trimmed = renameDraft.trim();
    if (trimmed) setNoteName(trimmed);
    setIsRenaming(false);
  };

  const cancelRename = () => {
    setIsRenaming(false);
    setRenameDraft(noteName);
  };

  // Simple autosave: debounce on content changes
  useEffect(() => {
    // Skip autosave on first empty mount
    if (value === undefined) return;

    const timeoutId = setTimeout(() => {
      // In the future, pass noteId here as well
      saveNoteDraft(value);
    }, AUTOSAVE_MS);

    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <div className="edit-page">
      {/* FIXED TOP BAR: path + name */}
      <div className="edit-toolbar">
        <div className="edit-toolbar-path-row">
          <button
            type="button"
            className="edit-back-button"
            onClick={() => navigate("/Notes")}
          >
            ← Back
          </button>
          <span className="edit-toolbar-path-text">
            {notePath}
            {isRenaming ? (
              <input
                className="edit-toolbar-rename-input"
                value={renameDraft}
                autoFocus
                onChange={(e) => setRenameDraft(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitRename();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    cancelRename();
                  }
                }}
              />
            ) : (
              <span
                className="edit-toolbar-note-name"
                onClick={startRename}
                title="Click to rename note"
              >
                {noteName}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* MAIN EDITOR AREA */}
      <section className="edit-page-body">
        <div className="quill-shell">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            modules={modules}
            formats={formats}
          />
        </div>
      </section>
    </div>
  );
}

export default EditPage;
