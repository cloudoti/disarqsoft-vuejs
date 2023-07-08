export default class ERouteType {
  static readonly HOME: string = '/';

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

  static readonly PATIENT_PATH: string = '/configuraciones/pacientes';

  static readonly PATIENT_NAME: string = 'Paciente';

  static readonly NEW_PATIENT_PATH: string = '/configuraciones/nuevo-paciente';

  static readonly NEW_PATIENT_NAME: string = 'Configuracion Nuevo Paciente';

  static readonly EDIT_PATIENT_PATH: string = '/configuraciones/editar-paciente/:id';

  static readonly EDIT_PATIENT_NAME: string = 'Configuracion Editar Paciente';

  static readonly ACCOUNT_PATH: string = '/cuenta';

  static readonly ACCOUNT_NAME: string = 'Cuenta';

  static readonly USER_LABORATORY_PATH: string = '/cuenta/usuarios-laboratorio';

  static readonly USER_LABORATORY_NAME: string = 'usersBranchOffices';

  static readonly NEW_USER_LABORATORY_PATH: string = '/cuenta/nuevo-usuario-laboratorio';

  static readonly NEW_USER_LABORATORY_NAME: string = 'newUserBranchOffice';

  static readonly EDIT_USER_LABORATORY_PATH: string = '/cuenta/editar-usuario-laboratorio/:id';

  static readonly EDIT_USER_LABORATORY_NAME: string = 'editUserBranchOffice';
}
