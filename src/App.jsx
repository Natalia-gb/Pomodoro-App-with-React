import { useEffect, useState } from 'react';
import './App.css'
import { Temporizador} from './components/Temporizador';

function App() {
  
  const [descansoCorto, setdescansoCorto] = useState(5*60);
  const [descansoLargo, setDescansoLargo] = useState(15*60);
  const [duracionPomodoro, setDuracionPomodoro] = useState(25*60);
  // El estado modo nos indica en qué modo se encuentra la app (Pomodoro o Descanso)
  const [modo, setModo] = useState();
  const [tiempoRestante, settiempoRestante] = useState();
  // Este estado marca si el temporizador está corriendo o no
  const [activo, setActivo] = useState(false);
  // Estado que guarda el tiempo desde que se ha pulsado el botón de Empezar
  const [tiempoGastado, setTiempoGastado] = useState(0);
  const [tareas, setTareas] = useState([]);
  const [nombreTarea, setNombreTarea] = useState("");
  const [numPomodoros, setNumPomodoros] = useState(0);

  // El estado TiempoRestante cambia su valor en función del modo de la app cada vez que se actualice el pomodoro y los descansos
  useEffect(() => {
    if(modo == "Pomodoro"){
      setModo("Pomodoro");
      settiempoRestante(duracionPomodoro * 1000);
    }else if(modo == "Descanso corto"){
      setModo("Descanso corto");
      settiempoRestante(descansoCorto * 1000);
    }else if(modo == "Descanso largo"){
      setModo("Descanso largo");
      settiempoRestante(descansoLargo * 1000);
    }
  }, [duracionPomodoro, descansoCorto, descansoLargo]);

  const tiempoPomodoro = () => {
    setModo("Pomodoro");
    settiempoRestante(duracionPomodoro*1000);
  }

  const tiempoDescansoCorto = () => {
    setModo("Descanso corto");
    settiempoRestante(descansoCorto*1000);
  }

  const tiempoDescansoLargo = () => {
    setModo("Descanso largo");
    settiempoRestante(descansoLargo*1000);
  }

  // Se comprueba que el temp. está activo y que el tiempo restante sea mayor a 1, es decir, que aún queda tiempo que descontar
  // Si ambas condiciones se cumplen, se calcula el tiempo que queda y se suma 1 segundo al estado TiempoGastado
  // Se ejecutará hasta que la variable Activo cambie y pase a ser falso. Cuando ocurra, se limpia el intervalo.
  useEffect(() => {
    let intervalo = null;
    if(activo && tiempoRestante > 1){
      if(modo == "Pomodoro"){
        setModo("Pomodoro");
        settiempoRestante(duracionPomodoro * 1000 - tiempoGastado);
      }else if(modo == "Descanso corto"){
        setModo("Descanso corto");
        settiempoRestante(descansoCorto * 1000 - tiempoGastado);
      }else if(modo == "Descanso largo"){
        setModo("Descanso largo");
        settiempoRestante(descansoLargo * 1000 - tiempoGastado);
      }
      
      intervalo = setInterval(() => {
        setTiempoGastado((tiempoGastado) => tiempoGastado + 1000);
      }, 1000);
    }else{
      clearInterval(intervalo);
    }

    if(tiempoRestante === 0){
      setTiempoGastado(0);
    }

    if(tiempoRestante == duracionPomodoro && tiempoRestante == descansoCorto &&  tiempoRestante == descansoLargo){
      setNumPomodoros(numPomodoros+1);
    }

    return () => clearInterval(intervalo);
  }, [activo, tiempoGastado]);

  function resetear(){
    setdescansoCorto(descansoCorto);
    setDuracionPomodoro(duracionPomodoro);
    setDescansoLargo(descansoLargo);

    if(modo == "Pomodoro"){
      settiempoRestante(duracionPomodoro * 1000);
      setModo("Pomodoro");
    }else if(modo == "Descanso corto"){
      settiempoRestante(descansoCorto * 1000);
      setModo("Descanso corto");
    }else if(modo == "Descanso largo"){
      settiempoRestante(descansoLargo * 1000);
      setModo("Descanso largo");
    }

    if(activo){
      setActivo(false);
      setTiempoGastado(0);
    }
  }

  function toggleActivo(){
    setActivo(!activo);
  }

  const añadirTarea = (event) => {
    event.preventDefault();
    setTareas([...tareas, {nombre: nombreTarea}]);
    setNombreTarea("");
  }

  const eliminarTarea = (id) => {
    return tareas.splice(id, 1);
  }

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-lg-12">
            <h1 className='text-dark' style={{fontFamily: "fantasy"}}>Pomodoro by Natalia Gómez</h1>
            <h2 className='text-light'>{modo}</h2>
            <div className="d-flex justify-content-center align-items-center">
                <button className="btn btn-info me-2" style={{fontFamily: "fantasy"}} onClick={tiempoPomodoro}>Pomodoro</button>
                <button className="btn btn-info me-2" style={{fontFamily: "fantasy"}} onClick={tiempoDescansoCorto}>Descanso corto</button>
                <button className="btn btn-info" style={{fontFamily: "fantasy"}} onClick={tiempoDescansoLargo}>Descanso largo</button>
            </div>
            <Temporizador tiempo={tiempoRestante} modo={modo}/>
            <div className='botones'>
              <button onClick={toggleActivo} className="btn btn-success me-3">{activo? "Pausar" : "Empezar"}</button>
              <button onClick={resetear} className="btn btn-light">Resetear</button>
            </div>
            <form onSubmit={añadirTarea} className="mt-5">
              <div className='d-block justify-content-center align-items-center'>
                <h3 className='text-dark' style={{fontFamily: "fantasy"}}>Añadir pomodoro</h3>
                <hr />
                <div className='d-flex'>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Nombre del pomodoro</span>
                    <input type="text" className="form-control" aria-label="Username" aria-describedby="basic-addon1" value={nombreTarea} onChange={(e) => setNombreTarea(e.target.value)}></input>
                  </div>
                  <button className='btn btn-success ms-3'>Añadir</button>
                </div>
                {tareas.map((t) => 
                  <div key={t.id} className="d-flex justify-content-center align-items-center">
                    <div className='d-flex justify-content-between align-items-center'>
                      <h2 className="text-dark" style={{fontFamily: "fantasy"}}>{t.nombre}</h2>
                      <p className='text-dark ms-3 mt-2' style={{fontWeight: "bold"}}>{numPomodoros}/3</p>
                    </div>
                    
                    <button className='btn btn-danger mb-2 ms-4' onClick={() => eliminarTarea(t.id)}>X</button>
                  </div>
                )}
              </div>  
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
