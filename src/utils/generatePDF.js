import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (element, filename) => {
  if (!element) {
    console.error("Element not found for PDF generation");
    return;
  }

  // Optional: Hide scrollbars during capture
  const originalStyle = element.style.overflow;
  element.style.overflow = "hidden";

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // If you have images
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    
    // A4 dimensions in mm
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calculate height ratio to fit A4
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    
    // Add image
    // We scale the height slightly to fill page better if needed, 
    // but standard ratio maintains aspect.
    const scaledHeight = (imgHeight * pdfWidth) / imgWidth;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, scaledHeight);
    
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    // Restore original style
    element.style.overflow = originalStyle;
  }
};