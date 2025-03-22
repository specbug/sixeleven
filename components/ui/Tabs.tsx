"use client"

import React, { useState } from "react"

interface TabProps {
  label: string
  children: React.ReactNode
}

export function Tab({ children }: TabProps) {
  return <div>{children}</div>
}

interface TabsProps {
  children: React.ReactNode
}

// Make tabs more responsive
export function Tabs({ children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0)

  // Extract tabs from children
  const tabs = React.Children.toArray(children)
    .filter((child) => React.isValidElement(child) && child.type === Tab)
    .map((child) => (React.isValidElement(child) ? child : null))

  const tabLabels = tabs.map((tab) => (React.isValidElement(tab) ? tab.props.label : ""))

  return (
    <div className="tabs">
      <div className="tab-list flex flex-wrap">
        {tabLabels.map((label, index) => (
          <button
            key={index}
            className={`tab-button flex-grow sm:flex-grow-0 ${index === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="tab-content">{tabs[activeTab]}</div>
    </div>
  )
}

