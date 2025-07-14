// hooks/useFormValidation.js - React hook for form validation
import { useState, useCallback, useMemo } from 'react';
import { validateEmail, validateNumeric, validateBikeType, validateSetup } from '../lib/validation';

export const useFormValidation = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Update a single field value
  const setValue = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  // Mark a field as touched (for showing validation errors)
  const setTouched = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  // Validate a specific field
  const validateField = useCallback((field, value, validationRules) => {
    if (!validationRules) return { isValid: true, errors: [] };

    const { type, required, min, max, ...options } = validationRules;

    switch (type) {
      case 'email':
        return validateEmail(value);
      
      case 'number':
        return validateNumeric(value, { required, min, max, ...options, field });
      
      case 'bikeType':
        return validateBikeType(value);
      
      default:
        if (required && (!value || value.toString().trim() === '')) {
          return { isValid: false, errors: [`${field} is required`] };
        }
        return { isValid: true, errors: [] };
    }
  }, []);

  // Validate all fields
  const validateForm = useCallback((validationSchema) => {
    const newErrors = {};
    let isFormValid = true;

    for (const [field, rules] of Object.entries(validationSchema)) {
      const validation = validateField(field, values[field], rules);
      if (!validation.isValid) {
        newErrors[field] = validation.errors[0]; // Take first error
        isFormValid = false;
      }
    }

    setErrors(newErrors);
    return { isValid: isFormValid, errors: newErrors };
  }, [values, validateField]);

  // Handle field blur (mark as touched and validate)
  const handleBlur = useCallback((field, validationRules) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    if (validationRules) {
      const validation = validateField(field, values[field], validationRules);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, [field]: validation.errors[0] }));
      }
    }
  }, [values, validateField]);

  // Handle field change
  const handleChange = useCallback((field, value, validationRules) => {
    setValue(field, value);
    
    // Real-time validation for touched fields
    if (touched[field] && validationRules) {
      const validation = validateField(field, value, validationRules);
      if (validation.isValid) {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
    }
  }, [setValue, touched, validateField]);

  // Reset form
  const resetForm = useCallback((newInitialValues = {}) => {
    setValues(newInitialValues);
    setErrors({});
    setTouched({});
  }, []);

  // Get field props for easy integration with inputs
  const getFieldProps = useCallback((field, validationRules = null) => ({
    value: values[field] || '',
    onChange: (e) => {
      const value = e.target ? e.target.value : e;
      handleChange(field, value, validationRules);
    },
    onBlur: () => handleBlur(field, validationRules),
    error: touched[field] ? errors[field] : null,
    hasError: Boolean(touched[field] && errors[field])
  }), [values, errors, touched, handleChange, handleBlur]);

  // Check if form has any errors
  const hasErrors = useMemo(() => {
    return Object.values(errors).some(error => error !== null && error !== undefined);
  }, [errors]);

  // Check if form is valid (no errors and required fields are filled)
  const isValid = useMemo(() => {
    return !hasErrors && Object.keys(touched).length > 0;
  }, [hasErrors, touched]);

  return {
    values,
    errors,
    touched,
    hasErrors,
    isValid,
    setValue,
    setTouched,
    validateField,
    validateForm,
    handleBlur,
    handleChange,
    resetForm,
    getFieldProps
  };
};

// Specialized hook for calculator validation
export const useCalculatorValidation = () => {
  const [setupErrors, setSetupErrors] = useState({});

  const validateCalculatorSetup = useCallback((currentSetup, proposedSetup, bikeType) => {
    const errors = {};

    if (!bikeType) {
      errors.bikeType = 'Please select a bike type';
      return { isValid: false, errors };
    }

    // Validate current setup
    const currentValidation = validateSetup(currentSetup, bikeType);
    if (!currentValidation.isValid) {
      errors.currentSetup = currentValidation.errors;
    }

    // Validate proposed setup
    const proposedValidation = validateSetup(proposedSetup, bikeType);
    if (!proposedValidation.isValid) {
      errors.proposedSetup = proposedValidation.errors;
    }

    // Check if setups are complete enough for analysis
    const requiredFields = ['wheel', 'tire', 'crankset', 'cassette'];
    const currentComplete = requiredFields.every(field => currentSetup[field]);
    const proposedComplete = requiredFields.every(field => proposedSetup[field]);

    if (!currentComplete) {
      errors.currentSetup = [...(errors.currentSetup || []), 'Please complete all current setup fields'];
    }

    if (!proposedComplete) {
      errors.proposedSetup = [...(errors.proposedSetup || []), 'Please complete all proposed setup fields'];
    }

    setSetupErrors(errors);
    return { 
      isValid: Object.keys(errors).length === 0, 
      errors,
      canAnalyze: currentComplete && proposedComplete && Object.keys(errors).length === 0
    };
  }, []);

  const clearSetupErrors = useCallback(() => {
    setSetupErrors({});
  }, []);

  return {
    setupErrors,
    validateCalculatorSetup,
    clearSetupErrors
  };
}; 