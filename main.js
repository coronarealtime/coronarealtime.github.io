
function round(number, precision) {
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor;
}

function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var min = arr[0];
    var minIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }

    return minIndex;
}

function exponential_rms(data) {
   const sum = [0, 0, 0, 0, 0, 0];
   const precision = 3;

   for (let n = 0; n < data.length; n++) {
     if (data[n][1] !== null) {
       sum[0] += data[n][0];
       sum[1] += data[n][1];
       sum[2] += data[n][0] * data[n][0] * data[n][1];
       sum[3] += data[n][1] * Math.log(data[n][1]);
       sum[4] += data[n][0] * data[n][1] * Math.log(data[n][1]);
       sum[5] += data[n][0] * data[n][1];
     }
   }

   const denominator = ((sum[1] * sum[2]) - (sum[5] * sum[5]));
   const a = Math.exp(((sum[2] * sum[3]) - (sum[5] * sum[4])) / denominator);
   const b = ((sum[1] * sum[4]) - (sum[5] * sum[3])) / denominator;

   return {
     A: round(a, precision),
     B: round(b, precision)
   };
 }

 function logarithmic_rms(data) {
     const sum = [0, 0, 0, 0];
     const precision = 3;
     const len = data.length;

     for (let n = 0; n < len; n++) {
       if (data[n][1] !== null) {
         sum[0] += Math.log(data[n][0]);
         sum[1] += data[n][1] * Math.log(data[n][0]);
         sum[2] += data[n][1];
         sum[3] += (Math.log(data[n][0]) ** 2);
       }
     }

     const a = ((len * sum[1]) - (sum[2] * sum[0])) / ((len * sum[3]) - (sum[0] * sum[0]));
     const coeffB = round(a, precision);
     const coeffA = round((sum[2] - (coeffB * sum[0])) / len, precision);
     return {
       A: coeffA,
       B: coeffB
     }
   }

   function linear_rms(data) {
       const sum = [0, 0, 0, 0, 0];
       let len = 0;
       const precision = 3;

       for (let n = 0; n < data.length; n++) {
         if (data[n][1] !== null) {
           len++;
           sum[0] += data[n][0];
           sum[1] += data[n][1];
           sum[2] += data[n][0] * data[n][0];
           sum[3] += data[n][0] * data[n][1];
           sum[4] += data[n][1] * data[n][1];
         }
       }

       const run = ((len * sum[2]) - (sum[0] * sum[0]));
       const rise = ((len * sum[3]) - (sum[0] * sum[1]));
       const gradient = run === 0 ? 0 : round(rise / run, precision);
       const intercept = round((sum[1] / len) - ((gradient * sum[0]) / len), precision);

       return {
         A: gradient,
         B: intercept
       };
     }
 function estimate_exp(data, days)
  {
      mydata = [];
      for(let i=0; i<data.length; i++){
        mydata.push([i, data[i]]);
      }
      coeffs = exponential_rms(mydata);
      estimated = coeffs.A * Math.exp(coeffs.B * (data.length - 1 + days) );
      return round(estimated, 0);
  }

  function estimate_log(data, days)
  {
      mydata = [];
      for(let i=0; i < data.length; i++)
      {
        mydata.push([i+1, data[i]]);
      }
      coeffs = logarithmic_rms(mydata);
      estimated = coeffs.A + coeffs.B*Math.log(data.length + days +1);
      return round(estimated, 0)
  }

  function estimate_lin(data, days)
  {
    mydata = [];
    for(let i=0; i<data.length; i++){
      mydata.push([i, data[i]]);
    }
    coeffs = linear_rms(mydata);
    estimated = coeffs.A * (data.length-1+days) + coeffs.B;
    return round(estimated, 0);
  }

  function estimate_select(data, days, type)
  {
    if(type == 0)
    {
      return estimate_exp(data, days);
    }
    else if(type == 1)
    {
      return estimate_lin(data, days);
    }
    else if(type == 2)
    {
      return estimate_log(data, days);
    }
  }


function get_multipliers(numeric_array)
{
    res = new Array();
    nonzero = 0;
    for(i=1; i<numeric_array.length; i++)
    {
      if(numeric_array[i-1] == 0)
      {
        nonzero++;
      }
      if(numeric_array[i-1] > 0)
      {
        res.push(numeric_array[i]/numeric_array[i-1]);
      }
    }

    return {mult: res, base: numeric_array[nonzero]};
}

function rotate(array, positions)
{
  if(positions > 0)
  {
    sum = array.slice(0, 10).reduce((a,b) => a+b, 0);
    avg = sum / 10;
    prefix = Array();
    for(i=0;i<positions;i++)
    {
      prefix.push(avg);
    }
    return prefix.concat(array.slice(0, -positions));
  }
  else if(positions < 0)
  {
    sum = array.slice(-10).reduce((a,b) => a+b, 0);
    avg = sum / 10;
    suffix = Array();
    for(i=0;i<-positions;i++)
    {
      suffix.push(avg);
    }
    return array.slice(-positions).concat(suffix);
  }
  else
  {
    return array
  }
}

function get_new_array(array, positions)
{
  mult_obj = get_multipliers(array);
  new_array = rotate(mult_obj.mult, positions);

  result = Array();
  result.push(mult_obj.base);
  for(i=0; i<new_array.length; i++)
  {
    result.push(result[result.length-1]*new_array[i]);
  }

  for(i=0; i<result.length; i++)
  {
    result[i] = round(result[i], 0);
  }

  return result;
}


var fechas = ["2020-02-25", "2020-02-26", "2020-02-27", "2020-02-28", "2020-02-29", "2020-03-01", "2020-03-02",
              "2020-03-03", "2020-03-04", "2020-03-05", "2020-03-06", "2020-03-07", "2020-03-08", "2020-03-09",
              "2020-03-10", "2020-03-11", "2020-03-12", "2020-03-13", "2020-03-14", "2020-03-15", "2020-03-16",
              "2020-03-17", "2020-03-18", "2020-03-19", "2020-03-20", "2020-03-21", "2020-03-22", "2020-03-23",
              "2020-03-24", "2020-03-25", "2020-03-26", "2020-03-27", "2020-03-28", "2020-03-29", "2020-03-30", "2020-03-31",
              "2020-04-01", "2020-04-02", "2020-04-03", "2020-04-04", "2020-04-05", "2020-04-06", "2020-04-07",
              "2020-04-08", "2020-04-09", "2020-04-10", "2020-04-11", "2020-04-12", "2020-04-13", "2020-04-14",
              "2020-04-15", "2020-04-16", "2020-04-17", "2020-04-18", "2020-04-19", "2020-04-20", "2020-04-21",
              "2020-04-22", "2020-04-23", "2020-04-24", "2020-04-25", "2020-04-26", "2020-04-27", "2020-04-28",
              "2020-04-29", "2020-04-30",
              "2020-05-01", "2020-05-02", "2020-05-03", "2020-05-04", "2020-05-05", "2020-05-06", "2020-05-07",
              "2020-05-08", "2020-05-09", "2020-05-10", "2020-05-11", "2020-05-12", "2020-05-13", "2020-05-14"];
var contagios = [3,10,16,32,44,66,114,135,198,237,365,430,589,999,1622,2128,2950,
                 4209,5753,7753,9191,11178,13716,17147,19980,24926,28572,33089,39793,47610,56188,64059,72248,78797,85195,
                 94417,
                 102136, 110238,117710, 124736, 130759, 135032, 140510,
                 146690, 152446, 157022, 161852, 166019, 169496, 172541,
                 177633, 182816, 188068, 191726, 188579,	191164,	194516,	188508,	191389,	202990,	205905,	207634, 209465, 210773, 212917, 213435,
                 215216, 216582, 217466, 218011, 219329, 220325,221447, 222857, 223578, 224390, 227436, 228030, 228691, 229540];
var muertos = [0,0,0,0,0,0,0,0,0,3,5,8,17,17,35,47,84,
               120,136,288,309,491,598,767,1002,1326,1720,2182,2696,3434,4089,4858,5690,6528,7340,8189,
              9053,10003, 10935, 11744, 12418, 13055, 13798,
              14555, 15238, 15843, 16353, 16972, 17489, 18056,
              18579, 19130, 19478, 20043, 20453, 20852, 21282, 21717, 22157, 22524, 22902, 23190, 23521, 23822, 24275, 24543, 24824, 25100,
              25264, 25428, 25613, 25857, 26070, 26299, 26478, 26621, 26744, 26920, 27104, 27321];

var dt = new Date(fechas.slice(-1)[0]+"T19:00:00Z");
dt.setDate( dt.getDate() - 1 );
const milliseconds_a_day = 1000*3600*24;


ill = contagios.slice(-1)[0];
ill_exp = estimate_exp(contagios.slice(-6, -1), 1);
ill_lin = estimate_lin(contagios.slice(-6, -1), 1);
ill_log = estimate_log(contagios.slice(-6, -1), 1);

var ill_type = indexOfMin([Math.abs(ill_exp - ill),
                           Math.abs(ill_lin - ill),
                           Math.abs(ill_log - ill)]);

dead = muertos.slice(-1)[0];
dead_exp = estimate_exp(muertos.slice(-6, -1), 1);
dead_lin = estimate_lin(muertos.slice(-6, -1), 1);
dead_log = estimate_log(muertos.slice(-6, -1), 1);

var dead_type = indexOfMin([Math.abs(dead_exp - dead),
                            Math.abs(dead_lin - dead),
                            Math.abs(dead_log - dead)]);

var contagios_9M = get_new_array(contagios, -5);
var muertos_9M = get_new_array(muertos, -5);
var contagios_19M = get_new_array(contagios, 5);
var muertos_19M = get_new_array(muertos, 5);


var contagios_mult_obj = get_multipliers(contagios);
var muertos_mult_obj = get_multipliers(muertos);

var L = 100.0 * muertos_mult_obj.mult.reduce((a,b) => a*b, muertos_mult_obj.base) / contagios_mult_obj.mult.reduce((a,b) => a*b, contagios_mult_obj.base);


function refresh_counters()
{
    difference = Date.now()-dt;
    factor = difference/milliseconds_a_day;
    est_i = estimate_select(contagios.slice(-5), factor, ill_type);
    est_d = estimate_select(muertos.slice(-5), factor, dead_type);
    rate_i = estimate_select(contagios.slice(-5), factor+(1/24), ill_type) - est_i;
    rate_d = estimate_select(muertos.slice(-5), factor+(1/24), dead_type) - est_d;
    est_i_21 = estimate_select(contagios.slice(-6,-1), 1, ill_type);
    est_d_21 = estimate_select(muertos.slice(-6,-1), 1, dead_type);
    est_i_n21 = estimate_select(contagios.slice(-5), 1, ill_type);
    est_d_n21 = estimate_select(muertos.slice(-5), 1, dead_type);
    est_i_p7 = estimate_select(contagios.slice(-5), 8, ill_type);
    est_d_p7 = estimate_select(muertos.slice(-5), 8, dead_type);

    bounded_d_9M = estimate_select(muertos_9M.slice(-5), factor, dead_type);
    bounded_i_9M = round(bounded_d_9M/(L/100.0), 0);//estimate_select(contagios_9M.slice(-5), factor, ill_type);
    bounded_d_19M = estimate_select(muertos_19M.slice(-5), factor, dead_type);
    bounded_i_19M = round(bounded_d_19M/(L/100.0), 0);//estimate_select(contagios_19M.slice(-5), factor, ill_type);


    return {
        ill: contagios.slice(-1)[0],
        dead: muertos.slice(-1)[0],
        est_ill: est_i,
        est_dead: est_d,
        rate_ill: rate_i,
        rate_dead: rate_d,
        est_ill_21: est_i_21,
        est_dead_21: est_d_21,
        est_ill_n21: est_i_n21,
        est_dead_n21: est_d_n21,
        est_ill_p7: est_i_p7,
        est_dead_p7: est_d_p7,
        bound_ill_9M: bounded_i_9M,
        bound_dead_9M: bounded_d_9M,
        bound_ill_19M: bounded_i_19M,
        bound_dead_19M: bounded_d_19M
    };
}

function create_table_boundaries()
{
  header =`<tr><th>Fecha de confinamiento</th><th>Contagios</th><th>Víctimas mortales</th><th>Tasa de letalidad</th><th>Contagios (letalidad fija)</th><th>Víctimas (letalidad fija)</th></tr>`;
  misfechas = ["04-03-2020", "05-03-2020",
               "06-03-2020", "07-03-2020", "08-03-2020", "09-03-2020", "10-03-2020",
               "11-03-2020", "12-03-2020", "13-03-2020", "14-03-2020", "15-03-2020",
               "16-03-2020", "17-03-2020", "18-03-2020", "19-03-2020", "20-03-2020"];
  misrotaciones=[-10, -9,
                 -8, -7, -6, -5, -4,
                 -3, -2, -1, 0, 1,
                 2, 3, 4, 5, 6];

  body = "";
  //alert(estimate(contagios.slice(3, 8), 1));
  for(var i=0; i<misfechas.length; i++)
  {
    contagios_rot = rotate(contagios_mult_obj.mult, misrotaciones[i]);
    muertos_rot = rotate(muertos_mult_obj.mult, misrotaciones[i]);
    c = round(contagios_rot.reduce((a,b) => a*b, contagios_mult_obj.base),0);
    m = round(muertos_rot.reduce((a,b) => a*b, muertos_mult_obj.base),0);
    l = 100.0*m/c;
    c_L = round(m/(L/100.0), 0);
    m_L = round(c*(L/100), 0);

    prefixfecha = "<td>";
    prefix = "<td class='text-right'>";

    if (misrotaciones[i] == 0)
    {
      prefixfecha = "<td class='text-danger'>";
      prefix = "<td class='text-right text-danger'>";
    }
    else if(misfechas[i] == "09-03-2020" || misfechas[i] == "19-03-2020")
    {
      prefixfecha = "<td class='text-success'>";
      prefix = "<td class='text-right text-success'>";
    }

    prefix2 = prefix;
    if(misrotaciones[i] > 0)
    {
      prefix2 += "&gt;&nbsp;";
    }
    else if (misrotaciones[i] < 0)
    {
      prefix2 += "&lt;&nbsp;";
    }

    fila = "<tr>";
    fila += prefixfecha + misfechas[i] + "</td>";
    fila += prefix2 + c.toString() + "</td>";
    fila += prefix2 + m.toString() + "</td>";
    fila += prefix + round(l, 2).toString() + " %</td>";
    fila += prefix2 + c_L.toString() + "</td>";
    fila += prefix2 + m_L.toString() + "</td>";
    fila += "</tr>";
    body += fila;
  }

  table = "<table class='table'>";
  table += "<thead>" + header + "</thead>";
  table += "<tbody>" + body + "</tbody>";
  table += "</table>";

  return table;
}

function create_table_boundaries_abbrev()
{
  header =`<tr><th>Fecha de confinamiento</th><th>Contagios</th><th>Víctimas mortales</th></tr>`;
  misfechas = ["04-03-2020", "05-03-2020",
               "06-03-2020", "07-03-2020", "08-03-2020", "09-03-2020", "10-03-2020",
               "11-03-2020", "12-03-2020", "13-03-2020", "14-03-2020", "15-03-2020",
               "16-03-2020", "17-03-2020", "18-03-2020", "19-03-2020", "20-03-2020"];
  misrotaciones=[-10, -9,
                 -8, -7, -6, -5, -4,
                 -3, -2, -1, 0, 1,
                 2, 3, 4, 5, 6];

  body = "";
  //alert(estimate(contagios.slice(3, 8), 1));
  for(var i=0; i<misfechas.length; i++)
  {
    contagios_rot = rotate(contagios_mult_obj.mult, misrotaciones[i]);
    muertos_rot = rotate(muertos_mult_obj.mult, misrotaciones[i]);
    c = round(contagios_rot.reduce((a,b) => a*b, contagios_mult_obj.base),0);
    m = round(muertos_rot.reduce((a,b) => a*b, muertos_mult_obj.base),0);
    l = 100.0*m/c;
    c_L = round(m/(L/100.0), 0);
    m_L = round(c*(L/100), 0);

    prefixfecha = "<td>";
    prefix = "<td class=''>";

    if (misrotaciones[i] == 0)
    {
      prefixfecha = "<td class='text-danger'>";
      prefix = "<td class='text-danger'>";
    }
    else if(misfechas[i] == "09-03-2020" || misfechas[i] == "19-03-2020")
    {
      prefixfecha = "<td class='text-success'>";
      prefix = "<td class='text-success'>";
    }

    prefix2 = prefix;
    if(misrotaciones[i] > 0)
    {
      prefix2 += "&gt;&nbsp;";
    }
    else if (misrotaciones[i] < 0)
    {
      prefix2 += "&lt;&nbsp;";
    }

    fila = "<tr>";
    fila += prefixfecha + misfechas[i] + "</td>";
    fila += prefix2 + c_L.toString() + "</td>";
    fila += prefix2 + m.toString() + "</td>";
    fila += "</tr>";
    body += fila;
  }

  table = "<table class='table'>";
  table += "<thead>" + header + "</thead>";
  table += "<tbody>" + body + "</tbody>";
  table += "</table>";

  return table;
}

function create_table_param(rotulo, datos)
{
  header =`<tr><th>Fecha</th><th>${rotulo}</th><th>Estimación exponencial</th><th>Estimación lineal</th><th>Estimación logarítmica</th></tr>`;

  body = "";
  //alert(estimate(contagios.slice(3, 8), 1));
  for(var i=5; i<fechas.length; i++)
  {
    expe = estimate_exp(datos.slice(i-5, i), 1);
    line = estimate_lin(datos.slice(i-5, i), 1);
    loge = estimate_log(datos.slice(i-5, i), 1);

    expd = "";
    lind = "";
    logd = "";
    odd = "";

    if(isNaN(expe))
    {
      expe = "-";
      expd = "";
    }
    else if(expe == datos[i])
    {
      expd = "";
    }
    else if(expe > datos[i])
    {
      expd = ` (+${(expe - datos[i]).toString()})`;
    }
    else
    {
      expd = ` (${(expe - datos[i]).toString()})`;
    }

    if(isNaN(line))
    {
      line = "-";
      lind = "";
    }
    else if(line == datos[i])
    {
      lind = "";
    }
    else if(line > datos[i])
    {
      lind = ` (+${(line - datos[i]).toString()})`;
    }
    else
    {
      lind = ` (${(line - datos[i]).toString()})`;
    }

    if(isNaN(loge))
    {
      loge = "-";
      logd = "";
    }
    else if(loge == datos[i])
    {
      logd = "";
    }
    else if(loge > datos[i])
    {
      logd = ` (+${(loge - datos[i]).toString()})`;
    }
    else
    {
      logd = ` (${(loge - datos[i]).toString()})`;
    }

    if(i > 1)
    {
      if(datos[i-1] == 0)
      {
        odd = "";
      }
      else {
        odd = ` [${round(datos[i]/datos[i-1], 2).toString()}]`;
      }
    }

    fila = "<tr>";
    fila += "<td>" + fechas[i] + "</td>";
    fila += "<td>" + datos[i] + odd + "</td>";
    fila += "<td>" + expe.toString() + expd + "</td>";
    fila += "<td>" + line.toString() + lind + "</td>";
    fila += "<td>" + loge.toString() + logd + "</td>";
    fila += "</tr>";
    body += fila;
  }

  table = "<table class='table'>";
  table += "<thead>" + header + "</thead>";
  table += "<tbody>" + body + "</tbody>";
  table += "</table>";

  return table;
}



function display_results()
{
      counters = refresh_counters();
      if($("#estimated_dead").text() != counters.est_dead.toString())
      {
          $("#estimated_dead").text(counters.est_dead);
      }
      else
      {
          $("#estimated_dead").text(counters.est_dead);
      }

      if($("#estimated_ill").text() != counters.est_ill.toString())
      {
          $("#estimated_ill").text(counters.est_ill);
      }
      else
      {
          $("#estimated_ill").text(counters.est_ill);
      }

      $("#official_dead").text(counters.dead);
      $("#official_ill").text(counters.ill);


      datestring = ("0" + dt.getDate()).slice(-2) + "-" + ("0"+(dt.getMonth()+1)).slice(-2) + "-" +
    dt.getFullYear() + " " + ("0" + dt.getHours()).slice(-2) + ":" + ("0" + dt.getMinutes()).slice(-2);
      $("#official_date").text(datestring);
      nd = new Date();
      datestring2 = ("0" + nd.getHours()).slice(-2) + ":" + ("0" + nd.getMinutes()).slice(-2);
      datestring3 = ("0" + nd.getDate()).slice(-2) + "-" + ("0"+(nd.getMonth()+1)).slice(-2) + "-" +
    dt.getFullYear();

      $("#official_date").text(datestring);
      $("#current_date").text(datestring2);
      $("#current_daymonth").text(datestring3);

      $("#estimated_dead_21").text(counters.est_dead_21);
      $("#estimated_ill_21").text(counters.est_ill_21);
      $("#estimated_dead_n21").text(counters.est_dead_n21);
      $("#estimated_ill_n21").text(counters.est_ill_n21);
      $("#estimated_dead_p7").text(counters.est_dead_p7);
      $("#estimated_ill_p7").text(counters.est_ill_p7);
      $("#rate_ill").text(counters.rate_ill);
      $("#rate_dead").text(counters.rate_dead);
      $("#accuracy_ill").text(Math.min(round(100*counters.est_ill_21/counters.ill, 2),
                                       round(100*counters.ill/counters.est_ill_21, 2)).toString()+"%");
      $("#accuracy_dead").text(Math.min(round(100*counters.est_dead_21/counters.dead, 2),
                                        round(100*counters.dead/counters.est_dead_21, 2)).toString()+"%");

      $("#bound_ill_9M").text(counters.bound_ill_9M);
      $("#bound_dead_9M").text(counters.bound_dead_9M);
      $("#bound_ill_19M").text(round(counters.bound_ill_19M/1000, 0));
      $("#bound_dead_19M").text(round(counters.bound_dead_19M/1000, 0));
}

$( document ).ready(function() {
  if($("#estimated_dead_21").length != 0)
  {
    display_results();
    setInterval(display_results, 5000);
    setInterval('window.location.reload()', 600000);

    $("#scenarios").html(create_table_boundaries_abbrev());
  }
  else if($("#prediction_table_ill").length != 0)
  {
    $("#prediction_table_ill").html(create_table_param("Contagios", contagios));
    $("#prediction_table_dead").html(create_table_param("Víctimas mortales", muertos));
  }
  else
  {
    $("#boundaries_table").html(create_table_boundaries());
    $("#letalidad_14M").html(round(L, 2)+"&nbsp;%");
  }
});
