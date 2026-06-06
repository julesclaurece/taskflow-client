import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../store/auth'
import { Eye, EyeOff } from 'lucide-react'

interface FormData {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
}

const shapes = [
  { size: 350, top: '10%', right: '5%', cls: 'float-1', color: 'rgba(139,92,246,0.15)' },
  { size: 200, top: '70%', right: '3%', cls: 'float-2', color: 'rgba(99,102,241,0.12)' },
  { size: 300, top: '30%', left: '2%', cls: 'float-3', color: 'rgba(6,182,212,0.1)' },
  { size: 180, top: '80%', left: '10%', cls: 'float-4', color: 'rgba(99,102,241,0.18)' },
  { size: 220, top: '5%', left: '35%', cls: 'float-5', color: 'rgba(168,85,247,0.1)' },
]

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      await registerUser(data)
      navigate('/dashboard')
    } catch (err: any) {
      const detail = err?.response?.data
      if (detail?.username) setError(`Username: ${detail.username[0]}`)
      else if (detail?.password) setError(`Password: ${detail.password[0]}`)
      else setError('Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center px-4 py-8 relative overflow-hidden">
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

      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="TaskFlow" className="w-12 h-12 rounded-2xl object-contain" />
            <span className="text-3xl font-bold text-white tracking-tight">TaskFlow</span>
          </div>
          <p className="text-slate-400 text-sm">Your productivity, supercharged.</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1">Create account</h2>
          <p className="text-slate-400 text-sm mb-6">Start managing tasks for free</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">First name</label>
                <input
                  {...register('first_name')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Last name</label>
                <input
                  {...register('last_name')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
              <input
                {...register('username', { required: true })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="john_doe"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                {...register('email', { required: true })}
                type="email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="john@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register('password', { required: true })}
                  type={showPass ? 'text' : 'password'}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-12"
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
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
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #219ebc, #1a7a94)',
                boxShadow: '0 4px 20px rgba(33,158,188,0.35)',
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Get started — it\'s free'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium hover:opacity-80 transition-opacity" style={{ color: '#219ebc' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-600">
            ✦ JWT secured &nbsp;·&nbsp; ✦ REST API &nbsp;·&nbsp; ✦ Django backend
          </p>
        </div>
      </div>
    </div>
  )
}
