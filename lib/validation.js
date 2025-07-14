// lib/validation.js - Input validation utilities for CrankSmith
import { bikeConfig } from './components';

/**
 * Email validation with comprehensive checks
 */
export const validateEmail = (email) => {
  const errors = [];
  
  // Basic presence check
  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
    return { isValid: false, errors, sanitized: null };
  }
  
  // Trim and lowercase for consistency
  const sanitized = email.trim().toLowerCase();
  
  // Length checks
  if (sanitized.length === 0) {
    errors.push('Email cannot be empty');
    return { isValid: false, errors, sanitized: null };
  }
  
  if (sanitized.length > 254) {
    errors.push('Email is too long (max 254 characters)');
    return { isValid: false, errors, sanitized: null };
  }
  
  // Format validation with comprehensive regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(sanitized)) {
    errors.push('Please enter a valid email address');
    return { isValid: false, errors, sanitized: null };
  }
  
  // Check for common typos in domain
  const domain = sanitized.split('@')[1];
  const commonDomainTypos = {
    'gmai.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'yahoo.co': 'yahoo.com',
    'hotmial.com': 'hotmail.com',
    'outlok.com': 'outlook.com'
  };
  
  if (commonDomainTypos[domain]) {
    errors.push(`Did you mean ${sanitized.replace(domain, commonDomainTypos[domain])}?`);
    return { isValid: false, errors, sanitized: null, suggestion: sanitized.replace(domain, commonDomainTypos[domain]) };
  }
  
  return { isValid: true, errors: [], sanitized };
};

/**
 * Numeric input validation
 */
export const validateNumeric = (value, options = {}) => {
  const { min, max, integer = false, positive = false, field = 'value' } = options;
  const errors = [];
  
  if (value === null || value === undefined || value === '') {
    if (options.required) {
      errors.push(`${field} is required`);
    }
    return { isValid: !options.required, errors, sanitized: null };
  }
  
  const num = Number(value);
  
  if (isNaN(num)) {
    errors.push(`${field} must be a valid number`);
    return { isValid: false, errors, sanitized: null };
  }
  
  if (integer && !Number.isInteger(num)) {
    errors.push(`${field} must be a whole number`);
    return { isValid: false, errors, sanitized: null };
  }
  
  if (positive && num <= 0) {
    errors.push(`${field} must be positive`);
    return { isValid: false, errors, sanitized: null };
  }
  
  if (min !== undefined && num < min) {
    errors.push(`${field} must be at least ${min}`);
    return { isValid: false, errors, sanitized: null };
  }
  
  if (max !== undefined && num > max) {
    errors.push(`${field} must be no more than ${max}`);
    return { isValid: false, errors, sanitized: null };
  }
  
  return { isValid: true, errors: [], sanitized: num };
};

/**
 * Bike type validation
 */
export const validateBikeType = (bikeType) => {
  const errors = [];
  
  if (!bikeType || typeof bikeType !== 'string') {
    errors.push('Bike type is required');
    return { isValid: false, errors, sanitized: null };
  }
  
  const sanitized = bikeType.trim().toLowerCase();
  const validTypes = Object.keys(bikeConfig);
  
  if (!validTypes.includes(sanitized)) {
    errors.push(`Bike type must be one of: ${validTypes.join(', ')}`);
    return { isValid: false, errors, sanitized: null };
  }
  
  return { isValid: true, errors: [], sanitized };
};

/**
 * Component validation
 */
export const validateComponent = (component, type = 'component') => {
  const errors = [];
  
  if (!component) {
    return { isValid: true, errors: [], sanitized: null }; // Components are optional
  }
  
  if (typeof component !== 'object') {
    errors.push(`${type} must be a valid component object`);
    return { isValid: false, errors, sanitized: null };
  }
  
  // Required fields for components
  const requiredFields = ['id', 'model', 'weight'];
  const missingFields = requiredFields.filter(field => !component[field]);
  
  if (missingFields.length > 0) {
    errors.push(`${type} is missing required fields: ${missingFields.join(', ')}`);
    return { isValid: false, errors, sanitized: null };
  }
  
  // Validate weight is numeric and reasonable
  const weightValidation = validateNumeric(component.weight, { 
    min: 1, 
    max: 10000, 
    positive: true,
    field: `${type} weight`
  });
  
  if (!weightValidation.isValid) {
    errors.push(...weightValidation.errors);
    return { isValid: false, errors, sanitized: null };
  }
  
  return { isValid: true, errors: [], sanitized: component };
};

/**
 * Setup validation (wheel, tire, crankset, cassette)
 */
export const validateSetup = (setup, bikeType) => {
  const errors = [];
  const sanitized = {};
  
  if (!setup || typeof setup !== 'object') {
    errors.push('Setup must be a valid object');
    return { isValid: false, errors, sanitized: null };
  }
  
  // Validate bike type first
  const bikeTypeValidation = validateBikeType(bikeType);
  if (!bikeTypeValidation.isValid) {
    errors.push(...bikeTypeValidation.errors);
    return { isValid: false, errors, sanitized: null };
  }
  
  const config = bikeConfig[bikeTypeValidation.sanitized];
  
  // Validate wheel size
  if (setup.wheel) {
    if (!config.wheelSizes.includes(setup.wheel)) {
      errors.push(`Wheel size must be one of: ${config.wheelSizes.join(', ')}`);
    } else {
      sanitized.wheel = setup.wheel;
    }
  }
  
  // Validate tire width
  if (setup.tire) {
    const tireValidation = validateNumeric(setup.tire, {
      field: 'tire width',
      positive: true
    });
    
    if (!tireValidation.isValid) {
      errors.push(...tireValidation.errors);
    } else if (!config.tireWidths.includes(tireValidation.sanitized)) {
      errors.push(`Tire width must be one of: ${config.tireWidths.join(', ')}`);
    } else {
      sanitized.tire = tireValidation.sanitized.toString();
    }
  }
  
  // Validate crankset
  const cranksetValidation = validateComponent(setup.crankset, 'crankset');
  if (!cranksetValidation.isValid) {
    errors.push(...cranksetValidation.errors);
  } else {
    sanitized.crankset = cranksetValidation.sanitized;
  }
  
  // Validate cassette
  const cassetteValidation = validateComponent(setup.cassette, 'cassette');
  if (!cassetteValidation.isValid) {
    errors.push(...cassetteValidation.errors);
  } else {
    sanitized.cassette = cassetteValidation.sanitized;
  }
  
  return { 
    isValid: errors.length === 0, 
    errors, 
    sanitized: errors.length === 0 ? sanitized : null 
  };
};

/**
 * Request body validation for API routes
 */
export const validateRequestBody = (body, schema) => {
  const errors = [];
  const sanitized = {};
  
  if (!body || typeof body !== 'object') {
    errors.push('Request body must be a valid object');
    return { isValid: false, errors, sanitized: null };
  }
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = body[field];
    
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    if (value === undefined || value === null || value === '') {
      continue; // Skip optional empty fields
    }
    
    if (rules.type === 'email') {
      const validation = validateEmail(value);
      if (!validation.isValid) {
        errors.push(...validation.errors);
      } else {
        sanitized[field] = validation.sanitized;
      }
    } else if (rules.type === 'string') {
      if (typeof value !== 'string') {
        errors.push(`${field} must be a string`);
      } else {
        let sanitizedValue = value.trim();
        
        if (rules.minLength && sanitizedValue.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters`);
        }
        
        if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
          errors.push(`${field} must be no more than ${rules.maxLength} characters`);
        }
        
        if (errors.length === 0) {
          sanitized[field] = sanitizedValue;
        }
      }
    } else if (rules.type === 'number') {
      const validation = validateNumeric(value, rules);
      if (!validation.isValid) {
        errors.push(...validation.errors);
      } else {
        sanitized[field] = validation.sanitized;
      }
    }
  }
  
  return { 
    isValid: errors.length === 0, 
    errors, 
    sanitized: errors.length === 0 ? sanitized : null 
  };
};

/**
 * Sanitize string input to prevent XSS
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  return str
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
}; 