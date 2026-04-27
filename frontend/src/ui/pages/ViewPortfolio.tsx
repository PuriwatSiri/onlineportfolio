import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaStar,
  FaHeart,
  FaCheckCircle,
  FaLightbulb,
  FaMusic,
  FaCamera,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
} from "react-icons/fa";

const ICONS = {
  star: FaStar,
  heart: FaHeart,
  check: FaCheckCircle,
  lightbulb: FaLightbulb,
  music: FaMusic,
  camera: FaCamera,
  envelope: FaEnvelope,
  phone: FaPhone,
  location: FaMapMarkerAlt,
  graduation: FaGraduationCap,
  briefcase: FaBriefcase,
};

const fontStyles = `
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;300;400;500;600;700;800;900&family=Prompt:wght@100;200;300;400;500;600;700;800;900&family=Sarabun:wght@100;200;300;400;500;600;700;800&family=Noto+Sans+Thai:wght@100;200;300;400;500;600;700;800;900&family=Bai+Jamjuree:wght@200;300;400;500;600;700&family=Chakra+Petch:wght@300;400;500;600;700&family=Mitr:wght@200;300;400;500;600;700&family=Athiti:wght@200;300;400;500;600;700&family=Roboto:wght@100;300;400;500;700;900&family=Open+Sans:wght@300;400;600;700;800&family=Lato:wght@100;300;400;700;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Merriweather:wght@300;400;700;900&family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Ubuntu:wght@300;400;500;700&family=Nunito:wght@200;300;400;500;600;700;800;900&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
`;

export default function ViewPortfolio() {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [error, setError] = useState("");
  const [pages, setPages] = useState<any[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const canvasSize = { width: 595, height: 842 };
  const zoomScale = 0.6;

  useEffect(() => {
    fetch(`https://onlineportfolio-4i6c.onrender.com/api/portfolios/view/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Portfolio is set to private");
        return res.json();
      })
      .then((data) => {
        setPortfolio(data);
        if (data.pages && data.pages.length > 0) {
          setPages(data.pages);
        } else if (data.elements) {
          setPages(
            Array.isArray(data.elements[0]) ? data.elements : [data.elements],
          );
        }
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const renderShape = (el: any) => {
    if (!el || !el.style) return null;
    const s = el.style;

    const type = String(el.type || "").toLowerCase();

    const common: React.CSSProperties = {
      width: "100%",
      height: "100%",
      backgroundColor: s.backgroundColor,
      borderWidth: s.borderWidth,
      borderColor: s.borderColor,
      borderStyle: "solid",
      borderRadius: s.borderRadius || 0,
      opacity: s.opacity !== undefined ? s.opacity : 1,
      boxShadow: s.boxShadow,
      boxSizing: "border-box" as const,
    };

    if (type === "rect") return <div style={common} />;
    if (type === "circle")
      return <div style={{ ...common, borderRadius: "50%" }} />;

    if (type === "line")
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: s.backgroundColor,
            opacity: s.opacity ?? 1,
          }}
        />
      );

    if (type === "divider") {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            borderTop: `${s.borderWidth || 2}px ${el.content || "solid"} ${s.borderColor || "#d1d5db"}`,
            opacity: s.opacity ?? 1,
          }}
        />
      );
    }

    if (type === "image") {
      return (
        <img
          src={el.content}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: s.borderRadius || 0,
            opacity: s.opacity ?? 1,
            boxShadow: s.boxShadow,
          }}
        />
      );
    }

    if (type === "icon") {
      const IconComponent = el.iconName
        ? ICONS[el.iconName as keyof typeof ICONS]
        : null;
      if (!IconComponent) return null;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: s.color,
            opacity: s.opacity ?? 1,
          }}
        >
          <IconComponent style={{ fontSize: s.fontSize || 32 }} />
        </div>
      );
    }

    if (type === "triangle") {
      const bw = s.borderWidth || 0;
      const bc = s.borderColor || "#000";
      const fc = s.backgroundColor || "#10b981";
      if (bw > 0) {
        return (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              opacity: s.opacity ?? 1,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 0,
                height: 0,
                borderLeft: `${s.width / 2 + bw}px solid transparent`,
                borderRight: `${s.width / 2 + bw}px solid transparent`,
                borderBottom: `${s.height + bw}px solid ${bc}`,
                top: `-${bw}px`,
                left: `-${bw}px`,
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 0,
                height: 0,
                borderLeft: `${s.width / 2}px solid transparent`,
                borderRight: `${s.width / 2}px solid transparent`,
                borderBottom: `${s.height}px solid ${fc}`,
                top: "0px",
                left: "0px",
              }}
            />
          </div>
        );
      }
      return (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${s.width / 2}px solid transparent`,
            borderRight: `${s.width / 2}px solid transparent`,
            borderBottom: `${s.height}px solid ${fc}`,
            opacity: s.opacity ?? 1,
          }}
        />
      );
    }

    if (type === "text") {
      return (
        <div
          style={{
            ...common,
            display: "flex",
            alignItems: "center",
            justifyContent:
              s.textAlign === "center"
                ? "center"
                : s.textAlign === "right"
                  ? "flex-end"
                  : "flex-start",
            padding: 5,
            background: "transparent",
          }}
        >
          <div
            style={{
              fontSize: s.fontSize,
              fontFamily: s.fontFamily,
              color: s.color,
              fontWeight: s.fontWeight,
              fontStyle: s.fontStyle,
              textDecoration: s.textDecoration,
              letterSpacing: s.letterSpacing
                ? `${s.letterSpacing}px`
                : "normal",
              lineHeight: s.lineHeight || 1.2,
              opacity: s.opacity ?? 1,
            }}
          >
            {el.content}
          </div>
        </div>
      );
    }

    return <div style={common} />;
  };

  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500 text-2xl font-bold">
        {error}
      </div>
    );
  if (!portfolio)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const currentElements = pages[currentPageIndex] || [];
  const currentCanvasBg =
    portfolio.page_backgrounds?.[currentPageIndex] ||
    portfolio.backgroundColor ||
    "#ffffff";

  return (
    <div className="min-h-screen bg-gray-200 py-10 flex flex-col items-center gap-8 overflow-auto">
      <style>{fontStyles}</style>
      <h1 className="text-3xl font-bold text-gray-800 bg-white px-6 py-2 rounded-full shadow-sm">
        {portfolio.title}
      </h1>

      <div
        className="shadow-2xl bg-white relative overflow-hidden flex-none border border-gray-300"
        style={{
          width: canvasSize.width * zoomScale,
          height: canvasSize.height * zoomScale,
        }}
      >
        <div
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            backgroundColor: currentCanvasBg,
            position: "relative",
            transform: `scale(${zoomScale})`,
            transformOrigin: "top left",
          }}
        >
          {Array.isArray(currentElements) &&
            currentElements.map((el: any) => (
              <div
                key={el.id}
                style={{
                  position: "absolute",
                  left:
                    typeof el.style.x === "number"
                      ? `${el.style.x}px`
                      : el.style.x,
                  top:
                    typeof el.style.y === "number"
                      ? `${el.style.y}px`
                      : el.style.y,
                  width:
                    typeof el.style.width === "number"
                      ? `${el.style.width}px`
                      : el.style.width,
                  height:
                    typeof el.style.height === "number"
                      ? `${el.style.height}px`
                      : el.style.height,
                  transform: `rotate(${el.style.rotation || 0}deg)`,
                  zIndex: el.style.zIndex || 1,
                }}
              >
                {renderShape(el)}
              </div>
            ))}
        </div>
      </div>

      {pages.length > 1 && (
        <div className="flex justify-center items-center gap-4 p-2 bg-white rounded-xl shadow-lg border border-gray-200">
          <button
            className="btn btn-sm btn-circle btn-ghost"
            disabled={currentPageIndex === 0}
            onClick={() => setCurrentPageIndex((p) => p - 1)}
          >
            ❮
          </button>
          <span className="text-sm font-bold text-gray-700">
            Page {currentPageIndex + 1} / {pages.length}
          </span>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            disabled={currentPageIndex === pages.length - 1}
            onClick={() => setCurrentPageIndex((p) => p + 1)}
          >
            ❯
          </button>
        </div>
      )}
    </div>
  );
}
