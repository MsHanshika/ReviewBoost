document.addEventListener('DOMContentLoaded', function() {
    // Helper function to extract and format Google Maps review URL
    // Updated getReviewUrl function for js/script.js
    function getReviewUrl(googleMapsUrl) {
        // Default in case parsing fails
        if (!googleMapsUrl || typeof googleMapsUrl !== 'string') {
             return 'https://maps.google.com';
        }
    
        try {
           // Format 1: https://maps.google.com/?cid=12345
           if (googleMapsUrl.includes('cid=')) {
               const cid = googleMapsUrl.split('cid=')[1].split('&')[0];
                // Direct link to the review dialog using the CID
                return `https://search.google.com/local/writereview?placeid=${cid}`;
           }
        
           // Format 2: Place ID extraction from URLs containing "place_id"
           if (googleMapsUrl.includes('place_id=')) {
              const placeId = googleMapsUrl.split('place_id=')[1].split('&')[0];
              return `https://search.google.com/local/writereview?placeid=${placeId}`;
           }
        
           // Format 3: https://maps.app.goo.gl/abcXYZ (shortened URLs)
           if (googleMapsUrl.includes('maps.app.goo.gl') || googleMapsUrl.includes('goo.gl/maps/')) {
               // For shortened URLs, we need to expand them first
               // Since we can't do this client-side, we'll append review parameters
               return googleMapsUrl + (googleMapsUrl.includes('?') ? '&' : '?') + 'review=1&action=write';
           }
        
            // Format 4: https://www.google.com/maps/place/...
           if (googleMapsUrl.includes('/maps/place/')) {
               // Extract place ID from the URL if present
               const placeIdMatch = googleMapsUrl.match(/place_id=([^&]+)/);
               if (placeIdMatch) {
                   return `https://search.google.com/local/writereview?placeid=${placeIdMatch[1]}`;
               }
               // If no place_id, try to extract the place name and add review parameters
               const placeName = googleMapsUrl.split('/place/')[1].split('/')[0];
               return `https://www.google.com/maps/place/${placeName}/?review=1&action=write`;
           }
        
           // Format 5: Direct review URL
           if (googleMapsUrl.includes('writereview')) {
               return googleMapsUrl;
           }
        
           // Default fallback - append review parameters
           return googleMapsUrl + (googleMapsUrl.includes('?') ? '&' : '?') + 'review=1&action=write';
       } catch (error) {
          console.error('Error parsing Google Maps URL:', error);
        return googleMapsUrl;
      }
  }
    
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Template Type Selection
    const templateTypeBtns = document.querySelectorAll('.template-type');
    
    templateTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all template type buttons
            templateTypeBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update placeholder text based on selection
            const templateType = this.getAttribute('data-type');
            const templateTextarea = document.getElementById('message-template');
            
            if (templateType === 'sms') {
                templateTextarea.placeholder = "Thank you for shopping with us! We'd love to hear about your experience. Please consider leaving us a review: {{REVIEW_LINK}}";
            } else if (templateType === 'email') {
                templateTextarea.placeholder = "Dear Customer,\n\nThank you for your recent purchase from our store! We hope you're enjoying your new items.\n\nWe'd greatly appreciate it if you could take a moment to leave us a review on Google Maps. Your feedback helps us improve and helps other customers discover our business.\n\nYou can leave a review here: {{REVIEW_LINK}}\n\nThank you for your support!\n\nWarm regards,\nYour Business Name";
            }
        });
    });
    
    // QR Code Generator
    const generateQRBtn = document.getElementById('generate-qr');
    const businessLinkInput = document.getElementById('business-link');
    const businessNameInput = document.getElementById('business-name');
    const qrResult = document.getElementById('qr-result');

    if (generateQRBtn && businessLinkInput && qrResult) {
        generateQRBtn.addEventListener('click', function() {
            const businessLink = businessLinkInput.value.trim();
            const businessName = businessNameInput.value.trim();
            
            if (!businessLink) {
                alert('Please enter your Google Maps business link');
                return;
            }
            
            // Store the business link for use in the form submission
            localStorage.setItem('reviewboost-business-link', businessLink);
            if (businessName) {
                localStorage.setItem('reviewboost-business-name', businessName);
            }

            // Clear previous QR code
            qrResult.innerHTML = '';

            // Create actual QR code URL - this will be a URL to our form page,
            // which we simulate with a fragment identifier in this demo
            const formUrl = window.location.href.split('#')[0] + '#showForm';

            // Generate new QR code (black and white only)
            const qrcode = new QRCode(qrResult, {
                text: formUrl,
                width: 180,
                height: 180,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // Add business name label if provided
            if (businessName) {
                setTimeout(() => {
                    const nameLabel = document.createElement('div');
                    nameLabel.textContent = businessName;
                    nameLabel.style.textAlign = 'center';
                    nameLabel.style.marginTop = '10px';
                    nameLabel.style.fontWeight = '600';
                    nameLabel.style.fontFamily = "'Open Sans', sans-serif";
                    nameLabel.style.fontSize = '16px';
                    qrResult.appendChild(nameLabel);
                }, 100);
            }

            // Add download button
            setTimeout(() => {
                const downloadBtn = document.createElement('button');
                downloadBtn.textContent = 'Download QR Code';
                downloadBtn.className = 'generate-button';
                downloadBtn.style.marginTop = '20px';
                downloadBtn.addEventListener('click', function() {
                    // Create a temporary canvas to combine QR code and label
                    const canvas = document.createElement('canvas');
                    const qrCanvas = qrResult.querySelector('canvas');
                    const labelHeight = businessName ? 30 : 0;
                    
                    canvas.width = qrCanvas.width;
                    canvas.height = qrCanvas.height + labelHeight;
                    
                    const ctx = canvas.getContext('2d');
                    // Fill background
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // Draw QR code
                    ctx.drawImage(qrCanvas, 0, 0);
                    
                    // Add label if business name is provided
                    if (businessName) {
                        ctx.fillStyle = '#000000';
                        ctx.font = '600 16px "Open Sans", sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText(businessName, canvas.width / 2, qrCanvas.height + 20);
                    }
                    
                    // Create download link
                    const link = document.createElement('a');
                    const fileName = businessName ? 
                        businessName.toLowerCase().replace(/\s+/g, '-') + '-qrcode.png' : 
                        'reviewboost-qrcode.png';
                    
                    link.download = fileName;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                });
                qrResult.appendChild(downloadBtn);
            }, 200);
        });
    }

    // Save templates to local storage
    const saveTemplateBtn = document.getElementById('save-template');
    const templateList = document.getElementById('template-list');
    
    // Load templates from local storage on page load
    const loadTemplates = function() {
        const templates = JSON.parse(localStorage.getItem('reviewboost-templates')) || [];
        
        if (templates.length > 0) {
            // Clear empty state
            templateList.innerHTML = '';
            
            // Create template items
            templates.forEach(template => {
                createTemplateItem(template);
            });
        }
    };
    
    // Create template item in UI
    const createTemplateItem = function(template) {
        const templateItem = document.createElement('div');
        templateItem.className = 'template-item';
        templateItem.dataset.type = template.type;
        templateItem.dataset.id = template.id;
        
        const templateHTML = `
            <div class="template-item-header">
                <h4>${template.name}</h4>
                <div class="template-item-actions">
                    <button class="edit-template"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-template"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
            <div class="template-meta">
                <span class="template-type-badge ${template.type}">${template.type.toUpperCase()}</span>
                <span class="template-delay">Send after: ${template.delay} hours</span>
            </div>
            <div class="template-content">${template.message.replace(/\n/g, '<br>')}</div>
        `;
        
        templateItem.innerHTML = templateHTML;
        templateList.appendChild(templateItem);
        
        // Add event listeners to template actions
        const deleteBtn = templateItem.querySelector('.delete-template');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                deleteTemplate(template.id);
                templateList.removeChild(templateItem);
                
                // If no templates left, show empty state
                if (templateList.children.length === 0) {
                    templateList.innerHTML = '<p class="empty-state">No templates yet. Create your first template above.</p>';
                }
            });
        }
        
        const editBtn = templateItem.querySelector('.edit-template');
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                // Set form values to template values
                document.getElementById('template-name').value = template.name;
                document.getElementById('message-template').value = template.message;
                document.getElementById('delay-time').value = template.delay;
                
                // Set template type
                document.querySelectorAll('.template-type').forEach(btn => {
                    if (btn.getAttribute('data-type') === template.type) {
                        btn.click();
                    }
                });
                
                // Set currently editing template ID
                saveTemplateBtn.dataset.editingId = template.id;
                
                // Update button text
                saveTemplateBtn.textContent = 'Update Template';
                
                // Scroll to form
                document.querySelector('.template-editor').scrollIntoView({ behavior: 'smooth' });
            });
        }
    };
    
    // Delete template from local storage
    const deleteTemplate = function(id) {
        let templates = JSON.parse(localStorage.getItem('reviewboost-templates')) || [];
        templates = templates.filter(template => template.id !== id);
        localStorage.setItem('reviewboost-templates', JSON.stringify(templates));
    };
    
    if (saveTemplateBtn) {
        saveTemplateBtn.addEventListener('click', function() {
            const templateName = document.getElementById('template-name').value.trim();
            const messageTemplate = document.getElementById('message-template').value.trim();
            const delayTime = document.getElementById('delay-time').value;
            const templateType = document.querySelector('.template-type.active').getAttribute('data-type');
            const editingId = saveTemplateBtn.dataset.editingId;
            
            if (!templateName || !messageTemplate) {
                alert('Please enter both a template name and message');
                return;
            }
            
            // Create template object
            const template = {
                id: editingId || Date.now().toString(),
                name: templateName,
                message: messageTemplate,
                delay: delayTime,
                type: templateType
            };
            
            // Save to local storage
            let templates = JSON.parse(localStorage.getItem('reviewboost-templates')) || [];
            
            if (editingId) {
                // Update existing template
                templates = templates.map(t => t.id === editingId ? template : t);
            } else {
                // Add new template
                templates.push(template);
            }
            
            localStorage.setItem('reviewboost-templates', JSON.stringify(templates));
            
            // Remove empty state message if present
            const emptyState = templateList.querySelector('.empty-state');
            if (emptyState) {
                templateList.removeChild(emptyState);
            }
            
            // If editing, remove old template from UI
            if (editingId) {
                const oldItem = templateList.querySelector(`[data-id="${editingId}"]`);
                if (oldItem) {
                    templateList.removeChild(oldItem);
                }
            }
            
            // Add template to UI
            createTemplateItem(template);
            
            // Clear form
            document.getElementById('template-name').value = '';
            document.getElementById('message-template').value = '';
            document.getElementById('delay-time').value = '24';
            saveTemplateBtn.dataset.editingId = '';
            saveTemplateBtn.textContent = 'Save Template';
            
            // Show success message
            alert(editingId ? 'Template updated successfully!' : 'Template saved successfully!');
        });
    }
    
    // Load saved templates on page load
    loadTemplates();
    
    // Help Modal
    const helpButton = document.querySelector('.help-button');
    const helpModal = document.getElementById('help-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (helpButton && helpModal && closeModal) {
        helpButton.addEventListener('click', function() {
            helpModal.style.display = 'flex';
        });
        
        closeModal.addEventListener('click', function() {
            helpModal.style.display = 'none';
        });
        
        // Close modal when clicking outside content
        helpModal.addEventListener('click', function(e) {
            if (e.target === helpModal) {
                helpModal.style.display = 'none';
            }
        });
    }
    
    // User Form Modal (simulate QR code scan)
    const userFormModal = document.getElementById('user-form-modal');
    const userContactForm = document.getElementById('user-contact-form');
    const formMessage = document.getElementById('form-message');
    
    // Check if the URL has the showForm hash (simulating QR scan)
    if (window.location.hash === '#showForm') {
        showUserForm();
    }
    
    // Handle back button and hash changes
    window.addEventListener('hashchange', function() {
        if (window.location.hash === '#showForm') {
            showUserForm();
        } else {
            userFormModal.style.display = 'none';
        }
    });
    
    function showUserForm() {
        userFormModal.style.display = 'flex';
        
        // Reset form
        userContactForm.reset();
        formMessage.innerHTML = '';
        formMessage.className = 'form-message';
    }
    
    // Handle form submission
    if (userContactForm) {
        userContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('user-name').value;
            const phone = document.getElementById('user-phone').value;
            const email = document.getElementById('user-email').value;
            
            // Simple validation
            if (!name || !phone || !email) {
                formMessage.textContent = 'Please fill out all fields.';
                formMessage.className = 'form-message error';
                return;
            }
            
            // In a real application, you would send this data to your server
            // For this demo, we'll simulate a successful submission
            
            // Show success message
            formMessage.textContent = 'Thank you! Sending confirmation email...';
            formMessage.className = 'form-message success';
            
            // Simulate email sending delay
            setTimeout(function() {
                const businessLink = localStorage.getItem('reviewboost-business-link') || 'https://maps.google.com';
                const reviewUrl = getReviewUrl(businessLink);
                
                // Store user data in localStorage (in a real app, this would go to a server)
                const userData = {
                    name: name,
                    phone: phone,
                    email: email,
                    timestamp: new Date().toISOString()
                };
                
                // Save to localStorage (optional)
                let customers = JSON.parse(localStorage.getItem('reviewboost-customers')) || [];
                customers.push(userData);
                localStorage.setItem('reviewboost-customers', JSON.stringify(customers));
                
                // Update message
                formMessage.textContent = 'Email sent successfully! Redirecting to Google Maps review page...';
                
                // Redirect to Google Maps review page after a short delay
                setTimeout(function() {
                    window.location.href = reviewUrl;
                }, 1500);
            }, 1500);
        });
    }
    
    // Add helper links to the form for testing
    const businessLink = localStorage.getItem('reviewboost-business-link');
    if (businessLink && formMessage) {
        const testLink = document.createElement('div');
        testLink.className = 'test-links';
        testLink.style.marginTop = '15px';
        testLink.style.fontSize = '0.8em';
        testLink.style.color = '#666';
        testLink.innerHTML = '<p><small><strong>Debug:</strong> Direct link to <a href="' + businessLink + '" target="_blank">original Maps link</a> | <a href="' + getReviewUrl(businessLink) + '" target="_blank">review page</a></small></p>';
        formMessage.after(testLink);
    }
});
