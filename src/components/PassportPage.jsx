import StampItem from "./StampItem";
import StickyNote from "./StickyNote";
import pageLeft from "../assets/pages/page-left.png";
import pageRight from "../assets/pages/page-right.png";

function PassportPage({ pageNumber, side, stamps = [], notes = [], onRemoveStamp, onRemoveNote, onNoteTextChange }) {
  const bgImage = side === "left" ? pageLeft : pageRight;

  return (
    <div className={`passport-page passport-page-${side}`}>
      {/* Page background image */}
      <img src={bgImage} alt="" className="passport-page-bg" />

      {/* Canvas for stamps and notes */}
      <div className="passport-page-canvas">
        {stamps.map((stamp) => (
          <StampItem
            key={stamp.instanceId}
            stamp={stamp}
            onRemove={() => onRemoveStamp(stamp.instanceId)}
          />
        ))}
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onRemove={() => onRemoveNote(note.id)}
            onTextChange={(text) => onNoteTextChange(note.id, text)}
          />
        ))}
      </div>

      {/* Page number */}
      <div className="passport-page-number">{pageNumber}</div>
    </div>
  );
}

export default PassportPage;