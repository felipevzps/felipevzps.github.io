// =======================================================
// HOVER SOUND EFFECT - Simulate Mechanical Keyboard Click
// =======================================================

class HoverSoundGenerator {
  constructor() {
    // Create AudioContext (only once)
    this.audioContext = null;
    this.initialized = false;
  }

  // Initialize AudioContext on first user interaction
  init() {
    if (!this.initialized) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    }
  }

  // Create a satisfying mechanical keyboard click sound
  playSound(frequency = 800, duration = 0.08) {
    if (!this.initialized) return;

    const now = this.audioContext.currentTime;
    
    // Create oscillator (generates the tone)
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    // Create filter for a more realistic "clicky" sound
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(frequency * 2, now);
    filter.Q.setValueAtTime(1, now);

    // Connect nodes: oscillator -> filter -> gain -> output
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Oscillator settings (sine wave for smooth sound)
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);
    
    // Quick frequency sweep for "click" effect
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, now + duration);

    // Volume envelope (quick attack, quick decay)
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.005); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration); // Quick decay

    // Play sound
    oscillator.start(now);
    oscillator.stop(now + duration);
  }
}

// Initialize sound generator
const soundGen = new HoverSoundGenerator();

// Add sound to all contact-row elements
document.addEventListener('DOMContentLoaded', () => {
  const contactRows = document.querySelectorAll('.contact-row');
  
  // Different frequencies for each button (creating variation)
  const frequencies = [450, 500, 420, 480, 550]; // 400-600Hz range "creamy"
  
  contactRows.forEach((row, index) => {
    row.addEventListener('mouseenter', () => {
      // Initialize on first interaction (required by browsers)
      soundGen.init();
      
      // Play sound with unique frequency for this button
      const freq = frequencies[index % frequencies.length];
      soundGen.playSound(freq, 0.08);
    });
  });
});
