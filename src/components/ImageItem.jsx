import SelectionWrapper from "./SelectionWrapper";

function ImageItem({ image, onRemove }) {
  return (
    <SelectionWrapper
      defaultSize={{ width: 160, height: 160 }}
      defaultPosition={{ x: image.x || 80, y: image.y || 80 }}
      minWidth={60}
      minHeight={60}
      lockAspectRatio={false}
      onRemove={onRemove}
    >
      <img
        src={image.src}
        alt="uploaded"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
          display: "block",
        }}
      />
    </SelectionWrapper>
  );
}

export default ImageItem;