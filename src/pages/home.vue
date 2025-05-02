<template>
  <f7-page name="home" class="home" >
    <!-- Top Navbar -->
    <f7-navbar title="ATLANTIS GYM"/>

    <!-- Motivational Image + Quote -->
    <div class="motivational-banner">
      <img src="../img/mancuernas.png" alt="Dumbbell" />
      <div class="quote">NO PAIN<br>NO GAIN</div>
    </div>

    <!--<f7-block >--->
      <div class="bienvenida-cliente">
        <h2>BIENVENIDO, {{ cliente.nombre }}</h2>
        <div class="info-cliente">
          <div class="info-box">
            <div class="info-label">Peso</div>
            <div class="info-value">{{ cliente.peso }} kg</div>
          </div>
          <div class="info-box">
            <div class="info-label">Altura</div>
            <div class="info-value">{{ cliente.altura }} cm</div>
          </div>
          <div class="info-box">
            <div class="info-label">Objetivo</div>
            <div class="info-value">{{ cliente.objetivo }}</div>
          </div>
        </div>
      </div>  
    <!---</f7-block>    --->

    <!-- Cuota Section -->        
      <div class="estado-cuota">
      <div class="cuota-card">
        <div class="cuota-estado">CUOTA VENCIDA 2</div>
        <button class="btn-pagar" >PAGAR</button>
      </div>
    </div>    
          
    <f7-list strong inset>
      <f7-list-item link="/about/" title="Rutina actual"></f7-list-item>
      <f7-list-item link="/about/" title="Pagos"></f7-list-item>
      <f7-list-item link="/about/" title="Mi Perfil"></f7-list-item>
    </f7-list>
    
  </f7-page>
</template>

<script>
export default {
  data() {
    return {
      cliente: {
        nombre: 'Mariano',
        peso: 82,
        altura: 178,
        objetivo: 'Musculación',
        cuota: 'Cuota vencida' // o 'Al día'
      }
    };
  }
};
</script>


