import { Link } from 'react-router-dom';

const features = [
  {
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Control de Horario',
    description: 'Registra entrada y salida con un clic. Compatible con geolocalización para mayor precisión.',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    title: 'Reportes en Tiempo Real',
    description: 'Estadísticas diarias, semanales y mensuales. Visualiza el tiempo trabajado de tu equipo.',
    color: 'bg-success-100 text-success-600',
  },
  {
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    title: 'Gestión de Vacaciones',
    description: 'Solicita y aprueba permisos. Vacaciones, bajas médicas y días personales.',
    color: 'bg-info-100 text-info-600',
  },
  {
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
    title: 'Geolocalización',
    description: 'Captura la ubicación GPS al registrar fichajes. Cumple con la normativa de control horario.',
    color: 'bg-warning-100 text-warning-600',
  },
  {
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    title: 'Gestión de Proyectos',
    description: 'Asigna empleados a proyectos. Controla el tiempo invertido en cada cliente.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    title: 'Seguridad y Privacidad',
    description: 'Autenticación JWT segura. Datos cifrados y protegidos según RGPD.',
    color: 'bg-danger-100 text-danger-600',
  },
];

const plans = [
  {
    name: 'Starter',
    price: '29€',
    period: '/mes',
    description: 'Para pequeñas empresas',
    features: ['Hasta 10 empleados', 'Control de horario', 'Reportes básicos', 'Gestión de vacaciones'],
    cta: 'Comenzar prueba',
    popular: false,
  },
  {
    name: 'Professional',
    price: '79€',
    period: '/mes',
    description: 'Para empresas en crecimiento',
    features: ['Hasta 50 empleados', 'Geolocalización', 'Reportes avanzados', 'Gestión de proyectos', 'API REST', 'Soporte prioritario'],
    cta: 'Prueba gratis 14 días',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Para grandes organizaciones',
    features: ['Empleados ilimitados', 'Multi-empresa', 'Integraciones personalizadas', 'Dedicated support', 'SLA garantizado', 'On-premise option'],
    cta: 'Contactar ventas',
    popular: false,
  },
];

const testimonials = [
  {
    name: 'Carlos Rodríguez',
    role: 'Director de RRHH',
    company: 'TechCorp Solutions',
    image: 'CR',
    quote: 'Reloj Laboral ha simplificado nuestro control de presencia. El sistema de geolocalización es preciso y los empleados lo usan sin problemas.',
  },
  {
    name: 'María García',
    role: 'Gerente',
    company: 'Restaurante El Gourmet',
    image: 'MG',
    quote: 'Antes perdíamos horas haciendo nóminas manualmente. Ahora todo está automatizado y los empleados gestionan sus vacaciones solos.',
  },
  {
    name: 'David López',
    role: 'CEO',
    company: 'Startup Innova',
    image: 'DL',
    quote: 'La interfaz es muy intuitiva. Tardamos 5 minutos en dar de alta a todo el equipo. Ideal para startups que crecen rápido.',
  },
];

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Reloj Laboral</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Características
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Precios
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Testimonios
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Prueba gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-primary-700">Sistema de control horario #1 en España</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Controla el tiempo de tu equipo
              <span className="text-primary-600"> sin complicaciones</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              La herramienta más completa para gestionar presencia, vacaciones y proyectos de tu empresa. 
              Cumple con la legislación y ahorra tiempo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all hover:shadow-lg hover:shadow-primary-500/25"
              >
                Prueba gratis 14 días
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl text-lg font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Ver demo
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              🎉 No requiere tarjeta de crédito • 🎯 Configuración en 5 minutos
            </p>
          </div>

          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="ml-2 text-sm text-gray-500">Reloj Laboral - Dashboard</span>
              </div>
              <div className="p-8 bg-gray-50 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="text-3xl font-bold text-primary-600">8h 23m</div>
                      <div className="text-sm text-gray-500">Hoy</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="text-3xl font-bold text-success-600">42h 15m</div>
                      <div className="text-sm text-gray-500">Esta semana</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="text-3xl font-bold text-info-600">168h 45m</div>
                      <div className="text-sm text-gray-500">Este mes</div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-lg">Vista previa del dashboard interactivo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para gestionar tu equipo
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Una solución integral que se adapta a las necesidades de tu empresa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planes que se adaptan a tu negocio
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sin permanence. Cambia de plan cuando quieras. Todos incluyen soporte técnico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 ${
                  plan.popular
                    ? 'ring-2 ring-primary-500 shadow-2xl scale-105'
                    : 'border border-gray-200 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                    Más popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center">
                    {plan.price === 'Custom' ? (
                      <span className="text-4xl font-bold text-gray-900">Custom</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-500">{plan.period}</span>
                      </>
                    )}
                  </div>
                  <p className="mt-2 text-gray-500">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600">
                      <svg className="w-5 h-5 text-success-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Empresas que ya confían en nosotros
            </h2>
            <p className="text-xl text-gray-600">
              Miles de empresas gestionan su equipo con Reloj Laboral
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary-700">{testimonial.image}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-sm text-primary-600 font-medium">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para digitalizar tu gestión de personas?
          </h2>
          <p className="text-xl text-primary-100 mb-10">
            Únete a más de 500 empresas que ya han optimizado su control de presencia con Reloj Laboral.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white text-primary-600 rounded-xl text-lg font-semibold hover:bg-primary-50 transition-all"
            >
              Empezar prueba gratis
            </Link>
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 text-white rounded-xl text-lg font-semibold hover:bg-white/10 transition-all"
            >
              Hablar con ventas
            </a>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">Reloj Laboral</span>
              </div>
              <p className="text-sm">
                Sistema de control de horas laborales para empresas modernas.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integraciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrera</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos de servicio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm">
            <p>© 2026 Reloj Laboral. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};