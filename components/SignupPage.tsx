import React, { useState } from 'react';
import { CloseIcon, QuestionIcon, GoogleIcon } from '../constants';
import { auth } from '../firebase';
import { firebaseService } from '../firebaseService';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface SignupPageProps {
  onSignupSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user) {
        await firebaseService.createProfile({
          id: result.user.uid,
          username: username || email.split('@')[0],
          name: name || username || email.split('@')[0],
        });
        onSignupSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
    }
  };

  return (
    <div className="w-screen h-screen bg-white text-black flex flex-col">
      <header className="p-4 flex items-center justify-between">
        <CloseIcon className="w-6 h-6 text-gray-500 cursor-pointer" />
        <QuestionIcon className="w-6 h-6 text-gray-500 cursor-pointer" />
      </header>

      <main className="flex-grow flex flex-col justify-center items-center px-8 overflow-y-auto">
        <div className="w-full max-w-sm text-center">
            <h1 className="text-3xl font-bold mb-3">Sign up for Reelify</h1>
            <p className="text-gray-500 mb-8 text-sm">Create a profile, follow other accounts, make your own videos, and more.</p>
            
            <form onSubmit={handleSignup} className="space-y-4 mb-4">
                <input 
                    type="text" 
                    placeholder="Username" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs text-left border border-red-100 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full p-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Sign up'}
                </button>
            </form>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or</span></div>
            </div>

            <button 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
                <div className="w-5 mr-4"><GoogleIcon /></div>
                <span className="flex-grow text-center">Continue with Google</span>
            </button>
        </div>
      </main>
      
      <footer className="shrink-0">
        <div className="px-8 py-4 text-center text-xs text-gray-500 border-t">
            By continuing, you agree to Reelify's <a href="#" className="font-semibold text-black">Terms of Service</a> and confirm that you have read Reelify's <a href="#" className="font-semibold text-black">Privacy Policy</a>.
        </div>
        <div className="bg-gray-100 p-6 text-center">
            <p className="text-sm">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="text-red-500 font-semibold hover:underline">Log in</button>
            </p>
        </div>
      </footer>
    </div>
  );
};

export default SignupPage;
