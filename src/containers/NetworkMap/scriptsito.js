// Obtener el elemento donde quieres agregar el contenido
var table = document.getElementById('tbl_red');

// Crear un nuevo elemento tbody
var tbody = document.createElement('tbody');

// Iterar sobre el array de objetos obj
for (var i = 0; i < obj.length; i++) {
    var tr = document.createElement('tr');
    tr.id = 'tr' + obj[i].IDSOCIO;
    tr.style = color;

    tr.innerHTML = '<td style="text-align: left;">' +
        '<button style="outline: none; box-shadow: none" id="btn' + obj[i].IDSOCIO + '" style="' + display + '" value="red" type="button" title="red" class="btn style-button-red btn-redU"><label style="cursor: pointer;" id="sig' + obj[i].IDSOCIO + '"/></button>&nbsp;<label id="lbl' + obj[i].IDSOCIO + '">0</label>' +
        '</td>' +
        '<td>' + obj[i].USUARIO + '</td>' +
        '<td>' + obj[i].NOMBRES + '</td>' +
        '<td style ="display:none;">' + obj[i].CORAZONES + '</td>' +
        '<td>' + obj[i].PP + '</td>' +
        '<td>' + obj[i].VIP + '</td>' +
        '<td>' + obj[i].VP_REAL + '</td>' +
        '<td>' + obj[i].VP + '</td>' +
        //'<td>' + obj[i].VR + '</td>' +
        '<td>' + obj[i].VG + '</td>' +
        '<td>' + obj[i].VQ + '</td>' +
        '<td>' + obj[i].Rango + '</td>' +
        '<td>' + obj[i].MAXIMORANGO + '</td>' +
        //'<td>' + obj[i].Fecha + '</td>' +
        '<td>' + obj[i].Telefono + '</td>' +
        '<td>' + obj[i].Pais + '</td>' +
        '<td style ="display:none;">' + obj[i].IDSOCIO + '</td>' +
        '<td style ="display:none;">' + obj[i].IDUPLINE + '</td>';

    tbody.appendChild(tr);
}

// Agregar el tbody a la tabla
table.appendChild(tbody);