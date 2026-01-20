# Copilot Instructions for Wanderlust Project

## Project Overview
**Wanderlust** is an Express.js web application for listing and reviewing rental properties. The application uses MongoDB for persistence, EJS for templating, and Passport.js for authentication.

### Key Stack
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB (via Mongoose 8.20.1)
- **Auth**: Passport.js (local strategy + passport-local-mongoose)
- **Templating**: EJS with ejs-mate for layouts
- **Validation**: Joi for schema validation

---

## Architecture & Data Flow

### Core Entities (Models)
1. **Listing** (`models/listing.js`) - Rental properties
   - Owned by a User (via `owner` ObjectId reference)
   - Contains array of Review ObjectIds
   - Has cascading delete: deleting a listing auto-deletes its reviews
   
2. **Review** (`models/review.js`) - Property reviews
   - References parent Listing
   - Contains rating (1-5) and comment
   
3. **User** (`models/user.js`) - Authentication
   - Uses `passportLocalMongoose` plugin for password hashing/serialization
   - Stores email and username (username added by plugin)

### Request Flow
1. **Middleware chain** (`app.js`):
   - Session + Flash messaging initialized
   - Passport authentication configured
   - `currentUser`, `success`, `error` made available in all views via `res.locals`

2. **Route organization**:
   - `/listings` → listingRouter (`routes/listing.js`)
   - `/listings/:id/reviews` → reviewRouter (`routes/review.js`)
   - `/` (auth routes) → userRouter (`routes/user.js`)

3. **Authorization pattern** (`middleware.js`):
   - `isLoggedIn()`: Redirects to login if unauthenticated; stores original URL in session
   - `isOwner()`: Checks if `req.user._id` matches listing owner
   - `saveRedirectUrl()`: Restores session URL after login for seamless redirects

---

## Developer Workflows

### Database Setup
```powershell
# MongoDB must be running locally on :27017
# Initialize database with sample data
node init/index.js
```

### Running the Application
```powershell
node app.js
# Server listens on http://localhost:8080
```

### Database Connection
- Connection string: `mongodb://localhost:27017/wanderlust`
- Configured in both `app.js` and `init/index.js`
- Change this URL if testing against different MongoDB instances

---

## Project-Specific Patterns & Conventions

### Error Handling
- **Custom ExpressError class** (`utils/ExpressError.js`): Takes `(statusCode, message)`
- **Error middleware** (end of `app.js`): Renders `error.ejs` with the full error object
- **wrapAsync pattern** (`utils/wrapAsync.js`): Wraps async route handlers to auto-catch errors
  - Always use `wrapAsync(async (req, res) => {...})` for async routes

### Validation Pattern
- Validation schemas defined in `schema.js` using Joi
- Route-level validators throw ExpressError before reaching handler
- Example: `validateListing()` and `validateReview()` check schema then call `next()`

### Listing Creation & Ownership
- New listing creation requires `isLoggedIn` middleware
- Owner field must be set manually (currently NOT auto-assigned in routes—manually add `listing.owner = req.user._id` in POST handler)
- Edit/delete routes require `isOwner` middleware to prevent cross-user modification

### Flash Messages
- Used for success/error notifications: `req.flash('success', 'message')`
- Messages available in all views as `success` and `error` arrays (from session)
- Cleared automatically after rendering

### Session & Redirect Pattern
- After login, user redirected to original URL stored in `req.session.redirectUrl`
- `saveRedirectUrl` middleware copies session URL to `res.locals` for template access
- Prevents users losing context when forced to authenticate

---

## Key Files by Responsibility

| File | Purpose |
|------|---------|
| `app.js` | Main server, middleware setup, error handling |
| `routes/listing.js` | CRUD operations for listings (index, new, create, edit, update, delete) |
| `routes/review.js` | Add/delete reviews for listings |
| `routes/user.js` | Signup, login, logout with Passport.js |
| `middleware.js` | Auth checks: `isLoggedIn`, `isOwner`, `saveRedirectUrl` |
| `schema.js` | Joi validation schemas for listings and reviews |
| `models/listing.js` | Mongoose schema + cascading delete post-hook |
| `utils/wrapAsync.js` | Async error wrapper—use for all async routes |
| `utils/ExpressError.js` | Custom error class with statusCode |

---

## Integration Points & Dependencies

- **Mongoose hooks**: `listingSchema.post('findOneAndDelete')` auto-deletes reviews
- **Passport serialization**: User stored in session via `serializeUser`/`deserializeUser`
- **EJS layouts**: Uses ejs-mate; boilerplate layout in `views/layouts/boilerplate.ejs`
- **method-override**: Enables PUT/DELETE via `_method` form parameter
- **express-session**: Session stored in memory (add store like MongoStore for production)

---

## Common Tasks

### Adding a New Listing Field
1. Update `Listing` schema in `models/listing.js`
2. Update Joi schema in `schema.js` (listingSchema)
3. Update form in `views/listings/new.ejs` and `views/listings/edit.ejs`
4. Route handlers automatically use spread operator: `{...req.body.listing}`

### Restricting Routes to Authenticated Users
- Add `isLoggedIn` middleware to route: `router.get('/path', isLoggedIn, wrapAsync(handler))`

### Debugging Database Issues
- Check MongoDB is running: `mongod` should be active on port 27017
- Verify MONGO_URL connection string matches your setup
- Use `console.log()` in async handlers (within try/catch or wrapAsync)

---

## Session & Secrets
- Session secret is hardcoded: `"mysupersecretcode"` (change for production)
- Session cookie expires after 7 days
- httpOnly flag prevents client-side script access

When working in this codebase, prioritize security (validate all inputs), async error handling (use wrapAsync), and ownership checks before modifying user data.
