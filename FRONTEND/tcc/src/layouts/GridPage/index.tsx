import Header from '../../Components/Header'
import { Menu } from '../../Components/Menu'
import { Aside, GridLayout, HeaderComponent, MenuContainer, ContentLayout } from './styles'
export function GridComponents() {
  return (
    <GridLayout>
      <HeaderComponent><Header /></HeaderComponent>
      <MenuContainer><Menu /></MenuContainer>
      <Aside>
        <ContentLayout />
      </Aside>

    </GridLayout>
  )
}
