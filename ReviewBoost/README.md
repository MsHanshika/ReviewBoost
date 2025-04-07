# ReviewBoost

ReviewBoost is a streamlined app designed specifically for small businesses aiming to enhance their Google Maps visibility through authentic customer reviews. Focused on simplicity and effectiveness, this application helps businesses collect customer contact information and direct them to leave reviews.

## Key Features

### QR Code Generator
- Generate simple black and white QR codes that link directly to your customer contact form
- Automatically redirect customers to your Google Maps review page after form submission
- Download your QR code for printing and display in your store

### Message Templates
- Create and save custom SMS and email templates for review requests
- Set delay times for automated sending
- Manage multiple templates for different customer touchpoints

## User Flow

1. **Business Owner**: Generates a QR code with their Google Maps business link
2. **Customer**: Scans the QR code when visiting the business
3. **Customer**: Fills out a form with their contact information
4. **System**: Sends a thank-you email to the customer
5. **Customer**: Gets redirected to the business's Google Maps page to leave a review

## Implementation Notes

- The application is designed with a clean, compact interface
- No unnecessary visual elements or customization options
- Complete contact information collection with form validation
- Automatic redirect to Google Maps after form submission
- Local storage for saving business information and templates

## Setup

1. Clone this repository
2. Open `index.html` in your browser
3. No server setup required - the app runs entirely in the browser

## Technologies Used

- HTML5
- CSS3
- JavaScript
- QRCode.js library for QR code generation
- Font Awesome for icons
- localStorage API for data persistence

## Browser Compatibility

The app is designed to work with modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge