import styled from 'styled-components'

export const Box = styled.div`
  width: 100%;
  //max-width: 1300px;
  height: 100%;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", sans-serif;
`

export const TabHeader = styled.div`
  display: flex;
  background-color: #e5e5e5;
  border-bottom: 1px solid #ccc;
`

export const Tab = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: 12px 16px;
  background: ${({ active }) => (active
? '#ffffff'
: '#e5e5e5')};
  color: ${({ active }) => (active
? '#222'
: '#666')};
  font-weight: ${({ active }) => (active
? 'bold'
: 'normal')};
  border: none;
  border-bottom: ${({ active }) => (active
? '4px solid #374151'
: 'none')};
  cursor: pointer;
  font-size: 15px;
  transition: 0.2s ease-in-out;

  &:hover {
    background: ${({ active }) => (active
? '#fff'
: '#dcdcdc')};
  }
`

export const TabContent = styled.div`
  padding: 24px;
  background: #fff;
  height: calc(100% - 50px);
  overflow-y: auto;
`
