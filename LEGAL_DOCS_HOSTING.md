# Hosting Privacy Policy & Terms & Conditions

## Quick URLs for Your App

Once you host these documents, use these URLs in your app:

### Option 1: GitHub Pages (Recommended - Free)
```
Privacy Policy: https://yourusername.github.io/ride-share-hub/privacy-policy.html
Terms & Conditions: https://yourusername.github.io/ride-share-hub/terms-and-conditions.html
```

### Option 2: Your Own Website
```
Privacy Policy: https://ridesharehub.com/privacy-policy
Terms & Conditions: https://ridesharehub.com/terms-and-conditions
```

### Option 3: Google Drive (Quick & Easy)
```
Privacy Policy: https://drive.google.com/file/d/YOUR_FILE_ID/view
Terms & Conditions: https://drive.google.com/file/d/YOUR_FILE_ID/view
```

---

## Hosting Methods

### Method 1: GitHub Pages (Recommended)

**Advantages:**
- Free forever
- Professional URLs
- Version control
- Easy updates
- Fast & reliable

**Steps:**

1. **Create GitHub Repository**
   ```bash
   # From your project directory
   git init
   git add .
   git commit -m "Initial commit with legal docs"
   git remote add origin https://github.com/yourusername/ride-share-hub.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: Deploy from branch
   - Branch: main / (root)
   - Save

3. **Create HTML Files** (already created below)

4. **Access URLs**
   - Wait 1-2 minutes for deployment
   - Visit: `https://yourusername.github.io/ride-share-hub/privacy-policy.html`

### Method 2: Google Drive

**Steps:**

1. **Convert to PDF**
   - Use any Markdown to PDF converter
   - Or copy to Google Docs and export as PDF

2. **Upload to Google Drive**
   - Upload both PDFs
   - Right-click → Share → Anyone with link can view
   - Copy link

3. **Get Direct Link**
   - Extract file ID from link
   - Format: `https://drive.google.com/file/d/FILE_ID/view`

### Method 3: Your Own Website

If you have a website (WordPress, etc.):
1. Create two new pages
2. Copy content from markdown files
3. Publish pages
4. Use those URLs

### Method 4: Free Hosting Services

**Netlify/Vercel:**
1. Create account
2. Drag & drop HTML files
3. Get instant URLs

**Firebase Hosting:**
1. Install Firebase CLI
2. `firebase init hosting`
3. Deploy HTML files
4. Get URLs

---

## HTML Files Created

I've converted both documents to HTML format below. Copy these to `.html` files:

### File Structure
```
ride-share-hub/
├── index.html (optional landing page)
├── privacy-policy.html
└── terms-and-conditions.html
```

---

## Using URLs in Your Flutter App

### Update in App Settings Screen

Create a settings screen with these links:

```dart
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class SettingsScreen extends StatelessWidget {
  static const privacyUrl = 'https://yourusername.github.io/ride-share-hub/privacy-policy.html';
  static const termsUrl = 'https://yourusername.github.io/ride-share-hub/terms-and-conditions.html';

  Future<void> _launchURL(String url) async {
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      throw Exception('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        children: [
          ListTile(
            leading: const Icon(Icons.privacy_tip),
            title: const Text('Privacy Policy'),
            trailing: const Icon(Icons.open_in_new),
            onTap: () => _launchURL(privacyUrl),
          ),
          ListTile(
            leading: const Icon(Icons.description),
            title: const Text('Terms & Conditions'),
            trailing: const Icon(Icons.open_in_new),
            onTap: () => _launchURL(termsUrl),
          ),
        ],
      ),
    );
  }
}
```

### Add dependency to pubspec.yaml
```yaml
dependencies:
  url_launcher: ^6.2.5
```

---

## Play Store Requirements

For Google Play Store submission, you MUST provide:

1. **Privacy Policy URL** (required)
2. **Terms of Service URL** (recommended)

Add these in Google Play Console:
- App content → Privacy Policy → Add URL
- Store listing → Contact details (optional)

---

## App Store Requirements

For Apple App Store:
- Privacy Policy URL in App Store Connect
- Terms of Use (optional but recommended)

---

## Important Notes

### Before Publishing:

1. **Update Contact Details**
   - Replace `support@ridesharehub.com` with your actual email
   - Add real phone number
   - Add business address

2. **Legal Review**
   - Have a lawyer review if possible
   - Ensure compliance with local laws
   - Update for specific business model

3. **Regular Updates**
   - Review annually
   - Update when adding features
   - Notify users of changes

### Compliance Checklist:

- [ ] Privacy Policy accessible from app
- [ ] Terms & Conditions accessible from app
- [ ] Both documents have last updated date
- [ ] Contact information is accurate
- [ ] Data collection practices clearly stated
- [ ] User rights explained
- [ ] Third-party services disclosed

---

## Quick Deploy Script

Create `deploy-docs.sh`:

```bash
#!/bin/bash

# Convert MD to HTML (requires pandoc)
pandoc PRIVACY_POLICY.md -o privacy-policy.html --standalone
pandoc TERMS_AND_CONDITIONS.md -o terms-and-conditions.html --standalone

# Commit and push
git add privacy-policy.html terms-and-conditions.html
git commit -m "Update legal documents"
git push origin main

echo "Documents deployed! Check GitHub Pages in 1-2 minutes."
```

---

## Need Help?

- **GitHub Pages Guide**: https://pages.github.com/
- **Markdown to HTML**: https://markdowntohtml.com/
- **URL Launcher Package**: https://pub.dev/packages/url_launcher

---

**Next Steps:**
1. Choose hosting method
2. Upload/deploy documents
3. Get final URLs
4. Add URLs to app
5. Test links work
6. Submit to app stores
