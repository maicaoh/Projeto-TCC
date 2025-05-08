import { ThemeProvider } from 'styled-components'
import { defaultTheme } from './styles/themes/default'
import { GlobalStyle } from './@types/global'
import { Router } from './Router'
import { BrowserRouter } from 'react-router-dom'
import { TreinadorProvider }
  from './context/TreinadoresContext/TreinadorProvider'
import { EquipeProvider } from './context/EquipeContext/EquipeProvider'
import { JogadorProvider } from './context/JogadorContext/JogadorProvider'
import { QuadraProvider } from './context/QuadraContext/QuadraProvider'
import { ArbitroProvider } from './context/ArbitroContext/ArbitroProvider'
import { CompeticaoProvider } from './context/CompeticaoContext/CompeticaoProvider'
import { PartidaProvider } from './context/PartidaContext/PartidaProvider'
import { GolProvider } from './context/GolContext/GolProvider'
import { FinalizacaoProvider } from './context/FinalizacaoContext/FinalizacaoProvider'
import { DribleProvider } from './context/DribleContext/DribleProvider'
import { DesarmeProvider } from './context/DesarmeContext/DesarmeProvider'
import { FaltaProvider } from './context/FaltaContext/FaltaProvider'
import { CartaoProvider } from './context/CartaoContext/CartaoProvider'
import { TorneioProvider } from './context/EstatisticaTorneioContext/EstatisticaTorneioProvider'
import { EstatisticasGeraisProvider } from './context/EstatisticaGeralContext/EstatisticaGeralProvider'
export function App() {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <BrowserRouter>
          <TreinadorProvider>
            <EquipeProvider>
              <JogadorProvider>
                <QuadraProvider>
                  <ArbitroProvider>
                    <EquipeProvider>
                      <CompeticaoProvider>
                        <PartidaProvider>
                          <GolProvider>
                            <FinalizacaoProvider>
                              <DribleProvider>
                                <DesarmeProvider>
                                  <FaltaProvider>
                                    <CartaoProvider>
                                      <TorneioProvider>
                                        <EstatisticasGeraisProvider>
                                          <Router />
                                        </EstatisticasGeraisProvider>
                                      </TorneioProvider>
                                    </CartaoProvider>
                                  </FaltaProvider>
                                </DesarmeProvider>
                              </DribleProvider>
                            </FinalizacaoProvider>
                          </GolProvider>

                        </PartidaProvider>
                      </CompeticaoProvider>
                    </EquipeProvider>
                  </ArbitroProvider>
                </QuadraProvider>
              </JogadorProvider>
            </EquipeProvider>
          </TreinadorProvider>
        </BrowserRouter>
        <GlobalStyle />
      </ThemeProvider>

    </>
  )
}
