<p align="center">
  <img src="https://github.com/DJMS-Team/djms-back/assets/101611405/70d0e0b6-6ef0-4198-bff1-35a17dc8d147" alt="logo" width="400" height="400">
</p>

## Despliegue URL

https://djms-api.icybeach-62331649.eastus.azurecontainerapps.io

## Instalación

```bash
$ npm install
```


## Ejecución la aplicación

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Variables de entorno (.env)

Se debe crear el archivo .env en la raiz del proyecto y colocar los siguientes valores.

```env
DB_HOST=dmjs-store.postgres.database.azure.com
DB_USER=DMJS_admin
DB_PASSWORD=Contacta-al-equipo
DB_PORT=5432
DB_NAME=postgres
JWT_SECRET=Contacta-al-equipo
GOOGLE_CLIENT_ID = 947066999048-pee5svsebv8s6bu55d3ed36pb8cecqkg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = Contacta-al-equipo
CALL_BACK_URL = http://localhost:3001/auth/google/callback
GOOGlE_PASSWORD= Contacta-al-equipo
PAYPAL_CLIENT_ID = Af96yQ12uBm5mMfDR4xzjlAOAyBQisWlDb9RPVe5RBCcp8nVWzOR_ez29QpI0MtobBWJ9DkBp0Vr4NIc
PAYPAL_SECRET = Contacta-al-equipo
PAYPAL_API = https://api-m.sandbox.paypal.com
BREVO_API = Contacta-al-equipo
FRONT_URL = http://localhost:3000
BACK_URL = http://localhost:3001
NEXT_PUBLIC_API_URL=https://api.totalgpt.ai
NEXT_PUBLIC_API_KEY=Contacta-al-equipo
```

## Tests

Realizamos los tests en Jest. Así pues, creamos un [Plan de pruebas](https://github.com/DJMS-Team/djms-back/blob/main/docs/Test%20Plan.md). Con los siguientes comandos se pueden ejeuctar. Obtuvimos un coverage mayor al 85%.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Tecnologías

- **Desarrollo**: Nest.js.
- **Despliegue (CD)**: Azure. Para hacer un despliegue continuo creamos un contenedor con Docker en el que especificamos la máquina virtual y distintos detalles de la aplicación con el fin de llevarla a Azure para su despliegue.
- **Integración (CI)**: GitHub Actions. Para hacer una integración continua creamos un flujo de trabajo en GitHub que cada vez que hiciéramos push ejecutara ciertos comandos, tales como `npm run build`.

## Documentación de la API

Nuestra API está documentada usando Swagger. Para ver esta documentación interactiva, puedes ir al siguiente URL cuando el servidor está corriendo de manera local: http://localhost:3001/documentation/. En caso de estar en el link de la API desplegada, solo debes agregar /documentation.

## Arquitectura
Para el desarrollo del backend utilizamos una arquitectura monolítica en la cual implementamos el patrón MVC. Lo anterior debido al corto tiempo y a la complejidad que posee realizar otro tipo de arquitecturas como microservicios. A su vez, cumple con las necesidades actuales de la página.

## Base de datos
Utilizamos una base de datos relacional debido a la naturaleza del problema, pues se debe llevar un control con consistencia, disponibilidad y tolerancia a fallos. Así, almacenar los datos mediante tablas facilita las consultas, las inserciones y disminuye la complejidad de la aplicación. Pensamos en un diseño escalable a futuro, por tanto, poseemos distintas entidades las cuales nos brindan este atributo de calidad. Para el diseño utilizamos DataModeler y para la implementación utilizamos Postgres.

<p align="center">
  <img src="https://github.com/DJMS-Team/djms-back/assets/101611405/ac058836-8ce8-407a-831c-9ee9567705c6" alt="logo" width="1000" height="600">
</p>
