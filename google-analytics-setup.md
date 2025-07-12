# Google Analytics Setup Instructions

## Step 1: Create Google Analytics Account
1. Go to https://analytics.google.com/
2. Sign in with your Google account
3. Click "Start measuring"
4. Enter account name: "R.I.S.E Foundation"
5. Choose data sharing settings
6. Click "Next"

## Step 2: Set up Property
1. Property name: "Rise Foundation Website"
2. Reporting time zone: "Nigeria"
3. Currency: "Nigerian Naira (₦)"
4. Click "Next"

## Step 3: Business Information
1. Industry category: "Non-profit"
2. Business size: "Small"
3. How you plan to use Google Analytics: Select relevant options
4. Click "Create"

## Step 4: Accept Terms of Service
1. Select "Nigeria" as your country
2. Accept the Google Analytics Terms of Service
3. Accept Data Processing Terms

## Step 5: Set up Data Stream
1. Choose "Web"
2. Website URL: https://risefoundationng.com
3. Stream name: "Rise Foundation Main Site"
4. Click "Create stream"

## Step 6: Install Tracking Code
Copy the Google tag (gtag.js) code provided and add it to the <head> section of your HTML files, right after the opening <head> tag.

Example code structure:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Replace GA_MEASUREMENT_ID with your actual measurement ID.

## Important Notes:
- The measurement ID will look like "G-XXXXXXXXXX"
- Add this code to ALL pages on your website
- Test the implementation using Google Analytics Real-Time reports
- It may take 24-48 hours for data to appear in reports
