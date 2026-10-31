// Campo: etiqueta + control (children) + mensaje de error junto al campo
export default function Campo({ id, etiqueta, error, children }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{etiqueta}</label>
      {children}
      {error && (
        <div className="invalid-feedback" id={`${id}-error`}>
          {error}
        </div>
      )}
    </div>
  );
}