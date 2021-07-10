export enum Texts {
  HOME = 'Inicio',
  EXPORT = 'Exportar',
  EXPORTING = 'Exportando',
  FILTER = 'Filtrar',
  CLEAN = 'Limpiar',
  LOADING = 'Cargando',
  USER = 'Usuario',
  SECTOR = 'Sector',
  PROFILE = 'Perfil',
  STATUS = 'Estado',
  ADD = 'Agregar',
  EDIT = 'Editar',
  SAVE = 'Guardar',
  UPDATE = 'Actualizar',
  DELETE = 'Eliminar',
  CANCEL = 'Cancelar',
  DESCRIPTION = 'Descripción',
  RESTRICT = 'Restringir',
  REGISTRIES = 'Registros',
  INSERT_DESCRIPTION = 'Ingrese una descripción',
  DELETE_SELECTED_ROWS = '¿Desea eliminar las filas seleccionadas?',
  DELETE_ROW = '¿Desea eliminar la fila?',
  CLEAN_FIELDS = '¿Desea limpiar los campos?',
  GET_EXPIRATION_DATE = 'Calculando fecha de vencimiento',
  ISSUE_DATE = 'Fecha de emisión',
  EXPIRATION_DATE = 'Fecha de vencimiento',
  CREATION_DATE = 'Fecha de generación',
  MODIFICATION_DATE = 'Fecha de modificación',
  CONTENT_DATE = 'Fecha de Contenido',
  BOX = 'Caja',
  BOXES = 'Cajas',
  NA = 'N/A',
  LABELS = 'Etiquetas',
  PREVIEW = 'Vista preliminar',
  BOX_TYPE = 'Tipo de caja',
  CONTENT_TYPE = 'Tipo de contenido',
  TEMPLATE = 'Plantilla',
  SELECT_BOX_TYPE = 'Seleccione un tipo de caja',
  SELECT_CONTENT_TYPE = 'Seleccione un tipo de contenido',
  SELECT_TEMPLATE = 'Seleccione una plantilla',
  YES = 'Sí',
  NO = 'No',
  TODAY = 'Hoy',
  CURRENT_MONTH = 'Mes actual',
  LATEST_MONTH = 'Mes anterior',
  ACTIONS = 'Acciones',
  SAVE_REGISTRY_SUCCESS = 'Registro agregado correctamente',
  UPDATE_REGISTRY_SUCCESS = 'Registro actualizado correctamente',
  SAVE_REGISTRY_FAILURE = 'Registro agregado correctamente',
  FIELDS_VALIDATION_FAILURE = 'Error al validar',
  YEAR = 'Año',
  YEARS = 'Años',
  MONTH = 'Mes',
  MONTHS = 'Meses',
  DOCUMENTS = 'Documentos',
  ORDERS = 'Pedidos',
  MY_SCANS = 'Mis Digitalizaciones',
  PENDING_CLOSE = 'Pendientes de Cierre',
  PENDING_RETURN = 'Pendientes de Devolución',
  PENDING_SEND = 'Pendientes de Envío',
  TO_RESOLVE = 'Por Resolver',
  RESOLVED = 'Resueltos',
  REJECTED = 'Rechazados',
  AVAILABLE = 'Disponibles',
  SENT = 'Enviados',
  INDEXED = 'Indexados',
  ERRORS = 'Errores',
  NOT_FOUND = 'No encontrado',
  // TOPS
  MESSAGES = 'Mensajes',
  MESSAGE = 'Mensaje',
  REQUESTS = 'Solicitudes',
  REQUEST = 'Solicitud',
  NEW_REQUEST = 'Nueva Solicitud',
  NEW_INSTRUCTION = 'Nueva Instrucción',
  TRANSFERS = 'Transferencias',
  TRANSFER = 'Transferencia',
  PAY_ORDER = 'Orden de Pago',
  PAY_ORDERS = 'Ordenes de Pago',
  NEW_TRANSFER = 'Nueva Transferencia',
  // FIELDS
  WATCH = 'Ver',
  ID = 'ID',
  TYPE = 'Tipo',
  ORIGINATOR = 'Ordenante',
  BENEFICIARY = 'Beneficiario',
  PERSON_TYPE = 'Tipo de Persona',
  CURRENCY = 'Moneda',
  CUIT = 'CUIT',
  NIF = 'NIF',
  DOCUMENT_TYPE = 'Tipo de Documento',
  DOCUMENT_NUMBER = 'Número de Documento',
  FIRST_NAME = 'Nombre',
  LAST_NAME = 'Apellido',
  NAME_BUSINESS_NAME = 'Razón Social',
  DATE = 'Fecha',
  COUNTRY = 'País',
  BANK = 'Banco',
  CORRESPONDENT_BANK = 'Banco Corresponsal',
  AMOUNT = 'Importe',
  ACCOUNT = 'Cuenta',
  ACCOUNT_NUMBER = 'Número de Cuenta',
  ACCOUNT_SOURCE = 'Cuenta Origen de Fondos',
  ACCOUNT_TARGET = 'Cuenta Destino de Fondos',
  ACCOUNT_COMMISSIONS = 'Cuenta Débito de Comisiones',
  ACCOUNTS_CLIENT = 'Cuentas Cliente',
  ACCOUNT_BENEFICIARY = 'Cuenta Beneficiario',
  ACCOUNT_INTERMEDIARY = 'Cuenta Intermediario',
  CONCEPT = 'Concepto',
  FEE_TYPE = 'Tipo de Comisión',
  DATE_BIRTH = 'Fecha de Nacimiento',
  STREET = 'Calle',
  NUMBER = 'Número',
  FLOOR = 'Piso',
  DEPARTMENT = 'Departamento',
  LOCALITY = 'Localidad',
  ZIP_CODE = 'Código Postal',
  EXPENSE_DETAIL = 'Detalle de Gastos',
  LINKED_BENEFICIARY = 'Vinculado con Beneficiario',
  BANK_CODE = 'Código del Banco',
  BANK_CODE_TYPE = 'Tipo de Código del Banco',
  BANK_CODE_OPTIONAL = 'Código del Banco Adicional',
  BANK_CODE_TYPE_OPTIONAL = 'Tipo de Código del Banco Adicional',
  // PLACEHOLDERS
  SELECT_PERSON_TYPE = 'Seleccione un tipo de persona',
  SELECT_COUNTRY = 'Seleccione un país',
  SELECT_CURRENCY = 'Seleccione una moneda',
  SELECT_BANK_CODE_TYPE = 'Seleccione una tipo de código',
  SELECT_DATE = 'Seleccione una fecha',
  SELECT_BANK = 'Seleccione un banco',
  SELECT_CORRESPONDENT = 'Seleccione un corresponsal',
  SELECT_FEE_TYPE = 'Seleccione un tipo de comisión',
  SELECT_CONCEPT = 'Seleccione un concepto',
  SELECT_ACCOUNT = 'Seleccione una cuenta',
  SELECT_EXPENSE_DETAIL = 'Seleccione un detalle de gasto',
  // MESSAGES
  TRANSFER_CREATION_OK = 'Transferencia creada correctamente',
  TRANSFER_CREATION_ERROR = 'Error al crear transferencia',
  // SEARCH CLIENT
  SEARCH_CLIENT_LOADING = 'Buscando cliente',
  SEARCH_CLIENT_OK = 'Cliente encontrado',
  SEARCH_CLIENT_OK_MULTIPLE_RESULTS = 'Se ha encontrado %0% clientes',
  SEARCH_CLIENT_ERROR = 'Error al encontrar cliente',
  // SEARCH ACCOUNTS
  SEARCH_ACCOUNTS_LOADING = 'Buscando cuentas del cliente',
  SEARCH_ACCOUNTS_OK = 'Cuentas encontradas',
  SEARCH_ACCOUNTS_ERROR = 'Error al encontrar cuentas del cliente',
}
