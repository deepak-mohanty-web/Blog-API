import { rateLimit } from 'express-rate-limit';

//configure rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 60000, // 1-min time window for req limiting
  limit: 60, // allow a maximum of 60 requests per window per iP
  standardHeaders: 'draft-8', // use the latest standard rate-limit headers
  legacyHeaders: false, // disable deprecated x-reatelimit header
  message: {
    error: "You have sent too many request in a given amount of time. Please try again later."
  }
});

export default limiter;