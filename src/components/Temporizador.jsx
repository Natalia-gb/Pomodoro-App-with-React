const Temporizador = ({tiempo, modo}) => {

    const minutos = Math.floor(tiempo / 1000 / 60);
    const segundos = Math.floor((tiempo / 1000) % 60);

    return (
        <div>
            <h2 className="text-dark mt-3" style={{fontFamily: "fantasy"}}>{minutos}:{segundos.toString().length === 1? "0" + segundos : segundos}</h2>
        </div>
    )
}

export {Temporizador}