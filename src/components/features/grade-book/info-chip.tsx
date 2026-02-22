interface Props {
  icon: React.ReactNode
  label: string
  value: string
}

export const InfoChip = ({ icon, label, value }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center size-7 rounded-md bg-primary/8 text-primary shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium leading-none">{label}</p>
        <p className="text-sm font-medium text-card-foreground truncate max-w-[200px]">{value}</p>
      </div>
    </div>
  )
}
