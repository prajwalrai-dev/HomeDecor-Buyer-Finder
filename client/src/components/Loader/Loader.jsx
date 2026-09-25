const Loader = ({ label = "Loading..." }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 40, gap: 10 }}>
      <div
        style={{
          width: 34,
          height: 34,
          border: "3px solid #e6dcd2",
          borderTopColor: "#a9683d",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ color: "#7d6e64", fontSize: 13 }}>{label}</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
