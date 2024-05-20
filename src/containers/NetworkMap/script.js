var data, index = 0, tabla, combo = "0", uplines = [], minimisado = "";
sendDataAjax();
$("#btnFiltro").click(function (e) {
    minimisado = "";
    sendDataAjax();
});

$.ajax({
    type: "POST",
    url: "MapaDeRed.aspx/ListaPeriodos",
    data: "{}",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    async: false,
    success: function (result) {
        $("#cboPeriodo").empty();
        $("#cboPeriodo").append("<option value='0'>Seleccione periodo</option>");
        $.each(result.d, function (key, value) {
            $("#cboPeriodo").append($("<option></option>").val(value.idPeriodo).html(value.nombre));
        });
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert(textStatus + ": " + XMLHttpRequest.responseText);
    }
});

function sendDataAjax() {
    var idperiodo = $('#cboPeriodo').val();
    if (idperiodo == null) {
        idperiodo = 0;
    }
    var obj = JSON.stringify({
        idPeriodoS: idperiodo
    });
    $.ajax({
        type: "POST",
        url: "MapaRedSocios.aspx/ListarEstructuraPropio",
        data: obj,
        contentType: 'application/json; charset=utf-8',
        error: function (xhr, ajaxOptions, throwError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        },
        success: function (data) {
            $('#TS').text(data.d[0].TOTALSOCIOS);
            $('#AS').text(data.d[0].ACTIVOS_SOCIOS);
            $('#NS').text(data.d[0].NUEVOS_SOCIOS);
            $('#IS').text(data.d[0].INACTIVOS_SOCIOS);
            addRowDT(data.d);
        }
    });
}

function addRowDT(obj) {
    $("#tbl_red tbody tr").remove();
    var d = '';
    for (var i = 0; i < obj.length; i++) {
        var display = "", color = "";
        if (obj[i].RED == "0") {
            display = "display:none;";
        }
        if (parseFloat(obj[i].PP) < 30) {
            color = "color: red;";
        }
        var DatosArray = {};
        DatosArray['idSocio'] = obj[i].IDSOCIO;
        DatosArray['idUpline'] = obj[i].IDUPLINE;
        uplines.push(DatosArray);
        d += '<tr id="tr' + obj[i].IDSOCIO + '" style="' + color + '">' +
            '<td style="text-align: left;">' + '<button style="outline: none; box-shadow: none" id="btn' + obj[i].IDSOCIO + '" style="' + display + '" value="red" type="button" title="red" class="btn style-button-red btn-redU"><label style="cursor: pointer;" id="sig' + obj[i].IDSOCIO + '"/></button>&nbsp;<label id="lbl' + obj[i].IDSOCIO + '">0</label>' + '</td>' +
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
            '<td style ="display:none;">' + obj[i].IDUPLINE + '</td>' +
            '</tr>';
    }
    $("#tbl_red").append(d);
    $('#sig' + obj[0].IDSOCIO + '').text("▼");
}

//FUNCIONES PARA RED
$(document).on('click', '.btn-redU', function (e) {
    e.preventDefault();
    
    var row = $(this).parent().parent()[0];
    index = $(this).parent().parent().index();
    var idSocio = row.cells[14].innerHTML;
    var BtnTexto = $('#sig' + idSocio + '').text();
    //$('#btn' + idSocio + '').hide();
    if (BtnTexto == "▼") {
        if (minimisado != idSocio) {
            $('#sig' + idSocio + '').text("▲");
            $('#lbl' + idSocio + '').val("0");
            //var element = document.getElementById("tr" + idSocio + "");
            //element.classList.add("treegrid-" + idSocio + "");
            IncrementaRed(idSocio);
        } else {
            $('#sig' + idSocio + '').text("▲");
            var showArray = ObtenerArrayUpline(idSocio);
            for (var i = 0; i < showArray.length; i++) {
                $('#tr' + showArray[i].idSocio + '').show();
                $('#sig' + showArray[i].idSocio + '').text("▼");
            }
            //$('.' + idSocio + '').show();
            //for (var i = 0; i < myArray.length; i++) {
            //    $('#tr' + myArray[i].idSocio + '').show();
            //}
        }
    } else {
        $('#sig' + idSocio + '').text("▼");
        $('.' + idSocio + '').hide();
        minimisado = idSocio;
        //for (var i = 0; i < myArray.length; i++) {
        //    if (myArray[i].idUpline == idSocio) {
        //        $('#tr' + myArray[i].idSocio + '').hide();
        //    }
        //    minimisado = idSocio;
        //}
    }
});

function IncrementaRed(idcliente) {

    var idperiodo = $('#cboPeriodo').val();
    if (idperiodo == null) {
        idperiodo = 0;
    }
    var obj = JSON.stringify({
        idClienteS: idcliente, idPeriodoS: idperiodo
    });
    $.ajax({
        type: "POST",
        url: "MapaRedSocios.aspx/ListarEstructuraRed",
        data: obj,
        contentType: 'application/json; charset=utf-8',
        error: function (xhr, ajaxOptions, throwError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        },
        success: function (data) {
            addRowDTRed(data.d);
        }
    });
}

function addRowDTRed(obj) {
    var d = '', linea = 0, myArray = [];
    for (var i = 0; i < obj.length; i++) {
        var display = "", style = "", color = "";
        linea = parseInt($('#lbl' + obj[i].IDUPLINE + '').text()) + 1;
        if (obj[i].RED == "0") {
            display = "display:none;";
            style = " margin-left:12.84px;";
        } else {
            display = "margin-left: -9px;outline: none;box-shadow: none;";
        }
        if (parseFloat(obj[i].PP) < 30) {
            color = "color: red;";
        }
        d += '<tr id="tr' + obj[i].IDSOCIO + '" style="'+color+'">' +
            '<td style="text-align: left;">' + '<button id="btn' + obj[i].IDSOCIO + '" style="' + display + '" value="red" type="button" title="red" class="btn btn-ft style-button-red btn-redU"><label style="cursor: pointer" id="sig' + obj[i].IDSOCIO + '"/></button>&nbsp;<label style="' + style + '" id="lbl' + obj[i].IDSOCIO + '">' + linea + '</label>' + '</td>' +
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
            '<td style ="display:none;">' + obj[i].IDUPLINE + '</td>' +
            '</tr>';
        var DatosArray = {};
        DatosArray['idSocio'] = obj[i].IDSOCIO;
        DatosArray['idUpline'] = obj[i].IDUPLINE;
        myArray.push(DatosArray);
        uplines.push(DatosArray);
    }

    $('#tbl_red > tbody > tr').eq(index).after(d);
    var upline = obj[0].IDUPLINE, bucle = [];

    while (upline != "") {
        var Datos = {};
        Datos['id'] = upline;
        bucle.push(Datos);
        upline = ObtenerUpline(upline);
    }
    
    for (var i = 0; i < myArray.length; i++) {
        $('#sig' + myArray[i].idSocio + '').text("▼");
        var element = document.getElementById("tr" + myArray[i].idSocio + "");
        element.classList.add(myArray[i].idUpline);
        //element.classList.add("treegrid-" + myArray[i].idSocio + "");
        for (var d = 0; d < bucle.length; d++) {
            element.classList.add(bucle[d].id);
            //element.classList.add("treegrid-" + myArray[i].idSocio + "");
        }
    }

    //$('.tree').treegrid({
    //    expanderExpandedClass: 'glyphicon glyphicon-minus',
    //    expanderCollapsedClass: 'glyphicon glyphicon-plus',
    //    'saveState': true,
    //    'saveStateMethod': 'cookie',
    //    'saveStateName': 'tree-grid-state'
    //});
    
}

function ObtenerUpline(dato) {
    var upline = uplines.filter(function (e) {
        return e.idSocio == dato;
    });
    if (upline.length == 0) { return ""; }
    return upline[0].idUpline;
}

function ObtenerArrayUpline(dato) {
    var upline = uplines.filter(function (e) {
        return e.idUpline == dato;
    });
    return upline;
}