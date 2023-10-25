export default class ERouteType {
  static readonly HOME: string = '/';

  static readonly PRODUCT_PATH: string = '/configuraciones/productos';

  static readonly PRODUCT_NAME: string = 'Producto';

  static readonly NEW_PRODUCT_PATH: string = '/configuraciones/nuevo-producto';

  static readonly NEW_PRODUCT_NAME: string = 'Configuracion Nuevo Producto';

  static readonly EDIT_PRODUCT_PATH: string = '/configuraciones/editar-producto/:id';

  static readonly EDIT_PRODUCT_NAME: string = 'Configuracion Editar Producto';

  static readonly ORDER_PATH: string = '/ordenes';

  static readonly ORDER_NAME: string = 'Ordenes';

  static readonly NEW_ORDER_PATH: string = '/nueva-orden';

  static readonly NEW_ORDER_NAME: string = 'Nueva Orden';

  static readonly CONFIGURATIONS_PATH: string = '/configuraciones';

  static readonly CONFIGURATIONS_NAME: string = 'Configuraciones';

  static readonly USER_PATH: string = '/configuraciones/usuarios';

  static readonly USER_NAME: string = 'users';

  static readonly NEW_USER_PATH: string = '/configuraciones/nuevo-usuario';

  static readonly NEW_USER_NAME: string = 'newUser';

  static readonly EDIT_USER_PATH: string = '/configuraciones/editar-usuario/:id';

  static readonly EDIT_USER_NAME: string = 'editUser';

  static readonly CLIENT_PATH: string = '/configuraciones/clientes';

  static readonly CLIENT_NAME: string = 'clientes';

  static readonly NEW_CLIENT_PATH: string = '/configuraciones/nuevo-cliente';

  static readonly NEW_CLIENT_NAME: string = 'newClient';

  static readonly EDIT_CLIENT_PATH: string = '/configuraciones/editar-cliente/:id';

  static readonly EDIT_CLIENT_NAME: string = 'editClient';

  static readonly ACCOUNT_PATH: string = '/cuenta';

  static readonly ACCOUNT_NAME: string = 'Cuenta';

  static readonly USER_LABORATORY_PATH: string = '/cuenta/usuarios-laboratorio';

  static readonly USER_LABORATORY_NAME: string = 'usersBranchOffices';

  static readonly NEW_USER_LABORATORY_PATH: string = '/cuenta/nuevo-usuario-laboratorio';

  static readonly NEW_USER_LABORATORY_NAME: string = 'newUserBranchOffice';

  static readonly EDIT_USER_LABORATORY_PATH: string = '/cuenta/editar-usuario-laboratorio/:id';

  static readonly EDIT_USER_LABORATORY_NAME: string = 'editUserBranchOffice';
}
