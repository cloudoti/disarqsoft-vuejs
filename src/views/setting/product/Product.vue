<template>
  <BreadCrumb :show-back="showBreadCrumb">Configuración / Producto /
    {{ +props.id > 0 ? 'Editar product' : 'Agregar product' }}
  </BreadCrumb>
  <form class="relative">
    <Loading
        opacity
        :show="loadingProduct"
        size="10"/>
    <div class="px-5 sm:px-8 lg:px-10 py-5">
      <div class="grid grid-cols-2 gap-4">
        <Input
            label="Código"
            name="code"
            autocomplete="off"
            v-model="v$.productCode.$model"
            placeholder="Ingrese código."
            :required="true"
            :errors="v$.productCode.$errors"
        />
        <div>
          <Input
              label="Nombre"
              name="name"
              autocomplete="off"
              v-model="v$.productName.$model"
              placeholder="Ingrese el nombres."
              :required="true"
              :errors="v$.productName.$errors"
          />
        </div>
      </div>
    </div>
    <div class="px-5 sm:px-8 lg:px-10 py-5">
      <Input
          label="Descripción"
          name="description"
          autocomplete="off"
          v-model="v$.productDescription.$model"
          placeholder="Ingrese la descripción."
          :errors="v$.productDescription.$errors"
      />
    </div>
    <div class="px-5 sm:px-8 lg:px-10 pt-1 pb-5">
      <div class="md:grid grid-cols-2 gap-4">
        <div>
          <Select
              label="Categoria"
              name="categorySelect"
              v-model="category"
              :required="true"
              :options="categories"
              :disabled="disableOfEdit"
          >
            <template #optionContent="item">
              {{ item.item.name }}
            </template>
          </Select>
        </div>
        <div>
          <Select
              label="Estado"
              name="statusSelect"
              v-model="status"
              :required="true"
              :options="statusList"
              :disabled="disableOfEdit"
          >
            <template #optionContent="item">
              {{ item.item.name }}
            </template>
          </Select>
        </div>
      </div>
    </div>
    <div class="px-5 sm:px-8 lg:px-10 py-5">
      <TextArea
          label="Observacion"
          name="observation"
          autocomplete="off"
          v-model="v$.productObservation.$model"
          placeholder="Observaciones"
          :errors="v$.productObservation.$errors"
      />
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
import { helpers, maxLength, required } from '@vuelidate/validators';
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
import TextArea from '@/ui/components/TextArea.vue';
import Select from '@/ui/components/Select.vue';
import Product from '@/data/entity/Product';
import Category from '@/data/entity/Category';
import Status from '@/data/entity/Status';
import CategoryAPI from '@/data/api/CategoryAPI';

let product: Product;
const disableOfEdit = ref(false);

const toast = useToast();
const alert = createAlert();

const loadingProduct = ref(false);
const loadingButton = ref(false);
const categories = ref<Category[]>([]);
const category = ref<Category>();
const statusList = ref<Status[]>([{
  code: 'B',
  name: 'Bueno',
},
{
  code: 'R',
  name: 'Regular',
},
{
  code: 'D',
  name: 'Defectuoso',
}]);
const status = ref<Status>();

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
  productCategory: '',
  productStatus: '',
  productObservation: '',
});

const rules = computed(() => ({
  productCode: {
    required: helpers.withMessage('Código del producto es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 20`, maxLength(20)),
  },
  productName: {
    required: helpers.withMessage('Nombre del producto es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 100`, maxLength(100)),
  },
  productDescription: {
    maxLength: helpers.withMessage(`Máximo de caracteres es 100`, maxLength(100)),
  },
  productObservation: {
    maxLength: helpers.withMessage(`Máximo de caracteres es 100`, maxLength(100)),
  },
}));

const v$ = useVuelidate(rules, formState, { $autoDirty: true });

const btnAcceptDisable = computed(() => v$.value.$invalid);

const handleSubmit = async () => {
  loadingButton.value = true;

  await v$.value.$validate();

  if (v$.value.$invalid) {
    loadingButton.value = false;
    toast.warning('Los datos ingresados no son correctos');
  } else {
    product = {
      code: formState.productCode,
      name: formState.productName,
      description: formState.productDescription,
      category: {
        id: category.value?.id,
      },
      status: status.value?.code,
      observation: formState.productObservation,
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

  promises.push(CategoryAPI.ListCategory());

  if (+props.id > 0) {
    promises.push(PatientsAPI.GetById(+props.id));
  }
  Promise.all(promises)
    .then((values) => {
      const [listCategory, pat] = values;
      // Se obtiene el resultado de la primera promesa
      categories.value = listCategory;
      if (+props.id > 0) {
        product = pat;
        if (product.id! > 0) {
          formState.productCode = product.code!;
          formState.productName = product.name!;
          formState.productDescription = product.description!;
          formState.productObservation = product.observation!;
          category.value = product.category;
          status.value = statusList.value.find((s) => s.code === product.status);
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
