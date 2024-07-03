import { autoclavesVapor } from './autoclavesVapor.mjs'
import { lavadoraTermodesinfectora } from './lavadoraTermodesinfectora.mjs'
import { marcasAutoclave } from './dados/autoclaves.mjs'
import { marcaLavadora } from './dados/lavadoraTermodesinfectoras.mjs'

const marcaTemMenosItens = (resultados, marca, quantidade) => {
  return resultados.filter(item => item.split(', ')[0] === marca).length < quantidade
}

const obterMenorValor = (resultados, marca) => {
  const itemsDaMarca = resultados.filter(item => item.split(', ')[0] === marca)
  return itemsDaMarca.reduce((a, b) => parseFloat(a.split(', ')[2]) < parseFloat(b.split(', ')[2]) ? a : b)
}

const atualizarResultados = (resultados, resultado, marca, maxItens) => {
  if (marcaTemMenosItens(resultados, marca, maxItens)) {
    resultados.push(resultado)
  } else {
    const menorValor = obterMenorValor(resultados, marca)
    const menorValorIndex = resultados.indexOf(menorValor)
    if (parseFloat(resultado.split(', ')[2]) > parseFloat(menorValor.split(', ')[2])) {
      resultados.splice(menorValorIndex, 1, resultado)
    }
  }
}

const marcasAutoclaves = (
  estimativaDeVolumeTotalDiarioLitros,
  cme,
  totalDeAutoclaves
) => {
  const autoClaves = marcasAutoclave()
  const resultados = []

  for (let i = 0 ; i < autoClaves.length; i++) {
    for (let j = 0 ; j < autoClaves[i].length; j++) {
      const autoClavesMarca = autoClaves[i][j].marca
      const autoClavesModelo = autoClaves[i][j].modelo
      const autoClavesVolumeTotalCamaraLitros = autoClaves[i][j].volumeTotalCamaraLitros
      const volumeUtilCamaraLitros = autoClaves[i][j].volumeUtilCamaraLitros
      const tempoTotalMedioCicloAltaTemperaturaMin = autoClaves[i][j].tempoTotalMedioCicloAltaTemperaturaMin
      const tempoProcedimentoDiarioAquecimentoMin = autoClaves[i][j].tempoProcedimentoDiarioAquecimentoMin

      const resultado = autoclavesVapor(
        estimativaDeVolumeTotalDiarioLitros,
        cme,
        totalDeAutoclaves,
        autoClavesMarca,
        autoClavesModelo,
        autoClavesVolumeTotalCamaraLitros,
        volumeUtilCamaraLitros,
        tempoTotalMedioCicloAltaTemperaturaMin,
        tempoProcedimentoDiarioAquecimentoMin
      )

      if (resultado !== undefined) {
        atualizarResultados(resultados, resultado, autoClavesMarca, 2)
      }
    }
  }

  return resultados
}


const marcasLavadoraTermodesinfectora = (
  estimativaDeVolumeTotalDiarioPorMaterial,
  cirurgiasPorDia,
  leitoUTI,
  totalDeLavadorasTermo
) => {

  const lavadoraTermodes =  marcaLavadora()
  const resultados = []

  for (let i = 0 ; i < lavadoraTermodes.length; i++) {
    for (let j = 0 ; j < lavadoraTermodes[i].length; j++) {
      const lavadoraTermodesinfectoraMarca = lavadoraTermodes[i][j].marca
      const lavadoraTermodesinfectoraModelo = lavadoraTermodes[i][j].modelo
      const lavadoraTermodesinfectoraVolumeTotalCamaraLitros = lavadoraTermodes[i][j].volumeTotalCamaraLitros
      const capacidadeCargaBandejasInstrumentos = lavadoraTermodes[i][j].capacidadeCargaBandejasInstrumentos
      const capacidadeCargaTraqueias = lavadoraTermodes[i][j].capacidadeCargaTraqueias
      const tempoMedioCicloInstrumentosCargaMaximaMin = lavadoraTermodes[i][j].tempoMedioCicloInstrumentosCargaMaximaMin
      const tempoMedioCicloAssistenciaVentilatoriaCargaMaximaMin = lavadoraTermodes[i][j].tempoMedioCicloAssistenciaVentilatoriaCargaMaximaMin

      const resultado = lavadoraTermodesinfectora(
        estimativaDeVolumeTotalDiarioPorMaterial,
        cirurgiasPorDia,
        leitoUTI,
        totalDeLavadorasTermo,
        lavadoraTermodesinfectoraMarca,
        lavadoraTermodesinfectoraModelo,
        lavadoraTermodesinfectoraVolumeTotalCamaraLitros,
        capacidadeCargaBandejasInstrumentos,
        capacidadeCargaTraqueias,
        tempoMedioCicloInstrumentosCargaMaximaMin,
        tempoMedioCicloAssistenciaVentilatoriaCargaMaximaMin
      )

      if (resultado !== undefined) {
        atualizarResultados(resultados, resultado, lavadoraTermodesinfectoraMarca, 1)
      }
    }
  }

  return resultados
}


export { marcasAutoclaves, marcasLavadoraTermodesinfectora }
