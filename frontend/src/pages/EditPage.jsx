import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "./MainPage.css";

function EditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { noteId } = useParams();

  // Expecting: { folderName, title, noteId } from MainPage navigate()
  const noteMeta = location.state;

  useEffect(() => {
    if (!noteMeta) {
      // If user goes directly to /edit/:noteId without state, send them home
      navigate("/", { replace: true });
    }
  }, [noteMeta, navigate]);

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
          content: [
            {
              type: "text",
              text:
                "This is placeholder content for your note. " +
                "Later we’ll load and save real content from the backend.",
            },
          ],
      },
    ],
  });

  if (!noteMeta) {
    return null;
  }

  const handleBack = () => navigate(-1);

  const handleSave = async () => {
    const doc = editor.document;
    console.log("Saving note", noteId, doc);
    // TODO: axios.post/put to your backend
  };

  return (
    <div className="edit-page">
      <header className="edit-header">
        <button className="ghost-button" onClick={handleBack}>
          ← Back
        </button>

        <div className="edit-title-stack">
          <div className="editor-breadcrumbs">
            <span>{noteMeta.folderName}</span>
            <span>/</span>
            <span className="editor-breadcrumb-current">
              {noteMeta.title}
            </span>
          </div>
          <div className="muted edit-subtitle">
            Editing note <strong>{noteMeta.title}</strong>
          </div>
        </div>

        <button className="primary-button" onClick={handleSave}>
          Save
        </button>
      </header>

      <main className="edit-main">
        <div className="editor-content edit-content">
          <BlockNoteView editor={editor} />
        </div>
      </main>
    </div>
  );
}

export default EditPage;
