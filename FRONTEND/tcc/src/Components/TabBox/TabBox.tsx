import React, { useState } from 'react'
import { Box, Tab, TabContent, TabHeader } from './TabBoxStyles'

type TabItem = {
  label: string;
  content: React.ReactNode;
}

  type TabsBoxProps = {
    tabs: TabItem[];
  }

export const TabsBox: React.FC<TabsBoxProps> = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!tabs || tabs.length === 0) return <div>Nenhuma aba disponível.</div>

  return (
    <Box>
      <TabHeader>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            active={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabHeader>
      <TabContent>{tabs[activeIndex].content}</TabContent>
    </Box>
  )
}
