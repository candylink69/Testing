// ============================================
// BUBBLE SYSTEM CORE - v1.0
// ============================================

(function() {
  'use strict';

  // ---------- CONFIGURATION ----------
  const STORAGE_KEY = 'bubble_system_state';
  const COOLDOWN_HOURS = 12;
  const TOTAL_BUBBLES = 8;
  
  // Smart Links (EXACT - No changes)
  const SMART_LINKS = {
    link1: 'https://encyclopediainsoluble.com/b4m2cdnq?key=f7aec115e88a384bd7f491fad307520f',
    link2: 'https://encyclopediainsoluble.com/ic3viem3?key=d8a39cb15c37e9d1cc63d60698447f0c',
    link3: 'https://encyclopediainsoluble.com/ttzdt6tvxv?key=463b39357a16bf8d3ceffa3a8fbf4bd5',
    link4: 'https://encyclopediainsoluble.com/fhgez7an?key=391cec1be41d65de0c6c381b80925b02'
  };

  // Bubble Configuration
  const BUBBLE_CONFIG = [
    { shape: 'shape-1.svg', link: SMART_LINKS.link1, toast: 'Horny 😈', toastClass: 'horny' },
    { shape: 'shape-2.svg', link: SMART_LINKS.link2, toast: 'Lucky 🍀', toastClass: 'lucky' },
    { shape: 'shape-3.svg', link: SMART_LINKS.link3, toast: 'Naughty 🔥', toastClass: 'naughty' },
    { shape: 'shape-4.svg', link: SMART_LINKS.link4, toast: 'Bad Luck 💔', toastClass: 'badluck' },
    { shape: 'shape-1.svg', link: null, toast: 'Horny 😈', toastClass: 'horny' },
    { shape: 'shape-2.svg', link: null, toast: 'Lucky 🍀', toastClass: 'lucky' },
    { shape: 'shape-3.svg', link: null, toast: 'Naughty 🔥', toastClass: 'naughty' },
    { shape: 'shape-4.svg', link: null, toast: 'Bad Luck 💔', toastClass: 'badluck' }
  ];

  // Heart Progress Messages
  const HEART_MESSAGES = [
    'Pop the bubbles and get horny',  // 0%
    'Good start 😏',                   // 12.5%
    'Nice 😉',                         // 25%
    'Naughty 🔥',                      // 37.5%
    'Hot 🥵',                          // 50%
    'Steamy 💦',                       // 62.5%
    'Ready to get horny 😈',           // 75%
    'Almost there... 💋',              // 87.5%
    'HORNY! 💕'                        // 100%
  ];

  // ---------- STATE ----------
  let poppedCount = 0;
  let bubbles = [];
  let heartFill, heartText;
  let uiGlowActive = false;
  let isInitialized = false;

  // ---------- STORAGE (CACHE) FUNCTIONS ----------
  function checkCooldown() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return false;
      
      const state = JSON.parse(data);
      const now = Date.now();
      const cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000;
      
      if (state.completed && (now - state.completedAt) < cooldownMs) {
        // Still in cooldown - apply UI glow
        applyUIGlow();
        return true;
      }
      
      // Cooldown expired or not completed
      if (state.completed && (now - state.completedAt) >= cooldownMs) {
        localStorage.removeItem(STORAGE_KEY);
      }
      
      return false;
    } catch (e) {
      console.warn('Bubble: Storage check failed', e);
      return false;
    }
  }

  function saveProgress(completed = false) {
    try {
      const state = {
        poppedCount: poppedCount,
        completed: completed,
        completedAt: completed ? Date.now() : null
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Bubble: Storage save failed', e);
    }
  }

  function loadProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const state = JSON.parse(data);
        if (!state.completed) {
          poppedCount = state.poppedCount || 0;
        }
      }
    } catch (e) {
      console.warn('Bubble: Storage load failed', e);
    }
  }

  // ---------- UI GLOW ----------
  function applyUIGlow() {
    if (!uiGlowActive) {
      document.body.classList.add('bubble-ui-glow');
      uiGlowActive = true;
    }
  }

  function removeUIGlow() {
    document.body.classList.remove('bubble-ui-glow');
    uiGlowActive = false;
  }

  // ---------- HEART PROGRESS ----------
  function createHeartProgress() {
    const wrapper = document.createElement('div');
    wrapper.className = 'bubble-heart-wrapper';
    wrapper.id = 'bubbleHeartWrapper';
    
    wrapper.innerHTML = `
      <div class="bubble-heart-container">
        <div class="bubble-heart-fill" id="bubbleHeartFill" style="height: 0%;"></div>
        <div class="bubble-heart-outline">❤️</div>
      </div>
      <div class="bubble-heart-text" id="bubbleHeartText">${HEART_MESSAGES[0]}</div>
    `;
    
    document.body.appendChild(wrapper);
    
    heartFill = document.getElementById('bubbleHeartFill');
    heartText = document.getElementById('bubbleHeartText');
  }

  function updateHeartProgress() {
    if (!heartFill || !heartText) return;
    
    const percentage = (poppedCount / TOTAL_BUBBLES) * 100;
    heartFill.style.height = percentage + '%';
    
    // Update message based on count
    const messageIndex = Math.min(poppedCount, HEART_MESSAGES.length - 1);
    heartText.textContent = HEART_MESSAGES[messageIndex];
    
    // Save progress to cache
    if (poppedCount < TOTAL_BUBBLES) {
      saveProgress(false);
    }
  }

  // ---------- TOAST MESSAGES ----------
  function showToast(message, className) {
    const toast = document.createElement('div');
    toast.className = `bubble-toast ${className}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 1500);
  }

  // ---------- KISS REWARD ----------
  function showKissReward() {
    // Play kiss sound
    if (typeof playKissSound === 'function') {
      playKissSound();
    }
    
    // Show kiss overlay
    const kiss = document.createElement('div');
    kiss.className = 'bubble-kiss-overlay';
    kiss.textContent = '💋';
    document.body.appendChild(kiss);
    
    setTimeout(() => {
      if (kiss.parentNode) {
        kiss.remove();
      }
    }, 2000);
    
    // Apply UI glow
    applyUIGlow();
    
    // Save completed state
    saveProgress(true);
  }

  // ---------- BUBBLE POP HANDLER ----------
  function handleBubblePop(bubble, config, index) {
    return function(e) {
      e.stopPropagation();
      
      // Prevent double pop
      if (bubble.dataset.popped === 'true') return;
      bubble.dataset.popped = 'true';
      
      // Play random pop sound
      if (typeof playRandomPopSound === 'function') {
        playRandomPopSound();
      }
      
      // Show toast message
      showToast(config.toast, config.toastClass);
      
      // Open link if exists
      if (config.link) {
        window.open(config.link, '_blank');
      }
      
      // Pop animation
      bubble.classList.add('bubble-system-pop');
      
      // Remove bubble after animation
      setTimeout(() => {
        if (bubble.parentNode) {
          bubble.remove();
        }
      }, 300);
      
      // Update progress
      poppedCount++;
      updateHeartProgress();
      
      // Check if all bubbles popped
      if (poppedCount >= TOTAL_BUBBLES) {
        // Remove all remaining bubbles
        document.querySelectorAll('.bubble-system-bubble').forEach(b => {
          if (b.parentNode && b.dataset.popped !== 'true') {
            b.remove();
          }
        });
        
        // Show kiss reward
        showKissReward();
      }
    };
  }

  // ---------- CREATE BUBBLES ----------
  function createBubble(config, index) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble-system-bubble';
    bubble.dataset.index = index;
    bubble.dataset.popped = 'false';
    
    // Random starting position (avoid edges)
    const padding = 80;
    const x = padding + Math.random() * (window.innerWidth - 2 * padding);
    const y = padding + Math.random() * (window.innerHeight - 2 * padding);
    
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
    
    // Random animation delay
    bubble.style.animationDelay = (Math.random() * 2) + 's';
    
    // Add SVG image
    const img = document.createElement('img');
    img.src = `bubble-system/assets/shapes/${config.shape}`;
    img.alt = 'Bubble';
    img.style.width = '100%';
    img.style.height = '100%';
    img.draggable = false;
    bubble.appendChild(img);
    
    // Add click handler
    bubble.addEventListener('click', handleBubblePop(bubble, config, index));
    
    document.body.appendChild(bubble);
    return bubble;
  }

  // ---------- RANDOM MOVEMENT ----------
  function startBubbleMovement() {
    setInterval(() => {
      document.querySelectorAll('.bubble-system-bubble').forEach(bubble => {
        if (bubble.dataset.popped === 'true') return;
        
        const currentLeft = parseFloat(bubble.style.left) || 0;
        const currentTop = parseFloat(bubble.style.top) || 0;
        
        // Random small movement
        const newLeft = currentLeft + (Math.random() - 0.5) * 30;
        const newTop = currentTop + (Math.random() - 0.5) * 30;
        
        // Keep within bounds
        const boundedLeft = Math.max(20, Math.min(window.innerWidth - 80, newLeft));
        const boundedTop = Math.max(20, Math.min(window.innerHeight - 80, newTop));
        
        bubble.style.left = boundedLeft + 'px';
        bubble.style.top = boundedTop + 'px';
      });
    }, 2000);
  }

  // ---------- INITIALIZE ----------
  function initialize() {
    if (isInitialized) return;
    
    // Check if in cooldown
    if (checkCooldown()) {
      console.log('Bubble: In cooldown period, bubbles hidden');
      return;
    }
    
    // Load saved progress
    loadProgress();
    
    // Create heart progress
    createHeartProgress();
    
    // Create bubbles
    BUBBLE_CONFIG.forEach((config, index) => {
      const bubble = createBubble(config, index);
      bubbles.push(bubble);
    });
    
    // Update heart with loaded progress
    updateHeartProgress();
    
    // If already completed before, show reward
    if (poppedCount >= TOTAL_BUBBLES) {
      showKissReward();
      // Remove all bubbles
      bubbles.forEach(b => {
        if (b.parentNode) b.remove();
      });
    } else {
      // Start random movement
      startBubbleMovement();
    }
    
    isInitialized = true;
    console.log('Bubble: System initialized');
  }

  // ---------- CLEANUP (Optional - for debugging) ----------
  window.bubbleSystemReset = function() {
    localStorage.removeItem(STORAGE_KEY);
    removeUIGlow();
    document.querySelectorAll('.bubble-system-bubble, .bubble-heart-wrapper, .bubble-toast, .bubble-kiss-overlay').forEach(el => el.remove());
    poppedCount = 0;
    isInitialized = false;
    initialize();
    console.log('Bubble: System reset');
  };

  // ---------- START WHEN DOM READY ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();
