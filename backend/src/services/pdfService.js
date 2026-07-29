const fs = require('fs');
const pdfParse = require('pdf-parse');
const PDFDocument = require('pdfkit');

/**
 * Extract plain text from a PDF file.
 * @param {string} filePath - Absolute path to the PDF file.
 * @returns {Promise<string>} Extracted text.
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    // Clean text: replace multiple spaces/newlines
    let text = data.text;
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF: ' + error.message);
  }
};

/**
 * Generate a PDF analysis report using PDFKit.
 * @param {object} analysisData - The AnalysisReport document data.
 * @param {object} userInfo - User details.
 * @returns {Promise<Buffer>} PDF file buffer.
 */
const generateAnalysisReport = (analysisData, userInfo) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Colors
      const primaryColor = '#4f46e5'; // Indigo
      const secondaryColor = '#7c3aed'; // Purple
      const darkColor = '#1f2937'; // Slate
      const lightGray = '#f3f4f6';
      const successColor = '#10b981'; // Green
      const dangerColor = '#ef4444'; // Red

      // Title & Header
      doc.rect(0, 0, 595.28, 120).fill(primaryColor);
      
      doc.fillColor('#ffffff')
         .font('Helvetica-Bold')
         .fontSize(24)
         .text('AI RESUME ANALYSIS REPORT', 50, 40);
         
      doc.font('Helvetica')
         .fontSize(10)
         .text(`Candidate: ${userInfo.name}  |  Email: ${userInfo.email}`, 50, 75);
         
      doc.text(`Generated on: ${new Date(analysisData.createdAt).toLocaleDateString()}`, 50, 92);

      // Section 1: ATS SCORE
      doc.fillColor(darkColor).font('Helvetica-Bold').fontSize(16).text('Overall ATS Metrics', 50, 150);
      doc.moveTo(50, 170).lineTo(545, 170).strokeColor(primaryColor).lineWidth(1.5).stroke();

      // Large ATS Score callout
      doc.rect(50, 185, 120, 80).fill(lightGray);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(36).text(`${analysisData.atsScore}`, 75, 200, { width: 70, align: 'center' });
      doc.fillColor(darkColor).font('Helvetica').fontSize(10).text('ATS SCORE', 50, 245, { width: 120, align: 'center' });

      // Profile details on the right of score
      doc.fillColor(darkColor).font('Helvetica-Bold').fontSize(11).text('Candidate Profile Summary', 190, 185);
      doc.font('Helvetica').fontSize(10)
         .text(`Education level: ${analysisData.educationLevel || 'Not Specified'}`, 190, 205)
         .text(`Experience level: ${analysisData.experienceLevel || 'Not Specified'}`, 190, 220)
         .text(`Target Roles: ${(analysisData.jobRoles || []).join(', ') || 'Not Specified'}`, 190, 235);

      // Summary
      doc.fillColor(darkColor).font('Helvetica-Bold').fontSize(14).text('Resume Summary', 50, 290);
      doc.moveTo(50, 305).lineTo(545, 305).strokeColor(lightGray).lineWidth(1).stroke();
      doc.font('Helvetica').fontSize(10).fillColor('#374151')
         .text(analysisData.summary || 'No summary available.', 50, 315, { width: 495, align: 'justify', lineGap: 3 });

      // Skills Gap
      doc.fillColor(darkColor).font('Helvetica-Bold').fontSize(14).text('Skills Analysis', 50, 390);
      doc.moveTo(50, 405).lineTo(545, 405).strokeColor(lightGray).lineWidth(1).stroke();

      doc.fillColor(successColor).font('Helvetica-Bold').fontSize(11).text('Matching Skills', 50, 415);
      doc.font('Helvetica').fontSize(9).fillColor('#374151')
         .text((analysisData.matchingSkills || []).join(', ') || 'None found.', 50, 430, { width: 230 });

      doc.fillColor(dangerColor).font('Helvetica-Bold').fontSize(11).text('Missing / Recommended Skills', 300, 415);
      doc.font('Helvetica').fontSize(9).fillColor('#374151')
         .text((analysisData.missingSkills || []).join(', ') || 'None found.', 300, 430, { width: 235 });

      // Start new page for improvements & courses
      doc.addPage();
      
      doc.fillColor(darkColor).font('Helvetica-Bold').fontSize(14).text('Strengths & Weaknesses', 50, 50);
      doc.moveTo(50, 65).lineTo(545, 65).strokeColor(lightGray).lineWidth(1).stroke();

      doc.fillColor(successColor).font('Helvetica-Bold').fontSize(11).text('Strengths', 50, 75);
      let strengthY = 90;
      (analysisData.strengths || []).forEach(str => {
        doc.fillColor('#374151').font('Helvetica').fontSize(9).text(`• ${str}`, 55, strengthY, { width: 220 });
        strengthY += 18;
      });

      doc.fillColor(dangerColor).font('Helvetica-Bold').fontSize(11).text('Weaknesses', 300, 75);
      let weaknessY = 90;
      (analysisData.weaknesses || []).forEach(wk => {
        doc.fillColor('#374151').font('Helvetica').fontSize(9).text(`• ${wk}`, 305, weaknessY, { width: 225 });
        weaknessY += 18;
      });

      const nextSectionY = Math.max(strengthY, weaknessY) + 20;

      doc.fillColor(darkColor).font('Helvetica-Bold').fontSize(14).text('Actionable Improvements', 50, nextSectionY);
      doc.moveTo(50, nextSectionY + 15).lineTo(545, nextSectionY + 15).strokeColor(lightGray).lineWidth(1).stroke();

      let impY = nextSectionY + 25;
      (analysisData.improvements || []).forEach((imp, i) => {
        if (impY > 740) {
          doc.addPage();
          impY = 50;
        }
        doc.fillColor('#374151').font('Helvetica').fontSize(9).text(`${i + 1}. ${imp}`, 50, impY, { width: 495 });
        impY += 22;
      });

      // Recommended Courses
      if (analysisData.courses && analysisData.courses.length > 0) {
        if (impY > 650) {
          doc.addPage();
          impY = 50;
        }
        doc.fillColor(darkColor).font('Helvetica-Bold').fontSize(14).text('Recommended Learning Paths', 50, impY + 15);
        doc.moveTo(50, impY + 30).lineTo(545, impY + 30).strokeColor(lightGray).lineWidth(1).stroke();

        let courseY = impY + 40;
        analysisData.courses.forEach(course => {
          doc.fillColor(secondaryColor).font('Helvetica-Bold').fontSize(10).text(course.title, 50, courseY);
          doc.fillColor('#4b5563').font('Helvetica').fontSize(9).text(`Platform: ${course.platform || 'Online'} | Link: ${course.url || 'N/A'}`, 50, courseY + 14);
          courseY += 32;
        });
      }

      // Footer notice on all pages
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fillColor('#9ca3af').font('Helvetica').fontSize(8).text(
          `Page ${i + 1} of ${pages.count}  |  AI Resume Analyzer  |  Confidential Analysis Report`,
          50,
          800,
          { align: 'center', width: 495 }
        );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  extractTextFromPDF,
  generateAnalysisReport
};
