export default function LoadingSplash() {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <object 
          data="/Clarc-letters-light-anitmated-again.svg" 
          type="image/svg+xml"
          width="400"
          height="200"
        />
      </div>

      <style jsx>{`
        .splash-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #F5F3EF 0%, #EBE8E1 100%);
          z-index: 9999;
        }

        .splash-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        object {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}