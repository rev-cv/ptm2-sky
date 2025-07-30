const APIURL = import.meta.env.VITE_API_URL
import './style.scss'
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true) // true для входа, false для регистрации
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    })

    const [error, setError] = useState('')
    const navigate = useNavigate()
    const location = useLocation()

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
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

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.detail || 'Ошибка на сервере')
            }

            // успешная авторизация/регистрация
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

  return <div className="auth-form">
        <div className="">
            <h2 className="auth-form__h2">
                {isLogin ? 'Вход' : 'Регистрация'}
            </h2>

            {error && (
                <div className="mb-4 text-red-500 text-center">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="auth-form__form">
                {!isLogin && ( <div>
                        <label className="auth-form__label">Имя</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="auth-form__input"
                            required={!isLogin}
                        />
                </div>)}
                <div>
                    <label className="auth-form__label">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="auth-form__input"
                        required
                    />
                </div>
                <div>
                    <label className="auth-form__label">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="auth-form__input"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="auth-form__submit"
                    >{isLogin ? 'Войти' : 'Зарегистрироваться'}
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
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