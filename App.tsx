
import React, { useState, useEffect, useMemo, FC } from 'react';

// SECTION: TYPES -------------------------------------------------------------------

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Worker {
  id: number;
  name: string;
  photoUrl: string;
  trade: string;
  location: string;
  rating: number;
  experience: number; // years
  description: string;
  certifications: string[];
  reviews: Review[];
  verified: boolean;
  phone: string;
}

export interface Course {
  id:number;
  title: string;
  description: string;
  iconName: 'Tools' | 'Briefcase' | 'Chart';
}

type View = 'home' | 'profile' | 'training' | 'admin';


// SECTION: ICONS ------------------------------------------------------------------

const Icon: FC<{className?: string; children: React.ReactNode}> = ({className = 'w-6 h-6', children}) => (
    <>{children}</>
);

const SearchIcon: FC<{className?: string}> = ({className}) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></Icon>;
const BriefcaseIcon: FC<{className?: string}> = ({className}) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></Icon>;
const LocationMarkerIcon: FC<{className?: string}> = ({className}) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></Icon>;
const StarIcon: FC<{className?: string, filled: boolean}> = ({className, filled}) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></Icon>;
const ToolsIcon: FC<{className?: string}> = ({className}) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg></Icon>;
const ChartIcon: FC<{className?: string}> = ({className}) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></Icon>;
const ShieldCheckIcon: FC<{className?: string}> = ({className}) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5.02.997.997 0 001 6v5a1 1 0 00.084.383c.365 1.04 1.28 2.857 3.239 4.818C6.132 18.068 7.915 19 10 19c2.085 0 3.868-.932 5.677-2.799 1.959-1.96 2.874-3.777 3.24-4.818A1 1 0 0019 11V6a.997.997 0 00-1.166-.98C15.195 4.24 12.63 2.433 10 1.944zM8.707 13.293a1 1 0 001.414 0L14.414 9a1 1 0 10-1.414-1.414L9 11.086l-1.293-1.293a1 1 0 00-1.414 1.414l2 2z" clipRule="evenodd" /></svg></Icon>;
const BackIcon: FC<{className?: string}> = ({className}) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></Icon>;

const ICONS: {[key: string]: React.ReactNode} = {
    'Tools': <ToolsIcon />,
    'Briefcase': <BriefcaseIcon className="h-8 w-8 text-white"/>,
    'Chart': <ChartIcon />
}

// SECTION: MOCK DATA ----------------------------------------------------------------

const MOCK_WORKERS: Worker[] = [
    { id: 1, name: 'Carlos Pérez', photoUrl: 'https://picsum.photos/id/1005/200/200', trade: 'Plomería', location: 'Bogotá, Chapinero', rating: 4.8, experience: 12, description: 'Experto en plomería residencial y comercial. Soluciones rápidas y garantizadas para fugas, instalaciones y mantenimiento.', certifications: ['Certificado SENA en Plomería', 'Certificado de Trabajo en Alturas'], verified: true, phone: '3101234567', reviews: [
        { id: 1, author: 'Ana María', rating: 5, comment: 'Excelente servicio, muy profesional y rápido.', date: '2023-10-15' },
        { id: 2, author: 'Jorge Díaz', rating: 4, comment: 'Buen trabajo, aunque llegó un poco tarde.', date: '2023-09-22' },
    ]},
    { id: 2, name: 'Lucía Méndez', photoUrl: 'https://picsum.photos/id/1027/200/200', trade: 'Electricidad', location: 'Medellín, El Poblado', rating: 4.9, experience: 8, description: 'Instalaciones eléctricas seguras y bajo normativa. Especialista en iluminación LED y ahorro energético.', certifications: ['Certificado CONTE TE-1', 'Certificado en Domótica'], verified: true, phone: '3118765432', reviews: [
        { id: 3, author: 'David Vélez', rating: 5, comment: 'Lucía es increíble, solucionó un problema que otros 3 electricistas no pudieron.', date: '2023-11-01' },
    ]},
    { id: 3, name: 'Ricardo Serna', photoUrl: 'https://picsum.photos/id/1012/200/200', trade: 'Carpintería', location: 'Cali, San Fernando', rating: 4.7, experience: 20, description: 'Fabricación y restauración de muebles a medida. Acabados de alta calidad y diseños personalizados.', certifications: [], verified: true, phone: '3129876543', reviews: [
        { id: 4, author: 'Sofía Castro', rating: 5, comment: 'El mueble quedó espectacular, justo como lo quería. Muy recomendado.', date: '2023-10-05' },
    ]},
    { id: 4, name: 'Isabela Rojas', photoUrl: 'https://picsum.photos/id/1011/200/200', trade: 'Diseño Gráfico', location: 'Bogotá, Usaquén', rating: 5.0, experience: 6, description: 'Diseñadora gráfica creativa con enfoque en branding y marketing digital. Creemos juntos la imagen de tu marca.', certifications: ['Adobe Certified Expert'], verified: false, phone: '3131122334', reviews: [
        { id: 5, author: 'Emprendimiento XYZ', rating: 5, comment: 'Isabela captó nuestra idea a la perfección. El logo y el branding quedaron geniales.', date: '2023-11-10' },
    ]},
    { id: 5, name: 'Javier Moreno', photoUrl: 'https://picsum.photos/id/1013/200/200', trade: 'Albañilería', location: 'Barranquilla, Riomar', rating: 4.5, experience: 15, description: 'Obras y reformas con seriedad y cumplimiento. Pequeños y grandes proyectos. Acabados de primera.', certifications: [], verified: true, phone: '3145566778', reviews: []},
    { id: 6, name: 'Daniela Patiño', photoUrl: 'https://picsum.photos/id/1014/200/200', trade: 'Jardinería', location: 'Medellín, Laureles', rating: 4.8, experience: 5, description: 'Diseño y mantenimiento de jardines y zonas verdes. Convierto tu espacio en un paraíso natural.', certifications: ['Curso de Paisajismo'], verified: false, phone: '3159988776', reviews: [
         { id: 6, author: 'Laura Gómez', rating: 5, comment: 'Mi jardín nunca se había visto tan hermoso. Dani es muy dedicada.', date: '2023-09-30' },
    ]},
];

const MOCK_COURSES: Course[] = [
    { id: 1, title: 'Habilidades Técnicas', description: 'Mejora tus competencias en tu oficio con tutoriales y guías prácticas.', iconName: 'Tools' },
    { id: 2, title: 'Emprendimiento', description: 'Aprende a gestionar tu negocio, fijar precios y conseguir más clientes.', iconName: 'Briefcase' },
    { id: 3, title: 'Herramientas Digitales', description: 'Domina apps y software que te ayudarán a ser más productivo y profesional.', iconName: 'Chart' }
];

const TRADES = [...new Set(MOCK_WORKERS.map(w => w.trade))];

// SECTION: UI COMPONENTS ------------------------------------------------------------

const StarRating: FC<{ rating: number; totalStars?: number }> = ({ rating, totalStars = 5 }) => {
    return (
        <div className="flex items-center">
            {[...Array(totalStars)].map((_, index) => (
                <StarIcon key={index} filled={index < Math.round(rating)} className="w-5 h-5" />
            ))}
            <span className="text-gray-600 ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
    );
};

const WorkerCard: FC<{ worker: Worker; onSelect: (worker: Worker) => void; }> = ({ worker, onSelect }) => (
    <div
        onClick={() => onSelect(worker)}
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
        <div className="md:flex">
            <div className="md:flex-shrink-0">
                <img className="h-48 w-full object-cover md:w-48" src={worker.photoUrl} alt={`Foto de ${worker.name}`} />
            </div>
            <div className="p-6 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <div className="uppercase tracking-wide text-sm text-blue-brand font-semibold">{worker.trade}</div>
                        {worker.verified && (
                            <div className="flex items-center text-green-600" title="Usuario Verificado">
                                <ShieldCheckIcon className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                    <h3 className="block mt-1 text-lg leading-tight font-bold text-black">{worker.name}</h3>
                    <div className="mt-2 flex items-center text-gray-500">
                        <LocationMarkerIcon />
                        <span className="ml-2">{worker.location}</span>
                    </div>
                    <div className="mt-2">
                        <StarRating rating={worker.rating} />
                    </div>
                </div>
                <div className="mt-4 text-sm text-gray-700">
                    <p>{worker.experience} años de experiencia</p>
                </div>
            </div>
        </div>
    </div>
);


const CourseCard: FC<{ course: Course }> = ({ course }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4">
            <div className="flex-shrink-0 bg-blue-brand rounded-full p-3">
                {ICONS[course.iconName]}
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                <p className="text-gray-600 mt-1">{course.description}</p>
            </div>
        </div>
    );
};


// SECTION: VIEW COMPONENTS ------------------------------------------------------------------

interface HeaderProps {
    currentView: View;
    setView: (view: View) => void;
}
const Header: FC<HeaderProps> = ({ currentView, setView }) => {
    const navItems: { view: View, label: string }[] = [
        { view: 'home', label: 'Inicio' },
        { view: 'training', label: 'Formación' },
        { view: 'admin', label: 'Admin' }
    ];

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-brand">Conectados</h1>
                <nav className="hidden md:flex space-x-6">
                    {navItems.map(item => (
                        <button 
                            key={item.view}
                            onClick={() => setView(item.view)}
                            className={`text-lg font-medium transition-colors duration-200 ${currentView === item.view ? 'text-blue-brand border-b-2 border-blue-brand' : 'text-gray-600 hover:text-blue-brand'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
                 <div className="md:hidden">
                    {/* Mobile menu could be implemented here */}
                 </div>
            </div>
        </header>
    );
};


interface HomeViewProps {
    workers: Worker[];
    onSelectWorker: (worker: Worker) => void;
    onSearch: (term: string) => void;
    onFilterTrade: (trade: string) => void;
    onFilterExperience: (exp: string) => void;
    onUseLocation: () => void;
}
const HomeView: FC<HomeViewProps> = ({ workers, onSelectWorker, onSearch, onFilterTrade, onFilterExperience, onUseLocation }) => {
    return (
        <div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full">
                        <input
                            type="text"
                            placeholder="¿Qué servicio necesitas? (Ej: Plomero)"
                            onChange={(e) => onSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-brand"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <SearchIcon />
                        </div>
                    </div>
                    <button onClick={onUseLocation} className="w-full md:w-auto bg-blue-brand text-white font-semibold px-6 py-3 rounded-full hover:bg-opacity-90 transition-colors duration-300 flex items-center justify-center space-x-2">
                        <LocationMarkerIcon />
                        <span>Cerca de mí</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                     <select onChange={(e) => onFilterTrade(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-brand">
                        <option value="">Todos los oficios</option>
                        {TRADES.map(trade => <option key={trade} value={trade}>{trade}</option>)}
                    </select>
                    <select onChange={(e) => onFilterExperience(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-brand">
                        <option value="">Cualquier experiencia</option>
                        <option value="5">5+ años</option>
                        <option value="10">10+ años</option>
                        <option value="15">15+ años</option>
                    </select>
                </div>
            </div>

            {workers.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {workers.map(worker => (
                        <WorkerCard key={worker.id} worker={worker} onSelect={onSelectWorker} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold text-gray-700">No se encontraron resultados</h2>
                    <p className="text-gray-500 mt-2">Intenta ajustar tus filtros de búsqueda.</p>
                </div>
            )}
        </div>
    );
};


interface ProfileViewProps {
    worker: Worker;
    onBack: () => void;
}
const ProfileView: FC<ProfileViewProps> = ({ worker, onBack }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <button onClick={onBack} className="flex items-center gap-2 text-blue-brand font-semibold mb-6 hover:underline">
                <BackIcon />
                <span>Volver a la búsqueda</span>
            </button>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 text-center">
                    <img src={worker.photoUrl} alt={worker.name} className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-gray-200" />
                    <h2 className="text-3xl font-bold mt-4">{worker.name}</h2>
                    <div className="flex items-center justify-center mt-2 text-green-600 font-semibold">
                         {worker.verified && <><ShieldCheckIcon /> <span className="ml-1">Usuario Verificado</span></>}
                    </div>
                    <div className="mt-4"><StarRating rating={worker.rating} /></div>
                    <button onClick={() => alert(`Contactando a ${worker.name} al número ${worker.phone}...`)} className="mt-6 w-full bg-blue-brand text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg">
                        Contactar
                    </button>
                     <p className="text-xs text-gray-500 mt-2">Se compartirá tu número para la conexión.</p>
                </div>
                <div className="md:w-2/3">
                    <div className="border-b pb-4">
                        <h3 className="text-xl font-bold text-gray-800">Sobre mí</h3>
                        <p className="text-gray-600 mt-2">{worker.description}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                        <div><h4 className="font-bold">Oficio</h4><p className="text-gray-600">{worker.trade}</p></div>
                        <div><h4 className="font-bold">Ubicación</h4><p className="text-gray-600">{worker.location}</p></div>
                        <div><h4 className="font-bold">Experiencia</h4><p className="text-gray-600">{worker.experience} años</p></div>
                        <div><h4 className="font-bold">Certificaciones</h4>
                            {worker.certifications.length > 0 ? (
                                <ul className="list-disc list-inside text-gray-600">{worker.certifications.map(c => <li key={c}>{c}</li>)}</ul>
                            ) : <p className="text-gray-600">No registradas</p>}
                        </div>
                    </div>
                    <div className="mt-6">
                        <h4 className="font-bold">Métodos de pago aceptados</h4>
                        <div className="flex space-x-4 mt-2">
                           <img src="https://nequi-blog.imgix.net/wp-content/uploads/2021/08/logo-nequi.png?auto=format" alt="Nequi" className="h-8 object-contain"/>
                           <img src="https://seeklogo.com/images/D/daviplata-logo-55675355D5-seeklogo.com.png" alt="Daviplata" className="h-8 object-contain"/>
                           <img src="https://www.rankia.co/images/e/b/6/b/pse-colombia-pagos-seguros-en-linea_1_200.png" alt="PSE" className="h-8 object-contain"/>
                           <span className="text-gray-700 font-medium self-center">Efectivo</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <h3 className="text-2xl font-bold mb-4">Opiniones de clientes</h3>
                {worker.reviews.length > 0 ? (
                    <div className="space-y-6">
                        {worker.reviews.map(review => (
                            <div key={review.id} className="bg-gray-50 p-4 rounded-lg border">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-gray-800">{review.author}</h4>
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                                <div className="my-2"><StarRating rating={review.rating}/></div>
                                <p className="text-gray-600">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-gray-500">Este trabajador aún no tiene opiniones.</p>}
            </div>
        </div>
    );
};


const TrainingView: FC = () => (
    <div>
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Área de Formación Digital</h2>
            <p className="text-lg text-gray-600 mt-2">Potencia tus habilidades y haz crecer tu negocio.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_COURSES.map(course => <CourseCard key={course.id} course={course} />)}
        </div>
    </div>
);


const AdminView: FC = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Panel de Administración</h2>
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold border-b pb-2 mb-4">Registrar Nuevo Oficio</h3>
                <form className="flex gap-4" onSubmit={(e) => { e.preventDefault(); alert('Funcionalidad no implementada en esta demo.'); }}>
                    <input type="text" placeholder="Nombre del oficio" className="flex-grow p-2 border rounded-md" />
                    <button type="submit" className="bg-blue-brand text-white font-semibold px-4 py-2 rounded-md">Agregar</button>
                </form>
            </div>
            <div>
                <h3 className="text-xl font-semibold border-b pb-2 mb-4">Verificar Usuarios</h3>
                <div className="space-y-2">
                    {MOCK_WORKERS.filter(w => !w.verified).map(w => (
                        <div key={w.id} className="flex justify-between items-center p-2 border rounded-md">
                            <span>{w.name} - <span className="text-gray-600">{w.trade}</span></span>
                            <button className="bg-green-500 text-white text-sm px-3 py-1 rounded-md">Verificar</button>
                        </div>
                    ))}
                </div>
                 {MOCK_WORKERS.filter(w => !w.verified).length === 0 && <p className="text-gray-500">No hay usuarios pendientes de verificación.</p>}
            </div>
            <div>
                <h3 className="text-xl font-semibold border-b pb-2 mb-4">Gestionar Reportes</h3>
                <p className="text-gray-500">No hay reportes activos.</p>
            </div>
        </div>
    </div>
);


// SECTION: MAIN APP COMPONENT -----------------------------------------------------------------

const App: FC = () => {
    const [currentView, setCurrentView] = useState<View>('home');
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [tradeFilter, setTradeFilter] = useState('');
    const [experienceFilter, setExperienceFilter] = useState(0);

    const handleSelectWorker = (worker: Worker) => {
        setSelectedWorker(worker);
        setCurrentView('profile');
        window.scrollTo(0, 0);
    };
    
    const handleBackToHome = () => {
        setSelectedWorker(null);
        setCurrentView('home');
    }
    
    const handleUseLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    alert(`Geolocalización exitosa! Buscando servicios cerca de lat: ${position.coords.latitude.toFixed(2)}, lon: ${position.coords.longitude.toFixed(2)}. (Funcionalidad de filtro simulada)`);
                    // Here you would typically filter by distance
                },
                () => {
                    alert('No se pudo obtener la ubicación. Por favor, habilita los permisos.');
                }
            );
        } else {
            alert('La geolocalización no es soportada por este navegador.');
        }
    };
    
    const filteredWorkers = useMemo(() => {
        return MOCK_WORKERS.filter(worker => {
            const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) || worker.trade.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTrade = tradeFilter ? worker.trade === tradeFilter : true;
            const matchesExperience = worker.experience >= experienceFilter;
            return matchesSearch && matchesTrade && matchesExperience;
        });
    }, [searchTerm, tradeFilter, experienceFilter]);

    const renderContent = () => {
        switch (currentView) {
            case 'profile':
                return selectedWorker ? <ProfileView worker={selectedWorker} onBack={handleBackToHome} /> : <HomeView workers={filteredWorkers} onSelectWorker={handleSelectWorker} onSearch={setSearchTerm} onFilterTrade={setTradeFilter} onFilterExperience={(v) => setExperienceFilter(parseInt(v, 10) || 0)} onUseLocation={handleUseLocation} />;
            case 'training':
                return <TrainingView />;
            case 'admin':
                return <AdminView />;
            case 'home':
            default:
                return <HomeView workers={filteredWorkers} onSelectWorker={handleSelectWorker} onSearch={setSearchTerm} onFilterTrade={setTradeFilter} onFilterExperience={(v) => setExperienceFilter(parseInt(v, 10) || 0)} onUseLocation={handleUseLocation} />;
        }
    };
    
    // Bottom navigation for mobile
    const bottomNavItems: { view: View, label: string, icon: React.ReactNode }[] = [
        { view: 'home', label: 'Inicio', icon: <SearchIcon/> },
        { view: 'training', label: 'Formación', icon: <BriefcaseIcon/> },
        { view: 'admin', label: 'Admin', icon: <ShieldCheckIcon/> }
    ];

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 pb-20 md:pb-0">
            <Header currentView={currentView} setView={setCurrentView} />
            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                {renderContent()}
            </main>
             <footer className="bg-white text-center p-4 mt-8 border-t">
                <p>&copy; {new Date().getFullYear()} Conectados. Promoviendo el trabajo decente en Colombia.</p>
            </footer>

            {/* Bottom Nav for Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around">
                {bottomNavItems.map(item => (
                    <button 
                        key={item.view}
                        onClick={() => setCurrentView(item.view)}
                        className={`flex flex-col items-center justify-center p-2 w-full transition-colors duration-200 ${currentView === item.view ? 'text-blue-brand' : 'text-gray-500'}`}
                    >
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default App;
