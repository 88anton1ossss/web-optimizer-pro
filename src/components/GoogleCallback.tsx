import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useUser } from '@clerk/react';

export function GoogleCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Only attempt to process if the user data has loaded from Clerk
    if (!isLoaded) return;

    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');
    const error = queryParams.get('error');

    if (error) {
      setStatus('error');
      setErrorMessage(`Google Error: ${error}`);
      return;
    }

    if (!code) {
      setStatus('error');
      setErrorMessage('No authorization code found in URL.');
      return;
    }

    // Now exchange the code for the refresh token
    const exchangeCode = async () => {
      try {
        const apiUrl = import.meta.env.DEV ? 'http://localhost:5173/api/ads/callback' : '/api/ads/callback';
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.refresh_token) {
          console.log('Received refresh token:', data.refresh_token);
          
          if (user) {
            // Wait, we need to create a table or column to save the token. For now, let's try saving to localStorage to test without altering the schema immediately.
            // A long term fix is to add 'google_ads_token' text col to user or a settings table.
            localStorage.setItem(`ads_token_${user.id}`, data.refresh_token);
          } else {
            console.warn("User not logged in, token not permanently saved to DB.");
          }

          setStatus('success');
          
          // Redirect the user back to the main app after 3 seconds
          setTimeout(() => {
             window.location.href = '/';
          }, 3000);
        } else {
           throw new Error("No refresh token returned.");
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Failed to finish Google Ads setup.');
      }
    };

    exchangeCode();
  }, [isLoaded, user]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full glass-morphism p-8 rounded-3xl text-center border border-white/10 space-y-6">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 animate-spin text-brand-primary mb-4" />
            <h2 className="text-2xl font-black text-white">Connecting Google Ads...</h2>
            <p className="text-white/60 mt-2">Please wait while we establish a secure connection with Neural Engine.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-in zoom-in duration-500">
            <CheckCircle2 className="w-20 h-20 text-[#34A853] mb-4" />
            <h2 className="text-3xl font-black text-white tracking-tight">Connected!</h2>
            <p className="text-white/60 mt-2">Sync successful. You can now use 1-Click Export.</p>
            <p className="text-xs text-white/30 uppercase tracking-widest mt-6">Redirecting you back...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
             <XCircle className="w-16 h-16 text-[#EA4335] mb-4" />
             <h2 className="text-2xl font-black text-white">Connection Failed</h2>
             <p className="text-[#EA4335]/80 mt-2 text-sm">{errorMessage}</p>
             <button 
                onClick={() => window.location.href = '/'}
                className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-bold uppercase tracking-wide text-sm"
             >
                Return to Dashboard
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
