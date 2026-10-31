/**
 * Recibe las confirmaciones de la tarjeta y las escribe en esta hoja.
 *
 * Cómo se instala (una sola vez, cinco minutos):
 *
 *  1. Crea una hoja nueva en sheets.google.com y ponle el nombre que quieras.
 *  2. Arriba, menú  Extensiones → Apps Script.
 *  3. Borra lo que aparezca y pega TODO este archivo. Guarda (el disquete).
 *  4. Botón azul  Implementar → Nueva implementación.
 *       Tipo:            Aplicación web   (la ruedita, "Web app")
 *       Ejecutar como:   Yo
 *       Quién accede:    Cualquier usuario        ← importante
 *     Implementar. Google pide permiso la primera vez: Revisar permisos,
 *     elige tu cuenta, "Configuración avanzada", "Ir a (sin título)" y Permitir.
 *  5. Copia la dirección que te da (termina en /exec) y pégala en index.html,
 *     en CONFIG.hojaConfirmaciones.
 *
 * Si después cambias algo aquí, hay que volver a Implementar → Administrar
 * implementaciones → el lápiz → Versión: Nueva, para que tome los cambios.
 */

const HOJA = 'Confirmaciones';

function doPost(e) {
  const datos = (e && e.parameter) || {};
  const hoja = preparar();

  hoja.appendRow([
    new Date(),
    datos.nombre || '',
    datos.plato || '',
    datos.mensaje || '',
  ]);

  // Avísame por correo de cada confirmación: quita las dos barras de la
  // línea de abajo y escribe tu correo entre comillas.
  // MailApp.sendEmail('tucorreo@gmail.com', 'Confirmó ' + (datos.nombre || ''),
  //   (datos.plato || '') + '\n\n' + (datos.mensaje || ''));

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Abrir la dirección /exec en el navegador muestra esto: sirve de prueba. */
function doGet() {
  preparar();
  return ContentService.createTextOutput(
    'La hoja está lista para recibir confirmaciones.'
  );
}

/** Crea la pestaña y los títulos la primera vez. */
function preparar() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(HOJA) || libro.insertSheet(HOJA);

  if (hoja.getLastRow() === 0) {
    hoja.appendRow(['Fecha', 'Nombre', 'Plato', 'Mensaje para los novios']);
    hoja.getRange('A1:D1').setFontWeight('bold');
    hoja.setFrozenRows(1);
    hoja.setColumnWidth(1, 150);
    hoja.setColumnWidth(2, 200);
    hoja.setColumnWidth(3, 120);
    hoja.setColumnWidth(4, 420);
  }
  return hoja;
}
