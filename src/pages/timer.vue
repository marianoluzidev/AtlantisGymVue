<template>
  <f7-page name="home">
    <f7-navbar title="Timer Tabata" />

    <f7-block-title>Configuración</f7-block-title>
    <f7-list form>
      <f7-list-input
        label="Prep (segundos)"
        type="number"
        :value="prep"
        inputmode="numeric"
        pattern="\d*"
        @input="prep = $event?.target?.valueAsNumber ?? Number($event?.target?.value || 0)"
      />

      <f7-list-input
        label="Trabajo (segundos)"
        type="number"
        :value="trabajo"
        inputmode="numeric"
        pattern="\d*"
        @input="trabajo = $event?.target?.valueAsNumber ?? Number($event?.target?.value || 0)"
      />

      <f7-list-input
        label="Descanso (segundos)"
        type="number"
        :value="descanso"
        inputmode="numeric"
        pattern="\d*"
        @input="descanso = $event?.target?.valueAsNumber ?? Number($event?.target?.value || 0)"
      />

      <f7-list-input
        label="Ciclos"
        type="number"
        :value="ciclos"
        inputmode="numeric"
        pattern="\d*"
        @input="ciclos = $event?.target?.valueAsNumber ?? Number($event?.target?.value || 0)"
      />

    </f7-list>

    <div style="display: flex; justify-content: center;">
      <f7-button fill @click="comenzarTimer" style="width: 50%;">Comenzar</f7-button>
    </div>

    <!-- Popup -->
    <f7-popup id="popup-timer">
      <f7-page>
        <f7-navbar title="Temporizador" />

        <f7-block class="text-align-center">
          <p style="font-size: 22px; font-weight: bold; margin-bottom: 12px; color: var(--f7-theme-color)">
            {{ estadoActual }}
          </p>

          <div class="circle-timer">
            <div class="circle-content">{{ tiempoRestante }}</div>
          </div>

          <p class="mt-4" v-if="estadoActual !== '¡Finalizado!'" style="font-size: 24px; font-weight: bold;">
            Ciclo {{ cicloActual }} / {{ ciclos }}
          </p>

          <p class="mt-4" v-else style="font-weight: bold; font-size: 20px;">¡Finalizado!</p>
        </f7-block>

        <!-- Botones en fila -->
        <f7-block style="display: flex; justify-content: center; gap: 10px; margin-top: 16px;">
          <f7-button small fill color="orange" @click="togglePausa">
            {{ enPausa ? 'Reanudar' : 'Pausar' }}
          </f7-button>
          <f7-button small fill color="red" @click="cancelarTimer">
            Cancelar
          </f7-button>
        </f7-block>
      </f7-page>
    </f7-popup>

    <!-- Audios -->
    <audio ref="prepSound" src="/sounds/tick.mp3" preload="auto"></audio>
    <audio ref="trabajoSound" src="/sounds/tick.mp3" preload="auto"></audio>
    <audio ref="descansoSound" src="/sounds/tick.mp3" preload="auto"></audio>
    <audio ref="finalSound" src="/sounds/final.mp3" preload="auto"></audio>
    <!-- NUEVOS -->
    <audio ref="trabajoInicioSound" src="/sounds/whistle.mp3" preload="auto"></audio>
    <audio ref="trabajoFinSound" src="/sounds/work_end.mp3" preload="auto"></audio>
  </f7-page>
</template>

<script setup>
import { ref } from 'vue'
import { f7 } from 'framework7-vue'
import { alert,confirm } from '../composables/useAlert'

const prep = ref(5)
const trabajo = ref(30)
const descanso = ref(10)
const ciclos = ref(1)

const tiempoRestante = ref(0)
const estadoActual = ref('Prep')
const colorActual = ref('orange')
const cicloActual = ref(1)

const enPausa = ref(false)
const intervalo = ref(null)

const prepSound = ref(null)
const trabajoSound = ref(null)
const descansoSound = ref(null)
const finalSound = ref(null)
const trabajoInicioSound = ref(null)  // NUEVO
const trabajoFinSound = ref(null)      // NUEVO

const comenzarTimer = () => {
  if (prep.value <= 0 || trabajo.value <= 0 || descanso.value <= 0 || ciclos.value <= 0) {    
    alert({message: 'Por favor completá todos los campos con valores mayores a 0.'});
    return
  }
  // "prime" ligero para móviles (opcional)
  ;[prepSound.value, trabajoSound.value, descansoSound.value, finalSound.value, trabajoInicioSound.value, trabajoFinSound.value]
    .forEach(a => a && a.load())

  estadoActual.value = 'Prep'
  tiempoRestante.value = prep.value
  colorActual.value = 'orange'
  cicloActual.value = 1
  enPausa.value = false
  f7.popup.open('#popup-timer')
  iniciarCuentaRegresiva()
}

const togglePausa = () => { enPausa.value = !enPausa.value }

const cancelarTimer = () => {
  clearInterval(intervalo.value)
  f7.popup.close('#popup-timer')
  resetTimer()
}

const resetTimer = () => {
  tiempoRestante.value = 0
  estadoActual.value = 'Prep'
  colorActual.value = 'orange'
  cicloActual.value = 1
  enPausa.value = false
}

const terminarTimer = () => {
  estadoActual.value = '¡Finalizado!'
  tiempoRestante.value = 0
  colorActual.value = 'gray'
  reproducirSonido('Final')      // si tenés el sonido final
  clearInterval(intervalo.value)
  setTimeout(() => {
    f7.popup.close('#popup-timer')
    resetTimer()
  }, 4000)
}

const reproducirSonido = (estado) => {
  const sonidos = {
    Prep: prepSound.value,          // beeps 3-2-1 de prep
    Trabajo: trabajoSound.value,    // beeps 3-2-1 de trabajo
    Descanso: descansoSound.value,  // beeps 3-2-1 de descanso
    Final: finalSound.value,        // campana final
    TrabajoInicio: trabajoInicioSound.value, // NUEVO: silbato al empezar trabajo
    TrabajoFin: trabajoFinSound.value,       // NUEVO: beep fin de trabajo
  }
  const sonido = sonidos[estado]
  if (sonido) {
    try {
      sonido.currentTime = 0
      sonido.play()
    } catch (e) {
      // ignore
    }
  }
}

const iniciarCuentaRegresiva = () => {
  clearInterval(intervalo.value)
  intervalo.value = setInterval(() => {
    if (enPausa.value) return

    // últimos 3 segundos de cada fase (menos el FIN)
    if (tiempoRestante.value <= 3 && tiempoRestante.value > 0) {
      reproducirSonido(estadoActual.value)
    }

    if (tiempoRestante.value > 0) {
      tiempoRestante.value--
    } else {
      if (estadoActual.value === 'Prep') {
        // Empieza TRABAJO
        estadoActual.value = 'Trabajo'
        tiempoRestante.value = trabajo.value
        colorActual.value = 'green'
        reproducirSonido('TrabajoInicio') // <- si agregaste el silbato
      } else if (estadoActual.value === 'Trabajo') {
        // Termina TRABAJO: ¿hay más ciclos?
        reproducirSonido('TrabajoFin')    // <- si agregaste sonido de fin de trabajo

        if (cicloActual.value < ciclos.value) {
          // Aún quedan ciclos → DESCANSO
          estadoActual.value = 'Descanso'
          tiempoRestante.value = descanso.value
          colorActual.value = 'blue'
        } else {
          // Era el ÚLTIMO trabajo del ÚLTIMO ciclo → FIN (sin descanso)
          terminarTimer()
        }

      } else if (estadoActual.value === 'Descanso') {
        // Descanso SIEMPRE es intermedio (porque el último ya terminó arriba)
        cicloActual.value++
        estadoActual.value = 'Trabajo'
        tiempoRestante.value = trabajo.value
        colorActual.value = 'green'
        reproducirSonido('TrabajoInicio') // <- si agregaste el silbato
      }
    }



  }, 1000)
}
</script>

<style scoped>
.circle-timer {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto;
  background: radial-gradient(circle at center, #eee 60%, #ccc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 1s infinite;
}
.circle-content { font-size: 48px; font-weight: bold; }
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(0, 128, 0, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(0, 128, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 128, 0, 0); }
}
</style>
