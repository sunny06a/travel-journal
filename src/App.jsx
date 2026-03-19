import { useRef, useState, useEffect } from "react";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import html2canvas from "html2canvas";
import "./index.css";
import Passport from "./components/Passport";
import Toolbar from "./components/Toolbar";
import usePassportState from "./hooks/usePassportState";
import stamps from "./data/stamps";
import stickers from "./data/stickers";
import clearAllBtn from "./assets/clear-all-btn.png";
import downloadBtn from "./assets/download-btn.png";

function App() {
  const stampDropRef = useRef(null);
  const bookletRef = useRef(null);
  const [activeItem, setActiveItem] = useState(null);
  const [deskBg, setDeskBg] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

const {
  pageStamps, pageNotes, pageTextboxes, pageStickers, pageImages,
  addStampToPage, removeStampFromPage,
  addStickerToPage, removeStickerFromPage,
  addNoteToPage, removeNoteFromPage, updateNoteText,
  addTextboxToPage, removeTextboxFromPage, updateTextboxText,
  addImageToPage, removeImageFromPage,
  clearAll,
} = usePassportState();

const handleAddImage = (src) => {
  addImageToPage(getCurrentSpread(), src);
};

  const setBookletRef = (node) => {
    if (node) bookletRef.current = node;
  };

  const getCurrentSpread = () => {
    return stampDropRef.current?.spreadIndex ?? 0;
  };

  // Click handlers — land at center
  const handleSelectStamp = (stamp) => {
    addStampToPage(getCurrentSpread(), stamp);
  };

  const handleSelectSticker = (sticker) => {
    addStickerToPage(getCurrentSpread(), sticker);
  };

  const handleAddNote = () => {
    addNoteToPage(getCurrentSpread());
  };

  const handleAddText = () => {
    addTextboxToPage(getCurrentSpread());
  };

  const handleSelectBackground = (file) => {
    setDeskBg(file);
  };

  // Drag handlers — land where dropped
  const handleDragStart = (event) => {
    const { active } = event;
    const stamp = stamps.find(s => `stamp-${s.id}` === active.id);
    const sticker = stickers.find(s => `sticker-${s.id}` === active.id);
    setActiveItem(stamp || sticker || null);
  };

  const handleDragEnd = (event) => {
    setActiveItem(null);
    const { over, active } = event;
    if (!over) return;

    const spreadIndex = over.data?.current?.spreadIndex;
    if (spreadIndex === undefined) return;

    const stamp = active.data?.current?.stamp;
    const sticker = active.data?.current?.sticker;

    const canvasEl = document.querySelector(".booklet-canvas");
    if (!canvasEl) return;

    const canvasRect = canvasEl.getBoundingClientRect();
    const draggedRect = active.rect.current.translated;
    if (!draggedRect) return;

    const x = Math.max(0, Math.min(
      draggedRect.left - canvasRect.left,
      canvasRect.width - 120
    ));
    const y = Math.max(0, Math.min(
      draggedRect.top - canvasRect.top,
      canvasRect.height - 120
    ));

    if (stamp) addStampToPage(spreadIndex, stamp, x, y);
    if (sticker) addStickerToPage(spreadIndex, sticker, x, y);
  };

  const handleDownload = async () => {
    const target = document.querySelector(".canvas-area");
    if (!target || isDownloading) return;
    setIsDownloading(true);

    try {
      const controls = document.querySelectorAll(
        ".selection-controls-top, .selection-rotate-handle"
      );
      controls.forEach(el => el.style.visibility = "hidden");
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(target, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scale: 2,
        onclone: (clonedDoc) => {
          const booklet = clonedDoc.querySelector(".booklet-3d");
          if (booklet) booklet.style.transform = "none";
        },
      });

      controls.forEach(el => el.style.visibility = "");

      const link = document.createElement("a");
      link.download = "my-journal.png";
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error("Download failed:", err);
      alert(`Download failed: ${err.message}`);
    } finally {
      setIsDownloading(false);
      document.querySelectorAll(
        ".selection-controls-top, .selection-rotate-handle"
      ).forEach(el => el.style.visibility = "");
    }
  };

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="sidebar">
        <Toolbar
          onSelectStamp={handleSelectStamp}
          onSelectSticker={handleSelectSticker}
          onAddNote={handleAddNote}
          onAddText={handleAddText}
          onSelectBackground={handleSelectBackground}
          onAddImage={handleAddImage}
        />
        <div className="sidebar-actions">
          <img
            src={clearAllBtn}
            alt="Clear All"
            className="action-btn-img"
            onClick={clearAll}
          />
          <img
            src={downloadBtn}
            alt="Download"
            className={`action-btn-img ${isDownloading ? "action-btn-loading" : ""}`}
            onClick={handleDownload}
          />
        </div>
      </div>

      <div
        className="canvas-area"
        style={deskBg ? { backgroundImage: `url(${deskBg})` } : {}}
      >
        <div className="mat-container">
          <div className="mat-inner">
            <div ref={setBookletRef} id="booklet-capture">
              <Passport
                pageStamps={pageStamps}
                pageNotes={pageNotes}
                pageTextboxes={pageTextboxes}
                pageStickers={pageStickers}
                pageImages={pageImages}
                onRemoveStamp={removeStampFromPage}
                onRemoveNote={removeNoteFromPage}
                onNoteTextChange={updateNoteText}
                onRemoveTextbox={removeTextboxFromPage}
                onTextboxTextChange={updateTextboxText}
                onRemoveSticker={removeStickerFromPage}
                onRemoveImage={removeImageFromPage}
                onStampDrop={stampDropRef}
              />
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="stamp-drag-overlay">
            {activeItem.file ? (
              <img src={activeItem.file} alt={activeItem.label || ""} />
            ) : (
              <div className="tb-item-placeholder">{activeItem.label}</div>
            )}
          </div>
        ) : null}
      </DragOverlay>

    </DndContext>
  );
}

export default App;