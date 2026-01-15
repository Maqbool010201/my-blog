// src/lib/rate-limit.js
export function rateLimit(options = {}) {
  const tokens = new Map();
  
  return {
    async check(request, limit = 10, key = 'default') {
      // Get client IP address
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                 request.headers.get('x-real-ip') || 
                 'anonymous';
      
      const now = Date.now();
      const windowMs = options.interval || 60000; // Default 1 minute
      const keyName = `${ip}:${key}`;
      
      if (!tokens.has(keyName)) {
        tokens.set(keyName, {
          count: 0,
          resetTime: now + windowMs
        });
      }
      
      const token = tokens.get(keyName);
      
      // Reset if window has passed
      if (now > token.resetTime) {
        token.count = 0;
        token.resetTime = now + windowMs;
      }
      
      // Check if limit exceeded
      if (token.count >= limit) {
        throw new Error('Rate limit exceeded');
      }
      
      // Increment count
      token.count++;
      
      // Add cleanup mechanism to prevent memory leaks
      if (Math.random() < 0.01) { // 1% chance to cleanup
        for (const [k, v] of tokens.entries()) {
          if (now > v.resetTime + windowMs) {
            tokens.delete(k);
          }
        }
      }
      
      return true;
    }
  };
}