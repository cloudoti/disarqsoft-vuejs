<template>
  <BreadCrumb :show-back="showBreadCrumb">Configuración / Producto /
    {{ +props.id > 0 ? 'Editar product' : 'Agregar producto' }}
  </BreadCrumb>
  <form class="relative">
    <Loading
        opacity
        :show="loadingProduct"
        size="10"/>
    <div class="px-5 sm:px-8 lg:px-10 py-5">
      <div class="md:grid grid-cols-2 gap-4">
        <Input
            label="Nombre"
            name="name"
            autocomplete="off"
            v-model="v$.productName.$model"
            placeholder="Ingrese el nombres."
            :required="true"
            :errors="v$.productName.$errors"
        />
        <Switch
            v-model="v$.productStatus.$model"
            :required="true"
            label="Estado"
            on-label=""
            off-label=""
        />
      </div>
    </div>
    <div class="px-5 sm:px-8 lg:px-10 pt-1 pb-5">
      <div class="md:grid grid-cols-2 gap-4">
        <div>
          <Input
              label="Precio"
              name="price"
              autocomplete="off"
              v-model="v$.productPrice.$model"
              placeholder="Ingrese el precio."
              :errors="v$.productPrice.$errors"
          />
        </div>
        <div>
          <Select
              label="Typo de servicio"
              name="typeServiceSelect"
              v-model="typeService"
              :required="true"
              :options="typeServiceList"
              :disabled="disableOfEdit"
              :errors="typeService ? [] : ['Tipo de servicio es obligatorio']"
          >
            <template #optionContent="item">
              {{ item.item.name }}
            </template>
          </Select>
        </div>
      </div>
      <div class="mt-3">(*) Campos obligatorios</div>
    </div>
  </form>
  <div class="px-5 sm:px-8 lg:px-10 py-5 text-right">
    <Button
        :label="btnName"
        :callback="handleSubmit"
        :disabled="btnAcceptDisable"
        :loading="loadingButton"/>
  </div>
</template>
<script setup lang="ts">

import {
  computed, defineProps, reactive, ref,
} from 'vue';
import {
  helpers, maxLength, minLength, minValue, required,
} from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { useToast } from 'vue-toastification';
import { createAlert } from '@/ui/plugins/alert';
import PatientsAPI from '@/data/api/ProductsAPI';
import BreadCrumb from '@/ui/components/BreadCrumb.vue';
// eslint-disable-next-line import/no-cycle
import router from '@/router';
import Button from '@/ui/components/Button.vue';
import Loading from '@/ui/components/Loading.vue';
import Input from '@/ui/components/Input.vue';
import Select from '@/ui/components/Select.vue';
import Product from '@/data/entity/Product';
import Catalog from '@/data/entity/Catalog';
import TypeServicesAPI from '@/data/api/TypeServicesAPI';
import Switch from '@/ui/components/Switch.vue';

let product: Product;
const disableOfEdit = ref(false);

const toast = useToast();
const alert = createAlert();

const loadingProduct = ref(false);
const loadingButton = ref(false);
const typeServiceList = ref<Catalog[]>([]);
const typeService = ref<Catalog>();

const btnName = ref('Agregar producto');
const props = defineProps({
  id: {
    type: String,
    default: '0',
  },
  notRedirect: {
    type: Boolean,
    default: false,
  },
  callbackSubmit: {
    type: Function,
    default: () => true,
  },
  showBreadCrumb: {
    type: Boolean,
    default: true,
  },
});

const formState = reactive({
  productCode: '',
  productName: '',
  productDescription: '',
  productPrice: '',
  productCategory: '',
  productStatus: false,
  productObservation: '',
});

const rules = computed(() => ({
  productName: {
    required: helpers.withMessage('Nombre del producto es obligatorio', required),
    minLength: helpers.withMessage(`Mínimo de caracteres es 10`, minLength(10)),
    maxLength: helpers.withMessage(`Máximo de caracteres es 100`, maxLength(100)),
  },
  productPrice: {
    minValue: helpers.withMessage(`El valor mínimo es 0.01`, minValue('0.01')),
  },
  productStatus: {},
}));

const v$ = useVuelidate(rules, formState, { $autoDirty: true });

const btnAcceptDisable = computed(() => v$.value.$invalid || (typeService.value?.id ?? 0) <= 0);

const handleSubmit = async () => {
  loadingButton.value = true;

  await v$.value.$validate();

  if (v$.value.$invalid) {
    loadingButton.value = false;
    toast.warning('Los datos ingresados no son correctos');
  } else {
    product = {
      name: formState.productName,
      price: +formState.productPrice,
      typeService: {
        id: typeService?.value?.id,
      },
      active: formState.productStatus,
    };
    if (+props.id > 0) {
      product.id = +props.id;
      PatientsAPI.UpdateProduct(product)
        .then(() => {
          toast.success('Los datos fueron modificados correctamente');
          // eslint-disable-next-line no-use-before-define
          goToback();
        })
        .catch((data) => {
          alert.warning(data.observations, { title: 'Error al modificar' });
        })
        .finally(() => {
          loadingButton.value = false;
        });
    } else {
      PatientsAPI.InsertProduct(product)
        .then((data) => {
          toast.success('Los datos fueron registrados satisfactoriamente');
          if (!props.notRedirect) {
            // eslint-disable-next-line no-use-before-define
            goToback();
          }
          // eslint-disable-next-line no-use-before-define
          callBackSubmitResult(data);
        })
        .catch((data) => {
          alert.warning(data.observations, { title: 'Error al guardar' });
        })
        .finally(() => {
          loadingButton.value = false;
        });
    }
  }
};

const mounted = async () => {
  loadingProduct.value = true;
  const promises: Promise<any>[] = [];

  promises.push(TypeServicesAPI.List());

  if (+props.id > 0) {
    promises.push(PatientsAPI.GetById(+props.id));
  }
  Promise.all(promises)
    .then((values) => {
      const [listCategory, pat] = values;
      // Se obtiene el resultado de la primera promesa
      typeServiceList.value = listCategory;
      if (+props.id > 0) {
        product = pat;
        if (product.id! > 0) {
          formState.productName = product.name!;
          formState.productPrice = `${product.price!}`;
          typeService.value = product.typeService;
          formState.productStatus = product.active!;
          btnName.value = 'Editar producto';
        }
      }
    })
    .catch(() => {
      toast.warning('Ocurrio error al cargar la información');
    })
    .finally(() => {
      loadingProduct.value = false;
    });
};
mounted();

const callBackSubmitResult = (obj: Product) => {
  if (props.callbackSubmit !== undefined && typeof props.callbackSubmit === 'function') {
    props.callbackSubmit(obj);
  }
};

const goToback = () => {
  router.go(-1);
};

</script>
<style>
.hyperlink {
  @apply text-blue-600 underline
}

.hyperlink:visited {
  @apply text-purple-600
}
</style>
