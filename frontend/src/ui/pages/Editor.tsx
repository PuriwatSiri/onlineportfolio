// src/ui/pages/Editor.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { SketchPicker } from "react-color";
import { v4 as uuidv4 } from "uuid";
import {
  FaSave,
  FaArrowLeft,
  FaFilePdf,
  FaTrash,
  FaPlus,
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
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaUnderline,
  FaCopy,
  FaLayerGroup,
} from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  createPortfolioAsync,
  updatePortfolioAsync,
} from "@/store/slices/portfoliosSlice";
import { fetchTemplates } from "@/store/slices/templatesSlice";

// --- Extended Fonts Import ---
const fontStyles = `
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;300;400;500;600;700;800;900&family=Prompt:wght@100;200;300;400;500;600;700;800;900&family=Sarabun:wght@100;200;300;400;500;600;700;800&family=Noto+Sans+Thai:wght@100;200;300;400;500;600;700;800;900&family=Bai+Jamjuree:wght@200;300;400;500;600;700&family=Chakra+Petch:wght@300;400;500;600;700&family=Mitr:wght@200;300;400;500;600;700&family=Athiti:wght@200;300;400;500;600;700&family=Roboto:wght@100;300;400;500;700;900&family=Open+Sans:wght@300;400;600;700;800&family=Lato:wght@100;300;400;700;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Merriweather:wght@300;400;700;900&family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Ubuntu:wght@300;400;500;700&family=Nunito:wght@200;300;400;500;600;700;800;900&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
`;

// --- Types ---
type ElementType =
  | "text"
  | "image"
  | "rect"
  | "circle"
  | "triangle"
  | "line"
  | "icon"
  | "divider";

interface ElemStyle {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: "normal" | "italic" | string;
  textDecoration?: "none" | "underline" | string;
  textAlign?: "left" | "center" | "right" | string;
  zIndex?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  opacity?: number;
  boxShadow?: string;
  letterSpacing?: number;
  lineHeight?: number;
}

interface CanvasElement {
  id: string;
  type: ElementType;
  content?: string;
  iconName?: string;
  style: ElemStyle;
}

// Icon Library
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

// Font Families
const FONT_FAMILIES = [
  { label: "Kanit (Thai)", value: "Kanit, sans-serif" },
  { label: "Prompt (Thai)", value: "Prompt, sans-serif" },
  { label: "Sarabun (Thai)", value: "Sarabun, sans-serif" },
  { label: "Noto Sans Thai", value: "Noto Sans Thai, sans-serif" },
  { label: "Bai Jamjuree", value: "Bai Jamjuree, sans-serif" },
  { label: "Chakra Petch", value: "Chakra Petch, sans-serif" },
  { label: "Mitr", value: "Mitr, sans-serif" },
  { label: "Athiti", value: "Athiti, sans-serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Open Sans", value: "Open Sans, sans-serif" },
  { label: "Lato", value: "Lato, sans-serif" },
  { label: "Montserrat", value: "Montserrat, sans-serif" },
  { label: "Poppins", value: "Poppins, sans-serif" },
  { label: "Playfair Display", value: "Playfair Display, serif" },
  { label: "Merriweather", value: "Merriweather, serif" },
  { label: "Raleway", value: "Raleway, sans-serif" },
  { label: "Ubuntu", value: "Ubuntu, sans-serif" },
  { label: "Nunito", value: "Nunito, sans-serif" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
];

const getNewPageElements = (): CanvasElement[] => [
  {
    id: uuidv4(),
    type: "text",
    content: "Report Title / Portfolio",
    style: {
      x: 40,
      y: 50,
      width: 515,
      height: 60,
      fontSize: 36,
      fontWeight: "bold",
      color: "#111827",
      zIndex: 1,
      textAlign: "left",
      fontFamily: "Kanit, sans-serif",
    },
  },
  {
    id: uuidv4(),
    type: "text",
    content: "Brief description of report/portfolio",
    style: {
      x: 40,
      y: 120,
      width: 515,
      height: 70,
      fontSize: 16,
      color: "#4b5563",
      zIndex: 2,
      textAlign: "left",
      fontFamily: "Sarabun, sans-serif",
    },
  },
];

const Editor: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const portfolioId = searchParams.get("id");
  const templateId = searchParams.get("template");

  const allTemplates = useAppSelector((s) => s.templates.items);
  // const user = useAppSelector((s) => s.auth.user); // Unused

  // State
  const [pages, setPages] = useState<CanvasElement[][]>([getNewPageElements()]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const elements = pages[currentPageIndex] || [];

  const [templateName, setTemplateName] = useState("Untitled Portfolio");
  const [templateActive, setTemplateActive] = useState(true);
  const [lastEdit, setLastEdit] = useState(new Date());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // UI State
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showBorderPicker, setShowBorderPicker] = useState(false);
  const [showShadowPicker, setShowShadowPicker] = useState(false);
  const [pageBackgrounds, setPageBackgrounds] = useState<string[]>(["#ffffff"]);
  const currentCanvasBg = pageBackgrounds[currentPageIndex] || "#ffffff";
  const [showCanvasBgPicker, setShowCanvasBgPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<"design" | "elements" | "text">(
    "design",
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);

  const canvasSize = { width: 595, height: 842 };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = fontStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      setIsLoading(true);
      try {
        if (portfolioId) {
          const res = await fetch(
            `https://onlineportfolio-4i6c.onrender.com/api/portfolios/${portfolioId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (res.ok) {
            const data = await res.json();
            setTemplateName(data.title);
            setTemplateActive(data.is_public);
            if (data.pages && data.pages.length > 0) {
              setPages(data.pages);
              if (data.page_backgrounds && data.page_backgrounds.length > 0) {
                setPageBackgrounds(data.page_backgrounds);
              } else {
                setPageBackgrounds(
                  new Array(data.pages.length).fill(
                    data.backgroundColor || "#ffffff",
                  ),
                );
              }
            } else if (data.elements) {
              const isMulti = Array.isArray(data.elements[0]);
              setPages(isMulti ? data.elements : [data.elements]);
              setPageBackgrounds([data.backgroundColor || "#ffffff"]);
            }
          }
        } else if (templateId) {
          const res = await fetch(
            `https://onlineportfolio-4i6c.onrender.com/api/admin/templates/${templateId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (res.ok) {
            const template = await res.json();
            setTemplateName(template.name);
            if (template.pages && template.pages.length > 0) {
              setPages(template.pages);
              if (
                template.page_backgrounds &&
                template.page_backgrounds.length > 0
              ) {
                setPageBackgrounds(template.page_backgrounds);
              } else {
                const tplColor = template.backgroundColor || "#ffffff";
                setPageBackgrounds(
                  new Array(template.pages.length).fill(tplColor),
                );
              }
            } else if (template.elements && template.elements.length > 0) {
              setPages([template.elements]);
              setPageBackgrounds([template.backgroundColor || "#ffffff"]);
            }
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [portfolioId, templateId]);

  const normalizeZIndex = (els: CanvasElement[]) =>
    els.map((el, i) => ({
      ...el,
      style: { ...el.style, zIndex: i + 1 },
    }));

  const updateCurrentPage = useCallback(
    (updatedElements: CanvasElement[]) => {
      setPages((prev) => {
        const newPages = [...prev];
        newPages[currentPageIndex] = updatedElements;
        return newPages;
      });
      setLastEdit(new Date());
    },
    [currentPageIndex],
  );

  const updateElement = useCallback(
    (id: string, patch: Partial<CanvasElement>) => {
      const currentElements = pages[currentPageIndex];
      const updatedElements = currentElements.map((el) =>
        el.id === id
          ? { ...el, ...patch, style: { ...el.style, ...patch.style } }
          : el,
      );
      updateCurrentPage(updatedElements);
    },
    [pages, currentPageIndex, updateCurrentPage],
  );

  const updateCurrentPageBg = (newColor: string) => {
    setPageBackgrounds((prev) => {
      const newBgs = [...prev];
      newBgs[currentPageIndex] = newColor;
      return newBgs;
    });
  };

  // Add Elements
  const addText = () => {
    const el: CanvasElement = {
      id: uuidv4(),
      type: "text",
      content: "New text",
      style: {
        x: 50,
        y: 50,
        width: 200,
        height: 40,
        fontSize: 20,
        color: "#000",
        fontFamily: "Kanit, sans-serif",
        zIndex: elements.length + 1,
      },
    };
    updateCurrentPage([...elements, el]);
    setSelectedId(el.id);
  };

  const addHeading = () => {
    const el: CanvasElement = {
      id: uuidv4(),
      type: "text",
      content: "Main Heading",
      style: {
        x: 50,
        y: 50,
        width: 400,
        height: 60,
        fontSize: 48,
        fontWeight: "bold",
        color: "#111827",
        fontFamily: "Montserrat, sans-serif",
        zIndex: elements.length + 1,
      },
    };
    updateCurrentPage([...elements, el]);
    setSelectedId(el.id);
  };

  const addSubheading = () => {
    const el: CanvasElement = {
      id: uuidv4(),
      type: "text",
      content: "Subheading",
      style: {
        x: 50,
        y: 50,
        width: 300,
        height: 40,
        fontSize: 28,
        fontWeight: "600",
        color: "#374151",
        fontFamily: "Poppins, sans-serif",
        zIndex: elements.length + 1,
      },
    };
    updateCurrentPage([...elements, el]);
    setSelectedId(el.id);
  };

  const addBodyText = () => {
    const el: CanvasElement = {
      id: uuidv4(),
      type: "text",
      content: "Content text - Type your content here",
      style: {
        x: 50,
        y: 50,
        width: 450,
        height: 100,
        fontSize: 16,
        color: "#4b5563",
        fontFamily: "Sarabun, sans-serif",
        lineHeight: 1.6,
        zIndex: elements.length + 1,
      },
    };
    updateCurrentPage([...elements, el]);
    setSelectedId(el.id);
  };

  const addRect = () => {
    const el: CanvasElement = {
      id: uuidv4(),
      type: "rect",
      style: {
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        backgroundColor: "#3b82f6",
        borderRadius: 0,
        zIndex: elements.length + 1,
      },
    };
    updateCurrentPage([...elements, el]);
    setSelectedId(el.id);
  };

  const addCircle = () => {
    const el: CanvasElement = {
      id: uuidv4(),
      type: "circle",
      style: {
        x: 60,
        y: 60,
        width: 100,
        height: 100,
        backgroundColor: "#ef4444",
        zIndex: elements.length + 1,
      },
    };
    updateCurrentPage([...elements, el]);
    setSelectedId(el.id);
  };

  const addTriangle = () => {
    const el: CanvasElement = {
      id: uuidv4(),
      type: "triangle",
      style: {
        x: 70,
        y: 70,
        width: 100,
        height: 100,
        backgroundColor: "#10b981",
        zIndex: elements.length + 1,
      },
    };
    updateCurrentPage([...elements, el]);
    setSelectedId(el.id);
  };

  const addLine = () => {
    const el: CanvasElement = {
      id: uuidv4(),
      type: "line",
      style: {
        x: 50,
        y: 150,
        width: 300,
        height: 2,
        backgroundColor: "#000",
        zIndex: elements.length + 1,
      },
    };
    updateCurrentPage([...elements, el]);
    setSelectedId(el.id);
  };

  const addDivider = (type: "solid" | "dashed" | "dotted") => {
    const borderStyle =
      type === "solid" ? "solid" : type === "dashed" ? "dashed" : "dotted";
    const el: CanvasElement = {
      id: uuidv4(),
      type: "divider",
      content: borderStyle,
      style: {
        x: 50,
        y: 150,
        width: 450,
        height: 2,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#d1d5db",
        zIndex: elements.length + 1,
      },
    };
    updateCurrentPage([...elements, el]);
    setSelectedId(el.id);
  };

  const addIcon = (iconName: keyof typeof ICONS) => {
    const el: CanvasElement = {
      id: uuidv4(),
      type: "icon",
      iconName,
      style: {
        x: 50,
        y: 50,
        width: 40,
        height: 40,
        color: "#000",
        fontSize: 32,
        zIndex: elements.length + 1,
      },
    };
    updateCurrentPage([...elements, el]);
    setSelectedId(el.id);
  };

  // --- Updated Image Upload Logic (Cloudinary) ---
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('https://onlineportfolio-4i6c.onrender.com/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      if (data.url) {
        const el: CanvasElement = {
          id: uuidv4(),
          type: "image",
          content: data.url, // URL from Cloudinary
          style: {
            x: 50,
            y: 50,
            width: 200,
            height: 200,
            borderRadius: 0,
            zIndex: elements.length + 1,
          },
        };
        updateCurrentPage([...elements, el]);
        setSelectedId(el.id);
      }
    } catch (e) {
      console.error(e);
      alert('Image upload failed. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const addPage = () => {
    setPages((prev) => [...prev, getNewPageElements()]);
    setPageBackgrounds((prev) => [...prev, "#ffffff"]);
    setCurrentPageIndex(pages.length);
    setSelectedId(null);
  };

  const deletePage = () => {
    if (pages.length <= 1) return alert("Cannot delete the last page");
    if (!confirm("Are you sure you want to delete this page?")) return;
    setPages((prev) => {
      const newPages = [...prev];
      newPages.splice(currentPageIndex, 1);
      return newPages;
    });
    setPageBackgrounds((prev) => {
      const newBgs = [...prev];
      newBgs.splice(currentPageIndex, 1);
      return newBgs;
    });
    if (currentPageIndex >= pages.length - 1) {
      setCurrentPageIndex((prev) => Math.max(0, prev - 1));
    }
    setSelectedId(null);
  };

  const duplicateElement = () => {
    if (!selectedId) return;
    const el = elements.find((e) => e.id === selectedId);
    if (!el) return;
    const duplicated = {
      ...el,
      id: uuidv4(),
      style: {
        ...el.style,
        x: el.style.x + 20,
        y: el.style.y + 20,
        zIndex: elements.length + 1,
      },
    };
    updateCurrentPage([...elements, duplicated]);
    setSelectedId(duplicated.id);
  };

  const applyTemplate = (tplId: string) => {
    const tpl = allTemplates.find((t) => t.id === tplId || t._id === tplId);
    if (!tpl) return;
    let newPagesToAdd: CanvasElement[][] = [];
    let newBgsToAdd: string[] = [];
    if (tpl.pages && tpl.pages.length > 0) {
      newPagesToAdd = tpl.pages.map((page: any) =>
        page.map((e: any) => ({ ...e, id: uuidv4() })),
      );
      const tplBgs = (tpl as any).page_backgrounds || [];
      const mainBg = tpl.backgroundColor || "#ffffff";
      newBgsToAdd = newPagesToAdd.map((_, i) => tplBgs[i] || mainBg);
    } else if (tpl.elements && tpl.elements.length > 0) {
      newPagesToAdd = [tpl.elements.map((e: any) => ({ ...e, id: uuidv4() }))];
      newBgsToAdd = [tpl.backgroundColor || "#ffffff"];
    }
    if (newPagesToAdd.length > 0) {
      setPages((prev) => [...prev, ...newPagesToAdd]);
      setPageBackgrounds((prev) => [...prev, ...newBgsToAdd]);
      alert(
        `✅ Template pages added successfully (${newPagesToAdd.length} pages)`,
      );
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in before saving");

    try {
      setIsLoading(true);
      let thumb = "";

      if (canvasRef.current) {
        setSelectedId(null);
        await new Promise((r) => setTimeout(r, 100));

        const canvas = await html2canvas(canvasRef.current, {
          scale: 0.5,
          useCORS: true,
          backgroundColor: currentCanvasBg,
          logging: false,
        });
        thumb = canvas.toDataURL("image/jpeg", 0.7);
      }

      const payload = {
        title: templateName,
        is_public: templateActive,
        pages: pages,
        page_backgrounds: pageBackgrounds,
        backgroundColor: pageBackgrounds[0] || "#ffffff",
        cover_image: thumb,
        templateId: templateId,
      };

      if (portfolioId) {
        await dispatch(
          updatePortfolioAsync({ id: portfolioId, data: payload }),
        ).unwrap();
      } else {
        const result = await dispatch(createPortfolioAsync(payload)).unwrap();
        const newId = result._id || result.id || (result.data && (result.data._id || result.data.id));
        if (newId) {
          navigate(`/editor?id=${newId}`, { replace: true });
        }
      }

      alert("Saved successfully! ✅");
    } catch (error: any) {
      console.error("Save error:", error);
      alert("Error saving: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!pdfContainerRef.current) return;
    try {
      const pdf = new jsPDF("p", "px", [canvasSize.width, canvasSize.height]);
      const nodes = pdfContainerRef.current.children;
      for (let i = 0; i < nodes.length; i++) {
        const canvas = await html2canvas(nodes[i] as HTMLElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: pageBackgrounds[i] || "#ffffff",
        });
        if (i > 0) pdf.addPage([canvasSize.width, canvasSize.height]);
        pdf.addImage(
          canvas.toDataURL("image/jpeg"),
          "JPEG",
          0,
          0,
          canvasSize.width,
          canvasSize.height,
        );
      }
      pdf.save("portfolio.pdf");
    } catch (e) {
      alert("PDF Error");
    }
  };

  const renderShape = (el: CanvasElement) => {
    if (!el || !el.style) return null;
    const s = el.style;
    const common: any = {
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

    if (el.type === "rect") return <div style={common} />;
    if (el.type === "circle")
      return <div style={{ ...common, borderRadius: "50%" }} />;
    if (el.type === "line")
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: s.backgroundColor,
            opacity: s.opacity !== undefined ? s.opacity : 1,
          }}
        />
      );
    if (el.type === "divider") {
      const borderType = el.content || "solid";
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            borderTop: `${s.borderWidth || 2}px ${borderType} ${s.borderColor || "#d1d5db"}`,
            opacity: s.opacity !== undefined ? s.opacity : 1,
          }}
        />
      );
    }
    if (el.type === "image")
      return (
        <img
          src={el.content}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: s.borderRadius || 0,
            opacity: s.opacity !== undefined ? s.opacity : 1,
            boxShadow: s.boxShadow,
          }}
        />
      );

    if (el.type === "icon") {
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
            opacity: s.opacity !== undefined ? s.opacity : 1,
          }}
        >
          <IconComponent style={{ fontSize: s.fontSize || 32 }} />
        </div>
      );
    }

    if (el.type === "triangle") {
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
              opacity: s.opacity !== undefined ? s.opacity : 1,
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
            opacity: s.opacity !== undefined ? s.opacity : 1,
          }}
        />
      );
    }

    if (el.type === "text")
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
              opacity: s.opacity !== undefined ? s.opacity : 1,
            }}
          >
            {el.content}
          </div>
        </div>
      );
    return null;
  };

  const selectedElement = selectedId
    ? elements.find((e) => e.id === selectedId)
    : null;

  return (
    <div className="flex bg-[#f8f7fa] min-h-screen p-6 gap-6 relative overflow-hidden">
      <style>{fontStyles}</style>

      {/* Left Sidebar */}
      <aside className="w-64 bg-white shadow-lg rounded-2xl p-4 flex flex-col gap-4 h-full overflow-y-auto flex-none">
        {/* Tabs */}
        <div className="flex gap-2 border-b pb-2">
          <button
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${activeTab === "design" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            onClick={() => setActiveTab("design")}
          >
            Design
          </button>
          <button
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${activeTab === "elements" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            onClick={() => setActiveTab("elements")}
          >
            Elements
          </button>
          <button
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${activeTab === "text" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            onClick={() => setActiveTab("text")}
          >
            Text
          </button>
        </div>

        {/* Design Tab */}
        {activeTab === "design" && (
          <div className="flex flex-col gap-4">
            <div className="font-semibold text-sm text-gray-700">Templates</div>
            <div
              className="flex flex-col gap-3 overflow-y-auto"
              style={{ maxHeight: 400 }}
            >
              {allTemplates.filter((t) => t.active === true).length === 0 ? (
                <div className="text-xs text-gray-400 text-center py-4">
                  No templates
                </div>
              ) : (
                allTemplates
                  .filter((t) => t.active === true)
                  .map((t) => (
                    <div
                      key={t.id || t._id}
                      className="group relative cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 transition-all hover:border-blue-400 hover:shadow-md"
                      onClick={() => applyTemplate(t.id || t._id || "")}
                    >
                      <div className="aspect-[3/4] w-full bg-gray-50 flex items-center justify-center">
                        {t.thumbnail ? (
                          <img
                            src={t.thumbnail}
                            alt={t.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-300 text-xs">
                            No Image
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-end">
                        <div className="w-full p-2 bg-white bg-opacity-95 transform translate-y-full group-hover:translate-y-0 transition-transform">
                          <div className="text-xs font-semibold text-gray-800 truncate">
                            {t.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* Elements Tab */}
        {activeTab === "elements" && (
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-xs font-bold text-gray-500 mb-2">Shapes</div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  className="aspect-square btn btn-sm btn-outline flex items-center justify-center"
                  onClick={addRect}
                  title="Rectangle"
                >
                  <div className="w-6 h-6 bg-blue-500 rounded"></div>
                </button>
                <button
                  className="aspect-square btn btn-sm btn-outline flex items-center justify-center"
                  onClick={addCircle}
                  title="Circle"
                >
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                </button>
                <button
                  className="aspect-square btn btn-sm btn-outline flex items-center justify-center"
                  onClick={addTriangle}
                  title="Triangle"
                >
                  <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-green-500"></div>
                </button>
                <button
                  className="aspect-square btn btn-sm btn-outline flex items-center justify-center"
                  onClick={addLine}
                  title="Line"
                >
                  <div className="w-6 h-0.5 bg-gray-700"></div>
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-500 mb-2">
                Dividers
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className="btn btn-sm btn-outline justify-start"
                  onClick={() => addDivider("solid")}
                >
                  <div className="w-full h-0.5 bg-gray-400"></div>
                </button>
                <button
                  className="btn btn-sm btn-outline justify-start"
                  onClick={() => addDivider("dashed")}
                >
                  <div className="w-full h-0.5 border-t-2 border-dashed border-gray-400"></div>
                </button>
                <button
                  className="btn btn-sm btn-outline justify-start"
                  onClick={() => addDivider("dotted")}
                >
                  <div className="w-full h-0.5 border-t-2 border-dotted border-gray-400"></div>
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-500 mb-2">Icons</div>
              <div className="grid grid-cols-4 gap-2">
                {Object.keys(ICONS).map((iconName) => {
                  const IconComp = ICONS[iconName as keyof typeof ICONS];
                  return (
                    <button
                      key={iconName}
                      className="aspect-square btn btn-sm btn-outline flex items-center justify-center text-lg"
                      onClick={() => addIcon(iconName as keyof typeof ICONS)}
                      title={iconName}
                    >
                      <IconComp />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <button
                className="w-full btn btn-sm btn-outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                 {isLoading ? 'Uploading...' : <><FaCamera className="mr-2" /> Upload Image</>}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleImageUpload(e.target.files[0])
                }
              />
            </div>
          </div>
        )}

        {/* Text Tab */}
        {activeTab === "text" && (
          <div className="flex flex-col gap-3">
            <button
              className="btn btn-outline justify-start"
              onClick={addHeading}
            >
              <span className="text-2xl font-bold">Heading</span>
            </button>
            <button
              className="btn btn-outline justify-start"
              onClick={addSubheading}
            >
              <span className="text-lg font-semibold">Subheading</span>
            </button>
            <button
              className="btn btn-outline justify-start"
              onClick={addBodyText}
            >
              <span className="text-sm">Body text</span>
            </button>
            <button className="btn btn-outline justify-start" onClick={addText}>
              + Add Custom Text
            </button>
          </div>
        )}

        <hr className="border-gray-300" />

        {/* Page Actions */}
        <div className="flex flex-col gap-2">
          <button
            className="w-full py-2 px-4 rounded-xl text-sm font-semibold border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-center gap-2"
            onClick={addPage}
          >
            <FaPlus /> Add Page
          </button>
          <button
            className="w-full py-2 px-4 rounded-xl text-sm font-semibold border-2 border-red-200 text-red-600 bg-white hover:bg-red-50 transition flex items-center justify-center gap-2"
            onClick={deletePage}
          >
            <FaTrash /> Delete Page
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-gray-300">
          <div className="flex gap-2">
            <button
              className="btn btn-sm bg-gray-800 text-white flex-1 hover:bg-gray-900"
              onClick={() => navigate("/my-ports")}
            >
              <FaArrowLeft /> Back
            </button>
            <button
              className="btn btn-sm btn-primary flex-1"
              onClick={handleSave}
              disabled={isLoading}
            >
              <FaSave /> Save
            </button>
          </div>
          <button
            className="btn btn-sm btn-error text-white"
            onClick={handleExportPDF}
          >
            <FaFilePdf /> Export PDF
          </button>
        </div>
      </aside>

      {/* Center Canvas Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <div className="flex items-center justify-between mb-4 py-3 px-5 bg-white rounded-xl shadow-md border border-gray-200 flex-none">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">
              Portfolio Name
            </span>
            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="text-xl font-bold focus:outline-none bg-transparent"
              placeholder="Untitled"
            />
            <span className="text-[10px] text-gray-400">
              Last edit {lastEdit.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}{' '}
              {lastEdit.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">
              {templateActive ? "Public" : "Private"}
            </span>
            <input
              type="checkbox"
              className="toggle toggle-sm toggle-success"
              checked={templateActive}
              onChange={(e) => setTemplateActive(e.target.checked)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto flex justify-center bg-gray-200 p-8 rounded-xl relative">
          
          {(() => {
            const zoomScale = 0.8;

            return (
              <div style={{ width: canvasSize.width * zoomScale, height: canvasSize.height * zoomScale }}>

                <div
                  ref={canvasRef}
                  style={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    background: currentCanvasBg,
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 4px 30px rgba(0,0,0,0.15)",
                    transform: `scale(${zoomScale})`,         
                    transformOrigin: "top left",              
                  }}
                  onClick={() => {
                    setSelectedId(null);
                    setShowColorPicker(false);
                    setShowBgPicker(false);
                    setShowCanvasBgPicker(false);
                    setShowBorderPicker(false);
                    setShowShadowPicker(false);
                  }}
                >
                  {elements.map((el) => {
                    if (!el || !el.style) return null;
                    return (
                      <Rnd
                        key={el.id}
                        scale={zoomScale} 
                        size={{ width: el.style.width, height: el.style.height }}
                        position={{ x: el.style.x, y: el.style.y }}
                        bounds="parent"
                        onDragStart={() => setSelectedId(el.id)}
                        onDragStop={(e, d) =>
                          updateElement(el.id, { style: { ...el.style, x: d.x, y: d.y } })
                        }
                        onResizeStop={(e, dir, ref, delta, pos) =>
                          updateElement(el.id, {
                            style: {
                              ...el.style,
                              width: parseFloat(ref.style.width),
                              height: parseFloat(ref.style.height),
                              x: pos.x,
                              y: pos.y
                            }
                          })
                        }
                        style={{
                          zIndex: el.style.zIndex,
                          border: selectedId === el.id ? '2px solid #3b82f6' : 'none',
                          cursor: selectedId === el.id ? 'move' : 'pointer'
                        }}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          setSelectedId(el.id);
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            transform: `rotate(${el.style.rotation || 0}deg)`,
                            transformOrigin: 'center center'
                          }}
                        >
                          {renderShape(el)}
                        </div>
                      </Rnd>
                    );
                  })}
                </div>
                
              </div> 
            );
          })()}
          
        </div>

        <div className="flex justify-center items-center gap-4 mt-3 p-2 bg-white rounded-xl shadow-md flex-none w-fit mx-auto border border-gray-200">
          <button
            className="btn btn-sm btn-circle btn-ghost hover:bg-gray-200"
            disabled={currentPageIndex === 0}
            onClick={() => setCurrentPageIndex((p) => p - 1)}
          >
            ❮
          </button>
          <span className="text-sm font-bold text-gray-700 px-3">
            Page {currentPageIndex + 1} / {pages.length}
          </span>
          <button
            className="btn btn-sm btn-circle btn-ghost hover:bg-gray-200"
            disabled={currentPageIndex === pages.length - 1}
            onClick={() => setCurrentPageIndex((p) => p + 1)}
          >
            ❯
          </button>
        </div>
      </div>

      {/* Right Properties Sidebar */}
      <div className="w-80 bg-white shadow-lg rounded-2xl p-5 flex flex-col gap-4 h-full overflow-y-auto flex-none">
        <div className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <FaLayerGroup /> Canvas Background
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div
            style={{
              width: 40,
              height: 40,
              background: currentCanvasBg,
              border: "2px solid #e5e7eb",
              borderRadius: 8,
              cursor: "pointer",
            }}
            onClick={() => setShowCanvasBgPicker((s) => !s)}
            className="hover:border-blue-400 transition"
          />
          <input
            type="text"
            value={currentCanvasBg}
            onChange={(e) => updateCurrentPageBg(e.target.value)}
            className="input input-bordered input-sm flex-1 text-xs"
          />
          {showCanvasBgPicker && (
            <div
              style={{ position: "fixed", right: 350, top: 200, zIndex: 999 }}
            >
              <div
                className="fixed inset-0"
                onClick={() => setShowCanvasBgPicker(false)}
              />
              <div className="relative z-10 shadow-2xl">
                <SketchPicker
                  color={currentCanvasBg}
                  onChangeComplete={(c: any) => updateCurrentPageBg(c.hex)}
                />
              </div>
            </div>
          )}
        </div>

        <hr className="border-gray-300" />

        {selectedElement ? (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700">
                Element Properties
              </span>
              <div className="flex gap-1">
                <button
                  className="btn btn-xs btn-ghost text-blue-600"
                  onClick={duplicateElement}
                  title="Duplicate"
                >
                  <FaCopy />
                </button>
                <button
                  className="btn btn-xs btn-ghost text-red-500"
                  onClick={() => {
                    const newPages = [...pages];
                    newPages[currentPageIndex] = newPages[
                      currentPageIndex
                    ].filter((e) => e.id !== selectedId);
                    setPages(newPages);
                    setSelectedId(null);
                  }}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            {/* Properties Inputs for position, size, etc. (Keep existing code) */}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">
                Position & Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-500">X</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.style.x)}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          x: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="input input-bordered input-xs w-full"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500">Y</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.style.y)}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          y: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="input input-bordered input-xs w-full"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500">Width</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.style.width)}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          width: parseInt(e.target.value) || 10,
                        },
                      })
                    }
                    className="input input-bordered input-xs w-full"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500">Height</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.style.height)}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          height: parseInt(e.target.value) || 10,
                        },
                      })
                    }
                    className="input input-bordered input-xs w-full"
                  />
                </div>
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">
                Rotation: {selectedElement.style.rotation || 0}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={selectedElement.style.rotation || 0}
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    style: {
                      ...selectedElement.style,
                      rotation: parseInt(e.target.value),
                    },
                  })
                }
                className="range range-xs range-primary"
              />
            </div>

            {/* Opacity */}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">
                Opacity:{" "}
                {Math.round(
                  (selectedElement.style.opacity !== undefined
                    ? selectedElement.style.opacity
                    : 1) * 100,
                )}
                %
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(
                  (selectedElement.style.opacity !== undefined
                    ? selectedElement.style.opacity
                    : 1) * 100,
                )}
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    style: {
                      ...selectedElement.style,
                      opacity: parseInt(e.target.value) / 100,
                    },
                  })
                }
                className="range range-xs range-primary"
              />
            </div>

            {/* Layer Order */}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">
                Layer Order
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="btn btn-xs btn-outline"
                  onClick={() => {
                    const list = [...pages[currentPageIndex]];
                    const idx = list.findIndex((e) => e.id === selectedId);
                    if (idx === -1) return;

                    const [item] = list.splice(idx, 1);
                    list.push(item);

                    setPages((p) => {
                      const np = [...p];
                      np[currentPageIndex] = normalizeZIndex(list);
                      return np;
                    });
                  }}
                >
                  To Front
                </button>
                <button
                  className="btn btn-xs btn-outline"
                  onClick={() => {
                    const list = [...pages[currentPageIndex]];
                    const idx = list.findIndex(e => e.id === selectedId);
                    if (idx === -1) return;

                    const [item] = list.splice(idx, 1);
                    list.unshift(item);

                    setPages(p => {
                      const np = [...p];
                      np[currentPageIndex] = normalizeZIndex(list);
                      return np;
                    });
                  }}
                >
                  To Back
                </button>
              </div>
            </div>

            {/* Text Properties */}
            {selectedElement.type === "text" && (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">
                    Font Family
                  </label>
                  <select
                    className="select select-bordered select-xs w-full"
                    value={
                      selectedElement.style.fontFamily || "Kanit, sans-serif"
                    }
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          fontFamily: e.target.value,
                        },
                      })
                    }
                  >
                    {FONT_FAMILIES.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>
                 {/* ... (Other text properties) ... */}
                 <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">
                    Content
                  </label>
                  <textarea
                    className="textarea textarea-bordered textarea-sm w-full"
                    rows={3}
                    value={selectedElement.content}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        content: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">
                    Font Size: {selectedElement.style.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="120"
                    value={selectedElement.style.fontSize}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          fontSize: parseInt(e.target.value),
                        },
                      })
                    }
                    className="range range-xs range-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-2 block">
                    Font Weight
                  </label>
                  <select
                    className="select select-bordered select-xs w-full"
                    value={selectedElement.style.fontWeight || "normal"}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          fontWeight: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="100">Thin (100)</option>
                    <option value="200">Extra Light (200)</option>
                    <option value="300">Light (300)</option>
                    <option value="normal">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi Bold (600)</option>
                    <option value="bold">Bold (700)</option>
                    <option value="800">Extra Bold (800)</option>
                    <option value="900">Black (900)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-2 block">
                    Text Style
                  </label>
                  <div className="flex gap-2">
                    <button
                      className={`btn btn-xs flex-1 ${selectedElement.style.fontWeight === "bold" ? "btn-primary" : "btn-outline"}`}
                      onClick={() =>
                        updateElement(selectedElement.id, {
                          style: {
                            ...selectedElement.style,
                            fontWeight:
                              selectedElement.style.fontWeight === "bold"
                                ? "normal"
                                : "bold",
                          },
                        })
                      }
                    >
                      <FaBold />
                    </button>
                    <button
                      className={`btn btn-xs flex-1 ${selectedElement.style.fontStyle === "italic" ? "btn-primary" : "btn-outline"}`}
                      onClick={() =>
                        updateElement(selectedElement.id, {
                          style: {
                            ...selectedElement.style,
                            fontStyle:
                              selectedElement.style.fontStyle === "italic"
                                ? "normal"
                                : "italic",
                          },
                        })
                      }
                    >
                      <FaItalic />
                    </button>
                    <button
                      className={`btn btn-xs flex-1 ${selectedElement.style.textDecoration === "underline" ? "btn-primary" : "btn-outline"}`}
                      onClick={() =>
                        updateElement(selectedElement.id, {
                          style: {
                            ...selectedElement.style,
                            textDecoration:
                              selectedElement.style.textDecoration ===
                              "underline"
                                ? "none"
                                : "underline",
                          },
                        })
                      }
                    >
                      <FaUnderline />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-2 block">
                    Text Align
                  </label>
                  <div className="flex gap-2">
                    <button
                      className={`btn btn-xs flex-1 ${selectedElement.style.textAlign === "left" ? "btn-primary" : "btn-outline"}`}
                      onClick={() =>
                        updateElement(selectedElement.id, {
                          style: {
                            ...selectedElement.style,
                            textAlign: "left",
                          },
                        })
                      }
                    >
                      <FaAlignLeft />
                    </button>
                    <button
                      className={`btn btn-xs flex-1 ${selectedElement.style.textAlign === "center" ? "btn-primary" : "btn-outline"}`}
                      onClick={() =>
                        updateElement(selectedElement.id, {
                          style: {
                            ...selectedElement.style,
                            textAlign: "center",
                          },
                        })
                      }
                    >
                      <FaAlignCenter />
                    </button>
                    <button
                      className={`btn btn-xs flex-1 ${selectedElement.style.textAlign === "right" ? "btn-primary" : "btn-outline"}`}
                      onClick={() =>
                        updateElement(selectedElement.id, {
                          style: {
                            ...selectedElement.style,
                            textAlign: "right",
                          },
                        })
                      }
                    >
                      <FaAlignRight />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">
                    Letter Spacing: {selectedElement.style.letterSpacing || 0}px
                  </label>
                  <input
                    type="range"
                    min="-5"
                    max="20"
                    value={selectedElement.style.letterSpacing || 0}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          letterSpacing: parseInt(e.target.value),
                        },
                      })
                    }
                    className="range range-xs range-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">
                    Line Height: {selectedElement.style.lineHeight || 1.2}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={selectedElement.style.lineHeight || 1.2}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          lineHeight: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="range range-xs range-primary"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-600">
                    Text Color:
                  </span>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      background: selectedElement.style.color,
                      border: "2px solid #e5e7eb",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                    onClick={() => setShowColorPicker((s) => !s)}
                    className="hover:border-blue-400 transition"
                  />
                  <input
                    type="text"
                    value={selectedElement.style.color || "#000000"}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          color: e.target.value,
                        },
                      })
                    }
                    className="input input-bordered input-xs flex-1 text-xs"
                  />
                  {showColorPicker && (
                    <div
                      style={{
                        position: "fixed",
                        right: 350,
                        top: 200,
                        zIndex: 999,
                      }}
                    >
                      <div
                        className="fixed inset-0"
                        onClick={() => setShowColorPicker(false)}
                      />
                      <div className="relative z-10 shadow-2xl">
                        <SketchPicker
                          color={selectedElement.style.color}
                          onChangeComplete={(c: any) =>
                            updateElement(selectedElement.id, {
                              style: { ...selectedElement.style, color: c.hex },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Icon Color */}
            {selectedElement.type === "icon" && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600">
                  Icon Color:
                </span>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background: selectedElement.style.color,
                    border: "2px solid #e5e7eb",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                  onClick={() => setShowColorPicker((s) => !s)}
                  className="hover:border-blue-400 transition"
                />
                <input
                  type="text"
                  value={selectedElement.style.color || "#000000"}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      style: {
                        ...selectedElement.style,
                        color: e.target.value,
                      },
                    })
                  }
                  className="input input-bordered input-xs flex-1 text-xs"
                />
                {showColorPicker && (
                  <div
                    style={{
                      position: "fixed",
                      right: 350,
                      top: 200,
                      zIndex: 999,
                    }}
                  >
                    <div
                      className="fixed inset-0"
                      onClick={() => setShowColorPicker(false)}
                    />
                    <div className="relative z-10 shadow-2xl">
                      <SketchPicker
                        color={selectedElement.style.color}
                        onChangeComplete={(c: any) =>
                          updateElement(selectedElement.id, {
                            style: { ...selectedElement.style, color: c.hex },
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Shape Fill Color */}
            {(selectedElement.type === "rect" ||
              selectedElement.type === "circle" ||
              selectedElement.type === "triangle" ||
              selectedElement.type === "line") && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600">
                  Fill Color:
                </span>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background: selectedElement.style.backgroundColor,
                    border: "2px solid #e5e7eb",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                  onClick={() => setShowBgPicker((s) => !s)}
                  className="hover:border-blue-400 transition"
                />
                <input
                  type="text"
                  value={selectedElement.style.backgroundColor || "#cccccc"}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      style: {
                        ...selectedElement.style,
                        backgroundColor: e.target.value,
                      },
                    })
                  }
                  className="input input-bordered input-xs flex-1 text-xs"
                />
                {showBgPicker && (
                  <div
                    style={{
                      position: "fixed",
                      right: 350,
                      top: 200,
                      zIndex: 999,
                    }}
                  >
                    <div
                      className="fixed inset-0"
                      onClick={() => setShowBgPicker(false)}
                    />
                    <div className="relative z-10 shadow-2xl">
                      <SketchPicker
                        color={selectedElement.style.backgroundColor}
                        onChangeComplete={(c: any) =>
                          updateElement(selectedElement.id, {
                            style: {
                              ...selectedElement.style,
                              backgroundColor: c.hex,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Border */}
            {(selectedElement.type === "rect" ||
              selectedElement.type === "circle" ||
              selectedElement.type === "image" ||
              selectedElement.type === "divider") && (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">
                    Border Width: {selectedElement.style.borderWidth || 0}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={selectedElement.style.borderWidth || 0}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          borderWidth: parseInt(e.target.value),
                        },
                      })
                    }
                    className="range range-xs range-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-600">
                    Border Color:
                  </span>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      background:
                        selectedElement.style.borderColor || "#000000",
                      border: "2px solid #e5e7eb",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                    onClick={() => setShowBorderPicker((s) => !s)}
                    className="hover:border-blue-400 transition"
                  />
                  <input
                    type="text"
                    value={selectedElement.style.borderColor || "#000000"}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          borderColor: e.target.value,
                        },
                      })
                    }
                    className="input input-bordered input-xs flex-1 text-xs"
                  />
                  {showBorderPicker && (
                    <div
                      style={{
                        position: "fixed",
                        right: 350,
                        top: 200,
                        zIndex: 999,
                      }}
                    >
                      <div
                        className="fixed inset-0"
                        onClick={() => setShowBorderPicker(false)}
                      />
                      <div className="relative z-10 shadow-2xl">
                        <SketchPicker
                          color={selectedElement.style.borderColor || "#000000"}
                          onChangeComplete={(c: any) =>
                            updateElement(selectedElement.id, {
                              style: {
                                ...selectedElement.style,
                                borderColor: c.hex,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Border Radius */}
            {(selectedElement.type === "rect" ||
              selectedElement.type === "image") && (
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">
                  Corner Radius: {selectedElement.style.borderRadius || 0}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedElement.style.borderRadius || 0}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      style: {
                        ...selectedElement.style,
                        borderRadius: parseInt(e.target.value),
                      },
                    })
                  }
                  className="range range-xs range-primary"
                />
              </div>
            )}

            {/* Shadow */}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">
                Shadow
              </label>
              <select
                className="select select-bordered select-xs w-full"
                value={selectedElement.style.boxShadow || "none"}
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    style: {
                      ...selectedElement.style,
                      boxShadow:
                        e.target.value === "none" ? undefined : e.target.value,
                    },
                  })
                }
              >
                <option value="none">None</option>
                <option value="0 1px 3px rgba(0,0,0,0.12)">Small</option>
                <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
                <option value="0 10px 15px rgba(0,0,0,0.1)">Large</option>
                <option value="0 20px 25px rgba(0,0,0,0.15)">
                  Extra Large
                </option>
              </select>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm italic gap-2">
            <FaLayerGroup className="text-4xl text-gray-300" />
            <p>Select an element to edit</p>
          </div>
        )}
      </div>

      {/* Hidden PDF Container */}
      <div
        style={{
          width: 0,
          height: 0,
          overflow: "hidden",
          position: "absolute",
        }}
      >
        <div
          ref={pdfContainerRef}
          style={{ width: canvasSize.width, background: currentCanvasBg }}
        >
          {pages.map((pageElements, idx) => (
            <div
              key={idx}
              style={{
                width: canvasSize.width,
                height: canvasSize.height,
                backgroundColor: pageBackgrounds[idx] || "#ffffff",
                position: "relative",
                overflow: "hidden",
                marginBottom: 20,
              }}
            >
              {pageElements.map((el) => {
                if (!el || !el.style) return null;
                return (
                  <div
                    key={el.id}
                    style={{
                      position: "absolute",
                      left: el.style.x,
                      top: el.style.y,
                      width: el.style.width,
                      height: el.style.height,
                      transform: `rotate(${el.style.rotation || 0}deg)`,
                      zIndex: el.style.zIndex,
                    }}
                  >
                    {renderShape(el)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Editor;