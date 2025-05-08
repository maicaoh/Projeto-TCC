import { Route, Routes } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout/index'
import { Treinadores } from './pages/Treinadores'
import { NewTreinador } from './pages/Treinadores/newTreinador'
import { Jogadores } from './pages/Jogadores'
import { NewJogador } from './pages/Jogadores/newJogador'
import { Quadras } from './pages/Quadra'
import { NewQuadra } from './pages/Quadra/newQuadra'
import { Arbitros } from './pages/Arbitro'
import { NewArbitro } from './pages/Arbitro/newArbitro'
import { Equipes } from './pages/Equipes'
import { NewEquipe } from './pages/Equipes/newEquipe'
import { Competicoes } from './pages/Competicoes'
import { NewCompeticao } from './pages/Competicoes/newCompeticao'
import { ExplorarCampeonato } from './pages/Competicoes/ExplorarCampeonato'
import AcoesPartida from './pages/Competicoes/AcoesPartida'
import Estatisticas from './pages/Estatistica/Estatisticas'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/tecnicos" element={<Treinadores />} />
        <Route path="/cadastrotecnico" element={<NewTreinador />} />
        <Route path="/editartecnico/:id" element={<NewTreinador />} />

        <Route path="/jogadores" element={<Jogadores />} />
        <Route path="/cadastrojogador" element={<NewJogador />} />
        <Route path="/editarjogador/:id" element={<NewJogador />} />

        <Route path="/quadras" element={<Quadras />} />
        <Route path="/cadastroquadra" element={<NewQuadra />} />
        <Route path="/editarquadra/:id" element={<NewQuadra />} />

        <Route path="/arbitros" element={<Arbitros />} />
        <Route path="/cadastroarbitro" element={<NewArbitro />} />
        <Route path="/editararbitro/:id" element={<NewArbitro />} />

        <Route path="/equipes" element={<Equipes />} />
        <Route path="/cadastroequipe" element={<NewEquipe />} />
        <Route path="/editarequipe/:id" element={<NewEquipe />} />

        <Route path="/competicoes" element={<Competicoes />} />
        <Route path="/cadastrarcompeticao" element={<NewCompeticao />} />
        <Route path="/editarcompeticao/:id" element={<NewCompeticao />} />

        <Route path="/explorarcampeonato/:id" element={<ExplorarCampeonato />} />
        <Route path="/acoespartida/:id" element={<AcoesPartida />} />

        <Route path="/estatisticas" element={<Estatisticas />} />

        {/* <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} /> */}
      </Route>
    </Routes>
  )
}
