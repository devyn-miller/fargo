interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold mb-2 text-primary">{title}</h1>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  )
}

