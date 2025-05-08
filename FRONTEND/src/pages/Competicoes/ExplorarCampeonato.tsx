import { useParams } from 'react-router-dom'
import { TabsBox } from '../../Components/TabBox/TabBox'
import { TabelaPartidas } from './TabelaPartidas'
import { EquipesCompeticao } from './EquipesCompeticao'
import Estatisticas from './Estatisticas'
import Classificacao from './Classificacao'
import Artilharia from './Artilharia'
import Assistencia from './Assistencia'
export function ExplorarCampeonato() {
  const { id } = useParams()
  console.log(id)
  return (
    <>

      <TabsBox
        key="1" tabs={
        [
          {
            label: 'Tabela/Partidas',
            content: <TabelaPartidas id={id} />,
          },
          {
            label: 'Classificação',
            content: <Classificacao id={id} />,
          },
          {
            label: 'Artilharia',
            content: <Artilharia id={id} />,
          },
          {
            label: 'Assistência',
            content: <Assistencia id={id} />,
          },
          {
            label: 'Equipes',
            content: <EquipesCompeticao id={id} />,
          },
          {
            label: 'Estatísticas',
            content: <Estatisticas id={id} />,
          },
        ]
    }
      />
    </>

  )
}
