'use client';

import { useEffect, useState } from 'react';

interface SquareDiagnosticsProps {
  onClose: () => void;
}

export default function SquareDiagnostics({ onClose }: SquareDiagnosticsProps) {
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runDiagnostics = () => {
      const diag: any = {
        timestamp: new Date().toISOString(),
        environment: {
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A',
          url: typeof window !== 'undefined' ? window.location.href : 'N/A',
          protocol: typeof window !== 'undefined' ? window.location.protocol : 'N/A',
        },
        square: {
          sdkLoaded: typeof window !== 'undefined' && !!window.Square,
          config: {
            applicationId: !!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
            locationId: !!process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
          }
        },
        errors: []
      };

      // Check for console errors
      if (typeof window !== 'undefined') {
        const originalError = console.error;
        const errors: string[] = [];
        
        console.error = (...args) => {
          errors.push(args.join(' '));
          originalError.apply(console, args);
        };

        // Check Square configuration
        if (!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID) {
          diag.errors.push('Missing NEXT_PUBLIC_SQUARE_APPLICATION_ID');
        }
        
        if (!process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID) {
          diag.errors.push('Missing NEXT_PUBLIC_SQUARE_LOCATION_ID');
        }

        // Check if Square SDK is loaded
        if (!window.Square) {
          diag.errors.push('Square SDK not loaded');
        }

        diag.consoleErrors = errors;
      }

      setDiagnostics(diag);
      setIsLoading(false);
    };

    runDiagnostics();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
          <h2 className="text-xl font-bold mb-4">Running Square Diagnostics...</h2>
          <div className="animate-pulse">Please wait...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Square Payment Diagnostics</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Environment</h3>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <pre>{JSON.stringify(diagnostics.environment, null, 2)}</pre>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Square Configuration</h3>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <div>SDK Loaded: {diagnostics.square?.sdkLoaded ? '✅ Yes' : '❌ No'}</div>
              <div>Application ID: {diagnostics.square?.config?.applicationId ? '✅ Set' : '❌ Missing'}</div>
              <div>Location ID: {diagnostics.square?.config?.locationId ? '✅ Set' : '❌ Missing'}</div>
            </div>
          </div>

          {diagnostics.errors?.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2 text-red-600">Issues Found</h3>
              <div className="bg-red-100 p-3 rounded text-sm">
                <ul className="list-disc list-inside">
                  {diagnostics.errors.map((error: string, index: number) => (
                    <li key={index} className="text-red-800">{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg mb-2">Recommendations</h3>
            <div className="bg-blue-100 p-3 rounded text-sm">
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure environment variables are set in your .env.local file</li>
                <li>Check browser console for additional error messages</li>
                <li>Verify Square application ID and location ID are correct</li>
                <li>Make sure you're using HTTPS in production</li>
                <li>Check Square developer dashboard for any account issues</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
