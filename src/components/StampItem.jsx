import SelectionWrapper from "./SelectionWrapper";

function StampItem({ stamp, onRemove, onDuplicate }) {
  return (
    <SelectionWrapper
      defaultSize={{ width: 120, height: 120 }}
      defaultPosition={{ x: stamp.x || 80, y: stamp.y || 80 }}
      minWidth={60}
      minHeight={60}
      lockAspectRatio={true}
      onRemove={onRemove}
      onDuplicate={onDuplicate}
    >
      {stamp.file ? (
        <img src={stamp.file} alt={stamp.label} className="stamp-item-img" />
      ) : (
        <div className="stamp-item-placeholder">{stamp.label}</div>
      )}
    </SelectionWrapper>
  );
}

export default StampItem;