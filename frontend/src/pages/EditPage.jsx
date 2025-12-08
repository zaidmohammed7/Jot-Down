import React, { useMemo, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./EditPage.css";

function EditPage() {
  const [content, setContent] = useState("");

  // Quill modules (toolbar + history)
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "blockquote", "code-block"],
        ["clean"],
      ],
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "script",
    "indent",
    "align",
    "link",
    "blockquote",
    "code-block",
  ];

  return (
    <div className="edit-page">
      <header className="edit-page-header">
        <div className="edit-page-title-group">
          <h1 className="edit-page-title">Edit note</h1>
          <p className="edit-page-subtitle">
            Use the toolbar to format your note. Later we&apos;ll hook this up to
            your backend and save everything.
          </p>
        </div>
      </header>

      <div className="edit-page-body">
        <div className="quill-shell">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Start writing your note..."
          />
        </div>
      </div>
    </div>
  );
}

export default EditPage;
