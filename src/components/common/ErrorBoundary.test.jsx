import { describe, it, expect, vi, beforeEach } from 'vitest';
import ErrorBoundary from './ErrorBoundary';
import { Storage } from '../../utils/storage';

describe('ErrorBoundary Component - Unit Tests', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Lifecycle & Static Methods', () => {
    it('getDerivedStateFromError() should return hasError: true and the caught error', () => {
      const mockError = new Error('Test crash in child component');
      const stateUpdate = ErrorBoundary.getDerivedStateFromError(mockError);

      expect(stateUpdate).toEqual({
        hasError: true,
        error: mockError
      });
    });

    it('initializes with default error state', () => {
      const boundary = new ErrorBoundary({});
      expect(boundary.state.hasError).toBe(false);
      expect(boundary.state.error).toBeNull();
      expect(boundary.state.errorInfo).toBeNull();
      expect(boundary.state.showDetails).toBe(false);
    });

    it('componentDidCatch() updates error state and logs to console.error', () => {
      const boundary = new ErrorBoundary({});
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockError = new Error('Runtime error in tree');
      const mockErrorInfo = { componentStack: '\n    in ProblemChild\n    in App' };

      boundary.setState = vi.fn();
      boundary.componentDidCatch(mockError, mockErrorInfo);

      expect(boundary.setState).toHaveBeenCalledWith({
        error: mockError,
        errorInfo: mockErrorInfo
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        'ErrorBoundary caught an unhandled error:',
        mockError,
        mockErrorInfo
      );
    });
  });

  describe('Recovery Handlers', () => {
    it('handleResetState() clears error state to allow clean re-mount', () => {
      const boundary = new ErrorBoundary({});
      boundary.state = {
        hasError: true,
        error: new Error('Previous error'),
        errorInfo: { componentStack: 'stack' },
        showDetails: true
      };

      boundary.setState = vi.fn((newState) => {
        boundary.state = { ...boundary.state, ...newState };
      });

      boundary.handleResetState();

      expect(boundary.setState).toHaveBeenCalledWith({
        hasError: false,
        error: null,
        errorInfo: null,
        showDetails: false
      });
      expect(boundary.state.hasError).toBe(false);
    });

    it('handleResetDataAndReload() triggers Storage.resetToDefault() and window reload', () => {
      const boundary = new ErrorBoundary({});
      const resetSpy = vi.spyOn(Storage, 'resetToDefault').mockImplementation(() => {});
      const reloadMock = vi.fn();

      vi.stubGlobal('window', {
        location: { reload: reloadMock }
      });

      boundary.handleResetDataAndReload();

      expect(resetSpy).toHaveBeenCalledTimes(1);
      expect(reloadMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Fallback Rendering Logic', () => {
    it('returns custom fallback prop if provided when hasError is true', () => {
      const customFallback = { type: 'div', props: { children: 'Custom Fallback' } };
      const boundary = new ErrorBoundary({ fallback: customFallback });
      boundary.state = { hasError: true, error: new Error('Crash') };

      const rendered = boundary.render();
      expect(rendered).toBe(customFallback);
    });

    it('returns children when hasError is false', () => {
      const mockChildren = { type: 'div', props: { children: 'Normal App Tree' } };
      const boundary = new ErrorBoundary({ children: mockChildren });
      boundary.state = { hasError: false };

      const rendered = boundary.render();
      expect(rendered).toBe(mockChildren);
    });
  });

});
