# Foros BogoTIC

TBD

## Introducción

TBD

## Instalación

### Dependencias

  * MongoDB
  * Node.JS
  * NPM

#### Instalación de dependencias

En el directorio raíz donde se encuentra el código fuente se deben
descargar las dependencias especificadas en el archivo `package.json`
de la siguiente manera:

`% npm install`

### Ejecución y puesta en marcha

La forma más facil es ejecutar `app.js` directamente:

`% node server.js`

Sin embargo, existen diferentes ambientes de producción para los
siguientes escenarios, especificados como valores a la variable
de entorno `NODE_ENV`:

  * `DEVELOPMENT`
  * `TESTING`
  * `PRODUCTION`

### Corriendo las pruebas

Las pruebas estan escritas en [Vows](http://vowsjs.org/) un framework de pruebas en node.
Es muy bueno que se familiarize con este framework ya que es el usado en `tests/`

Tenemos 2 clases de tests, los **server-side** y los **client-side**

Las pruebas de client-side adicionalmente usan [Vows-BDD](https://github.com/jmreidy/vows-bdd) y [Zombie](https://github.com/assaf/zombie)

Para correr todas las pruebas solamente ejecute:

`% npm test`

## Participación y desarrollo

Empieza por enviarnos un pull request al repositorio solucionando
algunos de los issues que tenemos actualmente abiertos.

### Pruebas

Todos los pull request deben ir acompañados de sus casos de pruebas
pasando 100%. En realidad esa es la condición más estricta.

En cuanto al estilo de desarrollo y demás, consulta en nuestra
wiki.

### Inclusión a los repos

Los pull request que cumplan con una suite de pruebas completo y que
solucionen algún issue ya reportado es candidato para merge al branch
`development` para luego ser puesto en producción cuando un nuevo
release sea necesario.

### Versionamiento

Por transparencia y retrospección dentro de nuestro ciclo de releases,
y por intentar al máximo la compatibilidad hacia atrás, la aplicación
será mantenida bajo las guías de versionamiento semántico lo más que
podamos.

Los releases serán nombrados de esta manera:

`<mayor>.<menor>.<patch>`

Y construido con los siguientes lineamientos:

    Romper la compatibilidad hacia atrás incrementa el mayor
    Nuevas adiciones sin romper compatibilidad hacia atrás incrementa el menor
    Soluciones a bugs y cambios miscelaneos incrementan el patch

Para más información sobre SemVer, visite http://semver.org/

## Licencia

```
Foros BogoTIC is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Foros BogoTIC is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foros BogoTIC.  If not, see <http://www.gnu.org/licenses/>.
```