import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="py-10 bg-indigo-600">
      <div className="container mx-auto flex justify-between item-center">
          <h1 className="font-bold text-indigo-200 text-2xl">Administrador de {''} <span className="text-white">Veterinaria</span></h1>
        
        <nav className='flex gap-4'>
          <Link to="/admin" className='text-white text-xl uppercase font-bold'>Pacientes</Link>
          <Link to="" className='text-white text-xl uppercase font-bold'>Perfil</Link>
          
          <button type="button" className='text-white text-xl uppercase font-bold'> Cerrar sesión </button>
        </nav>
      </div>

    </header>
  )
}

export default Header