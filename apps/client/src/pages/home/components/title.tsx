import React from 'react'

interface TitleProps {
  icon: React.ReactElement
  text: string
}

const Title: React.FC<TitleProps> = ({ icon, text }) => (
  <div className="flex items-center justify-center gap-2 mb-3 sticky top-0">
    {icon}
    <h1 className="text-xl font-bold">{text}</h1>
  </div>
)

export default Title
