import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../store/auth'
import { Eye, EyeOff, PlayCircle } from 'lucide-react'

interface FormData {
  username: string
  password: string
}

const shapes = [
  { size: 300, top: '5%', left: '5%', cls: 'float-1', color: 'rgba(99,102,241,0.15)' },
  { size: 200, top: '60%', left: '2%', cls: 'float-2', color: 'rgba(139,92,246,0.12)' },
  { size: 400, top: '20%', right: '3%', cls: 'float-3', color: 'rgba(6,182,212,0.1)' },
  { size: 150, top: '70%', right: '8%', cls: 'float-4', color: 'rgba(99,102,241,0.2)' },
  { size: 250, top: '40%', left: '40%', cls: 'float-5', color: 'rgba(168,85,247,0.08)' },
]

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      await login(data.username, data.password)
      navigate('/dashboard')
    } catch {
      setError('Invalid username or password')
    }
  }

  const loginAsDemo = async () => {
    try {
      setError('')
      await login('demo', 'demo1234')
      navigate('/dashboard')
    } catch {
      setError('Demo account unavailable. Please try again.')
    }
  }

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center px-4 relative overflow-hidden">
      {shapes.map((s, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${s.cls} pointer-events-none`}
          style={{
            width: s.size,
            height: s.size,
            top: s.top,
            left: s.left,
            right: (s as any).right,
            background: `radial-gradient(circle, ${s.color}, transparent)`,
            filter: 'blur(40px)',
          }}
        />
      ))}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="TaskFlow" className="w-12 h-12 rounded-2xl object-contain" />
            <span className="text-3xl font-bold text-white tracking-tight">TaskFlow</span>
          </div>
          <p className="text-slate-400 text-sm">Manage your work, beautifully.</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1">Welcome back</h2>
          <p className="text-slate-400 text-sm mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
              <input
                {...register('username', { required: true })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="your_username"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register('password', { required: true })}
                  type={showPass ? 'text' : 'password'}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all
                disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #219ebc, #1a7a94)',
                boxShadow: '0 4px 20px rgba(33,158,188,0.35)',
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Demo button */}
          <button
            type="button"
            onClick={loginAsDemo}
            className="w-full mt-4 py-3 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2"
            style={{ borderColor: 'rgba(33,158,188,0.4)', color: '#219ebc' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(33,158,188,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <PlayCircle size={16} />
            Try the demo — no account needed
          </button>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-slate-400">
              No account?{' '}
              <Link to="/register" className="font-medium hover:opacity-80 transition-opacity" style={{ color: '#219ebc' }}>
                Create one for free
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {['JWT Auth', 'REST API', 'Real-time filters'].map(f => (
            <div key={f} className="glass rounded-xl px-3 py-2 text-center">
              <p className="text-xs text-slate-400">{f}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
