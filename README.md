# Daniela & Camilo — Tarjeta de matrimonio

Invitación digital. Sábado 12 de diciembre de 2026, Rionegro (Antioquia).

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
| `clip inicial.jpeg` | Fondo de la portada |
| `nuevo video.mp4` | El video de apertura |
| `Arco floral y velas romántico.png` | Fondo de la tarjeta |
| `Enamorarte Mil Veces.mp3` | La canción |

## Qué se puede editar sin saber código

Todo lo editable está junto, en el bloque `CONFIG` al final de `index.html`:

| Campo | Qué controla |
| --- | --- |
| `whatsapp` | Número que recibe las confirmaciones (con indicativo, sin `+`) |
| `mapas.ceremonia` / `mapas.recepcion` | Los dos enlaces de Google Maps |
| `esperaMusica` | Milisegundos antes de que arranque la canción |
| `volumenMusica` | Volumen, de 0 a 1 |

### Cómo cambiar el volumen

Abre `index.html`, busca `volumenMusica` cerca del final y cambia el número:

```js
volumenMusica: 0.05,   // 0 = mudo · 1 = máximo
```

Referencia rápida: `0.03` apenas se insinúa · `0.05` es el valor actual ·
`0.10` se nota · `0.20` ya es música de fondo clara. Guarda, recarga la
página y listo.

**Por qué hacía falta Web Audio.** El iPhone ignora por completo
`audio.volume` — ahí esa propiedad es de solo lectura y el volumen solo lo
manda el botón físico del teléfono. Por eso la canción sonaba fuerte por más
que se bajara el número. La tarjeta enruta la canción por un nodo de
ganancia de Web Audio, que sí responde en iOS.

Los textos (nombres, fecha, horas, la frase del centro) están en el HTML, en
español y sin tecnicismos alrededor.

## Despliegue

Railway, con `npm start`. El puerto lo inyecta el hosting por la variable
`PORT`; en local cae a 3100.
