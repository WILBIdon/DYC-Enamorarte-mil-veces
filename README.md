# Daniela & Camilo — Tarjeta de matrimonio

Invitación digital. Sábado 12 de diciembre de 2026. Ceremonia en Altos del
Poblado, Medellín; recepción en Rionegro (Antioquia).

## Cómo se ve

1. **Portada** — el sobre lacrado y un botón dorado, *Abrir tarjeta*.
2. **Clip** — al tocar el botón arranca el video con sonido.
3. **Tarjeta** — al terminar el video la pantalla funde a blanco y entra la
   invitación sobre el arco floral. Tres segundos después empieza la canción.

Pensada para celular (9:16). Entra completa en una sola pantalla desde
320 × 693 px en adelante.

## Correr en local

```bash
npm start
```

Queda en <http://localhost:3100>.

## Los medios

El servidor lee la carpeta y toma el primer video y el primer audio que
encuentre (`/api/media`), así que para cambiar la canción o el clip basta con
reemplazar el archivo — no hay que tocar código.

| Archivo | Para qué |
| --- | --- |
| `portada.webp` / `.jpg` | Fondo de la portada |
| `fondo.webp` / `.jpg` | Fondo de la tarjeta |
| `nuevo video con texto.mp4` | El video de apertura (27 s) |
| `Enamorarte Mil Veces.mp3` | La canción |
| `og.jpg` | Lo que se ve al compartir el enlace |
| `favicon.ico`, `apple-touch-icon.png`, `icon-*.png` | El icono de la pestaña y de la pantalla de inicio |

### La imagen al compartir

Guarda la imagen en esta carpeta como **`og.jpg`** (también sirve `og.png`
o `og.webp`). El servidor la detecta sola y arma la dirección absoluta que
exige Open Graph, sea en local o en Railway — no hay que escribir el dominio
en ningún lado.

La que está ahora se armó con el mismo arco floral de la tarjeta, en
1200 × 630 px. Para cambiarla por una foto de ustedes, basta con reemplazar
el archivo manteniendo el nombre.

Expórtala en 1200 × 630 px: es la proporción que usan WhatsApp, Facebook e
Instagram, y evita que la recorten mal. Si usas otro tamaño, ajusta las dos
medidas que están junto a `og:image` en `index.html`.

Si cambias la imagen después de haber compartido el enlace, WhatsApp guarda
la anterior en caché un buen rato. Para forzarla, comparte el enlace con algo
detrás, por ejemplo `?v=2`.

## Qué se puede editar sin saber código

Todo lo editable está junto, en el bloque `CONFIG` al final de `index.html`:

| Campo | Qué controla |
| --- | --- |
| `hojaConfirmaciones` | Dirección de la hoja de Google que recibe las confirmaciones |
| `whatsapp` | Número de respaldo si la hoja falla (con indicativo, sin `+`) |
| `mapas.ceremonia` / `mapas.recepcion` | Los dos enlaces de Google Maps |
| `esperaMusica` | Milisegundos antes de que arranque la canción |

La canción suena a su propio nivel, sin que la tarjeta lo toque, para que
vaya pareja con el audio del video de apertura. Quien manda el volumen es el
teléfono. Si quedara muy alta o muy baja, lo que hay que cambiar es el mp3,
no el código.


Los textos (nombres, fecha, horas, la frase del centro) están en el HTML, en
español y sin tecnicismos alrededor.

## Las confirmaciones en una hoja de Google

Las confirmaciones pueden caer solas en una hoja de cálculo tuya. El archivo
`confirmaciones.gs` trae el código y los pasos escritos arriba del todo; en
resumen son cinco:

1. Crea una hoja nueva en <https://sheets.google.com>.
2. Menú **Extensiones → Apps Script**.
3. Borra lo que haya y pega todo `confirmaciones.gs`. Guarda.
4. **Implementar → Nueva implementación**, tipo *Aplicación web*, ejecutar
   como *yo*, acceso para **cualquier usuario**. Google te pedirá permiso
   una vez.
5. Copia la dirección que termina en `/exec` y pégala en `index.html`, en
   `CONFIG.hojaConfirmaciones`.

Queda una fila por invitado con fecha, nombre, plato y el mensaje que te
dejen. Para que además te llegue un correo con cada confirmación, dentro de
`confirmaciones.gs` hay una línea de `MailApp` lista: solo quítale las dos
barras y escribe tu correo.

Mientras `hojaConfirmaciones` esté vacía, las confirmaciones siguen llegando
por WhatsApp, como antes. Y si algún día la hoja no responde, la tarjeta no
pierde la confirmación: la manda por WhatsApp y avisa al invitado.

## El icono

El monograma D & C en dorado sobre el fondo de la tarjeta. Son cinco
archivos (`favicon.ico` para la pestaña, `apple-touch-icon.png` para el
iPhone, y los `icon-*.png` para Android, que los lee desde
`site.webmanifest`). Los tres tamaños del `.ico` están dibujados por
separado para que a 16 px se lean las letras.

## Despliegue

Railway, con `npm start`. El puerto lo inyecta el hosting por la variable
`PORT`; en local cae a 3100. **No hace falta volumen**: la tarjeta no escribe
nada en disco, solo lee, y el video, la canción y las imágenes viajan dentro
del repositorio.

El dominio se saca en *Settings → Networking → Generate Domain*. El servidor
arma solo las direcciones de Open Graph con el dominio que reciba, así que
sirve cualquiera sin configurar nada.

### Velocidad

El video y el fondo floral empiezan a bajar mientras el invitado todavía ve
la portada, de modo que al tocar *Abrir tarjeta* no hay espera. Los medios se
guardan en el navegador una semana: quien vuelva a entrar no baja otra vez
los 8 MB del video. El HTML nunca se cachea, así los cambios se ven al
recargar.

Los dos fondos van en WebP, con respaldo JPEG para navegadores viejos: pesan
921 KB entre los dos en vez de 4,9 MB, sin diferencia visible (43 y 42 dB de
PSNR; por encima de 40 el ojo no distingue). Los originales se conservan en
`Arco floral y velas romántico.png` y `clip inicial.jpeg` por si hay que
volver a exportarlos; puedes borrarlos sin que la tarjeta se entere.
