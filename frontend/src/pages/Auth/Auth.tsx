const APIURL = import.meta.env.VITE_API_URL
import './style.scss'
import { useSetAtom, atomIsAuthenticated } from '@utils/jotai.store'
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import IcoEnter from '@asset/enter.svg'

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true) // true для входа, false для регистрации
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    })
    const setAuthStatus = useSetAtom(atomIsAuthenticated)

    const [error, setError] = useState('')
    const navigate = useNavigate()
    const location = useLocation()

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')

        const url = isLogin ? '/api/login' : '/api/register'
        const body = isLogin
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, name: formData.name }

        try {
            const response = await fetch(`${APIURL}${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // для отправки и получения HttpOnly cookie
                body: JSON.stringify(body),
            })

            if (response.status === 401) {
                const data = await response.json()
                setError(data.detail)
                return
            }

            if (!response.ok) {
                const data = await response.json()
                setError(data.detail)
                throw new Error(data.detail || 'Ошибка на сервере')
            }

            // успешная авторизация/регистрация
            setAuthStatus(true)
            const from = location.state?.from || '/' // возврат на исходный маршрут
            navigate(from, { replace: true })
        } catch (err) {
            setError("error")
        }
    }

    const toggleForm = () => {
        setIsLogin(!isLogin)
        setError('')
        setFormData({ email: '', password: '', name: '' })
    }

  return <div className="auth-page">
        <div className="auth-page__modal">
            <h2 className="auth-page__h2">
                {isLogin ? 'Вход' : 'Регистрация'}
            </h2>

            

            <form onSubmit={handleSubmit} className="auth-form">
                {!isLogin && ( <div className="auth-form__line">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="auth-form__input"
                            placeholder=' '
                            required={!isLogin}
                        />
                        <label className="auth-form__label">Name</label>
                </div>)}
                <div className="auth-form__line">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="auth-form__input"
                        placeholder=' '
                        required
                    />
                    <label className="auth-form__label">Email</label>
                </div>
                <div className="auth-form__line">
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="auth-form__input"
                        placeholder=' '
                        required
                    />
                    <label className="auth-form__label">Password</label>
                    <button
                        type="submit"
                        className="auth-form__submit"
                        // >{isLogin ? 'Войти' : 'Зарегистрироваться'}
                        > <IcoEnter/>
                    </button>
                </div>

                {error && (
                    <div className="auth-form__line error">{error}</div>
                )}
                
            </form>

            <p className="auth-page__bottom">
                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                <button
                    onClick={toggleForm}
                    className="text-blue-500 hover:underline"
                    >{isLogin ? 'Зарегистрироваться' : 'Войти'}
                </button>
            </p>
        </div>
    </div>
}


export default Auth