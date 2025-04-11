export function Loader({
  transparent = false,
  color = "#FFF",
}: {
  transparent?: boolean;
  color?: string;
}) {
  return (
    <div
      className={`flex justify-center items-center h-screen w-screen bg-gray-800 ${transparent ? "bg-transparent" : ""}`}
    >
      <div className="loader" />
      <style>{`        
        .loader {
          width: 48px;
          height: 48px;
          border: 5px solid ${color};
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          position: relative;
          animation: pulse 1s linear infinite;
        }
        .loader:after {
          content: '';
          position: absolute;
          width: 48px;
          height: 48px;
          border: 5px solid ${color};
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          animation: scaleUp 1s linear infinite;
        }

        @keyframes scaleUp {
          0% { transform: translate(-50%, -50%) scale(0) }
          60% , 100% { transform: translate(-50%, -50%)  scale(1)}
        }
        @keyframes pulse {
          0% , 60% , 100%{ transform:  scale(1) }
          80% { transform:  scale(1.2)}
        }
      `}</style>
    </div>
  );
}
