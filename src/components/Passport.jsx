import { useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import StampItem from "./StampItem";
import StickyNote from "./StickyNote";
import TextBox from "./TextBox";
import ImageItem from "./ImageItem";
import bookletOpen from "../assets/cover/booklet-open.png";

const TOTAL_SPREADS = 3;

function BookletCanvas({
  spreadIndex, stamps = [], notes = [], textboxes = [],
  stickers = [], images = [],
  onRemoveStamp, onRemoveNote, onNoteTextChange,
  onRemoveTextbox, onTextboxTextChange,
  onRemoveSticker, onRemoveImage,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `spread-${spreadIndex}`,
    data: { spreadIndex },
  });

  return (
    <div ref={setNodeRef} className={`booklet-canvas ${isOver ? "booklet-canvas-over" : ""}`}>
      {stamps.map((stamp) => (
        <StampItem key={stamp.instanceId} stamp={stamp} onRemove={() => onRemoveStamp(stamp.instanceId)} />
      ))}
      {stickers.map((sticker) => (
        <StampItem key={sticker.instanceId} stamp={sticker} onRemove={() => onRemoveSticker(sticker.instanceId)} />
      ))}
      {images.map((image) => (
        <ImageItem key={image.id} image={image} onRemove={() => onRemoveImage(image.id)} />
      ))}
      {notes.map((note) => (
        <StickyNote key={note.id} note={note} onRemove={() => onRemoveNote(note.id)} onTextChange={(text) => onNoteTextChange(note.id, text)} />
      ))}
      {textboxes.map((tb) => (
        <TextBox key={tb.id} textbox={tb} onRemove={() => onRemoveTextbox(tb.id)} onTextChange={(text) => onTextboxTextChange(tb.id, text)} />
      ))}
    </div>
  );
}

function Passport({
  pageStamps, pageNotes, pageTextboxes, pageStickers, pageImages,
  onRemoveStamp, onRemoveNote, onNoteTextChange,
  onRemoveTextbox, onTextboxTextChange,
  onRemoveSticker, onRemoveImage,
  onStampDrop,
}) {
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [turningLeft, setTurningLeft] = useState(false);
  const [turningRight, setTurningRight] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (onStampDrop) {
      onStampDrop.current = { spreadIndex };
    }
  }, [spreadIndex]);

  const flipNext = () => {
    if (isAnimating || spreadIndex >= TOTAL_SPREADS - 1) return;
    setIsAnimating(true);
    setTurningRight(true);
    setTimeout(() => setSpreadIndex(i => i + 1), 300);
    setTimeout(() => { setTurningRight(false); setIsAnimating(false); }, 600);
  };

  const flipPrev = () => {
    if (isAnimating || spreadIndex <= 0) return;
    setIsAnimating(true);
    setTurningLeft(true);
    setTimeout(() => setSpreadIndex(i => i - 1), 300);
    setTimeout(() => { setTurningLeft(false); setIsAnimating(false); }, 600);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight") flipNext();
      if (e.key === "ArrowLeft") flipPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [spreadIndex, isAnimating]);

  return (
    <div className="passport-wrapper">
      <div className={`booklet-3d ${turningRight ? "turning-right" : ""} ${turningLeft ? "turning-left" : ""}`}>
        <img src={bookletOpen} alt="" className="booklet-base" />
        <BookletCanvas
          spreadIndex={spreadIndex}
          stamps={pageStamps[spreadIndex] || []}
          notes={pageNotes[spreadIndex] || []}
          textboxes={pageTextboxes[spreadIndex] || []}
          stickers={pageStickers[spreadIndex] || []}
          images={pageImages[spreadIndex] || []}
          onRemoveStamp={(id) => onRemoveStamp(spreadIndex, id)}
          onRemoveNote={(id) => onRemoveNote(spreadIndex, id)}
          onNoteTextChange={(id, text) => onNoteTextChange(spreadIndex, id, text)}
          onRemoveTextbox={(id) => onRemoveTextbox(spreadIndex, id)}
          onTextboxTextChange={(id, text) => onTextboxTextChange(spreadIndex, id, text)}
          onRemoveSticker={(id) => onRemoveSticker(spreadIndex, id)}
          onRemoveImage={(id) => onRemoveImage(spreadIndex, id)}
        />
      </div>

      <div className="passport-nav">
        <span className="passport-nav-hint">←</span>
        <span className="passport-nav-label">{spreadIndex + 1} / {TOTAL_SPREADS}</span>
        <span className="passport-nav-hint">→</span>
      </div>
    </div>
  );
}

export default Passport;