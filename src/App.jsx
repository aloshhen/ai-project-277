import { useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef } from 'react'

// SafeIcon component - converts kebab-case to PascalCase
const SafeIcon = ({ name, size = 24, className = '', color }) => {
  const iconMap = {
    'menu': 'Menu',
    'x': 'X',
    'home': 'Home',
    'user': 'User',
    'mail': 'Mail',
    'phone': 'Phone',
    'map-pin': 'MapPin',
    'check-circle': 'CheckCircle',
    'send': 'Send',
    'chevron-right': 'ChevronRight',
    'star': 'Star',
    'zap': 'Zap',
    'shield': 'Shield',
    'coffee': 'Coffee',
    'heart': 'Heart',
    'arrow-right': 'ArrowRight',
    'sparkles': 'Sparkles',
    'rocket': 'Rocket'
  }

  const pascalName = iconMap[name] || 'HelpCircle'

  try {
    import * as LucideIcons from 'lucide-react'
    const IconComponent = LucideIcons[pascalName] || LucideIcons['HelpCircle']
    return <IconComponent size={size} className={className} color={color} />
  } catch {
    return <span className={className}>●</span>
  }
}

// Web3Forms Hook
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e, accessKey) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsError(false)

    const formData = new FormData(e.target)
    formData.append('access_key', accessKey)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        e.target.reset()
      } else {
        setIsError(true)
        setErrorMessage(data.message || 'Что-то пошло не так')
      }
    } catch (error) {
      setIsError(true)
      setErrorMessage('Ошибка сети. Попробуйте еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSuccess(false)
    setIsError(false)
    setErrorMessage('')
  }

  return { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm }
}

// Animation Component
const FadeIn = ({ children, delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm } = useFormHandler()
  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY' // Замените на ваш ключ с https://web3forms.com

  const scrollToSection = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-200">
        <nav className="container mx-auto max-w-6xl px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <SafeIcon name="sparkles" size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SimpleLand</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="text-slate-600 hover:text-blue-600 transition-colors font-medium">О нас</a>
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Возможности</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Контакты</a>
          </div>

          <button
            onClick={(e) => scrollToSection(e, 'contact')}
            className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            Связаться
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <SafeIcon name={isMenuOpen ? 'x' : 'menu'} size={24} />
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-200 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="block py-2 text-slate-600 hover:text-blue-600 font-medium">О нас</a>
                <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="block py-2 text-slate-600 hover:text-blue-600 font-medium">Возможности</a>
                <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="block py-2 text-slate-600 hover:text-blue-600 font-medium">Контакты</a>
                <button
                  onClick={(e) => scrollToSection(e, 'contact')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors mt-2"
                >
                  Связаться
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="pt-28 md:pt-32 pb-16 md:pb-24 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <FadeIn>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <SafeIcon name="rocket" size={16} />
                <span>Простое решение для вашего бизнеса</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                Создаем <span className="text-blue-600">простые</span> решения для сложных задач
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                Минималистичный подход к созданию продуктов. Без лишнего, только то, что действительно важно для вашего успеха.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={(e) => scrollToSection(e, 'contact')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 min-h-[56px]"
                >
                  Начать проект
                  <SafeIcon name="arrow-right" size={20} />
                </button>
                <button
                  onClick={(e) => scrollToSection(e, 'features')}
                  className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-xl text-lg font-bold transition-all border-2 border-slate-200 hover:border-slate-300 min-h-[56px]"
                >
                  Узнать больше
                </button>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.4}>
            <div className="mt-12 md:mt-16 relative">
              <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl md:rounded-3xl overflow-hidden aspect-video md:aspect-[21/9] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"
                  alt="Офис"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
                Наши <span className="text-blue-600">возможности</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Все необходимое для эффективной работы в одном месте
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <FadeIn delay={0.1}>
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all transform hover:scale-[1.02] hover:shadow-xl group">
                <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <SafeIcon name="zap" size={28} className="text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Быстрая работа</h3>
                <p className="text-slate-600 leading-relaxed">
                  Оптимизированные процессы позволяют достигать результатов в кратчайшие сроки без потери качества.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all transform hover:scale-[1.02] hover:shadow-xl group">
                <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <SafeIcon name="shield" size={28} className="text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Надежность</h3>
                <p className="text-slate-600 leading-relaxed">
                  Проверенные решения с гарантией стабильной работы. Мы заботимся о вашем спокойствии.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all transform hover:scale-[1.02] hover:shadow-xl group">
                <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <SafeIcon name="heart" size={28} className="text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Забота о клиентах</h3>
                <p className="text-slate-600 leading-relaxed">
                  Персональный подход к каждому проекту. Ваш успех — наша главная цель.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 px-4 md:px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <FadeIn>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl md:rounded-3xl overflow-hidden aspect-square md:aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                    alt="Команда"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                      <SafeIcon name="check-circle" size={24} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">500+</div>
                      <div className="text-slate-600 text-sm">Довольных клиентов</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <div>
              <FadeIn delay={0.1}>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
                  Почему выбирают <span className="text-blue-600">нас</span>
                </h2>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Мы верим в силу простоты. Наш подход основан на глубоком понимании потребностей клиентов и предоставлении именно тех решений, которые приносят реальную пользу.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <ul className="space-y-4 mb-8">
                  {[
                    'Более 10 лет опыта в отрасли',
                    'Команда профессионалов',
                    'Индивидуальный подход к каждому проекту',
                    'Прозрачное ценообразование'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                        <SafeIcon name="check-circle" size={16} className="text-blue-600" />
                      </div>
                      <span className="text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              <FadeIn delay={0.4}>
                <button
                  onClick={(e) => scrollToSection(e, 'contact')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  Обсудить проект
                  <SafeIcon name="arrow-right" size={20} />
                </button>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
                Свяжитесь с <span className="text-blue-600">нами</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Готовы начать? Заполните форму ниже, и мы свяжемся с вами в ближайшее время
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <FadeIn delay={0.1}>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="mail" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Email</h3>
                    <p className="text-slate-600">hello@simpleland.ru</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="phone" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Телефон</h3>
                    <p className="text-slate-600">+7 (999) 123-45-67</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="map-pin" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Адрес</h3>
                    <p className="text-slate-600">г. Москва, ул. Примерная, 123</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Часы работы</h3>
                  <p className="text-slate-600">Пн-Пт: 9:00 - 18:00</p>
                  <p className="text-slate-600">Сб-Вс: Выходной</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={(e) => handleSubmit(e, ACCESS_KEY)}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Ваше имя</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Иван Иванов"
                          required
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="ivan@example.com"
                          required
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Сообщение</label>
                        <textarea
                          name="message"
                          placeholder="Расскажите о вашем проекте..."
                          rows="4"
                          required
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                        ></textarea>
                      </div>

                      {isError && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                          {errorMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-2 min-h-[56px]"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Отправка...
                          </>
                        ) : (
                          <>
                            <SafeIcon name="send" size={20} />
                            Отправить сообщение
                          </>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, type: "spring" }}
                      className="text-center py-12"
                    >
                      <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <SafeIcon name="check-circle" size={40} className="text-green-600" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        Сообщение отправлено!
                      </h3>
                      <p className="text-slate-600 mb-8 max-w-md mx-auto">
                        Спасибо за обращение! Мы получили ваше сообщение и свяжемся с вами в ближайшее время.
                      </p>
                      <button
                        onClick={resetForm}
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                      >
                        Отправить еще одно сообщение
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-4 md:px-6 telegram-safe-bottom">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <SafeIcon name="sparkles" size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">SimpleLand</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-slate-400">
              <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-white transition-colors">О нас</a>
              <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-white transition-colors">Возможности</a>
              <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-white transition-colors">Контакты</a>
            </div>

            <div className="text-slate-500 text-sm">
              © 2024 SimpleLand. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App