/**
 * Layer 5: Attachment Analysis
 * Detects malicious file types, macros, embedded scripts
 */

class AttachmentAnalysisLayer {
  constructor() {
    this.dangerousExtensions = {
      executable: ['.exe', '.scr', '.pif', '.com', '.bat', '.cmd', '.msi', '.msp', '.mst', '.hta', '.cpl'],
      script: ['.js', '.vbs', '.vbe', '.ws', '.wsf', '.wsc', '.ps1', '.psm1', '.psd1'],
      document_with_macros: ['.docm', '.xlsm', '.pptm', '.dotm', '.xltm'],
      archive_suspicious: ['.iso', '.img', '.vhd', '.vhdx', '.lnk', '.application', '.gadget'],
      web: ['.html', '.htm', '.svg', '.xhtml'],
      email: ['.eml', '.msg', '.ical', '.ics']
    };

    this.suspiciousPatterns = [
      /macro/i,
      /enable\s+content/i,
      /enable\s+editing/i,
      /allow\s+access/i,
      /trust\s+this\s+document/i,
      /active\s+x/i,
      /visual\s+basic/i,
      /powershell/i,
      /cmd\.exe/i,
      /wscript/i,
      /cscript/i,
      /mshta/i,
      /regsvr32/i,
      /rundll32/i,
      /certutil/i,
      /bitsadmin/i
    ];

    this.safeExtensions = ['.pdf', '.txt', '.csv', '.jpg', '.jpeg', '.png', '.gif', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
  }

  async analyze(emailData) {
    const evidence = [];
    let score = 0;
    let confidence = 0.85;

    const attachments = emailData.attachments || [];

    if (attachments.length === 0) {
      return {
        score: 0,
        confidence: 0.9,
        evidence: [{
          type: 'no_attachments',
          severity: 'info',
          finding: 'No attachments found',
          explanation: 'This email does not contain any attachments.'
        }],
        details: { count: 0 }
      };
    }

    for (const attachment of attachments) {
      const analysis = this.analyzeAttachment(attachment);
      
      if (analysis.suspicious) {
        score += analysis.score;
        evidence.push(...analysis.evidence);
      }
    }

    // Check for multiple suspicious attachments
    if (attachments.length > 3) {
      score += 8;
      evidence.push({
        type: 'multiple_attachments',
        severity: 'medium',
        finding: `Email contains ${attachments.length} attachments`,
        explanation: 'Multiple attachments can be a sign of a coordinated attack or malware distribution.'
      });
    }

    // Check for password-protected archives (common malware tactic)
    const hasPasswordProtected = attachments.some(a => 
      a.name && (a.name.endsWith('.zip') || a.name.endsWith('.rar') || a.name.endsWith('.7z')) &&
      (a.description || '').toLowerCase().includes('password')
    );
    if (hasPasswordProtected) {
      score += 15;
      evidence.push({
        type: 'password_protected_archive',
        severity: 'high',
        finding: 'Password-protected archive detected',
        explanation: 'Attackers use password-protected archives to bypass email security scanners. The password is often provided in the email body.'
      });
    }

    return {
      score: Math.min(score, 100),
      confidence: confidence,
      evidence: evidence,
      details: { count: attachments.length }
    };
  }

  analyzeAttachment(attachment) {
    const evidence = [];
    let score = 0;
    const filename = (attachment.name || '').toLowerCase();
    const extension = this.getExtension(filename);

    // 1. Check for dangerous file types
    for (const [category, extensions] of Object.entries(this.dangerousExtensions)) {
      if (extensions.includes(extension)) {
        const severity = category === 'executable' || category === 'script' ? 'critical' : 'high';
        score = category === 'executable' ? 35 : category === 'script' ? 30 : 20;
        
        evidence.push({
          type: 'dangerous_attachment',
          severity: severity,
          finding: `Dangerous file type detected: ${extension} (${category})`,
          explanation: this.getAttachmentExplanation(extension, category)
        });
        break;
      }
    }

    // 2. Check for double extensions (e.g., "invoice.pdf.exe")
    const parts = filename.split('.');
    if (parts.length > 2) {
      const realExtension = '.' + parts[parts.length - 1];
      const fakeExtension = '.' + parts[parts.length - 2];
      
      if (this.dangerousExtensions.executable.includes(realExtension) && this.safeExtensions.includes(fakeExtension)) {
        score = 40;
        evidence.push({
          type: 'double_extension',
          severity: 'critical',
          finding: `Double extension detected: ${filename}`,
          explanation: 'This file uses a double extension trick to appear safe (e.g., "invoice.pdf.exe"). The actual file type is dangerous.'
        });
      }
    }

    // 3. Check for suspicious filenames
    const suspiciousNames = [
      'invoice', 'receipt', 'payment', 'document', 'scan', 'photo',
      'image', 'backup', 'update', 'install', 'setup', 'upgrade'
    ];
    if (suspiciousNames.some(n => filename.includes(n)) && 
        this.dangerousExtensions.executable.some(e => filename.endsWith(e))) {
      score += 10;
      evidence.push({
        type: 'suspicious_filename',
        severity: 'high',
        finding: `Suspicious filename pattern: ${filename}`,
        explanation: 'The filename tries to appear as a common document but is actually an executable file.'
      });
    }

    // 4. Check for LNK files (Windows shortcuts)
    if (extension === '.lnk') {
      score += 25;
      evidence.push({
        type: 'lnk_file',
        severity: 'critical',
        finding: 'Windows shortcut file (.lnk) detected',
        explanation: 'LNK files can execute arbitrary commands and are commonly used in malware attacks.'
      });
    }

    // 5. Check for ISO/IMG files
    if (extension === '.iso' || extension === '.img') {
      score += 20;
      evidence.push({
        type: 'disc_image',
        severity: 'high',
        finding: `Disc image file detected: ${extension}`,
        explanation: 'ISO and IMG files can contain malware and are often used to bypass security filters.'
      });
    }

    // 6. Check for HTML files (can contain phishing)
    if (extension === '.html' || extension === '.htm') {
      score += 18;
      evidence.push({
        type: 'html_attachment',
        severity: 'high',
        finding: 'HTML attachment detected',
        explanation: 'HTML files can contain embedded phishing pages or malicious scripts.'
      });
    }

    // 7. Check for SVG files (can contain JavaScript)
    if (extension === '.svg') {
      score += 15;
      evidence.push({
        type: 'svg_attachment',
        severity: 'medium',
        finding: 'SVG file detected',
        explanation: 'SVG files can contain embedded JavaScript and should be viewed with caution.'
      });
    }

    // 8. Check file size (unusually large or small)
    if (attachment.size) {
      if (attachment.size > 10 * 1024 * 1024) { // > 10MB
        score += 5;
        evidence.push({
          type: 'large_attachment',
          severity: 'low',
          finding: `Large attachment: ${(attachment.size / 1024 / 1024).toFixed(1)}MB`,
          explanation: 'Unusually large attachments may contain malware or be part of a data exfiltration attempt.'
        });
      }
      if (attachment.size < 100) { // < 100 bytes
        score += 8;
        evidence.push({
          type: 'tiny_attachment',
          severity: 'medium',
          finding: 'Suspiciously small attachment',
          explanation: 'Very small files may contain shortcuts or malicious payloads.'
        });
      }
    }

    return {
      suspicious: score > 0,
      score: Math.min(score, 40),
      evidence: evidence
    };
  }

  getExtension(filename) {
    const parts = filename.split('.');
    return parts.length > 1 ? '.' + parts[parts.length - 1] : '';
  }

  getAttachmentExplanation(extension, category) {
    const explanations = {
      executable: `Files ending in ${extension} are executable programs that can run malicious code on your computer. NEVER open executable files from emails unless you are absolutely certain they are safe.`,
      script: `Files ending in ${extension} contain scripts that can execute commands on your computer. These are commonly used to deliver malware.`,
      'document_with_macros': `Files ending in ${extension} can contain macros (automated scripts). Macros can execute malicious code when the document is opened.`,
      archive_suspicious: `This file type can contain malicious content or be used to bypass security scanners.`,
      web: `HTML/SVG files can contain embedded phishing pages or malicious scripts that execute when opened.`
    };
    
    return explanations[category] || `This file type (${extension}) is potentially dangerous and should not be opened from email.`;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AttachmentAnalysisLayer;
}