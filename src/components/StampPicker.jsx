import stamps from "../data/stamps";

function StampPicker({ onSelectStamp }) {
  return (
    <>
      {stamps.map((stamp) => (
        <div
          key={stamp.id}
          className="stamp-picker-item"
          onClick={() => onSelectStamp(stamp)}
          title={stamp.label}
        >
          {stamp.file ? (
            <img src={stamp.file} alt={stamp.label} className="stamp-picker-img" />
          ) : (
            <div className="stamp-picker-placeholder">{stamp.label}</div>
          )}
          <span className="stamp-picker-label">{stamp.label}</span>
        </div>
      ))}
    </>
  );
}

export default StampPicker;