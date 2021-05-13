const miModulo = (() => { // FUNCION ANONIMA AUTOINVOCADA. // PATRON MODULO.
    'use strict' // modo stricto para esta f().

    let deck            = [], //Arreglos dinamicos.
        puntosJugadores = [];

    const tipos      = ['C', 'D', 'H', 'S'], // 2C = Two of clubs , 2D = Two of diamonds, 
          especiales = ['A', 'J', 'Q', 'K']; // 2H = Two of hearts, 2S = Two of spades
                    // CARTAS ESPECIALES [A,K,Q,J];


    // REFERENCIAS AL DOM
    const btnDetener = document.querySelector('#btnDetener'),
          btnPedir   = document.querySelector('#btnPedir');

    const divCartasJugador = document.querySelectorAll('.divCartas'),
          puntosHtml       = document.querySelectorAll('small');

    // Funcion para Inicializar Juego.
    const inicializarJuego = ( numJugadores = 2) => {    
        deck = crearDeck();
        puntosJugadores=[];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);     
        }
        puntosHtml.forEach( elem => elem.innerText = 0 );
        divCartasJugador.forEach( elem => elem.innerHTML = '' );

        btnPedir.disabled   = false;
        btnDetener.disabled = false;
    }

    // CREAR DECK
    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push( i + tipo );
            }   
        }
        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push( esp + tipo);
            }
        }
        return  _.shuffle( deck ); // metodo para barajar las cartas // Libreria underscore.js
    }
    // PEDIR CARTA y VALOR DE LA CARTA
    const pedirCarta = () => {
        if ( deck.length === 0 ) {
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    }

    const valorCarta = ( carta ) => {      
        const valor = carta.substring(0, carta.length -1);
        return ( isNaN( valor ) ) ? 
            ( valor === 'A') ? 11 : 10
            : valor * 1;
    }

    // Turno 0 = primer jugador
    const acumularPuntos = ( carta,turno ) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );
        puntosHtml[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${ carta }.png`;
        imgCarta.classList.add('carta');
        divCartasJugador[turno].append( imgCarta );
    }

    const determinarGanador = () => {

        const [ puntosMinimos, puntosCPU ] = puntosJugadores;

        setTimeout(() => {
            if( puntosCPU === puntosMinimos ) {
                alert('Nadie gana :(');
            } else if ( puntosMinimos > 21 ) {
                alert('Computadora gana')
            } else if( puntosCPU > 21 ) {
                alert('Jugador Gana');
            } else {
                alert('Computadora Gana')
            }
        }, 100 );

    }

    // LOGICA TURNO-CPU

    const turnoPc = ( puntosMinimos ) => {
        let puntosCPU = 0;
        do {
            const carta = pedirCarta();
            puntosCPU = acumularPuntos(carta, puntosJugadores.length -1);
            crearCarta( carta, puntosJugadores.length -1);
    
        } while ( (puntosCPU < puntosMinimos) && ( puntosMinimos <= 21) );

       determinarGanador();
    }

    // EVENTOS

    btnPedir.addEventListener('click', () => {
        
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos( carta,0 );
        
        crearCarta( carta , 0 );
        
        if (puntosJugador > 21) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoPc( puntosJugador );

        } else if( puntosJugador === 21) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoPc( puntosJugador )
        }
    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;

        turnoPc( puntosJugadores[0] );
    })
    
    return {
        nuevoJuego: inicializarJuego
    };

})();

