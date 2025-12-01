interface Props {
  title: string
  description?: string
  classNames?: string
}

export const PageTopTitle = ({ title, description, classNames = "" }: Props) => {
  return (
    <div className={classNames}>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  )
}
