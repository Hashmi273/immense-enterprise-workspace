# Immense Enterprise Workspace — User Guide

Welcome to the **Immense Enterprise Workspace**, the centralized portal for enterprise communications, proposal management, and technical diagnostics.

---

## 1. Getting Started & Logging In

### Accessing the Workspace
1. Navigate to `https://portal.immense.in/login` (or `http://localhost:5173/login` in development).
2. Enter your work email address and secure password.
3. Click **Sign In to Workspace**.

### Password Reset / Recovery
1. If you forget your password, click **Forgot password?** on the login screen.
2. Enter your work email to receive a recovery link.
3. Click the link in your email to navigate to `/reset-password` and specify a new secure password.

### Session Persistence & Sign Out
- Your authenticated session is persisted in encrypted client storage and automatically restored across browser refreshes.
- To end your session securely, click your user avatar / name in the upper-right corner and select **Sign Out**.

---

## 2. Enterprise Workspace Launcher (`/workspace`)

The central launcher displays applications explicitly authorized for your authenticated role and organization:

- **Personalized Header**: Shows your name, assigned organization (Central Enterprise, Immense Air Pvt Ltd, or Zion), and system role.
- **Application Cards**:
  - Displays application status, description, and entity classification.
  - Quick-search filter box to quickly find tools by name or keyword.
- **Entity Isolation**:
  - Staff belonging to Immense Air will only see Immense Air applications.
  - Staff belonging to Zion will only see Zion applications.

---

## 3. Error Code Intelligence Hub (`/apps/error-hub`)

The **Error Code Intelligence Hub** provides real-time, sub-millisecond search across 693 telecom error definitions (DLT, SMPP, MAP/SS7, Network).

### Key Features:
- **Instant Search**: Type error codes (e.g. `20A`, `408`, `51`) or description keywords (e.g. `timeout`, `congestion`, `bearer`) in the top search bar. Search execution occurs in sub-milliseconds.
- **Target Filtering**: Filter by All, Error Code Only, or Description Only.
- **Category Filter Tabs**:
  - *All Errors* (693 records)
  - *DLT & Regulatory* (207 records)
  - *MAP & SS7 Telephony* (167 records)
  - *SMPP & Gateway Protocol* (119 records)
  - *Network & Delivery* (68 records)
  - *System & General* (132 records)
- **One-Click Copying**: Click the copy icon next to any error code or description to copy it to your clipboard.
- **Shareable Deep Links**: Click the share icon on any error definition to copy a direct URL (e.g. `/apps/error-hub?error=20A`).

---

## 4. Immense Air Quotation Manager (`/apps/immense-quotes`)

The **Immense Air Quotation Manager** is the official proposal and contract generation engine for Immense Air Pvt Ltd.

### Creating & Managing Quotations:
1. **Client Particulars**: Enter the recipient's name, company, email, proposal valid date, and optional account manager info.
2. **Product Rate Cards**:
   - Toggle products: *Bulk SMS*, *RCS Business Messaging*, *WhatsApp Business API*, *Meta Messaging*, *OBD Voice Calls*, *Smart IVR*, *SMPP Gateway*.
   - Configure quantity tiers, base rates, setup fees, and discounts.
3. **Automatic Tax & Calculations**:
   - Computes base subtotal + 18% GST according to official Indian financial formatting (e.g. `₹20,060.00`).
4. **Quotation History**:
   - Save drafts and view past quotations with client names, dates, and amounts.
5. **A4 PDF Export & Print**:
   - Click **Print / Export PDF** to generate a pixel-perfect, double-sided or multi-page A4 proposal branded with Immense Air corporate styling.

---

## 5. Zion Quotation Manager (`/apps/zion-quotes`)

The **Zion Quotation Manager** is the dedicated proposal engine for Zion Marketing team members.

### Distinct Features & Zion Branding:
- **Branding**: Automatically styles proposals with Zion Marketing logo, color scheme (Navy `#102F68` and Orange `#FF6B00`), and footer contacts (`info@zionmarketing.in`).
- **All 9 Zion Products**:
  - *Bulk SMS*
  - *RCS Business Messaging*
  - *WhatsApp Business API*
  - *Meta Messaging & Ads Sync*
  - *OBD Voice Calls*
  - *Smart IVR Solutions*
  - *SMPP Connectivity*
  - *Enterprise APIs & CRM*
  - *Real Estate Project Solutions*
- **A4 PDF Generation**: Generates compliant proposals with Zion document formatting and "Connect. Communicate. Grow." identity.

---

## 6. Access Denied & Security Boundaries

If you attempt to access an application or route outside your authorized permissions (e.g. typing `/admin` or navigating to another organization's application):
- You will be redirected to `/access-denied`.
- A security audit event (`ACCESS_DENIED`) is securely recorded in the centralized audit log.
- Your session remains safe, and you can return to `/workspace` at any time.