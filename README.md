# labinhome-backoffice-vuejs

https://tailwindui.com/components/application-ui/overlays/modals

## Initial Setup

### Create .env file

Siempre la variable debe iniciar con VUE_APP_

```
VUE_APP_API_URL=http://HOST:POST
```

## Components

### Loading

```
/* 
Uso en <template>
Las variables a usar son:
    loading:           Boolean // Muestra o oculta el loading
    opacity:           Boolean // Opaca el contenedor por defecto false
    size:              number  // tamaño de loading por defecto (10)
*/
<Loading
      :show="loading"
      size="20"/>
  
// Importar en <script>
import Modal from '@/ui/components/Modal.vue';
```

### Button

```
/* 
Uso en <template>
Las variables a usar son:
    label:             String // Nombre del botón
    loading:           Boolean // Muestra o oculta el loading
    disabled:          Boolean // Desabilita el boton
    callback:          Function  // retorno de llamada
*/
<Button
      :label="btnName"
      :callback="handleSubmit"
      :disabled="btnAcceptDisable"
      :loading="loadingButton"></Button>
  
// Importar en <script>
import Button from '@/ui/components/Button.vue';
```

### Modal

```
/* 
Uso en <template>
Las variables a usar son:
    v-model:           Boolean // Muestra o oculta el modal
    hideClose:         Boolean // Indica si se oculta el boton cerrar por defecto false
    dismissible:       Boolean // indica si se cierra al dar click fuera del modal
*/
<Modal
    :v-modal="showModal"
    :hide-close="true"
    :dismissible="false">
    AQUÍ VA EL CUERPO
  </Modal>
  
// Importar en <script>
import Modal from '@/ui/components/Modal.vue';
```

### Toast

```
/* 
Uso unicamente en script
  
// Uso en <script>
import { useToast } from 'vue-toastification';

const toast = useToast();

toast.info('texto');
toast.success('texto');
toast.warning('texto');
toast.error('texto');
```

### Alerts

```
/* 
Uso unicamente en script
Las variables a usar son:
    messages (Requerido):       Array<String> // Mensaje a mostrar
    options.title:              String // Personaliza el titulo
    options.buttonYesName:      String // Personaliza el texto del boton
    options.showButtonCancel:   Boolean // Muestra u oculta el boton cancelar, por defecto false (Oculto)
    options.buttonCancelName:   String // Personaliza el texto del boton
    options.dismissible:        Boolean // Por defecto true se cierra al dar click en el fondo
    options.onClickYes:         Function // Callback al dar click en el boton de confirmación
    options.onClickCancel:      Function // Callback al dar click en el boton de cancelación
    options.onClose:            Function // Callback al cerrar el modal
*/
  
// Uso en <script>
import { createAlert } from '@/ui/plugins/alert';

const alert = createAlert();

alert.info('texto', options);
alert.success('texto', options);
alert.warning('texto', options);
alert.error('texto', options);
```

### Debounce

```
// Uso en <template>

<input
      type="text"
      v-model.lazy="search"
      v-on:change="funcionWhenDebounceFinish()"
      v-debounce="500"
    />
```

### Toggle

```
/* 
Uso en <template>
Las variables a usar son:
    v-bind:disabled:        Boolean // Deshabilitar o habilitar el switch
    v-bind:change:          Function // Callback que se ejecuta al cambiar el valor del switch
    v-model:                Boolean // Variable que tiene el valor del switch
    v-bind:label:           String // Texto que se muestra a la derecha del switch
*/
<Toggle
    v-bind:disabled="false"
    v-bind:change="cleanServiceList"
    v-model="activateService"
    v-bind:label="'Activar servicio.'"
/>
  
// Importar en <script>
import Toggle from '@/ui/components/Toggle.vue';
```

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test:unit
```

### Run your end-to-end tests

```
npm run test:e2e
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

