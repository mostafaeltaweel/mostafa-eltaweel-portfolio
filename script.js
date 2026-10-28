/**
 * Mostafa Mohamed — Minimalist Personal Portfolio Interactive Script
 * High performance Vanilla JS: Category Filter, Video Modal, STAR Case Study Modal, Mobile Nav
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // CASE STUDY DATABASE (STAR Framework)
  // ==========================================
  const caseStudies = {
    'hotel-booking': {
      title: 'Hotel Booking Performance & Cancellation Diagnostics',
      category: 'Hospitality Analytics & Revenue Diagnostics',
      problem: 'High cancellation volatility (averaging 37% across 119k+ reservations) distorted operational forecasting, wasted staffing allocations, and tied up high-demand rooms without captured revenue.',
      approach: 'Cleaned and structured transactional hospitality logs using SQL Server CTEs and aggregations. Built a multi-page Power BI dashboard featuring dynamic DAX time-intelligence metrics isolating Lead Time risk cohorts (>90 days displayed double cancellation propensity), Deposit Type anomalies (non-refundable deposits exhibiting counter-intuitive cancellation patterns in specific channels), and OTA distribution reliance.',
      outcome: 'Formulated targeted operational policies: dynamic deposit requirements tied to lead time, automated re-confirmation milestones for OTAs, and room-release timers that help hotels recover lost occupancy value and protect peak seasons.',
      tech: ['Power BI Desktop', 'DAX Measures', 'SQL Server', 'Data Modeling', 'Root Cause Diagnostics'],
      links: [
        { label: 'Watch Video Walkthrough', action: 'video', videoSrc: 'assets/videos/hotel-booking-diagnostics.mp4', primary: true },
        { label: 'Download Power BI (.pbix)', url: 'assets/downloads/Booking%20Analysis.pbix', download: true },
        { label: 'Read In-Depth Case Study (Google Doc)', url: 'https://docs.google.com/document/d/e/2PACX-1vSSBGNaWC8HfhDhWMlAlTvMmfnz6Sd5cPniONcgMm1dgZeW1xXloudtuDA8VQqFBJ5A3g8h2YVuxv7L/pub', external: true }
      ]
    },
    'financial-fraud': {
      title: 'Financial Fraud Analytics at Scale',
      category: 'Financial Analytics & Anomaly Detection',
      problem: 'In a high-throughput financial system comprising 1.05M transactions, fraudulent transactions constitute a needle-in-a-haystack occurrence (1,142 cases or 0.11%), making manual auditing economically impossible and operationally slow.',
      approach: 'Built an enterprise Power BI model equipped with multi-tiered DAX measures evaluating fraud rates, high-risk amount volumes, and temporal fraud velocity. Analyzed transaction behaviors across all payment modes to determine vulnerability vectors.',
      outcome: 'Proved empirically that 100% of confirmed fraud instances were concentrated exclusively in TRANSFER and CASH_OUT mechanisms, allowing risk compliance teams to configure automated rule filters that eliminate manual review on low-risk transactions and focus 100% of audit resources on high-exposure vectors.',
      tech: ['Power BI', 'DAX Time-Intelligence', 'Financial Risk Modeling', 'Data Storytelling'],
      links: [
        { label: 'Download Power BI Desktop (.pbix)', url: 'assets/downloads/Synthetic_Financial_datasets.pbix', download: true, primary: true },
        { label: 'View Dashboard Screenshot', url: 'assets/images/financial-fraud.png', external: true }
      ]
    },
    'ai-lead-system': {
      title: 'Autonomous AI Lead Qualification & CRM Agent',
      category: 'AI Agents & Workflow Automation',
      problem: 'Inbound sales inquiries arriving via Telegram, forms, and Gmail suffered from hours of qualification latency. Warm prospects lost purchase momentum while sales reps wasted valuable hours manually copying details into spreadsheets.',
      approach: 'Engineered a 4-pipeline autonomous n8n workflow system powered by Groq LLM API. The pipeline normalizes unstructured queries, parses customer intent, budget, and urgency into schema-validated JSON, syncs the records automatically into a Google Sheets Mini CRM, and immediately pushes a high-priority Telegram alert to the business owner whenever a "Hot Lead" is detected.',
      outcome: 'Slashed inbound lead qualification response time from hours to under 30 seconds, eliminating manual data entry errors and ensuring high-value clients are engaged while their buying intent is at its peak.',
      tech: ['n8n Community Edition', 'Groq LLM API', 'System Prompts', 'Webhooks & REST APIs', 'Google Sheets CRM'],
      links: [
        { label: 'Download Complete Workflow Pack (.zip)', url: 'assets/downloads/ai-lead-automation-workflows.zip', download: true, primary: true }
      ]
    },
    'electricity-theft': {
      title: 'Electricity Theft Detection Application',
      category: 'Applied Deep Learning & Computer Vision',
      problem: 'Electric utilities suffer multi-million dollar annual revenue losses from illegal meter bypassing and non-technical grid theft, where static heuristic rules fail to detect gradual or intermittent tampering.',
      approach: 'Architected a hybrid dual-branch deep learning network (CNN-LSTM). The 2D-CNN branch extracts spatial daily consumption signatures, while the LSTM branch models long-term sequential temporal anomalies. Engineered consumption ratio features and packaged the inference pipeline into a clean Streamlit application.',
      outcome: 'Provides field inspection units with probabilistic risk scores, transitioning utility inspection from blind random sweeps into targeted, high-probability audits that maximize revenue recovery.',
      tech: ['PyTorch / TensorFlow', 'CNN-LSTM Hybrid', 'Streamlit Cloud', 'Feature Engineering'],
      links: [
        { label: 'Launch Live Streamlit App', url: 'https://theft-electric-detection-c.streamlit.app/', external: true, primary: true }
      ]
    },
    'rxhand-ai': {
      title: 'RxHand-AI: Handwritten Prescription Recognition & Structuring',
      category: 'Healthcare AI & Vision Transformers',
      problem: 'Illegible physician handwriting on physical prescription slips leads to fatal pharmacy dispensing errors, clinical communication delays, and administrative bottlenecks worldwide.',
      approach: 'Designed an open-vocabulary Handwritten Text Recognition (HTR) pipeline utilizing Microsoft TrOCR (Vision Transformer) with autoregressive decoders that directly process 2D image patches without relying on closed character dictionaries. Structured the extracted clinical entities (drugs, dosages, frequencies) into standardized JSON schemas with a Human-In-The-Loop (HITL) confidence scoring safeguard.',
      outcome: 'Demonstrated reliable zero-shot transcription of cursive medical crops, bridging physical paper prescriptions into actionable electronic medical records (EMR) while maintaining clinical safety boundaries.',
      tech: ['Python 3.12', 'PyTorch', 'Hugging Face Transformers (TrOCR)', 'Streamlit UI', 'HITL System'],
      links: [
        { label: 'Explore GitHub Profile', url: 'https://github.com/mostafaeltaweel', external: true, primary: true }
      ]
    },
    'emolens': {
      title: 'EmoLens — Facial Emotion Recognition',
      category: 'Computer Vision & Deep Learning',
      problem: 'Detecting subtle facial micro-expressions in real-time requires high spatial sensitivity while handling adverse real-world conditions like head tilts, occlusions, and varying webcam lighting.',
      approach: 'Integrated an EfficientNet-B3 backbone with Convolutional Block Attention Modules (CBAM) to dynamically weight salient facial landmarks (eyes, brows, mouth contours). Implemented dataset deduplication and temperature scaling confidence calibration, wrapping the model in an interactive Streamlit application with live webcam and video stream inference.',
      outcome: 'Delivered an interactive AI product capable of real-time sub-45ms latency inference across 7 emotional states, demonstrating end-to-end model training, deployment, and practical UX design.',
      tech: ['EfficientNet-B3', 'CBAM Attention', 'PyTorch', 'Streamlit', 'OpenCV'],
      links: [
        { label: 'Launch Live Streamlit App', url: 'https://facial-emotion-recognition-m.streamlit.app/', external: true, primary: true }
      ]
    },
    'powerbi-survey': {
      title: 'Data Professional Global Survey Analytics',
      category: 'Business Intelligence & Salary Insights',
      problem: 'Understanding global salary distributions, tool adoption (Power BI vs Tableau vs Python), and job satisfaction across 630+ data professionals requires multidimensional filtering.',
      approach: 'Designed an interactive Power BI dashboard featuring dynamic role-based compensation benchmarking, geographic satisfaction distribution, and drill-through capabilities.',
      outcome: 'A reusable BI asset presenting benchmark market insights for aspiring data professionals and engineering managers.',
      tech: ['Power BI Desktop', 'DAX', 'Data Visualization', 'Walkthrough Video'],
      links: [
        { label: 'Watch Video Walkthrough', action: 'video', videoSrc: 'assets/videos/powerbi-survey-demo.mp4', primary: true }
      ]
    }
  };

  // ==========================================
  // PROJECT FILTERING
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // ==========================================
  // VIDEO WALKTHROUGH MODAL
  // ==========================================
  const videoModal = document.getElementById('video-modal');
  const videoPlayer = document.getElementById('modal-video-player');
  const closeVideoBtn = document.getElementById('video-modal-close');
  const videoModalTitle = document.getElementById('video-modal-title');
  const videoModalDesc = document.getElementById('video-modal-desc');

  function openVideoModal(videoSrc, title = 'Project Video Walkthrough', desc = '') {
    if (!videoModal || !videoPlayer) return;
    videoPlayer.src = videoSrc;
    if (videoModalTitle) videoModalTitle.textContent = title;
    if (videoModalDesc) videoModalDesc.textContent = desc;

    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    videoPlayer.play().catch(() => {});
  }

  function closeVideoModal() {
    if (!videoModal || !videoPlayer) return;
    videoPlayer.pause();
    videoPlayer.removeAttribute('src');
    videoModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-video-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const src = btn.getAttribute('data-video-target');
      const card = btn.closest('.project-card');
      const title = card ? card.querySelector('.project-title')?.textContent : 'Project Walkthrough';
      openVideoModal(src, title);
    });
  });

  if (closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  // ==========================================
  // CASE STUDY MODAL (STAR FRAMEWORK)
  // ==========================================
  const caseModal = document.getElementById('case-modal');
  const closeCaseBtn = document.getElementById('case-modal-close');
  const caseCategoryEl = document.getElementById('case-category');
  const caseTitleEl = document.getElementById('case-title');
  const caseProblemEl = document.getElementById('case-problem');
  const caseApproachEl = document.getElementById('case-approach');
  const caseOutcomeEl = document.getElementById('case-outcome');
  const caseLinksEl = document.getElementById('case-links');

  function openCaseModal(caseId) {
    const data = caseStudies[caseId];
    if (!data || !caseModal) return;

    if (caseCategoryEl) caseCategoryEl.textContent = data.category;
    if (caseTitleEl) caseTitleEl.textContent = data.title;
    if (caseProblemEl) caseProblemEl.textContent = data.problem;
    if (caseApproachEl) caseApproachEl.textContent = data.approach;
    if (caseOutcomeEl) caseOutcomeEl.textContent = data.outcome;

    if (caseLinksEl) {
      caseLinksEl.innerHTML = data.links.map(link => {
        if (link.action === 'video') {
          return `<button type="button" class="btn-card-primary" data-video-target="${link.videoSrc}">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    ${link.label}
                  </button>`;
        } else {
          const cls = link.primary ? 'btn-card-primary' : 'btn-card-glass';
          const downloadAttr = link.download ? 'download' : '';
          const targetAttr = link.external ? 'target="_blank" rel="noopener noreferrer"' : '';
          return `<a href="${link.url}" ${downloadAttr} ${targetAttr} class="${cls}">
                    ${link.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>`;
        }
      }).join('');

      caseLinksEl.querySelectorAll('[data-video-target]').forEach(btn => {
        btn.addEventListener('click', () => {
          closeCaseModal();
          openVideoModal(btn.getAttribute('data-video-target'));
        });
      });
    }

    caseModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseModal() {
    if (!caseModal) return;
    caseModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-case-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-case-target');
      openCaseModal(id);
    });
  });

  if (closeCaseBtn) closeCaseBtn.addEventListener('click', closeCaseModal);
  if (caseModal) {
    caseModal.addEventListener('click', (e) => {
      if (e.target === caseModal) closeCaseModal();
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVideoModal();
      closeCaseModal();
    }
  });

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const siteNav = document.getElementById('site-nav');

  if (mobileToggle && siteNav) {
    mobileToggle.addEventListener('click', () => {
      siteNav.classList.toggle('mobile-open');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('mobile-open');
      });
    });
  }

  // ==========================================
  // CUSTOMER INTERACTIVE AVATAR (REACTIVE 3D & SPEECH)
  // ==========================================
  const avatarRing = document.getElementById('hero-avatar-ring');
  const avatarBubble = document.getElementById('avatar-reaction-bubble');
  const bubbleText = avatarBubble ? avatarBubble.querySelector('.bubble-text') : null;
  const bubbleEmoji = avatarBubble ? avatarBubble.querySelector('.bubble-emoji') : null;

  const reactions = [
    { emoji: '👋', text: 'Hi! Looking for an analytical problem solver?' },
    { emoji: '⚡', text: 'Specialized in Applied AI, Workflows & Power BI (PL-300)' },
    { emoji: '📊', text: '119K+ hotel bookings & 1.05M fraud records audited' },
    { emoji: '🤖', text: 'Ask me about my autonomous AI agent pipelines!' },
    { emoji: '💬', text: 'Let\'s connect! Click to message me directly' }
  ];
  let reactionIndex = 0;

  if (avatarRing && avatarBubble) {
    // 3D Parallax Tilt tracking customer cursor
    avatarRing.addEventListener('mousemove', (e) => {
      const rect = avatarRing.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -16;
      const rotateY = ((x - centerX) / centerX) * 16;

      avatarRing.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      avatarRing.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      avatarRing.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    avatarRing.addEventListener('mouseleave', () => {
      avatarRing.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      avatarRing.style.setProperty('--mouse-x', '50%');
      avatarRing.style.setProperty('--mouse-y', '30%');
      if (bubbleEmoji && bubbleText) {
        bubbleEmoji.textContent = '👋';
        bubbleText.textContent = 'Hi! Need an analytical problem solver?';
        avatarBubble.style.borderColor = 'rgba(255, 255, 255, 0.18)';
      }
    });

    // Hover greeting to invite customer
    avatarRing.addEventListener('mouseenter', () => {
      if (bubbleText && bubbleEmoji) {
        bubbleEmoji.textContent = '💬';
        bubbleText.textContent = 'Click to chat with Mostafa or switch cards!';
        avatarBubble.style.borderColor = 'rgba(16, 185, 129, 0.6)';
      }
    });

    // Click reaction cycle
    avatarRing.addEventListener('click', () => {
      reactionIndex = (reactionIndex + 1) % reactions.length;
      if (bubbleText && bubbleEmoji) {
        bubbleEmoji.textContent = reactions[reactionIndex].emoji;
        bubbleText.textContent = reactions[reactionIndex].text;
      }
      avatarRing.style.transform = 'perspective(800px) scale(0.95)';
      setTimeout(() => {
        avatarRing.style.transform = 'perspective(800px) scale(1.06)';
      }, 140);
    });

    if (avatarBubble) {
      avatarBubble.addEventListener('click', () => {
        window.open('https://wa.me/201112611898?text=Hello%20Mostafa,%20I%20reviewed%20your%20portfolio%20and%20would%20like%20to%20connect.', '_blank');
      });
    }
  }

});
