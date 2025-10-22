// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('[role="tab"]');
    const tabPanels = document.querySelectorAll('[role="tabpanel"]');
    
    // Tab switching functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetPanel = this.getAttribute('aria-controls');
            
            // Remove active class from all tabs and panels
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach(p => {
                p.classList.remove('active');
            });
            
            // Add active class to clicked tab and corresponding panel
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            document.getElementById(targetPanel).classList.add('active');
        });
        
        // Keyboard navigation for tabs
        tab.addEventListener('keydown', function(e) {
            // Prevent Enter key from working on the "Check This Out" tab (tab-3)
            if (e.key === 'Enter' && this.id === 'tab-3') {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            
            let newTab;
            const currentIndex = Array.from(tabs).indexOf(this);
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    newTab = currentIndex > 0 ? tabs[currentIndex - 1] : tabs[tabs.length - 1];
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    newTab = currentIndex < tabs.length - 1 ? tabs[currentIndex + 1] : tabs[0];
                    break;
                case 'Home':
                    e.preventDefault();
                    newTab = tabs[0];
                    break;
                case 'End':
                    e.preventDefault();
                    newTab = tabs[tabs.length - 1];
                    break;
                default:
                    return;
            }
            
            if (newTab) {
                newTab.focus();
                newTab.click();
            }
        });
    });
    
    // Modal functionality
    const modal = document.getElementById('pokemon-modal');
    const modalTrigger = document.getElementById('modal-trigger');
    const closeButton = document.querySelector('.close-button');
    const cancelButton = document.querySelector('.cancel-button');
    const form = document.getElementById('trainer-form');
    
    // Open modal
    modalTrigger.addEventListener('click', function() {
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus on first form field
        setTimeout(() => {
            document.getElementById('first-name').focus();
        }, 100);
    });
    
    // Close modal functions
    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        modalTrigger.focus();
    }
    
    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const favoritePokemon = formData.get('favoritePokemon');
        const otherPokemon = formData.get('otherPokemon');
        
        // Simple validation
        if (!firstName || !lastName || !favoritePokemon) {
            alert('Please fill in all fields');
            return;
        }
        
        // Validate "Other" Pokemon field if selected
        if (favoritePokemon === 'other' && !otherPokemon.trim()) {
            alert('Please specify your favorite Pokemon');
            otherPokemonInput.focus();
            return;
        }
        
        // Determine the final Pokemon name
        const finalPokemon = favoritePokemon === 'other' ? otherPokemon : favoritePokemon;
        
        // Add submission to table
        addSubmissionToTable(firstName, lastName, finalPokemon);
        
        // Show success message
        alert(`Thank you, ${firstName} ${lastName}! Your favorite Pokemon is ${finalPokemon}. Your trainer registration has been submitted!`);
        
        // Reset form and close modal
        form.reset();
        otherPokemonGroup.style.display = 'none';
        closeModal();
    });
    
    // Handle "Other" Pokemon option
    const favoritePokemonSelect = document.getElementById('favorite-pokemon');
    const otherPokemonGroup = document.getElementById('other-pokemon-group');
    const otherPokemonInput = document.getElementById('other-pokemon');
    
    favoritePokemonSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            otherPokemonGroup.style.display = 'block';
            otherPokemonInput.setAttribute('required', 'required');
            otherPokemonInput.focus();
        } else {
            otherPokemonGroup.style.display = 'none';
            otherPokemonInput.removeAttribute('required');
            otherPokemonInput.value = '';
        }
    });
    
    // Form field validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#dc3545';
                this.setAttribute('aria-invalid', 'true');
            } else {
                this.style.borderColor = '#dee2e6';
                this.setAttribute('aria-invalid', 'false');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#28a745';
                this.setAttribute('aria-invalid', 'false');
            }
        });
    });
    
    // Trap focus within modal
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        }
    });
    
    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation for images
    const images = document.querySelectorAll('.pokemon-img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            this.alt = 'Image failed to load';
        });
    });
    
    // Add keyboard navigation and interaction for Pokemon cards
    const pokemonCards = document.querySelectorAll('.pokemon-card');
    pokemonCards.forEach(card => {
        // Add keyboard event listeners
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Announce the accessibility example when activated
                const cardLabel = this.getAttribute('aria-label');
                announceToScreenReader(`Activated: ${cardLabel}`);
                
                // Add visual feedback
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                    this.style.boxShadow = '';
                }, 200);
            }
        });
        
        // Add focus event listeners for better screen reader experience
        card.addEventListener('focus', function() {
            const cardLabel = this.getAttribute('aria-label');
            announceToScreenReader(`Focused: ${cardLabel}. Press Enter or Space to activate.`);
        });
        
        // Add click event for mouse users
        card.addEventListener('click', function() {
            const cardLabel = this.getAttribute('aria-label');
            announceToScreenReader(`Clicked: ${cardLabel}`);
        });
    });
    
    // Add keyboard navigation and interaction for header and subheader
    const mainHeader = document.getElementById('main-header');
    const mainSubheading = document.getElementById('main-subheading');
    
    // Header interaction
    mainHeader.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            announceToScreenReader('Main page header activated: This is the main page header with title and instructions for the Evinced Screenreader Test Site');
            
            // Add visual feedback
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 5px 15px rgba(74, 144, 226, 0.3)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '';
            }, 300);
        }
    });
    
    mainHeader.addEventListener('focus', function() {
        announceToScreenReader('Main page header focused: This is the main page header with title and instructions for the Evinced Screenreader Test Site');
    });
    
    mainHeader.addEventListener('click', function() {
        announceToScreenReader('Main page header activated: This is the main page header with title and instructions for the Evinced Screenreader Test Site');
    });
    
    // Subheading interaction
    mainSubheading.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            announceToScreenReader('Instructions activated: Try and navigate through this page to the input modal and fill out the form. See if you can identify some of the accessibility issues on this page for bonus points');
            
            // Add visual feedback
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 3px 10px rgba(74, 144, 226, 0.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '';
            }, 300);
        }
    });
    
    mainSubheading.addEventListener('focus', function() {
        announceToScreenReader('Focused: Testing instructions. Press Enter or Space to activate.');
    });
    
    mainSubheading.addEventListener('click', function() {
        announceToScreenReader('Instructions clicked: Screen reader testing instructions activated');
    });
    
    // Add keyboard navigation and interaction for all other headings
    const headings = [
        { id: 'main-title', label: 'Main page title: TEST YOUR SCREENREADER MIGHT' },
        { id: 'media-heading', label: 'Media section heading: Examples of good and bad alt text' },
        { id: 'tablist-heading', label: 'Tablist section heading: Information Tabs' },
        { id: 'tab1-heading', label: 'Tab 1 heading: How are you getting on?' },
        { id: 'tab3-heading', label: 'Tab 3 heading: Form Submissions' },
        { id: 'buttons-heading', label: 'Buttons section heading: Interactive Buttons' },
        { id: 'modal-title', label: 'Modal title: CHOOSE YOUR POKEMON' },
        { id: 'footer-heading', label: 'Footer heading: This is a footer. Issues here might be repeated across an entire site.' }
    ];
    
    headings.forEach(heading => {
        const element = document.getElementById(heading.id);
        if (element) {
            // Add keyboard event listeners
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    announceToScreenReader(`Heading activated: ${heading.label}`);
                    
                    // Add visual feedback
                    this.style.transform = 'scale(1.02)';
                    this.style.boxShadow = '0 3px 10px rgba(74, 144, 226, 0.3)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                        this.style.boxShadow = '';
                    }, 300);
                }
            });
            
            // Add focus event listeners
            element.addEventListener('focus', function() {
                announceToScreenReader(`Focused: ${heading.label}. Press Enter or Space to activate.`);
            });
            
            // Add click event for mouse users
            element.addEventListener('click', function() {
                announceToScreenReader(`Heading clicked: ${heading.label}`);
            });
        }
    });
    
    // Sad trombone button functionality
    const sadTromboneButton = document.getElementById('sad-trombone-button');
    
    sadTromboneButton.addEventListener('click', function() {
        // Create audio context for realistic blowing raspberry sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create multiple oscillators for realistic raspberry effect
        const oscillators = [];
        const gainNodes = [];
        
        // Create 5 oscillators with more realistic frequencies and variations
        for (let i = 0; i < 5; i++) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            const lfo = audioContext.createOscillator();
            const lfoGain = audioContext.createGain();
            
            // LFO for realistic frequency modulation
            lfo.frequency.setValueAtTime(2 + Math.random() * 3, audioContext.currentTime);
            lfoGain.gain.setValueAtTime(5 + Math.random() * 10, audioContext.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // More realistic frequency ranges for raspberry
            const baseFreq = 30 + (i * 15) + Math.random() * 10;
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
            
            // Complex frequency variations for realistic raspberry
            const timePoints = [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75];
            timePoints.forEach((time, index) => {
                const variation = (Math.random() - 0.5) * 20;
                oscillator.frequency.setValueAtTime(baseFreq + variation, audioContext.currentTime + time);
            });
            
            // More realistic filtering
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(150 + Math.random() * 100, audioContext.currentTime);
            filter.Q.setValueAtTime(0.5 + Math.random() * 0.5, audioContext.currentTime);
            
            // Realistic volume envelope with multiple peaks
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.04, audioContext.currentTime + 0.005);
            
            // Multiple volume peaks for realistic raspberry
            const volumePeaks = [0.1, 0.25, 0.4, 0.55, 0.7];
            volumePeaks.forEach(peak => {
                gainNode.gain.setValueAtTime(0.06 + Math.random() * 0.03, audioContext.currentTime + peak);
            });
            
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2);
            
            oscillators.push(oscillator);
            gainNodes.push(gainNode);
            
            // Start LFO
            lfo.start(audioContext.currentTime);
            lfo.stop(audioContext.currentTime + 1.2);
        }
        
        // Enhanced noise for realistic raspberry texture
        const bufferSize = audioContext.sampleRate * 1.2;
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        // Create more realistic noise with varying intensity
        for (let i = 0; i < bufferSize; i++) {
            const time = i / audioContext.sampleRate;
            const intensity = Math.sin(time * Math.PI * 2) * 0.5 + 0.5; // Varying intensity
            output[i] = (Math.random() * 2 - 1) * intensity * 0.3;
        }
        
        const noiseSource = audioContext.createBufferSource();
        const noiseGain = audioContext.createGain();
        const noiseFilter = audioContext.createBiquadFilter();
        const noiseFilter2 = audioContext.createBiquadFilter();
        
        noiseSource.buffer = noiseBuffer;
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseFilter2);
        noiseFilter2.connect(noiseGain);
        noiseGain.connect(audioContext.destination);
        
        // More realistic noise filtering
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(400, audioContext.currentTime);
        noiseFilter.Q.setValueAtTime(0.3, audioContext.currentTime);
        
        noiseFilter2.type = 'highpass';
        noiseFilter2.frequency.setValueAtTime(50, audioContext.currentTime);
        noiseFilter2.Q.setValueAtTime(0.1, audioContext.currentTime);
        
        // Realistic noise volume envelope
        noiseGain.gain.setValueAtTime(0, audioContext.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
        
        const noisePeaks = [0.1, 0.3, 0.5, 0.7, 0.9];
        noisePeaks.forEach(peak => {
            noiseGain.gain.setValueAtTime(0.1 + Math.random() * 0.05, audioContext.currentTime + peak);
        });
        
        noiseGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2);
        
        // Start all sounds
        oscillators.forEach(osc => {
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 1.2);
        });
        
        noiseSource.start(audioContext.currentTime);
        noiseSource.stop(audioContext.currentTime + 1.2);
        
        // Add visual feedback with raspberry colors
        this.style.transform = 'scale(0.95)';
        this.style.backgroundColor = '#ff69b4';
        this.style.border = '3px solid #ff1493';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = '';
            this.style.border = '';
        }, 1200);
    });
    
    // Add announcement for screen readers when modal opens/closes
    const announceToScreenReader = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    };
    
    // Update modal trigger to announce when modal opens
    modalTrigger.addEventListener('click', function() {
        setTimeout(() => {
            announceToScreenReader('Modal opened. Use Tab to navigate through the form fields.');
        }, 200);
    });
    
    closeButton.addEventListener('click', function() {
        announceToScreenReader('Modal closed.');
    });
    
    // Function to add form submission to the table
    // GitHub API configuration - uses config.js
    const GITHUB_REPO = window.GITHUB_CONFIG?.REPO || 'chriskeene-evinced/chriskeene-evinced.github.io';
    const GITHUB_TOKEN = window.GITHUB_CONFIG?.TOKEN || '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';
    const DATA_FILE = window.GITHUB_CONFIG?.DATA_FILE || 'submissions.json';
    
    // Function to save submissions to GitHub
    async function saveSubmissionsToGitHub() {
        // Check if GitHub integration is properly configured
        if (GITHUB_REPO === 'your-username/your-repo-name' || GITHUB_TOKEN === 'your-github-token') {
            console.warn('GitHub integration not configured. Using localStorage fallback.');
            saveSubmissionsToStorage();
            return;
        }
        
        const submissions = [];
        const tbody = document.getElementById('submissions-tbody');
        const rows = tbody.querySelectorAll('tr:not(.no-submissions)');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                submissions.push({
                    name: cells[0].textContent,
                    pokemon: cells[1].textContent,
                    timestamp: cells[2].textContent
                });
            }
        });
        
        try {
            // Get current file content to get SHA
            const getResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${DATA_FILE}`, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            let sha = null;
            if (getResponse.ok) {
                const fileData = await getResponse.json();
                sha = fileData.sha;
            }
            
            // Create or update the file
            const content = btoa(JSON.stringify(submissions, null, 2));
            const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${DATA_FILE}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Update submissions data',
                    content: content,
                    sha: sha
                })
            });
            
            if (!response.ok) {
                console.error('Failed to save to GitHub:', await response.text());
                // Fallback to localStorage
                saveSubmissionsToStorage();
            } else {
                console.log('Successfully saved submissions to GitHub');
            }
        } catch (error) {
            console.error('Error saving to GitHub:', error);
            // Fallback to localStorage
            saveSubmissionsToStorage();
        }
    }
    
    // Function to save submissions to localStorage (fallback)
    function saveSubmissionsToStorage() {
        const submissions = [];
        const tbody = document.getElementById('submissions-tbody');
        const rows = tbody.querySelectorAll('tr:not(.no-submissions)');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                submissions.push({
                    name: cells[0].textContent,
                    pokemon: cells[1].textContent,
                    timestamp: cells[2].textContent
                });
            }
        });
        
        localStorage.setItem('pokemonSubmissions', JSON.stringify(submissions));
    }
    
    // Function to load submissions from GitHub
    async function loadSubmissionsFromGitHub() {
        // Check if GitHub integration is properly configured
        if (GITHUB_REPO === 'your-username/your-repo-name' || GITHUB_TOKEN === 'your-github-token') {
            console.warn('GitHub integration not configured. Using localStorage fallback.');
            loadSubmissionsFromStorage();
            return;
        }
        
        try {
            const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${DATA_FILE}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.ok) {
                const fileData = await response.json();
                const submissions = JSON.parse(atob(fileData.content));
                displaySubmissions(submissions);
                console.log('Successfully loaded submissions from GitHub');
            } else {
                console.warn('Failed to load from GitHub, using localStorage fallback');
                // Fallback to localStorage
                loadSubmissionsFromStorage();
            }
        } catch (error) {
            console.error('Error loading from GitHub:', error);
            // Fallback to localStorage
            loadSubmissionsFromStorage();
        }
    }
    
    // Function to display submissions in the table
    function displaySubmissions(submissions) {
        const tbody = document.getElementById('submissions-tbody');
        
        // Clear existing content
        tbody.innerHTML = '';
        
        if (submissions.length > 0) {
            submissions.forEach(submission => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${submission.name}</td>
                    <td>${submission.pokemon}</td>
                    <td>${submission.timestamp}</td>
                    <td>
                        <button class="delete-button" onclick="deleteSubmission(this)" aria-label="Delete submission for ${submission.name}">
                            🗑️ Delete
                        </button>
                    </td>
                `;
                tbody.appendChild(newRow);
            });
        } else {
            // Add "No submissions yet" row if no submissions
            const noSubmissionsRow = document.createElement('tr');
            noSubmissionsRow.innerHTML = '<td colspan="4" class="no-submissions" role="cell">No submissions yet</td>';
            tbody.appendChild(noSubmissionsRow);
        }
    }
    
    // Fallback function to load from localStorage
    function loadSubmissionsFromStorage() {
        const savedSubmissions = localStorage.getItem('pokemonSubmissions');
        if (savedSubmissions) {
            const submissions = JSON.parse(savedSubmissions);
            displaySubmissions(submissions);
        } else {
            displaySubmissions([]);
        }
    }
    
    function addSubmissionToTable(firstName, lastName, favoritePokemon) {
        const tbody = document.getElementById('submissions-tbody');
        const timestamp = new Date().toLocaleString();
        
        // Remove "No submissions yet" row if it exists
        const noSubmissionsRow = tbody.querySelector('.no-submissions');
        if (noSubmissionsRow) {
            noSubmissionsRow.remove();
        }
        
        // Create new table row
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${firstName} ${lastName}</td>
            <td>${favoritePokemon}</td>
            <td>${timestamp}</td>
            <td>
                <button class="delete-button" onclick="deleteSubmission(this)" aria-label="Delete submission for ${firstName} ${lastName}">
                    🗑️ Delete
                </button>
            </td>
        `;
        
        // Add row to the beginning of the table
        tbody.insertBefore(newRow, tbody.firstChild);
        
        // Save to GitHub
        saveSubmissionsToGitHub();
        
        // Announce to screen readers
        announceToScreenReader(`New submission added: ${firstName} ${lastName} chose ${favoritePokemon}`);
    }
    
    // Function to delete a submission
    window.deleteSubmission = function(button) {
        const row = button.closest('tr');
        const name = row.cells[0].textContent;
        const pokemon = row.cells[1].textContent;
        
        // Remove the row
        row.remove();
        
        // Check if table is now empty
        const tbody = document.getElementById('submissions-tbody');
        if (tbody.children.length === 0) {
            // Add "No submissions yet" row
            const noSubmissionsRow = document.createElement('tr');
            noSubmissionsRow.innerHTML = '<td colspan="4" class="no-submissions">No submissions yet</td>';
            tbody.appendChild(noSubmissionsRow);
        }
        
        // Save to GitHub after deletion
        saveSubmissionsToGitHub();
        
        // Announce deletion to screen readers
        announceToScreenReader(`Submission deleted: ${name} - ${pokemon}`);
    }

    // Add event listeners for focusable text content
    const focusableTextElements = document.querySelectorAll('p[role="text"], div[role="text"]');
    
    focusableTextElements.forEach(element => {
        // Focus event - announce content to screen readers
        element.addEventListener('focus', function() {
            const label = this.getAttribute('aria-label') || this.textContent.trim();
            announceToScreenReader(`Focused: ${label}`);
        });
        
        // Click event - announce activation
        element.addEventListener('click', function() {
            const label = this.getAttribute('aria-label') || this.textContent.trim();
            announceToScreenReader(`Activated: ${label}`);
        });
        
        // Keydown event - handle Enter and Space
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const label = this.getAttribute('aria-label') || this.textContent.trim();
                announceToScreenReader(`Activated: ${label}`);
            }
        });
    });
    
    // Add event listeners for Rick Astley lyrics elements
    const lyricsElements = document.querySelectorAll('#song-title, #song-artist, #verse-1, #verse-2, #verse-3, #pre-chorus-1, #pre-chorus-2, #chorus-1, #chorus-2, #chorus-3, #bridge, #ad-lib');
    
    lyricsElements.forEach(element => {
        // Focus event - announce content to screen readers
        element.addEventListener('focus', function() {
            const label = this.getAttribute('aria-label') || this.textContent.trim();
            announceToScreenReader(`Song element focused: ${label}`);
        });
        
        // Click event - announce activation
        element.addEventListener('click', function() {
            const label = this.getAttribute('aria-label') || this.textContent.trim();
            announceToScreenReader(`Song element activated: ${label}`);
        });
        
        // Keydown event - handle Enter and Space
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const label = this.getAttribute('aria-label') || this.textContent.trim();
                announceToScreenReader(`Song element activated: ${label}`);
            }
        });
    });

    // Add event listeners for footer elements to announce they are in the footer
    const footerLinks = document.querySelectorAll('footer a');
    const footerText = document.querySelector('.footer-text');
    
    footerLinks.forEach(link => {
        link.addEventListener('focus', function() {
            const label = this.getAttribute('aria-label') || this.textContent.trim();
            announceToScreenReader(`Footer link focused: ${label}`);
        });
        
        link.addEventListener('click', function() {
            const label = this.getAttribute('aria-label') || this.textContent.trim();
            announceToScreenReader(`Footer link activated: ${label}`);
        });
    });
    
    if (footerText) {
        footerText.addEventListener('focus', function() {
            const label = this.getAttribute('aria-label') || this.textContent.trim();
            announceToScreenReader(`Footer text focused: ${label}`);
        });
        
        footerText.addEventListener('click', function() {
            const label = this.getAttribute('aria-label') || this.textContent.trim();
            announceToScreenReader(`Footer text activated: ${label}`);
        });
    }
    
    // Load submissions from GitHub when page loads
    loadSubmissionsFromGitHub();
});
