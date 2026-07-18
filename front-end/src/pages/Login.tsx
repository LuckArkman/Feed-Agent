import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { BrandMark } from '@/components/BrandMark';
import { BrandCopyright } from '@/components/BrandCopyright';
import { useAuthStore } from '@/store/authStore';
import { showToast } from '@/utils/toastHelper';
import apiClient from '@/services/apiClient';
import { BRAND } from '@/config/brand';
import '@/styles/login.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 4;
  const showDevHints = import.meta.env.DEV;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      const msg = 'O e-mail é obrigatório.';
      setError(msg);
      showToast.error(msg);
      return;
    }

    if (!isEmailValid) {
      const msg = 'Informe um e-mail válido.';
      setError(msg);
      showToast.error(msg);
      return;
    }

    if (!password) {
      const msg = 'A senha é obrigatória.';
      setError(msg);
      showToast.error(msg);
      return;
    }

    if (!isPasswordValid) {
      const msg = 'A senha deve ter ao menos 4 caracteres.';
      setError(msg);
      showToast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data?.success) {
        const { token, user } = res.data.data;
        login(token, { id: String(user.id), name: user.name, email: user.email });
        showToast.success(`Bem-vindo, ${user.name}!`);
        navigate('/dashboard');
      } else {
        setError(res.data?.error || 'Falha na autenticação.');
        showToast.error('Falha na autenticação.');
      }
    } catch (err: unknown) {
      const errorMsg = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error || 'Credenciais inválidas ou erro no servidor.'
        : 'Credenciais inválidas ou erro no servidor.';
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen-bg">
      <div className="login-screen-inner">
        <aside className="login-brand-pane">
          <BrandMark className="login-brand-mark" />
          <p className="login-brand-tagline">{BRAND.tagline}</p>
          <h1>{BRAND.institutionalLine}</h1>
          <p>{BRAND.solutionLine}</p>
          <ul className="login-brand-steps" aria-label="Capacidades">
            <li>
              <span className="step-num" aria-hidden>
                1
              </span>
              Contatos e listas organizadas
            </li>
            <li>
              <span className="step-num" aria-hidden>
                2
              </span>
              Conteúdos revisados com controle
            </li>
            <li>
              <span className="step-num" aria-hidden>
                3
              </span>
              Campanhas com operação rastreável
            </li>
          </ul>
          <div className="login-brand-abstract" aria-hidden>
            <span className="abs-node" />
            <span className="abs-line" />
            <span className="abs-node abs-node--accent" />
            <span className="abs-line" />
            <span className="abs-node" />
          </div>
        </aside>

        <div className="login-glass-card">
          <div className="login-mobile-brand">
            <BrandMark />
          </div>
          <div className="login-card-heading">
            <h2>Entrar</h2>
            <p>Acesse sua conta {BRAND.productName}.</p>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <form onSubmit={handleLogin}>
            <div className="floating-input-group">
              <input
                type="email"
                id="login-email"
                placeholder=" "
                className="floating-input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
              <Mail size={18} className="floating-input-icon" aria-hidden />
              <span className="floating-label-text">E-mail</span>
              <span
                className={`validation-dot-indicator ${
                  email === ''
                    ? 'validation-dot-empty'
                    : isEmailValid
                      ? 'validation-dot-valid'
                      : 'validation-dot-invalid'
                }`}
                aria-hidden
              />
            </div>

            <div className="floating-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                placeholder=" "
                className="floating-input-box"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
              <Lock size={18} className="floating-input-icon" aria-hidden />
              <span className="floating-label-text">Senha</span>
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                tabIndex={0}
              >
                {showPassword ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
              </button>
            </div>

            <Button type="submit" variant="primary" icon={LogIn} isLoading={loading} className="login-submit-btn">
              {BRAND.loginCta}
            </Button>
          </form>

          <div className="login-footer-links">
            <span>
              Esqueceu a senha? <Link to="/forgot-password">Recuperar acesso</Link>
            </span>
            <span>
              Ainda não tem conta? <Link to="/register">Criar administrador</Link>
            </span>
          </div>

          {showDevHints && (
            <p className="login-dev-hint" data-testid="login-dev-hint">
              Ambiente de desenvolvimento — use as credenciais locais configuradas no backend.
            </p>
          )}

          <BrandCopyright className="login-copyright" showSolutionLine />
        </div>
      </div>
    </div>
  );
};

export default Login;
